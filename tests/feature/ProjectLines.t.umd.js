"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should show project lines by default', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      columns: [{
        type: 'name',
        field: 'name',
        text: 'Name',
        width: 250
      }]
    });
    t.chain({
      waitForSelector: '.b-grid-headers .b-sch-line label:contains(Project start)'
    }, {
      waitForSelector: '.b-grid-headers .b-sch-line label:contains(Project end)'
    });
  });
  t.it('Should not show project lines if disabled', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        projectLines: false
      },
      columns: [{
        type: 'name',
        field: 'name',
        text: 'Name',
        width: 250
      }]
    });
    t.chain({
      waitForRowsVisible: gantt
    }, function () {
      t.selectorNotExists('.b-grid-headers .b-sch-line label:contains(Project start)');
      t.selectorNotExists('.b-grid-headers .b-sch-line label:contains(Project end)');
    });
  });
  t.it('Should update project lines correctly', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      tasks: [{
        id: 1,
        name: 'task 1',
        startDate: '2017-01-16',
        duration: 10
      }],
      features: {
        projectLines: true
      }
    });
    var task = gantt.taskStore.getById(1),
        project = gantt.project;

    function checkDates(startDate, endDate) {
      var _gantt$features$proje = gantt.features.projectLines.store.getRange(),
          _gantt$features$proje2 = _slicedToArray(_gantt$features$proje, 2),
          start = _gantt$features$proje2[0],
          end = _gantt$features$proje2[1];

      t.is(start.startDate, startDate, 'Line start is ok');
      t.is(project.startDate, startDate, 'Project start is ok');
      t.is(end.startDate, endDate, 'Line end is ok');
      t.is(project.endDate, endDate, 'Project end is ok');
    }

    t.chain({
      waitForPropagate: gantt
    }, {
      waitForSelector: '.b-sch-timerange'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", checkDates(new Date(2017, 0, 16), new Date(2017, 0, 26)));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })),
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return task.setConstraintType('muststarton');

            case 2:
              _context2.next = 4;
              return task.setConstraintDate('2017-01-17');

            case 4:
              checkDates(new Date(2017, 0, 16), new Date(2017, 0, 27));

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })), {
      dblclick: '.b-gantt-task'
    }, {
      click: 'input[name=fullDuration]'
    }, {
      type: '[UP][UP]'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", checkDates(new Date(2017, 0, 16), new Date(2017, 0, 29)));

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })), {
      click: '.b-popup-close'
    }, {
      waitForSelectorNotFound: '.b-taskeditor-editing'
    }, function () {
      return checkDates(new Date(2017, 0, 16), new Date(2017, 0, 27));
    });
  }); // #8390 https://app.assembla.com/spaces/bryntum/tickets/8390

  t.it('Should update project lines correctly after undo',
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(t) {
      var project, stm, originalProjectStartDate, originalProjectEndDate, checkDates;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              checkDates = function _ref7(startDate, endDate) {
                var _gantt$features$proje3 = gantt.features.projectLines.store.getRange(),
                    _gantt$features$proje4 = _slicedToArray(_gantt$features$proje3, 2),
                    start = _gantt$features$proje4[0],
                    end = _gantt$features$proje4[1];

                t.is(start.startDate, startDate, 'Line start is ok');
                t.is(project.startDate, startDate, 'Project start is ok');
                t.is(end.startDate, endDate, 'Line end is ok');
                t.is(project.endDate, endDate, 'Project end is ok');
              };

              gantt = t.getGantt({
                appendTo: document.body,
                tasks: [{
                  id: 1,
                  name: 'task 1',
                  startDate: '2017-01-16',
                  duration: 10
                }],
                features: {
                  projectLines: true
                }
              });
              project = gantt.project, stm = project.getStm();
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-sch-timerange'
              }, {
                waitFor: 1000
              },
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        checkDates(new Date(2017, 0, 16), new Date(2017, 0, 26));
                        originalProjectStartDate = project.getStartDate();
                        originalProjectEndDate = project.getEndDate();

                      case 3:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4, this);
              })),
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        stm.enable();
                        stm.startTransaction();
                        _context5.next = 4;
                        return project.setStartDate(new Date(2017, 0, 17));

                      case 4:
                        stm.stopTransaction();
                        checkDates(new Date(2017, 0, 17), new Date(2017, 0, 27));

                      case 6:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5, this);
              })), function () {
                stm.undo();
                checkDates(originalProjectStartDate, originalProjectEndDate);
              });

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function (_x) {
      return _ref4.apply(this, arguments);
    };
  }());
});