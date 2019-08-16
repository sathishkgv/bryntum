"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('#8247 TaskEditor cancel should not leave undoable transaction in the STM',
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(t) {
      var investigateTask, _gantt$project$resour, _gantt$project$resour2, maximResource, stm;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                features: {
                  taskTooltip: false
                }
              });
              investigateTask = gantt.project.taskStore.getById(11);
              _gantt$project$resour = gantt.project.resourceStore.add({
                name: 'Maxim'
              }), _gantt$project$resour2 = _slicedToArray(_gantt$project$resour, 1), maximResource = _gantt$project$resour2[0];
              _context.next = 5;
              return investigateTask.assign(maximResource);

            case 5:
              stm = gantt.project.getStm();
              stm.disabled = false;
              stm.autoRecord = true;
              t.chain(function (next) {
                gantt.editTask(investigateTask);
                next();
              }, {
                waitForSelector: '.b-popup.b-taskeditor'
              }, {
                click: '.b-tabpanel-tab-title:contains(Resources)'
              }, {
                click: '.b-resourcestab .b-grid-cell:contains(Maxim)'
              }, {
                click: '.b-resourcestab .b-remove-button'
              }, {
                click: '.b-button:contains(Cancel)'
              }, {
                waitForPropagate: gantt
              }, function (next) {
                t.notOk(stm.canUndo, 'Canceling haven\'t created any unneeded undo actions');
                t.notOk(stm.canRedo, 'Canceling haven\'t created any unneeded redo actions');
              });

            case 9:
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
  t.it('#8247 TaskEditor cancel should not change undo/redo queue',
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(t) {
      var investigateTask, _gantt$project$resour3, _gantt$project$resour4, maximResource, stm;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                features: {
                  taskTooltip: false
                }
              });
              investigateTask = gantt.project.taskStore.getById(11);
              _gantt$project$resour3 = gantt.project.resourceStore.add({
                name: 'Maxim'
              }), _gantt$project$resour4 = _slicedToArray(_gantt$project$resour3, 1), maximResource = _gantt$project$resour4[0];
              _context5.next = 5;
              return investigateTask.assign(maximResource);

            case 5:
              stm = gantt.project.getStm();
              stm.disabled = false;
              stm.autoRecord = true;
              t.chain(
              /*#__PURE__*/
              function () {
                var _ref3 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee2(next) {
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return investigateTask.setStartDate(new Date(investigateTask.getStartDate().getTime() + 1000 * 60 * 60 * 24));

                        case 2:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, this);
                }));

                return function (_x3) {
                  return _ref3.apply(this, arguments);
                };
              }(), // STM is async, need to wait a bit for action to get into queue
              {
                waitFor: 200
              },
              /*#__PURE__*/
              function () {
                var _ref4 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee3(next) {
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return investigateTask.setStartDate(new Date(investigateTask.getStartDate().getTime() + 1000 * 60 * 60 * 24));

                        case 2:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3, this);
                }));

                return function (_x4) {
                  return _ref4.apply(this, arguments);
                };
              }(), {
                waitFor: 200
              },
              /*#__PURE__*/
              function () {
                var _ref5 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee4(next) {
                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _context4.next = 2;
                          return investigateTask.setStartDate(new Date(investigateTask.getStartDate().getTime() + 1000 * 60 * 60 * 24));

                        case 2:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4, this);
                }));

                return function (_x5) {
                  return _ref5.apply(this, arguments);
                };
              }(), {
                waitFor: 200
              }, function (next) {
                stm.undo();
                stm.undo();
                gantt.editTask(investigateTask);
                next();
              }, {
                waitForSelector: '.b-popup.b-taskeditor'
              }, {
                click: '.b-tabpanel-tab-title:contains(Resources)'
              }, {
                click: '.b-resourcestab .b-grid-cell:contains(Maxim)'
              }, {
                click: '.b-resourcestab .b-remove-button'
              }, {
                click: '.b-button:contains(Cancel)'
              }, {
                waitForSelectorNotFound: 'b-taskeditor-editing'
              }, {
                waitFor: function waitFor() {
                  return stm.canUndo;
                }
              }, function (next) {
                t.ok(stm.canUndo, 'Canceling haven\'t changed undo availability');
                t.ok(stm.canRedo, 'Canceling haven\'t changed redo availability');
                t.is(stm.position, 1, 'Canceling haven\'t changed STM position');
                t.is(stm.length, 3, 'Canceling haven\'t changed STM queue length');
              });

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
});