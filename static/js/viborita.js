const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('snakeScore');
const statusEl = document.getElementById('snakeStatus');
const startEl = document.getElementById('snakeStart');
const pauseEl = document.getElementById('snakePause');
const cells = 18;
const cell = canvas.width / cells;
let snake;
let food;
let direction;
let nextDirection;
let score;
let timer = null;
let paused = false;

function randomFood() {
    do {
        food = { x: Math.floor(Math.random() * cells), y: Math.floor(Math.random() * cells) };
    } while (snake.some(part => part.x === food.x && part.y === food.y));
}

function resetSnake() {
    snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
    direction = { x: 1, y: 0 };
    nextDirection = direction;
    score = 0;
    paused = false;
    scoreEl.textContent = '0';
    pauseEl.textContent = 'Pausar';
    randomFood();
    drawSnake();
}

function drawSnake() {
    ctx.fillStyle = '#061326';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#153355';
    for (let i = 0; i <= cells; i += 1) {
        ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(canvas.width, i * cell); ctx.stroke();
    }
    ctx.fillStyle = '#ffe66d';
    ctx.beginPath();
    ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell * .34, 0, Math.PI * 2);
    ctx.fill();
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#72f0bd' : '#32c78b';
        ctx.fillRect(part.x * cell + 2, part.y * cell + 2, cell - 4, cell - 4);
    });
}

function gameOver() {
    clearInterval(timer);
    timer = null;
    statusEl.textContent = `Fin de la partida. Lograste ${score} puntos.`;
}

function tick() {
    if (paused) return;
    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const hitWall = head.x < 0 || head.y < 0 || head.x >= cells || head.y >= cells;
    const hitSelf = snake.some(part => part.x === head.x && part.y === head.y);
    if (hitWall || hitSelf) return gameOver();
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        scoreEl.textContent = score;
        randomFood();
    } else {
        snake.pop();
    }
    drawSnake();
}

function setDirection(name) {
    const map = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    const candidate = map[name];
    if (!candidate || candidate.x === -direction.x && candidate.y === -direction.y) return;
    nextDirection = candidate;
}

function startSnake() {
    clearInterval(timer);
    resetSnake();
    statusEl.textContent = '¡Atrapa la comida!';
    timer = setInterval(tick, 130);
}

document.querySelectorAll('[data-dir]').forEach(button => button.addEventListener('click', () => setDirection(button.dataset.dir)));
startEl.addEventListener('click', startSnake);
pauseEl.addEventListener('click', () => {
    if (!timer) return;
    paused = !paused;
    pauseEl.textContent = paused ? 'Continuar' : 'Pausar';
    statusEl.textContent = paused ? 'Juego pausado.' : '¡Atrapa la comida!';
});
window.addEventListener('keydown', event => {
    const keys = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (keys[event.key]) {
        event.preventDefault();
        setDirection(keys[event.key]);
    }
});
resetSnake();
