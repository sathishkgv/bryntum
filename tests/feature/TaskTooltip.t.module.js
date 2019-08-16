import { Gantt } from '../../build/gantt.module.js?433978';

StartTest(t => {
    let gantt;

    Object.assign(window, {
        Gantt
    });

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should show task tooltip when hovering task', t => {
        gantt = t.getGantt({
            appendTo                 : document.body,
            durationDisplayPrecision : 0
        });

        const task = gantt.taskStore.getById(11);

        task.duration = 2.5;

        t.chain(
            // First down to the row
            { moveMouseTo : '.id11' },
            // Then out to the task, to not get any other tooltip in the way
            { moveMouseTo : '.b-gantt-task.id11' },

            { waitForSelector : '.b-gantt-task-tooltip' },

            () => {
                t.is(document.querySelector('.b-gantt-task-title').innerText, task.name, 'Correct title');
                t.is(document.querySelector('.b-tooltip .b-right').innerText, '3 days', 'Respected durationDisplayPrecision');
            }
        );
    });
});
