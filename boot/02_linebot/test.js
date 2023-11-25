'use strict';

// モジュールの読み込み
const line = require('@line/bot-sdk');
const OpenAI = require('openai');
const express = require('express');
// const dotenv = require('dotenv'); //
// dotenv.config();

// 設定
const config = {
  channelSecret: process.env.CHANNEL_SECRET || 'CHANNEL_SECRET',
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || 'CHANNEL_ACCESS_TOKEN',
};

// GPTのAPIKEY
const apiKey = process.env.OPENAI_API_KEY || 'OPENAI_API_KEY';
const openai = new OpenAI({apiKey});

const makeCompletion = async (userMessage) => {
  const prompt = {
      role: "system", 
      content: `## あなたはアニメ「遊戯王デュエルモンスターズ」の海馬瀬人です。
                ## 海馬社長らしく自信たっぷりで偉そうに応答してください。
                ## 海馬社長らしくストイックで勝利に貪欲な雰囲気で応答してください。
                ## 海馬社長らしく少し馬鹿にするような雰囲気でビジネス用語を詳しく解説してください。
                ## あなたの一人称は「俺様」で、「私」や「僕」や「拙者」とは言いません。
                ## あなたが相手を指すときは「貴様」で、「あなた」や「君」とは言いません。
                ## 応答の冒頭は高確率で「ふん...」と言ってください。`
  };

  const sendMessage = [prompt, userMessage];
  console.log(sendMessage);

  const generated = await openai.chat.completions.create({
  messages: sendMessage,
      model: "gpt-3.5-turbo-1106",
  });
  return generated
};

const client = new line.messagingApi.MessagingApiClient(config);
// メッセージイベントの処理
async function handleEvent(event) {
  // テキストメッセージ以外は無視
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = {
    role: "user",
    content: event.message.text
  };

  // ChatGPT APIにリクエストを送る
  try {
    const completion = await makeCompletion(userMessage);
    // レスポンスから返答を取得
      const reply = completion.choices[0].message.content;
      // 返答をLINEに送る
      return client.replyMessage({
        replyToken: event.replyToken, 
        messages:[{
          type: 'text',
          text: reply
        }]
      });
  } catch (error) {
    // エラーが発生した場合はログに出力
    console.error(error);
    return Promise.resolve(null);
  }
}

const port = process.env.PORT || 3000;
const app = express()
  .get('/', (_, res) => res.send('hello LINE Bot'))
  .post('/webhook', line.middleware(config), (req, res) => {
    if (req.body.events.length === 0) {
      res.send('Hello LINE BOT! (HTTP POST)');
      console.log('検証イベントを受信しました');
      return
    } else {
      console.log(req.body.events);
    }
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
  })
app.listen(port);
console.log(`PORT${port}番でサーバーを実行中です`)
