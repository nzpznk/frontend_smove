'use strict';

//export {DIRECTION, getDirection};

var DIRECTION = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    CENTER: 4
};

function getDirection(sx, sy, ex, ey) {
    var dx = sx - ex,
        dy = sy - ey;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
        return DIRECTION.CENTER;
    } else if (Math.abs(dx) < Math.abs(dy)) {
        return dy < 0 ? DIRECTION.DOWN : DIRECTION.UP;
    } else {
        return dx < 0 ? DIRECTION.RIGHT : DIRECTION.LEFT;
    }
}
