StartTest(t => {
    t.it('Rendering', t => {
        t.chain(
            { waitForSelector : '.b-gantt-task' },

            next => {
                t.isGreater(document.querySelectorAll('.example').length, 0, 'A "bunch" of examples displayed');
                t.is(document.querySelectorAll('h2').length, 4, 'Header count correct');

                let link = document.querySelector('a#basic').href,
                    valid = link.endsWith('basic') || link.endsWith('basic/bundle.html');

                t.ok(valid, 'First link looks correct');

                next();
            }
        );
    });

    t.it('Changing theme', t => {
        // theme defaults to material, by using ?theme=material on url

        t.setWindowSize(1024, 400);

        t.chain(
            // First item should not be a default theme since popup won't be hidden
            ['Light', 'Default', 'Dark', 'Material', 'Stockholm'].map(theme => [
                next => {
                    document.documentElement.scrollTop = document.body.scrollTop = 0; // For IE 11
                    next();
                },

                { click : '[data-ref=infoButton]' },
                { click : '[data-ref=themeCombo]' },
                { click : `.b-list-item:contains(${theme})`, desc : `Switching to ${theme} theme` },

                { waitForSelectorNotFound : '.b-popup' },

                { click : 'header' },

                next => {
                    const thumb = document.querySelector('#basic img');
                    t.like(
                        thumb.src.toLowerCase(),
                        // eslint-disable-next-line no-useless-escape
                        `basic\/meta\/thumb.${theme.toLowerCase()}.png`,
                        'Correct thumb src for basic demo'
                    );
                    next();
                }
            ])
        );
    });
});
