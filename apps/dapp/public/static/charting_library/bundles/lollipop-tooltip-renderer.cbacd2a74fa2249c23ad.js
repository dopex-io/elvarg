(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9039],
  {
    59142: function (e, t) {
      var n, r, o;
      (r = [t]),
        (n = function (e) {
          'use strict';
          function t(e) {
            if (Array.isArray(e)) {
              for (var t = 0, n = Array(e.length); t < e.length; t++)
                n[t] = e[t];
              return n;
            }
            return Array.from(e);
          }
          Object.defineProperty(e, '__esModule', { value: !0 });
          var n = !1;
          if ('undefined' != typeof window) {
            var r = {
              get passive() {
                n = !0;
              },
            };
            window.addEventListener('testPassive', null, r),
              window.removeEventListener('testPassive', null, r);
          }
          var o =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            a = [],
            l = !1,
            s = -1,
            i = void 0,
            c = void 0,
            u = function (e) {
              return a.some(function (t) {
                return !(
                  !t.options.allowTouchMove || !t.options.allowTouchMove(e)
                );
              });
            },
            d = function (e) {
              var t = e || window.event;
              return (
                !!u(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              );
            },
            f = function () {
              setTimeout(function () {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== i &&
                    ((document.body.style.overflow = i), (i = void 0));
              });
            };
          (e.disableBodyScroll = function (e, r) {
            if (o) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.'
                );
              if (
                e &&
                !a.some(function (t) {
                  return t.targetElement === e;
                })
              ) {
                var f = { targetElement: e, options: r || {} };
                (a = [].concat(t(a), [f])),
                  (e.ontouchstart = function (e) {
                    1 === e.targetTouches.length &&
                      (s = e.targetTouches[0].clientY);
                  }),
                  (e.ontouchmove = function (t) {
                    var n, r, o, a;
                    1 === t.targetTouches.length &&
                      ((r = e),
                      (a = (n = t).targetTouches[0].clientY - s),
                      !u(n.target) &&
                        ((r && 0 === r.scrollTop && 0 < a) ||
                        ((o = r) &&
                          o.scrollHeight - o.scrollTop <= o.clientHeight &&
                          a < 0)
                          ? d(n)
                          : n.stopPropagation()));
                  }),
                  l ||
                    (document.addEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0
                    ),
                    (l = !0));
              }
            } else {
              (m = r),
                setTimeout(function () {
                  if (void 0 === c) {
                    var e = !!m && !0 === m.reserveScrollBarGap,
                      t =
                        window.innerWidth -
                        document.documentElement.clientWidth;
                    e &&
                      0 < t &&
                      ((c = document.body.style.paddingRight),
                      (document.body.style.paddingRight = t + 'px'));
                  }
                  void 0 === i &&
                    ((i = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'));
                });
              var p = { targetElement: e, options: r || {} };
              a = [].concat(t(a), [p]);
            }
            var m;
          }),
            (e.clearAllBodyScrollLocks = function () {
              o
                ? (a.forEach(function (e) {
                    (e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null);
                  }),
                  l &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0
                    ),
                    (l = !1)),
                  (a = []),
                  (s = -1))
                : (f(), (a = []));
            }),
            (e.enableBodyScroll = function (e) {
              if (o) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.'
                  );
                (e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (a = a.filter(function (t) {
                    return t.targetElement !== e;
                  })),
                  l &&
                    0 === a.length &&
                    (document.removeEventListener(
                      'touchmove',
                      d,
                      n ? { passive: !1 } : void 0
                    ),
                    (l = !1));
              } else
                1 === a.length && a[0].targetElement === e
                  ? (f(), (a = []))
                  : (a = a.filter(function (t) {
                      return t.targetElement !== e;
                    }));
            });
        }),
        void 0 === (o = 'function' == typeof n ? n.apply(t, r) : n) ||
          (e.exports = o);
    },
    97754: (e, t) => {
      var n;
      !(function () {
        'use strict';
        var r = {}.hasOwnProperty;
        function o() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t];
            if (n) {
              var a = typeof n;
              if ('string' === a || 'number' === a) e.push(n);
              else if (Array.isArray(n) && n.length) {
                var l = o.apply(null, n);
                l && e.push(l);
              } else if ('object' === a)
                for (var s in n) r.call(n, s) && n[s] && e.push(s);
            }
          }
          return e.join(' ');
        }
        e.exports
          ? ((o.default = o), (e.exports = o))
          : void 0 ===
              (n = function () {
                return o;
              }.apply(t, [])) || (e.exports = n);
      })();
    },
    66076: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      };
    },
    27267: (e, t, n) => {
      'use strict';
      function r(e, t, n, r, o) {
        function a(o) {
          if (e > o.timeStamp) return;
          const a = o.target;
          void 0 !== n &&
            null !== t &&
            null !== a &&
            a.ownerDocument === r &&
            (t.contains(a) || n(o));
        }
        return (
          o.click && r.addEventListener('click', a, !1),
          o.mouseDown && r.addEventListener('mousedown', a, !1),
          o.touchEnd && r.addEventListener('touchend', a, !1),
          o.touchStart && r.addEventListener('touchstart', a, !1),
          () => {
            r.removeEventListener('click', a, !1),
              r.removeEventListener('mousedown', a, !1),
              r.removeEventListener('touchend', a, !1),
              r.removeEventListener('touchstart', a, !1);
          }
        );
      }
      n.d(t, { addOutsideEventListener: () => r });
    },
    37558: (e, t, n) => {
      'use strict';
      n.d(t, { DrawerContext: () => l, DrawerManager: () => a });
      var r = n(50959),
        o = n(99054);
      class a extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._isBodyFixed = !1),
            (this._addDrawer = (e) => {
              this.setState((t) => ({ stack: [...t.stack, e] }));
            }),
            (this._removeDrawer = (e) => {
              this.setState((t) => ({ stack: t.stack.filter((t) => t !== e) }));
            }),
            (this.state = { stack: [] });
        }
        componentDidUpdate(e, t) {
          !t.stack.length &&
            this.state.stack.length &&
            ((0, o.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, o.setFixedBodyState)(!1), (this._isBodyFixed = !1));
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, o.setFixedBodyState)(!1);
        }
        render() {
          return r.createElement(
            l.Provider,
            {
              value: {
                addDrawer: this._addDrawer,
                removeDrawer: this._removeDrawer,
                currentDrawer: this.state.stack.length
                  ? this.state.stack[this.state.stack.length - 1]
                  : null,
              },
            },
            this.props.children
          );
        }
      }
      const l = r.createContext(null);
    },
    41590: (e, t, n) => {
      'use strict';
      n.d(t, { Drawer: () => f });
      var r = n(50959),
        o = n(50151),
        a = n(97754),
        l = n(36174),
        s = n(65718),
        i = n(37558),
        c = n(29197),
        u = n(86656),
        d = n(66076);
      function f(e) {
        const {
            position: t = 'Bottom',
            onClose: n,
            children: u,
            className: f,
            theme: m = d,
          } = e,
          h = (0, o.ensureNotNull)((0, r.useContext)(i.DrawerContext)),
          [v] = (0, r.useState)(() => (0, l.randomHash)()),
          y = (0, r.useRef)(null),
          g = (0, r.useContext)(c.CloseDelegateContext);
        return (
          (0, r.useLayoutEffect)(
            () => (
              (0, o.ensureNotNull)(y.current).focus({ preventScroll: !0 }),
              g.subscribe(h, n),
              h.addDrawer(v),
              () => {
                h.removeDrawer(v), g.unsubscribe(h, n);
              }
            ),
            []
          ),
          r.createElement(
            s.Portal,
            null,
            r.createElement(
              'div',
              { className: a(d.wrap, d[`position${t}`]) },
              v === h.currentDrawer &&
                r.createElement('div', { className: d.backdrop, onClick: n }),
              r.createElement(
                p,
                {
                  className: a(m.drawer, d[`position${t}`], f),
                  ref: y,
                  'data-name': e['data-name'],
                },
                u
              )
            )
          )
        );
      }
      const p = (0, r.forwardRef)((e, t) => {
        const { className: n, ...o } = e;
        return r.createElement(u.TouchScrollContainer, {
          className: a(d.drawer, n),
          tabIndex: -1,
          ref: t,
          ...o,
        });
      });
    },
    20520: (e, t, n) => {
      'use strict';
      n.d(t, {
        PopupMenu: () => f,
      });
      var r = n(50959),
        o = n(962),
        a = n(62942),
        l = n(65718),
        s = n(27317),
        i = n(29197);
      const c = r.createContext(void 0);
      var u = n(36383);
      const d = r.createContext({ setMenuMaxWidth: !1 });
      function f(e) {
        const {
            controller: t,
            children: n,
            isOpened: f,
            closeOnClickOutside: p = !0,
            doNotCloseOn: m,
            onClickOutside: h,
            onClose: v,
            onKeyboardClose: y,
            'data-name': g = 'popup-menu-container',
            ...b
          } = e,
          E = (0, r.useContext)(i.CloseDelegateContext),
          w = r.useContext(d),
          C = (0, r.useContext)(c),
          k = (0, u.useOutsideEvent)({
            handler: function (e) {
              h && h(e);
              if (!p) return;
              const t = (0, a.default)(m) ? m() : null == m ? [] : [m];
              if (t.length > 0 && e.target instanceof Node)
                for (const n of t) {
                  const t = o.findDOMNode(n);
                  if (t instanceof Node && t.contains(e.target)) return;
                }
              v();
            },
            mouseDown: !0,
            touchStart: !0,
          });
        return f
          ? r.createElement(
              l.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              r.createElement(
                'span',
                { ref: k, style: { pointerEvents: 'auto' } },
                r.createElement(
                  s.Menu,
                  {
                    ...b,
                    onClose: v,
                    onKeyboardClose: y,
                    onScroll: function (t) {
                      const { onScroll: n } = e;
                      n && n(t);
                    },
                    customCloseDelegate: E,
                    customRemeasureDelegate: C,
                    ref: t,
                    'data-name': g,
                    limitMaxWidth: w.setMenuMaxWidth,
                  },
                  n
                )
              )
            )
          : null;
      }
    },
    86656: (e, t, n) => {
      'use strict';
      n.d(t, { TouchScrollContainer: () => s });
      var r = n(50959),
        o = n(59142),
        a = n(50151),
        l = n(49483);
      const s = (0, r.forwardRef)((e, t) => {
        const { children: n, ...a } = e,
          s = (0, r.useRef)(null);
        return (
          (0, r.useImperativeHandle)(t, () => s.current),
          (0, r.useLayoutEffect)(() => {
            if (l.CheckMobile.iOS())
              return (
                null !== s.current &&
                  (0, o.disableBodyScroll)(s.current, { allowTouchMove: i(s) }),
                () => {
                  null !== s.current && (0, o.enableBodyScroll)(s.current);
                }
              );
          }, []),
          r.createElement('div', { ref: s, ...a }, n)
        );
      });
      function i(e) {
        return (t) => {
          const n = (0, a.ensureNotNull)(e.current),
            r = document.activeElement;
          return (
            !n.contains(t) || (null !== r && n.contains(r) && r.contains(t))
          );
        };
      }
    },
    40173: (e, t, n) => {
      'use strict';
      function r(e, t, n = {}) {
        return Object.assign(
          {},
          e,
          (function (e, t, n = {}) {
            const r = Object.assign({}, t);
            for (const o of Object.keys(t)) {
              const a = n[o] || o;
              a in e && (r[o] = [e[a], t[o]].join(' '));
            }
            return r;
          })(e, t, n)
        );
      }
      n.d(t, { mergeThemes: () => r });
    },
    95257: (e, t) => {
      'use strict';
      var n = Symbol.for('react.element'),
        r = Symbol.for('react.portal'),
        o = Symbol.for('react.fragment'),
        a = Symbol.for('react.strict_mode'),
        l = Symbol.for('react.profiler'),
        s = Symbol.for('react.provider'),
        i = Symbol.for('react.context'),
        c = Symbol.for('react.forward_ref'),
        u = Symbol.for('react.suspense'),
        d = Symbol.for('react.memo'),
        f = Symbol.for('react.lazy'),
        p = Symbol.iterator;
      var m = {
          isMounted: function () {
            return !1;
          },
          enqueueForceUpdate: function () {},
          enqueueReplaceState: function () {},
          enqueueSetState: function () {},
        },
        h = Object.assign,
        v = {};
      function y(e, t, n) {
        (this.props = e),
          (this.context = t),
          (this.refs = v),
          (this.updater = n || m);
      }
      function g() {}
      function b(e, t, n) {
        (this.props = e),
          (this.context = t),
          (this.refs = v),
          (this.updater = n || m);
      }
      (y.prototype.isReactComponent = {}),
        (y.prototype.setState = function (e, t) {
          if ('object' != typeof e && 'function' != typeof e && null != e)
            throw Error(
              'setState(...): takes an object of state variables to update or a function which returns an object of state variables.'
            );
          this.updater.enqueueSetState(this, e, t, 'setState');
        }),
        (y.prototype.forceUpdate = function (e) {
          this.updater.enqueueForceUpdate(this, e, 'forceUpdate');
        }),
        (g.prototype = y.prototype);
      var E = (b.prototype = new g());
      (E.constructor = b), h(E, y.prototype), (E.isPureReactComponent = !0);
      var w = Array.isArray,
        C = Object.prototype.hasOwnProperty,
        k = { current: null },
        x = { key: !0, ref: !0, __self: !0, __source: !0 };
      function S(e, t, r) {
        var o,
          a = {},
          l = null,
          s = null;
        if (null != t)
          for (o in (void 0 !== t.ref && (s = t.ref),
          void 0 !== t.key && (l = '' + t.key),
          t))
            C.call(t, o) && !x.hasOwnProperty(o) && (a[o] = t[o]);
        var i = arguments.length - 2;
        if (1 === i) a.children = r;
        else if (1 < i) {
          for (var c = Array(i), u = 0; u < i; u++) c[u] = arguments[u + 2];
          a.children = c;
        }
        if (e && e.defaultProps)
          for (o in (i = e.defaultProps)) void 0 === a[o] && (a[o] = i[o]);
        return {
          $$typeof: n,
          type: e,
          key: l,
          ref: s,
          props: a,
          _owner: k.current,
        };
      }
      function O(e) {
        return 'object' == typeof e && null !== e && e.$$typeof === n;
      }
      var _ = /\/+/g;
      function N(e, t) {
        return 'object' == typeof e && null !== e && null != e.key
          ? (function (e) {
              var t = { '=': '=0', ':': '=2' };
              return (
                '$' +
                e.replace(/[=:]/g, function (e) {
                  return t[e];
                })
              );
            })('' + e.key)
          : t.toString(36);
      }
      function R(e, t, o, a, l) {
        var s = typeof e;
        ('undefined' !== s && 'boolean' !== s) || (e = null);
        var i = !1;
        if (null === e) i = !0;
        else
          switch (s) {
            case 'string':
            case 'number':
              i = !0;
              break;
            case 'object':
              switch (e.$$typeof) {
                case n:
                case r:
                  i = !0;
              }
          }
        if (i)
          return (
            (l = l((i = e))),
            (e = '' === a ? '.' + N(i, 0) : a),
            w(l)
              ? ((o = ''),
                null != e && (o = e.replace(_, '$&/') + '/'),
                R(l, t, o, '', function (e) {
                  return e;
                }))
              : null != l &&
                (O(l) &&
                  (l = (function (e, t) {
                    return {
                      $$typeof: n,
                      type: e.type,
                      key: t,
                      ref: e.ref,
                      props: e.props,
                      _owner: e._owner,
                    };
                  })(
                    l,
                    o +
                      (!l.key || (i && i.key === l.key)
                        ? ''
                        : ('' + l.key).replace(_, '$&/') + '/') +
                      e
                  )),
                t.push(l)),
            1
          );
        if (((i = 0), (a = '' === a ? '.' : a + ':'), w(e)))
          for (var c = 0; c < e.length; c++) {
            var u = a + N((s = e[c]), c);
            i += R(s, t, o, u, l);
          }
        else if (
          ((u = (function (e) {
            return null === e || 'object' != typeof e
              ? null
              : 'function' == typeof (e = (p && e[p]) || e['@@iterator'])
              ? e
              : null;
          })(e)),
          'function' == typeof u)
        )
          for (e = u.call(e), c = 0; !(s = e.next()).done; )
            i += R((s = s.value), t, o, (u = a + N(s, c++)), l);
        else if ('object' === s)
          throw (
            ((t = String(e)),
            Error(
              'Objects are not valid as a React child (found: ' +
                ('[object Object]' === t
                  ? 'object with keys {' + Object.keys(e).join(', ') + '}'
                  : t) +
                '). If you meant to render a collection of children, use an array instead.'
            ))
          );
        return i;
      }
      function B(e, t, n) {
        if (null == e) return e;
        var r = [],
          o = 0;
        return (
          R(e, r, '', '', function (e) {
            return t.call(n, e, o++);
          }),
          r
        );
      }
      function F(e) {
        if (-1 === e._status) {
          var t = e._result;
          (t = t()).then(
            function (t) {
              (0 !== e._status && -1 !== e._status) ||
                ((e._status = 1), (e._result = t));
            },
            function (t) {
              (0 !== e._status && -1 !== e._status) ||
                ((e._status = 2), (e._result = t));
            }
          ),
            -1 === e._status && ((e._status = 0), (e._result = t));
        }
        if (1 === e._status) return e._result.default;
        throw e._result;
      }
      var T = { current: null },
        M = { transition: null },
        D = {
          ReactCurrentDispatcher: T,
          ReactCurrentBatchConfig: M,
          ReactCurrentOwner: k,
        };
      (t.Children = {
        map: B,
        forEach: function (e, t, n) {
          B(
            e,
            function () {
              t.apply(this, arguments);
            },
            n
          );
        },
        count: function (e) {
          var t = 0;
          return (
            B(e, function () {
              t++;
            }),
            t
          );
        },
        toArray: function (e) {
          return (
            B(e, function (e) {
              return e;
            }) || []
          );
        },
        only: function (e) {
          if (!O(e))
            throw Error(
              'React.Children.only expected to receive a single React element child.'
            );
          return e;
        },
      }),
        (t.Component = y),
        (t.Fragment = o),
        (t.Profiler = l),
        (t.PureComponent = b),
        (t.StrictMode = a),
        (t.Suspense = u),
        (t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = D),
        (t.cloneElement = function (e, t, r) {
          if (null == e)
            throw Error(
              'React.cloneElement(...): The argument must be a React element, but you passed ' +
                e +
                '.'
            );
          var o = h({}, e.props),
            a = e.key,
            l = e.ref,
            s = e._owner;
          if (null != t) {
            if (
              (void 0 !== t.ref && ((l = t.ref), (s = k.current)),
              void 0 !== t.key && (a = '' + t.key),
              e.type && e.type.defaultProps)
            )
              var i = e.type.defaultProps;
            for (c in t)
              C.call(t, c) &&
                !x.hasOwnProperty(c) &&
                (o[c] = void 0 === t[c] && void 0 !== i ? i[c] : t[c]);
          }
          var c = arguments.length - 2;
          if (1 === c) o.children = r;
          else if (1 < c) {
            i = Array(c);
            for (var u = 0; u < c; u++) i[u] = arguments[u + 2];
            o.children = i;
          }
          return {
            $$typeof: n,
            type: e.type,
            key: a,
            ref: l,
            props: o,
            _owner: s,
          };
        }),
        (t.createContext = function (e) {
          return (
            ((e = {
              $$typeof: i,
              _currentValue: e,
              _currentValue2: e,
              _threadCount: 0,
              Provider: null,
              Consumer: null,
              _defaultValue: null,
              _globalName: null,
            }).Provider = { $$typeof: s, _context: e }),
            (e.Consumer = e)
          );
        }),
        (t.createElement = S),
        (t.createFactory = function (e) {
          var t = S.bind(null, e);
          return (t.type = e), t;
        }),
        (t.createRef = function () {
          return { current: null };
        }),
        (t.forwardRef = function (e) {
          return { $$typeof: c, render: e };
        }),
        (t.isValidElement = O),
        (t.lazy = function (e) {
          return {
            $$typeof: f,
            _payload: { _status: -1, _result: e },
            _init: F,
          };
        }),
        (t.memo = function (e, t) {
          return { $$typeof: d, type: e, compare: void 0 === t ? null : t };
        }),
        (t.startTransition = function (e) {
          var t = M.transition;
          M.transition = {};
          try {
            e();
          } finally {
            M.transition = t;
          }
        }),
        (t.unstable_act = function () {
          throw Error(
            'act(...) is not supported in production builds of React.'
          );
        }),
        (t.useCallback = function (e, t) {
          return T.current.useCallback(e, t);
        }),
        (t.useContext = function (e) {
          return T.current.useContext(e);
        }),
        (t.useDebugValue = function () {}),
        (t.useDeferredValue = function (e) {
          return T.current.useDeferredValue(e);
        }),
        (t.useEffect = function (e, t) {
          return T.current.useEffect(e, t);
        }),
        (t.useId = function () {
          return T.current.useId();
        }),
        (t.useImperativeHandle = function (e, t, n) {
          return T.current.useImperativeHandle(e, t, n);
        }),
        (t.useInsertionEffect = function (e, t) {
          return T.current.useInsertionEffect(e, t);
        }),
        (t.useLayoutEffect = function (e, t) {
          return T.current.useLayoutEffect(e, t);
        }),
        (t.useMemo = function (e, t) {
          return T.current.useMemo(e, t);
        }),
        (t.useReducer = function (e, t, n) {
          return T.current.useReducer(e, t, n);
        }),
        (t.useRef = function (e) {
          return T.current.useRef(e);
        }),
        (t.useState = function (e) {
          return T.current.useState(e);
        }),
        (t.useSyncExternalStore = function (e, t, n) {
          return T.current.useSyncExternalStore(e, t, n);
        }),
        (t.useTransition = function () {
          return T.current.useTransition();
        }),
        (t.version = '18.2.0');
    },
    50959: (e, t, n) => {
      'use strict';
      e.exports = n(95257);
    },
    25105: (e) => {
      e.exports = {
        drawer: 'drawer-xBKhVqal',
        drawerItem: 'drawerItem-xBKhVqal',
        menuWrap: 'menuWrap-xBKhVqal',
        scrollWrap: 'scrollWrap-xBKhVqal',
        menuBox: 'menuBox-xBKhVqal',
        card: 'card-xBKhVqal',
        cardRow: 'cardRow-xBKhVqal',
        mini: 'mini-xBKhVqal',
        fadeTop: 'fadeTop-xBKhVqal',
        fadeBottom: 'fadeBottom-xBKhVqal',
      };
    },
    13668: (e) => {
      e.exports = {
        content: 'content-tm3FiOQl',
        contentWithTab: 'contentWithTab-tm3FiOQl',
        group: 'group-tm3FiOQl',
        titleWrapper: 'titleWrapper-tm3FiOQl',
        title: 'title-tm3FiOQl',
        subtitle: 'subtitle-tm3FiOQl',
        text: 'text-tm3FiOQl',
        icon: 'icon-tm3FiOQl',
        tabsWrapper: 'tabsWrapper-tm3FiOQl',
        tabsContentWrapper: 'tabsContentWrapper-tm3FiOQl',
        groupIcon: 'groupIcon-tm3FiOQl',
        beforeMarketOpen: 'beforeMarketOpen-tm3FiOQl',
        afterMarketClose: 'afterMarketClose-tm3FiOQl',
        groupTitle: 'groupTitle-tm3FiOQl',
        groupRow: 'groupRow-tm3FiOQl',
        groupCell: 'groupCell-tm3FiOQl',
        link: 'link-tm3FiOQl',
        mob: 'mob-tm3FiOQl',
        mini: 'mini-tm3FiOQl',
        generalContent: 'generalContent-tm3FiOQl',
      };
    },
    88033: (e, t, n) => {
      'use strict';
      n.r(t), n.d(t, { showLollipopTooltip: () => T });
      var r = n(50959),
        o = n(962),
        a = n(50151),
        l = n(97754),
        s = n.n(l);
      function i(e, t, n) {
        (0, r.useEffect)(() => {
          const r = new IntersectionObserver(
            (e) => {
              e[e.length - 1].intersectionRatio < 0.25 ? n() : t();
            },
            {
              threshold: [0, 0.25, 0.5, 0.75, 1],
              root: null,
              rootMargin: '0px',
            }
          );
          return e.current && r.observe(e.current), () => r.disconnect();
        }, []);
      }
      var c = n(90692),
        u = n(41590),
        d = n(37558),
        f = n(20520),
        p = n(59064),
        m = n(68335),
        h = n(1722);
      const v = (0, r.forwardRef)((e, t) => {
        const {
            onClose: n,
            onForceClose: o,
            onClickOutside: a,
            className: l,
            ...s
          } = e,
          i = (0, r.useRef)(null);
        (0, r.useEffect)(
          () => (
            p.globalCloseDelegate.subscribe(null, o),
            () => {
              p.globalCloseDelegate.unsubscribe(null, o);
            }
          ),
          [o]
        );
        const c = (0, r.useCallback)(
            (e) => {
              27 === (0, m.hashFromEvent)(e) && (e.preventDefault(), o());
            },
            [o]
          ),
          u = (0, r.useCallback)(() => {
            i.current && i.current.focus({ preventScroll: !0 });
          }, []);
        return r.createElement(
          f.PopupMenu,
          {
            className: l,
            isOpened: !0,
            tabIndex: -1,
            reference: (e) => {
              'function' == typeof t
                ? t(e)
                : (0, h.isObject)(t) && (t.current = e),
                (i.current = e);
            },
            onClose: n,
            onClickOutside: a,
            onKeyDown: c,
            onOpen: u,
            ...s,
          },
          e.children
        );
      });
      function y(e) {
        (0, r.useEffect)(() => {
          return (
            (e = g),
            window.addEventListener('scroll', e),
            () => window.removeEventListener('scroll', e)
          );
          var e;
        }, []),
          (0, r.useEffect)(() => {
            if (e.length)
              return (function (e, t) {
                for (const n of e) n.subscribe(null, t);
                return () => {
                  for (const n of e) n.unsubscribe(null, t);
                };
              })(e, g);
          }, e);
      }
      function g() {
        (0, p.globalCloseMenu)();
      }
      var b,
        E = n(40173),
        w = n(27317),
        C = n(9745),
        k = n(13668);
      function x(e) {
        const { text: t, href: n, onClick: o } = e;
        return r.createElement(
          'a',
          {
            href: n,
            onClick:
              o &&
              ((e) => {
                e.preventDefault(), o();
              }),
            className: k.link,
          },
          t
        );
      }
      function S(e) {
        const {
          name: t,
          value: n,
          style: o,
          valueStyle: a,
          onValueClick: l,
          valueRightIcon: i,
          className: c,
        } = e;
        return r.createElement(
          'div',
          { className: s()(k.groupRow, c), style: o },
          t &&
            r.createElement(
              'div',
              { className: k.groupCell },
              r.createElement('span', { className: k.text }, t)
            ),
          r.createElement(
            'div',
            { className: k.groupCell },
            r.createElement(
              'span',
              { className: k.text, style: a, onClick: l },
              n
            ),
            i &&
              r.createElement(C.Icon, {
                icon: i.iconContent,
                className: s()(
                  k.groupIcon,
                  i.iconClass,
                  'apply-common-tooltip'
                ),
                title: i.tooltipText,
              })
          )
        );
      }
      function O(e) {
        const { content: t = [], subTitle: n, cardRowClass: o } = e,
          a = t.map((e, t) => {
            const { title: n, content: o } = e;
            return r.createElement(
              'div',
              { key: `group${t}`, className: k.group },
              n && r.createElement('span', { className: k.groupTitle }, n),
              o.map((e, t) =>
                r.createElement(S, { key: `contentRow${t}`, ...e })
              )
            );
          }),
          l =
            'string' == typeof n
              ? n
              : n.map((e, t) =>
                  r.createElement(S, { key: `subTitle${t}`, ...e })
                );
        return r.createElement(
          'div',
          { className: o },
          r.createElement('span', { className: k.subtitle }, l),
          a.length > 0 && r.createElement('div', null, a)
        );
      }
      function _(e) {
        var t;
        const { cardType: n, anchor: o, ...a } = e,
          l = n ? s()(k.content, k[n]) : k.content;
        return r.createElement(
          'div',
          { className: l },
          e.title &&
            r.createElement(
              'div',
              {
                className: s()(k.titleWrapper, e.cardRowClass),
              },
              e.tooltipIcon &&
                r.createElement(C.Icon, {
                  icon: e.tooltipIcon,
                  className: k.icon,
                  style: {
                    color:
                      null === (t = e.style) || void 0 === t ? void 0 : t.color,
                  },
                }),
              r.createElement('span', { className: k.title }, e.title)
            ),
          'common' === a.type && r.createElement(O, { ...a }),
          o &&
            ('mob' !== n || !o.hideInMobileMode) &&
            r.createElement(
              'div',
              { className: s()(k.group, e.cardRowClass) },
              r.createElement(x, { ...o })
            )
        );
      }
      !(function (e) {
        (e[(e.BeforeMarketOpen = k.beforeMarketOpen)] = 'BeforeMarketOpen'),
          (e[(e.AfterMarketClose = k.afterMarketClose)] = 'AfterMarketClose');
      })(b || (b = {}));
      var N = n(25105);
      const R = (0, E.mergeThemes)(w.DEFAULT_MENU_THEME, {
        menuWrap: N.menuWrap,
        menuBox: N.menuBox,
      });
      function B(e) {
        const {
            tooltips: t,
            onClose: n,
            onForceClose: o,
            onClickOutside: a,
            position: l,
            customCloseSubscriptions: f = [],
            showScrollFades: p,
            cardType: m,
            doNotCloseOn: h,
          } = e,
          g = (0, r.useRef)(null),
          b = (0, r.useRef)(null),
          E = (0, r.useRef)(null),
          w = (0, r.useRef)(null),
          [C, k] = (0, r.useState)('100%'),
          x = (e) => {
            null !== e && k(`${e.clientWidth}px`);
          },
          [S, O] = (0, r.useState)(!1);
        i(
          E,
          () => O(!1),
          () => O(!0)
        );
        const B = { display: S ? 'block' : 'none', width: C },
          [F, T] = (0, r.useState)(!1);
        i(
          w,
          () => T(!1),
          () => T(!0)
        );
        const M = { display: F ? 'block' : 'none', width: C };
        y(f);
        const D = m ? s()(N.card, N[m]) : N.card;
        return r.createElement(
          d.DrawerManager,
          null,
          r.createElement(
            c.MatchMedia,
            { rule: 'screen and (max-width: 419px)' },
            (e) =>
              e
                ? r.createElement(
                    u.Drawer,
                    {
                      className: N.drawer,
                      onClose: o || n,
                      position: 'Bottom',
                    },
                    t.map((e, t) =>
                      r.createElement(
                        'div',
                        { key: `${t}`, className: N.drawerItem },
                        r.createElement(_, { cardType: 'mob', ...e })
                      )
                    )
                  )
                : r.createElement(
                    v,
                    {
                      position: l,
                      theme: R,
                      onClose: n,
                      onForceClose: o || n,
                      onClickOutside: a,
                      doNotCloseOn: h,
                    },
                    p &&
                      r.createElement(
                        r.Fragment,
                        null,
                        r.createElement('div', {
                          ref: g,
                          className: N.fadeTop,
                          style: B,
                        }),
                        r.createElement('div', { ref: E })
                      ),
                    r.createElement(
                      'div',
                      { ref: x },
                      t.map((e, t) => {
                        var n;
                        return r.createElement(
                          'div',
                          {
                            key: `${t}`,
                            className: D,
                            style: {
                              borderColor:
                                null === (n = e.style) || void 0 === n
                                  ? void 0
                                  : n.color,
                            },
                          },
                          r.createElement(_, {
                            cardType: m,
                            ...e,
                            cardRowClass: N.cardRow,
                          })
                        );
                      })
                    ),
                    p &&
                      r.createElement(
                        r.Fragment,
                        null,
                        r.createElement('div', { ref: w }),
                        r.createElement('div', {
                          ref: b,
                          className: N.fadeBottom,
                          style: M,
                        })
                      )
                  )
          )
        );
      }
      let F = null;
      function T(e) {
        if (!e.items.length) return () => {};
        const t = {
          tooltips: e.items,
          onClose: M,
          onForceClose: () => {
            M(), 'function' == typeof e.onCustomClose && e.onCustomClose();
          },
          onClickOutside: e.onClickOutside,
          doNotCloseOn: e.doNotCloseOn,
          position: D.bind(null, e.position),
          customCloseSubscriptions: e.customCloseSubscriptions,
          showScrollFades: e.showScrollFades,
          cardType: e.cardType,
        };
        return (
          null === F &&
            ((F = document.createElement('div')), document.body.appendChild(F)),
          o.render(r.createElement(B, { ...t }), F),
          M
        );
      }
      function M() {
        null !== F && (o.unmountComponentAtNode(F), F.remove(), (F = null));
      }
      function D(e, t, n) {
        const r = e.target,
          o = r.getBoundingClientRect(),
          l = o.width - e.targetSize.width,
          s = o.height - e.targetSize.height,
          i = (0, a.ensureNotNull)(r.closest('.chart-container')),
          c = i.getBoundingClientRect(),
          u = (0, a.ensureNotNull)(i.parentElement).getBoundingClientRect(),
          d = o.left + e.point.x + l,
          f = Math.round(d - t / 2),
          p = Math.min(f + t, c.right, u.right);
        let m,
          h,
          v = Math.max(p - t, c.left, u.left);
        v + t >= u.right && (v = u.right - t);
        const y = c.bottom - (o.top + e.point.y + s),
          g = c.height - y - e.marginTop;
        return (
          g < n
            ? ((h = e.marginTop + c.top), (m = Math.max(g, 0)))
            : (h = c.height + c.top - y - n),
          { x: v, y: h, overrideHeight: m }
        );
      }
    },
  },
]);
