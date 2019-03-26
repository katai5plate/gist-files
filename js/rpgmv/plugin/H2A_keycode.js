/*:
 * @plugindesc ツクールMVの対応キーを一括設定します
 * @author Had2Apps
 *
 * @help
 * バージョン 1.2.0
 * 
 * MITライセンス
 * コードの一部は、https://github.com/timoxley/keycode をforkしています。
 * 
 * TYPING_MODEについて：
 * none に設定されているキーの識別名が、そのままパラメータ名になります。
 * APPEND_MODE が ON の時は、
 * デフォルト設定とプラグイン設定込みで機能が割り当てられていないキーが対象になります。
 * APPEND_MODE が OFF の時は、
 * none になっている全てのキーが対象になります。
 *
 * @param APPEND_MODE
 * @desc ON にすると none は元の設定に準拠し、
 * OFF にすると none はキー入力を無効化します。
 * @type boolean
 * @on ON
 * @off OFF
 * @default true
 * 
 * @param TYPING_MODE
 * @desc none にしたキーの設定値をパラメータ名に変更します。
 * 例: Input.isTriggered("Numpad +")
 * @type boolean
 * @on ON
 * @off OFF
 * @default false
 * 
 * @param ----------
 * @type note
 * 
 * @param Backspace
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Tab
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Enter / Return
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Shift
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Ctrl / Control
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Alt / Option
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Pause / Break
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Caps Lock
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Esc / Escape
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Space
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Page Up
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Page Down
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param End
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Home
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Left
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Up
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Right
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Down
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Insert
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Delete
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 * 
 * @param 0
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param 1
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param 2
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param 3
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param 4
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param 5
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param 6
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param 7
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param 8
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param 9
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param A
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param B
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param C
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param D
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param E
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param G
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param H
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param I
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param J
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param K
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param L
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param M
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param N
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param O
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param P
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Q
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param R
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param S
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param T
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param U
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param V
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param W
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param X
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Y
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Z
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 * 
 * @param Windows / Command
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Right Command
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 * 
 * @param Numpad 0
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad 1
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad 2
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad 3
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad 4
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad 5
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad 6
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad 7
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad 8
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad 9
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad *
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad +
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad -
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad .
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Numpad /
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F1
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F2
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F3
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F4
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F5
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F6
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F7
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F8
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F9
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F10
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F11
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param F12
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Num Lock
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param Scroll Lock
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 * 
 * @param My Computer
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param My Calculator
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 * 
 * @param ;
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param =
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param ,
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param -
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param .
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param /
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param `
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param [
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param \
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param ]
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
 * @param '
 * @type select
 * @option 未設定 (none)
 * @value none
 * @option 決定 (ok)
 * @value ok
 * @option キャンセル (escape)
 * @value escape
 * @option シフト (shift)
 * @value shift
 * @option 下 (down)
 * @value down
 * @option 左 (left)
 * @value left
 * @option 右 (right)
 * @value right
 * @option 上 (up)
 * @value up
 * @option ページアップ (pageup)
 * @value pageup
 * @option ページダウン (pagedown)
 * @value pagedown
 * @option コントロール (control)
 * @value control
 * @option タブ (tab)
 * @value tab
 * @option デバッグ (debug)
 * @value debug
 * @default none
 *
*/

(() => {
  const keycode = [
    { key: 'Backspace', value: 8 },
    { key: 'Tab', value: 9 },
    { key: 'Enter / Return', value: 13 },
    { key: 'Shift', value: 16 },
    { key: 'Ctrl / Control', value: 17 },
    { key: 'Alt / Option', value: 18 },
    { key: 'Pause / Break', value: 19 },
    { key: 'Caps Lock', value: 20 },
    { key: 'Esc / Escape', value: 27 },
    { key: 'Space', value: 32 },
    { key: 'Page Up', value: 33 },
    { key: 'Page Down', value: 34 },
    { key: 'End', value: 35 },
    { key: 'Home', value: 36 },
    { key: 'Left', value: 37 },
    { key: 'Up', value: 38 },
    { key: 'Right', value: 39 },
    { key: 'Down', value: 40 },
    { key: 'Insert', value: 45 },
    { key: 'Delete', value: 46 },
    { key: '0', value: 48 },
    { key: '1', value: 49 },
    { key: '2', value: 50 },
    { key: '3', value: 51 },
    { key: '4', value: 52 },
    { key: '5', value: 53 },
    { key: '6', value: 54 },
    { key: '7', value: 55 },
    { key: '8', value: 56 },
    { key: '9', value: 57 },
    { key: 'A', value: 65 },
    { key: 'B', value: 66 },
    { key: 'C', value: 67 },
    { key: 'D', value: 68 },
    { key: 'E', value: 69 },
    { key: 'F', value: 70 },
    { key: 'G', value: 71 },
    { key: 'H', value: 72 },
    { key: 'I', value: 73 },
    { key: 'J', value: 74 },
    { key: 'K', value: 75 },
    { key: 'L', value: 76 },
    { key: 'M', value: 77 },
    { key: 'N', value: 78 },
    { key: 'O', value: 79 },
    { key: 'P', value: 80 },
    { key: 'Q', value: 81 },
    { key: 'R', value: 82 },
    { key: 'S', value: 83 },
    { key: 'T', value: 84 },
    { key: 'U', value: 85 },
    { key: 'V', value: 86 },
    { key: 'W', value: 87 },
    { key: 'X', value: 88 },
    { key: 'Y', value: 89 },
    { key: 'Z', value: 90 },
    { key: 'Windows / Command', value: 91 },
    { key: 'Right Command', value: 93 },
    { key: 'Numpad 0', value: 96 },
    { key: 'Numpad 1', value: 97 },
    { key: 'Numpad 2', value: 98 },
    { key: 'Numpad 3', value: 99 },
    { key: 'Numpad 4', value: 100 },
    { key: 'Numpad 5', value: 101 },
    { key: 'Numpad 6', value: 102 },
    { key: 'Numpad 7', value: 103 },
    { key: 'Numpad 8', value: 104 },
    { key: 'Numpad 9', value: 105 },
    { key: 'Numpad *', value: 106 },
    { key: 'Numpad +', value: 107 },
    { key: 'Numpad -', value: 109 },
    { key: 'Numpad .', value: 110 },
    { key: 'Numpad /', value: 111 },
    { key: 'F1', value: 112 },
    { key: 'F2', value: 113 },
    { key: 'F3', value: 114 },
    { key: 'F4', value: 115 },
    { key: 'F5', value: 116 },
    { key: 'F6', value: 117 },
    { key: 'F7', value: 118 },
    { key: 'F8', value: 119 },
    { key: 'F9', value: 120 },
    { key: 'F10', value: 121 },
    { key: 'F11', value: 122 },
    { key: 'F12', value: 123 },
    { key: 'Num Lock', value: 144 },
    { key: 'Scroll Lock', value: 145 },
    { key: 'My Computer', value: 182 },
    { key: 'My Calculator', value: 183 },
    { key: ';', value: 186 },
    { key: '=', value: 187 },
    { key: ',', value: 188 },
    { key: '-', value: 189 },
    { key: '.', value: 190 },
    { key: '/', value: 191 },
    { key: '`', value: 192 },
    { key: '[', value: 219 },
    { key: '\\', value: 220 },
    { key: ']', value: 221 },
    { key: "'", value: 222 },
  ];

  const params = PluginManager.parameters('H2A_keycode');

  const mapper = keycode.reduce((p, c) => {
    const key = params[c.key];
    return {
      ...p,
      ...(
        key === "none"
          ? {}
          : { [c.value]: key }
      ),
    }
  }, {});

  if (params.APPEND_MODE === "true") {
    Input.keyMapper = { ...Input.keyMapper, ...mapper }
  } else {
    Input.keyMapper = mapper;
  }
  if (params.TYPING_MODE === "true") {
    const typingMapper = keycode
      .filter(code => !Object.keys(Input.keyMapper).includes(`${code.value}`))
      .reduce((p, c) => ({ ...p, [c.value]: c.key }), {});
    Input.keyMapper = { ...Input.keyMapper, ...typingMapper };
  }
})()
