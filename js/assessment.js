/**
 * assessment.js
 * Lógica principal del assessment vocacional.
 * Gestiona el estado, la renderización de preguntas,
 * la navegación y la generación de resultados visuales.
 *
 * Depende de: data.js
 */

'use strict';

// ── Estado de la aplicación ──────────────────────────────────────────────────
let currentQ = 0;
let answers  = {};

// ── Iniciar assessment ───────────────────────────────────────────────────────
function startAssessment() {
  document.getElementById('intro').style.display      = 'none';
  document.getElementById('assessment').style.display = 'block';
  renderQuestion();
}

// ── Renderizar pregunta actual ───────────────────────────────────────────────
function renderQuestion() {
  const q     = QUESTIONS[currentQ];
  const total = QUESTIONS.length;
  const intel = INTELLIGENCES.find(i => i.id === q.intel);

  // Actualizar barra de progreso
  const pct = (currentQ / total) * 100;
  document.getElementById('progressBar').style.width      = pct + '%';
  document.getElementById('progressLabel').textContent    = `Pregunta ${currentQ + 1} de ${total}`;

  // Renderizar tarjeta de pregunta
  const container = document.getElementById('questionContainer');
  container.innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div class="q-num">Pregunta ${q.id}</div>
        <div class="q-intl">${intel.emoji} ${intel.name}</div>
      </div>
      <div class="q-text">${q.text}</div>
      <div class="options" id="options"></div>
    </div>
  `;

  // Renderizar opciones
  const optWrap = document.getElementById('options');
  q.opts.forEach((opt, idx) => {
    const div       = document.createElement('div');
    div.className   = 'option' + (answers[q.id] === idx ? ' selected' : '');
    div.innerHTML   = `<div class="option-dot"></div><div class="option-text">${opt}</div>`;
    div.addEventListener('click', () => selectOption(q.id, idx));
    optWrap.appendChild(div);
  });

  updateNav();
}

// ── Seleccionar opción ───────────────────────────────────────────────────────
function selectOption(qId, idx) {
  answers[qId] = idx;
  document.querySelectorAll('.option').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });
  updateNav();
}

// ── Actualizar controles de navegación ──────────────────────────────────────
function updateNav() {
  const q        = QUESTIONS[currentQ];
  const answered = answers[q.id] !== undefined;
  const isLast   = currentQ === QUESTIONS.length - 1;

  document.getElementById('btnPrev').style.visibility = currentQ === 0 ? 'hidden' : 'visible';
  document.getElementById('btnNext').disabled         = !answered;
  document.getElementById('btnNext').style.display    = isLast ? 'none' : 'inline-flex';
  document.getElementById('btnSubmit').style.display  = (isLast && answered) ? 'inline-flex' : 'none';
}

// ── Navegar entre preguntas ──────────────────────────────────────────────────
function nextQ() {
  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevQ() {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ── Calcular puntajes ────────────────────────────────────────────────────────
/**
 * Calcula el porcentaje obtenido en cada inteligencia
 * sobre el máximo posible (15 pts = 5 preguntas × 3 pts).
 * @returns {Object} Mapa { id: porcentaje (0-100) }
 */
function computeScores() {
  const raw = {};
  INTELLIGENCES.forEach(i => { raw[i.id] = 0; });

  QUESTIONS.forEach(q => {
    const chosen = answers[q.id];
    if (chosen === undefined) return;
    const [intId, pts] = SCORE_MAP[q.id][chosen];
    raw[intId] = (raw[intId] || 0) + pts;
  });

  const maxPossible = 15;
  const pct = {};
  INTELLIGENCES.forEach(i => {
    pct[i.id] = Math.min(100, Math.round((raw[i.id] / maxPossible) * 100));
  });
  return pct;
}

// ── Mostrar resultados ───────────────────────────────────────────────────────
function showResults() {
  document.getElementById('assessment').style.display = 'none';
  document.getElementById('results').style.display    = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const scores   = computeScores();
  const sorted   = INTELLIGENCES.map(i => ({ ...i, pct: scores[i.id] })).sort((a,b) => b.pct - a.pct);
  const top3     = sorted.slice(0, 3);
  const bottom3  = sorted.slice(-3);
  const topIntel = sorted[0];

  // Perfil dominante
  const profile = PROFILES.find(p => p.id === topIntel.id);
  document.getElementById('profileBadge').innerHTML = `
    <div class="profile-icon">${profile.icon}</div>
    <h2>${profile.label}</h2>
    <p>${profile.desc}</p>
  `;

  // Gráfico de barras
  renderBarChart(sorted);

  // Radar
  drawRadar(scores);

  // Fortalezas y áreas de mejora
  renderStrengthsWeaknesses(top3, bottom3);

  // Carreras
  renderCareers(top3);
}

// ── Renderizar gráfico de barras ─────────────────────────────────────────────
function renderBarChart(sorted) {
  const container = document.getElementById('barChart');
  container.innerHTML = '';

  sorted.forEach(intel => {
    const div = document.createElement('div');
    div.className = 'bar-item';
    div.innerHTML = `
      <div class="bar-label">
        <span>${intel.emoji} ${intel.name}</span>
        <span>${intel.pct}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" data-pct="${intel.pct}" style="background:${intel.color}"></div>
      </div>
    `;
    container.appendChild(div);
  });

  // Animar barras con retardo para efecto visual
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  }, 100);
}

// ── Renderizar fortalezas y debilidades ──────────────────────────────────────
function renderStrengthsWeaknesses(top3, bottom3) {
  const sContainer = document.getElementById('strengthsContainer');
  const wContainer = document.getElementById('weaknessesContainer');
  sContainer.innerHTML = '';
  wContainer.innerHTML = '';

  top3.forEach(i => {
    const tag       = document.createElement('span');
    tag.className   = 'sw-tag s';
    tag.textContent = `${i.emoji} ${i.name}`;
    sContainer.appendChild(tag);
  });

  bottom3.forEach(i => {
    const tag       = document.createElement('span');
    tag.className   = 'sw-tag w';
    tag.textContent = `${i.emoji} ${i.name}`;
    wContainer.appendChild(tag);
  });
}

// ── Renderizar carreras recomendadas ─────────────────────────────────────────
function renderCareers(top3) {
  const topIds = top3.map(i => i.id);

  const matched = CAREERS
    .map(c => ({ ...c, matchCount: c.intel.filter(id => topIds.includes(id)).length }))
    .filter(c => c.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 9);

  const grid = document.getElementById('careerGrid');
  grid.innerHTML = '';

  matched.forEach(c => {
    const div        = document.createElement('div');
    div.className    = 'career-card';
    const matchPct   = c.matchCount === 2 ? 'Alta' : 'Media';
    const matchColor = c.matchCount === 2 ? '#43e8c2' : '#f7b731';
    const intelNames = c.intel
      .map(id => INTELLIGENCES.find(i => i.id === id))
      .map(i => `${i.emoji} ${i.name}`)
      .join(' · ');

    div.innerHTML = `
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${c.color}"></div>
      <div class="career-match" style="background:${matchColor}22;color:${matchColor}">⚡ ${matchPct}</div>
      <div class="career-icon">${c.icon}</div>
      <div class="career-name">${c.name}</div>
      <div class="career-intel">${intelNames}</div>
    `;
    grid.appendChild(div);
  });
}

// ── Dibujar radar chart en Canvas ────────────────────────────────────────────
function drawRadar(scores) {
  const canvas = document.getElementById('radarCanvas');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const R  = Math.min(W, H) / 2 - 36;
  const N  = INTELLIGENCES.length;
  const angles = INTELLIGENCES.map((_, i) => (Math.PI * 2 / N) * i - Math.PI / 2);

  ctx.clearRect(0, 0, W, H);

  // Círculos de referencia
  for (let g = 1; g <= 4; g++) {
    const r = R * (g / 4);
    ctx.beginPath();
    angles.forEach((a, i) => {
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth   = 1;
    ctx.stroke();
  }

  // Ejes radiales
  angles.forEach(a => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth   = 1;
    ctx.stroke();
  });

  // Polígono de datos (relleno)
  ctx.beginPath();
  INTELLIGENCES.forEach((intel, i) => {
    const pct = scores[intel.id] / 100;
    const r   = R * pct;
    const x   = cx + r * Math.cos(angles[i]);
    const y   = cy + r * Math.sin(angles[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  grad.addColorStop(0, 'rgba(108,99,255,0.5)');
  grad.addColorStop(1, 'rgba(255,107,157,0.2)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Polígono de datos (borde)
  ctx.strokeStyle = '#6c63ff';
  ctx.lineWidth   = 2;
  ctx.stroke();

  // Puntos y etiquetas por inteligencia
  INTELLIGENCES.forEach((intel, i) => {
    const pct = scores[intel.id] / 100;
    const r   = R * pct;
    const x   = cx + r * Math.cos(angles[i]);
    const y   = cy + r * Math.sin(angles[i]);

    // Punto
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = intel.color;
    ctx.fill();

    // Emoji de etiqueta
    const lx = cx + (R + 22) * Math.cos(angles[i]);
    const ly = cy + (R + 22) * Math.sin(angles[i]);
    ctx.font          = '13px DM Sans, sans-serif';
    ctx.fillStyle     = 'rgba(255,255,255,0.7)';
    ctx.textAlign     = 'center';
    ctx.textBaseline  = 'middle';
    ctx.fillText(intel.emoji, lx, ly);
  });
}

// ── Reiniciar assessment ─────────────────────────────────────────────────────
function restartAssessment() {
  currentQ = 0;
  answers  = {};
  document.getElementById('results').style.display = 'none';
  document.getElementById('intro').style.display   = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
