(() => {
  const config = window.JANANI_PUBLIC_CONFIG || {};
  const currentScript = document.currentScript;
  const officialMarkUrl = currentScript?.src
    ? new URL('pregalove-mark.svg', currentScript.src).toString()
    : '/assets/pregalove-mark.svg';

  document.querySelectorAll('.brand-mark').forEach((mark) => {
    mark.textContent = '';
    mark.style.background = 'transparent';
    mark.style.boxShadow = 'none';
    mark.style.borderRadius = '0';
    mark.style.overflow = 'visible';

    const image = document.createElement('img');
    image.src = officialMarkUrl;
    image.alt = '';
    image.width = 38;
    image.height = 38;
    image.decoding = 'async';
    image.style.display = 'block';
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.objectFit = 'contain';
    mark.appendChild(image);
  });

  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.href = officialMarkUrl;

  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav-links]');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('[data-app-link]').forEach((link) => {
    if (config.androidAppUrl) {
      link.setAttribute('href', config.androidAppUrl);
      link.setAttribute('rel', 'noreferrer');
    }
  });

  if (config.siteBaseUrl) {
    const canonicalUrl = new URL(window.location.pathname, config.siteBaseUrl).toString();
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = canonicalUrl;
  }
})();
