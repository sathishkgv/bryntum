"use strict";

/* eslint-disable no-unused-vars */
var project = new bryntum.gantt.ProjectModel({
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
});
new bryntum.gantt.Gantt({
  appendTo: 'container',
  project: project,
  columns: [{
    type: 'name',
    field: 'name',
    width: 250
  }]
});
project.load();