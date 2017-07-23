'use strict';

//import {DIRECTION, getDirection} from './direction.js';
//export {BlackBall, WhiteBall, BlackBallCollection, testCollision};

function Balls(px, py, r, color = 'black') {
    this.x = px;
    this.y = py;
    this.radius = r;
    this.color = color;
}

Balls.prototype.drawBall = function(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
};

function F(){}
F.prototype =  Balls.prototype;

function WhiteBall(canvas) {
    this.canvas = canvas;
    this.gridx = 1;
    this.gridy = 1; // 初始位置
    var posiArr = this.calPosi();
    this.dir = DIRECTION.CENTER;
    this.score = -1;
    this.level = 0;
    Balls.call(this, ...posiArr, 'white');
}

WhiteBall.prototype = new F();

WhiteBall.prototype.constructor = WhiteBall;

WhiteBall.prototype.calPosi = function(){
    var w = 300 * 1.0 / 6;
    var x = w * (this.gridx * 2 + 1);
    var y = w * (this.gridy * 2 + 1);
    return [x, y, 0.8 * w];
};

WhiteBall.prototype.draw = function() {
    if (this.dir === DIRECTION.LEFT && this.gridx > 0) {
        this.gridx -= 1;
    } else if (this.dir === DIRECTION.RIGHT && this.gridx < 2) {
        this.gridx += 1;
    } else if (this.dir === DIRECTION.UP && this.gridy > 0) {
        this.gridy -= 1;
    } else if (this.dir === DIRECTION.DOWN && this.gridy < 2) {
        this.gridy += 1;
    } else;
    this.dir = DIRECTION.CENTER;
    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(this.x - 50, this.y - 50, 100, 100);
    [this.x, this.y] = this.calPosi();
    this.drawBall(this.canvas);
};


WhiteBall.prototype.getHandler = function(){
    var that = this;
    var sx = 0,
        sy = 0,
        ex = 0,
        ey = 0;
    return function(evt) {
        if(evt.keyCode && (36 < evt.keyCode) && (evt.keyCode < 41)) {
            that.dir = evt.keyCode - 37;
        } else if (evt.touches && evt.touches[0]) {
            sx = evt.touches[0].pageX;
            sy = evt.touches[0].pageY;
        } else if (evt.changedTouches && evt.changedTouches[0]) {
            ex = evt.changedTouches[0].pageX;
            ey = evt.changedTouches[0].pageY;
            that.dir = getDirection(sx, sy, ex, ey);
        } else;
    };
};

function Square(whiteBall) {
    this.gridx = whiteBall.gridx;
    this.gridy = whiteBall.gridy;
    this.canvas = document.getElementById('square');
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.color = 'red';
    whiteBall.draw = (function(sq){
        return function() {
            WhiteBall.prototype.draw.call(whiteBall);
            return (whiteBall.gridx === sq.gridx && whiteBall.gridy === sq.gridy);
        };
    })(this);
}

Square.prototype.getNext = function() {
    var dx = Math.floor(Math.random() * 2) + 1;
    var dy = Math.floor(Math.random() * 2) + 1;
    this.gridx = (this.gridx + dx) % 3;
    this.gridy = (this.gridy + dy) % 3;
}

Square.prototype.draw = function() {
    var w;
    [this.x, this.y, w] = WhiteBall.prototype.calPosi.call(this);
    this.width = w * 0.5;
    var time = new Date();
    var ctx = this.canvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, 300, 300);
    ctx.translate(this.x, this.y);
    ctx.rotate( ((2*Math.PI)/6)*time.getSeconds() + ((2*Math.PI)/6000)*time.getMilliseconds() );
    ctx.beginPath();
    ctx.moveTo(-this.width / 2, -this.width / 2);
    ctx.lineTo(this.width / 2, -this.width / 2);
    ctx.lineTo(this.width / 2, this.width / 2);
    ctx.lineTo(-this.width / 2, this.width / 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
}

function BlackBall(canvas, pattern, level) {
    this.canvas = canvas;
    this.pattern = pattern;
    this.percent = 0;
    this.speed = 0.005 + level * 0.0005;
    var posiArr = this.calPosi();
    Balls.call(this, ...posiArr);
}

BlackBall.prototype = new F();
BlackBall.prototype.constructor = BlackBall;

BlackBall.prototype.move = function() {
    this.percent += this.speed;
}

BlackBall.prototype.calPosi = function() { 
    // 传入运动方式pattern和运行进度per计算位置和半径
    var w = 600 * 1.0 / 12;
    var x, y;
    if(this.pattern[0] < 3) { // 竖直运动
        x = this.pattern[0]*2*w + 4*w;
        if (this.pattern[1] === DIRECTION.DOWN) {
            y = -w + 14*w*this.percent;
        } else {
            y = 13*w - 14*w*this.percent;
        }
    } else { // 水平运动
        y = 4*w + 2*w*(this.pattern[0]-3);
        if (this.pattern[1] === DIRECTION.RIGHT) {
            x = -w + 14*w*this.percent;
        } else {
            x = 13*w - 14*w*this.percent;
        }
    }
    return [x, y, w * 0.9];
};


function BlackBallCollection(canvas) {
    this.canvas = canvas;
    this.balls = [];
}

BlackBallCollection.prototype.patterns = (function(){
    var ret = [];
    for(let i = 0; i < 3; ++i) {
        ret.push([i, DIRECTION.UP]);
        ret.push([i, DIRECTION.DOWN]);
    }
    for(let i = 3; i < 6; ++i) {
        ret.push([i, DIRECTION.LEFT]);
        ret.push([i, DIRECTION.RIGHT]);
    }
    return ret;
})(); // 记录黑球运动的12种模式

BlackBallCollection.prototype.draw = function() {
    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0,0, 600, 600);
    this.balls = this.balls.filter(function(ball, index){
        return ball.percent < 1;
    });
    this.balls.forEach(function(ball, index) {
        ball.move();
        [ball.x, ball.y, ball.radius] = ball.calPosi();
        ball.drawBall(ball.canvas);
    });
};

BlackBallCollection.prototype.generate = function(level) {
    if(this.balls.length > 4) return; // 控制球的密度不要过大
    var set = new Set();
    for(let i = 0; i < this.balls.length; ++i) {
        set.add(this.balls[i].pattern[0] * 2 + Math.floor(this.balls[i].pattern[1] / 2));
    }
    var newSet = new Set();
    while(set.size < level + 1) {
        let ran = Math.floor(Math.random()*12);
        set.add(ran);
        newSet.add(ran);
    }
    var arr = [...newSet];
    for(let i = 0; i < arr.length; ++i) {
        this.balls.push(new BlackBall(this.canvas, this.patterns[arr[i]], level));
    }
}

function testCollision(whiteBall, blackBalls, canvas) {
    var w = 600 * 1.0 / 12;
    var balls = blackBalls.balls;
    var wx = whiteBall.x + 3*w;
    var wy = whiteBall.y + 3*w;
    var dx, dy, d;
    for(let i = 0; i < balls.length; ++i) {
        dx = wx - balls[i].x;
        dy = wy - balls[i].y;
        d = balls[i].radius + whiteBall.radius;
        if(dx*dx + dy*dy < d*d){
            return true;
        }
    }
    return false;
}
