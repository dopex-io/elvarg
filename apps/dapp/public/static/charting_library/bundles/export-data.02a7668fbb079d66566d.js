'use strict';
(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9498],
  {
    50210: (e, t, i) => {
      i.r(t), i.d(t, { exportData: () => f });
      var s = i(44352),
        l = i(50151),
        n = i(12500),
        o = i(86094),
        r = i(72877),
        a = i(92052),
        u = i(37160),
        c = i(66764);
      const d = {
        includeTime: !0,
        includeUserTime: !1,
        includeSeries: !0,
        includeDisplayedValues: !1,
        includedStudies: 'all',
        includeOffsetStudyValues: !1,
      };
      function f(e, t = {}) {
        const i = Object.assign({}, d, t),
          s = { schema: [], data: [], displayedData: [] },
          r = e.timeScale().points(),
          f = e.mainSeries(),
          p = (0, c.getChartWidgetApiTimeConverter)(
            f.interval(),
            (0, l.ensureNotNull)(f.symbolInfo()),
            e
          ),
          v = (function (e, t) {
            const i = e.allStudies().filter((e) => e.showInObjectTree());
            if ('all' === t) return i;
            return i.filter((e) => t.includes(e.id()));
          })(e, i.includedStudies),
          y = [];
        for (const e of v) {
          const t = m(e);
          y.push(t);
        }
        const N = v.map((e) => e.data());
        (i.includeSeries || 0 === N.length) && N.push(f.bars());
        const x = (function (e, t, i, s, r) {
          const a = (0, l.ensureNotNull)(
              e.range().value(),
              'time scale points range'
            ),
            c = (function (e, t, i, s) {
              var r, a;
              const c = s.from,
                d = s.to,
                f = e.range().value(),
                h = (0, l.ensureNotNull)(
                  void 0 !== c
                    ? e.indexOf(c, !0)
                    : (0, l.ensureNotNull)(f).firstIndex
                ),
                m = (0, l.ensureNotNull)(
                  void 0 !== d
                    ? e.indexOf(d, !0)
                    : (0, l.ensureNotNull)(f).lastIndex
                );
              let p = m,
                T = h;
              for (let e = 0; e < t.length; e++) {
                const l = t[e],
                  n = s.includeOffsetStudyValues
                    ? (0, u.max)(
                        null !==
                          (a =
                            null === (r = i[e]) || void 0 === r
                              ? void 0
                              : r.fieldPlotOffsets) && void 0 !== a
                          ? a
                          : [0]
                      )
                    : 0,
                  c = l.search(h, o.PlotRowSearchMode.NearestRight);
                null !== c && c.index < p && (p = c.index);
                const d = l.search(m, o.PlotRowSearchMode.NearestLeft);
                null !== d && d.index + n > T && (T = d.index + n);
              }
              return (
                (0, l.assert)(
                  p <= T,
                  'Range must contain at least 1 time point'
                ),
                new n.BarsRange(p, T)
              );
            })(e, t, i, r),
            d = c.firstBar(),
            f = c.lastBar(),
            m = [];
          for (let e = d; e <= f; e++) {
            const t = {
              index: e,
              time: (0, l.ensureNotNull)(
                s.convertTimePointIndexToInternalTime(e)
              ),
              publicTime: (0, l.ensureNotNull)(
                s.convertTimePointIndexToPublicTime(e)
              ),
            };
            if (!(void 0 !== r.from && t.time < r.from)) {
              if (void 0 !== r.to && t.time > r.to) break;
              if (!r.includeOffsetStudyValues && e > a.lastIndex) break;
              m.push(t);
            }
          }
          return m.length > 0 ? new h(m) : null;
        })(r, N, y, p, i);
        if (null === x) return s;
        const P = x.firstBar(),
          I = x.lastBar();
        i.includeTime && s.schema.push({ type: 'time' });
        const S = s.schema.length;
        i.includeUserTime && s.schema.push({ type: 'userTime' });
        const b = s.schema.length;
        if (i.includeSeries) {
          const e = f.statusProvider({ hideResolution: !0 }).getSplitTitle(),
            t = Object.values(e)
              .filter((e) => '' !== e)
              .join(', ');
          s.schema.push(T('open', t)),
            s.schema.push(T('high', t)),
            s.schema.push(T('low', t)),
            s.schema.push(T('close', t));
        }
        let w = s.schema.length;
        for (const e of y) s.schema.push(...e.fields);
        const D = s.schema.length;
        if (0 === D) return s;
        for (let e = P; e <= I; ++e) {
          const e = new Float64Array(D);
          e.fill(NaN),
            s.data.push(e),
            i.includeDisplayedValues &&
              s.displayedData.push(new Array(D).fill(''));
        }
        if (i.includeTime || i.includeUserTime) {
          const t = e.dateTimeFormatter();
          for (let e = P; e <= I; ++e) {
            const n = x.item(e),
              o = n.time,
              r = n.publicTime,
              a = new Date(1e3 * (0, l.ensureNotNull)(r));
            if (
              (i.includeTime && (s.data[e - P][0] = (0, l.ensureNotNull)(o)),
              i.includeUserTime && (s.data[e - P][S] = a.getTime() / 1e3),
              i.includeDisplayedValues)
            ) {
              const l = t.format(a);
              i.includeTime && (s.displayedData[e - P][0] = l),
                i.includeUserTime && (s.displayedData[e - P][S] = l);
            }
          }
        }
        if (i.includeSeries) {
          const e = f.bars().range(P, I),
            t = (0, a.getPriceValueFormatterForSource)(f);
          e.each((e, l) => {
            const n = s.data[e - P],
              o = g(l[1]),
              r = g(l[2]),
              a = g(l[3]),
              u = g(l[4]);
            if (
              ((n[b] = o),
              (n[b + 1] = r),
              (n[b + 2] = a),
              (n[b + 3] = u),
              i.includeDisplayedValues)
            ) {
              const i = s.displayedData[e - P];
              (i[b] = t(o)),
                (i[b + 1] = t(r)),
                (i[b + 2] = t(a)),
                (i[b + 3] = t(u));
            }
            return !1;
          });
        }
        for (let e = 0; e < v.length; ++e) {
          const t = v[e],
            l = y[e],
            n = (0, a.getPriceValueFormatterForSource)(t);
          for (let e = 0; e < l.fields.length; ++e) {
            const o = l.fieldPlotOffsets[e],
              r = l.fieldToPlotIndex[e],
              a = P - o,
              u = I - o,
              c = w + e;
            t.data()
              .range(a, u)
              .each((e, t) => {
                const l = s.data[e - a],
                  o = g(t[r]);
                return (
                  (l[c] = o),
                  i.includeDisplayedValues &&
                    (s.displayedData[e - a][c] = n(o)),
                  !1
                );
              });
          }
          w += l.fields.length;
        }
        return s;
      }
      class h {
        constructor(e) {
          (this._items = e),
            (this._firstIndex = this._items[0].index),
            (this._lastIndex = this._items[this._items.length - 1].index);
        }
        firstBar() {
          return this._firstIndex;
        }
        lastBar() {
          return this._lastIndex;
        }
        item(e) {
          return this._items[e - this._firstIndex];
        }
      }
      function m(e) {
        const t = e.metaInfo(),
          n = { fieldToPlotIndex: [], fieldPlotOffsets: [], fields: [] },
          o = e.id(),
          a = e.title(!1, void 0, !1);
        for (let u = 0; u < t.plots.length; ++u) {
          const c = t.plots[u];
          let d,
            f = '';
          if (
            (0, r.isLinePlot)(c) ||
            (0, r.isShapesPlot)(c) ||
            (0, r.isCharsPlot)(c) ||
            (0, r.isArrowsPlot)(c)
          )
            d = (0, l.ensureDefined)(t.styles)[c.id];
          else if ((0, r.isOhlcPlot)(c))
            switch (((d = t.ohlcPlots && t.ohlcPlots[c.target]), c.type)) {
              case 'ohlc_open':
                f = ` (${s.t(null, void 0, i(39280))})`;
                break;
              case 'ohlc_high':
                f = ` (${s.t(null, void 0, i(30777))}`;
                break;
              case 'ohlc_low':
                f = ` (${s.t(null, void 0, i(8136))})`;
                break;
              case 'ohlc_close':
                f = ` (${s.t(null, void 0, i(31691))})`;
            }
          if (void 0 === d || void 0 === d.title) continue;
          const h = `${d.title}${f}`;
          n.fields.push(p(o, a, h)),
            n.fieldToPlotIndex.push(u + 1),
            n.fieldPlotOffsets.push(e.offset(c.id));
        }
        return n;
      }
      function p(e, t, i) {
        return {
          type: 'value',
          sourceType: 'study',
          sourceId: e,
          sourceTitle: t,
          plotTitle: i,
        };
      }
      function T(e, t) {
        return {
          type: 'value',
          sourceType: 'series',
          plotTitle: e,
          sourceTitle: t,
        };
      }
      function g(e) {
        return null != e ? e : NaN;
      }
    },
  },
]);
