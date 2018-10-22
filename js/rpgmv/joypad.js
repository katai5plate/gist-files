(() => {
    Scene_Map.prototype.processMapTouch = function () { };
    const _Game_Screen_update = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function () {
        _Game_Screen_update.call(this);
        engine(process);
    }
    // const _SceneManager_update = SceneManager.update;
    // SceneManager.update = function () {
    //     _SceneManager_update.call(this);
    //     engine(process);
    // }
    let prev = { x: TouchInput.x, y: TouchInput.y };
    const engine = update => {
        const { _screenWidth, _screenHeight } = SceneManager;
        if (!SceneManager._scene.joypad) {
            SceneManager._scene.joypad = new Sprite();
            SceneManager._scene.joypad.bitmap = new Bitmap(_screenWidth, _screenHeight);
            SceneManager._scene.addChild(SceneManager._scene.joypad);
        }
        const { bitmap } = SceneManager._scene.joypad;
        const { context } = bitmap;
        bitmap.clear();
        update({
            context,
            x: TouchInput.x,
            y: TouchInput.y,
            w: _screenWidth,
            h: _screenHeight,
            drag: TouchInput.x !== prev.x || TouchInput.y !== prev.y,
            press: TouchInput.isPressed(),
            trig: TouchInput.isTriggered(),
            rel: TouchInput.isReleased(),
        });
        prev = { x: TouchInput.x, y: TouchInput.y };
    }
    const process = (props) => {
        arrowKeys(props);
    }
    const arrowKeys = props => {
        const { context, x, y, w, h, press } = props;
        const circle = {
            r: 120,
            rd: 60,
            x: 120,
            y: h / 2
        };
        // 円の描画
        drawStroke(context, () => {
            context.strokeStyle = 'white';
            context.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
        }, () => {
            context.fillStyle = 'rgba(0, 0, 0, 0.25)';
            context.fill();
        });
        // ダッシュエリアの円の描画
        drawStroke(context, () => {
            context.arc(circle.x, circle.y, circle.rd, 0, Math.PI * 2, false);
        });
        // 十字線の描画
        drawStroke(context, () => {
            const d2r = Math.PI / 180;
            for (let i of [1, 3, 5, 7]) {
                context.moveTo(circle.x, circle.y);
                context.lineTo(circle.x + (Math.cos((45 * i) * d2r) * circle.r), circle.y + (Math.sin((45 * i) * d2r) * circle.r));
            }
        });

        // 円との距離
        const disCircle = Math.sqrt(((x - circle.x) ** 2) + ((y - circle.y) ** 2));

        // 円の当たり判定
        const hitCircle = ((x - circle.x) ** 2) + ((y - circle.y) ** 2) <= circle.r ** 2;

        // 座標の角度
        const pointAngle = () => {
            let r = Math.atan2(y - circle.y, x - circle.x);
            if (r < 0) r = r + 2 * Math.PI;
            return Math.floor(r * 360 / (2 * Math.PI));
        }

        // 円の中
        if (hitCircle && press) {
            // 線の描画
            drawStroke(context, () => {
                context.moveTo(circle.x, circle.y);
                context.lineTo(x, y);
            });
            // ポインタを描画
            drawStroke(context, () => {
                context.arc(x, y, disCircle / 2, 0, Math.PI * 2, false);
            });
            // 処理
            $gamePlayer._dashing = disCircle > circle.rd;
            [
                { cond: (45 * 7) < pointAngle() || pointAngle() < (45 * 1), ans: "right" },
                { cond: (45 * 1) < pointAngle() && pointAngle() < (45 * 3), ans: "down" },
                { cond: (45 * 3) < pointAngle() && pointAngle() < (45 * 5), ans: "left" },
                { cond: (45 * 5) < pointAngle() && pointAngle() < (45 * 7), ans: "up" },
            ].forEach(v => {
                if (v.cond) setCSArrow(v.ans);
            })
        } else {
            setCSArrow("");
        }
    }
    const setCSArrow = direction => {
        Input._currentState = {
            ...Input._currentState,
            up: false,
            down: false,
            left: false,
            right: false
        };
        if (direction !== "") Input._currentState[direction] = true;
    }
    const drawStroke = (context, doit, after = () => { }) => {
        context.beginPath();
        doit(context);
        context.stroke();
        after(context);
    }
})()
