(function() {
  "use strict";

  function autoNum(event) {
      var record = event.record;

      // 「製造番号選択」を取得する
      var dt = record['製造番号選択'].value;

      // 同じ製造番号のレコードを取得するためのクエリ文の設定
      var query = {
          "app": kintone.app.getId(),
          "query": '製造番号選択 = "' + dt + '" order by ロットNo自動採番 desc limit 1'
      };

      // 上記のクエリで最新のレコードを取得する
      return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', query).then(function(resp) {
          var records = resp.records;

          // 対象レコードがあった場合 → 末尾の数字を1大きくする
          if (records.length > 0) {
              var rec = records[0];
              var autono = rec['ロットNo自動採番'].value;
              autono = parseInt(autono.substring(10, 12), 10) + 1;
              autono = '00' + autono;
              autono = dt.substring(0, 9) + '-' + autono.substring(autono.length - 2);
              event.record['ロットNo自動採番'].value = autono;

          // 対象レコードがなかった場合 → 製造番号の末尾に-01をつける
          } else {
              event.record['ロットNo自動採番'].value = dt + '-01';
          }
          return event;
      }).catch(function(e) {
          alert("レコードの取得でエラーが発生しました  - error: " + e.message);
          return false;
      });
  }

  //新規作成画面の保存
  kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], autoNum);


  // 新規作成画面表示
  kintone.events.on('app.record.create.show', function(event) {
      var record = event.record;
      //フィールドを非活性にする
      record['ロットNo自動採番'].disabled = true;
      return event;
  });


  // 編集画面表示
  kintone.events.on(['app.record.edit.show', 'app.record.index.edit.show'], function(event) {
      var record = event.record;
      //フィールドを非活性にする
      record['ロットNo自動採番'].disabled = true;
      return event;
  });

})();