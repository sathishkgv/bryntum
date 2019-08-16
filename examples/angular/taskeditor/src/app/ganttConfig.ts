/**
 * @author Saki
 * @date 2019-05-22 18:15:11
 * @Last Modified by: Saki
 * @Last Modified time: 2019-06-27 09:41:00
 */

/* <remove-on-release> */
/* cSpell: ignore saas */
/* </remove-on-release> */

import { ProjectModel } from 'bryntum-gantt/gantt.umd.js';
import filesTabConfig from './lib/filesTabConfig';

const project = new ProjectModel({
    transport : {
        load : {
            url : 'assets/data/launch-saas.json'
        }
    },
    autoLoad : true
})

export default {
    columns : [
        { type : 'name', field : 'name', text : 'Name', width : 250 }
    ],
    features : {
        taskEdit : {
            editorConfig : {
                height     : '37em',
                extraItems : {
                    generaltab : [
                        {
                            html    : '',
                            dataset : {
                                text : 'Custom fields'
                            },
                            cls  : 'b-divider',
                            flex : '1 0 100%'
                        },
                        {
                            type  : 'datefield',
                            ref   : 'deadlineField',
                            name  : 'deadline',
                            label : 'Deadline',
                            flex  : '1 0 50%',
                            cls   : 'b-inline'
                        },
                        {
                            type  : 'colorfield',
                            ref   : 'colorField',
                            name  : 'color',
                            label : 'Color',
                            flex  : '1 0 50%',
                            cls   : 'b-inline'
                        }
                    ]
                }
            },
            tabsConfig : {
                // change title of General tab
                generaltab : {
                    title : 'Common'
                },

                // remove Notes tab
                notestab : false,

                // add custom Files tab
                filesTabConfig
            }
        },
        nonWorkingTime : true
    },
    project
}

// eof
