const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
const colorEl = document.getElementById('drawColor');
const sizeEl = document.getElementById('drawSize');
const eraserEl = document.getElementById('drawEraser');
const clearEl = document.getElementById('drawClear');
const saveEl = document.getElementById('drawSave');
const statusEl = document.getElementById('drawStatus');
let drawing = false;
let erasing = false;

function fillWhite() {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

function point(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * canvas.width / rect.width,
        y: (event.clientY - rect.top) * canvas.height / rect.height
    };
}

function startDrawing(event) {
    drawing = true;
    const p = point(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    canvas.setPointerCapture(event.pointerId);
}

function draw(event) {
    if (!drawing) return;
    const p = point(event);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Number(sizeEl.value);
    ctx.strokeStyle = erasing ? '#ffffff' : colorEl.value;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
}

function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

canvas.addEventListener('pointerdown', startDrawing);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointercancel', stopDrawing);
eraserEl.addEventListener('click', () => {
    erasing = !erasing;
    eraserEl.classList.toggle('active', erasing);
    eraserEl.textContent = erasing ? 'Borrador activo' : 'Borrador';
    statusEl.textContent = erasing ? 'Borrador activado.' : 'Pincel activado.';
});
clearEl.addEventListener('click', () => {
    fillWhite();
    statusEl.textContent = 'Lienzo limpio.';
});
saveEl.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'mi-dibujo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    statusEl.textContent = 'Dibujo guardado.';
});
fillWhite();
