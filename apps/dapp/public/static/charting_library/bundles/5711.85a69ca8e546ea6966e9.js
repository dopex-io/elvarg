(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5711],
  {
    88803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      };
    },
    55596: (e) => {
      e.exports = {
        dialog: 'dialog-b8SxMnzX',
        wrapper: 'wrapper-b8SxMnzX',
        separator: 'separator-b8SxMnzX',
      };
    },
    12228: (e) => {
      e.exports = {
        itemRow: 'itemRow-BadjY5sX',
        favoriteButton: 'favoriteButton-BadjY5sX',
        active: 'active-BadjY5sX',
        selected: 'selected-BadjY5sX',
        mobile: 'mobile-BadjY5sX',
        itemInfo: 'itemInfo-BadjY5sX',
        title: 'title-BadjY5sX',
        details: 'details-BadjY5sX',
        itemInfoWithPadding: 'itemInfoWithPadding-BadjY5sX',
        favorite: 'favorite-BadjY5sX',
        removeButton: 'removeButton-BadjY5sX',
      };
    },
    69827: (e) => {
      e.exports = {
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        container: 'container-BZKENkhT',
        unsetAlign: 'unsetAlign-BZKENkhT',
        title: 'title-BZKENkhT',
        subtitle: 'subtitle-BZKENkhT',
        textWrap: 'textWrap-BZKENkhT',
        ellipsis: 'ellipsis-BZKENkhT',
        close: 'close-BZKENkhT',
        icon: 'icon-BZKENkhT',
      };
    },
    82434: (e) => {
      e.exports = { scrollWrap: 'scrollWrap-FaOvTD2r' };
    },
    77253: (e) => {
      e.exports = {
        wrap: 'wrap-vSb6C0Bj',
        'wrap--horizontal': 'wrap--horizontal-vSb6C0Bj',
        bar: 'bar-vSb6C0Bj',
        barInner: 'barInner-vSb6C0Bj',
        'barInner--horizontal': 'barInner--horizontal-vSb6C0Bj',
        'bar--horizontal': 'bar--horizontal-vSb6C0Bj',
      };
    },
    14877: (e) => {
      e.exports = {
        favorite: 'favorite-_FRQhM5Y',
        hovered: 'hovered-_FRQhM5Y',
        disabled: 'disabled-_FRQhM5Y',
        active: 'active-_FRQhM5Y',
        checked: 'checked-_FRQhM5Y',
      };
    },
    45719: (e) => {
      e.exports = { separator: 'separator-Pf4rIzEt' };
    },
    27306: (e) => {
      e.exports = {
        button: 'button-iLKiGOdQ',
        hovered: 'hovered-iLKiGOdQ',
        disabled: 'disabled-iLKiGOdQ',
        active: 'active-iLKiGOdQ',
        hidden: 'hidden-iLKiGOdQ',
      };
    },
    39416: (e, t, n) => {
      'use strict';
      n.d(t, { useFunctionalRefObject: () => i });
      var r = n(50959),
        o = n(43010);
      function i(e) {
        const t = (0, r.useMemo)(
            () =>
              (function (e) {
                const t = (n) => {
                  e(n), (t.current = n);
                };
                return (t.current = null), t;
              })((e) => {
                s.current(e);
              }),
            []
          ),
          n = (0, r.useRef)(null),
          i = (t) => {
            if (null === t) return a(n.current, t), void (n.current = null);
            n.current !== e && ((n.current = e), a(n.current, t));
          },
          s = (0, r.useRef)(i);
        return (
          (s.current = i),
          (0, o.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return s.current(t.current), () => s.current(null);
          }, [e]),
          t
        );
      }
      function a(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t));
      }
    },
    43010: (e, t, n) => {
      'use strict';
      n.d(t, { useIsomorphicLayoutEffect: () => o });
      var r = n(50959);
      function o(e, t) {
        ('undefined' == typeof window ? r.useEffect : r.useLayoutEffect)(e, t);
      }
    },
    67842: (e, t, n) => {
      'use strict';
      n.d(t, { useResizeObserver: () => s });
      var r = n(50959),
        o = n(59255),
        i = n(43010),
        a = n(39416);
      function s(e, t = []) {
        const { callback: n, ref: s = null } = (function (e) {
            return 'function' == typeof e ? { callback: e } : e;
          })(e),
          l = (0, r.useRef)(null),
          c = (0, r.useRef)(n);
        c.current = n;
        const u = (0, a.useFunctionalRefObject)(s),
          d = (0, r.useCallback)(
            (e) => {
              u(e),
                null !== l.current &&
                  (l.current.disconnect(), null !== e && l.current.observe(e));
            },
            [u, l]
          );
        return (
          (0, i.useIsomorphicLayoutEffect)(
            () => (
              (l.current = new o.default((e, t) => {
                c.current(e, t);
              })),
              u.current && d(u.current),
              () => {
                var e;
                null === (e = l.current) || void 0 === e || e.disconnect();
              }
            ),
            [u, ...t]
          ),
          d
        );
      }
    },
    53017: (e, t, n) => {
      'use strict';
      function r(e) {
        return (t) => {
          e.forEach((e) => {
            'function' == typeof e ? e(t) : null != e && (e.current = t);
          });
        };
      }
      function o(e) {
        return r([e]);
      }
      n.d(t, { isomorphicRef: () => o, mergeRefs: () => r });
    },
    24437: (e, t, n) => {
      'use strict';
      n.d(t, { DialogBreakpoints: () => o });
      var r = n(88803);
      const o = {
        SmallHeight: r['small-height-breakpoint'],
        TabletSmall: r['tablet-small-breakpoint'],
        TabletNormal: r['tablet-normal-breakpoint'],
      };
    },
    35057: (e, t, n) => {
      'use strict';
      n.d(t, { AdaptivePopupDialog: () => B });
      var r = n(50959),
        o = n(50151);
      var i = n(97754),
        a = n.n(i),
        s = n(68335),
        l = n(35749),
        c = n(63016),
        u = n(1109),
        d = n(24437),
        h = n(90692),
        v = n(95711);
      var f = n(52092),
        p = n(76422),
        m = n(9745);
      const g = r.createContext({ setHideClose: () => {} });
      var b = n(7720),
        C = n(69827);
      function E(e) {
        const {
            title: t,
            titleTextWrap: n = !1,
            subtitle: o,
            showCloseIcon: i = !0,
            onClose: s,
            onCloseButtonKeyDown: l,
            renderBefore: c,
            renderAfter: u,
            draggable: d,
            className: h,
            unsetAlign: v,
            closeAriaLabel: f,
            closeButtonReference: p,
          } = e,
          [E, w] = (0, r.useState)(!1);
        return r.createElement(
          g.Provider,
          { value: { setHideClose: w } },
          r.createElement(
            'div',
            { className: a()(C.container, h, (o || v) && C.unsetAlign) },
            c,
            r.createElement(
              'div',
              { 'data-dragg-area': d, className: C.title },
              r.createElement(
                'div',
                { className: a()(n ? C.textWrap : C.ellipsis) },
                t
              ),
              o &&
                r.createElement(
                  'div',
                  { className: a()(C.ellipsis, C.subtitle) },
                  o
                )
            ),
            u,
            i &&
              !E &&
              r.createElement(
                'button',
                {
                  className: C.close,
                  onClick: s,
                  onKeyDown: l,
                  'data-name': 'close',
                  'aria-label': f,
                  type: 'button',
                  ref: p,
                },
                r.createElement(m.Icon, {
                  className: C.icon,
                  icon: b,
                  'data-name': 'close',
                  'data-role': 'button',
                })
              )
          )
        );
      }
      var w = n(53017),
        N = n(55596);
      const k = { vertical: 20 },
        _ = { vertical: 0 };
      class B extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._controller = null),
            (this._reference = null),
            (this._orientationMediaQuery = null),
            (this._renderChildren = (e, t) => (
              (this._controller = e),
              this.props.render({
                requestResize: this._requestResize,
                centerAndFit: this._centerAndFit,
                isSmallWidth: t,
              })
            )),
            (this._handleReference = (e) => (this._reference = e)),
            (this._handleCloseBtnClick = () => {
              this.props.onKeyboardClose && this.props.onKeyboardClose(),
                this._handleClose();
            }),
            (this._handleClose = () => {
              this.props.onClose();
            }),
            (this._handleOpen = () => {
              void 0 !== this.props.onOpen &&
                this.props.isOpened &&
                this.props.onOpen(
                  this.props.fullScreen ||
                    window.matchMedia(d.DialogBreakpoints.TabletSmall).matches
                );
            }),
            (this._handleKeyDown = (e) => {
              if (!e.defaultPrevented) {
                if (
                  (this.props.onKeyDown && this.props.onKeyDown(e),
                  27 === (0, s.hashFromEvent)(e))
                ) {
                  if (e.defaultPrevented) return;
                  if (
                    this.props.forceCloseOnEsc &&
                    this.props.forceCloseOnEsc()
                  )
                    return (
                      this.props.onKeyboardClose &&
                        this.props.onKeyboardClose(),
                      void this._handleClose()
                    );
                  const { activeElement: n } = document,
                    r = (0, o.ensureNotNull)(this._reference);
                  if (null !== n) {
                    if (
                      (e.preventDefault(),
                      'true' === (t = n).getAttribute('data-haspopup') &&
                        'true' !== t.getAttribute('data-expanded'))
                    )
                      return void this._handleClose();
                    if ((0, l.isTextEditingField)(n)) return void r.focus();
                    if (r.contains(n))
                      return (
                        this.props.onKeyboardClose &&
                          this.props.onKeyboardClose(),
                        void this._handleClose()
                      );
                  }
                }
                var t, n;
                (function (e) {
                  if ('function' == typeof e) return e();
                  return Boolean(e);
                })(this.props.disableTabNavigationContainment) ||
                  ((n = e),
                  [9, s.Modifiers.Shift + 9].includes(
                    (0, s.hashFromEvent)(n)
                  ) && n.stopPropagation());
              }
            }),
            (this._requestResize = () => {
              null !== this._controller && this._controller.recalculateBounds();
            }),
            (this._centerAndFit = () => {
              null !== this._controller && this._controller.centerAndFit();
            });
        }
        componentDidMount() {
          var e, t;
          this.props.ignoreClosePopupsAndDialog ||
            p.subscribe(
              f.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
              this._handleClose,
              null
            ),
            this._handleOpen(),
            void 0 !== this.props.onOpen &&
              ((this._orientationMediaQuery = window.matchMedia(
                '(orientation: portrait)'
              )),
              (e = this._orientationMediaQuery),
              (t = this._handleOpen),
              (null == e ? void 0 : e.addEventListener)
                ? e.addEventListener('change', t)
                : e.addListener(t));
        }
        componentWillUnmount() {
          var e, t;
          this.props.ignoreClosePopupsAndDialog ||
            p.unsubscribe(
              f.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
              this._handleClose,
              null
            ),
            null !== this._orientationMediaQuery &&
              ((e = this._orientationMediaQuery),
              (t = this._handleOpen),
              (null == e ? void 0 : e.removeEventListener)
                ? e.removeEventListener('change', t)
                : e.removeListener(t));
        }
        focus() {
          (0, o.ensureNotNull)(this._reference).focus();
        }
        getElement() {
          return this._reference;
        }
        contains(e) {
          var t, n;
          return (
            null !==
              (n =
                null === (t = this._reference) || void 0 === t
                  ? void 0
                  : t.contains(e)) &&
            void 0 !== n &&
            n
          );
        }
        render() {
          const {
              className: e,
              wrapperClassName: t,
              headerClassName: n,
              isOpened: o,
              title: i,
              titleTextWrap: s,
              dataName: l,
              onClickOutside: f,
              additionalElementPos: p,
              additionalHeaderElement: m,
              backdrop: g,
              shouldForceFocus: b = !0,
              shouldReturnFocus: C,
              showSeparator: B,
              subtitle: L,
              draggable: S = !0,
              fullScreen: x = !1,
              showCloseIcon: D = !0,
              rounded: z = !0,
              isAnimationEnabled: y,
              growPoint: R,
              dialogTooltip: A,
              unsetHeaderAlign: M,
              onDragStart: P,
              dataDialogName: T,
              closeAriaLabel: O,
              containerAriaLabel: F,
              reference: I,
              containerTabIndex: K,
              closeButtonReference: H,
              onCloseButtonKeyDown: W,
            } = this.props,
            j = 'after' !== p ? m : void 0,
            Y = 'after' === p ? m : void 0,
            Q = 'string' == typeof i ? i : T || '',
            X = (0, w.mergeRefs)([this._handleReference, I]);
          return r.createElement(
            h.MatchMedia,
            { rule: d.DialogBreakpoints.SmallHeight },
            (p) =>
              r.createElement(
                h.MatchMedia,
                { rule: d.DialogBreakpoints.TabletSmall },
                (d) =>
                  r.createElement(
                    c.PopupDialog,
                    {
                      rounded: !(d || x) && z,
                      className: a()(N.dialog, e),
                      isOpened: o,
                      reference: X,
                      onKeyDown: this._handleKeyDown,
                      onClickOutside: f,
                      onClickBackdrop: f,
                      fullscreen: d || x,
                      guard: p ? _ : k,
                      boundByScreen: d || x,
                      shouldForceFocus: b,
                      shouldReturnFocus: C,
                      backdrop: g,
                      draggable: S,
                      isAnimationEnabled: y,
                      growPoint: R,
                      name: this.props.dataName,
                      dialogTooltip: A,
                      onDragStart: P,
                      containerAriaLabel: F,
                      containerTabIndex: K,
                    },
                    r.createElement(
                      'div',
                      {
                        className: a()(N.wrapper, t),
                        'data-name': l,
                        'data-dialog-name': Q,
                      },
                      void 0 !== i &&
                        r.createElement(E, {
                          draggable: S && !(d || x),
                          onClose: this._handleCloseBtnClick,
                          renderAfter: Y,
                          renderBefore: j,
                          subtitle: L,
                          title: i,
                          titleTextWrap: s,
                          showCloseIcon: D,
                          className: n,
                          unsetAlign: M,
                          closeAriaLabel: O,
                          closeButtonReference: H,
                          onCloseButtonKeyDown: W,
                        }),
                      B &&
                        r.createElement(u.Separator, {
                          className: N.separator,
                        }),
                      r.createElement(v.PopupContext.Consumer, null, (e) =>
                        this._renderChildren(e, d || x)
                      )
                    )
                  )
              )
          );
        }
      }
    },
    64530: (e, t, n) => {
      'use strict';
      n.d(t, { DialogContentItem: () => d });
      var r = n(50959),
        o = n(97754),
        i = n.n(o),
        a = n(49483),
        s = n(36189),
        l = n(96040);
      function c(e) {
        const { url: t, ...n } = e;
        return t
          ? r.createElement('a', {
              ...n,
              href: t,
            })
          : r.createElement('div', { ...n });
      }
      var u = n(12228);
      function d(e) {
        const {
          title: t,
          subtitle: n,
          removeBtnLabel: o,
          onClick: d,
          onClickFavorite: v,
          onClickRemove: f,
          isActive: p,
          isSelected: m,
          isFavorite: g,
          isMobile: b = !1,
          showFavorite: C = !0,
          ...E
        } = e;
        return r.createElement(
          c,
          {
            ...E,
            className: i()(
              u.itemRow,
              p && !m && u.active,
              b && u.mobile,
              m && u.selected
            ),
            onClick: h.bind(null, d),
            'data-role': 'list-item',
            'data-active': p,
          },
          C &&
            v &&
            r.createElement(s.FavoriteButton, {
              className: i()(
                u.favoriteButton,
                g && u.favorite,
                a.CheckMobile.any() && u.mobile
              ),
              isActive: p && !m,
              isFilled: g,
              onClick: h.bind(null, v),
              'data-name': 'list-item-favorite-button',
              'data-favorite': g,
            }),
          r.createElement(
            'div',
            { className: i()(u.itemInfo, !C && u.itemInfoWithPadding) },
            r.createElement(
              'div',
              {
                className: i()(u.title, p && !m && u.active, b && u.mobile),
                'data-name': 'list-item-title',
              },
              t
            ),
            r.createElement(
              'div',
              { className: i()(u.details, p && !m && u.active, b && u.mobile) },
              n
            )
          ),
          r.createElement(l.RemoveButton, {
            className: u.removeButton,
            isActive: p && !m,
            onClick: h.bind(null, f),
            'data-name': 'list-item-remove-button',
            title: o,
          })
        );
      }
      function h(e, t) {
        t.defaultPrevented || (t.preventDefault(), e(t));
      }
    },
    3085: (e, t, n) => {
      'use strict';
      n.d(t, { OverlayScrollContainer: () => v });
      var r = n(50959),
        o = n(97754),
        i = n.n(o),
        a = n(50151),
        s = n(37160),
        l = n(38223);
      const c = n(77253);
      function u(e) {
        const {
            size: t,
            scrollSize: n,
            clientSize: o,
            scrollProgress: u,
            onScrollProgressChange: d,
            horizontal: h,
            theme: v = c,
            onDragStart: f,
            onDragEnd: p,
            minBarSize: m = 40,
          } = e,
          g = (0, r.useRef)(null),
          b = (0, r.useRef)(null),
          [C, E] = (0, r.useState)(!1),
          w = (0, r.useRef)(0);
        (0, r.useEffect)(() => {
          const e = (0, a.ensureNotNull)(g.current).ownerDocument;
          return (
            C
              ? (f && f(),
                e &&
                  (e.addEventListener('mousemove', S),
                  e.addEventListener('mouseup', x)))
              : p && p(),
            () => {
              e &&
                (e.removeEventListener('mousemove', S),
                e.removeEventListener('mouseup', x));
            }
          );
        }, [C]);
        const N = t / n || 0,
          k = o * N || 0,
          _ = Math.max(k, m),
          B = (t - _) / (t - k),
          L = (function (e) {
            if ((0, l.isRtl)() && h) return e - n + o;
            return e;
          })((0, s.clamp)(u, 0, n - t));
        return r.createElement(
          'div',
          {
            ref: g,
            className: i()(v.wrap, h && v['wrap--horizontal']),
            style: { [h ? 'width' : 'height']: t },
            onMouseDown: function (e) {
              if (e.isDefaultPrevented()) return;
              e.preventDefault();
              const r = (0, a.ensureNotNull)(b.current).getBoundingClientRect();
              w.current = (h ? r.width : r.height) / 2;
              const o = n - t;
              let i =
                D(e.nativeEvent, (0, a.ensureNotNull)(g.current)) - w.current;
              i < 0
                ? ((i = 0),
                  (w.current = D(
                    e.nativeEvent,
                    (0, a.ensureNotNull)(g.current)
                  )))
                : i > o * N * B &&
                  ((i = o * N * B),
                  (w.current =
                    D(e.nativeEvent, (0, a.ensureNotNull)(g.current)) - i));
              d(i / N / B), E(!0);
            },
          },
          r.createElement(
            'div',
            {
              ref: b,
              className: i()(v.bar, h && v['bar--horizontal']),
              style: {
                [h ? 'minWidth' : 'minHeight']: m,
                [h ? 'width' : 'height']: _,
                transform: `translate${h ? 'X' : 'Y'}(${L * N * B || 0}px)`,
              },
              onMouseDown: function (e) {
                e.preventDefault(),
                  (w.current = D(
                    e.nativeEvent,
                    (0, a.ensureNotNull)(b.current)
                  )),
                  E(!0);
              },
            },
            r.createElement('div', {
              className: i()(v.barInner, h && v['barInner--horizontal']),
            })
          )
        );
        function S(e) {
          const t = D(e, (0, a.ensureNotNull)(g.current)) - w.current;
          d(t / N / B);
        }
        function x(e) {
          E(!1);
        }
        function D(e, t) {
          const n = t.getBoundingClientRect();
          return h ? e.clientX - n.left : e.clientY - n.top;
        }
      }
      var d = n(70412),
        h = n(82434);
      function v(e) {
        const {
            reference: t,
            className: n,
            containerHeight: i = 0,
            containerWidth: a = 0,
            contentHeight: s = 0,
            contentWidth: l = 0,
            scrollPosTop: c = 0,
            scrollPosLeft: v = 0,
            onVerticalChange: f,
            onHorizontalChange: p,
            visible: m,
          } = e,
          [g, b] = (0, d.useHover)(),
          [C, E] = (0, r.useState)(!1),
          w = i < s,
          N = a < l,
          k = w && N ? 8 : 0;
        return r.createElement(
          'div',
          {
            ...b,
            ref: t,
            className: o(n, h.scrollWrap),
            style: { visibility: m || g || C ? 'visible' : 'hidden' },
          },
          w &&
            r.createElement(u, {
              size: i - k,
              scrollSize: s - k,
              clientSize: i - k,
              scrollProgress: c,
              onScrollProgressChange: function (e) {
                f && f(e);
              },
              onDragStart: _,
              onDragEnd: B,
            }),
          N &&
            r.createElement(u, {
              size: a - k,
              scrollSize: l - k,
              clientSize: a - k,
              scrollProgress: v,
              onScrollProgressChange: function (e) {
                p && p(e);
              },
              onDragStart: _,
              onDragEnd: B,
              horizontal: !0,
            })
        );
        function _() {
          E(!0);
        }
        function B() {
          E(!1);
        }
      }
    },
    36189: (e, t, n) => {
      'use strict';
      n.d(t, { FavoriteButton: () => d });
      var r = n(44352),
        o = n(50959),
        i = n(97754),
        a = n(9745),
        s = n(39146),
        l = n(48010),
        c = n(14877);
      const u = {
        add: r.t(null, void 0, n(44629)),
        remove: r.t(null, void 0, n(72482)),
      };
      function d(e) {
        const { className: t, isFilled: n, isActive: r, onClick: d, ...h } = e;
        return o.createElement(a.Icon, {
          ...h,
          className: i(
            c.favorite,
            'apply-common-tooltip',
            n && c.checked,
            r && c.active,
            t
          ),
          icon: n ? s : l,
          onClick: d,
          title: n ? u.remove : u.add,
        });
      }
    },
    898: (e, t, n) => {
      'use strict';
      n.d(t, { useDimensions: () => i });
      var r = n(50959),
        o = n(67842);
      function i() {
        const [e, t] = (0, r.useState)(null),
          n = (0, r.useCallback)(
            ([n]) => {
              const r = n.target.getBoundingClientRect();
              (r.width === (null == e ? void 0 : e.width) &&
                r.height === e.height) ||
                t(r);
            },
            [e]
          );
        return [(0, o.useResizeObserver)(n), e];
      }
    },
    70412: (e, t, n) => {
      'use strict';
      n.d(t, {
        hoverMouseEventFilter: () => i,
        useAccurateHover: () => a,
        useHover: () => o,
      });
      var r = n(50959);
      function o() {
        const [e, t] = (0, r.useState)(!1);
        return [
          e,
          {
            onMouseOver: function (e) {
              i(e) && t(!0);
            },
            onMouseOut: function (e) {
              i(e) && t(!1);
            },
          },
        ];
      }
      function i(e) {
        return !e.currentTarget.contains(e.relatedTarget);
      }
      function a(e) {
        const [t, n] = (0, r.useState)(!1);
        return (
          (0, r.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return;
              const r = e.current.contains(t.target);
              n(r);
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
    33127: (e, t, n) => {
      'use strict';
      n.d(t, { useOverlayScroll: () => l });
      var r = n(50959),
        o = n(50151),
        i = n(70412),
        a = n(49483);
      const s = { onMouseOver: () => {}, onMouseOut: () => {} };
      function l(e, t = a.CheckMobile.any()) {
        const n = (0, r.useRef)(null),
          l = e || (0, r.useRef)(null),
          [c, u] = (0, i.useHover)(),
          [d, h] = (0, r.useState)({
            reference: n,
            containerHeight: 0,
            containerWidth: 0,
            contentHeight: 0,
            contentWidth: 0,
            scrollPosTop: 0,
            scrollPosLeft: 0,
            onVerticalChange: function (e) {
              h((t) => ({ ...t, scrollPosTop: e })),
                ((0, o.ensureNotNull)(l.current).scrollTop = e);
            },
            onHorizontalChange: function (e) {
              h((t) => ({ ...t, scrollPosLeft: e })),
                ((0, o.ensureNotNull)(l.current).scrollLeft = e);
            },
            visible: c,
          }),
          v = (0, r.useCallback)(() => {
            if (!l.current) return;
            const {
                clientHeight: e,
                scrollHeight: t,
                scrollTop: r,
                clientWidth: o,
                scrollWidth: i,
                scrollLeft: a,
              } = l.current,
              s = n.current ? n.current.offsetTop : 0;
            h((n) => ({
              ...n,
              containerHeight: e - s,
              contentHeight: t - s,
              scrollPosTop: r,
              containerWidth: o,
              contentWidth: i,
              scrollPosLeft: a,
            }));
          }, []);
        function f() {
          h((e) => ({
            ...e,
            scrollPosTop: (0, o.ensureNotNull)(l.current).scrollTop,
            scrollPosLeft: (0, o.ensureNotNull)(l.current).scrollLeft,
          }));
        }
        return (
          (0, r.useEffect)(() => {
            c && v(), h((e) => ({ ...e, visible: c }));
          }, [c]),
          (0, r.useEffect)(() => {
            const e = l.current;
            return (
              e && e.addEventListener('scroll', f),
              () => {
                e && e.removeEventListener('scroll', f);
              }
            );
          }, [l]),
          [d, t ? s : u, l, v]
        );
      }
    },
    1109: (e, t, n) => {
      'use strict';
      n.d(t, { Separator: () => a });
      var r = n(50959),
        o = n(97754),
        i = n(45719);
      function a(e) {
        return r.createElement('div', {
          className: o(i.separator, e.className),
        });
      }
    },
    96040: (e, t, n) => {
      'use strict';
      n.d(t, { RemoveButton: () => c });
      var r = n(44352),
        o = n(50959),
        i = n(97754),
        a = n(9745),
        s = n(33765),
        l = n(27306);
      function c(e) {
        const {
          className: t,
          isActive: c,
          onClick: u,
          onMouseDown: d,
          title: h,
          hidden: v,
          'data-name': f = 'remove-button',
          ...p
        } = e;
        return o.createElement(a.Icon, {
          ...p,
          'data-name': f,
          className: i(
            l.button,
            'apply-common-tooltip',
            c && l.active,
            v && l.hidden,
            t
          ),
          icon: s,
          onClick: u,
          onMouseDown: d,
          title: h || r.t(null, void 0, n(34596)),
        });
      }
    },
    33765: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>';
    },
    7720: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="currentColor"><path d="m.58 1.42.82-.82 15 15-.82.82z"/><path d="m.58 15.58 15-15 .82.82-15 15z"/></svg>';
    },
    39146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>';
    },
    48010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>';
    },
    44629: (e) => {
      e.exports = {
        ar: ['اضف إلى القائمة التفضيلات'],
        ca_ES: ['Afegeix a preferits'],
        cs: ['Přidat do oblíbených'],
        de: ['Zu Favoriten hinzufügen'],
        el: ['Προσθήκη στα αγαπημένα'],
        en: 'Add to favorites',
        es: ['Añadir a favoritos'],
        fa: ['افزودن به موارد مورد علاقه'],
        fr: ['Ajouter aux favoris'],
        he_IL: ['הוסף למועדפים'],
        hu_HU: ['Hozzáadás kedvencekhez'],
        id_ID: ['Tambah ke daftar favorit'],
        it: ['Aggiungi ai preferiti'],
        ja: ['お気に入りに追加'],
        ko: ['즐겨찾기에 넣기'],
        ms_MY: ['Tambah kepada kegemaran'],
        nl_NL: ['Voeg toe aan favorieten'],
        pl: ['Dodaj do ulubionych'],
        pt: ['Adicionar aos favoritos'],
        ro: 'Add to favorites',
        ru: ['Добавить в избранное'],
        sv: ['Lägg till som favorit'],
        th: ['เพิ่มลงรายการโปรด'],
        tr: ['Favorilere ekle'],
        vi: ['Thêm vào mục yêu thích'],
        zh: ['添加到收藏'],
        zh_TW: ['加入收藏'],
      };
    },
    72482: (e) => {
      e.exports = {
        ar: ['حذف من القائمة المفضلة'],
        ca_ES: ['Treure de preferits'],
        cs: ['Odebrat z oblíbených'],
        de: ['Aus Favoriten entfernen'],
        el: ['Διαγραφή απο τα αγαπημένα'],
        en: 'Remove from favorites',
        es: ['Quitar de favoritos'],
        fa: ['حذف از موارد مورد علاقه'],
        fr: ['Retirer des favoris'],
        he_IL: ['הסר ממועדפים'],
        hu_HU: ['Eltávolít kedvencek közül'],
        id_ID: ['Hilangkan dari favorit'],
        it: ['Rimuovi dai preferiti'],
        ja: ['お気に入りから削除'],
        ko: ['즐겨찾기지움'],
        ms_MY: ['Keluarkan dari kegemaran'],
        nl_NL: ['Verwijder van favorieten'],
        pl: ['Usuń z ulubionych'],
        pt: ['Remover dos favoritos'],
        ro: 'Remove from favorites',
        ru: ['Удалить из предпочтений'],
        sv: ['Ta bort från favoriter'],
        th: ['ลบออกจากรายการโปรด'],
        tr: ['Favorilerimden çıkar'],
        vi: ['Loại bỏ khỏi mục yêu thích'],
        zh: ['从收藏中移除'],
        zh_TW: ['從收藏移除'],
      };
    },
  },
]);
