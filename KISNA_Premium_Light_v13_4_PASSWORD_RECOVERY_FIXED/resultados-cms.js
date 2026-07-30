(() => {
  const grids = Array.from(document.querySelectorAll('[data-resultados-cms]'));
  if (!grids.length) return;

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const cardTemplate = (item) => `
    <article class="comparison-card">
      <div class="comparison" data-comparison style="--split:50%">
        <img class="before-image" src="${escapeHtml(item.antes)}" alt="${escapeHtml(item.alt_antes || `Antes: ${item.detalle || item.titulo}`)}" loading="lazy">
        <div class="after-layer"><img src="${escapeHtml(item.despues)}" alt="${escapeHtml(item.alt_despues || `Después: ${item.detalle || item.titulo}`)}" loading="lazy"></div>
        <span class="label before-label">ANTES</span><span class="label after-label">DESPUÉS</span>
        <input class="comparison-range" aria-label="Comparar antes y después" type="range" min="0" max="100" value="50">
        <div class="comparison-handle">↔</div>
      </div>
      <h3>${escapeHtml(item.titulo)}</h3>
      <p>${escapeHtml(item.detalle || '')}</p>
    </article>`;

  const placeholderTemplate = (number) => `
    <article class="result-awaiting"><span>${String(number).padStart(2, '0')}</span><strong>Próximo resultado real</strong><p>Se añadirá una nueva transformación de KISNA.</p></article>`;

  const activateComparisons = (scope) => {
    scope.querySelectorAll('[data-comparison]').forEach((box) => {
      const range = box.querySelector('.comparison-range');
      if (!range || range.dataset.ready) return;
      range.dataset.ready = 'true';
      const update = () => box.style.setProperty('--split', `${range.value}%`);
      range.addEventListener('input', update);
      update();
    });
  };

  fetch('/data/resultados.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const items = Array.isArray(data.casos) ? data.casos.filter((item) => item && item.publicado !== false && item.antes && item.despues) : [];
      grids.forEach((grid) => {
        const cards = items.map(cardTemplate);
        const minimumCards = grid.closest('#resultados') ? 4 : Math.max(4, items.length);
        for (let index = cards.length + 1; index <= minimumCards; index += 1) cards.push(placeholderTemplate(index));
        grid.innerHTML = cards.join('');
        activateComparisons(grid);
      });
    })
    .catch((error) => {
      console.error('No se pudieron cargar los resultados:', error);
      grids.forEach((grid) => {
        grid.innerHTML = '<article class="result-awaiting"><span>!</span><strong>Resultados temporalmente no disponibles</strong><p>Vuelve a intentarlo en unos minutos.</p></article>';
      });
    });
})();
