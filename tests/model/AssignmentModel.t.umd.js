"use strict";

StartTest(function (t) {
  t.it('Foreign id accessors should work', function (t) {
    var project = t.getProject({
      assignmentsData: [{
        id: 1,
        event: 11,
        resource: 1
      }],
      resourcesData: [{
        id: 1
      }]
    });
    var assignment = project.assignmentStore.first;
    t.is(assignment.eventId, 11, 'Correct eventId');
    t.is(assignment.resourceId, 1, 'Correct resourceId');
  });
});