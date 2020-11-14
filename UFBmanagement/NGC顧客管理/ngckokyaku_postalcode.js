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
                    alert('郵便番号を修正してください_02');
                }
            }else{
                alert('郵便番号を修正してください_02');
            }
            } else if (response.message) {
                alert('郵便番号を修正してください_03');
            } else {
                alert('郵便番号から住所を検索しましたが、失敗しました_04');
            }
        },
        function(body) {
            alert('郵便番号から住所の検索に失敗しました_05');
        }
        );
        return event;
  }

  //新規作成画面と編集画面の郵便番号入力
  kintone.events.on(['app.record.create.change.郵便番号半角', 'app.record.edit.change.郵便番号半角'], autoAddress);

})();
