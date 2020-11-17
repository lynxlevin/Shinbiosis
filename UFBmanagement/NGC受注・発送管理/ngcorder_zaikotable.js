(function() {
  "use strict";

  function getStock(event) {
    var record = event.record;

    // 「処理状況」が「未対応」または「受注確認済」の場合のみ動作
    if (record.処理状況.value != "未対応" && record.処理状況.value != "受注確認済") {
      return null;
    } else {

      // 「受注レコード番号」を取得する
      var dt = record['受注レコード番号'].value;
      
      // 在庫管理のテーブル情報より、「受注レコード番号」が一致するデータを取得
      var query = {
        "fields": ["ロットNo", "封入気体表示用", "容量種別表示用", "出庫履歴"],
        "app": 69, //在庫管理
        "query": '受注レコード番号 in("' + dt + '")'
      };
      
      // 上記のクエリで最新のレコードを取得する
      return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', query).then(function(resp) {
        var records = resp.records;
        
        // 対象レコードがあった場合 → 内容を「発送テーブル」に入力する
        if (records.length > 0) {
          var array = [];
          records.forEach(record => {
            record.出庫履歴.value.forEach(subrecord => {
              if (subrecord.value.受注レコード番号.value == dt) {
                array.push({
                  value: {
                    '在庫ロットNo': {
                      value: record.ロットNo.value,
                      type: 'SINGLE_LINE_TEXT'
                    },
                    '出庫数量': {
                      value: subrecord.value.出庫数量.value,
                      type: 'NUMBER'
                    }
                    // 「封入気体表示用」と「容量種別表示用」はルックアップで取得 
                  }
                });
              }
            });
          });
          event.record.発送在庫情報.value = array;
          event.record.発送在庫情報.value.forEach(row => {
            row.value.在庫ロットNo.lookup = true;
            });
        }
        
        // 対象レコードがなかった場合 → 何もしない
        return event;
      }).catch(function(e) {
          alert("レコードの取得でエラーが発生しました  - error: " + e.message);
          return false;
      }); 
    }
  }

  // 編集画面の表示で動作
  kintone.events.on('app.record.edit.show', getStock);

  // 新規作成画面と編集画面の表示でフィールドを非活性にする
  kintone.events.on(['app.record.create.show', 'app.record.edit.show', 'app.record.create.change.発送在庫情報', 'app.record.edit.change.発送在庫情報'], function(event) {
    var record = event.record;
    record.発送在庫情報.value.forEach(row => {
      row.value.出庫数量.disabled = true;
      row.value.在庫ロットNo.disabled = true;
    })
    return event;
  });

})();