/*KEEP*/import { Grid } from 'https://bryntum.com/examples/build/grid.module.js';
/*KEEP*/import { Scheduler } from 'https://bryntum.com/examples/build/scheduler.module.js';
/*KEEP*/import { Gantt } from '../../build/gantt.module.js?433978';

// NOTE: Any changes here should also be applied to grid-and-scheduler-module.t.js

StartTest(t => {
    t.ok(Grid, 'Grid available');
    t.ok(Scheduler, 'Scheduler available');
    t.ok(Gantt, 'Gantt available');

    new Grid({
        appendTo : document.body,
        id       : 'grid',
        width    : 1024,
        height   : 300,
        columns  : [
            { field : 'name', text : 'Name' }
        ],
        data : [
            { name : 'Mr Fantastic' }
        ]
    });

    new Scheduler({
        appendTo  : document.body,
        id        : 'scheduler',
        width     : 1024,
        height    : 300,
        resources : [
            { id : 1, name : 'The Thing' }
        ],
        startDate : new Date(2019, 4, 1),
        endDate   : new Date(2019, 4, 31),
        events    : [
            { resourceId : 1, startDate : new Date(2019, 4, 21), duration : 2 }
        ]
    });

    new Gantt({
        appendTo : document.body,
        id       : 'gantt'
    });

    t.selectorExists('.b-grid#grid', 'Grid element found');
    t.selectorExists('.b-scheduler#scheduler', 'Scheduler element found');
    t.selectorExists('.b-gantt#gantt', 'Gantt element found');

    t.selectorCountIs('.b-float-root', 1, 'Single float root');

    t.notOk('BUNDLE_EXCEPTION' in window, 'No exception from including both');
});
