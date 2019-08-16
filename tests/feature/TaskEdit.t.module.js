import { DateHelper, ProjectGenerator } from '../../build/gantt.module.js?433978';

StartTest(t => {
    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should show task editor when double clicking task', t => {
        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip : false
            },

            resources : t.getResourceStoreData()
        });
        const investigate = gantt.taskStore.getAt(2);

        let oldWidth;

        t.chain(
            { dblClick : '.b-gantt-task.id11' },

            { waitForSelector : '.b-taskeditor' },

            next => {
                const oldEl = gantt.getElementFromTaskRecord(investigate);

                oldWidth = oldEl.offsetWidth;

                t.is(document.querySelector('.b-name input').value, gantt.taskStore.getById(11).name, 'Correct name');
                next();
            },

            { click : () => gantt.features.taskEdit.editor.widgetMap.fullDurationField.triggers.spin.upButton },

            { click : () => gantt.features.taskEdit.editor.widgetMap.saveButton.element },

            { waitFor : () => gantt.getElementFromTaskRecord(investigate).offsetWidth > oldWidth }
        );
    });

    t.it('Should save assignments after task edit save button click', t => {

        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip : false
            },

            resources : t.getResourceStoreData()
        });

        const investigate = gantt.project.eventStore.getAt(2),
            Arcady = gantt.project.resourceStore.getById(1);

        t.chain(
            { dblClick : '.b-gantt-task.id11' },

            { waitForSelector : '.b-taskeditor' },

            { click : '.b-tabpanel-tab-title:contains(Resources)' },

            { click : '.b-resourcestab .b-add-button' },

            { click : '.b-grid .b-cell-editor' },

            { wheel : '.b-list', deltaY : '-100' },

            { click : '.b-list-item[data-index="0"]' },

            { click : '.b-button:contains(Save)' },

            { waitForPropagate : gantt.project },

            () => {
                t.is(investigate.assignments.length, 1, 'Investigate task now has one assignment');
                t.is(investigate.assignments[0].resource, Arcady, 'Arcady is assigned to the task');
            }
        );
    });

    t.it('Should not change assignments after task edit cancel button click', t => {

        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip : false
            },

            resources : t.getResourceStoreData()
        });

        const investigate = gantt.project.eventStore.getAt(2);

        t.chain(
            { dblClick : '.b-gantt-task.id11' },

            { waitForSelector : '.b-taskeditor' },

            { click : '.b-tabpanel-tab-title:contains(Resources)' },

            { click : '.b-resourcestab .b-add-button' },

            { click : '.b-grid .b-cell-editor' },

            { wheel : '.b-list', deltaY : '-100' },

            { click : '.b-list-item[data-index="0"]' },

            { click : '.b-button:contains(Cancel)' },
            
            { waitForSelectorNotFound : '.b-taskeditor-editing' },

            () => {
                t.is(investigate.assignments.length, 0, 'Investigate task now has no assignments');
            }
        );
    });

    t.describe('Advanced form works ok', t => {
        t.it('Should set constraints', t => {
            gantt = t.getGantt({
                appendTo : document.body,
                columns  : [
                    { type : 'name', width : 200 },
                    { type : 'constrainttype', width : 100 },
                    { type : 'constraintdate', width : 100 }
                ],
                subGridConfigs : {
                    locked : { width : 400 }
                },
                features : {
                    taskTooltip : false
                }
            });

            const project = gantt.project;
            let task = gantt.taskStore.getById(13);

            t.chain(
                { waitForPropagate : project },
                async() => {
                    task.constraintType = 'muststarton';
                    task.constraintDate = task.startDate;
                    return project.propagate();
                },
                { dblclick : '.id13.b-gantt-task', desc : 'Edit task with constraint' },
                { click : '.b-tabpanel-tab-title:contains(Advanced)' },
                next => {
                    t.hasValue('[name=constraintType]', 'Must start on', 'Constraint type value is ok');
                    t.hasValue('[name=constraintDate]', DateHelper.format(task.startDate, 'L'), 'Constraint date value is ok');
                    next();
                },
                { click : '[name=constraintDate]' },
                { type : '[DOWN][LEFT][ENTER]' },
                next => {
                    document.querySelector('[name=constraintType]').value = '';
                    next();
                },
                { click : '[name=constraintType]' },
                { type : 's[ENTER]' },
                { click : 'button:contains(Save)' },

                { waitForPropagate : gantt.project },

                next => {
                    t.is(task.constraintType, 'startnoearlierthan', 'Constraint type is ok');
                    t.is(task.constraintDate, task.startDate, 'Constraint date is ok');
                    next();
                },

                { dblclick : '.id13.b-gantt-task', desc : 'Edit task with constraint' },
                { click : '.b-tabpanel-tab-title:contains(Advanced)' },
                { click : '[name=constraintType]' },
                next => {
                    t.hasValue('[name=constraintType]', 'Start no earlier than', 'Constraint type value is ok');
                    t.hasValue('[name=constraintDate]', DateHelper.format(task.startDate, 'L'), 'Constraint date value is ok');

                    next();
                },
                { click : '.b-constrainttypepicker .b-icon-remove' },
                { click : 'button:contains(Save)' },

                { waitForPropagate : gantt.project },

                next => {
                    t.is(task.constraintType, null, 'Constraint type is ok');
                    // t.is(task.constraintDate, new Date(2017, 0, 15), 'Constraint date is ok');
                    next();
                }
            );
        });

        t.it('Should set calendars', t => {
            gantt = t.getGantt({
                appendTo : document.body,
                columns  : [
                    { type : 'name', width : 200 },
                    { type : 'calendar', width : 100 }
                ],
                subGridConfigs : {
                    locked : { width : 300 }
                },
                features : {
                    taskTooltip : false
                }
            });

            const project = gantt.project;
            let task = gantt.taskStore.getById(13),
                originalEnd = task.endDate;

            task.setCalendar('night');

            t.chain(
                { waitForPropagate : project },

                { dblclick : '.id13.b-gantt-task', desc : 'Edit task' },
                { click : '.b-tabpanel-tab-title:contains(Advanced)' },
                { waitForSelector : 'input[name=calendar]' },

                next => {
                    t.hasValue('input[name=calendar]', 'Night shift', 'Calendar value is ok');
                    next();
                },

                { click : '[name=calendar]' },
                { type : '[DOWN][UP][ENTER][ENTER]' },
                { waitForPropagate : project },

                next => {
                    t.is(task.calendar.id, 'business', 'Calendar id is ok');
                    t.notOk(task.endDate.getTime() === originalEnd.getTime(), 'Task is updated');
                    t.contentLike('.id13 [data-column=calendar]', 'Business', 'Column cell value is ok');
                }
            );
        });
    });

    t.it('Should disable certain fields for parent tasks', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                taskTooltip : false
            }
        });

        t.chain(
            { dblClick : '[data-task-id="1"]' },

            { waitForSelector : '.b-taskeditor' },

            () => {
                const { fullDurationField, effortField, endDateField, percentDoneField } = gantt.features.taskEdit.editor.widgetMap;

                t.ok(fullDurationField.disabled, 'Duration disabled');
                t.ok(effortField.disabled, 'Effort disabled');
                t.ok(endDateField.disabled, 'Finish disabled');
                t.ok(percentDoneField.disabled, 'Percent done disabled');
            }
        );
    });

    t.it('Should not cancel edit when editing a new resource allocation', t => {

        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip : false
            },

            resources : t.getResourceStoreData()
        });

        let editorContext;

        t.chain(
            { dblClick : '.b-gantt-task.id11' },

            { waitForSelector : '.b-taskeditor' },

            next => {
                gantt.features.taskEdit.editor.widgetMap.tabs.layout.animateCardChange = false;
                next();
            },

            { click : '.b-tabpanel-tab-title:contains(Resources)' },

            { click : '.b-resourcestab .b-add-button' },

            {
                waitFor : () => {
                    editorContext = gantt.features.taskEdit.editor.widgetMap['resourcestab-grid'].features.cellEdit.editorContext;

                    return editorContext && editorContext.editor.containsFocus;
                }
            },

            { click : () => editorContext.editor.inputField.triggers.expand.element },

            { click : () => editorContext.editor.inputField.picker.getItem(1) },

            { type : '[TAB]' },

            // Nothing should happen. The test is that editing does not finish
            // so there's no event to wait for.
            { waitFor : 500 },

            () => {
                editorContext = gantt.features.taskEdit.editor.widgetMap['resourcestab-grid'].features.cellEdit.editorContext;

                t.ok(editorContext && editorContext.editor.containsFocus);
            }
        );
    });

    t.it('Should allow setting negative lag', t => {
        gantt = t.getGantt({
            appendTo       : document.body,
            width          : 400,
            subGridConfigs : {
                locked : {
                    width : 1
                }
            },
            features : {
                taskTooltip : false
            }
        });

        t.chain(
            { dblClick : '[data-task-id="14"]' },
            { click : '.b-tabpanel-tab-title:textEquals(Predecessors)' },
            { dblClick : '.b-grid-row[data-index=0] .b-grid-cell:textEquals(0 days)' },
            { type : '[ARROWDOWN][ENTER]' },
            { waitForSelector : '.b-grid-row[data-index=0] .b-grid-cell:textEquals(-1 days)' }
        );
    });

    t.it('Should preserve scroll when cancelling changes', async(t) => {
        const config = await ProjectGenerator.generateAsync(100, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        let task = gantt.taskStore.getAt(gantt.taskStore.count - 1),
            scroll;

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-task' },
            async() => gantt.scrollTaskIntoView(task),
            { dblclick : () => gantt.getElementFromTaskRecord(task) },
            { waitForSelector : '.b-taskeditor' },
            { click : () => gantt.features.taskEdit.editor.widgetMap.fullDurationField.triggers.spin.upButton },
            next => {
                scroll = gantt.scrollTop;

                const detacher = gantt.on({
                    taskrepaint({ taskRecord }) {
                        if (taskRecord === task) {
                            detacher();
                            next();
                        }
                    }
                });

                t.click('.b-popup-close');
            },
            next => {
                t.is(gantt.scrollTop, scroll, 'Scroll is intact');
            }
        );
    });

    t.it('Should be able to show editor programmatically', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-task' },

            (next) => {
                gantt.editTask(gantt.taskStore.rootNode.firstChild);
                next();
            },

            { waitForSelector : '.b-gantt-taskeditor' }
        );
    });

    t.it('Should fire events upon show', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        t.firesOnce(gantt, 'beforeTaskEdit');
        t.firesOnce(gantt, 'beforeTaskEditShow');

        gantt.editTask(gantt.taskStore.rootNode.firstChild);
    });

    t.it('Should be possible to cancel show', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        t.firesOnce(gantt, 'beforeTaskEdit');
        t.wontFire(gantt, 'beforeTaskEditShow');

        gantt.on('beforeTaskEdit', () => false);

        gantt.editTask(gantt.taskStore.rootNode.firstChild);
        t.selectorNotExists('.b-gantt-taskeditor', 'No editor in DOM');
    });

    t.it('Should fire events upon save', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        t.firesOnce(gantt, 'beforeTaskSave');

        gantt.editTask(gantt.taskStore.rootNode.firstChild);

        await gantt.features.taskEdit.save();
    });

    t.it('Should be possible to cancel save', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        t.firesOnce(gantt, 'beforeTaskSave');
        t.wontFire(gantt.taskEdit.getEditor(), 'hide');

        gantt.on('beforeTaskSave', () => false);

        gantt.editTask(gantt.taskStore.rootNode.firstChild);

        await gantt.features.taskEdit.save();

        t.selectorExists('.b-gantt-taskeditor', 'Editor still visible');
    });

    t.it('Should fire events upon delete', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        t.firesOnce(gantt, 'beforeTaskDelete');

        gantt.editTask(gantt.taskStore.rootNode.firstChild);

        await gantt.features.taskEdit.delete();
    });

    t.it('Should be possible to cancel delete', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        t.firesOnce(gantt, 'beforeTaskDelete');
        t.wontFire(gantt.taskEdit.getEditor(), 'hide');

        gantt.on('beforeTaskDelete', () => false);

        gantt.editTask(gantt.taskStore.rootNode.firstChild);

        await gantt.features.taskEdit.delete();

        t.selectorExists('.b-gantt-taskeditor', 'Editor still visible');
    });

    t.it('Should fire events with correct params', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 1, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        const task = gantt.taskStore.getById(3);

        t.firesOnce(gantt, 'beforeTaskEdit');
        gantt.on('beforeTaskEdit', (event) => {
            t.is(event.source, gantt, 'gantt');
            t.is(event.taskEdit, gantt.features.taskEdit, 'taskEdit');
            t.is(event.taskRecord, task, 'taskRecord');
            t.isInstanceOf(event.taskElement, HTMLElement, 'element');
        });

        t.firesOnce(gantt, 'beforeTaskEditShow');
        gantt.on('beforeTaskEditShow', (event) => {
            t.is(event.source, gantt, 'gantt');
            t.is(event.taskEdit, gantt.features.taskEdit, 'taskEdit');
            t.is(event.taskRecord, task, 'taskRecord');
            t.isInstanceOf(event.taskElement, HTMLElement, 'element');
            t.is(event.editor, gantt.features.taskEdit.getEditor(), 'editor');
        });

        t.firesOnce(gantt, 'beforeTaskSave');
        gantt.on('beforeTaskSave', (event) => {
            t.is(event.source, gantt, 'gantt');
            t.is(event.taskRecord, task, 'taskRecord');
            t.is(event.editor, gantt.features.taskEdit.getEditor(), 'editor');
        });

        t.firesOnce(gantt, 'beforeTaskDelete');
        gantt.on('beforeTaskDelete', (event) => {
            t.is(event.source, gantt, 'gantt');
            t.is(event.taskRecord, task, 'taskRecord');
            t.is(event.editor, gantt.features.taskEdit.getEditor(), 'editor');
        });

        gantt.on('beforeTaskSave', () => false);
        gantt.on('beforeTaskDelete', () => false);

        gantt.editTask(task);

        await gantt.features.taskEdit.save();
        await gantt.features.taskEdit.delete();
    });

    t.it('Should be possible to hide delete button', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 1, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : config.startDate,
            endDate   : config.endDate,
            project,
            features : {
                taskEdit : {
                    showDeleteButton : false
                }
            }
        });

        await project.waitForPropagateCompleted();

        gantt.editTask(gantt.taskStore.getById(3));

        t.selectorExists('.b-gantt-taskeditor button', 'Some button found');
        t.selectorNotExists('.b-gantt-taskeditor button:textEquals(Delete)', 'No delete button');
    });
});
