/**
 * section-header.js
 * Wedding Theme — Header nav interactions
 */

(function () {
  'use strict';

  class SiteHeader {
    constructor(wrapper) {
      this.header     = wrapper.querySelector('.site-header');
      this.burger     = wrapper.querySelector('[data-burger]');
      this.sectionId  = this.header && this.header.dataset.sectionId;
      this.mobileMenu = this.sectionId ? document.getElementById('mobile-menu-' + this.sectionId) : null;
      this.backdrop   = wrapper.querySelector('[data-backdrop]');
      this.closeBtn   = this.mobileMenu && this.mobileMenu.querySelector('[data-close-menu]');
      this.isSticky   = this.header && this.header.classList.contains('site-header--sticky');
      this._open      = false;

      this._init();
    }

    _init() {
      /* Sticky shadow */
      if (this.isSticky) {
        const onScroll = () => {
          this.header.classList.toggle('is-scrolled', window.scrollY > 10);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      }

      /* Mobile menu open */
      if (this.burger && this.mobileMenu) {
        this.burger.addEventListener('click', () => this._openMenu());
      }

      /* Close buttons */
      this.closeBtn && this.closeBtn.addEventListener('click', () => this._closeMenu());
      this.backdrop && this.backdrop.addEventListener('click', () => this._closeMenu());

      /* Escape key */
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this._open) this._closeMenu();
      });
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

  /* Shopify Theme Editor */
  document.addEventListener('shopify:section:load', (e) => {
    if (e.target.classList.contains('section-header-wrapper')) init();
  });

})();
