const form = document.getElementById('hair-diagnostic');
const steps = [...document.querySelectorAll('.form-step')];
const nextButton = document.querySelector('.diagnostic-next');
const prevButton = document.querySelector('.diagnostic-prev');
const submitButton = document.querySelector('.diagnostic-submit');
const progressNumber = document.getElementById('progress-number');
const progressBar = document.getElementById('progress-bar');
const errorBox = document.querySelector('.form-error');
let current = 0;

function updateStep() {
  steps.forEach((step, index) => step.classList.toggle('active', index === current));
  progressNumber.textContent = String(current + 1);
  progressBar.style.width = `${((current + 1) / steps.length) * 100}%`;
  prevButton.disabled = current === 0;
  const last = current === steps.length - 1;
  nextButton.hidden = last;
  submitButton.hidden = !last;
  errorBox.textContent = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function stepIsValid() {
  const step = steps[current];
  const requiredGroups = [...new Set(
    [...step.querySelectorAll('input[required]')].map(input => input.name)
  )];

  for (const name of requiredGroups) {
    const inputs = [...step.querySelectorAll(`[name="${name}"]`)];
    if (inputs[0]?.type === 'checkbox' || inputs[0]?.type === 'radio') {
      if (!inputs.some(input => input.checked)) return false;
    } else if (!inputs[0]?.value.trim()) {
      return false;
    }
  }

  if (current === 0 && !step.querySelector('input[name="color"]:checked')) return false;
  if (current === 7 && !step.querySelector('input[name="objetivo"]:checked')) return false;
  return true;
}

nextButton.addEventListener('click', () => {
  if (!stepIsValid()) {
    errorBox.textContent = 'Selecciona una opción para continuar.';
    return;
  }
  current = Math.min(current + 1, steps.length - 1);
  updateStep();
});

prevButton.addEventListener('click', () => {
  current = Math.max(current - 1, 0);
  updateStep();
});

function values(name) {
  return [...form.querySelectorAll(`[name="${name}"]:checked`)].map(el => el.value).join(', ') || 'No indicado';
}
function value(name) {
  const el = form.querySelector(`[name="${name}"]:checked`) || form.querySelector(`[name="${name}"]`);
  return el?.value?.trim() || 'No indicado';
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!stepIsValid() || !form.checkValidity()) {
    errorBox.textContent = 'Completa los campos obligatorios antes de enviar.';
    form.reportValidity();
    return;
  }

  const message = [
    'Hola KISNA, he completado el diagnóstico capilar:',
    '',
    `Nombre: ${value('nombre')}`,
    `Teléfono: ${value('telefono')}`,
    '',
    `Cabello: ${values('color')}`,
    `Cantidad: ${value('cantidad')}`,
    `Forma natural: ${value('forma')}`,
    `Longitud: ${value('longitud')}`,
    `Uso de plancha: ${value('plancha')}`,
    `Alisado anterior: ${value('alisado_previo')}`,
    `Cuándo fue el último: ${value('fecha_alisado')}`,
    `Estado actual: ${value('estado')}`,
    `Objetivo: ${values('objetivo')}`,
    `Comentario: ${value('comentario')}`,
    '',
    'Ahora enviaré fotos actuales de mi cabello.'
  ].join('\n');

  window.location.href = `https://wa.me/34665601918?text=${encodeURIComponent(message)}`;
});

updateStep();
