"use strict";
/* Ak's Language Lab — offline-first dictionary, phrase lookup, speech and grammar UI. */
(function () {
  const Core=window.LabCore, content=window.LanguageLabContent;
  if (!Core || !content) throw Error("Language Lab learning data was not loaded.");
  const $=id=>document.getElementById(id);
  const make=(tag,txt,cls)=>{
    const e=document.createElement(tag);
    if(txt!==undefined)e.textContent=txt;
    if(cls)e.className=cls;
    return e;
  };
  const button=(label,fn,cls="")=>{
    const b=make("button",label,cls);
    b.type="button";b.addEventListener("click",fn);
    return b;
  };
  let entries=Core.buildIndex({entries:[]},content);
  let dataLoaded=false,query="hola",direction="es-en",shown=0,filterSaved=false;
  const PAGE=14;
  const FAV_KEY="ak-language-lab-favourites-v1";
  let favourites=new Set(),speechVoices=[],lastSpanish="";
  try{
    const value=JSON.parse(localStorage.getItem(FAV_KEY)||"[]");
    if(Array.isArray(value))favourites=new Set(value.filter(x=>typeof x==="string").slice(0,500));
  }catch(_){}
  const saveFavourites=()=>{
    try{localStorage.setItem(FAV_KEY,JSON.stringify([...favourites].slice(-500)))}catch(_){}
  };

  // Accessible tab switching; all content is already locally available after loading.
  const tabs=[...document.querySelectorAll("[data-lab-tab]")];
  const panelNames=["dictionary","translate","pronounce","grammar"];
  function activateTab(name,focus=false){
    if(!panelNames.includes(name))return;
    tabs.forEach(t=>{
      const yes=t.dataset.labTab===name;
      t.setAttribute("aria-selected",yes?"true":"false");t.tabIndex=yes?0:-1;
      if(yes&&focus)t.focus();
    });
    panelNames.forEach(k=>{$("panel-"+k).hidden=k!==name});
    const url=new URL(location.href);
    url.searchParams.set("tab",name);
    history.replaceState(null,"",url);
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener("click",()=>activateTab(tab.dataset.labTab));
    tab.addEventListener("keydown",event=>{
      if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
      event.preventDefault();
      const next=event.key==="Home"?0:event.key==="End"?tabs.length-1:
        (i+(event.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;
      activateTab(tabs[next].dataset.labTab,true);
    });
  });
  const initial=new URLSearchParams(location.search);
  if(panelNames.includes(initial.get("tab")))activateTab(initial.get("tab"));

  function speak(text,statusElement){
    const msg=statusElement||$("lab-voice-status");
    if(!text||!text.trim())return;
    if(!("speechSynthesis" in window)||typeof SpeechSynthesisUtterance==="undefined"){
      if(msg)msg.textContent="Speech synthesis is not supported in this browser.";return;
    }
    const voiceSelect=$("lab-voice"),voice=speechVoices[Number(voiceSelect.value)];
    const utterance=new SpeechSynthesisUtterance(text.slice(0,280));
    utterance.lang=voice?.lang||"es-ES";
    utterance.rate=Number($("lab-speech-rate").value)||0.85;
    if(voice)utterance.voice=voice;
    utterance.onerror=()=>{
      if(msg)msg.textContent="Audio could not play. Check your browser's installed Spanish voices.";
    };
    utterance.onstart=()=>{
      if(msg)msg.textContent="Playing Spanish pronunciation ("+(voice?.name||"browser default voice")+").";
    };
    try{window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance)}
    catch(_){if(msg)msg.textContent="This browser blocked speech playback."}
  }
  function loadVoices(){
    if(!("speechSynthesis" in window)){ $("lab-voice-status").textContent="Browser speech is unavailable.";return }
    speechVoices=window.speechSynthesis.getVoices().filter(v=>/^es(?:-|_)/i.test(v.lang));
    const select=$("lab-voice"),previous=select.selectedOptions[0]?.textContent;
    select.replaceChildren();
    if(!speechVoices.length){
      const opt=make("option","No Spanish voice installed — browser fallback");
      opt.value="-1";select.append(opt);
      $("lab-voice-status").textContent="No installed Spanish voice was detected. Playback may use a device fallback or be unavailable.";
    } else {
      speechVoices.forEach((v,i)=>{
        const opt=make("option",v.name+" ("+v.lang+")"+(v.localService?" · device":""));
        opt.value=String(i);select.append(opt);
      });
      const preferred=speechVoices.findIndex(v=>v.name+" ("+v.lang+")"+(v.localService?" · device":"")===previous);
      if(preferred>=0)select.value=String(preferred);
      $("lab-voice-status").textContent=speechVoices.length+" Spanish browser voice(s) available. Voice quality varies by device.";
    }
  }
  if("speechSynthesis" in window){
    loadVoices();window.speechSynthesis.addEventListener?.("voiceschanged",loadVoices);
  }else loadVoices();
  $("lab-speech-rate").addEventListener("input",e=>{
    $("lab-speech-rate-value").textContent=Number(e.target.value).toFixed(2)+"×";
  });
  $("lab-speak").addEventListener("click",()=>speak($("lab-speech-text").value));
  $("lab-stop-speech").addEventListener("click",()=>{
    if("speechSynthesis" in window)window.speechSynthesis.cancel();
    $("lab-voice-status").textContent="Playback stopped.";
  });

  function wordCard(e){
    const card=make("article",undefined,"lab-word-card");
    const head=make("div",undefined,"lab-word-head");
    const info=make("div");
    const word=make("h3",e.es,"lab-word");
    word.lang="es";
    info.append(word);
    const meta=make("div",undefined,"lab-word-meta");
    const tags=[e.source==="Classroom"?"Classroom-reviewed":"FreeDict source"];
    if(e.pos)tags.push(e.pos);
    if(e.gender)tags.push(e.gender==="m"?"masculine":e.gender==="f"?"feminine":e.gender==="common"?"common gender":e.gender);
    if(e.level)tags.push(e.level);
    for(const tag of tags)meta.append(make("span",tag));
    info.append(meta);
    const actions=make("div",undefined,"lab-word-actions");
    const play=button("♫ Listen",()=>speak(e.es),"lab-mini-action");
    play.setAttribute("aria-label","Listen to "+e.es+" in Spanish");
    const favorite=button(favourites.has(Core.exact(e.es))?"★ Saved":"☆ Save",()=> {
      const key=Core.exact(e.es);
      if(favourites.has(key))favourites.delete(key);
      else favourites.add(key);
      saveFavourites();
      favorite.textContent=favourites.has(key)?"★ Saved":"☆ Save";
      favorite.setAttribute("aria-pressed",String(favourites.has(key)));
      if(filterSaved)runSearch(true);
    },"lab-mini-action");
    favorite.setAttribute("aria-pressed",String(favourites.has(Core.exact(e.es))));
    actions.append(play,favorite);head.append(info,actions);
    card.append(head,make("p",e.en.join(" · "),"lab-word-meaning"));
    if(e.example){
      const example=make("div",undefined,"lab-word-example");
      example.append(make("strong","EXAMPLE"),make("p",e.example));
      if(e.exampleEn)example.append(make("small",e.exampleEn));
      card.append(example);
    }
    return card;
  }
  function runSearch(reset=false){
    if(reset)shown=0;
    query=$("lab-search-input").value.trim();
    direction=$("lab-direction").value;
    filterSaved=$("lab-filter-favourites").checked;
    const host=$("lab-dictionary-results");
    if(!query){
      $("lab-result-status").textContent="Enter a word to search.";
      host.replaceChildren(make("p","Search words such as casa, hola, tener, or música.","lab-empty"));
      $("lab-more").hidden=true;return;
    }
    const candidate=filterSaved?entries.filter(e=>favourites.has(Core.exact(e.es))):entries;
    const data=Core.search(candidate,query,direction,PAGE,shown);
    if(reset)host.replaceChildren();
    for(const e of data.results)host.append(wordCard(e));
    shown+=data.results.length;
    const total=data.total;
    $("lab-result-status").textContent=dataLoaded?
      total+" result"+(total===1?"":"s")+" · "+shown+" shown":
      "Showing classroom vocabulary while the full dictionary loads.";
    $("lab-more").hidden=shown>=total;
    if(!total)host.replaceChildren(make("p","No matching words found. Try a different form or switch Spanish / English.","lab-empty"));
  }
  $("lab-search-form").addEventListener("submit",e=>{e.preventDefault();runSearch(true)});
  $("lab-more").addEventListener("click",()=>runSearch(false));
  $("lab-direction").addEventListener("change",()=>runSearch(true));
  $("lab-filter-favourites").addEventListener("change",()=>runSearch(true));
  document.querySelectorAll("[data-quickword]").forEach(b=>b.addEventListener("click",()=>{
    $("lab-direction").value="es-en";$("lab-search-input").value=b.dataset.quickword;runSearch(true);
  }));
  async function loadDictionary(){
    try{
      const response=await fetch("language-lab-dictionary.json");
      if(!response.ok)throw Error("HTTP "+response.status);
      const payload=await response.json();
      if(!Array.isArray(payload.entries)||payload.entries.length<4000)throw Error("Dictionary dataset incomplete");
      entries=Core.buildIndex(payload,content);dataLoaded=true;
      $("lab-dictionary-count").textContent=payload.headwords.toLocaleString("en-US")+"+";
      runSearch(true);
    }catch(error){
      dataLoaded=false;
      runSearch(true);
      $("lab-result-status").textContent="FreeDict data unavailable. Classroom-reviewed terms are still searchable.";
    }
  }
  runSearch(true);loadDictionary();

  // Phrase lookup intentionally does not invent full sentence translations.
  const form=$("lab-translation-form"),tx=$("lab-translation-input"),txDir=$("lab-translation-direction");
  function renderTranslation(){
    const output=$("lab-translation-output");
    const result=Core.translate(tx.value,txDir.value,content.phrases,entries);
    output.replaceChildren();
    if(result.status==="empty") {output.append(make("span","Enter a word or a common phrase first.","lab-muted"));return}
    if(result.status==="phrase") {
      output.append(make("strong","CURATED PHRASE"),make("p",result.value));
      output.append(make("div","Classroom phrase translation · not automatic machine translation","lab-result-note"));
      lastSpanish=txDir.value==="es-en"?tx.value:result.value;
    } else if(result.status==="word"){
      output.append(make("strong","DICTIONARY WORD MATCH"),make("p",result.options.join(" · ")));
      output.append(make("div","Possible word meanings only. Context may change the best translation.","lab-result-note"));
      lastSpanish=txDir.value==="es-en"?tx.value:result.options[0];
    } else {
      output.append(make("strong","NO VERIFIED TRANSLATION AVAILABLE"));
      output.append(make("p","This text is beyond the site's local word and phrase collection."));
      output.append(make("div","Try an individual word or one of the suggested phrases. Full-sentence machine translation is not connected.","lab-result-note"));
      lastSpanish="";
    }
  }
  form.addEventListener("submit",e=>{e.preventDefault();renderTranslation()});
  $("lab-swap").addEventListener("click",()=>{
    txDir.value=txDir.value==="es-en"?"en-es":"es-en";
    tx.value="";lastSpanish="";$("lab-translation-output").replaceChildren(make("span","Direction changed. Type a word or phrase.","lab-muted"));
  });
  $("lab-translate-speak").addEventListener("click",()=>{
    if(lastSpanish) speak(lastSpanish,$("lab-translation-speech-status"));
    else if(txDir.value==="es-en")speak(tx.value,$("lab-translation-speech-status"));
    else $("lab-translation-speech-status").textContent="Translate a supported expression before listening.";
  });
  for(const phrase of content.phrases.slice(0,10)){
    $("lab-phrase-chips").append(button(phrase.es,()=>{
      txDir.value="es-en";tx.value=phrase.es;renderTranslation();
    }));
  }

  // Original phoneme guide; voice playback is generated on demand.
  for(const ph of content.phones){
    const card=make("article",undefined,"lab-phoneme");
    const head=make("div",undefined,"lab-phoneme-head");
    const symbols=make("div");
    symbols.append(make("span",ph.ipa,"lab-phoneme-symbol"),make("div",ph.group,"lab-phoneme-group"));
    head.append(symbols,button("♫ "+ph.word,()=>speak(ph.word),"lab-mini-action"));
    card.append(head,make("p",ph.note),make("em",ph.practice));
    $("lab-phoneme-grid").append(card);
  }

  // Verified conjugations and self-contained grammar tips.
  function showConjugation(){
    const r=Core.conjugate($("lab-verb").value,$("lab-tense").value);
    const area=$("lab-conjugation-result");area.replaceChildren();
    if(r.status!=="ok") {area.append(make("p",r.message,"lab-empty"));return}
    const table=make("table",undefined,"lab-conjugation-table");
    const heading=make("thead"),headrow=make("tr");
    for(const title of ["Pronoun","Conjugation"]){const th=make("th",title);th.scope="col";headrow.append(th)}
    heading.append(headrow);table.append(heading);
    const body=make("tbody");
    r.subjects.forEach((p,i)=>{const tr=make("tr");tr.append(make("td",p),make("td",r.forms[i]));body.append(tr)});
    table.append(body);area.append(table);
  }
  $("lab-conjugate-form").addEventListener("submit",e=>{e.preventDefault();showConjugation()});
  showConjugation();
  for(const guide of content.grammars){
    const details=make("details",undefined,"lab-grammar-card");
    const summary=make("summary");
    summary.append(make("strong",guide.title),make("span",guide.level+" +"));
    const body=make("div",undefined,"lab-grammar-body");
    body.append(make("p",guide.rule));
    const list=make("ul");
    guide.examples.forEach(ex=>list.append(make("li",ex)));
    body.append(list,make("p","WATCH OUT: "+guide.pitfall,"lab-pitfall"));
    details.append(summary,body);$("lab-grammar-guides").append(details);
  }
})();
