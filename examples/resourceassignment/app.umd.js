"use strict";

/* eslint-disable no-unused-vars */
var project = window.project = new bryntum.gantt.ProjectModel({
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
});
var gantt = new bryntum.gantt.Gantt({
  appendTo: 'container',
  columns: [{
    type: 'name',
    field: 'name',
    text: 'Name',
    width: 250
  }, {
    type: 'resourceassignment',
    text: 'Name',
    width: 250,
    editor: {
      type: bryntum.gantt.AssignmentField.type,
      picker: {
        // This config is applied over the provided picker grid's config
        // Object based configs are merged. The columns, being an array is concatenated
        // onto the provided column set.
        grid: {
          features: {
            filterBar: true,
            group: 'resource.city'
          },
          columns: [{
            text: 'Calendar',
            field: 'resource.calendar.name',
            filterable: false,
            editor: false,
            width: 85
          }]
        }
      }
    }
  }],
  project: project
});
project.load();