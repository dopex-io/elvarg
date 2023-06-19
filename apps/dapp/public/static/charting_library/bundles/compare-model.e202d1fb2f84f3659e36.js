(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7271],
  {
    3685: (e, t, s) => {
      'use strict';
      function o() {
        var e, t, s;
        return null !==
          (s =
            null ===
              (t =
                null === (e = window.configurationData) || void 0 === e
                  ? void 0
                  : e.exchanges) || void 0 === t
              ? void 0
              : t.map((e) => ({
                  ...e,
                  country: '',
                  providerId: '',
                  flag: '',
                }))) && void 0 !== s
          ? s
          : [];
      }
      s.d(t, { getExchanges: () => o });
    },
    58442: (e, t, s) => {
      'use strict';
      s.d(t, { QualifiedSources: () => o, qualifyProName: () => i });
      var o,
        n = s(50151),
        r = s(14483);
      s(81319);
      function i(e) {
        return e;
      }
      !(function (e) {
        function t(e) {
          return e.pro_name;
        }
        function s(e) {
          {
            const t = r.enabled('pay_attention_to_ticker_not_symbol')
              ? e.ticker
              : e.full_name;
            return (0, n.ensureDefined)(t);
          }
        }
        (e.fromQuotesSnapshot = function (e) {
          return 'error' === e.status ? e.symbolname : e.values.pro_name;
        }),
          (e.fromQuotesResponse = function (e) {
            const { values: s, symbolname: o, status: n } = e;
            return 'error' === n && o ? o : t(s);
          }),
          (e.fromQuotes = t),
          (e.fromSymbolSearchResult = function (e, t) {
            {
              const { ticker: s, full_name: o } = null != t ? t : e;
              return r.enabled('pay_attention_to_ticker_not_symbol')
                ? (0, n.ensureDefined)(null != s ? s : o)
                : (0, n.ensureDefined)(o);
            }
          }),
          (e.fromSymbolInfo = s),
          (e.fromSymbolMessage = function (e, t) {
            return 'symbol_resolved' === t.method ? s(t.params[1]) : e;
          });
      })(o || (o = {}));
    },
    20882: (e, t, s) => {
      'use strict';
      s.d(t, {
        createSearchSources: () => a,
        filterSearchSources: () => r,
        isAllSearchSourcesSelected: () => n,
        splitSearchSourcesByGroup: () => i,
      });
      const o = [];
      function n(e) {
        return '' === e.value();
      }
      function r(e, t) {
        return e.filter((e) => e.includes(t));
      }
      function i(e) {
        const t = new Map();
        e.forEach((e) => {
          t.has(e.group()) ? t.get(e.group()).push(e) : t.set(e.group(), [e]);
        });
        for (const e of t.values()) {
          e[0].group() !== ExchangeGroup.NorthAmerica &&
            e.sort((e, t) =>
              e.name().toLowerCase() > t.name().toLowerCase() ? 1 : -1
            );
        }
        return new Map(
          [...t.entries()].sort(([e], [t]) => o.indexOf(e) - o.indexOf(t))
        );
      }
      function a(e, t) {
        return t.map((t) => new e(t));
      }
    },
    81319: (e, t, s) => {
      'use strict';
      s.d(t, {
        exchangeSelectDisabled: () => h,
        getAllSymbolTypesValue: () => u,
        getAvailableSearchSources: () => l,
        getAvailableSymbolTypes: () => d,
        getDefaultSearchSource: () => c,
        getSymbolFullName: () => a,
        isSeparateSymbolSearchTabs: () => m,
      });
      var o = s(44352),
        n = s(20882);
      class r {
        constructor(e) {
          this._exchange = e;
        }
        value() {
          return this._exchange.value;
        }
        name() {
          return (0, n.isAllSearchSourcesSelected)(this)
            ? o.t(null, void 0, s(64498))
            : this._exchange.name;
        }
        description() {
          return this._exchange.desc;
        }
        country() {
          return this._exchange.country;
        }
        providerId() {
          return this._exchange.providerId;
        }
        group() {
          return this._exchange.group;
        }
        includes(e) {
          return (function (e, t) {
            const s = t.toLowerCase(),
              { name: o, desc: n, searchTerms: r } = e;
            return (
              o.toLowerCase().includes(s) ||
              n.toLowerCase().includes(s) ||
              (void 0 !== r && r.some((e) => e.toLowerCase().includes(s)))
            );
          })(this._exchange, e);
        }
        getRequestExchangeValue() {
          return this._exchange.value;
        }
        getRequestCountryValue() {}
      }
      var i = s(3685);
      function a(e) {
        if (e.fullName) return e.fullName;
        let t;
        return (
          (t =
            e.prefix || e.exchange
              ? (e.prefix || e.exchange) + ':' + e.name
              : e.name),
          t.replace(/<\/?[^>]+(>|$)/g, '')
        );
      }
      function c() {
        const e = l();
        return e.find(n.isAllSearchSourcesSelected) || e[0] || null;
      }
      function l() {
        return (0, n.createSearchSources)(r, (0, i.getExchanges)());
      }
      function d() {
        return window.ChartApiInstance.supportedSymbolsTypes();
      }
      function u() {
        return '';
      }
      function h(e) {
        return !(!m || '' !== e);
      }
      const m = !1;
    },
    56217: (e, t, s) => {
      'use strict';
      s.r(t), s.d(t, { CompareModel: () => I });
      var o = s(50151),
        n = s(14483),
        r = s(19171),
        i = s(27856),
        a = s(58275),
        c = s.n(a),
        l = s(46148),
        d = s(64063),
        u = s(8561),
        h = s(3685),
        m = s(58442);
      new Set(
        n.enabled('widget')
          ? [
              'pro_name',
              'short_name',
              'description',
              'exchange',
              'type',
              'country_code',
              'provider_id',
              'typespecs',
            ]
          : [
              'pro_name',
              'short_name',
              'description',
              'exchange',
              'type',
              'country_code',
              'provider_id',
              'typespecs',
              'logoid',
              'currency-logoid',
              'base-currency-logoid',
            ]
      );
      const y = (0, h.getExchanges)(),
        S = {};
      for (const e of y)
        S[e.value] = { country: e.country, providerId: e.providerId };
      var _ = s(77248);
      function p(e) {
        return e instanceof d.study_Overlay || e instanceof u.StudyCompare;
      }
      function f(e, t, s) {
        const o = m.QualifiedSources.fromSymbolInfo(e),
          n = (function (e) {
            if (!e) return;
            const [t, s] = e.split(':');
            return s && t && S[t] ? S[t] : void 0;
          })(o);
        return {
          id: (null == s ? void 0 : s.id()) || o,
          symbol: o,
          checked: t,
          title: e.name,
          description: e.description,
          exchangeName: e.exchange,
          country: null == n ? void 0 : n.country,
          providerId: null == n ? void 0 : n.providerId,
          marketType: e.type,
          study: s,
          isYield: (0, _.isYield)(e),
        };
      }
      function b(e, t, s, o) {
        return {
          id: void 0 !== s ? s.id() : e,
          symbol: e,
          checked: t,
          title: e,
          study: s,
          description: o,
        };
      }
      var g = s(56840),
        v = s(76422);
      class I {
        constructor(e) {
          (this._contentItemList = new (c())([])),
            (this._checkedSymbols = new Map()),
            (this._recentLength = 10),
            (this._isDataReady = new (c())(!1)),
            (this._highlightedSymbol = new (c())(null)),
            (this._defaultSymbolsDescriptions = new Map()),
            (this._idToStudyMap = new Map()),
            (this._chartSession = null),
            (this._recentSymbolsEnabled = n.enabled(
              'compare_recent_symbols_enabled'
            )),
            (this._preventHandleSourcesChange = !0),
            (this.removeStudy = (e) => {
              const { symbol: t, study: s } = e;
              if (!s) return;
              this._chartWidget.model().removeSource(s, !1);
              const o = this._checkedSymbols.get(t);
              o && o.length > 1
                ? this._removeStudyIdFromCheckedSymbols(t, s.id())
                : this._checkedSymbols.delete(t),
                this._updateContentItemList(this._contentItemList.value(), !0);
            }),
            (this._getResolveSymbolPromise = (e, t) =>
              new Promise((s) => {
                const n = (0, o.ensureNotNull)(
                  this._chartSession
                ).resolveSymbol(
                  (0, r.makeNextSymbolId)(),
                  (0, i.encodeExtendedSymbolOrGetSimpleSymbolString)({
                    symbol: e,
                  }),
                  s
                );
                t && t.set(e, n);
              })),
            (this._chartWidget = e.activeChartWidget.value()),
            (this._chartSession = this._chartWidget.model().model().chartApi());
          const t = new Set(this._loadRecent().reverse()),
            s = new Set(),
            a = new Set(),
            l = this._chartWidget.model().model().dataSources().filter(p),
            d = l.map((e) => {
              const t = e.symbolInfo();
              if (t)
                return Promise.resolve(m.QualifiedSources.fromSymbolInfo(t));
              const s = e.symbol();
              return (0, m.qualifyProName)(s);
            });
          Promise.all(d).then((e) => {
            const o = e.map((e, t) => l[t]);
            e.forEach((e, n) => {
              const r = o[n],
                i = r.id();
              this._addStudyIdToCheckedSymbols(e, i),
                this._idToStudyMap.set(i, r),
                t.has(e) ? s.add(e) : a.add(e);
            });
            const n = Array.from(t)
                .filter((e) => this._checkedSymbols.has(e))
                .reduce((e, t) => (s.has(t) && e.push(t), e), [])
                .concat(Array.from(a)),
              r = Array.from(t);
            if (this._recentSymbolsEnabled && r.length < this._recentLength) {
              let e;
              (e = []),
                this._chartWidget.compareSymbols() &&
                  this._chartWidget.compareSymbols().forEach((t) => {
                    e.push((0, m.qualifyProName)(t.symbol)),
                      this._defaultSymbolsDescriptions.set(t.symbol, t.title);
                  });
              const t = [...r, ...e];
              n.push(...t);
            } else n.push(...r);
            const i = Array.from(new Set(n));
            {
              const e = new Map(),
                t = i.map((t) => this._getResolveSymbolPromise(t, e));
              Promise.all(t).then((t) =>
                this._handleInitProcess(
                  n,
                  (s) => {
                    const o = e.get(s);
                    return t.find((e) => e.params[0] === o);
                  },
                  (e, t) => m.QualifiedSources.fromSymbolMessage(t, e),
                  (e, t, s, o) =>
                    'symbol_resolved' === e.method
                      ? f(e.params[1], s, o)
                      : b(t, s, o, this._getSymbolDescription(t))
                )
              );
            }
          });
        }
        chartModel() {
          return this._chartWidget.model().model();
        }
        comparableOnSameScale(e) {
          return (
            this._chartWidget.model().model().mainSeries().isYield() &&
            Boolean(e.isYield)
          );
        }
        handleSourcesChange() {
          if (this._preventHandleSourcesChange) return;
          const e = this.chartModel().dataSources().filter(p),
            t = new Set(e.map((e) => e.id()));
          Array.from(t).forEach((e) => {
            if (!this._checkedStudiesIds().has(e)) {
              const t = this.chartModel().dataSourceForId(e) || null;
              if (null !== t && p(t)) {
                const t = this._getContentItemByStudyId(e);
                if (!t) return;
                this._addStudyIdToCheckedSymbols(t.symbol, e),
                  this._saveRecent(t.symbol),
                  this._updateContentItemList(
                    this._contentItemList.value(),
                    !0
                  );
              }
            }
          });
          Array.from(this._checkedStudiesIds()).forEach((e) => {
            if (!t.has(e)) {
              const t = this._getContentItemByStudyId(e);
              if (!t) return;
              const s = this._checkedSymbols.get(t.symbol);
              s && s.length > 1
                ? this._removeStudyIdFromCheckedSymbols(t.symbol, e)
                : this._checkedSymbols.delete(t.symbol),
                this._updateContentItemList(this._contentItemList.value(), !0);
            }
          });
        }
        studies() {
          return this._contentItemList.readonly();
        }
        isDataReady() {
          return this._isDataReady.readonly();
        }
        highlightedSymbol() {
          return this._highlightedSymbol.readonly();
        }
        applyStudy(e, t, s) {
          (() => {
            const o = this._chartWidget;
            if (!o) return;
            let n;
            switch (t) {
              case l.CompareOption.SamePctScale:
                n = o.addCompareAsOverlay(e, s);
                break;
              case l.CompareOption.SameScale:
                n = o.addCompareAsOverlay(e, s, !0);
                break;
              case l.CompareOption.NewPriceScale:
                n = o.addOverlayStudy(e, !0, s);
                break;
              case l.CompareOption.NewPane:
                n = o.addOverlayStudy(e, !1, s);
            }
            Promise.all([this._getResolveSymbolPromise(e), n]).then((t) =>
              this._handleApplyProcess(
                t,
                (t) => m.QualifiedSources.fromSymbolMessage(e, t),
                (e, t, s) =>
                  'symbol_resolved' === e.method
                    ? f(e.params[1], !0, s)
                    : b(t, !0, s)
              )
            ),
              v.emit('add_compare');
          })();
        }
        _snapshoter() {
          throw new Error('not implemented');
        }
        _handleApplyProcess(e, t, s) {
          const [o, n] = e;
          if (!o || null === n) return;
          const r = n.id(),
            i = t(o),
            a = s(o, i, n);
          this._saveRecent(i),
            this._addStudyIdToCheckedSymbols(i, r),
            this._showNewItem(a, i, r);
        }
        _handleInitProcess(e, t, s, o) {
          const n = [];
          for (const r of e) {
            const e = t(r);
            if (!e) continue;
            const i = s(e, r),
              a = this._checkedSymbols.get(i),
              c = -1 !== n.findIndex((e) => e.symbol === i);
            if (void 0 === a || c)
              this._recentSymbolsEnabled && n.push(o(e, i, !1));
            else
              for (const t of a) n.push(o(e, i, !0, this._idToStudyMap.get(t)));
          }
          this._updateContentItemList(n), this._isDataReady.setValue(!0);
        }
        _showNewItem(e, t, s) {
          const o = this._contentItemList
            .value()
            .map(this._updateChecked, this);
          o.unshift(e),
            this._recentSymbolsEnabled &&
              o.unshift({ ...e, id: t, study: void 0, checked: !1 }),
            this._updateContentItemList(o),
            this._highlightedSymbol.setValue(s),
            setTimeout(() => this._highlightedSymbol.setValue(null), 500);
        }
        _addStudyIdToCheckedSymbols(e, t) {
          const s = this._checkedSymbols.get(e) || [];
          this._checkedSymbols.set(e, [...s, t]);
        }
        _removeStudyIdFromCheckedSymbols(e, t) {
          const s = this._checkedSymbols.get(e);
          if (s) {
            const o = s.indexOf(t);
            s.splice(o, 1), this._checkedSymbols.set(e, s);
          }
        }
        _updateChecked(e) {
          var t;
          const s = this._checkedSymbols.get(e.symbol),
            o = null === (t = e.study) || void 0 === t ? void 0 : t.id();
          return o ? { ...e, checked: Boolean(s && s.includes(o)) } : e;
        }
        _updateContentItemList(e, t) {
          const s = t ? e.map(this._updateChecked, this) : e,
            o = s.filter((e) => e.checked);
          if (this._recentSymbolsEnabled) {
            const e = new Set(),
              t = s
                .reduce(
                  (t, s) => (
                    s.checked ||
                      e.has(s.symbol) ||
                      (t.push(s), e.add(s.symbol)),
                    t
                  ),
                  []
                )
                .slice(0, this._recentLength);
            this._contentItemList.setValue(o.concat(t));
          } else this._contentItemList.setValue(o);
        }
        _checkedStudiesIds() {
          const e = [].concat(...Array.from(this._checkedSymbols.values()));
          return new Set(e);
        }
        _getContentItemByStudyId(e) {
          const t = this._contentItemList.value(),
            s = t.findIndex((t) => t.study && t.study.id() === e);
          return t[s];
        }
        _loadRecent() {
          if (!this._recentSymbolsEnabled) return [];
          return g
            .getJSON('CompareDialog.recent', [])
            .filter((e) => 'string' == typeof e);
        }
        _saveRecent(e) {
          if (!this._recentSymbolsEnabled) return;
          const t = new Set(this._loadRecent());
          t.has(e) && t.delete(e),
            t.add(e),
            g.setJSON(
              'CompareDialog.recent',
              Array.from(t).slice(-this._recentLength)
            );
        }
        _getSymbolDescription(e) {
          var t;
          return this._defaultSymbolsDescriptions.size &&
            null !== (t = this._defaultSymbolsDescriptions.get(e)) &&
            void 0 !== t
            ? t
            : '';
        }
      }
      I._snapshoter = null;
    },
    46148: (e, t, s) => {
      'use strict';
      var o;
      s.d(t, { CompareOption: () => o }),
        (function (e) {
          (e[(e.SamePctScale = 0)] = 'SamePctScale'),
            (e[(e.NewPriceScale = 1)] = 'NewPriceScale'),
            (e[(e.NewPane = 2)] = 'NewPane'),
            (e[(e.SameScale = 3)] = 'SameScale');
        })(o || (o = {}));
    },
    64498: (e) => {
      e.exports = {
        ar: ['كل المصادر'],
        ca_ES: ['Totes les fonts'],
        cs: 'All sources',
        de: ['Alle Quellen'],
        el: 'All sources',
        en: 'All sources',
        es: ['Todas las fuentes'],
        fa: 'All sources',
        fr: ['Toutes les sources'],
        he_IL: ['כל המקורות'],
        hu_HU: 'All sources',
        id_ID: ['Seluruh sumber'],
        it: ['Tutte le fonti'],
        ja: ['すべての提供元'],
        ko: ['모든 자료'],
        ms_MY: ['Kesemua sumber'],
        nl_NL: 'All sources',
        pl: ['Wszystkie źródła'],
        pt: ['Todas as fontes'],
        ro: 'All sources',
        ru: ['Все источники'],
        sv: ['Samtliga källor'],
        th: ['แหล่งที่มาทั้งหมด'],
        tr: ['Tüm kaynaklar'],
        vi: ['Tất cả các nguồn'],
        zh: ['全部来源'],
        zh_TW: ['全部來源'],
      };
    },
  },
]);
