(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4013],
  {
    23428: (e) => {
      e.exports = {
        button: 'button-PYEOTd6i',
        disabled: 'disabled-PYEOTd6i',
        hidden: 'hidden-PYEOTd6i',
        icon: 'icon-PYEOTd6i',
        dropped: 'dropped-PYEOTd6i',
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
    66986: (e) => {
      e.exports = {
        button: 'button-tFul0OhX',
        'button-children': 'button-children-tFul0OhX',
        hiddenArrow: 'hiddenArrow-tFul0OhX',
        invisibleFocusHandler: 'invisibleFocusHandler-tFul0OhX',
      };
    },
    60673: (e) => {
      e.exports = { placeholder: 'placeholder-V6ceS6BN' };
    },
    45719: (e) => {
      e.exports = { separator: 'separator-Pf4rIzEt' };
    },
    86332: (e, t, n) => {
      'use strict';
      n.d(t, { ControlGroupContext: () => o });
      const o = n(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      });
    },
    36104: (e, t, n) => {
      'use strict';
      n.d(t, { useControlDisclosure: () => l });
      var o = n(7953);
      function l(e) {
        const { intent: t, highlight: n, ...l } = e,
          { isFocused: a, ...r } = (0, o.useDisclosure)(l);
        return {
          ...r,
          isFocused: a,
          highlight: null != n ? n : a,
          intent: null != t ? t : a ? 'primary' : 'default',
        };
      }
    },
    53017: (e, t, n) => {
      'use strict';
      function o(e) {
        return (t) => {
          e.forEach((e) => {
            'function' == typeof e ? e(t) : null != e && (e.current = t);
          });
        };
      }
      function l(e) {
        return o([e]);
      }
      n.d(t, { isomorphicRef: () => l, mergeRefs: () => o });
    },
    35057: (e, t, n) => {
      'use strict';
      n.d(t, { AdaptivePopupDialog: () => y });
      var o = n(50959),
        l = n(50151);
      var a = n(97754),
        r = n.n(a),
        i = n(68335),
        s = n(35749),
        d = n(63016),
        c = n(1109),
        u = n(24437),
        p = n(90692),
        h = n(95711);
      var m = n(52092),
        v = n(76422),
        b = n(9745);
      const f = o.createContext({ setHideClose: () => {} });
      var g = n(7720),
        C = n(69827);
      function _(e) {
        const {
            title: t,
            titleTextWrap: n = !1,
            subtitle: l,
            showCloseIcon: a = !0,
            onClose: i,
            onCloseButtonKeyDown: s,
            renderBefore: d,
            renderAfter: c,
            draggable: u,
            className: p,
            unsetAlign: h,
            closeAriaLabel: m,
            closeButtonReference: v,
          } = e,
          [_, E] = (0, o.useState)(!1);
        return o.createElement(
          f.Provider,
          { value: { setHideClose: E } },
          o.createElement(
            'div',
            { className: r()(C.container, p, (l || h) && C.unsetAlign) },
            d,
            o.createElement(
              'div',
              { 'data-dragg-area': u, className: C.title },
              o.createElement(
                'div',
                { className: r()(n ? C.textWrap : C.ellipsis) },
                t
              ),
              l &&
                o.createElement(
                  'div',
                  { className: r()(C.ellipsis, C.subtitle) },
                  l
                )
            ),
            c,
            a &&
              !_ &&
              o.createElement(
                'button',
                {
                  className: C.close,
                  onClick: i,
                  onKeyDown: s,
                  'data-name': 'close',
                  'aria-label': m,
                  type: 'button',
                  ref: v,
                },
                o.createElement(b.Icon, {
                  className: C.icon,
                  icon: g,
                  'data-name': 'close',
                  'data-role': 'button',
                })
              )
          )
        );
      }
      var E = n(53017),
        x = n(55596);
      const A = { vertical: 20 },
        w = { vertical: 0 };
      class y extends o.PureComponent {
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
                    window.matchMedia(u.DialogBreakpoints.TabletSmall).matches
                );
            }),
            (this._handleKeyDown = (e) => {
              if (!e.defaultPrevented) {
                if (
                  (this.props.onKeyDown && this.props.onKeyDown(e),
                  27 === (0, i.hashFromEvent)(e))
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
                    o = (0, l.ensureNotNull)(this._reference);
                  if (null !== n) {
                    if (
                      (e.preventDefault(),
                      'true' === (t = n).getAttribute('data-haspopup') &&
                        'true' !== t.getAttribute('data-expanded'))
                    )
                      return void this._handleClose();
                    if ((0, s.isTextEditingField)(n)) return void o.focus();
                    if (o.contains(n))
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
                  [9, i.Modifiers.Shift + 9].includes(
                    (0, i.hashFromEvent)(n)
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
            v.subscribe(
              m.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
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
            v.unsubscribe(
              m.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
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
          (0, l.ensureNotNull)(this._reference).focus();
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
              isOpened: l,
              title: a,
              titleTextWrap: i,
              dataName: s,
              onClickOutside: m,
              additionalElementPos: v,
              additionalHeaderElement: b,
              backdrop: f,
              shouldForceFocus: g = !0,
              shouldReturnFocus: C,
              showSeparator: y,
              subtitle: N,
              draggable: T = !0,
              fullScreen: O = !1,
              showCloseIcon: I = !0,
              rounded: k = !0,
              isAnimationEnabled: D,
              growPoint: S,
              dialogTooltip: L,
              unsetHeaderAlign: B,
              onDragStart: M,
              dataDialogName: K,
              closeAriaLabel: z,
              containerAriaLabel: F,
              reference: P,
              containerTabIndex: R,
              closeButtonReference: W,
              onCloseButtonKeyDown: H,
            } = this.props,
            U = 'after' !== v ? b : void 0,
            G = 'after' === v ? b : void 0,
            Y = 'string' == typeof a ? a : K || '',
            Z = (0, E.mergeRefs)([this._handleReference, P]);
          return o.createElement(
            p.MatchMedia,
            { rule: u.DialogBreakpoints.SmallHeight },
            (v) =>
              o.createElement(
                p.MatchMedia,
                { rule: u.DialogBreakpoints.TabletSmall },
                (u) =>
                  o.createElement(
                    d.PopupDialog,
                    {
                      rounded: !(u || O) && k,
                      className: r()(x.dialog, e),
                      isOpened: l,
                      reference: Z,
                      onKeyDown: this._handleKeyDown,
                      onClickOutside: m,
                      onClickBackdrop: m,
                      fullscreen: u || O,
                      guard: v ? w : A,
                      boundByScreen: u || O,
                      shouldForceFocus: g,
                      shouldReturnFocus: C,
                      backdrop: f,
                      draggable: T,
                      isAnimationEnabled: D,
                      growPoint: S,
                      name: this.props.dataName,
                      dialogTooltip: L,
                      onDragStart: M,
                      containerAriaLabel: F,
                      containerTabIndex: R,
                    },
                    o.createElement(
                      'div',
                      {
                        className: r()(x.wrapper, t),
                        'data-name': s,
                        'data-dialog-name': Y,
                      },
                      void 0 !== a &&
                        o.createElement(_, {
                          draggable: T && !(u || O),
                          onClose: this._handleCloseBtnClick,
                          renderAfter: G,
                          renderBefore: U,
                          subtitle: N,
                          title: a,
                          titleTextWrap: i,
                          showCloseIcon: I,
                          className: n,
                          unsetAlign: B,
                          closeAriaLabel: z,
                          closeButtonReference: W,
                          onCloseButtonKeyDown: H,
                        }),
                      y &&
                        o.createElement(c.Separator, {
                          className: x.separator,
                        }),
                      o.createElement(h.PopupContext.Consumer, null, (e) =>
                        this._renderChildren(e, u || O)
                      )
                    )
                  )
              )
          );
        }
      }
    },
    59054: (e, t, n) => {
      'use strict';
      n.d(t, { ControlDisclosureView: () => b });
      var o = n(50959),
        l = n(97754),
        a = n.n(l),
        r = n(38528),
        i = n(67029),
        s = n(78274),
        d = n(4523),
        c = n(9745),
        u = n(2948),
        p = n(23428);
      function h(e) {
        const { isDropped: t } = e;
        return o.createElement(c.Icon, {
          className: a()(p.icon, t && p.dropped),
          icon: u,
        });
      }
      function m(e) {
        const { className: t, disabled: n, isDropped: l } = e;
        return o.createElement(
          'span',
          { className: a()(p.button, n && p.disabled, t) },
          o.createElement(h, { isDropped: l })
        );
      }
      var v = n(66986);
      const b = o.forwardRef((e, t) => {
        const {
            listboxId: n,
            className: l,
            listboxClassName: c,
            listboxTabIndex: u,
            hideArrowButton: p,
            matchButtonAndListboxWidths: h,
            popupPosition: b,
            disabled: f,
            isOpened: g,
            scrollWrapReference: C,
            repositionOnScroll: _,
            closeOnHeaderOverlap: E,
            listboxReference: x,
            size: A = 'small',
            onClose: w,
            onOpen: y,
            onListboxFocus: N,
            onListboxBlur: T,
            onListboxKeyDown: O,
            buttonChildren: I,
            children: k,
            caretClassName: D,
            listboxAria: S,
            ...L
          } = e,
          B = (0, o.useRef)(null),
          M =
            !p &&
            o.createElement(
              s.EndSlot,
              null,
              o.createElement(m, { isDropped: g, disabled: f, className: D })
            );
        return o.createElement(d.PopupMenuDisclosureView, {
          buttonRef: B,
          listboxId: n,
          listboxClassName: c,
          listboxTabIndex: u,
          isOpened: g,
          onClose: w,
          onOpen: y,
          listboxReference: x,
          scrollWrapReference: C,
          onListboxFocus: N,
          onListboxBlur: T,
          onListboxKeyDown: O,
          listboxAria: S,
          matchButtonAndListboxWidths: h,
          popupPosition: b,
          button: o.createElement(i.ControlSkeleton, {
            ...L,
            'data-role': 'listbox',
            disabled: f,
            className: a()(v.button, l),
            size: A,
            ref: (0, r.useMergedRefs)([B, t]),
            middleSlot: o.createElement(
              s.MiddleSlot,
              null,
              o.createElement(
                'span',
                { className: a()(v['button-children'], p && v.hiddenArrow) },
                I
              )
            ),
            endSlot: M,
          }),
          popupChildren: k,
          repositionOnScroll: _,
          closeOnHeaderOverlap: E,
        });
      });
      b.displayName = 'ControlDisclosureView';
    },
    90405: (e, t, n) => {
      'use strict';
      n.d(t, { Select: () => C });
      var o = n(50959),
        l = n(22064),
        a = n(38528),
        r = n(16921),
        i = n(16396),
        s = n(12481),
        d = n(43370);
      var c = n(36762),
        u = n(26597),
        p = n(59054),
        h = n(36104),
        m = n(38223),
        v = n(60673);
      function b(e) {
        return !e.readonly;
      }
      function f(e, t) {
        var n;
        return null !== (n = null == t ? void 0 : t.id) && void 0 !== n
          ? n
          : (0, l.createDomId)(e, 'item', null == t ? void 0 : t.value);
      }
      function g(e) {
        var t, n;
        const { selectedItem: l, placeholder: a } = e;
        if (!l) return o.createElement('span', { className: v.placeholder }, a);
        const r =
          null !==
            (n =
              null !== (t = l.selectedContent) && void 0 !== t
                ? t
                : l.content) && void 0 !== n
            ? n
            : l.value;
        return o.createElement('span', null, r);
      }
      const C = o.forwardRef((e, t) => {
        const {
          id: n,
          menuClassName: v,
          menuItemClassName: C,
          tabIndex: _,
          disabled: E,
          highlight: x,
          intent: A,
          hideArrowButton: w,
          placeholder: y,
          addPlaceholderToItems: N = !0,
          value: T,
          'aria-labelledby': O,
          onFocus: I,
          onBlur: k,
          onClick: D,
          onChange: S,
          onKeyDown: L,
          repositionOnScroll: B = !0,
          openMenuOnEnter: M = !0,
          'aria-describedby': K,
          'aria-invalid': z,
          ...F
        } = e;
        let { items: P } = e;
        if (y && N) {
          P = [
            {
              value: void 0,
              content: y,
              id: (0, l.createDomId)(n, 'placeholder'),
            },
            ...P,
          ];
        }
        const {
            listboxId: R,
            isOpened: W,
            isFocused: H,
            buttonTabIndex: U,
            listboxTabIndex: G,
            highlight: Y,
            intent: Z,
            open: j,
            onOpen: V,
            close: X,
            toggle: Q,
            buttonFocusBindings: q,
            onButtonClick: $,
            buttonRef: J,
            listboxRef: ee,
            buttonAria: te,
          } = (0, h.useControlDisclosure)({
            id: n,
            disabled: E,
            buttonTabIndex: _,
            intent: A,
            highlight: x,
            onFocus: I,
            onBlur: k,
            onClick: D,
          }),
          ne = P.filter(b),
          oe = ne.find((e) => e.value === T),
          [le, ae, re] = (0, r.useKeepActiveItemIntoView)({ activeItem: oe }),
          ie = (0, l.joinDomIds)(O, n),
          se = ie.length > 0 ? ie : void 0,
          de = (0, o.useMemo)(
            () => ({
              role: 'listbox',
              'aria-labelledby': O,
              'aria-activedescendant': f(n, oe),
            }),
            [O, oe]
          ),
          ce = (0, o.useCallback)((e) => e.value === T, [T]),
          ue = (0, o.useCallback)((e) => S && S(e.value), [S]),
          pe = (0, c.useItemsKeyboardNavigation)(m.isRtl, ne, ce, ue, !1, {
            next: [40],
            previous: [38],
          }),
          he = (0, u.useKeyboardToggle)(Q, W || M),
          me = (0, u.useKeyboardClose)(W, X),
          ve = (0, u.useKeyboardOpen)(W, j),
          be = (0, u.useKeyboardEventHandler)([he, me, ve]),
          fe = (0, u.useKeyboardEventHandler)([pe, he, me]),
          ge = (function (e) {
            const t = (0, o.useRef)(''),
              n = (0, o.useMemo)(
                () =>
                  (0, s.default)(() => {
                    t.current = '';
                  }, 500),
                []
              ),
              l = (0, o.useMemo)(() => (0, d.default)(e, 200), [e]);
            return (0, o.useCallback)(
              (e) => {
                e.key.length > 0 &&
                  e.key.length < 3 &&
                  ((t.current += e.key), l(t.current, e), n());
              },
              [n, l]
            );
          })((t, n) => {
            const o = (function (e, t, n) {
              return e.find((e) => {
                var o;
                const l = t.toLowerCase();
                return (
                  !e.readonly &&
                  (n
                    ? n(e).toLowerCase().startsWith(l)
                    : !e.readonly &&
                      (('string' == typeof e.content &&
                        e.content.toLowerCase().startsWith(l)) ||
                        ('string' == typeof e.textContent &&
                          e.textContent.toLowerCase().startsWith(l)) ||
                        String(null !== (o = e.value) && void 0 !== o ? o : '')
                          .toLowerCase()
                          .startsWith(l)))
                );
              });
            })(ne, t, e.getSearchKey);
            void 0 !== o && S && (n.stopPropagation(), W || j(), S(o.value));
          });
        return o.createElement(
          p.ControlDisclosureView,
          {
            ...F,
            ...te,
            ...q,
            id: n,
            role: 'button',
            tabIndex: U,
            'aria-owns': te['aria-controls'],
            'aria-haspopup': 'listbox',
            'aria-labelledby': se,
            disabled: E,
            hideArrowButton: w,
            isFocused: H,
            isOpened: W,
            highlight: Y,
            intent: Z,
            ref: (0, a.useMergedRefs)([J, t]),
            onClick: $,
            onOpen: function () {
              re(oe, { duration: 0 }), V();
            },
            onClose: X,
            onKeyDown: function (e) {
              be(e), L && L(e);
              e.defaultPrevented || ge(e);
            },
            listboxId: R,
            listboxTabIndex: G,
            listboxClassName: v,
            listboxAria: de,
            'aria-describedby': K,
            'aria-invalid': z,
            listboxReference: ee,
            scrollWrapReference: le,
            onListboxKeyDown: function (e) {
              fe(e), e.defaultPrevented || ge(e);
            },
            buttonChildren: o.createElement(g, {
              selectedItem: oe,
              placeholder: y,
            }),
            repositionOnScroll: B,
          },
          P.map((e, t) => {
            var l;
            if (e.readonly)
              return o.createElement(
                o.Fragment,
                {
                  key: `readonly_item_${t}`,
                },
                e.content
              );
            const a = f(n, e);
            return o.createElement(i.PopupMenuItem, {
              key: a,
              id: a,
              className: C,
              role: 'option',
              'aria-selected': T === e.value,
              isActive: T === e.value,
              label: null !== (l = e.content) && void 0 !== l ? l : e.value,
              onClick: Ce,
              onClickArg: e.value,
              isDisabled: e.disabled,
              reference: (t) => ae(e, t),
            });
          })
        );
        function Ce(e) {
          S && S(e);
        }
      });
      C.displayName = 'Select';
    },
    1109: (e, t, n) => {
      'use strict';
      n.d(t, { Separator: () => r });
      var o = n(50959),
        l = n(97754),
        a = n(45719);
      function r(e) {
        return o.createElement('div', {
          className: l(a.separator, e.className),
        });
      }
    },
    89872: (e) => {
      e.exports = {
        scrollable: 'scrollable-uT4IUFMG',
        content: 'content-uT4IUFMG',
        row: 'row-uT4IUFMG',
        title: 'title-uT4IUFMG',
        control: 'control-uT4IUFMG',
      };
    },
    44762: (e, t, n) => {
      'use strict';
      n.r(t), n.d(t, { ToolWidgetIntervalsAddDialog: () => h });
      var o = n(50959),
        l = n(44352),
        a = n(50182),
        r = n(90405),
        i = n(31261),
        s = n(59064),
        d = n(86656),
        c = n(65817),
        u = n(89872);
      const p = c.INTERVALS.map((e) => ({ value: e.name, content: e.label }));
      function h(e) {
        const { onAdd: t, onClose: h, onUnmount: m } = e,
          [v, b] = (0, o.useState)(c.INTERVALS[0].name),
          [f, g] = (0, o.useState)('1');
        return (
          (0, o.useEffect)(
            () => () => {
              m && m();
            },
            []
          ),
          o.createElement(a.AdaptiveConfirmDialog, {
            dataName: 'add-custom-interval-dialog',
            title: l.t(null, void 0, n(92746)),
            isOpened: !0,
            onSubmit: function () {
              t(f, v), h();
            },
            onCancel: h,
            onClickOutside: h,
            onClose: h,
            render: () =>
              o.createElement(
                d.TouchScrollContainer,
                { className: u.scrollable, onScroll: _ },
                o.createElement(
                  'div',
                  { className: u.content },
                  o.createElement(
                    'div',
                    { className: u.row },
                    o.createElement(
                      'div',
                      { className: u.title },
                      l.t(null, void 0, n(58416))
                    ),
                    o.createElement(r.Select, {
                      id: 'metric-items',
                      className: u.control,
                      value: v,
                      items: p,
                      onChange: E,
                    })
                  ),
                  o.createElement(
                    'div',
                    { className: u.row },
                    o.createElement(
                      'div',
                      { className: u.title },
                      l.t(null, void 0, n(69466))
                    ),
                    o.createElement(i.InputControl, {
                      className: u.control,
                      inputMode: 'numeric',
                      maxLength: 6,
                      value: f,
                      onChange: C,
                    })
                  )
                )
              ),
            defaultActionOnClose: 'none',
            submitButtonText: l.t(null, void 0, n(54777)),
            submitOnEnterKey: !1,
            fullScreen: !0,
          })
        );
        function C(e) {
          const { value: t } = e.currentTarget;
          /^[0-9]*$/.test(t) && g(t);
        }
        function _() {
          s.globalCloseDelegate.fire();
        }
        function E(e) {
          b(e);
        }
      }
    },
    2948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M5.5 6.44a.75.75 0 1 0-1 1.12l1-1.12zM9 10.5l-.5.56c.29.25.71.25 1 0L9 10.5zm4.5-2.94a.75.75 0 0 0-1-1.12l1 1.12zm-9 0l4 3.5 1-1.12-4-3.5-1 1.12zm5 3.5l4-3.5-1-1.12-4 3.5 1 1.12z"/></svg>';
    },
    7720: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="currentColor"><path d="m.58 1.42.82-.82 15 15-.82.82z"/><path d="m.58 15.58 15-15 .82.82-15 15z"/></svg>';
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
    92746: (e) => {
      e.exports = {
        ar: ['إضافة فترة زمنية مخصصة'],
        ca_ES: ['Afegeix interval de temps personalitzat'],
        cs: 'Add custom time interval',
        de: ['Individuelles Zeit Interval hinzufügen'],
        el: 'Add custom time interval',
        en: 'Add custom time interval',
        es: ['Añadir intervalo de tiempo personalizado'],
        fa: 'Add custom time interval',
        fr: ['Ajouter un intervalle de temps personnalisé'],
        he_IL: ['הוסף אינטרוול זמן מותאם אישית'],
        hu_HU: 'Add custom time interval',
        id_ID: ['Tambahkan interval waktu khusus'],
        it: ['Aggiungi timeframe personalizzato'],
        ja: ['カスタム時間足を追加'],
        ko: ['커스텀 타임 인터벌 넣기'],
        ms_MY: ['Tambah selang masa tersuai'],
        nl_NL: 'Add custom time interval',
        pl: ['Dodaj niestandardowy przedział czasowy'],
        pt: ['Adicionar um tempo gráfico personalizado'],
        ro: 'Add custom time interval',
        ru: ['Добавить свой временной интервал'],
        sv: ['Lägg till anpassat tidsintervall'],
        th: ['เพิ่มช่วงเวลาแบบกำหนดเอง'],
        tr: ['Özel zaman aralığı ekle'],
        vi: ['Thêm khoảng thời gian tùy chỉnh'],
        zh: ['添加自定义事件周期'],
        zh_TW: ['增加自訂時間周期'],
      };
    },
    69466: (e) => {
      e.exports = {
        ar: ['الفاصل الزمني'],
        ca_ES: 'Interval',
        cs: 'Interval',
        de: ['Intervall'],
        el: 'Interval',
        en: 'Interval',
        es: ['Intervalo'],
        fa: ['بازه زمانی'],
        fr: ['Intervalle'],
        he_IL: ['אינטרוול'],
        hu_HU: ['Időköz'],
        id_ID: 'Interval',
        it: ['Timeframe'],
        ja: ['時間足'],
        ko: ['인터벌'],
        ms_MY: ['Selang Masa'],
        nl_NL: 'Interval',
        pl: ['Interwał'],
        pt: ['Tempo Gráfico'],
        ro: 'Interval',
        ru: ['Интервал'],
        sv: ['Intervall'],
        th: ['ช่วงเวลา'],
        tr: ['Aralık'],
        vi: ['Khoảng thời gian'],
        zh: ['周期'],
        zh_TW: ['週期'],
      };
    },
    68988: (e) => {
      e.exports = {
        ar: ['موافق'],
        ca_ES: ['Acceptar'],
        cs: 'Ok',
        de: 'Ok',
        el: 'Ok',
        en: 'Ok',
        es: ['Aceptar'],
        fa: 'Ok',
        fr: ["D'accord"],
        he_IL: ['אוקיי'],
        hu_HU: ['Oké'],
        id_ID: 'Ok',
        it: 'Ok',
        ja: ['OK'],
        ko: ['확인'],
        ms_MY: 'Ok',
        nl_NL: 'Ok',
        pl: 'Ok',
        pt: 'Ok',
        ro: 'Ok',
        ru: ['Ок'],
        sv: ['OK'],
        th: ['ตกลง'],
        tr: ['Tamam'],
        vi: 'Ok',
        zh: ['确认'],
        zh_TW: ['確認'],
      };
    },
    58416: (e) => {
      e.exports = {
        ar: ['نوع'],
        ca_ES: ['Tipus'],
        cs: ['Typ'],
        de: ['Typ'],
        el: ['Τύπος'],
        en: 'Type',
        es: ['Tipo'],
        fa: ['نوع'],
        fr: 'Type',
        he_IL: ['סוג'],
        hu_HU: ['Típus'],
        id_ID: ['Tipe'],
        it: ['Tipo'],
        ja: ['タイプ'],
        ko: ['타입'],
        ms_MY: ['Jenis'],
        nl_NL: 'Type',
        pl: ['Typ'],
        pt: ['Tipo'],
        ro: 'Type',
        ru: ['Тип'],
        sv: ['Typ'],
        th: ['ประเภท'],
        tr: ['Tip'],
        vi: ['Loại'],
        zh: ['类型'],
        zh_TW: ['種類'],
      };
    },
  },
]);
