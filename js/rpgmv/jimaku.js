/**
 * 「字幕プラグイン」
 * このプラグインは未完成です。
 * 
 * 今鳴っている音の１つをピックアップして字幕を描画します。
 * 
 * 作者：Had2Apps
 */

var subTitle = [
    { filename: "Buzzer2", subtitle: [{ time: 0, message: "あいうえお" }] },
    { filename: "Blow1", subtitle: [{ time: 0, message: "かきくけこ" }] },
    { filename: "Buzzer1", subtitle: [{ time: 0, message: "さしすせそ" }] },
    { filename: "Cancel1", subtitle: [{ time: 0, message: "たちつてと" }] },
    {
        filename: "Laser2", subtitle: [
            { time: 0, message: "なにぬねの" },
            { time: 0.5, message: "はまやらわ" },
            { time: 1, message: "まみむめも" },
            { time: 1.5, message: "やゆよ" },
            { time: 2, message: "らりるれろ、わおん" },
            { time: 3, message: "がぎぐげご" },
            { time: 3.5, message: "ぐーぐるごーぐる" },
            { time: 4.5, message: "ごごのごーじゃ" },
        ]
    },
];

(function () {
    // 画面設定
    var width = SceneManager._screenWidth;
    var height = SceneManager._screenHeight;

    // フェード速度
    var diff = 0.05;

    var Jimaku = {
        // フェード用・透明度
        alfa: 1.0,
        // 格納文字列
        text: "",
        // 描画
        Draw: function (ctx) {
            if (this.alfa <= 0) {
                this.alfa = 0;
                this.text = "";
            } else {
                this.alfa -= diff;
            }
            // this.alfa = this.alfa <= 0 ? 0 : this.alfa - diff;
            ctx.textAlign = "center";
            ctx.font = "bold 32px 'Arial'";
            this.text = (function (_this) {
                for (var sound of AudioManager._seBuffers) {
                    if (sound.isPlaying()) {
                        _this.alfa = 1.0;
                        var name = sound._url.replace(/^audio\/se\/(.*).(ogg|m4a)$/, "$1");
                        var arr = subTitle.filter(function (v) {
                            return v.filename === name;
                        });
                        if (arr.length) {
                            var subtitle = arr[0].subtitle;
                            if (subtitle.length > 1) {
                                subtitle.push({ time: -1, message: "" });
                                for (var i = 0; i < subtitle.length; i++) {
                                    var startTime = (subtitle[i].time == 0) ? subtitle[i].time + 0.00001 : subtitle[i].time;
                                    var lastTime = (i == subtitle.length - 1) ? sound._totalTime : subtitle[i + 1].time;
                                    if (subtitle[i].time <= sound.seek() && sound.seek() < lastTime) {
                                        return subtitle[i].message;
                                    }
                                }
                            } else {
                                return subtitle[0].message;
                            }
                            return subtitle.filter(function (v) {
                                return v.time < sound.seek();
                            })[0].message;
                        }
                    }
                }
                return null;
            })(this) || this.text;
            ctx.fillStyle = `rgba(0,0,0,${this.alfa / 2})`;
            ctx.fillRect(0, height - (48 + 32), width, 48);
            ctx.fillStyle = `rgba(255,255,255,${this.alfa})`;
            ctx.fillText(this.text, width / 2, height - 48, width);
        },
        // メイン処理
        Update: function () {
            if (!SceneManager._scene.jimaku) {
                SceneManager._scene.jimaku = new Sprite();
                SceneManager._scene.jimaku.bitmap = new Bitmap(width, height);
                SceneManager._scene.addChild(SceneManager._scene.jimaku);
            }
            SceneManager._scene.jimaku.bitmap.clear();
            this.Draw(SceneManager._scene.jimaku.bitmap.context);
        }
    };
    // 常に並列処理
    var _Game_Screen_update = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function () {
        _Game_Screen_update.apply(this, arguments);
        Jimaku.Update();
    }
})();
