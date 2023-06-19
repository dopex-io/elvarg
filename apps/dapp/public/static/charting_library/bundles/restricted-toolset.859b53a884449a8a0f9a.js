(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5516, 9685],
  {
    26574: (e) => {
      e.exports = {
        switcher: 'switcher-fwE97QDf',
        'thumb-wrapper': 'thumb-wrapper-fwE97QDf',
        'size-small': 'size-small-fwE97QDf',
        'size-medium': 'size-medium-fwE97QDf',
        'size-large': 'size-large-fwE97QDf',
        input: 'input-fwE97QDf',
        'intent-default': 'intent-default-fwE97QDf',
        'disable-active-state-styles': 'disable-active-state-styles-fwE97QDf',
        'intent-select': 'intent-select-fwE97QDf',
        track: 'track-fwE97QDf',
        thumb: 'thumb-fwE97QDf',
      };
    },
    88803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      };
    },
    17723: (e) => {
      e.exports = { footer: 'footer-dwINHZFL' };
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
    33963: (e) => {
      e.exports = {
        item: 'item-zwyEh4hn',
        label: 'label-zwyEh4hn',
        labelRow: 'labelRow-zwyEh4hn',
        toolbox: 'toolbox-zwyEh4hn',
      };
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
    17946: (e, t, a) => {
      'use strict';
      a.d(t, { CustomBehaviourContext: () => n });
      const n = (0, a(50959).createContext)({ enableActiveStateStyles: !0 });
      n.displayName = 'CustomBehaviourContext';
    },
    76974: (e, t, a) => {
      'use strict';
      a.d(t, { useIsMounted: () => i });
      var n = a(50959);
      const i = () => {
        const e = (0, n.useRef)(!1);
        return (
          (0, n.useEffect)(
            () => (
              (e.current = !0),
              () => {
                e.current = !1;
              }
            ),
            []
          ),
          e
        );
      };
    },
    24437: (e, t, a) => {
      'use strict';
      a.d(t, { DialogBreakpoints: () => i });
      var n = a(88803);
      const i = {
        SmallHeight: n['small-height-breakpoint'],
        TabletSmall: n['tablet-small-breakpoint'],
        TabletNormal: n['tablet-normal-breakpoint'],
      };
    },
    39362: (e, t, a) => {
      'use strict';
      a.d(t, { SymbolSearchDialogFooter: () => l });
      var n = a(50959),
        i = a(97754),
        o = a.n(i),
        s = a(17723);
      function l(e) {
        const { className: t, children: a } = e;
        return n.createElement('div', { className: o()(s.footer, t) }, a);
      }
    },
    36189: (e, t, a) => {
      'use strict';
      a.d(t, { FavoriteButton: () => d });
      var n = a(44352),
        i = a(50959),
        o = a(97754),
        s = a(9745),
        l = a(39146),
        r = a(48010),
        h = a(14877);
      const c = {
        add: n.t(null, void 0, a(44629)),
        remove: n.t(null, void 0, a(72482)),
      };
      function d(e) {
        const { className: t, isFilled: a, isActive: n, onClick: d, ...u } = e;
        return i.createElement(s.Icon, {
          ...u,
          className: o(
            h.favorite,
            'apply-common-tooltip',
            a && h.checked,
            n && h.active,
            t
          ),
          icon: a ? l : r,
          onClick: d,
          title: a ? c.remove : c.add,
        });
      }
    },
    37968: (e, t, a) => {
      'use strict';
      a.d(t, { useForceUpdate: () => i });
      var n = a(50959);
      const i = () => {
        const [, e] = (0, n.useReducer)((e) => e + 1, 0);
        return e;
      };
    },
    70412: (e, t, a) => {
      'use strict';
      a.d(t, {
        hoverMouseEventFilter: () => o,
        useAccurateHover: () => s,
        useHover: () => i,
      });
      var n = a(50959);
      function i() {
        const [e, t] = (0, n.useState)(!1);
        return [
          e,
          {
            onMouseOver: function (e) {
              o(e) && t(!0);
            },
            onMouseOut: function (e) {
              o(e) && t(!1);
            },
          },
        ];
      }
      function o(e) {
        return !e.currentTarget.contains(e.relatedTarget);
      }
      function s(e) {
        const [t, a] = (0, n.useState)(!1);
        return (
          (0, n.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return;
              const n = e.current.contains(t.target);
              a(n);
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
    81332: (e, t, a) => {
      'use strict';
      a.d(t, { multilineLabelWithIconAndToolboxTheme: () => s });
      var n = a(40173),
        i = a(71986),
        o = a(33963);
      const s = (0, n.mergeThemes)(i, o);
    },
    96040: (e, t, a) => {
      'use strict';
      a.d(t, { RemoveButton: () => h });
      var n = a(44352),
        i = a(50959),
        o = a(97754),
        s = a(9745),
        l = a(33765),
        r = a(27306);
      function h(e) {
        const {
          className: t,
          isActive: h,
          onClick: c,
          onMouseDown: d,
          title: u,
          hidden: v,
          'data-name': m = 'remove-button',
          ...p
        } = e;
        return i.createElement(s.Icon, {
          ...p,
          'data-name': m,
          className: o(
            r.button,
            'apply-common-tooltip',
            h && r.active,
            v && r.hidden,
            t
          ),
          icon: l,
          onClick: c,
          onMouseDown: d,
          title: u || n.t(null, void 0, a(34596)),
        });
      }
    },
    47102: (e) => {
      e.exports = {
        accessible: 'accessible-NQERJsv9',
        active: 'active-NQERJsv9',
      };
    },
    12989: (e) => {
      e.exports = {
        summary: 'summary-ynHBVe1n',
        hovered: 'hovered-ynHBVe1n',
        caret: 'caret-ynHBVe1n',
      };
    },
    90785: (e) => {
      e.exports = { accessible: 'accessible-raQdxQp0' };
    },
    89089: (e) => {
      e.exports = { button: 'button-LkmyTVRc', active: 'active-LkmyTVRc' };
    },
    20461: (e) => {
      e.exports = {
        wrapper: 'wrapper-psOC5oyI',
        labelRow: 'labelRow-psOC5oyI',
        label: 'label-psOC5oyI',
        labelHint: 'labelHint-psOC5oyI',
        labelOn: 'labelOn-psOC5oyI',
      };
    },
    40670: (e) => {
      e.exports = {
        wrapper: 'wrapper-bl9AR3Gv',
        hovered: 'hovered-bl9AR3Gv',
        withIcon: 'withIcon-bl9AR3Gv',
        labelRow: 'labelRow-bl9AR3Gv',
        label: 'label-bl9AR3Gv',
        switchWrap: 'switchWrap-bl9AR3Gv',
        icon: 'icon-bl9AR3Gv',
        labelHint: 'labelHint-bl9AR3Gv',
        labelOn: 'labelOn-bl9AR3Gv',
      };
    },
    90826: (e) => {
      e.exports = { button: 'button-Y1TCZogJ', active: 'active-Y1TCZogJ' };
    },
    38456: (e) => {
      e.exports = {
        button: 'button-ptpAHg8E',
        withText: 'withText-ptpAHg8E',
        withoutText: 'withoutText-ptpAHg8E',
      };
    },
    67972: (e) => {
      e.exports = {
        form: 'form-MgR0zejo',
        input: 'input-MgR0zejo',
        menu: 'menu-MgR0zejo',
        add: 'add-MgR0zejo',
        hovered: 'hovered-MgR0zejo',
        wrap: 'wrap-MgR0zejo',
        accessible: 'accessible-MgR0zejo',
        menuLabel: 'menuLabel-MgR0zejo',
        hover: 'hover-MgR0zejo',
      };
    },
    39357: (e) => {
      e.exports = { spinnerWrap: 'spinnerWrap-cZT0OZe0' };
    },
    52045: (e) => {
      e.exports = {
        button: 'button-neROVfUe',
        first: 'first-neROVfUe',
        last: 'last-neROVfUe',
      };
    },
    97041: (e) => {
      e.exports = { wrap: 'wrap-n5bmFxyX' };
    },
    64618: (e) => {
      e.exports = { hidden: 'hidden-5MVS18J8' };
    },
    18369: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        item: 'item-o5a0MQMm',
        withIcon: 'withIcon-o5a0MQMm',
        shortcut: 'shortcut-o5a0MQMm',
        loading: 'loading-o5a0MQMm',
        icon: 'icon-o5a0MQMm',
      };
    },
    4549: (e) => {
      e.exports = {
        button: 'button-b3Cgff6l',
        group: 'group-b3Cgff6l',
        menu: 'menu-b3Cgff6l',
      };
    },
    27363: (e) => {
      e.exports = {
        customTradingViewStyleButton: 'customTradingViewStyleButton-zigjK1n2',
        withoutIcon: 'withoutIcon-zigjK1n2',
      };
    },
    75352: (e) => {
      e.exports = {
        dropdown: 'dropdown-l0nf43ai',
        label: 'label-l0nf43ai',
        smallWidthTitle: 'smallWidthTitle-l0nf43ai',
        smallWidthMenuItem: 'smallWidthMenuItem-l0nf43ai',
        smallWidthWrapper: 'smallWidthWrapper-l0nf43ai',
      };
    },
    20371: (e) => {
      e.exports = { value: 'value-gwXludjS', selected: 'selected-gwXludjS' };
    },
    867: (e) => {
      e.exports = {
        smallWidthMenuItem: 'smallWidthMenuItem-RmqZNwwp',
        menuItem: 'menuItem-RmqZNwwp',
        remove: 'remove-RmqZNwwp',
      };
    },
    80022: (e) => {
      e.exports = {
        button: 'button-S_1OCXUK',
        first: 'first-S_1OCXUK',
        last: 'last-S_1OCXUK',
        menu: 'menu-S_1OCXUK',
        dropdown: 'dropdown-S_1OCXUK',
        menuContent: 'menuContent-S_1OCXUK',
        section: 'section-S_1OCXUK',
        smallTabletSectionTitle: 'smallTabletSectionTitle-S_1OCXUK',
        addCustomInterval: 'addCustomInterval-S_1OCXUK',
        hovered: 'hovered-S_1OCXUK',
        group: 'group-S_1OCXUK',
      };
    },
    23902: (e) => {
      e.exports = { button: 'button-gn9HMufu' };
    },
    92998: (e) => {
      e.exports = {
        button: 'button-ZuDkGGhF',
        isDisabled: 'isDisabled-ZuDkGGhF',
      };
    },
    70152: (e) => {
      e.exports = {
        saveString: 'saveString-XVd1Kfjg',
        hidden: 'hidden-XVd1Kfjg',
        loader: 'loader-XVd1Kfjg',
      };
    },
    63672: (e) => {
      e.exports = {
        opened: 'opened-yyMUOAN9',
        hover: 'hover-yyMUOAN9',
        autoSaveWrapper: 'autoSaveWrapper-yyMUOAN9',
        sharingWrapper: 'sharingWrapper-yyMUOAN9',
        button: 'button-yyMUOAN9',
        buttonSmallPadding: 'buttonSmallPadding-yyMUOAN9',
        hintPlaceHolder: 'hintPlaceHolder-yyMUOAN9',
        smallHintPlaceHolder: 'smallHintPlaceHolder-yyMUOAN9',
        popupItemRowTabletSmall: 'popupItemRowTabletSmall-yyMUOAN9',
        shortcut: 'shortcut-yyMUOAN9',
        toolTitle: 'toolTitle-yyMUOAN9',
        toolTitleMobile: 'toolTitleMobile-yyMUOAN9',
        layoutItem: 'layoutItem-yyMUOAN9',
        layoutMeta: 'layoutMeta-yyMUOAN9',
        labelRow: 'labelRow-yyMUOAN9',
        layoutTitle: 'layoutTitle-yyMUOAN9',
        layoutItemWrap: 'layoutItemWrap-yyMUOAN9',
        layoutTitleMobile: 'layoutTitleMobile-yyMUOAN9',
        active: 'active-yyMUOAN9',
        textWrap: 'textWrap-yyMUOAN9',
        text: 'text-yyMUOAN9',
        withIcon: 'withIcon-yyMUOAN9',
        sharingLabelWrap: 'sharingLabelWrap-yyMUOAN9',
        infoIcon: 'infoIcon-yyMUOAN9',
        copyLink: 'copyLink-yyMUOAN9',
        copyLinkMobile: 'copyLinkMobile-yyMUOAN9',
      };
    },
    25882: (e) => {
      e.exports = {
        button: 'button-cq__ntSC',
        largeLeftPadding: 'largeLeftPadding-cq__ntSC',
        text: 'text-cq__ntSC',
        uppercase: 'uppercase-cq__ntSC',
      };
    },
    26431: (e) => {
      e.exports = {
        button: 'button-HwLRKjG6',
        text: 'text-HwLRKjG6',
        logo: 'logo-HwLRKjG6',
      };
    },
    92710: (e) => {
      e.exports = { description: 'description-jgoQcEnP' };
    },
    5145: (e) => {
      e.exports = {
        item: 'item-j7oVl2yI',
        accessible: 'accessible-j7oVl2yI',
        round: 'round-j7oVl2yI',
      };
    },
    85013: (e) => {
      e.exports = {
        wrap: 'wrap-HXSqojvq',
        titleWrap: 'titleWrap-HXSqojvq',
        indicators: 'indicators-HXSqojvq',
        title: 'title-HXSqojvq',
        icon: 'icon-HXSqojvq',
        text: 'text-HXSqojvq',
        titleTabletSmall: 'titleTabletSmall-HXSqojvq',
        labelRow: 'labelRow-HXSqojvq',
        label: 'label-HXSqojvq',
      };
    },
    48261: (e) => {
      e.exports = {
        labelRow: 'labelRow-JeQoCpvi',
        toolbox: 'toolbox-JeQoCpvi',
        description: 'description-JeQoCpvi',
        descriptionTabletSmall: 'descriptionTabletSmall-JeQoCpvi',
        item: 'item-JeQoCpvi',
        titleItem: 'titleItem-JeQoCpvi',
        titleItemTabletSmall: 'titleItemTabletSmall-JeQoCpvi',
        itemTabletSmall: 'itemTabletSmall-JeQoCpvi',
        itemLabelTabletSmall: 'itemLabelTabletSmall-JeQoCpvi',
        wrap: 'wrap-JeQoCpvi',
        hovered: 'hovered-JeQoCpvi',
      };
    },
    36001: (e) => {
      e.exports = {
        menu: 'menu-hcofKPms',
        menuSmallTablet: 'menuSmallTablet-hcofKPms',
        menuItemHeaderTabletSmall: 'menuItemHeaderTabletSmall-hcofKPms',
        menuItemHeader: 'menuItemHeader-hcofKPms',
      };
    },
    70760: (e) => {
      e.exports = {
        wrap: 'wrap-jiC5bgmi',
        full: 'full-jiC5bgmi',
        first: 'first-jiC5bgmi',
        last: 'last-jiC5bgmi',
        medium: 'medium-jiC5bgmi',
        buttonWithFavorites: 'buttonWithFavorites-jiC5bgmi',
      };
    },
    57778: (e) => {
      e.exports = { icon: 'icon-uMfL97K2' };
    },
    76197: (e, t, a) => {
      'use strict';
      a.d(t, { CollapsibleSection: () => r });
      var n = a(50959),
        i = a(97754),
        o = a.n(i),
        s = a(10381),
        l = a(12989);
      const r = (0, n.forwardRef)(function (e, t) {
        const {
          open: a,
          summary: i,
          children: r,
          onStateChange: h,
          tabIndex: c,
          className: d,
          ...u
        } = e;
        return n.createElement(
          n.Fragment,
          null,
          n.createElement(
            'div',
            {
              ...u,
              className: o()(d, l.summary),
              onClick: function () {
                h && h(!a);
              },
              'data-open': a,
              ref: t,
              tabIndex: c,
            },
            i,
            n.createElement(s.ToolWidgetCaret, {
              className: l.caret,
              dropped: Boolean(a),
            })
          ),
          a && r
        );
      });
    },
    69297: (e, t, a) => {
      'use strict';
      a.d(t, {
        DEFAULT_MENU_ITEM_SWITCHER_THEME: () => m,
        MenuItemSwitcher: () => p,
      });
      var n = a(50959),
        i = a(97754),
        o = a.n(i),
        s = a(17946),
        l = a(26574),
        r = a.n(l);
      function h(e) {
        const t = (0, n.useContext)(s.CustomBehaviourContext),
          {
            className: a,
            intent: o = 'default',
            size: l = 'small',
            enableActiveStateStyles: h = t.enableActiveStateStyles,
          } = e;
        return i(
          a,
          r().switcher,
          r()[`size-${l}`],
          r()[`intent-${o}`],
          !h && r()['disable-active-state-styles']
        );
      }
      function c(e) {
        var t;
        const {
            reference: a,
            size: i,
            intent: o,
            role: s,
            'aria-checked': l,
            checked: c,
            defaultChecked: d,
            onKeyDown: u,
            ...v
          } = e,
          m = (0, n.useCallback)(
            (e) => {
              13 === e.keyCode && e.target.click(), u && u(e);
            },
            [u]
          );
        return n.createElement(
          'span',
          { className: h(e) },
          n.createElement('input', {
            ...v,
            type: 'checkbox',
            className: r().input,
            ref: a,
            role: null != s ? s : 'switch',
            'aria-checked':
              null !== (t = null != l ? l : c) && void 0 !== t ? t : d,
            checked: c,
            defaultChecked: d,
            onKeyDown: m,
          }),
          n.createElement(
            'span',
            { className: r()['thumb-wrapper'] },
            n.createElement('span', { className: r().track }),
            n.createElement('span', { className: r().thumb })
          )
        );
      }
      var d = a(9745),
        u = a(90186),
        v = a(40670);
      const m = v;
      function p(e) {
        const {
            className: t,
            checked: a,
            id: i,
            label: s,
            labelDescription: l,
            value: r,
            preventLabelHighlight: h,
            reference: m,
            switchReference: p,
            theme: g = v,
            disabled: b,
            icon: C,
          } = e,
          S = o()(g.label, a && !h && g.labelOn),
          _ = o()(
            t,
            g.wrapper,
            a && g.wrapperWithOnLabel,
            l && g.wrapperWithDescription
          );
        return n.createElement(
          'label',
          { className: o()(_, C && g.withIcon), htmlFor: i, ref: m },
          void 0 !== C &&
            n.createElement(d.Icon, { className: g.icon, icon: C }),
          n.createElement(
            'div',
            { className: g.labelRow },
            n.createElement('div', { className: S }, s),
            l && n.createElement('div', { className: g.labelHint }, l)
          ),
          n.createElement(
            'div',
            { className: v.switchWrap },
            n.createElement(c, {
              disabled: b,
              className: g.switch,
              reference: p,
              checked: a,
              onChange: function (t) {
                const a = t.target.checked;
                void 0 !== e.onChange && e.onChange(a);
              },
              value: r,
              tabIndex: -1,
              id: i,
              role: e.switchRole,
              ...(0, u.filterDataProps)(e),
            })
          )
        );
      }
    },
    65817: (e, t, a) => {
      'use strict';
      a.d(t, { INTERVALS: () => i });
      var n = a(44352);
      const i = [
        { name: '', label: n.t(null, { context: 'interval' }, a(37830)) },
        { name: 'H', label: n.t(null, { context: 'interval' }, a(5285)) },
        { name: 'D', label: n.t(null, { context: 'interval' }, a(6174)) },
        { name: 'W', label: n.t(null, { context: 'interval' }, a(25042)) },
        { name: 'M', label: n.t(null, { context: 'interval' }, a(79410)) },
      ];
    },
    6652: (e, t, a) => {
      'use strict';
      a.r(t), a.d(t, { getRestrictedToolSet: () => tn });
      var n = a(14483),
        i = a(50959),
        o = a(19036),
        s = a(44352),
        l = a(82992),
        r = a(88732),
        h = a(45876),
        c = a(36189),
        d = a(9745),
        u = a(16396),
        v = a(50298),
        m = a(97754),
        p = a.n(m),
        g = a(97041);
      const b = i.forwardRef((e, t) => {
        const { children: a, className: n, ...o } = e;
        return i.createElement(
          'div',
          { className: m(n, g.wrap), ref: t, ...o },
          a
        );
      });
      var C = a(88066),
        S = a(52045);
      class _ extends i.PureComponent {
        constructor() {
          super(...arguments),
            (this._handleClick = () => {
              const { onClick: e, onClickArg: t } = this.props;
              e && e(t);
            });
        }
        render() {
          const {
            className: e,
            icon: t,
            hint: a,
            text: n,
            isDisabled: o,
            isActive: s,
            isFirst: l,
            isLast: r,
            onClick: h,
            onClickArg: c,
            ...d
          } = this.props;
          return i.createElement(C.ToolbarButton, {
            ...d,
            icon: t,
            text: n,
            tooltip: a,
            isDisabled: o,
            isActive: s,
            isGrouped: !0,
            onClick: this._handleClick,
            className: m(e, S.button, { [S.first]: l, [S.last]: r }),
          });
        }
      }
      var y = a(51613),
        f = a(90692),
        w = a(24437),
        E = a(81332),
        M = a(5962),
        k = a(16410),
        T = a(42960),
        x = a(47201),
        I = a(3343),
        A = a(16838);
      function R(e) {
        const { orientation: t, onKeyDown: a, ...n } = e,
          o = A.PLATFORM_ACCESSIBILITY_ENABLED
            ? { role: 'radiogroup', 'aria-orientation': t }
            : {};
        return i.createElement('div', {
          ...n,
          ...o,
          onKeyDown: (0, x.createSafeMulticastEventHandler)(function (e) {
            if (!A.PLATFORM_ACCESSIBILITY_ENABLED) return;
            if (e.defaultPrevented) return;
            if (!(document.activeElement instanceof HTMLElement)) return;
            const a = (0, I.hashFromEvent)(e);
            if ('vertical' !== t && 38 !== a && 40 !== a) return;
            if ('vertical' === t && 37 !== a && 39 !== a) return;
            const n = ((i = e.currentTarget),
            Array.from(
              i.querySelectorAll(
                '[role="radio"]:not([disabled], [aria-disabled])'
              )
            ).filter((0, A.createScopedVisibleElementFilter)(i))).sort(
              A.navigationOrderComparator
            );
            var i;
            if (0 === n.length) return;
            const o = n.indexOf(document.activeElement);
            if (-1 === o) return;
            e.preventDefault();
            const s = () => {
                const e = (o + n.length - 1) % n.length;
                n[o].dispatchEvent(
                  new CustomEvent('roving-tabindex:secondary-element')
                ),
                  n[e].dispatchEvent(
                    new CustomEvent('roving-tabindex:main-element')
                  ),
                  n[e].focus();
              },
              l = () => {
                const e = (o + n.length + 1) % n.length;
                n[o].dispatchEvent(
                  new CustomEvent('roving-tabindex:secondary-element')
                ),
                  n[e].dispatchEvent(
                    new CustomEvent('roving-tabindex:main-element')
                  ),
                  n[e].focus();
              };
            switch (a) {
              case 38:
                'vertical' !== t && s();
                break;
              case 40:
                'vertical' !== t && l();
                break;
              case 37:
                'vertical' === t && s();
                break;
              case 39:
                'vertical' === t && l();
            }
          }, a),
        });
      }
      var N = a(4549);
      const F = { barsStyle: s.t(null, void 0, a(84232)) },
        H = (0, M.registryContextType)();
      function L(e) {
        var t;
        return !(null === (t = l.linking.supportedChartStyles.value()) ||
        void 0 === t
          ? void 0
          : t.includes(e));
      }
      class O extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleChangeStyle = (e) => {
              const {
                favorites: t,
                lastSelectedNotFavorite: a,
                activeStyle: n,
              } = this.state;
              this.setState({
                activeStyle: e,
                lastSelectedNotFavorite: t.includes(n) ? a : n,
              });
            }),
            (this._handleSelectStyle = (e) => {
              const { chartWidgetCollection: t } = this.context;
              e !== t.activeChartStyle.value() && t.setChartStyleToWidget(e);
            }),
            (this._handleClickFavorite = (e) => {
              this._isStyleFavorited(e)
                ? this._handleRemoveFavorite(e)
                : this._handleAddFavorite(e);
            }),
            (this._boundForceUpdate = () => {
              this.forceUpdate();
            }),
            (this._handleQuickClick = (e) => {
              this._handleSelectStyle(e), this._trackClick();
            }),
            (0, M.validateRegistry)(t, {
              chartWidgetCollection: o.any.isRequired,
              favoriteChartStylesService: o.any.isRequired,
            });
          const { chartWidgetCollection: a, favoriteChartStylesService: n } = t,
            i = a.activeChartStyle.value(),
            s = n.get(),
            l = (0, k.japaneseChartStyles)();
          this.state = {
            activeStyle: i,
            favorites: s,
            styles: (0, k.commonChartStyles)(),
            japaneseStyles: l,
          };
        }
        componentDidMount() {
          const { chartWidgetCollection: e, favoriteChartStylesService: t } =
            this.context;
          e.activeChartStyle.subscribe(this._handleChangeStyle),
            t.getOnChange().subscribe(this, this._handleChangeSettings),
            l.linking.supportedChartStyles.subscribe(this._boundForceUpdate);
        }
        componentWillUnmount() {
          const { chartWidgetCollection: e, favoriteChartStylesService: t } =
            this.context;
          e.activeChartStyle.unsubscribe(this._handleChangeStyle),
            t.getOnChange().unsubscribe(this, this._handleChangeSettings),
            l.linking.supportedChartStyles.unsubscribe(this._boundForceUpdate);
        }
        render() {
          const {
              isShownQuicks: e,
              displayMode: t = 'full',
              id: a,
            } = this.props,
            {
              activeStyle: n,
              favorites: o,
              styles: s,
              japaneseStyles: l,
              lastSelectedNotFavorite: c,
            } = this.state,
            u = 'small' !== t && e && 0 !== o.length,
            m = [...o];
          m.includes(n) ? void 0 !== c && m.push(c) : m.push(n);
          const p = u && m.length > 1;
          return i.createElement(
            f.MatchMedia,
            { rule: w.DialogBreakpoints.TabletSmall },
            (e) => {
              const t = s.map((t) => this._renderPopupMenuItem(t, t === n, e)),
                o = l.map((t) => this._renderPopupMenuItem(t, t === n, e));
              return i.createElement(
                b,
                { id: a },
                p &&
                  i.createElement(
                    R,
                    { orientation: 'horizontal', className: N.group },
                    m.map((e, t) =>
                      i.createElement(_, {
                        role: 'radio',
                        className: N.button,
                        icon: h.SERIES_ICONS[e],
                        'aria-checked': u && n === e,
                        isActive: u && n === e,
                        isDisabled: L(e),
                        key: t,
                        hint: (0, T.getTranslatedChartStyleName)(e),
                        isFirst: 0 === t,
                        isLast: t === m.length - 1,
                        onClick: u ? this._handleQuickClick : void 0,
                        onClickArg: e,
                        'data-value': r.STYLE_SHORT_NAMES[e],
                      })
                    )
                  ),
                i.createElement(
                  v.ToolbarMenuButton,
                  {
                    arrow: Boolean(p),
                    content: p
                      ? void 0
                      : i.createElement(
                          b,
                          null,
                          i.createElement(d.Icon, { icon: h.SERIES_ICONS[n] })
                        ),
                    tooltip: p
                      ? F.barsStyle
                      : (0, T.getTranslatedChartStyleName)(n),
                    className: N.menu,
                    isDrawer: e,
                    onClick: this._trackClick,
                  },
                  t,
                  !!o.length && i.createElement(y.PopupMenuSeparator, null),
                  o
                )
              );
            }
          );
        }
        _renderPopupMenuItem(e, t, a) {
          const { isFavoritingAllowed: n } = this.props,
            o = this._isStyleFavorited(e);
          return i.createElement(u.PopupMenuItem, {
            key: e,
            theme: a ? E.multilineLabelWithIconAndToolboxTheme : void 0,
            icon: h.SERIES_ICONS[e],
            isActive: t,
            isDisabled: L(e),
            label: (0, T.getTranslatedChartStyleName)(e) || '',
            onClick: this._handleSelectStyle,
            onClickArg: e,
            showToolboxOnHover: !o,
            toolbox:
              n &&
              i.createElement(c.FavoriteButton, {
                isActive: t,
                isFilled: o,
                onClick: () => this._handleClickFavorite(e),
              }),
            'data-value': r.STYLE_SHORT_NAMES[e],
          });
        }
        _handleChangeSettings(e) {
          this.setState({ lastSelectedNotFavorite: void 0, favorites: e });
        }
        _isStyleFavorited(e) {
          return -1 !== this.state.favorites.indexOf(e);
        }
        _handleAddFavorite(e) {
          const { favorites: t } = this.state,
            { favoriteChartStylesService: a } = this.context;
          a.set([...t, e]);
        }
        _handleRemoveFavorite(e) {
          const { favorites: t } = this.state,
            { favoriteChartStylesService: a } = this.context;
          a.set(t.filter((t) => t !== e));
        }
        _trackClick() {
          0;
        }
      }
      O.contextType = H;
      var D = a(50238),
        P = a(31409),
        U = a(38456);
      const B = ['medium', 'small'],
        W = (0, i.forwardRef)(function (e, t) {
          const {
              text: a,
              className: n,
              displayMode: o,
              collapseWhen: s = B,
              ...l
            } = e,
            r = !s.includes(o);
          return i.createElement(P.ToolWidgetButton, {
            ...l,
            ref: t,
            text: r ? a : void 0,
            className: m(n, U.button, r ? U.withText : U.withoutText),
          });
        });
      function z(e) {
        const { tooltip: t, ...a } = e,
          [n, o] = (0, D.useRovingTabindexElement)(null);
        return i.createElement(W, {
          'aria-label': A.PLATFORM_ACCESSIBILITY_ENABLED ? t : void 0,
          ...a,
          tag: A.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          tabIndex: o,
          ref: n,
          'data-tooltip': t,
        });
      }
      var V = a(51768),
        Z = a(76460),
        K = a(1393);
      const Q = (0, M.registryContextType)();
      class q extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._updateState = (e) => {
              this.setState({ isActive: e });
            }),
            (this._handleClick = (e) => {
              var t;
              (0, V.trackEvent)('GUI', 'Chart Header Toolbar', 'compare'),
                null === (t = this._compareDialogRenderer) ||
                  void 0 === t ||
                  t.show({ shouldReturnFocus: (0, Z.isKeyboardClick)(e) });
            }),
            (0, M.validateRegistry)(t, {
              chartWidgetCollection: o.any.isRequired,
            }),
            (this.state = { isActive: !1 }),
            (this._compareDialogRenderer =
              this.context.chartWidgetCollection.getCompareDialogRenderer());
        }
        componentDidMount() {
          var e;
          null === (e = this._compareDialogRenderer) ||
            void 0 === e ||
            e.visible().subscribe(this._updateState);
        }
        componentWillUnmount() {
          var e;
          null === (e = this._compareDialogRenderer) ||
            void 0 === e ||
            e.visible().unsubscribe(this._updateState);
        }
        render() {
          const { isActive: e } = this.state;
          return i.createElement(z, {
            ...this.props,
            icon: K,
            isOpened: e,
            onClick: this._handleClick,
            collapseWhen: ['full', 'medium', 'small'],
            tooltip: s.t(null, void 0, a(20229)),
          });
        }
      }
      q.contextType = Q;
      var j = a(48889),
        G = a(61814),
        Y = a(68335),
        X = a(97268);
      const J = (0, G.hotKeySerialize)({
          keys: [(0, Y.humanReadableModifiers)(Y.Modifiers.Shift, !1), 'F'],
          text: '{0} + {1}',
        }),
        $ = (0, M.registryContextType)();
      class ee extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleClick = () => {
              const { chartWidgetCollection: e } = this.context;
              e.startFullscreen();
            }),
            (0, M.validateRegistry)(t, {
              chartWidgetCollection: o.any.isRequired,
            });
        }
        render() {
          const { className: e, id: t } = this.props;
          return i.createElement(j.ToolbarIconButton, {
            id: t,
            icon: X,
            onClick: this._handleClick,
            className: m(e),
            tooltip: s.t(null, void 0, a(11682)),
            'data-tooltip-hotkey': J,
          });
        }
      }
      ee.contextType = $;
      var te = a(50151);
      const ae = (0, a(59224).getLogger)('FavoritesInfo');
      function ne(e, t) {
        if (0 === e.length) return Promise.resolve([]);
        ae.logNormal('Requesting favorites info');
        const a = [],
          n = new Map(),
          i = new Map(),
          o = new Map();
        return (
          e.forEach((e) => {
            switch (e.type) {
              case 'java':
                o.set(e.studyId, e);
                break;
              case 'pine':
                isPublishedPineId(e.pineId)
                  ? n.set(e.pineId, e)
                  : i.set(e.pineId, e);
                break;
              default:
                (0, te.assert)(
                  !1,
                  `unknown favorite type ${JSON.stringify(e)}`
                );
            }
          }),
          0 !== o.size &&
            a.push(
              t
                .findAllJavaStudies()
                .then((e) => {
                  const t = new Map();
                  for (const a of e)
                    !a.is_hidden_study &&
                      o.has(a.id) &&
                      t.set(a.id, {
                        name: a.description,
                        localizedName: a.description_localized,
                        studyMarketShittyObject: a,
                      });
                  return t;
                })
                .then((e) => {
                  const t = (function (e, t) {
                    const a = { items: [], notFoundItems: [] };
                    return (
                      e.forEach((e, n) => {
                        const i = t.get(n);
                        void 0 !== i
                          ? a.items.push({ item: e, info: i })
                          : a.notFoundItems.push(e);
                      }),
                      a
                    );
                  })(o, e);
                  if (0 !== t.notFoundItems.length) {
                    const e = t.notFoundItems.map((e) => e.studyId);
                    ae.logWarn(
                      `Cannot find java scripts: ${JSON.stringify(e)}`
                    );
                  }
                  return t.items;
                })
            ),
          Promise.all(a).then(
            (e) => (
              ae.logNormal('Requesting favorites info finished'),
              e.reduce((e, t) => e.concat(t), [])
            )
          )
        );
      }
      var ie = a(29673),
        oe = a(88348),
        se = a(26996),
        le = a(39357);
      function re(e) {
        const { className: t } = e;
        return i.createElement(
          'div',
          { className: p()(le.spinnerWrap, t) },
          i.createElement(se.Loader, null)
        );
      }
      var he = a(82962),
        ce = a(76422),
        de = a(39681),
        ue = a(75352);
      const ve = (0, G.hotKeySerialize)({ keys: ['/'], text: '{0}' }),
        me = (0, M.registryContextType)();
      class pe extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._promise = null),
            (this._menu = i.createRef()),
            (this._favoriteFundamentalsModel = null),
            (this._setActiveState = (e) => {
              this.setState({ isActive: e });
            }),
            (this._handleClick = (e) => {
              const { studyMarket: t } = this.props;
              this.setState({ isActive: !0 }, () => {
                t.visible().value()
                  ? t.hide()
                  : t.show({ shouldReturnFocus: (0, Z.isKeyboardClick)(e) });
              }),
                this._trackClick();
            }),
            (this._handleSelectIndicator = (e) => {
              (e = (0, te.ensureDefined)(e)),
                this._trackFavoriteAction('Favorite indicator from toolbar');
              'java' === e.type ? e.studyId : e.pineId;
              (() => {
                e = (0, te.ensureDefined)(e);
                const { chartWidgetCollection: t } = this.context;
                if ('java' === e.type) {
                  const t = (0, ie.tryFindStudyLineToolNameByStudyId)(
                    e.studyId
                  );
                  if (null !== t) return void oe.tool.setValue(t);
                }
                t.activeChartWidget.value().insertStudy(e, []);
              })();
            }),
            (this._handleFavoriteIndicatorsChange = () => {
              const { favoriteScriptsModel: e } = this.context,
                t = [...(0, te.ensureDefined)(e).favorites()];
              this.setState({ favorites: t }), this._clearCache();
            }),
            (this._handleFavoriteFundamentalsChange = () => {
              var e;
              const t = new Set(
                (null === (e = this._favoriteFundamentalsModel) || void 0 === e
                  ? void 0
                  : e.favorites()) || []
              );
              this.setState({ favoriteFundamentals: t }), this._clearCache();
            }),
            (this._handleMouseEnter = () => {
              this._prefetchFavorites();
            }),
            (this._handleWrapClick = () => {
              this._prefetchFavorites();
            }),
            (this._handleChangeActiveWidget = () => {
              this._clearCache();
            }),
            (this._clearCache = () => {
              (this._promise = null), this.setState({ infos: [] });
            }),
            (this._handleScriptRenamed = (e) => {
              const { favoriteScriptsModel: t } = this.context;
              void 0 !== t && t.isFav(e.scriptIdPart) && this._clearCache();
            }),
            (this._handleFavoriteMenuClick = () => {
              this._trackClick(),
                this._trackFavoriteAction(
                  'Select favorite indicators dropdown'
                );
            }),
            (0, M.validateRegistry)(t, {
              favoriteScriptsModel: o.any,
              chartWidgetCollection: o.any.isRequired,
            });
          const { favoriteScriptsModel: a } = t,
            n = void 0 !== a ? a.favorites() : [];
          this.state = {
            isActive: !1,
            isLoading: !1,
            favorites: n,
            favoriteFundamentals: void 0,
            infos: [],
          };
        }
        componentDidMount() {
          const { studyMarket: e } = this.props,
            { favoriteScriptsModel: t, chartWidgetCollection: a } =
              this.context;
          e.visible().subscribe(this._setActiveState),
            void 0 !== t &&
              (t
                .favoritesChanged()
                .subscribe(this, this._handleFavoriteIndicatorsChange),
              a.activeChartWidget.subscribe(this._handleChangeActiveWidget)),
            ce.on('TVScriptRenamed', this._handleScriptRenamed, null);
        }
        componentWillUnmount() {
          const { studyMarket: e } = this.props,
            { favoriteScriptsModel: t, chartWidgetCollection: a } =
              this.context;
          e.visible().unsubscribe(this._setActiveState),
            void 0 !== t &&
              (t
                .favoritesChanged()
                .unsubscribe(this, this._handleFavoriteIndicatorsChange),
              a.activeChartWidget.unsubscribe(this._handleChangeActiveWidget)),
            ce.unsubscribe('TVScriptRenamed', this._handleScriptRenamed, null),
            (this._promise = null);
        }
        render() {
          const {
              isActive: e,
              favorites: t,
              favoriteFundamentals: n,
              isLoading: o,
            } = this.state,
            { className: l, displayMode: r, id: h } = this.props,
            { chartWidgetCollection: c } = this.context;
          return i.createElement(
            i.Fragment,
            null,
            i.createElement(
              b,
              {
                id: h,
                onMouseEnter: this._handleMouseEnter,
                onClick: this._handleWrapClick,
              },
              i.createElement(z, {
                displayMode: r,
                className: l,
                icon: de,
                isOpened: e,
                onClick: this._handleClick,
                text: s.t(null, void 0, a(61142)),
                'data-role': 'button',
                'data-name': 'open-indicators-dialog',
                tooltip: s.t(null, void 0, a(74527)),
                'data-tooltip-hotkey': ve,
              }),
              Boolean(t.length > 0 || (null == n ? void 0 : n.size)) &&
                i.createElement(
                  f.MatchMedia,
                  { rule: 'screen and (max-width: 430px)' },
                  (e) =>
                    i.createElement(
                      v.ToolbarMenuButton,
                      {
                        key: c.activeChartWidget.value().id(),
                        arrow: !0,
                        closeOnClickOutside: !0,
                        isDrawer: e,
                        drawerPosition: 'Bottom',
                        ref: this._menu,
                        onClick: this._handleFavoriteMenuClick,
                        'data-name': 'show-favorite-indicators',
                        tooltip: s.t(null, void 0, a(33959)),
                      },
                      i.createElement(
                        'div',
                        {
                          className: p()(
                            ue.dropdown,
                            e && ue.smallWidthWrapper
                          ),
                        },
                        i.createElement(
                          he.ToolWidgetMenuSummary,
                          { className: e && ue.smallWidthTitle },
                          s.t(null, void 0, a(83127))
                        ),
                        o && i.createElement(re, null),
                        !o &&
                          i.createElement(
                            i.Fragment,
                            null,
                            this.state.infos.length > 0
                              ? this.state.infos.map((t) =>
                                  i.createElement(u.PopupMenuItem, {
                                    className: p()(e && ue.smallWidthMenuItem),
                                    theme: e
                                      ? E.multilineLabelWithIconAndToolboxTheme
                                      : void 0,
                                    key:
                                      'java' === t.item.type
                                        ? t.item.studyId
                                        : t.item.pineId,
                                    onClick: this._handleSelectIndicator,
                                    onClickArg: t.item,
                                    label: i.createElement(
                                      'span',
                                      {
                                        className: p()(
                                          !e && ue.label,
                                          e && ue.smallWidthLabel,
                                          'apply-overflow-tooltip'
                                        ),
                                      },
                                      ge(t)
                                    ),
                                  })
                                )
                              : null !== this._promise &&
                                  i.createElement(u.PopupMenuItem, {
                                    isDisabled: !0,
                                    label: s.t(null, void 0, a(23687)),
                                  })
                          )
                      )
                    )
                )
            )
          );
        }
        _prefetchFavorites() {
          const { chartWidgetCollection: e } = this.context;
          if (null !== this._promise || !window.is_authenticated) return;
          const t = e.activeChartWidget.value();
          if (!t.hasModel()) return;
          const a = t.model().model().studyMetaInfoRepository();
          this.setState({ isLoading: !0 });
          const n = (this._promise = Promise.all([
            ne(this.state.favorites, a),
            void 0,
          ]).then((e) => {
            if (n !== this._promise) return;
            const [t, a] = e;
            let i = [...t];
            if (a) {
              const e = a
                .filter((e) => {
                  var t;
                  return null === (t = this.state.favoriteFundamentals) ||
                    void 0 === t
                    ? void 0
                    : t.has(e.scriptIdPart);
                })
                .map(this._mapFundamentalToFavoriteItemInfo);
              i.push(...e);
            }
            (i = [...i].sort((e, t) => ge(e).localeCompare(ge(t)))),
              this.setState({ infos: i, isLoading: !1 }, () => {
                this._menu.current && this._menu.current.update();
              });
          }));
        }
        _trackClick() {
          0;
        }
        _trackFavoriteAction(e) {
          (0, V.trackEvent)('GUI', 'Chart Header Toolbar', e);
        }
        _mapFundamentalToFavoriteItemInfo(e) {
          return {
            item: { type: 'pine', pineId: e.scriptIdPart },
            info: {
              name: e.scriptName,
              localizedName: getLocalizedFundamentalsName(e),
              studyMarketShittyObject: void 0,
            },
          };
        }
      }
      function ge(e) {
        return (
          e.info.localizedName ||
          s.t(e.info.name, { context: 'study' }, a(68716))
        );
      }
      pe.contextType = me;
      var be = a(94025),
        Ce = a(20371);
      function Se(e) {
        return i.createElement(
          'div',
          { className: m(Ce.value, { [Ce.selected]: e.isSelected }) },
          e.value,
          e.metric
        );
      }
      var _e = a(65817),
        ye = a(67972);
      function fe(e) {
        const { className: t, ...a } = e,
          [n, o] = (0, D.useRovingTabindexElement)(null),
          s = A.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div';
        return i.createElement(s, {
          ...a,
          ref: n,
          tabIndex: o,
          'data-role': A.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          className: p()(A.PLATFORM_ACCESSIBILITY_ENABLED && ye.accessible, t),
        });
      }
      function we(e) {
        const { className: t, ...a } = e,
          [n, o] = (0, D.useRovingTabindexElement)(null);
        return i.createElement('input', {
          ...a,
          ref: n,
          tabIndex: o,
          'data-role': A.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          className: p()(A.PLATFORM_ACCESSIBILITY_ENABLED && ye.accessible, t),
        });
      }
      var Ee = a(47102);
      function Me(e) {
        const { className: t, ...a } = e,
          [n, o] = (0, D.useRovingTabindexElement)(null);
        return i.createElement(u.PopupMenuItem, {
          ...a,
          className: p()(
            A.PLATFORM_ACCESSIBILITY_ENABLED && Ee.accessible,
            e.isActive && Ee.active,
            t
          ),
          reference: n,
          tabIndex: o,
          onKeyDown: function (e) {
            if (
              !A.PLATFORM_ACCESSIBILITY_ENABLED ||
              e.target !== e.currentTarget
            )
              return;
            const t = (0, I.hashFromEvent)(e);
            (13 !== t && 32 !== t) ||
              (e.preventDefault(),
              n.current instanceof HTMLElement && n.current.click());
          },
          'data-role': A.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          'aria-disabled':
            (A.PLATFORM_ACCESSIBILITY_ENABLED && e.isDisabled) || void 0,
        });
      }
      class ke extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._menu = i.createRef()),
            (this._handleChangeInput = (e) => {
              const { value: t } = e.currentTarget;
              /^[0-9]*$/.test(t) && this.setState({ inputValue: t });
            }),
            (this._handleSelectTime = (e) => {
              var t, a, n, i;
              this.setState({ selectedIntervalSuffix: e }),
                null === (a = (t = this.props).onSelect) ||
                  void 0 === a ||
                  a.call(t),
                null === (n = this._menu.current) || void 0 === n || n.close(),
                null === (i = this._menu.current) || void 0 === i || i.focus();
            }),
            (this._handleClickAdd = () => {
              const { inputValue: e, selectedIntervalSuffix: t } = this.state;
              this.props.onAdd(e, t);
            }),
            (this.state = {
              inputValue: '1',
              selectedIntervalSuffix: _e.INTERVALS[0].name,
            });
        }
        render() {
          const {
            inputValue: e,
            menuWidth: t,
            selectedIntervalSuffix: n,
          } = this.state;
          return i.createElement(
            'div',
            { className: ye.form },
            i.createElement(we, {
              className: ye.input,
              maxLength: 7,
              onChange: this._handleChangeInput,
              value: e,
            }),
            i.createElement(
              v.ToolbarMenuButton,
              {
                orientation: 'none',
                minWidth: t,
                'data-role': 'menuitem',
                onClose: this.props.onCloseMenu,
                onOpen: this.props.onOpenMenu,
                className: ye.menu,
                ref: this._menu,
                content: i.createElement(
                  'div',
                  { className: ye.menuLabel },
                  _e.INTERVALS.find((e) => e.name === n).label
                ),
              },
              _e.INTERVALS.map((e) =>
                i.createElement(Me, {
                  dontClosePopup: !0,
                  key: e.name,
                  label: e.label,
                  onClick: this._handleSelectTime,
                  onClickArg: e.name,
                })
              )
            ),
            i.createElement(
              fe,
              { className: ye.add, onClick: this._handleClickAdd },
              s.t(null, void 0, a(54777))
            )
          );
        }
      }
      var Te = a(90186),
        xe = a(70412),
        Ie = a(32563),
        Ae = a(96040),
        Re = a(90826);
      function Ne(e) {
        const { tooltip: t, onClick: a, ...n } = e,
          [o, s] = (0, D.useRovingTabindexElement)(null);
        return A.PLATFORM_ACCESSIBILITY_ENABLED
          ? i.createElement(
              'button',
              {
                ref: o,
                tabIndex: s,
                onClick: a,
                className: p()(Re.button, n.isActive && Re.active),
                type: 'button',
              },
              i.createElement(Ae.RemoveButton, {
                'aria-label': t,
                ...n,
                'data-tooltip': t,
              })
            )
          : i.createElement(Ae.RemoveButton, { ...e, 'data-tooltip': t });
      }
      var Fe = a(89089);
      function He(e) {
        const { tooltip: t, onClick: a, ...n } = e,
          [o, s] = (0, D.useRovingTabindexElement)(null);
        return A.PLATFORM_ACCESSIBILITY_ENABLED
          ? i.createElement(
              'button',
              {
                ref: o,
                tabIndex: s,
                onClick: a,
                className: p()(Fe.button, n.isActive && Fe.active),
                type: 'button',
              },
              i.createElement(c.FavoriteButton, {
                'aria-label': t,
                ...n,
                'data-tooltip': t,
              })
            )
          : i.createElement(c.FavoriteButton, { ...e, 'data-tooltip': t });
      }
      var Le = a(867);
      function Oe(e) {
        const {
            interval: t,
            hint: a,
            isActive: n,
            isDisabled: o,
            isFavorite: s,
            isSignaling: l,
            onClick: r,
            onClickRemove: h,
            onClickFavorite: c,
            isSmallTablet: d,
          } = e,
          u = (0, Te.filterDataProps)(e),
          [v, m] = (0, xe.useHover)(),
          g = i.useCallback((e) => h(t, e), [h, t]),
          b = i.useCallback(() => c(t), [c, t]),
          C = (0, i.useRef)(null);
        return (
          (0, i.useEffect)(() => {
            var e;
            l &&
              d &&
              (null === (e = C.current) || void 0 === e || e.scrollIntoView());
          }, [l, d]),
          i.createElement(
            'div',
            { ...m, ref: C },
            i.createElement(Me, {
              ...u,
              className: p()(Le.menuItem, d && Le.smallWidthMenuItem),
              theme: d ? E.multilineLabelWithIconAndToolboxTheme : void 0,
              isActive: n,
              isDisabled: o,
              isHovered: l,
              onClick: r,
              onClickArg: t,
              toolbox: (function () {
                const { isRemovable: t, isFavoritingAllowed: a } = e,
                  l = i.createElement(Ne, {
                    key: 'remove',
                    isActive: n,
                    hidden: !Ie.touch && !v,
                    onClick: g,
                    className: Le.remove,
                  }),
                  r = i.createElement(He, {
                    key: 'favorite',
                    isActive: n,
                    isFilled: s,
                    onClick: b,
                  });
                return [t && l, !o && a && r];
              })(),
              showToolboxOnHover: !s,
              showToolboxOnFocus: A.PLATFORM_ACCESSIBILITY_ENABLED,
              label: a,
            })
          )
        );
      }
      var De = a(36274);
      const Pe = {
        [De.ResolutionKind.Ticks]: s.t(
          null,
          { context: 'interval_group_name' },
          a(30426)
        ),
        [De.ResolutionKind.Seconds]: s.t(
          null,
          { context: 'interval_group_name' },
          a(74973)
        ),
        [De.ResolutionKind.Minutes]: s.t(
          null,
          { context: 'interval_group_name' },
          a(57470)
        ),
        [De.SpecialResolutionKind.Hours]: s.t(
          null,
          { context: 'interval_group_name' },
          a(62346)
        ),
        [De.ResolutionKind.Days]: s.t(
          null,
          { context: 'interval_group_name' },
          a(74787)
        ),
        [De.ResolutionKind.Weeks]: s.t(
          null,
          { context: 'interval_group_name' },
          a(86614)
        ),
        [De.ResolutionKind.Months]: s.t(
          null,
          { context: 'interval_group_name' },
          a(94328)
        ),
        [De.ResolutionKind.Range]: s.t(
          null,
          { context: 'interval_group_name' },
          a(48801)
        ),
        [De.ResolutionKind.Invalid]: '',
      };
      function Ue(e, t = !1) {
        return { id: e, name: Pe[e], items: [], mayOmitSeparator: t };
      }
      var Be = a(57898),
        We = a.n(Be),
        ze = a(29197),
        Ve = a(59064),
        Ze = a(76197),
        Ke = a(90785);
      function Qe(e) {
        const { className: t, ...a } = e,
          [n, o] = (0, D.useRovingTabindexElement)(null);
        return i.createElement(Ze.CollapsibleSection, {
          ...a,
          ref: n,
          tabIndex: o,
          'data-role': A.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
          className: p()(A.PLATFORM_ACCESSIBILITY_ENABLED && Ke.accessible, t),
          onKeyDown: function (e) {
            const t = (0, I.hashFromEvent)(e);
            (13 !== t && 32 !== t) ||
              (e.preventDefault(),
              n.current instanceof HTMLElement && n.current.click());
          },
        });
      }
      var qe = a(80022);
      const je = {
          openDialog: s.t(null, void 0, a(79353)),
          timeInterval: s.t(null, void 0, a(32916)),
        },
        Ge = (0, G.hotKeySerialize)({
          keys: [','],
          text: s.t(null, void 0, a(14605)),
        }),
        Ye = (0, M.registryContextType)(),
        Xe = new (We())(),
        Je = i.lazy(async () => ({
          default: (
            await Promise.all([
              a.e(1013),
              a.e(5145),
              a.e(855),
              a.e(2191),
              a.e(6221),
              a.e(4215),
              a.e(7194),
              a.e(2676),
              a.e(3016),
              a.e(4403),
              a.e(4013),
            ]).then(a.bind(a, 44762))
          ).ToolWidgetIntervalsAddDialog,
        }));
      class $e extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._menu = i.createRef()),
            (this._menuItemsContainerRef = i.createRef()),
            (this._renderChildren = (e, t) => [
              ...this._createMenuItems(e, t),
              ...this._createIntervalForm(t),
            ]),
            (this._handleChangeInterval = (e) => {
              const { activeInterval: t, lastNotQuicked: a } = this.state,
                n = this._getQuicks();
              this.setState({
                activeInterval: (0, be.normalizeIntervalString)(e),
                lastNotQuicked: void 0 === t || n.includes(t) ? a : t,
              });
            }),
            (this._bindedForceUpdate = () => {
              this.forceUpdate();
            }),
            (this._handleCloseMenu = () => {
              this.setState({ isOpenedFormMenu: !1 });
            }),
            (this._handleOpenMenu = () => {
              this.setState({ isOpenedFormMenu: !0 });
            }),
            (this._handleSelectInterval = (e) => {
              void 0 !== e &&
                e !== l.linking.interval.value() &&
                this.context.chartWidgetCollection.setResolution(e),
                e && (0, V.trackEvent)('GUI', 'Time Interval', e);
            }),
            (this._handleClickFavorite = (e) => {
              (e = (0, te.ensureDefined)(e)),
                this._isIntervalFavorite(e)
                  ? this._handleRemoveFavorite(e)
                  : this._handleAddFavorite(e);
            }),
            (this._handleAddFavorite = (e) => {
              const { favorites: t } = this.state;
              this.context.favoriteIntervalsService.set([...t, e]);
            }),
            (this._handleRemoveFavorite = (e) => {
              const { favorites: t } = this.state;
              this.context.favoriteIntervalsService.set(
                t.filter((t) => t !== e)
              );
            }),
            (this._handleAddInterval = (e, t) => {
              const { intervalService: a } = this.context,
                n = a.add(e, t);
              n && this.setState({ lastAddedInterval: n });
            }),
            (this._handleRemoveInterval = (e, t) => {
              var a, n;
              const { intervalService: i } = this.context;
              if (e) {
                if (
                  A.PLATFORM_ACCESSIBILITY_ENABLED &&
                  t &&
                  (0, Z.isKeyboardClick)(t) &&
                  this._menuItemsContainerRef.current
                ) {
                  const t = (0, v.queryMenuElements)(
                      this._menuItemsContainerRef.current
                    ),
                    i = t.findIndex((t) => t.matches(`[data-value="${e}"]`));
                  if (-1 !== i) {
                    const e =
                      null !== (a = t[i + 1]) && void 0 !== a ? a : t[i - 1];
                    e
                      ? e.focus()
                      : null === (n = this._menu.current) ||
                        void 0 === n ||
                        n.focusMenu();
                  }
                }
                i.remove(e), this._handleRemoveFavorite(e);
              }
            }),
            (this._getHandleSectionStateChange = (e) => (t) => {
              const { menuViewState: a } = this.state,
                { intervalsMenuViewStateService: n } = this.context;
              n.set({ ...a, [e]: !t });
            }),
            (this._handleOpenAddIntervalDialog = () => {
              this.setState({ isAddIntervalDialogOpened: !0 });
            }),
            (this._handleCloseAddIntervalDialog = () => {
              this.setState({ isAddIntervalDialogOpened: !1 });
            }),
            (this._handleGlobalClose = () => {
              const { isFake: e } = this.props,
                { isAddIntervalDialogOpened: t } = this.state;
              e || t || Xe.fire();
            }),
            (this._handeQuickClick = (e) => {
              this._handleSelectInterval(e), this._trackClick();
            }),
            (this._updateMenuPosition = () => {
              var e;
              null === (e = this._menu.current) || void 0 === e || e.update();
            }),
            (0, M.validateRegistry)(t, {
              chartApiInstance: o.any.isRequired,
              favoriteIntervalsService: o.any.isRequired,
              intervalService: o.any.isRequired,
              intervalsMenuViewStateService: o.any.isRequired,
            });
          const {
            chartApiInstance: a,
            favoriteIntervalsService: s,
            intervalService: r,
            intervalsMenuViewStateService: h,
          } = t;
          this._customIntervals = n.enabled('custom_resolutions');
          const c = l.linking.interval.value(),
            d = c && (0, be.normalizeIntervalString)(c),
            u = s.get(),
            m = r.getCustomIntervals(),
            p = h.get();
          (this._defaultIntervals = a
            .defaultResolutions()
            .filter(be.isIntervalEnabled)
            .map(be.normalizeIntervalString)),
            (this.state = {
              isOpenedFormMenu: !1,
              activeInterval: d,
              favorites: u,
              customs: m,
              menuViewState: p,
              isAddIntervalDialogOpened: !1,
            });
        }
        componentDidMount() {
          const {
            favoriteIntervalsService: e,
            intervalService: t,
            intervalsMenuViewStateService: a,
          } = this.context;
          e.getOnChange().subscribe(this, this._handleChangeFavorites),
            a.getOnChange().subscribe(this, this._handleChangeMenuViewState),
            t.getOnChange().subscribe(this, this._handleChangeCustoms),
            l.linking.interval.subscribe(this._handleChangeInterval),
            l.linking.intraday.subscribe(this._bindedForceUpdate),
            l.linking.seconds.subscribe(this._bindedForceUpdate),
            l.linking.ticks.subscribe(this._bindedForceUpdate),
            l.linking.range.subscribe(this._bindedForceUpdate),
            l.linking.supportedResolutions.subscribe(this._bindedForceUpdate),
            l.linking.dataFrequencyResolution.subscribe(
              this._bindedForceUpdate
            ),
            Ve.globalCloseDelegate.subscribe(this, this._handleGlobalClose);
        }
        componentWillUnmount() {
          const {
            favoriteIntervalsService: e,
            intervalService: t,
            intervalsMenuViewStateService: a,
          } = this.context;
          e.getOnChange().unsubscribe(this, this._handleChangeFavorites),
            a.getOnChange().unsubscribe(this, this._handleChangeMenuViewState),
            t.getOnChange().unsubscribe(this, this._handleChangeCustoms),
            l.linking.interval.unsubscribe(this._handleChangeInterval),
            l.linking.intraday.unsubscribe(this._bindedForceUpdate),
            l.linking.seconds.unsubscribe(this._bindedForceUpdate),
            l.linking.ticks.unsubscribe(this._bindedForceUpdate),
            l.linking.range.unsubscribe(this._bindedForceUpdate),
            l.linking.supportedResolutions.unsubscribe(this._bindedForceUpdate),
            l.linking.dataFrequencyResolution.unsubscribe(
              this._bindedForceUpdate
            ),
            Ve.globalCloseDelegate.unsubscribe(this, this._handleGlobalClose);
        }
        componentDidUpdate(e, t) {
          this.state.lastAddedInterval &&
            setTimeout(() => this.setState({ lastAddedInterval: void 0 }), 400);
        }
        render() {
          const { isShownQuicks: e, id: t } = this.props,
            {
              activeInterval: a,
              customs: n,
              lastNotQuicked: o,
              isAddIntervalDialogOpened: s,
            } = this.state,
            l = this._getQuicks(),
            r = (0, be.sortResolutions)([...l]);
          void 0 !== a && r.includes(a)
            ? void 0 !== o && r.push(o)
            : void 0 !== a && r.push(a);
          const h = (!(!e || 0 === l.length) || void 0) && r.length > 1,
            c = {},
            d = (0, be.mergeResolutions)(this._defaultIntervals, n);
          (void 0 !== a ? d.concat(a) : d)
            .filter(be.isAvailable)
            .forEach((e) => (c[e] = !0));
          const u =
            void 0 !== a ? (0, be.getTranslatedResolutionModel)(a) : null;
          return i.createElement(
            b,
            { id: t },
            h &&
              i.createElement(
                R,
                { className: qe.group, orientation: 'horizontal' },
                r.map((e, t) => {
                  const n = (0, be.getTranslatedResolutionModel)(e);
                  return i.createElement(_, {
                    key: t,
                    role: 'radio',
                    className: m(qe.button, {
                      [qe.first]: 0 === t,
                      [qe.last]: t === r.length - 1,
                    }),
                    text: i.createElement(Se, {
                      value: n.mayOmitMultiplier ? void 0 : n.multiplier,
                      metric: n.shortKind,
                    }),
                    hint: n.hint,
                    'aria-checked': a === e,
                    isActive: a === e,
                    isDisabled: !c[e] && e !== o,
                    onClick: this._handeQuickClick,
                    onClickArg: e,
                    'data-value': e,
                  });
                })
              ),
            i.createElement(
              f.MatchMedia,
              { rule: w.DialogBreakpoints.TabletSmall },
              (e) =>
                i.createElement(
                  i.Fragment,
                  null,
                  i.createElement(
                    ze.CloseDelegateContext.Provider,
                    { value: Xe },
                    i.createElement(
                      v.ToolbarMenuButton,
                      {
                        arrow: Boolean(h),
                        closeOnClickOutside: !0,
                        content:
                          h || null === u
                            ? void 0
                            : i.createElement(
                                b,
                                { className: qe.menuContent },
                                i.createElement(Se, {
                                  value: u.mayOmitMultiplier
                                    ? void 0
                                    : u.multiplier,
                                  metric: u.shortKind,
                                })
                              ),
                        hotKey: h ? Ge : void 0,
                        className: qe.menu,
                        ref: this._menu,
                        isDrawer: e,
                        onClick: this._trackClick,
                        tooltip: h || null === u ? je.timeInterval : u.hint,
                        menuReference: this._menuItemsContainerRef,
                      },
                      i.createElement(
                        'div',
                        { className: qe.dropdown },
                        this._renderChildren(d, e)
                      )
                    )
                  ),
                  e &&
                    s &&
                    i.createElement(
                      i.Suspense,
                      { fallback: null },
                      i.createElement(Je, {
                        onAdd: this._handleAddInterval,
                        onClose: this._handleCloseAddIntervalDialog,
                        onUnmount: this._handleCloseAddIntervalDialog,
                      })
                    )
                )
            )
          );
        }
        _createMenuItems(e, t) {
          const a = (function (e) {
            const t = Ue(De.ResolutionKind.Ticks),
              a = Ue(De.ResolutionKind.Seconds),
              n = Ue(De.ResolutionKind.Minutes),
              i = Ue(De.SpecialResolutionKind.Hours),
              o = Ue(De.ResolutionKind.Days),
              s = Ue(De.ResolutionKind.Range);
            return (
              e.forEach((e) => {
                const l = De.Interval.parse(e);
                l.isMinuteHours()
                  ? i.items.push(e)
                  : l.isMinutes()
                  ? (0, De.isHour)(Number(l.multiplier()))
                    ? i.items.push(e)
                    : n.items.push(e)
                  : l.isSeconds()
                  ? a.items.push(e)
                  : l.isDWM()
                  ? o.items.push(e)
                  : l.isRange()
                  ? s.items.push(e)
                  : l.isTicks() && t.items.push(e);
              }),
              [t, a, n, i, o, s].filter((e) => 0 !== e.items.length)
            );
          })(e).map((e, a, n) =>
            this._renderResolutionsGroup(e, 1 === n.length, t)
          );
          return (function (e) {
            let t = !1;
            return e.filter((e, a, n) => {
              let i = !0;
              return (
                e.type === y.PopupMenuSeparator &&
                  ((0 !== a && a !== n.length - 1) || (i = !1), t && (i = !1)),
                (t = e.type === y.PopupMenuSeparator),
                i
              );
            });
          })([].concat(...a));
        }
        _createIntervalForm(e) {
          if (this._customIntervals) {
            const t = e
              ? i.createElement(et, {
                  key: 'add-dialog',
                  onClick: this._handleOpenAddIntervalDialog,
                })
              : i.createElement(ke, {
                  key: 'add-form',
                  onAdd: this._handleAddInterval,
                  onCloseMenu: this._handleCloseMenu,
                  onOpenMenu: this._handleOpenMenu,
                  onSelect: this._updateMenuPosition,
                });
            return [
              i.createElement(y.PopupMenuSeparator, {
                key: 'custom-interval-separator',
              }),
              t,
            ];
          }
          return [];
        }
        _renderResolutionsGroup(e, t = !1, a) {
          const n = [],
            o = e.items.map((e) => this._renderPopupMenuItem(e, a));
          if (t) n.push(...o);
          else if (a) {
            const t = i.createElement(tt, { key: e.id, title: e.name }, o);
            n.push(t);
          } else {
            const { intervalsMenuViewStateService: t } = this.context,
              { menuViewState: a } = this.state;
            if (!t.isAllowed(e.id)) return [];
            const s = i.createElement(
              Qe,
              {
                key: e.id,
                className: qe.section,
                summary: e.name,
                open: !a[e.id],
                onStateChange: this._getHandleSectionStateChange(e.id),
              },
              o
            );
            n.push(s);
          }
          return (
            (!e.mayOmitSeparator || e.items.length > 1) &&
              (n.unshift(
                i.createElement(y.PopupMenuSeparator, {
                  key: `begin-${e.name}`,
                })
              ),
              n.push(
                i.createElement(y.PopupMenuSeparator, { key: `end-${e.name}` })
              )),
            n
          );
        }
        _handleChangeFavorites(e) {
          this.setState({ lastNotQuicked: void 0, favorites: e });
        }
        _handleChangeCustoms(e) {
          this.setState({ customs: e });
        }
        _handleChangeMenuViewState(e) {
          this.setState({ menuViewState: e }, () => {
            this._menu.current && this._menu.current.update();
          });
        }
        _renderPopupMenuItem(e, t) {
          const { isFavoritingAllowed: a } = this.props,
            { activeInterval: n, lastAddedInterval: o } = this.state,
            s = e === n,
            l = (0, be.isAvailable)(e),
            r = this._isIntervalFavorite(e),
            h = this._isIntervalDefault(e),
            c = (0, be.getTranslatedResolutionModel)(e);
          return i.createElement(Oe, {
            key: e,
            isSmallTablet: t,
            interval: e,
            hint: c.hint,
            isSignaling: o === e,
            isFavoritingAllowed: a,
            isDisabled: !l,
            isFavorite: r,
            isRemovable: !h,
            isActive: s,
            onClick: this._handleSelectInterval,
            onClickRemove: this._handleRemoveInterval,
            onClickFavorite: this._handleClickFavorite,
            'data-value': e,
          });
        }
        _isIntervalDefault(e) {
          return this._defaultIntervals.includes(e);
        }
        _isIntervalFavorite(e) {
          return this.state.favorites.includes(e);
        }
        _getQuicks(e) {
          return this.props.isShownQuicks && 'small' !== this.props.displayMode
            ? void 0 === e
              ? this.state.favorites
              : e
            : [];
        }
        _trackClick() {
          0;
        }
      }
      function et(e) {
        const { onClick: t, className: n } = e;
        return i.createElement(
          'div',
          {
            key: 'add-dialog',
            className: m(qe.addCustomInterval, n),
            onClick: t,
          },
          s.t(null, void 0, a(95798)) + '…'
        );
      }
      function tt(e) {
        const { children: t, title: a, className: n } = e;
        return i.createElement(
          'div',
          { className: n },
          i.createElement('div', { className: qe.smallTabletSectionTitle }, a),
          t
        );
      }
      $e.contextType = Ye;
      var at = a(23902),
        nt = a(82436);
      const it = (0, M.registryContextType)();
      class ot extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleClick = () => {
              const {
                  chartWidgetCollection: e,
                  windowMessageService: t,
                  isFundamental: a,
                } = this.context,
                n = e.activeChartWidget.value();
              n.withModel(null, () => {
                t.post(parent, 'openChartInPopup', {
                  symbol: n.model().mainSeries().actualSymbol(),
                  interval: n.model().mainSeries().interval(),
                  fundamental: a,
                });
              });
            }),
            (0, M.validateRegistry)(t, {
              isFundamental: o.any,
              chartWidgetCollection: o.any.isRequired,
              windowMessageService: o.any.isRequired,
            });
        }
        render() {
          const { className: e } = this.props;
          return i.createElement(j.ToolbarIconButton, {
            className: m(e, at.button),
            icon: nt,
            onClick: this._handleClick,
            tooltip: s.t(null, void 0, a(55520)),
          });
        }
      }
      ot.contextType = it;
      var st = a(48449);
      const lt = (0, M.registryContextType)();
      class rt extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleClick = (e) => {
              const { chartWidgetCollection: t } = this.context,
                a = t.activeChartWidget.value();
              (0, V.trackEvent)(
                'GUI',
                'Chart Header Toolbar',
                'chart properties'
              ),
                a.showGeneralChartProperties(void 0, {
                  shouldReturnFocus: (0, Z.isKeyboardClick)(e),
                });
            }),
            (0, M.validateRegistry)(t, {
              chartWidgetCollection: o.any.isRequired,
            });
        }
        render() {
          return i.createElement(j.ToolbarIconButton, {
            ...this.props,
            icon: st,
            onClick: this._handleClick,
            tooltip: s.t(null, void 0, a(74207)),
          });
        }
      }
      rt.contextType = lt;
      var ht = a(4741),
        ct = a(93352),
        dt = a(40173),
        ut = a(69297),
        vt = a(20461);
      (0, dt.mergeThemes)(ut.DEFAULT_MENU_ITEM_SWITCHER_THEME, vt);
      var mt = a(53180),
        pt = a(70152);
      function gt(e) {
        const { wasChanges: t, isSaving: n, className: o } = e;
        return i.createElement(
          'span',
          { className: m(pt.saveString, !t && !n && pt.hidden, o) },
          n
            ? i.createElement(se.Loader, {
                className: pt.loader,
                size: 'small',
                staticPosition: !0,
              })
            : s.t(null, void 0, a(85520))
        );
      }
      var bt = a(36296),
        Ct = a(63672),
        St = a(92998);
      a(40670);
      const _t = n.enabled('widget'),
        yt = s.t(null, void 0, a(75789)),
        ft = (0, dt.mergeThemes)(P.DEFAULT_TOOL_WIDGET_BUTTON_THEME, St),
        wt = (0, dt.mergeThemes)(u.DEFAULT_POPUP_MENU_ITEM_THEME, {
          shortcut: Ct.shortcut,
          withIcon: Ct.withIcon,
        }),
        Et = s.t(null, void 0, a(80959)),
        Mt = s.t(null, void 0, a(11680)),
        kt = [],
        Tt = (0, G.hotKeySerialize)({
          keys: [(0, Y.humanReadableModifiers)(Y.Modifiers.Mod, !1), 'S'],
          text: '{0} + {1}',
        });
      class xt extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._copyElRef = i.createRef()),
            (this._handleCopyLinkClick = () => Promise.resolve()),
            (this._handleCloneClick = () => {
              var e, t;
              null === (t = (e = this.props).onCloneChart) ||
                void 0 === t ||
                t.call(e);
            }),
            (this._handleSaveClick = () => {
              var e, t;
              null === (t = (e = this.props).onSaveChart) ||
                void 0 === t ||
                t.call(e),
                this._trackClick();
            }),
            (this._handleSaveAsClick = () => {
              var e, t;
              null === (t = (e = this.props).onSaveAsChart) ||
                void 0 === t ||
                t.call(e);
            }),
            (this.state = { isSaving: !1 });
        }
        componentDidUpdate(e, t) {
          e.isProcessing &&
            !this.props.isProcessing &&
            (clearTimeout(this._timeout),
            (this._timeout = void 0),
            this.setState({ isSaving: !1 })),
            !e.isProcessing &&
              this.props.isProcessing &&
              (this._timeout = setTimeout(() => {
                this.setState({ isSaving: !0 });
              }, 1e3));
        }
        componentWillUnmount() {
          this._timeout && clearTimeout(this._timeout);
        }
        render() {
          const {
              id: e,
              isReadOnly: t,
              displayMode: n,
              isProcessing: o,
              title: l,
              wasChanges: r,
              hideMenu: h,
              isTabletSmall: c,
              onOpenMenu: u,
              dataNameSaveMenu: p,
            } = this.props,
            g = !t && !h,
            C = !(r || !l || this.state.isSaving),
            S = i.createElement(
              'div',
              { className: Ct.textWrap },
              i.createElement(
                'span',
                { className: Ct.text },
                l || s.t(null, void 0, a(85520))
              ),
              i.createElement(gt, {
                isSaving: this.state.isSaving,
                wasChanges: r,
              })
            );
          return i.createElement(
            b,
            null,
            t
              ? i.createElement(
                  b,
                  null,
                  i.createElement(z, {
                    id: e,
                    displayMode: n,
                    icon: i.createElement(d.Icon, { icon: bt }),
                    isDisabled: o,
                    onClick: this._handleCloneClick,
                    text: s.t(null, void 0, a(35216)),
                    collapseWhen: kt,
                    tooltip: Et,
                  })
                )
              : i.createElement(
                  b,
                  null,
                  i.createElement(z, {
                    id: e,
                    className: m(Ct.button, g && Ct.buttonSmallPadding),
                    displayMode: n,
                    'aria-disabled': !!C || void 0,
                    isDisabled: o,
                    onClick: C ? void 0 : this._handleSaveClick,
                    text: S,
                    theme: ft,
                    collapseWhen: kt,
                    tooltip: C
                      ? s.t(null, void 0, a(88368))
                      : s.t(null, void 0, a(87409)),
                    'data-tooltip-hotkey': _t || C ? '' : Tt,
                  }),
                  g &&
                    i.createElement(
                      v.ToolbarMenuButton,
                      {
                        'data-name': p,
                        arrow: !0,
                        isDrawer: c,
                        drawerPosition: 'Bottom',
                        onClick: this._trackClick,
                        onOpen: u,
                        tooltip: s.t(null, void 0, a(58219)),
                      },
                      this._renderMenuItems(Boolean(c))
                    )
                )
          );
        }
        _renderMenuItems(e) {
          const {
              wasChanges: t,
              isProcessing: n,
              chartId: o,
              onSaveChartFromMenu: l,
              onRenameChart: r,
              onLoadChart: h,
              onNewChart: c,
              isAutoSaveEnabled: d,
              autoSaveId: v,
              sharingId: p,
              onAutoSaveChanged: g,
              isSharingEnabled: b,
              onSharingChanged: C,
              layoutItems: S,
              onExportData: _,
              isAuthenticated: f,
            } = this.props,
            w = e ? E.multilineLabelWithIconAndToolboxTheme : wt,
            M = e ? void 0 : (0, Y.humanReadableHash)(Y.Modifiers.Mod + 83),
            k = e ? void 0 : s.t(null, { context: 'hotkey' }, a(14229)),
            T = [];
          return (
            T.push(
              i.createElement(u.PopupMenuItem, {
                key: 'save',
                isDisabled: Boolean(n || (!t && o)),
                label: Mt,
                onClick: l,
                shortcut: M,
                labelRowClassName: m(e && Ct.popupItemRowTabletSmall),
                theme: w,
                'data-name': 'save-load-menu-item-save',
              })
            ),
            void 0 !== o &&
              T.push(
                i.createElement(u.PopupMenuItem, {
                  key: 'rename',
                  icon: void 0,
                  label: (0, mt.appendEllipsis)(s.t(null, void 0, a(35038))),
                  onClick: r,
                  labelRowClassName: m(e && Ct.popupItemRowTabletSmall),
                  theme: w,
                  'data-name': 'save-load-menu-item-rename',
                }),
                i.createElement(u.PopupMenuItem, {
                  key: 'save-as',
                  icon: void 0,
                  label: (0, mt.appendEllipsis)(Et),
                  onClick: this._handleSaveAsClick,
                  labelRowClassName: m(e && Ct.popupItemRowTabletSmall),
                  theme: w,
                  'data-name': 'save-load-menu-item-clone',
                })
              ),
            T.push(
              i.createElement(y.PopupMenuSeparator, {
                key: 'all-layouts-separator',
              }),
              i.createElement(u.PopupMenuItem, {
                key: 'all-layouts',
                className: 'js-save-load-menu-item-load-chart',
                label: (0, mt.appendEllipsis)(yt),
                onClick: h,
                labelRowClassName: m(e && Ct.popupItemRowTabletSmall),
                theme: w,
                shortcut: k,
                'data-name': 'save-load-menu-item-load',
              })
            ),
            T
          );
        }
        _trackClick() {
          0;
        }
      }
      const It = (0, M.registryContextType)();
      class At extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._exportDialogPromise = null),
            (this._layoutsAbortController = null),
            (this._requestRecentLayouts = () => {}),
            (this._handleExportData = () => {
              0;
            }),
            (this._syncState = (e) => {
              this.setState(e);
            }),
            (this._onChangeHasChanges = (e) => {
              this.state.wasChanges !== e && this.setState({ wasChanges: e });
            }),
            (this._onChangeAutoSaveEnabled = (e) => {
              0;
            }),
            (this._onChangeSharingEnabled = (e) => {
              this.setState({ isSharingEnabled: e });
            }),
            (this._onChangeTitle = (e) => {
              this.setState({ title: e });
            }),
            (this._onChangeId = (e) => {
              this.setState({ id: e });
            }),
            (this._onChartAboutToBeSaved = () => {
              this.setState({ isProcessing: !0 });
            }),
            (this._onChartSaved = () => {
              this.setState({ isProcessing: !1 });
            }),
            (this._handleAutoSaveEnabled = (e) => {
              0;
            }),
            (this._handleSharingEnabled = (e) => {
              0;
            }),
            (this._handleClickSave = () => {
              this.context.saveChartService.saveChartOrShowTitleDialog(),
                this._trackEvent('Save click');
            }),
            (this._handleOpenMenu = () => {
              this._requestRecentLayouts();
            }),
            (this._handleClickSaveFromMenu = () => {
              this.context.saveChartService.saveChartOrShowTitleDialog(),
                this._trackEvent('Save From Menu');
            }),
            (this._handleClickClone = () => {
              this.context.saveChartService.cloneChart();
            }),
            (this._handleClickSaveAs = () => {
              this.context.saveChartService.saveChartAs(),
                this._trackEvent('Make a copy');
            }),
            (this._handleClickNew = () => {
              this._trackEvent('New chart layout');
            }),
            (this._handleClickLoad = () => {
              this.context.loadChartService.showLoadDialog();
              this._trackEvent('Load chart layout');
            }),
            (this._handleHotkey = () => {
              this.context.loadChartService.showLoadDialog();
            }),
            (this._handleClickRename = () => {
              this.context.saveChartService.renameChart(),
                this._trackEvent('Rename');
            }),
            (0, M.validateRegistry)(t, {
              chartWidgetCollection: o.any.isRequired,
              chartChangesWatcher: o.any.isRequired,
              saveChartService: o.any.isRequired,
              sharingChartService: o.any,
              loadChartService: o.any.isRequired,
            });
          const {
            chartWidgetCollection: a,
            chartChangesWatcher: n,
            saveChartService: i,
            sharingChartService: s,
          } = t;
          this.state = {
            isAuthenticated: window.is_authenticated,
            isProcessing: !1,
            id: a.metaInfo.id.value(),
            title: a.metaInfo.name.value(),
            wasChanges: n.hasChanges(),
            iconHovered: !1,
          };
        }
        componentDidMount() {
          const { chartSaver: e, isFake: t, stateSyncEmitter: n } = this.props,
            {
              chartWidgetCollection: i,
              chartChangesWatcher: o,
              saveChartService: l,
              sharingChartService: r,
            } = this.context;
          t
            ? n.on('change', this._syncState)
            : (o.getOnChange().subscribe(this, this._onChangeHasChanges),
              i.metaInfo.name.subscribe(this._onChangeTitle),
              i.metaInfo.id.subscribe(this._onChangeId),
              (this._hotkeys = (0, ht.createGroup)({ desc: 'Save/Load' })),
              this._hotkeys.add({
                desc: s.t(null, void 0, a(75687)),
                handler: this._handleHotkey,
                hotkey: 190,
              }),
              e.chartSaved().subscribe(this, this._onChartSaved),
              e
                .chartAboutToBeSaved()
                .subscribe(this, this._onChartAboutToBeSaved),
              window.loginStateChange.subscribe(
                this,
                this._onLoginStateChange
              ));
        }
        componentDidUpdate(e, t) {
          this.props.isFake ||
            (t !== this.state &&
              this.props.stateSyncEmitter.emit('change', this.state));
        }
        componentWillUnmount() {
          var e;
          const { chartSaver: t, isFake: a, stateSyncEmitter: n } = this.props,
            {
              chartWidgetCollection: i,
              chartChangesWatcher: o,
              saveChartService: s,
              sharingChartService: l,
            } = this.context;
          a
            ? n.off('change', this._syncState)
            : (o.getOnChange().unsubscribe(this, this._onChangeHasChanges),
              i.metaInfo.name.unsubscribe(this._onChangeTitle),
              i.metaInfo.id.unsubscribe(this._onChangeId),
              (0, te.ensureDefined)(this._hotkeys).destroy(),
              t.chartSaved().unsubscribe(this, this._onChartSaved),
              t
                .chartAboutToBeSaved()
                .unsubscribe(this, this._onChartAboutToBeSaved),
              window.loginStateChange.unsubscribe(
                this,
                this._onLoginStateChange
              ),
              null === (e = this._layoutsAbortController) ||
                void 0 === e ||
                e.abort());
        }
        render() {
          const {
              isReadOnly: e,
              displayMode: t,
              id: a,
              isFake: n,
            } = this.props,
            {
              isProcessing: o,
              isAuthenticated: s,
              title: l,
              id: r,
              wasChanges: h,
              isAutoSaveEnabled: c,
              isSharingEnabled: d,
              recentLayouts: u,
            } = this.state,
            v = {
              displayMode: t,
              isReadOnly: e,
              isAuthenticated: s,
              isProcessing: o,
              wasChanges: h,
              title: l,
              id: a,
              chartId: null !== r ? r : void 0,
              dataNameSaveMenu: n ? void 0 : 'save-load-menu',
              onCloneChart: this._handleClickClone,
              onSaveChart: this._handleClickSave,
              onSaveChartFromMenu: this._handleClickSaveFromMenu,
              onRenameChart: this._handleClickRename,
              onSaveAsChart: this._handleClickSaveAs,
              onLoadChart: this._handleClickLoad,
            };
          return i.createElement(
            f.MatchMedia,
            { rule: w.DialogBreakpoints.TabletSmall },
            (e) => i.createElement(xt, { ...v, isTabletSmall: e })
          );
        }
        _onLoginStateChange() {
          this.setState({ isAuthenticated: window.is_authenticated });
        }
        _trackEvent(e) {
          0;
        }
      }
      At.contextType = It;
      var Rt = a(53166),
        Nt = a(34928),
        Ft = a(79982);
      const Ht = new Nt.DateTimeFormatter({
          dateTimeSeparator: '_',
          timeFormat: '%h-%m-%s',
        }),
        Lt = { takeSnapshot: s.t(null, void 0, a(88513)) },
        Ot = (0, M.registryContextType)();
      const Dt = s.t(null, void 0, a(90879));
      function Pt(e, t, a) {
        return (async function (e, t, a) {
          const n = URL.createObjectURL(
            new Blob(
              [
                `<!doctype html><html style="background-color:${
                  getComputedStyle(document.documentElement).backgroundColor
                }"><head><meta charset="utf-8"><title>${Dt}</title></head><body style="background-color:${
                  getComputedStyle(document.body).backgroundColor
                }"></body></html>`,
              ],
              { type: 'text/html' }
            )
          );
          try {
            const i = open(n, t, a);
            if (!i) throw new Error('cound not open a new tab');
            const o = await e.catch(() => {});
            void 0 !== o ? i.location.replace(o) : i.close();
          } finally {
            URL.revokeObjectURL(n);
          }
        })(e, t, a);
      }
      var Ut = a(65446),
        Bt = a(65939),
        Wt = a(64618);
      function zt(e) {
        const t = m(e.isLoading && Wt.hidden),
          a = m(!e.isLoading && Wt.hidden);
        return i.createElement(
          'div',
          null,
          i.createElement('span', { className: t }, e.children),
          i.createElement(
            'span',
            { className: a },
            i.createElement(se.Loader, null)
          )
        );
      }
      var Vt = a(76974),
        Zt = a(84502),
        Kt = a(1457),
        Qt = a(23595),
        qt = a(29414),
        jt = a(99280),
        Gt = a(18369);
      const Yt = (0, dt.mergeThemes)(u.DEFAULT_POPUP_MENU_ITEM_THEME, Gt);
      function Xt(e) {
        const { serverSnapshot: t, clientSnapshot: n, hideShortcuts: o } = e,
          [l, r] = (0, i.useState)(!1),
          [h, c] = (0, i.useState)(!1),
          [d, v] = (0, i.useState)(!1),
          p = (0, Vt.useIsMounted)(),
          g = (0, i.useCallback)(async () => {
            var e;
            const t = n(),
              a = t.then(
                (e) =>
                  new Promise((t) =>
                    e.canvas.toBlob((e) => {
                      null !== e && t(e);
                    })
                  )
              );
            try {
              await (0, Ut.writePromiseUsingApi)(a, 'image/png'),
                ce.emit('onClientScreenshotCopiedToClipboard');
            } catch (a) {
              const { canvas: n } = await t;
              null === (e = window.open()) ||
                void 0 === e ||
                e.document.write(`<img width="100%" src="${n.toDataURL()}"/>`);
            }
          }, [n]),
          b = (0, i.useCallback)(async () => {
            const e = await n(),
              t = await (function (e) {
                return new Promise((t) => {
                  try {
                    e.canvas.toBlob((e) => {
                      if (null === e)
                        throw new Error('Unable to generate blob');
                      t(URL.createObjectURL(e));
                    });
                  } catch (a) {
                    t(e.canvas.toDataURL());
                  }
                });
              })(e);
            t && (0, Bt.downloadFile)(`${e.name}.png`, t);
          }, [n]),
          C = (e) => Pt(e.then((e) => e.imageUrl)),
          S = (0, i.useCallback)(
            async (e = !1) => {
              const a = t();
              try {
                if (e) await C(a);
                else {
                  const e = a.then(
                    (e) => new Blob([e.imageUrl], { type: 'text/plain' })
                  );
                  await (0, Ut.writePromiseUsingApi)(e, 'text/plain'),
                    ce.emit('onServerScreenshotCopiedToClipboard');
                }
                return !0;
              } catch (e) {
                return C(a), !0;
              } finally {
                p.current && (c(!1), r(!1), (0, Ve.globalCloseMenu)());
              }
            },
            [t]
          ),
          _ = (0, i.useCallback)(async () => {
            v(!0);
            const [e, n] = await Promise.all([
              a.e(4665).then(a.bind(a, 65692)),
              t(),
            ]);
            e.Twitter.shareSnapshotInstantly(n.symbol, n.imageUrl),
              p.current && (v(!1), (0, Ve.globalCloseMenu)());
          }, [t]);
        return i.createElement(
          i.Fragment,
          null,
          i.createElement(
            he.ToolWidgetMenuSummary,
            null,
            s.t(null, void 0, a(45888))
          ),
          i.createElement(u.PopupMenuItem, {
            'data-name': 'save-chart-image',
            label: s.t(null, void 0, a(39011)),
            icon: Qt,
            onClick: b,
            shortcut: o
              ? void 0
              : (0, Y.humanReadableHash)(
                  Y.Modifiers.Mod + Y.Modifiers.Alt + 83
                ),
            theme: Yt,
          }),
          i.createElement(u.PopupMenuItem, {
            'data-name': 'copy-chart-image',
            label: s.t(null, void 0, a(43001)),
            icon: Kt,
            onClick: g,
            shortcut: o
              ? void 0
              : (0, Y.humanReadableHash)(
                  Y.Modifiers.Mod + Y.Modifiers.Shift + 83
                ),
            theme: Yt,
          }),
          i.createElement(u.PopupMenuItem, {
            'data-name': 'copy-link-to-the-chart-image',
            label: i.createElement(
              zt,
              { isLoading: l },
              s.t(null, void 0, a(7367))
            ),
            icon: qt,
            onClick: () => {
              r(!0), S(!1);
            },
            dontClosePopup: !0,
            isDisabled: l,
            shortcut: o
              ? void 0
              : (0, Y.humanReadableHash)(Y.Modifiers.Alt + 83),
            className: m(l && Gt.loading),
            theme: Yt,
          }),
          i.createElement(u.PopupMenuItem, {
            'data-name': 'open-image-in-new-tab',
            label: i.createElement(
              zt,
              { isLoading: h },
              s.t(null, void 0, a(38543))
            ),
            icon: jt,
            onClick: () => {
              c(!0), S(!0);
            },
            dontClosePopup: !0,
            isDisabled: h,
            className: m(h && Gt.loading),
            theme: Yt,
          }),
          i.createElement(u.PopupMenuItem, {
            'data-name': 'tweet-chart-image',
            label: i.createElement(
              zt,
              { isLoading: d },
              s.t(null, void 0, a(99746))
            ),
            icon: Zt,
            onClick: _,
            dontClosePopup: !0,
            isDisabled: d,
            className: m(d && Gt.loading),
            theme: Yt,
          })
        );
      }
      var Jt = a(84015);
      function $t(e) {
        const [t, a] = (0, i.useState)(!1),
          n = (0, Vt.useIsMounted)(),
          o = (0, i.useCallback)(async () => {
            a(!0), await e.serverSnapshot(), n.current && a(!1);
          }, [e.serverSnapshot]);
        return i.createElement(P.ToolWidgetButton, {
          id: e.id,
          className: e.className,
          isDisabled: t,
          onClick: o,
          title: e.tooltip,
          icon: e.icon,
        });
      }
      var ea = a(72644);
      const ta =
        ((aa = function (e) {
          return (0, Jt.isOnMobileAppPage)('any')
            ? i.createElement($t, { ...e, icon: ea })
            : i.createElement(
                v.ToolbarMenuButton,
                {
                  content: i.createElement(P.ToolWidgetButton, {
                    tag: 'div',
                    id: e.id,
                    className: e.className,
                    icon: ea,
                  }),
                  drawerPosition: 'Bottom',
                  drawerBreakpoint: w.DialogBreakpoints.TabletSmall,
                  arrow: !1,
                  onClick: function () {},
                  tooltip: e.tooltip,
                },
                i.createElement(Xt, { ...e })
              );
        }),
        ((na = class extends i.PureComponent {
          constructor(e, t) {
            super(e, t),
              (this._clientSnapshot = async () => {
                const e = this.context.chartWidgetCollection.activeChartWidget
                  .value()
                  .model()
                  .mainSeries()
                  .actualSymbol();
                return {
                  canvas:
                    await this.context.chartWidgetCollection.clientSnapshot(),
                  name: `${(0, Ft.shortName)(e)}_${Ht.formatLocal(new Date())}`,
                };
              }),
              (this._serverSnapshot = async () => {
                const e = this.context.chartWidgetCollection.activeChartWidget
                    .value()
                    .model()
                    .mainSeries()
                    .actualSymbol(),
                  t = await this.context.chartWidgetCollection.takeScreenshot(),
                  a =
                    n.enabled('charting_library_base') &&
                    void 0 !== this.context.snapshotUrl
                      ? t
                      : (0, Rt.convertImageNameToUrl)(t);
                return { symbol: (0, Ft.shortName)(e), imageUrl: a };
              }),
              (0, M.validateRegistry)(t, {
                chartWidgetCollection: o.any.isRequired,
              });
          }
          render() {
            const { className: e, id: t } = this.props;
            return i.createElement(aa, {
              id: t,
              className: e,
              tooltip: Lt.takeSnapshot,
              serverSnapshot: this._serverSnapshot,
              clientSnapshot: this._clientSnapshot,
            });
          }
        }).contextType = Ot),
        na);
      var aa,
        na,
        ia = a(31330),
        oa = a(39362),
        sa = a(13702);
      class la {
        async show(e) {
          if (null !== la._provider) {
            const e = await la._provider.getSymbol();
            return l.linking.symbol.setValue(e.symbol), e;
          }
          if (la._currentShowingInstance)
            throw new DOMException(
              'SymbolSearchUI is already shown',
              'InvalidStateError'
            );
          try {
            (la._currentShowingInstance = this), la.preload();
            const t = await la._implementation;
            return (
              (0, te.assert)(null !== t),
              new Promise((a) => {
                t.showDefaultSearchDialog({
                  ...e,
                  onSearchComplete: (e) => {
                    a({ symbol: e });
                  },
                });
              })
            );
          } finally {
            la._currentShowingInstance = null;
          }
        }
        static setProvider(e) {
          this._provider = e;
        }
        static preload() {
          null === this._provider &&
            null === this._implementation &&
            (this._implementation = (0, sa.loadNewSymbolSearch)());
        }
      }
      (la._currentShowingInstance = null),
        (la._provider = null),
        (la._implementation = null);
      var ra = a(25882),
        ha = a(26431);
      const ca = (0, dt.mergeThemes)(C.DEFAULT_TOOLBAR_BUTTON_THEME, ra);
      (0, dt.mergeThemes)(ca, ha);
      class da extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._openSymbolSearchDialog = async (e) => {
              if ((0, Y.modifiersFromEvent)(e) !== Y.Modifiers.Alt)
                try {
                  (0, V.trackEvent)('GUI', 'SS', 'main search'),
                    await new la().show({
                      shouldReturnFocus: (0, Z.isKeyboardClick)(e),
                      defaultValue: this._isSpread(this.state.symbol)
                        ? this.state.symbol
                        : this.state.shortName,
                      showSpreadActions:
                        (0, ia.canShowSpreadActions)() &&
                        this.props.isActionsVisible,
                      source: 'searchBar',
                      footer: Ie.mobiletouch
                        ? void 0
                        : i.createElement(
                            oa.SymbolSearchDialogFooter,
                            null,
                            s.t(null, void 0, a(20987))
                          ),
                    });
                } catch (e) {}
              else (0, ct.getClipboard)().writeText(this.state.symbol);
            }),
            (this._isSpread = (e) => !1),
            (this._onSymbolChanged = () => {
              const e = l.linking.symbol.value();
              this.setState({ symbol: e, shortName: ua() });
            }),
            (this.state = {
              symbol: l.linking.symbol.value(),
              shortName: ua(),
            });
        }
        componentDidMount() {
          l.linking.symbol.subscribe(this._onSymbolChanged),
            l.linking.seriesShortSymbol.subscribe(this._onSymbolChanged),
            la.preload();
        }
        componentWillUnmount() {
          l.linking.symbol.unsubscribe(this._onSymbolChanged),
            l.linking.seriesShortSymbol.unsubscribe(this._onSymbolChanged);
        }
        render() {
          const { id: e, className: t } = this.props;
          return i.createElement(C.ToolbarButton, {
            id: e,
            className: p()(
              t,
              n.enabled('uppercase_instrument_names') && ra.uppercase,
              ra.largeLeftPadding
            ),
            theme: ca,
            icon: void 0,
            text: this.state.shortName,
            onClick: this._openSymbolSearchDialog,
            tooltip: s.t(null, void 0, a(75905)),
          });
        }
        async _updateQuotes(e) {}
      }
      function ua() {
        return (
          l.linking.seriesShortSymbol.value() || l.linking.symbol.value() || ''
        );
      }
      var va = a(5145);
      function ma(e) {
        var t;
        const { className: a, item: n, onApply: o } = e,
          [s, l] = (0, D.useRovingTabindexElement)(null);
        return A.PLATFORM_ACCESSIBILITY_ENABLED
          ? i.createElement(
              'button',
              {
                type: 'button',
                className: m(a, va.item, va.accessible, 'apply-common-tooltip'),
                onClick: r,
                'data-tooltip': n.name,
                'aria-label': n.name,
                tabIndex: l,
                ref: s,
              },
              i.createElement(
                'div',
                { className: va.round },
                null !==
                  (t = (function (e) {
                    var t;
                    const a = Intl.Segmenter;
                    if (a) {
                      const n = new a(void 0, { granularity: 'grapheme' }),
                        [{ segment: i } = { segment: null }] = n.segment(e);
                      return null !==
                        (t = null == i ? void 0 : i.toUpperCase()) &&
                        void 0 !== t
                        ? t
                        : null;
                    }
                    {
                      const t = e.codePointAt(0);
                      return t ? String.fromCodePoint(t).toUpperCase() : null;
                    }
                  })(n.name)) && void 0 !== t
                  ? t
                  : ' '
              )
            )
          : i.createElement(
              'div',
              {
                className: m(a, va.item, 'apply-common-tooltip'),
                onClick: r,
                'data-tooltip': n.name,
              },
              i.createElement(
                'div',
                { className: va.round },
                n.name.length > 0 ? n.name[0].toUpperCase() : ' '
              )
            );
        function r(e) {
          e.stopPropagation(), o(n);
        }
      }
      var pa = a(39344),
        ga = a(92710);
      function ba(e) {
        return i.createElement(
          'div',
          { className: m(ga.description, e.className) },
          e.children
        );
      }
      var Ca = a(48261);
      const Sa = (0, dt.mergeThemes)(u.DEFAULT_POPUP_MENU_ITEM_THEME, {
          labelRow: Ca.labelRow,
          toolbox: Ca.toolbox,
          item: Ca.titleItem,
        }),
        _a = (0, dt.mergeThemes)(u.DEFAULT_POPUP_MENU_ITEM_THEME, {
          labelRow: Ca.labelRow,
          toolbox: Ca.toolbox,
          item: Ca.titleItemTabletSmall,
        }),
        ya = (0, dt.mergeThemes)(u.DEFAULT_POPUP_MENU_ITEM_THEME, {
          item: Ca.item,
        }),
        fa = (0, dt.mergeThemes)(u.DEFAULT_POPUP_MENU_ITEM_THEME, {
          item: Ca.itemTabletSmall,
        });
      function wa(e) {
        const {
            className: t,
            item: a,
            onApply: n,
            onRemove: o,
            onFavor: s,
            favorite: l,
            isFavoritingAllowed: r,
            isTabletSmall: h,
          } = e,
          [d, v] = (0, xe.useHover)(),
          m = a.meta_info,
          g = m ? (0, pa.descriptionString)(m.indicators) : void 0,
          b = h ? _a : Sa,
          C = h ? fa : ya,
          S = (0, i.useCallback)(() => n(a), [n, a]),
          _ = (0, i.useCallback)(() => o(a), [o, a]),
          y = (0, i.useCallback)(() => {
            s && s(a);
          }, [s, a]);
        return i.createElement(
          'div',
          {
            ...v,
            className: p()(t, Ca.wrap),
            'data-name': a.name,
            'data-id': a.id,
            'data-is-default': Boolean(a.is_default),
          },
          i.createElement(u.PopupMenuItem, {
            theme: b,
            label: a.name,
            labelRowClassName: p()(h && Ca.itemLabelTabletSmall),
            isHovered: d,
            showToolboxOnHover: !l && !d,
            onClick: S,
            toolbox: i.createElement(
              i.Fragment,
              null,
              !a.is_default &&
                i.createElement(Ae.RemoveButton, {
                  key: 'remove',
                  hidden: !Ie.touch && !d,
                  onClick: _,
                }),
              Boolean(s) &&
                r &&
                i.createElement(c.FavoriteButton, {
                  key: 'favorite',
                  isFilled: Boolean(l),
                  onClick: y,
                })
            ),
          }),
          g &&
            i.createElement(u.PopupMenuItem, {
              theme: C,
              label: i.createElement(
                ba,
                {
                  className: p()(
                    Ca.description,
                    h && Ca.descriptionTabletSmall
                  ),
                },
                g
              ),
              onClick: S,
              isHovered: d,
            })
        );
      }
      var Ea = a(53707),
        Ma = a(85013);
      const ka = (0, dt.mergeThemes)(u.DEFAULT_POPUP_MENU_ITEM_THEME, Ma);
      function Ta(e) {
        const { onClick: t, isTabletSmall: n, className: o } = e;
        return i.createElement(u.PopupMenuItem, {
          theme: ka,
          className: p()(o, Ma.wrap),
          label: i.createElement(
            'div',
            { className: Ma.titleWrap },
            i.createElement(
              'div',
              { className: p()(Ma.title, n && Ma.titleTabletSmall) },
              i.createElement(d.Icon, { className: Ma.icon, icon: Ea }),
              i.createElement(
                'div',
                { className: Ma.text },
                (0, mt.appendEllipsis)(s.t(null, void 0, a(92093)))
              )
            )
          ),
          onClick: t,
        });
      }
      var xa = a(37968),
        Ia = a(64706);
      const Aa = i.createContext(null);
      var Ra = a(36001);
      function Na(e) {
        const {
            templates: t,
            favorites: a,
            onTemplateSave: n,
            onTemplateRemove: o,
            onTemplateSelect: s,
            onTemplateFavorite: l,
            isTabletSmall: r,
            isLoading: h,
          } = e,
          c = (0, i.useMemo)(() => t.filter((e) => e.is_default), [t]),
          d = (0, i.useMemo)(() => t.filter((e) => !e.is_default), [t]),
          u = (0, i.useMemo)(() => new Set(a.map((e) => e.name)), [a]),
          v = (0, i.useContext)(Aa),
          m = (0, i.useContext)(Ia.MenuContext),
          g = (0, xa.useForceUpdate)();
        (0, i.useEffect)(() => {
          if (null !== v) {
            const e = {};
            return (
              v.getOnChange().subscribe(e, () => {
                g(), m && m.update();
              }),
              () => v.getOnChange().unsubscribeAll(e)
            );
          }
          return () => {};
        }, []);
        const b = (e) =>
          i.createElement(wa, {
            key: e.name,
            item: e,
            isFavoritingAllowed: Boolean(l),
            favorite: u.has(e.name),
            onApply: s,
            onFavor: l,
            onRemove: o,
            isTabletSmall: r,
          });
        return i.createElement(
          'div',
          { className: p()(Ra.menu, r && Ra.menuSmallTablet) },
          i.createElement(Ta, { onClick: n, isTabletSmall: r }),
          h &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(y.PopupMenuSeparator, null),
              i.createElement(re, null)
            ),
          !h &&
            (r
              ? i.createElement(Fa, { defaults: c, customs: d, render: b })
              : i.createElement(Ha, {
                  defaults: c,
                  customs: d,
                  render: b,
                  state: v,
                }))
        );
      }
      function Fa(e) {
        const { defaults: t, customs: n, render: o } = e;
        return i.createElement(
          i.Fragment,
          null,
          n.length > 0 &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(y.PopupMenuSeparator, null),
              i.createElement(
                he.ToolWidgetMenuSummary,
                { className: Ra.menuItemHeaderTabletSmall },
                s.t(null, void 0, a(38554))
              ),
              n.map(o)
            ),
          t.length > 0 &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(y.PopupMenuSeparator, null),
              i.createElement(
                he.ToolWidgetMenuSummary,
                { className: Ra.menuItemHeaderTabletSmall },
                s.t(null, void 0, a(43399))
              ),
              t.map(o)
            )
        );
      }
      function Ha(e) {
        const { defaults: t, customs: n, render: o, state: l } = e;
        return i.createElement(
          i.Fragment,
          null,
          n.length > 0 &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(y.PopupMenuSeparator, null),
              i.createElement(
                he.ToolWidgetMenuSummary,
                { className: Ra.menuItemHeader },
                s.t(null, void 0, a(38554))
              ),
              n.map(o)
            ),
          n.length > 0 &&
            t.length > 0 &&
            l &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(y.PopupMenuSeparator, null),
              i.createElement(
                Ze.CollapsibleSection,
                {
                  summary: s.t(null, void 0, a(43399)),
                  open: !l.get().defaultsCollapsed,
                  onStateChange: (e) => l.set({ defaultsCollapsed: !e }),
                },
                t.map(o)
              )
            ),
          0 === n.length &&
            t.length > 0 &&
            i.createElement(
              i.Fragment,
              null,
              i.createElement(y.PopupMenuSeparator, null),
              i.createElement(
                he.ToolWidgetMenuSummary,
                { className: Ra.menuItemHeader },
                s.t(null, void 0, a(43399))
              ),
              t.map(o)
            )
        );
      }
      var La = a(58275),
        Oa = a.n(La);
      class Da {
        constructor(e, t) {
          var a, i;
          (this._isFavoriteEnabled = n.enabled('items_favoriting')),
            (this.handleFavorTemplate = (e) => {
              if (!this._isFavoriteEnabled) return;
              const { name: t } = e;
              this._isTemplateFavorite(t)
                ? this._removeFavoriteTemplate(t)
                : this._addFavoriteTemplate(t);
            }),
            (this.handleDropdownOpen = () => {
              this._setState({ isLoading: !0 }),
                this._studyTemplates.invalidate(),
                this._studyTemplates.refreshStudyTemplateList(() =>
                  this._setState({ isLoading: !1 })
                );
            }),
            (this.handleApplyTemplate = (e) => {
              this._studyTemplates.applyTemplate(e.name);
            }),
            (this.handleRemoveTemplate = (e) => {
              this._studyTemplates.deleteStudyTemplate(e.name);
            }),
            (this.handleSaveTemplate = () => {
              this._studyTemplates.showSaveAsDialog();
            }),
            (this._studyTemplates = e),
            (this._favoriteStudyTemplatesService = t);
          const o =
              (null === (a = this._favoriteStudyTemplatesService) ||
              void 0 === a
                ? void 0
                : a.get()) || [],
            s = this._studyTemplates.list();
          (this._state = new (Oa())({
            isLoading: !1,
            studyTemplatesList: s,
            favorites: o,
          })),
            this._studyTemplates
              .getOnChange()
              .subscribe(this, this._handleTemplatesChange),
            this._studyTemplates.refreshStudyTemplateList(),
            this._isFavoriteEnabled &&
              (null === (i = this._favoriteStudyTemplatesService) ||
                void 0 === i ||
                i.getOnChange().subscribe(this, this._handleFavoritesChange));
        }
        destroy() {
          var e;
          this._studyTemplates
            .getOnChange()
            .unsubscribe(this, this._handleTemplatesChange),
            this._isFavoriteEnabled &&
              (null === (e = this._favoriteStudyTemplatesService) ||
                void 0 === e ||
                e.getOnChange().unsubscribe(this, this._handleFavoritesChange));
        }
        state() {
          return this._state.readonly();
        }
        _setState(e) {
          this._state.setValue({ ...this._state.value(), ...e });
        }
        _handleTemplatesChange() {
          this._setState({ studyTemplatesList: this._studyTemplates.list() });
        }
        _handleFavoritesChange(e) {
          this._isFavoriteEnabled && this._setState({ favorites: e });
        }
        _removeFavoriteTemplate(e) {
          var t;
          const { favorites: a } = this._state.value();
          null === (t = this._favoriteStudyTemplatesService) ||
            void 0 === t ||
            t.set(a.filter((t) => t !== e));
        }
        _addFavoriteTemplate(e) {
          var t;
          const { favorites: a } = this._state.value();
          null === (t = this._favoriteStudyTemplatesService) ||
            void 0 === t ||
            t.set([...a, e]);
        }
        _isTemplateFavorite(e) {
          const { favorites: t } = this._state.value();
          return t.includes(e);
        }
      }
      var Pa = a(21233),
        Ua = a(70760);
      const Ba = (0, M.registryContextType)();
      class Wa extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._updateState = (e) => {
              this.setState({ ...e, isActive: this.state.isActive });
            }),
            (this._handleApplyTemplate = (e) => {
              this._handleClose(), this._model.handleApplyTemplate(e);
            }),
            (this._handleRemoveTemplate = (e) => {
              this._handleClose(), this._model.handleRemoveTemplate(e);
            }),
            (this._handleClose = () => {
              this._handleToggleDropdown(!1);
            }),
            (this._handleToggleDropdown = (e) => {
              const { isActive: t } = this.state,
                a = 'boolean' == typeof e ? e : !t;
              this.setState({ isActive: a });
            }),
            (0, M.validateRegistry)(t, {
              favoriteStudyTemplatesService: o.any,
              studyTemplates: o.any.isRequired,
              templatesMenuViewStateService: o.any,
            });
          const { favoriteStudyTemplatesService: a, studyTemplates: n } = t;
          (this._model = new Da(n, a)),
            (this.state = { ...this._model.state().value(), isActive: !1 });
        }
        componentDidMount() {
          this._model.state().subscribe(this._updateState);
        }
        componentWillUnmount() {
          this._model.state().unsubscribe(this._updateState),
            this._model.destroy();
        }
        render() {
          const { studyTemplatesList: e, favorites: t } = this.state,
            {
              isShownQuicks: a,
              className: n,
              displayMode: o,
              id: s,
            } = this.props;
          return i.createElement(
            Aa.Provider,
            { value: this.context.templatesMenuViewStateService || null },
            i.createElement(za, {
              id: s,
              className: n,
              mode: o,
              templates: e,
              favorites: t,
              onMenuOpen: this._model.handleDropdownOpen,
              onTemplateFavorite: a ? this._model.handleFavorTemplate : void 0,
              onTemplateSelect: this._handleApplyTemplate,
              onTemplateRemove: this._handleRemoveTemplate,
              onTemplateSave: this._model.handleSaveTemplate,
            })
          );
        }
      }
      function za(e) {
        const {
            id: t,
            className: n,
            mode: o,
            favorites: l,
            templates: r,
            isMenuOpen: h,
            onTemplateSelect: c,
            onTemplateSave: d,
            onTemplateFavorite: u,
            onTemplateRemove: m,
          } = e,
          g = p()(n, Ua.wrap, {
            [Ua.full]: 'full' === o,
            [Ua.medium]: 'medium' === o,
          }),
          C = r.filter((e) => l.includes(e.name)),
          S = 'small' !== o && u && C.length > 0;
        return i.createElement(
          b,
          { id: t, className: g },
          i.createElement(
            f.MatchMedia,
            { rule: w.DialogBreakpoints.TabletSmall },
            (t) =>
              i.createElement(
                v.ToolbarMenuButton,
                {
                  onOpen: e.onMenuOpen,
                  isDrawer: t,
                  drawerPosition: 'Bottom',
                  arrow: !1,
                  content: i.createElement(W, {
                    tag: 'div',
                    className: p()(S && Ua.buttonWithFavorites),
                    displayMode: o,
                    isOpened: h,
                    icon: Pa,
                    forceInteractive: !0,
                    collapseWhen: ['full', 'medium', 'small'],
                  }),
                  onClick: _,
                  tooltip: s.t(null, void 0, a(15812)),
                },
                i.createElement(Na, {
                  onTemplateSave: d,
                  onTemplateSelect: c,
                  onTemplateRemove: m,
                  onTemplateFavorite: u,
                  templates: r,
                  favorites: C,
                  isTabletSmall: t,
                })
              )
          ),
          S &&
            i.createElement(Va, {
              favorites: C,
              onTemplateSelect: function (e) {
                c(e), _();
              },
            })
        );
        function _() {
          0;
        }
      }
      function Va(e) {
        return i.createElement(
          i.Fragment,
          null,
          e.favorites.map((t, a, n) =>
            i.createElement(ma, {
              key: t.name,
              item: t,
              onApply: e.onTemplateSelect,
              className: p()({
                [Ua.first]: 0 === a,
                [Ua.last]: a === n.length - 1,
              }),
            })
          )
        );
      }
      Wa.contextType = Ba;
      a(42053);
      var Za = a(77665),
        Ka = a(96052),
        Qa = a(57778);
      const qa = {
          undoHotKey: (0, G.hotKeySerialize)({
            keys: [(0, Y.humanReadableModifiers)(Y.Modifiers.Mod, !1), 'Z'],
            text: '{0} + {1}',
          }),
          redoHotKey: (0, G.hotKeySerialize)({
            keys: [(0, Y.humanReadableModifiers)(Y.Modifiers.Mod, !1), 'Y'],
            text: '{0} + {1}',
          }),
        },
        ja = (0, dt.mergeThemes)(C.DEFAULT_TOOLBAR_BUTTON_THEME, Qa),
        Ga = (0, M.registryContextType)();
      class Ya extends i.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._batched = null),
            (this._handleClickUndo = () => {
              (0, V.trackEvent)('GUI', 'Undo');
              const { chartWidgetCollection: e } = this.context;
              e.undoHistory.undo();
            }),
            (this._handleClickRedo = () => {
              (0, V.trackEvent)('GUI', 'Redo');
              const { chartWidgetCollection: e } = this.context;
              e.undoHistory.redo();
            }),
            (0, M.validateRegistry)(t, {
              chartWidgetCollection: o.any.isRequired,
            }),
            (this.state = this._getStateFromUndoHistory());
        }
        componentDidMount() {
          const { chartWidgetCollection: e } = this.context;
          e.undoHistory
            .redoStack()
            .onChange()
            .subscribe(this, this._onChangeStack),
            e.undoHistory
              .undoStack()
              .onChange()
              .subscribe(this, this._onChangeStack);
        }
        componentWillUnmount() {
          const { chartWidgetCollection: e } = this.context;
          e.undoHistory
            .redoStack()
            .onChange()
            .unsubscribe(this, this._onChangeStack),
            e.undoHistory
              .undoStack()
              .onChange()
              .unsubscribe(this, this._onChangeStack),
            (this._batched = null);
        }
        render() {
          const { id: e } = this.props,
            {
              isEnabledRedo: t,
              isEnabledUndo: n,
              redoStack: o,
              undoStack: l,
            } = this.state;
          return i.createElement(
            b,
            { id: e },
            i.createElement(C.ToolbarButton, {
              icon: Za,
              isDisabled: !n,
              onClick: this._handleClickUndo,
              theme: ja,
              tooltip: n
                ? s.t(null, { replace: { hint: l } }, a(80323))
                : void 0,
              'data-tooltip-hotkey': n ? qa.undoHotKey : void 0,
            }),
            i.createElement(C.ToolbarButton, {
              icon: Ka,
              isDisabled: !t,
              onClick: this._handleClickRedo,
              theme: ja,
              tooltip: t
                ? s.t(null, { replace: { hint: o } }, a(70728))
                : void 0,
              'data-tooltip-hotkey': t ? qa.redoHotKey : void 0,
            })
          );
        }
        _onChangeStack() {
          null === this._batched &&
            (this._batched = Promise.resolve().then(() => {
              if (null === this._batched) return;
              this._batched = null;
              const e = this._getStateFromUndoHistory();
              this.setState(e);
            }));
        }
        _getStateFromUndoHistory() {
          const { chartWidgetCollection: e } = this.context,
            t = e.undoHistory.undoStack(),
            a = e.undoHistory.redoStack(),
            n = a.head(),
            i = t.head();
          return {
            isEnabledRedo: !a.isEmpty(),
            isEnabledUndo: !t.isEmpty(),
            redoStack: n ? n.text().translatedText() : '',
            undoStack: i ? i.text().translatedText() : '',
          };
        }
      }
      Ya.contextType = Ga;
      class Xa extends i.PureComponent {
        constructor() {
          super(...arguments),
            (this._wrapperElement = null),
            (this._resizeObserver = null),
            (this._update = () => {
              this.forceUpdate();
            }),
            (this._setRef = (e) => {
              this._wrapperElement = e;
            }),
            (this._handleMeasure = ([e]) => {
              this.props.width.setValue(e.contentRect.width);
            });
        }
        componentDidMount() {
          const { element: e, isFake: t, width: a } = this.props;
          !t && this._wrapperElement
            ? ((this._resizeObserver = new ResizeObserver(this._handleMeasure)),
              this._wrapperElement.appendChild(e),
              this._resizeObserver.observe(this._wrapperElement))
            : a.subscribe(this._update);
        }
        componentWillUnmount() {
          const { width: e, isFake: t } = this.props;
          t && e.unsubscribe(this._update),
            this._resizeObserver &&
              this._wrapperElement &&
              this._resizeObserver.unobserve(this._wrapperElement);
        }
        render() {
          const { isFake: e = !1, width: t } = this.props;
          return i.createElement(b, {
            ref: this._setRef,
            style: e ? { width: t.value() } : void 0,
            'data-is-custom-header-element': !0,
          });
        }
      }
      function Ja(e) {
        const { displayMode: t, params: a } = e;
        return i.createElement(
          v.ToolbarMenuButton,
          {
            content: i.createElement(W, {
              collapseWhen: void 0 !== a.icon ? void 0 : [],
              displayMode: t,
              icon: a.icon,
              text: a.title,
              'data-name': 'dropdown',
              'data-is-custom-header-element': !0,
            }),
            drawerPosition: 'Bottom',
            drawerBreakpoint: w.DialogBreakpoints.TabletSmall,
            arrow: !1,
            tooltip: a.tooltip,
          },
          a.items.map((e, t) =>
            i.createElement(u.PopupMenuItem, {
              key: t,
              label: e.title,
              onClick: () => e.onSelect(),
              'data-name': 'dropdown-item',
            })
          )
        );
      }
      var $a = a(27363);
      function en(e) {
        const { className: t, title: a, ...n } = e;
        return i.createElement(z, {
          ...n,
          className: m(t, $a.customTradingViewStyleButton, $a.withoutIcon),
          collapseWhen: [],
          'data-name': 'custom-tradingview-styled-button',
          tooltip: a,
        });
      }
      function tn() {
        return {
          Bars: n.enabled('header_chart_type') ? O : void 0,
          Compare: n.enabled('header_compare') ? q : void 0,
          Custom: Xa,
          CustomTradingViewStyledButton: en,
          Fullscreen: n.enabled('header_fullscreen_button') ? ee : void 0,
          Indicators: n.enabled('header_indicators') ? pe : void 0,
          Intervals: n.enabled('header_resolutions') ? $e : void 0,
          OpenPopup: ot,
          Properties:
            n.enabled('header_settings') &&
            n.enabled('show_chart_property_page')
              ? rt
              : void 0,
          SaveLoad: n.enabled('header_saveload') ? At : void 0,
          Screenshot: n.enabled('header_screenshot') ? ta : void 0,
          SymbolSearch: n.enabled('header_symbol_search') ? da : void 0,
          Templates: n.enabled('study_templates') ? Wa : void 0,
          Dropdown: Ja,
          UndoRedo: n.enabled('header_undo_redo') ? Ya : void 0,
          Layout: undefined,
        };
      }
    },
    39344: (e, t, a) => {
      'use strict';
      a.d(t, {
        createStudyTemplateMetaInfo: () => i,
        descriptionString: () => o,
      });
      var n = a(28853);
      function i(e, t) {
        return {
          indicators: e
            .orderedDataSources(!0)
            .filter((e) => (0, n.isStudy)(e) && !0)
            .map((e) => ({
              id: e.metaInfo().id,
              description: e.title(!0, void 0, !0),
            })),
          interval: t,
        };
      }
      function o(e) {
        const t = new Map();
        return (
          e.forEach((e) => {
            const [a, n] = t.get(e.id) || [e.description, 0];
            t.set(e.id, [a, n + 1]);
          }),
          Array.from(t.values())
            .map(([e, t]) => `${e}${t > 1 ? ` x ${t}` : ''}`)
            .join(', ')
        );
      }
    },
    45876: (e, t, a) => {
      'use strict';
      a.r(t), a.d(t, { SERIES_ICONS: () => p });
      var n = a(94670),
        i = a(32162),
        o = a(39956),
        s = a(14083),
        l = a(45504),
        r = a(52867),
        h = a(41473),
        c = a(31246),
        d = a(15726),
        u = a(24464),
        v = a(71705),
        m = a(9450);
      const p = {
        3: n,
        16: i,
        0: o,
        1: s,
        8: l,
        9: r,
        2: h,
        14: c,
        15: d,
        10: u,
        12: v,
        13: m,
      };
    },
    53166: (e, t, a) => {
      'use strict';
      a.d(t, { convertImageNameToUrl: () => o });
      var n = a(14483),
        i = a(76861);
      function o(e) {
        return n.enabled('charting_library_base') || (0, i.isProd)()
          ? 'https://www.tradingview.com/x/' + e + '/'
          : window.location.protocol +
              '//' +
              window.location.host +
              '/x/' +
              e +
              '/';
      }
    },
    65939: (e, t, a) => {
      'use strict';
      function n(e, t) {
        const a = document.createElement('a');
        (a.style.display = 'none'), (a.href = t), (a.download = e), a.click();
      }
      a.d(t, { downloadFile: () => n });
    },
    97268: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M8.5 6A2.5 2.5 0 0 0 6 8.5V11h1V8.5C7 7.67 7.67 7 8.5 7H11V6H8.5zM6 17v2.5A2.5 2.5 0 0 0 8.5 22H11v-1H8.5A1.5 1.5 0 0 1 7 19.5V17H6zM19.5 7H17V6h2.5A2.5 2.5 0 0 1 22 8.5V11h-1V8.5c0-.83-.67-1.5-1.5-1.5zM22 19.5V17h-1v2.5c0 .83-.67 1.5-1.5 1.5H17v1h2.5a2.5 2.5 0 0 0 2.5-2.5z"/></svg>';
    },
    99280: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M8.5 6A2.5 2.5 0 0 0 6 8.5v11A2.5 2.5 0 0 0 8.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-3h-1v3c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 19.5v-11C7 7.67 7.67 7 8.5 7h3V6h-3zm7 1h4.8l-7.49 7.48.71.7L21 7.72v4.79h1V6h-6.5v1z"/></svg>';
    },
    21233: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M8 7h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM6 8c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8zm11-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm-2 1c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V8zm-4 8H8a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zm-3-1a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H8zm9 1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1zm-2 1c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3z"/></svg>';
    },
    94670: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="m25.35 5.35-9.5 9.5-.35.36-.35-.36-4.65-4.64-8.15 8.14-.7-.7 8.5-8.5.35-.36.35.36 4.65 4.64 9.15-9.14.7.7ZM2 21h1v1H2v-1Zm2-1H3v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1V9h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1H8v1H7v1H6v1H5v1H4v1Zm1 0v1H4v-1h1Zm1 0H5v-1h1v1Zm1 0v1H6v-1h1Zm0-1H6v-1h1v1Zm1 0H7v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1H8v1H7v1h1v1Zm1 0v1H8v-1h1Zm0-1H8v-1h1v1Zm1 0H9v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1h1v1Zm1 0v1h-1v-1h1Zm0-1v-1h-1v1h1Zm0 0v1h1v1h1v-1h-1v-1h-1Zm6 2v-1h1v1h-1Zm2 0v1h-1v-1h1Zm0-1h-1v-1h1v1Zm1 0h-1v1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h1v1Zm1 0h-1v1h1v-1Zm0-1h1v1h-1v-1Zm0-1h1v-1h-1v1Zm0 0v1h-1v-1h1Zm-4 3v1h-1v-1h1Z"/></svg>';
    },
    39956: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="none" stroke="currentColor" stroke-linecap="square"><path d="M10.5 7.5v15M7.5 20.5H10M13.5 11.5H11M19.5 6.5v15M16.5 9.5H19M22.5 16.5H20"/></g></svg>';
    },
    24464: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m10.49 7.55-.42.7-2.1 3.5.86.5 1.68-2.8 1.8 2.82.84-.54-2.23-3.5-.43-.68Zm12.32 4.72-.84-.54 2.61-4 .84.54-2.61 4Zm-5.3 6.3 1.2-1.84.84.54-1.63 2.5-.43.65-.41-.65-1.6-2.5.85-.54 1.17 1.85ZM4.96 16.75l.86.52-2.4 4-.86-.52 2.4-4ZM3 14v1h1v-1H3Zm2 0h1v1H5v-1Zm2 0v1h1v-1H7Zm2 0h1v1H9v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Z"/></svg>';
    },
    14083: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"/><path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"/><path d="M9 8v12h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z"/><path d="M10 4h1v3.5h-1zm0 16.5h1V24h-1z"/></svg>';
    },
    53707: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><g fill="none"><path stroke="currentColor" d="M11 20.5H7.5a5 5 0 1 1 .42-9.98 7.5 7.5 0 0 1 14.57 2.1 4 4 0 0 1-1 7.877H18"/><path stroke="currentColor" d="M14.5 24V12.5M11 16l3.5-3.5L18 16"/></g></svg>';
    },
    9450: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M12 7v14h5V7h-5Zm4 1h-3v12h3V8ZM19 15v6h5v-6h-5Zm4 1h-3v4h3v-4ZM5 12h5v9H5v-9Zm1 1h3v7H6v-7Z"/></svg>';
    },
    1393: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M13.5 6a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM4 14.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/><path fill="currentColor" d="M9 14h4v-4h1v4h4v1h-4v4h-1v-4H9v-1z"/></svg>';
    },
    45504: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M9 8v12h3V8H9zm-1-.502C8 7.223 8.215 7 8.498 7h4.004c.275 0 .498.22.498.498v13.004a.493.493 0 0 1-.498.498H8.498A.496.496 0 0 1 8 20.502V7.498z"/><path d="M10 4h1v3.5h-1z"/><path d="M17 6v6h3V6h-3zm-1-.5c0-.276.215-.5.498-.5h4.004c.275 0 .498.23.498.5v7c0 .276-.215.5-.498.5h-4.004a.503.503 0 0 1-.498-.5v-7z"/><path d="M18 2h1v3.5h-1z"/></svg>';
    },
    71705: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7H7v14h5V7H7.5zM8 20V8h3v12H8zm7.5-11H15v10h5V9h-4.5zm.5 9v-8h3v8h-3z"/></svg>';
    },
    32162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" d="M22 3h1v1h-1V3Zm0 2V4h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1V9h-1V8h-1V7h-1V6h-1V5h-1v1H9v1H8v1H7v1H6v1H5v1H4v1h1v1H4v1h1v-1h1v-1h1v-1h1v-1h1V9h1V8h1v1h1v1h1v1h1v1h1v1h1v-1h1v-1h1v-1h1V9h1V8h1V7h1V6h1V5h-1Zm-1 1V5h1v1h-1Zm-1 1V6h1v1h-1Zm-1 1V7h1v1h-1Zm-1 1V8h1v1h-1Zm-1 1V9h1v1h-1Zm-1 1v-1h1v1h-1Zm-1 0v-1h-1V9h-1V8h-1V7h-1V6h-1v1H9v1H8v1H7v1H6v1H5v1h1v-1h1v-1h1V9h1V8h1V7h1v1h1v1h1v1h1v1h1Zm0 0h1v1h-1v-1Zm.84 6.37 7.5-7-.68-.74-7.15 6.67-4.66-4.65-.33-.34-.36.32-5.5 5 .68.74 5.14-4.68 4.67 4.66.34.35.35-.33ZM6 23H5v1h1v-1Zm0-1H5v-1h1v1Zm1 0v1H6v-1h1Zm0-1H6v-1h1v1Zm1 0v1H7v-1h1Zm0-1H7v-1h1v1Zm1 0v1H8v-1h1Zm0-1H8v-1h1v1Zm1 0v1H9v-1h1Zm0-1H9v-1h1v1Zm1 0h-1v1h1v1h1v1h1v1h1v1h1v1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1h1v1Zm0 0h1v1h-1v-1Zm2 2v1h1v1h1v1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1Zm0 0v-1h-1v1h1Z"/></svg>';
    },
    52867: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"/><path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"/><path d="M9 8v11h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5z"/><path d="M10 4h1v5h-1zm0 14h1v5h-1zM8.5 9H10v1H8.5zM11 9h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11z"/></svg>';
    },
    39681: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M20 17l-5 5M15 17l5 5M9 11.5h7M17.5 8a2.5 2.5 0 0 0-5 0v11a2.5 2.5 0 0 1-5 0"/></svg>';
    },
    31246: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" d="m18.43 15.91 6.96-8.6-.78-.62-6.96 8.6a2.49 2.49 0 0 0-2.63.2l-2.21-2.02A2.5 2.5 0 0 0 10.5 10a2.5 2.5 0 1 0 1.73 4.3l2.12 1.92a2.5 2.5 0 1 0 4.08-.31ZM10.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm7.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/><path d="M8.37 13.8c.17.3.4.54.68.74l-5.67 6.78-.76-.64 5.75-6.88Z"/></svg>';
    },
    41473: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m25.39 7.31-8.83 10.92-6.02-5.47-7.16 8.56-.76-.64 7.82-9.36 6 5.45L24.61 6.7l.78.62Z"/></svg>';
    },
    82436: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width="21" height="21"><g fill="none" stroke="currentColor"><path d="M18.5 11v5.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2H9"/><path stroke-linecap="square" d="M18 2l-8.5 8.5m4-9h5v5"/></g></svg>';
    },
    48449: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M14 17a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-1a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M5.005 16A1.003 1.003 0 0 1 4 14.992v-1.984A.998.998 0 0 1 5 12h1.252a7.87 7.87 0 0 1 .853-2.06l-.919-.925c-.356-.397-.348-1 .03-1.379l1.42-1.42a1 1 0 0 1 1.416.007l.889.882A7.96 7.96 0 0 1 12 6.253V5c0-.514.46-1 1-1h2c.557 0 1 .44 1 1v1.253a7.96 7.96 0 0 1 2.06.852l.888-.882a1 1 0 0 1 1.416-.006l1.42 1.42a.999.999 0 0 1 .029 1.377s-.4.406-.918.926a7.87 7.87 0 0 1 .853 2.06H23c.557 0 1 .447 1 1.008v1.984A.998.998 0 0 1 23 16h-1.252a7.87 7.87 0 0 1-.853 2.06l.882.888a1 1 0 0 1 .006 1.416l-1.42 1.42a1 1 0 0 1-1.415-.007l-.889-.882a7.96 7.96 0 0 1-2.059.852v1.248c0 .56-.45 1.005-1.008 1.005h-1.984A1.004 1.004 0 0 1 12 22.995v-1.248a7.96 7.96 0 0 1-2.06-.852l-.888.882a1 1 0 0 1-1.416.006l-1.42-1.42a1 1 0 0 1 .007-1.415l.882-.888A7.87 7.87 0 0 1 6.252 16H5.005zm3.378-6.193l-.227.34A6.884 6.884 0 0 0 7.14 12.6l-.082.4H5.005C5.002 13 5 13.664 5 14.992c0 .005.686.008 2.058.008l.082.4c.18.883.52 1.71 1.016 2.453l.227.34-1.45 1.46c-.004.003.466.477 1.41 1.422l1.464-1.458.34.227a6.959 6.959 0 0 0 2.454 1.016l.399.083v2.052c0 .003.664.005 1.992.005.005 0 .008-.686.008-2.057l.399-.083a6.959 6.959 0 0 0 2.454-1.016l.34-.227 1.46 1.45c.003.004.477-.466 1.422-1.41l-1.458-1.464.227-.34A6.884 6.884 0 0 0 20.86 15.4l.082-.4h2.053c.003 0 .005-.664.005-1.992 0-.005-.686-.008-2.058-.008l-.082-.4a6.884 6.884 0 0 0-1.016-2.453l-.227-.34 1.376-1.384.081-.082-1.416-1.416-1.465 1.458-.34-.227a6.959 6.959 0 0 0-2.454-1.016L15 7.057V5c0-.003-.664-.003-1.992 0-.005 0-.008.686-.008 2.057l-.399.083a6.959 6.959 0 0 0-2.454 1.016l-.34.227-1.46-1.45c-.003-.004-.477.466-1.421 1.408l1.457 1.466z"/></g></svg>';
    },
    96052: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M18.293 13l-2.647 2.646.707.708 3.854-3.854-3.854-3.854-.707.708L18.293 12H12.5A5.5 5.5 0 0 0 7 17.5V19h1v-1.5a4.5 4.5 0 0 1 4.5-4.5h5.793z"/></svg>';
    },
    72644: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.118 6a.5.5 0 0 0-.447.276L9.809 8H5.5A1.5 1.5 0 0 0 4 9.5v10A1.5 1.5 0 0 0 5.5 21h16a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 21.5 8h-4.309l-.862-1.724A.5.5 0 0 0 15.882 6h-4.764zm-1.342-.17A1.5 1.5 0 0 1 11.118 5h4.764a1.5 1.5 0 0 1 1.342.83L17.809 7H21.5A2.5 2.5 0 0 1 24 9.5v10a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 3 19.5v-10A2.5 2.5 0 0 1 5.5 7h3.691l.585-1.17z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"/></svg>';
    },
    15726: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M19 5h5v1h-4v13h-6v-7h-4v12H5v-1h4V11h6v7h4V5Z"/></svg>';
    },
    77665: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M8.707 13l2.647 2.646-.707.708L6.792 12.5l3.853-3.854.708.708L8.707 12H14.5a5.5 5.5 0 0 1 5.5 5.5V19h-1v-1.5a4.5 4.5 0 0 0-4.5-4.5H8.707z"/></svg>';
    },
    33765: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>';
    },
    36296: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M8 9.5H6.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V20m-8-1.5h11a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1h-11a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1z"/></svg>';
    },
    23595: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M6.5 16v4.5a1 1 0 001 1h14a1 1 0 001-1V16M14.5 5V17m-4-3.5l4 4l4-4"/></svg>';
    },
    39146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>';
    },
    48010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>';
    },
    29414: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M19 15l2.5-2.5c1-1 1.5-3.5-.5-5.5s-4.5-1.5-5.5-.5L13 9M10 12l-2.5 2.5c-1 1-1.5 3.5.5 5.5s4.5 1.5 5.5.5L16 18M17 11l-5 5"/></svg>';
    },
    84502: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="#1DA1F2" d="M10.28 22.26c7.55 0 11.68-6.26 11.68-11.67v-.53c.8-.58 1.49-1.3 2.04-2.13-.74.33-1.53.54-2.36.65.85-.5 1.5-1.32 1.8-2.28-.78.48-1.66.81-2.6 1a4.1 4.1 0 00-7 3.74c-3.4-.17-6.43-1.8-8.46-4.29a4.1 4.1 0 001.28 5.48c-.68-.02-1.3-.2-1.86-.5v.05a4.11 4.11 0 003.29 4.02 4 4 0 01-1.85.08 4.1 4.1 0 003.83 2.85A8.23 8.23 0 014 20.43a11.67 11.67 0 006.28 1.83z"/></svg>';
    },
  },
]);
