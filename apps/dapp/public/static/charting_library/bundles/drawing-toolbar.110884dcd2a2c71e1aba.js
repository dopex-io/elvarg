(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2878],
  {
    10888: (e) => {
      e.exports = { 'default-drawer-min-top-distance': '100px' };
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
    34290: (e) => {
      e.exports = { emoji: 'emoji-BsERGcZ1' };
    },
    97662: (e) => {
      e.exports = { list: 'list-JPoFARaG' };
    },
    46809: (e) => {
      e.exports = { wrapper: 'wrapper-VmCoyMWF' };
    },
    11123: (e) => {
      e.exports = {
        wrapper: 'wrapper-M14KUVdG',
        emojiItem: 'emojiItem-M14KUVdG',
        hovered: 'hovered-M14KUVdG',
      };
    },
    17373: (e) => {
      e.exports = {
        wrapper: 'wrapper-hoWtpNyh',
        isActive: 'isActive-hoWtpNyh',
      };
    },
    12134: (e) => {
      e.exports = { wrapper: 'wrapper-RXEt_NWz' };
    },
    89346: (e) => {
      e.exports = { wrapper: 'wrapper-QWmdCZSA' };
    },
    53737: (e) => {
      e.exports = { wrapper: 'wrapper-mz0866M2', hovered: 'hovered-mz0866M2' };
    },
    13193: (e) => {
      e.exports = { wrapper: 'wrapper-MeQD3kFA' };
    },
    33963: (e) => {
      e.exports = {
        item: 'item-zwyEh4hn',
        label: 'label-zwyEh4hn',
        labelRow: 'labelRow-zwyEh4hn',
        toolbox: 'toolbox-zwyEh4hn',
      };
    },
    71986: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        item: 'item-jFqVJoPk',
        hovered: 'hovered-jFqVJoPk',
        isDisabled: 'isDisabled-jFqVJoPk',
        isActive: 'isActive-jFqVJoPk',
        shortcut: 'shortcut-jFqVJoPk',
        toolbox: 'toolbox-jFqVJoPk',
        withIcon: 'withIcon-jFqVJoPk',
        'round-icon': 'round-icon-jFqVJoPk',
        icon: 'icon-jFqVJoPk',
        labelRow: 'labelRow-jFqVJoPk',
        label: 'label-jFqVJoPk',
        showOnHover: 'showOnHover-jFqVJoPk',
        showOnFocus: 'showOnFocus-jFqVJoPk',
      };
    },
    39416: (e, t, o) => {
      'use strict';
      o.d(t, { useFunctionalRefObject: () => a });
      var n = o(50959),
        i = o(43010);
      function a(e) {
        const t = (0, n.useMemo)(
            () =>
              (function (e) {
                const t = (o) => {
                  e(o), (t.current = o);
                };
                return (t.current = null), t;
              })((e) => {
                r.current(e);
              }),
            []
          ),
          o = (0, n.useRef)(null),
          a = (t) => {
            if (null === t) return l(o.current, t), void (o.current = null);
            o.current !== e && ((o.current = e), l(o.current, t));
          },
          r = (0, n.useRef)(a);
        return (
          (r.current = a),
          (0, i.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return r.current(t.current), () => r.current(null);
          }, [e]),
          t
        );
      }
      function l(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t));
      }
    },
    43010: (e, t, o) => {
      'use strict';
      o.d(t, { useIsomorphicLayoutEffect: () => i });
      var n = o(50959);
      function i(e, t) {
        ('undefined' == typeof window ? n.useEffect : n.useLayoutEffect)(e, t);
      }
    },
    27267: (e, t, o) => {
      'use strict';
      function n(e, t, o, n, i) {
        function a(i) {
          if (e > i.timeStamp) return;
          const a = i.target;
          void 0 !== o &&
            null !== t &&
            null !== a &&
            a.ownerDocument === n &&
            (t.contains(a) || o(i));
        }
        return (
          i.click && n.addEventListener('click', a, !1),
          i.mouseDown && n.addEventListener('mousedown', a, !1),
          i.touchEnd && n.addEventListener('touchend', a, !1),
          i.touchStart && n.addEventListener('touchstart', a, !1),
          () => {
            n.removeEventListener('click', a, !1),
              n.removeEventListener('mousedown', a, !1),
              n.removeEventListener('touchend', a, !1),
              n.removeEventListener('touchstart', a, !1);
          }
        );
      }
      o.d(t, { addOutsideEventListener: () => n });
    },
    67842: (e, t, o) => {
      'use strict';
      o.d(t, { useResizeObserver: () => r });
      var n = o(50959),
        i = o(59255),
        a = o(43010),
        l = o(39416);
      function r(e, t = []) {
        const { callback: o, ref: r = null } = (function (e) {
            return 'function' == typeof e ? { callback: e } : e;
          })(e),
          s = (0, n.useRef)(null),
          c = (0, n.useRef)(o);
        c.current = o;
        const u = (0, l.useFunctionalRefObject)(r),
          d = (0, n.useCallback)(
            (e) => {
              u(e),
                null !== s.current &&
                  (s.current.disconnect(), null !== e && s.current.observe(e));
            },
            [u, s]
          );
        return (
          (0, a.useIsomorphicLayoutEffect)(
            () => (
              (s.current = new i.default((e, t) => {
                c.current(e, t);
              })),
              u.current && d(u.current),
              () => {
                var e;
                null === (e = s.current) || void 0 === e || e.disconnect();
              }
            ),
            [u, ...t]
          ),
          d
        );
      }
    },
    90186: (e, t, o) => {
      'use strict';
      function n(e) {
        return a(e, l);
      }
      function i(e) {
        return a(e, r);
      }
      function a(e, t) {
        const o = Object.entries(e).filter(t),
          n = {};
        for (const [e, t] of o) n[e] = t;
        return n;
      }
      function l(e) {
        const [t, o] = e;
        return 0 === t.indexOf('data-') && 'string' == typeof o;
      }
      function r(e) {
        return 0 === e[0].indexOf('aria-');
      }
      o.d(t, {
        filterAriaProps: () => i,
        filterDataProps: () => n,
        filterProps: () => a,
        isAriaAttribute: () => r,
        isDataAttribute: () => l,
      });
    },
    76460: (e, t, o) => {
      'use strict';
      function n(e) {
        return 0 === e.detail;
      }
      o.d(t, { isKeyboardClick: () => n });
    },
    47201: (e, t, o) => {
      'use strict';
      function n(...e) {
        return (t) => {
          for (const o of e) void 0 !== o && o(t);
        };
      }
      o.d(t, { createSafeMulticastEventHandler: () => n });
    },
    45601: (e, t, o) => {
      'use strict';
      o.d(t, { Measure: () => i });
      var n = o(67842);
      function i(e) {
        const { children: t, onResize: o } = e;
        return t((0, n.useResizeObserver)(o || (() => {}), [null === o]));
      }
    },
    50238: (e, t, o) => {
      'use strict';
      o.d(t, { useRovingTabindexElement: () => l });
      var n = o(50959),
        i = o(39416),
        a = o(16838);
      function l(e, t = []) {
        const [o, l] = (0, n.useState)(!1),
          r = (0, i.useFunctionalRefObject)(e);
        return (
          (0, n.useEffect)(() => {
            if (!a.PLATFORM_ACCESSIBILITY_ENABLED) return;
            const e = r.current;
            if (null === e) return;
            const t = (e) => {
              switch (e.type) {
                case 'roving-tabindex:main-element':
                  l(!0);
                  break;
                case 'roving-tabindex:secondary-element':
                  l(!1);
              }
            };
            return (
              e.addEventListener('roving-tabindex:main-element', t),
              e.addEventListener('roving-tabindex:secondary-element', t),
              () => {
                e.removeEventListener('roving-tabindex:main-element', t),
                  e.removeEventListener('roving-tabindex:secondary-element', t);
              }
            );
          }, t),
          [r, a.PLATFORM_ACCESSIBILITY_ENABLED ? (o ? 0 : -1) : void 0]
        );
      }
    },
    37558: (e, t, o) => {
      'use strict';
      o.d(t, { DrawerContext: () => l, DrawerManager: () => a });
      var n = o(50959),
        i = o(99054);
      class a extends n.PureComponent {
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
            ((0, i.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, i.setFixedBodyState)(!1), (this._isBodyFixed = !1));
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, i.setFixedBodyState)(!1);
        }
        render() {
          return n.createElement(
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
      const l = n.createContext(null);
    },
    41590: (e, t, o) => {
      'use strict';
      o.d(t, { Drawer: () => h });
      var n = o(50959),
        i = o(50151),
        a = o(97754),
        l = o(36174),
        r = o(65718),
        s = o(37558),
        c = o(29197),
        u = o(86656),
        d = o(66076);
      function h(e) {
        const {
            position: t = 'Bottom',
            onClose: o,
            children: u,
            className: h,
            theme: v = d,
          } = e,
          p = (0, i.ensureNotNull)((0, n.useContext)(s.DrawerContext)),
          [g] = (0, n.useState)(() => (0, l.randomHash)()),
          b = (0, n.useRef)(null),
          f = (0, n.useContext)(c.CloseDelegateContext);
        return (
          (0, n.useLayoutEffect)(
            () => (
              (0, i.ensureNotNull)(b.current).focus({ preventScroll: !0 }),
              f.subscribe(p, o),
              p.addDrawer(g),
              () => {
                p.removeDrawer(g), f.unsubscribe(p, o);
              }
            ),
            []
          ),
          n.createElement(
            r.Portal,
            null,
            n.createElement(
              'div',
              { className: a(d.wrap, d[`position${t}`]) },
              g === p.currentDrawer &&
                n.createElement('div', { className: d.backdrop, onClick: o }),
              n.createElement(
                m,
                {
                  className: a(v.drawer, d[`position${t}`], h),
                  ref: b,
                  'data-name': e['data-name'],
                },
                u
              )
            )
          )
        );
      }
      const m = (0, n.forwardRef)((e, t) => {
        const { className: o, ...i } = e;
        return n.createElement(u.TouchScrollContainer, {
          className: a(d.drawer, o),
          tabIndex: -1,
          ref: t,
          ...i,
        });
      });
    },
    173: (e, t, o) => {
      'use strict';
      o.d(t, { emojiGroups: () => S, removeUnavailableEmoji: () => k });
      var n = o(50959),
        i = o(44352),
        a = o(99616),
        l = o(37603),
        r = o(32386),
        s = o(68796),
        c = o(5474),
        u = o(92177),
        d = o(83137),
        h = o(86209),
        m = o(14082),
        v = o(93826);
      const p = [
          '😀',
          '😃',
          '😄',
          '😁',
          '😆',
          '😅',
          '😂',
          '🤣',
          '☺️',
          '😊',
          '😇',
          '🙂',
          '🙃',
          '😉',
          '😌',
          '😍',
          '🥰',
          '😘',
          '😗',
          '😙',
          '😚',
          '😋',
          '😛',
          '😝',
          '😜',
          '🤪',
          '🤨',
          '🧐',
          '🤓',
          '😎',
          '🤩',
          '🥳',
          '😏',
          '😒',
          '😞',
          '😔',
          '😟',
          '😕',
          '🙁',
          '☹️',
          '😣',
          '😖',
          '😫',
          '😩',
          '🥺',
          '😢',
          '😭',
          '😤',
          '😠',
          '😡',
          '🤬',
          '🤯',
          '😳',
          '🥵',
          '🥶',
          '😱',
          '😨',
          '😰',
          '😥',
          '😓',
          '🤗',
          '🤔',
          '🤭',
          '🤫',
          '🤥',
          '😶',
          '😐',
          '😑',
          '😬',
          '🙄',
          '😯',
          '😦',
          '😧',
          '😮',
          '😲',
          '🥱',
          '😴',
          '🤤',
          '😪',
          '😵',
          '🤐',
          '🥴',
          '🤢',
          '🤮',
          '🤧',
          '😷',
          '🤒',
          '🤕',
          '🤑',
          '🤠',
          '😈',
          '👿',
          '👹',
          '👺',
          '🤡',
          '💩',
          '👻',
          '💀',
          '☠️',
          '👽',
          '👾',
          '🤖',
          '🎃',
          '😺',
          '😸',
          '😹',
          '😻',
          '😼',
          '😽',
          '🙀',
          '😿',
          '😾',
          '👋',
          '🤚',
          '🖐',
          '✋',
          '🖖',
          '👌',
          '🤏',
          '✌️',
          '🤞',
          '🤟',
          '🤘',
          '🤙',
          '👈',
          '👉',
          '👆',
          '🖕',
          '👇',
          '☝️',
          '👍',
          '👎',
          '✊',
          '👊',
          '🤛',
          '🤜',
          '👏',
          '🙌',
          '👐',
          '🤲',
          '🤝',
          '🙏',
          '✍️',
          '💅',
          '🤳',
          '💪',
          '🦾',
          '🦵',
          '🦿',
          '🦶',
          '👂',
          '🦻',
          '👃',
          '🧠',
          '🦷',
          '🦴',
          '👀',
          '👁',
          '👅',
          '👄',
          '💋',
          '🩸',
          '👶',
          '🧒',
          '👦',
          '👧',
          '🧑',
          '👱',
          '👨',
          '🧔',
          '👨‍🦰',
          '👨‍🦱',
          '👨‍🦳',
          '👨‍🦲',
          '👩',
          '👩‍🦰',
          '🧑‍🦰',
          '👩‍🦱',
          '🧑‍🦱',
          '👩‍🦳',
          '🧑‍🦳',
          '👩‍🦲',
          '🧑‍🦲',
          '👱‍♀️',
          '👱‍♂️',
          '🧓',
          '👴',
          '👵',
          '🙍',
          '🙍‍♂️',
          '🙍‍♀️',
          '🙎',
          '🙎‍♂️',
          '🙎‍♀️',
          '🙅',
          '🙅‍♂️',
          '🙅‍♀️',
          '🙆',
          '🙆‍♂️',
          '🙆‍♀️',
          '💁',
          '💁‍♂️',
          '💁‍♀️',
          '🙋',
          '🙋‍♂️',
          '🙋‍♀️',
          '🧏',
          '🧏‍♂️',
          '🧏‍♀️',
          '🙇',
          '🙇‍♂️',
          '🙇‍♀️',
          '🤦',
          '🤦‍♂️',
          '🤦‍♀️',
          '🤷',
          '🤷‍♂️',
          '🤷‍♀️',
          '🧑‍⚕️',
          '👨‍⚕️',
          '👩‍⚕️',
          '🧑‍🎓',
          '👨‍🎓',
          '👩‍🎓',
          '🧑‍🏫',
          '👨‍🏫',
          '👩‍🏫',
          '🧑‍⚖️',
          '👨‍⚖️',
          '👩‍⚖️',
          '🧑‍🌾',
          '👨‍🌾',
          '👩‍🌾',
          '🧑‍🍳',
          '👨‍🍳',
          '👩‍🍳',
          '🧑‍🔧',
          '👨‍🔧',
          '👩‍🔧',
          '🧑‍🏭',
          '👨‍🏭',
          '👩‍🏭',
          '🧑‍💼',
          '👨‍💼',
          '👩‍💼',
          '🧑‍🔬',
          '👨‍🔬',
          '👩‍🔬',
          '🧑‍💻',
          '👨‍💻',
          '👩‍💻',
          '🧑‍🎤',
          '👨‍🎤',
          '👩‍🎤',
          '🧑‍🎨',
          '👨‍🎨',
          '👩‍🎨',
          '🧑‍✈️',
          '👨‍✈️',
          '👩‍✈️',
          '🧑‍🚀',
          '👨‍🚀',
          '👩‍🚀',
          '🧑‍🚒',
          '👨‍🚒',
          '👩‍🚒',
          '👮',
          '👮‍♂️',
          '👮‍♀️',
          '🕵',
          '🕵️‍♂️',
          '🕵️‍♀️',
          '💂',
          '💂‍♂️',
          '💂‍♀️',
          '👷',
          '👷‍♂️',
          '👷‍♀️',
          '🤴',
          '👸',
          '👳',
          '👳‍♂️',
          '👳‍♀️',
          '👲',
          '🧕',
          '🤵',
          '👰',
          '🤰',
          '🤱',
          '👼',
          '🎅',
          '🤶',
          '🦸',
          '🦸‍♂️',
          '🦸‍♀️',
          '🦹',
          '🦹‍♂️',
          '🦹‍♀️',
          '🧙',
          '🧙‍♂️',
          '🧙‍♀️',
          '🧚',
          '🧚‍♂️',
          '🧚‍♀️',
          '🧛',
          '🧛‍♂️',
          '🧛‍♀️',
          '🧜',
          '🧜‍♂️',
          '🧜‍♀️',
          '🧝',
          '🧝‍♂️',
          '🧝‍♀️',
          '🧞',
          '🧞‍♂️',
          '🧞‍♀️',
          '🧟',
          '🧟‍♂️',
          '🧟‍♀️',
          '💆',
          '💆‍♂️',
          '💆‍♀️',
          '💇',
          '💇‍♂️',
          '💇‍♀️',
          '🚶',
          '🚶‍♂️',
          '🚶‍♀️',
          '🧍',
          '🧍‍♂️',
          '🧍‍♀️',
          '🧎',
          '🧎‍♂️',
          '🧎‍♀️',
          '🧑‍🦯',
          '👨‍🦯',
          '👩‍🦯',
          '🧑‍🦼',
          '👨‍🦼',
          '👩‍🦼',
          '🧑‍🦽',
          '👨‍🦽',
          '👩‍🦽',
          '🏃',
          '🏃‍♂️',
          '🏃‍♀️',
          '💃',
          '🕺',
          '🕴',
          '👯',
          '👯‍♂️',
          '👯‍♀️',
          '🧖',
          '🧖‍♂️',
          '🧖‍♀️',
          '🧑‍🤝‍🧑',
          '👭',
          '👫',
          '👬',
          '💏',
          '👨‍❤️‍💋‍👨',
          '👩‍❤️‍💋‍👩',
          '💑',
          '👨‍❤️‍👨',
          '👩‍❤️‍👩',
          '👪',
          '👨‍👩‍👦',
          '👨‍👩‍👧',
          '👨‍👩‍👧‍👦',
          '👨‍👩‍👦‍👦',
          '👨‍👩‍👧‍👧',
          '👨‍👨‍👦',
          '👨‍👨‍👧',
          '👨‍👨‍👧‍👦',
          '👨‍👨‍👦‍👦',
          '👨‍👨‍👧‍👧',
          '👩‍👩‍👦',
          '👩‍👩‍👧',
          '👩‍👩‍👧‍👦',
          '👩‍👩‍👦‍👦',
          '👩‍👩‍👧‍👧',
          '👨‍👦',
          '👨‍👦‍👦',
          '👨‍👧',
          '👨‍👧‍👦',
          '👨‍👧‍👧',
          '👩‍👦',
          '👩‍👦‍👦',
          '👩‍👧',
          '👩‍👧‍👦',
          '👩‍👧‍👧',
          '🗣',
          '👤',
          '👥',
          '👣',
        ],
        g = [
          '🐶',
          '🐱',
          '🐭',
          '🐹',
          '🐰',
          '🦊',
          '🐻',
          '🐼',
          '🐨',
          '🐯',
          '🦁',
          '🐮',
          '🐷',
          '🐽',
          '🐸',
          '🐵',
          '🙈',
          '🙉',
          '🙊',
          '🐒',
          '🐔',
          '🐧',
          '🐦',
          '🐤',
          '🐣',
          '🐥',
          '🦆',
          '🦅',
          '🦉',
          '🦇',
          '🐺',
          '🐗',
          '🐴',
          '🦄',
          '🐝',
          '🐛',
          '🦋',
          '🐌',
          '🐞',
          '🐜',
          '🦟',
          '🦗',
          '🕷',
          '🕸',
          '🦂',
          '🐢',
          '🐍',
          '🦎',
          '🦖',
          '🦕',
          '🐙',
          '🦑',
          '🦐',
          '🦞',
          '🦀',
          '🐡',
          '🐠',
          '🐟',
          '🐬',
          '🐳',
          '🐋',
          '🦈',
          '🐊',
          '🐅',
          '🐆',
          '🦓',
          '🦍',
          '🦧',
          '🐘',
          '🦛',
          '🦏',
          '🐪',
          '🐫',
          '🦒',
          '🦘',
          '🐃',
          '🐂',
          '🐄',
          '🐎',
          '🐖',
          '🐏',
          '🐑',
          '🦙',
          '🐐',
          '🦌',
          '🐕',
          '🐩',
          '🦮',
          '🐕‍🦺',
          '🐈',
          '🐓',
          '🦃',
          '🦚',
          '🦜',
          '🦢',
          '🦩',
          '🕊',
          '🐇',
          '🦝',
          '🦨',
          '🦡',
          '🦦',
          '🦥',
          '🐁',
          '🐀',
          '🐿',
          '🦔',
          '🐾',
          '🐉',
          '🐲',
          '🌵',
          '🎄',
          '🌲',
          '🌳',
          '🌴',
          '🌱',
          '🌿',
          '☘️',
          '🍀',
          '🎍',
          '🎋',
          '🍃',
          '🍂',
          '🍁',
          '🍄',
          '🐚',
          '🌾',
          '💐',
          '🌷',
          '🌹',
          '🥀',
          '🌺',
          '🌸',
          '🌼',
          '🌻',
          '🌞',
          '🌝',
          '🌛',
          '🌜',
          '🌚',
          '🌕',
          '🌖',
          '🌗',
          '🌘',
          '🌑',
          '🌒',
          '🌓',
          '🌔',
          '🌙',
          '🌎',
          '🌍',
          '🌏',
          '🪐',
          '💫',
          '⭐️',
          '🌟',
          '✨',
          '⚡️',
          '☄️',
          '💥',
          '🔥',
          '🌪',
          '🌈',
          '☀️',
          '🌤',
          '⛅️',
          '🌥',
          '☁️',
          '🌦',
          '🌧',
          '⛈',
          '🌩',
          '🌨',
          '❄️',
          '☃️',
          '⛄️',
          '🌬',
          '💨',
          '💧',
          '💦',
          '☔️',
          '🌊',
          '🌫',
        ],
        b = [
          '🍏',
          '🍎',
          '🍐',
          '🍊',
          '🍋',
          '🍌',
          '🍉',
          '🍇',
          '🍓',
          '🍈',
          '🍒',
          '🍑',
          '🥭',
          '🍍',
          '🥥',
          '🥝',
          '🍅',
          '🍆',
          '🥑',
          '🥦',
          '🥬',
          '🥒',
          '🌶',
          '🌽',
          '🥕',
          '🧄',
          '🧅',
          '🥔',
          '🍠',
          '🥐',
          '🥯',
          '🍞',
          '🥖',
          '🥨',
          '🧀',
          '🥚',
          '🍳',
          '🧈',
          '🥞',
          '🧇',
          '🥓',
          '🥩',
          '🍗',
          '🍖',
          '🌭',
          '🍔',
          '🍟',
          '🍕',
          '🥪',
          '🥙',
          '🧆',
          '🌮',
          '🌯',
          '🥗',
          '🥘',
          '🥫',
          '🍝',
          '🍜',
          '🍲',
          '🍛',
          '🍣',
          '🍱',
          '🥟',
          '🦪',
          '🍤',
          '🍙',
          '🍚',
          '🍘',
          '🍥',
          '🥠',
          '🥮',
          '🍢',
          '🍡',
          '🍧',
          '🍨',
          '🍦',
          '🥧',
          '🧁',
          '🍰',
          '🎂',
          '🍮',
          '🍭',
          '🍬',
          '🍫',
          '🍿',
          '🍩',
          '🍪',
          '🌰',
          '🥜',
          '🍯',
          '🥛',
          '🍼',
          '☕️',
          '🍵',
          '🧃',
          '🥤',
          '🍶',
          '🍺',
          '🍻',
          '🥂',
          '🍷',
          '🥃',
          '🍸',
          '🍹',
          '🧉',
          '🍾',
          '🧊',
          '🥄',
          '🍴',
          '🍽',
          '🥣',
          '🥡',
          '🥢',
          '🧂',
        ],
        f = [
          '⚽️',
          '🏀',
          '🏈',
          '⚾️',
          '🥎',
          '🎾',
          '🏐',
          '🏉',
          '🥏',
          '🎱',
          '🪀',
          '🏓',
          '🏸',
          '🏒',
          '🏑',
          '🥍',
          '🏏',
          '🥅',
          '⛳️',
          '🪁',
          '🏹',
          '🎣',
          '🤿',
          '🥊',
          '🥋',
          '🎽',
          '🛹',
          '🛷',
          '⛸',
          '🥌',
          '🎿',
          '⛷',
          '🏂',
          '🪂',
          '🏋️',
          '🏋️‍♂️',
          '🏋️‍♀️',
          '🤼',
          '🤼‍♂️',
          '🤼‍♀️',
          '🤸‍♀️',
          '🤸',
          '🤸‍♂️',
          '⛹️',
          '⛹️‍♂️',
          '⛹️‍♀️',
          '🤺',
          '🤾',
          '🤾‍♂️',
          '🤾‍♀️',
          '🏌️',
          '🏌️‍♂️',
          '🏌️‍♀️',
          '🏇',
          '🧘',
          '🧘‍♂️',
          '🧘‍♀️',
          '🏄',
          '🏄‍♂️',
          '🏄‍♀️',
          '🏊',
          '🏊‍♂️',
          '🏊‍♀️',
          '🤽',
          '🤽‍♂️',
          '🤽‍♀️',
          '🚣',
          '🚣‍♂️',
          '🚣‍♀️',
          '🧗',
          '🧗‍♂️',
          '🧗‍♀️',
          '🚵',
          '🚵‍♂️',
          '🚵‍♀️',
          '🚴',
          '🚴‍♂️',
          '🚴‍♀️',
          '🏆',
          '🥇',
          '🥈',
          '🥉',
          '🏅',
          '🎖',
          '🏵',
          '🎗',
          '🎫',
          '🎟',
          '🎪',
          '🤹',
          '🤹‍♂️',
          '🤹‍♀️',
          '🎭',
          '🎨',
          '🎬',
          '🎤',
          '🎧',
          '🎼',
          '🎹',
          '🥁',
          '🎷',
          '🎺',
          '🎸',
          '🪕',
          '🎻',
          '🎲',
          '🎯',
          '🎳',
          '🎮',
          '🎰',
          '🧩',
        ],
        C = [
          '🚗',
          '🚕',
          '🚙',
          '🚌',
          '🚎',
          '🏎',
          '🚓',
          '🚑',
          '🚒',
          '🚐',
          '🚚',
          '🚛',
          '🚜',
          '🦯',
          '🦽',
          '🦼',
          '🛴',
          '🚲',
          '🛵',
          '🏍',
          '🛺',
          '🚨',
          '🚔',
          '🚍',
          '🚘',
          '🚖',
          '🚡',
          '🚠',
          '🚟',
          '🚃',
          '🚋',
          '🚞',
          '🚝',
          '🚄',
          '🚅',
          '🚈',
          '🚂',
          '🚆',
          '🚇',
          '🚊',
          '🚉',
          '✈️',
          '🛫',
          '🛬',
          '🛩',
          '💺',
          '🛰',
          '🚀',
          '🛸',
          '🚁',
          '🛶',
          '⛵️',
          '🚤',
          '🛥',
          '🛳',
          '⛴',
          '🚢',
          '⚓️',
          '⛽️',
          '🚧',
          '🚦',
          '🚥',
          '🚏',
          '🗺',
          '🗿',
          '🗽',
          '🗼',
          '🏰',
          '🏯',
          '🏟',
          '🎡',
          '🎢',
          '🎠',
          '⛲️',
          '⛱',
          '🏖',
          '🏝',
          '🏜',
          '🌋',
          '⛰',
          '🏔',
          '🗻',
          '🏕',
          '⛺️',
          '🏠',
          '🏡',
          '🏘',
          '🏚',
          '🏗',
          '🏭',
          '🏢',
          '🏬',
          '🏣',
          '🏤',
          '🏥',
          '🏦',
          '🏨',
          '🏪',
          '🏫',
          '🏩',
          '💒',
          '🏛',
          '⛪️',
          '🕌',
          '🕍',
          '🛕',
          '🕋',
          '⛩',
          '🛤',
          '🛣',
          '🗾',
          '🎑',
          '🏞',
          '🌅',
          '🌄',
          '🌠',
          '🎇',
          '🎆',
          '🌇',
          '🌆',
          '🏙',
          '🌃',
          '🌌',
          '🌉',
          '🌁',
        ],
        w = [
          '⌚️',
          '📱',
          '📲',
          '💻',
          '⌨️',
          '🖥',
          '🖨',
          '🖱',
          '🖲',
          '🕹',
          '🗜',
          '💽',
          '💾',
          '💿',
          '📀',
          '📼',
          '📷',
          '📸',
          '📹',
          '🎥',
          '📽',
          '🎞',
          '📞',
          '☎️',
          '📟',
          '📠',
          '📺',
          '📻',
          '🎙',
          '🎚',
          '🎛',
          '🧭',
          '⏱',
          '⏲',
          '⏰',
          '🕰',
          '⌛️',
          '⏳',
          '📡',
          '🔋',
          '🔌',
          '💡',
          '🔦',
          '🕯',
          '🪔',
          '🧯',
          '🛢',
          '💸',
          '💵',
          '💴',
          '💶',
          '💷',
          '💰',
          '💳',
          '💎',
          '⚖️',
          '🧰',
          '🔧',
          '🔨',
          '⚒',
          '🛠',
          '⛏',
          '🔩',
          '⚙️',
          '🧱',
          '⛓',
          '🧲',
          '🔫',
          '💣',
          '🧨',
          '🪓',
          '🔪',
          '🗡',
          '⚔️',
          '🛡',
          '🚬',
          '⚰️',
          '⚱️',
          '🏺',
          '🔮',
          '📿',
          '🧿',
          '💈',
          '⚗️',
          '🔭',
          '🔬',
          '🕳',
          '🩹',
          '🩺',
          '💊',
          '💉',
          '🧬',
          '🦠',
          '🧫',
          '🧪',
          '🌡',
          '🧹',
          '🧺',
          '🧻',
          '🚽',
          '🚰',
          '🚿',
          '🛁',
          '🛀',
          '🧼',
          '🪒',
          '🧽',
          '🧴',
          '🛎',
          '🔑',
          '🗝',
          '🚪',
          '🪑',
          '🛋',
          '🛏',
          '🛌',
          '🧸',
          '🖼',
          '🛍',
          '🛒',
          '🎁',
          '🎈',
          '🎏',
          '🎀',
          '🎊',
          '🎉',
          '🎎',
          '🏮',
          '🎐',
          '🧧',
          '✉️',
          '📩',
          '📨',
          '📧',
          '💌',
          '📥',
          '📤',
          '📦',
          '🏷',
          '📪',
          '📫',
          '📬',
          '📭',
          '📮',
          '📯',
          '📜',
          '📃',
          '📄',
          '📑',
          '🧾',
          '📊',
          '📈',
          '📉',
          '🗒',
          '🗓',
          '📆',
          '📅',
          '🗑',
          '📇',
          '🗃',
          '🗳',
          '🗄',
          '📋',
          '📁',
          '📂',
          '🗂',
          '🗞',
          '📰',
          '📓',
          '📔',
          '📒',
          '📕',
          '📗',
          '📘',
          '📙',
          '📚',
          '📖',
          '🔖',
          '🧷',
          '🔗',
          '📎',
          '🖇',
          '📐',
          '📏',
          '🧮',
          '📌',
          '📍',
          '✂️',
          '🖊',
          '🖋',
          '✒️',
          '🖌',
          '🖍',
          '📝',
          '✏️',
          '🔍',
          '🔎',
          '🔏',
          '🔐',
          '🔒',
          '🔓',
          '🧳',
          '🌂',
          '☂️',
          '🧵',
          '🧶',
          '👓',
          '🕶',
          '🥽',
          '🥼',
          '🦺',
          '👔',
          '👕',
          '👖',
          '🧣',
          '🧤',
          '🧥',
          '🧦',
          '👗',
          '👘',
          '🥻',
          '🩱',
          '🩲',
          '🩳',
          '👙',
          '👚',
          '👛',
          '👜',
          '👝',
          '🎒',
          '👞',
          '👟',
          '🥾',
          '🥿',
          '👠',
          '👡',
          '🩰',
          '👢',
          '👑',
          '👒',
          '🎩',
          '🎓',
          '🧢',
          '⛑',
          '💄',
          '💍',
          '💼',
        ],
        T = [
          '❤️',
          '🧡',
          '💛',
          '💚',
          '💙',
          '💜',
          '🖤',
          '🤍',
          '🤎',
          '💔',
          '❣️',
          '💕',
          '💞',
          '💓',
          '💗',
          '💖',
          '💘',
          '💝',
          '💟',
          '☮️',
          '✝️',
          '☪️',
          '🕉',
          '☸️',
          '✡️',
          '🔯',
          '🕎',
          '☯️',
          '☦️',
          '🛐',
          '⛎',
          '♈️',
          '♉️',
          '♊️',
          '♋️',
          '♌️',
          '♍️',
          '♎️',
          '♏️',
          '♐️',
          '♑️',
          '♒️',
          '♓️',
          '🆔',
          '⚛️',
          '🉑',
          '☢️',
          '☣️',
          '📴',
          '📳',
          '🈶',
          '🈚️',
          '🈸',
          '🈺',
          '🈷️',
          '✴️',
          '🆚',
          '💮',
          '🉐',
          '㊙️',
          '㊗️',
          '🈴',
          '🈵',
          '🈹',
          '🈲',
          '🅰️',
          '🅱️',
          '🆎',
          '🆑',
          '🅾️',
          '🆘',
          '❌',
          '⭕️',
          '🛑',
          '⛔️',
          '📛',
          '🚫',
          '💯',
          '💢',
          '♨️',
          '🚷',
          '🚯',
          '🚳',
          '🚱',
          '🔞',
          '📵',
          '🚭',
          '❗️',
          '❕',
          '❓',
          '❔',
          '‼️',
          '⁉️',
          '🔅',
          '🔆',
          '〽️',
          '⚠️',
          '🚸',
          '🔱',
          '⚜️',
          '🔰',
          '♻️',
          '✅',
          '🈯️',
          '💹',
          '❇️',
          '✳️',
          '❎',
          '🌐',
          '💠',
          'Ⓜ️',
          '🌀',
          '💤',
          '🏧',
          '🚾',
          '♿️',
          '🅿️',
          '🈳',
          '🈂️',
          '🛂',
          '🛃',
          '🛄',
          '🛅',
          '🚹',
          '🚺',
          '🚼',
          '🚻',
          '🚮',
          '🎦',
          '📶',
          '🈁',
          '🔣',
          'ℹ️',
          '🔤',
          '🔡',
          '🔠',
          '🆖',
          '🆗',
          '🆙',
          '🆒',
          '🆕',
          '🆓',
          '0️⃣',
          '1️⃣',
          '2️⃣',
          '3️⃣',
          '4️⃣',
          '5️⃣',
          '6️⃣',
          '7️⃣',
          '8️⃣',
          '9️⃣',
          '🔟',
          '🔢',
          '#️⃣',
          '*️⃣',
          '⏏️',
          '▶️',
          '⏸',
          '⏯',
          '⏹',
          '⏺',
          '⏭',
          '⏮',
          '⏩',
          '⏪',
          '⏫',
          '⏬',
          '◀️',
          '🔼',
          '🔽',
          '➡️',
          '⬅️',
          '⬆️',
          '⬇️',
          '↗️',
          '↘️',
          '↙️',
          '↖️',
          '↕️',
          '↔️',
          '↪️',
          '↩️',
          '⤴️',
          '⤵️',
          '🔀',
          '🔁',
          '🔂',
          '🔄',
          '🔃',
          '🎵',
          '🎶',
          '➕',
          '➖',
          '➗',
          '✖️',
          '♾',
          '💲',
          '💱',
          '™️',
          '©️',
          '®️',
          '〰️',
          '➰',
          '➿',
          '🔚',
          '🔙',
          '🔛',
          '🔝',
          '🔜',
          '✔️',
          '☑️',
          '🔘',
          '🔴',
          '🟠',
          '🟡',
          '🟢',
          '🔵',
          '🟣',
          '⚫️',
          '⚪️',
          '🟤',
          '🔺',
          '🔻',
          '🔸',
          '🔹',
          '🔶',
          '🔷',
          '🔳',
          '🔲',
          '▪️',
          '▫️',
          '◾️',
          '◽️',
          '◼️',
          '◻️',
          '🟥',
          '🟧',
          '🟨',
          '🟩',
          '🟦',
          '🟪',
          '⬛️',
          '⬜️',
          '🟫',
          '🔈',
          '🔇',
          '🔉',
          '🔊',
          '🔔',
          '🔕',
          '📣',
          '📢',
          '👁‍🗨',
          '💬',
          '💭',
          '🗯',
          '♠️',
          '♣️',
          '♥️',
          '♦️',
          '🃏',
          '🎴',
          '🀄️',
          '🕐',
          '🕑',
          '🕒',
          '🕓',
          '🕔',
          '🕕',
          '🕖',
          '🕗',
          '🕘',
          '🕙',
          '🕚',
          '🕛',
          '🕜',
          '🕝',
          '🕞',
          '🕟',
          '🕠',
          '🕡',
          '🕢',
          '🕣',
          '🕤',
          '🕥',
          '🕦',
          '🕧',
        ],
        E = [
          '🏳️',
          '🏴',
          '🏁',
          '🚩',
          '🏳️‍🌈',
          '🏴‍☠️',
          '🇦🇫',
          '🇦🇽',
          '🇦🇱',
          '🇩🇿',
          '🇦🇸',
          '🇦🇩',
          '🇦🇴',
          '🇦🇮',
          '🇦🇶',
          '🇦🇬',
          '🇦🇷',
          '🇦🇲',
          '🇦🇼',
          '🇦🇺',
          '🇦🇹',
          '🇦🇿',
          '🇧🇸',
          '🇧🇭',
          '🇧🇩',
          '🇧🇧',
          '🇧🇾',
          '🇧🇪',
          '🇧🇿',
          '🇧🇯',
          '🇧🇲',
          '🇧🇹',
          '🇧🇴',
          '🇧🇦',
          '🇧🇼',
          '🇧🇷',
          '🇮🇴',
          '🇻🇬',
          '🇧🇳',
          '🇧🇬',
          '🇧🇫',
          '🇧🇮',
          '🇰🇭',
          '🇨🇲',
          '🇨🇦',
          '🇮🇨',
          '🇨🇻',
          '🇧🇶',
          '🇰🇾',
          '🇨🇫',
          '🇹🇩',
          '🇨🇱',
          '🇨🇳',
          '🇨🇽',
          '🇨🇨',
          '🇨🇴',
          '🇰🇲',
          '🇨🇬',
          '🇨🇩',
          '🇨🇰',
          '🇨🇷',
          '🇨🇮',
          '🇭🇷',
          '🇨🇺',
          '🇨🇼',
          '🇨🇾',
          '🇨🇿',
          '🇩🇰',
          '🇩🇯',
          '🇩🇲',
          '🇩🇴',
          '🇪🇨',
          '🇪🇬',
          '🇸🇻',
          '🇬🇶',
          '🇪🇷',
          '🇪🇪',
          '🇪🇹',
          '🇪🇺',
          '🇫🇰',
          '🇫🇴',
          '🇫🇯',
          '🇫🇮',
          '🇫🇷',
          '🇬🇫',
          '🇵🇫',
          '🇹🇫',
          '🇬🇦',
          '🇬🇲',
          '🇬🇪',
          '🇩🇪',
          '🇬🇭',
          '🇬🇮',
          '🇬🇷',
          '🇬🇱',
          '🇬🇩',
          '🇬🇵',
          '🇬🇺',
          '🇬🇹',
          '🇬🇬',
          '🇬🇳',
          '🇬🇼',
          '🇬🇾',
          '🇭🇹',
          '🇭🇳',
          '🇭🇰',
          '🇭🇺',
          '🇮🇸',
          '🇮🇳',
          '🇮🇩',
          '🇮🇷',
          '🇮🇶',
          '🇮🇪',
          '🇮🇲',
          '🇮🇱',
          '🇮🇹',
          '🇯🇲',
          '🇯🇵',
          '🎌',
          '🇯🇪',
          '🇯🇴',
          '🇰🇿',
          '🇰🇪',
          '🇰🇮',
          '🇽🇰',
          '🇰🇼',
          '🇰🇬',
          '🇱🇦',
          '🇱🇻',
          '🇱🇧',
          '🇱🇸',
          '🇱🇷',
          '🇱🇾',
          '🇱🇮',
          '🇱🇹',
          '🇱🇺',
          '🇲🇴',
          '🇲🇰',
          '🇲🇬',
          '🇲🇼',
          '🇲🇾',
          '🇲🇻',
          '🇲🇱',
          '🇲🇹',
          '🇲🇭',
          '🇲🇶',
          '🇲🇷',
          '🇲🇺',
          '🇾🇹',
          '🇲🇽',
          '🇫🇲',
          '🇲🇩',
          '🇲🇨',
          '🇲🇳',
          '🇲🇪',
          '🇲🇸',
          '🇲🇦',
          '🇲🇿',
          '🇲🇲',
          '🇳🇦',
          '🇳🇷',
          '🇳🇵',
          '🇳🇱',
          '🇳🇨',
          '🇳🇿',
          '🇳🇮',
          '🇳🇪',
          '🇳🇬',
          '🇳🇺',
          '🇳🇫',
          '🇰🇵',
          '🇲🇵',
          '🇳🇴',
          '🇴🇲',
          '🇵🇰',
          '🇵🇼',
          '🇵🇸',
          '🇵🇦',
          '🇵🇬',
          '🇵🇾',
          '🇵🇪',
          '🇵🇭',
          '🇵🇳',
          '🇵🇱',
          '🇵🇹',
          '🇵🇷',
          '🇶🇦',
          '🇷🇪',
          '🇷🇴',
          '🇷🇺',
          '🇷🇼',
          '🇼🇸',
          '🇸🇲',
          '🇸🇦',
          '🇸🇳',
          '🇷🇸',
          '🇸🇨',
          '🇸🇱',
          '🇸🇬',
          '🇸🇽',
          '🇸🇰',
          '🇸🇮',
          '🇬🇸',
          '🇸🇧',
          '🇸🇴',
          '🇿🇦',
          '🇰🇷',
          '🇸🇸',
          '🇪🇸',
          '🇱🇰',
          '🇧🇱',
          '🇸🇭',
          '🇰🇳',
          '🇱🇨',
          '🇵🇲',
          '🇻🇨',
          '🇸🇩',
          '🇸🇷',
          '🇸🇿',
          '🇸🇪',
          '🇨🇭',
          '🇸🇾',
          '🇹🇼',
          '🇹🇯',
          '🇹🇿',
          '🇹🇭',
          '🇹🇱',
          '🇹🇬',
          '🇹🇰',
          '🇹🇴',
          '🇹🇹',
          '🇹🇳',
          '🇹🇷',
          '🇹🇲',
          '🇹🇨',
          '🇹🇻',
          '🇻🇮',
          '🇺🇬',
          '🇺🇦',
          '🇦🇪',
          '🇬🇧',
          '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
          '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
          '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
          '🇺🇳',
          '🇺🇸',
          '🇺🇾',
          '🇺🇿',
          '🇻🇺',
          '🇻🇦',
          '🇻🇪',
          '🇻🇳',
          '🇼🇫',
          '🇪🇭',
          '🇾🇪',
          '🇿🇲',
          '🇿🇼',
        ],
        x = [...p, ...g, ...b, ...f, ...C, ...w, ...T, ...E],
        _ = new Set(x);
      function k(e) {
        return e.filter((e) => _.has(e));
      }
      const S = [
        {
          title: i.t(null, { context: 'emoji_group' }, o(15426)),
          emojis: [],
          content: n.createElement(a.IconItem, { icon: l }),
        },
        {
          title: i.t(null, { context: 'emoji_group' }, o(96330)),
          emojis: p,
          content: n.createElement(a.IconItem, { icon: r }),
        },
        {
          title: i.t(null, { context: 'emoji_group' }, o(60558)),
          emojis: g,
          content: n.createElement(a.IconItem, { icon: s }),
        },
        {
          title: i.t(null, { context: 'emoji_group' }, o(35305)),
          emojis: b,
          content: n.createElement(a.IconItem, { icon: c }),
        },
        {
          title: i.t(null, { context: 'emoji_group' }, o(14232)),
          emojis: f,
          content: n.createElement(a.IconItem, { icon: u }),
        },
        {
          title: i.t(null, { context: 'emoji_group' }, o(15395)),
          emojis: C,
          content: n.createElement(a.IconItem, { icon: d }),
        },
        {
          title: i.t(null, { context: 'emoji_group' }, o(72302)),
          emojis: w,
          content: n.createElement(a.IconItem, { icon: h }),
        },
        {
          title: i.t(null, { context: 'emoji_group' }, o(6878)),
          emojis: T,
          content: n.createElement(a.IconItem, { icon: m }),
        },
        {
          title: i.t(null, { context: 'emoji_group' }, o(49546)),
          emojis: E,
          content: n.createElement(a.IconItem, { icon: v }),
        },
      ];
    },
    47291: (e, t, o) => {
      'use strict';
      o.d(t, { EmojiListContent: () => m, EmojiListContentContext: () => h });
      var n = o(50959),
        i = o(20037),
        a = o(97754),
        l = o.n(a),
        r = o(89346);
      function s(e) {
        const { title: t, className: o } = e;
        return n.createElement('div', { className: l()(r.wrapper, o) }, t);
      }
      var c = o(26601),
        u = o(78036),
        d = o(97662);
      const h = n.createContext(null);
      function m(e) {
        const {
          listRef: t,
          outerRef: o,
          emojiGroups: a,
          emojiSize: l,
          onSelect: r,
          onContentRendered: s,
          ItemComponent: c,
          RowComponent: u,
          height: m,
        } = e;
        (0, n.useEffect)(() => {
          var e;
          return null === (e = t.current) || void 0 === e
            ? void 0
            : e.resetAfterIndex(0, !0);
        }, [a]);
        const p = (0, n.useCallback)(
            (e) => ('title' === a[e].type ? 30 : l),
            [a, l]
          ),
          g = (0, n.useCallback)(
            ({ visibleStartIndex: e }) => {
              const { relatedTitle: t } = a[e];
              s(t);
            },
            [a, s]
          ),
          b = Math.min(m - 102, window.innerHeight - 102);
        return n.createElement(
          h.Provider,
          {
            value: (0, n.useMemo)(
              () => ({
                size: l,
                onSelect: r,
                ItemComponent: c,
                RowComponent: u,
              }),
              [l, r, c, u]
            ),
          },
          n.createElement(i.VariableSizeList, {
            className: d.list,
            ref: t,
            outerRef: o,
            width: '100%',
            height: b,
            itemData: a,
            itemCount: a.length,
            children: v,
            onItemsRendered: g,
            itemSize: p,
          })
        );
      }
      const v = n.memo((e) => {
        const { style: t, index: o, data: i } = e,
          a = i[o],
          {
            size: l,
            onSelect: r,
            ItemComponent: d,
            RowComponent: m = c.EmojisRow,
          } = (0, u.useEnsuredContext)(h);
        return 'title' === a.type
          ? n.createElement(
              'div',
              { style: t },
              n.createElement(s, { title: a.relatedTitle })
            )
          : n.createElement(
              'div',
              { style: t },
              n.createElement(m, {
                emojis: a.content,
                itemSize: l,
                onEmojiClick: r,
                ItemComponent: d,
              })
            );
      });
    },
    38297: (e, t, o) => {
      'use strict';
      o.d(t, { EmojiList: () => h });
      var n = o(50959),
        i = o(97754),
        a = o.n(i),
        l = o(29006),
        r = o(85034),
        s = o(47291);
      var c = o(49483),
        u = o(46809);
      const d = 38;
      function h(e) {
        var t;
        const {
            className: o,
            emojis: i,
            onSelect: h,
            ItemComponent: m,
            RowComponent: v,
            height: p,
            category: g,
            emojiSize: b = d,
          } = e,
          f = (0, n.useRef)(null),
          C = (0, n.useRef)(null),
          w = (0, n.useRef)(!1),
          [T, E] = (0, n.useState)(0),
          x = (0, n.useMemo)(
            () =>
              (function (e, t) {
                if (0 === t) return [];
                const o = [];
                return (
                  e.forEach(({ title: e, emojis: n }) => {
                    o.push({ type: 'title', relatedTitle: e, content: [e] });
                    let i = [];
                    for (const a of n)
                      i.length < t
                        ? i.push(a)
                        : (o.push({
                            type: 'emojiRow',
                            relatedTitle: e,
                            content: i,
                          }),
                          (i = [a]));
                    i.length &&
                      o.push({
                        type: 'emojiRow',
                        relatedTitle: e,
                        content: i,
                      });
                  }),
                  o
                );
              })(i, T),
            [i, T]
          ),
          _ = (0, l.useResizeObserver)(
            function (e) {
              const [t] = e,
                { width: o } = t.contentRect,
                n = Math.floor((o - 12) / b);
              E(n);
            },
            [b]
          );
        (0, n.useEffect)(() => {
          x.length && L(0);
        }, [g]);
        const [k, S] = (0, n.useState)(
            (null === (t = x[0]) || void 0 === t ? void 0 : t.relatedTitle) ||
              ''
          ),
          F = (0, n.useCallback)((e) => {
            w.current || S(e);
          }, []);
        return n.createElement(
          'div',
          { className: a()(u.wrapper, o) },
          n.createElement(r.GroupTabs, {
            tabs: i,
            activeTab: k,
            onTabClick: function (e) {
              S(e);
              L(
                (function (e) {
                  return x.findIndex(
                    ({ relatedTitle: t, type: o }) => 'title' === o && t === e
                  );
                })(e)
              );
            },
          }),
          n.createElement(
            'div',
            { ref: _ },
            n.createElement(s.EmojiListContent, {
              listRef: f,
              outerRef: C,
              emojiGroups: x,
              emojiSize: b,
              onSelect: h,
              onContentRendered: F,
              ItemComponent: m,
              RowComponent: v,
              height: p,
            })
          )
        );
        function L(e) {
          var t;
          c.CheckMobile.iOS() &&
            C.current &&
            (C.current.style.overflow = 'hidden'),
            (w.current = !0),
            null === (t = f.current) ||
              void 0 === t ||
              t.scrollToItem(e, 'start'),
            requestAnimationFrame(() => {
              var t;
              null === (t = f.current) ||
                void 0 === t ||
                t.scrollToItem(e, 'start'),
                c.CheckMobile.iOS() &&
                  C.current &&
                  (C.current.style.overflow = 'auto'),
                (w.current = !1);
            });
        }
      }
    },
    26601: (e, t, o) => {
      'use strict';
      o.d(t, { EmojisRow: () => s });
      var n = o(50959),
        i = o(97754),
        a = o.n(i),
        l = o(83682),
        r = o(11123);
      const s = n.memo((e) => {
        const {
          emojis: t,
          itemSize: o,
          onEmojiClick: i,
          ItemComponent: s,
          className: c,
        } = e;
        return n.createElement(
          'div',
          { className: a()(r.wrapper, c) },
          t.map((e) =>
            n.createElement(l.EmojiWrap, {
              key: e,
              className: r.emojiItem,
              emoji: e,
              size: o,
              onClick: i,
              ItemComponent: s,
            })
          )
        );
      });
    },
    85034: (e, t, o) => {
      'use strict';
      o.d(t, { GroupTabs: () => c });
      var n = o(50959),
        i = o(97754),
        a = o.n(i),
        l = o(17373);
      function r(e) {
        const {
          tab: t,
          isActive: o,
          onTabClick: i,
          children: r,
          className: s,
        } = e;
        return n.createElement(
          'div',
          {
            className: a()(l.wrapper, o && l.isActive, s),
            onClick: function () {
              i(t);
            },
          },
          r
        );
      }
      var s = o(12134);
      function c(e) {
        const {
          activeTab: t,
          tabs: o,
          onTabClick: i,
          className: l,
          tabClassName: c,
        } = e;
        return n.createElement(
          'div',
          { className: a()(s.wrapper, l) },
          o.map(({ title: e, content: o }) =>
            n.createElement(
              r,
              {
                key: e,
                tab: e,
                className: c,
                isActive: t === e,
                onTabClick: i,
              },
              o
            )
          )
        );
      }
    },
    99616: (e, t, o) => {
      'use strict';
      o.d(t, { IconItem: () => s });
      var n = o(50959),
        i = o(97754),
        a = o.n(i),
        l = o(9745),
        r = o(53737);
      function s(e) {
        return n.createElement(
          'div',
          { className: a()(r.wrapper, e.className) },
          n.createElement(l.Icon, { icon: e.icon })
        );
      }
    },
    83682: (e, t, o) => {
      'use strict';
      o.d(t, { EmojiWrap: () => d });
      var n = o(50959),
        i = o(97754),
        a = o.n(i),
        l = o(68616),
        r = o(34290);
      function s(e) {
        const { emoji: t, className: o } = e,
          i = (0, l.getTwemojiUrl)(t, 'png');
        return n.createElement('img', {
          className: a()(o, r.emoji),
          src: i,
          decoding: 'async',
          width: '24',
          height: '24',
          alt: '',
          draggable: !1,
          onContextMenu: function (e) {
            e.preventDefault();
          },
        });
      }
      var c = o(13193);
      const u = 34;
      function d(e) {
        const {
          className: t,
          emoji: o,
          size: i = u,
          onClick: l,
          ItemComponent: r = s,
        } = e;
        return n.createElement(
          'div',
          {
            className: a()(c.wrapper, t),
            style: { width: i, height: i },
            onClick: function () {
              l(o);
            },
          },
          n.createElement(r, { emoji: o })
        );
      }
    },
    78036: (e, t, o) => {
      'use strict';
      o.d(t, { useEnsuredContext: () => a });
      var n = o(50959),
        i = o(50151);
      function a(e) {
        return (0, i.ensureNotNull)((0, n.useContext)(e));
      }
    },
    70412: (e, t, o) => {
      'use strict';
      o.d(t, {
        hoverMouseEventFilter: () => a,
        useAccurateHover: () => l,
        useHover: () => i,
      });
      var n = o(50959);
      function i() {
        const [e, t] = (0, n.useState)(!1);
        return [
          e,
          {
            onMouseOver: function (e) {
              a(e) && t(!0);
            },
            onMouseOut: function (e) {
              a(e) && t(!1);
            },
          },
        ];
      }
      function a(e) {
        return !e.currentTarget.contains(e.relatedTarget);
      }
      function l(e) {
        const [t, o] = (0, n.useState)(!1);
        return (
          (0, n.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return;
              const n = e.current.contains(t.target);
              o(n);
            };
            return (
              document.addEventListener('mouseover', t),
              () => document.removeEventListener('mouseover', t)
            );
          }, []),
          t
        );
      }
    },
    29006: (e, t, o) => {
      'use strict';
      o.d(t, { useResizeObserver: () => n.useResizeObserver });
      var n = o(67842);
    },
    77975: (e, t, o) => {
      'use strict';
      o.d(t, { useWatchedValueReadonly: () => i });
      var n = o(50959);
      const i = (e, t = !1) => {
        const o = 'watchedValue' in e ? e.watchedValue : void 0,
          i = 'defaultValue' in e ? e.defaultValue : e.watchedValue.value(),
          [a, l] = (0, n.useState)(o ? o.value() : i);
        return (
          (t ? n.useLayoutEffect : n.useEffect)(() => {
            if (o) {
              l(o.value());
              const e = (e) => l(e);
              return o.subscribe(e), () => o.unsubscribe(e);
            }
            return () => {};
          }, [o]),
          a
        );
      };
    },
    16396: (e, t, o) => {
      'use strict';
      o.d(t, {
        DEFAULT_POPUP_MENU_ITEM_THEME: () => c,
        PopupMenuItem: () => d,
      });
      var n = o(50959),
        i = o(97754),
        a = o(59064),
        l = o(51768),
        r = o(90186),
        s = o(71986);
      const c = s;
      function u(e) {
        e.stopPropagation();
      }
      function d(e) {
        const {
            id: t,
            role: o,
            'aria-label': c,
            'aria-selected': d,
            'aria-checked': h,
            className: m,
            title: v,
            labelRowClassName: p,
            labelClassName: g,
            shortcut: b,
            forceShowShortcuts: f,
            icon: C,
            isActive: w,
            isDisabled: T,
            isHovered: E,
            appearAsDisabled: x,
            label: _,
            link: k,
            showToolboxOnHover: S,
            showToolboxOnFocus: F,
            target: L,
            rel: A,
            toolbox: y,
            reference: M,
            onMouseOut: I,
            onMouseOver: N,
            onKeyDown: B,
            suppressToolboxClick: D = !0,
            theme: z = s,
            tabIndex: R,
            tagName: W,
            renderComponent: j,
            roundedIcon: P,
            iconAriaProps: V,
          } = e,
          O = (0, r.filterDataProps)(e),
          H = (0, n.useRef)(null),
          U = (0, n.useMemo)(
            () =>
              (function (e) {
                function t(t) {
                  const { reference: o, ...i } = t,
                    a = null != e ? e : i.href ? 'a' : 'div',
                    l =
                      'a' === a
                        ? i
                        : (function (e) {
                            const {
                              download: t,
                              href: o,
                              hrefLang: n,
                              media: i,
                              ping: a,
                              rel: l,
                              target: r,
                              type: s,
                              referrerPolicy: c,
                              ...u
                            } = e;
                            return u;
                          })(i);
                  return n.createElement(a, { ...l, ref: o });
                }
                return (t.displayName = `DefaultComponent(${e})`), t;
              })(W),
            [W]
          ),
          G = null != j ? j : U;
        return n.createElement(
          G,
          {
            ...O,
            id: t,
            role: o,
            'aria-label': c,
            'aria-selected': d,
            'aria-checked': h,
            className: i(m, z.item, C && z.withIcon, {
              [z.isActive]: w,
              [z.isDisabled]: T || x,
              [z.hovered]: E,
            }),
            title: v,
            href: k,
            target: L,
            rel: A,
            reference: function (e) {
              (H.current = e), 'function' == typeof M && M(e);
              'object' == typeof M && (M.current = e);
            },
            onClick: function (t) {
              const {
                dontClosePopup: o,
                onClick: n,
                onClickArg: i,
                trackEventObject: r,
              } = e;
              if (T) return;
              r && (0, l.trackEvent)(r.category, r.event, r.label);
              n && n(i, t);
              o || (0, a.globalCloseMenu)();
            },
            onContextMenu: function (t) {
              const { trackEventObject: o, trackRightClick: n } = e;
              o &&
                n &&
                (0, l.trackEvent)(o.category, o.event, `${o.label}_rightClick`);
            },
            onMouseUp: function (t) {
              const { trackEventObject: o, trackMouseWheelClick: n } = e;
              if (1 === t.button && k && o) {
                let e = o.label;
                n && (e += '_mouseWheelClick'),
                  (0, l.trackEvent)(o.category, o.event, e);
              }
            },
            onMouseOver: N,
            onMouseOut: I,
            onKeyDown: B,
            tabIndex: R,
          },
          void 0 !== C &&
            n.createElement('span', {
              'aria-label': V && V['aria-label'],
              'aria-hidden': V && Boolean(V['aria-hidden']),
              className: i(z.icon, P && s['round-icon']),
              dangerouslySetInnerHTML: { __html: C },
            }),
          n.createElement(
            'span',
            { className: i(z.labelRow, p) },
            n.createElement('span', { className: i(z.label, g) }, _)
          ),
          (void 0 !== b || f) &&
            n.createElement(
              'span',
              { className: z.shortcut },
              (Z = b) && Z.split('+').join(' + ')
            ),
          void 0 !== y &&
            n.createElement(
              'span',
              {
                onClick: D ? u : void 0,
                className: i(z.toolbox, {
                  [z.showOnHover]: S,
                  [z.showOnFocus]: F,
                }),
              },
              y
            )
        );
        var Z;
      }
    },
    81332: (e, t, o) => {
      'use strict';
      o.d(t, { multilineLabelWithIconAndToolboxTheme: () => l });
      var n = o(40173),
        i = o(71986),
        a = o(33963);
      const l = (0, n.mergeThemes)(i, a);
    },
    20520: (e, t, o) => {
      'use strict';
      o.d(t, { PopupMenu: () => h });
      var n = o(50959),
        i = o(962),
        a = o(62942),
        l = o(65718),
        r = o(27317),
        s = o(29197);
      const c = n.createContext(void 0);
      var u = o(36383);
      const d = n.createContext({ setMenuMaxWidth: !1 });
      function h(e) {
        const {
            controller: t,
            children: o,
            isOpened: h,
            closeOnClickOutside: m = !0,
            doNotCloseOn: v,
            onClickOutside: p,
            onClose: g,
            onKeyboardClose: b,
            'data-name': f = 'popup-menu-container',
            ...C
          } = e,
          w = (0, n.useContext)(s.CloseDelegateContext),
          T = n.useContext(d),
          E = (0, n.useContext)(c),
          x = (0, u.useOutsideEvent)({
            handler: function (e) {
              p && p(e);
              if (!m) return;
              const t = (0, a.default)(v) ? v() : null == v ? [] : [v];
              if (t.length > 0 && e.target instanceof Node)
                for (const o of t) {
                  const t = i.findDOMNode(o);
                  if (t instanceof Node && t.contains(e.target)) return;
                }
              g();
            },
            mouseDown: !0,
            touchStart: !0,
          });
        return h
          ? n.createElement(
              l.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              n.createElement(
                'span',
                { ref: x, style: { pointerEvents: 'auto' } },
                n.createElement(
                  r.Menu,
                  {
                    ...C,
                    onClose: g,
                    onKeyboardClose: b,
                    onScroll: function (t) {
                      const { onScroll: o } = e;
                      o && o(t);
                    },
                    customCloseDelegate: w,
                    customRemeasureDelegate: E,
                    ref: t,
                    'data-name': f,
                    limitMaxWidth: T.setMenuMaxWidth,
                  },
                  o
                )
              )
            )
          : null;
      }
    },
    86656: (e, t, o) => {
      'use strict';
      o.d(t, { TouchScrollContainer: () => r });
      var n = o(50959),
        i = o(59142),
        a = o(50151),
        l = o(49483);
      const r = (0, n.forwardRef)((e, t) => {
        const { children: o, ...a } = e,
          r = (0, n.useRef)(null);
        return (
          (0, n.useImperativeHandle)(t, () => r.current),
          (0, n.useLayoutEffect)(() => {
            if (l.CheckMobile.iOS())
              return (
                null !== r.current &&
                  (0, i.disableBodyScroll)(r.current, { allowTouchMove: s(r) }),
                () => {
                  null !== r.current && (0, i.enableBodyScroll)(r.current);
                }
              );
          }, []),
          n.createElement('div', { ref: r, ...a }, o)
        );
      });
      function s(e) {
        return (t) => {
          const o = (0, a.ensureNotNull)(e.current),
            n = document.activeElement;
          return (
            !o.contains(t) || (null !== n && o.contains(n) && n.contains(t))
          );
        };
      }
    },
    6132: (e, t, o) => {
      'use strict';
      var n = o(22134);
      function i() {}
      function a() {}
      (a.resetWarningCache = i),
        (e.exports = function () {
          function e(e, t, o, i, a, l) {
            if (l !== n) {
              var r = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types'
              );
              throw ((r.name = 'Invariant Violation'), r);
            }
          }
          function t() {
            return e;
          }
          e.isRequired = e;
          var o = {
            array: e,
            bool: e,
            func: e,
            number: e,
            object: e,
            string: e,
            symbol: e,
            any: e,
            arrayOf: t,
            element: e,
            elementType: e,
            instanceOf: t,
            node: e,
            objectOf: t,
            oneOf: t,
            oneOfType: t,
            shape: t,
            exact: t,
            checkPropTypes: a,
            resetWarningCache: i,
          };
          return (o.PropTypes = o), o;
        });
    },
    19036: (e, t, o) => {
      e.exports = o(6132)();
    },
    22134: (e) => {
      'use strict';
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
    },
    22878: (e) => {
      e.exports = {
        dropdown: 'dropdown-pbhJWNrt',
        buttonWrap: 'buttonWrap-pbhJWNrt',
        control: 'control-pbhJWNrt',
        arrow: 'arrow-pbhJWNrt',
        arrowIcon: 'arrowIcon-pbhJWNrt',
        isOpened: 'isOpened-pbhJWNrt',
        hover: 'hover-pbhJWNrt',
        isGrayed: 'isGrayed-pbhJWNrt',
        accessible: 'accessible-pbhJWNrt',
      };
    },
    27334: (e) => {
      e.exports = {
        container: 'container-Wp9adlfh',
        mirror: 'mirror-Wp9adlfh',
        background: 'background-Wp9adlfh',
        arrow: 'arrow-Wp9adlfh',
      };
    },
    46173: (e) => {
      e.exports = { item: 'item-uxNfqe_g', label: 'label-uxNfqe_g' };
    },
    99537: (e) => {
      e.exports = {
        drawingToolbar: 'drawingToolbar-BfVZxb4b',
        isHidden: 'isHidden-BfVZxb4b',
        inner: 'inner-BfVZxb4b',
        group: 'group-BfVZxb4b',
        lastGroup: 'lastGroup-BfVZxb4b',
        fill: 'fill-BfVZxb4b',
      };
    },
    22231: (e) => {
      e.exports = {
        toggleButton: 'toggleButton-OhcB9eH7',
        collapsed: 'collapsed-OhcB9eH7',
        background: 'background-OhcB9eH7',
        arrow: 'arrow-OhcB9eH7',
      };
    },
    20274: (e) => {
      e.exports = { item: 'item-yfwdxbRo', hovered: 'hovered-yfwdxbRo' };
    },
    12451: (e) => {
      e.exports = {
        desktopSize: 'desktopSize-l1SzP6TV',
        smallSize: 'smallSize-l1SzP6TV',
        tabs: 'tabs-l1SzP6TV',
        categories: 'categories-l1SzP6TV',
      };
    },
    78227: (e) => {
      e.exports = { sticker: 'sticker-aZclaNCs' };
    },
    23091: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        stickerRow: 'stickerRow-KUOIljqV',
      };
    },
    62270: (e) => {
      e.exports = { wrapper: 'wrapper-FNeSdxed' };
    },
    37531: (e) => {
      e.exports = { drawer: 'drawer-PzCssz1z', menuBox: 'menuBox-PzCssz1z' };
    },
    85470: (e) => {
      e.exports = {
        toolButtonMagnet: 'toolButtonMagnet-wg76fIbD',
        toolButtonMagnet__menuItem: 'toolButtonMagnet__menuItem-wg76fIbD',
        toolButtonMagnet__hintPlaceholder:
          'toolButtonMagnet__hintPlaceholder-wg76fIbD',
      };
    },
    30261: (e) => {
      e.exports = {
        wrap: 'wrap-Z4M3tWHb',
        scrollWrap: 'scrollWrap-Z4M3tWHb',
        noScrollBar: 'noScrollBar-Z4M3tWHb',
        content: 'content-Z4M3tWHb',
        icon: 'icon-Z4M3tWHb',
        scrollBot: 'scrollBot-Z4M3tWHb',
        scrollTop: 'scrollTop-Z4M3tWHb',
        isVisible: 'isVisible-Z4M3tWHb',
        iconWrap: 'iconWrap-Z4M3tWHb',
        fadeBot: 'fadeBot-Z4M3tWHb',
        fadeTop: 'fadeTop-Z4M3tWHb',
      };
    },
    55619: (e) => {
      e.exports = { iconContainer: 'iconContainer-dmpvVypS' };
    },
    71468: (e, t, o) => {
      'use strict';
      function n(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:main-element'));
      }
      function i(e) {
        e.dispatchEvent(new CustomEvent('roving-tabindex:secondary-element'));
      }
      o.d(t, { becomeMainElement: () => n, becomeSecondaryElement: () => i });
    },
    36898: (e, t, o) => {
      'use strict';
      o.d(t, { useMouseClickAutoBlur: () => l });
      var n = o(50959),
        i = o(76460),
        a = o(16838);
      function l(e) {
        (0, n.useEffect)(() => {
          if (!a.PLATFORM_ACCESSIBILITY_ENABLED) return;
          const t = (t) => {
            const o = e.current;
            null !== o &&
              document.activeElement instanceof HTMLElement &&
              ((0, i.isKeyboardClick)(t) ||
                (o.contains(document.activeElement) &&
                  'INPUT' !== document.activeElement.tagName &&
                  document.activeElement.blur()));
          };
          return (
            window.addEventListener('click', t, !0),
            () => window.removeEventListener('click', t, !0)
          );
        }, []);
      }
    },
    54079: (e, t, o) => {
      'use strict';
      o.d(t, { Toolbar: () => d });
      var n = o(50959),
        i = o(50151),
        a = o(47201),
        l = o(3343),
        r = o(16838),
        s = o(71468),
        c = o(39416),
        u = o(36898);
      const d = (0, n.forwardRef)(function (e, t) {
        const { onKeyDown: o, orientation: d, ...m } = e,
          v = r.PLATFORM_ACCESSIBILITY_ENABLED
            ? { role: 'toolbar', 'aria-orientation': d }
            : {},
          p = (0, c.useFunctionalRefObject)(t);
        return (
          (0, n.useEffect)(() => {
            if (!r.PLATFORM_ACCESSIBILITY_ENABLED) return;
            const e = (0, i.ensureNotNull)(p.current),
              t = () => {
                const t = (function (e) {
                  return Array.from(
                    e.querySelectorAll(
                      'button:not([disabled], [aria-disabled], [tabindex="-1"]), [tabindex]:not([disabled], [aria-disabled], [tabindex="-1"])'
                    )
                  ).filter((0, r.createScopedVisibleElementFilter)(e));
                })(e).sort(r.navigationOrderComparator);
                if (0 === t.length) {
                  const [t] = h(e).sort(r.navigationOrderComparator);
                  if (void 0 === t) return;
                  (0, s.becomeMainElement)(t);
                }
                if (t.length > 1) {
                  const [, ...e] = t;
                  for (const t of e) (0, s.becomeSecondaryElement)(t);
                }
              };
            return (
              window.addEventListener('keyboard-navigation-activation', t),
              () =>
                window.removeEventListener('keyboard-navigation-activation', t)
            );
          }, []),
          (0, u.useMouseClickAutoBlur)(p),
          n.createElement('div', {
            ...m,
            ...v,
            ref: p,
            onKeyDown: (0, a.createSafeMulticastEventHandler)(function (e) {
              if (!r.PLATFORM_ACCESSIBILITY_ENABLED) return;
              if (e.defaultPrevented) return;
              if (!(document.activeElement instanceof HTMLElement)) return;
              const t = (0, l.hashFromEvent)(e);
              if (27 === t)
                return e.preventDefault(), void document.activeElement.blur();
              if ('vertical' !== d && 37 !== t && 39 !== t) return;
              if ('vertical' === d && 38 !== t && 40 !== t) return;
              const o = h(e.currentTarget).sort(r.navigationOrderComparator);
              if (0 === o.length) return;
              const n = o.indexOf(document.activeElement);
              if (-1 === n) return;
              e.preventDefault();
              const i = () => {
                  const e = (n + o.length - 1) % o.length;
                  (0, s.becomeSecondaryElement)(o[n]),
                    (0, s.becomeMainElement)(o[e]),
                    o[e].focus();
                },
                a = () => {
                  const e = (n + o.length + 1) % o.length;
                  (0, s.becomeSecondaryElement)(o[n]),
                    (0, s.becomeMainElement)(o[e]),
                    o[e].focus();
                };
              switch (t) {
                case 37:
                  'vertical' !== d && i();
                  break;
                case 39:
                  'vertical' !== d && a();
                  break;
                case 38:
                  'vertical' === d && i();
                  break;
                case 40:
                  'vertical' === d && a();
              }
            }, o),
          })
        );
      });
      function h(e) {
        return Array.from(
          e.querySelectorAll(
            'button:not([disabled], [aria-disabled]), [tabindex]:not([disabled], [aria-disabled])'
          )
        ).filter((0, r.createScopedVisibleElementFilter)(e));
      }
    },
    14186: (e, t, o) => {
      'use strict';
      o.r(t), o.d(t, { DrawingToolbarRenderer: () => ho });
      var n = o(50959),
        i = o(962),
        a = o(50151),
        l = o(97754),
        r = o.n(l),
        s = o(32563),
        c = o(56840),
        u = o(14483),
        d = o(88348),
        h = o(76422),
        m = o(57898),
        v = o.n(m),
        p = o(49483),
        g = o(84015),
        b = o(54819);
      class f {
        constructor(e) {
          this._drawingsAccess = e || { tools: [], type: 'black' };
        }
        isToolEnabled(e) {
          const t = this._findTool(e);
          return (
            !(!t || !t.grayed) ||
            ('black' === this._drawingsAccess.type ? !t : !!t)
          );
        }
        isToolGrayed(e) {
          const t = this._findTool(e);
          return Boolean(t && t.grayed);
        }
        _findTool(e) {
          return this._drawingsAccess.tools.find((t) => t.name === e);
        }
      }
      var C = o(44352),
        w = o(68335);
      const T = [
        {
          id: 'linetool-group-cursors',
          title: C.t(null, void 0, o(82401)),
          items: [
            { name: 'cursor' },
            { name: 'dot' },
            { name: 'arrow' },
            { name: 'eraser' },
          ],
          trackLabel: null,
        },
        {
          id: 'linetool-group-trend-line',
          title: C.t(null, void 0, o(18794)),
          items: [
            { name: 'LineToolTrendLine', hotkeyHash: w.Modifiers.Alt + 84 },
            { name: 'LineToolArrow' },
            { name: 'LineToolRay' },
            { name: 'LineToolInfoLine' },
            { name: 'LineToolExtended' },
            { name: 'LineToolTrendAngle' },
            { name: 'LineToolHorzLine', hotkeyHash: w.Modifiers.Alt + 72 },
            { name: 'LineToolHorzRay', hotkeyHash: w.Modifiers.Alt + 74 },
            {
              name: 'LineToolVertLine',
              hotkeyHash: w.Modifiers.Alt + 86,
            },
            { name: 'LineToolCrossLine', hotkeyHash: w.Modifiers.Alt + 67 },
            { name: 'LineToolParallelChannel' },
            { name: 'LineToolRegressionTrend' },
            { name: 'LineToolFlatBottom' },
            { name: 'LineToolDisjointAngle' },
            null,
          ].filter(Boolean),
          trackLabel: null,
        },
        {
          id: 'linetool-group-gann-and-fibonacci',
          title: C.t(null, void 0, o(5816)),
          items: [
            {
              name: 'LineToolFibRetracement',
              hotkeyHash: w.Modifiers.Alt + 70,
            },
            { name: 'LineToolTrendBasedFibExtension' },
            { name: 'LineToolPitchfork' },
            { name: 'LineToolSchiffPitchfork2' },
            { name: 'LineToolSchiffPitchfork' },
            { name: 'LineToolInsidePitchfork' },
            { name: 'LineToolFibChannel' },
            { name: 'LineToolFibTimeZone' },
            { name: 'LineToolGannSquare' },
            { name: 'LineToolGannFixed' },
            { name: 'LineToolGannComplex' },
            { name: 'LineToolGannFan' },
            { name: 'LineToolFibSpeedResistanceFan' },
            { name: 'LineToolTrendBasedFibTime' },
            { name: 'LineToolFibCircles' },
            { name: 'LineToolPitchfan' },
            { name: 'LineToolFibSpiral' },
            { name: 'LineToolFibSpeedResistanceArcs' },
            { name: 'LineToolFibWedge' },
          ],
          trackLabel: null,
        },
        {
          id: 'linetool-group-geometric-shapes',
          title: C.t(null, void 0, o(22146)),
          items: [
            { name: 'LineToolBrush' },
            { name: 'LineToolHighlighter' },
            { name: 'LineToolRectangle' },
            { name: 'LineToolCircle' },
            { name: 'LineToolEllipse' },
            { name: 'LineToolPath' },
            { name: 'LineToolBezierQuadro' },
            { name: 'LineToolPolyline' },
            { name: 'LineToolTriangle' },
            { name: 'LineToolRotatedRectangle' },
            { name: 'LineToolArc' },
            { name: 'LineToolBezierCubic' },
          ],
          trackLabel: null,
        },
        {
          id: 'linetool-group-annotation',
          title: C.t(null, void 0, o(19661)),
          items: [
            { name: 'LineToolText' },
            { name: 'LineToolTextAbsolute' },
            { name: 'LineToolNote' },
            { name: 'LineToolNoteAbsolute' },
            { name: 'LineToolSignpost' },
            null,
            null,
            null,
            { name: 'LineToolCallout' },
            { name: 'LineToolComment' },
            { name: 'LineToolPriceLabel' },
            { name: 'LineToolPriceNote' },
            { name: 'LineToolArrowMarker' },
            { name: 'LineToolArrowMarkLeft' },
            { name: 'LineToolArrowMarkRight' },
            { name: 'LineToolArrowMarkUp' },
            { name: 'LineToolArrowMarkDown' },
            { name: 'LineToolFlagMark' },
          ].filter(Boolean),
          trackLabel: null,
        },
        {
          id: 'linetool-group-patterns',
          title: C.t(null, void 0, o(19693)),
          items: [
            { name: 'LineTool5PointsPattern' },
            { name: 'LineToolCypherPattern' },
            { name: 'LineToolABCD' },
            { name: 'LineToolTrianglePattern' },
            { name: 'LineToolThreeDrivers' },
            { name: 'LineToolHeadAndShoulders' },
            { name: 'LineToolElliottImpulse' },
            { name: 'LineToolElliottTriangle' },
            { name: 'LineToolElliottTripleCombo' },
            { name: 'LineToolElliottCorrection' },
            { name: 'LineToolElliottDoubleCombo' },
            { name: 'LineToolCircleLines' },
            { name: 'LineToolTimeCycles' },
            { name: 'LineToolSineLine' },
          ],
          trackLabel: null,
        },
        {
          id: 'linetool-group-prediction-and-measurement',
          title: C.t(null, void 0, o(97100)),
          items: [
            { name: 'LineToolRiskRewardLong' },
            { name: 'LineToolRiskRewardShort' },
            { name: 'LineToolPrediction' },
            { name: 'LineToolDateRange' },
            { name: 'LineToolPriceRange' },
            { name: 'LineToolDateAndPriceRange' },
            { name: 'LineToolBarsPattern' },
            { name: 'LineToolGhostFeed' },
            { name: 'LineToolProjection' },
            { name: 'LineToolFixedRangeVolumeProfile' },
          ].filter(Boolean),
          trackLabel: null,
        },
      ];
      var E = o(14873),
        x = o(9745),
        _ = o(88275),
        k = o(61345),
        S = o(45601),
        F = o(30261),
        L = o(61380);
      class A extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._scroll = null),
            (this._handleScrollTop = () => {
              this.animateTo(
                Math.max(
                  0,
                  this.currentPosition() - (this.state.heightWrap - 50)
                )
              );
            }),
            (this._handleScrollBot = () => {
              this.animateTo(
                Math.min(
                  (this.state.heightContent || 0) -
                    (this.state.heightWrap || 0),
                  this.currentPosition() + (this.state.heightWrap - 50)
                )
              );
            }),
            (this._handleResizeWrap = ([e]) => {
              this.setState({ heightWrap: e.contentRect.height });
            }),
            (this._handleResizeContent = ([e]) => {
              this.setState({ heightContent: e.contentRect.height });
            }),
            (this._handleScroll = () => {
              const { onScroll: e } = this.props;
              e && e(this.currentPosition(), this.isAtTop(), this.isAtBot()),
                this._checkButtonsVisibility();
            }),
            (this._checkButtonsVisibility = () => {
              const { isVisibleTopButton: e, isVisibleBotButton: t } =
                  this.state,
                o = this.isAtTop(),
                n = this.isAtBot();
              o || e
                ? o && e && this.setState({ isVisibleTopButton: !1 })
                : this.setState({ isVisibleTopButton: !0 }),
                n || t
                  ? n && t && this.setState({ isVisibleBotButton: !1 })
                  : this.setState({ isVisibleBotButton: !0 });
            }),
            (this.state = {
              heightContent: 0,
              heightWrap: 0,
              isVisibleBotButton: !1,
              isVisibleTopButton: !1,
            });
        }
        componentDidMount() {
          this._checkButtonsVisibility();
        }
        componentDidUpdate(e, t) {
          (t.heightWrap === this.state.heightWrap &&
            t.heightContent === this.state.heightContent) ||
            this._handleScroll();
        }
        currentPosition() {
          return this._scroll ? this._scroll.scrollTop : 0;
        }
        isAtTop() {
          return this.currentPosition() <= 1;
        }
        isAtBot() {
          return (
            this.currentPosition() + this.state.heightWrap >=
            this.state.heightContent - 1
          );
        }
        animateTo(e, t = k.dur) {
          const o = this._scroll;
          o &&
            (0, _.doAnimate)({
              onStep(e, t) {
                o.scrollTop = t;
              },
              from: o.scrollTop,
              to: Math.round(e),
              easing: k.easingFunc.easeInOutCubic,
              duration: t,
            });
        }
        render() {
          const {
              children: e,
              isVisibleScrollbar: t,
              isVisibleFade: o,
              isVisibleButtons: i,
              onMouseOver: a,
              onMouseOut: l,
            } = this.props,
            {
              heightContent: s,
              heightWrap: c,
              isVisibleBotButton: u,
              isVisibleTopButton: d,
            } = this.state;
          return n.createElement(
            S.Measure,
            { onResize: this._handleResizeWrap },
            (h) =>
              n.createElement(
                'div',
                { className: F.wrap, onMouseOver: a, onMouseOut: l, ref: h },
                n.createElement(
                  'div',
                  {
                    className: r()(F.scrollWrap, { [F.noScrollBar]: !t }),
                    onScroll: this._handleScroll,
                    ref: (e) => (this._scroll = e),
                  },
                  n.createElement(
                    S.Measure,
                    { onResize: this._handleResizeContent },
                    (t) =>
                      n.createElement(
                        'div',
                        { className: F.content, ref: t },
                        e
                      )
                  )
                ),
                o &&
                  n.createElement('div', {
                    className: r()(F.fadeTop, { [F.isVisible]: d && s > c }),
                  }),
                o &&
                  n.createElement('div', {
                    className: r()(F.fadeBot, { [F.isVisible]: u && s > c }),
                  }),
                i &&
                  n.createElement(
                    'div',
                    {
                      className: r()(F.scrollTop, {
                        [F.isVisible]: d && s > c,
                      }),
                      onClick: this._handleScrollTop,
                    },
                    n.createElement(
                      'div',
                      { className: F.iconWrap },
                      n.createElement(x.Icon, { icon: L, className: F.icon })
                    )
                  ),
                i &&
                  n.createElement(
                    'div',
                    {
                      className: r()(F.scrollBot, {
                        [F.isVisible]: u && s > c,
                      }),
                      onClick: this._handleScrollBot,
                    },
                    n.createElement(
                      'div',
                      { className: F.iconWrap },
                      n.createElement(x.Icon, { icon: L, className: F.icon })
                    )
                  )
              )
          );
        }
      }
      A.defaultProps = { isVisibleScrollbar: !0 };
      var y = o(4741),
        M = o(59064),
        I = o(66427),
        N = o(16838),
        B = o(50238);
      function D(e) {
        const [t, o] = (0, B.useRovingTabindexElement)(null);
        return n.createElement(I.ToolButton, {
          ...e,
          ref: t,
          tag: N.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          tabIndex: o,
        });
      }
      function z(e) {
        const {
          id: t,
          action: o,
          isActive: i,
          isHidden: a,
          isTransparent: l,
          toolName: r,
        } = e;
        return n.createElement(D, {
          id: t,
          icon: b.lineToolsInfo[r].icon,
          isActive: i,
          isHidden: a,
          isTransparent: l,
          onClick: o,
          title: b.lineToolsInfo[r].localizedName,
          'data-name': r,
        });
      }
      var R = o(90186);
      const W = (e) => {
        const [t, o] = (0, n.useState)(e.value());
        return (
          (0, n.useEffect)(() => {
            const t = (e) => o(e);
            return e.subscribe(t), () => e.unsubscribe(t);
          }, [e]),
          [t, (t) => e.setValue(t)]
        );
      };
      var j,
        P = o(58275),
        V = o.n(P);
      !(function (e) {
        (e.Icons = 'icons'), (e.Emojis = 'emojis'), (e.Stickers = 'stickers');
      })(j || (j = {}));
      const O = c.getValue('ToolButtonIcons.LastCategory', j.Emojis),
        H = new (V())(O);
      function U() {
        const [e, t] = W(H);
        return [
          e,
          (0, n.useCallback)(
            (e) => {
              t(e),
                (function (e) {
                  c.setValue('ToolButtonIcons.LastCategory', e);
                })(e);
            },
            [t]
          ),
        ];
      }
      var G = o(99616),
        Z = o(62270);
      function K(e) {
        return n.createElement('div', { className: Z.wrapper }, e.text);
      }
      var J = o(87872),
        q = o(51609),
        Y = o(22976),
        $ = o(70616),
        Q = o(18042),
        X = o(44986),
        ee = o(83778),
        te = o(48748);
      const oe = [
          '0xF087',
          '0xF088',
          '0xF164',
          '0xF165',
          '0xF0A4',
          '0xF0A5',
          '0xF007',
          '0xF0A6',
          '0xF0A7',
          '0xF118',
          '0xF11A',
          '0xF119',
          '0xF183',
        ],
        ne = [
          '0xF153',
          '0xF154',
          '0xF155',
          '0xF156',
          '0xF157',
          '0xF158',
          '0xF159',
          '0xF195',
          '0xF15A',
        ],
        ie = [
          '0xF060',
          '0xF061',
          '0xF062',
          '0xF063',
          '0xF053',
          '0xF054',
          '0xF077',
          '0xF078',
          '0xF07D',
          '0xF07E',
          '0xF0A9',
          '0xF0AA',
          '0xF0AB',
          '0xF0D9',
          '0xF0DA',
          '0xF0D7',
          '0xF0D8',
          '0xF102',
          '0xF103',
          '0xF104',
          '0xF105',
          '0xF106',
          '0xF107',
          '0xF137',
          '0xF139',
          '0xF13A',
          '0xF112',
          '0xF064',
          '0xF148',
          '0xF149',
          '0xF177',
          '0xF178',
          '0xF175',
          '0xF176',
          '0xF01A',
          '0xF01B',
          '0xF065',
          '0xF066',
        ],
        ae = [
          '0xF11D',
          '0xF11E',
          '0xF024',
          '0xF004',
          '0xF005',
          '0xF006',
          '0xF046',
          '0xF00C',
          '0xF00D',
          '0xF011',
          '0xF012',
          '0xF021',
          '0xF01E',
          '0xF192',
          '0xF041',
          '0xF14A',
          '0xF055',
          '0xF056',
          '0xF057',
          '0xF059',
          '0xF058',
          '0xF05A',
          '0xF05B',
          '0xF05C',
          '0xF05D',
          '0xF05E',
          '0xF067',
          '0xF068',
          '0xF069',
          '0xF06A',
          '0xF071',
          '0xF06E',
          '0xF070',
          '0xF075',
          '0xF08A',
          '0xF0A3',
          '0xF0E5',
          '0xF110',
          '0xF111',
          '0xF123',
          '0xF124',
          '0xF10C',
          '0xF128',
          '0xF129',
          '0xF12A',
          '0xF140',
          '0xF113',
          '0xF17C',
          '0xF179',
        ],
        le = ['0xF06C', '0xF185', '0xF186', '0xF188', '0xF0E7'],
        re = [
          '0xF000',
          '0xF002',
          '0xF00E',
          '0xF015',
          '0xF017',
          '0xF030',
          '0xF013',
          '0xF043',
          '0xF06B',
          '0xF072',
          '0xF076',
          '0xF080',
          '0xF084',
          '0xF040',
          '0xF0A1',
          '0xF0A2',
          '0xF0D6',
          '0xF0E3',
          '0xF0EB',
          '0xF0F3',
          '0xF135',
          '0xF13D',
          '0xF2FE',
        ],
        se = [...oe, ...ne, ...ie, ...ae, ...le, ...re].map((e) => +e),
        ce = new Set(se);
      const ue = [
          {
            title: C.t(null, { context: 'emoji_group' }, o(15426)),
            emojis: [],
            content: n.createElement(G.IconItem, { icon: X }),
          },
          {
            title: C.t(null, { context: 'emoji_group' }, o(33628)),
            emojis: oe,
            content: n.createElement(G.IconItem, { icon: ee }),
          },
          {
            title: C.t(null, { context: 'emoji_group' }, o(77011)),
            emojis: ae,
            content: n.createElement(G.IconItem, { icon: $ }),
          },
          {
            title: C.t(null, { context: 'emoji_group' }, o(11739)),
            emojis: le,
            content: n.createElement(G.IconItem, { icon: te }),
          },
          {
            title: C.t(null, { context: 'emoji_group' }, o(14281)),
            emojis: ne,
            content: n.createElement(G.IconItem, { icon: Y }),
          },
          {
            title: C.t(null, { context: 'emoji_group' }, o(72302)),
            emojis: re,
            content: n.createElement(G.IconItem, { icon: Q }),
          },
          {
            title: C.t(null, { context: 'emoji_group' }, o(57792)),
            emojis: ie,
            content: n.createElement(G.IconItem, { icon: q }),
          },
        ],
        de = {
          [j.Icons]: J.drawingToolsIcons.heart,
          [j.Emojis]: J.drawingToolsIcons.smile,
          [j.Stickers]: J.drawingToolsIcons.sticker,
        },
        he = [
          {
            title: j.Emojis,
            content: n.createElement(K, {
              text: C.t(null, void 0, o(19570)),
            }),
          },
          {
            title: j.Stickers,
            content: n.createElement(K, { text: C.t(null, void 0, o(84121)) }),
          },
          {
            title: j.Icons,
            content: n.createElement(K, { text: C.t(null, void 0, o(92464)) }),
          },
        ];
      var me = o(3343),
        ve = o(20520),
        pe = o(27317),
        ge = o(76460),
        be = o(41590),
        fe = o(40173),
        Ce = o(14665);
      const we = o(22878),
        Te = (0, n.forwardRef)((e, t) => {
          const {
              buttonActiveClass: o,
              buttonClass: i,
              buttonIcon: a,
              buttonTitle: r,
              buttonHotKey: c,
              dropdownTooltip: u,
              children: d,
              isActive: h,
              isGrayed: m,
              onClickWhenGrayed: v,
              checkable: p,
              isSmallTablet: g,
              theme: b = we,
              onClickButton: f,
              onArrowClick: C,
              openDropdownByClick: w,
              ...T
            } = e,
            E = (0, fe.mergeThemes)(pe.DEFAULT_MENU_THEME, {
              menuBox: b.menuBox,
            }),
            _ = N.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
            [k, S] = (0, n.useState)(!1),
            [F, L] = (0, n.useState)(!1),
            A = (0, n.useRef)(null),
            y = (0, n.useRef)(null),
            M = (0, n.useRef)(null),
            D = (0, n.useRef)(0),
            z = (0, n.useRef)(0),
            [R, W] = (0, B.useRovingTabindexElement)(null),
            [j, P] = (0, B.useRovingTabindexElement)(null);
          return (
            (0, n.useImperativeHandle)(t, () => ({ open: () => S(!0) }), []),
            n.createElement(
              'div',
              {
                ...T,
                className: l(b.dropdown, {
                  [b.isGrayed]: m,
                  [b.isActive]: h,
                  [b.isOpened]: k,
                }),
                onClick: m ? v : void 0,
                onKeyDown: function (e) {
                  var t;
                  if (
                    e.defaultPrevented ||
                    !(e.target instanceof Node) ||
                    !N.PLATFORM_ACCESSIBILITY_ENABLED
                  )
                    return;
                  const o = (0, me.hashFromEvent)(e);
                  if (e.currentTarget.contains(e.target) || 27 !== o) return;
                  e.preventDefault(),
                    V(!1),
                    F &&
                      (null === (t = null == j ? void 0 : j.current) ||
                        void 0 === t ||
                        t.focus());
                },
                ref: A,
              },
              n.createElement(
                'div',
                { ref: y, className: b.control },
                n.createElement(
                  'div',
                  {
                    ...(function () {
                      if (!m)
                        return s.mobiletouch
                          ? p
                            ? { onTouchStart: U, onTouchEnd: Z, onTouchMove: G }
                            : { onClick: H }
                          : { onMouseDown: U, onMouseUp: K };
                      return {};
                    })(),
                    className: l(
                      b.buttonWrap,
                      {
                        'apply-common-tooltip common-tooltip-vertical': Boolean(
                          r || c
                        ),
                      },
                      N.PLATFORM_ACCESSIBILITY_ENABLED && b.accessible
                    ),
                    'data-tooltip-hotkey': c,
                    'data-tooltip-delay': 1500,
                    'data-role': 'button',
                    title: r,
                  },
                  n.createElement(I.ToolButton, {
                    activeClass: o,
                    className: l(i, b.button),
                    icon: a,
                    isActive: h,
                    isGrayed: m,
                    isTransparent: !p,
                    ref: R,
                    tag: _,
                    tabIndex: W,
                    onClick: function (e) {
                      if (!(0, ge.isKeyboardClick)(e)) return;
                      w ? V(!0, !0) : null == f || f();
                    },
                  })
                ),
                !m &&
                  !s.mobiletouch &&
                  n.createElement(
                    _,
                    {
                      className: l(
                        b.arrow,
                        u && 'apply-common-tooltip common-tooltip-vertical',
                        N.PLATFORM_ACCESSIBILITY_ENABLED && b.accessible
                      ),
                      title: u,
                      onClick: function (e) {
                        null == C || C(), V(void 0, (0, ge.isKeyboardClick)(e));
                      },
                      onKeyDown: function (e) {
                        if (
                          e.defaultPrevented ||
                          !(e.target instanceof Node) ||
                          !N.PLATFORM_ACCESSIBILITY_ENABLED
                        )
                          return;
                        const t = (0, me.hashFromEvent)(e);
                        if (e.currentTarget.contains(e.target))
                          switch (t) {
                            case 39:
                              if (k) return;
                              e.preventDefault(), V(!0, !0);
                              break;
                            case 27:
                              if (!k) return;
                              e.preventDefault(), V(!1);
                          }
                      },
                      type: N.PLATFORM_ACCESSIBILITY_ENABLED
                        ? 'button'
                        : void 0,
                      'data-role': N.PLATFORM_ACCESSIBILITY_ENABLED
                        ? void 0
                        : 'menu-handle',
                      ref: j,
                      tabIndex: P,
                      'aria-pressed': N.PLATFORM_ACCESSIBILITY_ENABLED
                        ? h
                        : void 0,
                      'aria-label': N.PLATFORM_ACCESSIBILITY_ENABLED
                        ? u
                        : void 0,
                      'data-tooltip': u,
                    },
                    n.createElement(x.Icon, {
                      className: b.arrowIcon,
                      icon: Ce,
                    })
                  )
              ),
              !m &&
                (g
                  ? k &&
                    n.createElement(
                      be.Drawer,
                      { className: b.drawer, onClose: O, position: 'Bottom' },
                      d
                    )
                  : n.createElement(
                      ve.PopupMenu,
                      {
                        theme: E,
                        doNotCloseOn: function () {
                          if (null === A.current) return [];
                          return [A.current];
                        },
                        isOpened: k,
                        onClose: O,
                        position: function () {
                          if (!y || !y.current) return { x: 0, y: 0 };
                          const e = y.current.getBoundingClientRect();
                          return { x: e.left + e.width + 1, y: e.top - 6 };
                        },
                        controller: M,
                        onOpen: function () {
                          var e;
                          if (!N.PLATFORM_ACCESSIBILITY_ENABLED) return;
                          null === (e = M.current) || void 0 === e || e.focus();
                        },
                        tabIndex: N.PLATFORM_ACCESSIBILITY_ENABLED
                          ? -1
                          : void 0,
                      },
                      d
                    ))
            )
          );
          function V(e, t = !1) {
            const o = void 0 !== e ? e : !k;
            S(o), L(!!o && t);
          }
          function O() {
            V(!1);
          }
          function H() {
            f && f(), V();
          }
          function U() {
            if (s.mobiletouch && !p) !z.current && f && f();
            else {
              if (D.current)
                return clearTimeout(D.current), (D.current = 0), void V(!0);
              D.current = setTimeout(() => {
                (D.current = 0), !z.current && f && f();
              }, 175);
            }
            z.current = setTimeout(() => {
              (z.current = 0), V(!0);
            }, 300);
          }
          function G() {
            clearTimeout(z.current),
              (z.current = 0),
              clearTimeout(D.current),
              (D.current = 0);
          }
          function Z(e) {
            e.cancelable && e.preventDefault(), K();
          }
          function K() {
            z.current &&
              (clearTimeout(z.current),
              (z.current = 0),
              k
                ? V(!1)
                : p || k || s.mobiletouch || (!h && !w)
                ? !D.current && f && f()
                : V(!0));
          }
        });
      var Ee = o(38297),
        xe = o(85034),
        _e = o(68456),
        ke = o(21097);
      class Se extends _e.CommonJsonStoreService {
        constructor(e, t, o, n, i = 18) {
          super(ke.TVXWindowEvents, c, e, t, []),
            (this._onChangeDrawingState = () => {
              const e = d[this._drawingType].value();
              this._promote(e);
            }),
            (this._sanitizer = o),
            (this._drawingType = n),
            (this._maxRecentCount = i),
            d[this._drawingType].subscribe(this._onChangeDrawingState);
        }
        destroy() {
          d[this._drawingType].unsubscribe(this._onChangeDrawingState),
            super.destroy();
        }
        _deserialize(e) {
          const t = this._sanitizer(e);
          return this._removeUnavailableRecents(e, t);
        }
        _removeUnavailableRecents(e, t) {
          return (
            Array.isArray(e)
              ? e.length > this._maxRecentCount &&
                (t = e.slice(0, this._maxRecentCount))
              : (t = []),
            t
          );
        }
        _promote(e) {
          let t = [...this.get()];
          const o = t.indexOf(e);
          -1 !== o && t.splice(o, 1),
            (t = [e, ...t.slice(0, this._maxRecentCount - 1)]),
            this.set(t);
        }
      }
      const Fe = new Se(
        'RECENT_ICONS_CHANGED',
        'linetoolicon.recenticons',
        function (e) {
          return e.filter((e) => ce.has(e));
        },
        'iconTool'
      );
      var Le = o(55619);
      function Ae(e) {
        const { fallback: t, ...o } = e;
        return n.createElement(
          n.Suspense,
          { fallback: null != t ? t : null },
          n.createElement(ye, { ...o })
        );
      }
      const ye = n.lazy(async () => {
        const { getSvgContentForCharCode: e } = await o
          .e(7987)
          .then(o.bind(o, 1383));
        return {
          default: (t) => {
            var o;
            const { charCode: i } = t,
              a = null !== (o = e(i)) && void 0 !== o ? o : void 0;
            return n.createElement(x.Icon, {
              icon: a,
              className: Le.iconContainer,
            });
          },
        };
      });
      var Me = o(20274);
      var Ie = o(173);
      const Ne = new Se(
          'RECENT_EMOJIS_CHANGED',
          'linetoolemoji.recents',
          Ie.removeUnavailableEmoji,
          'emojiTool'
        ),
        Be = [
          'elon',
          'doge',
          'dislike',
          'yolo',
          'whale',
          'wagmi',
          'tendies',
          'short',
          'rugged',
          'shill',
          'rekt',
          'sell',
          'paper-hands',
          'og',
          'fud',
          'gm',
          'ngmi',
          'moon',
          'love',
          'lambo',
          'ethereum',
          'look',
          'diamond-hand',
          'leap',
          'like',
          'few',
          'bitcoin',
          'bag-holder',
          'buy-the-dip',
          'buy',
          'hodl',
        ];
      var De = o(37603),
        ze = o(90624);
      const Re = new Set(Be);
      const We = [
          {
            title: C.t(null, { context: 'emoji_group' }, o(15426)),
            emojis: [],
            content: n.createElement(G.IconItem, { icon: De }),
          },
          {
            title: 'TradingView',
            emojis: Be,
            content: n.createElement(G.IconItem, { icon: ze }),
          },
        ],
        je = new Se(
          'RECENT_STICKERS_CHANGED',
          'linetoolsticker.recents',
          function (e) {
            return e.filter((e) => Re.has(e));
          },
          'stickerTool',
          3
        );
      var Pe = o(78036),
        Ve = o(47291),
        Oe = o(78227);
      var He = o(26601),
        Ue = o(23091);
      const Ge = {
        [j.Icons]: {
          service: Fe,
          toolName: 'LineToolIcon',
          ItemComponent: function (e) {
            const { emoji: t, className: o } = e;
            return n.createElement(
              'div',
              { className: r()(Me.item, o) },
              n.createElement(Ae, { charCode: Number(t) })
            );
          },
          icons: ue,
          onEmojiSelect: (e) => {
            d.iconTool.setValue(Number(e)), d.tool.setValue('LineToolIcon');
          },
        },
        [j.Emojis]: {
          service: Ne,
          toolName: 'LineToolEmoji',
          icons: Ie.emojiGroups,
          onEmojiSelect: (e) => {
            d.emojiTool.setValue(e), d.tool.setValue('LineToolEmoji');
          },
        },
        [j.Stickers]: {
          service: je,
          toolName: 'LineToolSticker',
          ItemComponent: function (e) {
            const { emoji: t } = e,
              { size: i } = (0, Pe.useEnsuredContext)(
                Ve.EmojiListContentContext
              ),
              [a, l] = (0, n.useState)();
            return (
              (0, n.useEffect)(() => {
                o.e(5598)
                  .then(o.bind(o, 31235))
                  .then(({ getSvgContentForSticker: e }) => {
                    const o = e(t);
                    o && l(o);
                  });
              }, []),
              n.createElement(x.Icon, {
                className: Oe.sticker,
                icon: null !== a ? a : void 0,
                style: { width: `${i}px`, height: `${i}px` },
              })
            );
          },
          RowComponent: function (e) {
            return n.createElement(He.EmojisRow, {
              ...e,
              className: Ue.stickerRow,
            });
          },
          icons: We,
          onEmojiSelect: (e) => {
            d.stickerTool.setValue(e), d.tool.setValue('LineToolSticker');
          },
          getEmojiSize: (e) => (e ? 78 : 112),
        },
      };
      var Ze = o(12451);
      function Ke(e) {
        const {
            isSmallTablet: t,
            maxHeight: o,
            activeTab: i,
            setActiveTab: a,
          } = e,
          r = Ge[i],
          {
            service: s,
            ItemComponent: c,
            RowComponent: u,
            onEmojiSelect: d,
            getEmojiSize: h,
          } = r,
          m = h && h(t),
          [v, p] = (0, n.useState)(Je(r));
        return (
          (0, n.useLayoutEffect)(() => {
            const e = {},
              t = () => {
                const e = Je(r);
                p(e);
              };
            return (
              t(),
              s.getOnChange().subscribe(e, t),
              () => {
                s.getOnChange().unsubscribeAll(e);
              }
            );
          }, [r]),
          n.createElement(
            'div',
            { style: { maxHeight: o } },
            n.createElement(Ee.EmojiList, {
              className: l(Ze.desktopSize, t && Ze.smallSize),
              emojis: v,
              onSelect: function (e) {
                d(e), (0, M.globalCloseMenu)();
              },
              ItemComponent: c,
              RowComponent: u,
              height: o,
              category: i,
              emojiSize: m,
            }),
            n.createElement(xe.GroupTabs, {
              className: Ze.tabs,
              tabClassName: Ze.categories,
              tabs: he,
              activeTab: i,
              onTabClick: function (e) {
                a(e);
              },
            })
          )
        );
      }
      function Je(e) {
        const { icons: t, service: o } = e,
          n = [...t],
          i = o.get();
        return (
          (n[0].emojis = i.map((e) => String(e))),
          n.filter((e) => e.emojis.length)
        );
      }
      var qe = o(10888),
        Ye = o(37531);
      const $e = {
          icon: C.t(null, void 0, o(26579)),
          dropdownTooltip: C.t(null, void 0, o(92464)),
        },
        Qe = (0, fe.mergeThemes)(we, {
          menuBox: Ye.menuBox,
          drawer: Ye.drawer,
        }),
        Xe = parseInt(qe['default-drawer-min-top-distance']);
      function et(e) {
        const { isGrayed: t, isSmallTablet: o } = e,
          i = (0, R.filterDataProps)(e),
          [a, l] = U(),
          [r] = W(d.tool),
          { toolName: s } = Ge[a];
        return n.createElement(
          Te,
          {
            theme: Qe,
            buttonIcon: de[a],
            buttonTitle: $e.icon,
            dropdownTooltip: $e.dropdownTooltip,
            isActive: r === s,
            isGrayed: t,
            isSmallTablet: o,
            onClickButton: function () {
              c();
            },
            onClickWhenGrayed: () =>
              (0, h.emit)('onGrayedObjectClicked', {
                type: 'drawing',
                name: b.lineToolsInfo[s].localizedName,
              }),
            onArrowClick: function () {
              c('menu');
            },
            openDropdownByClick: !0,
            ...i,
          },
          n.createElement(Ke, {
            isSmallTablet: o,
            maxHeight: o ? Math.min(679, window.innerHeight - Xe) : 679,
            activeTab: a,
            setActiveTab: l,
          })
        );
        function c(e) {
          0;
        }
      }
      var tt = o(46100);
      class ot extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleClick = () => {
              this.props.saveDefaultOnChange &&
                (0, tt.saveDefaultProperties)(!0);
              const e = !this.props.property.value();
              this.props.property.setValue(e),
                this.props.saveDefaultOnChange &&
                  (0, tt.saveDefaultProperties)(!1),
                this.props.onClick && this.props.onClick(e);
            }),
            (this.state = { isActive: this.props.property.value() });
        }
        componentDidMount() {
          this.props.property.subscribe(this, this._onChange);
        }
        componentWillUnmount() {
          this.props.property.unsubscribe(this, this._onChange);
        }
        render() {
          const { toolName: e } = this.props,
            { isActive: t } = this.state,
            o = b.lineToolsInfo[e];
          return n.createElement(D, {
            icon: t && o.iconActive ? o.iconActive : o.icon,
            isActive: t,
            onClick: this._handleClick,
            title: o.localizedName,
            buttonHotKey: o.hotKey,
            'data-name': e,
          });
        }
        _onChange(e) {
          this.setState({ isActive: e.value() });
        }
      }
      class nt extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleClick = () => {
              var e, t;
              d.tool.setValue(this.props.toolName),
                null === (t = (e = this.props).onClick) ||
                  void 0 === t ||
                  t.call(e);
            }),
            (this._onChange = () => {
              this.setState({
                isActive: d.tool.value() === this.props.toolName,
              });
            }),
            (this.state = { isActive: d.tool.value() === this.props.toolName });
        }
        componentDidMount() {
          d.tool.subscribe(this._onChange);
        }
        componentWillUnmount() {
          d.tool.unsubscribe(this._onChange);
        }
        render() {
          const { toolName: e } = this.props,
            { isActive: t } = this.state,
            o = b.lineToolsInfo[e];
          return n.createElement(D, {
            icon: b.lineToolsInfo[e].icon,
            isActive: t,
            isTransparent: !0,
            onClick: this._handleClick,
            title: o.localizedName,
            buttonHotKey: o.hotKey,
            'data-name': e,
          });
        }
      }
      class it extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._boundUndoModel = null),
            (this._handleClick = () => {
              const e = this._activeChartWidget();
              e.hasModel() && e.model().zoomFromViewport();
            }),
            (this._syncUnzoomButton = () => {
              const e = this._activeChartWidget();
              let t = !1;
              if (e.hasModel()) {
                const o = e.model();
                this._boundUndoModel !== o &&
                  (this._boundUndoModel &&
                    this._boundUndoModel
                      .zoomStack()
                      .onChange()
                      .unsubscribe(null, this._syncUnzoomButton),
                  o
                    .zoomStack()
                    .onChange()
                    .subscribe(null, this._syncUnzoomButton),
                  (this._boundUndoModel = o)),
                  (t = !o.zoomStack().isEmpty());
              } else e.withModel(null, this._syncUnzoomButton);
              this.setState({ isVisible: t });
            }),
            (this.state = { isVisible: !1 });
        }
        componentDidMount() {
          this.props.chartWidgetCollection.activeChartWidget.subscribe(
            this._syncUnzoomButton,
            { callWithLast: !0 }
          );
        }
        componentWillUnmount() {
          this.props.chartWidgetCollection.activeChartWidget.unsubscribe(
            this._syncUnzoomButton
          );
        }
        render() {
          return this.state.isVisible
            ? n.createElement(z, {
                action: this._handleClick,
                isTransparent: !0,
                toolName: 'zoom-out',
              })
            : n.createElement('div', null);
        }
        _activeChartWidget() {
          return this.props.chartWidgetCollection.activeChartWidget.value();
        }
      }
      var at = o(71810),
        lt = o(36189),
        rt = o(16396),
        st = o(81332),
        ct = o(29673);
      class ut extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._onChangeDrawingState = () => {
              const e = this._getActiveToolIndex();
              this.setState({
                current: -1 !== e ? e : this.state.current,
                isActive: -1 !== e,
              });
            }),
            (this._handleClickButton = () => {
              if ((this._trackClick(), p.CheckMobile.any())) return;
              const e = this._getCurrentToolName();
              this._selectTool(e);
            }),
            (this._handleClickItem = (e) => {
              this._selectTool(e);
            }),
            (this._handleGrayedClick = (e) => {
              (0, h.emit)('onGrayedObjectClicked', {
                type: 'drawing',
                name: b.lineToolsInfo[e].localizedName,
              });
            }),
            (this._handleClickFavorite = (e) => {
              this.state.favState && this.state.favState[e]
                ? at.LinetoolsFavoritesStore.removeFavorite(e)
                : at.LinetoolsFavoritesStore.addFavorite(e);
            }),
            (this._onAddFavorite = (e) => {
              this.setState({ favState: { ...this.state.favState, [e]: !0 } });
            }),
            (this._onRemoveFavorite = (e) => {
              this.setState({ favState: { ...this.state.favState, [e]: !1 } });
            }),
            (this._onSyncFavorites = () => {
              this.setState({ favState: this._composeFavState() });
            }),
            (this._handleArrowClick = () => {
              this._trackClick('menu');
            }),
            (this._trackClick = (e) => {
              const { trackLabel: t } = this.props;
            });
          const t = this._getActiveToolIndex();
          this.state = {
            current: -1 === t ? this._firstNonGrayedTool() : t,
            favState: this._composeFavState(),
            isActive: -1 !== t,
          };
        }
        componentDidMount() {
          d.tool.subscribe(this._onChangeDrawingState),
            at.LinetoolsFavoritesStore.favoriteAdded.subscribe(
              null,
              this._onAddFavorite
            ),
            at.LinetoolsFavoritesStore.favoriteRemoved.subscribe(
              null,
              this._onRemoveFavorite
            ),
            at.LinetoolsFavoritesStore.favoritesSynced.subscribe(
              null,
              this._onSyncFavorites
            );
        }
        componentWillUnmount() {
          d.tool.unsubscribe(this._onChangeDrawingState),
            at.LinetoolsFavoritesStore.favoriteAdded.unsubscribe(
              null,
              this._onAddFavorite
            ),
            at.LinetoolsFavoritesStore.favoriteRemoved.unsubscribe(
              null,
              this._onRemoveFavorite
            ),
            at.LinetoolsFavoritesStore.favoritesSynced.unsubscribe(
              null,
              this._onSyncFavorites
            );
        }
        componentDidUpdate(e, t) {
          e.lineTools !== this.props.lineTools &&
            this.setState({ favState: this._composeFavState() });
        }
        render() {
          const {
              favoriting: e,
              grayedTools: t,
              lineTools: o,
              dropdownTooltip: i,
              isSmallTablet: a,
            } = this.props,
            { current: l, favState: r, isActive: s } = this.state,
            c = this._getCurrentToolName(),
            u = b.lineToolsInfo[c],
            d = this._showShortcuts(),
            h = (0, R.filterDataProps)(this.props);
          return n.createElement(
            'span',
            null,
            n.createElement(
              Te,
              {
                buttonIcon: u.icon,
                buttonTitle: u.localizedName,
                buttonHotKey: u.hotKey,
                dropdownTooltip: i,
                isActive: s,
                onClickButton: this._handleClickButton,
                onArrowClick: this._handleArrowClick,
                isSmallTablet: a,
                ...h,
              },
              o.map((o, i) => {
                const c = o.name,
                  u = b.lineToolsInfo[c],
                  h = t[c];
                return n.createElement(rt.PopupMenuItem, {
                  key: c,
                  'data-name': o.name,
                  theme: a ? st.multilineLabelWithIconAndToolboxTheme : void 0,
                  dontClosePopup: h,
                  forceShowShortcuts: d,
                  shortcut:
                    !a && o.hotkeyHash
                      ? (0, w.humanReadableHash)(o.hotkeyHash)
                      : void 0,
                  icon: u.icon,
                  isActive: s && l === i,
                  appearAsDisabled: h,
                  label: u.localizedName,
                  onClick: h ? this._handleGrayedClick : this._handleClickItem,
                  onClickArg: c,
                  showToolboxOnHover: !r[c],
                  toolbox:
                    e && !h
                      ? n.createElement(lt.FavoriteButton, {
                          isActive: s && l === i,
                          isFilled: r[c],
                          onClick: () => this._handleClickFavorite(c),
                        })
                      : void 0,
                });
              })
            )
          );
        }
        _getCurrentToolName() {
          const { current: e } = this.state,
            { lineTools: t } = this.props;
          return t[e || 0].name;
        }
        _firstNonGrayedTool() {
          const { grayedTools: e, lineTools: t } = this.props;
          return t.findIndex((t) => !e[t.name]);
        }
        _getActiveToolIndex() {
          return this.props.lineTools.findIndex(
            (e) => e.name === d.tool.value()
          );
        }
        _showShortcuts() {
          return this.props.lineTools.some((e) => 'shortcut' in e);
        }
        async _selectTool(e) {
          d.tool.setValue(e);
        }
        _composeFavState() {
          const e = {};
          return (
            this.props.lineTools.forEach((t) => {
              e[t.name] = at.LinetoolsFavoritesStore.isFavorite(t.name);
            }),
            e
          );
        }
      }
      var dt = o(51768),
        ht = o(46173);
      const mt = (0, fe.mergeThemes)(rt.DEFAULT_POPUP_MENU_ITEM_THEME, ht);
      var vt = o(28853);
      const pt = !1;
      class gt extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleRemoveToolClick = () => {
              s.mobiletouch || this._handleRemoveDrawings(), ft();
            }),
            (this._handleRemoveDrawings = () => {
              bt('remove drawing'),
                this.props.chartWidgetCollection.activeChartWidget
                  .value()
                  .removeAllDrawingTools();
            }),
            (this._handleRemoveStudies = () => {
              bt('remove indicator'),
                this.props.chartWidgetCollection.activeChartWidget
                  .value()
                  .removeAllStudies();
            }),
            (this._handleRemoveAll = () => {
              bt('remove all'),
                this.props.chartWidgetCollection.activeChartWidget
                  .value()
                  .removeAllStudiesDrawingTools();
            }),
            (this._handleActiveChartWidgetChanged = (e) => {
              this._activeChartWidget &&
                this._unsubscribeToModelChanges(this._activeChartWidget),
                e && this._subscribeToModelChanges(e),
                (this._activeChartWidget = e),
                this._handleCollectionChanged();
            }),
            (this._handleCollectionChanged = () => {
              this.setState(this._getActualState());
            }),
            (this._getActualState = () => {
              if (
                !this._activeChartWidget ||
                !this._activeChartWidget.hasModel()
              )
                return { numOfDrawings: 0, numOfIndicators: 0 };
              const e = this._activeChartWidget.model().dataSources(),
                t = e
                  .filter(ct.isLineTool)
                  .filter((e) => e.isActualSymbol() && e.isUserDeletable()),
                o = e
                  .filter(vt.isStudy)
                  .filter((e) => e.removeByRemoveAllStudies());
              return { numOfDrawings: t.length, numOfIndicators: o.length };
            }),
            (this._activeChartWidget =
              this.props.chartWidgetCollection.activeChartWidget.value()),
            (this.state = this._getActualState());
        }
        componentDidMount() {
          this.props.chartWidgetCollection.activeChartWidget.subscribe(
            this._handleActiveChartWidgetChanged,
            { callWithLast: !0 }
          );
        }
        componentWillUnmount() {
          this._activeChartWidget &&
            this._unsubscribeToModelChanges(this._activeChartWidget),
            this.props.chartWidgetCollection.activeChartWidget.unsubscribe(
              this._handleActiveChartWidgetChanged
            );
        }
        render() {
          const e = this.props.isSmallTablet ? mt : void 0,
            { numOfDrawings: t, numOfIndicators: i } = this.state,
            a = C.t(
              null,
              {
                plural: '{amount} drawings',
                count: t,
                replace: { amount: t.toString() },
              },
              o(93030)
            ),
            l = C.t(
              null,
              {
                plural: '{amount} indicators',
                count: i,
                replace: { amount: i.toString() },
              },
              o(80437)
            ),
            r = C.t(null, { replace: { drawings: a } }, o(30513)),
            s = C.t(null, { replace: { indicators: l } }, o(55084)),
            c = C.t(
              null,
              { replace: { drawings: a, indicators: l } },
              o(10049)
            );
          return n.createElement(
            Te,
            {
              buttonIcon: b.lineToolsInfo[this.props.toolName].icon,
              buttonTitle: r,
              onClickButton: this._handleRemoveToolClick,
              isSmallTablet: this.props.isSmallTablet,
              'data-name': this.props.toolName,
              onArrowClick: this._handleArrowClick,
              openDropdownByClick: pt,
            },
            n.createElement(rt.PopupMenuItem, {
              'data-name': 'remove-drawing-tools',
              label: r,
              onClick: this._handleRemoveDrawings,
              theme: e,
            }),
            n.createElement(rt.PopupMenuItem, {
              'data-name': 'remove-studies',
              label: s,
              onClick: this._handleRemoveStudies,
              theme: e,
            }),
            n.createElement(rt.PopupMenuItem, {
              'data-name': 'remove-all',
              label: c,
              onClick: this._handleRemoveAll,
              theme: e,
            })
          );
        }
        _handleArrowClick() {
          ft('menu');
        }
        _subscribeToModelChanges(e) {
          e.withModel(this, () => {
            this._handleCollectionChanged(),
              e
                .model()
                .model()
                .dataSourceCollectionChanged()
                .subscribe(this, this._handleCollectionChanged);
          });
        }
        _unsubscribeToModelChanges(e) {
          e.hasModel() &&
            e
              .model()
              .model()
              .dataSourceCollectionChanged()
              .unsubscribe(this, this._handleCollectionChanged),
            e.modelCreated().unsubscribeAll(this);
        }
      }
      function bt(e) {
        (0, dt.trackEvent)('GUI', 'Chart Left Toolbar', e);
      }
      function ft(e) {
        0;
      }
      var Ct = o(90995),
        wt = o(14881);
      const Tt = n.createContext({ hideMode: 'drawings', isActive: !1 });
      function Et(e) {
        const {
            hideMode: t,
            option: { label: o, dataName: i, getBoxedValue: a },
            isSmallTablet: l,
            onClick: r,
          } = e,
          { hideMode: s, isActive: c } = (0, n.useContext)(Tt),
          u = null == a ? void 0 : a();
        return 'all' === t || u
          ? n.createElement(rt.PopupMenuItem, {
              label: o,
              isActive: s === t && c,
              onClick: function () {
                r(t, (0, Ct.toggleHideMode)(t));
              },
              'data-name': i,
              theme: l ? mt : void 0,
            })
          : n.createElement(n.Fragment, null);
      }
      const xt = {
        drawings: {
          active: J.drawingToolsIcons.hideAllDrawingToolsActive,
          inactive: J.drawingToolsIcons.hideAllDrawingTools,
        },
        indicators: {
          active: J.drawingToolsIcons.hideAllIndicatorsActive,
          inactive: J.drawingToolsIcons.hideAllIndicators,
        },
        positions: {
          active: J.drawingToolsIcons.hideAllPositionsToolsActive,
          inactive: J.drawingToolsIcons.hideAllPositionsTools,
        },
        all: {
          active: J.drawingToolsIcons.hideAllDrawingsActive,
          inactive: J.drawingToolsIcons.hideAllDrawings,
        },
      };
      function _t(e) {
        const { isSmallTablet: t } = e,
          [{ isActive: o, hideMode: i }, l] = (0, n.useState)(() => ({
            isActive: !1,
            hideMode: (0, Ct.getSavedHideMode)(),
          }));
        (0, n.useEffect)(
          () => (
            wt.hideStateChange.subscribe(null, l),
            () => {
              wt.hideStateChange.unsubscribe(null, l);
            }
          ),
          []
        );
        const r = b.lineToolsInfo.hideAllDrawings,
          {
            trackLabel: s,
            tooltip: c,
            dataName: u,
          } = (0, a.ensureDefined)((0, Ct.getHideOptions)().get(i)),
          d = xt[i][o ? 'active' : 'inactive'],
          h = o ? c.active : c.inactive;
        return n.createElement(
          Te,
          {
            buttonIcon: d,
            buttonTitle: h,
            buttonHotKey: r.hotKey,
            onClickButton: function () {
              (0, Ct.toggleHideMode)(i), kt(s, !o), St(o ? 'on' : 'off');
            },
            isSmallTablet: t,
            isActive: o,
            checkable: !0,
            'data-name': 'hide-all',
            'data-type': u,
            onArrowClick: function () {
              St('menu');
            },
          },
          n.createElement(
            Tt.Provider,
            { value: { isActive: o, hideMode: i } },
            Array.from((0, Ct.getHideOptions)()).map(([e, o]) =>
              n.createElement(Et, {
                key: e,
                hideMode: e,
                option: o,
                isSmallTablet: t,
                onClick: m,
              })
            )
          )
        );
        function m(e, t) {
          kt(
            (0, a.ensureDefined)((0, Ct.getHideOptions)().get(e)).trackLabel,
            t
          );
        }
      }
      function kt(e, t) {
        (0, dt.trackEvent)(
          'GUI',
          'Chart Left Toolbar',
          `${e} ${t ? 'on' : 'off'}`
        );
      }
      function St(e) {
        0;
      }
      var Ft = o(241),
        Lt = o(51445);
      const At = C.t(null, void 0, o(49616));
      class yt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._instance = null),
            (this._promise = null),
            (this._bindedForceUpdate = () => this.forceUpdate()),
            (this._handleClick = () => {
              null !== this._instance &&
                (this._instance.isVisible()
                  ? (this._instance.hideAndSaveSettingsValue(),
                    this._trackClick(!1))
                  : (this._instance.showAndSaveSettingsValue(),
                    this._trackClick(!0)));
            });
        }
        componentDidMount() {
          const e = (this._promise = (0, a.ensureNotNull)(
            (0, Ft.getFavoriteDrawingToolbarPromise)()
          ));
          e.then((t) => {
            this._promise === e &&
              ((this._instance = t),
              this._instance.canBeShown().subscribe(this._bindedForceUpdate),
              this._instance.visibility().subscribe(this._bindedForceUpdate),
              this.forceUpdate());
          });
        }
        componentWillUnmount() {
          (this._promise = null),
            null !== this._instance &&
              (this._instance.canBeShown().unsubscribe(this._bindedForceUpdate),
              this._instance.visibility().unsubscribe(this._bindedForceUpdate),
              (this._instance = null));
        }
        render() {
          return null !== this._instance && this._instance.canBeShown().value()
            ? n.createElement(D, {
                id: this.props.id,
                icon: Lt,
                isActive: this._instance.isVisible(),
                onClick: this._handleClick,
                title: At,
              })
            : null;
        }
        _trackClick(e) {
          0;
        }
      }
      var Mt = o(77975),
        It = o(36147),
        Nt = o(18540),
        Bt = o(85470);
      const Dt = {
        [It.MagnetMode.WeakMagnet]: {
          id: It.MagnetMode.WeakMagnet,
          name: 'weakMagnet',
          icon: J.drawingToolsIcons.magnet,
          localizedName: C.t(null, void 0, o(45265)),
        },
        [It.MagnetMode.StrongMagnet]: {
          id: It.MagnetMode.StrongMagnet,
          name: 'strongMagnet',
          icon: J.drawingToolsIcons.strongMagnet,
          localizedName: C.t(null, void 0, o(85422)),
        },
      };
      function zt(e) {
        const { isSmallTablet: t } = e,
          o = (0, Mt.useWatchedValueReadonly)({
            watchedValue: (0, Nt.magnetEnabled)(),
          }),
          i = (0, Mt.useWatchedValueReadonly)({
            watchedValue: (0, Nt.magnetMode)(),
          });
        return n.createElement(
          'div',
          { className: Bt.toolButtonMagnet },
          n.createElement(
            Te,
            {
              'data-name': 'magnet-button',
              buttonIcon: Dt[i].icon,
              buttonTitle: b.lineToolsInfo.magnet.localizedName,
              isActive: o,
              onClickButton: function () {
                const e = !o;
                (0, dt.trackEvent)(
                  'GUI',
                  'Chart Left Toolbar',
                  'magnet mode ' + (e ? 'on' : 'off')
                ),
                  !1;
                (0, Nt.setIsMagnetEnabled)(e);
              },
              buttonHotKey: b.lineToolsInfo.magnet.hotKey,
              checkable: !0,
              isSmallTablet: t,
              onArrowClick: function () {
                0;
              },
            },
            Object.values(Dt).map(
              ({ id: e, name: l, localizedName: r, icon: s }) =>
                n.createElement(rt.PopupMenuItem, {
                  key: e,
                  className: t ? Bt.toolButtonMagnet__menuItem : void 0,
                  'data-name': l,
                  icon: s,
                  isActive: o && i === e,
                  label: r,
                  onClick: a,
                  onClickArg: e,
                })
            )
          ),
          !1
        );
        function a(e) {
          void 0 !== e &&
            ((0, dt.trackEvent)(
              'GUI',
              'Magnet mode',
              e === It.MagnetMode.WeakMagnet ? 'Weak' : 'Strong'
            ),
            (0, Nt.setMagnetMode)(e));
        }
      }
      var Rt;
      !(function (e) {
        (e.Screenshot = 'drawing-toolbar-screenshot'),
          (e.FavoriteDrawings = 'drawing-toolbar-favorite-drawings'),
          (e.ObjectTree = 'drawing-toolbar-object-tree');
      })(Rt || (Rt = {}));
      var Wt = o(70412),
        jt = o(21861),
        Pt = o(9438),
        Vt = o(29197),
        Ot = o(54079),
        Ht = o(27334);
      const Ut = Ht,
        Gt = 'http://www.w3.org/2000/svg';
      function Zt(e) {
        const { direction: t, theme: o = Ht } = e;
        return n.createElement(
          'svg',
          {
            xmlns: Gt,
            width: '9',
            height: '27',
            viewBox: '0 0 9 27',
            className: l(o.container, 'right' === t ? o.mirror : null),
            onContextMenu: jt.preventDefault,
          },
          n.createElement(
            'g',
            { fill: 'none', fillRule: 'evenodd' },
            n.createElement('path', {
              className: o.background,
              d: 'M4.5.5a4 4 0 0 1 4 4v18a4 4 0 1 1-8 0v-18a4 4 0 0 1 4-4z',
            }),
            n.createElement('path', {
              className: o.arrow,
              d: 'M5.5 10l-2 3.5 2 3.5',
            })
          )
        );
      }
      var Kt = o(22231);
      const Jt = (0, fe.mergeThemes)(Ut, Kt),
        qt = {
          hide: C.t(null, void 0, o(96411)),
          show: C.t(null, void 0, o(63354)),
        };
      class Yt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._toggleVisibility = () => {
              E.isDrawingToolbarVisible.setValue(
                !E.isDrawingToolbarVisible.value()
              );
            });
        }
        render() {
          const { toolbarVisible: e, 'data-name': t } = this.props;
          return n.createElement(
            'div',
            {
              className: l(
                Jt.toggleButton,
                'apply-common-tooltip common-tooltip-vertical',
                !e && Jt.collapsed
              ),
              onClick: this._toggleVisibility,
              title: e ? qt.hide : qt.show,
              'data-name': t,
              'data-value': e ? 'visible' : 'collapsed',
            },
            n.createElement(Zt, {
              direction: e ? 'left' : 'right',
              theme: e ? void 0 : Jt,
            })
          );
        }
      }
      var $t = o(37558),
        Qt = o(24437),
        Xt = o(90692);
      const eo = { chartWidgetCollection: o(19036).any.isRequired };
      var to = o(5962),
        oo = o(99537);
      const no = u.enabled('right_toolbar'),
        io = u.enabled('keep_object_tree_widget_in_right_toolbar'),
        ao = (0, p.onWidget)(),
        lo = new (v())(),
        ro = dt.trackEvent.bind(null, 'GUI', 'Chart Left Toolbar'),
        so = (e, t) => ro(`${e} ${t ? 'on' : 'off'}`);
      class co extends n.PureComponent {
        constructor(e) {
          var t;
          super(e),
            (this._grayedTools = {}),
            (this._handleMeasureClick = () => {
              uo('measure');
            }),
            (this._handleZoomInClick = () => {
              uo('zoom in');
            }),
            (this._handleDrawingClick = (e) => {
              so('drawing mode', e), uo('drawing mode', e ? 'on' : 'off');
            }),
            (this._handleLockClick = (e) => {
              so('lock all drawing', e), uo('lock', e ? 'on' : 'off');
            }),
            (this._handleSyncClick = (e) => {
              so('sync', e), uo('sync', e ? 'on' : 'off');
            }),
            (this._handleObjectsTreeClick = () => {
              this._activeChartWidget().showObjectsTreeDialog(),
                uo('object tree');
            }),
            (this._handleMouseOver = (e) => {
              (0, Wt.hoverMouseEventFilter)(e) &&
                this.setState({ isHovered: !0 });
            }),
            (this._handleMouseOut = (e) => {
              (0, Wt.hoverMouseEventFilter)(e) &&
                this.setState({ isHovered: !1 });
            }),
            (this._handleChangeVisibility = (e) => {
              this.setState({ isVisible: e });
            }),
            (this._handleEsc = () => {
              d.resetToCursor(!0);
            }),
            (this._handleWidgetbarSettled = (e) => {
              var t;
              this.setState({
                isWidgetbarVisible: Boolean(
                  null === (t = window.widgetbar) || void 0 === t
                    ? void 0
                    : t.visible().value()
                ),
                widgetbarSettled: e,
              });
            }),
            (this._handleWidgetbarVisible = (e) => {
              this.setState({ isWidgetbarVisible: e });
            }),
            d.init(),
            (this._toolsFilter = new f(this.props.drawingsAccess)),
            (this._filteredLineTools = T.map((e) => ({
              id: e.id,
              title: e.title,
              items: e.items.filter((e) =>
                this._toolsFilter.isToolEnabled(
                  b.lineToolsInfo[e.name].localizedName
                )
              ),
              trackLabel: e.trackLabel,
            })).filter((e) => 0 !== e.items.length)),
            this._filteredLineTools.forEach((e) =>
              e.items.forEach((e) => {
                this._grayedTools[e.name] = this._toolsFilter.isToolGrayed(
                  b.lineToolsInfo[e.name].localizedName
                );
              })
            ),
            (this.state = {
              isHovered: !1,
              isVisible: E.isDrawingToolbarVisible.value(),
              isWidgetbarVisible: Boolean(
                null === (t = window.widgetbar) || void 0 === t
                  ? void 0
                  : t.visible().value()
              ),
              widgetbarSettled: void 0 !== window.widgetbar,
            }),
            (this._features = {
              favoriting: !ao && u.enabled('items_favoriting'),
              multicharts: u.enabled('support_multicharts'),
              tools: !ao || u.enabled('charting_library_base'),
            }),
            (this._registry = {
              chartWidgetCollection: this.props.chartWidgetCollection,
            }),
            this._negotiateResizer();
        }
        componentDidMount() {
          var e;
          E.isDrawingToolbarVisible.subscribe(this._handleChangeVisibility),
            M.globalCloseDelegate.subscribe(this, this._handleGlobalClose),
            (this._tool = d.tool.spawn()),
            this._tool.subscribe(this._updateHotkeys.bind(this)),
            this._initHotkeys(),
            this.props.widgetbarSettled &&
              (this.props.widgetbarSettled.subscribe(
                this,
                this._handleWidgetbarSettled
              ),
              p.CheckMobile.any() &&
                (null === (e = window.widgetbar) ||
                  void 0 === e ||
                  e.visible().subscribe(this._handleWidgetbarVisible)));
        }
        componentWillUnmount() {
          var e;
          null === (e = window.widgetbar) ||
            void 0 === e ||
            e.visible().unsubscribe(this._handleWidgetbarVisible),
            E.isDrawingToolbarVisible.unsubscribe(this._handleChangeVisibility),
            M.globalCloseDelegate.unsubscribe(this, this._handleGlobalClose),
            this._tool.destroy(),
            this._hotkeys.destroy();
        }
        componentDidUpdate(e, t) {
          var o;
          const { isVisible: n, widgetbarSettled: i } = this.state;
          n !== t.isVisible &&
            (h.emit('toggle_sidebar', !n),
            c.setValue('ChartDrawingToolbarWidget.visible', n),
            this._negotiateResizer()),
            t.widgetbarSettled !== i &&
              i &&
              p.CheckMobile.any() &&
              (null === (o = window.widgetbar) ||
                void 0 === o ||
                o.visible().subscribe(this._handleWidgetbarVisible));
        }
        render() {
          const {
              bgColor: e,
              chartWidgetCollection: t,
              readOnly: o,
            } = this.props,
            { isHovered: i, isVisible: a } = this.state,
            r = { backgroundColor: e && `#${e}` };
          let c;
          c = n.createElement(Yt, {
            toolbarVisible: a,
            'data-name': 'toolbar-drawing-toggle-button',
          });
          const h = () =>
            !!this._features.tools &&
            !(!u.enabled('show_object_tree') || (io && !no));
          return n.createElement(
            to.RegistryProvider,
            { validation: eo, value: this._registry },
            n.createElement(
              Vt.CloseDelegateContext.Provider,
              { value: lo },
              n.createElement(
                $t.DrawerManager,
                null,
                n.createElement(
                  Xt.MatchMedia,
                  { rule: Qt.DialogBreakpoints.TabletSmall },
                  (e) =>
                    n.createElement(
                      Ot.Toolbar,
                      {
                        id: 'drawing-toolbar',
                        className: l(oo.drawingToolbar, { [oo.isHidden]: !a }),
                        style: r,
                        onClick: this.props.onClick,
                        onContextMenu: jt.preventDefaultForContextMenu,
                        orientation: 'vertical',
                      },
                      n.createElement(
                        A,
                        {
                          onScroll: this._handleGlobalClose,
                          isVisibleFade: s.mobiletouch,
                          isVisibleButtons: !s.mobiletouch && i,
                          isVisibleScrollbar: !1,
                          onMouseOver: this._handleMouseOver,
                          onMouseOut: this._handleMouseOut,
                        },
                        n.createElement(
                          'div',
                          { className: oo.inner },
                          !o &&
                            n.createElement(
                              'div',
                              { className: oo.group, style: r },
                              this._filteredLineTools.map((o, i) =>
                                n.createElement(ut, {
                                  'data-name': o.id,
                                  chartWidgetCollection: t,
                                  favoriting:
                                    this._features.favoriting &&
                                    !(
                                      'linetool-group-cursors' === o.id &&
                                      (0, g.isOnMobileAppPage)('any')
                                    ),
                                  grayedTools: this._grayedTools,
                                  key: i,
                                  dropdownTooltip: o.title,
                                  lineTools: o.items,
                                  isSmallTablet: e,
                                  trackLabel: o.trackLabel,
                                })
                              ),
                              this._toolsFilter.isToolEnabled('Font Icons') &&
                                n.createElement(et, {
                                  'data-name': 'linetool-group-font-icons',
                                  isGrayed: this._grayedTools['Font Icons'],
                                  isSmallTablet: e,
                                })
                            ),
                          !o &&
                            n.createElement(
                              'div',
                              { className: oo.group, style: r },
                              n.createElement(nt, {
                                toolName: 'measure',
                                onClick: this._handleMeasureClick,
                              }),
                              n.createElement(nt, {
                                toolName: 'zoom',
                                onClick: this._handleZoomInClick,
                              }),
                              n.createElement(it, { chartWidgetCollection: t })
                            ),
                          !o &&
                            n.createElement(
                              'div',
                              { className: oo.group, style: r },
                              n.createElement(zt, { isSmallTablet: e }),
                              this._features.tools &&
                                n.createElement(ot, {
                                  property: d.properties().childs()
                                    .stayInDrawingMode,
                                  saveDefaultOnChange: !0,
                                  toolName: 'drawginmode',
                                  onClick: this._handleDrawingClick,
                                }),
                              this._features.tools &&
                                n.createElement(ot, {
                                  property: d.lockDrawings(),
                                  toolName: 'lockAllDrawings',
                                  onClick: this._handleLockClick,
                                }),
                              this._features.tools &&
                                n.createElement(_t, { isSmallTablet: e }),
                              !1
                            ),
                          !o &&
                            this._features.tools &&
                            n.createElement(
                              'div',
                              { className: oo.group, style: r },
                              n.createElement(gt, {
                                chartWidgetCollection: t,
                                isSmallTablet: e,
                                toolName: 'removeAllDrawingTools',
                              })
                            ),
                          n.createElement('div', {
                            className: oo.fill,
                            style: r,
                          }),
                          !o &&
                            (this._features.tools || !1) &&
                            n.createElement(
                              'div',
                              {
                                className: l(oo.group, oo.lastGroup),
                                style: r,
                              },
                              !1,
                              this._features.tools &&
                                this._features.favoriting &&
                                n.createElement(yt, {
                                  id: Rt.FavoriteDrawings,
                                }),
                              h() &&
                                n.createElement(z, {
                                  id: Rt.ObjectTree,
                                  action: this._handleObjectsTreeClick,
                                  toolName: 'showObjectsTree',
                                })
                            )
                        )
                      )
                    )
                ),
                c
              )
            )
          );
        }
        _activeChartWidget() {
          return this.props.chartWidgetCollection.activeChartWidget.value();
        }
        _negotiateResizer() {
          const e = Pt.TOOLBAR_WIDTH_COLLAPSED;
          this.props.resizerBridge.negotiateWidth(
            this.state.isVisible ? Pt.TOOLBAR_WIDTH_EXPANDED : e
          );
        }
        _handleGlobalClose() {
          lo.fire();
        }
        _updateHotkeys() {
          this._hotkeys.promote();
        }
        _initHotkeys() {
          (this._hotkeys = y.createGroup({ desc: 'Drawing Toolbar' })),
            this._hotkeys.add({
              desc: 'Reset',
              hotkey: 27,
              handler: () => this._handleEsc(),
              isDisabled: () => d.toolIsCursor(d.tool.value()),
            });
        }
      }
      function uo(e, t) {
        0;
      }
      class ho {
        constructor(e, t) {
          (this._component = null),
            (this._handleRef = (e) => {
              this._component = e;
            }),
            (this._container = e),
            i.render(
              n.createElement(co, { ...t, ref: this._handleRef }),
              this._container
            );
        }
        destroy() {
          i.unmountComponentAtNode(this._container);
        }
        getComponent() {
          return (0, a.ensureNotNull)(this._component);
        }
      }
    },
    5962: (e, t, o) => {
      'use strict';
      o.d(t, {
        RegistryProvider: () => s,
        registryContextType: () => c,
        validateRegistry: () => r,
      });
      var n = o(50959),
        i = o(19036),
        a = o.n(i);
      const l = n.createContext({});
      function r(e, t) {
        a().checkPropTypes(t, e, 'context', 'RegistryContext');
      }
      function s(e) {
        const { validation: t, value: o } = e;
        return r(o, t), n.createElement(l.Provider, { value: o }, e.children);
      }
      function c() {
        return l;
      }
    },
    61380: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" width="20" height="10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M2 1l8 8 8-8"/></svg>';
    },
    51445: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.103.687a1 1 0 0 1 1.794 0l2.374 4.81 5.309.772a1 1 0 0 1 .554 1.706l-3.841 3.745.906 5.287a1 1 0 0 1-1.45 1.054L10 15.565 5.252 18.06A1 1 0 0 1 3.8 17.007l.907-5.287L.866 7.975a1 1 0 0 1 .554-1.706l5.31-.771L9.102.688zM10 1.13L7.393 6.412l-5.829.847 4.218 4.111-.996 5.806L10 14.436l5.214 2.74-.996-5.805 4.218-4.112-5.83-.847L10 1.13z"/></svg>';
    },
    51609: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.31 14.5a1.07 1.07 0 0 1 0-1.5L13 4.3c.42-.41 1.1-.41 1.52 0l.99 1c.42.42.41 1.11-.02 1.53l-5.38 5.12h12.83c.6 0 1.07.48 1.07 1.07v1.43c0 .6-.48 1.07-1.07 1.07H10.1l5.38 5.13c.44.41.45 1.1.02 1.53l-1 .99c-.41.42-1.1.42-1.5 0L4.3 14.5Zm7.97 9.38-8.67-8.67c-.81-.8-.82-2.12 0-2.93l8.68-8.67c.8-.81 2.12-.82 2.92 0l1 .99c.82.82.8 2.16-.04 2.96l-3.57 3.4h10.33c1.14 0 2.07.93 2.07 2.07v1.43c0 1.15-.93 2.07-2.07 2.07H12.6l3.57 3.4c.84.8.86 2.14.03 2.97l-.99.99c-.8.8-2.12.8-2.93 0Z"/></svg>';
    },
    22976: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M4.87 4.52a.5.5 0 0 1 .61.35L6.91 10h5.47l1.03-4.67c.14-.63 1.04-.63 1.18 0L15.62 10h5.47l1.43-5.13a.5.5 0 0 1 .96.26L22.13 10H25a.5.5 0 0 1 0 1h-3.15l-.83 3H25a.5.5 0 0 1 0 1h-4.26l-2.15 7.75c-.17.6-1.03.58-1.16-.03L15.7 15h-3.42l-1.72 7.72c-.13.6-1 .63-1.16.03L7.26 15H3a.5.5 0 1 1 0-1h3.98l-.83-3H3a.5.5 0 1 1 0-1h2.87L4.52 5.13a.5.5 0 0 1 .35-.61ZM7.19 11l.83 3h3.47l.66-3H7.2Zm5.99 0-.67 3h2.98l-.67-3h-1.64Zm1.42-1L14 7.3l-.6 2.7h1.2Zm1.25 1 .66 3h3.47l.83-3h-4.96Zm3.85 4h-2.97l1.32 5.94L19.7 15Zm-8.43 0H8.3l1.65 5.94L11.27 15Z"/></svg>';
    },
    70616: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 24v-5.5m0 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v-6m-14 6v-6m0 0v-6s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v6m-14 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1"/></svg>';
    },
    48748: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M14.08 3.73c.1.16.1.37 0 .54a9.4 9.4 0 0 0 3.35 13.26 9.9 9.9 0 0 0 6.49 1.18.5.5 0 0 1 .5.76 10.67 10.67 0 0 1-3.83 3.64 10.91 10.91 0 0 1-14.28-3.3A10.44 10.44 0 0 1 8.69 5.56a10.86 10.86 0 0 1 4.9-2.06.5.5 0 0 1 .49.22Zm8.3 15.61v.5c-1.91 0-3.8-.5-5.45-1.44a10.64 10.64 0 0 1-3.95-3.97 10.4 10.4 0 0 1-.3-9.72 9.6 9.6 0 0 0-6.37 5.39 9.39 9.39 0 0 0 .83 9.14 9.7 9.7 0 0 0 3.6 3.17 9.92 9.92 0 0 0 12.21-2.59c-.19.02-.38.02-.57.02v-.5Z"/></svg>';
    },
    18042: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M6 11.69C6 7.46 9.56 4 14 4c4.44 0 8 3.46 8 7.69 0 2.63-1.2 4.93-3.25 6.31H14.5v-5H18v-1h-8v1h3.5v5H9.14A8.06 8.06 0 0 1 6 11.69Zm2 6.67a9.1 9.1 0 0 1-3-6.67C5 6.87 9.05 3 14 3s9 3.87 9 8.69a8.51 8.51 0 0 1-3 6.62V22h-2v3h-8v-3H8v-3.64ZM11 22v2h6v-2h-6Zm-2-1v-2h10v2H9Z"/></svg>';
    },
    44986: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5ZM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5ZM14 16V9h1v6h4v1h-5Z"/></svg>';
    },
    83778: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5ZM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5ZM12 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm4 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm-6 4-.43.26v.01l.03.03a3.55 3.55 0 0 0 .3.4 5.7 5.7 0 0 0 9.22 0 5.42 5.42 0 0 0 .28-.4l.02-.03v-.01L19 17l-.43-.26v.02a2.45 2.45 0 0 1-.24.32c-.17.21-.43.5-.78.79a4.71 4.71 0 0 1-6.88-.8 4.32 4.32 0 0 1-.23-.31l-.01-.02L10 17Z"/></svg>';
    },
    90624: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112" width="28" height="28"><path fill="#fff" d="M63.42 93.22a37.13 37.13 0 1 0 .01-74.27 37.13 37.13 0 0 0-.01 74.27Z"/><path fill="#fff" d="M45.48 48.85c-.71.04-1.96 0-3.17.2-2.36.41-4.72.85-7.03 1.51a30.65 30.65 0 0 0-4.87 2.02c-1.9.9-3.74 1.93-5.59 2.94-.66.36-.71.86-.16 1.39.53.53 1.1 1.01 1.7 1.44 2.43 1.63 4.91 3.15 7.3 4.85 2.77 1.95 5.86 3.03 8.95 4.03 3.5 1.14 7.15.85 10.72.38 4.05-.54 8.1-1.3 11.9-2.96 2.17-.95 4.21-2.22 6.27-3.44.88-.5.86-.86.08-1.5-1.59-1.28-3.16-2.6-4.82-3.78-3.73-2.66-7.65-4.85-12.05-6a29.47 29.47 0 0 0-9.23-1.08Zm6.56-21.95v8.8c0 1.1-.02 2.18-.03 3.27 0 .86.33 1.39 1.14 1.47.38.04.77.06 1.16.11 2.8.35 3.14.13 3.99-2.86.77-2.7 1.47-5.44 2.22-8.15.31-1.12.5-1.18 1.5-.79 1.98.78 3.95 1.58 5.94 2.32.77.29 1.03.6.7 1.56-.98 2.94-1.86 5.92-2.77 8.89-.09.28-.15.57-.21.86-.42 2.02-.37 2.12 1.37 2.8.25.1.5.21.74.34.51.3.91.26 1.38-.19 2.34-2.22 4.75-4.34 7.05-6.6.74-.73 1.57-.62 2.16-.04A83.06 83.06 0 0 1 82 42.52c.64.73.6 1.52-.04 2.3a273.4 273.4 0 0 1-4.69 5.62c-.46.53-.44.98-.02 1.44 1.46 1.55 2.93 3.1 4.4 4.63 1.1 1.13 2.21 2.24 3.3 3.37 1.05 1.07 1.12 1.67.06 2.77-1.44 1.5-2.86 3.08-4.51 4.23a87.09 87.09 0 0 1-10 6.28 32.38 32.38 0 0 1-12.28 3.5c-4.54.36-9.07.43-13.57-.15a59.04 59.04 0 0 1-9.69-2.07 38.4 38.4 0 0 1-8.35-3.83 51.59 51.59 0 0 1-5.8-4.13 73.78 73.78 0 0 1-6.18-5.38c-1.29-1.3-2.33-2.9-3.38-4.46-.58-.84-.06-1.55.59-2.1 1.14-.96 2.32-1.9 3.42-2.9.72-.65.95-.96 1.62-1.67.5-.53.43-1.02-.07-1.51-1.3-1.3-1.52-1.76-2.83-3.07-.6-.59-.74-1.1-.07-1.79 1.66-1.72 4.35-4.22 5.97-5.98.8-.86.9-.82 1.7.12 1.6 1.9 2.12 2.97 3.78 4.83.87.98 1.19 1.55 2.5 1.04 2.37-.95 1.76-.7 1.05-3.35-.64-2.37-1-2.96-1.72-5.3-.08-.26-.17-.5-.23-.75-.33-1.2-.3-1.33.8-1.7 2.06-.68 5.56-1.72 7.62-2.4.8-.27 1.16.18 1.39.93.73 2.55 1.01 3.38 1.77 5.92.2.72.48 1.41.84 2.05.7 1.18 1.13 1.4 2.27 1.36 1.96-.07 2.24-.3 2.24-2.45 0-3.1-.06-6.21-.14-9.32-.04-1.53-.07-1.62 1.34-1.66 2.3-.06 4.61-.02 6.96-.02"/><path fill="#2962FF" d="M63.42 90.92a34.26 34.26 0 1 0 .01-68.52 34.26 34.26 0 0 0-.01 68.52Z"/><path fill="#FF5200" d="M45.69 49.83c-.67.03-1.83 0-2.95.17-2.2.35-4.4.72-6.54 1.28-1.56.4-3.06 1.05-4.53 1.7-1.76.77-3.47 1.64-5.2 2.49-.6.3-.66.73-.15 1.17.5.45 1.03.86 1.59 1.22 2.26 1.37 4.56 2.66 6.79 4.1 2.57 1.64 5.45 2.55 8.31 3.4 3.26.96 6.65.72 9.98.32 3.76-.46 7.52-1.1 11.06-2.5 2.01-.8 3.92-1.88 5.82-2.9.82-.44.8-.74.08-1.27-1.48-1.09-2.94-2.2-4.48-3.2-3.47-2.25-7.11-4.1-11.2-5.06a30.03 30.03 0 0 0-8.59-.91v-.01Zm6.09-18.54v7.44l-.02 2.76c0 .72.3 1.17 1.05 1.24.36.03.73.05 1.08.1 2.6.29 2.92.1 3.71-2.43.72-2.28 1.37-4.59 2.07-6.88.29-.94.45-1 1.4-.66 1.84.66 3.66 1.33 5.52 1.95.7.25.95.52.64 1.32-.9 2.48-1.72 5-2.57 7.5-.08.25-.14.5-.2.74-.38 1.7-.34 1.79 1.28 2.37.23.08.47.17.7.28.47.26.84.22 1.27-.16 2.18-1.87 4.42-3.67 6.56-5.58.69-.61 1.46-.52 2-.03a73.41 73.41 0 0 1 3.37 3.24c.6.6.56 1.28-.03 1.94-1.44 1.6-2.89 3.18-4.37 4.74-.43.46-.4.83-.01 1.22a340.4 340.4 0 0 0 4.1 3.91c1 .96 2.04 1.9 3.06 2.85.97.9 1.03 1.41.05 2.34-1.34 1.26-2.66 2.6-4.2 3.57a82.59 82.59 0 0 1-9.29 5.3 32.44 32.44 0 0 1-11.42 2.97c-4.22.3-8.43.36-12.62-.13a59.71 59.71 0 0 1-9-1.75c-2.76-.77-5.3-1.91-7.77-3.24a48.2 48.2 0 0 1-5.39-3.49c-2-1.4-3.92-2.92-5.75-4.54-1.2-1.09-2.17-2.45-3.15-3.76-.53-.72-.05-1.31.55-1.78 1.06-.82 2.16-1.6 3.18-2.45.67-.55 1.27-1.17 1.9-1.77.46-.45.4-.86-.07-1.28l-3.64-3.32c-.55-.5-.68-.93-.05-1.51 1.53-1.46 3.01-2.98 4.52-4.46.74-.72.84-.7 1.58.1 1.5 1.61 2.98 3.24 4.51 4.8.82.84 1.75 1.09 2.96.65 2.21-.8 2.3-.73 1.63-2.97-.6-2-1.32-3.96-2-5.93-.07-.22-.16-.42-.21-.63-.3-1.02-.28-1.12.74-1.43 1.92-.59 3.85-1.11 5.77-1.69.75-.23 1.08.15 1.3.78.67 2.16 1.33 4.32 2.04 6.46.18.61.44 1.2.78 1.74.66 1 1.72.98 2.78.94 1.83-.06 2.09-.25 2.09-2.07 0-2.62-.06-5.25-.13-7.87-.04-1.3-.07-1.37 1.24-1.4 2.14-.06 4.29-.02 6.47-.02"/><path fill="#FDD600" d="m53.5 54.08.15-.32c-.5-.49-.91-1.15-1.5-1.44a9.83 9.83 0 0 0-6.84-.8c-1.95.5-3.23 1.92-4.14 3.57-.98 1.8-1.33 3.8-.09 5.64.54.8 1.38 1.44 2.16 2.04a6.98 6.98 0 0 0 10.61-2.68c.4-.87.27-1.18-.66-1.48-.98-.31-1.98-.59-2.96-.9-.65-.22-1.31-.44-1.31-1.3 0-.82.53-1.15 1.24-1.35 1.12-.3 2.23-.65 3.34-.97Zm-7.81-4.25c3.23-.15 5.9.29 8.58.92 4.08.96 7.73 2.8 11.21 5.06 1.54.99 3 2.1 4.48 3.2.72.53.74.82-.08 1.26-1.91 1.03-3.82 2.1-5.82 2.9-3.54 1.4-7.3 2.04-11.07 2.5-3.32.4-6.72.65-9.97-.31-2.87-.85-5.74-1.76-8.32-3.41-2.22-1.43-4.52-2.72-6.78-4.1a12 12 0 0 1-1.6-1.21c-.5-.45-.45-.86.17-1.18 1.72-.86 3.43-1.72 5.19-2.48 1.48-.65 2.97-1.3 4.52-1.7 2.16-.56 4.35-.93 6.55-1.28 1.12-.18 2.28-.14 2.94-.18"/><path fill="#1D1D1B" d="M53.5 54.08c-1.11.33-2.22.67-3.34.98-.71.19-1.24.52-1.24 1.34 0 .86.67 1.1 1.3 1.3.99.32 1.99.6 2.97.9.93.3 1.05.61.66 1.49a6.98 6.98 0 0 1-10.62 2.68 9.18 9.18 0 0 1-2.16-2.04c-1.24-1.85-.9-3.85.1-5.65.9-1.65 2.18-3.07 4.13-3.57a9.84 9.84 0 0 1 6.84.8c.6.3 1.01.95 1.5 1.44l-.15.33"/></svg>';
    },
    92177: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M13.98 6.02L14.5 6c2.18 0 4.16.8 5.66 2.14l-5.66 5.65-2.31-2.3a8.43 8.43 0 0 0 1.55-3.64 14.01 14.01 0 0 0 .24-1.83zm-1.01.12a8.45 8.45 0 0 0-4.13 2l2.64 2.63a7.59 7.59 0 0 0 1.28-3.12c.12-.59.18-1.12.2-1.51zm-4.83 2.7a8.45 8.45 0 0 0-2 4.13c.39-.03.92-.1 1.51-.21a7.59 7.59 0 0 0 3.12-1.28L8.14 8.84zm-2.12 5.14a8.48 8.48 0 0 0 2.12 6.18l5.65-5.66-2.3-2.31a8.43 8.43 0 0 1-3.64 1.55 14.03 14.03 0 0 1-1.83.24zm2.82 6.88a8.46 8.46 0 0 0 5.13 2.12v-.07A8.95 8.95 0 0 1 16.3 17l-1.8-1.8-5.66 5.65zM14.97 23c2-.1 3.8-.9 5.19-2.13L17 17.72a7.94 7.94 0 0 0-2.04 5.27zm5.9-2.83a8.46 8.46 0 0 0 2.11-5.13h-.02a10.62 10.62 0 0 0-5.2 2l3.1 3.13zm2.12-6.13c-.1-2-.9-3.8-2.13-5.19l-5.65 5.66 1.83 1.83a11.6 11.6 0 0 1 5.95-2.3zM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5z"/></svg>';
    },
    68796: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M4.54 3.2l.78-.59 5.49 4.5 1.43 1.07a5.28 5.28 0 0 1 2.19-2.3 9.19 9.19 0 0 1 1.88-.85h.04l.01-.01.14.48.42-.28v.01l.01.02a3.14 3.14 0 0 1 .16.26l.37.72c.2.45.4 1.02.5 1.64a2.13 2.13 0 0 1 1.89.46l.18.16.03.02.18.16c.22.16.42.27.81.25a5.9 5.9 0 0 0 2.2-.86l.66-.36.09.75a5.98 5.98 0 0 1-1.7 5.1 6.87 6.87 0 0 1-1.7 1.23 19.97 19.97 0 0 1 .48 2.48c.25 1.73.42 4.08.06 6.5A1.46 1.46 0 0 1 19.68 25h-7.71a1.5 1.5 0 0 1-1.4-2.06l1-2.47c-.18.02-.37.03-.58.03a3 3 0 0 1-1.53-.4 6.84 6.84 0 0 1-1.6.64c-1.08.27-2.55.29-3.72-.89a4.06 4.06 0 0 1-.96-3 5.1 5.1 0 0 1 2-3.74 98.5 98.5 0 0 0 2.7-2.24L4.55 3.2zM16.5 5.5l-.14-.48.35-.1.2.3-.41.28zm-7.87 6.06a57.48 57.48 0 0 1-2.19 1.82l.49.26c.65.37 1.48.9 1.97 1.56a5.78 5.78 0 0 1 1.14 4.07l.06.03c.19.1.49.2.9.2.68 0 .95-.11 1.03-.16v-.03l.97.19h-.5.5v.03a.75.75 0 0 1-.01.1.74.74 0 0 1-.09.21l-1.39 3.47a.5.5 0 0 0 .47.69h7.71c.24 0 .43-.17.47-.38a22 22 0 0 0-.06-6.22 24.4 24.4 0 0 0-.56-2.71 11.35 11.35 0 0 0-.94-1.52 7.1 7.1 0 0 0-2.31-2.22l-.62-.31.49-.5A3.03 3.03 0 0 0 17 8.6a1.2 1.2 0 0 0 .01-.1c0-.65-.22-1.33-.46-1.86-.1-.21-.18-.4-.26-.54a8.07 8.07 0 0 0-1.34.64c-.9.54-1.74 1.32-1.95 2.36v.03l-.02.03L12.5 9l.47.16v.02a2.97 2.97 0 0 1-.1.26 5.9 5.9 0 0 1-.31.62c-.27.46-.7 1.07-1.34 1.39-.63.31-1.38.3-1.9.23a5.83 5.83 0 0 1-.7-.12zm3.26-2.39L10.2 7.9l-.02-.01L6.3 4.7l2.57 5.88h.01c.14.04.34.08.57.11.47.06.97.05 1.34-.14.36-.18.68-.57.91-.99.08-.14.15-.27.2-.39zm8.32 4.68a5.47 5.47 0 0 0 1.37-1.02 4.88 4.88 0 0 0 1.46-3.53c-.8.39-1.41.58-1.92.61-.7.05-1.14-.18-1.49-.45a5.6 5.6 0 0 1-.22-.19l-.03-.03-.17-.13a1.4 1.4 0 0 0-.33-.22c-.18-.07-.44-.12-.93 0l-.1.4c-.1.3-.28.69-.58 1.09.87.59 1.6 1.46 2.14 2.2a14.92 14.92 0 0 1 .8 1.27zM9.05 19.19v-.09a4.78 4.78 0 0 0-.96-3.3 5.56 5.56 0 0 0-1.65-1.29c-.3-.17-.6-.3-.8-.4l-.05-.03a4.05 4.05 0 0 0-1.4 2.82 3.1 3.1 0 0 0 .66 2.25c.83.82 1.86.84 2.78.62a5.71 5.71 0 0 0 1.42-.58zm4.26-5.87c-.3.24-.74.54-1.18.66-.37.1-.81.1-1.12.08a6.95 6.95 0 0 1-.54-.06h-.05l.08-.5.08-.5.03.01a5.02 5.02 0 0 0 1.26 0c.24-.06.54-.25.83-.47a6.1 6.1 0 0 0 .42-.37l.02-.02.36.35.35.36h-.01l-.03.04a6.09 6.09 0 0 1-.5.42zM6 17h1v-1H6v1z"/></svg>';
    },
    93826: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 24v-5.5m0 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v-6m-14 6v-6m0 0v-6s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1v6m-14 0s2.7-1.1 4.5-1c2.1.12 2.9 1.88 5 2 1.8.1 4.5-1 4.5-1"/></svg>';
    },
    5474: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M12.5 8h1.36l-.85-3.38.98-.24.9 3.62h7.64a1.34 1.34 0 0 1 .2.02c.13.02.31.07.5.16.18.09.38.24.53.46.15.24.24.52.24.86 0 .34-.09.62-.24.86a1.38 1.38 0 0 1-.79.56L22 24.54l-.03.46H6.5c-1 0-1.64-.68-1.99-1.23a4.4 4.4 0 0 1-.38-.78l-.01-.04c-.1-.03-.22-.07-.34-.13a1.36 1.36 0 0 1-.54-.46A1.51 1.51 0 0 1 3 21.5c0-.34.09-.62.24-.86.15-.22.35-.37.54-.46.1-.05.2-.09.28-.11a6.6 6.6 0 0 1 .96-2.34C5.92 16.35 7.56 15 10.5 15c.72 0 1.36.08 1.93.22l-.4-4.3a1.38 1.38 0 0 1-.8-.57A1.51 1.51 0 0 1 11 9.5c0-.34.09-.62.24-.86.15-.22.35-.37.54-.46a1.73 1.73 0 0 1 .7-.18h.02v.5V8zm.96 7.57a5.73 5.73 0 0 1 2.52 2.16 6.86 6.86 0 0 1 .95 2.34 1.38 1.38 0 0 1 .82.58c.16.23.25.51.25.85 0 .34-.09.62-.24.86-.15.22-.35.37-.54.46-.12.06-.24.1-.34.13l-.01.04a4.4 4.4 0 0 1-.54 1.01h4.7l.93-13h-8.91l.41 4.57zM14.5 9h8a.73.73 0 0 1 .28.07c.06.04.11.08.15.13.03.05.07.14.07.3 0 .16-.04.25-.07.3a.38.38 0 0 1-.15.13.73.73 0 0 1-.27.07H12.5a.73.73 0 0 1-.28-.07.38.38 0 0 1-.15-.13.52.52 0 0 1-.07-.3c0-.16.04-.25.07-.3.04-.05.09-.1.15-.13A.73.73 0 0 1 12.5 9h2.01zm1.4 11a5.8 5.8 0 0 0-.76-1.73C14.41 17.15 13.06 16 10.5 16c-2.56 0-3.91 1.15-4.64 2.27A5.86 5.86 0 0 0 5.1 20h10.78zM4.5 21a.72.72 0 0 0-.28.07.38.38 0 0 0-.15.13.52.52 0 0 0-.07.3c0 .16.04.25.07.3.04.05.09.1.15.13a.73.73 0 0 0 .27.07H16.5a.72.72 0 0 0 .28-.07.38.38 0 0 0 .15-.13.52.52 0 0 0 .07-.3.52.52 0 0 0-.07-.3.38.38 0 0 0-.15-.13.73.73 0 0 0-.27-.07H4.5zm.73 2l.13.23c.28.45.65.77 1.14.77h8c.5 0 .86-.32 1.14-.77.05-.07.1-.15.13-.23H5.23zM11 17v1h-1v-1h1zm-3 1h1v1H8v-1zm4 1v-1h1v1h-1z"/></svg>';
    },
    86209: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M9.5 21H9h.5zm8 0H17h.5zm-6-10H11v1h.5v-1zm4 1h.5v-1h-.5v1zm2 7.5h.5-.5zm.29-1.59A7.97 7.97 0 0 0 21 11.5h-1a6.97 6.97 0 0 1-2.79 5.59l.58.82zM21 11.5A7.5 7.5 0 0 0 13.5 4v1a6.5 6.5 0 0 1 6.5 6.5h1zM13.5 4A7.5 7.5 0 0 0 6 11.5h1A6.5 6.5 0 0 1 13.5 5V4zM6 11.5a7.98 7.98 0 0 0 3.21 6.41l.57-.82A6.98 6.98 0 0 1 7 11.5H6zM9 21a1 1 0 0 0 1 1v-1H9zm8 1a1 1 0 0 0 1-1h-1v1zm-6-.5V23h1v-1.5h-1zm0 1.5a1 1 0 0 0 1 1v-1h-1zm1 1h3v-1h-3v1zm3 0a1 1 0 0 0 1-1h-1v1zm1-1v-1.5h-1V23h1zm-3-11.5v6h1v-6h-1zM9.5 20h8v-1h-8v1zM9 17.5v2h1v-2H9zm0 2V21h1v-1.5H9zm9 1.5v-1.5h-1V21h1zm0-1.5v-2h-1v2h1zM9.5 18h4v-1h-4v1zm4 0h4v-1h-4v1zm-2-6h2v-1h-2v1zm2 0h2v-1h-2v1zM10 22h1.5v-1H10v1zm1.5 0h4v-1h-4v1zm4 0H17v-1h-1.5v1z"/></svg>';
    },
    37603: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5zM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5zM14 16V9h1v6h4v1h-5z"/></svg>';
    },
    32386: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M6 14.5C6 9.78 9.78 6 14.5 6c4.72 0 8.5 3.78 8.5 8.5 0 4.72-3.78 8.5-8.5 8.5A8.46 8.46 0 0 1 6 14.5zM14.5 5A9.46 9.46 0 0 0 5 14.5c0 5.28 4.22 9.5 9.5 9.5s9.5-4.22 9.5-9.5S19.78 5 14.5 5zM12 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-6 4l-.43.26v.01l.03.03a3.55 3.55 0 0 0 .3.4 5.7 5.7 0 0 0 9.22 0 5.42 5.42 0 0 0 .28-.4l.02-.03v-.01L19 17l-.43-.26v.02a2.45 2.45 0 0 1-.24.32c-.17.21-.43.5-.78.79a4.71 4.71 0 0 1-6.88-.8 4.32 4.32 0 0 1-.23-.31l-.01-.02L10 17z"/></svg>';
    },
    14082: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5.6 15.43A6.19 6.19 0 0 1 14 6.36a6.19 6.19 0 0 1 8.4 9.08l-.03.02-7.3 7.31a1.5 1.5 0 0 1-2.13 0l-7.3-7.3-.03-.03m.71-.7v-.01a5.19 5.19 0 0 1 7.33-7.34v.01c.2.2.51.19.7 0a5.19 5.19 0 0 1 7.34 7.33l-.03.02-7.3 7.31a.5.5 0 0 1-.71 0l-7.3-7.3-.03-.02z"/></svg>';
    },
    83137: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M22.87 6.44c.09-.78-.53-1.4-1.3-1.31-1.43.15-3.43.48-5.42 1.2a11.8 11.8 0 0 0-5.23 3.44L9.86 11.9l6.24 6.24 2.13-1.06a11.8 11.8 0 0 0 3.44-5.23c.72-1.99 1.05-4 1.2-5.41zm-4.93 11.9l-1.72.86-.04.02h-.04l-2.2.67v.01a19.68 19.68 0 0 0-.13 3.33c.01.14.08.22.17.26.08.04.2.05.32-.03a18.83 18.83 0 0 0 2.79-2.26 8.18 8.18 0 0 0 .44-1.1c.16-.51.33-1.12.41-1.76zm-.44 3.16l.35.35-.01.02-.05.05a16.85 16.85 0 0 1-.83.76c-.54.47-1.3 1.08-2.1 1.61a1.3 1.3 0 0 1-2.05-.98 16.46 16.46 0 0 1 .09-3.08l-.16.05a1.5 1.5 0 0 1-1.53-.36l-3.13-3.13c-.4-.4-.54-1-.36-1.53l.05-.16-.36.04c-.7.06-1.62.11-2.54.06a1.3 1.3 0 0 1-1.13-.8c-.18-.42-.13-.94.17-1.35a87.55 87.55 0 0 1 2.15-2.8l.04-.04v-.02l.4.31-.22-.45.03-.01a5.93 5.93 0 0 1 .34-.16c.23-.1.55-.22.94-.35A9.77 9.77 0 0 1 10.26 9a12.9 12.9 0 0 1 5.55-3.61c2.09-.76 4.18-1.1 5.65-1.26 1.41-.15 2.56 1 2.4 2.41a24.04 24.04 0 0 1-1.25 5.65A12.9 12.9 0 0 1 19 17.74a9.77 9.77 0 0 1-.88 3.61 9.18 9.18 0 0 1-.16.34v.03h-.01l-.45-.22zm0 0l.45.22-.04.08-.06.05-.35-.35zm-11-11l-.4-.31.08-.09.1-.05.22.45zm3.16-.44a9.61 9.61 0 0 0-2.84.84l-.13.16a109.83 109.83 0 0 0-1.97 2.58.4.4 0 0 0-.06.38c.04.1.12.17.27.18a16.05 16.05 0 0 0 3.18-.15l.66-2.2.01-.03.02-.04.86-1.72zm5.4 8.45l-5.57-5.56-.51 1.7-.31.92a.5.5 0 0 0 .12.51l3.13 3.13a.5.5 0 0 0 .5.12l.92-.3h.02l1.7-.52zm-10.91.64l2-2 .7.7-2 2-.7-.7zm0 4l4-4 .7.7-4 4-.7-.7zm4 0l2-2 .7.7-2 2-.7-.7zM16 10.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM17.5 8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>';
    },
  },
]);
