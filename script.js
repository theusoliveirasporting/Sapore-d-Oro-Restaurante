/**
 * SAPORE D'ORO - Restaurant Landing Page
 * Optimized Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  // Throttle function for performance optimization
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  };

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideUp 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  const handleNavbarScroll = throttle(function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 50);

  window.addEventListener('scroll', handleNavbarScroll);

  // ============================================
  // MOBILE NAVIGATION
  // ============================================
  const navOverlay = document.querySelector('.nav-overlay');

  function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  }

  navToggle.addEventListener('click', toggleMobileMenu);
  navOverlay.addEventListener('click', toggleMobileMenu);

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      toggleMobileMenu();
    }
  });

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // MENU CATEGORY FILTER
  // ============================================
  const categoryBtns = document.querySelectorAll('.category-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;

      menuItems.forEach(item => {
        if (item.dataset.category === category) {
          item.classList.remove('hidden');
          item.style.display = 'block';
        } else {
          item.classList.add('hidden');
          item.style.display = 'none';
        }
      });
    });
  });

  // ============================================
  // CONSOLIDATED INTERSECTION OBSERVER
  // ============================================
  const revealElements = document.querySelectorAll(
    '.section-title, .section-label, .about-text, .menu-item, .gallery-item, .contact-item, .form-group'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Handle menu items specifically
        if (entry.target.classList.contains('menu-item')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // ============================================
  // RESERVATION FORM HANDLING WITH VALIDATION
  // ============================================
  const reservationForm = document.querySelector('.reservation-form');
  const dateInput = document.getElementById('date');
  const phoneInput = document.getElementById('phone');

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  // Phone mask
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length >= 11) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length >= 7) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }

    e.target.value = value;
  });

  // Real-time form validation
  const formInputs = reservationForm.querySelectorAll('input, select, textarea');
  
  formInputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });

    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        validateField(this);
      }
    });
  });

  function validateField(field) {
    const formGroup = field.parentElement;
    let isValid = true;
    let errorMessage = '';

    if (field.type === 'email') {
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      errorMessage = 'E-mail inválido';
    } else if (field.type === 'tel') {
      isValid = field.value.replace(/\D/g, '').length >= 9;
      errorMessage = 'Telefone deve ter pelo menos 9 dígitos';
    } else if (field.type === 'date') {
      isValid = field.value !== '';
      errorMessage = 'Data é obrigatória';
    } else if (field.type === 'text' && field.id === 'name') {
      isValid = field.value.trim().length >= 3;
      errorMessage = 'Nome deve ter pelo menos 3 caracteres';
    } else if (field.tagName === 'SELECT') {
      isValid = field.value !== '';
      errorMessage = 'Seleccione uma opção';
    }

    updateFieldStatus(formGroup, isValid, errorMessage);
  }

  function updateFieldStatus(formGroup, isValid, errorMessage) {
    if (isValid) {
      formGroup.classList.remove('error');
      formGroup.classList.add('success');
    } else {
      formGroup.classList.remove('success');
      formGroup.classList.add('error');
    }

    let feedbackEl = formGroup.querySelector('.form-feedback');
    if (!feedbackEl) {
      feedbackEl = document.createElement('div');
      feedbackEl.className = 'form-feedback';
      formGroup.appendChild(feedbackEl);
    }
    feedbackEl.textContent = errorMessage;
  }

  // Form submission
  reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    formInputs.forEach(input => {
      validateField(input);
      if (input.parentElement.classList.contains('error')) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      const formData = new FormData(reservationForm);
      const data = Object.fromEntries(formData);

      console.log('Pedido de reserva:', data);
      
      showToast(`Obrigado, ${data.name}! A sua reserva foi confirmada. Entraremos em contacto em breve.`);
      reservationForm.reset();
      
      formInputs.forEach(input => {
        input.parentElement.classList.remove('error', 'success');
      });
    } else {
      showToast('Por favor, corrija os erros no formulário', 'error');
    }
  });

  // ============================================
  // OPTIMIZED PARALLAX EFFECT FOR HERO
  // ============================================
  const heroBg = document.querySelector('.hero-bg');
  let ticking = false;

  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const heroHeight = document.querySelector('.hero').offsetHeight;

    if (scrolled < heroHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // ============================================
  // ACTIVE SECTION HIGHLIGHT
  // ============================================
  const sections = document.querySelectorAll('section[id]');

  const highlightSection = throttle(function() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.add('active');
      } else {
        document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.remove('active');
      }
    });
  }, 50);

  window.addEventListener('scroll', highlightSection);

  // ============================================
  // GALLERY PARALLAX WITH OPTIMIZATION
  // ============================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  let galleryTicking = false;

  const updateGalleryParallax = () => {
    const gallerySection = document.querySelector('.gallery');
    if (!gallerySection) {
      galleryTicking = false;
      return;
    }

    const sectionTop = gallerySection.offsetTop;
    const sectionBottom = sectionTop + gallerySection.offsetHeight;
    const scrollY = window.pageYOffset;

    if (scrollY > sectionTop - window.innerHeight && scrollY < sectionBottom + window.innerHeight) {
      galleryItems.forEach((item, index) => {
        const speed = 0.1 + (index * 0.02);
        const yPos = (scrollY - sectionTop) * speed;
        item.style.transform = `translateY(${yPos}px)`;
      });
    }
    galleryTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!galleryTicking) {
      window.requestAnimationFrame(updateGalleryParallax);
      galleryTicking = true;
    }
  });

  // ============================================
  // COUNTER ANIMATION FOR EXPERIENCE BADGE
  // ============================================
  const experienceBadge = document.querySelector('.experience-badge');
  const yearsElement = experienceBadge?.querySelector('.years');

  if (yearsElement) {
    const targetNumber = 25;
    let hasAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          let current = 0;
          const increment = targetNumber / 50;

          const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
              yearsElement.textContent = `${targetNumber}+`;
              clearInterval(timer);
            } else {
              yearsElement.textContent = `${Math.floor(current)}+`;
            }
          }, 30);
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(experienceBadge);
  }

  // ============================================
  // HOVER EFFECT FOR MENU ITEMS (Desktop Only)
  // ============================================
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    menuItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        menuItems.forEach(other => {
          if (other !== this && !other.classList.contains('hidden')) {
            other.style.opacity = '0.5';
          }
        });
      });

      item.addEventListener('mouseleave', function() {
        menuItems.forEach(other => {
          if (!other.classList.contains('hidden')) {
            other.style.opacity = '1';
          }
        });
      });
    });
  }

  // ============================================
  // LAZY LOADING FOR IMAGES
  // ============================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // CONSOLE EASTER EGG
  // ============================================
  console.log(`
    ╔═══════════════════════════════════════╗
    ║   SAPORE D'ORO - Cucina Italiana      ║
    ║   Bem-vindo ao nosso restaurante!     ║
    ║                                       ║
    ║   🍝 Feito com amor e tradição        ║
    ║   ⚡ Agora com performance otimizada! ║
    ╚═══════════════════════════════════════╝
  `);

});