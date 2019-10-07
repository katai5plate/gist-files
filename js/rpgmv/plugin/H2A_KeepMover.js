/*:
 * @plugindesc 同マップ内でのキー操作維持瞬間移動
 * @author Had2Apps
 */
"use strict";
(() => {
  class H2AKeepMover {
    constructor() {
      this.isKeepMoving = false;
      this.dirFromName = null;
      this.keepState = null;
    }
    teleport(mapX, mapY, dirFrom, dirTo) {
      if (this.isKeepMoving === false) {
        this.dirFromName = (x => {
          if (x === 2) return "down";
          if (x === 4) return "left";
          if (x === 6) return "right";
          if (x === 8) return "up";
          return null;
        })(dirFrom);
        this.keepState = Input._currentState[this.dirFromName];
      }
      $gamePlayer.reserveTransfer($gameMap.mapId(), mapX, mapY, dirTo, 2);
      $gamePlayer.performTransfer();
      this.isKeepMoving = true;
    }
    update() {
      if (this.isKeepMoving === true) {
        if (
          Input._currentState[this.dirFromName] === this.keepState &&
          this.keepState === true
        ) {
          $gamePlayer.forceMoveRoute({
            list: [{ code: 12 }, { code: 0 }],
            repeat: false,
            skippable: true,
            wait: false
          });
        } else {
          this.isKeepMoving = false;
        }
      }
    }
  }
  window.$h2aKeepMover = new H2AKeepMover();
})();
