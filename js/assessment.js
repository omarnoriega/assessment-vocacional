/**
 * assessment.js
 * Lógica principal del assessment vocacional.
 * Modelo de interacción: RANKING secuencial por clicks.
 *
 * El estudiante hace click en las opciones en orden de preferencia.
 * El primer click asigna posición 1° (4 pts), el segundo 2° (3 pts),
 * el tercero 3° (2 pts) y el cuarto 4° (1 pt).
 * Clicking una opción ya rankeada la elimina del ranking y reordena.
 *
 * answers[qId] = [optIdx_1er, optIdx_2do, optIdx_3er, optIdx_4to]
 *
 * Depende de: data.js
 */

'use strict';

// ── Estado de la aplicación ──────────────────────────────────────────────────
let currentQ = 0;
let answers  = {}; // { qId: [idx0, idx1, idx2, idx3] } orden = ranking

const RANK_LABELS  = ['1°', '2°', '3°', '4°'];
const RANK_COLORS  = ['#6c63ff', '#43e8c2', '#f7b731', '#ff6b9d'];

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

  const pct = (currentQ / total) * 100;
  document.getElementById('progressBar').style.width   = pct + '%';
  document.getElementById('progressLabel').textContent = `Pregunta ${currentQ + 1} de ${total}`;

  const container = document.getElementById('questionContainer');
  container.innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div class="q-num">Pregunta ${q.id}</div>
        <div class="q-intl">${intel.emoji} ${intel.name}</div>
      </div>
      <div class="q-text">${q.text}</div>
      <div class="rank-hint">
        Ordena las opciones de mayor a menor preferencia — haz click en el orden que las priorizas
      </div>
      <div class="options" id="options"></div>
      <div class="rank-progress" id="rankProgress"></div>
    </div>
  `;

  renderOptions(q);
  updateNav();
}

// ── Renderizar opciones con su estado de ranking ─────────────────────────────
function renderOptions(q) {
  const ranking  = answers[q.id] || [];
  const optWrap  = document.getElementById('options');
  optWrap.innerHTML = '';

  q.opts.forEach((opt, idx) => {
    const rankPos  = ranking.indexOf(idx);  // -1 si no rankeada
    const isRanked = rankPos !== -1;
    const label    = isRanked ? RANK_LABELS[rankPos] : '';
    const color    = isRanked ? RANK_COLORS[rankPos] : '';

    const div = document.createElement('div');
    div.className = 'option' + (isRanked ? ' ranked' : '');
    if (isRanked) div.style.setProperty('--rank-color', color);

    div.innerHTML = `
      <div class="option-rank-badge ${isRanked ? 'visible' : ''}"
           style="${isRanked ? `background:${color};box-shadow:0 0 0 3px ${color}33` : ''}">
        ${label}
      </div>
      <div class="option-text">${opt}</div>
      ${isRanked ? `<div class="option-remove" title="Quitar">✕</div>` : ''}
    `;

    div.addEventListener('click', (e) => {
      if (e.target.classList.contains('option-remove')) {
        removeRank(q.id, idx);
      } else {
        toggleRank(q.id, idx);
      }
    });

    optWrap.appendChild(div);
  });

  // Mini progreso visual del ranking
  const prog = document.getElementById('rankProgress');
  const steps = q.opts.map((_, i) => {
    const pos = ranking.indexOf(i);
    return pos !== -1 ? pos : null;
  });
  const ranked = ranking.length;
  prog.innerHTML = `
    <div class="rank-steps">
      ${RANK_LABELS.map((lbl, i) => `
        <div class="rank-step ${i < ranked ? 'done' : ''}"
             style="${i < ranked ? `background:${RANK_COLORS[i]};border-color:${RANK_COLORS[i]}` : ''}">
          ${i < ranked ? lbl : lbl}
        </div>
      `).join('')}
      <span class="rank-step-label">
        ${ranked === 4 ? '¡Ranking completo!' : `Selecciona la opción ${RANK_LABELS[ranked]}`}
      </span>
    </div>
  `;
}

// ── Lógica de ranking ────────────────────────────────────────────────────────
function toggleRank(qId, optIdx) {
  if (!answers[qId]) answers[qId] = [];
  const ranking = answers[qId];

  if (ranking.includes(optIdx)) {
    // Ya rankeada → quitar
    removeRank(qId, optIdx);
    return;
  }
  if (ranking.length >= 4) return; // ranking completo

  answers[qId] = [...ranking, optIdx];
  renderOptions(QUESTIONS[currentQ]);
  updateNav();
}

function removeRank(qId, optIdx) {
  answers[qId] = (answers[qId] || []).filter(i => i !== optIdx);
  renderOptions(QUESTIONS[currentQ]);
  updateNav();
}

// ── Actualizar controles de navegación ──────────────────────────────────────
function updateNav() {
  const q        = QUESTIONS[currentQ];
  const ranking  = answers[q.id] || [];
  const complete = ranking.length === 4;
  const isLast   = currentQ === QUESTIONS.length - 1;

  document.getElementById('btnPrev').style.visibility = currentQ === 0 ? 'hidden' : 'visible';
  document.getElementById('btnNext').disabled         = !complete;
  document.getElementById('btnNext').style.display    = isLast ? 'none' : 'inline-flex';
  document.getElementById('btnSubmit').style.display  = (isLast && complete) ? 'inline-flex' : 'none';
}

// ── Navegación ───────────────────────────────────────────────────────────────
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

// ── Cálculo de puntajes — Modelo Ranking (4-3-2-1) ──────────────────────────
/**
 * Para cada pregunta, el estudiante asigna un orden de preferencia.
 * La opción en posición 0 del ranking (1° lugar) recibe 4 pts,
 * la de posición 1 recibe 3 pts, posición 2 → 2 pts, posición 3 → 1 pt.
 *
 * La inteligencia activada por cada opción viene de SCORE_MAP[qId][optIdx].
 *
 * Máximo posible por inteligencia: 5 preguntas × 4 pts = 20 pts
 * Porcentaje(I) = round(PuntajeBruto(I) / 20 × 100)
 *
 * @returns {Object} { id: porcentaje (0-100) }
 */
function computeScores() {
  const raw = {};
  INTELLIGENCES.forEach(i => { raw[i.id] = 0; });

  QUESTIONS.forEach(q => {
    const ranking = answers[q.id];
    if (!ranking || ranking.length === 0) return;

    ranking.forEach((optIdx, rankPos) => {
      const intId = SCORE_MAP[q.id][optIdx];
      const pts   = RANK_POINTS[rankPos]; // 4, 3, 2, 1
      raw[intId]  = (raw[intId] || 0) + pts;
    });
  });

  const pct = {};
  INTELLIGENCES.forEach(i => {
    pct[i.id] = Math.min(100, Math.round((raw[i.id] / MAX_SCORE_PER_INTELLIGENCE) * 100));
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

  const profile = PROFILES.find(p => p.id === topIntel.id);
  document.getElementById('profileBadge').innerHTML = `
    <div class="profile-icon">${profile.icon}</div>
    <h2>${profile.label}</h2>
    <p>${profile.desc}</p>
  `;

  renderBarChart(sorted);
  drawRadar(scores);
  renderStrengthsWeaknesses(top3, bottom3);
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

  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  }, 100);
}

// ── Renderizar fortalezas y debilidades ──────────────────────────────────────
function renderStrengthsWeaknesses(top3, bottom3) {
  const sC = document.getElementById('strengthsContainer');
  const wC = document.getElementById('weaknessesContainer');
  sC.innerHTML = '';
  wC.innerHTML = '';

  top3.forEach(i => {
    const tag = document.createElement('span');
    tag.className   = 'sw-tag s';
    tag.textContent = `${i.emoji} ${i.name}`;
    sC.appendChild(tag);
  });

  bottom3.forEach(i => {
    const tag = document.createElement('span');
    tag.className   = 'sw-tag w';
    tag.textContent = `${i.emoji} ${i.name}`;
    wC.appendChild(tag);
  });
}

// ── Renderizar carreras recomendadas ─────────────────────────────────────────
function renderCareers(top3) {
  const topIds  = top3.map(i => i.id);
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
    const matchColor = c.matchCount === 2 ? '#43e8c2' : '#f7b731';
    const matchLabel = c.matchCount === 2 ? 'Alta' : 'Media';
    const intelNames = c.intel
      .map(id => INTELLIGENCES.find(i => i.id === id))
      .map(i => `${i.emoji} ${i.name}`)
      .join(' · ');

    div.innerHTML = `
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${c.color}"></div>
      <div class="career-match" style="background:${matchColor}22;color:${matchColor}">⚡ ${matchLabel}</div>
      <div class="career-icon">${c.icon}</div>
      <div class="career-name">${c.name}</div>
      <div class="career-intel">${intelNames}</div>
    `;
    grid.appendChild(div);
  });
}

// ── Radar chart en Canvas ────────────────────────────────────────────────────
function drawRadar(scores) {
  const canvas = document.getElementById('radarCanvas');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const R  = Math.min(W, H) / 2 - 36;
  const N  = INTELLIGENCES.length;
  const angles = INTELLIGENCES.map((_, i) => (Math.PI * 2 / N) * i - Math.PI / 2);

  ctx.clearRect(0, 0, W, H);

  for (let g = 1; g <= 4; g++) {
    const r = R * (g / 4);
    ctx.beginPath();
    angles.forEach((a, i) => {
      const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  angles.forEach(a => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  ctx.beginPath();
  INTELLIGENCES.forEach((intel, i) => {
    const r = R * (scores[intel.id] / 100);
    const x = cx + r * Math.cos(angles[i]), y = cy + r * Math.sin(angles[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  grad.addColorStop(0, 'rgba(108,99,255,0.5)');
  grad.addColorStop(1, 'rgba(255,107,157,0.2)');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = '#6c63ff';
  ctx.lineWidth = 2;
  ctx.stroke();

  INTELLIGENCES.forEach((intel, i) => {
    const r  = R * (scores[intel.id] / 100);
    const x  = cx + r * Math.cos(angles[i]), y = cy + r * Math.sin(angles[i]);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = intel.color;
    ctx.fill();

    const lx = cx + (R + 22) * Math.cos(angles[i]);
    const ly = cy + (R + 22) * Math.sin(angles[i]);
    ctx.font = '13px DM Sans, sans-serif';
    ctx.fillStyle    = 'rgba(255,255,255,0.7)';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(intel.emoji, lx, ly);
  });
}

// ── Reiniciar ────────────────────────────────────────────────────────────────
function restartAssessment() {
  currentQ = 0;
  answers  = {};
  document.getElementById('results').style.display = 'none';
  document.getElementById('intro').style.display   = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
