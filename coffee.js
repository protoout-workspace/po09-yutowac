'use strict';

// main() という関数をここで定義しておきます。
// 定義するだけでは、中身はまだ実行されません。
const main = async () => {
    const url = "https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?applicationId=1020580670242251309&keyword=Coffee&hits=1&format=json"
    // Rakuten APIに「HTTP GET」という形式で「リクエスト」を送り、「レスポンス」を受け取ります。
    const res = await fetch(url, {method: 'GET'});
    const data = await res.json();
    // ターミナルに受け取った結果を出力します。
    console.log(data.Items);
}

// 上で定義した関数をここで実行します。
main();