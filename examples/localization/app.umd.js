"use strict";

/* eslint-disable no-unused-vars */
var project = new bryntum.gantt.ProjectModel({
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
});
var gantt = new bryntum.gantt.Gantt({
  appendTo: 'container',
  project: project,
  columns: [{
    type: 'wbs'
  }, {
    type: 'name',
    field: 'name',
    width: 250
  }, {
    type: 'startdate'
  }, {
    type: 'enddate'
  }, {
    type: 'duration'
  }]
});
project.load();