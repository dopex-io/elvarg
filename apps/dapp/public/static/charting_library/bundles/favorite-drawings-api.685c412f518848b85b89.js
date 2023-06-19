'use strict';
(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5551],
  {
    71355: (i, t, e) => {
      e.r(t), e.d(t, { FavoriteDrawingsApi: () => n });
      var s = e(50151),
        o = e(58275),
        a = e.n(o),
        l = e(241);
      class n {
        constructor() {
          (this._visibility = new (a())(!1)),
            (this._canBeShownValue = new (a())(!1)),
            (this._toolbarPromise = null),
            (this._toolbar = null),
            this._init();
        }
        visible() {
          return this._visibility.readonly();
        }
        canBeShown() {
          return this._canBeShownValue.readonly();
        }
        show() {
          (0, s.ensureNotNull)(this._toolbarPromise).then((i) => {
            i.showAndSaveSettingsValue();
          });
        }
        hide() {
          null !== this._toolbarPromise &&
            this._toolbarPromise.then((i) => {
              i.hideAndSaveSettingsValue();
            });
        }
        _init() {
          (0, l.createFavoriteDrawingToolbar)();
          const i = (0, s.ensureNotNull)(
            (0, l.getFavoriteDrawingToolbarPromise)()
          );
          this._toolbarPromise = i.then(
            (i) => (
              (this._toolbar = i),
              this._visibility.setValue(this._toolbar.visibility().value()),
              this._canBeShownValue.setValue(
                this._toolbar.canBeShown().value()
              ),
              this._toolbar.visibility().subscribe((i) => {
                this._visibility.setValue(i);
              }),
              this._toolbar.canBeShown().subscribe((i) => {
                this._canBeShownValue.setValue(i);
              }),
              this._toolbar
            )
          );
        }
      }
    },
  },
]);
