/**
 * section-header.js
 * Wedding Theme — Header interactions
 * Mobile menu, sticky nav, scroll indicator
 */

(function () {
  'use strict';

  class SiteHeader {
    constructor(container) {
      this.container = container;
      this.nav       = container.querySelector('[data-section-type="header"] .site-header__nav');
      this.burger    = container.querySelector('[data-burger]');
      this.mobileMenu = document.getElementById(
        'mobile-menu-' + container.querySelector('[data-section-id]').dataset.sectionId
      );
      this.backdrop  = container.querySelector('[data-backdrop]');
      this.closeBtn  = this.mobileMenu && this.mobileMenu.querySelector('[data-close-menu]');
      this.isSticky  = container.querySelector('.site-header--sticky') !== null;
      this.scrollIndicator = document.querySelector('.site-header__scroll-indicator');

      this._scrollY      = 0;
      this._ticking      = false;
      this._menuOpen     = false;

      this.init();
    }

    init() {
      /* ── Sticky nav ───────────────────────────── */
      if (this.isSticky && this.nav) {
        this._onScroll = this._handleScroll.bind(this);
        window.addEventListener('scroll', this._onScroll, { passive: true });
        this._handleScroll(); // init state
      }

      /* ── Mobile menu ──────────────────────────── */
      if (this.burger && this.mobileMenu) {
        this.burger.addEventListener('click', this._openMenu.bind(this));
      }
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', this._closeMenu.bind(this));
      }
      if (this.backdrop) {
        this.backdrop.addEventListener('click', this._closeMenu.bind(this));
      }

      /* Close on Escape */
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this._menuOpen) this._closeMenu();
      });

      /* ── Scroll indicator hide on scroll ─────── */
      if (this.scrollIndicator) {
        window.addEventListener('scroll', () => {
          this.scrollIndicator.style.opacity = window.scrollY > 80 ? '0' : '1';
        }, { passive: true });
      }
    }

    /* ─── Sticky ──────────────────────────────────────────────────── */
    _handleScroll() {
      this._scrollY = window.scrollY;
      if (!this._ticking) {
        window.requestAnimationFrame(() => {
          this._updateSticky();
          this._ticking = false;
        });
        this._ticking = true;
      }
    }

    _updateSticky() {
      if (!this.nav) return;
      const heroHeight = this.container.offsetHeight;
      if (this._scrollY > heroHeight * 0.15) {
        this.nav.classList.add('is-stuck');
      } else {
        this.nav.classList.remove('is-stuck');
      }
    }

    /* ─── Mobile menu ─────────────────────────────────────────────── */
    _openMenu() {
      this._menuOpen = true;
      this.mobileMenu.setAttribute('aria-hidden', 'false');
      this.burger.setAttribute('aria-expanded', 'true');
      this.backdrop && this.backdrop.classList.add('is-visible');
      document.documentElement.style.overflow = 'hidden';

      /* Focus first link */
      const firstLink = this.mobileMenu.querySelector('a, button');
      if (firstLink) requestAnimationFrame(() => firstLink.focus());

      /* Trap focus */
      if (window.WeddingTheme && window.WeddingTheme.trapFocus) {
        window.WeddingTheme.trapFocus(this.mobileMenu);
      }
    }

    _closeMenu() {
      this._menuOpen = false;
      this.mobileMenu.setAttribute('aria-hidden', 'true');
      this.burger.setAttribute('aria-expanded', 'false');
      this.backdrop && this.backdrop.classList.remove('is-visible');
      document.documentElement.style.overflow = '';
      this.burger.focus();
    }
  }

  /* ─── Init on DOM ready ─────────────────────────────────────────── */
  function initHeader() {
    const wrapper = document.querySelector('.section-header-wrapper');
    if (!wrapper) return;
    new SiteHeader(wrapper);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }

  /* ─── Shopify Theme Editor live reload ─────────────────────────── */
  document.addEventListener('shopify:section:load', (e) => {
    if (e.target.classList.contains('section-header-wrapper')) {
      initHeader();
    }
  });

})();
