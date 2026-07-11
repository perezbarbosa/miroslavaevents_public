// Miroslava Events — main.js
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.setAttribute('data-open', String(!open));
      document.body.style.overflow = !open ? 'hidden' : '';
    });

    // Dropdown toggle on touch/mobile
    document.querySelectorAll('.main-nav .has-dropdown > a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          const parent = link.closest('.has-dropdown');
          const isOpen = parent.getAttribute('data-open') === 'true';
          // Only intercept the first tap to reveal submenu
          if (!isOpen && parent.querySelector('.dropdown')) {
            e.preventDefault();
            document.querySelectorAll('.has-dropdown[data-open="true"]').forEach(el => el.setAttribute('data-open', 'false'));
            parent.setAttribute('data-open', 'true');
          }
        }
      });
    });

    // Close menu when a real link is followed
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && a.getAttribute('href') !== '#') {
          toggle.setAttribute('aria-expanded', 'false');
          nav.setAttribute('data-open', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Contact form (Web3Forms) ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const statusBox = document.getElementById('form-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.setAttribute('aria-disabled', 'true');
      submitBtn.textContent = 'Enviando…';
      statusBox.className = 'form-status';
      statusBox.textContent = '';

      try {
        const formData = new FormData(form);
        const accessKey = form.dataset.accessKey;

        if (!accessKey || accessKey.includes('YOUR_')) {
          throw new Error('CONFIG');
        }

        formData.append('access_key', accessKey);

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });
        const data = await res.json();

        if (data.success) {
          statusBox.classList.add('ok');
          statusBox.textContent = '¡Gracias! Hemos recibido tu mensaje y te responderemos en menos de 48 horas.';
          form.reset();
        } else {
          throw new Error(data.message || 'ERROR');
        }
      } catch (err) {
        statusBox.classList.add('err');
        if (err && err.message === 'CONFIG') {
          statusBox.textContent = 'El formulario todavía no está conectado (falta la clave de Web3Forms). Mientras tanto, escríbenos a hola@miroslava.es.';
        } else {
          statusBox.textContent = 'No hemos podido enviar tu mensaje. Prueba de nuevo o escríbenos directamente a hola@miroslava.es.';
        }
      } finally {
        submitBtn.removeAttribute('aria-disabled');
        submitBtn.textContent = originalLabel;
      }
    });
  }

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
