(() => {
"use strict";
const posFor = (unit, i) => {
  if (unit === 0) return i < 7 ? "Greeting / expression" : i < 19 ? "Noun" : "Expression / sentence";
  if (unit === 1) return i < 22 ? "Noun" : i < 25 ? "Verb (infinitive)" : "Question";
  if (unit === 2) return i < 15 ? "Noun" : i < 23 ? "Verb phrase" : i < 27 ? "Verb (infinitive)" : i === 27 ? "Noun" : "Question / sentence";
  if (unit === 3) return i < 6 ? "Weather expression" : i === 6 ? "Noun" : i < 9 ? "Adjective" : "Noun";
  if (unit === 4) return i < 10 ? "Adjective (colour)" : i < 23 ? "Noun" : i < 28 ? "Adjective" : i < 31 ? "Verb (infinitive)" : "Question";
  if (unit === 5) return i < 8 ? "Noun" : i < 12 ? "Adjective" : i === 12 ? "Noun" : i < 16 ? "Adjective" : i === 16 ? "Noun" : i < 24 ? "Adjective" : i < 26 ? "Noun" : i < 28 ? "Verb phrase" : "Expression";
  if (unit === 6) return i < 11 ? "Verb / verb phrase" : i < 18 ? "Noun (day)" : i < 26 ? "Adverbial expression" : "Adverb";
  if (unit === 7) return i < 23 ? "Noun" : i < 25 ? "Adjective (participle)" : i < 27 ? "Cooking expression" : i < 32 ? "Noun" : "Request";
  if (unit === 8) return i < 13 ? "Noun" : i < 22 ? "Adjective" : i < 29 ? "Prepositional expression" : "Verb form";
  if (unit === 9) return i < 13 ? "Adjective" : i < 18 ? "Noun" : i < 21 ? "Verb (infinitive)" : i < 23 ? "Verb phrase" : i < 25 ? "Verb (infinitive)" : i < 28 ? "Verb phrase" : "Sentence";
  return "Expression";
};
const special = {
  "ser":"The verb 'to be' used for identity, origin, profession and characteristics.",
  "tener":"The verb 'to have'; also used with age and many feelings or states.",
  "llamarse":"A reflexive verb used to give someone's name.",
  "saber":"To know information or know how to perform a skill.",
  "poder":"To have the ability or permission to do something.",
  "hay":"An impersonal form of haber indicating that something exists.",
  "está":"A form of estar used for location or a temporary state.",
  "me gusta":"An expression meaning that one thing or activity pleases the speaker.",
  "me gustan":"An expression used when the things liked are plural.",
  "no me gusta":"A phrase used to say that something is not liked.",
  "llueve":"The present-tense weather verb meaning it is raining.",
  "nieva":"The present-tense weather verb meaning it is snowing.",
  "la nacionalidad":"The country or national identity a person belongs to.",
  "el apellido":"A person's family name, distinct from their given name.",
  "la pronunciación":"The way sounds are made when speaking a word or language.",
  "el clima":"The usual weather conditions of a place over time.",
  "el tiempo":"The weather or the time, depending on the context.",
  "la pareja":"A partner in a romantic relationship, or a pair.",
  "el/la estudiante":"A person studying at school or another learning institution.",
  "el río":"A natural flowing body of water.",
  "el/la periodista":"A person who researches and reports news.",
  "el móvil / el celular":"A portable phone; 'móvil' is common in Spain and 'celular' in Latin America.",
  "casi nunca":"An expression indicating that an action happens very rarely.",
  "por la mañana":"Used to say that something happens during the morning.",
  "a veces":"Used when something happens on some occasions but not always.",
  "¿Qué tal?":"An informal way to greet someone or ask how things are going.",
  "hasta luego":"A farewell meaning you expect to see someone again.",
  "la lengua oficial":"A language given official recognition by a country or institution."
};
function definition(es,en,pos,category) {
  const key=es.toLowerCase().trim();
  if (Object.prototype.hasOwnProperty.call(special,key)) return special[key];
  const gloss=en.replace(/\s*\/\s*/g," or ").replace(/[.!?]+$/,"").trim();
  if (pos.startsWith("Noun")) return "A word naming a person, place, object or idea: "+gloss+".";
  if (pos.startsWith("Adjective")) return "A describing word meaning "+gloss.toLowerCase()+".";
  if (pos.startsWith("Verb (")) return "An action, ability or state expressed as "+gloss.toLowerCase()+".";
  if (pos.startsWith("Verb /")||pos==="Verb phrase") return "An expression for an action or activity: "+gloss.toLowerCase()+".";
  if (pos==="Adverb") return "A word that tells how often or in what way something occurs: "+gloss.toLowerCase()+".";
  if (pos==="Prepositional expression") return "A phrase describing the position or relation of things: "+gloss.toLowerCase()+".";
  if (pos==="Adverbial expression") return "A phrase specifying time or frequency: "+gloss.toLowerCase()+".";
  if (pos==="Verb form") return "A conjugated verb form used to express "+gloss.toLowerCase()+".";
  if (pos==="Weather expression") return "A phrase used to describe the weather: "+gloss.toLowerCase()+".";
  if (pos==="Adjective (participle)"||pos==="Cooking expression") return "A word or expression describing food preparation: "+gloss.toLowerCase()+".";
  if (pos==="Greeting / expression") return "A common greeting or farewell meaning "+gloss.toLowerCase()+".";
  if (pos==="Question") return "A question used to ask: "+gloss+".";
  if (pos==="Request") return "A polite request meaning "+gloss+".";
  return "A useful Spanish phrase or sentence meaning "+gloss+".";
}
// Reading guide uses transparent spelling reminders, not invented IPA transcriptions.
function readingGuide(word) {
  const first=word.split(" / ")[0].replace(/\.\.\./g,"").replace(/[¿?¡!.,]/g,"").trim();
  const clues=[];
  if (/ñ/i.test(first)) clues.push("ñ = 'ny' sound");
  if (/ll/i.test(first)) clues.push("ll ≈ 'y' sound in many dialects");
  if (/j|ge|gi/i.test(first)) clues.push("j / ge / gi = breathy 'h' sound");
  if (/rr/i.test(first)) clues.push("rr = rolled r");
  if (/qu[ei]/i.test(first)) clues.push("qu = k sound (silent u)");
  if (/ch/i.test(first)) clues.push("ch = 'ch' sound");
  if (/[áéíóú]/i.test(first)) clues.push("accent mark shows stress");
  return clues.length ? clues.slice(0,2).join(" · ") : "Listen for Spanish vowel sounds and word stress";
}
function speak(text,status) {
  if (!("speechSynthesis" in window)||!("SpeechSynthesisUtterance" in window)) {
    status.textContent="Speech playback is not available in this browser.";return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text.split(" / ")[0].replace(/\.\.\./g,"algo"));
    utterance.lang="es-ES";
    utterance.rate=0.8;
    const voices=window.speechSynthesis.getVoices();
    utterance.voice=voices.find(v=>/^es(-|$)/i.test(v.lang))||null;
    status.textContent=utterance.voice?"Playing Spanish pronunciation.":"Using your device voice; a Spanish voice may need to be installed.";
    window.speechSynthesis.speak(utterance);
  } catch {status.textContent="Unable to play audio. Check your browser speech settings.";}
}
const make=(tag,cls,text)=>{
  const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;
};
document.querySelectorAll(".vocab-bank-unit").forEach((unitEl)=>{
  const unit=Number(unitEl.id.replace("vocab-unit-",""));
  const rows=[...unitEl.querySelectorAll(".vocab-bank-table tbody tr")];
  if(!rows.length)return;
  const words=rows.map((row,i)=>{
    const es=row.cells[0]?.textContent.trim()||"";
    const en=row.cells[1]?.textContent.trim()||"";
    const category=row.closest("table")?.previousElementSibling?.textContent||"";
    const pos=posFor(unit,i);
    return {es,en,pos,def:definition(es,en,pos,category)};
  });
  const start=make("button","button flash-start","Study flashcards");
  start.type="button";start.setAttribute("aria-expanded","false");
  const panel=make("section","flash-panel");
  panel.hidden=true;
  panel.setAttribute("aria-label","Unit "+unit+" flashcards");
  const toolbar=make("div","flash-toolbar");
  const count=make("p","flash-index");
  const close=make("button","button","Close flashcards");close.type="button";
  toolbar.append(count,close);
  const flip=make("button","flash-stage");flip.type="button";
  flip.setAttribute("aria-label","Flip flashcard to reveal English definition");
  const face=make("div","flash-face");
  flip.appendChild(face);
  const audio=make("button","button flash-audio-btn","🔊 Listen to Spanish");
  audio.type="button";
  const audioStatus=make("p","flash-audio-note","Audio uses a Spanish voice if your device has one.");
  audioStatus.setAttribute("aria-live","polite");
  const controls=make("div","flash-controls");
  const prev=make("button","button","← Previous");prev.type="button";
  const next=make("button","button","Next →");next.type="button";
  const shuffle=make("button","button","Shuffle");shuffle.type="button";
  controls.append(prev,next,shuffle);
  panel.append(toolbar,flip,audio,audioStatus,controls);
  const print=unitEl.querySelector(".vocab-bank-print");
  if(!print)return;
  print.insertAdjacentElement("afterend",start);
  start.insertAdjacentElement("afterend",panel);
  let order=words.map((_,i)=>i),index=0,back=false;
  function render(){
    const item=words[order[index]];
    count.textContent="Unit "+unit+" · Card "+(index+1)+" of "+words.length;
    face.replaceChildren();
    face.appendChild(make("span","flash-label",back?"English · Meaning and grammar":"Español · Pronunciation"));
    if(back){
      face.appendChild(make("strong","flash-meaning",item.en));
      face.appendChild(make("span","flash-pos",item.pos));
      face.appendChild(make("p","flash-def",item.def));
      flip.setAttribute("aria-label","Flip back to Spanish word");
    } else {
      const label=make("strong","flash-word",item.es);label.lang="es";face.appendChild(label);
      face.appendChild(make("span","flash-hint",readingGuide(item.es)));
      face.appendChild(make("span","flash-sound","Tap 🔊 Listen below to hear it in Spanish"));
      flip.setAttribute("aria-label","Flip to reveal English, part of speech and definition");
    }
    prev.disabled=index===0;next.disabled=index===words.length-1;
    audioStatus.textContent="Pronunciation playback is provided by your browser.";
  }
  function stopAudio(){try{window.speechSynthesis?.cancel()}catch{}}
  function open(){panel.hidden=false;start.setAttribute("aria-expanded","true");start.textContent="Hide flashcards";render();flip.focus();}
  function closePanel(){stopAudio();panel.hidden=true;start.setAttribute("aria-expanded","false");start.textContent="Study flashcards";start.focus();}
  start.addEventListener("click",()=>panel.hidden?open():closePanel());
  close.addEventListener("click",closePanel);
  flip.addEventListener("click",()=>{back=!back;render();});
  audio.addEventListener("click",()=>speak(words[order[index]].es,audioStatus));
  prev.addEventListener("click",()=>{if(index>0){index--;back=false;stopAudio();render();flip.focus();}});
  next.addEventListener("click",()=>{if(index<words.length-1){index++;back=false;stopAudio();render();flip.focus();}});
  shuffle.addEventListener("click",()=>{
    const was=order.join(",");
    for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
    if(order.length>1&&order.join(",")===was)order.reverse();
    index=0;back=false;stopAudio();render();flip.focus();
  });
  panel.addEventListener("keydown",e=>{
    if(e.target.closest(".vocab-note"))return;
    if(e.key==="ArrowRight"){e.preventDefault();next.click();}
    if(e.key==="ArrowLeft"){e.preventDefault();prev.click();}
    if(e.key==="Escape"){e.preventDefault();closePanel();}
  });
});
})();
