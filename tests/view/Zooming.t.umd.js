"use strict";

StartTest(function (t) {
  var gantt;
  t.beforeEach(function (t) {
    gantt && !gantt.isDestroyed && gantt.destroy();
  });
  var hourMs = 1000 * 60 * 60;
  t.it('should support zoomToFit API', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      tasks: [{
        id: 1,
        name: 'Steve',
        startDate: new Date(2018, 11, 1),
        endDate: new Date(2018, 11, 10)
      }]
    });
    gantt.zoomToFit();
    var visibleStartDate = gantt.getDateFromCoordinate(gantt.scrollLeft),
        visibleEndDate = gantt.getDateFromCoordinate(gantt.scrollLeft + gantt.timeAxisViewModel.availableWidth);
    t.isApprox(visibleStartDate.getTime(), new Date(2018, 11, 1).getTime(), hourMs, 'Start date is ok');
    t.isApprox(visibleEndDate.getTime(), new Date(2018, 11, 10).getTime(), hourMs, 'End date is ok');
  });
});