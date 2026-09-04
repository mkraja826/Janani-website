(() => {
  const config = window.JANANI_PUBLIC_CONFIG || {};
  const currentScript = document.currentScript;
  const assetUrl = (name) => currentScript?.src
    ? new URL(name, currentScript.src).toString()
    : `/assets/${name}`;

  if (!document.querySelector('link[data-pregalove-polish]')) {
    const polish = document.createElement('link');
    polish.rel = 'stylesheet';
    polish.href = assetUrl('polish.css');
    polish.dataset.pregalovePolish = 'true';
    document.head.appendChild(polish);
  }

  // Use the exact mother-and-baby artwork supplied by the product owner.
  // This is a binary-safe, locally hosted 512px crop of the uploaded source;
  // no generated/reinterpreted logo is used.
  const officialMarkUrl = `${assetUrl('pregalove-mother-baby-exact-v5.jpg')}?v=5`;
  const brandMarks = Array.from(document.querySelectorAll('.brand-mark'));

  brandMarks.forEach((mark) => {
    mark.replaceChildren();
    mark.style.width = '52px';
    mark.style.height = '52px';
    mark.style.flex = '0 0 52px';
    mark.style.background = 'transparent';
    mark.style.boxShadow = 'none';
    mark.style.borderRadius = '12px';
    mark.style.overflow = 'hidden';

    const image = document.createElement('img');
    image.src = officialMarkUrl;
    image.alt = '';
    image.width = 52;
    image.height = 52;
    image.decoding = 'async';
    image.style.display = 'block';
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.objectFit = 'contain';
    image.style.opacity = '1';
    image.style.visibility = 'visible';
    mark.appendChild(image);
  });

  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.type = 'image/jpeg';
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
