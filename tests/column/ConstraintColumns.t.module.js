
StartTest(t => {

    let gantt;

    t.beforeEach(t => {
        gantt && !gantt.isDestroyed && gantt.destroy();

        gantt = t.getGantt({
            appendTo : document.body,

            id : 'gantt',

            columns : [
                { type : 'constraintdate' },
                { type : 'constrainttype' }
            ],

            tasks : [
                {
                    id             : 1,
                    cls            : 'id1',
                    name           : 'Project Nodlehs',
                    expanded       : true,
                    constraintDate : '2017-01-18',
                    constraintType : 'muststarton',
                    children       : [
                        {
                            id             : 11,
                            cls            : 'id11',
                            startDate      : '2017-01-16',
                            endDate        : '2017-01-18',
                            name           : 'Organize manpower',
                            constraintDate : '2017-01-16',
                            constraintType : 'startnoearlierthan',
                            leaf           : true
                        },
                        {
                            id             : 12,
                            startDate      : '2017-01-16',
                            endDate        : '2017-01-18',
                            name           : 'Figure out name',
                            constraintDate : '2017-01-16',
                            constraintType : 'startnoearlierthan',
                            leaf           : true
                        }
                    ]
                }
            ]
        });

    });

    t.it('Should use Gantt#displayDateFormat by default', t => {
        t.chain(
            { waitForRowsVisible : gantt },

            () => {
                const date = gantt.getFormattedDate(gantt.taskStore.getById(11).constraintDate);

                t.selectorExists(`.id11 [data-column=constraintDate]:textEquals(${date})`, 'Constraint date rendered correctly');
            }
        );
    });

    t.it('Should update when Gantt#displayDateFormat changes', t => {
        t.chain(
            { waitForRowsVisible : gantt },

            () => {
                gantt.displayDateFormat = 'L';

                const date = gantt.getFormattedDate(gantt.taskStore.getById(11).constraintDate);

                t.selectorExists(`.id11 [data-column=constraintDate]:textEquals(${date})`, 'Constraint date rendered correctly');
            }
        );
    });

    t.it('Should be able to specify explicit format', t => {
        t.chain(
            { waitForRowsVisible : gantt },

            () => {
                gantt.columns.get('constraintDate').format = 'YYYY';

                const yyyy = gantt.taskStore.getById(11).constraintDate.getFullYear();

                t.selectorExists(`.id11 [data-column=constraintDate]:textEquals(${yyyy})`, 'Constraint date rendered correctly');
            }
        );
    });

    t.it('Should be able to change constraint type/date', t => {
        const firstTask = gantt.taskStore.first,
            lastTask    = gantt.taskStore.last;

        t.chain(
            async() => gantt.project.waitForPropagateCompleted(),

            { waitForRowsVisible : gantt },

            next => {
                t.notOk(firstTask.constraintType, 'Incorrect constraint type removed');
                next();
            },

            { diag : 'Change constraint type to SNET' },

            { dblclick : '.id1 [data-column=constraintType]', desc : 'Constraint type column dbl-clicked' },

            { type : 's[ENTER][ENTER]', desc : 'Typed "s" to pick start no earlier than' },

            async() => gantt.project.waitForPropagateCompleted(),

            next => {
                t.is(firstTask.constraintDate, new Date(2017, 0, 16), 'First task constraint date is ok');
                t.is(firstTask.startDate, new Date(2017, 0, 16), 'First task start is ok');
                t.is(lastTask.startDate, new Date(2017, 0, 16), 'Last task start is ok');
                next();
            },

            { diag : 'Move constraint date further' },

            { dblclick : '.id1 [data-column=constraintDate]', desc : 'Constraint type column dbl-clicked' },

            { type : 'Jan 19, 2017[ENTER]', desc : 'Typed "Jan 19, 2017"' },

            async() => gantt.project.waitForPropagateCompleted(),

            next => {
                t.is(firstTask.constraintDate, new Date(2017, 0, 19), 'First task constraint date is ok');
                t.is(firstTask.startDate, new Date(2017, 0, 19), 'First task start is ok');
                t.is(lastTask.startDate, new Date(2017, 0, 19), 'Last task start is ok');
                next();
            },

            { dblclick : '.id1 [data-column=constraintDate]', desc : 'Move constraint date back' },

            { type : 'Jan 16, 2017[ENTER]' },

            async() => gantt.project.waitForPropagateCompleted(),

            next => {
                t.is(firstTask.constraintDate, firstTask.startDate, 'First task start is ok');
                t.is(firstTask.constraintDate, lastTask.startDate, 'Last task start is ok');
                next();
            }
        );
    });

    t.it('Constraint type column should filter picker values for parents/leafs', t => {
        t.chain(
            async() => gantt.project.waitForPropagateCompleted(),

            { dblclick : '.id1 [data-column=constraintType]', desc : 'Edit parent' },

            { type : '[DOWN]' },

            next => {
                t.selectorCountIs('.b-list-item:textEquals(Must start on)', 0, 'Invalid constraint types are filtered');
                next();
            },

            { type : '[ESC]' },

            { dblclick : '.id11 [data-column=constraintType]', desc : 'Edit leaf' },

            { type : '[DOWN]' },

            next => {
                t.selectorCountIs('.b-list-item:textEquals(Must start on)', 1, 'MSO constraint are available');
                next();
            },

            { type : '[ESC]' },

            { dblclick : '.id1 [data-column=constraintType]', desc : 'Edit parent again' },

            { type : '[DOWN]' },

            next => {
                t.selectorCountIs('.b-list-item:textEquals(Must start on)', 0, 'Invalid constraint types are filtered');
                next();
            },

            { type : '[ESC]' }
        );
    });
});
