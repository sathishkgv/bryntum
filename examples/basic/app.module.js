import { Gantt, ProjectModel } from '../../build/gantt.module.js?433978';
import shared from '../_shared/shared.module.js?433978';
/* eslint-disable no-unused-vars */

const project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

new Gantt({
    appendTo : 'container',

    project : project,

    columns : [
        { type : 'name', field : 'name', width : 250 }
    ]
});

project.load();
