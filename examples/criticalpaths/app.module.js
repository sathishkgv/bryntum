import { Button, Gantt, ProjectModel } from '../../build/gantt.module.js?433978';
import shared from '../_shared/shared.module.js?433978';
/* eslint-disable no-unused-vars */

new Button({
    color       : 'b-red b-raised',
    icon        : 'b-fa-square',
    pressedIcon : 'b-fa-check-square',
    ref         : 'criticalPathsButton',
    text        : 'Highlight Critical Paths',
    toggleable  : true,
    pressed     : true,
    insertFirst : document.getElementById('tools') || document.body,
    onAction() {
        // toggle critical paths feature disabled/enabled state
        gantt.features.criticalPaths.disabled = !gantt.features.criticalPaths.disabled;
    }
});

const project = window.project = new ProjectModel({
    taskModelClass : TaskModel,
    transport      : {
        load : {
            url : '../_datasets/criticalpaths.json'
        }
    }
});

const gantt = new Gantt({
    appendTo : 'container',

    project,

    columns : [
        { type : 'name' },
        { type : 'earlystartdate' },
        { type : 'earlyenddate' },
        { type : 'latestartdate' },
        { type : 'lateenddate' },
        { type : 'totalslack' }
    ],

    features : {
        // Critical paths features is always included, but starts disabled by default
        criticalPaths : {
            disabled : false
        },
        nonWorkingTime : true
    }
});

project.load();
