"use strict";

var _gridModule = require("https://bryntum.com/examples/build/grid.module.js");

var _schedulerModule = require("https://bryntum.com/examples/build/scheduler.module.js");

var _ganttModule = require("../../build/gantt.module.js");

/*KEEP*/

/*KEEP*/

/*KEEP*/
// NOTE: Any changes here should also be applied to grid-and-scheduler-module.t.js
StartTest(function (t) {
  t.ok(_gridModule.Grid, 'Grid available');
  t.ok(_schedulerModule.Scheduler, 'Scheduler available');
  t.ok(_ganttModule.Gantt, 'Gantt available');
  new _gridModule.Grid({
    appendTo: document.body,
    id: 'grid',
    width: 1024,
    height: 300,
    columns: [{
      field: 'name',
      text: 'Name'
    }],
    data: [{
      name: 'Mr Fantastic'
    }]
  });
  new _schedulerModule.Scheduler({
    appendTo: document.body,
    id: 'scheduler',
    width: 1024,
    height: 300,
    resources: [{
      id: 1,
      name: 'The Thing'
    }],
    startDate: new Date(2019, 4, 1),
    endDate: new Date(2019, 4, 31),
    events: [{
      resourceId: 1,
      startDate: new Date(2019, 4, 21),
      duration: 2
    }]
  });
  new _ganttModule.Gantt({
    appendTo: document.body,
    id: 'gantt'
  });
  t.selectorExists('.b-grid#grid', 'Grid element found');
  t.selectorExists('.b-scheduler#scheduler', 'Scheduler element found');
  t.selectorExists('.b-gantt#gantt', 'Gantt element found');
  t.selectorCountIs('.b-float-root', 1, 'Single float root');
  t.notOk('BUNDLE_EXCEPTION' in window, 'No exception from including both');
});