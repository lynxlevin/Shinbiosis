(function() {
  "use strict";

  function showAirType(event) {
      var record = event.record;

      // 「製造番号選択」を取得する
      var dt = record['製造番号選択'].value;

      // 同じ製造番号のレコードを取得するためのクエリ文の設定 （appはUFB製造管理のアプリ番号68を指定）
      var query = {
        "app": 68,
        "query": '製造番号 = "' + dt + '" order by 製造番号 desc limit 1'
      };

      // 上記のクエリで最新のレコードを取得する
      return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', query).then(function(resp) {
        var records = resp.records;

        // 対象レコードがあった場合 → 製造管理の封入気体表示用の内容を在庫管理の封入気体参照用に表示する
        if (records.length > 0) {
          var rec = records[0];
          var airtype = rec['封入気体表示用'].value;
          event.record['封入気体参照用'].value = airtype;

        // 対象レコードがなかった場合 → 何もしない
        }
        return event;
      }).catch(function(e) {
          alert("レコードの取得でエラーが発生しました  - error: " + e.message);
          return false;
      });
  }

  // 新規作成画面と編集画面で保存したときに動作する
  kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], showAirType);


  // 新規作成画面、編集画面表示
  kintone.events.on(['app.record.create.show','app.record.edit.show', 'app.record.index.edit.show'], function(event) {
      var record = event.record;
      //フィールドを非活性にする
      record['封入気体参照用'].disabled = true;
      return event;
  });

})();