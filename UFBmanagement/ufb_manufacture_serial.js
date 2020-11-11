(function() {
  "use strict";

  function autoNum(event) {
      var record = event.record;

      // 日付を取得し、2桁の年を取得する
      var dt = record['日付'].value;
      var dtyy = dt.substring(0, 4); // ll dtyy は その日にする
      var dtmin = dtyy + '-01-01';  // ll dtmin は　その日の00:00
      var dtmax = (parseInt(dtyy, 10) + 1) + '-01-01'; // ll dtmax は その日の23:59

      // クエリ文の設定
      var query = {
          "app": kintone.app.getId(),
          "query": '日付 >= "' + dtmin + '" and 日付 < "' + dtmax + '" order by 自動採番 desc limit 1'  // ll < を　<= にする
      };

      // 設定された日付から最新の番号を取得する
      return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', query).then(function(resp) {
          var records = resp.records;

          // 対象レコードがあった場合
          if (records.length > 0) {
              var rec = records[0];
              var autono = rec['自動採番'].value;
              autono = parseInt(autono.substring(3), 10) + 1;
              autono = '00000' + autono;
              autono = dt.substring(2, 4) + '-' + autono.substring(autono.length - 5);
              event.record['自動採番'].value = autono;

          // 対象レコードがなかった場合
          } else {
              event.record['自動採番'].value = dt.substring(2, 4) + '-00001';
          }
          return event;
      }).catch(function(e) {
          alert("レコードの取得でエラーが発生しました  - error: " + e.message);
          return false;
      });
  }

  //新規作成画面の保存
  kintone.events.on('app.record.create.submit', autoNum);


  // 新規作成画面表示
  kintone.events.on('app.record.create.show', function(event) {
      var record = event.record;
      //フィールドを非活性にする
      record['自動採番'].disabled = true;
      return event;
  });


  // 編集画面表示
  kintone.events.on(['app.record.edit.show', 'app.record.index.edit.show'], function(event) {
      var record = event.record;
      //フィールドを非活性にする
      record['自動採番'].disabled = true;
      record['日付'].disabled = true;
      return event;
  });

})();