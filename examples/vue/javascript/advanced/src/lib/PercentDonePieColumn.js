/**
 * @author Saki
 * @date 2019-04-20 19:11:21
 * @Last Modified by: Saki
 * @Last Modified time: 2019-04-28 21:01:53
 * 
 * Taken from the original example
 */
/*  */

import { PercentDoneColumn, ColumnStore } from 'bryntum-gantt';

/**
 * @module PercentDonePieColumn
 */

/**
 * A column drawing a pie chart of the `percentDone` value
 *
 * @extends Gantt/column/PercentDoneColumn
 * @classType percentdonepie
 */
export default class PercentDonePieColumn extends PercentDoneColumn {
    static get type() {
        return 'percentdonepie';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            // Set your default instance config properties here
            htmlEncode: false,
            align: 'center'
        };
    }

    //endregion

    renderer({value}) {
        if (value) {
            return `<div class="b-pie" style="animation-delay: -${value}s;"></div>`;
        }
    }
}

ColumnStore.registerColumnType(PercentDonePieColumn);

// eof
