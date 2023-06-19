'use strict';
(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8537],
  {
    86778: (e, t, i) => {
      i.d(t, { getLinesStylesPropertiesDefinitions: () => y });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(28985),
        s = i(94474);
      const a = new n.TranslatedString(
          'change {title} price label visibility',
          o.t(null, void 0, i(45936))
        ),
        c = new n.TranslatedString(
          'change {title} extension',
          o.t(null, void 0, i(86647))
        ),
        p = new n.TranslatedString(
          'change {title} time label visibility',
          o.t(null, void 0, i(33822))
        ),
        d = o.t(null, void 0, i(23675)),
        u = o.t(null, void 0, i(55325)),
        h = o.t(null, void 0, i(1220));
      function y(e, t, i) {
        const o = (0, s.removeSpaces)(i.originalText()),
          n = [],
          y = (0, r.createLineStyleDefinition)(
            e,
            {
              lineColor: t.linecolor,
              lineWidth: t.linewidth,
              lineStyle: t.linestyle,
            },
            i,
            'Line'
          );
        if ((n.push(y), 'showPrice' in t)) {
          const r = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.showPrice,
                a.format({ title: i })
              ),
            },
            { id: `${o}ShowPrice`, title: d }
          );
          n.push(r);
        }
        if ('extendLine' in t) {
          const r = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.extendLine,
                c.format({ title: i })
              ),
            },
            { id: `${o}ExtendLine`, title: h }
          );
          n.push(r);
        }
        if ('showTime' in t) {
          const r = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.showTime,
                p.format({ title: i })
              ),
            },
            { id: `${o}ShowTime`, title: u }
          );
          n.push(r);
        }
        return { definitions: n };
      }
    },
    43940: (e, t, i) => {
      i.r(t), i.d(t, { getSelectionStylePropertiesDefinitions: () => y });
      var o = i(44352),
        n = i(68806),
        r = i(62513),
        l = i(36298),
        s = i(28985);
      const a = new l.TranslatedString(
          'lines width',
          o.t(null, void 0, i(73043))
        ),
        c = new l.TranslatedString('lines style', o.t(null, void 0, i(41075))),
        p = new l.TranslatedString('lines color', o.t(null, void 0, i(70607))),
        d = new l.TranslatedString(
          'backgrounds color',
          o.t(null, void 0, i(21926))
        ),
        u = new l.TranslatedString(
          'backgrounds filled',
          o.t(null, void 0, i(52241))
        ),
        h = new l.TranslatedString('text color', o.t(null, void 0, i(41437)));
      function y(e, t) {
        const l = [];
        if ('linesWidths' in e || 'linestyle' in e || 'linesColors' in e) {
          const d = (0, s.createLinePropertyDefinition)(
            {
              width: e.linesWidths
                ? new r.CollectiblePropertyUndoWrapper(
                    new n.LineToolCollectedProperty(e.linesWidths),
                    a,
                    t
                  )
                : void 0,
              style: e.linestyle
                ? new r.CollectiblePropertyUndoWrapper(
                    new n.LineToolCollectedProperty(e.linestyle),
                    c,
                    t
                  )
                : void 0,
              color: e.linesColors
                ? new r.CollectiblePropertyUndoWrapper(
                    new n.LineToolCollectedProperty(e.linesColors),
                    p,
                    t
                  )
                : void 0,
            },
            { id: 'LineStyles', title: o.t(null, void 0, i(1277)) }
          );
          l.push(d);
        }
        if ('backgroundsColors' in e) {
          const a = (0, s.createColorPropertyDefinition)(
            {
              checked: e.fillBackground
                ? new r.CollectiblePropertyUndoWrapper(
                    new n.LineToolCollectedProperty(e.fillBackground),
                    u,
                    t
                  )
                : void 0,
              color: new r.CollectiblePropertyUndoWrapper(
                new n.LineToolCollectedProperty(e.backgroundsColors),
                d,
                t
              ),
            },
            { id: 'BackgroundColors', title: o.t(null, void 0, i(27331)) }
          );
          l.push(a);
        }
        if ('textsColors' in e) {
          const a = (0, s.createLinePropertyDefinition)(
            {
              color: new r.CollectiblePropertyUndoWrapper(
                new n.LineToolCollectedProperty(e.textsColors),
                h,
                t
              ),
            },
            { id: 'TextColors', title: o.t(null, void 0, i(37229)) }
          );
          l.push(a);
        }
        return { definitions: l };
      }
    },
    75611: (e, t, i) => {
      i.d(t, {
        getTrendLineToolsStylePropertiesDefinitions: () => z,
      });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(28985),
        s = i(58275),
        a = i.n(s),
        c = i(9155),
        p = i(94474);
      const d = new n.TranslatedString(
          'change {title} middle point visibility',
          o.t(null, void 0, i(89996))
        ),
        u = new n.TranslatedString(
          'change {title} price labels visibility',
          o.t(null, void 0, i(88577))
        ),
        h = new n.TranslatedString(
          'change {title} price range visibility',
          o.t(null, void 0, i(47045))
        ),
        y = new n.TranslatedString(
          'change {title} percent change visibility',
          o.t(null, void 0, i(62243))
        ),
        f = new n.TranslatedString(
          'change {title} change in pips visibility',
          o.t(null, void 0, i(22430))
        ),
        v = new n.TranslatedString(
          'change {title} bars range visibility',
          o.t(null, void 0, i(42746))
        ),
        g = new n.TranslatedString(
          'change {title} date/time range visibility',
          o.t(null, void 0, i(15485))
        ),
        T = new n.TranslatedString(
          'change {title} distance visibility',
          o.t(null, void 0, i(91534))
        ),
        D = new n.TranslatedString(
          'change {title} angle visibility',
          o.t(null, void 0, i(45537))
        ),
        w = new n.TranslatedString(
          'change {title} always show stats',
          o.t(null, void 0, i(37913))
        ),
        _ = new n.TranslatedString(
          'change {title} stats position',
          o.t(null, void 0, i(588))
        ),
        P = [
          { value: c.StatsPosition.Left, title: o.t(null, void 0, i(19286)) },
          { value: c.StatsPosition.Center, title: o.t(null, void 0, i(72171)) },
          { value: c.StatsPosition.Right, title: o.t(null, void 0, i(21141)) },
          { value: c.StatsPosition.Auto, title: o.t(null, void 0, i(86951)) },
        ],
        S = o.t(null, void 0, i(24510)),
        m = o.t(null, void 0, i(75675)),
        b = o.t(null, void 0, i(28712)),
        C = o.t(null, void 0, i(46964)),
        x = o.t(null, void 0, i(2694)),
        L = o.t(null, void 0, i(60066)),
        k = o.t(null, void 0, i(19949)),
        A = o.t(null, void 0, i(67114)),
        $ = o.t(null, void 0, i(75460)),
        M = o.t(null, void 0, i(36150)),
        V = o.t(null, void 0, i(85160)),
        B = o.t(null, void 0, i(37249));
      function z(e, t, i, o) {
        const n = (0, p.removeSpaces)(i.originalText()),
          s = [],
          c = t,
          z = (0, r.createLineStyleDefinition)(
            e,
            {
              ...c,
              lineColor: t.linecolor,
              lineWidth: t.linewidth,
              lineStyle: t.linestyle,
            },
            i,
            'Line'
          );
        s.push(z);
        const W = (0, l.createCheckablePropertyDefinition)(
          {
            checked: (0, l.convertToDefinitionProperty)(
              e,
              t.showMiddlePoint,
              d.format({ title: i })
            ),
          },
          { id: `${n}MiddlePoint`, title: (o && o.middlePoint) || S }
        );
        s.push(W);
        const N = (0, l.createCheckablePropertyDefinition)(
          {
            checked: (0, l.convertToDefinitionProperty)(
              e,
              t.showPriceLabels,
              u.format({ title: i })
            ),
          },
          {
            id: `${n}ShowPriceLabels`,
            title: (o && o.showPriceLabelsTitle) || m,
          }
        );
        s.push(N);
        const R = [],
          G = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.showPriceRange,
                h.format({ title: i })
              ),
            },
            { id: `${n}PriceRange`, title: (o && o.priceRange) || C }
          );
        R.push(G);
        const E = (0, l.createCheckablePropertyDefinition)(
          {
            checked: (0, l.convertToDefinitionProperty)(
              e,
              t.showPercentPriceRange,
              y.format({ title: i })
            ),
          },
          { id: `${n}PercentChange`, title: (o && o.percentChange) || x }
        );
        R.push(E);
        const O = (0, l.createCheckablePropertyDefinition)(
          {
            checked: (0, l.convertToDefinitionProperty)(
              e,
              t.showPipsPriceRange,
              f.format({ title: i })
            ),
          },
          { id: `${n}PipsChange`, title: (o && o.pipsChange) || L }
        );
        R.push(O);
        const F = (0, l.createCheckablePropertyDefinition)(
          {
            checked: (0, l.convertToDefinitionProperty)(
              e,
              t.showBarsRange,
              v.format({ title: i })
            ),
          },
          {
            id: `${n}BarsRange`,
            title: (o && o.barRange) || k,
          }
        );
        if ((R.push(F), 'showDateTimeRange' in t)) {
          const r = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.showDateTimeRange,
                g.format({ title: i })
              ),
            },
            { id: `${n}DateTimeRange`, title: (o && o.dateTimeRange) || A }
          );
          R.push(r);
        }
        if ('showDistance' in t) {
          const r = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.showDistance,
                T.format({ title: i })
              ),
            },
            { id: `${n}Distance`, title: (o && o.distance) || $ }
          );
          R.push(r);
        }
        if ('showAngle' in t) {
          const r = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                e,
                t.showAngle,
                D.format({ title: i })
              ),
            },
            { id: `${n}Angle`, title: (o && o.angle) || M }
          );
          R.push(r);
        }
        const U = (0, l.createCheckablePropertyDefinition)(
          {
            checked: (0, l.convertToDefinitionProperty)(
              e,
              t.alwaysShowStats,
              w.format({ title: i })
            ),
          },
          { id: `${n}ShowStats`, title: (o && o.showStats) || V }
        );
        R.push(U);
        const I = (0, l.createOptionsPropertyDefinition)(
          {
            option: (0, l.convertToDefinitionProperty)(
              e,
              t.statsPosition,
              _.format({ title: i })
            ),
          },
          {
            id: `${n}StatsPosition`,
            title: (o && o.statsPosition) || b,
            options: new (a())(P),
          }
        );
        return (
          R.push(I),
          s.push(
            (0, l.createPropertyDefinitionsGeneralGroup)(R, `${n}StatsGroup`, B)
          ),
          { definitions: s }
        );
      }
    },
    2908: (e, t, i) => {
      i.d(t, { createLineStyleDefinition: () => T });
      var o = i(44352),
        n = i(36298),
        r = i(28985),
        l = i(94474);
      const s = new n.TranslatedString(
          'change {toolName} line visibility',
          o.t(null, void 0, i(24272))
        ),
        a = new n.TranslatedString(
          'change {toolName} line width',
          o.t(null, void 0, i(46404))
        ),
        c = new n.TranslatedString(
          'change {toolName} line style',
          o.t(null, void 0, i(35422))
        ),
        p = new n.TranslatedString(
          'change {toolName} line color',
          o.t(null, void 0, i(50265))
        ),
        d = new n.TranslatedString(
          'change {toolName} line extending left',
          o.t(null, void 0, i(72781))
        ),
        u = new n.TranslatedString(
          'change {toolName} line left end',
          o.t(null, void 0, i(62603))
        ),
        h = new n.TranslatedString(
          'change {toolName} line extending right',
          o.t(null, void 0, i(84613))
        ),
        y = new n.TranslatedString(
          'change {toolName} line right end',
          o.t(null, void 0, i(62412))
        ),
        f = o.t(null, void 0, i(1277)),
        v = o.t(null, void 0, i(25892)),
        g = o.t(null, void 0, i(74395));
      function T(e, t, i, o, n) {
        const T = {},
          D = {
            id: `${(0, l.removeSpaces)(i.originalText())}${o}`,
            title: (n && n.line) || f,
          };
        return (
          void 0 !== t.showLine &&
            (T.checked = (0, r.convertToDefinitionProperty)(
              e,
              t.showLine,
              s.format({ toolName: i })
            )),
          void 0 !== t.lineWidth &&
            (T.width = (0, r.convertToDefinitionProperty)(
              e,
              t.lineWidth,
              a.format({ toolName: i })
            )),
          void 0 !== t.lineStyle &&
            (T.style = (0, r.convertToDefinitionProperty)(
              e,
              t.lineStyle,
              c.format({ toolName: i })
            )),
          void 0 !== t.lineColor &&
            (T.color = (0, r.getColorDefinitionProperty)(
              e,
              t.lineColor,
              null,
              p.format({ toolName: i })
            )),
          void 0 !== t.extendLeft &&
            ((T.extendLeft = (0, r.convertToDefinitionProperty)(
              e,
              t.extendLeft,
              d.format({ toolName: i })
            )),
            (D.extendLeftTitle = (n && n.extendLeftTitle) || v)),
          void 0 !== t.leftEnd &&
            (T.leftEnd = (0, r.convertToDefinitionProperty)(
              e,
              t.leftEnd,
              u.format({ toolName: i })
            )),
          void 0 !== t.extendRight &&
            ((T.extendRight = (0, r.convertToDefinitionProperty)(
              e,
              t.extendRight,
              h.format({ toolName: i })
            )),
            (D.extendRightTitle = (n && n.extendRightTitle) || g)),
          void 0 !== t.rightEnd &&
            (T.rightEnd = (0, r.convertToDefinitionProperty)(
              e,
              t.rightEnd,
              y.format({ toolName: i })
            )),
          (0, r.createLinePropertyDefinition)(T, D)
        );
      }
    },
    50653: (e, t, i) => {
      i.d(t, { createTextStyleDefinition: () => b });
      var o = i(44352),
        n = i(36298),
        r = i(28985),
        l = i(94474);
      const s = new n.TranslatedString(
          'change {toolName} text visibility',
          o.t(null, void 0, i(69871))
        ),
        a = new n.TranslatedString(
          'change {toolName} text color',
          o.t(null, void 0, i(6500))
        ),
        c = new n.TranslatedString(
          'change {toolName} text font size',
          o.t(null, void 0, i(48382))
        ),
        p = new n.TranslatedString(
          'change {toolName} text font bold',
          o.t(null, void 0, i(51614))
        ),
        d = new n.TranslatedString(
          'change {toolName} text font italic',
          o.t(null, void 0, i(18572))
        ),
        u = new n.TranslatedString(
          'change {toolName} text',
          o.t(null, void 0, i(77690))
        ),
        h = new n.TranslatedString(
          'change {toolName} labels alignment vertical',
          o.t(null, void 0, i(25937))
        ),
        y = new n.TranslatedString(
          'change {toolName} labels alignment horizontal',
          o.t(null, void 0, i(46991))
        ),
        f = new n.TranslatedString(
          'change {toolName} labels direction',
          o.t(null, void 0, i(73080))
        ),
        v = new n.TranslatedString(
          'change {toolName} text background visibility',
          o.t(null, void 0, i(18610))
        ),
        g = new n.TranslatedString(
          'change {toolName} text background color',
          o.t(null, void 0, i(91832))
        ),
        T = new n.TranslatedString(
          'change {toolName} text border visibility',
          o.t(null, void 0, i(45529))
        ),
        D = new n.TranslatedString(
          'change {toolName} text border width',
          o.t(null, void 0, i(6324))
        ),
        w = new n.TranslatedString(
          'change {toolName} text border color',
          o.t(null, void 0, i(44755))
        ),
        _ = new n.TranslatedString(
          'change {toolName} text wrap',
          o.t(null, void 0, i(25878))
        ),
        P = o.t(null, void 0, i(27331)),
        S = o.t(null, void 0, i(48848)),
        m = o.t(null, void 0, i(17932));
      function b(e, t, i, o) {
        const n = {},
          b = {
            id: `${(0, l.removeSpaces)(i.originalText())}Text`,
            title: (o.customTitles && o.customTitles.text) || '',
          };
        if (
          (void 0 !== t.showText &&
            (n.checked = (0, r.convertToDefinitionProperty)(
              e,
              t.showText,
              s.format({ toolName: i })
            )),
          void 0 !== t.textColor &&
            (n.color = (0, r.getColorDefinitionProperty)(
              e,
              t.textColor,
              t.transparency || null,
              a.format({ toolName: i })
            )),
          void 0 !== t.fontSize &&
            (n.size = (0, r.convertToDefinitionProperty)(
              e,
              t.fontSize,
              c.format({ toolName: i })
            )),
          void 0 !== t.bold &&
            (n.bold = (0, r.convertToDefinitionProperty)(
              e,
              t.bold,
              p.format({ toolName: i })
            )),
          void 0 !== t.italic &&
            (n.italic = (0, r.convertToDefinitionProperty)(
              e,
              t.italic,
              d.format({ toolName: i })
            )),
          void 0 !== t.text &&
            ((n.text = (0, r.convertToDefinitionProperty)(
              e,
              t.text,
              u.format({ toolName: i })
            )),
            (b.isEditable = Boolean(o.isEditable)),
            (b.isMultiLine = Boolean(o.isMultiLine))),
          void 0 !== t.vertLabelsAlign &&
            ((n.alignmentVertical = (0, r.convertToDefinitionProperty)(
              e,
              t.vertLabelsAlign,
              h.format({ toolName: i })
            )),
            (b.alignmentVerticalItems = o.alignmentVerticalItems)),
          void 0 !== t.horzLabelsAlign &&
            ((n.alignmentHorizontal = (0, r.convertToDefinitionProperty)(
              e,
              t.horzLabelsAlign,
              y.format({ toolName: i })
            )),
            (b.alignmentHorizontalItems = o.alignmentHorizontalItems)),
          void 0 !== t.textOrientation &&
            (n.orientation = (0, r.convertToDefinitionProperty)(
              e,
              t.textOrientation,
              f.format({ toolName: i })
            )),
          void 0 !== t.backgroundVisible &&
            (n.backgroundVisible = (0, r.convertToDefinitionProperty)(
              e,
              t.backgroundVisible,
              v.format({
                toolName: i,
              })
            )),
          void 0 !== t.backgroundColor)
        ) {
          let o = null;
          void 0 !== t.backgroundTransparency && (o = t.backgroundTransparency),
            (n.backgroundColor = (0, r.getColorDefinitionProperty)(
              e,
              t.backgroundColor,
              o,
              g.format({ toolName: i })
            ));
        }
        return (
          (void 0 === t.backgroundVisible && void 0 === t.backgroundColor) ||
            (b.backgroundTitle =
              (o.customTitles && o.customTitles.backgroundTitle) || P),
          void 0 !== t.borderVisible &&
            (n.borderVisible = (0, r.convertToDefinitionProperty)(
              e,
              t.borderVisible,
              T.format({ toolName: i })
            )),
          void 0 !== t.borderWidth &&
            (n.borderWidth = (0, r.convertToDefinitionProperty)(
              e,
              t.borderWidth,
              D.format({ toolName: i })
            )),
          void 0 !== t.borderColor &&
            (n.borderColor = (0, r.getColorDefinitionProperty)(
              e,
              t.borderColor,
              null,
              w.format({ toolName: i })
            )),
          (void 0 === t.borderVisible &&
            void 0 === t.borderColor &&
            void 0 === t.borderWidth) ||
            (b.borderTitle =
              (o.customTitles && o.customTitles.borderTitle) || S),
          void 0 !== t.wrap &&
            ((n.wrap = (0, r.convertToDefinitionProperty)(
              e,
              t.wrap,
              _.format({ toolName: i })
            )),
            (b.wrapTitle = (o.customTitles && o.customTitles.wrapTitle) || m)),
          (0, r.createTextPropertyDefinition)(n, b)
        );
      }
    },
    73896: (e, t, i) => {
      i.r(t), i.d(t, { ArrowMarkDefinitionsViewModel: () => d });
      var o = i(44352),
        n = i(36298),
        r = i(50653),
        l = i(85766),
        s = i(28985);
      const a = new n.TranslatedString(
          'change arrow color',
          o.t(null, void 0, i(38829))
        ),
        c = o.t(null, void 0, i(37229)),
        p = o.t(null, void 0, i(96237));
      class d extends l.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, r.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  text: e.text,
                  showText: e.showLabel,
                  textColor: e.color,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: c } }
              ),
            ],
          };
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.arrowColor,
                    null,
                    a
                  ),
                },
                { id: 'ArrowColor', title: p }
              ),
            ],
          };
        }
      }
    },
    57239: (e, t, i) => {
      i.r(t), i.d(t, { ArrowMarkerDefinitionsViewModel: () => u });
      var o = i(44352),
        n = i(36298),
        r = i(28985),
        l = i(85766),
        s = i(94474),
        a = i(50653);
      const c = new n.TranslatedString(
          'change {title} color',
          o.t(null, void 0, i(20216))
        ),
        p = o.t(null, void 0, i(40054)),
        d = o.t(null, void 0, i(37229));
      class u extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, r.createColorPropertyDefinition)(
                {
                  color: (0, r.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    null,
                    c.format({ title: i })
                  ),
                },
                { id: (0, s.removeSpaces)(`${t}Color`), title: p }
              ),
            ],
          };
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, a.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  text: e.text,
                  showText: e.showLabel,
                  textColor: e.textColor,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: d } }
              ),
            ],
          };
        }
      }
    },
    38534: (e, t, i) => {
      i.r(t),
        i.d(t, {
          BalloonDefinitionsViewModel: () => a,
        });
      var o = i(44352),
        n = i(36298),
        r = i(50653),
        l = i(85766);
      const s = o.t(null, void 0, i(37229));
      class a extends l.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, r.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.color,
                  fontSize: e.fontsize,
                  text: e.text,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.transparency,
                  borderColor: e.borderColor,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: s } }
              ),
            ],
          };
        }
      }
    },
    266: (e, t, i) => {
      i.r(t), i.d(t, { BarsPatternDefinitionsViewModel: () => _ });
      var o = i(44352),
        n = i(36298),
        r = i(85766),
        l = i(28985),
        s = i(58275),
        a = i.n(s),
        c = i(99987),
        p = i(20345),
        d = i(94474);
      const u = new n.TranslatedString(
          'change {title} color',
          o.t(null, void 0, i(20216))
        ),
        h = new n.TranslatedString(
          'change {title} mode',
          o.t(null, void 0, i(94441))
        ),
        y = new n.TranslatedString(
          'change {title} mirrored',
          o.t(null, void 0, i(36618))
        ),
        f = new n.TranslatedString(
          'change {title} flipped',
          o.t(null, void 0, i(99670))
        ),
        v = o.t(null, void 0, i(40054)),
        g = o.t(null, void 0, i(53889)),
        T = o.t(null, void 0, i(63158)),
        D = o.t(null, void 0, i(92754)),
        w = [
          {
            value: c.LineToolBarsPatternMode.Bars,
            title: o.t(null, void 0, i(25264)),
          },
          {
            value: c.LineToolBarsPatternMode.OpenClose,
            title: o.t(null, void 0, i(66049)),
          },
          {
            value: c.LineToolBarsPatternMode.Line,
            title: o.t(null, void 0, i(47669)),
          },
          {
            value: c.LineToolBarsPatternMode.LineOpen,
            title: o.t(null, void 0, i(17676)),
          },
          {
            value: c.LineToolBarsPatternMode.LineHigh,
            title: o.t(null, void 0, i(71899)),
          },
          {
            value: c.LineToolBarsPatternMode.LineLow,
            title: o.t(null, void 0, i(83394)),
          },
          {
            value: c.LineToolBarsPatternMode.LineHL2,
            title: o.t(null, void 0, i(49286)),
          },
        ];
      class _ extends r.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType()),
            o = (0, d.removeSpaces)(t);
          return {
            definitions: [
              (0, l.createColorPropertyDefinition)(
                {
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color,
                    null,
                    u.format({ title: i })
                  ),
                },
                { id: `${o}Color`, title: v }
              ),
              (0, l.createOptionsPropertyDefinition)(
                {
                  option: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.mode,
                    h.format({ title: i }),
                    [p.convertToInt]
                  ),
                },
                { id: `${o}Mode`, title: g, options: new (a())(w) }
              ),
              (0, l.createCheckablePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.mirrored,
                    y.format({ title: i })
                  ),
                },
                { id: `${o}Mirrored`, title: T }
              ),
              (0, l.createCheckablePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.flipped,
                    f.format({ title: i })
                  ),
                },
                { id: `${o}Flipped`, title: D }
              ),
            ],
          };
        }
      }
    },
    26430: (e, t, i) => {
      i.r(t), i.d(t, { BrushDefinitionsViewModel: () => u });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(85766),
        s = i(28985),
        a = i(94474);
      const c = new n.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(64548))
        ),
        p = new n.TranslatedString(
          'change {title} background color',
          o.t(null, void 0, i(75312))
        ),
        d = o.t(null, void 0, i(27331));
      class u extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                  leftEnd: e.leftEnd,
                  rightEnd: e.rightEnd,
                },
                i,
                'Line'
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    c.format({ title: i })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    p.format({ title: i })
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}BackgroundColor`), title: d }
              ),
            ],
          };
        }
      }
    },
    2813: (e, t, i) => {
      i.r(t), i.d(t, { CalloutDefinitionsViewModel: () => l });
      var o = i(50653),
        n = i(85766),
        r = i(36298);
      class l extends n.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, o.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.color,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                  text: e.text,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.transparency,
                  borderColor: e.bordercolor,
                  borderWidth: e.linewidth,
                  wrap: e.wordWrap,
                },
                new r.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0 }
              ),
            ],
          };
        }
      }
    },
    70007: (e, t, i) => {
      i.r(t), i.d(t, { CrossLineDefinitionsViewModel: () => c });
      var o = i(44352),
        n = i(36298),
        r = i(85766),
        l = i(86778),
        s = i(50653);
      const a = o.t(null, void 0, i(37229));
      class c extends r.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs();
          return (0, l.getLinesStylesPropertiesDefinitions)(
            this._propertyApplier,
            e,
            new n.TranslatedString(
              this._source.name(),
              this._source.translatedType()
            )
          );
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          if ('showLabel' in e) {
            return {
              definitions: [
                (0, s.createTextStyleDefinition)(
                  this._propertyApplier,
                  {
                    ...e,
                    showText: e.showLabel,
                    textColor: e.textcolor,
                    fontSize: e.fontsize,
                  },
                  new n.TranslatedString(
                    this._source.name(),
                    this._source.translatedType()
                  ),
                  { isEditable: !0, isMultiLine: !0, customTitles: { text: a } }
                ),
              ],
            };
          }
          return null;
        }
      }
    },
    15673: (e, t, i) => {
      i.r(t),
        i.d(t, { CyclicAndSineLinesPatternDefinitionsViewModel: () => a });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(85766);
      const s = o.t(null, void 0, i(83182));
      class a extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                  lineStyle: e.linestyle,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                'Line',
                { line: s }
              ),
            ],
          };
        }
      }
    },
    92383: (e, t, i) => {
      i.r(t), i.d(t, { ElliottPatternDefinitionsViewModel: () => v });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(85766),
        s = i(28985),
        a = i(58275),
        c = i.n(a),
        p = i(94474);
      const d = new n.TranslatedString(
          'change {title} color',
          o.t(null, void 0, i(20216))
        ),
        u = new n.TranslatedString(
          'change {title} degree',
          o.t(null, void 0, i(3400))
        ),
        h = o.t(null, void 0, i(40054)),
        y = o.t(null, void 0, i(95545)),
        f = o.t(null, void 0, i(69479));
      class v extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color,
                    null,
                    d.format({ title: i })
                  ),
                },
                { id: (0, p.removeSpaces)(`${t}BackgroundColor`), title: h }
              ),
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                { showLine: e.showWave, lineWidth: e.linewidth },
                i,
                'Line',
                { line: y }
              ),
              (0, s.createOptionsPropertyDefinition)(
                {
                  option: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.degree,
                    u.format({ title: i })
                  ),
                },
                {
                  id: `${t}Degree`,
                  title: f,
                  options: new (c())(this._source.availableDegreesValues()),
                }
              ),
            ],
          };
        }
      }
    },
    82300: (e, t, i) => {
      i.r(t), i.d(t, { EllipseCircleDefinitionsViewModel: () => a });
      var o = i(44352),
        n = i(36298),
        r = i(50653),
        l = i(20061);
      const s = o.t(null, void 0, i(37229));
      class a extends l.GeneralFiguresDefinitionsViewModelBase {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, r.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.textColor,
                  text: e.text,
                  bold: e.bold,
                  italic: e.italic,
                  fontSize: e.fontSize,
                  showText: e.showLabel,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: s } }
              ),
            ],
          };
        }
      }
    },
    7044: (e, t, i) => {
      i.r(t), i.d(t, { FibCirclesDefinitionsViewModel: () => b });
      var o = i(50151),
        n = i(44352),
        r = i(36298),
        l = i(2908),
        s = i(28985),
        a = i(85766),
        c = i(94474),
        p = i(69152);
      const d = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(45463))
        ),
        u = new r.TranslatedString(
          'change {title} levels visibility',
          n.t(null, void 0, i(26710))
        ),
        h = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(85551))
        ),
        y = new r.TranslatedString(
          'change {title} level {index} line width',
          n.t(null, void 0, i(90098))
        ),
        f = new r.TranslatedString(
          'change {title} level {index} line coeff',
          n.t(null, void 0, i(32891))
        ),
        v = new r.TranslatedString(
          'change {title} all lines color',
          n.t(null, void 0, i(15521))
        ),
        g = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(64548))
        ),
        T = new r.TranslatedString(
          'change {title} background transparency',
          n.t(null, void 0, i(36438))
        ),
        D = new r.TranslatedString(
          'change {title} coeffs as percents visibility',
          n.t(null, void 0, i(99128))
        ),
        w = n.t(null, void 0, i(4372)),
        _ = n.t(null, void 0, i(12374)),
        P = n.t(null, void 0, i(27331)),
        S = n.t(null, void 0, i(79106)),
        m = n.t(null, void 0, i(43809));
      class b extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, c.removeSpaces)(i),
            a = new r.TranslatedString(i, this._source.translatedType()),
            b = t.trendline.childs(),
            C = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              {
                showLine: b.visible,
                lineColor: b.color,
                lineStyle: b.linestyle,
                lineWidth: b.linewidth,
              },
              a,
              'TrendLine',
              { line: w }
            );
          e.push(C);
          const x = this._source.levelsCount();
          for (let i = 1; i <= x; i++) {
            const o = t[`level${i}`].childs(),
              r = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.visible,
                    d.format({ title: a, index: i })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.color,
                    null,
                    h.format({ title: a, index: i })
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linewidth,
                    y.format({ title: a, index: i })
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.coeff,
                    f.format({ title: a, index: i })
                  ),
                },
                { id: `${n}LineLevel${i}` }
              );
            e.push(r);
          }
          const L = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new p.CollectibleColorPropertyUndoWrapper(
                  (0, o.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null
                ),
                null,
                v.format({ title: a }),
                !0
              ),
            },
            { id: `${n}AllLineColor`, title: _ }
          );
          e.push(L);
          const k = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                g.format({ title: a })
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                T.format({ title: a })
              ),
            },
            { id: `${n}Background`, title: P }
          );
          e.push(k);
          const A = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showCoeffs,
                u.format({ title: a })
              ),
            },
            { id: `${n}Levels`, title: S }
          );
          e.push(A);
          const $ = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.coeffsAsPercents,
                D.format({ title: a })
              ),
            },
            { id: `${n}Percentage`, title: m }
          );
          return e.push($), { definitions: e };
        }
      }
    },
    56194: (e, t, i) => {
      i.r(t), i.d(t, { FibDrawingsWith24LevelsDefinitionsViewModel: () => U });
      var o = i(50151),
        n = i(44352),
        r = i(36298),
        l = i(2908),
        s = i(28985),
        a = i(85766),
        c = i(18505),
        p = i(58275),
        d = i.n(p),
        u = i(94474),
        h = i(69152);
      const y = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(45463))
        ),
        f = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(85551))
        ),
        v = new r.TranslatedString(
          'change {title} level {index} line coeff',
          n.t(null, void 0, i(32891))
        ),
        g = new r.TranslatedString(
          'change {title} all lines color',
          n.t(null, void 0, i(15521))
        ),
        T = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(64548))
        ),
        D = new r.TranslatedString(
          'change {title} background transparency',
          n.t(null, void 0, i(36438))
        ),
        w = new r.TranslatedString(
          'change {title} reverse',
          n.t(null, void 0, i(52877))
        ),
        _ = new r.TranslatedString(
          'change {title} prices visibility',
          n.t(null, void 0, i(56175))
        ),
        P = new r.TranslatedString(
          'change {title} labels alignment',
          n.t(null, void 0, i(81170))
        ),
        S = new r.TranslatedString(
          'change {title} labels font size',
          n.t(null, void 0, i(22775))
        ),
        m = new r.TranslatedString(
          'change {title} style',
          n.t(null, void 0, i(74428))
        ),
        b = new r.TranslatedString(
          'change {title} fib levels based on log scale',
          n.t(null, void 0, i(45739))
        ),
        C = n.t(null, void 0, i(4372)),
        x = n.t(null, void 0, i(95610)),
        L = n.t(null, void 0, i(14025)),
        k = n.t(null, void 0, i(45809)),
        A = n.t(null, void 0, i(83095)),
        $ = n.t(null, void 0, i(3304)),
        M = n.t(null, void 0, i(24186)),
        V = n.t(null, void 0, i(29072)),
        B = n.t(null, void 0, i(79106)),
        z = n.t(null, void 0, i(94420)),
        W = n.t(null, void 0, i(17006)),
        N = n.t(null, void 0, i(12374)),
        R = n.t(null, void 0, i(27331)),
        G = n.t(null, void 0, i(39836)),
        E = [
          { id: 'values', value: !1, title: n.t(null, void 0, i(91322)) },
          { id: 'percents', value: !0, title: n.t(null, void 0, i(650)) },
        ],
        O = [
          { id: 'bottom', value: 'bottom', title: n.t(null, void 0, i(65994)) },
          { id: 'middle', value: 'middle', title: n.t(null, void 0, i(76476)) },
          { id: 'top', value: 'top', title: n.t(null, void 0, i(91757)) },
        ],
        F = [10, 11, 12, 14, 16, 20, 24].map((e) => ({
          title: String(e),
          value: e,
        }));
      class U extends a.LineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t), (this._disabledBasedOnLog = null);
          if (
            'fibLevelsBasedOnLogScale' in this._source.properties().childs()
          ) {
            const e = this._source.priceScale();
            null !== e &&
              ((this._disabledBasedOnLog = new (d())(Boolean(!e.mode().log))),
              this._createPropertyRages(),
              e.modeChanged().subscribe(this, (e, t) => {
                null !== this._disabledBasedOnLog &&
                  this._disabledBasedOnLog.setValue(Boolean(!t.log));
              }));
          }
        }
        destroy() {
          super.destroy();
          const e = this._source.priceScale();
          null !== e && e.modeChanged().unsubscribeAll(this);
        }
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, u.removeSpaces)(i),
            a = new r.TranslatedString(i, this._source.translatedType());
          if ('trendline' in t) {
            const i = t.trendline.childs(),
              o = (0, l.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  showLine: i.visible,
                  lineColor: i.color,
                  lineStyle: i.linestyle,
                  lineWidth: i.linewidth,
                },
                a,
                'TrendLine',
                { line: C }
              );
            e.push(o);
          }
          const p = t.levelsStyle.childs(),
            U = { lineStyle: p.linestyle, lineWidth: p.linewidth },
            I = { line: x };
          'extendLines' in t &&
            ((U.extendRight = t.extendLines), (I.extendRightTitle = A)),
            'extendLinesLeft' in t &&
              ((U.extendLeft = t.extendLinesLeft), (I.extendLeftTitle = $)),
            'extendRight' in t &&
              ((U.extendRight = t.extendRight), (I.extendRightTitle = L)),
            'extendLeft' in t &&
              ((U.extendLeft = t.extendLeft), (I.extendLeftTitle = k));
          const H = (0, l.createLineStyleDefinition)(
            this._propertyApplier,
            U,
            a,
            'LevelsStyleLine',
            I
          );
          e.push(H);
          const j = [],
            Y = this._source.levelsCount();
          for (let e = 1; e <= Y; e++) {
            const i = t[`level${e}`].childs(),
              o = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    y.format({ title: a, index: e })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    f.format({ title: a, index: e })
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    v.format({ title: a, index: e })
                  ),
                },
                { id: `${n}LineLevel${e}` }
              );
            j.push(o);
          }
          const X = (0, s.createPropertyDefinitionsLeveledLinesGroup)(
            j,
            `${n}LeveledLinesGroup`
          );
          e.push(
            (0, s.createPropertyDefinitionsGeneralGroup)([X], `${n}Group`)
          );
          const q = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new h.CollectibleColorPropertyUndoWrapper(
                  (0, o.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null
                ),
                null,
                g.format({ title: a }),
                !0
              ),
            },
            { id: `${n}AllLineColor`, title: N }
          );
          e.push(q);
          const J = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                T.format({ title: a })
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                D.format({ title: a })
              ),
            },
            { id: `${n}Background`, title: R }
          );
          e.push(J);
          const K = t;
          if ('reverse' in K) {
            const t = (0, s.createCheckablePropertyDefinition)(
              {
                checked: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  K.reverse,
                  w.format({ title: a })
                ),
              },
              { id: `${n}Reverse`, title: M }
            );
            e.push(t);
          }
          const Q = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showPrices,
                _.format({ title: a })
              ),
            },
            { id: `${n}Prices`, title: V }
          );
          e.push(Q);
          const Z = (0, s.createOptionsPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showCoeffs,
                m.format({ title: a })
              ),
              option: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.coeffsAsPercents,
                m.format({ title: a })
              ),
            },
            { id: `${n}PitchStyle`, title: B, options: new (d())(E) }
          );
          e.push(Z);
          const ee = (0, s.createTwoOptionsPropertyDefinition)(
            {
              option1: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.horzLabelsAlign,
                P.format({ title: a })
              ),
              option2: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.vertLabelsAlign,
                P.format({ title: a })
              ),
            },
            {
              id: `${n}Alignment`,
              title: z,
              optionsItems1: new (d())(c.availableAlignmentHorizontalItems),
              optionsItems2: new (d())(O),
            }
          );
          e.push(ee);
          const te = (0, s.createOptionsPropertyDefinition)(
            {
              option: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.labelFontSize,
                S.format({ title: a })
              ),
            },
            { id: `${n}FontSize`, title: W, options: new (d())(F) }
          );
          if (
            (e.push(te),
            'fibLevelsBasedOnLogScale' in t &&
              null !== this._disabledBasedOnLog)
          ) {
            const i = (0, s.createCheckablePropertyDefinition)(
              {
                disabled: (0, s.convertFromWVToDefinitionProperty)(
                  this._propertyApplier,
                  this._disabledBasedOnLog,
                  b.format({ title: a })
                ),
                checked: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.fibLevelsBasedOnLogScale,
                  b.format({ title: a })
                ),
              },
              { id: `${n}BasedOnLog`, title: G }
            );
            e.push(i);
          }
          return { definitions: e };
        }
      }
    },
    13972: (e, t, i) => {
      i.r(t), i.d(t, { FibSpeedResistanceArcsDefinitionsViewModel: () => b });
      var o = i(50151),
        n = i(44352),
        r = i(36298),
        l = i(2908),
        s = i(28985),
        a = i(85766),
        c = i(94474),
        p = i(69152);
      const d = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(45463))
        ),
        u = new r.TranslatedString(
          'change {title} levels visibility',
          n.t(null, void 0, i(26710))
        ),
        h = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(85551))
        ),
        y = new r.TranslatedString(
          'change {title} level {index} line width',
          n.t(null, void 0, i(90098))
        ),
        f = new r.TranslatedString(
          'change {title} level {index} line coeff',
          n.t(null, void 0, i(32891))
        ),
        v = new r.TranslatedString(
          'change {title} all lines color',
          n.t(null, void 0, i(15521))
        ),
        g = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(64548))
        ),
        T = new r.TranslatedString(
          'change {title} background transparency',
          n.t(null, void 0, i(36438))
        ),
        D = new r.TranslatedString(
          'change {title} full circles visibility',
          n.t(null, void 0, i(35165))
        ),
        w = n.t(null, void 0, i(4372)),
        _ = n.t(null, void 0, i(12374)),
        P = n.t(null, void 0, i(27331)),
        S = n.t(null, void 0, i(79106)),
        m = n.t(null, void 0, i(10578));
      class b extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, c.removeSpaces)(i),
            a = new r.TranslatedString(i, this._source.translatedType()),
            b = t.trendline.childs(),
            C = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              {
                showLine: b.visible,
                lineColor: b.color,
                lineStyle: b.linestyle,
                lineWidth: b.linewidth,
              },
              a,
              'TrendLine',
              { line: w }
            );
          e.push(C);
          const x = this._source.levelsCount();
          for (let i = 1; i <= x; i++) {
            const o = t[`level${i}`].childs(),
              r = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.visible,
                    d.format({ title: a, index: i })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.color,
                    null,
                    h.format({ title: a, index: i })
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linewidth,
                    y.format({ title: a, index: i })
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.coeff,
                    f.format({ title: a, index: i })
                  ),
                },
                { id: `${n}LineLevel${i}` }
              );
            e.push(r);
          }
          const L = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new p.CollectibleColorPropertyUndoWrapper(
                  (0, o.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null
                ),
                null,
                v.format({ title: a }),
                !0
              ),
            },
            { id: `${n}AllLineColor`, title: _ }
          );
          e.push(L);
          const k = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                g.format({ title: a })
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                T.format({ title: a })
              ),
            },
            { id: `${n}Background`, title: P }
          );
          e.push(k);
          const A = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showCoeffs,
                u.format({ title: a })
              ),
            },
            { id: `${n}Levels`, title: S }
          );
          e.push(A);
          const $ = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fullCircles,
                D.format({ title: a })
              ),
            },
            { id: `${n}FullCircles`, title: m }
          );
          return e.push($), { definitions: e };
        }
      }
    },
    4841: (e, t, i) => {
      i.r(t), i.d(t, { FibSpeedResistanceFanDefinitionsViewModel: () => z });
      var o = i(50151),
        n = i(44352),
        r = i(36298),
        l = i(28985),
        s = i(85766),
        a = i(94474),
        c = i(69152);
      const p = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(45463))
        ),
        d = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(85551))
        ),
        u = new r.TranslatedString(
          'change {title} level {index} line coeff',
          n.t(null, void 0, i(32891))
        ),
        h = new r.TranslatedString(
          'change {title} all lines color',
          n.t(null, void 0, i(15521))
        ),
        y = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(64548))
        ),
        f = new r.TranslatedString(
          'change {title} background transparency',
          n.t(null, void 0, i(36438))
        ),
        v = new r.TranslatedString(
          'change {title} left labels visibility',
          n.t(null, void 0, i(2359))
        ),
        g = new r.TranslatedString(
          'change {title} right labels visibility',
          n.t(null, void 0, i(16598))
        ),
        T = new r.TranslatedString(
          'change {title} top labels visibility',
          n.t(null, void 0, i(73137))
        ),
        D = new r.TranslatedString(
          'change {title} bottom labels visibility',
          n.t(null, void 0, i(15802))
        ),
        w = new r.TranslatedString(
          'change {title} reverse',
          n.t(null, void 0, i(52877))
        ),
        _ = new r.TranslatedString(
          'change {title} grid visibility',
          n.t(null, void 0, i(53770))
        ),
        P = new r.TranslatedString(
          'change {title} grid line color',
          n.t(null, void 0, i(29145))
        ),
        S = new r.TranslatedString(
          'change {title} grid line width',
          n.t(null, void 0, i(93548))
        ),
        m = new r.TranslatedString(
          'change {title} grid line style',
          n.t(null, void 0, i(64949))
        ),
        b = n.t(null, void 0, i(12374)),
        C = n.t(null, void 0, i(27331)),
        x = n.t(null, void 0, i(16103)),
        L = n.t(null, void 0, i(77838)),
        k = n.t(null, void 0, i(79307)),
        A = n.t(null, void 0, i(91367)),
        $ = n.t(null, void 0, i(10209)),
        M = n.t(null, void 0, i(17608)),
        V = n.t(null, void 0, i(81260)),
        B = n.t(null, void 0, i(24186));
      class z extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, a.removeSpaces)(i),
            s = new r.TranslatedString(i, this._source.translatedType()),
            z = [],
            W = this._source.hLevelsCount();
          for (let e = 1; e <= W; e++) {
            const i = t[`hlevel${e}`].childs(),
              o = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    p.format({ title: s, index: e })
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    d.format({ title: s, index: e })
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    u.format({ title: s, index: e })
                  ),
                },
                { id: `${n}HLineLevel${e}` }
              );
            z.push(o);
          }
          const N = (0, l.createPropertyDefinitionsLeveledLinesGroup)(
              z,
              `${n}HLeveledLinesGroup`
            ),
            R = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showLeftLabels,
                  v.format({ title: s })
                ),
              },
              { id: `${n}LeftLabels`, title: k }
            ),
            G = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showRightLabels,
                  g.format({ title: s })
                ),
              },
              { id: `${n}RightLabels`, title: A }
            ),
            E = (0, l.createPropertyDefinitionsGeneralGroup)(
              [N, R, G],
              `${n}HLevelGroup`,
              x
            );
          e.push(E);
          const O = [],
            F = this._source.vLevelsCount();
          for (let e = 1; e <= F; e++) {
            const i = t[`vlevel${e}`].childs(),
              o = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    p.format({ title: s, index: e })
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    d.format({ title: s, index: e })
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    u.format({ title: s, index: e })
                  ),
                },
                { id: `${n}VLineLevel${e}` }
              );
            O.push(o);
          }
          const U = (0, l.createPropertyDefinitionsLeveledLinesGroup)(
              O,
              `${n}VLeveledLinesGroup`
            ),
            I = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showTopLabels,
                  T.format({ title: s })
                ),
              },
              { id: `${n}TopLabels`, title: $ }
            ),
            H = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showBottomLabels,
                  D.format({ title: s })
                ),
              },
              { id: `${n}BottomLabels`, title: M }
            ),
            j = (0, l.createPropertyDefinitionsGeneralGroup)(
              [U, I, H],
              `${n}VLevelGroup`,
              L
            );
          e.push(j);
          const Y = (0, l.createColorPropertyDefinition)(
            {
              color: (0, l.getColorDefinitionProperty)(
                this._propertyApplier,
                new c.CollectibleColorPropertyUndoWrapper(
                  (0, o.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null
                ),
                null,
                h.format({ title: s }),
                !0
              ),
            },
            { id: `${n}AllLineColor`, title: b }
          );
          e.push(Y);
          const X = (0, l.createTransparencyPropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                y.format({ title: s })
              ),
              transparency: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                f.format({ title: s })
              ),
            },
            { id: `${n}Background`, title: C }
          );
          e.push(X);
          const q = t.grid.childs(),
            J = (0, l.createLinePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  q.visible,
                  _.format({ title: s })
                ),
                color: (0, l.getColorDefinitionProperty)(
                  this._propertyApplier,
                  q.color,
                  null,
                  P.format({ title: s })
                ),
                width: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  q.linewidth,
                  S.format({ title: s })
                ),
                style: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  q.linestyle,
                  m.format({ title: s })
                ),
              },
              { id: `${n}GridLine`, title: V }
            );
          e.push(J);
          const K = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.reverse,
                w.format({ title: s })
              ),
            },
            { id: `${n}Reverse`, title: B }
          );
          return e.push(K), { definitions: e };
        }
      }
    },
    90448: (e, t, i) => {
      i.r(t), i.d(t, { FibSpiralDefinitionsViewModel: () => y });
      var o = i(44352),
        n = i(36298),
        r = i(28985),
        l = i(85766),
        s = i(94474);
      const a = new n.TranslatedString(
          'change {title} line color',
          o.t(null, void 0, i(20563))
        ),
        c = new n.TranslatedString(
          'change {title} line width',
          o.t(null, void 0, i(44643))
        ),
        p = new n.TranslatedString(
          'change {title} line style',
          o.t(null, void 0, i(66982))
        ),
        d = new n.TranslatedString(
          'change {title} counterclockwise',
          o.t(null, void 0, i(31804))
        ),
        u = o.t(null, void 0, i(1277)),
        h = o.t(null, void 0, i(89795));
      class y extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, s.removeSpaces)(t),
            o = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, r.createLinePropertyDefinition)(
                {
                  color: (0, r.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.linecolor,
                    null,
                    a.format({ title: o })
                  ),
                  width: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.linewidth,
                    c.format({ title: o })
                  ),
                  style: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.linestyle,
                    p.format({ title: o })
                  ),
                },
                { id: `${i}Line`, title: u }
              ),
              (0, r.createCheckablePropertyDefinition)(
                {
                  checked: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.counterclockwise,
                    d.format({ title: o })
                  ),
                },
                { id: `${i}Counterclockwise`, title: h }
              ),
            ],
          };
        }
      }
    },
    18505: (e, t, i) => {
      i.r(t),
        i.d(t, {
          FibTimezoneDefinitionsViewModel: () => x,
          availableAlignmentHorizontalItems: () => C,
          availableAlignmentVerticalItems: () => b,
        });
      var o = i(50151),
        n = i(44352),
        r = i(36298),
        l = i(28985),
        s = i(85766),
        a = i(58275),
        c = i.n(a),
        p = i(94474),
        d = i(69152);
      const u = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(45463))
        ),
        h = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(85551))
        ),
        y = new r.TranslatedString(
          'change {title} level {index} line width',
          n.t(null, void 0, i(90098))
        ),
        f = new r.TranslatedString(
          'change {title} level {index} line style',
          n.t(null, void 0, i(47840))
        ),
        v = new r.TranslatedString(
          'change {title} level {index} line coeff',
          n.t(null, void 0, i(32891))
        ),
        g = new r.TranslatedString(
          'change {title} all lines color',
          n.t(null, void 0, i(15521))
        ),
        T = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(64548))
        ),
        D = new r.TranslatedString(
          'change {title} background transparency',
          n.t(null, void 0, i(36438))
        ),
        w = new r.TranslatedString(
          'change {title} labels visibility',
          n.t(null, void 0, i(24338))
        ),
        _ = new r.TranslatedString(
          'change {title} labels alignment',
          n.t(null, void 0, i(81170))
        ),
        P = n.t(null, void 0, i(12374)),
        S = n.t(null, void 0, i(27331)),
        m = n.t(null, void 0, i(94420)),
        b = [
          { id: 'top', value: 'top', title: n.t(null, void 0, i(65994)) },
          { id: 'middle', value: 'middle', title: n.t(null, void 0, i(76476)) },
          { id: 'bottom', value: 'bottom', title: n.t(null, void 0, i(91757)) },
        ],
        C = [
          { id: 'left', value: 'left', title: n.t(null, void 0, i(19286)) },
          { id: 'center', value: 'center', title: n.t(null, void 0, i(72171)) },
          { id: 'right', value: 'right', title: n.t(null, void 0, i(21141)) },
        ];
      class x extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, p.removeSpaces)(i),
            s = new r.TranslatedString(i, this._source.translatedType()),
            a = this._source.levelsCount();
          for (let i = 1; i <= a; i++) {
            const o = t[`level${i}`].childs(),
              r = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.visible,
                    u.format({ title: s, index: i })
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.color,
                    null,
                    h.format({ title: s, index: i })
                  ),
                  width: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linewidth,
                    y.format({ title: s, index: i })
                  ),
                  style: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linestyle,
                    f.format({ title: s, index: i })
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.coeff,
                    v.format({ title: s, index: i })
                  ),
                },
                { id: `${n}LineLevel${i}` }
              );
            e.push(r);
          }
          const x = (0, l.createColorPropertyDefinition)(
            {
              color: (0, l.getColorDefinitionProperty)(
                this._propertyApplier,
                new d.CollectibleColorPropertyUndoWrapper(
                  (0, o.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null
                ),
                null,
                g.format({ title: s }),
                !0
              ),
            },
            { id: `${n}AllLineColor`, title: P }
          );
          e.push(x);
          const L = (0, l.createTransparencyPropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                T.format({ title: s })
              ),
              transparency: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                D.format({ title: s })
              ),
            },
            { id: `${n}Background`, title: S }
          );
          e.push(L);
          const k = (0, l.createTwoOptionsPropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showLabels,
                w.format({ title: s })
              ),
              option1: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.horzLabelsAlign,
                _.format({ title: s })
              ),
              option2: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.vertLabelsAlign,
                _.format({ title: s })
              ),
            },
            {
              id: `${n}Labels`,
              title: m,
              optionsItems1: new (c())(C),
              optionsItems2: new (c())(b),
            }
          );
          return e.push(k), { definitions: e };
        }
      }
    },
    89478: (e, t, i) => {
      i.r(t), i.d(t, { FibWedgeDefinitionsViewModel: () => S });
      var o = i(50151),
        n = i(44352),
        r = i(36298),
        l = i(2908),
        s = i(28985),
        a = i(85766),
        c = i(94474),
        p = i(69152);
      const d = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(45463))
        ),
        u = new r.TranslatedString(
          'change {title} levels visibility',
          n.t(null, void 0, i(26710))
        ),
        h = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(85551))
        ),
        y = new r.TranslatedString(
          'change {title} level {index} line width',
          n.t(null, void 0, i(90098))
        ),
        f = new r.TranslatedString(
          'change {title} level {index} line coeff',
          n.t(null, void 0, i(32891))
        ),
        v = new r.TranslatedString(
          'change {title} all lines color',
          n.t(null, void 0, i(15521))
        ),
        g = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(64548))
        ),
        T = new r.TranslatedString(
          'change {title} background transparency',
          n.t(null, void 0, i(36438))
        ),
        D = n.t(null, void 0, i(4372)),
        w = n.t(null, void 0, i(12374)),
        _ = n.t(null, void 0, i(27331)),
        P = n.t(null, void 0, i(79106));
      class S extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, c.removeSpaces)(i),
            a = new r.TranslatedString(i, this._source.translatedType()),
            S = t.trendline.childs(),
            m = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              {
                showLine: S.visible,
                lineColor: S.color,
                lineWidth: S.linewidth,
              },
              a,
              'TrendLine',
              { line: D }
            );
          e.push(m);
          const b = this._source.levelsCount();
          for (let i = 1; i <= b; i++) {
            const o = t[`level${i}`].childs(),
              r = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.visible,
                    d.format({ title: a, index: i })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.color,
                    null,
                    h.format({ title: a, index: i })
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linewidth,
                    y.format({ title: a, index: i })
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.coeff,
                    f.format({ title: a, index: i })
                  ),
                },
                { id: `${n}LineLevel${i}` }
              );
            e.push(r);
          }
          const C = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new p.CollectibleColorPropertyUndoWrapper(
                  (0, o.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null
                ),
                null,
                v.format({ title: a }),
                !0
              ),
            },
            { id: `${n}AllLineColor`, title: w }
          );
          e.push(C);
          const x = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                g.format({ title: a })
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                T.format({ title: a })
              ),
            },
            { id: `${n}Background`, title: _ }
          );
          e.push(x);
          const L = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showCoeffs,
                u.format({ title: a })
              ),
            },
            { id: `${n}Levels`, title: P }
          );
          return e.push(L), { definitions: e };
        }
      }
    },
    42923: (e, t, i) => {
      i.r(t), i.d(t, { FlagMarkDefinitionsViewModel: () => c });
      var o = i(44352),
        n = i(36298),
        r = i(85766),
        l = i(28985);
      const s = new n.TranslatedString(
          'change flag color',
          o.t(null, void 0, i(72080))
        ),
        a = o.t(null, void 0, i(21524));
      class c extends r.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, l.createColorPropertyDefinition)(
                {
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.flagColor,
                    null,
                    s
                  ),
                },
                { id: 'FlagColor', title: a }
              ),
            ],
          };
        }
      }
    },
    85951: (e, t, i) => {
      i.r(t),
        i.d(t, {
          GannComplexAndFixedDefinitionsViewModel: () => R,
          isGannComplexLineTool: () => N,
        });
      var o = i(50151),
        n = i(44352),
        r = i(36298),
        l = i(50653),
        s = i(28985),
        a = i(85766),
        c = i(49809),
        p = i(58275),
        d = i.n(p),
        u = i(20345),
        h = i(94474),
        y = i(69152);
      const f = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(45463))
        ),
        v = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(85551))
        ),
        g = new r.TranslatedString(
          'change {title} level {index} line width',
          n.t(null, void 0, i(90098))
        ),
        T = new r.TranslatedString(
          'change {title} all lines color',
          n.t(null, void 0, i(15521))
        ),
        D = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(64548))
        ),
        w = new r.TranslatedString(
          'change {title} background transparency',
          n.t(null, void 0, i(36438))
        ),
        _ = new r.TranslatedString(
          'change {title} reverse',
          n.t(null, void 0, i(52877))
        ),
        P = new r.TranslatedString(
          'change {title} fan {index} line visibility',
          n.t(null, void 0, i(89126))
        ),
        S = new r.TranslatedString(
          'change {title} fan {index} line color',
          n.t(null, void 0, i(82516))
        ),
        m = new r.TranslatedString(
          'change {title} fan {index} line width',
          n.t(null, void 0, i(30016))
        ),
        b = new r.TranslatedString(
          'change {title} arcs {index} line visibility',
          n.t(null, void 0, i(13853))
        ),
        C = new r.TranslatedString(
          'change {title} arcs {index} line color',
          n.t(null, void 0, i(17466))
        ),
        x = new r.TranslatedString(
          'change {title} arcs {index} line width',
          n.t(null, void 0, i(72307))
        ),
        L = new r.TranslatedString(
          'change top margin',
          n.t(null, void 0, i(98905))
        ),
        k = n.t(null, void 0, i(24186)),
        A = n.t(null, void 0, i(12374)),
        $ = n.t(null, void 0, i(27331)),
        M = n.t(null, void 0, i(59771)),
        V = n.t(null, void 0, i(33886)),
        B = n.t(null, void 0, i(79106)),
        z = n.t(null, void 0, i(87931)),
        W = n.t(null, void 0, i(54189));
      function N(e) {
        return e instanceof c.LineToolGannComplex;
      }
      class R extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, h.removeSpaces)(i),
            a = new r.TranslatedString(i, this._source.translatedType()),
            c = [],
            p = t.levels.childCount();
          for (let e = 0; e < p; e++) {
            const i = t.levels.childs()[e].childs(),
              o = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    f.format({ title: a, index: e })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    v.format({ title: a, index: e })
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.width,
                    g.format({ title: a, index: e })
                  ),
                },
                { id: `${n}LineLevel${e}`, title: `${e}` }
              );
            c.push(o);
          }
          const R = (0, s.createPropertyDefinitionsLeveledLinesGroup)(
            c,
            `${n}LeveledLinesGroup`
          );
          e.push(
            (0, s.createPropertyDefinitionsGeneralGroup)(
              [R],
              `${n}LevelGroup`,
              B
            )
          );
          const G = [],
            E = t.fanlines.childCount();
          for (let e = 0; e < E; e++) {
            const i = t.fanlines.childs()[e].childs(),
              o = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    P.format({ title: a, index: e })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    S.format({ title: a, index: e })
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.width,
                    m.format({ title: a, index: e })
                  ),
                },
                {
                  id: `${n}FanLineLevel${e}`,
                  title: `${i.x.value()}x${i.y.value()}`,
                }
              );
            G.push(o);
          }
          const O = (0, s.createPropertyDefinitionsLeveledLinesGroup)(
            G,
            `${n}FanLeveledLinesGroup`
          );
          e.push(
            (0, s.createPropertyDefinitionsGeneralGroup)(
              [O],
              `${n}FanLinesGroup`,
              z
            )
          );
          const F = [],
            U = t.arcs.childCount();
          for (let e = 0; e < U; e++) {
            const i = t.arcs.childs()[e].childs(),
              o = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    b.format({ title: a, index: e })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    C.format({ title: a, index: e })
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.width,
                    x.format({ title: a, index: e })
                  ),
                },
                {
                  id: `${n}ArcsLineLevel${e}`,
                  title: `${i.x.value()}x${i.y.value()}`,
                }
              );
            F.push(o);
          }
          const I = (0, s.createPropertyDefinitionsLeveledLinesGroup)(
            F,
            `${n}ArcsLeveledLinesGroup`
          );
          e.push(
            (0, s.createPropertyDefinitionsGeneralGroup)(
              [I],
              `${n}ArcsLinesGroup`,
              W
            )
          );
          const H = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new y.CollectibleColorPropertyUndoWrapper(
                  (0, o.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  T.format({ title: a })
                ),
                null,
                null
              ),
            },
            { id: `${n}AllLineColor`, title: A }
          );
          e.push(H);
          const j = t.arcsBackground.childs(),
            Y = (0, s.createTransparencyPropertyDefinition)(
              {
                checked: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  j.fillBackground,
                  D.format({ title: a })
                ),
                transparency: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  j.transparency,
                  w.format({ title: a })
                ),
              },
              { id: `${n}Background`, title: $ }
            );
          e.push(Y);
          const X = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.reverse,
                _.format({ title: a })
              ),
            },
            { id: `${n}Reverse`, title: k }
          );
          if ((e.push(X), N(this._source))) {
            const t = this._source,
              i = t.properties().childs(),
              o = (0, s.createNumberPropertyDefinition)(
                {
                  value: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.scaleRatio,
                    L,
                    [
                      (0, u.limitedPrecision)(7),
                      (e) =>
                        null !== e
                          ? parseFloat(
                              t.getScaleRatioFormatter().format(`${e}`)
                            )
                          : null,
                    ]
                  ),
                },
                {
                  id: 'scaleRatio',
                  title: M,
                  min: new (d())(1e-7),
                  max: new (d())(1e8),
                  step: new (d())(t.getScaleRatioStep()),
                }
              );
            e.push(o);
            const n = i.labelsStyle.childs(),
              r = (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  showText: i.showLabels,
                  fontSize: n.fontSize,
                  bold: n.bold,
                  italic: n.italic,
                },
                a,
                { customTitles: { text: V } }
              );
            e.push(r);
          }
          return { definitions: e };
        }
      }
    },
    95399: (e, t, i) => {
      i.r(t), i.d(t, { GannFanDefinitionsViewModel: () => _ });
      var o = i(50151),
        n = i(44352),
        r = i(36298),
        l = i(28985),
        s = i(85766),
        a = i(94474),
        c = i(69152);
      const p = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(45463))
        ),
        d = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(85551))
        ),
        u = new r.TranslatedString(
          'change {title} level {index} line width',
          n.t(null, void 0, i(90098))
        ),
        h = new r.TranslatedString(
          'change {title} level {index} line style',
          n.t(null, void 0, i(47840))
        ),
        y = new r.TranslatedString(
          'change {title} all lines color',
          n.t(null, void 0, i(15521))
        ),
        f = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(64548))
        ),
        v = new r.TranslatedString(
          'change {title} background transparency',
          n.t(null, void 0, i(36438))
        ),
        g = new r.TranslatedString(
          'change {title} labels visibility',
          n.t(null, void 0, i(24338))
        ),
        T = n.t(null, void 0, i(12374)),
        D = n.t(null, void 0, i(27331)),
        w = n.t(null, void 0, i(94420));
      class _ extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, a.removeSpaces)(i),
            s = new r.TranslatedString(i, this._source.translatedType()),
            _ = this._source.levelsCount();
          for (let i = 1; i <= _; i++) {
            const o = t[`level${i}`].childs(),
              r = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.visible,
                    p.format({ title: s, index: i })
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.color,
                    null,
                    d.format({ title: s, index: i })
                  ),
                  width: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linewidth,
                    u.format({ title: s, index: i })
                  ),
                  style: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linestyle,
                    h.format({ title: s, index: i })
                  ),
                },
                {
                  id: `${n}LineLevel${i}`,
                  title: `${o.coeff1.value()}/${o.coeff2.value()}`,
                }
              );
            e.push(r);
          }
          const P = (0, l.createColorPropertyDefinition)(
            {
              color: (0, l.getColorDefinitionProperty)(
                this._propertyApplier,
                new c.CollectibleColorPropertyUndoWrapper(
                  (0, o.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null
                ),
                null,
                y.format({ title: s })
              ),
            },
            { id: `${n}AllLineColor`, title: T }
          );
          e.push(P);
          const S = (0, l.createTransparencyPropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                f.format({ title: s })
              ),
              transparency: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                v.format({ title: s })
              ),
            },
            {
              id: `${n}Background`,
              title: D,
            }
          );
          e.push(S);
          const m = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.showLabels,
                g.format({ title: s })
              ),
            },
            { id: `${n}Labels`, title: w }
          );
          return e.push(m), { definitions: e };
        }
      }
    },
    41854: (e, t, i) => {
      i.r(t), i.d(t, { GannSquareDefinitionsViewModel: () => V });
      var o = i(50151),
        n = i(44352),
        r = i(36298),
        l = i(28985),
        s = i(85766),
        a = i(94474),
        c = i(69152);
      const p = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(45463))
        ),
        d = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(85551))
        ),
        u = new r.TranslatedString(
          'change {title} level {index} line coeff',
          n.t(null, void 0, i(32891))
        ),
        h = new r.TranslatedString(
          'change {title} all lines color',
          n.t(null, void 0, i(15521))
        ),
        y = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(64548))
        ),
        f = new r.TranslatedString(
          'change {title} background transparency',
          n.t(null, void 0, i(36438))
        ),
        v = new r.TranslatedString(
          'change {title} reverse',
          n.t(null, void 0, i(52877))
        ),
        g = new r.TranslatedString(
          'change {title} left labels visibility',
          n.t(null, void 0, i(2359))
        ),
        T = new r.TranslatedString(
          'change {title} right labels visibility',
          n.t(null, void 0, i(16598))
        ),
        D = new r.TranslatedString(
          'change {title} top labels visibility',
          n.t(null, void 0, i(73137))
        ),
        w = new r.TranslatedString(
          'change {title} bottom labels visibility',
          n.t(null, void 0, i(15802))
        ),
        _ = new r.TranslatedString(
          'change {title} fans visibility',
          n.t(null, void 0, i(78142))
        ),
        P = new r.TranslatedString(
          'change {title} fans line color',
          n.t(null, void 0, i(79467))
        ),
        S = n.t(null, void 0, i(12374)),
        m = n.t(null, void 0, i(27331)),
        b = n.t(null, void 0, i(16103)),
        C = n.t(null, void 0, i(77838)),
        x = n.t(null, void 0, i(79307)),
        L = n.t(null, void 0, i(91367)),
        k = n.t(null, void 0, i(10209)),
        A = n.t(null, void 0, i(17608)),
        $ = n.t(null, void 0, i(38280)),
        M = n.t(null, void 0, i(24186));
      class V extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, a.removeSpaces)(i),
            s = new r.TranslatedString(i, this._source.translatedType()),
            V = [],
            B = this._source.hLevelsCount();
          for (let e = 1; e <= B; e++) {
            const i = t[`hlevel${e}`].childs(),
              o = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    p.format({ title: s, index: e })
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    d.format({ title: s, index: e })
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    u.format({ title: s, index: e })
                  ),
                },
                { id: `${n}HLineLevel${e}` }
              );
            V.push(o);
          }
          const z = (0, l.createPropertyDefinitionsLeveledLinesGroup)(
              V,
              `${n}HLeveledLinesGroup`
            ),
            W = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showLeftLabels,
                  g.format({ title: s })
                ),
              },
              { id: `${n}LeftLabels`, title: x }
            ),
            N = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showRightLabels,
                  T.format({ title: s })
                ),
              },
              { id: `${n}RightLabels`, title: L }
            ),
            R = (0, l.createTransparencyPropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.fillHorzBackground,
                  y.format({ title: s })
                ),
                transparency: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.horzTransparency,
                  f.format({ title: s })
                ),
              },
              { id: `${n}BackgroundH`, title: m }
            ),
            G = (0, l.createPropertyDefinitionsGeneralGroup)(
              [z, W, N, R],
              `${n}HLevelGroup`,
              b
            );
          e.push(G);
          const E = [],
            O = this._source.vLevelsCount();
          for (let e = 1; e <= O; e++) {
            const i = t[`vlevel${e}`].childs(),
              o = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    p.format({ title: s, index: e })
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    d.format({ title: s, index: e })
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    u.format({ title: s, index: e })
                  ),
                },
                { id: `${n}VLineLevel${e}` }
              );
            E.push(o);
          }
          const F = (0, l.createPropertyDefinitionsLeveledLinesGroup)(
              E,
              `${n}VLeveledLinesGroup`
            ),
            U = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showTopLabels,
                  D.format({ title: s })
                ),
              },
              { id: `${n}TopLabels`, title: k }
            ),
            I = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showBottomLabels,
                  w.format({ title: s })
                ),
              },
              { id: `${n}BottomLabels`, title: A }
            ),
            H = (0, l.createTransparencyPropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.fillVertBackground,
                  y.format({ title: s })
                ),
                transparency: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.vertTransparency,
                  f.format({ title: s })
                ),
              },
              { id: `${n}BackgroundV`, title: m }
            ),
            j = (0, l.createPropertyDefinitionsGeneralGroup)(
              [F, U, I, H],
              `${n}VLevelGroup`,
              C
            );
          e.push(j);
          const Y = (0, l.createColorPropertyDefinition)(
            {
              color: (0, l.getColorDefinitionProperty)(
                this._propertyApplier,
                new c.CollectibleColorPropertyUndoWrapper(
                  (0, o.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null
                ),
                null,
                h.format({ title: s }),
                !0
              ),
            },
            { id: `${n}AllLineColor`, title: S }
          );
          e.push(Y);
          const X = t.fans.childs(),
            q = (0, l.createColorPropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  X.visible,
                  _.format({ title: s })
                ),
                color: (0, l.getColorDefinitionProperty)(
                  this._propertyApplier,
                  X.color,
                  null,
                  P.format({ title: s })
                ),
              },
              { id: `${n}FansLines`, title: $ }
            );
          e.push(q);
          const J = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.reverse,
                v.format({ title: s })
              ),
            },
            { id: `${n}Reverse`, title: M }
          );
          return e.push(J), { definitions: e };
        }
      }
    },
    84070: (e, t, i) => {
      i.r(t), i.d(t, { GeneralBezierDefinitionsViewModel: () => u });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(85766),
        s = i(28985),
        a = i(94474);
      const c = new n.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(64548))
        ),
        p = new n.TranslatedString(
          'change {title} background color',
          o.t(null, void 0, i(75312))
        ),
        d = o.t(null, void 0, i(27331));
      class u extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._undoModel,
                {
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                  lineStyle: e.linestyle,
                  extendLeft: e.extendLeft,
                  extendRight: e.extendRight,
                  leftEnd: e.leftEnd,
                  rightEnd: e.rightEnd,
                },
                i,
                'Line'
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._undoModel,
                    e.fillBackground,
                    c.format({ title: i })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._undoModel,
                    e.backgroundColor,
                    e.transparency,
                    p.format({ title: i })
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}BackgroundColor`), title: d }
              ),
            ],
          };
        }
      }
    },
    83115: (e, t, i) => {
      i.r(t), i.d(t, { GeneralDatePriceRangeDefinitionsViewModel: () => b });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(50653),
        s = i(85766),
        a = i(28985),
        c = i(94474);
      const p = new n.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(64548))
        ),
        d = new n.TranslatedString(
          'change {title} background color',
          o.t(null, void 0, i(75312))
        ),
        u = new n.TranslatedString(
          'change {title} extend top',
          o.t(null, void 0, i(896))
        ),
        h = new n.TranslatedString(
          'change {title} extend bottom',
          o.t(null, void 0, i(1447))
        ),
        y = new n.TranslatedString(
          'change {title} extend left',
          o.t(null, void 0, i(15258))
        ),
        f = o.t(null, void 0, i(1277)),
        v = o.t(null, void 0, i(48848)),
        g = o.t(null, void 0, i(27331)),
        T = o.t(null, void 0, i(85197)),
        D = o.t(null, void 0, i(71116)),
        w = o.t(null, void 0, i(45809)),
        _ = o.t(null, void 0, i(14025)),
        P = o.t(null, void 0, i(85206)),
        S = o.t(null, void 0, i(14773)),
        m = o.t(null, void 0, i(37229));
      class b extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            o = (0, c.removeSpaces)(i),
            s = new n.TranslatedString(i, this._source.translatedType()),
            m = (0, r.createLineStyleDefinition)(
              this._propertyApplier,
              { lineColor: t.linecolor, lineWidth: t.linewidth },
              s,
              'Line',
              { line: f }
            );
          if ((e.push(m), t.hasOwnProperty('borderWidth'))) {
            const i = (0, r.createLineStyleDefinition)(
              this._propertyApplier,
              {
                showLine: t.drawBorder,
                lineColor: t.borderColor,
                lineWidth: t.borderWidth,
              },
              s,
              'Border',
              { line: v }
            );
            e.push(i);
          }
          const b = (0, a.createColorPropertyDefinition)(
            {
              checked: (0, a.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                p.format({ title: s })
              ),
              color: (0, a.getColorDefinitionProperty)(
                this._propertyApplier,
                t.backgroundColor,
                t.backgroundTransparency,
                d.format({ title: s })
              ),
            },
            { id: `${o}BackgroundColor`, title: g }
          );
          if (
            (e.push(b),
            (function (e) {
              return e.hasOwnProperty('extendTop');
            })(t))
          ) {
            const i = (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.extendTop,
                    u.format({ title: s })
                  ),
                },
                { id: `${o}ExtendTop`, title: T }
              ),
              n = (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.extendBottom,
                    h.format({ title: s })
                  ),
                },
                { id: `${o}ExtendBottom`, title: D }
              );
            e.push(i, n);
          }
          if (
            (function (e) {
              return e.hasOwnProperty('extendLeft');
            })(t)
          ) {
            const i = (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.extendLeft,
                    y.format({ title: s })
                  ),
                },
                { id: `${o}extendLeft`, title: w }
              ),
              n = (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.extendRight,
                    h.format({ title: s })
                  ),
                },
                { id: `${o}ExtendBottom`, title: _ }
              );
            e.push(i, n);
          }
          const C = (0, l.createTextStyleDefinition)(
            this._propertyApplier,
            {
              textColor: t.textcolor,
              backgroundColor: t.labelBackgroundColor,
              backgroundTransparency: t.backgroundTransparency,
              fontSize: t.fontsize,
              backgroundVisible: t.fillLabelBackground,
            },
            s,
            {
              isEditable: !0,
              isMultiLine: !0,
              customTitles: { text: P, backgroundTitle: S },
            }
          );
          return e.push(C), { definitions: e };
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs().customText.childs();
          return {
            definitions: [
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.visible,
                  textColor: e.color,
                  fontSize: e.fontsize,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: m } }
              ),
            ],
          };
        }
      }
    },
    20061: (e, t, i) => {
      i.r(t),
        i.d(t, {
          GeneralFiguresDefinitionsViewModel: () => y,
          GeneralFiguresDefinitionsViewModelBase: () => h,
        });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(85766),
        s = i(28985),
        a = i(94474);
      const c = new n.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(64548))
        ),
        p = new n.TranslatedString(
          'change {title} background color',
          o.t(null, void 0, i(75312))
        ),
        d = o.t(null, void 0, i(48848)),
        u = o.t(null, void 0, i(27331));
      class h extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType()),
            o = (0, r.createLineStyleDefinition)(
              this._propertyApplier,
              { lineColor: e.color, lineWidth: e.linewidth },
              i,
              'Line',
              { line: d }
            ),
            l = 'transparency' in e ? e.transparency : null;
          return {
            definitions: [
              o,
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    c.format({ title: i })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    l,
                    p.format({ title: i })
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}BackgroundColor`), title: u }
              ),
            ],
          };
        }
      }
      class y extends h {}
    },
    28578: (e, t, i) => {
      i.r(t), i.d(t, { GeneralTrendFiguresDefinitionsViewModel: () => y });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(50653),
        s = i(85766),
        a = i(28985),
        c = i(94474);
      const p = new n.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(64548))
        ),
        d = new n.TranslatedString(
          'change {title} background color',
          o.t(null, void 0, i(75312))
        ),
        u = o.t(null, void 0, i(29072)),
        h = o.t(null, void 0, i(27331));
      class y extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                  lineStyle: e.linestyle,
                },
                i,
                'Line'
              ),
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  showText: e.showPrices,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                i,
                { customTitles: { text: u } }
              ),
              (0, a.createColorPropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    p.format({ title: i })
                  ),
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    d.format({ title: i })
                  ),
                },
                { id: (0, c.removeSpaces)(`${t}Background`), title: h }
              ),
            ],
          };
        }
      }
    },
    52266: (e, t, i) => {
      i.r(t), i.d(t, { GhostFeedDefinitionsViewModel: () => C });
      var o = i(44352),
        n = i(36298),
        r = i(85766),
        l = i(28985),
        s = i(58275),
        a = i.n(s),
        c = i(94474);
      const p = new n.TranslatedString(
          'change {title} candle up color',
          o.t(null, void 0, i(42273))
        ),
        d = new n.TranslatedString(
          'change {title} candle down color',
          o.t(null, void 0, i(38742))
        ),
        u = new n.TranslatedString(
          'change {title} candle border visibility',
          o.t(null, void 0, i(28146))
        ),
        h = new n.TranslatedString(
          'change {title} candle border up color',
          o.t(null, void 0, i(550))
        ),
        y = new n.TranslatedString(
          'change {title} candle border down color',
          o.t(null, void 0, i(7373))
        ),
        f = new n.TranslatedString(
          'change {title} candle wick visibility',
          o.t(null, void 0, i(27029))
        ),
        v = new n.TranslatedString(
          'change {title} candle wick color',
          o.t(null, void 0, i(76054))
        ),
        g = new n.TranslatedString(
          'change {title} transparency',
          o.t(null, void 0, i(84321))
        ),
        T = new n.TranslatedString(
          'change {title} average HL value',
          o.t(null, void 0, i(78680))
        ),
        D = new n.TranslatedString(
          'change {title} variance value',
          o.t(null, void 0, i(12355))
        ),
        w = o.t(null, void 0, i(63528)),
        _ = o.t(null, void 0, i(72269)),
        P = o.t(null, void 0, i(26458)),
        S = o.t(null, void 0, i(2295)),
        m = o.t(null, void 0, i(34674)),
        b = o.t(null, void 0, i(25227));
      class C extends r.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, c.removeSpaces)(t),
            o = new n.TranslatedString(t, this._source.translatedType()),
            r = e.candleStyle.childs();
          return {
            definitions: [
              (0, l.createTwoColorsPropertyDefinition)(
                {
                  color1: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.upColor,
                    null,
                    p.format({ title: o })
                  ),
                  color2: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.downColor,
                    null,
                    d.format({ title: o })
                  ),
                },
                { id: `${i}Candle2Colors`, title: w }
              ),
              (0, l.createTwoColorsPropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.drawBorder,
                    u.format({ title: o })
                  ),
                  color1: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.borderUpColor,
                    null,
                    h.format({ title: o })
                  ),
                  color2: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.borderDownColor,
                    null,
                    y.format({ title: o })
                  ),
                },
                { id: `${i}CandleBorder2Colors`, title: _ }
              ),
              (0, l.createColorPropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.drawWick,
                    f.format({ title: o })
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.wickColor,
                    null,
                    v.format({ title: o })
                  ),
                },
                { id: `${i}CandleWickColor`, title: P }
              ),
              (0, l.createTransparencyPropertyDefinition)(
                {
                  transparency: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.transparency,
                    g.format({ title: o })
                  ),
                },
                { id: `${i}Transparency`, title: S }
              ),
            ],
          };
        }
        _inputsPropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, c.removeSpaces)(t),
            o = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, l.createNumberPropertyDefinition)(
                {
                  value: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.averageHL,
                    T.format({ title: o })
                  ),
                },
                {
                  id: `${i}AvgHL`,
                  title: m,
                  type: 0,
                  min: new (a())(1),
                  max: new (a())(5e4),
                  step: new (a())(1),
                }
              ),
              (0, l.createNumberPropertyDefinition)(
                {
                  value: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.variance,
                    D.format({ title: o })
                  ),
                },
                {
                  id: `${i}Variance`,
                  title: b,
                  type: 0,
                  min: new (a())(1),
                  max: new (a())(100),
                  step: new (a())(1),
                }
              ),
            ],
          };
        }
      }
    },
    63138: (e, t, i) => {
      i.r(t), i.d(t, { HighlighterDefinitionsViewModel: () => l });
      var o = i(2908),
        n = i(85766),
        r = i(36298);
      class l extends n.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor },
                new r.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                'Line'
              ),
            ],
          };
        }
      }
    },
    55252: (e, t, i) => {
      i.r(t), i.d(t, { HorizontalLineDefinitionsViewModel: () => h });
      var o = i(44352),
        n = i(36298),
        r = i(28985),
        l = i(41339),
        s = i(94474),
        a = i(85766),
        c = i(86778),
        p = i(50653);
      const d = o.t(null, void 0, i(37229)),
        u = o.t(null, { context: 'linetool point' }, i(1961));
      class h extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs();
          return (0, c.getLinesStylesPropertiesDefinitions)(
            this._propertyApplier,
            e,
            new n.TranslatedString(
              this._source.name(),
              this._source.translatedType()
            )
          );
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.pointsProperty().childs().points[0].childs(),
            t = this._getYCoordinateStepWV(),
            i = (0, l.getCoordinateYMetaInfo)(this._propertyApplier, e, t);
          return {
            definitions: [
              (0, r.createCoordinatesPropertyDefinition)(
                { y: i.property },
                {
                  id: (0, s.removeSpaces)(`${this._source.name()}Point`),
                  title: u,
                  ...i.info,
                }
              ),
            ],
          };
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, p.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  textOrientation: e.textOrientation,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: d } }
              ),
            ],
          };
        }
      }
    },
    15574: (e, t, i) => {
      i.r(t), i.d(t, { HorizontalRayDefinitionsViewModel: () => c });
      var o = i(44352),
        n = i(36298),
        r = i(85766),
        l = i(86778),
        s = i(50653);
      const a = o.t(null, void 0, i(37229));
      class c extends r.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs();
          return (0, l.getLinesStylesPropertiesDefinitions)(
            this._propertyApplier,
            e,
            new n.TranslatedString(
              this._source.name(),
              this._source.translatedType()
            )
          );
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, s.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  textOrientation: e.textOrientation,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: a } }
              ),
            ],
          };
        }
      }
    },
    53284: (e, t, i) => {
      i.r(t), i.d(t, { IconsDefinitionsViewModel: () => p });
      var o = i(44352),
        n = i(36298),
        r = i(85766),
        l = i(28985),
        s = i(94474);
      const a = new n.TranslatedString(
          'change {title} color',
          o.t(null, void 0, i(20216))
        ),
        c = o.t(null, void 0, i(40054));
      class p extends r.LineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t);
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, l.createColorPropertyDefinition)(
                {
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color,
                    null,
                    a.format({ title: i })
                  ),
                },
                { id: (0, s.removeSpaces)(`${t}Color`), title: c }
              ),
            ],
          };
        }
      }
    },
    77420: (e, t, i) => {
      i.r(t), i.d(t, { NoteDefinitionsViewModel: () => d });
      var o = i(44352),
        n = i(36298),
        r = i(50653),
        l = i(85766),
        s = i(28985),
        a = i(94474);
      const c = new n.TranslatedString(
          'change {title} background color',
          o.t(null, void 0, i(75312))
        ),
        p = o.t(null, void 0, i(85206));
      class d extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.markerColor,
                    null,
                    c.format({ title: i })
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}LabelColor`), title: p }
              ),
            ],
          };
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, r.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.textColor,
                  fontSize: e.fontSize,
                  bold: e.bold,
                  italic: e.italic,
                  text: e.text,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.backgroundTransparency,
                  borderColor: e.borderColor,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0 }
              ),
            ],
          };
        }
      }
    },
    21905: (e, t, i) => {
      i.r(t), i.d(t, { ParallelChannelDefinitionsViewModel: () => T });
      var o = i(44352),
        n = i(36298),
        r = i(28985),
        l = i(85766),
        s = i(2908),
        a = i(94474);
      const c = new n.TranslatedString(
          'change {title} extending left',
          o.t(null, void 0, i(3708))
        ),
        p = new n.TranslatedString(
          'change {title} extending right',
          o.t(null, void 0, i(52889))
        ),
        d = new n.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(64548))
        ),
        u = new n.TranslatedString(
          'change {title} background color',
          o.t(null, void 0, i(75312))
        ),
        h = o.t(null, void 0, i(27331)),
        y = o.t(null, void 0, i(25892)),
        f = o.t(null, void 0, i(74395)),
        v = o.t(null, void 0, i(99120)),
        g = o.t(null, void 0, i(76476));
      class T extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, a.removeSpaces)(t),
            o = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, s.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.linecolor,
                  lineStyle: e.linestyle,
                  lineWidth: e.linewidth,
                },
                o,
                'ChannelLine',
                { line: v }
              ),
              (0, s.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  showLine: e.showMidline,
                  lineColor: e.midlinecolor,
                  lineStyle: e.midlinestyle,
                  lineWidth: e.midlinewidth,
                },
                o,
                'MiddleLine',
                { line: g }
              ),
              (0, r.createCheckablePropertyDefinition)(
                {
                  checked: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.extendLeft,
                    c.format({ title: o })
                  ),
                },
                { id: `${i}ExtendLeft`, title: y }
              ),
              (0, r.createCheckablePropertyDefinition)(
                {
                  checked: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.extendRight,
                    p.format({ title: o })
                  ),
                },
                { id: `${i}ExtendRight`, title: f }
              ),
              (0, r.createColorPropertyDefinition)(
                {
                  checked: (0, r.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    d.format({ title: o })
                  ),
                  color: (0, r.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    u.format({ title: o })
                  ),
                },
                { id: `${i}Background`, title: h }
              ),
            ],
          };
        }
      }
    },
    74481: (e, t, i) => {
      i.r(t), i.d(t, { PathDefinitionsViewModel: () => a });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(85766);
      const s = o.t(null, void 0, i(1277));
      class a extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.lineColor,
                  lineWidth: e.lineWidth,
                  lineStyle: e.lineStyle,
                  leftEnd: e.leftEnd,
                  rightEnd: e.rightEnd,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                'Line',
                { line: s }
              ),
            ],
          };
        }
      }
    },
    25107: (e, t, i) => {
      i.r(t), i.d(t, { PatternWithBackgroundDefinitionViewModel: () => f });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(50653),
        s = i(85766),
        a = i(28985),
        c = i(94474);
      const p = new n.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(64548))
        ),
        d = new n.TranslatedString(
          'change {title} background color',
          o.t(null, void 0, i(75312))
        ),
        u = o.t(null, void 0, i(85206)),
        h = o.t(null, void 0, i(48848)),
        y = o.t(null, void 0, i(27331));
      class f extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                i,
                { isEditable: !0, isMultiLine: !0, customTitles: { text: u } }
              ),
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.color, lineWidth: e.linewidth },
                i,
                'Line',
                { line: h }
              ),
              (0, a.createColorPropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    p.format({ title: i })
                  ),
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    d.format({ title: i })
                  ),
                },
                { id: (0, c.removeSpaces)(`${t}BackgroundColor`), title: y }
              ),
            ],
          };
        }
      }
    },
    63311: (e, t, i) => {
      i.r(t), i.d(t, { PatternWithoutBackgroundDefinitionsViewModel: () => p });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(50653),
        s = i(85766);
      const a = o.t(null, void 0, i(85206)),
        c = o.t(null, void 0, i(48848));
      class p extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = new n.TranslatedString(
              this._source.name(),
              this._source.translatedType()
            );
          return {
            definitions: [
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                t,
                { isEditable: !0, isMultiLine: !0, customTitles: { text: a } }
              ),
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.color, lineWidth: e.linewidth },
                t,
                'Line',
                { line: c }
              ),
            ],
          };
        }
      }
    },
    81658: (e, t, i) => {
      i.r(t), i.d(t, { PitchBaseDefinitionsViewModel: () => m });
      var o = i(50151),
        n = i(44352),
        r = i(36298),
        l = i(2908),
        s = i(85766),
        a = i(28985),
        c = i(94474),
        p = i(69152);
      const d = new r.TranslatedString(
          'change {title} extend lines',
          n.t(null, void 0, i(96902))
        ),
        u = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(45463))
        ),
        h = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(85551))
        ),
        y = new r.TranslatedString(
          'change {title} level {index} line width',
          n.t(null, void 0, i(90098))
        ),
        f = new r.TranslatedString(
          'change {title} level {index} line style',
          n.t(null, void 0, i(47840))
        ),
        v = new r.TranslatedString(
          'change {title} level {index} line coeff',
          n.t(null, void 0, i(32891))
        ),
        g = new r.TranslatedString(
          'change {title} all lines color',
          n.t(null, void 0, i(15521))
        ),
        T = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(64548))
        ),
        D = new r.TranslatedString(
          'change {title} background transparency',
          n.t(null, void 0, i(36438))
        ),
        w = n.t(null, { context: 'study' }, i(66187)),
        _ = n.t(null, void 0, i(12374)),
        P = n.t(null, void 0, i(27331)),
        S = n.t(null, void 0, i(13611));
      class m extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties(),
            i = t.childs(),
            n = this._source.name(),
            s = (0, c.removeSpaces)(n),
            m = new r.TranslatedString(n, this._source.translatedType());
          t.hasChild('extendLines') &&
            e.push(
              (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.extendLines,
                    d.format({ title: m })
                  ),
                },
                { id: `${s}ExtendLines`, title: S }
              )
            );
          const b = i.median.childs(),
            C = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              {
                lineColor: b.color,
                lineStyle: b.linestyle,
                lineWidth: b.linewidth,
              },
              m,
              'Median',
              { line: w }
            );
          e.push(C);
          const x = this._source.levelsCount();
          for (let t = 0; t <= x; t++) {
            const o = i[`level${t}`].childs(),
              n = (0, a.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.visible,
                    u.format({ title: m, index: t + 1 })
                  ),
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.color,
                    null,
                    h.format({ title: m, index: t + 1 })
                  ),
                  width: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linewidth,
                    y.format({ title: m, index: t + 1 })
                  ),
                  style: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.linestyle,
                    f.format({ title: m, index: t + 1 })
                  ),
                  level: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.coeff,
                    v.format({ title: m, index: t + 1 })
                  ),
                },
                { id: `${s}LineLevel${t + 1}` }
              );
            e.push(n);
          }
          const L = (0, a.createColorPropertyDefinition)(
            {
              color: (0, a.getColorDefinitionProperty)(
                this._propertyApplier,
                new p.CollectibleColorPropertyUndoWrapper(
                  (0, o.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null
                ),
                null,
                g.format({ title: m }),
                !0
              ),
            },
            { id: `${s}AllLineColor`, title: _ }
          );
          e.push(L);
          const k = (0, a.createTransparencyPropertyDefinition)(
            {
              checked: (0, a.convertToDefinitionProperty)(
                this._propertyApplier,
                i.fillBackground,
                T.format({ title: m })
              ),
              transparency: (0, a.convertToDefinitionProperty)(
                this._propertyApplier,
                i.transparency,
                D.format({ title: m })
              ),
            },
            { id: `${s}Background`, title: P }
          );
          return e.push(k), { definitions: e };
        }
      }
    },
    769: (e, t, i) => {
      i.r(t), i.d(t, { PitchForkDefinitionsViewModel: () => h });
      var o = i(44352),
        n = i(36298),
        r = i(28985),
        l = i(81658),
        s = i(90095),
        a = i(58275),
        c = i.n(a);
      const p = new n.TranslatedString(
          'change {title} style',
          o.t(null, void 0, i(74428))
        ),
        d = o.t(null, void 0, i(32733)),
        u = [
          {
            value: s.LineToolPitchforkStyle.Original,
            title: o.t(null, void 0, i(25595)),
          },
          {
            value: s.LineToolPitchforkStyle.Schiff2,
            title: o.t(null, void 0, i(51464)),
          },
          {
            value: s.LineToolPitchforkStyle.Schiff,
            title: o.t(null, void 0, i(66276)),
          },
          {
            value: s.LineToolPitchforkStyle.Inside,
            title: o.t(null, void 0, i(9114)),
          },
        ];
      class h extends l.PitchBaseDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = super._stylePropertyDefinitions(),
            t = this._source.properties().childs(),
            i = this._source.name(),
            o = new n.TranslatedString(i, this._source.translatedType()),
            l = (0, r.createOptionsPropertyDefinition)(
              {
                option: (0, r.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.style,
                  p.format({ title: o })
                ),
              },
              { id: `${i}PitchStyle`, title: d, options: new (c())(u) }
            );
          return e.definitions.push(l), e;
        }
      }
    },
    62890: (e, t, i) => {
      i.r(t), i.d(t, { PolylinesDefinitionsViewModel: () => h });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(85766),
        s = i(28985),
        a = i(94474);
      const c = new n.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(64548))
        ),
        p = new n.TranslatedString(
          'change {title} background color',
          o.t(null, void 0, i(75312))
        ),
        d = o.t(null, void 0, i(48848)),
        u = o.t(null, void 0, i(27331));
      class h extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor, lineWidth: e.linewidth },
                i,
                'Line',
                { line: d }
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    c.format({ title: i })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    p.format({ title: i })
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}BackgroundColor`), title: u }
              ),
            ],
          };
        }
      }
    },
    54440: (e, t, i) => {
      i.r(t), i.d(t, { PredictionDefinitionsViewModel: () => k });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(85766),
        s = i(28985),
        a = i(94474);
      const c = new n.TranslatedString(
          'change {title} source text color',
          o.t(null, void 0, i(42286))
        ),
        p = new n.TranslatedString(
          'change {title} source background color',
          o.t(null, void 0, i(18544))
        ),
        d = new n.TranslatedString(
          'change {title} source border color',
          o.t(null, void 0, i(48035))
        ),
        u = new n.TranslatedString(
          'change {title} target text color',
          o.t(null, void 0, i(27634))
        ),
        h = new n.TranslatedString(
          'change {title} target background color',
          o.t(null, void 0, i(52387))
        ),
        y = new n.TranslatedString(
          'change {title} target border color',
          o.t(null, void 0, i(6921))
        ),
        f = new n.TranslatedString(
          'change {title} success text color',
          o.t(null, void 0, i(88383))
        ),
        v = new n.TranslatedString(
          'change {title} success background color',
          o.t(null, void 0, i(26967))
        ),
        g = new n.TranslatedString(
          'change {title} failure text color',
          o.t(null, void 0, i(3156))
        ),
        T = new n.TranslatedString(
          'change {title} failure background color',
          o.t(null, void 0, i(49885))
        ),
        D = o.t(null, void 0, i(79238)),
        w = o.t(null, void 0, i(22213)),
        _ = o.t(null, void 0, i(15500)),
        P = o.t(null, void 0, i(74289)),
        S = o.t(null, void 0, i(98001)),
        m = o.t(null, void 0, i(89258)),
        b = o.t(null, void 0, i(69835)),
        C = o.t(null, void 0, i(91141)),
        x = o.t(null, void 0, i(31343)),
        L = o.t(null, void 0, i(28565));
      class k extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, a.removeSpaces)(t),
            o = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor, lineWidth: e.linewidth },
                o,
                'Line'
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.sourceTextColor,
                    null,
                    c.format({ title: o })
                  ),
                },
                { id: `${i}SourceTextColor`, title: D }
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.sourceBackColor,
                    e.transparency,
                    p.format({ title: o })
                  ),
                },
                { id: `${i}SourceBackgroundColor`, title: w }
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.sourceStrokeColor,
                    null,
                    d.format({ title: o })
                  ),
                },
                { id: `${i}SourceBorderColor`, title: _ }
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.targetTextColor,
                    null,
                    u.format({ title: o })
                  ),
                },
                { id: `${i}TargetTextColor`, title: P }
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.targetBackColor,
                    null,
                    h.format({ title: o })
                  ),
                },
                { id: `${i}TargetBackgroundColor`, title: S }
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.targetStrokeColor,
                    null,
                    y.format({ title: o })
                  ),
                },
                { id: `${i}TargetBorderColor`, title: m }
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.successTextColor,
                    null,
                    f.format({ title: o })
                  ),
                },
                { id: `${i}SuccessTextColor`, title: b }
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.successBackground,
                    null,
                    v.format({ title: o })
                  ),
                },
                { id: `${i}SuccessBackgroundColor`, title: C }
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.failureTextColor,
                    null,
                    g.format({ title: o })
                  ),
                },
                { id: `${i}FailureTextColor`, title: x }
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.failureBackground,
                    null,
                    T.format({ title: o })
                  ),
                },
                { id: `${i}FailureBackgroundColor`, title: L }
              ),
            ],
          };
        }
      }
    },
    17265: (e, t, i) => {
      i.r(t), i.d(t, { PriceLabelDefinitionsViewModel: () => a });
      var o = i(44352),
        n = i(36298),
        r = i(50653),
        l = i(85766);
      const s = o.t(null, void 0, i(37229));
      class a extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, r.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.color,
                  fontSize: e.fontsize,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.transparency,
                  borderColor: e.borderColor,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { customTitles: { text: s } }
              ),
            ],
          };
        }
      }
    },
    11980: (e, t, i) => {
      i.r(t), i.d(t, { PriceNoteDefinitionsViewModel: () => f });
      var o = i(44352),
        n = i(36298),
        r = i(50653),
        l = i(85766),
        s = i(28985),
        a = i(94474);
      const c = new n.TranslatedString(
          'change {title} line color',
          o.t(null, void 0, i(20563))
        ),
        p = o.t(null, void 0, i(37126)),
        d = o.t(null, void 0, i(37229)),
        u = o.t(null, void 0, i(60489)),
        h = o.t(null, void 0, i(75332)),
        y = o.t(null, void 0, i(14773));
      class f extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, a.removeSpaces)(t),
            o = new n.TranslatedString(t, this._source.translatedType()),
            l = (0, s.createColorPropertyDefinition)(
              {
                color: (0, s.getColorDefinitionProperty)(
                  this._propertyApplier,
                  e.lineColor,
                  null,
                  c.format({ title: o })
                ),
              },
              { id: `${i}LineColor`, title: u }
            );
          return {
            definitions: [
              (0, r.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.priceLabelTextColor,
                  fontSize: e.priceLabelFontSize,
                  bold: e.priceLabelBold,
                  italic: e.priceLabelItalic,
                  backgroundColor: e.priceLabelBackgroundColor,
                  borderColor: e.priceLabelBorderColor,
                },
                o,
                {
                  isEditable: !1,
                  isMultiLine: !1,
                  customTitles: { text: p, borderTitle: h, backgroundTitle: y },
                }
              ),
              l,
            ],
          };
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, r.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textColor,
                  fontSize: e.fontSize,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: d } }
              ),
            ],
          };
        }
      }
    },
    12501: (e, t, i) => {
      i.r(t), i.d(t, { ProjectionDefinitionsViewModel: () => h });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(85766),
        s = i(28985),
        a = i(94474);
      const c = new n.TranslatedString(
          'change {title} background color 1',
          o.t(null, void 0, i(39651))
        ),
        p = new n.TranslatedString(
          'change {title} background color 2',
          o.t(null, void 0, i(78177))
        ),
        d = o.t(null, void 0, i(48848)),
        u = o.t(null, void 0, i(27331));
      class h extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, s.createTwoColorsPropertyDefinition)(
                {
                  color1: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color1,
                    e.transparency,
                    c.format({ title: i })
                  ),
                  color2: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color2,
                    e.transparency,
                    p.format({ title: i })
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}Background2Color`), title: u }
              ),
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.trendline.childs().color,
                  lineWidth: e.linewidth,
                },
                i,
                'Line',
                { line: d }
              ),
            ],
          };
        }
      }
    },
    3664: (e, t, i) => {
      i.r(t), i.d(t, { RectangleDefinitionsViewModel: () => y });
      var o = i(44352),
        n = i(36298),
        r = i(28985),
        l = i(20061),
        s = i(50653);
      const a = new n.TranslatedString(
          'change {title} extending left',
          o.t(null, void 0, i(3708))
        ),
        c = new n.TranslatedString(
          'change {title} extending right',
          o.t(null, void 0, i(52889))
        ),
        p = o.t(null, void 0, i(37229)),
        d = o.t(null, void 0, i(45809)),
        u = o.t(null, void 0, i(14025)),
        h = [
          { value: 'bottom', title: o.t(null, void 0, i(65994)) },
          { value: 'middle', title: o.t(null, void 0, i(9114)) },
          { value: 'top', title: o.t(null, void 0, i(91757)) },
        ];
      class y extends l.GeneralFiguresDefinitionsViewModelBase {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType()),
            o = super._stylePropertyDefinitions(),
            l = (0, r.createCheckablePropertyDefinition)(
              {
                checked: (0, r.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.extendRight,
                  c.format({ title: i })
                ),
              },
              { id: `${t}ExtendRight`, title: u }
            );
          o.definitions.push(l);
          const s = (0, r.createCheckablePropertyDefinition)(
            {
              checked: (0, r.convertToDefinitionProperty)(
                this._propertyApplier,
                e.extendLeft,
                a.format({ title: i })
              ),
            },
            { id: `${t}ExtendLeft`, title: d }
          );
          return o.definitions.push(s), o;
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, s.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.textColor,
                  text: e.text,
                  bold: e.bold,
                  italic: e.italic,
                  fontSize: e.fontSize,
                  horzLabelsAlign: e.horzLabelsAlign,
                  vertLabelsAlign: e.vertLabelsAlign,
                  showText: e.showLabel,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                {
                  isEditable: !0,
                  isMultiLine: !0,
                  alignmentVerticalItems: h,
                  customTitles: { text: p },
                }
              ),
            ],
          };
        }
      }
    },
    30333: (e, t, i) => {
      i.r(t), i.d(t, { RiskRewardDefinitionsViewModel: () => H });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(50653),
        s = i(85766),
        a = i(28985),
        c = i(4895),
        p = i(58275),
        d = i.n(p),
        u = i(94474);
      const h = new n.TranslatedString(
          'change {title} stop color',
          o.t(null, void 0, i(54659))
        ),
        y = new n.TranslatedString(
          'change {title} target color',
          o.t(null, void 0, i(97573))
        ),
        f = new n.TranslatedString(
          'change {title} price labels visibility',
          o.t(null, void 0, i(88577))
        ),
        v = new n.TranslatedString(
          'change {title} compact stats mode',
          o.t(null, void 0, i(35435))
        ),
        g = new n.TranslatedString(
          'change {title} always show stats',
          o.t(null, void 0, i(37913))
        ),
        T = new n.TranslatedString(
          'change {title} account size',
          o.t(null, void 0, i(31775))
        ),
        D = new n.TranslatedString(
          'change {title} lot size',
          o.t(null, void 0, i(45025))
        ),
        w = new n.TranslatedString(
          'change {title} risk',
          o.t(null, void 0, i(31553))
        ),
        _ = new n.TranslatedString(
          'change {title} risk display mode',
          o.t(null, void 0, i(40344))
        ),
        P = new n.TranslatedString(
          'change {title} entry price',
          o.t(null, void 0, i(59354))
        ),
        S = new n.TranslatedString(
          'change {title} profit level',
          o.t(null, void 0, i(44539))
        ),
        m = new n.TranslatedString(
          'change {title} profit price',
          o.t(null, void 0, i(41646))
        ),
        b = new n.TranslatedString(
          'change {title} stop level',
          o.t(null, void 0, i(89182))
        ),
        C = new n.TranslatedString(
          'change {title} stop price',
          o.t(null, void 0, i(82224))
        ),
        x = o.t(null, void 0, i(83182)),
        L = o.t(null, void 0, i(50948)),
        k = o.t(null, void 0, i(45302)),
        A = o.t(null, void 0, i(37229)),
        $ = o.t(null, void 0, i(47737)),
        M = o.t(null, void 0, i(30973)),
        V = o.t(null, void 0, i(25684)),
        B = o.t(null, void 0, i(46001)),
        z = o.t(null, void 0, i(2635)),
        W = o.t(null, void 0, i(56119)),
        N = o.t(null, void 0, i(95264)),
        R = o.t(null, void 0, i(27531)),
        G = o.t(null, void 0, i(63833)),
        E = o.t(null, void 0, i(85160)),
        O = o.t(null, void 0, i(75675)),
        F = o.t(null, void 0, i(5066)),
        U = o.t(null, void 0, i(76655));
      function I(e) {
        return [
          { value: c.RiskDisplayMode.Percentage, title: F },
          { value: c.RiskDisplayMode.Money, title: e || U },
        ];
      }
      class H extends s.LineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t);
          const i = this._source.properties().childs(),
            o = i.riskDisplayMode.value();
          (this._riskMaxWV = new (d())(this._getRiskMax(o))),
            (this._riskStepWV = new (d())(this._getRiskStep(o))),
            (this._riskPrecisionWV = new (d())(this._getRiskPrecision(o))),
            (this._riskUnitWV = new (d())(this._getRiskUnit())),
            (this._riskUnitOptionsWV = new (d())(this._getRiskUnitOptions())),
            (this._lotSizeStepWV = new (d())(this._getLotSizeStep())),
            this._createPropertyRages(),
            i.riskDisplayMode.subscribe(this, (e) =>
              this._onRiskDisplayChanged(e)
            ),
            i.accountSize.subscribe(this, () => this._onAccountSizeChanged()),
            i.lotSize.subscribe(this, () => this._onLotSizeChanged()),
            this._undoModel
              .model()
              .mainSeries()
              .dataEvents()
              .symbolResolved()
              .subscribe(this, this._onSymbolInfoChanged);
        }
        destroy() {
          super.destroy();
          const e = this._source.properties().childs();
          e.riskDisplayMode.unsubscribeAll(this),
            e.accountSize.unsubscribeAll(this),
            e.lotSize.unsubscribeAll(this),
            this._undoModel
              .model()
              .mainSeries()
              .dataEvents()
              .symbolResolved()
              .unsubscribeAll(this);
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, u.removeSpaces)(t),
            o = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                },
                o,
                'Line',
                { line: x }
              ),
              (0, a.createColorPropertyDefinition)(
                {
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.stopBackground,
                    e.stopBackgroundTransparency,
                    h.format({ title: o })
                  ),
                },
                { id: `${i}StopColor`, title: L }
              ),
              (0, a.createColorPropertyDefinition)(
                {
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.profitBackground,
                    e.profitBackgroundTransparency,
                    y.format({ title: o })
                  ),
                },
                { id: `${i}ProfitColor`, title: k }
              ),
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                { textColor: e.textcolor, fontSize: e.fontsize },
                o,
                { isEditable: !0, isMultiLine: !0, customTitles: { text: A } }
              ),
              (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.showPriceLabels,
                    f.format({ title: o })
                  ),
                },
                { id: `${i}ShowPriceLabels`, title: O }
              ),
              (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.compact,
                    v.format({ title: o })
                  ),
                },
                { id: `${i}CompactMode`, title: $ }
              ),
              (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.alwaysShowStats,
                    g.format({ title: o })
                  ),
                },
                { id: `${i}AlwaysShowStats`, title: E }
              ),
            ],
          };
        }
        _inputsPropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, u.removeSpaces)(t),
            o = new n.TranslatedString(t, this._source.translatedType()),
            r = this._getYCoordinateStepWV(),
            l = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.accountSize,
                  T.format({ title: o })
                ),
              },
              {
                id: `${i}AccountSize`,
                title: N,
                type: 1,
                min: new (d())(1e-9),
                max: new (d())(1e9),
                step: new (d())(1),
                unit: this._riskUnitWV,
              }
            ),
            s = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.lotSize,
                  D.format({ title: o })
                ),
              },
              {
                id: `${i}LotSize`,
                title: R,
                type: 1,
                min: new (d())(1e-9),
                max: new (d())(1e8),
                step: this._lotSizeStepWV,
              }
            ),
            c = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.risk,
                  w.format({ title: o }),
                  [(e) => parseFloat(e)]
                ),
                unitOptionsValue: (0, a.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.riskDisplayMode,
                  _.format({ title: o })
                ),
              },
              {
                id: `${i}Risk`,
                title: G,
                type: 1,
                min: new (d())(1e-9),
                max: this._riskMaxWV,
                precision: this._riskPrecisionWV,
                step: this._riskStepWV,
                unitOptions: this._riskUnitOptionsWV,
              }
            ),
            p = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.entryPrice,
                  P.format({ title: o })
                ),
              },
              { id: `${i}EntryPrice`, title: B, type: 1, step: r }
            ),
            h = (0, a.createPropertyDefinitionsGeneralGroup)(
              [l, s, c, p],
              `${i}AccountRisk`
            ),
            y = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.profitLevel,
                  S.format({ title: o })
                ),
              },
              {
                id: `${i}ProfitLevelTicks`,
                title: M,
                type: 0,
                min: new (d())(0),
                max: new (d())(1e9),
                step: new (d())(1),
              }
            ),
            f = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.targetPrice,
                  m.format({ title: o }),
                  [(e) => e, (e) => this._source.prepareProfitPrice(e)]
                ),
              },
              { id: `${i}ProfitLevelPrice`, title: V, type: 1, step: r }
            ),
            v = (0, a.createPropertyDefinitionsGeneralGroup)(
              [y, f],
              `${i}ProfitLevel`,
              z
            ),
            g = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.stopLevel,
                  b.format({ title: o })
                ),
              },
              {
                id: `${i}StopLevelTicks`,
                title: M,
                type: 0,
                min: new (d())(0),
                max: new (d())(1e9),
                step: new (d())(1),
              }
            ),
            x = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.stopPrice,
                  C.format({ title: o }),
                  [(e) => e, (e) => this._source.prepareStopPrice(e)]
                ),
              },
              { id: `${i}StopLevelPrice`, title: V, type: 1, step: r }
            );
          return {
            definitions: [
              h,
              v,
              (0, a.createPropertyDefinitionsGeneralGroup)(
                [g, x],
                `${i}StopLevel`,
                W
              ),
            ],
          };
        }
        _onRiskDisplayChanged(e) {
          const t = e.value();
          this._riskMaxWV.setValue(this._getRiskMax(t)),
            this._riskStepWV.setValue(this._getRiskStep(t)),
            this._riskPrecisionWV.setValue(this._getRiskPrecision(t));
        }
        _onAccountSizeChanged() {
          this._riskMaxWV.setValue(
            this._getRiskMax(
              this._source.properties().childs().riskDisplayMode.value()
            )
          );
        }
        _onLotSizeChanged() {
          this._lotSizeStepWV.setValue(this._getLotSizeStep());
        }
        _onSymbolInfoChanged() {
          this._riskUnitWV.setValue(this._getRiskUnit()),
            this._riskUnitOptionsWV.setValue(this._getRiskUnitOptions());
        }
        _getRiskMax(e) {
          return e === c.RiskDisplayMode.Percentage
            ? 100
            : this._source.properties().childs().accountSize.value();
        }
        _getRiskStep(e) {
          return e === c.RiskDisplayMode.Percentage ? 0.01 : 1;
        }
        _getRiskPrecision(e) {
          if (e === c.RiskDisplayMode.Percentage) return 2;
        }
        _getLotSizeStep() {
          const e = this._source.properties().childs().lotSize.value();
          if (e % 1 == 0) return 1;
          const t = e.toString(),
            i = t.split('.');
          if (2 === i.length) return Number(`1e-${i[1].length}`);
          {
            const e = /\d+e-(\d+)/.exec(t);
            if (null !== e) return Number(`1e-${e[1]}`);
          }
          return this._lotSizeStepWV.value();
        }
        _getRiskUnit() {
          const e = this._undoModel.model().mainSeries().symbolInfo();
          return (null !== e && e.currency_code) || '';
        }
        _getRiskUnitOptions() {
          const e = this._undoModel.model().mainSeries().symbolInfo();
          return null !== e ? I(e.currency_code) : I();
        }
      }
    },
    18613: (e, t, i) => {
      i.r(t), i.d(t, { SignpostDefinitionsViewModel: () => T });
      var o = i(44352),
        n = i(36298),
        r = i(94474),
        l = i(58275),
        s = i.n(l),
        a = i(28985),
        c = i(50653),
        p = i(41339),
        d = i(85766);
      const u = new n.TranslatedString(
          'change vertical position Y coordinate',
          o.t(null, void 0, i(11049))
        ),
        h = new n.TranslatedString(
          'change {title} emoji visibility',
          o.t(null, void 0, i(65899))
        ),
        y = new n.TranslatedString(
          'change {title} image background color',
          o.t(null, void 0, i(48983))
        ),
        f = new n.TranslatedString(
          'change {title} emoji',
          o.t(null, void 0, i(65056))
        ),
        v = o.t(null, { context: 'linetool point' }, i(92195)),
        g = o.t(null, void 0, i(46211));
      class T extends d.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, c.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  text: e.text,
                  fontSize: e.fontSize,
                  bold: e.bold,
                  italic: e.italic,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0 }
              ),
            ],
          };
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.pointsProperty().childs().points[0].childs(),
            t = this._source.name(),
            i = (0, p.getCoordinateXMetaInfo)(this._propertyApplier, e),
            o = {
              property: (0, a.convertToDefinitionProperty)(
                this._propertyApplier,
                e.price,
                u
              ),
              info: {
                typeY: 1,
                stepY: new (s())(1),
                minY: new (s())(-100),
                maxY: new (s())(100),
              },
            };
          return {
            definitions: [
              (0, a.createCoordinatesPropertyDefinition)(
                { x: i.property, y: o.property },
                {
                  id: (0, r.removeSpaces)(`${t}Coordinates${v}`),
                  title: v,
                  ...i.info,
                  ...o.info,
                }
              ),
            ],
          };
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, a.createEmojiPropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.showImage,
                    h.format({ title: i })
                  ),
                  backgroundColor: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.plateColor,
                    null,
                    y.format({ title: i })
                  ),
                  emoji: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.emoji,
                    f.format({ title: i })
                  ),
                },
                { id: (0, r.removeSpaces)(`${t}Emoji${g}`), title: g }
              ),
            ],
          };
        }
      }
    },
    94625: (e, t, i) => {
      i.r(t), i.d(t, { TextDefinitionsViewModel: () => l });
      var o = i(50653),
        n = i(85766),
        r = i(36298);
      class l extends n.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, o.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.color,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                  text: e.text,
                  backgroundVisible: e.fillBackground,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.backgroundTransparency,
                  borderVisible: e.drawBorder,
                  borderColor: e.borderColor,
                  wrap: e.wordWrap,
                },
                new r.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0 }
              ),
            ],
          };
        }
      }
    },
    81888: (e, t, i) => {
      i.r(t), i.d(t, { TimeCyclesPatternDefinitionsViewModel: () => h });
      var o = i(44352),
        n = i(36298),
        r = i(2908),
        l = i(85766),
        s = i(28985),
        a = i(94474);
      const c = new n.TranslatedString(
          'change {title} background visibility',
          o.t(null, void 0, i(64548))
        ),
        p = new n.TranslatedString(
          'change {title} background color',
          o.t(null, void 0, i(75312))
        ),
        d = o.t(null, void 0, i(1277)),
        u = o.t(null, void 0, i(27331));
      class h extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.translatedType());
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                  lineStyle: e.linestyle,
                },
                i,
                'Line',
                { line: d }
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    c.format({ title: i })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    p.format({ title: i })
                  ),
                },
                { id: (0, a.removeSpaces)(`${t}BackgroundColor`), title: u }
              ),
            ],
          };
        }
      }
    },
    34935: (e, t, i) => {
      i.r(t), i.d(t, { TrendAngleDefinitionsViewModel: () => f });
      var o = i(44352),
        n = i(36298),
        r = i(28985),
        l = i(85766),
        s = i(58275),
        a = i.n(s),
        c = i(41339),
        p = i(75611);
      const d = new n.TranslatedString(
          'change angle',
          o.t(null, void 0, i(1670))
        ),
        u = o.t(null, void 0, i(36150)),
        h = o.t(null, void 0, i(37229)),
        y = o.t(null, { context: 'linetool point' }, i(12706));
      class f extends l.LineDataSourceDefinitionsViewModel {
        _coordinatesPropertyDefinitions() {
          const e = this._source.points(),
            t = [],
            i = this._source.pointsProperty().childs().points[0].childs(),
            o = this._getYCoordinateStepWV();
          t.push(
            (0, c.getCoordinatesPropertiesDefinitions)(
              this._propertyApplier,
              i,
              e[0],
              o,
              y,
              this._source.name()
            )
          );
          const n = (0, r.createNumberPropertyDefinition)(
            {
              value: (0, r.convertToDefinitionProperty)(
                this._propertyApplier,
                this._source.properties().childs().angle,
                d
              ),
            },
            {
              id: 'TrendLineAngleCoordinate',
              title: u,
              min: new (a())(-360),
              max: new (a())(360),
              step: new (a())(1),
            }
          );
          return t.push(n), { definitions: t };
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs();
          return (0, p.getTrendLineToolsStylePropertiesDefinitions)(
            this._propertyApplier,
            e,
            new n.TranslatedString(
              this._source.name(),
              this._source.translatedType()
            ),
            { text: h }
          );
        }
      }
    },
    60007: (e, t, i) => {
      i.r(t), i.d(t, { TrendBasedFibTimeDefinitionsViewModel: () => L });
      var o = i(50151),
        n = i(44352),
        r = i(36298),
        l = i(2908),
        s = i(28985),
        a = i(85766),
        c = i(18505),
        p = i(58275),
        d = i.n(p),
        u = i(94474),
        h = i(69152);
      const y = new r.TranslatedString(
          'change {title} level {index} line visibility',
          n.t(null, void 0, i(45463))
        ),
        f = new r.TranslatedString(
          'change {title} level {index} line color',
          n.t(null, void 0, i(85551))
        ),
        v = new r.TranslatedString(
          'change {title} level {index} line width',
          n.t(null, void 0, i(90098))
        ),
        g = new r.TranslatedString(
          'change {title} level {index} line style',
          n.t(null, void 0, i(47840))
        ),
        T = new r.TranslatedString(
          'change {title} level {index} line coeff',
          n.t(null, void 0, i(32891))
        ),
        D = new r.TranslatedString(
          'change {title} all lines color',
          n.t(null, void 0, i(15521))
        ),
        w = new r.TranslatedString(
          'change {title} background visibility',
          n.t(null, void 0, i(64548))
        ),
        _ = new r.TranslatedString(
          'change {title} background transparency',
          n.t(null, void 0, i(36438))
        ),
        P = new r.TranslatedString(
          'change {title} labels visibility',
          n.t(null, void 0, i(24338))
        ),
        S = new r.TranslatedString(
          'change {title} labels alignment',
          n.t(null, void 0, i(81170))
        ),
        m = n.t(null, void 0, i(4372)),
        b = n.t(null, void 0, i(12374)),
        C = n.t(null, void 0, i(27331)),
        x = n.t(null, void 0, i(94420));
      class L extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties(),
            i = t.childs(),
            n = this._source.name(),
            a = (0, u.removeSpaces)(n),
            p = new r.TranslatedString(n, this._source.translatedType()),
            L = i.trendline.childs(),
            k = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              {
                showLine: L.visible,
                lineColor: L.color,
                lineStyle: L.linestyle,
                lineWidth: L.linewidth,
              },
              p,
              'TrendLine',
              { line: m }
            );
          e.push(k);
          const A = this._source.levelsCount();
          for (let i = 1; i <= A; i++) {
            const n = (0, o.ensureDefined)(t.child(`level${i}`)).childs(),
              r = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.visible,
                    y.format({ title: p, index: i })
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    n.color,
                    null,
                    f.format({ title: p, index: i })
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linewidth,
                    v.format({ title: p, index: i })
                  ),
                  style: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linestyle,
                    g.format({ title: p, index: i })
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.coeff,
                    T.format({
                      title: p,
                      index: i,
                    })
                  ),
                },
                { id: `${a}LineLevel${i}` }
              );
            e.push(r);
          }
          const $ = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new h.CollectibleColorPropertyUndoWrapper(
                  (0, o.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null
                ),
                null,
                D.format({ title: p }),
                !0
              ),
            },
            { id: `${a}AllLineColor`, title: b }
          );
          e.push($);
          const M = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.fillBackground,
                w.format({ title: p })
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.transparency,
                _.format({ title: p })
              ),
            },
            { id: `${a}Background`, title: C }
          );
          e.push(M);
          const V = (0, s.createTwoOptionsPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.showCoeffs,
                P.format({ title: p })
              ),
              option1: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.horzLabelsAlign,
                S.format({ title: p })
              ),
              option2: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.vertLabelsAlign,
                S.format({ title: p })
              ),
            },
            {
              id: `${a}Labels`,
              title: x,
              optionsItems1: new (d())(c.availableAlignmentHorizontalItems),
              optionsItems2: new (d())(c.availableAlignmentVerticalItems),
            }
          );
          return e.push(V), { definitions: e };
        }
      }
    },
    84926: (e, t, i) => {
      i.r(t), i.d(t, { TrendLineDefinitionsViewModel: () => c });
      var o = i(44352),
        n = i(36298),
        r = i(85766),
        l = i(75611),
        s = i(50653);
      const a = o.t(null, void 0, i(37229));
      class c extends r.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs();
          return (0, l.getTrendLineToolsStylePropertiesDefinitions)(
            this._propertyApplier,
            e,
            new n.TranslatedString(
              this._source.name(),
              this._source.translatedType()
            )
          );
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, s.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: a } }
              ),
            ],
          };
        }
      }
    },
    71472: (e, t, i) => {
      i.r(t), i.d(t, { VerticalLineDefinitionsViewModel: () => h });
      var o = i(44352),
        n = i(36298),
        r = i(28985),
        l = i(41339),
        s = i(86778),
        a = i(94474),
        c = i(85766),
        p = i(50653);
      const d = o.t(null, void 0, i(37229)),
        u = o.t(null, { context: 'linetool point' }, i(91282));
      class h extends c.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs();
          return (0, s.getLinesStylesPropertiesDefinitions)(
            this._propertyApplier,
            e,
            new n.TranslatedString(
              this._source.name(),
              this._source.translatedType()
            )
          );
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.pointsProperty().childs().points[0].childs(),
            t = (0, l.getCoordinateXMetaInfo)(this._propertyApplier, e);
          return {
            definitions: [
              (0, r.createCoordinatesPropertyDefinition)(
                { x: t.property },
                {
                  id: (0, a.removeSpaces)(`${this._source.name()}Point1`),
                  title: u,
                  ...t.info,
                }
              ),
            ],
          };
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs();
          return {
            definitions: [
              (0, p.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  textOrientation: e.textOrientation,
                },
                new n.TranslatedString(
                  this._source.name(),
                  this._source.translatedType()
                ),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: d } }
              ),
            ],
          };
        }
      }
    },
    69152: (e, t, i) => {
      i.d(t, {
        CollectibleColorPropertyDirectWrapper: () => a,
        CollectibleColorPropertyUndoWrapper: () => s,
      });
      var o = i(50151),
        n = i(59452),
        r = i.n(n);
      class l extends r() {
        constructor(e) {
          super(),
            (this._listenersMappers = []),
            (this._isProcess = !1),
            (this._baseProperty = e);
        }
        destroy() {
          this._baseProperty.destroy();
        }
        value() {
          const e = this._baseProperty.value();
          return 'mixed' === e ? '' : e;
        }
        visible() {
          return this._baseProperty.visible();
        }
        setValue(e) {
          (this._isProcess = !0),
            this._baseProperty.setValue('' === e ? 'mixed' : e, void 0, {
              applyValue: this._applyValue.bind(this),
            }),
            (this._isProcess = !1),
            this._listenersMappers.forEach((e) => {
              e.method.call(e.obj, this);
            });
        }
        subscribe(e, t) {
          const i = (i) => {
              this._isProcess || t.call(e, this);
            },
            o = { obj: e, method: t, callback: i };
          this._listenersMappers.push(o), this._baseProperty.subscribe(e, i);
        }
        unsubscribe(e, t) {
          var i;
          const n = (0, o.ensureDefined)(
            null ===
              (i = this._listenersMappers.find(
                (i) => i.obj === e && i.method === t
              )) || void 0 === i
              ? void 0
              : i.callback
          );
          this._baseProperty.unsubscribe(e, n);
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e);
        }
      }
      class s extends l {
        constructor(e, t, i) {
          super(e), (this._propertyApplier = t), (this._undoText = i);
        }
        _applyValue(e, t) {
          this._propertyApplier.setProperty(e, t, this._undoText);
        }
      }
      class a extends l {
        _applyValue(e, t) {
          e.setValue(t);
        }
      }
    },
  },
]);
