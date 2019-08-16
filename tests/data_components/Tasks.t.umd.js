"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* global ProjectModel */
var getProject = function getProject() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new ProjectModel(Object.assign({
    eventsData: [{
      id: 1,
      startDate: new Date(2011, 6, 1),
      endDate: new Date(2011, 6, 5),
      baselines: [{}]
    }, {
      id: 123,
      startDate: new Date(2011, 6, 15),
      endDate: new Date(2011, 6, 23),
      baselines: [{}],
      children: [{
        id: 2,
        startDate: new Date(2011, 6, 16),
        endDate: new Date(2011, 6, 20),
        baselines: [{}]
      }, {
        id: 3,
        startDate: new Date(2011, 6, 18),
        endDate: new Date(2011, 6, 22),
        baselines: [{
          // Task id 3 has slipped by one day from its baseline end date of 
          // 21 Jul and 16 days. It ends on 22nd with 17 days.
          endDate: new Date(2011, 6, 21),
          duration: 16
        }]
      }]
    }, {
      id: 4,
      startDate: new Date(2011, 6, 25),
      endDate: new Date(2011, 6, 28),
      baselines: [{}]
    }, {
      id: 5,
      startDate: new Date(2011, 6, 28),
      endDate: new Date(2011, 6, 28),
      baselines: [{}]
    }, {
      id: 6,
      startDate: new Date(2011, 6, 28),
      duration: 0,
      baselines: [{}]
    }],
    dependenciesData: [{
      fromEvent: 1,
      toEvent: 2
    }, {
      fromEvent: 1,
      toEvent: 3
    }, {
      fromEvent: 2,
      toEvent: 4
    }, {
      fromEvent: 3,
      toEvent: 4
    }, {
      fromEvent: 4,
      toEvent: 5
    }]
  }, config));
};

StartTest(function (t) {
  t.it('getById should work even when root is collapsed', function (t) {
    var project = new ProjectModel();
    var eventStore = project.eventStore;
    eventStore.add([{
      id: 'parent',
      expanded: false,
      children: [{
        id: 'child'
      }]
    }]);
    t.ok(eventStore.getById('child'), 'Record found');
  });
  t.it('Phantom checks', function (t) {
    var project = new ProjectModel();
    var eventStore = project.eventStore;

    var _eventStore$add = eventStore.add([{
      id: 1
    }]),
        _eventStore$add2 = _slicedToArray(_eventStore$add, 1),
        event1 = _eventStore$add2[0];

    t.notOk(event1.hasGeneratedId, 'Newly added task with an Id should not be a phantom');
    t.ok(event1.appendChild({}).hasGeneratedId, 'Newly added task should be a phantom');
  }); // region Milestone

  t.it('Milestones',
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(t) {
      var project, eventStore, event5, event6;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              project = getProject();
              _context.next = 3;
              return project.propagate();

            case 3:
              eventStore = project.eventStore;
              event5 = eventStore.getById(5);
              event6 = eventStore.getById(6);
              t.ok(event5.milestone, 'Same start and end date is a milestone');
              t.ok(event6.milestone, 'A milestone can be a task with a startdate and 0 duration');

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()); // t.it('Does not set end date of milestone less than its start date', t => {
  //     const task6 = getDataSet().taskStore.getById(6);
  //
  //     t.is(task6.startDate, new Date(2011, 6, 28), 'Correct start date');
  //     t.is(task6.endDate, new Date(2011, 6, 28), 'Correct end date');
  //
  //     t.throwsOk(() => {
  //         task6.setEndDate(new Date(2011, 6, 26), false);
  //     }, 'Negative duration', 'Trying to set end date before start date throws');
  //
  //     // Ext Gantt expected unmodified date, but vanilla throws
  //     //t.is(task6.startDate, new Date(2011, 6, 28), 'Start date is the same');
  //     //t.is(task6.endDate, new Date(2011, 6, 28), 'End date is the same');
  // });

  t.it('Should be possible to convert a task to be a milestone',
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(t) {
      var project, eventStore, _eventStore$add3, _eventStore$add4, event1;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              project = new ProjectModel();
              eventStore = project.eventStore;
              _eventStore$add3 = eventStore.add([{
                startDate: new Date(2013, 6, 24),
                duration: 2
              }]), _eventStore$add4 = _slicedToArray(_eventStore$add3, 1), event1 = _eventStore$add4[0];
              _context2.next = 5;
              return project.propagate();

            case 5:
              t.notOk(event1.milestone, 'Not a milestone');
              _context2.next = 8;
              return event1.convertToMilestone();

            case 8:
              t.ok(event1.milestone, 'Now a milestone');
              t.is(event1.startDate, new Date(2013, 6, 24), 'Milestone at the original task end date');

            case 10:
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
  t.it('Should not produce any side effects to convert a milestone to be a milestone',
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(t) {
      var project, eventStore, _eventStore$add5, _eventStore$add6, event1;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              project = new ProjectModel();
              eventStore = project.eventStore;
              _eventStore$add5 = eventStore.add([{
                startDate: new Date(2013, 6, 26),
                duration: 0
              }]), _eventStore$add6 = _slicedToArray(_eventStore$add5, 1), event1 = _eventStore$add6[0];
              _context3.next = 5;
              return project.propagate();

            case 5:
              t.ok(event1.milestone, 'Originally a milestone');
              _context3.next = 8;
              return event1.convertToMilestone();

            case 8:
              t.ok(event1.milestone, 'Still a milestone');
              t.is(event1.startDate, new Date(2013, 6, 26), 'Milestone at the original task end date');

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('Should not crash if converting a blank task to a milestone',
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(t) {
      var project, eventStore, _eventStore$add7, _eventStore$add8, event1, done;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              project = new ProjectModel({
                startDate: new Date(2019, 5, 4)
              });
              eventStore = project.eventStore;
              _eventStore$add7 = eventStore.add([{}]), _eventStore$add8 = _slicedToArray(_eventStore$add7, 1), event1 = _eventStore$add8[0];
              done = t.livesOkAsync('No exception thrown');
              _context4.next = 6;
              return event1.convertToMilestone();

            case 6:
              done();

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());
  t.it('Should be able to convert milestone to regular task',
  /*#__PURE__*/
  function () {
    var _ref5 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(t) {
      var project, eventStore, _eventStore$add9, _eventStore$add10, event1;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              project = new ProjectModel();
              eventStore = project.eventStore;
              _eventStore$add9 = eventStore.add([{
                startDate: new Date(2013, 6, 24),
                duration: 0
              }]), _eventStore$add10 = _slicedToArray(_eventStore$add9, 1), event1 = _eventStore$add10[0];
              _context5.next = 5;
              return project.propagate();

            case 5:
              t.is(event1.startDate, new Date(2013, 6, 24), 'Start ok');
              t.is(event1.endDate, new Date(2013, 6, 24), 'End ok');
              _context5.next = 9;
              return event1.convertToRegular();

            case 9:
              t.is(event1.duration, 1, 'duration 1');
              t.is(event1.startDate, new Date(2013, 6, 24), 'Start ok');
              t.is(event1.endDate, new Date(2013, 6, 25), 'End ok');

            case 12:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function (_x5) {
      return _ref5.apply(this, arguments);
    };
  }()); //endregion

  t.it('Task baselines',
  /*#__PURE__*/
  function () {
    var _ref6 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(t) {
      var project, eventStore, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, task, b0;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              project = getProject();
              _context6.next = 3;
              return project.propagate();

            case 3:
              eventStore = project.eventStore;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context6.prev = 7;

              for (_iterator = eventStore[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                task = _step.value;
                b0 = task.baselines.first; // Task id 3 has slipped by one day from its baseline end date of 
                // 21 Jul and 16 days.

                if (task.id === 3) {
                  t.is(b0.startDate, task.startDate);
                  t.is(b0.endDate, new Date(2011, 6, 21));
                  t.is(b0.duration, 16);
                } else {
                  t.is(b0.startDate, task.startDate);
                  t.is(b0.endDate, task.endDate);
                  t.is(b0.duration, task.duration);
                }
              }

              _context6.next = 15;
              break;

            case 11:
              _context6.prev = 11;
              _context6.t0 = _context6["catch"](7);
              _didIteratorError = true;
              _iteratorError = _context6.t0;

            case 15:
              _context6.prev = 15;
              _context6.prev = 16;

              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }

            case 18:
              _context6.prev = 18;

              if (!_didIteratorError) {
                _context6.next = 21;
                break;
              }

              throw _iteratorError;

            case 21:
              return _context6.finish(18);

            case 22:
              return _context6.finish(15);

            case 23:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[7, 11, 15, 23], [16,, 18, 22]]);
    }));

    return function (_x6) {
      return _ref6.apply(this, arguments);
    };
  }());
}); //if (1 === 2) {
//    //region Engine
//
//    // engine
//    t.xit('Update parent', t => {
//
//        const dataSet   = getDataSet(),
//              taskStore = dataSet.taskStore,
//              task2     = taskStore.getById(2);
//
//        t.is(taskStore.getById(123).duration, 6, 'Correct parent duration before recalculate');
//
//        taskStore.startBatchCascade();
//
//        task2.recalculateParents();
//
//        taskStore.endBatchCascade();
//
//        t.isDateEqual(taskStore.getById(123).startDate, new Date(2011, 6, 16), 'Correct parent update');
//        t.isDateEqual(taskStore.getById(123).endDate, new Date(2011, 6, 22), 'Correct parent update');
//        t.is(taskStore.getById(123).duration, 4, 'Correct parent duration update')
//    });
//
//    //engine
//    t.xit('Cascades 1 - manual', t => {
//
//        // This test uses data configuration violating dependencies
//        const dataSet   = getDataSet({ taskStore : { checkDependencyConstraint : false } }),
//              taskStore = dataSet.taskStore;
//        let cascadeFired       = 0,
//            beforeCascadeFired = 0;
//
//        taskStore.on('beforecascade', () => {
//            beforeCascadeFired++
//        });
//        taskStore.on('cascade', () => {
//            cascadeFired++
//        });
//
//        taskStore.getById(1).propagateChanges();
//
//        t.is(beforeCascadeFired, 1, 'Should be exactly one `beforecascade` event before cascade');
//        t.is(cascadeFired, 1, 'Should be exactly one `cascade` event after cascade');
//
//        t.isStartEnd(taskStore.getById(1), new Date(2011, 6, 1), new Date(2011, 6, 5), 'Correct dates for `task1` after cascade');
//        t.isStartEnd(taskStore.getById(2), new Date(2011, 6, 5), new Date(2011, 6, 7), 'Correct dates for `task2` after cascade');
//        t.isStartEnd(taskStore.getById(3), new Date(2011, 6, 5), new Date(2011, 6, 9), 'Correct dates for `task3` after cascade');
//
//        t.isStartEnd(taskStore.getById(123), new Date(2011, 6, 5), new Date(2011, 6, 9), 'Correct dates for `task123` after cascade');
//
//        // note - task4 has been re-scheduled from saturday to monday
//        t.isStartEnd(taskStore.getById(4), new Date(2011, 6, 11), new Date(2011, 6, 14), 'Correct dates for `task4` after cascade');
//        t.isStartEnd(taskStore.getById(5), new Date(2011, 6, 14), new Date(2011, 6, 14), 'Correct dates for `task5` after cascade')
//
//    });
//
//    // engine
//    t.xit('Cascades 2 - triggered by task update', t => {
//
//        // This test uses data configuration violating dependencies
//        const dataSet = getDataSet({ taskStore : { checkDependencyConstraint : false } });
//        const taskStore = dataSet.taskStore;
//
//        let cascadeFired = 0;
//        let beforeCascadeFired = 0;
//
//        taskStore.on('beforecascade', () => {
//            beforeCascadeFired++
//        });
//        taskStore.on('cascade', () => {
//            cascadeFired++
//        });
//
//        taskStore.getById(1).setStartDate(new Date(2011, 6, 4), true);
//
//        t.is(beforeCascadeFired, 1, 'Should be exactly one `beforecascade` event before cascade');
//        t.is(cascadeFired, 1, 'Should be exactly one `cascade` event after cascade');
//
//        t.isStartEnd(taskStore.getById(1), new Date(2011, 6, 4), new Date(2011, 6, 6), 'Correct dates for `task1` after cascade');
//        t.isStartEnd(taskStore.getById(2), new Date(2011, 6, 6), new Date(2011, 6, 8), 'Correct dates for `task2` after cascade');
//        t.isStartEnd(taskStore.getById(3), new Date(2011, 6, 6), new Date(2011, 6, 12), 'Correct dates for `task3` after cascade');
//
//        // Adjusted due to its childrens changes
//        t.isStartEnd(taskStore.getById(123), new Date(2011, 6, 6), new Date(2011, 6, 12), 'Correct dates for `task123` after cascade');
//
//        // note - task4 has been re-scheduled from saturday to monday
//        t.isStartEnd(taskStore.getById(4), new Date(2011, 6, 12), new Date(2011, 6, 15), 'Correct dates for `task4` after cascade');
//        t.isStartEnd(taskStore.getById(5), new Date(2011, 6, 15), new Date(2011, 6, 15), 'Correct dates for `task5` after cascade');
//
//        // Make sure a cascade is not fired unless another task was actually modified as a result of a task update.
//        let nbrAffected = 0;
//        taskStore.on('cascade', (store, context) => {
//            nbrAffected = context.nbrAffected;
//        });
//
//        taskStore.getById(1).setStartDate(new Date(2011, 5, 2), false);
//        t.is(nbrAffected, 0, 'Cascade affected no other tasks');
//    });
//
//    // engine
//    t.xit('Cascade after dependency add', t => {
//
//        const taskStore = getDataSet().taskStore;
//
//        let cascadeFired = 0;
//        let beforeCascadeFired = 0;
//
//        taskStore.on({
//            'beforecascade' : () => { beforeCascadeFired++ },
//            'cascade'       : () => { cascadeFired++ }
//        });
//
//        taskStore.dependencyStore.add({
//            from : 2,
//            to   : 3,
//            Type : 2
//        });
//
//        t.is(beforeCascadeFired, 1, 'Should be exactly one `beforecascade` event before cascade');
//        t.is(cascadeFired, 1, 'Should be exactly one `cascade` event after cascade');
//
//        t.isStartEnd(taskStore.getById(1), new Date(2011, 6, 1), new Date(2011, 6, 5), 'Correct dates for `task1` after cascade');
//        t.isStartEnd(taskStore.getById(2), new Date(2011, 6, 16), new Date(2011, 6, 20), 'Correct dates for `task2` after cascade');
//        t.isStartEnd(taskStore.getById(3), new Date(2011, 6, 20), new Date(2011, 6, 26), 'Correct dates for `task3` after cascade');
//
//        t.isStartEnd(taskStore.getById(123), new Date(2011, 6, 16), new Date(2011, 6, 26), 'Correct dates for `task123` after cascade');
//
//        // NOTE: - task4 has been re-scheduled from saturday to monday
//        t.isStartEnd(taskStore.getById(4), new Date(2011, 6, 26), new Date(2011, 6, 29), 'Correctly re-scheduled the start date of the task to next working day');
//        t.isStartEnd(taskStore.getById(5), new Date(2011, 6, 29), new Date(2011, 6, 29), 'Correct dates for `task5` after cascade');
//
//        taskStore.getById(5).setStartEndDate(null, null);
//        t.isStartEnd(taskStore.getById(5), null, null, 'Correct dates for `task5` after resetting it')
//
//    });
//
//    // engine
//    t.xit('No cascade after the change of field other than "Start/endDate", but cascade after `reject`', t => {
//        const taskStore = getDataSet().taskStore;
//
//        let cascadeFired = 0;
//        let beforeCascadeFired = 0;
//
//        taskStore.on('beforecascade', () => {
//            beforeCascadeFired++
//        });
//        taskStore.on('cascade', () => {
//            cascadeFired++
//        });
//
//        taskStore.getById(1).set('Name', 'SomeName');
//
//        t.ok(!beforeCascadeFired, 'No cascade after change of non-start/end date field');
//        t.ok(!cascadeFired, 'No cascade after change of non-start/end date field');
//
//        taskStore.getById(1).reject();
//
//        t.is(beforeCascadeFired, 0, 'Should be exactly one `beforecascade` event before cascade');
//        t.is(cascadeFired, 0, 'Should be exactly one `cascade` event after cascade');
//
//        let task = new TaskModel({
//            'duration'     : 0,
//            'DurationUnit' : 'd',
//            'startDate'    : new Date(2010, 1, 28)
//        });
//        task.calendar = new Calendar();
//        task.normalize();
//
//        t.ok(task.normalized, 'Task indicated as normalized');
//        t.is(task.duration, 0, 'Task duration 0');
//        t.is(task.startDate, new Date(2010, 1, 28), 'Task start date ok');
//        t.is(task.endDate, new Date(2010, 1, 28), 'Task end date ok should be same as start date, since duration is 0');
//
//        // If end is specified as inclusive, the below should give an adjusted end date of 2012-06-23 00:00:00
//        task = new TaskModel({
//            'duration'     : 5,
//            'DurationUnit' : 'd',
//            'startDate'    : '2012-06-18',
//            'endDate'      : '2012-06-22'
//        });
//        task.inclusiveEndDate = true;
//        task.calendar = new Calendar();
//        task.normalize();
//
//        t.is(task.duration, 5, 'Task duration 5');
//        t.is(task.startDate, new Date(2012, 5, 18), 'Task start date ok');
//        t.is(task.endDate, new Date(2012, 5, 23), 'Task end date adjusted to start of next day');
//
//        task = new TaskModel({
//            'duration'     : 4,
//            'DurationUnit' : 'd',
//            'startDate'    : '2012-06-18T10:00:00',
//            'endDate'      : '2012-06-22T10:00:00'
//        });
//        task.inclusiveEndDate = true;
//        task.calendar = new Calendar();
//        task.normalize();
//
//        t.is(task.duration, 4, 'Task duration 4');
//        t.is(task.startDate, new Date(2012, 5, 18, 10), 'inclusiveEndDate: Task start date ok');
//        t.is(task.endDate, new Date(2012, 5, 22, 10), 'inclusiveEndDate: Task end date not adjusted to start of next day, if it has hour info');
//
//        task = new TaskModel({
//            'duration'     : 0,
//            'DurationUnit' : 'd',
//            'startDate'    : '2012-06-18T00:00:00',
//            'endDate'      : '2012-06-18T00:00:00'
//        });
//        task.inclusiveEndDate = true;
//        task.calendar = new Calendar();
//        task.normalize();
//
//        t.is(task.duration, 0, 'Task duration 0');
//        t.is(task.startDate, new Date(2012, 5, 18), 'Task start date ok - milestone');
//        t.is(task.endDate, new Date(2012, 5, 18), 'Task end date not adjusted to start of next day, if it has hour info - milestone');
//    });
//
//    // engine
//    t.xit('Setting task end date can turn task into milestone and back to regular', t => {
//
//        const task = new TaskModel({
//            startDate : new Date(2013, 6, 20),
//            duration  : 0
//        });
//
//        getDataSet().taskStore.add(task);
//
//        t.ok(task.milestone, 'Milestone');
//
//        task.setEndDate(new Date(2013, 6, 23), false);
//
//        t.notOk(task.milestone, 'Now it\'s not a milestone');
//        t.is(task.startDate, new Date(2013, 6, 22), 'Start date is adjusted to the calendar');
//        t.is(task.endDate, new Date(2013, 6, 23), 'End date is adjusted to the calendar');
//
//        task.setEndDate(new Date(2013, 6, 22), false);
//
//        t.ok(task.milestone, 'Now it\'s milestone again');
//        t.is(task.startDate, new Date(2013, 6, 20), 'Start date is adjusted back to midnight between Friday and Saturday');
//        t.is(task.endDate, new Date(2013, 6, 20), 'End date is adjusted back to midnight between Friday and Saturday');
//    });
//
//    // engine
//    t.xit('Setting task duration can turn task into milestone and back to regular', t => {
//
//        const task = new TaskModel({
//            startDate : new Date(2013, 6, 20),
//            duration  : 0
//        });
//
//        getDataSet().taskStore.add(task);
//
//        t.ok(task.milestone, 'Milestone');
//
//        task.setDuration(1);
//
//        t.notOk(task.milestone, 'Now it\'s not a milestone');
//        t.is(task.startDate, new Date(2013, 6, 22), 'Start date is adjusted to the calendar');
//        t.is(task.endDate, new Date(2013, 6, 23), 'End date is adjusted to the calendar');
//
//        task.setDuration(0);
//
//        t.ok(task.milestone, 'Now it\'s milestone again');
//        t.is(task.startDate, new Date(2013, 6, 20), 'Start date is adjusted back to midnight between Friday and Saturday');
//        t.is(task.endDate, new Date(2013, 6, 20), 'End date is adjusted back to midnight between Friday and Saturday');
//    });
//
//    // engine
//    t.xit('Setting task duration can turn task into milestone and back to regular (when scheduleByConstraints is enabled)', t => {
//
//        const task = new TaskModel({
//            startDate : new Date(2017, 12, 31),
//            duration  : 1,
//            leaf      : true
//        });
//
//        const store = getDataSet({
//            taskStore : {
//                scheduleByConstraints : true,
//                root                  : {
//                    expanded : true,
//                    children : [
//                        {
//                            startDate : '2017-12-25',
//                            duration  : 5,
//                            leaf      : true
//                        }
//                    ]
//                }
//            }
//        }).taskStore;
//
//        store.add(task);
//
//        task.setDuration(0);
//
//        t.ok(task.milestone, 'Now it\'s milestone');
//        t.is(task.startDate, new Date(2017, 11, 25), 'Start date matches the project start date');
//        t.is(task.endDate, new Date(2017, 11, 25), 'End date matches the project start date');
//
//        task.setDuration(1);
//
//        t.notOk(task.milestone, 'Now it\'s not a milestone');
//        t.is(task.startDate, new Date(2017, 11, 25), 'Start date matches the project start date');
//        t.is(task.endDate, new Date(2017, 11, 26), 'End date is correct');
//
//    });
//
//    // engine
//    t.xit('Should change start date if task has incoming end-dependencies and no incoming start dependencies', t => {
//        const taskStore = new TaskStore({
//            dependencyStore : new DependencyStore({
//                data : [
//                    { from : 1, to : 2, Type : 3 }
//                ]
//            }),
//            root            : {
//                children : [
//                    {
//                        id        : 1,
//                        startDate : new Date(2013, 6, 23),
//                        duration  : 3,
//                        leaf      : true
//                    }, {
//                        id        : 2,
//                        startDate : new Date(2013, 6, 23),
//                        duration  : 3,
//                        leaf      : true
//                    }
//                ]
//            }
//        });
//
//        const successor = taskStore.getById(2);
//
//        successor.setDuration(2);
//        t.is(successor.startDate, new Date(2013, 6, 24), 'Start moved later');
//        t.is(successor.duration, 2);
//
//        successor.setDuration(4);
//        t.is(successor.startDate, new Date(2013, 6, 22), 'Start moved earlier');
//        t.is(successor.duration, 4);
//    });
//
//    // engine
//    // https://app.assembla.com/spaces/bryntum/tickets/3195-projectablemodel-override-of-ext-data-model-set-doesn--39-t-handle-all-param-combinations/details#
//    t.xit('Should support calls to `set` with 2 objects if in an ongoing projection', t => {
//        const taskStore = new TaskStore({
//            root : {
//                children : [
//                    {
//                        id        : 1,
//                        startDate : new Date(2013, 6, 23),
//                        Name      : null,
//                        leaf      : true
//                    }
//                ]
//            }
//        });
//
//        const task = taskStore.getById(1);
//
//        taskStore.startProjection();
//
//        task.set({ Name : 'foo' }, { silent : true });
//
//        taskStore.commitProjection();
//
//        t.expect(task.getName()).toBe('foo')
//    });
//
//    // engine
//    // https://app.assembla.com/spaces/bryntum/tickets/4536-crash-when-removing-last-task-from-a-parent-with-schedulebyconstraints-/details#
//    t.xit('Should be able to convert empty parent to leaf if it has no start date set, with scheduleByConstraints set to true', t => {
//        let task;
//        const store = new TaskStore({
//            scheduleByConstraints : true,
//            root                  : {
//                children : [
//                    task = new TaskModel({
//                        duration                 : 1,
//                        convertEmptyParentToLeaf : true,
//                        children                 : [
//                            { leaf : true }
//                        ]
//                    })
//                ]
//            }
//        });
//
//        task.firstChild.remove();
//
//        t.is(task.isLeaf(), true, 'Should be a leaf');
//    });
//
//    // engine?
//    t.xit('Should convert empty parent to 1 day leaf task', t => {
//        const taskStore = getDataSet().taskStore;
//
//        const parentTask = new TaskModel({
//            startDate : new Date(2013, 6, 25),
//            duration  : 4,
//            leaf      : false
//        });
//
//        taskStore.add(parentTask);
//
//        // TODO: Enable when vanilla has removeAll() on Model
//        t.xit('should handle removeAll case', t => {
//            parentTask.appendChild({ startDate : new Date(2013, 6, 25), duration : 4 });
//            parentTask.appendChild({ startDate : new Date(2013, 6, 25), duration : 4 });
//            parentTask.appendChild({ startDate : new Date(2013, 6, 25), duration : 4 });
//
//
//            t.is(parentTask.duration, 4, 'duration 4');
//
//            parentTask.removeAll();
//
//            t.is(parentTask.startDate, new Date(2013, 6, 25), 'Start ok');
//            t.is(parentTask.duration, 1, 'duration 1');
//        });
//
//        t.it('should handle removeChild case', t => {
//            parentTask.appendChild({ startDate : new Date(2013, 6, 25), duration : 4 });
//            parentTask.appendChild({ startDate : new Date(2013, 6, 25), duration : 4 });
//            parentTask.appendChild({ startDate : new Date(2013, 6, 25), duration : 4 });
//
//            parentTask.duration = 4;
//
//            t.is(parentTask.duration, 4, 'duration 4');
//
//            parentTask.firstChild.remove();
//            parentTask.firstChild.remove();
//            parentTask.firstChild.remove();
//
//            t.is(parentTask.startDate, new Date(2013, 6, 25), 'Start ok');
//            t.is(parentTask.duration, 1, 'duration 1');
//        });
//    });
//
//
//    //endregion
//}