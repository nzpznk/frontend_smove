'use strict';

//import {BlackBall, WhiteBall, BlackBallCollection, testCollision} from './Balls.js';

var play; // the game loop

var wCanvas = document.getElementById('board');
var bCanvas = document.getElementById('black_ball_area');

function main() {
    var whiteBall = new WhiteBall(wCanvas);
    var blackBalls = new BlackBallCollection(bCanvas);
    var square = new Square(whiteBall);
    play = initPlay(whiteBall, blackBalls, square);
    window.addEventListener('keydown', play);
    window.addEventListener('touchend', play);
    showBeginOnlyOnce();
}

var showBeginOnlyOnce = (function() {
    var first = true;
    return function() {
        if(first) {
            showBegin();
            first = false;
        }
    };
})();

function showBegin() {
    var canvas = document.getElementById('info');
    canvas.setAttribute('class', 'over');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 600, 600);
    ctx.font = '48px SimlLi';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('Smove', 300, 300);
    ctx.font = '36px SimlLi';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('敲击回车键或点击触摸屏开始', 350, 500);
}

function initPlay(whiteBall, blackBalls, square) {
    return function(evt) {
        var handler;
        if(typeof(evt) !== 'number') {
            if (!(evt.keyCode && evt.keyCode === 13) && 
                !(evt.changedTouches && evt.changedTouches[0]) ){
                return;
            }
            document.getElementById('info').setAttribute('class', 'normal');
            wCanvas.getContext('2d').clearRect(0, 0, 300, 300);
            bCanvas.getContext('2d').clearRect(0, 0, 600, 600);
            handler = whiteBall.getHandler();
            window.removeEventListener('keydown', play);
            window.removeEventListener('touchend', play);
            window.addEventListener('keydown', handler);
            window.addEventListener('touchstart', handler);
            window.addEventListener('touchend', handler);
        }
        if (whiteBall.draw()) { // 如果得分了
            whiteBall.score++;
            updateScore(whiteBall.score);
            whiteBall.level = Math.floor(whiteBall.score / 10);
            if (whiteBall.score % 10 === 9) {
                square.color = 'yellow';
            } else {
                square.color = 'blue';
            }
            if(whiteBall.score % 10 === 0) {
                updateLevel(whiteBall.level);
            }
            square.getNext();
        }
        square.draw();
        blackBalls.generate(whiteBall.level);
        blackBalls.draw();
        var isOver = testCollision(whiteBall, blackBalls);
        if(isOver) {
            window.removeEventListener('keydown', handler);
            window.removeEventListener('touchstart', handler);
            window.removeEventListener('touchend', handler);
            showEnd();
        } else {
            window.requestAnimationFrame(play);
        }
    };
}

function updateScore(score) {
    var ctx = document.getElementById('score_level').getContext('2d');
    ctx.clearRect(0, 0, 300, 150);
    ctx.font = '48px Verdana';
    ctx.fillStyle = 'yellow';
    ctx.textAlign = 'center';
    ctx.fillText('Score: ' + String(score), 150, 95);
}

function updateLevel(level) {
    var ctx = document.getElementById('score_level').getContext('2d');
    ctx.clearRect(300, 0, 300, 150);
    ctx.font = '48px Verdana';
    ctx.fillStyle = 'yellow';
    ctx.textAlign = 'center';
    ctx.fillText('Level: ' + String(level), 450, 95);
}


function showEnd() {
    var canvas = document.getElementById('info');
    canvas.setAttribute('class', 'over');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 600, 600);
    ctx.font = '48px SimlLi';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束', 300, 300);
    ctx.font = '36px SimlLi';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('敲击回车键或点击触摸屏开始', 350, 500);
    main();
}

(function drawGrid() {
    var gridCanvas = document.getElementById('grid');
    var ctx = gridCanvas.getContext('2d');
    ctx.beginPath();
    var centerX = [54, 346, 346, 54];
    var centerY = [54, 54, 346, 346];
    for(let i = 0; i < 4; ++i) {
        let plusAng = i*Math.PI/2;
        ctx.arc(centerX[i], centerY[i], 50, -Math.PI + plusAng, -Math.PI / 2 + plusAng);
    }
    ctx.closePath();
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'green';
    ctx.stroke();
    var xArr = [140, 260];
    var yArr = [20, 380];
    for(let i = 0; i < 2; ++i) {
        ctx.moveTo(xArr[i], yArr[i]);
        ctx.lineTo(xArr[i], yArr[1 - i]);
        ctx.moveTo(yArr[i], xArr[i]);
        ctx.lineTo(yArr[1 - i], xArr[i]);
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'green';
    ctx.stroke();
})();

main();