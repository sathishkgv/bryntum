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
  features: {
    taskContextMenu: {
      // Add extra menu item available on all tasks
      items: {
        moveToNextDay: {
          icon: 'b-fa b-fa-calendar',
          text: 'Move to next day',
          cls: 'b-separator',
          weight: 200,
          onItem: function onItem(_ref) {
            var taskRecord = _ref.taskRecord;
            taskRecord.setStartDate(bryntum.gantt.DateHelper.add(taskRecord.startDate, 1, 'day'));
          }
        },
        milestoneAction: {
          icon: 'b-fa b-fa-deer',
          text: 'Milestone action',
          onItem: function onItem() {
            bryntum.gantt.WidgetHelper.toast('Performed milestone action');
          }
        }
      },
      // Customize items per task
      processItems: function processItems(_ref2) {
        var taskRecord = _ref2.taskRecord,
            items = _ref2.items;
        // Hide delete for parents
        items.deleteTask.hidden = taskRecord.isParent; // Hide if not a milestone

        items.milestoneAction.hidden = !taskRecord.isMilestone;
      }
    }
  },
  columns: [{
    type: 'name',
    field: 'name',
    text: 'Name',
    width: 250
  }],
  project: project
});
project.load();