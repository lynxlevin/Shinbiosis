(function() {
  "use strict";

  function autoNum(event) {
      var record = event.record;

      // 製造番号選択を取得し、2桁の年を取得する
      var dt = record['製造番号選択'].value;

      // クエリ文の設定
      var query = {
          "app": kintone.app.getId(),
          "query": '製造番号選択 = "' + dt + '" order by ロットNo desc limit 1'
      };

      // 設定された製造番号選択から最新の番号を取得する
      return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', query).then(function(resp) {
          var records = resp.records;

          // 対象レコードがあった場合
          if (records.length > 0) {
              var rec = records[0];
              var autono = rec['ロットNo'].value;
              autono = parseInt(autono.substring(10, 12), 10) + 1;
              autono = '00' + autono;
              autono = dt.substring(0, 9) + '-' + autono.substring(autono.length - 2);
              event.record['ロットNo'].value = autono;

          // 対象レコードがなかった場合
          } else {
              event.record['ロットNo'].value = dt.substring(0, 9) + '-01';
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
      record['ロットNo'].disabled = true;
      return event;
  });


  // 編集画面表示
  kintone.events.on(['app.record.edit.show', 'app.record.index.edit.show'], function(event) {
      var record = event.record;
      //フィールドを非活性にする
      record['ロットNo'].disabled = true;
      record['製造番号選択'].disabled = true;
      return event;
  });

})();