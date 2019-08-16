"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var product = 'bryntum-gantt'; // remove trial expiration key

  for (var key in localStorage) {
    if (key.includes('bryntum-')) {
      localStorage.removeItem(key);
    }
  }

  t.it('Examples do expire', function (t) {
    var frame = t.setIframe(),
        doc,
        webComponent,
        el,
        storageKey;

    function isNavigated(path) {
      return frame.contentDocument.URL.includes(path) && (doc = frame.contentDocument);
    }

    function cellReachable(path) {
      if (isNavigated(path)) {
        var root = doc;

        if (webComponent = doc.querySelector(product)) {
          root = webComponent.shadowRoot;
        }

        if (el = root && root.querySelector('.b-grid-subgrid-normal')) {
          return el.style.backgroundImage.includes('data:image/svg+xml;base64');
        }
      }
    }

    function cellUnreachable(path) {
      if (isNavigated(path)) {
        var root = doc;

        if (webComponent = doc.querySelector(product)) {
          root = webComponent.shadowRoot;
        }

        if (el = root && root.querySelector('.b-grid-header')) {
          var box = el.getBoundingClientRect();
          return root.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2) === root.querySelector('.b-mask') && !root.querySelector('.b-grid-row .b-grid-cell:not(:empty)');
        }
      }
    }

    function getRoot() {
      var doc = frame.contentDocument,
          root;

      if (root = doc.querySelector(product)) {
        root = root.shadowRoot;
      } else {
        root = doc;
      }

      return root && root.querySelector('.b-grid-row');
    }

    function doExpire() {
      storageKey = Object.keys(frame.contentWindow.localStorage).find(function (k) {
        return k.indexOf(product) !== -1;
      });
      frame.contentWindow.localStorage.setItem(storageKey, Date.now() - 1000 * 60 * 60 * 24 * 50);
      doc.location.reload();
    }

    function assertDemo(path) {
      return [
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                t.diag('Checking ' + path + ' demo');
                frame.contentDocument.location = '../examples/' + path;

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      })), {
        waitFor: function waitFor() {
          return getRoot();
        }
      }, {
        waitFor: function waitFor() {
          return cellReachable(path);
        }
      },
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", doExpire());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      })), {
        waitFor: function waitFor() {
          return cellUnreachable(path);
        }
      },
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                t.pass('Trial is expired properly');
                frame.contentWindow.localStorage.setItem(storageKey, Date.now());

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }))];
    }

    var isModern = !(t.bowser.msedge || t.bowser.msie);
    t.chain(isModern && assertDemo('basic'), assertDemo('basic/index.umd.html'), isModern && assertDemo('esmodule'), assertDemo('requirejs'), isModern && assertDemo('webcomponents'));
  });
});