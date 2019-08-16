"use strict";

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    gantt && gantt.destroy();
  });
  t.it('Should render dependencies regardless of barMargin size', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      tasks: [{
        id: 1,
        name: 'Task 1',
        startDate: '2017-01-23',
        manuallyScheduled: true,
        duration: 1
      }, {
        id: 2,
        name: 'Task 2',
        startDate: '2017-01-24',
        manuallyScheduled: true,
        duration: 1
      }, {
        id: 3,
        name: 'Task 3',
        cls: 'task3',
        startDate: '2017-01-26',
        manuallyScheduled: true,
        duration: 0
      }],
      dependencies: [{
        id: 1,
        fromEvent: 1,
        toEvent: 2
      }, {
        id: 2,
        fromEvent: 1,
        toEvent: 3
      }]
    });
    var dependencies = gantt.dependencies;
    t.chain({
      waitForPropagate: gantt
    }, {
      waitForSelector: '.b-gantt-task'
    }, function (next) {
      dependencies.forEach(function (dep) {
        return t.assertDependency(gantt, dep);
      });
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
      gantt.barMargin = 13;
    }, function (next) {
      dependencies.forEach(function (dep) {
        return t.assertDependency(gantt, dep);
      });
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
      gantt.barMargin = 17;
    }, function (next) {
      dependencies.forEach(function (dep) {
        return t.assertDependency(gantt, dep);
      });
    });
  });
  t.it('Should not throw for invalid assignments', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        dependencies: true
      },
      resources: [{
        id: 1,
        name: 'Albert'
      }],
      tasks: [{
        id: 1,
        startDate: '2017-01-16',
        duration: 2
      }],
      assignments: [{
        id: 1,
        resourceId: 1,
        eventId: 1
      }]
    });
    t.livesOk(function () {
      gantt.project.getAssignmentStore().add([{
        id: 2,
        resourceId: 1,
        eventId: 2
      }, {
        id: 3,
        resourceId: 2,
        eventId: 1
      }, {
        id: 4,
        resourceId: 2,
        eventId: 2
      }]);
    }, 'Lives ok when adding assignment to non existent dependency');
  });
  t.it('Should correctly draw dependencies on task add/remove', function (t) {
    gantt = t.getGantt({
      appendTo: document.body
    });
    var stm = gantt.project.stm,
        taskStore = gantt.taskStore;
    t.chain({
      waitForPropagate: gantt
    }, function (next) {
      stm.enable();
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
      stm.startTransaction('remove');
      taskStore.getById(12).remove();
      stm.stopTransaction('remove');
    }, {
      waitForPropagate: gantt
    }, {
      waitForSelectorNotFound: '.b-animating'
    }, function (next) {
      t.subTest('Dependencies are ok after removing task', function (t) {
        gantt.dependencies.forEach(function (dep) {
          return t.assertDependency(gantt, dep);
        });
      });
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
      stm.undo();
    }, {
      waitForSelectorNotFound: '.b-animating'
    }, function (next) {
      t.subTest('Dependencies are ok after undo', function (t) {
        gantt.dependencies.forEach(function (dep) {
          return t.assertDependency(gantt, dep);
        });
      });
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
      stm.startTransaction();
      taskStore.beginBatch();
      taskStore.getById(12).remove();
      taskStore.getById(1).appendChild({
        name: 'test'
      });
      taskStore.endBatch();
      stm.stopTransaction();
    }, function (next) {
      t.subTest('Dependencies are ok after batching', function (t) {
        gantt.dependencies.forEach(function (dep) {
          return t.assertDependency(gantt, dep);
        });
      });
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
      stm.undo();
    }, function (next) {
      t.subTest('Dependencies are ok after undo', function (t) {
        gantt.dependencies.forEach(function (dep) {
          return t.assertDependency(gantt, dep);
        });
      });
    });
  });
});