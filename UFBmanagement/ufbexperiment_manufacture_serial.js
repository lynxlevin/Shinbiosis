(function() {
  "use strict";

  function lotToManufacture(event) {
      var record = event.record;

      // 「使用したロットNo」を取得し、「製造番号」(dtm)にする
      var dt = record['使用したロットNo'].value;
      var dtm = dt.substring(0,9);

      // 「製造番号参照用」にdtmを表示する
      event.record['製造番号参照用'].value = dtm;
      return event;
  }

  // 新規作成画面と編集画面で「使用したロットNo.」を取得したときに動作する
  kintone.events.on(['app.record.create.change.使用したロットNo', 'app.record.edit.change.使用したロットNo'], lotToManufacture);


  // 新規作成画面、編集画面表示
  kintone.events.on(['app.record.create.show','app.record.edit.show', 'app.record.index.edit.show'], function(event) {
      var record = event.record;
      //フィールドを非活性にする
      record['製造番号参照用'].disabled = true;
      return event;
  });

})();