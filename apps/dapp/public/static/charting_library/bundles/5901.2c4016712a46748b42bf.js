(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5901],
  {
    59142: function (e, t) {
      var n, o, s;
      (o = [t]),
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
            var o = {
              get passive() {
                n = !0;
              },
            };
            window.addEventListener('testPassive', null, o),
              window.removeEventListener('testPassive', null, o);
          }
          var s =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            r = [],
            a = !1,
            i = -1,
            l = void 0,
            c = void 0,
            u = function (e) {
              return r.some(function (t) {
                return !(
                  !t.options.allowTouchMove || !t.options.allowTouchMove(e)
                );
              });
            },
            p = function (e) {
              var t = e || window.event;
              return (
                !!u(t.target) ||
                1 < t.touches.length ||
                (t.preventDefault && t.preventDefault(), !1)
              );
            },
            d = function () {
              setTimeout(function () {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== l &&
                    ((document.body.style.overflow = l), (l = void 0));
              });
            };
          (e.disableBodyScroll = function (e, o) {
            if (s) {
              if (!e)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.'
                );
              if (
                e &&
                !r.some(function (t) {
                  return t.targetElement === e;
                })
              ) {
                var d = { targetElement: e, options: o || {} };
                (r = [].concat(t(r), [d])),
                  (e.ontouchstart = function (e) {
                    1 === e.targetTouches.length &&
                      (i = e.targetTouches[0].clientY);
                  }),
                  (e.ontouchmove = function (t) {
                    var n, o, s, r;
                    1 === t.targetTouches.length &&
                      ((o = e),
                      (r = (n = t).targetTouches[0].clientY - i),
                      !u(n.target) &&
                        ((o && 0 === o.scrollTop && 0 < r) ||
                        ((s = o) &&
                          s.scrollHeight - s.scrollTop <= s.clientHeight &&
                          r < 0)
                          ? p(n)
                          : n.stopPropagation()));
                  }),
                  a ||
                    (document.addEventListener(
                      'touchmove',
                      p,
                      n ? { passive: !1 } : void 0
                    ),
                    (a = !0));
              }
            } else {
              (m = o),
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
                  void 0 === l &&
                    ((l = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'));
                });
              var h = { targetElement: e, options: o || {} };
              r = [].concat(t(r), [h]);
            }
            var m;
          }),
            (e.clearAllBodyScrollLocks = function () {
              s
                ? (r.forEach(function (e) {
                    (e.targetElement.ontouchstart = null),
                      (e.targetElement.ontouchmove = null);
                  }),
                  a &&
                    (document.removeEventListener(
                      'touchmove',
                      p,
                      n ? { passive: !1 } : void 0
                    ),
                    (a = !1)),
                  (r = []),
                  (i = -1))
                : (d(), (r = []));
            }),
            (e.enableBodyScroll = function (e) {
              if (s) {
                if (!e)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.'
                  );
                (e.ontouchstart = null),
                  (e.ontouchmove = null),
                  (r = r.filter(function (t) {
                    return t.targetElement !== e;
                  })),
                  a &&
                    0 === r.length &&
                    (document.removeEventListener(
                      'touchmove',
                      p,
                      n ? { passive: !1 } : void 0
                    ),
                    (a = !1));
              } else
                1 === r.length && r[0].targetElement === e
                  ? (d(), (r = []))
                  : (r = r.filter(function (t) {
                      return t.targetElement !== e;
                    }));
            });
        }),
        void 0 === (s = 'function' == typeof n ? n.apply(t, o) : n) ||
          (e.exports = s);
    },
    23428: (e) => {
      e.exports = {
        button: 'button-PYEOTd6i',
        disabled: 'disabled-PYEOTd6i',
        hidden: 'hidden-PYEOTd6i',
        icon: 'icon-PYEOTd6i',
        dropped: 'dropped-PYEOTd6i',
      };
    },
    70048: (e) => {
      e.exports = {
        wrapper: 'wrapper-GZajBGIm',
        input: 'input-GZajBGIm',
        box: 'box-GZajBGIm',
        icon: 'icon-GZajBGIm',
        noOutline: 'noOutline-GZajBGIm',
        'intent-danger': 'intent-danger-GZajBGIm',
        check: 'check-GZajBGIm',
        dot: 'dot-GZajBGIm',
      };
    },
    69789: (e) => {
      e.exports = {
        checkbox: 'checkbox-vyj6oJxw',
        reverse: 'reverse-vyj6oJxw',
        label: 'label-vyj6oJxw',
        baseline: 'baseline-vyj6oJxw',
      };
    },
    22623: (e) => {
      e.exports = {
        'textarea-container': 'textarea-container-x5KHDULU',
        'change-highlight': 'change-highlight-x5KHDULU',
        focused: 'focused-x5KHDULU',
        'resize-vertical': 'resize-vertical-x5KHDULU',
        'resize-horizontal': 'resize-horizontal-x5KHDULU',
        'resize-both': 'resize-both-x5KHDULU',
        textarea: 'textarea-x5KHDULU',
        'with-icon': 'with-icon-x5KHDULU',
        endslot: 'endslot-x5KHDULU',
      };
    },
    78370: (e) => {
      e.exports = {
        'icon-wrapper': 'icon-wrapper-EZuD3gZZ',
        'no-active-state': 'no-active-state-EZuD3gZZ',
        'with-tooltip': 'with-tooltip-EZuD3gZZ',
        'intent-default': 'intent-default-EZuD3gZZ',
        'intent-danger': 'intent-danger-EZuD3gZZ',
        'intent-warning': 'intent-warning-EZuD3gZZ',
        'intent-success': 'intent-success-EZuD3gZZ',
        icon: 'icon-EZuD3gZZ',
      };
    },
    88400: (e) => {
      e.exports = {
        radio: 'radio-ALqkCUvs',
        input: 'input-ALqkCUvs',
        box: 'box-ALqkCUvs',
        reverse: 'reverse-ALqkCUvs',
        label: 'label-ALqkCUvs',
        wrapper: 'wrapper-ALqkCUvs',
        noOutline: 'noOutline-ALqkCUvs',
      };
    },
    52272: (e) => {
      e.exports = {
        wrap: 'wrap-QStmZL8l',
        thicknessItem: 'thicknessItem-QStmZL8l',
        checked: 'checked-QStmZL8l',
        radio: 'radio-QStmZL8l',
        bar: 'bar-QStmZL8l',
      };
    },
    12863: (e) => {
      e.exports = { innerLabel: 'innerLabel-DjbvBF5Y' };
    },
    21234: (e) => {
      e.exports = {
        controlWrapper: 'controlWrapper-DBTazUk2',
        hidden: 'hidden-DBTazUk2',
        control: 'control-DBTazUk2',
        controlIncrease: 'controlIncrease-DBTazUk2',
        controlDecrease: 'controlDecrease-DBTazUk2',
        controlIcon: 'controlIcon-DBTazUk2',
        title: 'title-DBTazUk2',
      };
    },
    60015: (e) => {
      e.exports = {
        wrap: 'wrap-ne5qGlZh',
        icon: 'icon-ne5qGlZh',
        text: 'text-ne5qGlZh',
        disabled: 'disabled-ne5qGlZh',
      };
    },
    28685: (e) => {
      e.exports = {
        colorPickerWrap: 'colorPickerWrap-Sw_a4qpB',
        focused: 'focused-Sw_a4qpB',
        readonly: 'readonly-Sw_a4qpB',
        disabled: 'disabled-Sw_a4qpB',
        'size-small': 'size-small-Sw_a4qpB',
        'size-medium': 'size-medium-Sw_a4qpB',
        'size-large': 'size-large-Sw_a4qpB',
        'font-size-small': 'font-size-small-Sw_a4qpB',
        'font-size-medium': 'font-size-medium-Sw_a4qpB',
        'font-size-large': 'font-size-large-Sw_a4qpB',
        'border-none': 'border-none-Sw_a4qpB',
        shadow: 'shadow-Sw_a4qpB',
        'border-thin': 'border-thin-Sw_a4qpB',
        'border-thick': 'border-thick-Sw_a4qpB',
        'intent-default': 'intent-default-Sw_a4qpB',
        'intent-success': 'intent-success-Sw_a4qpB',
        'intent-warning': 'intent-warning-Sw_a4qpB',
        'intent-danger': 'intent-danger-Sw_a4qpB',
        'intent-primary': 'intent-primary-Sw_a4qpB',
        'corner-top-left': 'corner-top-left-Sw_a4qpB',
        'corner-top-right': 'corner-top-right-Sw_a4qpB',
        'corner-bottom-right': 'corner-bottom-right-Sw_a4qpB',
        'corner-bottom-left': 'corner-bottom-left-Sw_a4qpB',
        colorPicker: 'colorPicker-Sw_a4qpB',
        swatch: 'swatch-Sw_a4qpB',
        placeholderContainer: 'placeholderContainer-Sw_a4qpB',
        placeholder: 'placeholder-Sw_a4qpB',
        mixedColor: 'mixedColor-Sw_a4qpB',
        white: 'white-Sw_a4qpB',
        opacitySwatch: 'opacitySwatch-Sw_a4qpB',
        colorLine: 'colorLine-Sw_a4qpB',
        multiWidth: 'multiWidth-Sw_a4qpB',
        line: 'line-Sw_a4qpB',
        thicknessContainer: 'thicknessContainer-Sw_a4qpB',
        thicknessTitle: 'thicknessTitle-Sw_a4qpB',
      };
    },
    86536: (e) => {
      e.exports = {
        thicknessContainer: 'thicknessContainer-C05zSid7',
        thicknessTitle: 'thicknessTitle-C05zSid7',
      };
    },
    69006: (e) => {
      e.exports = {
        hasTooltip: 'hasTooltip-DcvaoxPU',
        uppercase: 'uppercase-DcvaoxPU',
      };
    },
    2746: (e) => {
      e.exports = { wrap: 'wrap-Q2NZ0gvI' };
    },
    25679: (e) => {
      e.exports = { checkbox: 'checkbox-FG0u1J5p', title: 'title-FG0u1J5p' };
    },
    41125: (e) => {
      e.exports = { hintButton: 'hintButton-qEI9XsjF' };
    },
    69750: (e) => {
      e.exports = { titleWrap: 'titleWrap-SexRbl__', title: 'title-SexRbl__' };
    },
    93402: (e) => {
      e.exports = {
        container: 'container-mdcOkvbj',
        sectionTitle: 'sectionTitle-mdcOkvbj',
        separator: 'separator-mdcOkvbj',
        customButton: 'customButton-mdcOkvbj',
      };
    },
    80679: (e) => {
      e.exports = {
        container: 'container-iiEYaqPD',
        form: 'form-iiEYaqPD',
        swatch: 'swatch-iiEYaqPD',
        inputWrap: 'inputWrap-iiEYaqPD',
        inputHash: 'inputHash-iiEYaqPD',
        input: 'input-iiEYaqPD',
        buttonWrap: 'buttonWrap-iiEYaqPD',
        hueSaturationWrap: 'hueSaturationWrap-iiEYaqPD',
        saturation: 'saturation-iiEYaqPD',
        hue: 'hue-iiEYaqPD',
      };
    },
    1369: (e) => {
      e.exports = {
        hue: 'hue-r4uo5Wn6',
        pointer: 'pointer-r4uo5Wn6',
        pointerContainer: 'pointerContainer-r4uo5Wn6',
      };
    },
    30099: (e) => {
      e.exports = {
        opacity: 'opacity-EnWts7Xu',
        opacitySlider: 'opacitySlider-EnWts7Xu',
        opacitySliderGradient: 'opacitySliderGradient-EnWts7Xu',
        pointer: 'pointer-EnWts7Xu',
        dragged: 'dragged-EnWts7Xu',
        opacityPointerWrap: 'opacityPointerWrap-EnWts7Xu',
        opacityInputWrap: 'opacityInputWrap-EnWts7Xu',
        opacityInput: 'opacityInput-EnWts7Xu',
        opacityInputPercent: 'opacityInputPercent-EnWts7Xu',
      };
    },
    35257: (e) => {
      e.exports = {
        saturation: 'saturation-NFNfqP2w',
        pointer: 'pointer-NFNfqP2w',
      };
    },
    87466: (e) => {
      e.exports = {
        swatches: 'swatches-sfn7Lezv',
        swatch: 'swatch-sfn7Lezv',
        hover: 'hover-sfn7Lezv',
        empty: 'empty-sfn7Lezv',
        white: 'white-sfn7Lezv',
        selected: 'selected-sfn7Lezv',
        contextItem: 'contextItem-sfn7Lezv',
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
    70673: (e, t, n) => {
      'use strict';
      n.d(t, { CheckboxInput: () => u });
      var o = n(50959),
        s = n(97754),
        r = n(90186),
        a = n(9745),
        i = n(65890),
        l = n(70048),
        c = n.n(l);
      function u(e) {
        const t = s(c().box, c()[`intent-${e.intent}`], {
            [c().check]: !Boolean(e.indeterminate),
            [c().dot]: Boolean(e.indeterminate),
            [c().noOutline]: -1 === e.tabIndex,
          }),
          n = s(c().wrapper, e.className);
        return o.createElement(
          'span',
          { className: n, title: e.title, style: e.style },
          o.createElement('input', {
            id: e.id,
            tabIndex: e.tabIndex,
            className: c().input,
            type: 'checkbox',
            name: e.name,
            checked: e.checked,
            disabled: e.disabled,
            value: e.value,
            autoFocus: e.autoFocus,
            role: e.role,
            onChange: function () {
              e.onChange && e.onChange(e.value);
            },
            ref: e.reference,
            'aria-required': e['aria-required'],
            'aria-describedby': e['aria-describedby'],
            'aria-invalid': e['aria-invalid'],
            ...(0, r.filterDataProps)(e),
          }),
          o.createElement(
            'span',
            { className: t },
            o.createElement(a.Icon, { icon: i, className: c().icon })
          )
        );
      }
    },
    15294: (e, t, n) => {
      'use strict';
      n.d(t, { Checkbox: () => c });
      var o = n(50959),
        s = n(97754),
        r = n(57733),
        a = n(70673),
        i = n(69789),
        l = n.n(i);
      class c extends o.PureComponent {
        render() {
          const { inputClassName: e, labelClassName: t, ...n } = this.props,
            r = s(this.props.className, l().checkbox, {
              [l().reverse]: Boolean(this.props.labelPositionReverse),
              [l().baseline]: Boolean(this.props.labelAlignBaseline),
            }),
            i = s(l().label, t, { [l().disabled]: this.props.disabled });
          let c = null;
          return (
            this.props.label &&
              (c = o.createElement(
                'span',
                { className: i, title: this.props.title },
                this.props.label
              )),
            o.createElement(
              'label',
              { className: r },
              o.createElement(a.CheckboxInput, { ...n, className: e }),
              c
            )
          );
        }
      }
      c.defaultProps = { value: 'on' };
      (0, r.makeSwitchGroupItem)(c);
    },
    2568: (e, t, n) => {
      'use strict';
      n.d(t, { Textarea: () => C });
      var o,
        s = n(50959),
        r = n(97754),
        a = n(38528),
        i = n(29202),
        l = n(48027),
        c = n(45812),
        u = n(47201),
        p = n(48907),
        d = n(67029),
        h = n(78274),
        m = n(22623),
        v = n.n(m);
      !(function (e) {
        (e.None = 'none'),
          (e.Vertical = 'vertical'),
          (e.Horizontal = 'horizontal'),
          (e.Both = 'both');
      })(o || (o = {}));
      const g = s.forwardRef((e, t) => {
        const {
            id: n,
            title: o,
            tabIndex: a,
            containerTabIndex: i,
            role: l,
            inputClassName: c,
            autoComplete: u,
            autoFocus: p,
            cols: m,
            disabled: g,
            isFocused: f,
            form: b,
            maxLength: C,
            minLength: y,
            name: E,
            placeholder: w,
            readonly: S,
            required: x,
            rows: _,
            value: N,
            defaultValue: T,
            wrap: I,
            containerReference: k,
            onChange: P,
            onSelect: B,
            onFocus: D,
            onContainerFocus: M,
            onBlur: V,
            'aria-describedby': O,
            'aria-required': F,
            'aria-invalid': R,
            hasIcon: L,
            endSlot: W,
            hasAttachImage: A,
            ...q
          } = e,
          U = {
            id: n,
            title: o,
            tabIndex: a,
            role: l,
            autoComplete: u,
            autoFocus: p,
            cols: m,
            disabled: g,
            form: b,
            maxLength: C,
            minLength: y,
            name: E,
            placeholder: w,
            readOnly: S,
            required: x,
            rows: _,
            value: N,
            defaultValue: T,
            wrap: I,
            onChange: P,
            onSelect: B,
            onFocus: D,
            onBlur: V,
            'aria-describedby': O,
            'aria-required': F,
            'aria-invalid': R,
          };
        return s.createElement(d.ControlSkeleton, {
          ...q,
          tabIndex: i,
          disabled: g,
          readonly: S,
          isFocused: f,
          ref: k,
          onFocus: M,
          middleSlot: s.createElement(
            h.MiddleSlot,
            null,
            s.createElement('textarea', {
              ...U,
              className: r(v().textarea, c, W && v().endslot),
              ref: t,
            })
          ),
          ...(W && {
            endSlot: s.createElement(
              'span',
              { className: r(!A && v()['with-icon']) },
              W
            ),
          }),
        });
      });
      g.displayName = 'TextareaView';
      const f = (e, t, n) => (t ? void 0 : e ? -1 : n),
        b = (e, t, n) => (t ? void 0 : e ? n : -1),
        C = s.forwardRef((e, t) => {
          e = (0, l.useControl)(e);
          const {
              className: n,
              disabled: d,
              autoSelectOnFocus: h,
              tabIndex: m = 0,
              borderStyle: C,
              highlight: y,
              resize: E,
              containerReference: w = null,
              onFocus: S,
              onBlur: x,
              hasIcon: _,
              ...N
            } = e,
            T = (0, s.useRef)(null),
            I = (0, s.useRef)(null),
            {
              isMouseDown: k,
              handleMouseDown: P,
              handleMouseUp: B,
            } = (0, c.useIsMouseDown)(),
            [D, M] = (0, i.useFocus)(),
            V = (0, u.createSafeMulticastEventHandler)(
              M.onFocus,
              function (e) {
                h && !k.current && (0, p.selectAllContent)(e.currentTarget);
              },
              S
            ),
            O = (0, u.createSafeMulticastEventHandler)(M.onBlur, x),
            F = void 0 !== E && E !== o.None,
            R = null != C ? C : F ? (y ? 'thick' : 'thin') : void 0,
            L = null != y ? y : !F && void 0;
          return s.createElement(g, {
            ...N,
            className: r(
              v()['textarea-container'],
              F && v()['change-highlight'],
              E && E !== o.None && v()[`resize-${E}`],
              D && v().focused,
              n
            ),
            disabled: d,
            isFocused: D,
            containerTabIndex: f(D, d, m),
            tabIndex: b(D, d, m),
            borderStyle: R,
            highlight: L,
            onContainerFocus: function (e) {
              I.current === e.target && null !== T.current && T.current.focus();
            },
            onFocus: V,
            onBlur: O,
            onMouseDown: P,
            onMouseUp: B,
            ref: function (e) {
              (T.current = e),
                'function' == typeof t ? t(e) : t && (t.current = e);
            },
            containerReference: (0, a.useMergedRefs)([w, I]),
            hasIcon: _,
          });
        });
      C.displayName = 'Textarea';
    },
    36104: (e, t, n) => {
      'use strict';
      n.d(t, { useControlDisclosure: () => s });
      var o = n(7953);
      function s(e) {
        const { intent: t, highlight: n, ...s } = e,
          { isFocused: r, ...a } = (0, o.useDisclosure)(s);
        return {
          ...a,
          isFocused: r,
          highlight: null != n ? n : r,
          intent: null != t ? t : r ? 'primary' : 'default',
        };
      }
    },
    57733: (e, t, n) => {
      'use strict';
      n.d(t, { SwitchGroup: () => a, makeSwitchGroupItem: () => i });
      var o = n(50959);
      const s = function () {},
        r = (0, o.createContext)({
          getName: () => '',
          getValues: () => [],
          getOnChange: () => s,
          subscribe: s,
          unsubscribe: s,
        });
      class a extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._subscriptions = new Set()),
            (this._getName = () => this.props.name),
            (this._getValues = () => this.props.values),
            (this._getOnChange = () => this.props.onChange),
            (this._subscribe = (e) => {
              this._subscriptions.add(e);
            }),
            (this._unsubscribe = (e) => {
              this._subscriptions.delete(e);
            }),
            (this.state = {
              switchGroupContext: {
                getName: this._getName,
                getValues: this._getValues,
                getOnChange: this._getOnChange,
                subscribe: this._subscribe,
                unsubscribe: this._unsubscribe,
              },
            });
        }
        render() {
          return o.createElement(
            r.Provider,
            { value: this.state.switchGroupContext },
            this.props.children
          );
        }
        componentDidUpdate(e) {
          this._notify(this._getUpdates(this.props.values, e.values));
        }
        _notify(e) {
          this._subscriptions.forEach((t) => t(e));
        }
        _getUpdates(e, t) {
          return [...t, ...e].filter((n) =>
            t.includes(n) ? !e.includes(n) : e.includes(n)
          );
        }
      }
      function i(e) {
        var t;
        return (
          (t = class extends o.PureComponent {
            constructor() {
              super(...arguments),
                (this._onChange = (e) => {
                  this.context.getOnChange()(e);
                }),
                (this._onUpdate = (e) => {
                  e.includes(this.props.value) && this.forceUpdate();
                });
            }
            componentDidMount() {
              this.context.subscribe(this._onUpdate);
            }
            render() {
              return o.createElement(e, {
                ...this.props,
                name: this._getName(),
                onChange: this._onChange,
                checked: this._isChecked(),
              });
            }
            componentWillUnmount() {
              this.context.unsubscribe(this._onUpdate);
            }
            _getName() {
              return this.context.getName();
            }
            _isChecked() {
              return this.context.getValues().includes(this.props.value);
            }
          }),
          (t.contextType = r),
          t
        );
      }
    },
    92399: (e, t, n) => {
      'use strict';
      n.d(t, { NumberInputView: () => I });
      var o = n(50959),
        s = n(32563),
        r = n(97754),
        a = n(67029),
        i = n(78274),
        l = n(86623),
        c = n(95263),
        u = n(1405),
        p = n(12863);
      const d = {
          large: a.InputClasses.FontSizeLarge,
          medium: a.InputClasses.FontSizeMedium,
        },
        h = {
          attachment: u.anchors.top.attachment,
          targetAttachment: u.anchors.top.targetAttachment,
          attachmentOffsetY: -4,
        };
      function m(e) {
        const {
            className: t,
            inputClassName: n,
            stretch: s = !0,
            errorMessage: a,
            fontSizeStyle: u = 'large',
            endSlot: m,
            button: v,
            error: g,
            warning: f,
            innerLabel: b,
            inputReference: C,
            children: y,
            ...E
          } = e,
          w = g && void 0 !== a ? [a] : void 0,
          S = f && void 0 !== a ? [a] : void 0,
          x = r(p.inputContainer, d[u], t),
          _ = b
            ? o.createElement(
                i.StartSlot,
                { className: p.innerLabel, interactive: !1 },
                b
              )
            : void 0,
          N = m || v || y ? o.createElement(i.EndSlot, null, m, v, y) : void 0;
        return o.createElement(l.FormInput, {
          ...E,
          className: x,
          inputClassName: n,
          errors: w,
          warnings: S,
          hasErrors: g,
          hasWarnings: f,
          messagesPosition: c.MessagesPosition.Attached,
          customErrorsAttachment: h,
          messagesRoot: 'document',
          inheritMessagesWidthFromTarget: !0,
          disableMessagesRtlStyles: !0,
          iconHidden: !0,
          stretch: s,
          reference: C,
          startSlot: _,
          endSlot: N,
        });
      }
      var v = n(38528),
        g = n(44352),
        f = n(9745),
        b = n(21861),
        C = n(2948),
        y = n(21234);
      function E(e) {
        const t = r(y.control, y.controlIncrease),
          s = r(y.control, y.controlDecrease);
        return o.createElement(
          o.Fragment,
          null,
          void 0 !== e.title &&
            o.createElement('div', { className: y.title }, e.title),
          o.createElement(
            'div',
            { className: y.controlWrapper },
            (e.defaultButtonsVisible || e.title) &&
              o.createElement(
                o.Fragment,
                null,
                o.createElement(
                  'button',
                  {
                    type: 'button',
                    tabIndex: -1,
                    'aria-label': g.t(null, void 0, n(46812)),
                    className: t,
                    onClick: e.increaseValue,
                    onMouseDown: b.preventDefault,
                  },
                  o.createElement(f.Icon, { icon: C, className: y.controlIcon })
                ),
                o.createElement(
                  'button',
                  {
                    type: 'button',
                    tabIndex: -1,
                    'aria-label': g.t(null, void 0, n(56095)),
                    className: s,
                    onClick: e.decreaseValue,
                    onMouseDown: b.preventDefault,
                  },
                  o.createElement(f.Icon, { icon: C, className: y.controlIcon })
                )
              )
          )
        );
      }
      var w = n(70412),
        S = n(29202),
        x = n(47201),
        _ = n(68335);
      const N = [38],
        T = [40];
      function I(e) {
        const [t, n] = (0, w.useHover)(),
          [r, a] = (0, S.useFocus)(),
          i = (0, o.useRef)(null),
          l = (0, x.createSafeMulticastEventHandler)(a.onFocus, e.onFocus),
          c = (0, x.createSafeMulticastEventHandler)(a.onBlur, e.onBlur),
          u = (0, o.useCallback)(
            (t) => {
              !e.disabled &&
                r &&
                (t.preventDefault(),
                t.deltaY < 0
                  ? e.onValueByStepChange(1)
                  : e.onValueByStepChange(-1));
            },
            [r, e.disabled, e.onValueByStepChange]
          );
        return o.createElement(m, {
          ...n,
          id: e.id,
          name: e.name,
          pattern: e.pattern,
          borderStyle: e.borderStyle,
          fontSizeStyle: e.fontSizeStyle,
          value: e.value,
          className: e.className,
          inputClassName: e.inputClassName,
          button: (function () {
            const {
                button: n,
                forceShowControls: a,
                disabled: i,
                title: l,
              } = e,
              c = !i && !s.mobiletouch && (a || r || t);
            return i
              ? void 0
              : o.createElement(
                  o.Fragment,
                  null,
                  null != n
                    ? n
                    : o.createElement(E, {
                        increaseValue: p,
                        decreaseValue: d,
                        defaultButtonsVisible: c,
                        title: l,
                      })
                );
          })(),
          disabled: e.disabled,
          placeholder: e.placeholder,
          innerLabel: e.innerLabel,
          endSlot: e.endSlot,
          containerReference: (0, v.useMergedRefs)([i, e.containerReference]),
          inputReference: e.inputReference,
          inputMode: e.inputMode,
          type: e.type,
          warning: e.warning,
          error: e.error,
          errorMessage: e.errorMessage,
          onClick: e.onClick,
          onFocus: l,
          onBlur: c,
          onChange: e.onValueChange,
          onKeyDown: function (t) {
            if (e.disabled || 0 !== (0, _.modifiersFromEvent)(t.nativeEvent))
              return;
            let n = N,
              o = T;
            e.controlDecKeyCodes && (o = o.concat(e.controlDecKeyCodes));
            e.controlIncKeyCodes && (n = n.concat(e.controlIncKeyCodes));
            (o.includes(t.keyCode) || n.includes(t.keyCode)) &&
              (t.preventDefault(),
              e.onValueByStepChange(o.includes(t.keyCode) ? -1 : 1));
            e.onKeyDown && e.onKeyDown(t);
          },
          onWheelNoPassive: u,
          stretch: e.stretch,
          intent: e.intent,
          highlight: e.highlight,
          highlightRemoveRoundBorder: e.highlightRemoveRoundBorder,
          autoSelectOnFocus: e.autoSelectOnFocus,
          'data-property-id': e['data-name'],
        });
        function p() {
          var t;
          e.disabled ||
            (null === (t = i.current) || void 0 === t || t.focus(),
            e.onValueByStepChange(1));
        }
        function d() {
          var t;
          e.disabled ||
            (null === (t = i.current) || void 0 === t || t.focus(),
            e.onValueByStepChange(-1));
        }
      }
    },
    58593: (e, t, n) => {
      'use strict';
      n.d(t, { ColorSelect: () => _ });
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        a = n(50151),
        i = n(68335),
        l = n(20520),
        c = n(29202),
        u = n(27797),
        p = n(64706);
      function d(e) {
        const {
            button: t,
            children: n,
            className: s,
            onPopupClose: r,
            'data-name': d,
            ...h
          } = e,
          [m, v] = (0, o.useState)(!1),
          [g, f] = (0, o.useState)(!1),
          [b, C] = (0, c.useFocus)(),
          y = (0, o.useRef)(null);
        return o.createElement(
          'div',
          { className: s, 'data-name': d },
          o.createElement(
            'div',
            {
              tabIndex: e.disabled ? void 0 : -1,
              ref: y,
              onClick: function () {
                if (e.disabled) return;
                f((e) => !e), v(!1);
              },
              onFocus: C.onFocus,
              onBlur: C.onBlur,
              onKeyDown: E,
            },
            'function' == typeof t ? t(g, b) : t
          ),
          o.createElement(
            l.PopupMenu,
            {
              isOpened: g,
              onClose: w,
              position: function () {
                const e = (0, a.ensureNotNull)(
                  y.current
                ).getBoundingClientRect();
                return { x: e.left, y: e.top + e.height };
              },
              doNotCloseOn: y.current,
              onKeyDown: E,
            },
            o.createElement(p.MenuContext.Consumer, null, (e) =>
              o.createElement(u.ColorPicker, {
                ...h,
                onToggleCustom: v,
                menu: e,
              })
            ),
            !m && n
          )
        );
        function E(e) {
          if (27 === (0, i.hashFromEvent)(e)) g && (e.preventDefault(), w());
        }
        function w() {
          f(!1), (0, a.ensureNotNull)(y.current).focus(), r && r();
        }
      }
      var h = n(56512),
        m = n(87095),
        v = n(6914),
        g = n(44352),
        f = n(57733),
        b = n(52272);
      const C = (0, f.makeSwitchGroupItem)(
        class extends o.PureComponent {
          constructor() {
            super(...arguments),
              (this._onChange = () => {
                this.props.onChange && this.props.onChange(this.props.value);
              });
          }
          render() {
            const { name: e, checked: t, value: n } = this.props,
              r = s(b.thicknessItem, { [b.checked]: t }),
              a = s(b.bar, { [b.checked]: t }),
              i = { borderTopWidth: parseInt(n) };
            return o.createElement(
              'div',
              { className: r },
              o.createElement('input', {
                type: 'radio',
                className: b.radio,
                name: e,
                value: n,
                onChange: this._onChange,
                checked: t,
              }),
              o.createElement('div', { className: a, style: i }, ' ')
            );
          }
        }
      );
      function y(e) {
        const { name: t, values: n, selectedValues: s, onChange: r } = e,
          a = n.map((e, t) =>
            o.createElement(C, { key: t, value: e.toString() })
          ),
          i = s.map((e) => e.toString());
        return o.createElement(
          'div',
          { className: b.wrap },
          o.createElement(
            f.SwitchGroup,
            {
              name: t,
              onChange: (e) => {
                r(parseInt(e));
              },
              values: i,
            },
            a
          )
        );
      }
      var E = n(86536);
      const w = g.t(null, void 0, n(60142));
      function S(e) {
        const { value: t, items: n, onChange: s } = e;
        return o.createElement(
          'div',
          { className: E.thicknessContainer },
          o.createElement('div', { className: E.thicknessTitle }, w),
          o.createElement(y, {
            name: 'color_picker_thickness_select',
            onChange: s,
            values: n,
            selectedValues: 'mixed' === t ? [] : [t],
          })
        );
      }
      var x = n(28685);
      function _(e) {
        const {
            className: t,
            selectOpacity: n = void 0 !== e.opacity,
            thickness: s,
            color: a,
            disabled: i,
            opacity: l = 1,
            onColorChange: c,
            onOpacityChange: u,
            onThicknessChange: p,
            thicknessItems: m,
            onPopupClose: v,
            'data-name': g,
          } = e,
          [f, b, C] = (0, h.useCustomColors)();
        return o.createElement(
          d,
          {
            className: t,
            disabled: i,
            color: 'mixed' !== a ? a : null,
            selectOpacity: n,
            opacity: l,
            selectCustom: !0,
            customColors: f,
            onColorChange: c,
            onOpacityChange: a ? u : void 0,
            onAddColor: b,
            onRemoveCustomColor: C,
            button: function (e, t) {
              const n = e || t,
                c = n ? 'primary' : 'default';
              return o.createElement(
                'div',
                {
                  className: r()(
                    x.colorPickerWrap,
                    x[`intent-${c}`],
                    x['border-thin'],
                    x['size-medium'],
                    n && x.highlight,
                    n && x.focused,
                    i && x.disabled
                  ),
                  'data-role': 'button',
                  'data-name': s
                    ? 'color-with-thickness-select'
                    : 'color-select',
                },
                o.createElement(
                  'div',
                  { className: r()(x.colorPicker, i && x.disabled) },
                  a && 'mixed' !== a
                    ? (function () {
                        const e = N(a, l),
                          t = l >= 0.95 && T(a);
                        return o.createElement(
                          'div',
                          { className: x.opacitySwatch },
                          o.createElement('div', {
                            style: { backgroundColor: e },
                            className: r()(x.swatch, t && x.white),
                          })
                        );
                      })()
                    : o.createElement(
                        'div',
                        {
                          className: x.placeholderContainer,
                        },
                        o.createElement('div', {
                          className:
                            'mixed' === a ? x.mixedColor : x.placeholder,
                        })
                      ),
                  s &&
                    (function () {
                      const e = a && 'mixed' !== a ? N(a, l) : void 0;
                      if ('mixed' === s)
                        return o.createElement(
                          'div',
                          { className: x.multiWidth },
                          o.createElement('div', {
                            style: { backgroundColor: e },
                            className: x.line,
                          }),
                          o.createElement('div', {
                            style: { backgroundColor: e },
                            className: x.line,
                          }),
                          o.createElement('div', {
                            style: { backgroundColor: e },
                            className: x.line,
                          })
                        );
                      return o.createElement('span', {
                        className: r()(x.colorLine, T(a) && x.white),
                        style: { height: s, backgroundColor: e },
                      });
                    })()
                ),
                n && o.createElement('span', { className: x.shadow })
              );
            },
            onPopupClose: v,
            'data-name': g,
          },
          s &&
            m &&
            o.createElement(S, {
              value: s,
              items: m,
              onChange: function (e) {
                p && p(e);
              },
            })
        );
      }
      function N(e, t) {
        return e
          ? (0, m.generateColor)(e, (0, m.alphaToTransparency)(t), !0)
          : '#000000';
      }
      function T(e) {
        return !!e && e.toLowerCase() === v.white;
      }
    },
    48897: (e, t, n) => {
      'use strict';
      n.d(t, { SymbolInputsButton: () => _ });
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        a = n(44352),
        i = n(50151),
        l = n(50655),
        c = n(95711),
        u = n(14483),
        p = n(55141),
        d = n(65106),
        h = n(1861),
        m = n(9745),
        v = n(93929),
        g = n(60015);
      function f(e) {
        const {
          value: t,
          onClick: n,
          className: r,
          startSlot: a,
          disabled: i = !1,
        } = e;
        return o.createElement(
          'div',
          {
            className: s(g.wrap, i && g.disabled, r),
            onClick: n,
            'data-name': 'edit-button',
          },
          o.createElement(
            'div',
            { className: s(g.text, 'apply-overflow-tooltip') },
            void 0 !== a && a,
            o.createElement('span', null, t)
          ),
          o.createElement(m.Icon, { icon: v, className: g.icon })
        );
      }
      var b = n(31356),
        C = n(78260),
        y = n(7785),
        E = n(15983),
        w = n(82708),
        S = n(69006);
      function x(e) {
        const { symbol: t, onSymbolChanged: s, disabled: i, className: p } = e,
          [m, v] = (0, o.useState)(t),
          g = (0, o.useContext)(l.SlotContext),
          b = (0, o.useContext)(c.PopupContext);
        return o.createElement(f, {
          value: m,
          onClick: function () {
            const e = (function (e) {
                const t = (0, y.tokenize)(e);
                return (0, E.isSpread)(t);
              })(m)
                ? m
                : (0, w.safeShortName)(m),
              t = (0, d.getSymbolSearchCompleteOverrideFunction)();
            (0, h.showSymbolSearchItemsDialog)({
              onSearchComplete: (e) => {
                t(e[0].symbol, e[0].result).then((e) => {
                  s(e.symbol), v(e.name);
                });
              },
              dialogTitle: a.t(null, void 0, n(23398)),
              defaultValue: e,
              manager: g,
              onClose: () => {
                b && b.focus();
              },
              showSpreadActions:
                u.enabled('show_spread_operators') &&
                u.enabled('studies_symbol_search_spread_operators'),
            });
          },
          disabled: i,
          className: r()(
            p,
            u.enabled('uppercase_instrument_names') && S.uppercase
          ),
        });
      }
      function _(e) {
        if ('definition' in e) {
          const {
              propType: t,
              properties: n,
              id: s,
              title: r = '',
              solutionId: a,
            } = e.definition,
            l = n[t],
            c = l.value() || '',
            u = (e) => {
              l.setValue(e);
            };
          return o.createElement(
            b.CommonSection,
            { id: s, title: r, solutionId: a },
            o.createElement(
              C.CellWrap,
              null,
              o.createElement(x, {
                symbol: (0, i.ensureDefined)(c),
                onSymbolChanged: u,
              })
            )
          );
        }
        {
          const {
              study: t,
              value: n,
              input: { id: s, name: a },
              onChange: l,
              disabled: c,
              hasTooltip: u,
            } = e,
            d = (e) => {
              const n = (0, p.getInternalSymbolName)(e, t);
              l(n, s, a);
            };
          return o.createElement(x, {
            symbol: (0, i.ensureDefined)(n),
            onSymbolChanged: d,
            disabled: c,
            className: r()(u && S.hasTooltip),
          });
        }
      }
    },
    1861: (e, t, n) => {
      'use strict';
      n.d(t, { showSymbolSearchItemsDialog: () => l });
      var o = n(50959),
        s = n(962),
        r = n(50655),
        a = n(51826),
        i = n(32456);
      function l(e) {
        const {
          initialMode: t = 'symbolSearch',
          autofocus: n = !0,
          defaultValue: l,
          showSpreadActions: c,
          selectSearchOnInit: u,
          onSearchComplete: p,
          dialogTitle: d,
          placeholder: h,
          fullscreen: m,
          initialScreen: v,
          wrapper: g,
          dialog: f,
          contentItem: b,
          onClose: C,
          footer: y,
          symbolTypes: E,
          searchInput: w,
          emptyState: S,
          hideMarkedListFlag: x,
          dialogWidth: _ = 'auto',
          manager: N,
          shouldReturnFocus: T,
        } = e;
        if (
          a.dialogsOpenerManager.isOpened('SymbolSearch') ||
          a.dialogsOpenerManager.isOpened('ChangeIntervalDialog')
        )
          return;
        const I = document.createElement('div'),
          k = o.createElement(
            r.SlotContext.Provider,
            { value: null != N ? N : null },
            o.createElement(i.SymbolSearchItemsDialog, {
              onClose: P,
              initialMode: t,
              defaultValue: l,
              showSpreadActions: c,
              hideMarkedListFlag: x,
              selectSearchOnInit: u,
              onSearchComplete: p,
              dialogTitle: d,
              placeholder: h,
              fullscreen: m,
              initialScreen: v,
              wrapper: g,
              dialog: f,
              contentItem: b,
              footer: y,
              symbolTypes: E,
              searchInput: w,
              emptyState: S,
              autofocus: n,
              dialogWidth: _,
              shouldReturnFocus: T,
            })
          );
        function P() {
          s.unmountComponentAtNode(I),
            a.dialogsOpenerManager.setAsClosed('SymbolSearch'),
            C && C();
        }
        return (
          s.render(k, I),
          a.dialogsOpenerManager.setAsOpened('SymbolSearch'),
          { close: P }
        );
      }
    },
    73146: (e, t, n) => {
      'use strict';
      n.d(t, { createAdapter: () => r });
      var o = n(29673),
        s = n(28853);
      function r(e) {
        if ((0, o.isLineTool)(e))
          return {
            isPine: () => !1,
            isStandardPine: () => !1,
            canOverrideMinTick: () => !1,
            resolvedSymbolInfoBySymbol: () => {
              throw new TypeError('Only study is supported.');
            },
            symbolsResolved: () => {
              throw new TypeError('Only study is supported.');
            },
            parentSources: () => {
              throw new TypeError('Only study is supported.');
            },
            getAllChildren: () => [],
            sourceId: () => {
              throw new TypeError('Only study is supported.');
            },
            inputs: () => ({}),
            parentSourceForInput: () => {
              throw new TypeError('Only study is supported.');
            },
          };
        if ((0, s.isStudy)(e)) return e;
        if ('isInputsStudy' in e) return e;
        throw new TypeError('Unsupported source type.');
      }
    },
    45560: (e, t, n) => {
      'use strict';
      n.d(t, { useDefinitionProperty: () => r });
      var o = n(50959),
        s = n(71953);
      const r = (e) => {
        const t = 'property' in e ? e.property : void 0,
          n = 'defaultValue' in e ? e.defaultValue : e.property.value(),
          [r, a] = (0, o.useState)(t ? t.value() : n);
        (0, o.useEffect)(() => {
          if (t) {
            const n = {};
            return (
              a(t.value()),
              t.subscribe(n, (t) => {
                const n = t.value();
                e.handler && e.handler(n), a(n);
              }),
              () => t.unsubscribeAll(n)
            );
          }
          return () => {};
        }, [t]);
        return [
          r,
          (e) => {
            if (void 0 !== t) {
              const n = t.value();
              s.logger.logNormal(
                `Changing property value from "${n}" to "${e}"`
              ),
                t.setValue(e);
            }
          },
        ];
      };
    },
    78260: (e, t, n) => {
      'use strict';
      n.d(t, { CellWrap: () => i });
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        a = n(2746);
      function i(e) {
        return o.createElement(
          'div',
          { className: r()(a.wrap, e.className) },
          e.children
        );
      }
    },
    53424: (e, t, n) => {
      'use strict';
      n.d(t, { CheckableTitle: () => c });
      var o = n(50959),
        s = n(15294),
        r = n(45560);
      function a(e) {
        const { property: t, ...n } = e,
          [a, i] = (0, r.useDefinitionProperty)({ property: t }),
          l = 'mixed' === a;
        return o.createElement(s.Checkbox, {
          ...n,
          name: 'toggle-enabled',
          checked: l || a,
          indeterminate: l,
          onChange: function () {
            i('mixed' === a || !a);
          },
        });
      }
      var i = n(78260),
        l = n(25679);
      function c(e) {
        const { property: t, disabled: n, title: s, className: r, name: c } = e,
          u = o.createElement('span', { className: l.title }, s);
        return o.createElement(
          i.CellWrap,
          { className: r },
          t
            ? o.createElement(a, {
                name: c,
                className: l.checkbox,
                property: t,
                disabled: n,
                label: u,
                labelAlignBaseline: !0,
              })
            : u
        );
      }
    },
    31356: (e, t, n) => {
      'use strict';
      n.d(t, { CommonSection: () => a });
      var o = n(50959),
        s = n(11062),
        r = n(53424);
      n(41125);
      function a(e) {
        const {
          id: t,
          offset: n,
          disabled: a,
          checked: i,
          title: l,
          children: c,
          solutionId: u,
        } = e;
        return o.createElement(
          s.PropertyTable.Row,
          null,
          o.createElement(
            s.PropertyTable.Cell,
            {
              placement: 'first',
              verticalAlign: 'adaptive',
              offset: n,
              'data-section-name': t,
              colSpan: Boolean(c) ? void 0 : 2,
              checkableTitle: !0,
            },
            o.createElement(r.CheckableTitle, {
              name: `is-enabled-${t}`,
              title: l,
              disabled: a,
              property: i,
            }),
            u && !Boolean(c) && !1
          ),
          Boolean(c) &&
            o.createElement(
              s.PropertyTable.Cell,
              { placement: 'last', 'data-section-name': t },
              c,
              u && !1
            )
        );
      }
    },
    86067: (e, t, n) => {
      'use strict';
      n.d(t, { GroupTitleSection: () => i });
      var o = n(50959),
        s = n(11062),
        r = n(53424),
        a = n(69750);
      function i(e) {
        return o.createElement(
          s.PropertyTable.Row,
          null,
          o.createElement(
            s.PropertyTable.Cell,
            {
              className: a.titleWrap,
              placement: 'first',
              verticalAlign: 'adaptive',
              colSpan: 2,
              'data-section-name': e.name,
              checkableTitle: !0,
            },
            o.createElement(r.CheckableTitle, {
              title: e.title,
              name: `is-enabled-${e.name}`,
              className: a.title,
            })
          )
        );
      }
    },
    71953: (e, t, n) => {
      'use strict';
      n.d(t, { logger: () => o });
      const o = (0, n(59224).getLogger)('Platform.GUI.PropertyDefinitionTrace');
    },
    27797: (e, t, n) => {
      'use strict';
      n.d(t, { ColorPicker: () => M });
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        a = n(44352),
        i = n(24377),
        l = n(50151),
        c = n(49483),
        u = n(20520),
        p = n(16396);
      const d = o.createContext(void 0);
      var h = n(6914),
        m = n(35149),
        v = n(87466);
      function g(e) {
        const { index: t, color: r, selected: i, onSelect: g } = e,
          [f, b] = (0, o.useState)(!1),
          C = (0, o.useContext)(d),
          y = (0, o.useRef)(null),
          E = Boolean(C) && !c.CheckMobile.any();
        return o.createElement(
          o.Fragment,
          null,
          o.createElement('div', {
            ref: y,
            style: r ? { color: r } : void 0,
            className: s(
              v.swatch,
              f && v.hover,
              i && v.selected,
              !r && v.empty,
              String(r).toLowerCase() === h.white && v.white
            ),
            onClick: function () {
              g(r);
            },
            onContextMenu: E ? w : void 0,
          }),
          E &&
            o.createElement(
              u.PopupMenu,
              {
                isOpened: f,
                onClose: w,
                position: function () {
                  const e = (0, l.ensureNotNull)(
                    y.current
                  ).getBoundingClientRect();
                  return { x: e.left, y: e.top + e.height + 4 };
                },
                onClickOutside: w,
              },
              o.createElement(p.PopupMenuItem, {
                className: v.contextItem,
                label: a.t(null, void 0, n(54336)),
                icon: m,
                onClick: function () {
                  w(), (0, l.ensureDefined)(C)(t);
                },
                dontClosePopup: !0,
              })
            )
        );
        function w() {
          b(!f);
        }
      }
      class f extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._onSelect = (e) => {
              const { onSelect: t } = this.props;
              t && t(e);
            });
        }
        render() {
          const { colors: e, color: t, children: n } = this.props;
          if (!e) return null;
          const s = t ? (0, i.parseRgb)(String(t)) : void 0;
          return o.createElement(
            'div',
            { className: v.swatches },
            e.map((e, t) =>
              o.createElement(g, {
                key: String(e) + t,
                index: t,
                color: e,
                selected:
                  s && (0, i.areEqualRgb)(s, (0, i.parseRgb)(String(e))),
                onSelect: this._onSelect,
              })
            ),
            n
          );
        }
      }
      var b = n(54368),
        C = n(94720);
      function y(e) {
        const t = `Invalid RGB color: ${e}`;
        if (null === e) throw new Error(t);
        const n = e.match(/^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i);
        if (null === n) throw new Error(t);
        const [, o, s, r] = n;
        if (!o || !s || !r) throw new Error(t);
        const a = parseInt(o, 16) / 255,
          i = parseInt(s, 16) / 255,
          l = parseInt(r, 16) / 255,
          c = Math.max(a, i, l),
          u = Math.min(a, i, l);
        let p;
        const d = c,
          h = c - u,
          m = 0 === c ? 0 : h / c;
        if (c === u) p = 0;
        else {
          switch (c) {
            case a:
              p = (i - l) / h + (i < l ? 6 : 0);
              break;
            case i:
              p = (l - a) / h + 2;
              break;
            case l:
              p = (a - i) / h + 4;
              break;
            default:
              p = 0;
          }
          p /= 6;
        }
        return { h: p, s: m, v: d };
      }
      var E = n(43370),
        w = n(35257);
      class S extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._container = null),
            (this._refContainer = (e) => {
              this._container = e;
            }),
            (this._handlePosition = (e) => {
              const {
                hsv: { h: t },
                onChange: n,
              } = this.props;
              if (!n) return;
              const o = (0, l.ensureNotNull)(
                  this._container
                ).getBoundingClientRect(),
                s = e.clientX - o.left,
                r = e.clientY - o.top;
              let a = s / o.width;
              a < 0 ? (a = 0) : a > 1 && (a = 1);
              let i = 1 - r / o.height;
              i < 0 ? (i = 0) : i > 1 && (i = 1), n({ h: t, s: a, v: i });
            }),
            (this._mouseDown = (e) => {
              window.addEventListener('mouseup', this._mouseUp),
                window.addEventListener('mousemove', this._mouseMove);
            }),
            (this._mouseUp = (e) => {
              window.removeEventListener('mousemove', this._mouseMove),
                window.removeEventListener('mouseup', this._mouseUp),
                this._handlePosition(e);
            }),
            (this._mouseMove = (0, E.default)(this._handlePosition, 100)),
            (this._handleTouch = (e) => {
              this._handlePosition(e.nativeEvent.touches[0]);
            });
        }
        render() {
          const {
              className: e,
              hsv: { h: t, s: n, v: s },
            } = this.props,
            a = `hsl(${360 * t}, 100%, 50%)`;
          return o.createElement(
            'div',
            {
              className: r()(w.saturation, e),
              style: { backgroundColor: a },
              ref: this._refContainer,
              onMouseDown: this._mouseDown,
              onTouchStart: this._handleTouch,
              onTouchMove: this._handleTouch,
            },
            o.createElement('div', {
              className: w.pointer,
              style: { left: 100 * n + '%', top: 100 * (1 - s) + '%' },
            })
          );
        }
      }
      var x = n(1369);
      class _ extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._container = null),
            (this._refContainer = (e) => {
              this._container = e;
            }),
            (this._handlePosition = (e) => {
              const {
                hsv: { s: t, v: n },
                onChange: o,
              } = this.props;
              if (!o) return;
              const s = (0, l.ensureNotNull)(
                this._container
              ).getBoundingClientRect();
              let r = (e.clientY - s.top) / s.height;
              r < 0 ? (r = 0) : r > 1 && (r = 1), o({ h: r, s: t, v: n });
            }),
            (this._mouseDown = (e) => {
              window.addEventListener('mouseup', this._mouseUp),
                window.addEventListener('mousemove', this._mouseMove);
            }),
            (this._mouseUp = (e) => {
              window.removeEventListener('mousemove', this._mouseMove),
                window.removeEventListener('mouseup', this._mouseUp),
                this._handlePosition(e);
            }),
            (this._mouseMove = (0, E.default)(this._handlePosition, 100)),
            (this._handleTouch = (e) => {
              this._handlePosition(e.nativeEvent.touches[0]);
            });
        }
        render() {
          const {
            className: e,
            hsv: { h: t },
          } = this.props;
          return o.createElement(
            'div',
            { className: r()(x.hue, e) },
            o.createElement(
              'div',
              {
                className: x.pointerContainer,
                ref: this._refContainer,
                onMouseDown: this._mouseDown,
                onTouchStart: this._handleTouch,
                onTouchMove: this._handleTouch,
              },
              o.createElement('div', {
                className: x.pointer,
                style: { top: 100 * t + '%' },
              })
            )
          );
        }
      }
      var N = n(80679);
      const T = '#000000',
        I = a.t(null, { context: 'Color Picker' }, n(40276));
      class k extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._handleHSV = (e) => {
              const t =
                (function (e) {
                  const { h: t, s: n, v: o } = e;
                  let s, r, a;
                  const i = Math.floor(6 * t),
                    l = 6 * t - i,
                    c = o * (1 - n),
                    u = o * (1 - l * n),
                    p = o * (1 - (1 - l) * n);
                  switch (i % 6) {
                    case 0:
                      (s = o), (r = p), (a = c);
                      break;
                    case 1:
                      (s = u), (r = o), (a = c);
                      break;
                    case 2:
                      (s = c), (r = o), (a = p);
                      break;
                    case 3:
                      (s = c), (r = u), (a = o);
                      break;
                    case 4:
                      (s = p), (r = c), (a = o);
                      break;
                    case 5:
                      (s = o), (r = c), (a = u);
                      break;
                    default:
                      (s = 0), (r = 0), (a = 0);
                  }
                  return (
                    '#' +
                    [255 * s, 255 * r, 255 * a]
                      .map((e) =>
                        ('0' + Math.round(e).toString(16)).replace(
                          /.+?([a-f0-9]{2})$/i,
                          '$1'
                        )
                      )
                      .join('')
                  );
                })(e) || T;
              this.setState({
                color: t,
                inputColor: t.replace(/^#/, ''),
                hsv: e,
              }),
                this.props.onSelect(t);
            }),
            (this._handleInput = (e) => {
              const t = e.currentTarget.value;
              try {
                const e = y(t),
                  n = `#${t}`;
                this.setState({ color: n, inputColor: t, hsv: e }),
                  this.props.onSelect(n);
              } catch (e) {
                this.setState({ inputColor: t });
              }
            }),
            (this._handleAddColor = () => this.props.onAdd(this.state.color));
          const t = e.color || T;
          this.state = { color: t, inputColor: t.replace(/^#/, ''), hsv: y(t) };
        }
        render() {
          const { color: e, hsv: t, inputColor: n } = this.state;
          return o.createElement(
            'div',
            { className: N.container },
            o.createElement(
              'div',
              { className: N.form },
              o.createElement('div', {
                className: N.swatch,
                style: { backgroundColor: e },
              }),
              o.createElement(
                'div',
                { className: N.inputWrap },
                o.createElement('span', { className: N.inputHash }, '#'),
                o.createElement('input', {
                  type: 'text',
                  className: N.input,
                  value: n,
                  onChange: this._handleInput,
                })
              ),
              o.createElement(
                'div',
                { className: N.buttonWrap },
                o.createElement(
                  C.Button,
                  { size: 's', onClick: this._handleAddColor },
                  I
                )
              )
            ),
            o.createElement(
              'div',
              { className: N.hueSaturationWrap },
              o.createElement(S, {
                className: N.saturation,
                hsv: t,
                onChange: this._handleHSV,
              }),
              o.createElement(_, {
                className: N.hue,
                hsv: t,
                onChange: this._handleHSV,
              })
            )
          );
        }
      }
      var P = n(93402);
      const B = a.t(null, { context: 'Color Picker' }, n(53585)),
        D = a.t(null, { context: 'Color Picker' }, n(81865));
      class M extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._handleAddColor = (e) => {
              this.setState({ isCustom: !1 }), this._onToggleCustom(!1);
              const { onAddColor: t } = this.props;
              t && t(e);
            }),
            (this._handleSelectColor = (e) => {
              const { onColorChange: t } = this.props,
                { isCustom: n } = this.state;
              t && t(e, n);
            }),
            (this._handleCustomClick = () => {
              this.setState({ isCustom: !0 }), this._onToggleCustom(!0);
            }),
            (this._handleOpacity = (e) => {
              const { onOpacityChange: t } = this.props;
              t && t(e);
            }),
            (this.state = { isCustom: !1 });
        }
        componentDidUpdate(e, t) {
          e.selectOpacity !== this.props.selectOpacity &&
            this.props.menu &&
            this.props.menu.update();
        }
        render() {
          const {
              color: e,
              opacity: t,
              selectCustom: n,
              selectOpacity: s,
              customColors: a,
              onRemoveCustomColor: i,
            } = this.props,
            { isCustom: l } = this.state,
            c = 'number' == typeof t ? t : 1;
          return l
            ? o.createElement(k, {
                color: e,
                onSelect: this._handleSelectColor,
                onAdd: this._handleAddColor,
              })
            : o.createElement(
                'div',
                { className: P.container },
                o.createElement(f, {
                  colors: h.basic,
                  color: e,
                  onSelect: this._handleSelectColor,
                }),
                o.createElement(f, {
                  colors: h.extended,
                  color: e,
                  onSelect: this._handleSelectColor,
                }),
                o.createElement('div', { className: P.separator }),
                o.createElement(
                  d.Provider,
                  { value: i },
                  o.createElement(
                    f,
                    { colors: a, color: e, onSelect: this._handleSelectColor },
                    n &&
                      o.createElement('div', {
                        className: r()(P.customButton, 'apply-common-tooltip'),
                        onClick: this._handleCustomClick,
                        title: B,
                      })
                  )
                ),
                s &&
                  o.createElement(
                    o.Fragment,
                    null,
                    o.createElement('div', { className: P.sectionTitle }, D),
                    o.createElement(b.Opacity, {
                      color: e,
                      opacity: c,
                      onChange: this._handleOpacity,
                    })
                  )
              );
        }
        _onToggleCustom(e) {
          const { onToggleCustom: t } = this.props;
          t && t(e);
        }
      }
    },
    54368: (e, t, n) => {
      'use strict';
      n.d(t, { Opacity: () => l });
      var o = n(50959),
        s = n(97754),
        r = n(50151),
        a = n(37160),
        i = n(30099);
      class l extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._container = null),
            (this._pointer = null),
            (this._raf = null),
            (this._refContainer = (e) => {
              this._container = e;
            }),
            (this._refPointer = (e) => {
              this._pointer = e;
            }),
            (this._handlePosition = (e) => {
              null === this._raf &&
                (this._raf = requestAnimationFrame(() => {
                  const t = (0, r.ensureNotNull)(this._container),
                    n = (0, r.ensureNotNull)(this._pointer),
                    o = t.getBoundingClientRect(),
                    s = n.offsetWidth,
                    i = e.clientX - s / 2 - o.left,
                    l = (0, a.clamp)(i / (o.width - s), 0, 1);
                  this.setState({
                    inputOpacity: Math.round(100 * l).toString(),
                  }),
                    this.props.onChange(l),
                    (this._raf = null);
                }));
            }),
            (this._onSliderClick = (e) => {
              this._handlePosition(e.nativeEvent), this._dragSubscribe();
            }),
            (this._mouseUp = (e) => {
              this.setState({ isPointerDragged: !1 }),
                this._dragUnsubscribe(),
                this._handlePosition(e);
            }),
            (this._mouseMove = (e) => {
              this.setState({ isPointerDragged: !0 }), this._handlePosition(e);
            }),
            (this._onTouchStart = (e) => {
              this._handlePosition(e.nativeEvent.touches[0]);
            }),
            (this._handleTouch = (e) => {
              this.setState({ isPointerDragged: !0 }),
                this._handlePosition(e.nativeEvent.touches[0]);
            }),
            (this._handleTouchEnd = () => {
              this.setState({ isPointerDragged: !1 });
            }),
            (this._handleInput = (e) => {
              const t = e.currentTarget.value,
                n = Number(t) / 100;
              this.setState({ inputOpacity: t }),
                Number.isNaN(n) || n > 1 || this.props.onChange(n);
            }),
            (this.state = {
              inputOpacity: Math.round(100 * e.opacity).toString(),
              isPointerDragged: !1,
            });
        }
        componentWillUnmount() {
          null !== this._raf &&
            (cancelAnimationFrame(this._raf), (this._raf = null)),
            this._dragUnsubscribe();
        }
        render() {
          const { color: e, opacity: t, hideInput: n } = this.props,
            { inputOpacity: r, isPointerDragged: a } = this.state,
            l = { color: e || void 0 };
          return o.createElement(
            'div',
            { className: i.opacity },
            o.createElement(
              'div',
              {
                className: i.opacitySlider,
                style: l,
                ref: this._refContainer,
                onMouseDown: this._onSliderClick,
                onTouchStart: this._onTouchStart,
                onTouchMove: this._handleTouch,
                onTouchEnd: this._handleTouchEnd,
              },
              o.createElement('div', {
                className: i.opacitySliderGradient,
                style: {
                  backgroundImage: `linear-gradient(90deg, transparent, ${e})`,
                },
              }),
              o.createElement(
                'div',
                { className: i.opacityPointerWrap },
                o.createElement('div', {
                  className: s(i.pointer, a && i.dragged),
                  style: { left: 100 * t + '%' },
                  ref: this._refPointer,
                })
              )
            ),
            !n &&
              o.createElement(
                'div',
                { className: i.opacityInputWrap },
                o.createElement('input', {
                  type: 'text',
                  className: i.opacityInput,
                  value: r,
                  onChange: this._handleInput,
                }),
                o.createElement(
                  'span',
                  { className: i.opacityInputPercent },
                  '%'
                )
              )
          );
        }
        _dragSubscribe() {
          const e = (0, r.ensureNotNull)(this._container).ownerDocument;
          e &&
            (e.addEventListener('mouseup', this._mouseUp),
            e.addEventListener('mousemove', this._mouseMove));
        }
        _dragUnsubscribe() {
          const e = (0, r.ensureNotNull)(this._container).ownerDocument;
          e &&
            (e.removeEventListener('mousemove', this._mouseMove),
            e.removeEventListener('mouseup', this._mouseUp));
        }
      }
    },
    6914: (e, t, n) => {
      'use strict';
      n.d(t, { basic: () => i, extended: () => c, white: () => s });
      var o = n(48891);
      const s = o.colorsPalette['color-white'],
        r = [
          'ripe-red',
          'tan-orange',
          'banana-yellow',
          'iguana-green',
          'minty-green',
          'sky-blue',
          'tv-blue',
          'deep-blue',
          'grapes-purple',
          'berry-pink',
        ],
        a = [200, 300, 400, 500, 600, 700, 800, 900].map(
          (e) => `color-cold-gray-${e}`
        );
      a.unshift('color-white'),
        a.push('color-black'),
        r.forEach((e) => {
          a.push(`color-${e}-500`);
        });
      const i = a.map((e) => o.colorsPalette[e]),
        l = [];
      [100, 200, 300, 400, 700, 900].forEach((e) => {
        r.forEach((t) => {
          l.push(`color-${t}-${e}`);
        });
      });
      const c = l.map((e) => o.colorsPalette[e]);
    },
    59054: (e, t, n) => {
      'use strict';
      n.d(t, { ControlDisclosureView: () => g });
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        a = n(38528),
        i = n(67029),
        l = n(78274),
        c = n(4523),
        u = n(9745),
        p = n(2948),
        d = n(23428);
      function h(e) {
        const { isDropped: t } = e;
        return o.createElement(u.Icon, {
          className: r()(d.icon, t && d.dropped),
          icon: p,
        });
      }
      function m(e) {
        const { className: t, disabled: n, isDropped: s } = e;
        return o.createElement(
          'span',
          { className: r()(d.button, n && d.disabled, t) },
          o.createElement(h, { isDropped: s })
        );
      }
      var v = n(66986);
      const g = o.forwardRef((e, t) => {
        const {
            listboxId: n,
            className: s,
            listboxClassName: u,
            listboxTabIndex: p,
            hideArrowButton: d,
            matchButtonAndListboxWidths: h,
            popupPosition: g,
            disabled: f,
            isOpened: b,
            scrollWrapReference: C,
            repositionOnScroll: y,
            closeOnHeaderOverlap: E,
            listboxReference: w,
            size: S = 'small',
            onClose: x,
            onOpen: _,
            onListboxFocus: N,
            onListboxBlur: T,
            onListboxKeyDown: I,
            buttonChildren: k,
            children: P,
            caretClassName: B,
            listboxAria: D,
            ...M
          } = e,
          V = (0, o.useRef)(null),
          O =
            !d &&
            o.createElement(
              l.EndSlot,
              null,
              o.createElement(m, { isDropped: b, disabled: f, className: B })
            );
        return o.createElement(c.PopupMenuDisclosureView, {
          buttonRef: V,
          listboxId: n,
          listboxClassName: u,
          listboxTabIndex: p,
          isOpened: b,
          onClose: x,
          onOpen: _,
          listboxReference: w,
          scrollWrapReference: C,
          onListboxFocus: N,
          onListboxBlur: T,
          onListboxKeyDown: I,
          listboxAria: D,
          matchButtonAndListboxWidths: h,
          popupPosition: g,
          button: o.createElement(i.ControlSkeleton, {
            ...M,
            'data-role': 'listbox',
            disabled: f,
            className: r()(v.button, s),
            size: S,
            ref: (0, a.useMergedRefs)([V, t]),
            middleSlot: o.createElement(
              l.MiddleSlot,
              null,
              o.createElement(
                'span',
                { className: r()(v['button-children'], d && v.hiddenArrow) },
                k
              )
            ),
            endSlot: O,
          }),
          popupChildren: P,
          repositionOnScroll: y,
          closeOnHeaderOverlap: E,
        });
      });
      g.displayName = 'ControlDisclosureView';
    },
    56512: (e, t, n) => {
      'use strict';
      n.d(t, { useCustomColors: () => l });
      var o = n(50959),
        s = n(56840),
        r = n(76422);
      function a(e, t) {
        (0, o.useEffect)(
          () => (
            r.subscribe(e, t, null),
            () => {
              r.unsubscribe(e, t, null);
            }
          ),
          [e, t]
        );
      }
      var i = n(24377);
      function l() {
        const [e, t] = (0, o.useState)(
          (0, s.getJSON)('pickerCustomColors', [])
        );
        a('add_new_custom_color', (n) => t(c(n, e))),
          a('remove_custom_color', (n) => t(u(n, e)));
        const n = (0, o.useCallback)(
            (t) => {
              const n = t ? (0, i.parseRgb)(t) : null;
              e.some(
                (e) =>
                  null !== e &&
                  null !== n &&
                  (0, i.areEqualRgb)((0, i.parseRgb)(e), n)
              ) ||
                (r.emit('add_new_custom_color', t),
                (0, s.setJSON)('pickerCustomColors', c(t, e)));
            },
            [e]
          ),
          l = (0, o.useCallback)(
            (t) => {
              (t >= 0 || t < e.length) &&
                (r.emit('remove_custom_color', t),
                (0, s.setJSON)('pickerCustomColors', u(t, e)));
            },
            [e]
          );
        return [e, n, l];
      }
      function c(e, t) {
        const n = t.slice();
        return n.push(e), n.length > 29 && n.shift(), n;
      }
      function u(e, t) {
        return t.filter((t, n) => e !== n);
      }
    },
    90405: (e, t, n) => {
      'use strict';
      n.d(t, { Select: () => C });
      var o = n(50959),
        s = n(22064),
        r = n(38528),
        a = n(16921),
        i = n(16396),
        l = n(12481),
        c = n(43370);
      var u = n(36762),
        p = n(26597),
        d = n(59054),
        h = n(36104),
        m = n(38223),
        v = n(60673);
      function g(e) {
        return !e.readonly;
      }
      function f(e, t) {
        var n;
        return null !== (n = null == t ? void 0 : t.id) && void 0 !== n
          ? n
          : (0, s.createDomId)(e, 'item', null == t ? void 0 : t.value);
      }
      function b(e) {
        var t, n;
        const { selectedItem: s, placeholder: r } = e;
        if (!s) return o.createElement('span', { className: v.placeholder }, r);
        const a =
          null !==
            (n =
              null !== (t = s.selectedContent) && void 0 !== t
                ? t
                : s.content) && void 0 !== n
            ? n
            : s.value;
        return o.createElement('span', null, a);
      }
      const C = o.forwardRef((e, t) => {
        const {
          id: n,
          menuClassName: v,
          menuItemClassName: C,
          tabIndex: y,
          disabled: E,
          highlight: w,
          intent: S,
          hideArrowButton: x,
          placeholder: _,
          addPlaceholderToItems: N = !0,
          value: T,
          'aria-labelledby': I,
          onFocus: k,
          onBlur: P,
          onClick: B,
          onChange: D,
          onKeyDown: M,
          repositionOnScroll: V = !0,
          openMenuOnEnter: O = !0,
          'aria-describedby': F,
          'aria-invalid': R,
          ...L
        } = e;
        let { items: W } = e;
        if (_ && N) {
          W = [
            {
              value: void 0,
              content: _,
              id: (0, s.createDomId)(n, 'placeholder'),
            },
            ...W,
          ];
        }
        const {
            listboxId: A,
            isOpened: q,
            isFocused: U,
            buttonTabIndex: z,
            listboxTabIndex: Z,
            highlight: G,
            intent: H,
            open: K,
            onOpen: Y,
            close: $,
            toggle: j,
            buttonFocusBindings: X,
            onButtonClick: Q,
            buttonRef: J,
            listboxRef: ee,
            buttonAria: te,
          } = (0, h.useControlDisclosure)({
            id: n,
            disabled: E,
            buttonTabIndex: y,
            intent: S,
            highlight: w,
            onFocus: k,
            onBlur: P,
            onClick: B,
          }),
          ne = W.filter(g),
          oe = ne.find((e) => e.value === T),
          [se, re, ae] = (0, a.useKeepActiveItemIntoView)({ activeItem: oe }),
          ie = (0, s.joinDomIds)(I, n),
          le = ie.length > 0 ? ie : void 0,
          ce = (0, o.useMemo)(
            () => ({
              role: 'listbox',
              'aria-labelledby': I,
              'aria-activedescendant': f(n, oe),
            }),
            [I, oe]
          ),
          ue = (0, o.useCallback)((e) => e.value === T, [T]),
          pe = (0, o.useCallback)((e) => D && D(e.value), [D]),
          de = (0, u.useItemsKeyboardNavigation)(m.isRtl, ne, ue, pe, !1, {
            next: [40],
            previous: [38],
          }),
          he = (0, p.useKeyboardToggle)(j, q || O),
          me = (0, p.useKeyboardClose)(q, $),
          ve = (0, p.useKeyboardOpen)(q, K),
          ge = (0, p.useKeyboardEventHandler)([he, me, ve]),
          fe = (0, p.useKeyboardEventHandler)([de, he, me]),
          be = (function (e) {
            const t = (0, o.useRef)(''),
              n = (0, o.useMemo)(
                () =>
                  (0, l.default)(() => {
                    t.current = '';
                  }, 500),
                []
              ),
              s = (0, o.useMemo)(() => (0, c.default)(e, 200), [e]);
            return (0, o.useCallback)(
              (e) => {
                e.key.length > 0 &&
                  e.key.length < 3 &&
                  ((t.current += e.key), s(t.current, e), n());
              },
              [n, s]
            );
          })((t, n) => {
            const o = (function (e, t, n) {
              return e.find((e) => {
                var o;
                const s = t.toLowerCase();
                return (
                  !e.readonly &&
                  (n
                    ? n(e).toLowerCase().startsWith(s)
                    : !e.readonly &&
                      (('string' == typeof e.content &&
                        e.content.toLowerCase().startsWith(s)) ||
                        ('string' == typeof e.textContent &&
                          e.textContent.toLowerCase().startsWith(s)) ||
                        String(null !== (o = e.value) && void 0 !== o ? o : '')
                          .toLowerCase()
                          .startsWith(s)))
                );
              });
            })(ne, t, e.getSearchKey);
            void 0 !== o && D && (n.stopPropagation(), q || K(), D(o.value));
          });
        return o.createElement(
          d.ControlDisclosureView,
          {
            ...L,
            ...te,
            ...X,
            id: n,
            role: 'button',
            tabIndex: z,
            'aria-owns': te['aria-controls'],
            'aria-haspopup': 'listbox',
            'aria-labelledby': le,
            disabled: E,
            hideArrowButton: x,
            isFocused: U,
            isOpened: q,
            highlight: G,
            intent: H,
            ref: (0, r.useMergedRefs)([J, t]),
            onClick: Q,
            onOpen: function () {
              ae(oe, { duration: 0 }), Y();
            },
            onClose: $,
            onKeyDown: function (e) {
              ge(e), M && M(e);
              e.defaultPrevented || be(e);
            },
            listboxId: A,
            listboxTabIndex: Z,
            listboxClassName: v,
            listboxAria: ce,
            'aria-describedby': F,
            'aria-invalid': R,
            listboxReference: ee,
            scrollWrapReference: se,
            onListboxKeyDown: function (e) {
              fe(e), e.defaultPrevented || be(e);
            },
            buttonChildren: o.createElement(b, {
              selectedItem: oe,
              placeholder: _,
            }),
            repositionOnScroll: V,
          },
          W.map((e, t) => {
            var s;
            if (e.readonly)
              return o.createElement(
                o.Fragment,
                { key: `readonly_item_${t}` },
                e.content
              );
            const r = f(n, e);
            return o.createElement(i.PopupMenuItem, {
              key: r,
              id: r,
              className: C,
              role: 'option',
              'aria-selected': T === e.value,
              isActive: T === e.value,
              label: null !== (s = e.content) && void 0 !== s ? s : e.value,
              onClick: Ce,
              onClickArg: e.value,
              isDisabled: e.disabled,
              reference: (t) => re(e, t),
            });
          })
        );
        function Ce(e) {
          D && D(e);
        }
      });
      C.displayName = 'Select';
    },
    86656: (e, t, n) => {
      'use strict';
      n.d(t, { TouchScrollContainer: () => i });
      var o = n(50959),
        s = n(59142),
        r = n(50151),
        a = n(49483);
      const i = (0, o.forwardRef)((e, t) => {
        const { children: n, ...r } = e,
          i = (0, o.useRef)(null);
        return (
          (0, o.useImperativeHandle)(t, () => i.current),
          (0, o.useLayoutEffect)(() => {
            if (a.CheckMobile.iOS())
              return (
                null !== i.current &&
                  (0, s.disableBodyScroll)(i.current, { allowTouchMove: l(i) }),
                () => {
                  null !== i.current && (0, s.enableBodyScroll)(i.current);
                }
              );
          }, []),
          o.createElement('div', { ref: i, ...r }, n)
        );
      });
      function l(e) {
        return (t) => {
          const n = (0, r.ensureNotNull)(e.current),
            o = document.activeElement;
          return (
            !n.contains(t) || (null !== o && n.contains(o) && o.contains(t))
          );
        };
      }
    },
    26278: (e) => {
      e.exports = {
        titleWrap: 'titleWrap-Izz3hpJc',
        groupFooter: 'groupFooter-Izz3hpJc',
      };
    },
    49934: (e) => {
      e.exports = { wrapper: 'wrapper-JXHzsa7P' };
    },
    17611: (e) => {
      e.exports = { inlineRow: 'inlineRow-D8g11qqA' };
    },
    93071: (e) => {
      e.exports = {
        container: 'container-QyF09i7Y',
        hasTooltip: 'hasTooltip-QyF09i7Y',
        datePickerWrapper: 'datePickerWrapper-QyF09i7Y',
        timePickerWrapper: 'timePickerWrapper-QyF09i7Y',
      };
    },
    27698: (e) => {
      e.exports = {
        input: 'input-ZOx_CVY3',
        symbol: 'symbol-ZOx_CVY3',
        checkbox: 'checkbox-ZOx_CVY3',
        label: 'label-ZOx_CVY3',
        dropdownMenu: 'dropdownMenu-ZOx_CVY3',
        sessionStart: 'sessionStart-ZOx_CVY3',
        sessionEnd: 'sessionEnd-ZOx_CVY3',
        sessionInputContainer: 'sessionInputContainer-ZOx_CVY3',
        sessionDash: 'sessionDash-ZOx_CVY3',
        inputGroup: 'inputGroup-ZOx_CVY3',
        textarea: 'textarea-ZOx_CVY3',
        inlineGroup: 'inlineGroup-ZOx_CVY3',
        hasTooltip: 'hasTooltip-ZOx_CVY3',
      };
    },
    24712: (e) => {
      e.exports = {
        content: 'content-tBgV1m0B',
        cell: 'cell-tBgV1m0B',
        inner: 'inner-tBgV1m0B',
        first: 'first-tBgV1m0B',
        inlineCell: 'inlineCell-tBgV1m0B',
        fill: 'fill-tBgV1m0B',
        top: 'top-tBgV1m0B',
        topCenter: 'topCenter-tBgV1m0B',
        offset: 'offset-tBgV1m0B',
        inlineRow: 'inlineRow-tBgV1m0B',
        grouped: 'grouped-tBgV1m0B',
        separator: 'separator-tBgV1m0B',
        groupSeparator: 'groupSeparator-tBgV1m0B',
        big: 'big-tBgV1m0B',
        adaptive: 'adaptive-tBgV1m0B',
        checkableTitle: 'checkableTitle-tBgV1m0B',
      };
    },
    80128: (e) => {
      e.exports = {
        wrap: 'wrap-QutFvTLS',
        labelWrap: 'labelWrap-QutFvTLS',
        label: 'label-QutFvTLS',
        hasTooltip: 'hasTooltip-QutFvTLS',
      };
    },
    82161: (e, t, n) => {
      'use strict';
      n.d(t, { splitThousands: () => s });
      var o = n(50335);
      function s(e, t = '&nbsp;') {
        let n = e + '';
        -1 !== n.indexOf('e') &&
          (n = (function (e) {
            return (0, o.fixComputationError)(e)
              .toFixed(10)
              .replace(/\.?0+$/, '');
          })(Number(e)));
        const s = n.split('.');
        return (
          s[0].replace(/\B(?=(\d{3})+(?!\d))/g, t) + (s[1] ? '.' + s[1] : '')
        );
      }
    },
    83207: (e, t, n) => {
      'use strict';
      n.d(t, { bind: () => a, setter: () => i });
      var o = n(50959),
        s = n(76917),
        r = n(27365);
      function a(e) {
        var t;
        return (
          (t = class extends o.PureComponent {
            constructor() {
              super(...arguments),
                (this._onChange = (e, t, n) => {
                  const { setValue: o } = this.context,
                    { onChange: s } = this.props;
                  i(o, s)(e, t, n);
                });
            }
            render() {
              const { input: t } = this.props,
                { values: n, model: s } = this.context;
              return o.createElement(e, {
                ...this.props,
                value: n[t.id],
                tzName: (0, r.getTimezoneName)(s),
                onChange: this._onChange,
              });
            }
          }),
          (t.contextType = s.PropertyContext),
          t
        );
      }
      function i(e, t) {
        return (n, o, s) => {
          e(o, n, s), t && t(n, o, s);
        };
      }
    },
    76917: (e, t, n) => {
      'use strict';
      n.d(t, { PropertyContainer: () => u, PropertyContext: () => c });
      var o = n(50959),
        s = n(50151),
        r = n(44352),
        a = n(36298);
      const i = (0, n(59224).getLogger)(
          'Platform.GUI.StudyInputPropertyContainer'
        ),
        l = new a.TranslatedString(
          'change {propertyName} property',
          r.t(null, void 0, n(18567))
        ),
        c = o.createContext(null);
      class u extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._setValue = (e, t, o) => {
              const { property: c, model: u } = this.props,
                p = (0, s.ensureDefined)(c.child(e));
              i.logNormal(
                `Changing property "${e}" value from "${c.value()}" to "${t}"`
              );
              const d = new a.TranslatedString(
                o,
                (function (e) {
                  return r.t(e, { context: 'input' }, n(88601));
                })(o)
              );
              u.setProperty(p, t, l.format({ propertyName: d }));
            });
          const { property: t } = e,
            o = {};
          t.childNames().forEach((e) => {
            const n = (0, s.ensureDefined)(t.child(e));
            o.hasOwnProperty(e) || (o[e] = n.value());
          }),
            (this.state = o);
        }
        componentDidMount() {
          const { property: e, onStudyInputChange: t } = this.props;
          e.childNames().forEach((n) => {
            (0, s.ensureDefined)(e.child(n)).subscribe(this, (e) => {
              const o = e.value();
              i.logNormal(`Property "${n}" updated to value "${o}"`),
                this.setState({ [n]: o }),
                null == t || t(o, n);
            });
          });
        }
        componentWillUnmount() {
          const { property: e } = this.props;
          e.childNames().forEach((t) => {
            (0, s.ensureDefined)(e.child(t)).unsubscribeAll(this);
          });
        }
        render() {
          const { study: e, model: t, children: n } = this.props,
            s = {
              study: e,
              model: t,
              values: this.state,
              setValue: this._setValue,
            };
          return o.createElement(c.Provider, { value: s }, n);
        }
      }
    },
    51717: (e, t, n) => {
      'use strict';
      n.d(t, { ModelContext: () => s, bindModel: () => r });
      var o = n(50959);
      const s = o.createContext(null);
      function r(e, t) {
        return o.createElement(s.Consumer, null, (n) =>
          n ? o.createElement(e, { ...Object.assign({ model: n }, t) }) : null
        );
      }
    },
    41594: (e, t, n) => {
      'use strict';
      n.d(t, {
        StylePropertyContainer: () => a,
        StylePropertyContext: () => r,
        bindPropertyContext: () => i,
      });
      var o = n(50959),
        s = n(51717);
      const r = o.createContext(null);
      class a extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._setValue = (e, t, n) => {
              const { model: o } = this.props;
              o.setProperty(e, t, n);
            });
        }
        componentDidMount() {
          const { property: e } = this.props;
          e.subscribe(this, () => this.forceUpdate());
        }
        componentWillUnmount() {
          const { property: e } = this.props;
          e.unsubscribeAll(this);
        }
        render() {
          const e = { setValue: this._setValue };
          return o.createElement(r.Provider, { value: e }, this.props.children);
        }
      }
      function i(e, t) {
        return (0, s.bindModel)(
          ({ model: n }) =>
            o.createElement(
              a,
              { model: n, property: t.property },
              o.createElement(e, { ...t })
            ),
          t
        );
      }
    },
    76694: (e, t, n) => {
      'use strict';
      n.d(t, { IconGroupWrapper: () => r });
      var o = n(50959),
        s = n(49934);
      function r(e) {
        const { children: t } = e;
        return o.createElement('div', { className: s.wrapper }, t);
      }
    },
    39847: (e, t, n) => {
      'use strict';
      n.d(t, { InputTooltip: () => E });
      var o = n(50959),
        s = n(97754),
        r = n(90186),
        a = n(9745),
        i = n(5325);
      function l() {
        const [e, t] = (0, o.useState)(!1);
        return (
          (0, o.useEffect)(() => {
            t(i.mobiletouch);
          }, []),
          e
        );
      }
      var c = n(38952),
        u = n(38528),
        p = n(82353),
        d = n(27941),
        h = n(99084),
        m = n(30162),
        v = n(78370),
        g = n.n(v);
      const f = { info: d, question: p, check: h, exclamation: m };
      function b(e) {
        return o.createElement('span', {
          ...(0, c.renameRef)(e),
          className: s(e.className, g()['no-active-state']),
        });
      }
      function C(e) {
        const {
            icon: t,
            intent: n = 'default',
            ariaLabel: i,
            tooltip: c,
            className: p,
            reference: d,
            showTooltipOnTouch: h = !0,
            renderComponent: m = b,
            showTooltip: v,
            hideTooltip: C,
            onFocus: y,
            onBlur: E,
            onClick: w,
            tabIndex: S,
          } = e,
          x = l() ? h : Boolean(c),
          _ = o.useRef(null),
          N = (0, u.useMergedRefs)([d, _]),
          T = (function (e) {
            const {
                tabIndex: t = 0,
                showTooltip: n,
                hideTooltip: s,
                onFocus: r,
                onBlur: a,
                onClick: i,
                ref: c,
              } = e,
              u = l();
            return {
              onBlur: (0, o.useCallback)(
                (e) => {
                  s && s(), a && a(e);
                },
                [s, a]
              ),
              onFocus: (0, o.useCallback)(
                (e) => {
                  n && n(e.currentTarget, { tooltipDelay: 200 }), r && r(e);
                },
                [n, r]
              ),
              onClick: (0, o.useCallback)(
                (e) => {
                  var t;
                  u && (null === (t = c.current) || void 0 === t || t.focus()),
                    i && i(e);
                },
                [i]
              ),
              tabIndex: t,
            };
          })({
            showTooltip: v,
            hideTooltip: C,
            onFocus: y,
            onBlur: E,
            onClick: w,
            ref: _,
            tabIndex: S,
          }),
          I = o.useMemo(
            () =>
              (function (e, t) {
                return t ? f[t] : 'success' === e ? f.check : f.exclamation;
              })(n, t),
            [t, n]
          );
        return o.createElement(
          m,
          {
            className: s(
              p,
              g()['icon-wrapper'],
              g()[`intent-${n}`],
              x && c && g()['with-tooltip'],
              x && c && 'apply-common-tooltip'
            ),
            title: x ? c : void 0,
            'aria-label': i,
            reference: N,
            ...(0, r.filterDataProps)(e),
            ...T,
          },
          o.createElement(a.Icon, {
            'aria-hidden': !0,
            icon: I,
            className: g().icon,
          })
        );
      }
      var y = n(38780);
      function E(e) {
        const { className: t, title: n } = e;
        return o.createElement(C, {
          icon: 'info',
          className: t,
          ariaLabel: n,
          showTooltip: y.showOnElement,
          hideTooltip: y.hide,
          tooltip: n,
          tabIndex: -1,
        });
      }
    },
    64420: (e, t, n) => {
      'use strict';
      n.d(t, {
        getInputGroups: () => a,
        isGroup: () => s,
        isInputInlines: () => r,
      });
      var o = n(50151);
      function s(e) {
        return e.hasOwnProperty('groupType');
      }
      function r(e) {
        return s(e) && 'inline' === e.groupType;
      }
      function a(e) {
        const t = [],
          n = new Map(),
          s = new Map();
        return (
          s.set(void 0, new Map()),
          e.forEach((e) => {
            const { group: r, inline: a } = e;
            if (void 0 !== r || void 0 !== a)
              if (void 0 !== r)
                if (void 0 !== a)
                  if (n.has(r)) {
                    const t = (0, o.ensureDefined)(n.get(r));
                    let l;
                    s.has(t)
                      ? (l = (0, o.ensureDefined)(s.get(t)))
                      : ((l = new Map()), s.set(t, l)),
                      i(e, 'inline', a, l, t.children);
                  } else {
                    const o = { id: a, groupType: 'inline', children: [e] },
                      i = { id: r, groupType: 'group', children: [o] },
                      l = new Map();
                    l.set(a, o), s.set(i, l), n.set(r, i), t.push(i);
                  }
                else i(e, 'group', r, n, t);
              else {
                const n = (0, o.ensureDefined)(s.get(void 0));
                i(e, 'inline', (0, o.ensureDefined)(a), n, t);
              }
            else t.push(e);
          }),
          t
        );
      }
      function i(e, t, n, s, r) {
        if (s.has(n)) (0, o.ensureDefined)(s.get(n)).children.push(e);
        else {
          const o = { id: n, groupType: t, children: [e] };
          s.set(n, o), r.push(o);
        }
      }
    },
    12949: (e, t, n) => {
      'use strict';
      n.d(t, { InputRow: () => te });
      var o = n(44352),
        s = n(50959),
        r = n(50151),
        a = n(33703),
        i = n(96438),
        l = n(47510),
        c = n(4781),
        u = n(97754),
        p = n.n(u),
        d = n(31261),
        h = n(83207),
        m = n(90009),
        v = n(27698);
      class g extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const {
                input: { id: t, name: n },
                onChange: o,
              } = this.props;
              o(e.currentTarget.value, t, n);
            });
        }
        render() {
          const {
            input: { defval: e },
            value: t,
            disabled: n,
            onBlur: o,
            onKeyDown: r,
            hasTooltip: a,
          } = this.props;
          return s.createElement(d.InputControl, {
            className: p()(v.input, a && v.hasTooltip),
            value: void 0 === t ? e : t,
            onChange: this._onChange,
            onBlur: o,
            onKeyDown: r,
            disabled: n,
          });
        }
      }
      const f = (0, m.debounced)(g),
        b = (0, h.bind)(f);
      var C = n(55141),
        y = n(11062);
      function E(e) {
        const { className: t } = e,
          n = (0, s.useContext)(y.PropertyTable.InlineRowContext);
        return s.createElement(
          'div',
          { className: u(v.inputGroup, n && v.inlineGroup, t) },
          e.children
        );
      }
      var w = n(36565);
      function S(e = '') {
        const [, t = '', n = '', o = '', s = ''] = Array.from(
          e.match(/^(\d\d)(\d\d)-(\d\d)(\d\d)/) || []
        );
        return [`${t}:${n}`, `${o}:${s}`];
      }
      class x extends s.PureComponent {
        constructor(e) {
          super(e),
            (this._onStartPick = (e) => {
              this.setState({ startTime: e }, this._onChange);
            }),
            (this._onEndPick = (e) => {
              this.setState({ endTime: e }, this._onChange);
            }),
            (this._onChange = () => {
              const {
                  input: { id: e, name: t },
                  onChange: n,
                } = this.props,
                { startTime: o, endTime: s } = this.state;
              n(o.replace(':', '') + '-' + s.replace(':', ''), e, t);
            });
          const t = e.value || e.input.defval,
            [n, o] = S(t);
          this.state = { prevValue: t, startTime: n, endTime: o };
        }
        render() {
          const { startTime: e, endTime: t } = this.state,
            { hasTooltip: n, disabled: o } = this.props;
          return s.createElement(
            E,
            { className: p()(n && v.hasTooltip) },
            s.createElement(
              'div',
              { className: v.sessionStart },
              s.createElement(w.TimeInput, {
                className: p()(v.input, v.sessionInputContainer),
                name: 'start',
                value: (0, r.ensureDefined)(e),
                onChange: this._onStartPick,
                disabled: o,
              }),
              s.createElement('span', { className: v.sessionDash }, ' — ')
            ),
            s.createElement(
              'div',
              { className: v.sessionEnd },
              s.createElement(w.TimeInput, {
                className: p()(v.input, v.sessionInputContainer),
                name: 'end',
                value: (0, r.ensureDefined)(t),
                onChange: this._onEndPick,
                disabled: o,
              })
            )
          );
        }
        static getDerivedStateFromProps(e, t) {
          if (e.value === t.prevValue) return t;
          const [n, o] = S(e.value);
          return { prevValue: e.value, startTime: n, endTime: o };
        }
      }
      const _ = (0, h.bind)(x);
      var N = n(14483),
        T = n(42856),
        I = n(76917),
        k = n(90405);
      class P extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const {
                input: { id: t, name: n },
                onChange: o,
              } = this.props;
              o(e, t, n);
            });
        }
        render() {
          const {
              input: { id: e, defval: t, options: r, optionsTitles: a },
              value: i,
              disabled: l,
              hasTooltip: c,
            } = this.props,
            u = r.map((e) => {
              const t = a && a[e] ? a[e] : e;
              return {
                value: e,
                content: o.t(t, { context: 'input' }, n(88601)),
              };
            }),
            d = void 0 !== i && r.includes(i) ? i : t;
          return s.createElement(k.Select, {
            id: e,
            className: p()(v.input, c && v.hasTooltip),
            menuClassName: v.dropdownMenu,
            value: d,
            items: u,
            onChange: this._onChange,
            disabled: l,
          });
        }
      }
      const B = (0, h.bind)(P);
      var D = n(73146),
        M = n(28853);
      const V = {
        open: o.t(null, void 0, n(38466)),
        high: o.t(null, void 0, n(39337)),
        low: o.t(null, void 0, n(3919)),
        close: o.t(null, void 0, n(36962)),
        hl2: o.t(null, void 0, n(91815)),
        hlc3: o.t(null, void 0, n(40771)),
        ohlc4: o.t(null, void 0, n(12504)),
        hlcc4: o.t(null, void 0, n(9523)),
      };
      class O extends s.PureComponent {
        render() {
          const { input: e } = this.props,
            { study: t, model: n } = this.context;
          let o = { ...V };
          delete o.hlcc4;
          const i = (0, D.createAdapter)(t);
          if (t && this._isStudy(t) && t.isChildStudy()) {
            const t = (0, a.getInputValue)(i.inputs()[e.id]),
              n = i.parentSourceForInput(t);
            if ((0, M.isStudy)(n)) {
              const t = n.title(),
                s = T.StudyMetaInfo.getChildSourceInputTitles(
                  e,
                  n.metaInfo(),
                  t
                );
              o = { ...o, ...s };
            }
          }
          if (
            N.enabled('study_on_study') &&
            t &&
            this._isStudy(t) &&
            (t.isChildStudy() || T.StudyMetaInfo.canBeChild(t.metaInfo()))
          ) {
            const e = [t, ...i.getAllChildren()];
            n.model()
              .allStudies()
              .filter((t) => t.canHaveChildren() && !e.includes(t))
              .forEach((e) => {
                const t = e.title(!0, void 0, !0),
                  n = e.id(),
                  s = e.metaInfo(),
                  a = s.styles,
                  i = s.plots || [];
                if (1 === i.length) o[n + '$0'] = t;
                else if (i.length > 1) {
                  const e = i.reduce((e, o, s) => {
                    if (!T.StudyMetaInfo.canPlotBeSourceOfChildStudy(o.type))
                      return e;
                    let i;
                    try {
                      i = (0, r.ensureDefined)(
                        (0, r.ensureDefined)(a)[o.id]
                      ).title;
                    } catch (e) {
                      i = o.id;
                    }
                    return { ...e, [`${n}$${s}`]: `${t}: ${i}` };
                  }, {});
                  o = { ...o, ...e };
                }
              });
          }
          const l = {
            ...e,
            type: 'text',
            options: Object.keys(o),
            optionsTitles: o,
          };
          return s.createElement(B, { ...this.props, input: l });
        }
        _isStudy(e) {
          return !e.hasOwnProperty('isInputsStudy');
        }
      }
      O.contextType = I.PropertyContext;
      var F = n(36274),
        R = n(94025);
      const L = void 0,
        W = [
          '1',
          '3',
          '5',
          '15',
          '30',
          '45',
          '60',
          '120',
          '180',
          '240',
          '1D',
          '1W',
          '1M',
          '3M',
          '6M',
          '12M',
        ],
        A = ['1S', '5S', '10S', '15S', '30S'];
      class q extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const {
                input: { id: t, name: n },
                onChange: o,
              } = this.props;
              o(e, t, n);
            });
        }
        render() {
          const { input: e, value: t, disabled: r, hasTooltip: a } = this.props,
            i = F.Interval.parse(void 0 === t ? e.defval : t),
            l = i.isValid() ? i.value() : t,
            c = L ? L.get().filter((e) => !F.Interval.parse(e).isRange()) : [],
            u = (0, R.mergeResolutions)(
              W,
              (0, R.isSecondsEnabled)() ? A : [],
              c
            );
          return (
            u.unshift(''),
            s.createElement(k.Select, {
              id: e.id,
              className: p()(v.input, v.resolution, a && v.hasTooltip),
              menuClassName: p()(v.dropdownMenu, v.resolution),
              items:
                ((d = u),
                d.map((e) => ({
                  value: e,
                  content:
                    '' === e
                      ? o.t(null, void 0, n(94551))
                      : (0, R.getTranslatedResolutionModel)(e).hint,
                }))),
              value: l,
              onChange: this._onChange,
              disabled: r,
            })
          );
          var d;
        }
      }
      const U = (0, h.bind)(q);
      var z = n(41552),
        Z = n(41594);
      class G extends s.PureComponent {
        render() {
          return s.createElement(I.PropertyContext.Consumer, null, (e) =>
            e ? this._getColorInputWithContext(e) : null
          );
        }
        _getColorInputWithContext(e) {
          var t;
          const {
              input: { id: n },
              disabled: o,
              hasTooltip: r,
            } = this.props,
            { model: a, study: i } = e;
          if ('properties' in i || 'tempProperties' in i) {
            const e =
              'properties' in i
                ? i.properties().inputs[n]
                : null === (t = i.tempProperties) || void 0 === t
                ? void 0
                : t.inputs.child(n);
            return s.createElement(
              Z.StylePropertyContainer,
              { model: a, property: e },
              s.createElement(z.ColorWithThicknessSelect, {
                className: p()(r && v.hasTooltip),
                color: e,
                disabled: o,
              })
            );
          }
          return null;
        }
      }
      var H = n(85528),
        K = n(76056),
        Y = n(23935),
        $ = n(27365),
        j = n(93071);
      const X = (0, h.bind)(function (e) {
        const { value: t, onChange: n, input: o, tzName: r, hasTooltip: a } = e,
          { id: i, name: l, defval: c } = o,
          u = (0, s.useMemo)(() => Number(null != t ? t : c), [t, c]),
          d = (0, s.useMemo)(
            () => (0, $.getChartTimezoneOffsetMs)(u, r),
            [u, r]
          ),
          h = (0, s.useMemo)(() => {
            const e = new Date(u + d + v(u));
            return e.setSeconds(0), e;
          }, [u, d]),
          m = (0, s.useMemo)(
            () =>
              (0, Y.twoDigitsFormat)(h.getHours()) +
              ':' +
              (0, Y.twoDigitsFormat)(h.getMinutes()),
            [h]
          );
        return s.createElement(
          'div',
          { className: p()(j.container, a && j.hasTooltip) },
          s.createElement(
            'div',
            { className: j.datePickerWrapper },
            s.createElement(H.DatePicker, {
              InputComponent: K.DateInput,
              initial: h,
              onPick: function (e) {
                if (null === e) return;
                const t = new Date(h);
                t.setFullYear(e.getFullYear()),
                  t.setMonth(e.getMonth()),
                  t.setDate(e.getDate()),
                  n(g(t), i, l);
              },
              revertInvalidData: !0,
            })
          ),
          s.createElement(
            'div',
            { className: j.timePickerWrapper },
            s.createElement(w.TimeInput, {
              value: m,
              onChange: function (e) {
                const [t, o] = e.split(':'),
                  s = new Date(h);
                s.setHours(Number(t)), s.setMinutes(Number(o)), n(g(s), i, l);
              },
            })
          )
        );
        function v(e) {
          return 60 * new Date(e).getTimezoneOffset() * 1e3;
        }
        function g(e) {
          return e.valueOf() - d - v(u);
        }
      });
      class Q extends s.PureComponent {
        render() {
          const {
            input: e,
            disabled: t,
            onChange: n,
            tzName: o,
            hasTooltip: r,
          } = this.props;
          if ((0, a.isStudyInputOptionsInfo)(e))
            return s.createElement(B, {
              input: e,
              disabled: t,
              onChange: n,
              hasTooltip: r,
            });
          switch (e.type) {
            case 'integer':
              return s.createElement(i.IntegerInput, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              });
            case 'float':
            case 'price':
              return s.createElement(l.FloatInput, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              });
            case 'bool':
              return s.createElement(c.BoolInput, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              });
            case 'text':
              return s.createElement(b, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              });
            case 'symbol':
              return s.createElement(C.SymbolInput, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              });
            case 'session':
              return s.createElement(_, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              });
            case 'source':
              return s.createElement(O, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              });
            case 'resolution':
              return s.createElement(U, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              });
            case 'time':
              return s.createElement(X, {
                input: e,
                tzName: o,
                onChange: n,
                hasTooltip: r,
              });
            case 'color':
              return s.createElement(G, {
                input: e,
                disabled: t,
                onChange: n,
                hasTooltip: r,
              });
            default:
              return null;
          }
        }
      }
      var J = n(39847),
        ee = n(76694);
      class te extends s.PureComponent {
        render() {
          const {
              label: e,
              children: t,
              input: a,
              disabled: i,
              onChange: l,
              labelAlign: c,
              grouped: u,
              tooltip: p,
              solutionId: d,
              offset: h,
            } = this.props,
            m = Boolean(p);
          return s.createElement(
            y.PropertyTable.Row,
            null,
            s.createElement(
              y.PropertyTable.Cell,
              { placement: 'first', verticalAlign: c, grouped: u, offset: h },
              void 0 !== e
                ? e
                : o.t(
                    (0, r.ensureDefined)(a).name,
                    { context: 'input' },
                    n(88601)
                  )
            ),
            s.createElement(
              y.PropertyTable.Cell,
              { placement: 'last', grouped: u },
              t ||
                s.createElement(Q, {
                  input: (0, r.ensureDefined)(a),
                  onChange: l,
                  disabled: i,
                  hasTooltip: m,
                }),
              m &&
                s.createElement(
                  ee.IconGroupWrapper,
                  null,
                  p && s.createElement(J.InputTooltip, { title: p }),
                  !1
                )
            )
          );
        }
      }
    },
    39828: (e, t, n) => {
      'use strict';
      n.d(t, { InputsTabContent: () => A });
      var o,
        s = n(50959),
        r = n(50151),
        a = n(44352),
        i = n(76917),
        l = n(11062),
        c = n(57733),
        u = n(97754),
        p = n.n(u),
        d = n(88400),
        h = n.n(d);
      const m = (0, c.makeSwitchGroupItem)(
        (((o = class extends s.PureComponent {
          constructor() {
            super(...arguments),
              (this._onChange = () => {
                this.props.onChange && this.props.onChange(this.props.value);
              });
          }
          render() {
            const e = u(this.props.className, h().radio, {
                [h().reverse]: Boolean(this.props.labelPositionReverse),
              }),
              t = u(h().label, { [h().disabled]: this.props.disabled }),
              n = u(h().box, { [h().noOutline]: -1 === this.props.tabIndex });
            let o = null;
            return (
              this.props.label &&
                (o = s.createElement(
                  'span',
                  { className: t },
                  this.props.label
                )),
              s.createElement(
                'label',
                { className: e },
                s.createElement(
                  'span',
                  { className: h().wrapper, title: this.props.title },
                  s.createElement('input', {
                    id: this.props.id,
                    tabIndex: this.props.tabIndex,
                    autoFocus: this.props.autoFocus,
                    role: this.props.role,
                    className: h().input,
                    type: 'radio',
                    name: this.props.name,
                    checked: this.props.checked,
                    disabled: this.props.disabled,
                    value: this.props.value,
                    onChange: this._onChange,
                    ref: this.props.reference,
                    'aria-describedby': this.props['aria-describedby'],
                    'aria-invalid': this.props['aria-invalid'],
                  }),
                  s.createElement('span', { className: n })
                ),
                o
              )
            );
          }
        }).defaultProps = { value: 'on' }),
        o)
      );
      var v = n(55141),
        g = n(83207),
        f = n(39847),
        b = n(76694),
        C = n(27698);
      function y(e) {
        const {
            children: t,
            input: o,
            disabled: u,
            onChange: p,
            grouped: d,
            tooltip: h,
            solutionId: y,
          } = e,
          E = (0, s.useContext)(i.PropertyContext),
          { values: w, setValue: S } = (0, r.ensureNotNull)(E),
          x = w[o.id],
          [_, N] = (0, s.useState)(x ? 'another-symbol' : 'main-symbol'),
          [T, I] = (0, s.useState)(x),
          k = Boolean(h);
        return (
          (0, s.useEffect)(() => {
            x && I(x);
          }, [x]),
          s.createElement(
            c.SwitchGroup,
            {
              name: `symbol-source-${o.id}`,
              values: [_],
              onChange: function (e) {
                N(e),
                  'main-symbol' === e
                    ? (0, g.setter)(S)('', o.id, o.name)
                    : 'another-symbol' === e &&
                      T &&
                      (0, g.setter)(S, p)(T, o.id, o.name);
              },
            },
            s.createElement(
              l.PropertyTable.Row,
              null,
              s.createElement(
                l.PropertyTable.Cell,
                { colSpan: 2, placement: 'first', grouped: d },
                s.createElement(m, {
                  value: 'main-symbol',
                  className: C.checkbox,
                  disabled: u,
                  label: s.createElement(
                    'span',
                    { className: C.label },
                    a.t(null, { context: 'input' }, n(88046))
                  ),
                })
              )
            ),
            s.createElement(
              l.PropertyTable.Row,
              null,
              s.createElement(
                l.PropertyTable.Cell,
                { placement: 'first', grouped: d },
                s.createElement(m, {
                  value: 'another-symbol',
                  className: C.checkbox,
                  disabled: u,
                  label: s.createElement(
                    'span',
                    { className: C.label },
                    a.t(null, { context: 'input' }, n(73755))
                  ),
                })
              ),
              s.createElement(
                l.PropertyTable.Cell,
                { placement: 'last', grouped: d },
                t ||
                  s.createElement(v.SymbolInput, {
                    input: (0, r.ensureDefined)(o),
                    onChange: p,
                    disabled: u || 'main-symbol' === _,
                    hasTooltip: k,
                  }),
                k &&
                  s.createElement(
                    b.IconGroupWrapper,
                    null,
                    h && s.createElement(f.InputTooltip, { title: h }),
                    !1
                  )
              )
            )
          )
        );
      }
      var E = n(4781);
      class w extends s.PureComponent {
        render() {
          const { label: e, input: t, tooltip: n, solutionId: o } = this.props,
            r = Boolean(n);
          return s.createElement(
            l.PropertyTable.Row,
            null,
            s.createElement(
              l.PropertyTable.Cell,
              { placement: 'first', colSpan: 2 },
              s.createElement(E.BoolInput, {
                label: e,
                input: t,
                hasTooltip: r,
              }),
              r &&
                s.createElement(
                  b.IconGroupWrapper,
                  null,
                  n && s.createElement(f.InputTooltip, { title: n }),
                  !1
                )
            )
          );
        }
      }
      var S = n(12949),
        x = n(2568),
        _ = n(67029),
        N = n(90009);
      class T extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const {
                input: { id: t, name: n },
                onChange: o,
              } = this.props;
              o(e.currentTarget.value, t, n);
            });
        }
        render() {
          const {
            input: { defval: e },
            value: t,
            disabled: n,
            onBlur: o,
            onKeyDown: r,
          } = this.props;
          return s.createElement(x.Textarea, {
            className: p()(C.input, C.textarea, _.InputClasses.FontSizeMedium),
            value: void 0 === t ? e : t,
            onChange: this._onChange,
            onBlur: o,
            onKeyDown: r,
            disabled: n,
          });
        }
      }
      const I = (0, N.debounced)(T),
        k = (0, g.bind)(I);
      var P = n(80128);
      function B(e) {
        const { input: t, label: n, tooltip: o, solutionId: r } = e,
          a = Boolean(o);
        return s.createElement(
          l.PropertyTable.Row,
          null,
          s.createElement(
            l.PropertyTable.Cell,
            { placement: 'first', colSpan: 2, className: P.wrap },
            s.createElement(
              'div',
              { className: P.labelWrap },
              s.createElement(
                'span',
                { className: p()(P.label, a && P.hasTooltip) },
                n
              ),
              a &&
                s.createElement(
                  b.IconGroupWrapper,
                  null,
                  o &&
                    s.createElement(f.InputTooltip, {
                      title: o,
                    }),
                  !1
                )
            ),
            s.createElement(k, { input: t })
          )
        );
      }
      function D(e) {
        const { input: t, tooltip: o, solutionId: r } = e;
        return 'symbol' === t.type && t.optional
          ? s.createElement(y, { input: t, tooltip: o, solutionId: r })
          : 'bool' === t.type
          ? s.createElement(w, {
              label: a.t(t.name, { context: 'input' }, n(88601)),
              input: t,
              tooltip: o,
              solutionId: r,
            })
          : 'text_area' === t.type
          ? s.createElement(B, {
              label: a.t(t.name, { context: 'input' }, n(88601)),
              input: t,
              tooltip: o,
              solutionId: r,
            })
          : s.createElement(S.InputRow, {
              labelAlign: (function (e) {
                switch (e) {
                  case 'session':
                    return 'adaptive';
                  case 'time':
                    return 'topCenter';
                  default:
                    return;
                }
              })(t.type),
              input: t,
              tooltip: o,
              solutionId: r,
            });
      }
      var M = n(86067),
        V = n(17611);
      function O(e) {
        const { content: t } = e;
        let n;
        return s.createElement(
          l.PropertyTable.InlineRowContext.Provider,
          { value: !0 },
          s.createElement(
            'div',
            { className: V.inlineRow },
            t.children.map(
              (e, o) => (
                void 0 !== e.tooltip && (n = e.tooltip),
                s.createElement(D, {
                  key: e.id,
                  input: e,
                  tooltip: o === t.children.length - 1 ? n : void 0,
                })
              )
            )
          )
        );
      }
      var F = n(64420),
        R = n(26278);
      function L(e) {
        const { content: t } = e;
        return (0, F.isGroup)(t)
          ? (0, F.isInputInlines)(t)
            ? s.createElement(O, { content: t })
            : s.createElement(
                s.Fragment,
                null,
                s.createElement(
                  'div',
                  { className: R.titleWrap },
                  s.createElement(M.GroupTitleSection, {
                    title: a.t(t.id, { context: 'input' }, n(88601)),
                    name: t.id,
                  })
                ),
                t.children.map((e) =>
                  (0, F.isGroup)(e)
                    ? s.createElement(O, { key: e.id, content: e })
                    : s.createElement(D, {
                        key: e.id,
                        input: e,
                        tooltip: e.tooltip,
                        solutionId: e.solutionId,
                      })
                ),
                s.createElement('div', { className: R.groupFooter })
              )
          : s.createElement(D, {
              input: t,
              tooltip: t.tooltip,
              solutionId: t.solutionId,
            });
      }
      const W = { offset: a.t(null, void 0, n(89298)) };
      class A extends s.PureComponent {
        render() {
          const {
              reference: e,
              inputs: t,
              property: n,
              study: o,
              studyMetaInfo: a,
              model: i,
              onStudyInputChange: c,
              className: u,
            } = this.props,
            { offset: p, offsets: d } = n;
          return s.createElement(
            l.PropertyTable,
            { reference: e, className: u },
            s.createElement(q, {
              study: o,
              model: i,
              property: n.inputs,
              inputs: t,
              onStudyInputChange: c,
            }),
            p && this._createOffsetSection(p, (0, r.ensureDefined)(a.offset)),
            d &&
              d.childNames().map((e) => {
                var t;
                const n = d.childs()[e];
                return this._createOffsetSection(
                  n,
                  (0, r.ensureDefined)(
                    null === (t = a.offsets) || void 0 === t ? void 0 : t[e]
                  )
                );
              })
          );
        }
        _createOffsetSection(e, t) {
          const n = e.childs();
          return s.createElement(q, {
            key: `offset_${t.title}`,
            study: this.props.study,
            model: this.props.model,
            inputs: [U(n, t)],
            property: e,
          });
        }
      }
      function q(e) {
        const {
            study: t,
            model: n,
            inputs: o,
            property: r,
            onStudyInputChange: a,
          } = e,
          l = o,
          c = (0, s.useMemo)(() => (0, F.getInputGroups)(l), [l]);
        return s.createElement(
          i.PropertyContainer,
          { property: r, study: t, model: n, onStudyInputChange: a },
          !1,
          c.map((e) => s.createElement(L, { key: e.id, content: e }))
        );
      }
      function U(e, t) {
        return {
          id: 'val',
          name: t.title || W.offset,
          defval: e.val.value(),
          type: 'integer',
          min: t.min,
          max: t.max,
        };
      }
    },
    4781: (e, t, n) => {
      'use strict';
      n.d(t, { BoolInput: () => u, BoolInputComponent: () => c });
      var o = n(50959),
        s = n(15294),
        r = n(97754),
        a = n.n(r),
        i = n(83207),
        l = n(27698);
      class c extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = () => {
              const {
                input: { id: e, name: t },
                value: n,
                onChange: o,
              } = this.props;
              o(!n, e, t);
            });
        }
        render() {
          const {
              input: { defval: e },
              value: t,
              disabled: n,
              label: r,
              hasTooltip: i,
            } = this.props,
            c = void 0 === t ? e : t;
          return o.createElement(s.Checkbox, {
            className: a()(l.checkbox, i && l.hasTooltip),
            disabled: n,
            checked: c,
            onChange: this._onChange,
            label: o.createElement('span', { className: l.label }, r),
            labelAlignBaseline: !0,
          });
        }
      }
      const u = (0, i.bind)(c);
    },
    90009: (e, t, n) => {
      'use strict';
      n.d(t, { debounced: () => r });
      var o = n(50959);
      const s = { blur: 0, commit: 0, change: 1 / 0 };
      function r(e, t = s) {
        return class extends o.PureComponent {
          constructor(e) {
            super(e),
              (this._onChange = (e, n, o) => {
                const s = t.change;
                s
                  ? (clearTimeout(this._timeout),
                    this.setState({ value: e }, () => {
                      s !== 1 / 0 &&
                        (this._timeout = setTimeout(() => this._flush(), s));
                    }))
                  : this._flush(e);
              }),
              (this._onBlur = () => {
                this._debounce(t.blur);
                const { onBlur: e } = this.props;
                e && e();
              }),
              (this._onKeyDown = (e) => {
                13 === e.keyCode && this._debounce(t.commit);
              }),
              (this.state = { prevValue: e.value, value: e.value });
          }
          componentWillUnmount() {
            this._flush();
          }
          render() {
            const { value: t } = this.state;
            return o.createElement(e, {
              ...this.props,
              value: t,
              onChange: this._onChange,
              onBlur: this._onBlur,
              onKeyDown: this._onKeyDown,
            });
          }
          static getDerivedStateFromProps(e, t) {
            return e.value === t.prevValue
              ? t
              : { prevValue: e.value, value: e.value };
          }
          _debounce(e) {
            e
              ? (clearTimeout(this._timeout),
                e !== 1 / 0 &&
                  (this._timeout = setTimeout(() => this._flush(), e)))
              : this.setState((e) => {
                  this._flush(e.value);
                });
          }
          _flush(e) {
            const {
                input: { id: t, name: n },
                onChange: o,
              } = this.props,
              { prevValue: s, value: r } = this.state;
            clearTimeout(this._timeout);
            const a = void 0 !== e ? e : r;
            void 0 !== a && a !== s && o(a, t, n);
          }
        };
      }
    },
    47510: (e, t, n) => {
      'use strict';
      n.d(t, { FloatInput: () => d, FloatInputComponent: () => p });
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        a = n(95052),
        i = n(83207),
        l = n(90009),
        c = n(27698);
      class u extends o.PureComponent {
        render() {
          const { hasTooltip: e } = this.props;
          return o.createElement(a.NumericInput, {
            ...this.props,
            className: r()(c.input, e && c.hasTooltip),
            stretch: !1,
          });
        }
      }
      const p = (0, l.debounced)(u, { change: 1 / 0, commit: 0, blur: 0 }),
        d = (0, i.bind)(p);
    },
    96438: (e, t, n) => {
      'use strict';
      n.d(t, { IntegerInput: () => d, IntegerInputComponent: () => p });
      var o = n(50959),
        s = n(97754),
        r = n.n(s),
        a = n(83207),
        i = n(90009),
        l = n(95052),
        c = n(27698);
      class u extends o.PureComponent {
        render() {
          const { hasTooltip: e } = this.props;
          return o.createElement(l.NumericInput, {
            ...this.props,
            mode: 'integer',
            className: r()(c.input, e && c.hasTooltip),
            stretch: !1,
          });
        }
      }
      const p = (0, i.debounced)(u, { change: 1 / 0, commit: 0, blur: 0 }),
        d = (0, a.bind)(p);
    },
    95052: (e, t, n) => {
      'use strict';
      n.d(t, { NumericInput: () => y });
      var o = n(50959),
        s = n(50151),
        r = n(44352),
        a = n(60521),
        i = n(49483),
        l = n(92399),
        c = n(82161),
        u = n(38223);
      var p = n(87663),
        d = n(37160);
      const h = r.t(null, void 0, n(35563)),
        m = new (class {
          constructor(e = ' ') {
            this._divider = e;
          }
          format(e) {
            const t = (0, c.splitThousands)(e, this._divider);
            return (0, u.isRtl)() ? (0, u.startWithLTR)(t) : t;
          }
          parse(e) {
            const t = (0, u.stripLTRMarks)(e).split(this._divider).join(''),
              n = Number(t);
            return isNaN(n) || /e/i.test(t)
              ? { res: !1 }
              : { res: !0, value: n, suggest: this.format(n) };
          }
        })(),
        v = /^-?[0-9]*$/,
        g = 9e15;
      class f extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._onFocus = (e) => {
              this.setState({ focused: !0 }),
                this.props.onFocus && this.props.onFocus(e);
            }),
            (this._onBlur = (e) => {
              this.setState({ focused: !1 }),
                !1 !== this.props.shouldApplyValueOnBlur &&
                  (this.setState({
                    displayValue: b(this.props, this.props.value),
                  }),
                  this.props.errorHandler && this.props.errorHandler(!1)),
                this.props.onBlur && this.props.onBlur(e);
            }),
            (this._onValueChange = (e) => {
              const t = e.target.value;
              if (
                (void 0 !== this.props.onEmptyString &&
                  '' === t &&
                  this.props.onEmptyString(),
                'integer' === this.props.mode && !v.test(t))
              )
                return;
              const n = C(t, this.props.formatter),
                o = n.res
                  ? this._checkValueBoundaries(n.value)
                  : { isPassed: !1, msg: void 0 },
                s = n.res && !o.isPassed,
                r = n.res && n.suggest && !this.state.focused ? n.suggest : t,
                a = s && o.msg ? o.msg : h;
              this.setState({ displayValue: r, errorMsg: a }),
                n.res &&
                  o.isPassed &&
                  this.props.onValueChange(n.value, 'input'),
                this.props.errorHandler && this.props.errorHandler(!n.res || s);
            }),
            (this._onValueByStepChange = (e) => {
              const {
                  roundByStep: t = !0,
                  step: n = 1,
                  uiStep: o,
                  min: s = n,
                  formatter: r,
                } = this.props,
                i = C(this.state.displayValue, r),
                l = null != o ? o : n;
              let c = n;
              if (i.res) {
                const o = new a.Big(i.value),
                  r = o.minus(s).mod(n);
                let u = o.plus(e * l);
                !r.eq(0) && t && (u = u.plus((e > 0 ? 0 : 1) * l).minus(r)),
                  (c = u.toNumber());
              }
              const { isPassed: u, clampedValue: p } =
                this._checkValueBoundaries(c);
              (c = u ? c : p),
                this.setState({ displayValue: b(this.props, c) }),
                this.props.onValueChange(c, 'step'),
                this.props.errorHandler && this.props.errorHandler(!1);
            });
          const { value: t } = e;
          this.state = {
            value: t,
            displayValue: b(e, t),
            focused: !1,
            errorMsg: h,
          };
        }
        render() {
          var e;
          return o.createElement(l.NumberInputView, {
            id: this.props.id,
            inputMode:
              null !== (e = this.props.inputMode) && void 0 !== e
                ? e
                : i.CheckMobile.iOS()
                ? void 0
                : 'numeric',
            borderStyle: this.props.borderStyle,
            fontSizeStyle: this.props.fontSizeStyle,
            value: this.state.displayValue,
            forceShowControls: this.props.forceShowControls,
            className: this.props.className,
            inputClassName: this.props.inputClassName,
            button: this.props.button,
            placeholder: this.props.placeholder,
            innerLabel: this.props.innerLabel,
            endSlot: this.props.endSlot,
            disabled: this.props.disabled,
            warning: this.props.warning,
            error: this.props.error,
            errorMessage: this.props.errorMessage || this.state.errorMsg,
            onValueChange: this._onValueChange,
            onValueByStepChange: this._onValueByStepChange,
            containerReference: this.props.containerReference,
            inputReference: this.props.inputReference,
            onClick: this.props.onClick,
            onFocus: this._onFocus,
            onBlur: this._onBlur,
            onKeyDown: this.props.onKeyDown,
            controlDecKeyCodes: this.props.controlDecKeyCodes,
            controlIncKeyCodes: this.props.controlIncKeyCodes,
            title: this.props.title,
            intent: this.props.intent,
            highlight: this.props.highlight,
            highlightRemoveRoundBorder: this.props.highlightRemoveRoundBorder,
            stretch: this.props.stretch,
            autoSelectOnFocus: !i.CheckMobile.any(),
            'data-name': this.props['data-name'],
          });
        }
        getClampedValue() {
          const { min: e = -1 / 0, max: t = g } = this.props,
            n = C(this.state.displayValue, this.props.formatter);
          return n.res ? (0, d.clamp)(n.value, e, t) : null;
        }
        static getDerivedStateFromProps(e, t) {
          const { alwaysUpdateValueFromProps: n, value: o } = e;
          return (t.focused && !n) || t.value === o
            ? null
            : { value: o, displayValue: b(e, o) };
        }
        _checkValueBoundaries(e) {
          var t, o, s, a;
          const { min: i = -1 / 0, max: l = g } = this.props,
            c = (function (e, t, n) {
              const o = e >= t,
                s = e <= n;
              return {
                passMin: o,
                passMax: s,
                pass: o && s,
                clamped: (0, d.clamp)(e, t, n),
              };
            })(e, i, l);
          let u;
          return (
            c.passMax ||
              (u =
                null !==
                  (o =
                    null === (t = this.props.boundariesErrorMessages) ||
                    void 0 === t
                      ? void 0
                      : t.greaterThanMax) && void 0 !== o
                  ? o
                  : r.t(null, { replace: { max: String(l) } }, n(2607))),
            c.passMin ||
              (u =
                null !==
                  (a =
                    null === (s = this.props.boundariesErrorMessages) ||
                    void 0 === s
                      ? void 0
                      : s.lessThanMin) && void 0 !== a
                  ? a
                  : r.t(null, { replace: { min: String(i) } }, n(53669))),
            { isPassed: c.pass, msg: u, clampedValue: c.clamped }
          );
        }
      }
      function b(e, t) {
        const { useFormatter: n = !0, formatter: o, mode: s } = e;
        return n && 'integer' !== s
          ? (function (e, t = m) {
              return null !== e ? t.format(e) : '';
            })(t, o)
          : (function (e) {
              if (null === e) return '';
              return p.NumericFormatter.formatNoE(e);
            })(t);
      }
      function C(e, t = m) {
        return t.parse
          ? t.parse(e)
          : { res: !1, error: 'Formatter does not support parse' };
      }
      class y extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._container = null),
            (this._handleContainerRef = (e) => (this._container = e)),
            (this._onChange = (e, t) => {
              const {
                input: { id: n, name: o },
                onChange: s,
                onBlur: r,
              } = this.props;
              s(e, n, o), 'step' === t && r && r();
            }),
            (this._onBlur = (e) => {
              const { onBlur: t } = this.props;
              if (t) {
                const n = (0, s.ensureNotNull)(this._container);
                n.contains(document.activeElement) ||
                  n.contains(e.relatedTarget) ||
                  t();
              }
            });
        }
        render() {
          const {
            input: { defval: e, min: t, max: n, step: s },
            value: r,
            disabled: a,
            onKeyDown: i,
            className: l,
            mode: c,
            stretch: u,
          } = this.props;
          return o.createElement(f, {
            className: l,
            value: Number(void 0 === r ? e : r),
            min: t,
            max: n,
            step: s,
            mode: c,
            onBlur: this._onBlur,
            onValueChange: this._onChange,
            onKeyDown: i,
            disabled: a,
            containerReference: this._handleContainerRef,
            fontSizeStyle: 'medium',
            roundByStep: !1,
            stretch: u,
          });
        }
      }
    },
    55141: (e, t, n) => {
      'use strict';
      n.d(t, { SymbolInput: () => p, getInternalSymbolName: () => c });
      var o = n(50959),
        s = n(50151),
        r = n(76917),
        a = n(83207),
        i = n(73146),
        l = n(48897);
      function c(e, t) {
        const n = (0, i.createAdapter)(t).resolvedSymbolInfoBySymbol(e);
        return n && (n.ticker || n.full_name) ? n.ticker || n.full_name : e;
      }
      function u(e, t) {
        const n = (0, i.createAdapter)(t).resolvedSymbolInfoBySymbol(e);
        return null === n ? e : n.name;
      }
      const p = (0, a.bind)(function (e) {
        const t = (0, o.useContext)(r.PropertyContext),
          { study: n } = (0, s.ensureNotNull)(t),
          {
            input: { defval: a },
            value: i,
          } = e;
        return o.createElement(l.SymbolInputsButton, {
          ...e,
          value: u(i || a || '', n),
          study: n,
        });
      });
    },
    41552: (e, t, n) => {
      'use strict';
      n.d(t, { ColorWithThicknessSelect: () => g });
      var o = n(50959),
        s = n(24377),
        r = n(44352),
        a = n(36298),
        i = n(87095),
        l = n(41594),
        c = n(58593),
        u = n(17948),
        p = n(51768);
      const d = new a.TranslatedString(
          'change thickness',
          r.t(null, void 0, n(95657))
        ),
        h = new a.TranslatedString('change color', r.t(null, void 0, n(13066))),
        m = new a.TranslatedString(
          'change opacity',
          r.t(null, void 0, n(17023))
        ),
        v = [1, 2, 3, 4];
      class g extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._trackEventLabel = null),
            (this._getTransparencyValue = () => {
              const { transparency: e } = this.props;
              return e ? e.value() : 0;
            }),
            (this._getOpacityValue = () => {
              const { color: e } = this.props,
                t = (0, u.getPropertyValue)(e);
              if (t)
                return (0, i.isHexColor)(t)
                  ? (0, i.transparencyToAlpha)(this._getTransparencyValue())
                  : (0, s.parseRgba)(t)[3];
            }),
            (this._getColorValueInHex = () => {
              const { color: e } = this.props,
                t = (0, u.getPropertyValue)(e);
              return t
                ? (0, i.isHexColor)(t)
                  ? t
                  : (0, s.rgbToHexString)((0, s.parseRgb)(t))
                : null;
            }),
            (this._onThicknessChange = (e) => {
              const { thickness: t } = this.props;
              void 0 !== t && this._setProperty(t, e, d);
            }),
            (this._onColorChange = (e) => {
              const { color: t, isPaletteColor: n } = this.props,
                o = (0, u.getPropertyValue)(t);
              let r = 0;
              o &&
                (r = (0, i.isHexColor)(o)
                  ? this._getTransparencyValue()
                  : (0, i.alphaToTransparency)((0, s.parseRgba)(o)[3])),
                this._setProperty(t, (0, i.generateColor)(String(e), r, !0), h),
                (this._trackEventLabel =
                  'Plot color > ' + (n ? 'Palette' : 'Single'));
            }),
            (this._onOpacityChange = (e) => {
              const { color: t } = this.props,
                n = (0, u.getPropertyValue)(t);
              this._setProperty(
                t,
                (0, i.generateColor)(n, (0, i.alphaToTransparency)(e), !0),
                m
              );
            }),
            (this._onPopupClose = () => {
              this._trackEventLabel &&
                ((0, p.trackEvent)(
                  'GUI',
                  'Study settings',
                  this._trackEventLabel
                ),
                (this._trackEventLabel = null));
            });
        }
        componentWillUnmount() {
          this._onPopupClose();
        }
        render() {
          const {
            selectOpacity: e = !0,
            disabled: t,
            className: n,
          } = this.props;
          return o.createElement(c.ColorSelect, {
            className: n,
            disabled: t,
            color: this._getColorValueInHex(),
            selectOpacity: e,
            opacity: this._getOpacityValue(),
            thickness: this._getThicknessValue(),
            thicknessItems: v,
            onColorChange: this._onColorChange,
            onOpacityChange: this._onOpacityChange,
            onThicknessChange: this._onThicknessChange,
            onPopupClose: this._onPopupClose,
          });
        }
        _getThicknessValue() {
          const { thickness: e } = this.props;
          return e ? (0, u.getPropertyValue)(e) : void 0;
        }
        _setProperty(e, t, n) {
          const { setValue: o } = this.context;
          (0, u.setPropertyValue)(e, (e) => o(e, t, n));
        }
      }
      g.contextType = l.StylePropertyContext;
    },
    11062: (e, t, n) => {
      'use strict';
      n.d(t, { PropertyTable: () => l });
      var o = n(50959),
        s = n(97754),
        r = n(90186),
        a = n(24712);
      const i = o.createContext(!1);
      class l extends o.PureComponent {
        render() {
          return o.createElement(
            'div',
            {
              ref: this.props.reference,
              className: s(a.content, this.props.className),
            },
            this.props.children
          );
        }
      }
      (l.InlineRowContext = i),
        (l.Row = function (e) {
          const { children: t } = e;
          return (0, o.useContext)(i)
            ? o.createElement('span', { className: a.inlineRow }, t)
            : o.createElement(o.Fragment, null, t);
        }),
        (l.Cell = function (e) {
          const t = (0, o.useContext)(i),
            n = s(
              a.cell,
              e.offset && a.offset,
              e.grouped && a.grouped,
              t && a.inlineCell,
              'top' === e.verticalAlign && a.top,
              'topCenter' === e.verticalAlign && a.topCenter,
              'adaptive' === e.verticalAlign && a.adaptive,
              e.checkableTitle && a.checkableTitle,
              2 === e.colSpan && a.fill,
              'first' === e.placement && 2 !== e.colSpan && a.first,
              'last' === e.placement && 2 !== e.colSpan && a.last
            ),
            l = (0, r.filterDataProps)(e);
          return o.createElement(
            'div',
            { ...l, className: n },
            o.createElement(
              'div',
              { className: s(a.inner, e.className) },
              e.children
            )
          );
        }),
        (l.Separator = function (e) {
          return o.createElement(
            l.Row,
            null,
            o.createElement('div', {
              className: s(a.cell, a.separator, a.fill),
            })
          );
        }),
        (l.GroupSeparator = function (e) {
          const t = e.size || 0;
          return o.createElement(
            l.Row,
            null,
            o.createElement('div', {
              className: s(a.cell, a.groupSeparator, a.fill, 1 === t && a.big),
            })
          );
        });
    },
    17948: (e, t, n) => {
      'use strict';
      function o(e) {
        return Array.isArray(e) ? e[0].value() : e.value();
      }
      function s(e, t) {
        if (Array.isArray(e)) for (const n of e) t(n);
        else t(e);
      }
      n.d(t, { getPropertyValue: () => o, setPropertyValue: () => s });
    },
    99084: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm3.87-12.15c.36.2.49.66.28 1.02l-4 7a.75.75 0 0 1-1.18.16l-3-3a.75.75 0 1 1 1.06-1.06l2.3 2.3 3.52-6.14a.75.75 0 0 1 1.02-.28Z"/></svg>';
    },
    30162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM9 4c-.79 0-1.38.7-1.25 1.48l.67 4.03a.59.59 0 0 0 1.16 0l.67-4.03A1.27 1.27 0 0 0 9 4Zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>';
    },
    27941: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM8 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm1 2c.49 0 1 .59 1 1v3.01c0 .42-.51.99-1 .99s-1-.57-1-.99V9c0-.41.51-1 1-1Z"/></svg>';
    },
    82353: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM6 7.5a3 3 0 1 1 6 0c0 .96-.6 1.48-1.17 1.98-.55.48-1.08.95-1.08 1.77h-1.5c0-1.37.7-1.9 1.33-2.38.49-.38.92-.71.92-1.37C10.5 6.67 9.82 6 9 6s-1.5.67-1.5 1.5H6Z"/></svg>';
    },
    65890: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>';
    },
    93929: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M13.5 7l1.65-1.65a.5.5 0 0 0 0-.7l-1.8-1.8a.5.5 0 0 0-.7 0L11 4.5M13.5 7L11 4.5M13.5 7l-8.35 8.35a.5.5 0 0 1-.36.15H2.5v-2.3a.5.5 0 0 1 .15-.35L11 4.5"/></svg>';
    },
  },
]);
