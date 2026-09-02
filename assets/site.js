(() => {
  const config = window.JANANI_PUBLIC_CONFIG || {};

  function brandize(value) {
    return String(value)
      .replace(/JANANI/g, 'PREGALOVE')
      .replace(/Janani/g, 'PregaLove');
  }

  function applyPregaLoveBrand() {
    document.title = brandize(document.title);

    document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="application-name"]').forEach((meta) => {
      const content = meta.getAttribute('content');
      if (content) meta.setAttribute('content', brandize(content));
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) return;
      if (node.nodeValue && /Janani|JANANI/.test(node.nodeValue)) node.nodeValue = brandize(node.nodeValue);
    });

    document.querySelectorAll('[aria-label], [title], [alt]').forEach((element) => {
      ['aria-label', 'title', 'alt'].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (value && /Janani|JANANI/.test(value)) element.setAttribute(attribute, brandize(value));
      });
    });
  }

  applyPregaLoveBrand();

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
