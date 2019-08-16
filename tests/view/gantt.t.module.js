/*

Bryntum Gantt (TRIAL VERSION) 1.1.2
Copyright(c) 2019 Bryntum AB
https://bryntum.com/contact
https://bryntum.com/license

*/
import { Panel, Scheduler, Gantt, ProjectModel, DomHelper, AllColumns } from '../../build/gantt.module.js?433978';

StartTest(t => {

    let gantt, scheduler;
    const testProject = window.bryntum.ganttTestProject;

    t.beforeEach(() => {
        gantt && !gantt.isDestroyed && gantt.destroy();
        scheduler && !scheduler.isDestroyed && scheduler.destroy();
    });

    t.it('should render tasks on demand during scroll', t => {
        gantt = t.getGantt({
            height   : 150, // Used to be 100 but did not fit a full row and scroller then refused to scroll
            appendTo : document.body
        });

        // Last task's element is NOT present because of buffered rendering.
        t.notOk(gantt.getElementFromTaskRecord(gantt.store.last));

        // First task's element is present.
        t.ok(gantt.getElementFromTaskRecord(gantt.store.first));

        t.chain(
            // Scroll to end
            () => gantt.scrollTaskIntoView(gantt.store.last),

            // Wait for last task's element to be present.
            {
                waitFor : () => gantt.getElementFromTaskRecord(gantt.store.last)
            }
        );
    });

    t.it('task navigation', t => {
        gantt = t.getGantt({
            height         : 700,
            appendTo       : document.body,
            onTaskBarClick : () => {}
        });

        const editTaskSpy = t.spyOn(gantt.features.taskEdit, 'editTask').and.callFake(() => {}),
            contextmenuSpy = t.spyOn(gantt, 'onElementContextMenu').and.callFake(() => {}),
            testChain = [
                { click : gantt.getElementFromTaskRecord(gantt.taskStore.first) }
            ],
            visitedTasks = [];

        gantt.navigator.on({
            navigate : ({ item }) => {
                visitedTasks.push(item);
            }
        });

        let counter = 0;

        // Navigate through the entire chart, checking triggering of keyboard-based
        // operations on each Task
        gantt.taskStore.forEach(task => {
            const taskEl = gantt.getElementFromTaskRecord(task).parentNode,
                callCount = ++counter;

            testChain.push({
                waitFor : () => document.activeElement === taskEl
            }, {
                waitFor : () => visitedTasks[callCount - 1] === taskEl
            }, {
                type : '[ENTER]'
            },

            // Check whether ENTER triggered the editTask method on the task
            next => {
                t.is(editTaskSpy.calls.count(), callCount);
                t.isDeeply(editTaskSpy.calls.argsFor(callCount - 1), [task]);
                next();
            }, {
                type : ' '
            },

            // Check whether SPACE triggered the onContextMenu method on the task
            next => {
                t.is(contextmenuSpy.calls.count(), callCount);
                t.is(contextmenuSpy.calls.argsFor(callCount - 1)[0].target, taskEl);
                next();
            }, {
                type : '[DOWN]'
            });
        });

        t.chain(...testChain);
    });

    t.it('Should clear tasks', t => {
        gantt = t.getGantt({
            appendTo : document.body
        });

        t.chain(
            { waitForPropagate : gantt },
            next => {
                gantt.taskStore.data = [];
                next();
            },
            { waitForSelectorNotFound : '.b-gantt-task' },
            { waitForSelectorNotFound : '.b-sch-timeaxis-cell' }
        );
    });

    t.it('task navigation with Gantt inside a Panel', t => {
        gantt = t.getGantt({
            onTaskBarClick : () => {},
            height         : 600
        });
        const panel = new Panel({
            layout   : 'fit',
            appendTo : document.body,
            items    : [gantt],
            tbar     : [
                {
                    type     : 'button',
                    ref      : 'expandAllButton',
                    icon     : 'b-fa b-fa-angle-double-down',
                    tipText  : 'Expand all',
                    onAction : () => gantt.expandAll()
                },
                {
                    type     : 'button',
                    ref      : 'collapseAllButton',
                    icon     : 'b-fa b-fa-angle-double-up',
                    tipText  : 'Collapse all',
                    onAction : () => gantt.collapseAll()
                },
                {
                    type     : 'button',
                    ref      : 'zoomInButton',
                    icon     : 'b-fa b-fa-search-plus',
                    tipText  : 'Zoom in',
                    onAction : () => gantt.zoomIn()
                },
                {
                    type     : 'button',
                    ref      : 'zoomOutButton',
                    icon     : 'b-fa b-fa-search-minus',
                    tipText  : 'Zoom out',
                    onAction : () => gantt.zoomOut()
                },
                {
                    type     : 'button',
                    ref      : 'previousButton',
                    icon     : 'b-fa b-fa-angle-left',
                    tipText  : 'Previous time span',
                    onAction : () => gantt.shiftPrevious()
                },
                {
                    type     : 'button',
                    ref      : 'nextButton',
                    icon     : 'b-fa b-fa-angle-right',
                    tipText  : 'Next time span',
                    onAction : () => gantt.shiftNext()
                },
                {
                    type     : 'button',
                    ref      : 'addTaskButton',
                    icon     : 'b-fa b-fa-plus',
                    tipText  : 'Add new task',
                    onAction : () => {
                        const cellEdit = gantt.features.cellEdit;

                        cellEdit.doAddNewAtEnd().then((added) => {
                            if (added) {
                                cellEdit.startEditing({
                                    record : added,
                                    field  : 'name'
                                });
                            }
                        });
                    }
                }
            ]
        });

        // Work round Panel default styling which has some padding.
        panel.bodyElement.style.padding = 0;

        let cellEditor,
            scrollY;

        const editTaskSpy = t.spyOn(gantt.features.taskEdit, 'editTask').and.callFake(() => {}),
            contextmenuSpy = t.spyOn(gantt, 'onElementContextMenu').and.callFake(() => {}),
            testChain = [
                { waitForPropagate : gantt.project },

                { click : panel.widgetMap.addTaskButton.element },

                { waitForPropagate : gantt.project },

                {
                    waitFor() {
                        if (gantt.features.cellEdit.editorContext) {
                            cellEditor = gantt.features.cellEdit.editorContext.editor.inputField;

                            scrollY = gantt.scrollable.y;

                            return cellEditor.containsFocus;
                        }
                    }
                },

                { click : panel.element, offset : ['50%', 30] },

                {
                    waitFor() {
                        return !cellEditor.containsFocus;
                    }
                },

                next => {
                    t.is(gantt.scrollable.y, scrollY, 'Scroll position unchange after clicking out');
                    gantt.scrollable.y = 0;
                    next();
                },

                { click : gantt.getElementFromTaskRecord(gantt.taskStore.first) }
            ],
            visitedTasks = [];

        gantt.navigator.on({
            navigate : ({ item }) => {
                visitedTasks.push(item);
            }
        });

        let counter = 0;

        // Navigate through the entire chart, checking triggering of keyboard-based
        // operations on each Task.
        // The trailing DOWN action also tests the protection against navigating
        // to tasks which are outside of the TimeAxis.
        // The added task at the end has no start/end date, so is not navigable.
        gantt.taskStore.forEach(task => {
            const
                innerEl = gantt.getElementFromTaskRecord(task),
                taskEl = innerEl && innerEl.parentNode,
                callCount = ++counter;

            if (!taskEl) {
                t.fail('Failed on task ' + task.id);
            }

            testChain.push({
                waitFor : () => document.activeElement === taskEl
            }, {
                waitFor : () => visitedTasks[callCount - 1] === taskEl
            }, {
                type : '[ENTER]'
            },

            // Check whether ENTER triggered the editTask method on the task
            next => {
                t.is(editTaskSpy.calls.count(), callCount);
                t.isDeeply(editTaskSpy.calls.argsFor(callCount - 1), [task]);
                next();
            }, {
                type : ' '
            },

            // Check whether SPACE triggered the onContextMenu method on the task
            next => {
                t.is(contextmenuSpy.calls.count(), callCount);
                t.is(contextmenuSpy.calls.argsFor(callCount - 1)[0].target, taskEl);
                next();
            }, {
                type : '[DOWN]'
            });
        });

        // There is nothing to wait for. The last DOWN should simply not have thrown an error
        // It will not navigate anywhere or fire any events.
        // But it MUST complete before the beforeEach destroys it.
        testChain.push(
            { waitFor : 500 },
            () => {
                panel.destroy();
            }
        );

        t.chain(...testChain);
    });

    t.it('Adding new records', t => {
        gantt = t.getGantt({
            // We only want the name column which will be auto inserted
            columns        : [],
            onTaskBarClick : () => {}
        });
        const panel = new Panel({
            layout   : 'fit',
            height   : 700,
            appendTo : document.body,
            items    : [gantt],
            tbar     : [
                {
                    type     : 'button',
                    ref      : 'expandAllButton',
                    icon     : 'b-fa b-fa-angle-double-down',
                    tipText  : 'Expand all',
                    onAction : () => gantt.expandAll()
                },
                {
                    type     : 'button',
                    ref      : 'collapseAllButton',
                    icon     : 'b-fa b-fa-angle-double-up',
                    tipText  : 'Collapse all',
                    onAction : () => gantt.collapseAll()
                },
                {
                    type     : 'button',
                    ref      : 'zoomInButton',
                    icon     : 'b-fa b-fa-search-plus',
                    tipText  : 'Zoom in',
                    onAction : () => gantt.zoomIn()
                },
                {
                    type     : 'button',
                    ref      : 'zoomOutButton',
                    icon     : 'b-fa b-fa-search-minus',
                    tipText  : 'Zoom out',
                    onAction : () => gantt.zoomOut()
                },
                {
                    type     : 'button',
                    ref      : 'previousButton',
                    icon     : 'b-fa b-fa-angle-left',
                    tipText  : 'Previous time span',
                    onAction : () => gantt.shiftPrevious()
                },
                {
                    type     : 'button',
                    ref      : 'nextButton',
                    icon     : 'b-fa b-fa-angle-right',
                    tipText  : 'Next time span',
                    onAction : () => gantt.shiftNext()
                },
                {
                    type     : 'button',
                    ref      : 'addTaskButton',
                    icon     : 'b-fa b-fa-plus',
                    tipText  : 'Add new task',
                    onAction : () => {
                        const cellEdit = gantt.features.cellEdit;

                        cellEdit.doAddNewAtEnd().then((added) => {
                            if (added) {
                                cellEdit.startEditing({
                                    record : added,
                                    field  : 'name'
                                });
                            }
                        });
                    }
                }
            ]
        });

        // Work round Panel default styling which is a dark grey background
        // and some padding.
        panel.bodyElement.style.backgroundColor = 'transparent';
        panel.bodyElement.style.padding = 0;

        let cellEdit,
            cellEditor,
            count = gantt.taskStore.count;

        t.chain(
            { click : panel.widgetMap.addTaskButton.element },

            // Wait until a new record has been added and we're editing it
            {
                waitFor() {
                    if (gantt.features.cellEdit.editorContext) {
                        cellEdit = gantt.features.cellEdit;
                        cellEditor = cellEdit.editorContext.editor.inputField;

                        return cellEditor.containsFocus &&
                            gantt.taskStore.count === count + 1 &&
                            cellEdit.editorContext.record === gantt.taskStore.last;
                    }
                }
            },

            // We have only one column, so this should trigger addNewAtEnd
            {
                type : '[TAB]'
            },

            // Wait until a new record has been added and we're editing it
            {
                waitFor() {
                    return cellEditor.containsFocus &&
                        gantt.taskStore.count === count + 2 &&
                        cellEdit.editorContext.record === gantt.taskStore.last;
                }
            },

            () => {
                panel.destroy();
            }
        );
    });

    t.it('Gantt paired with a Scheduler', t => {

        const project = new ProjectModel({
            startDate : '2019-01-16',
            endDate   : '2019-02-13',

            // General calendar is used by default
            calendar : 'general',

            assignmentsData  : testProject.assignments,
            eventsData       : testProject.events,
            dependenciesData : testProject.dependencies,
            resourcesData    : testProject.resources,
            calendarsData    : testProject.calendars
        });

        // Make it lay the pair out right
        document.body.classList.add('b-panel');

        gantt = new Gantt({
            id       : 'top-gantt',
            appendTo : document.body,
            flex     : '1 1 65%',

            features : {
                nonWorkingTime : true,
                labels         : {
                    left : {
                        field  : 'name',
                        editor : {
                            type : 'textfield'
                        }
                    }
                }
            },

            //region Data

            project,

            // TODO: Use CrudManager when possible
            __crudManager : {
                transport : {
                    load : {
                        url : 'data/data.json'
                    }
                },
                autoLoad : true
            },

            //endregion

            viewPreset  : 'weekAndDayLetter',
            columnLines : true,

            columns : [
                { type : 'name', width : 280 },
                { type : 'resourceassignment', text : 'Assigned Resources', width : 170 }
            ],

            startDate : '2019-01-11'
        });

        scheduler = new Scheduler({
            id          : 'bottom-scheduler',
            appendTo    : document.body,
            minHeight   : '20em',
            flex        : '1 1 35%',
            partner     : gantt,
            hideHeaders : true,
            rowHeight   : 45,
            eventColor  : 'blue',

            features : {
                dependencies   : true,
                nonWorkingTime : true,
                columnLines    : false
            },

            columns : [
                {
                    flex       : 1,
                    field      : 'name',
                    htmlEncode : false,
                    renderer   : ({ record }) => `<i class="b-fa b-fa-${record.type} b-tree-icon"></i>${record.name}`
                }
            ],

            eventStore      : project.eventStore,
            resourceStore   : project.resourceStore,
            dependencyStore : project.dependencyStore,
            assignmentStore : project.assignmentStore
        });

        // Sync partner sizes.
        gantt.onElementResize();

        const tickWidth = gantt.timeAxisViewModel.tickWidth,
            gd = gantt.taskStore.findByField('name', 'Gather documents')[0].data,
            gdTaskEl = gantt.getElementFromTaskRecord(gd).parentNode,
            gdEventEl = scheduler.getElementFromEventRecord(gd).parentNode,
            gdTick = gantt.timeAxis.getTickFromDate(gd.startDate);

        t.is(DomHelper.getTranslateX(gdTaskEl), gdTick * tickWidth);
        t.is(DomHelper.getTranslateX(gdEventEl), gdTick * tickWidth);

        t.chain(
            { waitForPropagate : gantt.project },

            { drag : gdTaskEl, by : [tickWidth, 0] },

            next => {
                // Both elements must have moved right
                t.is(DomHelper.getTranslateX(gdTaskEl), (gdTick + 1) * tickWidth);
                t.is(DomHelper.getTranslateX(gdEventEl), (gdTick + 1) * tickWidth);
                next();
            },

            { drag : gdEventEl, by : [-tickWidth, 0] },

            next => {
                // Both elements must have moved back to original position
                t.is(DomHelper.getTranslateX(gdTaskEl), gdTick * tickWidth);
                t.is(DomHelper.getTranslateX(gdEventEl), gdTick * tickWidth);
                next();
            }
        );
    });

    t.it('Should preserve locked view scroll when hiding columns', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            columns  : Object.values(AllColumns).map(column => {
                return {
                    type : column.type
                };
            }),
            enableEventAnimations : false,
            subGridConfigs        : {
                locked : {
                    width : 500
                },
                normal : {
                    width : 400
                }
            }
        });

        const scrollable = gantt.subGrids.locked.scrollable;

        t.chain(
            { waitForPropagate : gantt },
            () => {
                return scrollable.scrollTo(scrollable.maxX);
            },
            gantt.columns.getRange().reverse().map(column => {
                return next => {
                    column.hide();
                    // Minimal delay is required to get proper scroll position
                    t.waitFor(100, () => {
                        t.is(scrollable.x, scrollable.maxX, 'View scroll is intact');
                        next();
                    });
                };
            })
        );
    });

    t.it('Dates are displayed consistently', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            tasks    : [
                {
                    id                : 1,
                    startDate         : '2017-01-16',
                    duration          : 2,
                    name              : 'Task 1',
                    cls               : 'task1',
                    manuallyScheduled : true,
                    constraintType    : 'muststarton',
                    constraintDate    : '2017-01-16'
                },
                {
                    id                : 2,
                    startDate         : '2017-01-16',
                    duration          : 2,
                    name              : 'Task 2',
                    cls               : 'task2',
                    manuallyScheduled : true,
                    constraintType    : 'mustfinishon',
                    constraintDate    : '2017-01-18'
                }
            ],
            columns : [
                { type : 'startdate', format : 'MM/DD/YYYY' },
                { type : 'enddate', format : 'MM/DD/YYYY' },
                { type : 'constraintdate', format : 'MM/DD/YYYY' }
            ],
            displayDateFormat : 'MM/DD/YYYY'
        });

        const
            startDateStr = '01/16/2017',
            endDateStr = '01/18/2017';

        function assertTask(name) {
            return [
                next => {
                    t.contentLike(`.${name} [data-column=startDate]`, startDateStr, `${name} start date column is ok`);
                    t.contentLike(`.${name} [data-column=endDate]`, endDateStr, `${name} end date column is ok`);

                    next();
                },

                // HOVER
                { moveMouseTo : `.b-gantt-task.${name}`, desc : 'Checking hover tip' },
                { waitForSelector : '.b-gantt-task-tooltip' },
                next => {
                    t.contentLike('.b-sch-tooltip-startdate .b-sch-clock-text', startDateStr, `${name} start date in tooltip is ok`);
                    t.contentLike('.b-sch-tooltip-enddate .b-sch-clock-text', endDateStr, `${name} end date in tooltip is ok`);
                    next();
                },

                // DRAG
                { drag : `.b-gantt-task.${name}`, by : [0, 10], dragOnly : true, desc : 'Checking drag tip' },
                { waitForSelector : '.b-gantt-taskdrag-tooltip .b-sch-tooltip-startdate' },
                next => {
                    t.contentLike('.b-sch-tooltip-startdate .b-sch-clock-text', startDateStr, `${name} start date in tooltip is ok`);
                    t.contentLike('.b-sch-tooltip-enddate .b-sch-clock-text', endDateStr, `${name} end date in tooltip is ok`);
                    next();
                },
                { mouseUp : null },
                { waitForSelectorNotFound : '.b-gantt-taskdrag-tooltip .b-sch-tooltip-startdate' },

                // RESIZE
                { drag : `.b-gantt-task.${name}`, by : [0, 10], offset : ['100%-5', '50%'], dragOnly : true, desc : 'Checking resize tip' },
                { waitForSelector : '.b-sch-tooltip-startdate' },
                next => {
                    t.contentLike('.b-sch-tooltip-startdate .b-sch-clock-text', startDateStr, `${name} start date in tooltip is ok`);
                    t.contentLike('.b-sch-tooltip-enddate .b-sch-clock-text', endDateStr, `${name} end date in tooltip is ok`);
                    next();
                },
                { mouseUp : null },

                // EVENT EDITOR
                { dblclick : `.b-gantt-task.${name}`, desc : 'Checking event editor' },
                { waitForSelector : '.b-gantt-taskeditor' },
                next => {
                    t.is(document.querySelector('.b-gantt-taskeditor input[name=startDate]').value, startDateStr,
                        `${name} start date field in event editor is ok`);
                    t.is(document.querySelector('.b-gantt-taskeditor input[name=endDate]').value, endDateStr,
                        `${name} end date field in event editor is ok`);
                    next();
                },
                { click : '.b-popup-close' }
            ];
        }

        t.chain(
            { waitForPropagate : gantt },
            { moveMouseTo : `.task2`, desc : 'Move mouse to last locked row to avoid unexpected triggering hover tip' },
            next => {
                t.contentLike('.task1 [data-column=constraintDate]', startDateStr, 'Task 1 constraint date column is ok');
                t.contentLike('.task2 [data-column=constraintDate]', endDateStr, 'Task 2 constraint date column is ok');
                next();
            },
            assertTask('task2'),
            assertTask('task1')
        );
    });

    // Wake up when Siesta screenshot can handle translated elements
    t.snooze('2019-06-30', /*'Gantt resource column appearance',*/ t => {
        const project = window.project = new ProjectModel({
            startDate : '2019-01-16',
            endDate   : '2019-02-13',

            // General calendar is used by default
            calendar : 'general',

            assignmentsData  : testProject.assignments,
            eventsData       : testProject.events,
            dependenciesData : testProject.dependencies,
            resourcesData    : testProject.resources,
            calendarsData    : testProject.calendars
        });

        // Make it lay the pair out right
        document.body.classList.add('b-panel');

        gantt = new Gantt({
            id       : 'top-gantt',
            appendTo : document.body,
            flex     : '1 1 65%',

            features : {
                nonWorkingTime : true,
                labels         : {
                    left : {
                        field  : 'name',
                        editor : {
                            type : 'textfield'
                        }
                    }
                }
            },

            //region Data

            project,

            // TODO: Use CrudMnager when possible
            __crudManager : {
                transport : {
                    load : {
                        url : 'data/data.json'
                    }
                },
                autoLoad : true
            },

            //endregion

            viewPreset  : 'weekAndDayLetter',
            columnLines : true,

            columns : [
                { type : 'name', width : 280 },
                { type : 'resourceassignment', text : 'Assigned Resources', width : 170 }
            ],

            startDate : '2019-01-11'
        });

        scheduler = new Scheduler({
            id          : 'bottom-scheduler',
            appendTo    : document.body,
            minHeight   : '20em',
            flex        : '1 1 35%',
            partner     : gantt,
            hideHeaders : true,
            rowHeight   : 45,
            eventColor  : 'blue',

            features : {
                dependencies   : true,
                nonWorkingTime : true,
                columnLines    : false
            },

            columns : [
                {
                    flex       : 1,
                    field      : 'name',
                    htmlEncode : false,
                    renderer   : ({ record }) => `<i class="b-fa b-fa-${record.type} b-tree-icon"></i>${record.name}`
                }
            ],

            eventStore      : project.eventStore,
            resourceStore   : project.resourceStore,
            dependencyStore : project.dependencyStore,
            assignmentStore : project.assignmentStore
        });

        // Sync partner sizes.
        gantt.onElementResize();

        const investigate = gantt.taskStore.findByField('name', 'Investigate')[0].data,
            investigateResourceCell = gantt.getCell({
                record : investigate,
                column : 1
            });

        t.chain(
            {
                // Check the appearance of the resource cell.
                screenshot : {
                    target   : investigateResourceCell,
                    fileName : `tests/screenshots/resourceCell.png`,
                    cfg      : {
                        $similarityThreshold : 0.9999
                    }
                }
            }
        );
    });

    t.it('Dropping on the splitter should not throw an error', t => {
        gantt = t.getGantt({
            height   : 700,
            appendTo : document.body
        });

        t.chain(
            { drag : '.b-grid-cell', to : '.b-grid-splitter' }
        );
    });

    t.it('Baselines', t => {
        gantt = t.getGantt({
            height    : 700,
            appendTo  : document.body,
            startDate : new Date(2011, 6, 1),
            endDate   : new Date(2011, 6, 30),
            features  : {
                baselines   : true,
                taskTooltip : false
            },
            rowHeight : 60,
            tasks     : [
                {
                    id        : 1,
                    name      : 'Task 1',
                    startDate : new Date(2011, 6, 1),
                    endDate   : new Date(2011, 6, 5),
                    baselines : [{}]
                },
                {
                    id        : 123,
                    name      : 'Task 123',
                    startDate : new Date(2011, 6, 15),
                    endDate   : new Date(2011, 6, 23),
                    baselines : [{}],
    
                    children : [
                        {
                            id        : 2,
                            name      : 'Task 2',
                            startDate : new Date(2011, 6, 16),
                            endDate   : new Date(2011, 6, 20),
                            baselines : [{}]
                        },
                        {
                            id        : 3,
                            name      : 'Task 3',
                            startDate : new Date(2011, 6, 18),
                            endDate   : new Date(2011, 6, 22),
                            baselines : [{
                                // Task id 3 has slipped by one day from its baseline end date of 
                                // 21 Jul and 16 days. It ends on 22nd with 17 days.
                                endDate  : new Date(2011, 6, 21),
                                duration : 16
                            }]
                        }
                    ]
                },
                {
                    id        : 4,
                    name      : 'Task 4',
                    startDate : new Date(2011, 6, 25),
                    endDate   : new Date(2011, 6, 28),
                    baselines : [{}]
                },
                {
                    id        : 5,
                    name      : 'Task 5',
                    startDate : new Date(2011, 6, 28),
                    endDate   : new Date(2011, 6, 28),
                    baselines : [{}]
                },
                {
                    id        : 6,
                    name      : 'Task 6',
                    startDate : new Date(2011, 6, 28),
                    duration  : 0,
                    baselines : [{}]
                }
            ]
        });

        t.chain(
            // Hover the baseline element of the first task
            {
                moveMouseTo : gantt.getElementFromTaskRecord(gantt.taskStore.first).parentNode.querySelector('.b-task-baseline')
            },

            // And we should get a tip for that baseline
            {
                waitForSelector : '.b-tooltip-content:contains("Task 1 (baseline 1)")'
            }
        );
    });

    t.it('Baseline elements restored from cache upon element recycle', t => {
        gantt = t.getGantt({
            height    : 300,
            appendTo  : document.body,
            startDate : new Date(2011, 6, 1),
            endDate   : new Date(2011, 6, 30),
            features  : {
                baselines   : true,
                taskTooltip : false
            },
            rowHeight : 60,
            tasks     : [
                {
                    id        : 1,
                    name      : 'Task 1',
                    startDate : new Date(2011, 6, 1),
                    endDate   : new Date(2011, 6, 5),
                    baselines : [{}]
                },
                {
                    id        : 123,
                    name      : 'Task 123',
                    startDate : new Date(2011, 6, 15),
                    endDate   : new Date(2011, 6, 23),
                    baselines : [{}],
    
                    children : [
                        {
                            id        : 2,
                            name      : 'Task 2',
                            startDate : new Date(2011, 6, 16),
                            endDate   : new Date(2011, 6, 20),
                            baselines : [{}]
                        },
                        {
                            id        : 3,
                            name      : 'Task 3',
                            startDate : new Date(2011, 6, 18),
                            endDate   : new Date(2011, 6, 22),
                            baselines : [{
                                // Task id 3 has slipped by one day from its baseline end date of 
                                // 21 Jul and 16 days. It ends on 22nd with 17 days.
                                endDate  : new Date(2011, 6, 21),
                                duration : 16
                            }]
                        }
                    ]
                },
                {
                    id        : 4,
                    name      : 'Task 4',
                    startDate : new Date(2011, 6, 25),
                    endDate   : new Date(2011, 6, 28),
                    baselines : [{}]
                },
                {
                    id        : 5,
                    name      : 'Task 5',
                    startDate : new Date(2011, 6, 28),
                    endDate   : new Date(2011, 6, 28),
                    baselines : [{}]
                },
                {
                    id        : 6,
                    name      : 'Task 6',
                    startDate : new Date(2011, 6, 28),
                    duration  : 0,
                    baselines : [{}]
                },
                {
                    id        : 7,
                    name      : 'Task 7',
                    startDate : new Date(2011, 6, 28),
                    duration  : 0,
                    baselines : [{}]
                },
                {
                    id        : 8,
                    name      : 'Task 8',
                    startDate : new Date(2011, 6, 28),
                    duration  : 0,
                    baselines : [{}]
                },
                {
                    id        : 9,
                    name      : 'Task 9',
                    startDate : new Date(2011, 6, 28),
                    duration  : 0,
                    baselines : [{}]
                },
                {
                    id        : 10,
                    name      : 'Task 10',
                    startDate : new Date(2011, 6, 28),
                    duration  : 0,
                    baselines : [{}]
                },
                {
                    id        : 11,
                    name      : 'Task 11',
                    startDate : new Date(2011, 6, 28),
                    duration  : 0,
                    baselines : [{}]
                },
                {
                    id        : 12,
                    name      : 'Task 12',
                    startDate : new Date(2011, 6, 28),
                    duration  : 0,
                    baselines : [{}]
                },
                {
                    id        : 13,
                    name      : 'Task 13',
                    startDate : new Date(2011, 6, 28),
                    duration  : 0,
                    baselines : [{}]
                },
                {
                    id        : 14,
                    name      : 'Task 14',
                    startDate : new Date(2011, 6, 28),
                    duration  : 0,
                    baselines : [{}]
                },
                {
                    id        : 15,
                    name      : 'Task 15',
                    startDate : new Date(2011, 6, 28),
                    duration  : 0,
                    baselines : [{}]
                },
                {
                    id        : 16,
                    name      : 'Task 16',
                    startDate : new Date(2011, 6, 28),
                    duration  : 0,
                    baselines : [{}]
                }
            ]
        });

        t.chain(
            { waitForPropagate : gantt.project },

            next => {
                gantt.scrollTaskIntoView(gantt.taskStore.last).then(next);
            },

            next => {
                gantt.scrollTaskIntoView(gantt.taskStore.first).then(next);
            },

            {
                waitForSelector : '.b-gantt-task-wrap[data-task-id="1"] .b-task-baseline',
                desc            : 'Baselines for Task 1 restored'
            }
        );
    });
});
