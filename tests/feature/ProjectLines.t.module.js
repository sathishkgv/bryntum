StartTest(t => {
    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should show project lines by default', t => {
        gantt = t.getGantt({
            appendTo : document.body,

            columns : [
                { type : 'name', field : 'name', text : 'Name', width : 250 }
            ]
        });

        t.chain(
            { waitForSelector : '.b-grid-headers .b-sch-line label:contains(Project start)' },
            { waitForSelector : '.b-grid-headers .b-sch-line label:contains(Project end)' }
        );
    });

    t.it('Should not show project lines if disabled', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                projectLines : false
            },

            columns : [
                { type : 'name', field : 'name', text : 'Name', width : 250 }
            ]
        });

        t.chain(
            { waitForRowsVisible : gantt },

            () => {
                t.selectorNotExists('.b-grid-headers .b-sch-line label:contains(Project start)');
                t.selectorNotExists('.b-grid-headers .b-sch-line label:contains(Project end)');
            }
        );
    });

    t.it('Should update project lines correctly', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            tasks    : [
                {
                    id        : 1,
                    name      : 'task 1',
                    startDate : '2017-01-16',
                    duration  : 10
                }
            ],
            features : {
                projectLines : true
            }
        });

        const
            task    = gantt.taskStore.getById(1),
            project = gantt.project;

        function checkDates(startDate, endDate) {
            const
                [start, end] = gantt.features.projectLines.store.getRange();
            t.is(start.startDate, startDate, 'Line start is ok');
            t.is(project.startDate, startDate, 'Project start is ok');
            t.is(end.startDate, endDate, 'Line end is ok');
            t.is(project.endDate, endDate, 'Project end is ok');
        }

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-sch-timerange' },
            async() => checkDates(new Date(2017, 0, 16), new Date(2017, 0, 26)),
            async() => {
                await task.setConstraintType('muststarton');
                await task.setConstraintDate('2017-01-17');
                checkDates(new Date(2017, 0, 16), new Date(2017, 0, 27));
            },
            { dblclick : '.b-gantt-task' },
            { click : 'input[name=fullDuration]' },
            { type : '[UP][UP]' },
            async() => checkDates(new Date(2017, 0, 16),  new Date(2017, 0, 29)),
            { click : '.b-popup-close' },
            { waitForSelectorNotFound : '.b-taskeditor-editing' },
            () => checkDates(new Date(2017, 0, 16),  new Date(2017, 0, 27))
        );
    });

    // #8390 https://app.assembla.com/spaces/bryntum/tickets/8390
    t.it('Should update project lines correctly after undo', async t => {
        gantt = t.getGantt({
            appendTo : document.body,
            tasks    : [
                {
                    id        : 1,
                    name      : 'task 1',
                    startDate : '2017-01-16',
                    duration  : 10
                }
            ],
            features : {
                projectLines : true
            }
        });

        const
            project = gantt.project,
            stm     = project.getStm();

        let originalProjectStartDate,
            originalProjectEndDate;

        function checkDates(startDate, endDate) {
            const
                [start, end] = gantt.features.projectLines.store.getRange();
            t.is(start.startDate, startDate, 'Line start is ok');
            t.is(project.startDate, startDate, 'Project start is ok');
            t.is(end.startDate, endDate, 'Line end is ok');
            t.is(project.endDate, endDate, 'Project end is ok');
        }

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-sch-timerange' },
            { waitFor : 1000 },

            async()  => {
                checkDates(new Date(2017, 0, 16), new Date(2017, 0, 26));
                originalProjectStartDate = project.getStartDate();
                originalProjectEndDate   = project.getEndDate();
            },

            async() => {
                stm.enable();
                stm.startTransaction();
                await project.setStartDate(new Date(2017, 0, 17));
                stm.stopTransaction();
                checkDates(new Date(2017, 0, 17), new Date(2017, 0, 27));
            },

            () => {
                stm.undo();
                checkDates(originalProjectStartDate, originalProjectEndDate);
            }
        );
    });
});
