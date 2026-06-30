const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('flappyScore');
const bestEl = document.getElementById('flappyBest');
const statusEl = document.getElementById('flappyStatus');
const startEl = document.getElementById('flappyStart');
const jumpEl = document.getElementById('flappyJump');
const birdImage = new Image();
birdImage.src = './static/img/bird1.png';
let bird;
let pipes;
let score;
let frame;
let running = false;
let animationId = 0;
let best = Number(localStorage.getItem('comiteFlappyBest')) || 0;
bestEl.textContent = best;

function resetFlappy() {
    bird = { x: 86, y: 250, vy: 0, size: 34 };
    pipes = [];
    score = 0;
    frame = 0;
    scoreEl.textContent = '0';
}

function addPipe() {
    const gap = 145;
    const top = 70 + Math.random() * 235;
    pipes.push({ x: canvas.width, top, gap, scored: false });
}

function jump() {
    if (!running) return;
    bird.vy = -7.6;
}

function endGame() {
    running = false;
    statusEl.textContent = `Fin de la partida. Lograste ${score} puntos.`;
    if (score > best) {
        best = score;
        bestEl.textContent = best;
        localStorage.setItem('comiteFlappyBest', best);
    }
}

function update() {
    bird.vy += 0.42;
    bird.y += bird.vy;
    if (frame % 100 === 0) addPipe();
    pipes.forEach(pipe => {
        pipe.x -= 2.6;
        if (!pipe.scored && pipe.x + 58 < bird.x) {
            pipe.scored = true;
            score += 1;
            scoreEl.textContent = score;
        }
        const overlapsX = bird.x + bird.size / 2 > pipe.x && bird.x - bird.size / 2 < pipe.x + 58;
        const hitsY = bird.y - bird.size / 2 < pipe.top || bird.y + bird.size / 2 > pipe.top + pipe.gap;
        if (overlapsX && hitsY) endGame();
    });
    pipes = pipes.filter(pipe => pipe.x > -70);
    if (bird.y + bird.size / 2 > canvas.height - 35 || bird.y < 0) endGame();
    frame += 1;
}

function draw() {
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#75d8ff');
    sky.addColorStop(1, '#d5f7ff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pipes.forEach(pipe => {
        ctx.fillStyle = '#35b85a';
        ctx.fillRect(pipe.x, 0, 58, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipe.gap, 58, canvas.height);
        ctx.fillStyle = '#1d873d';
        ctx.fillRect(pipe.x - 4, pipe.top - 18, 66, 18);
        ctx.fillRect(pipe.x - 4, pipe.top + pipe.gap, 66, 18);
    });
    ctx.fillStyle = '#d4a94e';
    ctx.fillRect(0, canvas.height - 35, canvas.width, 35);
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(Math.max(-0.4, Math.min(0.8, bird.vy * 0.06)));
    if (birdImage.complete && birdImage.naturalWidth) {
        ctx.drawImage(birdImage, -25, -20, 50, 40);
    } else {
        ctx.fillStyle = '#ffd93d';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function loop() {
    if (running) update();
    draw();
    if (running) animationId = requestAnimationFrame(loop);
}

function startGame() {
    cancelAnimationFrame(animationId);
    resetFlappy();
    running = true;
    statusEl.textContent = '¡Vuela entre las tuberías!';
    loop();
}

canvas.addEventListener('pointerdown', jump);
jumpEl.addEventListener('click', jump);
startEl.addEventListener('click', startGame);
window.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        event.preventDefault();
        jump();
    }
});
resetFlappy();
draw();
