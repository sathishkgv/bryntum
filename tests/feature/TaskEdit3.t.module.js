
StartTest(t => {

    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('#8225 Exception when opening task editor right during new task name inputing with STM autorecording on', t => {

        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip : false
            }
        });

        let task;

        const stm = gantt.project.getStm();

        stm.disabled = false;
        stm.autoRecord = true;

        t.chain(
            next => {
                task = gantt.addTaskBelow(gantt.taskStore.last).then(t => {
                    task = t;
                    next();
                });
            },

            next => {
                gantt.startEditing({ field : 'name', record : task });
                next();
            },

            { type : 'zzzz' },

            next => {
                t.livesOk(() => {
                    gantt.editTask(task);
                }, 'Editor loaded just created task w/o exception');
            }
        );
    });
});
