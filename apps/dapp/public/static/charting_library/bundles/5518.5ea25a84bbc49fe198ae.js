'use strict';
(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5518],
  {
    73955: (e, t, r) => {
      r.r(t), r.d(t, { createPropertyPage: () => n });
      var i = r(58275),
        o = r.n(i);
      function n(e, t, r, i = null) {
        var n;
        const s = {
          id: t,
          title: r,
          definitions: new (o())(e.definitions),
          visible:
            null !== (n = e.visible) && void 0 !== n
              ? n
              : new (o())(!0).readonly(),
        };
        return null !== i && (s.icon = i), s;
      }
    },
    20345: (e, t, r) => {
      r.d(t, {
        convertToInt: () => n,
        floor: () => o,
        limitedPrecision: () => s,
      });
      var i = r(10786);
      function o(e) {
        return Math.floor(e);
      }
      function n(e) {
        return parseInt(String(e));
      }
      function s(e) {
        const t = new i.LimitedPrecisionNumericFormatter(e);
        return (e) => {
          if (null === e) return e;
          const r = t.parse(t.format(e));
          return r.res ? r.value : null;
        };
      }
    },
    3347: (e, t, r) => {
      r.d(t, {
        convertToDefinitionProperty: () => s,
        makeProxyDefinitionProperty: () => o,
        makeProxyDefinitionPropertyDestroyable: () => n,
      });
      var i = r(51768);
      function o(e, t, r) {
        const i = new Map(),
          o = void 0 !== t ? t[0] : (e) => e,
          n = void 0 !== t ? (void 0 !== t[1] ? t[1] : t[0]) : (e) => e,
          s = {
            value: () => o(e.value()),
            setValue: (t) => {
              e.setValue(n(t));
            },
            subscribe: (t, r) => {
              const o = (e) => {
                r(s);
              };
              i.set(r, o), e.subscribe(t, o);
            },
            unsubscribe: (t, r) => {
              const o = i.get(r);
              o && (e.unsubscribe(t, o), i.delete(r));
            },
            unsubscribeAll: (t) => {
              e.unsubscribeAll(t), i.clear();
            },
            destroy: () => {
              null == r || r();
            },
          };
        return s;
      }
      function n(e) {
        const t = o(e);
        return (
          (t.destroy = () => {
            e.destroy();
          }),
          t
        );
      }
      function s(e, t, r, n, s, l, p) {
        const u = o(t, n, l),
          c = void 0 !== n ? (void 0 !== n[1] ? n[1] : n[0]) : (e) => e,
          a = null != s ? s : (i) => e.setProperty(t, c(i), r);
        return (
          (u.setValue = (e) => {
            var t;
            p &&
              (0, i.trackEvent)(
                p.category,
                p.event,
                null === (t = p.label) || void 0 === t ? void 0 : t.call(p, e)
              ),
              a(e);
          }),
          u
        );
      }
    },
    28985: (e, t, r) => {
      function i(e, t) {
        return { propType: 'checkable', properties: e, ...t };
      }
      function o(e, t, r) {
        return {
          propType: 'checkableSet',
          properties: e,
          childrenDefinitions: r,
          ...t,
        };
      }
      function n(e, t) {
        return { propType: 'color', properties: e, noAlpha: !1, ...t };
      }
      r.d(t, {
        convertFromReadonlyWVToDefinitionProperty: () => F,
        convertFromWVToDefinitionProperty: () => j,
        convertToDefinitionProperty: () => R.convertToDefinitionProperty,
        createCheckablePropertyDefinition: () => i,
        createCheckableSetPropertyDefinition: () => o,
        createColorPropertyDefinition: () => n,
        createCoordinatesPropertyDefinition: () => k,
        createEmojiPropertyDefinition: () => M,
        createLeveledLinePropertyDefinition: () => y,
        createLinePropertyDefinition: () => a,
        createNumberPropertyDefinition: () => v,
        createOptionalTwoColorsPropertyDefinition: () => V,
        createOptionsPropertyDefinition: () => b,
        createPropertyDefinitionsGeneralGroup: () => W,
        createPropertyDefinitionsLeveledLinesGroup: () => Y,
        createRangePropertyDefinition: () => x,
        createSelectionCoordinatesPropertyDefinition: () => C,
        createSessionPropertyDefinition: () => z,
        createStudyInputsPropertyDefinition: () => N,
        createSymbolPropertyDefinition: () => O,
        createTextPropertyDefinition: () => L,
        createTransparencyPropertyDefinition: () => A,
        createTwoColorsPropertyDefinition: () => I,
        createTwoOptionsPropertyDefinition: () => P,
        destroyDefinitions: () => te,
        getColorDefinitionProperty: () => Z,
        getLockPriceScaleDefinitionProperty: () => q,
        getPriceScaleSelectionStrategyDefinitionProperty: () => U,
        getScaleRatioDefinitionProperty: () => B,
        getSymbolDefinitionProperty: () => $,
        isPropertyDefinitionsGroup: () => ee,
        makeProxyDefinitionProperty: () => R.makeProxyDefinitionProperty,
      });
      var s = r(73436),
        l = r(79849);
      const p = [l.LINESTYLE_SOLID, l.LINESTYLE_DOTTED, l.LINESTYLE_DASHED],
        u = [1, 2, 3, 4],
        c = [s.LineEnd.Normal, s.LineEnd.Arrow];
      function a(e, t) {
        const r = { propType: 'line', properties: e, ...t };
        return (
          void 0 !== r.properties.style && (r.styleValues = p),
          void 0 !== r.properties.width && (r.widthValues = u),
          (void 0 === r.properties.leftEnd &&
            void 0 === r.properties.rightEnd) ||
            void 0 !== r.endsValues ||
            (r.endsValues = c),
          void 0 !== r.properties.value &&
            void 0 === r.valueType &&
            (r.valueType = 1),
          r
        );
      }
      const d = [l.LINESTYLE_SOLID, l.LINESTYLE_DOTTED, l.LINESTYLE_DASHED],
        f = [1, 2, 3, 4];
      function y(e, t) {
        const r = { propType: 'leveledLine', properties: e, ...t };
        return (
          void 0 !== r.properties.style && (r.styleValues = d),
          void 0 !== r.properties.width && (r.widthValues = f),
          r
        );
      }
      function v(e, t) {
        return { propType: 'number', properties: e, type: 1, ...t };
      }
      function b(e, t) {
        return { propType: 'options', properties: e, ...t };
      }
      function P(e, t) {
        return { propType: 'twoOptions', properties: e, ...t };
      }
      var D = r(44352);
      const m = [
          { id: 'bottom', value: 'bottom', title: D.t(null, void 0, r(65994)) },
          { id: 'middle', value: 'middle', title: D.t(null, void 0, r(76476)) },
          { id: 'top', value: 'top', title: D.t(null, void 0, r(91757)) },
        ],
        T = [
          { id: 'left', value: 'left', title: D.t(null, void 0, r(19286)) },
          { id: 'center', value: 'center', title: D.t(null, void 0, r(72171)) },
          { id: 'right', value: 'right', title: D.t(null, void 0, r(21141)) },
        ],
        g = [
          {
            id: 'horizontal',
            value: 'horizontal',
            title: D.t(null, void 0, r(77405)),
          },
          {
            id: 'vertical',
            value: 'vertical',
            title: D.t(null, void 0, r(44085)),
          },
        ],
        h = [10, 11, 12, 14, 16, 20, 24, 28, 32, 40].map((e) => ({
          title: String(e),
          value: e,
        })),
        S = [1, 2, 3, 4],
        E = D.t(null, void 0, r(92960)),
        w = D.t(null, void 0, r(90581));
      function L(e, t) {
        const r = {
          propType: 'text',
          properties: e,
          ...t,
          isEditable: t.isEditable || !1,
        };
        return (
          void 0 !== r.properties.size &&
            void 0 === r.sizeItems &&
            (r.sizeItems = h),
          void 0 !== r.properties.alignmentVertical &&
            void 0 === r.alignmentVerticalItems &&
            (r.alignmentVerticalItems = m),
          void 0 !== r.properties.alignmentHorizontal &&
            void 0 === r.alignmentHorizontalItems &&
            (r.alignmentHorizontalItems = T),
          (r.alignmentVerticalItems || r.alignmentHorizontalItems) &&
            void 0 === r.alignmentTitle &&
            (r.alignmentTitle = E),
          void 0 !== r.properties.orientation &&
            (void 0 === r.orientationItems && (r.orientationItems = g),
            void 0 === r.orientationTitle && (r.orientationTitle = w)),
          void 0 !== r.properties.borderWidth &&
            void 0 === r.borderWidthItems &&
            (r.borderWidthItems = S),
          r
        );
      }
      function I(e, t) {
        return {
          propType: 'twoColors',
          properties: e,
          noAlpha1: !1,
          noAlpha2: !1,
          ...t,
        };
      }
      function V(e, t) {
        return {
          propType: 'optionalTwoColors',
          properties: e,
          noAlpha1: !1,
          noAlpha2: !1,
          ...t,
        };
      }
      function k(e, t) {
        return { propType: 'coordinates', properties: e, ...t };
      }
      function C(e, t) {
        return { propType: 'selectionCoordinates', properties: e, ...t };
      }
      function x(e, t) {
        return { propType: 'range', properties: e, ...t };
      }
      function A(e, t) {
        return { propType: 'transparency', properties: e, ...t };
      }
      function O(e, t) {
        return { propType: 'symbol', properties: e, ...t };
      }
      function z(e, t) {
        return { propType: 'session', properties: e, ...t };
      }
      function M(e, t) {
        return { propType: 'emoji', properties: e, ...t };
      }
      function N(e, t) {
        return { propType: 'studyInputs', properties: e, ...t };
      }
      var H = r(58275),
        _ = r.n(H);
      function W(e, t, r, i) {
        return {
          id: t,
          title: r,
          visible: i,
          groupType: 'general',
          definitions: new (_())(e),
        };
      }
      function Y(e, t, r) {
        return {
          id: t,
          title: r,
          groupType: 'leveledLines',
          definitions: new (_())(e),
        };
      }
      var R = r(3347);
      function G(e, t) {
        const r = new Map(),
          i = void 0 !== t ? t[0] : (e) => e,
          o = void 0 !== t ? (void 0 !== t[1] ? t[1] : t[0]) : (e) => e,
          n = {
            value: () => i(e.value()),
            setValue: (t) => {
              var r;
              null === (r = e.setValue) || void 0 === r || r.call(e, o(t));
            },
            subscribe: (t, i) => {
              const o = () => {
                i(n);
              };
              let s = r.get(t);
              void 0 === s
                ? ((s = new Map()), s.set(i, o), r.set(t, s))
                : s.set(i, o),
                e.subscribe(o);
            },
            unsubscribe: (t, i) => {
              const o = r.get(t);
              if (void 0 !== o) {
                const t = o.get(i);
                void 0 !== t && (e.unsubscribe(t), o.delete(i));
              }
            },
            unsubscribeAll: (t) => {
              const i = r.get(t);
              void 0 !== i &&
                (i.forEach((t, r) => {
                  e.unsubscribe(t);
                }),
                i.clear());
            },
          };
        return n;
      }
      function j(e, t, r, i) {
        const o = G(t, i),
          n = void 0 !== i ? (void 0 !== i[1] ? i[1] : i[0]) : (e) => e;
        return (o.setValue = (i) => e.setWatchedValue(t, n(i), r)), o;
      }
      function F(e, t) {
        return (function (e, t, r) {
          const i = new Map();
          return G(
            {
              subscribe: (r, o) => {
                const n = (e) => r(t(e));
                i.set(r, n), e.subscribe(n, o);
              },
              unsubscribe: (t) => {
                if (t) {
                  const r = i.get(t);
                  r && (e.unsubscribe(r), i.delete(t));
                } else i.clear(), e.unsubscribe();
              },
              value: () => t(e.value()),
            },
            r
          );
        })(e, (e) => e, t);
      }
      function U(e, t) {
        const r = (0, R.makeProxyDefinitionProperty)(t);
        return (r.setValue = (t) => e.setPriceScaleSelectionStrategy(t)), r;
      }
      function q(e, t, r, i) {
        const o = (0, R.makeProxyDefinitionProperty)(t);
        return (
          (o.setValue = (t) => {
            const o = { lockScale: t };
            e.setPriceScaleMode(o, r, i);
          }),
          o
        );
      }
      function B(e, t, r, i) {
        const o = (0, R.makeProxyDefinitionProperty)(t, i);
        return (
          (o.setValue = (i) => {
            e.setScaleRatioProperty(t, i, r);
          }),
          o
        );
      }
      var J = r(24377),
        K = r(87095),
        Q = r(79861);
      function X(e, t) {
        if ((0, K.isHexColor)(e)) {
          const r = (0, J.parseRgb)(e);
          return (0, J.rgbaToString)((0, J.rgba)(r, (100 - t) / 100));
        }
        return e;
      }
      function Z(e, t, r, i, o) {
        let n;
        if (null !== r) {
          const e = (0, Q.combineProperty)(X, t, r);
          n = (0, R.makeProxyDefinitionPropertyDestroyable)(e);
        } else
          n = (0, R.makeProxyDefinitionProperty)(t, [
            () => X(t.value(), 0),
            (e) => e,
          ]);
        return (
          (n.setValue = (r) => {
            o && e.beginUndoMacro(i),
              e.setProperty(t, r, i),
              o && e.endUndoMacro();
          }),
          n
        );
      }
      function $(e, t, r, i, o, n) {
        const s = [
          ((l = r),
          (p = t),
          (e) => {
            const t = l(p);
            if (e === p.value() && null !== t) {
              const e = t.ticker || t.full_name;
              if (e) return e;
            }
            return e;
          }),
          (e) => e,
        ];
        var l, p;
        const u = (0, R.convertToDefinitionProperty)(e, t, o, s);
        n && (u.setValue = n);
        const c = new Map();
        (u.subscribe = (e, r) => {
          const i = (e) => {
            r(u);
          };
          c.set(r, i), t.subscribe(e, i);
        }),
          (u.unsubscribe = (e, r) => {
            const i = c.get(r);
            i && (t.unsubscribe(e, i), c.delete(r));
          });
        const a = {};
        return (
          i.subscribe(a, () => {
            c.forEach((e, t) => {
              t(u);
            });
          }),
          (u.destroy = () => {
            i.unsubscribeAll(a), c.clear();
          }),
          u
        );
      }
      function ee(e) {
        return e.hasOwnProperty('groupType');
      }
      function te(e) {
        e.forEach((e) => {
          if (e.hasOwnProperty('propType')) {
            Object.keys(e.properties).forEach((t) => {
              const r = e.properties[t];
              void 0 !== r && void 0 !== r.destroy && r.destroy();
            });
          } else te(e.definitions.value());
        });
      }
    },
  },
]);
