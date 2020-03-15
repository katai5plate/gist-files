/*:
 * @plugindesc 香川県IPならエラーにする
 * @author Had2Apps
 *
 * @help
 *
 * https://ipapi.co/ にアクセスし、香川県のIPかどうかを調べます。
 * オンラインの外部ネットワークが使用できる環境でしか動かないため、
 * オフライン環境やRPGアツマール等では使用できません。
 *
 * ただし、regions値を [] にすることで、
 * 都道府県に関わらずエラーメッセージを表示するので、
 * ネットワークアクセスが発生しなくなります。
 * なのでどうしてもオフラインやRPGアツマールで使用したい場合は、
 * そのように設定してください。
 *
 * @param regions
 * @desc 香川県判定する都道府県（ローマ字）
 * @type String[]
 * @default ["Kagawa"]
 *
 */

(function() {
  var ERR_STOP = "プラグイン H2A_ignoreKagawa の動作を停止しました。";
  var AREA_KAGAWA = {
    latitude: { min: 34.012309, max: 34.564613 },
    longitude: { min: 133.446597, max: 134.440574 }
  };
  var pluginParams = PluginManager._parameters.h2a_ignorekagawa;
  var props = {
    regions: pluginParams.regions
      ? JSON.parse(pluginParams.regions)
      : ["Kagawa"]
  };
  window.h2aIgnoreKagawaCloseError = function() {
    SceneManager.resume();
    Graphics._canvas.style.opacity = 1;
    Graphics._canvas.style.filter = "";
    Graphics._canvas.style.webkitFilter = "";
    Graphics._errorPrinter.innerHTML = "";
    Graphics._errorPrinter.style.userSelect = "none";
    Graphics._errorPrinter.style.webkitUserSelect = "none";
    Graphics._errorPrinter.style.msUserSelect = "none";
    Graphics._errorPrinter.style.mozUserSelect = "none";
    Graphics._errorPrinter.oncontextmenu = function() {
      return false;
    };
  };
  function err(a, b) {
    SceneManager.stop();
    Graphics.printError(a, b);
    AudioManager.stopAll();
  }
  function notice(isKagawa) {
    err(
      isKagawa
        ? "香川県からのアクセスと思われるIPアドレスを検出しました。"
        : "本ゲームは香川県在住の方のプレイを制限しております",
      [
        "本ゲームは、香川県在住の方のプレイを推奨しておりません。",
        "お客様が条例違反した事による損害については一切保障致しかねますので、",
        "ご理解とご協力をお願いいたします。",
        '<button onclick="window.h2aIgnoreKagawaCloseError()">ゲームを続ける</button>'
      ].join("<br/>")
    );
  }
  function check() {
    try {
      fetch("https://ipapi.co/json/")
        .catch(function(e) {
          console.log({ res: e });
          err(ERR_STOP, "外部ネットワークへの通信に失敗しました。");
        })
        .then(function(res) {
          return res.json();
        })
        .catch(function(e) {
          console.log({ res: e });
          err(ERR_STOP, "APIから所定のレスポンスが得られませんでした。");
        })
        .then(function(res) {
          if (res && res.region && res.latitude && res.longitude) {
            if (props.regions.includes(res.region)) {
              notice(true);
            }
            if (
              AREA_KAGAWA.latitude.min <= res.latitude &&
              res.latitude <= AREA_KAGAWA.latitude.max &&
              AREA_KAGAWA.longitude.min <= res.longitude &&
              res.longitude <= AREA_KAGAWA.longitude.max
            ) {
              notice(true);
            }
          } else {
            console.log({ res: res });
            err(ERR_STOP, "APIから所定のレスポンスが得られませんでした。");
          }
        });
    } catch (error) {
      err(ERR_STOP, "Fetch API が対応していない可能性があります。");
    }
  }
  var i = setInterval(function() {
    if (window.Graphics && window.SceneManager && window.AudioManager)
      clearInterval(i);
    if (!props.regions || props.regions.length === 0) {
      return notice(false);
    }
    check();
  }, 1);
})();
