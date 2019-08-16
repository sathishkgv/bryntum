(function () {
const targetElement = document.querySelector('div[data-file="widget/Badge.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

//START
// button with badge, click to increase
new Button({
    appendTo : targetElement,
    cls      : 'b-raised',
    text     : 'Click to increase',
    badge    : '1',
    style    : 'margin-right: 2em',
    onClick  : btn => btn.badge++
});

new TextField({
    appendTo : targetElement,
    badge    : '4',
    label    : 'Text length',
    value    : 'Text',
    onInput  : field =>
        field.badge = field.value.length
});
//END
})();