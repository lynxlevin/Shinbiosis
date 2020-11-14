(function() {
  "use strict";

  function autoAddress(event) {
      var record = event.record;

      // 「郵便番号半角」を取得する
      var zipcode = record['郵便番号半角'].value;



    kintone.proxy(
        'http://zipcloud.ibsnet.co.jp/api/search?zipcode=' + zipcode,
        'GET',
        {},
        {},
        function(body) {
          var response = JSON.parse(body);
          var record = kintone.app.record.get();
          if (response.status == 200) {
            if(response.results != null){
              if(response.results.length > 0){
                var prefecture = '';
                var city = '';
                prefecture = prefecture + (response.results[0].address1 != null ? response.results[0].address1 : '');
                city = city + (response.results[0].address2 != null ? response.results[0].address2 : '');
                city = city + (response.results[0].address3 != null ? response.results[0].address3 : '');
                record.record.住所都道府県.value = prefecture;
                record.record.市区町村.value = city;
                kintone.app.record.set(record);
              } else {
                record.record.address.value = '← 郵便番号を修正してください。_01(' + response.message + ')';
                kintone.app.record.set(record);
              }
            }else{
              record.record.address.value = '← 郵便番号を修正してください。_02(' + response.message + ')';
              kintone.app.record.set(record);
            }
          } else if (response.message) {
            record.record.address.value = '← 郵便番号を修正してください。_03(' + response.message + ')';
            kintone.app.record.set(record);
          } else {
            alert('郵便番号から住所を検索しましたが、失敗しました_04');
          }
        },
        function(body) {
          alert('郵便番号から住所の検索に失敗しました_05');
        }
      );
      return event;






































    //   // APIにアクセスするためのアドレスの作成
    //   var url = `https://madefor.github.io/postal-code-api/api/v1/${dt3}/${dt4}.json`;

    //   // 上記のアドレスでAPIから住所を取得する
    //   const XHR = new XMLHttpRequest();
    //   XHR.open("GET", url, true);
    //   XHR.responseType = "json";
    //   XHR.send();

    //   var address = XHR.response.data[0].ja;
    //   var prefecture = address.prefecture;
    //   var city = address.address1 + address.address2;   // 大阪市淀川区西中の部分

    //   event.record['住所都道府県'].value = prefecture;
    //   event.record['市区町村'].value = city;




    //   return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', query).then(function(resp) {
    //       var records = resp.records;

    //       // 対象レコードがあった場合 → 末尾の数字を1大きくする
    //       if (records.length > 0) {
    //           var rec = records[0];
    //           var autono = rec['ロットNo自動採番'].value;
    //           autono = parseInt(autono.substring(10, 12), 10) + 1;
    //           autono = '00' + autono;
    //           autono = dt.substring(0, 9) + '-' + autono.substring(autono.length - 2);
    //           event.record['ロットNo自動採番'].value = autono;

    //       // 対象レコードがなかった場合 → 製造番号の末尾に-01をつける
    //       } else {
    //           event.record['ロットNo自動採番'].value = dt + '-01';
    //       }
    //       return event;
    //   }).catch(function(e) {
    //       alert("レコードの取得でエラーが発生しました  - error: " + e.message);
    //       return false;
    //   });
  }

  //新規作成画面と編集画面の郵便番号入力
  kintone.events.on(['app.record.create.change.郵便番号半角', 'app.record.edit.change.郵便番号半角'], autoAddress);

})();
