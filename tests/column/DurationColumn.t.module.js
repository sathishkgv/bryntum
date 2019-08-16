import { DurationColumn, NameColumn } from '../../build/gantt.module.js?433978';
/* global ProjectModel */

StartTest((t) => {
    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should render duration', (t) => {
        const project = new ProjectModel({
            startDate  : '2017-01-16',
            eventsData : [
                {
                    'id'          : 1,
                    'cls'         : 'id1',
                    'name'        : 'Planning',
                    'percentDone' : 60,
                    'startDate'   : '2017-01-16',
                    'duration'    : 10,
                    'expanded'    : true,
                    'rollup'      : true,
                    'children'    : [
                        {
                            'id'           : 11,
                            'cls'          : 'id11',
                            'name'         : 'Investigate',
                            'percentDone'  : 70,
                            'startDate'    : '2017-01-16',
                            'duration'     : 10,
                            'durationUnit' : 'day'
                        },
                        {
                            'id'           : 12,
                            'cls'          : 'id12',
                            'name'         : 'Assign resources',
                            'percentDone'  : 60,
                            'startDate'    : '2017-01-16',
                            'duration'     : 8,
                            'durationUnit' : 'minute'
                        },
                        {
                            'id'          : 13,
                            'cls'         : 'id13',
                            'name'        : 'Assign resources',
                            'percentDone' : 60,
                            'startDate'   : '2017-01-16'
                        }
                    ]
                }
            ]
        });

        gantt = t.getGantt({
            appendTo : document.body,
            height   : 300,
            project  : project,
            columns  : [
                { type : NameColumn.type, width : 150 },
                { type : DurationColumn.type, width : 150 }
            ]
        });

        t.chain(
            { waitForPropagate : project },

            { waitForSelector : '.b-number-cell:textEquals(10 days)' },
            { waitForSelector : '.b-number-cell:textEquals(8 minutes)' },
            { waitForSelector : '.b-grid-row:last-child .b-number-cell:empty' }
        );
    });

    t.it('Should not be allowed to edit duration on parents', t => {
        const project = new ProjectModel({
            startDate  : '2017-01-16',
            eventsData : [
                {
                    'id'          : 1,
                    'name'        : 'Planning',
                    'percentDone' : 60,
                    'startDate'   : '2017-01-16',
                    'duration'    : 10,
                    'expanded'    : true,
                    'children'    : [
                        {
                            'id'           : 11,
                            'name'         : 'Investigate',
                            'percentDone'  : 70,
                            'startDate'    : '2017-01-16',
                            'duration'     : 10,
                            'durationUnit' : 'day'
                        }
                    ]
                }
            ]
        });

        gantt = t.getGantt({
            appendTo : document.body,
            height   : 300,
            project  : project,
            columns  : [
                { type : NameColumn.type, width : 150 },
                { type : DurationColumn.type, width : 150 }
            ]
        });

        t.chain(
            { waitForPropagate : project },

            { dblClick : '.b-tree-parent-row [data-column=fullDuration]' },

            next => {
                t.selectorNotExists('.b-editor', 'No editor shown parent');
                next();
            },

            { dblClick : '.b-grid-row:not(.b-tree-parent-row) [data-column=fullDuration]' },

            { waitForSelector : '.b-editor', desc : 'Editor shown for child' }
        );
    });
});
