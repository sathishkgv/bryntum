
StartTest(t => {
    t.it('Foreign id accessors should work', t => {
        const project = t.getProject({
            assignmentsData : [
                { id : 1, event : 11, resource : 1 }
            ],

            resourcesData : [
                { id : 1 }
            ]
        });

        const assignment = project.assignmentStore.first;

        t.is(assignment.eventId, 11, 'Correct eventId');
        t.is(assignment.resourceId, 1, 'Correct resourceId');
    });
});
