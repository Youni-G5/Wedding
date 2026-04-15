/**
 * section-header.js
 * Wedding Theme — Header nav interactions
 *
 * Transparent Hero mode :
 *  - Si le header a data-transparent="true", il est fixed par-dessus le hero
 *  - Au scroll > SCROLL_THRESHOLD, la class `is-scrolled` est ajoutée
 *    → CSS retrouve le fond opaque et la bordure via cette class
 *  - `body--hero-header` est ajoutée au body pour annuler tout offset
 *    que le thème pourrait ajouter à la première section
 */

(function () {
  'use strict';

  const SCROLL_THRESHOLD = 60; /* px avant de rendre le header opaque */

  class SiteHeader {
    constructor(wrapper) {
      this.header     = wrapper.querySelector('.site-header');
      this.burger     = wrapper.querySelector('[data-burger]');
      this.sectionId  = this.header && this.header.dataset.sectionId;
      this.mobileMenu = this.sectionId ? document.getElementById('mobile-menu-' + this.sectionId) : null;
      this.backdrop   = wrapper.querySelector('[data-backdrop]');
      this.closeBtn   = this.mobileMenu && this.mobileMenu.querySelector('[data-close-menu]');
      this.isSticky   = this.header && this.header.classList.contains('site-header--sticky');
      this.isTransparent = this.header && this.header.dataset.transparent === 'true';
      this._open      = false;

      this._init();
    }

    _init() {
      /* ── Mode transparent sur hero ── */
      if (this.isTransparent) {
        document.body.classList.add('body--hero-header');
        this._initTransparentScroll();
      } else if (this.isSticky) {
        /* ── Sticky classique (autres pages) ── */
        this._initStickyScroll();
      }

      /* ── Mobile menu ── */
      if (this.burger && this.mobileMenu) {
        this.burger.addEventListener('click', () => this._openMenu());
      }
      this.closeBtn && this.closeBtn.addEventListener('click', () => this._closeMenu());
      this.backdrop && this.backdrop.addEventListener('click', () => this._closeMenu());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this._open) this._closeMenu();
      });
    }

    _initTransparentScroll() {
      /* Démarre transparent ; au scroll, devient opaque */
      const update = () => {
        const scrolled = window.scrollY > SCROLL_THRESHOLD;
        this.header.classList.toggle('is-scrolled', scrolled);
      };
      window.addEventListener('scroll', update, { passive: true });
      update(); /* état initial */
    }

    _initStickyScroll() {
      const onScroll = () => {
        this.header.classList.toggle('is-scrolled', window.scrollY > 10);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    _openMenu() {
      this._open = true;
      this.mobileMenu.setAttribute('aria-hidden', 'false');
      this.burger.setAttribute('aria-expanded', 'true');
      this.backdrop && this.backdrop.classList.add('is-visible');
      document.documentElement.style.overflow = 'hidden';

      const first = this.mobileMenu.querySelector('a, button');
      if (first) requestAnimationFrame(() => first.focus());

      if (window.WeddingTheme && window.WeddingTheme.trapFocus) {
        window.WeddingTheme.trapFocus(this.mobileMenu);
      }
    }

    _closeMenu() {
      this._open = false;
      this.mobileMenu.setAttribute('aria-hidden', 'true');
      this.burger.setAttribute('aria-expanded', 'false');
      this.backdrop && this.backdrop.classList.remove('is-visible');
      document.documentElement.style.overflow = '';
      this.burger && this.burger.focus();
    }
  }

  function init() {
    const wrapper = document.querySelector('.section-header-wrapper');
    if (wrapper) new SiteHeader(wrapper);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Shopify Theme Editor — recharge si la section est rechargée */
  document.addEventListener('shopify:section:load', (e) => {
    if (e.target.classList.contains('section-header-wrapper')) init();
  });

})();
