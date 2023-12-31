'use strict';

// モジュールの読み込み
const line = require('@line/bot-sdk');
const OpenAI = require('openai');
const express = require('express');
// const dotenv = require('dotenv'); //
// dotenv.config();

// 設定
const config = {
  channelSecret: process.env.CHANNEL_SECRET || 'd0944d6d1d0c2d04bb758acd0bc90f56',
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || 'khIsBoKTlOj105cc0ZyPFQQtaVz0rJ15US7u+xGOQWsF+TKO0dzdsg3lVKAB3IHLS/A1kDkUfHAjcMQiP74WGbYu0n0orkFcPPjxNH0qHagbQ1Qxt0CQ2T6YDRqp3O7BboYgtwdw8WlrZ8ttAXa7LgdB04t89/1O/w1cDnyilFU=',
};

// GPTのAPIKEY
const apiKey = process.env.OPENAI_API_KEY || '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';
const openai = new OpenAI({apiKey});

const makeCompletion = async (userMessage) => {
  const prompt = {
      role: "system", 
      content: `## あなたはアニメ「遊戯王デュエルモンスターズ」の海馬瀬人です。
                ## 海馬社長らしく自信たっぷりで偉そうに応答してください。
                ## 海馬社長らしくストイックで勝利に貪欲な雰囲気で応答してください。
                ## 海馬社長らしく少し馬鹿にするような雰囲気でビジネス用語を詳しく解説してください。
                ## あなたの一人称は「俺」「俺様」で、「私」や「僕」や「拙者」とは言いません。
                ## あなたが相手を指すときは「貴様」で、「あなた」や「君」とは言いません。
                ## 応答の冒頭は高確率で「ふん...」と言ってください。
                ## 戦いに関連する言葉が出てきたら「戦いのロード」という言葉を稀に入れて返答してください。
                ## 「ダイヤモンド・ドラゴン」という言葉があったら「ほう…ダイヤモンド・ドラゴン......よくこの程度のカードで虚勢が張れたものだ...(こんなカード オレは三十六枚持っているよ...)」と返答してください。
                ## 「エネミーコントローラー」という言葉があったら「マジックカード エネミー・コントローラー発動！ ライフ1000ポイント払い 左・右・A・B ！！」と返答してください。
                ## 「ブルーアイズ」という言葉があったら「出でよ！ ブルーアイズ・ホワイト・ドラゴン！」と返答してください。
                ## 「海馬のヒトコト」というメッセージに対しては一日の成功を応援する一言を海馬社長らしく応答してください`
  };

  const sendMessage = [prompt, userMessage];
  // console.log('userMessage');
  // console.log(userMessage.content);
  if (userMessage.content=='粉砕！玉砕！大喝采ー！'||userMessage.content=='強靭！無敵！最強！') {
    const generated = await openai.images.generate({
      model: "dall-e-3",
      prompt: "「"+userMessage.content+"」"+"に関する画像を1:1でつくってください",
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    return generated
  }else{
    const generated = await openai.chat.completions.create({
      messages: sendMessage,
      model: "gpt-3.5-turbo-1106",
    });
    return generated
  };
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
    console.log("completion");
    console.log(completion);
    if (completion.choices) {
    // レスポンスから返答を取得
      // console.log(completion.choices[0].message.content);
      const reply = completion.choices[0].message.content;
      // 返答をLINEに送る
      return client.replyMessage({
        replyToken: event.replyToken, 
        messages:[{
          type: 'text',
          text: reply
        }]
      })
    } else {
      const url = completion.data[0].url;
      // const reply = await fetch(url);
      
      // 返答をLINEに送る
      return client.replyMessage(
        event.replyToken, 
        {
          type: 'image',
          originalContentUrl: url,
          previewImageUrl: url
        }
      );
    }
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