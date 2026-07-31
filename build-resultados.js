'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'resultados.json');
const HOME_FILE = path.join(ROOT, 'index.html');
const GALLERY_FILE = path.join(ROOT, 'resultados.html');

const HOME_START = '<!-- RESULTADOS_STATIC_HOME_START -->';
const HOME_END = '<!-- RESULTADOS_STATIC_HOME_END -->';
const GALLERY_START = '<!-- RESULTADOS_STATIC_GALLERY_START -->';
const GALLERY_END = '<!-- RESULTADOS_STATIC_GALLERY_END -->';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function safeImagePath(value = '') {
  const imagePath = cleanText(value);
  if (/^\/assets\/[A-Za-z0-9_./%+()\-]+$/u.test(imagePath)) return imagePath;
  if (/^https:\/\/[A-Za-z0-9.-]+\/[A-Za-z0-9_./?&=%+()\-]+$/u.test(imagePath)) return imagePath;
  return '';
}

function lowerFirst(value) {
  if (!value) return '';
  return value.charAt(0).toLocaleLowerCase('es-ES') + value.slice(1);
}

function normaliseCase(item, index) {
  if (!item || item.publicado === false) return null;

  const titulo = cleanText(item.titulo);
  const detalle = cleanText(item.detalle);
  const antes = safeImagePath(item.antes);
  const despues = safeImagePath(item.despues);

  if (!titulo || !antes || !despues) {
    console.warn(`Caso ${index + 1} omitido: faltan título o imágenes válidas.`);
    return null;
  }

  const contexto = detalle || titulo;
  const descripcion =
    cleanText(item.descripcion) ||
    `Resultado real de ${lowerFirst(titulo)} en KISNA Madrid para ${lowerFirst(contexto)}.`;

  return {
    titulo,
    detalle,
    descripcion,
    antes,
    despues,
    altAntes:
      cleanText(item.alt_antes) ||
      `Antes de ${lowerFirst(titulo)}: ${contexto} en KISNA Madrid`,
    altDespues:
      cleanText(item.alt_despues) ||
      `Después de ${lowerFirst(titulo)}: ${contexto} en KISNA Madrid`,
  };
}

function renderCase(item, eager = false) {
  const loading = eager ? 'eager' : 'lazy';
  const priority = eager ? ' fetchpriority="high"' : '';
  const detail = item.detalle
    ? `<p class="result-detail">${escapeHtml(item.detalle)}</p>`
    : '';

  return `<article class="comparison-card">
  <div class="comparison" data-comparison style="--split:50%">
    <img class="before-image" src="${escapeHtml(item.antes)}" alt="${escapeHtml(item.altAntes)}" loading="${loading}" decoding="async"${priority}>
    <div class="after-layer"><img src="${escapeHtml(item.despues)}" alt="${escapeHtml(item.altDespues)}" loading="${loading}" decoding="async"></div>
    <span class="label before-label">ANTES</span>
    <span class="label after-label">DESPUÉS</span>
    <input class="comparison-range" aria-label="Comparar antes y después: ${escapeHtml(item.titulo)}" type="range" min="0" max="100" value="50">
    <div class="comparison-handle" aria-hidden="true">↔</div>
  </div>
  <h3>${escapeHtml(item.titulo)}</h3>
  ${detail}
  <p class="result-description">${escapeHtml(item.descripcion)}</p>
</article>`;
}

function renderEmpty() {
  return `<article class="result-awaiting" data-nosnippet>
  <span>+</span>
  <strong>Nuevos resultados próximamente</strong>
  <p>Estamos preparando más transformaciones reales de KISNA.</p>
</article>`;
}

function replaceBetweenMarkers(filePath, startMarker, endMarker, content) {
  const original = fs.readFileSync(filePath, 'utf8');
  const start = original.indexOf(startMarker);
  const end = original.indexOf(endMarker);

  if (start === -1 || end === -1 || end < start) {
    throw new Error(`No se encontraron los marcadores en ${path.basename(filePath)}.`);
  }

  const before = original.slice(0, start + startMarker.length);
  const after = original.slice(end);
  fs.writeFileSync(filePath, `${before}\n${content}\n${after}`, 'utf8');
}

function main() {
  const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const rawCases = Array.isArray(parsed.casos) ? parsed.casos : [];
  const cases = rawCases.map(normaliseCase).filter(Boolean);

  const homeCases = cases.slice(0, 4);
  const homeHtml = homeCases.length
    ? homeCases.map((item, index) => renderCase(item, index === 0)).join('\n')
    : renderEmpty();
  const galleryHtml = cases.length
    ? cases.map((item, index) => renderCase(item, index === 0)).join('\n')
    : renderEmpty();

  replaceBetweenMarkers(HOME_FILE, HOME_START, HOME_END, homeHtml);
  replaceBetweenMarkers(GALLERY_FILE, GALLERY_START, GALLERY_END, galleryHtml);

  console.log(`Resultados generados en HTML: ${cases.length} caso(s) publicado(s).`);
}

try {
  main();
} catch (error) {
  console.error('Error al generar los resultados estáticos:', error.message);
  process.exit(1);
}
