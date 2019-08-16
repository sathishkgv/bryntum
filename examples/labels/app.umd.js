"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* eslint-disable no-unused-vars */
function reconfigureGantt(_ref) {
  var source = _ref.source;
  gantt.blockRefresh = true;
  gantt.features.labels.setConfig(source.featureSpec);
  gantt.rowHeight = source.rowHeight;
  gantt.barMargin = source.barMargin;
  gantt.blockRefresh = false;
  gantt.refresh(true);
}

var project = window.project = new bryntum.gantt.ProjectModel({
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
});

var topLabel = {
  field: 'name',
  editor: {
    type: 'textfield'
  }
},
    bottomLabel = {
  field: 'startDate',
  renderer: function renderer(_ref2) {
    var taskRecord = _ref2.taskRecord;
    return bryntum.gantt.DateHelper.format(taskRecord.startDate, 'DD-MMM-Y');
  }
},
    leftLabel = {
  renderer: function renderer(_ref3) {
    var taskRecord = _ref3.taskRecord;
    return 'Id: ' + taskRecord.id;
  }
},
    rightLabel = {
  renderer: function renderer(_ref4) {
    var taskRecord = _ref4.taskRecord;
    return taskRecord.duration + ' ' + bryntum.gantt.DateHelper.getLocalizedNameOfUnit(taskRecord.durationUnit, taskRecord.duration !== 1);
  }
},
    _bryntum$gantt$Widget = bryntum.gantt.WidgetHelper.append([{
  type: 'buttonGroup',
  items: [{
    text: 'Top + Bottom',
    toggleGroup: 'labels',
    listeners: {
      toggle: reconfigureGantt
    },
    rowHeight: 70,
    barMargin: 5,
    cls: 'b-orange b-raised',
    ref: 'top',
    pressed: true,
    featureSpec: {
      top: topLabel,
      bottom: bottomLabel,
      left: null,
      right: null
    }
  }, {
    text: 'Left + Right',
    toggleGroup: 'labels',
    listeners: {
      toggle: reconfigureGantt
    },
    rowHeight: 45,
    barMargin: 10,
    cls: 'b-orange b-raised',
    featureSpec: {
      top: null,
      bottom: null,
      left: leftLabel,
      right: rightLabel
    }
  }, {
    text: 'All',
    toggleGroup: 'labels',
    listeners: {
      toggle: reconfigureGantt
    },
    rowHeight: 70,
    barMargin: 5,
    cls: 'b-orange b-raised',
    featureSpec: {
      top: topLabel,
      bottom: bottomLabel,
      left: leftLabel,
      right: rightLabel
    }
  }]
}], {
  insertFirst: document.getElementById('tools') || document.body
}),
    _bryntum$gantt$Widget2 = _slicedToArray(_bryntum$gantt$Widget, 1),
    buttons = _bryntum$gantt$Widget2[0],
    gantt = new bryntum.gantt.Gantt({
  appendTo: 'container',
  startDate: '2019-01-08',
  endDate: '2019-04-01',
  project: project,
  columns: [{
    type: 'name',
    field: 'name',
    text: 'Name',
    width: 250
  }],
  viewPreset: 'weekAndDayLetter',
  rowHeight: buttons.widgetMap.top.rowHeight,
  barMargin: buttons.widgetMap.top.barMargin,
  features: {
    labels: buttons.widgetMap.top.featureSpec
  }
});

project.load();