'use strict';

const line = require('@line/bot-sdk');
// const dotenv = require('dotenv');　// dotenv使うときにコメントアウト外してください
// dotenv.config();

// Messaging APIを利用するための鍵を設定します。
const config = {
  channelSecret: process.env.CHANNEL_SECRET || 'd0944d6d1d0c2d04bb758acd0bc90f56',
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || 'khIsBoKTlOj105cc0ZyPFQQtaVz0rJ15US7u+xGOQWsF+TKO0dzdsg3lVKAB3IHLS/A1kDkUfHAjcMQiP74WGbYu0n0orkFcPPjxNH0qHagbQ1Qxt0CQ2T6YDRqp3O7BboYgtwdw8WlrZ8ttAXa7LgdB04t89/1O/w1cDnyilFU=',
};
const client = new line.messagingApi.MessagingApiClient(config)

const main = async () => {

    const messages = [{
        type: 'text',
        text: 'いっせい送信です！' // ここに書いてある言葉が一斉送信されます
    }];

    try {
        const res = await client.broadcast({messages});
        console.log(res);        
    } catch (error) {
        console.log(`エラー: ${error.statusMessage}`);
        console.log(error.originalError.response.data);
    }
}

main();