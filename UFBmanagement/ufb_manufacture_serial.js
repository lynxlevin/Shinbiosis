(function() {
  "use strict";

  function autoNum(event) {
      var record = event.record;

      // 製造終了日時を取得し、2桁の年を取得する
      var dt = record['製造終了日時'].value;
      var dtyymmdd = dt.substring(0, 10); // ll 製造終了日時の日付部分
      var dtmin = dtyymmdd; // ll dtyymmdd
      var dtmax = dt.substring(0, 8) + (parseInt(dt.substring(8,10), 10) + 1); // ll dtyymmddの翌日

      // クエリ文の設定
      var query = {
          "app": kintone.app.getId(),
          "query": '製造終了日時 >= "' + dtmin + '" and 製造終了日時 < "' + dtmax + '" order by 製造番号 desc limit 1'
      };

      // 設定された製造終了日時から最新の番号を取得する
      return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', query).then(function(resp) {
          var records = resp.records;

          // 対象レコードがあった場合
          if (records.length > 0) {
              var rec = records[0];
              var autono = rec['製造番号'].value;
              autono = parseInt(autono.substring(7, 9), 10) + 1;
              autono = '00' + autono;
              autono = dt.substring(2, 4) + dt.substring(5, 7) + dt.substring(8, 10) + '-' + autono.substring(autono.length - 2);
              event.record['製造番号'].value = autono;

          // 対象レコードがなかった場合
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
      record['製造終了日時'].disabled = true;
      return event;
  });

})();