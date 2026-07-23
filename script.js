// Mobile menu toggle
function toggleMenu(){
    const nav = document.getElementById('nav');
    const btn = document.querySelector('.menu');
    if(!nav || !btn) return;
    const isOpen = nav.classList.toggle('open');
    const icon = btn.querySelector('.menu-icon');
    const label = btn.querySelector('.menu-label');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    btn.classList.toggle('is-open', isOpen);
    if(icon){
      icon.textContent = isOpen ? '✕' : '☰';
    } else {
      btn.textContent = isOpen ? '✕' : '☰';
    }
    if(label){
      label.textContent = isOpen ? 'Close menu' : 'Open menu';
    }
  }

  const menuButton = document.querySelector('.menu');
  if(menuButton){
    menuButton.addEventListener('click', toggleMenu);
  }

  const siteHeader = document.querySelector('.site-header');
  const backToTopButton = document.getElementById('backToTop');

  if(backToTopButton){
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Theme handling (black or white only) with persistence
  (function(){
    const root = document.documentElement;
    const btn = document.getElementById('themeToggle');
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || 'light';
  
    function setTheme(mode){
      root.setAttribute('data-theme', mode);
      localStorage.setItem('theme', mode);
      if(btn){
        btn.textContent = mode === 'dark' ? '☀︎' : '🌙';
        btn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
      }
    }
  
    setTheme(initial);
  
    if(btn){
      btn.addEventListener('click', ()=>{
        const mode = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(mode);
      });
    }
  
    // Fallback loader for avatar: try multiple filenames
    (function setAvatar(){
      const el = document.getElementById('avatar');
      if(!el) return;
      const candidates = [
        'assets/profile.jpg',
        'assets/profile.jpeg',
        'assets/profile.png',
        'assets/profile.svg'
      ];
      let i = 0;
      function tryNext(){
        if(i >= candidates.length) return;
        const url = candidates[i++];
        const img = new Image();
        img.onload = ()=>{ el.src = url; };
        img.onerror = tryNext;
        img.src = url;
      }
      tryNext();
    })();
  
    // Footer year
    const y = document.getElementById('year');
    if(y) y.textContent = new Date().getFullYear();
  })();

  // Enhanced scroll reveal animations
  (function(){
    const els = [
      ...document.querySelectorAll('[data-reveal]'),
      ...document.querySelectorAll('.card'),
      ...document.querySelectorAll('.edu-item'),
      ...document.querySelectorAll('.section h2'),
    ];
    const seen = new WeakSet();
    
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting && !seen.has(entry.target)){
          // Add staggered delay for cards in the same section
          const cards = entry.target.closest('.section')?.querySelectorAll('.card');
          if (cards && entry.target.classList.contains('card')) {
            const cardIndex = Array.from(cards).indexOf(entry.target);
            entry.target.style.transitionDelay = `${cardIndex * 0.1}s`;
            
            // Add subtle entrance animation
            entry.target.style.transform = 'translateY(20px)';
            entry.target.style.opacity = '0.8';
            
            // Trigger the animation
            setTimeout(() => {
              entry.target.style.transform = 'translateY(0)';
              entry.target.style.opacity = '1';
            }, 50);
          }
          
          entry.target.classList.add('in');
          seen.add(entry.target);
          
          // Add loading animation for cards
          if (entry.target.classList.contains('card')) {
            entry.target.classList.add('loading');
            setTimeout(() => {
              entry.target.classList.remove('loading');
            }, 600);
          }
        }
      });
    }, { 
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    els.forEach(el => io.observe(el));
  })();

  // Smooth scrolling for navigation links
  (function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if(!targetId || targetId === '#'){
          return;
        }

        const targetElement = document.querySelector(targetId);
        if (!targetElement) {
          return;
        }

        e.preventDefault();
        const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
        const targetPosition = Math.max(targetElement.offsetTop - headerHeight - 20, 0);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const nav = document.getElementById('nav');
        if (nav && nav.classList.contains('open')) {
          toggleMenu();
        }
      });
    });
  })();

  // Enhanced toast notifications
  function showToast(text, type = 'info'){
    let t = document.getElementById('toast');
    if(!t){
      t = document.createElement('div');
      t.id = 'toast';
      document.body.appendChild(t);
    }
    
    t.textContent = text;
    t.className = `toast show ${type}`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      t.classList.remove('show');
    }, 3000);
  }
  
  // Copy to clipboard functionality
  (function(){
    function showCopyToast(text){
      showToast(text, 'success');
    }
    
    document.addEventListener('click', async (e)=>{
      const btn = e.target.closest('.copy-btn');
      if(!btn) return;
      
      const value = btn.getAttribute('data-copy');
      try{
        await navigator.clipboard.writeText(value);
        showCopyToast('Copied to clipboard!');
      }catch{
        showToast('Copy failed', 'error');
      }
    });
  })();
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e)=>{
    // 't' toggles theme
    if(e.key.toLowerCase() === 't'){
      document.getElementById('themeToggle')?.click();
    }
    
    // 'Escape' closes mobile menu
    if(e.key === 'Escape'){
      const nav = document.getElementById('nav');
      if(nav.classList.contains('open')){
        toggleMenu();
      }
    }
    
    // 'Home' goes to top
    if(e.key === 'Home'){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  
  // Performance optimization: Throttle scroll events
  function throttle(func, limit) {
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
  }

  function applyScrollState(){
    if(siteHeader){
      siteHeader.classList.toggle('scrolled', window.scrollY > 100);
    }
    if(backToTopButton){
      backToTopButton.classList.toggle('show', window.scrollY > 400);
    }
  }

  // Apply throttling to scroll events
  const throttledScrollHandler = throttle(applyScrollState, 100);

  window.addEventListener('scroll', throttledScrollHandler, { passive: true });
  applyScrollState();
  
  // Preload critical images
  (function() {
    const criticalImages = [
      'assets/profile.jpg',
      'assets/logo-uwaterloo.png',
      'assets/logo-samsung-research.png'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  })();
  