import { Gantt } from '../../build/gantt.module.js?433978';

StartTest(t => {
    let gantt;

    Object.assign(window, {
        Gantt
    });

    t.beforeEach(() => gantt && gantt.destroy());

    function assertPercentBarWidth(t, taskRecord) {
        const
            taskElement = gantt.getElementFromTaskRecord(taskRecord),
            percentBar = taskElement.querySelector(`.b-gantt-task-percent`),
            expectedWidth = taskElement.offsetWidth * taskRecord.percentDone / 100;

        t.isApprox(expectedWidth, percentBar.offsetWidth, `Correct percent bar width for ${taskRecord.name}, ${taskRecord.percentDone}%`);
    }

    t.it('Should render percent bars', t => {
        gantt = t.getGantt({
            appendTo : document.body
        });

        const taskElements = Array.from(document.querySelectorAll('.b-gantt-task-wrap:not(.b-milestone-wrap)'));

        t.selectorExists('.b-gantt-task-percent', 'Percent bar rendered');
        t.selectorCountIs('.b-gantt-task-percent', taskElements.length, 'One per normal task rendered');

        // Check all widths
        taskElements.forEach(taskElement => {
            assertPercentBarWidth(t, gantt.resolveTaskRecord(taskElement));
        });
    });

    t.it('Should update percent bar when data changes', async t => {
        gantt = t.getGantt({
            appendTo : document.body
        });

        const task = gantt.taskStore.getById(11);

        await task.setPercentDone(10);

        assertPercentBarWidth(t, task);

        await task.setPercentDone(90);

        assertPercentBarWidth(t, task);

        await task.setPercentDone(100);

        assertPercentBarWidth(t, task);
    });

    t.it('Should set percent to 0 if dragging fully to the start of the bar', async t => {
        gantt = t.getGantt({
            appendTo : document.body
        });

        const task = gantt.taskStore.getById(11);

        task.cls = 'foo';

        await task.setDuration(1);
        await task.setPercentDone(10);

        t.chain(
            { moveCursorTo : '.foo.b-gantt-task' },
            { drag : '.foo .b-gantt-task-percent-handle', by : [-100, 0] },
            { waitForPropagate : gantt.project },

            () => {
                t.is(task.percentDone, 0);
            }
        )
    });
});
