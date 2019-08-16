/**
 * @author Saki
 * @date 2019-04-20 18:33:39
 * @Last Modified by: Saki
 * @Last Modified time: 2019-05-25 22:24:18
 * 
 * Gantt configuration export
 */
/* <remove-on-release> */
/* cSpell: ignore datasets,saas,percentdone,resourceavatar,schedulingmodecolumn */
/* cSpell: ignore percentdonepie,constrainttype,constraintdate,statuscolumn */
/* cSpell: ignore addnew,resourceassignment */
/* </remove-on-release> */

const imgFolderPath = 'assets/images/users/';

const ganttConfig = {

    startDate : '2019-01-06 00:00',
    columns : [
        { type : 'wbs' },
        { type : 'name', width : 250 },
        { type : 'startdate' },
        { type : 'duration' },
        { type : 'percentdone', width : 70 },
        {
            // @todo: replace type resourceassignment after it will accept the external renderer
            type            : 'column',
            text            : 'Assigned Resources',
            editor          : false,
            width           : 120,
            repaintOnResize : true,
            htmlEncode      : false,
            cellCls         : 'b-resource-avatar-cell',
            isGanttColumn   : true,
            renderer        : function({ record }) {
                const
                    imgSize = 30,
                    nbrVisible = Math.floor((this.width - 20) / (imgSize + 2)),
                    value = record.assignments || []
                ;
                return Array.from(value).map((assignment, i) => {
                    const resource = assignment['resource'];
        
                    let markup = '';
        
                    if (resource) {
                        
                        const
                            imgMarkup = `<img title="${resource.name} ${assignment['units']}%" class="b-resource-avatar" src="${imgFolderPath}${resource.name.toLowerCase() || 'none'}.jpg">`,
                            lastIndex = nbrVisible - 1,
                            overflowCount = value.length - nbrVisible;
        
                        if (overflowCount === 0 || i < lastIndex) {
                            markup = imgMarkup;
                        }
                        else if (i === lastIndex && overflowCount > 0) {
                            markup = `<div class="b-overflow-img">
                                        ${imgMarkup}
                                        <span class="b-overflow-count" title="${resource.name} ${assignment['units']}% (+${overflowCount} more resources)">+${overflowCount}</span>
                                    </div>`;
                        }
                    }
        
                    return markup;
                }).join('');
    
            } // eo renderer of Assigned Resources column
        },
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
        {
            type       : 'percentdone',
            text       : '%',
            width      : 70,
            htmlEncode : false,
            align      : 'center',
            renderer   : ({ value }) => {
                if (value) {
                    return `<div class="b-pie" style="animation-delay: -${value}s;"></div>`;
                }
            }
        },
        { type : 'constrainttype' },
        { type : 'constraintdate' },
        {
            type       : 'column',
            text       : 'Status',
            htmlEncode : false,
            editor     : false,
            renderer   : ({ record }) => {
                let status = '';

                if (record.isCompleted) {
                    status = 'Completed';
                }
                else if (record.endDate > Date.now()) {
                    status = 'Late';
                }
                else if (record.isStarted) {
                    status = 'Started';
                }
        
                return status ? `<i class="b-fa b-fa-circle ${status}"></i>${status}` : '';
        
            } // eo renderer of Status column
        },
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
    } // eo features
    
}; // eo ganttConfig

export default ganttConfig;

// eof
