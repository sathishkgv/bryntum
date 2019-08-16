StartTest(t => {
    const
        gantt = bryntum.query('gantt'),
        task  = gantt.taskStore.getById(15);

    t.chain(
        { dblclick : () => gantt.getElementFromTaskRecord(task) },

        { click : '.b-colorfield .b-icon-picker' },

        { click : '.b-color-picker-item[data-id=red]' },

        { click : '.b-button:contains(Save)' },

        {
            waitFor : () => {
                const element = gantt.getElementFromTaskRecord(task);
                return window.getComputedStyle(element).backgroundColor === 'rgb(255, 0, 0)';
            }
        },

        () => {
            t.pass('Color changed');
        }
    );
});
