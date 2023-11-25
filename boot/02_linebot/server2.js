'use strict';

// ########################################
//               初期設定など
// ########################################

// パッケージを使用します
const express = require('express');
const line = require('@line/bot-sdk');

// ローカル（自分のPC）でサーバーを公開するときのポート番号です
const PORT = process.env.PORT || 3000;

// Messaging APIで利用するクレデンシャル（秘匿情報）です。
const config = {
  channelSecret: process.env.CHANNEL_SECRET || 'd0944d6d1d0c2d04bb758acd0bc90f56',
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || 'khIsBoKTlOj105cc0ZyPFQQtaVz0rJ15US7u+xGOQWsF+TKO0dzdsg3lVKAB3IHLS/A1kDkUfHAjcMQiP74WGbYu0n0orkFcPPjxNH0qHagbQ1Qxt0CQ2T6YDRqp3O7BboYgtwdw8WlrZ8ttAXa7LgdB04t89/1O/w1cDnyilFU=',
};

// ########## ▼▼▼ サンプル関数 ▼▼▼ ##########
const sampleFunction = async (event) => {
    // ユーザーメッセージが「ねこ」か「いぬ」かどうか
    if (event.message.text !== 'ねこ' && event.message.text !== 'いぬ') {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{
          type: 'text',
          text: '「ねこ」か「いぬ」と話しかけてね'
        }]
      });
    } else {
      // 「リプライ」を使って先に返事しておきます
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [{
          type: 'text',
          text: 'ちょっとまってね……'
        }]
      });
      let pushData = {};
      try {
        // 「ねこ」と送ってきたら
        if (event.message.text === 'ねこ') {
            const res = await fetch('https://api.thecatapi.com/v1/images/search');
            const data = await res.json();
            const url = data[0].url;
    
            pushData = [{
              type: 'image',
              originalContentUrl: url,
              previewImageUrl: url
            }];
          }
        else if (event.message.text === 'いぬ') {
          // axiosでいぬの画像をランダム取得するAPIを叩きます
          const res = await fetch('https://dog.ceo/api/breeds/image/random');
          const data = await res.json();
          // 画像を送るメッセージを作る
          pushData = [{
            type: 'image',
            originalContentUrl: data.message,
            previewImageUrl: data.message
          }];
        }
      } catch (error) {
        // APIからエラーが返ってきたらターミナルに表示する
        console.error(error);
        // テキストで誤りのメッセージを送る
        pushData = {
          type: 'text',
          text: '検索中にエラーが発生しました。ごめんね。'
        };
      }
  
      // 「プッシュ」で後からユーザーに通知します
      return client.pushMessage({
        to: event.source.userId, 
        messages: pushData
      });
    }
  };
// ########## ▲▲▲ サンプル関数 ▲▲▲ ##########

// ########################################
//  LINEサーバーからのWebhookデータを処理する部分
// ########################################

// LINE SDKを初期化します
const client = new line.messagingApi.MessagingApiClient(config)

// LINEサーバーからWebhookがあると「サーバー部分」から以下の "handleEvent" という関数が呼び出されます
async function handleEvent(event) {
    // 受信したWebhookが「テキストメッセージ以外」であればnullを返すことで無視します
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    // サンプル関数を実行します
    return sampleFunction(event);
}

// ########################################
//          Expressによるサーバー部分
// ########################################

// expressを初期化します
const app = express();

// HTTP POSTによって '/webhook' のパスにアクセスがあったら、POSTされた内容に応じて様々な処理をします
app.post('/webhook', line.middleware(config), (req, res) => {
  
  // 検証ボタンをクリックしたときに飛んできたWebhookを受信したときのみ以下のif文内を実行
  if (req.body.events.length === 0) {
    res.send('Hello LINE BOT! (HTTP POST)'); // LINEサーバーに返答します（なくてもよい）
    console.log('検証イベントを受信しました！'); // ターミナルに表示します
    return; // これより下は実行されません
  } else {
    // 通常のメッセージなど … Webhookの中身を確認用にターミナルに表示します
    console.log('受信しました:', req.body.events);
  }
  // あらかじめ宣言しておいた "handleEvent" 関数にWebhookの中身を渡して処理してもらい、
  // 関数から戻ってきたデータをそのままLINEサーバーに「レスポンス」として返します
  Promise.all(req.body.events.map(handleEvent)).then((result) => res.json(result));
});

// 最初に決めたポート番号でサーバーをPC内だけに公開します
// （環境によってはローカルネットワーク内にも公開されます）
app.listen(PORT);
console.log(`ポート${PORT}番でExpressサーバーを実行中です…`);