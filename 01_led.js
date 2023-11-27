const Obniz = require('obniz');
const obniz = new Obniz('Obniz_ID'); // Obniz_IDに自分のIDを入れます

// obnizがオンラインであることが確認されたら、以下の関数内が自動で実行されます
obniz.onconnect = async function () {
  // LEDの設定
  const led = obniz.wired("LED", {anode:0, cathode:1});
  // LEDをつける
  led.on();
}