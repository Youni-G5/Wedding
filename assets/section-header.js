/**
 * section-header.js
 * Wedding Theme — Header + Drawer interactions
 */

(function () {
  'use strict';

  const SCROLL_THRESHOLD = 60;

  class SiteHeader {
    constructor(wrapper) {
      this.header        = wrapper.querySelector('.site-header');
      this.burger        = wrapper.querySelector('[data-burger]');
      this.sectionId     = this.header && this.header.dataset.sectionId;
      this.drawer        = this.sectionId ? document.getElementById('mobile-menu-' + this.sectionId) : null;
      this.backdrop      = wrapper.querySelector('[data-backdrop]');
      this.closeBtn      = this.drawer && this.drawer.querySelector('[data-close-menu]');
      this.isSticky      = this.header && this.header.classList.contains('site-header--sticky');
      this.isTransparent = this.header && this.header.dataset.transparent === 'true';
      this._open         = false;
      this._focusables   = [];

      this._init();
    }

    _init() {
      if (this.isTransparent) {
        document.body.classList.add('body--hero-header');
        this._initScroll(SCROLL_THRESHOLD);
      } else if (this.isSticky) {
        this._initScroll(10);
      }

      if (this.burger && this.drawer) {
        this.burger.addEventListener('click', () => this._toggle());
      }
      this.closeBtn  && this.closeBtn.addEventListener('click',  () => this._close());
      this.backdrop  && this.backdrop.addEventListener('click',  () => this._close());

      /* Ferme au clic sur un lien du drawer */
      if (this.drawer) {
        this.drawer.querySelectorAll('.drawer__link').forEach(link => {
          link.addEventListener('click', () => this._close());
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this._open) this._close();
      });
    }

    _initScroll(threshold) {
      const update = () => this.header.classList.toggle('is-scrolled', window.scrollY > threshold);
      window.addEventListener('scroll', update, { passive: true });
      update();
    }

    _toggle() {
      this._open ? this._close() : this._open_menu();
    }

    _open_menu() {
      this._open = true;

      /* Active les tabindex sur les éléments du drawer */
      this._setTabIndex(0);

      this.drawer.setAttribute('aria-hidden', 'false');
      this.burger.setAttribute('aria-expanded', 'true');
      this.backdrop && this.backdrop.classList.add('is-visible');
      document.documentElement.style.overflow = 'hidden';

      /* Focus sur le bouton fermer */
      requestAnimationFrame(() => {
        this.closeBtn && this.closeBtn.focus();
      });
    }

    _close() {
      this._open = false;

      this.drawer.setAttribute('aria-hidden', 'true');
      this.burger.setAttribute('aria-expanded', 'false');
      this.backdrop && this.backdrop.classList.remove('is-visible');
      document.documentElement.style.overflow = '';

      /* Désactive les tabindex — on attend la fin de la transition */
      const dur = parseFloat(
        getComputedStyle(this.drawer).transitionDuration
      ) * 1000 || 480;

      setTimeout(() => this._setTabIndex(-1), dur);

      this.burger && this.burger.focus();
    }

    /**
     * Gère les tabindex des éléments interactifs du drawer.
     * -1 quand fermé (inatteignable au clavier), 0 quand ouvert.
     */
    _setTabIndex(val) {
      if (!this.drawer) return;
      this.drawer
        .querySelectorAll('a, button, [tabindex]')
        .forEach(el => el.setAttribute('tabindex', val));
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

  document.addEventListener('shopify:section:load', (e) => {
    if (e.target.classList.contains('section-header-wrapper')) init();
  });

})();
