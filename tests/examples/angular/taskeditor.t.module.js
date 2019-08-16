/**
 * @author Saki
 * @date 2019-05-20 20:28:38
 * @Last Modified by: Saki
 * @Last Modified time: 2019-05-24 21:21:29
 * 
 * Filtering Angular demo test
 * 
 * cSpell: ignore 
 */
describe('Test Taskeditor demo', function(t) {
    const
        taskSelector = '[data-task-id="11"]'
    ;

    t.it('Check task editor tabs', t => {
        t.chain(
            {
                waitForSelector : taskSelector,
                desc            : 'Task appears'
            },
            { dblClick : taskSelector },
            {
                waitForSelector : '.b-gantt-taskeditor',
                desc            : 'Task editor opens'
            },

            { click : ':textEquals(General)' },

            {
                waitForSelector : '.b-active span:textEquals(General)',
                desc            : 'Can activate General tab'
            },

            { click : ':textEquals(Successors)' },

            {
                waitForSelector : '.b-active span:textEquals(Successors)',
                desc            : 'Can activate Successors tab'
            },

            { click : ':textEquals(Predecessors)' },

            {
                waitForSelector : '.b-active span:textEquals(Predecessors)',
                desc            : 'Can activate Predecessors tab'
            },

            { click : ':textEquals(Resources)' },

            {
                waitForSelector : '.b-active span:textEquals(Resources)',
                desc            : 'Can activate Resources tab'
            },

            { click : ':textEquals(Advanced)' },

            {
                waitForSelector : '.b-active span:textEquals(Advanced)',
                desc            : 'Can activate Advanced tab'
            },

            { click : ':textEquals(Files)' },

            {
                waitForSelector : '.b-active span:textEquals(Files)',
                desc            : 'Can activate Files tab'
            },

            { click : ':textEquals(General)' },

            {
                waitForSelector : '.b-active span:textEquals(General)'
            },
            
            { type : '[BACKSPACE][BACKSPACE][BACKSPACE][BACKSPACE][BACKSPACE][BACKSPACE]', target : '[name="name"]' },

            { type : 'N', target : '[name="name"]', options : { shiftKey : true } },

            { type : 'gnix', target : '[name="name"]' },

            { click : ':textEquals(Save)' },

            {
                waitForSelector : '.b-tree-cell-value:textEquals(Install Ngnix)',
                desc            : 'Can edit and save task name'
            }
        
        );
    });

}); // eo describe Test buttons

// eof
