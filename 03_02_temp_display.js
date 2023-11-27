const Obniz = require('obniz');
const obniz = new Obniz('Obniz_ID');  // Obniz_IDに自分のIDを入れます

// obnizがオンラインであることが確認されたら、以下の関数内が自動で実行されます
obniz.onconnect = async function () {
  obniz.display.clear();
  obniz.display.print('Hello obniz!');

  // 温度センサーの設定
  const tempsens = obniz.wired('LM60', { gnd: 0, output: 1, vcc: 2 });
  tempsens.onchange = function (temp) {
    // 温度をコンソールに表示
    console.log(temp);
    // displayに反映
    obniz.display.clear();
    obniz.display.print(temp + 'C');  // 英語が出力できる
  };
}