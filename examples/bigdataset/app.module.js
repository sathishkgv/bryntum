import { Gantt, ProjectModel, WidgetHelper, ProjectGenerator } from '../../build/gantt.module.js?433978';
import shared from '../_shared/shared.module.js?433978';
/* eslint-disable no-unused-vars */


//<debug>
// disable certain debugging code to make record generation faster
window.bryntum.DISABLE_DEBUG = true;
//</debug>

let gantt,
    mask,
    project = window.project = new ProjectModel();

const [taskCountField, projectSizeField] = WidgetHelper.append([
    {
        type    : 'number',
        label   : 'Tasks',
        tooltip : 'Enter number of tasks to generate and press [ENTER]. Tasks are divided into blocks of ten',
        value   : 1000,
        min     : 10,
        max     : 10000,
        width   : 180,
        step    : 10,
        onChange({ userAction }) {
            if (userAction && taskCountField.value % 10 !== 0) {
                taskCountField.value = Math.round(taskCountField.value / 10) * 10;
            }
            else {
                generate();
            }
        }
    }, {
        type    : 'number',
        label   : 'Project size',
        tooltip : 'Enter number of tasks that should be connected into a "project" (multipliers of 10)',
        min     : 10,
        max     : 1000,
        value   : 50,
        width   : 180,
        step    : 10,
        onChange({ userAction }) {
            if (userAction && projectSizeField.value % 10 !== 0) {
                projectSizeField.value = Math.round(projectSizeField.value / 10) * 10;
            }
            else {
                generate();
            }
        }
    }
], {
    insertFirst : document.getElementById('tools') || document.body,
    cls         : 'b-bright'
});

gantt = new Gantt({
    appendTo : 'container',

    emptyText : '',

    project,

    columns : [
        { type : 'name', field : 'name', text : 'Name', width : 200 },
        { type : 'startdate', text : 'Start date' },
        { type : 'duration', text : 'Duration' }
    ],

    columnLines : false
});

function updateMask(taskCount) {
    mask.text = `Generating tasks: ${taskCount}/${taskCountField.value}`;
}

function generate() {
    mask = WidgetHelper.mask(gantt.element, 'Generating project');

    taskCountField.disabled = projectSizeField.disabled = true;

    // Timeout to allow mask to show initially
    setTimeout(() => {
        ProjectGenerator.generateAsync(taskCountField.value, projectSizeField.value, updateMask).then(config => {
            gantt.setTimeSpan(config.startDate, config.endDate);

            mask.text = 'Calculating schedule';

            // Timeout to allow mask to update before propagation
            setTimeout(async() => {
                project.startDate = config.startDate;
                project.endDate = config.endDate;
                project.eventStore.data = config.eventsData;
                project.dependencyStore.data = config.dependenciesData;

                await project.propagate();

                mask.close();

                gantt.zoomToFit();

                taskCountField.disabled = projectSizeField.disabled = false;
            }, 10);
        });
    }, 10);
}

generate();
