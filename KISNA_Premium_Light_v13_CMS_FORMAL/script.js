
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

document.querySelectorAll('[data-comparison]').forEach(box => {
  const range = box.querySelector('.comparison-range');
  range?.addEventListener('input', () => box.style.setProperty('--split', `${range.value}%`));
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
