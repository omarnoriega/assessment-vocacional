/**
 * pdf-export.js
 * Genera y descarga el reporte PDF del perfil vocacional.
 * Utiliza jsPDF para construir un documento de 2 páginas
 * con diseño oscuro, gráficos vectoriales y carreras recomendadas.
 *
 * Depende de: data.js, assessment.js, jsPDF (CDN)
 */

'use strict';

// ── Helpers de color ─────────────────────────────────────────────────────────

/**
 * Convierte un color hexadecimal a componentes RGB.
 * @param {string} hex - Ej: '#6c63ff'
 * @returns {number[]} [r, g, b]
 */
function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

/** Aplica color de relleno desde hex al documento PDF. */
function setFill(doc, hex) {
  const [r, g, b] = hexToRgb(hex);
  doc.setFillColor(r, g, b);
}

/** Aplica color de trazo desde hex al documento PDF. */
function setDraw(doc, hex) {
  const [r, g, b] = hexToRgb(hex);
  doc.setDrawColor(r, g, b);
}

/** Aplica color de texto desde hex al documento PDF. */
function setTextColor(doc, hex) {
  const [r, g, b] = hexToRgb(hex);
  doc.setTextColor(r, g, b);
}

// ── Componentes reutilizables de PDF ────────────────────────────────────────

/**
 * Dibuja un rectángulo redondeado con esquinas tipo píldora.
 */
function pill(doc, x, y, w, h, hex) {
  setFill(doc, hex);
  doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F');
}

/**
 * Dibuja el pie de página común en ambas páginas.
 */
function drawFooter(doc, W, H) {
  setTextColor(doc, '#3a3f5c');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Assessment Vocacional · Inteligencias Múltiples de Howard Gardner',
    W / 2, H - 10, { align: 'center' }
  );
  setFill(doc, '#6c63ff');
  doc.rect(0, H - 2, W, 2, 'F');
}

/**
 * Dibuja el fondo oscuro con orbes decorativos.
 */
function drawBackground(doc, W, H, orbs) {
  setFill(doc, '#0d0f1a');
  doc.rect(0, 0, W, H, 'F');

  // Franja de acento superior
  setFill(doc, '#6c63ff');
  doc.rect(0, 0, W, 2.5, 'F');

  // Orbes semitransparentes
  doc.setGState(doc.GState({ opacity: 0.08 }));
  orbs.forEach(({ color, x, y, r }) => {
    setFill(doc, color);
    doc.circle(x, y, r, 'F');
  });
  doc.setGState(doc.GState({ opacity: 1 }));
}

// ── Secciones de la Página 1 ────────────────────────────────────────────────

function drawCoverHeader(doc, margin) {
  // Badge
  pill(doc, margin, 28, 55, 7, '#1c1f35');
  setDraw(doc, '#6c63ff');
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, 28, 55, 7, 3.5, 3.5, 'S');
  setTextColor(doc, '#6c63ff');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('ORIENTACIÓN VOCACIONAL', margin + 27.5, 33, { align: 'center' });

  // Título
  setTextColor(doc, '#ffffff');
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Perfil de', margin, 52);
  setTextColor(doc, '#6c63ff');
  doc.text('Inteligencias', margin, 64);
  setTextColor(doc, '#ffffff');
  doc.text('Múltiples', margin, 76);

  // Subtítulo
  setTextColor(doc, '#8b90a8');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Basado en la Teoría de Howard Gardner', margin, 86);

  // Separador
  setDraw(doc, '#1c1f35');
  doc.setLineWidth(0.5);
  doc.line(margin, 93, 210 - margin, 93);
}

function drawProfileCard(doc, margin, contentW, profile, topIntel) {
  setFill(doc, '#141625');
  doc.roundedRect(margin, 98, contentW, 52, 4, 4, 'F');
  setDraw(doc, '#1c1f35');
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, 98, contentW, 52, 4, 4, 'S');

  // Barra lateral de acento
  setFill(doc, topIntel.color);
  doc.roundedRect(margin, 98, 3.5, 52, 2, 2, 'F');

  // Ícono circular
  setFill(doc, '#1c1f35');
  doc.circle(margin + 18, 124, 11, 'F');
  doc.setFontSize(14);
  doc.text(profile.icon, margin + 18, 127.5, { align: 'center' });

  // Textos del perfil
  setTextColor(doc, '#a29bfe');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('PERFIL DOMINANTE', margin + 34, 106);

  setTextColor(doc, '#ffffff');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(profile.label, margin + 34, 116);

  setTextColor(doc, '#8b90a8');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(profile.desc, contentW - 38);
  doc.text(lines, margin + 34, 124);
}

function drawScoreGrid(doc, margin, contentW, sorted) {
  let gy = 160;
  setTextColor(doc, '#e8eaf0');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen de Puntuaciones', margin, gy);
  gy += 6;

  const colW = (contentW - 4) / 2;

  sorted.forEach((intel, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x   = margin + col * (colW + 4);
    const y   = gy + row * 16;

    setFill(doc, '#141625');
    doc.roundedRect(x, y, colW, 13, 2, 2, 'F');

    // Punto de color
    setFill(doc, intel.color);
    doc.circle(x + 5, y + 6.5, 2.2, 'F');

    // Nombre
    setTextColor(doc, '#e8eaf0');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(intel.name, x + 10, y + 5.5);

    // Barra de progreso
    setFill(doc, '#1c1f35');
    doc.roundedRect(x + 10, y + 7.5, colW - 20, 2.5, 1, 1, 'F');
    const barW = Math.max(1, (intel.pct / 100) * (colW - 20));
    setFill(doc, intel.color);
    doc.roundedRect(x + 10, y + 7.5, barW, 2.5, 1, 1, 'F');

    // Porcentaje
    setTextColor(doc, intel.color);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(intel.pct + '%', x + colW - 8, y + 5.5);
  });
}

// ── Secciones de la Página 2 ────────────────────────────────────────────────

function drawRadarPDF(doc, margin, scores, startY) {
  const radarR  = 38;
  const rcx     = margin + 46;
  const rcy     = startY + 44;
  const angles8 = INTELLIGENCES.map((_, i) => (Math.PI * 2 / 8) * i - Math.PI / 2);

  // Círculos de referencia
  for (let g = 1; g <= 4; g++) {
    const r   = radarR * (g / 4);
    const pts = angles8.map(a => ({ x: rcx + r * Math.cos(a), y: rcy + r * Math.sin(a) }));
    doc.setGState(doc.GState({ opacity: 0.15 }));
    setDraw(doc, '#ffffff');
    doc.setLineWidth(0.3);
    for (let p = 0; p < pts.length; p++) {
      const n = (p + 1) % pts.length;
      doc.line(pts[p].x, pts[p].y, pts[n].x, pts[n].y);
    }
    doc.setGState(doc.GState({ opacity: 1 }));
  }

  // Ejes
  doc.setGState(doc.GState({ opacity: 0.1 }));
  setDraw(doc, '#ffffff');
  doc.setLineWidth(0.2);
  angles8.forEach(a => {
    doc.line(rcx, rcy, rcx + radarR * Math.cos(a), rcy + radarR * Math.sin(a));
  });
  doc.setGState(doc.GState({ opacity: 1 }));

  // Polígono de datos
  const dataPts = INTELLIGENCES.map((intel, i) => ({
    x: rcx + radarR * (scores[intel.id] / 100) * Math.cos(angles8[i]),
    y: rcy + radarR * (scores[intel.id] / 100) * Math.sin(angles8[i]),
  }));

  doc.setGState(doc.GState({ opacity: 0.35 }));
  setFill(doc, '#6c63ff');
  doc.moveTo(dataPts[0].x, dataPts[0].y);
  dataPts.forEach(p => doc.lineTo(p.x, p.y));
  doc.closePath();
  doc.fill();
  doc.setGState(doc.GState({ opacity: 1 }));

  setDraw(doc, '#6c63ff');
  doc.setLineWidth(0.8);
  for (let p = 0; p < dataPts.length; p++) {
    const n = (p + 1) % dataPts.length;
    doc.line(dataPts[p].x, dataPts[p].y, dataPts[n].x, dataPts[n].y);
  }

  // Puntos y etiquetas
  INTELLIGENCES.forEach((intel, i) => {
    setFill(doc, intel.color);
    doc.circle(dataPts[i].x, dataPts[i].y, 1.5, 'F');

    const lx = rcx + (radarR + 10) * Math.cos(angles8[i]);
    const ly = rcy + (radarR + 10) * Math.sin(angles8[i]);
    setTextColor(doc, intel.color);
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'bold');
    doc.text(intel.name.split('-')[0].slice(0, 7), lx, ly + 1, { align: 'center' });
  });
}

function drawBarChartPDF(doc, margin, W, scores, sorted, startY) {
  const bx      = margin + 100;
  const trackW  = W - margin - bx - 18;

  setTextColor(doc, '#e8eaf0');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Puntuación por Inteligencia', bx, startY);

  sorted.forEach((intel, idx) => {
    const by = startY + 8 + idx * 11;

    setTextColor(doc, '#c8cad4');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`${intel.emoji} ${intel.name.slice(0, 14)}`, bx, by + 2.5);

    setFill(doc, '#1c1f35');
    doc.roundedRect(bx, by + 4, trackW, 3, 1.5, 1.5, 'F');

    const fw = Math.max(1, (intel.pct / 100) * trackW);
    setFill(doc, intel.color);
    doc.roundedRect(bx, by + 4, fw, 3, 1.5, 1.5, 'F');

    setTextColor(doc, intel.color);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text(intel.pct + '%', W - margin - 1, by + 6.5, { align: 'right' });
  });
}

function drawStrengthsWeaknesses(doc, margin, contentW, top3, bottom3, y) {
  const halfW = (contentW - 5) / 2;

  // Fortalezas
  setFill(doc, '#141625');
  doc.roundedRect(margin, y, halfW, 30, 3, 3, 'F');
  setFill(doc, '#43e8c2');
  doc.roundedRect(margin, y, halfW, 1.5, 0.75, 0.75, 'F');
  setTextColor(doc, '#43e8c2');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('⚡ FORTALEZAS', margin + 5, y + 8);
  top3.forEach((intel, i) => {
    setFill(doc, intel.color + '22');
    doc.roundedRect(margin + 5, y + 11 + i * 6, halfW - 10, 5, 2.5, 2.5, 'F');
    setTextColor(doc, intel.color);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(`${intel.emoji} ${intel.name}`, margin + 8, y + 14.5 + i * 6);
  });

  // Áreas de mejora
  const wx = margin + halfW + 5;
  setFill(doc, '#141625');
  doc.roundedRect(wx, y, halfW, 30, 3, 3, 'F');
  setFill(doc, '#ff6b9d');
  doc.roundedRect(wx, y, halfW, 1.5, 0.75, 0.75, 'F');
  setTextColor(doc, '#ff6b9d');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('🌱 ÁREAS DE MEJORA', wx + 5, y + 8);
  bottom3.forEach((intel, i) => {
    setFill(doc, intel.color + '22');
    doc.roundedRect(wx + 5, y + 11 + i * 6, halfW - 10, 5, 2.5, 2.5, 'F');
    setTextColor(doc, intel.color);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(`${intel.emoji} ${intel.name}`, wx + 8, y + 14.5 + i * 6);
  });
}

function drawCareersGrid(doc, margin, contentW, topIds, y) {
  const matched = CAREERS
    .map(c => ({ ...c, matchCount: c.intel.filter(id => topIds.includes(id)).length }))
    .filter(c => c.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 9);

  const cCols  = 3;
  const cColW  = (contentW - 4) / cCols;
  const cRowH  = 18;

  matched.forEach((career, idx) => {
    const col = idx % cCols;
    const row = Math.floor(idx / cCols);
    const cx  = margin + col * (cColW + 2);
    const cy  = y + row * (cRowH + 3);

    setFill(doc, '#141625');
    doc.roundedRect(cx, cy, cColW, cRowH, 2, 2, 'F');

    const [r, g, b] = hexToRgb(career.color);
    doc.setFillColor(r, g, b);
    doc.roundedRect(cx, cy, cColW, 1.5, 0.75, 0.75, 'F');

    const isHigh     = career.matchCount === 2;
    const badgeColor = isHigh ? '#43e8c2' : '#f7b731';
    const [br, bg2, bb] = hexToRgb(badgeColor);
    doc.setFillColor(br, bg2, bb, 0.15);
    doc.roundedRect(cx + cColW - 18, cy + 3, 16, 4.5, 2, 2, 'F');
    setTextColor(doc, badgeColor);
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'bold');
    doc.text(isHigh ? '⚡ Alta' : '· Media', cx + cColW - 10, cy + 6.2, { align: 'center' });

    doc.setFontSize(9);
    setTextColor(doc, '#ffffff');
    doc.text(career.icon, cx + 4, cy + 9);

    setTextColor(doc, '#e8eaf0');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    const cName = doc.splitTextToSize(career.name, cColW - 22);
    doc.text(cName, cx + 11, cy + 9);

    setTextColor(doc, '#8b90a8');
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    const intelText = career.intel
      .map(id => INTELLIGENCES.find(i => i.id === id).name.split('-')[0])
      .join(' · ');
    doc.text(intelText, cx + 4, cy + 15);
  });

  return y + Math.ceil(matched.length / cCols) * (cRowH + 3) + 6;
}

function drawOrientationNote(doc, margin, contentW, y, H) {
  if (y >= H - 30) return;

  setFill(doc, '#141625');
  doc.roundedRect(margin, y, contentW, 16, 3, 3, 'F');
  setFill(doc, '#6c63ff');
  doc.roundedRect(margin, y, 3, 16, 1.5, 1.5, 'F');

  setTextColor(doc, '#a29bfe');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('💡 Nota orientadora', margin + 7, y + 6);

  setTextColor(doc, '#8b90a8');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  const note = 'Este perfil es una guía basada en tus preferencias actuales. ' +
    'Te recomendamos conversarlo con un orientador académico para profundizar en tu vocación.';
  doc.text(doc.splitTextToSize(note, contentW - 12), margin + 7, y + 12);
}

// ── Función principal de exportación ────────────────────────────────────────
async function exportPDF() {
  const btn = document.getElementById('btnExportPdf');
  btn.disabled = true;
  btn.innerHTML = '<span class="pdf-icon">⏳</span> Generando PDF...';

  const { jsPDF }  = window.jspdf;
  const doc        = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W          = 210, H = 297;
  const margin     = 18;
  const contentW   = W - margin * 2;

  // Calcular datos del resultado
  const scores   = computeScores();
  const sorted   = INTELLIGENCES.map(i => ({ ...i, pct: scores[i.id] })).sort((a, b) => b.pct - a.pct);
  const top3     = sorted.slice(0, 3);
  const bottom3  = sorted.slice(-3);
  const topIntel = sorted[0];
  const profile  = PROFILES.find(p => p.id === topIntel.id);

  // ═══════════════════════ PÁGINA 1 ═══════════════════════
  drawBackground(doc, W, H, [
    { color:'#6c63ff', x:185, y:40,  r:55 },
    { color:'#ff6b9d', x:25,  y:220, r:45 },
    { color:'#43e8c2', x:105, y:148, r:30 },
  ]);
  drawCoverHeader(doc, margin);
  drawProfileCard(doc, margin, contentW, profile, topIntel);
  drawScoreGrid(doc, margin, contentW, sorted);
  drawFooter(doc, W, H);

  // ═══════════════════════ PÁGINA 2 ═══════════════════════
  doc.addPage();
  drawBackground(doc, W, H, [
    { color:'#43e8c2', x:180, y:60,  r:50 },
    { color:'#a29bfe', x:30,  y:180, r:40 },
  ]);

  let y2 = 20;

  // Título radar
  setTextColor(doc, '#e8eaf0');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Mapa Radar · Perfil de Inteligencias', margin, y2);

  drawRadarPDF(doc, margin, scores, y2);
  drawBarChartPDF(doc, margin, W, scores, sorted, y2);

  y2 += 96;

  // Fortalezas y debilidades
  setTextColor(doc, '#e8eaf0');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Fortalezas y Áreas de Mejora', margin, y2);
  y2 += 7;
  drawStrengthsWeaknesses(doc, margin, contentW, top3, bottom3, y2);
  y2 += 38;

  // Carreras
  setTextColor(doc, '#e8eaf0');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('🎯 Carreras Recomendadas', margin, y2);
  y2 += 7;
  y2 = drawCareersGrid(doc, margin, contentW, top3.map(i => i.id), y2);

  drawOrientationNote(doc, margin, contentW, y2, H);
  drawFooter(doc, W, H);

  // Guardar archivo
  const timestamp = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
  doc.save(`perfil-vocacional-${timestamp}.pdf`);

  // Restaurar botón y mostrar toast
  btn.disabled = false;
  btn.innerHTML = '<span class="pdf-icon">📄</span> Exportar resultado en PDF';

  const toast = document.getElementById('pdfToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
