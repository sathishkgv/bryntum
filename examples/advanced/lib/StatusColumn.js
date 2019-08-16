import Column from '../../../lib/Grid/column/Column.js';
import ColumnStore from '../../../lib/Grid/data/ColumnStore.js';

/**
 * @module StatusColumn
 */

/**
 * A column showing the status of a task
 *
 * @extends Gantt/column/Column
 * @classType percentdonepie
 */
export default class StatusColumn extends Column {
    static get type() {
        return 'statuscolumn';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            // Set your default instance config propertiess here
            text       : 'Status',
            htmlEncode : false,
            editor     : false
        };
    }

    //endregion

    renderer({ record }) {
        let icon = '',
            status = '',
            cls = '';

        if (record.isCompleted) {
            status = 'Completed';
            cls = 'b-completed';
        }
        else if (record.endDate > Date.now()) {
            status = 'Late';
            cls = 'b-late';
        }
        else if (record.isStarted) {
            status = 'Started';
            cls = 'b-started';
        }

        return status ? `<i class="b-fa b-fa-circle ${status}"></i>${status}` : '';
    }
}

ColumnStore.registerColumnType(StatusColumn);
