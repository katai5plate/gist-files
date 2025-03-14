/*:
 * @target MZ
 * @plugindesc 素材をアセットサーバーから取り寄せる
 *
 * @param serverUrl
 * @text サーバー URL
 * @desc 素材を取り寄せるサーバーのURL
 *
 * @param allowUrls
 * @text 実行許可 URL
 * @type string[]
 * @desc 指定の文字列を含む URL で実行した場合にアセットサーバーを使用する
 * @default ["localhost:5500", "127.0.0.1:5500"]
 *
 * @param forceMode
 * @text 強制実行
 * @type boolean
 * @desc 強制的に実行する
 * @default false
 *
 * @param withId
 * @text ID 付与
 * @type boolean
 * @desc プレイ毎に変わる UUID をリクエスト URL に付与する
 * @default true
 *
 * @help
 * ## 使い方
 *
 * 1. まず素材専用サーバーを用意し、以下の URL を叩くと素材をリクエストできるようにする
 * {サーバーURL}/{audio,img,movies,effects}/{...}/{素材}.{拡張子}
 *
 * 2. .htaccess で以下のように設定する
 * <IfModule mod_headers.c>
 *   SetEnvIfNoCase Origin "https?://(www\.)?(ここに許可したいドメインの正規表現)$" AccessControlAllowOrigin=$0
 *   Header set Access-Control-Allow-Origin %{AccessControlAllowOrigin} env=AccessControlAllowOrigin
 * </IfModule>
 *
 * ## (おまけ) ファイル検索APIを実装する方法
 *
 * 1. サーバーURLに index.php を作成し、以下をコピペ
 * <?php
 * $q = $_GET['q'] ?? '';
 * $allowedExts = ['ogg', 'png', 'ico', 'efkefc', 'efkmodel', 'mp4', 'webm'];
 * $requestedExts = array_filter(explode(',', $q), function($ext) use ($allowedExts) {
 *   return in_array($ext, $allowedExts);
 * });
 * $list = array_filter(iterator_to_array(new RecursiveIteratorIterator(new RecursiveDirectoryIterator('.'))), function($file) use ($requestedExts) {
 *   return $file->isFile() && (empty($requestedExts) || in_array(strtolower($file->getExtension()), $requestedExts));
 * });
 * $list = array_map(function($file) {
 *   return str_replace('./', '', $file->getPathname());
 * }, $list);
 * header('Content-Type: application/json; charset=utf-8');
 * echo json_encode(array_values($list), JSON_UNESCAPED_UNICODE);
 *
 * 2. これで "?q=ogg,png,mp4" のように指定してやることでファイル一覧を取得・フィルタリング可能
 */
(() => {
  const PLUGIN_NAME = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
  const params = PluginManager.parameters(PLUGIN_NAME);

  const isAllowedAssetServer = () =>
    (params.allowUrls &&
      JSON.parse(params.allowUrls).find((url) =>
        location.href.includes(url)
      )) ||
    params.forceMode === "true";

  const UUID = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
    ((r) => ({ x: r, y: (r & 3) | 8 }[c].toString(16)))(
      (Math.random() * 16) | 0
    )
  );

  const parseUrl = (url) =>
    isAllowedAssetServer()
      ? `${params.serverUrl ?? ""}${url}${
          params.withId === "true" ? `?id=${UUID}` : ""
        }`
      : url;

  if (isAllowedAssetServer()) console.log("AssetServer is Enabled!");

  // CORS の関係で画像の編集ができなくなるので blob -> base64 化して取り込む
  Bitmap.prototype._startLoading = function () {
    this._image = new Image();
    this._image.crossOrigin = "anonymous"; // 追加
    this._image.onload = this._onLoad.bind(this);
    this._image.onerror = this._onError.bind(this);
    this._destroyCanvas();
    this._loadingState = "loading";
    if (Utils.hasEncryptedImages()) {
      this._startDecrypting();
    } else {
      // 追加ここから
      if (isAllowedAssetServer()) {
        fetch(this._url)
          .then((res) => (res.ok ? res.blob() : this._onError()))
          .then((blob) => {
            const reader = new FileReader();
            reader.onload = () => {
              this._image.src = reader.result;
            };
            reader.readAsDataURL(blob);
          })
          .catch(this._onError.bind(this));
        // ここまで
      } else {
        this._image.src = this._url;
        if (this._image.width > 0) {
          this._image.onload = null;
          this._onLoad();
        }
      }
    }
  };

  // 画像の URL 変更
  const _Bitmap_load = Bitmap.load;
  Bitmap.load = function (url) {
    return _Bitmap_load.apply(this, [parseUrl(url)]);
  };

  // 音声の URL 変更
  const _WebAudio_prototype_initialize = WebAudio.prototype.initialize;
  WebAudio.prototype.initialize = function (url) {
    _WebAudio_prototype_initialize.apply(this, [parseUrl(url)]);
  };

  // 動画の URL 変更
  const _Video_play = Video.play;
  Video.play = function (src) {
    _Video_play.apply(this, [parseUrl(src)]);
  };

  // エフェクトの URL 変更
  const _EffectManager_makeUrl = EffectManager.makeUrl;
  EffectManager.makeUrl = function (filename) {
    return _EffectManager_makeUrl.apply(this, [parseUrl(filename)]);
  };
})();
