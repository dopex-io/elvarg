(() => {
  'use strict';
  var e,
    a,
    d,
    c,
    f,
    t = {},
    b = {};
  function r(e) {
    var a = b[e];
    if (void 0 !== a) return a.exports;
    var d = (b[e] = { id: e, loaded: !1, exports: {} });
    return t[e].call(d.exports, d, d.exports, r), (d.loaded = !0), d.exports;
  }
  (r.m = t),
    (r.c = b),
    (e = []),
    (r.O = (a, d, c, f) => {
      if (!d) {
        var t = 1 / 0;
        for (i = 0; i < e.length; i++) {
          for (var [d, c, f] = e[i], b = !0, o = 0; o < d.length; o++)
            (!1 & f || t >= f) && Object.keys(r.O).every((e) => r.O[e](d[o]))
              ? d.splice(o--, 1)
              : ((b = !1), f < t && (t = f));
          if (b) {
            e.splice(i--, 1);
            var n = c();
            void 0 !== n && (a = n);
          }
        }
        return a;
      }
      f = f || 0;
      for (var i = e.length; i > 0 && e[i - 1][2] > f; i--) e[i] = e[i - 1];
      e[i] = [d, c, f];
    }),
    (r.n = (e) => {
      var a = e && e.__esModule ? () => e.default : () => e;
      return r.d(a, { a }), a;
    }),
    (d = Object.getPrototypeOf
      ? (e) => Object.getPrototypeOf(e)
      : (e) => e.__proto__),
    (r.t = function (e, c) {
      if ((1 & c && (e = this(e)), 8 & c)) return e;
      if ('object' == typeof e && e) {
        if (4 & c && e.__esModule) return e;
        if (16 & c && 'function' == typeof e.then) return e;
      }
      var f = Object.create(null);
      r.r(f);
      var t = {};
      a = a || [null, d({}), d([]), d(d)];
      for (var b = 2 & c && e; 'object' == typeof b && !~a.indexOf(b); b = d(b))
        Object.getOwnPropertyNames(b).forEach((a) => (t[a] = () => e[a]));
      return (t.default = () => e), r.d(f, t), f;
    }),
    (r.d = (e, a) => {
      for (var d in a)
        r.o(a, d) &&
          !r.o(e, d) &&
          Object.defineProperty(e, d, { enumerable: !0, get: a[d] });
    }),
    (r.f = {}),
    (r.e = (e) =>
      Promise.all(Object.keys(r.f).reduce((a, d) => (r.f[d](e, a), a), []))),
    (r.u = (e) =>
      5652 === e
        ? '__LANG__.5652.209eb64b624dfe3c853a.js'
        : 2427 === e
        ? '__LANG__.2427.596db67d26c83197588d.js'
        : 77 === e
        ? '__LANG__.77.a1830a06fe990f9f1170.js'
        : 6196 === e
        ? '__LANG__.6196.3e28185b53cd2346f10d.js'
        : 435 === e
        ? '__LANG__.435.ada80623f71848fbb57d.js'
        : 7201 === e
        ? '__LANG__.7201.028a386569caa7df9e56.js'
        : 8235 === e
        ? '__LANG__.8235.e7a3cd51ccec31b781fa.js'
        : 2014 === e
        ? '__LANG__.2014.75229e80e4f7b7217ef0.js'
        : 8884 === e
        ? '__LANG__.8884.515644758428ad7e8263.js'
        : 2684 === e
        ? '__LANG__.2684.25cb9ba0254ab5298f14.js'
        : ({
            92: 'chart-screenshot-hint',
            139: 'get-error-card',
            507: 'study-pane-views',
            607: 'study-property-pages-with-definitions',
            731: 'add-compare-dialog',
            1583: 'lt-pane-views',
            1584: 'context-menu-renderer',
            1702: 'manage-drawings-dialog',
            1754: 'symbol-search-dialog',
            1859: 'go-to-date-dialog-impl',
            1890: 'line-tools-icons',
            2077: 'change-interval-dialog',
            2183: 'study-inputs-pane-views',
            2306: 'floating-toolbars',
            2377: 'hammerjs',
            2616: 'svg-renderer',
            2704: 'currency-label-menu',
            2878: 'drawing-toolbar',
            3005: 'header-toolbar',
            3030: 'new-confirm-inputs-dialog',
            3596: 'general-property-page',
            4013: 'custom-intervals-add-dialog',
            4079: 'series-pane-views',
            4389: 'take-chart-image-impl',
            4665: 'share-chart-to-social-utils',
            4862: 'object-tree-dialog',
            5009: 'load-chart-dialog',
            5093: 'chart-widget-gui',
            5516: 'restricted-toolset',
            5551: 'favorite-drawings-api',
            5598: 'lt-stickers-atlas',
            6166: 'chart-event-hint',
            6265: 'new-edit-object-dialog',
            6456: 'study-market',
            6631: 'study-template-dialog',
            6780: 'source-properties-editor',
            7078: 'general-chart-properties-dialog',
            7260: 'chart-bottom-toolbar',
            7271: 'compare-model',
            7648: 'show-theme-save-dialog',
            7987: 'lt-icons-atlas',
            8020: 'user-defined-bars-marks-tooltip',
            8537: 'lt-property-pages-with-definitions',
            8643: 'full-tooltips-popup',
            8890: 'simple-dialog',
            9039: 'lollipop-tooltip-renderer',
            9374: 'symbol-info-dialog-impl',
            9498: 'export-data',
            9685: 'series-icons-map',
          }[e] || e) +
          '.' +
          {
            6: 'a03a8ff024d47ed075c6',
            84: 'f6a5cab384a8d3fcf379',
            92: 'ebff97a1a4b1c5914bdd',
            139: '6635b794027eb9971ec9',
            507: 'cc5bd003161b0ea73f75',
            607: '9394d81cc8dbb2962879',
            731: '8be3343b197a4d862dba',
            855: '61db310932f8af2c5989',
            898: 'b63568700f1380e37b1a',
            962: 'e2eb6a85de39a3d76e5d',
            1013: 'ccba7f12442264960551',
            1033: 'bb804c64fe58de0bace7',
            1054: 'c09e1aa220385adef79a',
            1109: '845f0f111ff830ab93c8',
            1365: 'e1fe1d66c5bb17da7c3a',
            1553: 'c076714f5e24887f0b94',
            1583: 'fe06b5162a88616539a9',
            1584: 'd6dfc888e4d8fe785fa7',
            1702: '3f5b604134bebba28c6c',
            1754: 'b049a36e03e38984a69c',
            1762: '9511e5b410d7d629bc49',
            1849: 'fce185f1df6ea05f3d18',
            1859: '4aa6daee1b7dcb2f2f62',
            1890: 'd3d6f7f9f2b35209ccf1',
            1958: 'c039f5e1f22405ba79e1',
            2077: '297f80c00bf8731bd9fb',
            2109: '291fa715b6ded706c3dd',
            2158: '4b603780e909661194b1',
            2183: 'a80a3e282aa441e156d1',
            2191: '2197cc1b66a1db8969cc',
            2215: 'e87235d359e4c375c7b9',
            2260: '95dc0a20b147b6b2eeed',
            2306: '7e994754e6bfb1b219c3',
            2377: '6e30e0c48af40bf2f6c0',
            2587: '615babc52637decdb6e2',
            2616: 'f065beaf6b5b37da27d9',
            2639: 'a55d77a7912be54f7b9d',
            2666: 'd28c0fa0a323b8118f22',
            2676: 'a9a5ede4d514162164fa',
            2698: '4b20820853bff7088433',
            2704: '7bec84c28750f9ad9211',
            2731: '55eed17fefac5e82c077',
            2842: '61ec1448858319f48d5a',
            2878: '110884dcd2a2c71e1aba',
            2984: 'dc61504f5c150afee786',
            3005: 'd2fc9d0c0651e40374fb',
            3016: '1dc744fe35e3e3b00f00',
            3030: '700f756efb60fe024812',
            3066: '8b1d2ceb22d9fedde67b',
            3179: 'f9de135d1febd7be2652',
            3291: '99dfe1742621fe5892b1',
            3502: '1985af3fa836c4248178',
            3596: 'f8236e112fb77c9f7f75',
            3610: 'c79c6bddd919cb78428a',
            3717: '6f65e91a870250a6e450',
            3842: '8758110ab553b5368121',
            3889: 'c5a6834243c3ccfc1fcb',
            3980: '9d7eeb2bacce45c508b3',
            3986: '7c74089dc005a87cd0fc',
            4013: '1d320236ba24da2e3a2f',
            4062: '9229fac3ef3db26fd5bc',
            4079: '97a8e6dbe1a94532eb49',
            4215: '8934b190aaed2663c300',
            4378: '36f45309c7af8e3cbf38',
            4387: 'b928c72ea82decd4ae7b',
            4389: 'c0ec40f417c36a1c6179',
            4403: 'fc4cac3ecee3925b9ec2',
            4665: 'd7331dbca4a2aa0909e7',
            4713: 'e40c2c44bf79ceb73d67',
            4717: '48fa365046162fcf8939',
            4862: '4ff568f64fed9df9f328',
            4894: '035fecc664874bb752b0',
            4928: '5505afe565b4cb0d4e99',
            4987: 'a23484dfcca6d5fae195',
            5007: 'fba5211a5d34374a0759',
            5009: '2bc8d3998e1a2392ad03',
            5050: '9977fa324e6f16f06bc8',
            5093: '6a7c7ff3e283697270f6',
            5145: 'da831552b3b54ca47682',
            5163: '953e65e04ed31b0ea0b3',
            5403: 'a8ce3bbae4ddbe632714',
            5516: '859b53a884449a8a0f9a',
            5518: '5ea25a84bbc49fe198ae',
            5551: '685c412f518848b85b89',
            5598: '52ad6e6d7d7b134ab0ba',
            5649: '5c1e55c9dad604880876',
            5711: '85a69ca8e546ea6966e9',
            5766: 'becb57bd4a5725ec4dcd',
            5866: '039e25226b82968cca61',
            5899: '49534f304fa5f1815584',
            5901: '2c4016712a46748b42bf',
            5993: '0e5f49179c6a516963de',
            6025: 'd669a0315da9d6fda6b3',
            6036: '5b373caaaa6e1ba4495f',
            6106: '1d31df88e63bf542ea7b',
            6166: 'b2c7a312767fa4f97aa5',
            6214: '5a578175aab923a979dc',
            6221: '56c4d15c823c019ddb39',
            6265: '895005521f9296440679',
            6456: '78a4d2ffdb738c30bc84',
            6494: '7f264af8142cb9910c06',
            6625: '364cf21fe24d7e675de8',
            6631: 'faf557ce6d32f93e5a9a',
            6639: 'a1bd5bf1d51c681561a1',
            6738: '2cd7216417b8353f9a10',
            6752: '912872ffa56a7243d664',
            6780: '3c1d96776af15c5b5a1d',
            6831: '912351c7cf5f8ac16dfe',
            6884: '07642217627127113fb0',
            6949: 'f50051a55eaa8dd5e780',
            6959: '61ce9bf171293ea37c54',
            7078: '82cac28ab24654c72a42',
            7149: 'd450e8145ad7e6fbd67f',
            7194: '098c1a8da1ddbbda98f6',
            7260: '744ccf6a4674f31cb2ea',
            7271: 'e202d1fb2f84f3659e36',
            7350: 'aa555ff9e17c4029aedd',
            7391: 'c63bd39c42093cc4130c',
            7413: '3a52b91975b98e6fe8e4',
            7555: 'ea682716c26bc13db765',
            7648: 'd599965fb89ec8e183eb',
            7871: 'df6a9177c293c0c53e80',
            7987: 'aceb77470f3039ad2f63',
            8020: '520f315000510aab3003',
            8049: 'eb5d0cfe52ecca5d4a13',
            8056: 'c06a1c8fb4a1f18cf217',
            8149: '9fb525d10e5c8ba95701',
            8180: '640f9faeb3f5f9fa190f',
            8537: '48f0faa92ffe2f42ec0e',
            8643: 'bb8a6fb1afc2d9b39e17',
            8890: '2bb0f228f3ba2ab7961a',
            8904: '87e94e93ade13962a48f',
            9039: 'cbacd2a74fa2249c23ad',
            9138: 'f516266ddcf6ca8c7064',
            9322: 'fcbf1e7bff530c95a44f',
            9327: '0c38440ca52f144413ac',
            9374: '391e1e1a29220b089537',
            9498: '02a7668fbb079d66566d',
            9685: '6b7b2f52a18274053c99',
            9727: '673d467ba91bf371fccd',
            9789: '458feb5c8c0263b0618b',
            9842: '581808dd4a8651b16779',
            9916: '0c2cb2d12479a20efce1',
          }[e] +
          '.js'),
    (r.miniCssF = (e) =>
      e +
      '.' +
      {
        6: '362fa6a7ab1f3e3b06c4',
        84: 'd345a68da9c285edb24f',
        855: 'eac699ce13c5f226e490',
        898: '3efb27a9750af83ed9c6',
        1013: '8bf558e5776449ee9b26',
        1033: '5197f9f8b8500206d06c',
        1054: '53487a2be7f0ef3c0ac6',
        1109: 'ec16a629917db2baf412',
        1365: '0116666d16b5bc64c47a',
        1762: '7ff6b353c441db2276da',
        1849: 'aa435f081ad57a6d0121',
        2109: '39627406fe95483ff7db',
        2191: '4be2f56dab5aeadfe0eb',
        2260: 'b98824e4829a1aa9b444',
        2587: '1403c0d79d2217a73053',
        2639: '86605a3197db99aca0f7',
        2666: 'fbb750fd312778403036',
        2676: '2d3cabbd39a3b0d6e9ea',
        2698: '808054d9f713fc1919d7',
        2731: 'e35a685bdfdffcff2797',
        2984: '4082296827cdc2ce3974',
        3066: 'dc07d1c6b25360d267dd',
        3502: 'c49903f7222870ff8aca',
        3610: '609aa04cdd061440d0ef',
        3717: 'cccda056797616f8ac78',
        3842: '6a8a7842ee841f6d2cff',
        3889: 'a2646d6c3b33d166eee2',
        3980: 'f4c75de9958b6594bac6',
        4215: 'd24836a292b1969ab4bb',
        4387: '04308bdc36942462914c',
        4894: '670543ec1a8c4786a3a0',
        4928: '4a1b6faf9161be473ce9',
        4987: '9eeb86c4d3cfacadc52c',
        5145: 'a2b224fd27ab2941c565',
        5163: 'b9129281858e3f6afb05',
        5403: '28a935ee45ece03c1da9',
        5649: 'b60ed09c5ea8c55827d4',
        5866: 'c89b7fc29afe92efc1f3',
        5993: '31e4b81e8ea99883150e',
        6025: '263b457b1a7f9ca139b2',
        6036: '069ebb4bad0f5dd27147',
        6106: 'cf6f129517250c80b39f',
        6214: '65b7dbf8be6cca5ac143',
        6221: '5c115302948a4482dfc1',
        6494: 'f36c8c07be959ab522bb',
        6625: 'eb019e3a6facc625daff',
        6639: '2c6ed608ae2da878c517',
        6738: '96acde45b9effe0973eb',
        6752: '207eb3cc75b3ed2c6754',
        6831: 'ac1745947bd2665f6c9a',
        6884: 'bb7d30a7bbbe5af36556',
        6949: '6b6148a8f15c8898c9e9',
        6959: 'b688f948e1f896f359ed',
        7149: '5233dd4b27b2f1bea43f',
        7194: 'e04f69c8933166966874',
        7350: 'a9502dc8f01e37d9fa02',
        7391: '9c809fa91ed0c8f75bc0',
        7413: 'f830ad1ad6ee6f9b1cb3',
        7555: 'c7630ad44b7d7a2f8a0c',
        7871: 'cb99fc4ec9bbe0895a26',
        8049: '5e06299815b664b331e2',
        8056: '82b5717ea9f014c8ca2d',
        8149: '21f2b01074a4d082e268',
        8904: 'a302177fe7e3ccd50cb0',
        9138: 'c6bf63d3695b7e98a4e1',
        9322: 'a314183cdcb21e48c994',
        9327: 'cb8f92015e0b667cbd6e',
        9789: 'cb5ad20bc727d3820b6c',
        9842: 'dde7652ee3c148414acf',
        9916: 'd034c6ed4305c99b15ce',
      }[e] +
      '.css'),
    (r.g = (function () {
      if ('object' == typeof globalThis) return globalThis;
      try {
        return this || new Function('return this')();
      } catch (e) {
        if ('object' == typeof window) return window;
      }
    })()),
    (r.hmd = (e) => (
      (e = Object.create(e)).children || (e.children = []),
      Object.defineProperty(e, 'exports', {
        enumerable: !0,
        set: () => {
          throw new Error(
            'ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' +
              e.id
          );
        },
      }),
      e
    )),
    (r.o = (e, a) => Object.prototype.hasOwnProperty.call(e, a)),
    (c = {}),
    (f = 'tradingview:'),
    (r.l = (e, a, d, t) => {
      if (c[e]) c[e].push(a);
      else {
        var b, o;
        if (void 0 !== d)
          for (
            var n = document.getElementsByTagName('script'), i = 0;
            i < n.length;
            i++
          ) {
            var s = n[i];
            if (
              s.getAttribute('src') == e ||
              s.getAttribute('data-webpack') == f + d
            ) {
              b = s;
              break;
            }
          }
        b ||
          ((o = !0),
          ((b = document.createElement('script')).charset = 'utf-8'),
          (b.timeout = 120),
          r.nc && b.setAttribute('nonce', r.nc),
          b.setAttribute('data-webpack', f + d),
          (b.src = e),
          0 !== b.src.indexOf(window.location.origin + '/') &&
            (b.crossOrigin = 'anonymous')),
          (c[e] = [a]);
        var l = (a, d) => {
            (b.onerror = b.onload = null), clearTimeout(u);
            var f = c[e];
            if (
              (delete c[e],
              b.parentNode && b.parentNode.removeChild(b),
              f && f.forEach((e) => e(d)),
              a)
            )
              return a(d);
          },
          u = setTimeout(
            l.bind(null, void 0, { type: 'timeout', target: b }),
            12e4
          );
        (b.onerror = l.bind(null, b.onerror)),
          (b.onload = l.bind(null, b.onload)),
          o && document.head.appendChild(b);
      }
    }),
    (r.r = (e) => {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (r.nmd = (e) => ((e.paths = []), e.children || (e.children = []), e)),
    (() => {
      var e;
      r.g.importScripts && (e = r.g.location + '');
      var a = r.g.document;
      if (!e && a && (a.currentScript && (e = a.currentScript.src), !e)) {
        var d = a.getElementsByTagName('script');
        d.length && (e = d[d.length - 1].src);
      }
      if (!e)
        throw new Error(
          'Automatic publicPath is not supported in this browser'
        );
      (e = e
        .replace(/#.*$/, '')
        .replace(/\?.*$/, '')
        .replace(/\/[^\/]+$/, '/')),
        (r.p = e);
    })(),
    r.g.location &&
      r.p.startsWith(r.g.location.origin) &&
      (r.p = r.p.slice(r.g.location.origin.length)),
    (() => {
      const e = r.u;
      r.u = (a) => e(a).replace('__LANG__', r.g.language);
    })(),
    (r.p = r.g.WEBPACK_PUBLIC_PATH || r.p);
  var o = r.e,
    n = Object.create(null);
  function i(e, a) {
    return o(e).catch(function () {
      return new Promise(function (d) {
        var c = function () {
          self.removeEventListener('online', c, !1),
            !1 === navigator.onLine
              ? self.addEventListener('online', c, !1)
              : d(a < 2 ? i(e, a + 1) : o(e));
        };
        setTimeout(c, a * a * 1e3);
      });
    });
  }
  (r.e = function (e) {
    if (!n[e]) {
      n[e] = i(e, 0);
      var a = function () {
        delete n[e];
      };
      n[e].then(a, a);
    }
    return n[e];
  }),
    (() => {
      if ('undefined' != typeof document) {
        var e = (e) =>
            new Promise((a, d) => {
              var c = r.miniCssF(e),
                f = r.p + c;
              if (
                ((e, a) => {
                  for (
                    var d = document.getElementsByTagName('link'), c = 0;
                    c < d.length;
                    c++
                  ) {
                    var f =
                      (b = d[c]).getAttribute('data-href') ||
                      b.getAttribute('href');
                    if ('stylesheet' === b.rel && (f === e || f === a))
                      return b;
                  }
                  var t = document.getElementsByTagName('style');
                  for (c = 0; c < t.length; c++) {
                    var b;
                    if (
                      (f = (b = t[c]).getAttribute('data-href')) === e ||
                      f === a
                    )
                      return b;
                  }
                })(c, f)
              )
                return a();
              ((e, a, d, c, f) => {
                var t = document.createElement('link');
                (t.rel = 'stylesheet'),
                  (t.type = 'text/css'),
                  (t.onerror = t.onload =
                    (d) => {
                      if (((t.onerror = t.onload = null), 'load' === d.type))
                        c();
                      else {
                        var b = d && ('load' === d.type ? 'missing' : d.type),
                          r = (d && d.target && d.target.href) || a,
                          o = new Error(
                            'Loading CSS chunk ' + e + ' failed.\n(' + r + ')'
                          );
                        (o.code = 'CSS_CHUNK_LOAD_FAILED'),
                          (o.type = b),
                          (o.request = r),
                          t.parentNode && t.parentNode.removeChild(t),
                          f(o);
                      }
                    }),
                  (t.href = a),
                  0 !== t.href.indexOf(window.location.origin + '/') &&
                    (t.crossOrigin = 'anonymous'),
                  d
                    ? d.parentNode.insertBefore(t, d.nextSibling)
                    : document.head.appendChild(t);
              })(e, f, null, a, d);
            }),
          a = { 3666: 0 };
        r.f.miniCss = (d, c) => {
          a[d]
            ? c.push(a[d])
            : 0 !== a[d] &&
              {
                6: 1,
                84: 1,
                855: 1,
                898: 1,
                1013: 1,
                1033: 1,
                1054: 1,
                1109: 1,
                1365: 1,
                1762: 1,
                1849: 1,
                2109: 1,
                2191: 1,
                2260: 1,
                2587: 1,
                2639: 1,
                2666: 1,
                2676: 1,
                2698: 1,
                2731: 1,
                2984: 1,
                3066: 1,
                3502: 1,
                3610: 1,
                3717: 1,
                3842: 1,
                3889: 1,
                3980: 1,
                4215: 1,
                4387: 1,
                4894: 1,
                4928: 1,
                4987: 1,
                5145: 1,
                5163: 1,
                5403: 1,
                5649: 1,
                5866: 1,
                5993: 1,
                6025: 1,
                6036: 1,
                6106: 1,
                6214: 1,
                6221: 1,
                6494: 1,
                6625: 1,
                6639: 1,
                6738: 1,
                6752: 1,
                6831: 1,
                6884: 1,
                6949: 1,
                6959: 1,
                7149: 1,
                7194: 1,
                7350: 1,
                7391: 1,
                7413: 1,
                7555: 1,
                7871: 1,
                8049: 1,
                8056: 1,
                8149: 1,
                8904: 1,
                9138: 1,
                9322: 1,
                9327: 1,
                9789: 1,
                9842: 1,
                9916: 1,
              }[d] &&
              c.push(
                (a[d] = e(d).then(
                  () => {
                    a[d] = 0;
                  },
                  (e) => {
                    throw (delete a[d], e);
                  }
                ))
              );
        };
      }
    })(),
    (() => {
      var e = { 3666: 0, 6783: 0 };
      (r.f.j = (a, d) => {
        var c = r.o(e, a) ? e[a] : void 0;
        if (0 !== c)
          if (c) d.push(c[2]);
          else if (
            /^(1(0(13|33|54)|109|365|762|849)|2(6(39|66|76|98)|109|191|260|587|731|984)|3([06]66|502|610|717|842|889|980)|4([39]87|215|894|928)|5((16|40|99)3|145|649|866)|6(7(38|52|83)|[06]25|(21|49|88)4|(63|94|95)9||036|106|221|831)|7(149|194|350|391|413|555|871)|8([01]49|056|4|55|904|98)|9(32[27]|138|789|842|916))$/.test(
              a
            )
          )
            e[a] = 0;
          else {
            var f = new Promise((d, f) => (c = e[a] = [d, f]));
            d.push((c[2] = f));
            var t = r.p + r.u(a),
              b = new Error();
            r.l(
              t,
              (d) => {
                if (r.o(e, a) && (0 !== (c = e[a]) && (e[a] = void 0), c)) {
                  var f = d && ('load' === d.type ? 'missing' : d.type),
                    t = d && d.target && d.target.src;
                  (b.message =
                    'Loading chunk ' + a + ' failed.\n(' + f + ': ' + t + ')'),
                    (b.name = 'ChunkLoadError'),
                    (b.type = f),
                    (b.request = t),
                    c[1](b);
                }
              },
              'chunk-' + a,
              a
            );
          }
      }),
        (r.O.j = (a) => 0 === e[a]);
      var a = (a, d) => {
          var c,
            f,
            [t, b, o] = d,
            n = 0;
          if (t.some((a) => 0 !== e[a])) {
            for (c in b) r.o(b, c) && (r.m[c] = b[c]);
            if (o) var i = o(r);
          }
          for (a && a(d); n < t.length; n++)
            (f = t[n]), r.o(e, f) && e[f] && e[f][0](), (e[f] = 0);
          return r.O(i);
        },
        d = (self.webpackChunktradingview = self.webpackChunktradingview || []);
      d.forEach(a.bind(null, 0)), (d.push = a.bind(null, d.push.bind(d)));
    })(),
    (() => {
      const { miniCssF: e } = r;
      r.miniCssF = (a) =>
        self.document && 'rtl' === self.document.dir
          ? e(a).replace(/\.css$/, '.rtl.css')
          : e(a);
    })();
})();
