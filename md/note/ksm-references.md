# 譜面ヘッダ
```
title=タイトル名
artist=アーティスト名
effect=譜面作者名
jacket=ジャケット画像.jpg
illustrator=イラストレーター
difficulty=難易度 light/challenge/extended/infinite
level=レベル 1-20
t=テンポBPM(ハイフン可)
m=音声ファイル.mp3
mvol=音量 0-100
o=曲の先頭ms
bg=プレイ背景 desert/grass/night/deepsea/sky/sunset/ocean/flame/cyber/space/mars/cloudy/fantasy
layer=プレイアニメ arrow/smoke/wave/techno/snow/sakura/hidden
po=プレビューの先頭ms
plength=プレビューの長さms
pfiltergain=エフェクトの音量？(50)
filtertype=ノブのフィルタータイプ peak/hpf/lpf/bitc
chokkakuautovol=直角エフェクトのオート音量？(0)
chokkakuvol=直角エフェクトの音量？(50)
ver=エディタ本体バージョン？(160)
```
# 譜面構造
- `--`区切りで、1小節
  - 数が合わない場合は自動的に引き伸ばし/押し縮み処理が行われる
- `1111|22|33@44...`の構造になっている
## 譜面行
### 4つのボタン。
- `ここ|**|**@**`
  - `0`:なし
  - `1`:押下
  - `2`:長押し
### FX-LR。
- `**|ここ|**@**`
  - `0`:なし
  - `1`:ボタン押し
  - `2`:長押し
### ノブ。
- `**|**|ここ@**`
  - `0-9A-Za-o`:位置
    - 01234　56789｜ABCDE　FGHIJ｜KLMNO　PQRST｜UVWXY　Zabcd｜efghi　jklmno
    - 何故かj-oだけ6個
  - `:`:直線
#### 直角の書き方
```
0000|00|0-
0000|00|:-
0000|00|o-
```
```
0000|00|-o
0000|00|-:
0000|00|-0
```
- これでも判定はされるが、感覚狭すぎて表示が変になる
```
0000|00|0-
0000|00|o-
```
```
0000|00|-o
0000|00|-0
```
### 回転
- `**|**|**@ここ`
  - `@)192`のように表記。
    - `(`or`)`:一周
      - `@)*****`回転時間。192で1小節。
    - `<`or`>`:半回転
      - `@>*****`回転時間。192で1小節。
    - `S<`or`S>`:S字半回転
      - `@S>AA;BB;CC;DD`。192で1小節。
        - AA:回転時間(192), BB:振れ幅(150), CC:振動速度(3), DD:減衰係数？(2)
## イベント行
- 曲の途中でイベントを挟む場合はその譜面行の上に`t=160`のように設定する
  - 譜面ヘッダにあるパラメータをそのまま使える模様（タイトルとかは無理っぽい）
```
--
bg=night
1000|00|--
0101|00|--
t=160
0100|00|--
t=120
1000|00|--
(以下略)
```
- 最初の譜面行の上行で以下のように初期設定を行う
```
beat=4/4
t=120
```
- FXは`fx-r=Flanger`みたいにして書く
  - 左辺: `fx-l`, `fx-r`
  - 右辺:
    - `Retrigger;8`, `Retrigger;12`, `Retrigger;16`, `Retrigger;24`, `Retrigger;32`
      - `4`, `64`, `128`もいけるもよう。`2`もできるっぽいけどちょっと怪しかった。
    - `Gate;4`, `Gate;8`, `Gate;12`, `Gate;16`, `Gate;24`, `Gate;32`
      - `64`, `128`もいけるもよう。`2`もできるっぽいけどちょっと怪しかった。
    - `Flanger`, `Phaser`, `SideChain`
      - 引数なし
    - `PitchShift;12`
      - `12`でオクターブのもよう。なんかちょっと変化させただけでかなり歪む。
    - `BitCrusher;10`
      - 数値が高いほどクラッシュするもよう。
    - `Wobble;12`
      - ワブルっていうよりワウワウ。RetriggerやGateと同じように引数を決めるもよう。
    - `TapeStop;50`
      - 単純に強さのもよう。詳細な定義は不明。
    - `Echo;4;60`
      - 第1引数はRetriggerやGateと同じような早さ設定で反復時間、第2引数は減衰率？
- ズームは以下の通り
  - `zoom_bottom=` `-100 - 0 - 100`
  - `zoom_top=` `-100 - 0 - 100`
# 参考
[K-shoot MANIAの難易度基準の話－後編](http://kshootenko.web.fc2.com/advent/1213.html)
