(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2704],
  {
    97754: (e, t) => {
      var n;
      !(function () {
        'use strict';
        var r = {}.hasOwnProperty;
        function o() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t];
            if (n) {
              var i = typeof n;
              if ('string' === i || 'number' === i) e.push(n);
              else if (Array.isArray(n) && n.length) {
                var a = o.apply(null, n);
                a && e.push(a);
              } else if ('object' === i)
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
    40281: (e) => {
      e.exports = {
        container: 'container-qm7Rg5MB',
        inputContainer: 'inputContainer-qm7Rg5MB',
        withCancel: 'withCancel-qm7Rg5MB',
        input: 'input-qm7Rg5MB',
        icon: 'icon-qm7Rg5MB',
        cancel: 'cancel-qm7Rg5MB',
      };
    },
    16734: (e) => {
      e.exports = { scrollWrap: 'scrollWrap-a62DpCum' };
    },
    40211: (e) => {
      e.exports = {
        container: 'container-c8Hkfy8e',
        separator: 'separator-c8Hkfy8e',
        section: 'section-c8Hkfy8e',
      };
    },
    55002: (e) => {
      e.exports = {
        action: 'action-peI7w0K1',
        hovered: 'hovered-peI7w0K1',
        active: 'active-peI7w0K1',
        label: 'label-peI7w0K1',
        description: 'description-peI7w0K1',
        selected: 'selected-peI7w0K1',
        small: 'small-peI7w0K1',
        withDescription: 'withDescription-peI7w0K1',
        action__favoriteIcon: 'action__favoriteIcon-peI7w0K1',
        action__favoriteIcon_active: 'action__favoriteIcon_active-peI7w0K1',
        labelAndDescription: 'labelAndDescription-peI7w0K1',
        icon: 'icon-peI7w0K1',
        fakeIcon: 'fakeIcon-peI7w0K1',
        highlighted: 'highlighted-peI7w0K1',
      };
    },
    5826: (e) => {
      e.exports = {
        menu: 'menu-kJ5smAAE',
        withDescriptions: 'withDescriptions-kJ5smAAE',
        header: 'header-kJ5smAAE',
        title: 'title-kJ5smAAE',
        container: 'container-kJ5smAAE',
        icon: 'icon-kJ5smAAE',
        clear: 'clear-kJ5smAAE',
        input: 'input-kJ5smAAE',
        highlighted: 'highlighted-kJ5smAAE',
        active: 'active-kJ5smAAE',
        section: 'section-kJ5smAAE',
      };
    },
    45300: (e) => {
      e.exports = {};
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
    75623: (e) => {
      e.exports = { highlighted: 'highlighted-cwp8YRo6' };
    },
    45719: (e) => {
      e.exports = { separator: 'separator-Pf4rIzEt' };
    },
    92910: (e) => {
      e.exports = {
        separator: 'separator-QjUlCDId',
        small: 'small-QjUlCDId',
        normal: 'normal-QjUlCDId',
        large: 'large-QjUlCDId',
      };
    },
    34587: (e) => {
      e.exports = { icon: 'icon-WB2y0EnP', dropped: 'dropped-WB2y0EnP' };
    },
    27267: (e, t, n) => {
      'use strict';
      function r(e, t, n, r, o) {
        function i(o) {
          if (e > o.timeStamp) return;
          const i = o.target;
          void 0 !== n &&
            null !== t &&
            null !== i &&
            i.ownerDocument === r &&
            (t.contains(i) || n(o));
        }
        return (
          o.click && r.addEventListener('click', i, !1),
          o.mouseDown && r.addEventListener('mousedown', i, !1),
          o.touchEnd && r.addEventListener('touchend', i, !1),
          o.touchStart && r.addEventListener('touchstart', i, !1),
          () => {
            r.removeEventListener('click', i, !1),
              r.removeEventListener('mousedown', i, !1),
              r.removeEventListener('touchend', i, !1),
              r.removeEventListener('touchstart', i, !1);
          }
        );
      }
      n.d(t, { addOutsideEventListener: () => r });
    },
    90186: (e, t, n) => {
      'use strict';
      function r(e) {
        return i(e, a);
      }
      function o(e) {
        return i(e, s);
      }
      function i(e, t) {
        const n = Object.entries(e).filter(t),
          r = {};
        for (const [e, t] of n) r[e] = t;
        return r;
      }
      function a(e) {
        const [t, n] = e;
        return 0 === t.indexOf('data-') && 'string' == typeof n;
      }
      function s(e) {
        return 0 === e[0].indexOf('aria-');
      }
      n.d(t, {
        filterAriaProps: () => o,
        filterDataProps: () => r,
        filterProps: () => i,
        isAriaAttribute: () => s,
        isDataAttribute: () => a,
      });
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
      n.d(t, { AdaptivePopupDialog: () => k });
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
        p = n(95711);
      var f = n(52092),
        m = n(76422),
        v = n(9745);
      const g = r.createContext({ setHideClose: () => {} });
      var y = n(7720),
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
            unsetAlign: p,
            closeAriaLabel: f,
            closeButtonReference: m,
          } = e,
          [E, _] = (0, r.useState)(!1);
        return r.createElement(
          g.Provider,
          { value: { setHideClose: _ } },
          r.createElement(
            'div',
            { className: a()(C.container, h, (o || p) && C.unsetAlign) },
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
                  ref: m,
                },
                r.createElement(v.Icon, {
                  className: C.icon,
                  icon: y,
                  'data-name': 'close',
                  'data-role': 'button',
                })
              )
          )
        );
      }
      var _ = n(53017),
        b = n(55596);
      const w = { vertical: 20 },
        x = { vertical: 0 };
      class k extends r.PureComponent {
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
            m.subscribe(
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
            m.unsubscribe(
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
              additionalElementPos: m,
              additionalHeaderElement: v,
              backdrop: g,
              shouldForceFocus: y = !0,
              shouldReturnFocus: C,
              showSeparator: k,
              subtitle: S,
              draggable: A = !0,
              fullScreen: N = !1,
              showCloseIcon: D = !0,
              rounded: I = !0,
              isAnimationEnabled: R,
              growPoint: M,
              dialogTooltip: L,
              unsetHeaderAlign: T,
              onDragStart: B,
              dataDialogName: z,
              closeAriaLabel: F,
              containerAriaLabel: O,
              reference: P,
              containerTabIndex: K,
              closeButtonReference: U,
              onCloseButtonKeyDown: j,
            } = this.props,
            H = 'after' !== m ? v : void 0,
            W = 'after' === m ? v : void 0,
            $ = 'string' == typeof i ? i : z || '',
            q = (0, _.mergeRefs)([this._handleReference, P]);
          return r.createElement(
            h.MatchMedia,
            { rule: d.DialogBreakpoints.SmallHeight },
            (m) =>
              r.createElement(
                h.MatchMedia,
                { rule: d.DialogBreakpoints.TabletSmall },
                (d) =>
                  r.createElement(
                    c.PopupDialog,
                    {
                      rounded: !(d || N) && I,
                      className: a()(b.dialog, e),
                      isOpened: o,
                      reference: q,
                      onKeyDown: this._handleKeyDown,
                      onClickOutside: f,
                      onClickBackdrop: f,
                      fullscreen: d || N,
                      guard: m ? x : w,
                      boundByScreen: d || N,
                      shouldForceFocus: y,
                      shouldReturnFocus: C,
                      backdrop: g,
                      draggable: A,
                      isAnimationEnabled: R,
                      growPoint: M,
                      name: this.props.dataName,
                      dialogTooltip: L,
                      onDragStart: B,
                      containerAriaLabel: O,
                      containerTabIndex: K,
                    },
                    r.createElement(
                      'div',
                      {
                        className: a()(b.wrapper, t),
                        'data-name': l,
                        'data-dialog-name': $,
                      },
                      void 0 !== i &&
                        r.createElement(E, {
                          draggable: A && !(d || N),
                          onClose: this._handleCloseBtnClick,
                          renderAfter: W,
                          renderBefore: H,
                          subtitle: S,
                          title: i,
                          titleTextWrap: s,
                          showCloseIcon: D,
                          className: n,
                          unsetAlign: T,
                          closeAriaLabel: F,
                          closeButtonReference: U,
                          onCloseButtonKeyDown: j,
                        }),
                      k &&
                        r.createElement(u.Separator, {
                          className: b.separator,
                        }),
                      r.createElement(p.PopupContext.Consumer, null, (e) =>
                        this._renderChildren(e, d || N)
                      )
                    )
                  )
              )
          );
        }
      }
    },
    69654: (e, t, n) => {
      'use strict';
      n.d(t, { DialogSearch: () => u });
      var r = n(50959),
        o = n(97754),
        i = n.n(o),
        a = n(44352),
        s = n(9745),
        l = n(69859),
        c = n(40281);
      function u(e) {
        const {
          children: t,
          renderInput: o,
          onCancel: u,
          containerClassName: h,
          inputContainerClassName: p,
          iconClassName: f,
          ...m
        } = e;
        return r.createElement(
          'div',
          { className: i()(c.container, h) },
          r.createElement(
            'div',
            { className: i()(c.inputContainer, p, u && c.withCancel) },
            o || r.createElement(d, { ...m })
          ),
          t,
          r.createElement(s.Icon, { className: i()(c.icon, f), icon: l }),
          u &&
            r.createElement(
              'div',
              { className: c.cancel, onClick: u },
              a.t(null, void 0, n(20036))
            )
        );
      }
      function d(e) {
        const {
          className: t,
          reference: n,
          value: o,
          onChange: a,
          onFocus: s,
          onBlur: l,
          onKeyDown: u,
          onSelect: d,
          placeholder: h,
          ...p
        } = e;
        return r.createElement('input', {
          ...p,
          ref: n,
          type: 'text',
          className: i()(t, c.input),
          autoComplete: 'off',
          'data-role': 'search',
          placeholder: h,
          value: o,
          onChange: a,
          onFocus: s,
          onBlur: l,
          onSelect: d,
          onKeyDown: u,
        });
      }
    },
    71834: (e, t, n) => {
      'use strict';
      n.r(t), n.d(t, { UnitConversionRenderer: () => F });
      var r = n(50959),
        o = n(962),
        i = n(79188),
        a = n(90692),
        s = n(19785),
        l = n(68335);
      var c = n(24437),
        u = n(12811),
        d = n(97754),
        h = n.n(d),
        p = n(44352),
        f = n(9745),
        m = n(20520),
        v = n(27317),
        g = n(40173),
        y = n(51613),
        C = n(76197),
        E = n(36189);
      n(45300);
      function _(e) {
        var t, n;
        const o =
          ((i = e.size),
          (a = e.className),
          d('tv-circle-logo', `tv-circle-logo--${i}`, a));
        var i, a;
        const s =
          null !== (n = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
          void 0 !== n
            ? n
            : '';
        return (function (e) {
          return (
            'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length
          );
        })(e)
          ? r.createElement('img', {
              className: o,
              src: e.logoUrl,
              alt: s,
              title: e.title,
              loading: e.loading,
            })
          : r.createElement(
              'span',
              { className: o, title: e.title },
              e.placeholderLetter
            );
      }
      var b = n(24637),
        w = n(55002);
      const x = r.memo(
        function (e) {
          const {
              label: t,
              icon: n,
              rules: o,
              search: i,
              description: a,
              onClick: s,
              onClose: l,
              isActive: c,
              isSmallSize: u,
              isSelected: d,
              selectedRef: p,
              hasDescriptions: f,
              hasIcons: m,
              isFavorite: v,
              onFavoriteClick: g,
            } = e,
            y = (0, r.useCallback)(() => {
              s(), l && l();
            }, [s, l]),
            C = u && w.small;
          return r.createElement(
            'div',
            {
              className: h()(
                w.action,
                c && w.active,
                C,
                f && w.withDescription,
                d && w.selected
              ),
              onClick: y,
              ref: p,
            },
            m &&
              (void 0 !== n
                ? r.createElement(_, {
                    logoUrl: n,
                    size: f ? 'xsmall' : 'xxxsmall',
                    className: h()(w.icon, C),
                  })
                : r.createElement('span', { className: h()(w.fakeIcon, C) })),
            r.createElement(
              'div',
              { className: h()(w.labelAndDescription, C) },
              r.createElement('span', { className: h()(w.label, C) }, x(t)),
              f && r.createElement('br', null),
              f &&
                r.createElement(
                  'span',
                  { className: h()(w.description, C) },
                  a ? x(a) : ''
                )
            ),
            void 0 !== v &&
              r.createElement(
                'div',
                {
                  className: h()(
                    w.action__favoriteIcon,
                    v && w.action__favoriteIcon_active
                  ),
                },
                r.createElement(E.FavoriteButton, {
                  isActive: c,
                  isFilled: v,
                  onClick: function (e) {
                    e.stopPropagation(), null == g || g();
                  },
                })
              )
          );
          function x(e) {
            return r.createElement(b.HighlightedText, {
              text: e,
              rules: o,
              queryString: i,
              className: h()(c && w.highlighted, c && w.active),
            });
          }
        },
        (e, t) =>
          Object.keys(t)
            .filter(
              (e) => !['onClick', 'onClose', 'onFavoriteClick'].includes(e)
            )
            .every((n) => t[n] === e[n])
      );
      var k = n(48471),
        S = n(69311),
        A = n(5826),
        N = n(16734);
      const D = (0, g.mergeThemes)(v.DEFAULT_MENU_THEME, N);
      function I(e) {
        const {
            title: t,
            sections: o,
            onClose: i,
            selectedId: a,
            selectedRef: s,
            search: l,
            setSearch: c,
            items: u,
            rules: d,
            searchRef: v,
            hasDescriptions: g,
            hasIcons: E,
            ..._
          } = e,
          [b, w] = (0, r.useState)(() =>
            o.reduce((e, t, n) => (t.name && (e[t.id] = !0), e), {})
          );
        function N(e) {
          const { id: t, ...n } = e;
          return r.createElement(x, {
            key: t,
            rules: d,
            search: l,
            onClose: i,
            isSmallSize: !0,
            isSelected: t === a,
            selectedRef: t === a ? s : void 0,
            hasDescriptions: g,
            hasIcons: E,
            ...n,
          });
        }
        return r.createElement(
          m.PopupMenu,
          {
            ..._,
            onClose: i,
            className: h()(A.menu, g && A.withDescriptions),
            theme: D,
            maxHeight: g ? 313 : 280,
            noMomentumBasedScroll: !0,
            isOpened: !0,
            onOpen: function () {
              var e;
              null === (e = v.current) || void 0 === e || e.focus();
            },
          },
          r.createElement(
            'div',
            { className: A.header },
            r.createElement('div', { className: A.title }, t),
            r.createElement(
              'div',
              { className: A.container },
              r.createElement(f.Icon, { icon: k, className: A.icon }),
              r.createElement('input', {
                size: 1,
                type: 'text',
                className: A.input,
                placeholder: p.t(null, void 0, n(52298)),
                autoComplete: 'off',
                'data-role': 'search',
                onChange: function (e) {
                  c(e.target.value);
                },
                value: l,
                ref: v,
              }),
              Boolean(l) &&
                r.createElement(f.Icon, {
                  icon: S,
                  className: A.clear,
                  onClick: function () {
                    c('');
                  },
                })
            )
          ),
          l
            ? u.map(N)
            : o.map((e, t) =>
                r.createElement(
                  r.Fragment,
                  { key: e.id },
                  Boolean(t) && r.createElement(y.PopupMenuSeparator, null),
                  e.name
                    ? r.createElement(
                        C.CollapsibleSection,
                        {
                          summary: e.name,
                          className: A.section,
                          open: b[e.id],
                          onStateChange: (t) => w({ ...b, [e.id]: t }),
                        },
                        e.actions.map(N)
                      )
                    : e.actions.map(N)
                )
              )
        );
      }
      var R = n(35057),
        M = n(69654),
        L = n(40211);
      function T(e) {
        const {
          title: t,
          onClose: o,
          sections: i,
          selectedId: a,
          selectedRef: s,
          search: l,
          setSearch: c,
          items: u,
          rules: d,
          searchRef: h,
          hasIcons: f,
          hasDescriptions: m,
        } = e;
        return r.createElement(R.AdaptivePopupDialog, {
          title: t,
          onClose: o,
          render: function () {
            return r.createElement(
              r.Fragment,
              null,
              r.createElement(M.DialogSearch, {
                placeholder: p.t(null, void 0, n(52298)),
                onChange: v,
                reference: h,
              }),
              r.createElement(
                'div',
                { className: L.container },
                l
                  ? u.map((e) => {
                      const { id: t, isActive: n, ...i } = e;
                      return r.createElement(x, {
                        key: t,
                        isActive: n,
                        onClose: o,
                        rules: d,
                        search: l,
                        isSelected: t === a,
                        selectedRef: t === a ? s : void 0,
                        hasIcons: f,
                        hasDescriptions: m,
                        ...i,
                      });
                    })
                  : i.map((e, t) =>
                      r.createElement(
                        r.Fragment,
                        { key: e.id },
                        e.name &&
                          r.createElement(
                            'div',
                            { className: L.section },
                            e.name
                          ),
                        e.actions.map((n, c) => {
                          const { id: u, ...h } = n,
                            p = c === e.actions.length - 1,
                            v = t === i.length - 1;
                          return r.createElement(
                            r.Fragment,
                            { key: u },
                            r.createElement(x, {
                              rules: d,
                              search: l,
                              onClose: o,
                              isSelected: u === a,
                              selectedRef: u === a ? s : void 0,
                              hasIcons: f,
                              hasDescriptions: m,
                              ...h,
                            }),
                            !v &&
                              p &&
                              r.createElement('div', { className: L.separator })
                          );
                        })
                      )
                    )
              )
            );
          },
          dataName: 'unit-conversion-dialog',
          draggable: !1,
          fullScreen: !0,
          isOpened: !0,
        });
        function v(e) {
          c(e.target.value);
        }
      }
      const B = {
        horizontalAttachEdge: u.HorizontalAttachEdge.Right,
        horizontalDropDirection: u.HorizontalDropDirection.FromRightToLeft,
      };
      function z(e) {
        const { element: t, ...n } = e,
          [o, i] = (0, r.useState)(C()),
          [d, h] = (0, r.useState)(''),
          p = (0, r.useRef)(null),
          f = (0, r.useRef)(null),
          m = (0, r.useMemo)(() => (0, s.createRegExpList)(d), [d]),
          { activeIdx: v, setActiveIdx: g } = (function (
            e,
            t,
            n,
            o = 'keydown'
          ) {
            const [i, a] = (0, r.useState)(-1);
            return (
              (0, r.useEffect)(() => {
                if (!e) return;
                const n = (e) => {
                  switch ((0, l.hashFromEvent)(e)) {
                    case 40:
                      if (i === t.length - 1) break;
                      e.preventDefault(), a(i + 1);
                      break;
                    case 38:
                      if (i <= 0) break;
                      e.preventDefault(), a(i - 1);
                  }
                };
                return (
                  e.addEventListener('keydown', n),
                  () => {
                    e.removeEventListener('keydown', n);
                  }
                );
              }, [e, i, t]),
              (0, r.useEffect)(() => {
                if (!e || !n) return;
                const r = (e) => {
                  var r;
                  e.repeat ||
                    (13 === (0, l.hashFromEvent)(e) &&
                      n(null !== (r = t[i]) && void 0 !== r ? r : null, e));
                };
                return (
                  e.addEventListener(o, r),
                  () => {
                    e.removeEventListener(o, r);
                  }
                );
              }, [e, i, t, n, o]),
              { activeIdx: i, setActiveIdx: a }
            );
          })(p.current, o, function (e) {
            e && (e.onClick(), n.onClose());
          });
        !(function (e, t = []) {
          (0, r.useEffect)(() => {
            e(-1);
          }, [...t]);
        })(g, [o]),
          (function (e, t) {
            (0, r.useEffect)(() => {
              var n;
              t >= 0 &&
                (null === (n = e.current) ||
                  void 0 === n ||
                  n.scrollIntoView({ block: 'nearest' }));
            }, [t]);
          })(f, v),
          (0, r.useEffect)(() => {
            i(
              d
                ? (function (e, t, n) {
                    const r = e.reduce((e, t) => [...e, ...t.actions], []);
                    return (0, s.rankedSearch)({
                      data: r,
                      rules: n,
                      queryString: t,
                      primaryKey: 'label',
                      secondaryKey: 'description',
                    });
                  })(n.sections, d, m)
                : C()
            );
          }, [d, n.sections, m]);
        const y = (0, r.useMemo)(
          () => ({
            selectedId: Boolean(v >= 0 && o[v]) ? o[v].id : '',
            selectedRef: f,
            search: d,
            setSearch: h,
            searchRef: p,
            items: o,
            rules: m,
            hasIcons: o.some((e) => void 0 !== e.icon),
            hasDescriptions: o.some((e) => void 0 !== e.description),
          }),
          [v, f, d, h, p, o, m]
        );
        return r.createElement(
          a.MatchMedia,
          { rule: c.DialogBreakpoints.TabletSmall },
          (e) =>
            e
              ? r.createElement(T, { ...n, ...y })
              : r.createElement(I, {
                  ...n,
                  ...y,
                  position: (0, u.getPopupPositioner)(t, B),
                  doNotCloseOn: t,
                })
        );
        function C() {
          return n.sections.reduce((e, t) => (e.push(...t.actions), e), []);
        }
      }
      class F {
        constructor(e, t, n, r) {
          (this._rootElem = document.createElement('div')),
            (this.close = () => {
              null !== this._rootElem &&
                (o.unmountComponentAtNode(this._rootElem),
                i.favoriteCurrencyUnitConversionService
                  .getOnChange()
                  .unsubscribe(this, this._render),
                (this._rootElem = null),
                this._menuClosedCallback());
            }),
            (this.isOpened = () => null !== this._rootElem),
            (this._title = e),
            (this._element = t),
            (this._sectionsGetter = n),
            (this._menuClosedCallback = r),
            this._render(),
            i.favoriteCurrencyUnitConversionService
              .getOnChange()
              .subscribe(this, this._render);
        }
        _render() {
          const e = {
            title: this._title,
            sections: this._sectionsGetter(),
            element: this._element,
            onClose: this.close,
          };
          o.render(r.createElement(z, { ...e }), this._rootElem);
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
    19785: (e, t, n) => {
      'use strict';
      n.d(t, {
        createRegExpList: () => i,
        getHighlightedChars: () => a,
        rankedSearch: () => o,
      });
      var r = n(1722);
      function o(e) {
        const {
          data: t,
          rules: n,
          queryString: o,
          isPreventedFromFiltering: i,
          primaryKey: a,
          secondaryKey: s = a,
          optionalPrimaryKey: l,
          tertiaryKey: c,
        } = e;
        return t
          .map((e) => {
            const t = l && e[l] ? e[l] : e[a],
              i = e[s],
              u = c && e[c];
            let d,
              h = 0;
            return (
              n.forEach((e) => {
                var n, a, s, l, c;
                const { re: p, fullMatch: f } = e;
                if (
                  ((p.lastIndex = 0),
                  (0, r.isString)(t) &&
                    t &&
                    t.toLowerCase() === o.toLowerCase())
                )
                  return (
                    (h = 4),
                    void (d =
                      null === (n = t.match(f)) || void 0 === n
                        ? void 0
                        : n.index)
                  );
                if ((0, r.isString)(t) && f.test(t))
                  return (
                    (h = 3),
                    void (d =
                      null === (a = t.match(f)) || void 0 === a
                        ? void 0
                        : a.index)
                  );
                if ((0, r.isString)(i) && f.test(i))
                  return (
                    (h = 2),
                    void (d =
                      null === (s = i.match(f)) || void 0 === s
                        ? void 0
                        : s.index)
                  );
                if ((0, r.isString)(i) && p.test(i))
                  return (
                    (h = 2),
                    void (d =
                      null === (l = i.match(p)) || void 0 === l
                        ? void 0
                        : l.index)
                  );
                if (Array.isArray(u))
                  for (const e of u)
                    if (f.test(e))
                      return (
                        (h = 1),
                        void (d =
                          null === (c = e.match(f)) || void 0 === c
                            ? void 0
                            : c.index)
                      );
              }),
              { matchPriority: h, matchIndex: d, item: e }
            );
          })
          .filter((e) => i || e.matchPriority)
          .sort((e, t) => {
            if (e.matchPriority < t.matchPriority) return 1;
            if (e.matchPriority > t.matchPriority) return -1;
            if (e.matchPriority === t.matchPriority) {
              if (void 0 === e.matchIndex || void 0 === t.matchIndex) return 0;
              if (e.matchIndex > t.matchIndex) return 1;
              if (e.matchIndex < t.matchIndex) return -1;
            }
            return 0;
          })
          .map(({ item: e }) => e);
      }
      function i(e, t) {
        const n = [],
          r = e.toLowerCase(),
          o =
            e
              .split('')
              .map((e, t) => `(${0 !== t ? `[/\\s-]${s(e)}` : s(e)})`)
              .join('(.*?)') + '(.*)';
        return (
          n.push({
            fullMatch: new RegExp(`(${s(e)})`, 'i'),
            re: new RegExp(`^${o}`, 'i'),
            reserveRe: new RegExp(o, 'i'),
            fuzzyHighlight: !0,
          }),
          t &&
            t.hasOwnProperty(r) &&
            n.push({ fullMatch: t[r], re: t[r], fuzzyHighlight: !1 }),
          n
        );
      }
      function a(e, t, n) {
        const r = [];
        return e && n
          ? (n.forEach((e) => {
              const { fullMatch: n, re: o, reserveRe: i } = e;
              (n.lastIndex = 0), (o.lastIndex = 0);
              const a = n.exec(t),
                s = a || o.exec(t) || (i && i.exec(t));
              if (((e.fuzzyHighlight = !a), s))
                if (e.fuzzyHighlight) {
                  let e = s.index;
                  for (let t = 1; t < s.length; t++) {
                    const n = s[t],
                      o = s[t].length;
                    if (t % 2) {
                      const t =
                        n.startsWith(' ') ||
                        n.startsWith('/') ||
                        n.startsWith('-');
                      r[t ? e + 1 : e] = !0;
                    }
                    e += o;
                  }
                } else
                  for (let e = 0; e < s[0].length; e++) r[s.index + e] = !0;
            }),
            r)
          : r;
      }
      function s(e) {
        return e.replace(/[!-/[-^{-}?]/g, '\\$&');
      }
    },
    24637: (e, t, n) => {
      'use strict';
      n.d(t, { HighlightedText: () => s });
      var r = n(50959),
        o = n(97754),
        i = n(19785),
        a = n(75623);
      function s(e) {
        const { queryString: t, rules: n, text: s, className: l } = e,
          c = (0, r.useMemo)(
            () => (0, i.getHighlightedChars)(t, s, n),
            [t, n, s]
          );
        return r.createElement(
          r.Fragment,
          null,
          c.length
            ? s
                .split('')
                .map((e, t) =>
                  r.createElement(
                    r.Fragment,
                    { key: t },
                    c[t]
                      ? r.createElement(
                          'span',
                          { className: o(a.highlighted, l) },
                          e
                        )
                      : r.createElement('span', null, e)
                  )
                )
            : s
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
    51613: (e, t, n) => {
      'use strict';
      n.d(t, { PopupMenuSeparator: () => s });
      var r = n(50959),
        o = n(97754),
        i = n.n(o),
        a = n(92910);
      function s(e) {
        const { size: t = 'normal', className: n, ariaHidden: o = !1 } = e;
        return r.createElement('div', {
          className: i()(
            a.separator,
            'small' === t && a.small,
            'normal' === t && a.normal,
            'large' === t && a.large,
            n
          ),
          role: 'separator',
          'aria-hidden': o,
        });
      }
    },
    20520: (e, t, n) => {
      'use strict';
      n.d(t, { PopupMenu: () => h });
      var r = n(50959),
        o = n(962),
        i = n(62942),
        a = n(65718),
        s = n(27317),
        l = n(29197);
      const c = r.createContext(void 0);
      var u = n(36383);
      const d = r.createContext({ setMenuMaxWidth: !1 });
      function h(e) {
        const {
            controller: t,
            children: n,
            isOpened: h,
            closeOnClickOutside: p = !0,
            doNotCloseOn: f,
            onClickOutside: m,
            onClose: v,
            onKeyboardClose: g,
            'data-name': y = 'popup-menu-container',
            ...C
          } = e,
          E = (0, r.useContext)(l.CloseDelegateContext),
          _ = r.useContext(d),
          b = (0, r.useContext)(c),
          w = (0, u.useOutsideEvent)({
            handler: function (e) {
              m && m(e);
              if (!p) return;
              const t = (0, i.default)(f) ? f() : null == f ? [] : [f];
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
        return h
          ? r.createElement(
              a.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              r.createElement(
                'span',
                { ref: w, style: { pointerEvents: 'auto' } },
                r.createElement(
                  s.Menu,
                  {
                    ...C,
                    onClose: v,
                    onKeyboardClose: g,
                    onScroll: function (t) {
                      const { onScroll: n } = e;
                      n && n(t);
                    },
                    customCloseDelegate: E,
                    customRemeasureDelegate: b,
                    ref: t,
                    'data-name': y,
                    limitMaxWidth: _.setMenuMaxWidth,
                  },
                  n
                )
              )
            )
          : null;
      }
    },
    10381: (e, t, n) => {
      'use strict';
      n.d(t, { ToolWidgetCaret: () => l });
      var r = n(50959),
        o = n(97754),
        i = n(9745),
        a = n(34587),
        s = n(578);
      function l(e) {
        const { dropped: t, className: n } = e;
        return r.createElement(i.Icon, {
          className: o(n, a.icon, { [a.dropped]: t }),
          icon: s,
        });
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
              const i = n[o] || o;
              i in e && (r[o] = [e[i], t[o]].join(' '));
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
        i = Symbol.for('react.strict_mode'),
        a = Symbol.for('react.profiler'),
        s = Symbol.for('react.provider'),
        l = Symbol.for('react.context'),
        c = Symbol.for('react.forward_ref'),
        u = Symbol.for('react.suspense'),
        d = Symbol.for('react.memo'),
        h = Symbol.for('react.lazy'),
        p = Symbol.iterator;
      var f = {
          isMounted: function () {
            return !1;
          },
          enqueueForceUpdate: function () {},
          enqueueReplaceState: function () {},
          enqueueSetState: function () {},
        },
        m = Object.assign,
        v = {};
      function g(e, t, n) {
        (this.props = e),
          (this.context = t),
          (this.refs = v),
          (this.updater = n || f);
      }
      function y() {}
      function C(e, t, n) {
        (this.props = e),
          (this.context = t),
          (this.refs = v),
          (this.updater = n || f);
      }
      (g.prototype.isReactComponent = {}),
        (g.prototype.setState = function (e, t) {
          if ('object' != typeof e && 'function' != typeof e && null != e)
            throw Error(
              'setState(...): takes an object of state variables to update or a function which returns an object of state variables.'
            );
          this.updater.enqueueSetState(this, e, t, 'setState');
        }),
        (g.prototype.forceUpdate = function (e) {
          this.updater.enqueueForceUpdate(this, e, 'forceUpdate');
        }),
        (y.prototype = g.prototype);
      var E = (C.prototype = new y());
      (E.constructor = C), m(E, g.prototype), (E.isPureReactComponent = !0);
      var _ = Array.isArray,
        b = Object.prototype.hasOwnProperty,
        w = { current: null },
        x = { key: !0, ref: !0, __self: !0, __source: !0 };
      function k(e, t, r) {
        var o,
          i = {},
          a = null,
          s = null;
        if (null != t)
          for (o in (void 0 !== t.ref && (s = t.ref),
          void 0 !== t.key && (a = '' + t.key),
          t))
            b.call(t, o) && !x.hasOwnProperty(o) && (i[o] = t[o]);
        var l = arguments.length - 2;
        if (1 === l) i.children = r;
        else if (1 < l) {
          for (var c = Array(l), u = 0; u < l; u++) c[u] = arguments[u + 2];
          i.children = c;
        }
        if (e && e.defaultProps)
          for (o in (l = e.defaultProps)) void 0 === i[o] && (i[o] = l[o]);
        return {
          $$typeof: n,
          type: e,
          key: a,
          ref: s,
          props: i,
          _owner: w.current,
        };
      }
      function S(e) {
        return 'object' == typeof e && null !== e && e.$$typeof === n;
      }
      var A = /\/+/g;
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
      function D(e, t, o, i, a) {
        var s = typeof e;
        ('undefined' !== s && 'boolean' !== s) || (e = null);
        var l = !1;
        if (null === e) l = !0;
        else
          switch (s) {
            case 'string':
            case 'number':
              l = !0;
              break;
            case 'object':
              switch (e.$$typeof) {
                case n:
                case r:
                  l = !0;
              }
          }
        if (l)
          return (
            (a = a((l = e))),
            (e = '' === i ? '.' + N(l, 0) : i),
            _(a)
              ? ((o = ''),
                null != e && (o = e.replace(A, '$&/') + '/'),
                D(a, t, o, '', function (e) {
                  return e;
                }))
              : null != a &&
                (S(a) &&
                  (a = (function (e, t) {
                    return {
                      $$typeof: n,
                      type: e.type,
                      key: t,
                      ref: e.ref,
                      props: e.props,
                      _owner: e._owner,
                    };
                  })(
                    a,
                    o +
                      (!a.key || (l && l.key === a.key)
                        ? ''
                        : ('' + a.key).replace(A, '$&/') + '/') +
                      e
                  )),
                t.push(a)),
            1
          );
        if (((l = 0), (i = '' === i ? '.' : i + ':'), _(e)))
          for (var c = 0; c < e.length; c++) {
            var u = i + N((s = e[c]), c);
            l += D(s, t, o, u, a);
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
            l += D((s = s.value), t, o, (u = i + N(s, c++)), a);
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
        return l;
      }
      function I(e, t, n) {
        if (null == e) return e;
        var r = [],
          o = 0;
        return (
          D(e, r, '', '', function (e) {
            return t.call(n, e, o++);
          }),
          r
        );
      }
      function R(e) {
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
      var M = { current: null },
        L = { transition: null },
        T = {
          ReactCurrentDispatcher: M,
          ReactCurrentBatchConfig: L,
          ReactCurrentOwner: w,
        };
      (t.Children = {
        map: I,
        forEach: function (e, t, n) {
          I(
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
            I(e, function () {
              t++;
            }),
            t
          );
        },
        toArray: function (e) {
          return (
            I(e, function (e) {
              return e;
            }) || []
          );
        },
        only: function (e) {
          if (!S(e))
            throw Error(
              'React.Children.only expected to receive a single React element child.'
            );
          return e;
        },
      }),
        (t.Component = g),
        (t.Fragment = o),
        (t.Profiler = a),
        (t.PureComponent = C),
        (t.StrictMode = i),
        (t.Suspense = u),
        (t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = T),
        (t.cloneElement = function (e, t, r) {
          if (null == e)
            throw Error(
              'React.cloneElement(...): The argument must be a React element, but you passed ' +
                e +
                '.'
            );
          var o = m({}, e.props),
            i = e.key,
            a = e.ref,
            s = e._owner;
          if (null != t) {
            if (
              (void 0 !== t.ref && ((a = t.ref), (s = w.current)),
              void 0 !== t.key && (i = '' + t.key),
              e.type && e.type.defaultProps)
            )
              var l = e.type.defaultProps;
            for (c in t)
              b.call(t, c) &&
                !x.hasOwnProperty(c) &&
                (o[c] = void 0 === t[c] && void 0 !== l ? l[c] : t[c]);
          }
          var c = arguments.length - 2;
          if (1 === c) o.children = r;
          else if (1 < c) {
            l = Array(c);
            for (var u = 0; u < c; u++) l[u] = arguments[u + 2];
            o.children = l;
          }
          return {
            $$typeof: n,
            type: e.type,
            key: i,
            ref: a,
            props: o,
            _owner: s,
          };
        }),
        (t.createContext = function (e) {
          return (
            ((e = {
              $$typeof: l,
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
        (t.createElement = k),
        (t.createFactory = function (e) {
          var t = k.bind(null, e);
          return (t.type = e), t;
        }),
        (t.createRef = function () {
          return { current: null };
        }),
        (t.forwardRef = function (e) {
          return { $$typeof: c, render: e };
        }),
        (t.isValidElement = S),
        (t.lazy = function (e) {
          return {
            $$typeof: h,
            _payload: { _status: -1, _result: e },
            _init: R,
          };
        }),
        (t.memo = function (e, t) {
          return { $$typeof: d, type: e, compare: void 0 === t ? null : t };
        }),
        (t.startTransition = function (e) {
          var t = L.transition;
          L.transition = {};
          try {
            e();
          } finally {
            L.transition = t;
          }
        }),
        (t.unstable_act = function () {
          throw Error(
            'act(...) is not supported in production builds of React.'
          );
        }),
        (t.useCallback = function (e, t) {
          return M.current.useCallback(e, t);
        }),
        (t.useContext = function (e) {
          return M.current.useContext(e);
        }),
        (t.useDebugValue = function () {}),
        (t.useDeferredValue = function (e) {
          return M.current.useDeferredValue(e);
        }),
        (t.useEffect = function (e, t) {
          return M.current.useEffect(e, t);
        }),
        (t.useId = function () {
          return M.current.useId();
        }),
        (t.useImperativeHandle = function (e, t, n) {
          return M.current.useImperativeHandle(e, t, n);
        }),
        (t.useInsertionEffect = function (e, t) {
          return M.current.useInsertionEffect(e, t);
        }),
        (t.useLayoutEffect = function (e, t) {
          return M.current.useLayoutEffect(e, t);
        }),
        (t.useMemo = function (e, t) {
          return M.current.useMemo(e, t);
        }),
        (t.useReducer = function (e, t, n) {
          return M.current.useReducer(e, t, n);
        }),
        (t.useRef = function (e) {
          return M.current.useRef(e);
        }),
        (t.useState = function (e) {
          return M.current.useState(e);
        }),
        (t.useSyncExternalStore = function (e, t, n) {
          return M.current.useSyncExternalStore(e, t, n);
        }),
        (t.useTransition = function () {
          return M.current.useTransition();
        }),
        (t.version = '18.2.0');
    },
    50959: (e, t, n) => {
      'use strict';
      e.exports = n(95257);
    },
    12989: (e) => {
      e.exports = {
        summary: 'summary-ynHBVe1n',
        hovered: 'hovered-ynHBVe1n',
        caret: 'caret-ynHBVe1n',
      };
    },
    76197: (e, t, n) => {
      'use strict';
      n.d(t, { CollapsibleSection: () => l });
      var r = n(50959),
        o = n(97754),
        i = n.n(o),
        a = n(10381),
        s = n(12989);
      const l = (0, r.forwardRef)(function (e, t) {
        const {
          open: n,
          summary: o,
          children: l,
          onStateChange: c,
          tabIndex: u,
          className: d,
          ...h
        } = e;
        return r.createElement(
          r.Fragment,
          null,
          r.createElement(
            'div',
            {
              ...h,
              className: i()(d, s.summary),
              onClick: function () {
                c && c(!n);
              },
              'data-open': n,
              ref: t,
              tabIndex: u,
            },
            o,
            r.createElement(a.ToolWidgetCaret, {
              className: s.caret,
              dropped: Boolean(n),
            })
          ),
          n && l
        );
      });
    },
    12811: (e, t, n) => {
      'use strict';
      n.d(t, {
        HorizontalAttachEdge: () => o,
        HorizontalDropDirection: () => a,
        VerticalAttachEdge: () => r,
        VerticalDropDirection: () => i,
        getPopupPositioner: () => c,
      });
      var r,
        o,
        i,
        a,
        s = n(50151);
      !(function (e) {
        (e[(e.Top = 0)] = 'Top'), (e[(e.Bottom = 1)] = 'Bottom');
      })(r || (r = {})),
        (function (e) {
          (e[(e.Left = 0)] = 'Left'), (e[(e.Right = 1)] = 'Right');
        })(o || (o = {})),
        (function (e) {
          (e[(e.FromTopToBottom = 0)] = 'FromTopToBottom'),
            (e[(e.FromBottomToTop = 1)] = 'FromBottomToTop');
        })(i || (i = {})),
        (function (e) {
          (e[(e.FromLeftToRight = 0)] = 'FromLeftToRight'),
            (e[(e.FromRightToLeft = 1)] = 'FromRightToLeft');
        })(a || (a = {}));
      const l = {
        verticalAttachEdge: r.Bottom,
        horizontalAttachEdge: o.Left,
        verticalDropDirection: i.FromTopToBottom,
        horizontalDropDirection: a.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1,
      };
      function c(e, t) {
        return (n, c) => {
          const u = (0, s.ensureNotNull)(e).getBoundingClientRect(),
            {
              verticalAttachEdge: d = l.verticalAttachEdge,
              verticalDropDirection: h = l.verticalDropDirection,
              horizontalAttachEdge: p = l.horizontalAttachEdge,
              horizontalDropDirection: f = l.horizontalDropDirection,
              horizontalMargin: m = l.horizontalMargin,
              verticalMargin: v = l.verticalMargin,
              matchButtonAndListboxWidths: g = l.matchButtonAndListboxWidths,
            } = t,
            y = d === r.Top ? -1 * v : v,
            C = p === o.Right ? u.right : u.left,
            E = d === r.Top ? u.top : u.bottom,
            _ = {
              x: C - (f === a.FromRightToLeft ? n : 0) + m,
              y: E - (h === i.FromBottomToTop ? c : 0) + y,
            };
          return g && (_.overrideWidth = u.width), _;
        };
      }
    },
    84298: (e, t, n) => {
      'use strict';
      n.r(t), n.d(t, { currencyActions: () => s });
      var r = n(50151),
        o = n(44352),
        i = n(89691),
        a = n(79188);
      function s(e, t, s) {
        if (null === t || t.readOnly) return [];
        const l = [],
          c = (t) => {
            e.setPriceScaleCurrency(s, t);
          },
          u = t.selectedCurrency,
          d = t.originalCurrencies,
          h = t.baseCurrencies,
          p = t.displayedValues,
          f = a.favoriteCurrencyUnitConversionService.get().currencies,
          m = { id: 'first_section', actions: [] };
        if (d.size > 1) {
          const e = (0, i.createAction)(
            'Mixed',
            o.t(null, void 0, n(95093)),
            void 0,
            void 0,
            null === t.selectedCurrency,
            () => c(null)
          );
          m.actions.push(e);
        }
        const v = e.model().availableCurrencies();
        if (null !== u) {
          const e = (0, r.ensureNotNull)(v.item(u)),
            t = (0, i.createAction)(
              u,
              (0, r.ensureDefined)(p.get(u)),
              e.logoUrl,
              e.description,
              !0,
              () => {},
              f.has(u),
              () =>
                a.favoriteCurrencyUnitConversionService.toggle('currencies', u)
            );
          m.actions.push(t);
        }
        const g = v.filterConvertible(h, (e) => e !== u && d.has(e));
        for (const e of g) {
          const n = (0, r.ensureNotNull)(v.item(e.id));
          m.actions.push(
            (0, i.createAction)(
              e.id,
              e.code,
              n.logoUrl,
              n.description,
              t.selectedCurrency === e.id,
              () => c(e.id),
              f.has(e.id),
              () =>
                a.favoriteCurrencyUnitConversionService.toggle(
                  'currencies',
                  e.id
                )
            )
          );
        }
        m.actions.length > 0 && l.push(m);
        const y = v.filterConvertible(h, (e) => e !== u && !d.has(e)),
          C = [],
          E = [];
        for (const e of y) {
          const n = (0, r.ensureNotNull)(v.item(e.id)),
            o = f.has(e.id),
            s = (0, i.createAction)(
              e.id,
              e.code,
              n.logoUrl,
              n.description,
              t.selectedCurrency === e.id,
              () => c(e.id),
              o,
              () =>
                a.favoriteCurrencyUnitConversionService.toggle(
                  'currencies',
                  e.id
                )
            );
          o ? C.push(s) : E.push(s);
        }
        return (
          (E.length > 0 || C.length > 0) &&
            l.push({ id: 'second_section', actions: C.concat(E) }),
          l
        );
      }
    },
    79188: (e, t, n) => {
      'use strict';
      n.d(t, { favoriteCurrencyUnitConversionService: () => s });
      var r = n(56840),
        o = n(21097),
        i = n(68456);
      class a extends i.AbstractJsonStoreService {
        constructor(e, t) {
          super(
            e,
            t,
            'FAVORITE_CURRENCY_UNIT_CONVERSION_CHANGED',
            'currencyUnitConversion.favorites',
            { currencies: new Set(), units: new Set() }
          );
        }
        add(e, t) {
          const n = this.get();
          n[e].add(t), this.set(n);
        }
        remove(e, t) {
          const n = this.get();
          n[e].delete(t) && this.set(n);
        }
        toggle(e, t) {
          this.get()[e].has(t) ? this.remove(e, t) : this.add(e, t);
        }
        _serialize(e) {
          return [[...e.currencies], [...e.units]];
        }
        _deserialize(e) {
          return { currencies: new Set(e[0]), units: new Set(e[1]) };
        }
      }
      const s = new a(o.TVXWindowEvents, r);
    },
    14818: (e, t, n) => {
      'use strict';
      n.r(t), n.d(t, { unitActions: () => s });
      var r = n(50151),
        o = n(44352),
        i = n(89691),
        a = n(79188);
      function s(e, t, s) {
        if (null === t || 0 === t.availableGroups.size) return [];
        const l = [],
          c = (t) => {
            e.setPriceScaleUnit(s, t);
          },
          u = t.selectedUnit,
          d = t.originalUnits,
          h = t.names,
          p = t.descriptions,
          f = a.favoriteCurrencyUnitConversionService.get().units,
          m = { actions: [], id: 'first_section' };
        if (d.size > 1) {
          const e = (0, i.createAction)(
            'Mixed',
            o.t(null, void 0, n(95093)),
            void 0,
            void 0,
            null === t.selectedUnit,
            () => c(null)
          );
          m.actions.push(e);
        }
        const v = e.model().availableUnits();
        if (null !== u) {
          const e = (0, i.createAction)(
            u,
            (0, r.ensureDefined)(h.get(u)),
            void 0,
            (0, r.ensureDefined)(p.get(u)),
            !0,
            () => {},
            f.has(u),
            () => a.favoriteCurrencyUnitConversionService.toggle('units', u)
          );
          m.actions.push(e);
        }
        const g = v.unitsByGroups(t.availableGroups),
          y = [],
          C = [];
        for (const e of g)
          for (const t of e.units) {
            const e = f.has(t.id);
            if (t.id === u || (!e && !d.has(t.id))) continue;
            const n = (0, i.createAction)(
              t.id,
              t.name,
              void 0,
              t.description,
              !1,
              () => c(t.id),
              e,
              () =>
                a.favoriteCurrencyUnitConversionService.toggle('units', t.id)
            );
            e ? C.push(n) : y.push(n);
          }
        (y.length > 0 || C.length > 0) &&
          m.actions.push(
            ...C.sort((e, t) =>
              e.label.toLowerCase().localeCompare(t.label.toLowerCase())
            ),
            ...y
          ),
          m.actions.length > 0 && l.push(m);
        const E = u && v.unitGroupById(u);
        if (null !== E)
          for (const e of g) {
            if (e.name !== E) continue;
            const t = [];
            for (const n of e.units)
              n.id === u ||
                d.has(n.id) ||
                f.has(n.id) ||
                t.push(
                  (0, i.createAction)(
                    n.id,
                    n.name,
                    void 0,
                    n.description,
                    !1,
                    () => c(n.id),
                    !1,
                    () =>
                      a.favoriteCurrencyUnitConversionService.toggle(
                        'units',
                        n.id
                      )
                  )
                );
            t.length > 0 && l.push({ id: e.name, name: e.name, actions: t });
          }
        for (const e of g) {
          if (e.name === E) continue;
          const t = [];
          for (const n of e.units)
            n.id === u ||
              d.has(n.id) ||
              f.has(n.id) ||
              t.push(
                (0, i.createAction)(
                  n.id,
                  n.name,
                  void 0,
                  n.description,
                  !1,
                  () => c(n.id),
                  !1,
                  () =>
                    a.favoriteCurrencyUnitConversionService.toggle(
                      'units',
                      n.id
                    )
                )
              );
          t.length > 0 && l.push({ id: e.name, name: e.name, actions: t });
        }
        return l;
      }
    },
    89691: (e, t, n) => {
      'use strict';
      function r(e, t, n, r, o, i, a, s) {
        return {
          id: e,
          label: t,
          icon: n,
          description: r,
          isActive: o,
          onClick: i,
          isFavorite: a,
          onFavoriteClick: s,
        };
      }
      n.d(t, { createAction: () => r });
    },
    578: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>';
    },
    7720: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="currentColor"><path d="m.58 1.42.82-.82 15 15-.82.82z"/><path d="m.58 15.58 15-15 .82.82-15 15z"/></svg>';
    },
    69311: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.7 9l4.65-4.65-.7-.7L9 8.29 4.35 3.65l-.7.7L8.29 9l-4.64 4.65.7.7L9 9.71l4.65 4.64.7-.7L9.71 9z"/></svg>';
    },
    48471: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M11.85 11.93A5.48 5.48 0 0 0 8 2.5a5.5 5.5 0 1 0 3.85 9.43zm0 0L16 16"/></svg>';
    },
    69859: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path stroke="currentColor" d="M12.4 12.5a7 7 0 1 0-4.9 2 7 7 0 0 0 4.9-2zm0 0l5.101 5"/></svg>';
    },
    39146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>';
    },
    48010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>';
    },
    20036: (e) => {
      e.exports = {
        ar: ['إلغاء'],
        ca_ES: ['Cancel·la'],
        cs: ['Zrušit'],
        de: ['Abbrechen'],
        el: ['Άκυρο'],
        en: 'Cancel',
        es: ['Cancelar'],
        fa: ['لغو'],
        fr: ['Annuler'],
        he_IL: ['ביטול'],
        hu_HU: ['Törlés'],
        id_ID: ['Batal'],
        it: ['Annulla'],
        ja: ['キャンセル'],
        ko: ['취소'],
        ms_MY: ['Batal'],
        nl_NL: ['Annuleren'],
        pl: ['Anuluj'],
        pt: ['Cancelar'],
        ro: 'Cancel',
        ru: ['Отмена'],
        sv: ['Avbryt'],
        th: ['ยกเลิก'],
        tr: ['İptal'],
        vi: ['Hủy bỏ'],
        zh: ['取消'],
        zh_TW: ['取消'],
      };
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
    52298: (e) => {
      e.exports = {
        ar: ['بحث'],
        ca_ES: ['Cercar'],
        cs: ['Hledat'],
        de: ['Suche'],
        el: ['Αναζήτησή'],
        en: 'Search',
        es: ['Buscar'],
        fa: ['جستجو'],
        fr: ['Chercher'],
        he_IL: ['חפש'],
        hu_HU: ['Keresés'],
        id_ID: ['Cari'],
        it: ['Cerca'],
        ja: ['検索'],
        ko: ['찾기'],
        ms_MY: ['Cari'],
        nl_NL: ['Zoeken'],
        pl: ['Szukaj'],
        pt: ['Pesquisar'],
        ro: 'Search',
        ru: ['Поиск'],
        sv: ['Sök'],
        th: ['ค้นหา'],
        tr: ['Ara'],
        vi: ['Tìm kiếm'],
        zh: ['搜索'],
        zh_TW: ['搜尋'],
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
