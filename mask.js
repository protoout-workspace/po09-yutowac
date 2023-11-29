'use strict';

const Obniz = require('obniz');
const obniz = new Obniz('7766-3327'); // Obniz_IDに自分のIDを入れます

// const express = require('express');
const line = require('@line/bot-sdk');
const config = {
    channelSecret: process.env.CHANNEL_SECRET || 'd0944d6d1d0c2d04bb758acd0bc90f56',
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || 'khIsBoKTlOj105cc0ZyPFQQtaVz0rJ15US7u+xGOQWsF+TKO0dzdsg3lVKAB3IHLS/A1kDkUfHAjcMQiP74WGbYu0n0orkFcPPjxNH0qHagbQ1Qxt0CQ2T6YDRqp3O7BboYgtwdw8WlrZ8ttAXa7LgdB04t89/1O/w1cDnyilFU=',
  };
const client = new line.messagingApi.MessagingApiClient(config);

// LINEのメッセージ
const pushMessage = async () => {
    const messages = [{
        type: 'text',
        text: 'うわああああああああああああああああああ'
    }];

    try {
        const res = await client.broadcast({messages}); 
        console.log(res);       
    } catch (error) {
        console.log(error.statusMessage);
    }
}

obniz.onconnect = async function () {
  // 超音波測距センサを利用する
  const hcsr04 = obniz.wired('HC-SR04', { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
  // LEDの設定
  const led1 = obniz.wired("LED", {anode:8, cathode:9});
  const led2 = obniz.wired("LED", {anode:10, cathode:11});
  // ディスプレイ
  obniz.display.clear();

  // setIntervalで一定間隔で処理
  setInterval(async function () {
    // 距離を取得
    let distance = await hcsr04.measureWait();
    distance = Math.floor(distance);

    // 距離(mm)をターミナルに表示
    console.log(distance + ' mm');
    // obnizディスプレイに表示
    // 一度消してから距離+mmの単位を表示
    obniz.display.clear();
    obniz.display.print(distance + ' mm');

    // 距離が200mm未満かどうかの判定
    if (distance < 200) {
      obniz.display.clear();
      obniz.display.print('Too close!!');
      // LEDをつける
      led1.on();
      led2.on();
      pushMessage();
    } else {
    led1.off();
    led2.off();
    }
  }, 1000); // 1000ミリ秒おきに実行
}

