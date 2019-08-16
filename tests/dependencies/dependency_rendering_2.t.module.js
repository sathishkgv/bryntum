StartTest(t => {
    let gantt;
    
    t.beforeEach(() => {
        gantt && gantt.destroy();
    });
    
    t.it('Should render dependencies regardless of barMargin size', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            tasks    : [
                {
                    id                : 1,
                    name              : 'Task 1',
                    startDate         : '2017-01-23',
                    manuallyScheduled : true,
                    duration          : 1
                },
                {
                    id                : 2,
                    name              : 'Task 2',
                    startDate         : '2017-01-24',
                    manuallyScheduled : true,
                    duration          : 1
                },
                {
                    id                : 3,
                    name              : 'Task 3',
                    cls               : 'task3',
                    startDate         : '2017-01-26',
                    manuallyScheduled : true,
                    duration          : 0
                }
            ],
            dependencies : [
                { id : 1, fromEvent : 1, toEvent : 2 },
                { id : 2, fromEvent : 1, toEvent : 3 }
            ]
        });
        
        const dependencies = gantt.dependencies;
        
        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-task' },
            next => {
                dependencies.forEach(dep => t.assertDependency(gantt, dep));
                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                gantt.barMargin = 13;
            },
            next => {
                dependencies.forEach(dep => t.assertDependency(gantt, dep));
                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                gantt.barMargin = 17;
            },
            next => {
                dependencies.forEach(dep => t.assertDependency(gantt, dep));
            }
        );
    });
    
    t.it('Should not throw for invalid assignments', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                dependencies : true
            },
            resources : [
                { id : 1, name : 'Albert' }
            ],
            tasks : [
                { id : 1, startDate : '2017-01-16', duration : 2 }
            ],
            assignments : [
                { id : 1, resourceId : 1, eventId : 1 }
            ]
        });
        
        t.livesOk(() => {
            gantt.project.getAssignmentStore().add([
                { id : 2, resourceId : 1, eventId : 2 },
                { id : 3, resourceId : 2, eventId : 1 },
                { id : 4, resourceId : 2, eventId : 2 }
            ]);
        }, 'Lives ok when adding assignment to non existent dependency');
    });
    
    t.it('Should correctly draw dependencies on task add/remove', t => {
        gantt = t.getGantt({
            appendTo : document.body
        });
        
        const
            stm = gantt.project.stm,
            taskStore = gantt.taskStore;
        
        t.chain(
            { waitForPropagate : gantt },
            next => {
                stm.enable();
                
                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                
                stm.startTransaction('remove');
                taskStore.getById(12).remove();
                stm.stopTransaction('remove');
            },
            { waitForPropagate : gantt },
            { waitForSelectorNotFound : '.b-animating' },
            next => {
                t.subTest('Dependencies are ok after removing task', t => {
                    gantt.dependencies.forEach(dep => t.assertDependency(gantt, dep));
                });
                
                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                stm.undo();
            },
            { waitForSelectorNotFound : '.b-animating' },
            next => {
                t.subTest('Dependencies are ok after undo', t => {
                    gantt.dependencies.forEach(dep => t.assertDependency(gantt, dep));
                });

                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                stm.startTransaction();
                taskStore.beginBatch();
                taskStore.getById(12).remove();
                taskStore.getById(1).appendChild({ name : 'test' });
                taskStore.endBatch();
                stm.stopTransaction();
            },
            next => {
                t.subTest('Dependencies are ok after batching', t => {
                    gantt.dependencies.forEach(dep => t.assertDependency(gantt, dep));
                });

                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                stm.undo();
            },
            next => {
                t.subTest('Dependencies are ok after undo', t => {
                    gantt.dependencies.forEach(dep => t.assertDependency(gantt, dep));
                });
            }
        );
    });
});
