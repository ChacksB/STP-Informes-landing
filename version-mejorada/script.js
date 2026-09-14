(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menú');
    }));
  }

  document.querySelectorAll('[data-scroll-to]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector(button.dataset.scrollTo)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => revealObserver.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('is-visible'));
  }

  const counters = document.querySelectorAll('[data-counter]');
  const formatCounter = (value, suffix) => value >= 1000000
    ? new Intl.NumberFormat('en-US').format(value) + suffix
    : new Intl.NumberFormat('en-US').format(value) + suffix;

  const animateCounter = el => {
    const target = Number(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) {
      el.textContent = formatCounter(target, suffix);
      return;
    }
    const duration = 1100;
    const start = performance.now();
    const frame = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCounter(Math.floor(target * eased), suffix);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  const form = document.querySelector('.access-form');
  const email = document.querySelector('#email');
  const message = document.querySelector('#form-message');
  if (form && email && message) {
    const defaultMessage = message.textContent;
    form.addEventListener('submit', event => {
      event.preventDefault();
      message.classList.remove('error', 'success');
      email.classList.remove('invalid');
      if (!email.validity.valid) {
        email.classList.add('invalid');
        message.textContent = 'Ingresa un correo empresarial válido para continuar.';
        message.classList.add('error');
        email.focus();
        return;
      }
      const button = form.querySelector('button');
      button.disabled = true;
      button.textContent = 'Enviando…';
      window.setTimeout(() => {
        button.disabled = false;
        button.textContent = 'Solicitar acceso';
        message.textContent = 'Solicitud recibida. Un especialista de STP se pondrá en contacto contigo.';
        message.classList.add('success');
        form.reset();
      }, 800);
      window.setTimeout(() => {
        message.textContent = defaultMessage;
        message.classList.remove('success');
      }, 7000);
    });
  }
})();


(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress i');
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 20);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;

    let current = '';
    sections.forEach(section => {
      if (y >= section.offsetTop - 180) current = `#${section.id}`;
    });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === current));
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.float-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  const dateNode = document.querySelector('#live-date');
  if (dateNode) {
    const now = new Date();
    dateNode.textContent = new Intl.DateTimeFormat('es-MX', { day:'numeric', month:'numeric', year:'numeric' }).format(now);
  }

  const demoRows = document.querySelectorAll('#transaction-body tr');
  if (!reduceMotion && demoRows.length) {
    let index = 0;
    window.setInterval(() => {
      demoRows.forEach(row => row.removeAttribute('data-live'));
      demoRows[index].setAttribute('data-live','true');
      index = (index + 1) % demoRows.length;
    }, 1800);
  }
})();
