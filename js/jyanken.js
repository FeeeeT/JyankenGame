var hand_g = '<i class="fas fa-hand-rock"></i>';
var hand_p = '<i class="fas fa-hand-paper"></i>';
var hand_c = '<i class="fas fa-hand-peace"></i>';

window.onload = function() {
  //--------------------------------------------//
  // 初期化
  //--------------------------------------------//
  // スタートボタン
  var startBtn = document.getElementById("start");
  startBtn.addEventListener("click", gameStart);

  // リセットボタン
  var resetBtn = document.getElementById("reset");
  resetBtn.addEventListener("click", function() {
    location.reload();
  });

  // 名前保存ボタン
  var saveBtn = document.getElementById("save");
  var saveText = document.getElementById("save-text");
  saveBtn.addEventListener("click", function() {
    // 空欄でない場合のみクッキー保存
    if (playerName.value != "") {
      document.cookie = "playerName=" + playerName.value;
      saveText.innerHTML = "名前を「" + playerName.value + "」として、クッキーに保存しました";
    } else {
      saveText.innerHTML = "空欄は保存できません";
    }
  });

  // じゃんけんボタン
  var jyankenBtns = document.getElementById("jyanken-btn");
  var guBtn = document.getElementById("gu");
  guBtn.addEventListener("click", guPon);
  var cyokiBtn = document.getElementById("cyoki");
  cyokiBtn.addEventListener("click", cyokiPon);
  var paBtn = document.getElementById("pa");
  paBtn.addEventListener("click", paPon);
  jyankenBtns.style.display = "none";

  // UI関連
  var enemyHp = document.getElementById("enemyhp"); //敵HP
  var enemyHpMeter = document.getElementById("enemyhp-meter"); //敵HPバー
  var enemyHpNum = 10;
  var enemyName = document.getElementById("enemy-name"); //敵名

  var playerHp = document.getElementById("playerhp"); //自HP
  var playerHpMeter = document.getElementById("playerhp-meter"); //自HPバー
  var playerHpNum = 10;
  var playerName = document.getElementById("player-name"); //自名
  if (document.cookie != "") {
    playerName.value = document.cookie; //クッキーに保存した名前を設定
  }

  var turn = document.getElementById("turn"); //ターン
  var turnNum = 1;
  var damage = document.getElementById("damage"); //そのターンのダメージ
  var damageNum = 0;

  // 手の表示（0 = グー, 1 = チョキ, 2 = パー）
  var enemyPonNum = 0;
  var enemyPon = document.getElementById("enemy-pon");
  var playerPonNum = 0;
  var playerPon = document.getElementById("player-pon");

  // ログ
  var log = document.getElementById("log");

  //--------------------------------------------//
  // メソッド
  //--------------------------------------------//

  // ゲームスタート
  function gameStart() {
    startBtn.disabled = true;
    playerName.readOnly = true;
    jyankenBtns.style.display = "block";
    enemyPon.innerHTML = hand_g;
    playerPon.innerHTML = hand_g;
    logPushChoice();
    game();
  }

  //---------------ログの処理---------------//
  // ログ：手を選ぶ
  function logPushChoice() {
    log.value = "\nゲームスタート！手を選ぶことで進みます。\n" + log.value;
  }

  // ログ：あいこ
  function logPushAiko() {
    if (turnNum < 10) {
      log.value = "  " + turnNum + "ターン：" + "あいこ！\n\n" + log.value;
    } else {
      log.value = turnNum + "ターン：" + "あいこ！\n\n" + log.value;
    }
    // ターンを進行し次のゲームへ
    turnNum++;
    game();
  }

  // ログ：じゃんけんの勝ち負け
  function logPushDeal(winner, loser) {
    if (turnNum < 10) {
      log.value = "  " + turnNum + "ターン：" + winner.value + "の勝ち！　" + loser.value + "に " + damageNum + " のダメージ！\n\n" + log.value;
    } else {
      log.value = turnNum + "ターン：" + winner.value + "の勝ち！　" + loser.value + "に " + damageNum + " のダメージ！\n\n" + log.value;
    }
    // ターンを進行し次のゲームへ
    turnNum++;
    game();
  }

  // ログ：ゲームに勝った
  function logPushWin() {
    log.value = playerName.value + "の勝利！！\n\n\n" + log.value;
    jyankenBtns.style.display = "none";
  }

  // ログ：ゲームに負けた
  function logPushLose() {
    log.value = playerName.value + "は負けてしまった…！！\n\n\n" + log.value;
    jyankenBtns.style.display = "none";
  }
  //----------------------------------------//

  // ゲームを進行
  function game() {
    // HP0チェック
    if (playerHpNum <= 0) {
      logPushLose("あなた");
      return;
    }
    if (enemyHpNum <= 0) {
      logPushWin("あなた");
      return
    }
    // ターン数表示
    turn.innerHTML = turnNum;
    // ダメージ取得・表示
    damageNum = Math.floor(Math.random() * 4) + 1;
    damage.innerHTML = damageNum;
    // HPの表示
    playerHp.innerHTML = playerHpNum;
    enemyHp.innerHTML = enemyHpNum;
  }

  // グーを出す
  function guPon() {
    playerPonNum = 0;
    playerPon.innerHTML = hand_g;
    enemyChoice();
  }

  // チョキを出す
  function cyokiPon() {
    playerPonNum = 1;
    playerPon.innerHTML = hand_c;
    enemyChoice();
  }

  // パーを出す
  function paPon() {
    playerPonNum = 2;
    playerPon.innerHTML = hand_p;
    enemyChoice();
  }

  // 敵の手を決める
  function enemyChoice() {
    enemyPonNum = Math.floor(Math.random() * 3);
    if (enemyPonNum === 0) {
      enemyPon.innerHTML = hand_g;
    } else if (enemyPonNum === 1) {
      enemyPon.innerHTML = hand_c;
    } else {
      enemyPon.innerHTML = hand_p;
    }
    duel();
  }

  // じゃんけん勝負
  function duel() {
    // あいこの場合
    if (playerPonNum === enemyPonNum) {
      // 手の色を変える
      playerPon.style.color = "#222";
      enemyPon.style.color = "#222";
      logPushAiko();
    }
    // プレイヤーの勝利パターン
    if (playerPonNum === 0 && enemyPonNum === 1 || playerPonNum === 1 && enemyPonNum === 2 || playerPonNum === 2 && enemyPonNum === 0) {
      // 手の色を変える
      playerPon.style.color = "#70b7ff";
      enemyPon.style.color = "#222";
      deal(0);
      logPushDeal(playerName, enemyName);
    }
    // 敵の勝利パターン
    if (playerPonNum === 1 && enemyPonNum === 0 || playerPonNum === 2 && enemyPonNum === 1 || playerPonNum === 0 && enemyPonNum === 2) {
      // 手の色を変える
      enemyPon.style.color = "#ff8585";
      playerPon.style.color = "#222";
      deal(1);
      logPushDeal(enemyName, playerName);
    }
  }

  // ダメージ計算
  function deal(win) {
    // 0 = 自勝利, 1 = 敵勝利
    if (win === 0) {
      enemyHpNum -= damageNum;
      if (enemyHpNum <= 0) {
        enemyHpNum = 0;
      }
    }
    if (win === 1) {
      playerHpNum -= damageNum;
      if (playerHpNum <= 0) {
        playerHpNum = 0;
      }
    }
    // HP表示
    playerHp.innerHTML = playerHpNum;
    playerHpMeter.value = playerHpNum;
    enemyHp.innerHTML = enemyHpNum;
    enemyHpMeter.value = enemyHpNum;
  }
};