// ===== DOM ELEMENTS =====
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');
const scrollTopBtn = document.getElementById('scrollTop');

// ===== STICKY HEADER ON SCROLL =====
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Show/hide scroll to top button
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }

  // Update active nav link based on scroll position
  updateActiveNav();
});

// ===== MOBILE MENU TOGGLE =====
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
  navOverlay.classList.toggle('show');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

navOverlay.addEventListener('click', closeMenu);

function closeMenu() {
  hamburger.classList.remove('active');
  navMenu.classList.remove('open');
  navOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

// ===== DROPDOWN TOGGLE ON MOBILE =====
document.querySelectorAll('.nav-menu > li').forEach(item => {
  const link = item.querySelector('a');
  const dropdown = item.querySelector('.dropdown');

  if (dropdown) {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        // Close other open dropdowns
        document.querySelectorAll('.dropdown.mobile-open').forEach(d => {
          if (d !== dropdown) d.classList.remove('mobile-open');
        });
        dropdown.classList.toggle('mobile-open');
      }
    });
  }
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
function scrollToSection(targetId) {
  const target = document.querySelector(targetId);
  if (!target) return;

  // Close menu first, then scroll after a small delay
  // so body overflow:hidden gets removed
  closeMenu();
  setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth' });
  }, 50);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    // Check if this is a dropdown PARENT link on mobile
    const parentLi = this.closest('.nav-menu > li');
    const isDropdownParent = parentLi && parentLi.querySelector('.dropdown');

    if (isDropdownParent && window.innerWidth <= 768) {
      // Dropdown parent on mobile — handled by dropdown toggle above
      return;
    }

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      // Close any open mobile dropdowns
      document.querySelectorAll('.dropdown.mobile-open').forEach(d => {
        d.classList.remove('mobile-open');
      });
      scrollToSection(targetId);
    }
  });
});

// ===== SCROLL TO TOP =====
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== UPDATE ACTIVE NAV LINK =====
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu > li > a');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
  revealObserver.observe(el);
});

// ===== COUNTER ANIMATION FOR STATS =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const text = counter.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[0]);
    const suffix = text.replace(match[0], '');
    let count = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const updateCounter = () => {
      count += increment;
      if (count < target) {
        counter.textContent = Math.floor(count) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = text;
      }
    };

    updateCounter();
  });
}

// Trigger counter animation when stats bar is visible
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  statsObserver.observe(statsBar);
}

// ===== CONTACT FORM HANDLER =====
function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  // Show loading state
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
  submitBtn.disabled = true;
  
  // Simulate submission (replace with actual form handler)
  setTimeout(() => {
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Enquiry Submitted!';
    submitBtn.style.background = '#10b981';
    
    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 3000);
  }, 1500);
}

// ===== HANDLE WINDOW RESIZE =====
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMenu();
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('mobile-open'));
  }
  // Recalculate carousel on resize
  if (carousel.track) {
    carousel.updateSlidesPerView();
    carousel.goTo(carousel.current);
  }
});

// ===== ACHIEVEMENTS CAROUSEL =====
const carousel = {
  track: document.getElementById('carouselTrack'),
  prevBtn: document.getElementById('carouselPrev'),
  nextBtn: document.getElementById('carouselNext'),
  dotsContainer: document.getElementById('carouselDots'),
  slides: null,
  current: 0,
  slidesPerView: 3,
  totalSlides: 0,
  autoplayInterval: null,
  autoplayDelay: 3500,

  init() {
    if (!this.track) return;
    this.slides = this.track.querySelectorAll('.carousel-slide');
    this.totalSlides = this.slides.length;
    this.updateSlidesPerView();
    this.createDots();
    this.goTo(0);
    this.startAutoplay();
    this.bindEvents();
  },

  updateSlidesPerView() {
    const w = window.innerWidth;
    if (w <= 480) this.slidesPerView = 1;
    else if (w <= 768) this.slidesPerView = 1;
    else if (w <= 1024) this.slidesPerView = 2;
    else this.slidesPerView = 3;
  },

  getMaxIndex() {
    return Math.max(0, this.totalSlides - this.slidesPerView);
  },

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    const maxIdx = this.getMaxIndex();
    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        this.goTo(i);
        this.restartAutoplay();
      });
      this.dotsContainer.appendChild(dot);
    }
  },

  updateDots() {
    if (!this.dotsContainer) return;
    const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.current);
    });
  },

  goTo(index) {
    const maxIdx = this.getMaxIndex();
    this.current = Math.max(0, Math.min(index, maxIdx));

    if (this.slides.length === 0) return;
    const slideWidth = this.slides[0].getBoundingClientRect().width;
    const gap = 24;
    const offset = this.current * (slideWidth + gap);
    this.track.style.transform = `translateX(-${offset}px)`;
    this.updateDots();
  },

  next() {
    if (this.current >= this.getMaxIndex()) {
      this.goTo(0);
    } else {
      this.goTo(this.current + 1);
    }
  },

  prev() {
    if (this.current <= 0) {
      this.goTo(this.getMaxIndex());
    } else {
      this.goTo(this.current - 1);
    }
  },

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
  },

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  },

  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  },

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.restartAutoplay();
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.restartAutoplay();
      });
    }

    // Pause on hover
    const section = document.querySelector('.carousel-section');
    if (section) {
      section.addEventListener('mouseenter', () => this.stopAutoplay());
      section.addEventListener('mouseleave', () => this.startAutoplay());
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    this.track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    this.track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) this.next();
        else this.prev();
        this.restartAutoplay();
      }
    }, { passive: true });
  }
};

carousel.init();

// ===== HERO SLIDER =====
const heroSlider = {
  slides: document.querySelectorAll('.hero-slide'),
  prevBtn: document.getElementById('heroPrev'),
  nextBtn: document.getElementById('heroNext'),
  dotsContainer: document.getElementById('heroDots'),
  current: 0,
  autoplayInterval: null,
  autoplayDelay: 5000,

  init() {
    if (this.slides.length === 0) return;
    this.createDots();
    this.goTo(0);
    this.startAutoplay();
    this.bindEvents();
  },

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    this.slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        this.goTo(i);
        this.restartAutoplay();
      });
      this.dotsContainer.appendChild(dot);
    });
  },

  updateDots() {
    if (!this.dotsContainer) return;
    const dots = this.dotsContainer.querySelectorAll('.hero-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.current);
    });
  },

  goTo(index) {
    this.slides[this.current].classList.remove('active');
    this.current = (index + this.slides.length) % this.slides.length;
    this.slides[this.current].classList.add('active');
    this.updateDots();
  },

  next() {
    this.goTo(this.current + 1);
  },

  prev() {
    this.goTo(this.current - 1);
  },

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
  },

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  },

  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  },

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.restartAutoplay();
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.restartAutoplay();
      });
    }
    
    // Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) this.next();
          else this.prev();
          this.restartAutoplay();
        }
      }, { passive: true });
    }
  }
};

heroSlider.init();
