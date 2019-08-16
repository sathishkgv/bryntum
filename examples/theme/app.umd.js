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
  project: project,
  columns: [{
    type: 'wbs'
  }, {
    type: 'name'
  }],
  subGridConfigs: {
    locked: {
      flex: 1
    },
    normal: {
      flex: 2
    }
  },
  features: {
    columnLines: false,
    filter: true,
    nonWorkingTime: true,
    timeRanges: {
      showHeaderElements: true
    },
    labels: {
      left: {
        field: 'name',
        editor: {
          type: 'textfield'
        }
      }
    }
  }
});
var panel = new bryntum.gantt.Panel({
  appendTo: 'container',
  widgets: [gantt],
  tbar: {
    items: [{
      type: 'widget',
      cls: 'label',
      html: 'Theme:'
    }, {
      type: 'buttonGroup',
      items: ['Stockholm', 'Light', 'Dark', 'Material', 'Default'].map(function (name) {
        return {
          id: name.toLowerCase(),
          color: 'b-blue',
          text: name,
          pressed: bryntum.gantt.DomHelper.themeInfo.name === name,
          enableToggle: true,
          toggleGroup: 'theme',
          onAction: function onAction(_ref) {
            var button = _ref.source;
            bryntum.gantt.DomHelper.setTheme(button.text);
          }
        };
      })
    }]
  }
});
bryntum.gantt.GlobalEvents.on({
  theme: function theme(themeChangeEvent) {
    bryntum.gantt.WidgetHelper.getById(themeChangeEvent.theme).pressed = true;
  }
});
project.load();