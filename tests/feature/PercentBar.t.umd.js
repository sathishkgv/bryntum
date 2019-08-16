"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  Object.assign(window, {
    Gantt: Gantt
  });
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });

  function assertPercentBarWidth(t, taskRecord) {
    var taskElement = gantt.getElementFromTaskRecord(taskRecord),
        percentBar = taskElement.querySelector(".b-gantt-task-percent"),
        expectedWidth = taskElement.offsetWidth * taskRecord.percentDone / 100;
    t.isApprox(expectedWidth, percentBar.offsetWidth, "Correct percent bar width for ".concat(taskRecord.name, ", ").concat(taskRecord.percentDone, "%"));
  }

  t.it('Should render percent bars', function (t) {
    gantt = t.getGantt({
      appendTo: document.body
    });
    var taskElements = Array.from(document.querySelectorAll('.b-gantt-task-wrap:not(.b-milestone-wrap)'));
    t.selectorExists('.b-gantt-task-percent', 'Percent bar rendered');
    t.selectorCountIs('.b-gantt-task-percent', taskElements.length, 'One per normal task rendered'); // Check all widths

    taskElements.forEach(function (taskElement) {
      assertPercentBarWidth(t, gantt.resolveTaskRecord(taskElement));
    });
  });
  t.it('Should update percent bar when data changes',
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(t) {
      var task;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body
              });
              task = gantt.taskStore.getById(11);
              _context.next = 4;
              return task.setPercentDone(10);

            case 4:
              assertPercentBarWidth(t, task);
              _context.next = 7;
              return task.setPercentDone(90);

            case 7:
              assertPercentBarWidth(t, task);
              _context.next = 10;
              return task.setPercentDone(100);

            case 10:
              assertPercentBarWidth(t, task);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Should set percent to 0 if dragging fully to the start of the bar',
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(t) {
      var task;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body
              });
              task = gantt.taskStore.getById(11);
              task.cls = 'foo';
              _context2.next = 5;
              return task.setDuration(1);

            case 5:
              _context2.next = 7;
              return task.setPercentDone(10);

            case 7:
              t.chain({
                moveCursorTo: '.foo.b-gantt-task'
              }, {
                drag: '.foo .b-gantt-task-percent-handle',
                by: [-100, 0]
              }, {
                waitForPropagate: gantt.project
              }, function () {
                t.is(task.percentDone, 0);
              });

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
});