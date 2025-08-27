// ==== THEME TOGGLE ====
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const isNight = document.body.getAttribute('data-theme') === 'night';
  if (isNight) {
    document.body.removeAttribute('data-theme'); // Day theme (default)
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    document.body.setAttribute('data-theme', 'night'); // Night theme
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
});

// ==== MOBILE NAV TOGGLE ====
const navToggle = document.querySelector('.navbar__toggle');
const navLinks = document.getElementById('navbar-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.navbar__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ==== ACTIVE NAV LINK & SMOOTH SCROLL ====
function scrollSpy() {
  const scrollY = window.scrollY + 90;
  document.querySelectorAll('section').forEach(sec => {
    const top = sec.offsetTop, height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('.navbar__link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
      });
    }
  });
}
window.addEventListener('scroll', scrollSpy);

// ==== TYPEWRITER EFFECT ====
const typewriterRoles = [
  "Python Developer",
  "Fullstack Enthusiast",
  "Automation Fan",
  "Backend Builder"
];
let roleIndex = 0, charIndex = 0, typingForward = true;
const typewriter = document.getElementById('typewriter');
function typeEffect() {
  const text = typewriterRoles[roleIndex];
  if (typingForward) {
    typewriter.textContent = text.slice(0, charIndex++);
    if (charIndex > text.length + 10) typingForward = false;
  } else {
    typewriter.textContent = text.slice(0, --charIndex);
    if (charIndex === 0) {
      typingForward = true;
      roleIndex = (roleIndex + 1) % typewriterRoles.length;
    }
  }
  setTimeout(typeEffect, typingForward ? 90 : 40);
}
typeEffect();

// ==== PARTICLES BACKGROUND ====
const canvas = document.getElementById('hero-particles');
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.querySelector('.hero').offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
let particles = [];
function createParticles() {
  particles = [];
  for(let i=0;i<52;i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1.2 + Math.random()*2.2,
      dx: (Math.random()-.5)*.7,
      dy: (Math.random()-.5)*.7,
      alpha: .2 + Math.random()*0.5
    });
  }
}
function drawParticles() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
    ctx.fillStyle = `rgba(90,141,238,${p.alpha})`;
    ctx.fill();
  }
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const p1 = particles[i], p2 = particles[j];
      const dist = Math.hypot(p1.x-p2.x, p1.y-p2.y);
      if(dist < 85){
        ctx.beginPath();
        ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y);
        ctx.strokeStyle = `rgba(90,141,238,0.07)`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }
    }
  }
}
function animateParticles() {
  for(let p of particles){
    p.x += p.dx; p.y += p.dy;
    if(p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if(p.y < 0 || p.y > canvas.height) p.dy *= -1;
  }
  drawParticles();
  requestAnimationFrame(animateParticles);
}
function startParticles() {
  resizeCanvas();
  createParticles();
  animateParticles();
}
setTimeout(startParticles, 280);

// ==== SKILL BARS ANIMATION ON SCROLL ====
function animateSkills() {
  document.querySelectorAll('.skillbar').forEach(skill => {
    const val = skill.getAttribute('data-percent');
    skill.querySelector('.skillbar__progress').style.width = val + '%';
  });
}
let skillsAnimated = false;
window.addEventListener('scroll', () => {
  const skillsSection = document.getElementById('skills');
  const top = skillsSection.getBoundingClientRect().top;
  if (!skillsAnimated && top < window.innerHeight * 0.86) {
    skillsAnimated = true;
    animateSkills();
  }
});

// ==== RESUME MODAL ====
const resumeBtn = document.getElementById('resume-btn');
const resumeModal = document.getElementById('resume-modal');
const modalClose = resumeModal.querySelector('.modal__close');
resumeBtn.addEventListener('click', () => {
  resumeModal.classList.add('open');
  resumeModal.focus();
});
modalClose.addEventListener('click', () => {
  resumeModal.classList.remove('open');
});
resumeModal.addEventListener('click', e => {
  if (e.target === resumeModal) resumeModal.classList.remove('open');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') resumeModal.classList.remove('open');
});

// ==== CONTACT FORM VALIDATION (JS ONLY) ====
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
form.addEventListener('submit', e => {
  e.preventDefault();
  formStatus.textContent = '';
  let valid = true;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  if (!name) {
    valid = false;
    formStatus.textContent = 'Name is required.';
  } else if (!email.match(/^\S+@\S+\.\S+$/)) {
    valid = false;
    formStatus.textContent = 'Valid email required.';
  } else if (!message || message.length < 10) {
    valid = false;
    formStatus.textContent = 'Message must be at least 10 characters.';
  }
  if (valid) {
    formStatus.textContent = 'Thank you! Your message has been sent (demo only).';
    form.reset();
    setTimeout(() => formStatus.textContent = '', 4000);
  }
});