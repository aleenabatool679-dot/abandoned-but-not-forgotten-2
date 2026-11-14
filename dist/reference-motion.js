/* Lightweight enhancement for the reference's CSS animations and story reveals. */
(() => {
  'use strict';
  const media=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
  const toggle=document.querySelector('#motion-toggle');
  let paused=false,reduced=media.matches,queued=false;
  try{paused=localStorage.getItem('atl-motion-paused')==='true';}catch{}
  const observer=window.IntersectionObserver?new window.IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});
  },{threshold:.04}):null;
  function observe(){
    if(!observer||paused||reduced)return;
    document.querySelectorAll('.section-heading,.hardware-card,.ch,.timeline-item,.story-narrative,.story-figure').forEach(el=>{
      if(el.dataset.revealObserved)return;el.dataset.revealObserved='true';
      el.classList.add('reveal');
      if(el.getBoundingClientRect().top>window.innerHeight)el.classList.add('reveal-pending');
      observer.observe(el);
    });
  }
  function update(){
    queued=false;
    const y=window.scrollY||0,height=document.documentElement.scrollHeight-window.innerHeight;
    const value=height>0?Math.min(100,Math.max(0,Math.round(y/height*100))):0;
    document.documentElement.style.setProperty('--reading-progress',String(value/100));
    document.querySelector('.reading-progress').setAttribute('aria-valuenow',String(value));
    document.querySelector('#reading-percent').textContent=String(value).padStart(2,'0');
  }
  function motion(){
    const stopped=paused||reduced;
    document.documentElement.classList.toggle('motion-paused',stopped);
    toggle.setAttribute('aria-pressed',String(stopped));toggle.disabled=reduced;
    toggle.querySelector('.motion-label').textContent=reduced?'Reduced motion':paused?'Resume motion':'Pause motion';
    toggle.querySelector('.motion-symbol').textContent=stopped?'▷':'Ⅱ';
    toggle.title=reduced?'Your system requests reduced motion':paused?'Resume decorative motion':'Pause decorative motion';
    if(stopped)document.querySelectorAll('.reveal-pending').forEach(el=>{el.classList.remove('reveal-pending');el.classList.add('is-visible');});
  }
  toggle.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('atl-motion-paused',String(paused));}catch{}motion();});
  media.addEventListener?.('change',event=>{reduced=event.matches;motion();});
  document.addEventListener('archive:rendered',observe);
  window.addEventListener('scroll',()=>{if(!queued&&window.requestAnimationFrame){queued=true;window.requestAnimationFrame(update);}},{passive:true});
  window.addEventListener('resize',update,{passive:true});
  observe();update();motion();
})();
