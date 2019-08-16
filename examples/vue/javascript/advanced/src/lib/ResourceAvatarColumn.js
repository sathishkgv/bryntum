/**
 * @author Saki
 * @date 2019-04-20 19:09:07
 * @Last Modified by: Saki
 * @Last Modified time: 2019-04-28 21:02:40
 * 
 * Taken from the original example
 */
/*  */

import { ResourceAssignmentColumn, ColumnStore } from 'bryntum-gantt';

/**
 * @module ResourceAvatarColumn
 */

const imgFolderPath = 'users/';

/**
 * Column showing avatars of the assigned resource
 *
 * @extends Grid/column/Column
 * @classType resourceavatar
 */
export default class ResourceAvatarColumn extends ResourceAssignmentColumn {
    static get type() {
        return 'resourceavatar';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            repaintOnResize : true,
            htmlEncode      : false,
            cellCls         : 'b-resource-avatar-cell'
        };
    }

    renderer({ value }) {
        const imgSize = 30,
            nbrVisible = Math.floor((this.width - 20) / (imgSize + 2));

        return Array.from(value).map((assignment, i) => {
            const resource = assignment.resource;

            let markup = '';

            if (resource) {
                const
                    imgMarkup = `<img title="${resource.name} ${assignment.units}%" class="b-resource-avatar" src="${imgFolderPath}${resource.name.toLowerCase() || 'none'}.jpg">`,
                    lastIndex = nbrVisible - 1,
                    overflowCount = value.length - nbrVisible;

                if (overflowCount === 0 || i < lastIndex) {
                    markup = imgMarkup;
                }
                else if (i === lastIndex && overflowCount > 0) {
                    markup = `<div class="b-overflow-img">
                                  ${imgMarkup}
                                  <span class="b-overflow-count" title="${resource.name} ${assignment.units}% (+${overflowCount} more resources)">+${overflowCount}</span>
                              </div>`;
                }
            }

            return markup;
        }).join('');
    }
}

ColumnStore.registerColumnType(ResourceAvatarColumn);

// eof
