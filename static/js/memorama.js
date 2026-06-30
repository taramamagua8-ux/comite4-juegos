const grid = document.getElementById('memoryGrid');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const statusEl = document.getElementById('memoryStatus');
const resetEl = document.getElementById('memoryReset');
const symbols = ['💻', '⌨️', '🖱️', '🌐', '🐍', '🤖', '🧩', '💾'];
let first = null;
let second = null;
let locked = false;
let moves = 0;
let pairs = 0;

function shuffledCards() {
    return [...symbols, ...symbols]
        .map((symbol, index) => ({ symbol, id: index, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort);
}

function reveal(button) {
    if (locked || button.classList.contains('matched') || button === first) return;
    button.textContent = button.dataset.symbol;
    button.classList.add('revealed');
    if (!first) {
        first = button;
        statusEl.textContent = 'Busca su pareja.';
        return;
    }
    second = button;
    moves += 1;
    movesEl.textContent = moves;
    if (first.dataset.symbol === second.dataset.symbol) {
        first.classList.add('matched');
        second.classList.add('matched');
        first.disabled = true;
        second.disabled = true;
        pairs += 1;
        pairsEl.textContent = pairs;
        statusEl.textContent = pairs === symbols.length ? `¡Ganaste en ${moves} movimientos!` : '¡Pareja encontrada!';
        first = null;
        second = null;
        return;
    }
    locked = true;
    statusEl.textContent = 'No coinciden. Intenta otra vez.';
    window.setTimeout(() => {
        first.textContent = '?';
        second.textContent = '?';
        first.classList.remove('revealed');
        second.classList.remove('revealed');
        first = null;
        second = null;
        locked = false;
    }, 700);
}

function resetMemory() {
    first = null;
    second = null;
    locked = false;
    moves = 0;
    pairs = 0;
    movesEl.textContent = '0';
    pairsEl.textContent = '0';
    statusEl.textContent = 'Selecciona una tarjeta.';
    grid.replaceChildren();
    shuffledCards().forEach(card => {
        const button = document.createElement('button');
        button.className = 'memory-card';
        button.type = 'button';
        button.textContent = '?';
        button.dataset.symbol = card.symbol;
        button.setAttribute('aria-label', 'Tarjeta oculta');
        button.addEventListener('click', () => reveal(button));
        grid.appendChild(button);
    });
}

resetEl.addEventListener('click', resetMemory);
resetMemory();
