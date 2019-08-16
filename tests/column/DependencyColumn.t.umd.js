"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    gantt && gantt.destroy();
  });
  t.it('Should update dependency columns on dependency store changes', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      columns: [{
        type: PredecessorColumn.type,
        width: 150
      }, {
        type: SuccessorColumn.type,
        width: 150
      }],
      tasks: [{
        id: 1,
        cls: 'id1',
        startDate: '2017-01-16',
        endDate: '2017-01-18',
        name: 'Task 1',
        leaf: true
      }, {
        id: 2,
        cls: 'id2',
        startDate: '2017-01-16',
        endDate: '2017-01-18',
        name: 'Task 2',
        leaf: true
      }, {
        id: 3,
        cls: 'id3',
        startDate: '2017-01-16',
        endDate: '2017-01-18',
        name: 'Task 3',
        leaf: true
      }],
      dependencies: []
    });
    var project = gantt.project,
        dependencyStore = project.dependencyStore,
        eventStore = project.eventStore;
    var dep1;
    t.chain({
      waitForPropagate: project
    }, function () {
      t.isntCalled('refresh', gantt);

      var _dependencyStore$add = dependencyStore.add({
        id: 1,
        fromEvent: 1,
        toEvent: 2
      });

      var _dependencyStore$add2 = _slicedToArray(_dependencyStore$add, 1);

      dep1 = _dependencyStore$add2[0];
      return project.propagate();
    }, function () {
      t.isDeeply(eventStore.getById(1).outgoingDeps, new Set([dependencyStore.getById(1)]), 'Correct outgoing deps for event 1');
      t.isDeeply(eventStore.getById(2).incomingDeps, new Set([dependencyStore.getById(1)]), 'Correct incoming deps for event 2');
      t.contentLike('.id1 [data-column=successors]', '2', 'Successor rendered');
      t.contentLike('.id2 [data-column=predecessors]', '1', 'Predecessor rendered');
      dependencyStore.add({
        fromEvent: 3,
        toEvent: 2
      });
      return project.propagate();
    }, function (next) {
      t.contentLike('.id1 [data-column=successors]', '2', 'Successor rendered');
      t.contentLike('.id2 [data-column=predecessors]', '1;3', 'Predecessor rendered');
      t.contentLike('.id3 [data-column=successors]', '2', 'Successor rendered');
      next();
    }, function () {
      dep1.setLag(1, TimeUnit.Day);
      return project.waitForPropagateCompleted();
    }, function () {
      t.contentLike('.id2 [data-column=predecessors]', '1+1d;3', 'Predecessor rendered');
    });
  });
  t.it('Should use delimiter config for rendering and editing', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      columns: [{
        type: PredecessorColumn.type,
        width: 150,
        delimiter: ','
      }, {
        type: SuccessorColumn.type,
        width: 150,
        delimiter: '/'
      }]
    });
    t.selectorExists('.id14 [data-column=predecessors]:contains(11,12,13)', 'Correct separator rendered #1');
    t.selectorExists('.id14 [data-column=successors]:contains(21/22)', 'Correct separator rendered #2');
    gantt.startEditing({
      id: 14,
      field: 'predecessors'
    });
    t.is(document.querySelector('input[name=predecessors]').value, '11,12,13', 'Correct separator while editing #1');
    gantt.features.cellEdit.cancelEditing();
    gantt.startEditing({
      id: 14,
      field: 'successors'
    });
    t.is(document.querySelector('input[name=successors]').value, '21/22', 'Correct separator while editing #2');
  });
});