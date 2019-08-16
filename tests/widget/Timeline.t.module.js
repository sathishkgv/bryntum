import { Timeline } from '../../build/gantt.module.js?433978';

StartTest((t) => {
    let timeline,
        project = t.getProject();

    t.beforeEach((t) => {
        timeline && timeline.destroy();
        timeline = null;

        project = t.getProject({
            eventsData : [
                {
                    'id'             : 11,
                    'cls'            : 'id11',
                    'name'           : 'Investigate',
                    'percentDone'    : 70,
                    'startDate'      : '2017-01-16',
                    'duration'       : 10,
                    'schedulingMode' : 'FixedDuration'
                },
                {
                    'id'             : 12,
                    'cls'            : 'id12',
                    'name'           : 'Assign resources',
                    'percentDone'    : 60,
                    'startDate'      : '2017-01-16',
                    'duration'       : 8,
                    'schedulingMode' : 'FixedUnits'
                },
                {
                    'id'                : 13,
                    'name'              : 'Future',
                    'percentDone'       : 50,
                    'startDate'         : '2019-02-03T00:00:00',
                    'duration'          : 1,
                    'manuallyScheduled' : true,
                    'schedulingMode'    : 'FixedEffort'
                }
            ]
        });
    });

    async function createTimeLine(config) {
        timeline = new Timeline(Object.assign({
            appendTo : document.body,
            width    : 700,
            project
        }, config));
        await project.waitForPropagateCompleted();
    }

    t.it('Should size row height based on available subGrid body height', async(t) => {
        await createTimeLine();

        t.chain(
            { waitFor : () => timeline.rowHeight === timeline.bodyContainer.offsetHeight, desc : 'Correct row height' }
        );
    });

    t.it('Should show timeline start / end even if no tasks are marked showInTimeline', async(t) => {
        await createTimeLine();

        t.contentLike('.b-timeline-startdate', timeline.getFormattedDate(timeline.startDate), 'Start date label has correct value');
        t.contentLike('.b-timeline-enddate', timeline.getFormattedDate(timeline.endDate), 'End date label has correct value');
    });

    t.it('Should refresh on new task added', async(t) => {
        await createTimeLine();

        project.taskStore.rootNode.appendChild({
            'name'           : 'Foo',
            'startDate'      : '2017-01-16',
            'endDate'        : '2017-01-26',
            'duration'       : 10,
            'showInTimeline' : true
        });

        await project.propagate();

        t.contentLike('.b-timeline-startdate', timeline.getFormattedDate(timeline.startDate), 'Start date label has correct value');
        t.contentLike('.b-timeline-enddate', timeline.getFormattedDate(timeline.endDate), 'End date label has correct value');

        t.chain(
            { waitForSelector : '.b-sch-event:contains(Foo)' }
        );
    });

    t.it('Should refresh on task removed', async(t) => {
        await createTimeLine();

        project.taskStore.getById(11).showInTimeline = true;

        t.chain(
            { waitForSelector : '.b-sch-event:contains(Investigate)' },

            async() => {
                t.contentLike('.b-timeline-startdate', timeline.getFormattedDate(timeline.startDate), 'Start date label has correct value');
                t.contentLike('.b-timeline-enddate', timeline.getFormattedDate(timeline.endDate), 'End date label has correct value');
                project.taskStore.getById(11).remove();
            },

            { waitForSelectorNotFound : '.b-sch-event:contains(Investigate)' }
        );
    });

    t.it('Should refresh on task showInTimeline updated', async(t) => {
        await createTimeLine();

        project.taskStore.getById(11).showInTimeline = true;

        t.chain(
            { waitForSelector : '.b-sch-event:contains(Investigate)' },

            async()  => {
                t.contentLike('.b-timeline-startdate', timeline.getFormattedDate(timeline.startDate), 'Start date label has correct value');
                t.contentLike('.b-timeline-enddate', timeline.getFormattedDate(timeline.endDate), 'End date label has correct value');
                project.taskStore.getById(11).showInTimeline = false;
            },

            { waitForSelectorNotFound : '.b-sch-event:contains(Investigate)' }
        );
    });

    t.it('Should refresh on task start/duration/ updated', async(t) => {
        await createTimeLine();

        const task = project.taskStore.getById(11);
        task.showInTimeline = true;

        t.chain(
            { waitForSelector : '.b-sch-event:contains(Investigate)' },
            async() => task.setDuration(1),
            { waitFor : () => timeline.eventStore.getById(task.id).duration === 1 }
        );
    });

    t.it('Should extend timeline if new task appears outside current range', async(t) => {
        await createTimeLine();

        project.taskStore.getById(13).showInTimeline = true;

        t.chain(
            { waitForSelector : '.b-sch-event:contains(Future)' },
            () => {
                t.contentLike('.b-timeline-startdate', timeline.getFormattedDate(timeline.startDate), 'Start date label has correct value');
                t.contentLike('.b-timeline-enddate', timeline.getFormattedDate(timeline.endDate), 'End date label has correct value');
                t.is(timeline.endDate.getFullYear(), 2019, 'Time axis extended');
            }
        );
    });

});
