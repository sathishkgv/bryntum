"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });

  function checkSelected(t, id) {
    t.ok(gantt.getElementFromTaskRecord(gantt.taskStore.getById(id)).classList.contains('b-task-selected'), "Task ".concat(id, " has .b-task-selected class"));
  }

  function checkUnselected(t, id) {
    t.notOk(gantt.getElementFromTaskRecord(gantt.taskStore.getById(id)).classList.contains('b-task-selected'), "Task ".concat(id, " has no .b-task-selected class"));
  }

  t.it('Should select task on row select', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      durationDisplayPrecision: 0
    });
    t.chain(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              checkUnselected(t, '1');

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })), {
      click: '.b-grid-row.id1',
      desc: 'Click on row'
    }, {
      waitForSelector: '.b-task-selected'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              checkSelected(t, '1');

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })), {
      click: '.b-grid-subgrid-normal .b-grid-row.id11',
      desc: 'Click empty space'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              checkUnselected(t, '1');
              checkSelected(t, '11');

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })));
  });
  t.it('Should select row on task click', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      durationDisplayPrecision: 0
    });
    t.chain(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              checkUnselected(t, '1');

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })), {
      click: '[data-task-id="12"]',
      desc: 'Click on task'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              checkSelected(t, '12');

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })), {
      click: '[data-task-id="13"]',
      options: {
        metaKey: true,
        ctrlKey: true
      },
      desc: 'Multiselect with ctrl click on task'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              checkSelected(t, '12');
              checkSelected(t, '13');

            case 2:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    })));
  });
  t.it('Should select task and not scroll on empty space click',
  /*#__PURE__*/
  function () {
    var _ref7 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(t) {
      var config;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return ProjectGenerator.generateAsync(100, 30, function () {});

            case 2:
              config = _context7.sent;
              gantt = t.getGantt({
                appendTo: document.body,
                project: config,
                startDate: config.startDate,
                endDate: config.endDate
              });
              gantt.subGrids.normal.scrollable.x = 300;
              t.chain({
                click: '.b-grid-subgrid-normal .b-grid-row[data-index="1"]'
              }, {
                waitForSelector: '.b-task-selected'
              }, function (next) {
                checkSelected(t, '2');
                t.is(gantt.subGrids.normal.scrollable.x, 300, 'Scroll position preserved');
                next();
              }, {
                click: '.b-grid-subgrid-normal .b-grid-row[data-index="2"]'
              }, function (next) {
                t.is(gantt.subGrids.normal.scrollable.x, 300, 'Scroll position preserved'); // Scroll to check selecting invisible tasks below

                gantt.subGrids.normal.scrollable.y = 1800;
                t.notOk(gantt.getElementFromTaskRecord(gantt.taskStore.getById('58')), 'Task is not rendered');
                next();
              }, {
                click: '.b-grid-row[data-index="52"]'
              }, function (next) {
                // Scroll to make task visible
                gantt.subGrids.normal.scrollable.x = 1000;
                next();
              }, function () {
                checkSelected(t, '58');
              });

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    return function (_x) {
      return _ref7.apply(this, arguments);
    };
  }());
});