
// 調べたいタグ名を入力する
const tag = 'JavaScript';
// 日本語タグでも対応できる形に変換
const encodedTag = encodeURI(tag);

// アクセストークンを入力する
const access_token = process.env.ACCESS_TOKEN || 'v1WjHgg5jfYvFwW1uvxa2WxhLHescEJOKBeNOmjBZWq';

const getTagData = async() => {
    // 利用するAPIを変えるときは、fetchの中を変えましょう
    const res = await fetch(`https://qiita.com/api/v2/tags/${encodedTag}`, {
      method: 'GET'
    });
    const data = await res.json()
    console.log(data);
    return data;
}

const main = async() => {
    // タグのデータを取得している部分
    const tagData = await getTagData();

    // フォロワー数を返している部分。返す情報を変えるときはこの部分を変えましょう。
    const followersCount = tagData.followers_count;
    const message = `${tag}のフォロワー数は${followersCount}人です。`;
    sendNotify(message, access_token);
}

main();

/**
 * ********************************
 * ここから下は触らなくて大丈夫です。*
 * ********************************
 */
const sendNotify = async(message, access_token) => {
    // これがLINE NotifyのAPIです。ここでもAPIを利用しています。
    const url = 'https://notify-api.line.me/api/notify';
    const headers = {
      "Content-Type": 'application/x-www-form-urlencoded',
      "Authorization": `Bearer ${access_token}`,
    };
    const encodedMessage = `message=${encodeURIComponent(message)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers:headers,
      body: encodedMessage
    });
    const result = await res.json();
    console.log(result);
}