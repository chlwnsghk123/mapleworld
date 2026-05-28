(() => {
  // Tabs (skill tree)
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (!target) return;

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      panels.forEach((panel) => {
        const active = panel.id === target;
        panel.classList.toggle('is-active', active);
        if (active) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      });
    });
  });

  // Active section indicator in section-bar (scrollspy)
  const navLinks = document.querySelectorAll('.section-bar-inner a');
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const byId = new Map(
      Array.from(navLinks).map((a) => [a.getAttribute('href').slice(1), a]),
    );

    const navContainer = document.querySelector('.section-bar-inner');

    // Smoothly center the active pill within the horizontal scroll area
    // without scrolling the entire page.
    const scrollNavToActive = (link) => {
      if (!navContainer) return;
      const navRect = navContainer.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const navMid = navRect.left + navRect.width / 2;
      const linkMid = linkRect.left + linkRect.width / 2;
      const delta = linkMid - navMid;
      navContainer.scrollBy({ left: delta, behavior: 'smooth' });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = byId.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('is-active'));
            link.classList.add('is-active');
            scrollNavToActive(link);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
  }
})();
