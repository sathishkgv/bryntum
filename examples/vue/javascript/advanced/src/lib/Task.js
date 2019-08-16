/**
 * @author Saki
 * @date 2019-04-20 18:57:53
 * @Last Modified by: Saki
 * @Last Modified time: 2019-04-20 18:59:38
 * 
 * Taken from the original example
 */
import { TaskModel } from 'bryntum-gantt';

// here you can extend our default Task class with your additional fields, methods and logic
export default class Task extends TaskModel {

    static get fields() {
        return [
            { name : 'deadline', type : 'date' }
        ];
    }

    get isLate() {
        return this.deadline && Date.now() > this.deadline;
    }
}

// eof
