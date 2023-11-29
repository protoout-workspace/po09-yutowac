const Obniz = require('obniz');
const obniz = new Obniz('Obniz_ID'); // Obniz_IDに自分のIDを入れます

obniz.onconnect = async function () {
  // サーボモータを利用
  const servo = obniz.wired('ServoMotor', { signal: 2 });

  // 角度を保持する変数
  let degrees = 90.0;

  // ディスプレイ表示（初期画面）
  obniz.display.clear();
  obniz.display.print('Hello obniz!');

  // スイッチの反応を常時監視
  // 「スイッチ状態が変化した瞬間に1回だけ実行される」ことに注意しましょう
  obniz.switch.onchange = function (state) {
    // スイッチの状態で角度を決め、最後に動かします
    if (state === 'push') {
      // スイッチが押されている状態
      console.log('pushed');
      degrees = 45.0;
    } else if (state === 'right') {
      // 右にスイッチを倒したとき
      console.log('right');
      degrees = 0.0;
    } else if (state === 'left') {
      // 左にスイッチを倒したとき
      console.log('left');
      degrees = 180.0;
    } else {
      // スイッチが押されていない状態
      console.log('released');
      degrees = 90.0;
    }
  
  // ディスプレイに角度を表示
  obniz.display.clear();
  obniz.display.print(`Current: ${degrees} deg`);
  // サーボを指定の角度まで動かします
  servo.angle(degrees);
  }
}