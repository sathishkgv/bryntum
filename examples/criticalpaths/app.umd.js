"use strict";

/* eslint-disable no-unused-vars */
new bryntum.gantt.Button({
  color: 'b-red b-raised',
  icon: 'b-fa-square',
  pressedIcon: 'b-fa-check-square',
  ref: 'criticalPathsButton',
  text: 'Highlight Critical Paths',
  toggleable: true,
  pressed: true,
  insertFirst: document.getElementById('tools') || document.body,
  onAction: function onAction() {
    // toggle critical paths feature disabled/enabled state
    gantt.features.criticalPaths.disabled = !gantt.features.criticalPaths.disabled;
  }
});
var project = window.project = new bryntum.gantt.ProjectModel({
  taskModelClass: TaskModel,
  transport: {
    load: {
      url: '../_datasets/criticalpaths.json'
    }
  }
});
var gantt = new bryntum.gantt.Gantt({
  appendTo: 'container',
  project: project,
  columns: [{
    type: 'name'
  }, {
    type: 'earlystartdate'
  }, {
    type: 'earlyenddate'
  }, {
    type: 'latestartdate'
  }, {
    type: 'lateenddate'
  }, {
    type: 'totalslack'
  }],
  features: {
    // Critical paths features is always included, but starts disabled by default
    criticalPaths: {
      disabled: false
    },
    nonWorkingTime: true
  }
});
project.load();