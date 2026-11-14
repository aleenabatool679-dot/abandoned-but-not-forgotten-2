/* Reference presentation, original catalog content. No mission records are rewritten. */
'use strict';
function renderFeaturedChapters(body) {
  const selected = body === 'Moon'
    ? ['moon-01','moon-02','moon-10','moon-18','moon-03','moon-06']
    : ['mars-04','mars-07','mars-08','mars-09','mars-12','mars-14'];
  const host = document.querySelector('#featured-chapters');
  const icons = window.REFERENCE_ICONS || {};
  host.innerHTML = selected.map((id, index) => {
    const d = Hardware.find(item => item.id === id), visual = icons[id], e = escapeHTML;
    const fields = [['What was its purpose?',d.purpose],['Why was it left behind or retired?',d.why],['What scientific contribution did it make?',d.contribution],['What is its current status?',d.status],['Why does it still matter today?',d.matters]];
    return `<article class="ch in ${e(visual.animation||'')}" id="featured-${id}"><div class="col">${visual.svg ? `<div class="art reference-illustration" role="img" aria-label="Stylized illustration representing ${e(d.name)}">${visual.svg}</div><p class="illustration-note">Stylized illustration · photograph below</p><figure class="chapter-photograph">${imageMarkup(d)}<figcaption>${e(d.displayCaption||d.imageTitle)}<a href="${e(d.imageSource)}" target="_blank" rel="noopener noreferrer">NASA image record ↗</a></figcaption></figure>` : `<div class="art has reference-illustration reference-photo"><div class="ph">${imageMarkup(d)}<span>NASA archive image</span></div></div><p class="illustration-note">${e(d.displayCaption||d.imageTitle)}<br><a href="${e(d.imageSource)}" target="_blank" rel="noopener noreferrer">NASA image record ↗</a></p>`}<div class="story"><div class="row"><button class="pl" type="button" data-tell="${id}" aria-expanded="false" aria-controls="transcript-${id}">▶ Hear its story</button><button class="vo" type="button" aria-pressed="true" aria-label="Voice narration enabled">Voice on</button></div><p class="live" id="transcript-${id}" hidden></p></div></div><div class="card"><div class="num">${body.toUpperCase()} · STORY ${index+1} OF 6</div><h3>${e(d.name)}</h3><p class="q">${e(d.matters)}</p><div class="meta"><span><b>Mission:</b> ${e(d.mission)}</span><span><b>Year:</b> ${e(d.year)}</span></div><dl>${fields.map(([label,value])=>`<div><dt>${label}</dt><dd>${e(value)}</dd></div>`).join('')}<div><dt>Official NASA information source</dt><dd><a href="${e(d.source)}" target="_blank" rel="noopener noreferrer">Read the NASA source ↗</a></dd></div></dl><div class="chapter-actions"><a class="button outline" href="story.html?id=${id}">Read the complete story →</a><button class="button outline" data-save="${id}" aria-pressed="${storage.get().includes(id)}" aria-label="Save ${e(d.name)}">${storage.get().includes(id)?'♥ Story saved':'♡ Save this story'}</button></div></div></article>`;
  }).join('');
  let voice = true, active = null;
  const synthesis = window.speechSynthesis;
  function stop() {
    if (synthesis) synthesis.cancel();
    if (active) {
      active.textContent='▶ Hear its story';active.setAttribute('aria-expanded','false');document.querySelector('#transcript-'+active.dataset.tell).hidden=true;
      active.closest('.ch').classList.remove('on');active=null;
    }
  }
  host.addEventListener('click', event => {
    const voiceButton = event.target.closest('.vo');
    if (voiceButton) {
      voice=!voice;
      host.querySelectorAll('.vo').forEach(button=>{button.textContent=voice?'Voice on':'Voice off';button.setAttribute('aria-pressed',String(voice));button.setAttribute('aria-label',voice?'Voice narration enabled':'Voice narration disabled');});
      if(!voice&&synthesis)synthesis.cancel();
      return;
    }
    const button=event.target.closest('[data-tell]');if(!button)return;
    const wasActive=active===button;stop();if(wasActive)return;
    const d=Hardware.find(item=>item.id===button.dataset.tell);
    const paragraph=document.querySelector('#transcript-'+d.id);
    paragraph.hidden=false;
    paragraph.textContent=[d.name+'.',d.purpose+'.',d.contribution,d.why,d.matters].join(' ');
    button.setAttribute('aria-expanded','true');button.textContent='■ Stop';button.closest('.ch').classList.add('on');active=button;
    if(voice&&synthesis&&window.SpeechSynthesisUtterance){
      const utterance=new window.SpeechSynthesisUtterance(paragraph.textContent);utterance.rate=body==='Moon'?.88:.95;
      utterance.onend=utterance.onerror=()=>{if(active===button){button.textContent='↺ Hear again';button.closest('.ch').classList.remove('on');active=null;}};
      synthesis.speak(utterance);
    } else {button.textContent='Hide story';button.closest('.ch').classList.remove('on');}
  });
  window.addEventListener('pagehide',stop);
}
