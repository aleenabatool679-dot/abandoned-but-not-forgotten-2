'use strict';
// Questions use the existing hardware catalog; no mission data is changed.
const MCQ_SETS = {
  Moon: [
    {id:'moon-q01',story:'moon-01',question:'What was the Lunar Module descent stage used for?',options:['Landing astronauts on the Moon','Studying Jupiter’s clouds','Measuring weather on Earth'],answer:0,explanation:'The descent stage helped the Lunar Module land and stayed on the Moon when the astronauts left.'},
    {id:'moon-q02',story:'moon-02',question:'How did the Lunar Roving Vehicle move across the Moon?',options:['With wings','On wheels','By swimming'],answer:1,explanation:'The electric lunar rover used wheels to carry astronauts across the surface.'},
    {id:'moon-q03',story:'moon-03',question:'What was the Modular Equipment Transporter, or MET?',options:['A space telescope','A flying robot','A handcart for tools and samples'],answer:2,explanation:'Apollo 14 astronauts used the two-wheeled MET handcart to carry tools and samples.'},
    {id:'moon-q04',story:'moon-10',question:'What did the Passive Seismic Experiment listen for?',options:['Moonquakes and impacts','Radio music','Ocean waves'],answer:0,explanation:'It recorded vibrations from moonquakes and impacts to help scientists study inside the Moon.'},
    {id:'moon-q05',story:'moon-18',question:'What does a lunar laser retroreflector do?',options:['Makes oxygen','Reflects laser light back toward Earth','Takes color photographs'],answer:1,explanation:'Its special mirrors reflect laser pulses. Timing the return helps scientists measure the Earth–Moon distance.'},
    {id:'moon-q06',story:'moon-16',question:'What was the Heat Flow Experiment designed to measure?',options:['The speed of a rover','The weight of an astronaut','Heat escaping through lunar soil'],answer:2,explanation:'Temperature measurements below the surface helped scientists investigate heat flowing out of the Moon.'},
    {id:'moon-q07',story:'moon-24',question:'Why did astronauts take geological tools to the Moon?',options:['To collect rocks and soil','To build ocean boats','To repair Earth’s weather satellites'],answer:0,explanation:'Tools such as scoops, tongs and hammers helped astronauts collect lunar samples for study.'},
    {id:'moon-q08',story:'moon-12',question:'What did the Lunar Surface Magnetometer measure?',options:['The size of astronauts’ footprints','Magnetic fields','The number of stars in the sky'],answer:1,explanation:'A magnetometer measures magnetic fields. These measurements helped scientists study the lunar environment.'},
    {id:'moon-q09',story:'moon-20',question:'Which kind of light did Apollo 16’s ultraviolet camera study?',options:['Sound waves','Ocean waves','Ultraviolet light'],answer:2,explanation:'The camera/spectrograph observed Earth and astronomical targets in ultraviolet light.'},
    {id:'moon-q10',story:'moon-06',question:'Why were the robotic Surveyor landers useful before Apollo?',options:['They photographed the Moon and studied its soil','They carried astronauts back to Earth','They explored the oceans of Mars'],answer:0,explanation:'Surveyor missions studied the lunar surface and helped prepare for astronaut landings.'}
  ],
  Mars: [
    {id:'mars-q01',story:'mars-07',question:'Which mission brought the small Sojourner rover to Mars?',options:['Apollo 11','Mars Pathfinder','Voyager 1'],answer:1,explanation:'Sojourner arrived with Mars Pathfinder in 1997 and examined nearby rocks and soil.'},
    {id:'mars-q02',story:'mars-08',question:'What were Spirit and Opportunity looking for clues about?',options:['Ancient water on Mars','Living trees','Earth’s oceans'],answer:0,explanation:'These rover geologists studied rocks and soil for evidence that water once affected Mars.'},
    {id:'mars-q03',story:'mars-10',question:'What did the Phoenix lander study in the Martian arctic?',options:['Jupiter’s rings','Earth’s clouds','Water ice and soil'],answer:2,explanation:'Phoenix investigated water ice and the chemistry of soil in Mars’ northern region.'},
    {id:'mars-q04',story:'mars-11',question:'Which crater is Curiosity exploring?',options:['Jezero Crater','Gale Crater','A crater on the Moon'],answer:1,explanation:'Curiosity studies the geology and past habitability of Gale Crater on Mars.'},
    {id:'mars-q05',story:'mars-12',question:'What did InSight help scientists study?',options:['The inside of Mars','Saturn’s rings','The inside of the Sun'],answer:0,explanation:'InSight listened for marsquakes and used other measurements to study Mars’ interior.'},
    {id:'mars-q06',story:'mars-14',question:'What kind of machine was Ingenuity?',options:['A submarine','A wheeled lunar cart','A helicopter'],answer:2,explanation:'Ingenuity demonstrated powered, controlled helicopter flight on Mars.'},
    {id:'mars-q07',story:'mars-13',question:'Which crater did Perseverance land in?',options:['Gale Crater','Jezero Crater','A crater on Venus'],answer:1,explanation:'Perseverance landed in Jezero Crater to study its rocks and collect samples.'},
    {id:'mars-q08',story:'mars-39',question:'What did the MOXIE experiment make from Martian air?',options:['Oxygen','Chocolate','Liquid oceans'],answer:0,explanation:'MOXIE demonstrated making oxygen from carbon dioxide in Mars’ atmosphere.'},
    {id:'mars-q09',story:'mars-22',question:'What was Pancam used for on Spirit and Opportunity?',options:['Making rocket fuel','Digging deep tunnels','Taking panoramic images'],answer:2,explanation:'Pancam took panoramic views that helped scientists examine terrain and rocks.'},
    {id:'mars-q10',story:'mars-24',question:'Why did the Rock Abrasion Tool grind rock surfaces?',options:['To turn rocks into batteries','To expose fresh material for study','To build a road to Earth'],answer:1,explanation:'Grinding away an outer coating let rover instruments examine fresher rock underneath.'}
  ]
};
const mcqAnswers={Moon:{},Mars:{}};
let mcqWorld='Moon';
const mcqQuestions=document.querySelector('#mcq-questions');
function updateMcqScore(){
  const set=MCQ_SETS[mcqWorld],answers=mcqAnswers[mcqWorld];
  const answered=set.filter(q=>Object.hasOwn(answers,q.id)).length;
  const correct=set.filter(q=>answers[q.id]===q.answer).length;
  document.querySelector('#mcq-score').textContent=`${answered} of 10 answered · ${correct} correct`;
  const progress=document.querySelector('.mcq-progress');progress.setAttribute('aria-valuenow',String(answered));progress.style.setProperty('--quiz-progress',String(answered/10));
  const complete=document.querySelector('#quiz-complete');complete.hidden=answered!==10;
  complete.textContent=answered===10?`You finished the ${mcqWorld} questions! ${correct} out of 10 correct. ${correct===10?'Wonderful exploring!':'Read the explanations and try any answer again.'}`:'';
}
function updateMcqQuestion(q){
  const field=document.querySelector('#'+q.id),choice=mcqAnswers[mcqWorld][q.id];
  const answered=Number.isInteger(choice),correct=choice===q.answer;
  field.querySelectorAll('label').forEach((label,index)=>{
    label.classList.toggle('answer-correct',answered&&index===q.answer);
    label.classList.toggle('answer-incorrect',answered&&index===choice&&!correct);
  });
  const feedback=field.querySelector('.mcq-feedback');feedback.hidden=!answered;
  if(!answered){feedback.textContent='';return;}
  const record=Hardware.find(item=>item.id===q.story);
  feedback.innerHTML=`<strong>${correct?'Correct!':'Not quite. The answer is: '+escapeHTML(q.options[q.answer])+'.'}</strong><p>${escapeHTML(q.explanation)}</p><div class="mcq-evidence"><a href="story.html?id=${q.story}">Read the hardware story →</a><a href="${escapeHTML(record.source)}" target="_blank" rel="noopener noreferrer">NASA reference ↗</a></div>`;
}
function renderMcqs(world){
  mcqWorld=world;
  document.body.classList.toggle('mars-questions',world==='Mars');
  document.querySelectorAll('[data-quiz-world]').forEach(tab=>{const selected=tab.dataset.quizWorld===world;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
  document.querySelector('#quiz-panel').setAttribute('aria-labelledby',world.toLowerCase()+'-quiz-tab');
  document.querySelector('#quiz-set-label').textContent=`${world==='Moon'?'THE MOON':'MARS'} · 10 EASY QUESTIONS`;
  document.querySelector('#restart-quiz').textContent=`Restart ${world} questions ↺`;
  document.querySelector('#switch-quiz').textContent=`Try the ${world==='Moon'?'Mars':'Moon'} questions →`;
  mcqQuestions.innerHTML=MCQ_SETS[world].map((q,index)=>`<fieldset class="mcq-card" id="${q.id}"><legend><span class="mcq-number">${String(index+1).padStart(2,'0')} / 10</span><span>${escapeHTML(q.question)}</span></legend><div class="mcq-options">${q.options.map((option,i)=>`<label for="${q.id}-choice-${i}"><input type="radio" id="${q.id}-choice-${i}" name="${q.id}" value="${i}" aria-describedby="${q.id}-feedback" ${mcqAnswers[world][q.id]===i?'checked':''}><span class="option-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${escapeHTML(option)}</span></label>`).join('')}</div><div class="mcq-feedback" id="${q.id}-feedback" role="status" hidden></div></fieldset>`).join('');
  MCQ_SETS[world].forEach(updateMcqQuestion);updateMcqScore();
}
mcqQuestions.addEventListener('change',event=>{
  const input=event.target.closest('input[type=radio]');if(!input)return;
  const q=MCQ_SETS[mcqWorld].find(item=>item.id===input.name);if(!q)return;
  mcqAnswers[mcqWorld][q.id]=Number(input.value);updateMcqQuestion(q);updateMcqScore();
});
document.querySelectorAll('[data-quiz-world]').forEach(tab=>{
  tab.addEventListener('click',()=>renderMcqs(tab.dataset.quizWorld));
  tab.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const world=event.key==='Home'?'Moon':event.key==='End'?'Mars':mcqWorld==='Moon'?'Mars':'Moon';
    renderMcqs(world);document.querySelector(`[data-quiz-world="${world}"]`).focus();
  });
});
document.querySelector('#restart-quiz').addEventListener('click',()=>{mcqAnswers[mcqWorld]={};renderMcqs(mcqWorld);});
document.querySelector('#switch-quiz').addEventListener('click',()=>{renderMcqs(mcqWorld==='Moon'?'Mars':'Moon');document.querySelector(`[data-quiz-world="${mcqWorld}"]`).focus();});
renderMcqs('Moon');
