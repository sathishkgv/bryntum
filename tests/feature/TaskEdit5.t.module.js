
StartTest(t => {

    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('#8247 TaskEditor cancel should not leave undoable transaction in the STM', async t => {

        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip : false
            }
        });

        const investigateTask = gantt.project.taskStore.getById(11);

        const [maximResource] = gantt.project.resourceStore.add({
            name : 'Maxim'
        });

        await investigateTask.assign(maximResource);

        const stm = gantt.project.getStm();

        stm.disabled = false;
        stm.autoRecord = true;

        t.chain(
            (next) => {
                gantt.editTask(investigateTask);
                next();
            },

            { waitForSelector : '.b-popup.b-taskeditor' },

            { click : '.b-tabpanel-tab-title:contains(Resources)' },

            { click : '.b-resourcestab .b-grid-cell:contains(Maxim)' },

            { click : '.b-resourcestab .b-remove-button' },

            { click : '.b-button:contains(Cancel)' },

            { waitForPropagate : gantt },

            (next) => {
                t.notOk(stm.canUndo, 'Canceling haven\'t created any unneeded undo actions');
                t.notOk(stm.canRedo, 'Canceling haven\'t created any unneeded redo actions');
            }
        );
    });

    t.it('#8247 TaskEditor cancel should not change undo/redo queue', async t => {

        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip : false
            }
        });

        const investigateTask = gantt.project.taskStore.getById(11);

        const [maximResource] = gantt.project.resourceStore.add({
            name : 'Maxim'
        });

        await investigateTask.assign(maximResource);

        const stm = gantt.project.getStm();

        stm.disabled = false;
        stm.autoRecord = true;

        t.chain(
            async(next) => {
                await investigateTask.setStartDate(new Date(investigateTask.getStartDate().getTime() + 1000 * 60 * 60 * 24));
            },

            // STM is async, need to wait a bit for action to get into queue
            { waitFor : 200 },

            async(next) => {
                await investigateTask.setStartDate(new Date(investigateTask.getStartDate().getTime() + 1000 * 60 * 60 * 24));
            },

            { waitFor : 200 },

            async(next) => {
                await investigateTask.setStartDate(new Date(investigateTask.getStartDate().getTime() + 1000 * 60 * 60 * 24));
            },

            { waitFor : 200 },

            (next) => {
                stm.undo();
                stm.undo();
                
                gantt.editTask(investigateTask);
                next();
            },

            { waitForSelector : '.b-popup.b-taskeditor' },

            { click : '.b-tabpanel-tab-title:contains(Resources)' },

            { click : '.b-resourcestab .b-grid-cell:contains(Maxim)' },

            { click : '.b-resourcestab .b-remove-button' },

            { click : '.b-button:contains(Cancel)' },

            { waitForSelectorNotFound : 'b-taskeditor-editing' },
    
            { waitFor : () => stm.canUndo },

            (next) => {
                t.ok(stm.canUndo, 'Canceling haven\'t changed undo availability');
                t.ok(stm.canRedo, 'Canceling haven\'t changed redo availability');
                t.is(stm.position, 1, 'Canceling haven\'t changed STM position');
                t.is(stm.length, 3, 'Canceling haven\'t changed STM queue length');
            }
        );
    });
});
