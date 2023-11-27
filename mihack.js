const Obniz = require('obniz');
const obniz = new Obniz('MICONNAIDESU'); // Obniz_IDに自分のIDを入れます

// obnizがオンラインであることが確認されたら、以下の関数内が自動で実行されます
obniz.onconnect = async function () {
  obniz.display.clear();
//   obniz.display.print('Hello obniz!');

  // 温度センサーの設定
  const tempsens = obniz.wired('LM60', { gnd: 0, output: 1, vcc: 2 });
  // 以下の関数内がずっと実行され続ける
  setInterval(async function () {
    // 同期で取得
    const temp = await tempsens.getWait();
    // 温度をコンソールに表示
    console.log(temp);
    // displayに反映
    obniz.display.clear();
    obniz.display.print(temp + 'C');  // 英語が出力できる
  }, 1000); // 1000ミリ秒 = 1秒
    // LEDの設定
    const led_blue = obniz.wired("LED", {anode:0, cathode:1});
    const led_yelow = obniz.wired("LED", {anode:2, cathode:3});
    const led_red = obniz.wired("LED", {anode:4, cathode:5});
    // LEDをつける
    if (temp<30) {
        led_blue.on();
    } else if (temp<50) {
        led_yellow.on();
    } else {
        led_red.on();
    }
    
}
// obnizがオンラインであることが確認されたら、以下の関数内が自動で実行されます
obniz.onconnect = async function (temp) {

}