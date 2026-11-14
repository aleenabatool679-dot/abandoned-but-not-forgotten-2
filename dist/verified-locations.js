/* NASA-source location crosswalk. A mission-site marker is never an individual
   instrument position or a moving rover's current/final coordinate. */
(() => {
  'use strict';
  const evidence=window.LOCATION_EVIDENCE;
  const requestedSite=new URLSearchParams(location.search).get('location');
  const e=escapeHTML;
  function sourceLinks(keys){
    return [...new Set(keys)].map(key=>evidence.sources[key]).filter(Boolean).map(source=>`<a href="${e(source.url)}" target="_blank" rel="noopener noreferrer">${e(source.title)} ↗</a>`).join('');
  }
  function coordinates(site){
    if(site.latitude==null||site.longitudeEast==null)return 'NASA names this location; no numerical coordinate is used here.';
    const lat=`${Math.abs(site.latitude)}° ${site.latitude<0?'S':'N'}`;
    if(site.body==='Mars')return `${lat}, ${Number((((site.longitudeEast+360)%360)).toFixed(6))}° E`;
    const lon=((site.longitudeEast+540)%360)-180;
    return `${lat}, ${Number(Math.abs(lon).toFixed(6))}° ${lon<0?'W':'E'}`;
  }
  function associated(siteId,body){
    return evidence.entries.filter(record=>record.hardwareId.startsWith(body.toLowerCase()+'-')&&record.associations.some(a=>a.siteId===siteId));
  }
  function diagram(body,sites){
    const moon=body==='Moon';let svg;
    if(moon){
      svg='<svg class="verified-site-map" viewBox="0 0 340 340" role="group" aria-label="NASA-sourced Moon site reference map. Use the location selector for crowded markers."><defs><radialGradient id="verified-moon-shade" cx="35%" cy="30%"><stop offset="0" stop-color="#d9dde6"/><stop offset=".6" stop-color="#7d838f"/><stop offset="1" stop-color="#2a2e37"/></radialGradient></defs><circle cx="170" cy="170" r="150" fill="url(#verified-moon-shade)"/><g stroke="#fff3" fill="none"><ellipse cx="170" cy="170" rx="75" ry="150"/><line x1="170" y1="20" x2="170" y2="320"/><line x1="20" y1="170" x2="320" y2="170"/></g>';
    }else{
      svg='<svg class="verified-site-map" viewBox="0 0 680 340" role="group" aria-label="NASA-sourced Mars mission landing-site reference map. Markers are landing references, not current rover positions."><defs><linearGradient id="verified-mars-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a3a1c"/><stop offset=".5" stop-color="#c4602f"/><stop offset="1" stop-color="#6a2a14"/></linearGradient></defs><rect width="680" height="340" rx="14" fill="url(#verified-mars-shade)"/><g stroke="#fff3">';
      for(let lon=0;lon<=360;lon+=60)svg+=`<line x1="${lon/360*680}" y1="0" x2="${lon/360*680}" y2="340"/>`;
      for(let lat=-60;lat<=60;lat+=30)svg+=`<line x1="0" y1="${(90-lat)/180*340}" x2="680" y2="${(90-lat)/180*340}"/>`;
      svg+='</g><line x1="0" y1="170" x2="680" y2="170" stroke="#fff7" stroke-dasharray="3 4"/><g fill="#fff9" font-family="Inter,sans-serif" font-size="9">';
      for(let lon=0;lon<=360;lon+=60)svg+=`<text x="${lon/360*680+(lon===360?-4:3)}" y="335" text-anchor="${lon===360?'end':'start'}">${lon}°E</text>`;
      svg+='</g>';
    }
    sites.filter(site=>site.plot).forEach(site=>{
      let x,y;
      if(moon){const latitude=site.latitude*Math.PI/180,longitude=site.longitudeEast*Math.PI/180;x=170+150*Math.cos(latitude)*Math.sin(longitude);y=170-150*Math.sin(latitude);}
      else{x=((site.longitudeEast+360)%360)/360*680;y=(90-site.latitude)/180*340;}
      svg+=`<g class="site verified-marker" data-site-id="${site.id}" tabindex="0" role="button" aria-pressed="false" aria-label="${e(site.name)}"><title>${e(site.name)} — ${e(site.kind)}</title><circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="9" fill="transparent"/><circle class="dot" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${moon?3:5}"/><text class="selected-site-label" x="${x.toFixed(2)}" y="${Math.max(15,y-12).toFixed(2)}" text-anchor="${x> (moon?250:550)?'end':x<(moon?90:130)?'start':'middle'}">${e(site.name.split(' — ')[0])}</text></g>`;
    });
    return svg+'</svg>';
  }
  function entryMarkup(record,body){
    const item=Hardware.find(d=>d.id===record.hardwareId);
    const links=record.associations.map(association=>{
      const site=evidence.sites.find(s=>s.id===association.siteId);
      return `<li><button type="button" data-select-location="${site.id}">${e(site.name)}</button><span>${e(association.relation)}</span><div class="location-evidence-links">${sourceLinks(association.sourceIds)}</div></li>`;
    }).join('');
    const notes=(record.notes||[]).map(note=>`<p>${e(note)}</p>`).join('');
    return `<details class="location-entry" data-location-entry="${item.id}"><summary><span>${e(item.name)}</span><small>${record.associations.length?record.associations.length+' NASA site association'+(record.associations.length===1?'':'s'):'No confirmed map location'}</small></summary><div class="location-entry-body">${links?'<ul>'+links+'</ul>':''}${notes}<div class="location-evidence-links">${sourceLinks([...(record.additionalSourceIds||[]),...(record.unmappedSourceIds||[])])}</div><a class="location-story-link" href="story.html?id=${item.id}">Read the catalog story →</a></div></details>`;
  }
  window.renderVerifiedLocations=body=>{
    const host=document.querySelector('#'+body.toLowerCase()+'map');
    if(!evidence||!host)return;
    const sites=evidence.sites.filter(site=>site.body===body);
    const records=evidence.entries.filter(record=>record.hardwareId.startsWith(body.toLowerCase()+'-'));
    if(!sites.length){host.remove();return;}
    host.classList.add('verified-locations');
    const root=body.toLowerCase();
    host.innerHTML=`<div class="verified-map-column">${diagram(body,sites)}<p class="mnote">${body==='Moon'?'Near-side site reference diagram.':'Flat landing-site reference diagram; the dashed line is the equator.'} Dots mark NASA-published site references. They do not locate every object at the same point.</p><p class="mnote">${sites.filter(s=>s.plot).length} coordinate markers · ${sites.length} NASA-sourced location records · ${records.length} catalog entries</p></div><div class="verified-location-panel"><h2>Where was it left?</h2><p>Choose a NASA-documented site to see all associated catalog entries.</p><label class="location-picker" for="${root}-location-choice">NASA-documented location<select id="${root}-location-choice">${sites.map(site=>`<option value="${site.id}">${e(site.name)}${site.plot?'':' — no confirmed pin'}</option>`).join('')}</select></label><div id="siteinfo" aria-live="polite"></div></div><div class="location-method"><h3>Location evidence, not live tracking</h3><p>Landing coordinates, final rover locations, experiment deployments and discarded parts are different locations. NASA-published landing coordinates are used only as mission reference points. Unknown, candidate and estimated object locations are not plotted as confirmed points. These are historical reference coordinates from the cited NASA records, not live tracking or a navigation product.</p><a class="location-evidence-download" href="data/locations.json" download>Download the location evidence index ↓</a><div class="location-evidence-links">${sourceLinks(body==='Moon'?['apollo-coordinates','lunar-sites','apollo-inventory']:['mars-coordinates'])}</div></div><details class="location-directory" open><summary>All ${records.length} ${body} catalog entries and their NASA location evidence</summary><label class="location-directory-search">Find a hardware entry<input type="search" id="${root}-location-search" placeholder="Search all ${records.length} entries…" aria-label="Search ${body} location evidence"></label><p class="location-directory-count" role="status" aria-live="polite">${records.length} of ${records.length} catalog entries</p><div class="location-entry-grid">${records.map(record=>entryMarkup(record,body)).join('')}</div><p class="location-no-results" hidden>No matching entry. Try another hardware or mission name.</p></details><details class="location-exclusions"><summary>Locations removed or not plotted</summary>${evidence.exclusions.filter(exclusion=>exclusion.body===body).map(exclusion=>`<article><h4>${e(exclusion.name)}</h4><p>${e(exclusion.reason)}</p><div class="location-evidence-links">${sourceLinks(exclusion.sourceIds)}</div></article>`).join('')}<p>NASA-reported estimates remain in the selector with an explicit warning; they do not receive a coordinate marker. For grouped catalog entries, only the NASA-supported mission associations reviewed here are shown.</p></details>`;
    const select=host.querySelector('#'+root+'-location-choice');
    function pick(id){
      const site=sites.find(s=>s.id===id);if(!site)return;
      select.value=id;
      host.querySelectorAll('.verified-marker').forEach(marker=>{const selected=marker.dataset.siteId===id;marker.classList.toggle('on',selected);marker.setAttribute('aria-pressed',String(selected));});
      const matches=associated(id,body);
      host.querySelector('#siteinfo').innerHTML=`<h3>${e(site.name)}</h3><p class="location-kind">${e(site.kind)} · ${e(site.precision)}</p><p class="location-coordinate">${e(coordinates(site))}${site.plot?'':' — no marker'}</p><p class="location-scope-note">${e(site.note)}</p><p class="location-list-heading">${matches.length} associated catalog entr${matches.length===1?'y':'ies'}</p><ul class="location-items">${matches.map(record=>{
        const item=Hardware.find(d=>d.id===record.hardwareId);const association=record.associations.find(a=>a.siteId===id);
        return `<li><a href="story.html?id=${item.id}">${e(item.name)} →</a><span>${e(association.relation)}</span><details><summary>NASA hardware evidence</summary><div class="location-evidence-links">${sourceLinks(association.sourceIds)}</div></details></li>`;
      }).join('')}</ul><div class="location-evidence-links location-coordinate-sources">${sourceLinks(site.sourceIds)}</div>`;
    }
    select.addEventListener('change',()=>pick(select.value));
    host.querySelectorAll('.verified-marker').forEach(marker=>{
      marker.addEventListener('click',()=>pick(marker.dataset.siteId));
      marker.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();pick(marker.dataset.siteId);}});
    });
    host.addEventListener('click',event=>{
      const button=event.target.closest('[data-select-location]');if(!button)return;
      pick(button.dataset.selectLocation);select.focus();
    });
    const search=host.querySelector('#'+root+'-location-search');
    search.addEventListener('input',()=>{
      const query=search.value.trim().toLowerCase();let count=0;
      host.querySelectorAll('.location-entry').forEach(row=>{const item=Hardware.find(d=>d.id===row.dataset.locationEntry);const match=[item.name,item.mission,item.category].join(' ').toLowerCase().includes(query);row.hidden=!match;if(match)count++;});
      host.querySelector('.location-directory-count').textContent=`${count} of ${records.length} catalog entries`;
      host.querySelector('.location-no-results').hidden=count>0;
    });
    pick(sites.some(site=>site.id===requestedSite)?requestedSite:sites[0].id);
  };
  window.renderStoryLocationEvidence=hardwareId=>{
    if(!evidence)return;
    const record=evidence.entries.find(row=>row.hardwareId===hardwareId);if(!record)return;
    const passport=document.querySelector('.story-passport');if(!passport)return;
    const field=[...passport.querySelectorAll('dl>div')].find(div=>div.querySelector('dt')?.textContent==='Where is it?');
    if(field){
      field.querySelector('dt').textContent='NASA-supported location evidence';
      const grouped=record.associations.map(association=>{
        const site=evidence.sites.find(s=>s.id===association.siteId);
        return `<li><a href="${site.body.toLowerCase()}.html?location=${site.id}#${site.body.toLowerCase()}map">${e(site.name)}</a><small>${e(association.relation)}</small></li>`;
      }).join('');
      field.querySelector('dd').innerHTML=grouped?`<ul class="story-location-list">${grouped}</ul><small>Site associations are NASA-supported. Landing references are not current rover positions or individual instrument coordinates.</small>`:'No confirmed object location is mapped. NASA describes possible heat-shield fragments, rather than a confirmed individual location.';
    }
    const section=document.createElement('details');section.className='story-location-evidence';
    const keys=[...record.associations.flatMap(a=>a.sourceIds),...record.associations.flatMap(a=>evidence.sites.find(site=>site.id===a.siteId).sourceIds),...(record.additionalSourceIds||[]),...(record.unmappedSourceIds||[])];
    section.innerHTML=`<summary>NASA location sources & clarifications</summary>${(record.notes||[]).map(note=>'<p>'+e(note)+'</p>').join('')}<div class="location-evidence-links">${sourceLinks(keys)}</div>`;
    passport.append(section);
  };
})();
