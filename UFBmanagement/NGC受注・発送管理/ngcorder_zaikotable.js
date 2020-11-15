(function() {
  "use strict";

  function getStock(event) {
    var record = event.record;

    // 「処理状況」が「受注」の場合のみ動作
    if (record.処理状況.value != "受注") {
      record.備考注文.value = "1";
      return event;
      // return null;
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
              array.push = {
                value: {
                  '在庫ロットNo': {
                    value: record.ロットNo.value,
                    type: 'SINGLE_LINE_TEXT'
                  },
                  '封入気体表示用': {
                    value: record.封入気体表示用.value,
                    type: 'SINGLE_LINE_TEXT'
                  },
                  '容量種別表示用': {
                    value: record.容量種別表示用.value,
                    type: 'SINGLE_LINE_TEXT'
                  },
                  '出庫数量': {
                    value: subrecord.value.出庫数量.value,
                    type: 'NUMBER'
                  }
                }
            });
          });
          event.record.発送テーブル.value = array;
        }
        // 対象レコードがなかった場合 → 何もしない
        return event;
      }).catch(function(e) {
          alert("レコードの取得でエラーが発生しました  - error: " + e.message);
          return false;
      }); 
    }
  }

  //新規作成画面と編集画面の表示で動作
  kintone.events.on(['app.record.create.show', 'app.record.edit.show'], getStock);


  // // 新規作成画面表示
  // kintone.events.on('app.record.create.show', function(event) {
  //     var record = event.record;
  //     //フィールドを非活性にする
  //     record['ロットNo'].disabled = true;
  //     return event;
  // });


  // // 編集画面表示
  // kintone.events.on(['app.record.edit.show', 'app.record.index.edit.show'], function(event) {
  //     var record = event.record;
  //     //フィールドを非活性にする
  //     record['ロットNo'].disabled = true;
  //     return event;
  // });

})();


// var array = [
//   {
//     value: {
//       "在庫ロットNo": {
//         value: "1", type: "SINGLE_LINE_TEXT"
//       }, 
//       "封入気体表示用": {
//         value: "H2", type: "SINGLE_LINE_TEXT"
//       }, 
//       "容量種別表示用": {
//         value: "2l", type: "SINGLE_LINE_TEXT"
//       }, 
//       "出庫数量": {
//         value: "1", type: "NUMBER"
//       }
//     }
//   }, 
//   {
//     value: {
//       "在庫ロットNo": {
//         value: "2", type: "SINGLE_LINE_TEXT"
//       }, 
//       "封入気体表示用": {
//         value: "O3", type: "SINGLE_LINE_TEXT"
//       }, 
//       "容量種別表示用": {
//         value: "3l", type: "SINGLE_LINE_TEXT"
//       }, 
//       "出庫数量": {
//         value: "2", type: "NUMBER"
//       }
//     }
//   }
// ]