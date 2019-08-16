import { AssignmentsManipulationStore, MinimalProject } from '../../build/gantt.module.js?433978';

StartTest((t) => {
    let assignmentsManipulationStore;

    t.beforeEach((t) => {
        if (assignmentsManipulationStore) {
            assignmentsManipulationStore.destroy();
            assignmentsManipulationStore = null;
        }
    });

    const getProject = () => {
        return new MinimalProject(t.getProjectData());
    };

    t.it('Should fill itself up using provided task', async t => {
        const project = getProject(),
            eventStore = project.getEventStore(),
            resourceStore = project.getResourceStore(),
            assignmentStore = project.getAssignmentStore();

        await project.propagate();

        const event = eventStore.getById(117);

        assignmentsManipulationStore = new AssignmentsManipulationStore({
            projectEvent : event
        });

        t.is(assignmentsManipulationStore.resourceStore, resourceStore, 'Assignment manipulation store obtained resource store via event');
        t.is(assignmentsManipulationStore.assignmentStore, assignmentStore, 'Assignment manipulation store obtained assignment store via event');
        t.is(assignmentsManipulationStore.count, resourceStore.count, 'All resources are available for assignment');

        const assignedResourcesCount = assignmentsManipulationStore.reduce(
            (count, assignment) => {
                return count + (assignment.event === event ? 1 : 0);
            },
            0
        );

        t.is(assignedResourcesCount, 2, `Event ${event.id} has ${assignedResourcesCount} resources assigned`);
    });

    t.it('Should apply the changes back to original assignment store', async t => {
        const project = getProject(),
            eventStore = project.getEventStore(),
            resourceStore = project.getResourceStore();

        await project.propagate();

        const event = eventStore.getById(115);

        assignmentsManipulationStore = new AssignmentsManipulationStore({
            projectEvent : event
        });

        const Arcady = resourceStore.getById(1),
            Maxim  = resourceStore.getById(7),
            Nick   = resourceStore.getById(8);

        // Event 115 has two resources assigned:
        // - Arcady(1) (100%)
        // - Nick(8) (10%)
        // Let's:
        // - assign Maxim(7) with 75% units to the task
        // - change units for already assigned Arcady(1) from 100% to 30%
        // - unassing Nick(8) completely
        assignmentsManipulationStore.assignResource(Maxim, 75);
        assignmentsManipulationStore.assignResource(Arcady, 30);
        assignmentsManipulationStore.unassignResource(Nick);

        // Now let's apply the changes
        await assignmentsManipulationStore.applyChanges();

        const ArcadyAssignmentList = Array.from(Arcady.assignments);

        t.is(ArcadyAssignmentList.length, 1, 'Arcady has only one assignment');
        t.is(ArcadyAssignmentList[0].event, event, `He is assigned to ${event.name}`);
        t.is(ArcadyAssignmentList[0].units, 30, 'With 30% units');

        const MaximAssignmentList = Array.from(Maxim.assignments).sort((a1, a2) => a1.event.id - a2.event.id);

        t.is(MaximAssignmentList.length, 2, 'Maxim has assignments');
        t.is(MaximAssignmentList[0].event, event, `He is assigned to task ${event.name}`);
        t.is(MaximAssignmentList[0].units, 75, 'With 75% units');
        t.is(MaximAssignmentList[1].event, eventStore.getById(121), 'As well as to task 121');
        t.is(MaximAssignmentList[1].units, 100, 'With 100% units');

        const NickAssignmentList = Array.from(Nick.assignments);

        t.is(NickAssignmentList.length, 0, 'Nick has no more assignements');
    });

    t.it('Should be possible to assign/unassign in bulk', async(t) => {
        const project = getProject(),
            eventStore = project.getEventStore(),
            resourceStore = project.getResourceStore();

        await project.propagate();

        const event = eventStore.getById(115);

        assignmentsManipulationStore = new AssignmentsManipulationStore({
            projectEvent : null
        });

        t.firesOnce(assignmentsManipulationStore, 'allAssigned', 'all-assigned event fired once');
        t.firesOnce(assignmentsManipulationStore, 'noneAssigned', 'none-assigned event fired once');
        t.firesOnce(assignmentsManipulationStore, 'someAssigned', 'some-assigned event fired once');

        assignmentsManipulationStore.projectEvent = event;

        t.ok(assignmentsManipulationStore.areSomeAssigned, 'Some assigned flag is correct');
        t.notOk(assignmentsManipulationStore.areAllAssigned, 'All assigned flag is correct');
        t.notOk(assignmentsManipulationStore.areNoneAssigned, 'None assigned flag is correct');

        // Task 115 has two resources assigned:
        // - Arcady(1) (100%)
        // - Nick(8) (10%)
        const Nick = resourceStore.getById(8);

        // Let's assign all resources possible, all currently unassigned resources
        // will be assigned to the task with 100% units
        t.diag('Assigning all unassinged resources with 100% units');

        assignmentsManipulationStore.assignAllResources();

        assignmentsManipulationStore.forEach((a) => {
            t.is(a.event, event, 'Resource is assigned to the correct task');

            if (a.resource == Nick) {
                t.is(a.units, 10, 'Nick units are untouched');
            }
            else {
                t.is(a.units, 100, 'Resource units are correct');
            }
        });

        t.ok(assignmentsManipulationStore.areAllAssigned, 'All assigned flag is correct');
        t.notOk(assignmentsManipulationStore.areSomeAssigned, 'Some assigned flag is correct');
        t.notOk(assignmentsManipulationStore.areNoneAssigned, 'None assigned flag is correct');

        // Now let's force units, all resources should have 100% units, even Nick
        t.diag('Forcefully assign all resources to 100% units');

        assignmentsManipulationStore.assignAllResources(100, true);

        const allAssignedCorrect = Array.from(assignmentsManipulationStore).every(a => a.event === event && a.units === 100);

        t.ok(allAssignedCorrect, 'All resources are assigned to the correct task and have 100% units assigned for the task');

        // Now let's unassign all
        t.diag('Unassign all');

        assignmentsManipulationStore.unassignAllResources();

        const allUnassignedCorrect = Array.from(assignmentsManipulationStore).every(a => a.event === null && a.units === 0);

        t.ok(allUnassignedCorrect, 'All resources are unassinged, units are reset to 0');

        t.ok(assignmentsManipulationStore.areNoneAssigned, 'None assigned flag is correct');
        t.notOk(assignmentsManipulationStore.areAllAssigned, 'All assigned flag is correct');
        t.notOk(assignmentsManipulationStore.areSomeAssigned, 'Some assigned flag is correct');
    });
});
