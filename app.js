// Theme Toggle
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
function setTheme(theme) {
  if(theme === "light") {
    document.body.classList.add("light");
    themeIcon.textContent = "🌞";
    localStorage.setItem("theme","light");
  } else {
    document.body.classList.remove("light");
    themeIcon.textContent = "🌙";
    localStorage.setItem("theme","dark");
  }
}
themeBtn.addEventListener("click", ()=>{
  setTheme(document.body.classList.contains("light") ? "dark" : "light");
});
if(localStorage.getItem("theme")==="light") setTheme("light");

// SPA navigation
const navLinks = document.querySelectorAll('.nav-link[data-page]');
const sections = document.querySelectorAll('.page-section');
function showSection(id) {
  sections.forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  navLinks.forEach(link => link.classList.remove('active'));
  const nav = document.querySelector(`.nav-link[data-page="${id}"]`);
  if(nav) nav.classList.add('active');
  setTimeout(() => {
    document.getElementById(id).scrollIntoView({behavior: "smooth", block: "start"});
  }, 20);
}
navLinks.forEach(link => {
  link.addEventListener('click', function(e){
    e.preventDefault();
    showSection(this.dataset.page);
    history.pushState(null, '', '#' + this.dataset.page);
  });
});
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#','') || 'home';
  if(document.getElementById(hash)) showSection(hash);
});
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#','') || 'home';
  if(document.getElementById(hash)) showSection(hash);
  document.getElementById("year").textContent = new Date().getFullYear();
  animateSkillBars();
  runParticles();
  // Scroll fade-in
  document.querySelectorAll('.fade-in,.fade-in-delay,.fade-in-delay2,.fade-in-delay3,.fade-in-delay4').forEach(el=>{
    el.style.opacity=0;
  });
  setTimeout(()=>{
    document.querySelectorAll('.fade-in,.fade-in-delay,.fade-in-delay2,.fade-in-delay3,.fade-in-delay4').forEach(el=>{
      el.style.opacity=1;
    });
  }, 200);
});

// Dynamic headline typing
const titles = [
  "Automation Tools",
  "RESTful APIs",
  "Backend Systems",
  "Scalable Apps"
];
let titleIdx = 0, charIdx = 0;
function typeHeadline() {
  const typed = document.getElementById("typed");
  if (!typed) return;
  if (charIdx < titles[titleIdx].length) {
    typed.textContent += titles[titleIdx].charAt(charIdx++);
    setTimeout(typeHeadline, 70);
  } else {
    setTimeout(() => {
      charIdx = 0;
      typed.textContent = "";
      titleIdx = (titleIdx + 1) % titles.length;
      typeHeadline();
    }, 1250);
  }
}
window.addEventListener('DOMContentLoaded', typeHeadline);

// Animated skill bars
function animateSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const percent = parseInt(bar.getAttribute('data-percent'), 10);
    const fill = bar.querySelector('.skill-bar-fill');
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.width = percent + '%';
    }, 350);
  });
}
document.querySelector('.nav-link[data-page="about"]').addEventListener('click', () => {
  setTimeout(animateSkillBars, 290);
});

// Resume Modal
function openResume() {
  document.getElementById('resume-modal').style.display = 'flex';
}
function closeResume() {
  document.getElementById('resume-modal').style.display = 'none';
}
window.onclick = function(event) {
  const modal = document.getElementById('resume-modal');
  if (modal && event.target === modal) modal.style.display = "none";
}

// Contact Form
document.getElementById("contact-form").addEventListener("submit", function(e){
  e.preventDefault();
  const status = document.getElementById("contact-status");
  status.textContent = "Thank you for reaching out!";
  this.reset();
  setTimeout(()=>status.textContent="",2500);
});

// Floating particles for hero
function runParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth, h = canvas.height = window.innerHeight;
  let particles = [];
  for(let i=0;i<48;i++){
    particles.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*2.1+1.2,
      dx: (Math.random()-.5)*.7,
      dy: (Math.random()-.5)*.7,
      c: ['#0fffd7','#16f2b3','#1affac','#00ffe7'][Math.floor(Math.random()*4)]
    });
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(let p of particles){
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
      ctx.fillStyle = p.c;
      ctx.shadowColor = p.c;
      ctx.shadowBlur = 8;
      ctx.globalAlpha = .5;
      ctx.fill();
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      p.x += p.dx; p.y += p.dy;
      if(p.x<0||p.x>w)p.dx*=-1;
      if(p.y<0||p.y>h)p.dy*=-1;
    }
    requestAnimationFrame(draw);
  }
  draw();
  window.onresize = ()=>{w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight;}
}