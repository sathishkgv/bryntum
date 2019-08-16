StartTest(function(t) {

    const product = 'bryntum-gantt';

    // remove trial expiration key
    for (let key in localStorage) {
        if (key.includes('bryntum-')) {
            localStorage.removeItem(key);
        }
    }

    t.it('Examples do expire', function(t) {
        let frame = t.setIframe(),
            doc,
            webComponent,
            el,
            storageKey;

        function isNavigated(path) {
            return frame.contentDocument.URL.includes(path) && (doc = frame.contentDocument);
        }

        function cellReachable(path) {
            if (isNavigated(path)) {

                let root = doc;

                if ((webComponent = doc.querySelector(product))) {
                    root = webComponent.shadowRoot;
                }

                if ((el = root && root.querySelector('.b-grid-subgrid-normal'))) {
                    return el.style.backgroundImage.includes('data:image/svg+xml;base64');
                }
            }
        }

        function cellUnreachable(path) {
            if (isNavigated(path)) {

                let root = doc;

                if ((webComponent = doc.querySelector(product))) {
                    root = webComponent.shadowRoot;
                }

                if ((el = root && root.querySelector('.b-grid-header'))) {
                    const box = el.getBoundingClientRect();
                    return root.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2) === root.querySelector('.b-mask') &&
                        !root.querySelector('.b-grid-row .b-grid-cell:not(:empty)');
                }
            }
        }

        function getRoot() {
            let doc = frame.contentDocument,
                root;
            if ((root = doc.querySelector(product))) {
                root = root.shadowRoot;
            }
            else {
                root = doc;
            }
            return root && root.querySelector('.b-grid-row');
        }

        function doExpire() {
            storageKey = Object.keys(frame.contentWindow.localStorage).find(function(k) {
                return k.indexOf(product) !== -1;
            });
            frame.contentWindow.localStorage.setItem(storageKey, Date.now() - 1000 * 60 * 60 * 24 * 50);
            doc.location.reload();
        }

        function assertDemo(path) {
            return [
                async() => {
                    t.diag('Checking ' + path + ' demo');
                    frame.contentDocument.location = '../examples/' + path;
                },
                { waitFor : () => getRoot() },
                { waitFor : () => cellReachable(path) },
                async() => doExpire(),
                { waitFor : () => cellUnreachable(path) },
                async() => {
                    t.pass('Trial is expired properly');
                    frame.contentWindow.localStorage.setItem(storageKey, Date.now());
                }
            ];
        }

        const
            isModern = !(t.bowser.msedge || t.bowser.msie);

        t.chain(
            isModern && assertDemo('basic'),
            assertDemo('basic/index.umd.html'),
            isModern && assertDemo('esmodule'),
            assertDemo('requirejs'),
            isModern && assertDemo('webcomponents')
        );
    });
});
