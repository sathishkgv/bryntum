
StartTest(t => {

    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('#8231 TaskEditor cancel should not lead to just added record removal', t => {

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

            (next) => {
                gantt.editTask(task);
                next();
            },

            { waitForSelector : '.b-popup.b-taskeditor' },

            { click : '.b-button:contains(Cancel)' },

            { waitForPropagate : gantt },

            (next) => {
                // Task.id here to avoid #8238
                t.ok(gantt.taskStore.includes(task.id), 'The task is in the store after the Task Editor Cancel');
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8276-crash-if-invoking-task-editor-for-unscheduled-task/details#
    t.it('should support editing an unscheduled task', async t => {
        gantt = t.getGantt({
            appendTo : document.body
        });

        const added = gantt.taskStore.rootNode.appendChild({ name : 'New task' });

        // run propagation to calculate new task fields
        await gantt.project.propagate();

        gantt.editTask(added);

        t.chain(
            { waitForSelector : '.b-gantt-taskeditor' }
        );
    });

    t.it('Should support configuring extra widgets for each tab', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                taskEdit : {
                    editorConfig : {
                        height       : '40em',
                        extraItems : {
                            generaltab      : [{ type : 'button', text : 'general' }],
                            successorstab   : [{ type : 'button', text : 'successors' }],
                            predecessorstab : [{ type : 'button', text : 'predecessors' }],
                            resourcestab    : [{ type : 'button', text : 'resources' }],
                            advancedtab     : [{ type : 'button', text : 'advanced' }],
                            notestab        : [{ type : 'button', text : 'notes' }]
                        }
                    }
                }
            }
        });

        const steps = [];

        ['general', 'successors', 'predecessors', 'resources', 'advanced', 'notes'].forEach((text, i) => {
            steps.push(
                { click : `.b-tabpanel-tab:nth-child(${i + 1})` },
                { waitForSelector : `.b-${text}tab .b-button:contains(${text})` }
            );
        });

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                gantt.editTask(gantt.taskStore.getById(11));
            },
            steps
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8785
    t.it('Should support configuring listeners', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                taskEdit : {
                    editorConfig : {
                        listeners : {
                            beforeClose : () => {}
                        }
                    }
                }
            }
        });

        const editor = gantt.features.taskEdit.getEditor();

        t.ok(editor.listeners.cancel, 'Cancel listener is present');
        t.ok(editor.listeners.delete, 'Delete listener is present');
        t.ok(editor.listeners.save, 'Save listener is present');
        t.ok(editor.listeners.requestPropagation, 'RequestPropagation listener is present');
        t.ok(editor.listeners.beforeClose, 'BeforeClose listener is present');
    });

    t.it('Should not allow to set end before start date', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            project  : t.getProject({
                calendar : 'general'
            })
        });

        let task = gantt.taskStore.getById(234);

        t.chain(
            { dblclick : '.b-gantt-task.id234' },

            { click : '.b-end-date .b-icon-angle-left' },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 1, 9).getTime() && task.duration === 0,
                desc    : 'End date changed, duration is 0'
            },

            { click : '.b-end-date .b-icon-angle-left' },

            { waitForPropagate : gantt },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 1, 9).getTime() && task.duration === 0,
                desc    : 'End date intact, duration is 0'
            },

            { type : '[DOWN][TOP][ENTER]' },

            { waitForPropagate : gantt },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 1, 9).getTime() && task.duration === 0,
                desc    : 'End date intact, duration is 0'
            },

            { click : '.b-end-date .b-icon-angle-right' },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 1, 10).getTime() && task.duration === 1,
                desc    : 'End date chaged, duration is 1'
            }
        );
    });

    // #8632 - Task end date/duration is not properly editing after cancel
    t.it('Should continue editing after cancel/undo', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            project  : t.getProject({
                calendar : 'general'
            }),
            features : {
                taskTooltip : false
            }
        });

        let task = gantt.taskStore.getById(13);

        t.chain(
            { dblclick : '.b-gantt-task.id13' },

            { click : '.b-end-date .b-icon-angle-left' },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 0, 25).getTime() && task.duration === 7,
                desc    : 'End date changed, duration is 7'
            },

            { click : '.b-gantt-task.id12' },

            { waitForPropagate : gantt },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 0, 26).getTime() && task.duration === 8,
                desc    : 'End date restored, duration is 8'
            },

            { dblclick : '.b-gantt-task.id13' },

            { click : '.b-end-date .b-icon-angle-left' },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 0, 25).getTime() && task.duration === 7,
                desc    : 'End date changed, duration is 7'
            }
        );
    });
});
