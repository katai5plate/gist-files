(function () {
  let
    prev = { x: 0, y: 0 },
    now = { x: 0, y: 0 },
    delta = { x: 0, y: 0 },
    acc = { x: 0, y: 0 };

  const exp = () => {
    // クリックしている間に行ったマウス移動の加速度をとり、余韻を計算する
    if (TouchInput.isPressed()) {
      acc = Object.assign({}, delta);
    }
    acc.x = acc.x * 0.9;
    acc.y = acc.y * 0.9;
    $gameMap._parallaxSx = -acc.x * 2;
    $gameMap._parallaxSy = -acc.y * 2;
    // console.log(acc.x.toFixed(3), acc.y.toFixed(3));
  };

  const GameScreenUpdate = Game_Screen.prototype.update;
  Game_Screen.prototype.update = function () {
    now = { x: TouchInput.x, y: TouchInput.y };
    if (TouchInput.isPressed()) {
      if (prev !== null) {
        delta = { x: now.x - prev.x, y: now.y - prev.y };
      }
    } else {
      delta = { x: 0, y: 0 };
    }
    GameScreenUpdate.call(this);
    exp();
    if (TouchInput.isPressed()) {
      prev = { x: TouchInput.x, y: TouchInput.y };
    } else {
      prev = null;
    }
  }
})()
