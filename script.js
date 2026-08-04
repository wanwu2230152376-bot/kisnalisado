
const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/KISNA+-+Alisado+Japon%C3%A9s+Keratina+Madrid/@40.4311284,-3.7069054,14.5z/data=!4m6!3m5!1s0xd4228b0c7f827fb:0xe37b2e589a86c3e9!8m2!3d40.4310075!4d-3.7145126!16s%2Fg%2F1hc2zzt75?entry=ttu";

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav?.classList.remove('open')));

document.querySelectorAll('[data-comparison]').forEach((box) => {
  const range = box.querySelector('.comparison-range');
  let dragging = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMode = null;

  const setSplitFromClientX = (clientX) => {
    const rect = box.getBoundingClientRect();
    if (!rect.width) return;
    const value = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    box.style.setProperty('--split', `${value}%`);
    if (range) range.value = String(Math.round(value));
  };

  const beginDrag = (clientX) => {
    dragging = true;
    box.classList.add('is-dragging');
    setSplitFromClientX(clientX);
  };

  const endDrag = () => {
    dragging = false;
    touchMode = null;
    box.classList.remove('is-dragging');
  };

  box.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    beginDrag(event.clientX);
    box.setPointerCapture?.(event.pointerId);
  });

  box.addEventListener('pointermove', (event) => {
    if (!dragging || event.pointerType === 'touch') return;
    setSplitFromClientX(event.clientX);
  });

  box.addEventListener('pointerup', endDrag);
  box.addEventListener('pointercancel', endDrag);
  box.addEventListener('lostpointercapture', endDrag);

  box.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchMode = null;
  }, { passive: true });

  box.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    if (!touch) return;

    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (touchMode === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      touchMode = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      if (touchMode === 'horizontal') beginDrag(touch.clientX);
    }

    if (touchMode === 'horizontal') {
      event.preventDefault();
      setSplitFromClientX(touch.clientX);
    }
  }, { passive: false });

  box.addEventListener('touchend', endDrag, { passive: true });
  box.addEventListener('touchcancel', endDrag, { passive: true });

  box.addEventListener('click', (event) => {
    if (!dragging) setSplitFromClientX(event.clientX);
  });

  range?.addEventListener('input', () => {
    box.style.setProperty('--split', `${range.value}%`);
  });
});

// Keep the mobile review carousel aligned to the first card after refresh/back navigation.
window.addEventListener('pageshow', () => {
  document.querySelectorAll('.hero-review-strip').forEach((strip) => {
    strip.scrollLeft = 0;
  });
});

// Synchronize the pagination dots with horizontal swiping.
document.querySelectorAll('.hero-reviews').forEach((reviewsSection) => {
  const strip = reviewsSection.querySelector('.hero-review-strip');
  const cards = Array.from(reviewsSection.querySelectorAll('.hero-review-card'));
  const dots = Array.from(reviewsSection.querySelectorAll('.hero-review-dots span'));
  if (!strip || !cards.length || !dots.length) return;

  let ticking = false;

  const setActiveDot = (index) => {
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  };

  const getNearestCardIndex = () => {
    const stripLeft = strip.getBoundingClientRect().left;
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - stripLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    return nearestIndex;
  };

  const updateDots = () => {
    ticking = false;
    setActiveDot(getNearestCardIndex());
  };

  strip.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateDots);
    }
  }, { passive: true });

  dots.forEach((dot, index) => {
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', `Ir a la reseña ${index + 1}`);
    const goToCard = () => cards[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    dot.addEventListener('click', goToCard);
    dot.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        goToCard();
      }
    });
  });

  setActiveDot(0);
});
