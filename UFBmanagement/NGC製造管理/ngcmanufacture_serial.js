(function() {
  "use strict";

  function autoNum(event) {
      var record = event.record;

      // 「製造開始日時」を取得し、日付を取得する
      var dt = record['製造開始日時'].value;
      var dtyymmdd = dt.substring(0, 10); // 製造開始日時の日付部分
      var dtmin = dtyymmdd;
      var dtmax = dt.substring(0, 8) + (parseInt(dt.substring(8,10), 10) + 1); // dtminの翌日

      // 同じ日付のレコードを取得するためのクエリ文の設定
      var query = {
          "app": kintone.app.getId(),
          "query": '製造開始日時 >= "' + dtmin + '" and 製造開始日時 < "' + dtmax + '" order by 製造番号 desc limit 1'
      };

      // 上記のクエリで最新のレコードを取得する
      return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', query).then(function(resp) {
          var records = resp.records;

          // 対象レコードがあった場合 → 末尾の数字を1大きくする
          if (records.length > 0) {
              var rec = records[0];
              var autono = rec['製造番号'].value;
              autono = parseInt(autono.substring(7, 9), 10) + 1;
              autono = '00' + autono;
              autono = dt.substring(2, 4) + dt.substring(5, 7) + dt.substring(8, 10) + '-' + autono.substring(autono.length - 2);
              event.record['製造番号'].value = autono;

          // 対象レコードがなかった場合 → 日付の末尾に-01をつける
          } else {
              event.record['製造番号'].value = dt.substring(2, 4) + dt.substring(5, 7) + dt.substring(8, 10) + '-01';
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
      record['製造番号'].disabled = true;
      return event;
  });


  // 編集画面表示
  kintone.events.on(['app.record.edit.show', 'app.record.index.edit.show'], function(event) {
      var record = event.record;
      //フィールドを非活性にする
      record['製造番号'].disabled = true;
      record['製造開始日時'].disabled = true;
      return event;
  });

})();