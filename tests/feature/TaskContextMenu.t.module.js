import { DateHelper, Gantt, ObjectHelper } from '../../build/gantt.module.js?433978';

StartTest(t => {
    let gantt;
    
    Object.assign(window, {
        Gantt
    });
    
    t.beforeEach(() => gantt && gantt.destroy());
    
    t.it('Basic context menu works', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            
            features : {
                taskTooltip     : false,
                taskContextMenu : {
                    items : {
                        moveLeft : {
                            text : 'Move left',
                            icon : 'b-fa b-fa-fw b-fa-arrow-left',
                            cls  : 'b-separator b-move-left',
                            onItem({ taskRecord }) {
                                taskRecord.setStartDate(DateHelper.add(taskRecord.startDate, -1, 'day'));
                            }
                        },
                        moveRight : {
                            text : 'Move right',
                            icon : 'b-fa b-fa-fw b-fa-arrow-right',
                            cls  : 'b-move-right',
                            onItem({ taskRecord }) {
                                taskRecord.setStartDate(DateHelper.add(taskRecord.startDate, 1, 'day'));
                            }
                        }
                    }
                }
            }
        });
        
        const targetTask = gantt.taskStore.getById(11);
        
        t.firesOk({
            observable : gantt,
            events     : {
                taskcontextmenubeforeshow : 6,
                taskcontextmenushow       : 5,
                taskcontextmenuitem       : 5
            }
        });
        
        gantt.on({
            taskcontextmenubeforeshow : () => false,
            once                      : true
        });
        
        const listeners = {
            taskcontextmenubeforeshow : ({ source, items, taskRecord }) => {
                t.describe('Assert taskcontextmenubeforeshow event', t => {
                    t.is(source, gantt, 'Source is ok');
                    t.is(ObjectHelper.getTruthyKeys(items).length, 5, '5 menu items');
                    t.is(taskRecord, taskRecord, 'Target task is ok');
                });
            },
            taskcontextmenushow : ({ source, taskRecord, taskElement }) => {
                t.describe('Assert taskcontextmenushow event', t => {
                    t.is(source, gantt, 'Source is ok');
                    t.is(taskRecord, targetTask, 'Target task is ok');
                    t.is(taskElement, gantt.getElementFromTaskRecord(targetTask).parentElement, 'Element is ok');
                });
            },
            taskcontextmenuitem : ({ source, item, taskRecord }) => {
                t.describe('Assert taskcontextmenuitem event', t => {
                    t.is(source, gantt, 'Source is ok');
                    t.is(item.text, 'Move right', 'Item is ok');
                    t.is(taskRecord, targetTask, 'Target task is ok');
                });
            },
            once : true
        };
        
        let task;
        
        t.chain(
            { contextmenu : '.b-gantt-task.id11', desc : 'First menu is cancelled' },
            next => {
                gantt.on(listeners);
                next();
            },
            { contextmenu : '.b-gantt-task.id11', desc : 'Move one day right' },
            { click : '.b-move-right' },
            { waitForPropagate : gantt },
            next => {
                t.is(targetTask.startDate, new Date(2017, 0, 17), 'Start date moved');
                next();
            },
            { contextmenu : '.b-gantt-task.id11', desc : 'Move one day left' },
            { click : '.b-move-left' },
            { waitForPropagate : gantt },
            next => {
                t.is(targetTask.startDate, new Date(2017, 0, 16), 'Start date moved');
                next();
            },
            { contextmenu : '.b-gantt-task.id11' },
            { moveMouseTo : '.b-icon-add', offset : [130, 0] },
            { click : '.b-icon-up', desc : 'Add task above' },
            next => {
                task = gantt.taskStore.changes.added[0];
                task.cls = 'task1';
                next();
            },
            { contextmenu : '.b-gantt-task.task1' },
            { moveMouseTo : '.b-icon-add', offset : [130, 0] },
            { click : '.b-icon-down' },
            next => {
                let [task1, task2] = gantt.taskStore.changes.added;

                t.is(task1.startDate, targetTask.startDate, 'New task 1 start date is ok');
                t.is(task2.startDate, targetTask.startDate, 'New task 2 start date is ok');

                next();
            },
            { contextmenu : '.b-gantt-task.task1' },
            { click : '.b-icon-edit' },
            { waitForSelector : '.b-contains-focus input' },
            { type : 'foo[ENTER]' },
            next => {
                t.is(task.name, 'New task 1foo', 'Task name is ok');
                next();
            }
        );
    });
    
    t.it('Should be possible to trigger menu using API', t => {
        gantt = t.getGantt({
            appendTo : document.body,
        
            features : {
                taskTooltip     : false,
                taskContextMenu : true
            }
        });
        
        let menu = gantt.features.taskContextMenu,
            getTask = id => gantt.taskStore.getById(id);
        
        gantt.collapse(getTask(23));
        
        t.chain(
            { waitForSelector : '.b-gantt-task' },
            next => {
                let task = getTask(12);
                menu.showContextMenuFor(task);
                t.selectorCountIs('.b-menu-item', 0, 'Menu was not opened');
                
                task = getTask(231);
                menu.showContextMenuFor(task);
                t.selectorCountIs('.b-menu-item', 0, 'Menu was not opened');
                
                task = getTask(21);
                t.waitForEvent(gantt, 'taskcontextmenushow', next);
                menu.showContextMenuFor(task);
            },
            next => {
                t.selectorCountIs('.b-menu', 1, 'Task context menu appears');
                const
                    taskBox = gantt.getElementFromTaskRecord(getTask(21)).getBoundingClientRect(),
                    menuBox = document.querySelector('.b-menu').getBoundingClientRect();
                
                t.ok(taskBox.left < menuBox.left && taskBox.right > menuBox.left, 'Menu is aligned horizontally');
                t.ok(taskBox.top < menuBox.top && taskBox.bottom > menuBox.top, 'Menu is aligned vertically');
                next();
            }
        );
    });
});
