/* eslint-disable no-unused-vars,no-undef */
(function() {
    const targetElement = document.querySelector('div[data-file="scheduler/EventTooltip.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

    targetElement.innerHTML = '<p>Hover an event to see a custom tooltip:</p>';
//START
let scheduler = new Scheduler({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    features : {
        eventTooltip : {
            template : data => `
            <div class="b-sch-event-tooltip">
             ${data.startText} -> ${data.endText}
            </div>`
        }
    },

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Hover me', startDate : '2018-05-07', endDate : '2018-05-10' },
        { id : 2, resourceId : 2, name : 'Or me', startDate : '2018-05-10', endDate : '2018-05-12' }
    ]
});
//END
})();
