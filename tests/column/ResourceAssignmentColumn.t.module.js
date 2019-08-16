import { ResourceAssignmentColumn } from '../../build/gantt.module.js?433978';
/* global Gantt */

StartTest((t) => {

    let gantt;

    t.beforeEach((t) => {
        gantt && gantt.destroy();
    });

    // Here we check that effort column shows the same value which is showed in its editor #950
    t.it('Should render column properly', async(t) => {
        gantt = new Gantt({
            id              : 'gantt',
            appendTo        : document.body,
            rowHeight       : 45,
            taskStore       : t.getTaskStore(),
            resourceStore   : t.getTeamResourceStore(),
            assignmentStore : t.getTeamAssignmentStore(),
            columns         : [
                { type : 'name', text : 'Name', width : 170, field : 'name' },
                { type : ResourceAssignmentColumn.type, id : 'resourceassignment', width : 250 }
            ]
        });

        const project = gantt.project;

        await project.waitForPropagateCompleted();

        let raColumn, gotData = false;

        t.chain(
            { waitForRowsVisible : gantt },

            (next) => {
                raColumn = gantt.columns.getById('resourceassignment');
                next();

            },

            ...project.getEventStore().map(event => async() => {

                await gantt.scrollCellIntoView({ id : event.id, columnId : 'resourceassignment' });

                const idx = gantt.taskStore.allRecords.indexOf(event),
                    [cellEl] = t.query(`.b-grid-row[data-index=${idx}] .b-grid-cell[data-column-id=resourceassignment]`),
                    valueElement = document.createElement('div');

                gotData = gotData || cellEl.innerHTML != '';

                raColumn.renderer({ value : event.assignments, cellElement : valueElement });
                t.is(cellEl.innerHTML, valueElement.innerHTML, 'Rendered ok');
            }),

            (next) => {
                t.ok(gotData, 'Resource assignment column data has been rendered');
            }
        );
    });

    t.it('Editor should be configurable with floating assignments behavior', async(t) => {
        const run = async (float) => {

            gantt = new Gantt({
                id              : 'gantt',
                appendTo        : document.body,
                rowHeight       : 45,
                taskStore       : t.getTaskStore(),
                resourceStore   : t.getTeamResourceStore(),
                assignmentStore : t.getTeamAssignmentStore(),
                columns         : [
                    { type : 'name', text : 'Name', width : 170, field : 'name' },
                    { type : ResourceAssignmentColumn.type, width : 250, editor : { store : { floatAssignedResources : float } } }
                ]
            });

            const project = gantt.project;

            await project.waitForPropagateCompleted();

            const
                eventStore = project.eventStore,
                assignmentStore = project.assignmentStore,
                task1 = eventStore.getById(115),
                task1idx = eventStore.allRecords.indexOf(task1),
                Terence = project.resourceStore.getById(12);

            t.is(Terence.name, 'Terence', 'Got Terence');

            // Assigning Terence to task1, Terence is the last resource if sorted just by name, so he will be shown
            // last if rendered with floatAssignedResources : false config for assignment manipulation store, which
            // column editor should pass through
            assignmentStore.add({
                event    : task1,
                resource : Terence
            });

            await project.propagate();

            await new Promise(resolve => {
                t.chain(
                    { waitForRowsVisible : gantt },
                    async() => {
                        t.ok(Array.from(task1.assignments).some(a => a.resource === Terence), 'Terence is assigned to task1');
                    },
                    { dblClick : `.b-grid-row[data-index=${task1idx}] .b-grid-cell[data-column=assignments]` },
                    { click : '.b-assignmentfield .b-icon-down' },
                    { waitForElementVisible : '.b-assignmentpicker' },
                    // Finding Terence row, it should be last row in the grid
                    (next) => {

                        let teranceRow = t.query(`.b-assignmentpicker .b-grid-row:contains(${Terence.name})`);

                        t.ok(teranceRow && teranceRow.length, `Got ${Terence.name} row`);

                        teranceRow = teranceRow[0];

                        const terrenceIndex = Number(teranceRow.dataset.index);

                        t.selectorExists(`.b-assignmentpicker .b-grid-row[data-index=${terrenceIndex}]`, `${Terence.name} row query is valid`);

                        if (float) {
                            t.selectorExists(`.b-assignmentpicker .b-grid-row[data-index=${terrenceIndex + 1}]`, `${Terence.name} row is not the last row`);
                        }
                        else {
                            t.selectorNotExists(`.b-assignmentpicker .b-grid-row[data-index=${terrenceIndex + 1}]`, `${Terence.name} row is the last row`);
                        }

                        resolve();
                    }
                );
            });

            gantt.destroy();
            gantt = null;
        };

        t.diag('Testing with floating resources');
        await run(true);

        t.diag('Testing w/o floating resources');
        await run(false);
    });

    t.it('Should be possible to edit assignments', async(t) => {
        gantt = new Gantt({
            id              : 'gantt',
            appendTo        : document.body,
            rowHeight       : 45,
            taskStore       : t.getTaskStore(),
            resourceStore   : t.getTeamResourceStore(),
            assignmentStore : t.getTeamAssignmentStore(),
            columns         : [
                { type : 'name', text : 'Name', width : 170, field : 'name' },
                { type : ResourceAssignmentColumn.type, id : 'resourceassignment', width : 250 }
            ]
        });

        const project = gantt.project;

        await project.waitForPropagateCompleted();

        const
            eventStore = project.eventStore,
            task1 = eventStore.getById(115),
            task1idx = eventStore.allRecords.indexOf(task1),
            Arcady = project.resourceStore.getById(1);

        let assignmentField;

        t.chain(
            { waitForRowsVisible : gantt },
            async() => {
                t.ok(Array.from(task1.assignments).some(a => a.resource.id === Arcady.id), 'Arcady is initially assigned to task1');
            },
            { dblClick : `.b-grid-row[data-index=${task1idx}] .b-grid-cell[data-column=assignments]` },

            next => {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField;

                t.click(assignmentField.triggers.expand.element).then(next);
            },

            { waitForElementVisible : '.b-assignmentpicker' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=0] .b-checkbox' },
            { click : '.b-assignmentpicker .b-button:contains(Save)' },
            (next) => {
                t.notOk(Array.from(task1.assignments).some(a => a.resource.id === Arcady.id), 'Arcady is now unassigned from task1');
            }
        );
    });

    t.it('Should be possible to remove assignments by removing the chip from the ChipView', async(t) => {
        gantt = new Gantt({
            id              : 'gantt',
            appendTo        : document.body,
            rowHeight       : 45,
            taskStore       : t.getTaskStore(),
            resourceStore   : t.getTeamResourceStore(),
            assignmentStore : t.getTeamAssignmentStore(),
            columns         : [
                { type : 'name', text : 'Name', width : 170, field : 'name' },
                { type : ResourceAssignmentColumn.type, id : 'resourceassignment', width : 250 }
            ]
        });

        const project = gantt.project;

        await project.waitForPropagateCompleted();

        const
            eventStore = project.eventStore,
            task1 = eventStore.getById(115),
            task1idx = eventStore.allRecords.indexOf(task1),
            Arcady = project.resourceStore.getById(1);

        let assignmentField;

        t.chain(
            { waitForRowsVisible : gantt },
            async() => {
                t.ok(Array.from(task1.assignments).some(a => a.resource.id === Arcady.id), 'Arcady is initially assigned to task1');
            },
            { dblClick : `.b-grid-row[data-index=${task1idx}] .b-grid-cell[data-column=assignments]` },

            next => {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField;

                // Click the remove icon of Arcady's Chip
                t.click(assignmentField.chipView.getItem(0).querySelector('.b-icon-clear')).then(next);
            },

            { waitForElementVisible : '.b-assignmentpicker' },
            { click : '.b-assignmentpicker .b-button:contains(Save)' },
            (next) => {
                t.notOk(Array.from(task1.assignments).some(a => a.resource.id === Arcady.id), 'Arcady is now unassigned from task1');
            }
        );
    });

    t.it('Should be possible to make assignments by checking a checkbox', async(t) => {
        gantt = new Gantt({
            id              : 'gantt',
            appendTo        : document.body,
            rowHeight       : 45,
            taskStore       : t.getTaskStore(),
            resourceStore   : t.getTeamResourceStore(),
            assignmentStore : t.getTeamAssignmentStore(),
            columns         : [
                { type : 'name', text : 'Name', width : 170, field : 'name' },
                { type : ResourceAssignmentColumn.type, id : 'resourceassignment', width : 250 }
            ]
        });

        const project = gantt.project;

        await project.waitForPropagateCompleted();

        const
            eventStore = project.eventStore,
            task1 = eventStore.getById(115),
            task1idx = eventStore.allRecords.indexOf(task1),
            newlyAssignedResource = project.resourceStore.getAt(2);

        let assignmentField;

        t.chain(
            { waitForRowsVisible : gantt },
            async() => {
                t.notOk(Array.from(task1.assignments).some(a => a.resource.id === newlyAssignedResource.id), `${newlyAssignedResource.name} is not initially assigned to task1`);
            },
            { dblClick : `.b-grid-row[data-index=${task1idx}] .b-grid-cell[data-column=assignments]` },

            next => {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField;

                t.click(assignmentField.triggers.expand.element).then(next);
            },

            { waitForElementVisible : '.b-assignmentpicker' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=2] .b-checkbox' },
            { click : '.b-assignmentpicker .b-button:contains(Save)' },
            (next) => {
                t.notOk(Array.from(task1.assignments).some(a => a.resource.id === newlyAssignedResource.id), `${newlyAssignedResource.name} is now assigned to task1`);
            }
        );
    });

    t.it('Moving a picker column should not terminate the edit', async(t) => {
        const run = async (float) => {

            gantt = new Gantt({
                id              : 'gantt',
                appendTo        : document.body,
                rowHeight       : 45,
                taskStore       : t.getTaskStore(),
                resourceStore   : t.getTeamResourceStore(),
                assignmentStore : t.getTeamAssignmentStore(),
                columns         : [
                    { type : 'name', text : 'Name', width : 170, field : 'name' },
                    { type : ResourceAssignmentColumn.type, width : 250, editor : { store : { floatAssignedResources : float } } }
                ]
            });

            const project = gantt.project;

            await project.waitForPropagateCompleted();

            const task1idx = project.eventStore.allRecords.indexOf(project.eventStore.getById(115));

            await project.propagate();

            await new Promise(resolve => {
                t.chain(
                    { waitForRowsVisible : gantt },
                    { dblClick : `.b-grid-row[data-index=${task1idx}] .b-grid-cell[data-column=assignments]` },
                    { click : '.b-assignmentfield .b-icon-down' },
                    { waitForElementVisible : '.b-assignmentpicker' },

                    {
                        drag : '.b-assignmentpicker .b-grid-header:contains(Units)',
                        to   : '.b-assignmentpicker .b-grid-header:first-child'
                    },

                    // Picker should still be here
                    (next) => {
                        t.selectorExists('.b-assignmentpicker', 'Picker is still visible');

                        resolve();
                    }
                );
            });

            gantt.destroy();
            gantt = null;
        };

        t.diag('Testing with floating resources');
        await run(true);

        t.diag('Testing w/o floating resources');
        await run(false);
    });
});
