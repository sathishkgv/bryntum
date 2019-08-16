"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* eslint-disable no-unused-vars */
//<debug>
// disable certain debugging code to make record generation faster
window.bryntum.DISABLE_DEBUG = true; //</debug>

var gantt,
    mask,
    project = window.project = new bryntum.gantt.ProjectModel();

var _bryntum$gantt$Widget = bryntum.gantt.WidgetHelper.append([{
  type: 'number',
  label: 'Tasks',
  tooltip: 'Enter number of tasks to generate and press [ENTER]. Tasks are divided into blocks of ten',
  value: 1000,
  min: 10,
  max: 10000,
  width: 180,
  step: 10,
  onChange: function onChange(_ref) {
    var userAction = _ref.userAction;

    if (userAction && taskCountField.value % 10 !== 0) {
      taskCountField.value = Math.round(taskCountField.value / 10) * 10;
    } else {
      generate();
    }
  }
}, {
  type: 'number',
  label: 'Project size',
  tooltip: 'Enter number of tasks that should be connected into a "project" (multipliers of 10)',
  min: 10,
  max: 1000,
  value: 50,
  width: 180,
  step: 10,
  onChange: function onChange(_ref2) {
    var userAction = _ref2.userAction;

    if (userAction && projectSizeField.value % 10 !== 0) {
      projectSizeField.value = Math.round(projectSizeField.value / 10) * 10;
    } else {
      generate();
    }
  }
}], {
  insertFirst: document.getElementById('tools') || document.body,
  cls: 'b-bright'
}),
    _bryntum$gantt$Widget2 = _slicedToArray(_bryntum$gantt$Widget, 2),
    taskCountField = _bryntum$gantt$Widget2[0],
    projectSizeField = _bryntum$gantt$Widget2[1];

gantt = new bryntum.gantt.Gantt({
  appendTo: 'container',
  emptyText: '',
  project: project,
  columns: [{
    type: 'name',
    field: 'name',
    text: 'Name',
    width: 200
  }, {
    type: 'startdate',
    text: 'Start date'
  }, {
    type: 'duration',
    text: 'Duration'
  }],
  columnLines: false
});

function updateMask(taskCount) {
  mask.text = "Generating tasks: ".concat(taskCount, "/").concat(taskCountField.value);
}

function generate() {
  mask = bryntum.gantt.WidgetHelper.mask(gantt.element, 'Generating project');
  taskCountField.disabled = projectSizeField.disabled = true; // Timeout to allow mask to show initially

  setTimeout(function () {
    bryntum.gantt.ProjectGenerator.generateAsync(taskCountField.value, projectSizeField.value, updateMask).then(function (config) {
      gantt.setTimeSpan(config.startDate, config.endDate);
      mask.text = 'Calculating schedule'; // Timeout to allow mask to update before propagation

      setTimeout(
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                project.startDate = config.startDate;
                project.endDate = config.endDate;
                project.eventStore.data = config.eventsData;
                project.dependencyStore.data = config.dependenciesData;
                _context.next = 6;
                return project.propagate();

              case 6:
                mask.close();
                gantt.zoomToFit();
                taskCountField.disabled = projectSizeField.disabled = false;

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      })), 10);
    });
  }, 10);
}

generate();