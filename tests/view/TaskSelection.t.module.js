import { ProjectGenerator } from '../../build/gantt.module.js?433978';

StartTest(t => {
    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    function checkSelected(t, id) {
        t.ok(gantt.getElementFromTaskRecord(gantt.taskStore.getById(id)).classList.contains('b-task-selected'), `Task ${id} has .b-task-selected class`);
    }

    function checkUnselected(t, id) {
        t.notOk(gantt.getElementFromTaskRecord(gantt.taskStore.getById(id)).classList.contains('b-task-selected'), `Task ${id} has no .b-task-selected class`);
    }

    t.it('Should select task on row select', t => {
        gantt = t.getGantt({
            appendTo                 : document.body,
            durationDisplayPrecision : 0
        });

        t.chain(
            async() => {
                checkUnselected(t, '1');
            },

            { click : '.b-grid-row.id1', desc : 'Click on row' },

            { waitForSelector : '.b-task-selected' },

            async() => {
                checkSelected(t, '1');
            },

            { click : '.b-grid-subgrid-normal .b-grid-row.id11', desc : 'Click empty space' },
            async() => {
                checkUnselected(t, '1');
                checkSelected(t, '11');
            }
        );
    });

    t.it('Should select row on task click', t => {
        gantt = t.getGantt({
            appendTo                 : document.body,
            durationDisplayPrecision : 0
        });

        t.chain(
            async() => {
                checkUnselected(t, '1');
            },

            { click : '[data-task-id="12"]', desc : 'Click on task' },
            async() => {
                checkSelected(t, '12');
            },

            { click : '[data-task-id="13"]',  options : { metaKey : true, ctrlKey : true },  desc : 'Multiselect with ctrl click on task' },

            async() => {
                checkSelected(t, '12');
                checkSelected(t, '13');
            }
        );
    });

    t.it('Should select task and not scroll on empty space click', async(t) => {
        const config = await ProjectGenerator.generateAsync(100, 30, () => {});
        gantt = t.getGantt({
            appendTo  : document.body,
            project   : config,
            startDate : config.startDate,
            endDate   : config.endDate
        });

        gantt.subGrids.normal.scrollable.x = 300;

        t.chain(
            { click : '.b-grid-subgrid-normal .b-grid-row[data-index="1"]' },

            { waitForSelector : '.b-task-selected' },

            (next) => {
                checkSelected(t, '2');
                t.is(gantt.subGrids.normal.scrollable.x, 300, 'Scroll position preserved');
                next();
            },

            { click : '.b-grid-subgrid-normal .b-grid-row[data-index="2"]' },

            (next) => {
                t.is(gantt.subGrids.normal.scrollable.x, 300, 'Scroll position preserved');

                // Scroll to check selecting invisible tasks below
                gantt.subGrids.normal.scrollable.y = 1800;
                t.notOk(gantt.getElementFromTaskRecord(gantt.taskStore.getById('58')), 'Task is not rendered');
                next();
            },

            { click : '.b-grid-row[data-index="52"]' },

            (next) => {
                // Scroll to make task visible
                gantt.subGrids.normal.scrollable.x = 1000;
                next();
            },

            () => {
                checkSelected(t, '58');
            }
        );
    });

});
