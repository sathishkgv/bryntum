/**
 * @author Saki
 * @date 2019-04-20 18:33:39
 * @Last Modified by: Saki
 * @Last Modified time: 2019-05-25 22:32:27
 *
 * Gantt configuration
 */

/*  */

import { ProjectModel, WidgetHelper } from 'bryntum-gantt';
import Task from '../../lib/Task';
import '../../lib/ResourceAvatarColumn';
import '../../lib/PercentDonePieColumn';
import '../../lib/StatusColumn';

const ganttConfig = {
    
    startDate : '2019-01-06 00:00',
    project : new ProjectModel({
        // Let the Project know we want to use our own Task model with custom fields / methods
        taskModelClass : Task,
        transport       : {
            load : {
                url : 'datasets/launch-saas.json'
            }
        }
    }),

    columns : [
        { type : 'wbs' },
        { type : 'name', width : 250 },
        { type : 'startdate' },
        { type : 'duration' },
        { type : 'percentdone', width : 70 },
        { type : 'resourceavatar', width : 120 },
        {
            text  : 'Predecessors',
            type  : 'predecessor',
            width : 112
        },
        {
            text  : 'Successors',
            type  : 'successor',
            width : 112
        },
        { type : 'schedulingmodecolumn' },
        { type : 'calendar' },
        { type : 'percentdonepie', text : '%', width : 70 },
        { type : 'constrainttype' },
        { type : 'constraintdate' },
        { type : 'statuscolumn' },
        {
            type  : 'date',
            text  : 'Deadline',
            field : 'deadline'
        },
        { type : 'addnew' }
    ], // eo columns

    subGridConfigs : {
        locked : {
            flex : 1
        },
        normal : {
            flex : 2
        }
    },
    columnLines : false,

    features : {
        filter         : true,
        nonWorkingTime : true,
        timeRanges     : {
            showHeaderElements  : true,
            showCurrentTimeLine : true
        },
        labels : {
            left : {
                field  : 'name',
                editor : {
                    type : 'textfield'
                }
            }
        }
    }

} // eo ganttConfig

export default ganttConfig;

// eof
