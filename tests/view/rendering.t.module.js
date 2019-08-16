import { CSSHelper, Rectangle } from '../../build/gantt.module.js?433978';
/* global ProjectModel */

StartTest(t => {
    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    function assertTask(t, taskOrId, index) {
        const
            task = getTask(taskOrId),
            taskEl = gantt.getElementFromTaskRecord(task),
            hasParentClass = taskEl && taskEl.parentElement.classList.contains('b-gantt-task-parent');

        let result = true;

        if (!taskEl) {
            t.fail(`Element for ${task.name} is not found`);
            result = false;
        }
        else {
            if (task.isLeaf && hasParentClass || !task.isLeaf && !hasParentClass) {
                t.fail(`${task.name} has incorrect leaf/parent cls`);
                result = false;
            }

            if (!isTaskPositioned(t, task)) {
                t.fail(`${task.name} is positioned incorrectly`);
                result = false;
            }

        }

        if (index != null) {
            let currentTask = gantt.getRecordFromElement(gantt.rowManager.rows[index].elements.normal);
            t.is(currentTask.id, task.id, `Task ${task.name} is displayed in correct row`);
        }

        if (result) {
            t.pass(`${task.name} is ok`);
        }
    }

    function isTaskPositioned(t, taskOrId) {
        const
            task = getTask(taskOrId),
            taskEl = gantt.getElementFromTaskRecord(task),
            taskBox = taskEl.getBoundingClientRect(),
            // cannot rely on cells order, need to validate
            // https://app.assembla.com/spaces/bryntum/tickets/7598-subgrids-order-need-to-be-fixed/details
            rowBox = gantt.getRowFor(task).cells.find(cell => cell.classList.contains('b-sch-timeaxis-cell')).getBoundingClientRect();

        return taskBox.top >= rowBox.top && taskBox.bottom <= rowBox.bottom &&
            taskBox.left === gantt.getCoordinateFromDate(task.startDate, false);
    }

    function tasksPositioned(t) {
        return gantt.project.eventStore.getRange()
            .filter(record => gantt.getRowFor(record))
            .every(record => isTaskPositioned(t, record));
    }

    function getTask(id) {
        return gantt.project.eventStore.getById(id);
    }

    t.it('Gantt should refresh on task add/update/remove', async t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            tasks                 : [
                {
                    id        : 1,
                    name      : 'Project A',
                    startDate : '2017-01-16',
                    duration  : 5,
                    expanded  : true,
                    children  : [
                        {
                            id        : 11,
                            name      : 'Child 1',
                            startDate : '2017-01-16',
                            duration  : 5,
                            leaf      : true,
                            cls       : 'child1'
                        }
                    ]
                },
                {
                    id        : 2,
                    name      : 'Project B',
                    startDate : '2017-01-16',
                    duration  : 5
                },
                {
                    id        : 3,
                    name      : 'Project C',
                    startDate : '2017-01-17',
                    duration  : 4
                }
            ],
            dependencies : []
        });

        const projectA = getTask(1);

        t.chain(
            { waitForSelector : '.b-gantt-task' },

            async() => {
                await projectA.waitForPropagateCompleted();
                t.diag('Append child to the bottom');
                projectA.appendChild({ id : 12, name : 'Child 2', startDate : '2017-01-16', duration : 1, cls : 'child2' });
            },

            { waitForSelector : '.b-gantt-task.child2' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },

            async() => {
                t.diag('Insert child to the top');
                projectA.insertChild({ id : 13, name : 'Child 3', startDate : '2017-01-17', duration : 1, cls : 'child3' }, getTask(11));
            },

            { waitForSelector : '.b-gantt-task.child3' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },

            async() => {
                t.diag('Remove task');
                getTask(11).remove();
            },

            { waitForElementNotVisible : '.b-gantt-task.child1' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },

            async() => {
                t.diag('Update task');
                await getTask(12).setStartDate(new Date(2017, 0, 18));
            },

            { click : '.b-grid-header.b-sortable', desc : 'Sort tasks' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },

            async() => {
                t.diag('Append child to sorted project A. It should appear first');
                projectA.appendChild({ id : 14, name : 'Child 1', startDate : '2017-01-18', duration : 1, cls : 'child1' });
            },

            { waitForSelector : '.b-gantt-task.child1' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },

            () => {
                t.diag('Filter store');
                projectA.project.eventStore.filter(r => r.name !== 'Child 2');

                t.ok(tasksPositioned(t), 'Tasks positioned ok');
            }
        );
    });

    t.it('Gantt should refresh when multiple tasks added/removed', async t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            tasks                 : [
                {
                    id        : 1,
                    name      : 'Project A',
                    startDate : '2017-01-16',
                    duration  : 5,
                    expanded  : true,
                    children  : [
                        {
                            id        : 11,
                            name      : 'Child 1',
                            startDate : '2017-01-16',
                            duration  : 5,
                            leaf      : true,
                            cls       : 'child1'
                        }
                    ]
                },
                {
                    id        : 2,
                    name      : 'Project B',
                    startDate : '2017-01-16',
                    duration  : 5
                },
                {
                    id        : 3,
                    name      : 'Project C',
                    startDate : '2017-01-17',
                    duration  : 4
                }
            ],
            dependencies : []
        });

        const projectA = getTask(1);

        t.chain(
            { waitForSelector : '.b-gantt-task' },

            async() => projectA.waitForPropagateCompleted(),

            async() => {
                t.diag('Append child to the bottom');
                projectA.appendChild([
                    { id : 12, name : 'Child 2', startDate : '2017-01-16', duration : 1, cls : 'child2' },
                    { id : 13, name : 'Child 3', startDate : '2017-01-16', duration : 1, cls : 'child3' }
                ]);
            },

            { waitForSelector : '.b-gantt-task.child2' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },

            async() => {
                t.diag('Insert child to the top');
                projectA.insertChild([
                    { id : 14, name : 'Child 4', startDate : '2017-01-17', duration : 1, cls : 'child4' },
                    { id : 15, name : 'Child 5', startDate : '2017-01-17', duration : 1, cls : 'child5' }
                ], getTask(11));
            },

            { waitForSelector : '.b-gantt-task.child4' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' }
        );
    });

    t.it('Should render tasks properly after scroll', t => {
        let tasks = [], dependencies = [];

        for (let i = 0; i < 20; i++) {
            let currentId = i + 1,
                task = {
                    id        : currentId,
                    name      : `Task ${currentId}`,
                    startDate : '2017-01-17',
                    duration  : 2,
                    expanded  : true,
                    children  : []
                };

            for (let j = 0; j < 10; j++) {
                task.children.push({
                    id        : `${currentId}-${j + 1}`,
                    name      : `Task ${currentId}-${j + 1}`,
                    startDate : '2017-01-17',
                    duration  : 2
                });

                if (j < 9) {
                    dependencies.push({
                        id        : `${currentId}-${j + 1}`,
                        fromEvent : `${currentId}-${j + 1}`,
                        toEvent   : `${currentId}-${j + 2}`,
                        lag       : -1
                    });
                }
            }

            tasks.push(task);
        }

        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                labels : {
                    right : 'name'
                }
            },
            startDate : '2017-01-15',
            endDate   : '2017-02-19',
            tasks,
            dependencies
        });

        function assertRenderedTasks() {
            Array.from(document.querySelectorAll('.b-gantt-task-wrap')).forEach(el => {
                let taskRecord = gantt.resolveTaskRecord(el);
                assertTask(t, taskRecord);
            });
        }

        function assertDependencies() {
            Array.from(gantt.foregroundCanvas.querySelectorAll('.b-sch-dependency')).forEach(dep => {
                t.assertDependency(gantt, gantt.getDependencyForElement(dep));
            });
        }

        let dependenciesDrawn = false,
            scrollEnded       = false;

        t.chain(
            { waitForPropagate : gantt },
            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },
            next => {
                assertRenderedTasks();

                gantt.on({
                    'dependenciesDrawn' : () => dependenciesDrawn = true,
                    once                : true
                });

                gantt.scrollable.on({
                    'scrollend' : () => scrollEnded = true,
                    once        : true
                });

                t.diag('Scrolling down to 1000px');

                gantt.scrollTop = 1000;

                next();
            },

            { waitFor : () => dependenciesDrawn && scrollEnded, desc : 'Scroll ended & dependencies are redrawn' },

            next => {
                assertRenderedTasks();

                assertDependencies();

                dependenciesDrawn = false;
                scrollEnded       = false;

                gantt.on({
                    'dependenciesDrawn' : () => dependenciesDrawn = true,
                    once                : true
                });

                gantt.scrollable.on({
                    'scrollend' : () => scrollEnded = true,
                    once        : true
                });

                t.diag('Scrolling up to 0px');

                gantt.scrollTop = 0;

                next();
            },

            { waitFor : () => dependenciesDrawn && scrollEnded, desc : 'Scroll ended & dependencies are redrawn' },

            next => {
                assertRenderedTasks();

                assertDependencies();
            }
        );
    });

    t.it('Should render tasks properly after tree node removal', t => {
        gantt = t.getGantt({
            appendTo : document.body
        });

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                gantt.taskStore.getById(3).remove();

                Array.from(document.querySelectorAll('.b-sch-timeaxis-cell')).forEach(el => {
                    let task = gantt.getRecordFromElement(el);
                    assertTask(t, task);
                });

                await gantt.collapse(gantt.taskStore.getById(2));

                gantt.taskStore.getById(22).remove();
            },
            { waitForPropagate : gantt },
            { waitForSelectorNotFound : '.b-animating' },
            async() => {
                Array.from(document.querySelectorAll('.b-sch-timeaxis-cell')).forEach(el => {
                    let task = gantt.getRecordFromElement(el);
                    assertTask(t, task);
                });
            }
        );
    });

    t.it('Should add task below', t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            tasks                 : [
                {
                    id        : 1,
                    name      : 'Project A',
                    startDate : '2017-01-16',
                    duration  : 5,
                    expanded  : true,
                    children  : [
                        {
                            id        : 11,
                            name      : 'Child 1',
                            startDate : '2017-01-16',
                            duration  : 5,
                            leaf      : true,
                            cls       : 'child1'
                        }
                    ]
                },
                {
                    id        : 2,
                    name      : 'Project B',
                    startDate : '2017-01-16',
                    duration  : 5
                },
                {
                    id        : 3,
                    name      : 'Project C',
                    startDate : '2017-01-17',
                    duration  : 4
                }
            ],
            dependencies : [],
            columns      : [
                { type : 'wbs' },
                { type : 'name' }
            ]
        });

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                gantt.addTaskBelow(getTask(11));
                return gantt.project.waitForPropagateCompleted();
            },
            { waitFor : () => document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 5, desc : 'Rows are ok' },
            async() => {
                t.isDeeply(
                    Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(el => el.textContent),
                    ['1', '1.1', '1.2', '2', '3']
                );

                gantt.addTaskBelow(getTask(11));
                return gantt.project.waitForPropagateCompleted();
            },
            { waitFor : () => document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 6, desc : 'Rows are ok' },
            async() => {
                t.isDeeply(
                    Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(el => el.textContent),
                    ['1', '1.1', '1.2', '1.3', '2', '3']
                );

                gantt.addTaskBelow(getTask(11));
                return gantt.project.waitForPropagateCompleted();
            },
            { waitFor : () => document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 7, desc : 'Rows are ok' },
            async() => {
                t.isDeeply(
                    Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(el => el.textContent),
                    ['1', '1.1', '1.2', '1.3', '1.4', '2', '3']
                );
            }
        );
    });

    t.it('Should add task above/below milestone', t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            startDate             : '2019-05-27',
            endDate               : '2019-06-01',
            project               : new ProjectModel({
                eventsData : [
                    {
                        id        : 1,
                        name      : 'Project A',
                        startDate : '2019-05-27',
                        duration  : 2,
                        expanded  : true,
                        children  : [
                            {
                                id        : 11,
                                name      : 'Child 11',
                                startDate : '2019-05-27',
                                duration  : 2,
                                leaf      : true
                            },
                            {
                                id        : 12,
                                name      : 'Child 12',
                                startDate : '2019-05-29',
                                duration  : 0,
                                leaf      : true
                            }
                        ]
                    },
                    {
                        id        : 2,
                        name      : 'Project B',
                        startDate : '2019-05-27',
                        duration  : 5
                    }
                ],
                calendarsData : [
                    {
                        'id'        : 'general',
                        'name'      : 'General',
                        'intervals' : [
                            {
                                'recurrentStartDate' : 'on Fri at 17:00',
                                'recurrentEndDate'   : 'on Mon at 9:00',
                                'isWorking'          : false
                            }
                        ]
                    }
                ],
                dependenciesData : [
                    { fromEvent : 11, toEvent : 12 }
                ],
                calendar : 'general'
            }),
            columns : [
                { type : 'wbs' },
                { type : 'name' }
            ],
            features : {
                taskContextMenu : true
            }
        });

        let task1, task2, task3;

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                task1 = await gantt.addTaskBelow(getTask(12));

                t.is(task1.startDate, new Date(2019, 4, 27), 'Start date ok');
                t.is(task1.endDate, new Date(2019, 4, 27), 'End date ok');
                t.is(task1.duration, 0, 'Duration date ok');
            },
            { waitFor : () => document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 5, desc : 'Rows are ok' },
            async() => {
                t.isDeeply(
                    Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(el => el.textContent),
                    ['1', '1.1', '1.2', '1.3', '2']
                );

                task2 = await gantt.addTaskBelow(getTask(12));

                t.is(task2.startDate, new Date(2019, 4, 27), 'Start date ok');
                t.is(task2.endDate, new Date(2019, 4, 27), 'End date ok');
                t.is(task2.duration, 0, 'Duration date ok');
            },
            { waitFor : () => document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 6, desc : 'Rows are ok' },
            async() => {
                t.isDeeply(
                    Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(el => el.textContent),
                    ['1', '1.1', '1.2', '1.3', '1.4', '2']
                );

                task3 = await gantt.addTaskAbove(getTask(12));

                t.is(task3.startDate, new Date(2019, 4, 27), 'Start date ok');
                t.is(task3.endDate, new Date(2019, 4, 27), 'End date ok');
                t.is(task3.duration, 0, 'Duration date ok');
            },
            { waitFor : () => document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 7, desc : 'Rows are ok' },
            async() => {
                t.isDeeply(
                    Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(el => el.textContent),
                    ['1', '1.1', '1.2', '1.3', '1.4', '1.5', '2']
                );

                [task1, task2, task3].forEach(record => {
                    t.is(record.startDate, new Date(2019, 4, 27), 'Start date ok');
                    t.is(record.endDate, new Date(2019, 4, 27), 'End date ok');
                    t.is(record.duration, 0, 'Duration date ok');
                });
            }
        );
    });

    t.it('Appending new task should not cause scheduling conflict', t => {
        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : '2019-05-20',
            endDate   : '2019-05-27',
            project   : {
                startDate : '2019-05-20',
                tasksData : [
                    {
                        id        : 1,
                        name      : 'Project A',
                        startDate : '2019-05-20',
                        duration  : 1,
                        expanded  : true,
                        children  : [
                            {
                                id        : 11,
                                name      : 'Task 11',
                                startDate : '2019-05-20',
                                duration  : 1
                            },
                            {
                                id        : 12,
                                name      : 'Task 12',
                                startDate : '2019-05-21',
                                expanded  : true,
                                children  : [
                                    {
                                        id        : 121,
                                        name      : 'task 121',
                                        startDate : '2019-05-21',
                                        duration  : 1
                                    }
                                ]
                            }
                        ]
                    }
                ],
                dependenciesData : [
                    { id : 1, fromEvent : 11, toEvent : 12 }
                ]
            }
        });

        t.wontFire(gantt.project, 'schedulingconflict');

        // we added listener, we have to continue propagation
        gantt.project.on('schedulingconflict', ({ continueWithResolutionResult }) => {
            continueWithResolutionResult();
        });

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                const task = await gantt.addTaskBelow(gantt.taskStore.getById(121));

                t.is(task.startDate, new Date(2019, 4, 21), 'Task start is ok');
                t.is(task.endDate, new Date(2019, 4, 22), 'Task end is ok');
                t.is(task.duration, 1, 'Task duration is ok');
            }
        );
    });

    t.it('Gantt tasks should animate to new state when modified', async t => {
        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : '2019-07-07',
            endDate   : '2019-07-29',
            project   : {
                startDate  : '2019-07-07',
                duration   : 30,
                eventsData : [
                    {
                        id       : 1,
                        name     : 'Project A',
                        duration : 30,
                        expanded : true,
                        children : [
                            {
                                id       : 11,
                                name     : 'Child 1',
                                duration : 5,
                                leaf     : true,
                                cls      : 'child1'
                            }
                        ]
                    }
                ]
            }
        });

        const
            project = gantt.project,
            task11 = gantt.taskStore.getById(11),
            task11El = gantt.getElementFromTaskRecord(task11);

        let startTask11Rect, expectedTask11Data, startTime;

        t.chain(
            { waitForPropagate : project },

            // Wait for initial animation to be over
            { waitForSelectorNotFound : '.b-animating' },

            async() => {
                t.diag('Change position of task 11');

                // Capture start position
                startTask11Rect = Rectangle.from(task11El, gantt.timeAxisSubGridElement);

                // Make a long transition so we can determine that it moves slowly
                CSSHelper.insertRule('.b-animating .b-gantt-task-wrap { transition-duration: 5s !important; }');
                gantt.transitionDuration = 5000;

                // When we hit the end condition, *approx* 5000ms must have elapsed from here
                startTime = performance.now();

                // Move task into future and make it longer
                task11.set({
                    startDate : '2019-07-15',
                    endDate   : '2019-07-27',
                    duration  : 10
                });

                project.propagate();
            },

            // Wait for corrected data to get to the task
            { waitForPropagate : project },

            next => {
                let r = Rectangle.from(task11El, gantt.timeAxisSubGridElement);

                // It must not start moving until the next AF
                t.is(r.x, startTask11Rect.x, 'Task has not started moving');
                t.is(r.width, startTask11Rect.width, 'Task has not started changing width');
                next();
            },

            { waitFor : 500 },

            // After 500 ms, it must not have moved to its final position
            next => {
                // Calculate the final position where it will animate to.
                expectedTask11Data = gantt.currentOrientation.getTimeSpanRenderData(task11, task11);

                let r = Rectangle.from(task11El, gantt.timeAxisSubGridElement);
                t.isLess(r.x, expectedTask11Data.left, 'Task has not reached its final position');
                t.isLess(r.width, expectedTask11Data.width, 'Task has not reached its funal width');
                next();
            },

            // Wait for final position and width to happen.
            {
                waitFor : () => {
                    let r = Rectangle.from(task11El, gantt.timeAxisSubGridElement);
                    
                    return r.x === expectedTask11Data.left && r.width === expectedTask11Data.width;
                },
                desc : 'Task has reached its final position and width'
            },

            // It must have taken Approx 5 seconds to get here
            () => {
                // .7 second margin due to slow test platforms
                t.isApprox(performance.now(), startTime + 5000, 700, 'Transition took correct time');
            }
        );
    });
});
