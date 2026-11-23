"use strict";
/* Mixed-topic arcade challenge, A1 → A1+ → A2. Original questions, no backend. */
(function(){
  const $=id=>document.getElementById(id);
  const items=[
    // Level 1: familiar words, regular verbs, articles and short expressions.
    [1,"choice","Which word means 'goodbye'?","adiós",["hola","adiós","gracias","por favor"],"Adiós is a goodbye."],
    [1,"choice","Choose the Spanish word for 'teacher'.","profesor",["profesor","estudiante","médico","abogado"],"Profesor means teacher."],
    [1,"choice","Which form agrees with 'yo' + hablar?","hablo",["hablas","hablan","hablo","hablamos"],"Yo hablo is the first-person singular."],
    [1,"choice","Complete: Ella ___ en China.","vive",["vivimos","vivo","viven","vive"],"Ella vive uses third-person singular."],
    [1,"choice","Which article completes: ___ libros?","los",["el","los","la","las"],"Libros is masculine plural."],
    [1,"choice","Which article completes: ___ manzana?","la",["las","el","los","la"],"Manzana is feminine singular."],
    [1,"choice","Choose the Spanish word for 'Wednesday'.","miércoles",["martes","miércoles","jueves","sábado"],"Miércoles is Wednesday."],
    [1,"choice","Choose the correct phrase for 'It is hot'.","Hace calor.",["Hace frío.","Hace calor.","Hay calor.","Estoy calor."],"Hace calor is the standard weather expression."],
    [1,"choice","Which phrase means 'I am a student'?","Soy estudiante.",["Estoy estudiante.","Soy estudiante.","Es estudiante.","Tengo estudiante."],"Ser identifies a profession or role."],
    [1,"choice","Which word means 'sister'?","hermana",["hermana","hermano","abuela","madre"],"Hermana is sister."],
    [1,"type","Conjugate: nosotros + comer (present tense)","comemos",null,"The -er ending for nosotros is -emos."],
    [1,"type","Write the Spanish word for 'book'.","libro",null,"Libro means book."],
    [1,"type","Complete the phrase: Me ___ Ana. (introducing yourself)","llamo",null,"Me llamo introduces your name."],
    [1,"type","Conjugate: tú + vivir (present tense)","vives",null,"Tú vives is second-person singular."],
    [1,"type","Complete: Mi madre ___ profesora. (ser)","es",null,"Es is the third-person singular of ser."],
    [1,"type","Conjugate: yo + ser (present tense)","soy",null,"Yo soy uses the irregular first-person form."],
    // Level 2: grammar in context, agreement and mixed expressions.
    [2,"choice","Which sentence is grammatically correct?","Me gustan las manzanas.",["Me gusta las manzanas.","Me gustan las manzanas.","Me gusto las manzanas.","Me gustas las manzanas."],"The plural subject las manzanas takes gustan."],
    [2,"choice","Which sentence has correct adjective agreement?","Las casas son bonitas.",["Los casas son bonitas.","Las casas son bonito.","La casas son bonitas.","Las casas son bonitas."],"Both the article and adjective agree with casas."],
    [2,"choice","Choose the correct location phrase.","El banco está al lado del parque.",["El banco es al lado del parque.","El banco está al lado del parque.","El banco tiene al lado del parque.","El banco hay al lado del parque."],"Estar describes the location of the bank."],
    [2,"choice","Which phrase means 'as tall as'?","tan alto como",["más alto que","tan alto como","menos alto que","alto de como"],"Tan + adjective + como expresses equality."],
    [2,"choice","Select the correct response to ¿De dónde eres?","Soy de Panamá.",["Estoy de Panamá.","Tengo Panamá.","Soy de Panamá.","Voy de Panamá."],"Soy de identifies origin."],
    [2,"choice","Which sentence uses tener correctly?","Tengo dieciséis años.",["Estoy dieciséis años.","Tengo dieciséis años.","Soy dieciséis años.","Me dieciséis años."],"Spanish uses tener for age."],
    [2,"choice","Select the correct negative sentence.","No tengo hermanos.",["Tengo no hermanos.","No tengo hermanos.","No hermanos tengo no.","No soy tengo hermanos."],"No generally precedes the conjugated verb."],
    [2,"choice","Complete: ¿___ años tienes?","Cuántos",["Cuándo","Cuántos","Dónde","Quién"],"Cuántos asks for a number."],
    [2,"type","Conjugate: ellos + hablar (present tense)","hablan",null,"Third-person plural -ar verbs end in -an."],
    [2,"type","Conjugate: nosotros + vivir (present tense)","vivimos",null,"Nosotros vivimos is present tense."],
    [2,"type","Complete: Me ___ los perros. (gustar)","gustan",null,"Plural nouns require gustan."],
    [2,"type","Complete: El libro ___ encima de la mesa. (estar)","está",null,"Está describes location."],
    [2,"type","Correct the verb: Yo hablar español. Write only the corrected verb.","hablo",null,"Yo hablo is present tense."],
    [2,"type","Complete: Mi hermana es más alta ___ yo.","que",null,"Más ... que expresses comparison."],
    [2,"type","Complete: Ella ___ dos idiomas. (hablar)","habla",null,"Ella habla is third-person singular."],
    [2,"type","Complete: Mis amigos ___ simpáticos. (ser)","son",null,"Son agrees with plural mis amigos."],
    // Level 3: A2 contexts, reflexives, irregular verbs and connected sentences.
    [3,"choice","Choose the sentence with the correct reflexive verb.","Nos levantamos a las siete.",["Nos levantan a las siete.","Nos levantamos a las siete.","Nos levanto a las siete.","Nos levantáis a las siete."],"Nosotros uses nos levantamos."],
    [3,"choice","Which sentence correctly describes a completed action today?","Hoy he estudiado español.",["Hoy soy estudiado español.","Hoy he estudiado español.","Hoy he estudiar español.","Hoy estoy estudiar español."],"He estudiado uses haber and a past participle."],
    [3,"choice","Select the correct sentence about a routine.","Normalmente me acuesto temprano.",["Normalmente me acostar temprano.","Normalmente me acuesto temprano.","Normalmente yo acuestas temprano.","Normalmente me acuestan temprano."],"Me acuesto is the correct first-person reflexive present."],
    [3,"choice","Complete: Si llueve, ___ en casa.","me quedo",["me quedas","me quedo","me quedamos","me quedar"],"Me quedo is first-person present tense in this condition."],
    [3,"choice","Choose the appropriate expression: 'I have been studying Spanish for two years'.","Estudio español desde hace dos años.",["Estudio español hace desde dos años.","Estudio español desde hace dos años.","Estoy español desde dos años.","Estudiar español por dos años."],"Desde hace + duration describes an activity continuing to the present."],
    [3,"choice","Choose the correct indirect-object pronoun: A María ___ gusta bailar.","le",["me","te","le","nos"],"A María corresponds to le."],
    [3,"choice","Which sentence uses the correct preposition?","Voy a la escuela.",["Voy en la escuela.","Voy de la escuela.","Voy a la escuela.","Voy por la escuela."],"Ir a is commonly used with a destination."],
    [3,"choice","Complete: ¿___ has hecho este fin de semana?","Qué",["Dónde","Quién","Qué","Cuál"],"Qué asks what somebody has done."],
    [3,"choice","Which sentence correctly compares two cities?","Madrid es más grande que Toledo.",["Madrid es más grande de Toledo.","Madrid es tan grande que Toledo.","Madrid es más grande que Toledo.","Madrid es grande más Toledo."],"Más + adjective + que makes a comparative."],
    [3,"choice","Complete: Ya ___ terminado la tarea.","he",["soy","estoy","he","tengo"],"The present perfect uses haber + participle."],
    [3,"type","Conjugate: yo + ir (present tense)","voy",null,"Ir is irregular: yo voy."],
    [3,"type","Conjugate: tú + hacer (present tense)","haces",null,"Tú haces is second-person singular."],
    [3,"type","Complete: Nosotros ___ que estudiar para el examen. (tener)","tenemos",null,"Tener que expresses obligation."],
    [3,"type","Complete: Hoy no ___ desayunado. (haber, yo)","he",null,"He is the first-person present of haber."],
    [3,"type","Complete: Me ___ a las siete todas las mañanas. (levantarse, yo)","levanto",null,"Me levanto is the reflexive first-person form."],
    [3,"type","Complete: Cuando tengo tiempo libre, ___ libros. (leer, yo)","leo",null,"Leo is the present first-person of leer."]
  ].map(([level,type,prompt,answer,options,explanation])=>({level,type,prompt,answer,options,explanation}));

  const TOTAL=12,MAX_MISSES=3;
  const norm=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .toLowerCase().replace(/[¿?¡!.,]/g,"").replace(/\s+/g," ").trim();
  const mix=a=>{const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
  const fmt=n=>String(n).padStart(6,"0");
  const el=(tag,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node};
  const byLevel={};
  let deck={},index=0,misses=0,points=0,streak=0,answered=false,active=null,initials=["A","A","A"],selected=0;
  let initialKeyHandler=null;

  function panel(id){
    ["freeplay-locked","freeplay-intro-panel","freeplay-board","freeplay-finish"].forEach(key=>$(key).hidden=(key!==id));
  }

  function setup(){
    const p=ArcadeProgress.status();
    if(!p.unlocked){
      $("freeplay-lock-copy").textContent="Unlock by earning 30 unique correct answers across at least 3 game types. Current: "+
        p.correct+" / "+p.target+" answers, "+p.modes+" / "+p.requiredModes+" game types.";
      $("freeplay-meter-fill").style.width=Math.min(100,p.correct/30*100)+"%";
      panel("freeplay-locked");
    } else panel("freeplay-intro-panel");
  }

  function updateHud(){
    $("freeplay-round").textContent="ROUND "+String(Math.min(index+1,TOTAL)).padStart(2,"0")+"/"+TOTAL;
    $("freeplay-score").textContent=fmt(points);
    $("freeplay-lives").textContent="♥ ".repeat(MAX_MISSES-misses)+"♡ ".repeat(misses);
    $("freeplay-run-fill").style.width=100*index/TOTAL+"%";
  }

  function begin(){
    if(!ArcadeProgress.status().unlocked){setup();return;}
    deck={1:mix(items.filter(q=>q.level===1)),2:mix(items.filter(q=>q.level===2)),3:mix(items.filter(q=>q.level===3))};
    index=0;misses=0;points=0;streak=0;answered=false;active=null;
    stopInitialKeys();panel("freeplay-board");question();
  }

  function question(){
    if(index>=TOTAL||misses>=MAX_MISSES){finish();return;}
    const level=index<4?1:index<8?2:3;
    active=deck[level].shift();
    answered=false;
    updateHud();
    $("freeplay-level").textContent=level===1?"LEVEL A1":level===2?"LEVEL A1+":"LEVEL A2";
    $("freeplay-prompt").textContent=active.prompt;
    $("freeplay-feedback").textContent="";
    $("freeplay-next").hidden=true;
    const a=$("freeplay-answer-area");a.replaceChildren();
    if(active.type==="choice"){
      const options=el("div",undefined,"freeplay-options");
      mix(active.options).forEach((choice,i)=>{
        const b=el("button",String.fromCharCode(65+i)+". "+choice);
        b.type="button";
        b.addEventListener("click",()=>{
          if(answered)return;
          const ok=choice===active.answer;
          settle(ok);
          for(const child of options.children){
            child.disabled=true;
            if(child.textContent.slice(3)===active.answer)child.classList.add("correct-answer");
            else if(child===b&&!ok)child.classList.add("wrong-answer");
          }
        });
        options.append(b);
      });
      a.append(options);
    } else {
      const form=el("form",undefined,"freeplay-type-form");
      const input=el("input");input.type="text";input.autocomplete="off";input.spellcheck=false;
      input.maxLength=90;input.setAttribute("aria-label","Type the Spanish answer");
      const submit=el("button","CONFIRM");submit.type="submit";
      form.append(input,submit);
      form.addEventListener("submit",e=>{
        e.preventDefault();
        if(answered||!input.value.trim())return;
        settle(norm(input.value)===norm(active.answer));
        input.disabled=true;submit.disabled=true;
      });
      a.append(form);
      input.focus();
    }
  }

  function settle(ok){
    answered=true;
    if(ok){streak++;points+=100+25*Math.min(5,streak); }
    else {misses++;streak=0;}
    updateHud();
    $("freeplay-feedback").textContent=ok?
      "CORRECT! +"+(100+25*Math.min(5,streak))+" POINTS · "+active.explanation:
      "MISS! Correct: "+active.answer+" · "+active.explanation;
    $("freeplay-feedback").style.color=ok?"#91ffd7":"#ffa5b4";
    $("freeplay-next").hidden=false;
    $("freeplay-next").textContent=misses>=MAX_MISSES||index+1>=TOTAL?"SEE FINAL SCORE →":"NEXT ROUND →";
  }

  function next(){
    if(!answered)return;
    index++;
    if(misses>=MAX_MISSES||index>=TOTAL)finish();
    else question();
  }

  function stopInitialKeys(){
    if(initialKeyHandler)document.removeEventListener("keydown",initialKeyHandler);
    initialKeyHandler=null;
  }
  function showInitials(){
    $("freeplay-initials-entry").hidden=false;
    initials=["A","A","A"];selected=0;
    const host=$("initials-slots");host.replaceChildren();
    const slots=[];
    for(let i=0;i<3;i++){
      const col=el("div",undefined,"initial-slot");
      const up=el("button","▲"),letter=el("button","A","initial-letter"),down=el("button","▼");
      up.type=letter.type=down.type="button";
      up.setAttribute("aria-label","Next letter in position "+(i+1));
      down.setAttribute("aria-label","Previous letter in position "+(i+1));
      letter.setAttribute("aria-label","Select position "+(i+1));
      up.addEventListener("click",()=>turn(i,1));
      down.addEventListener("click",()=>turn(i,-1));
      letter.addEventListener("click",()=>{selected=i;redraw()});
      col.append(up,letter,down);host.append(col);slots.push({col,letter});
    }
    function redraw(){slots.forEach((slot,i)=>{
      slot.letter.textContent=initials[i];
      slot.col.classList.toggle("active",i===selected);
    })}
    function turn(i,d){
      selected=i;
      initials[i]=String.fromCharCode(65+(initials[i].charCodeAt(0)-65+d+26)%26);
      redraw();
    }
    initialKeyHandler=e=>{
      if($("freeplay-initials-entry").hidden)return;
      if(/^[a-z]$/i.test(e.key)){initials[selected]=e.key.toUpperCase();selected=Math.min(2,selected+1);redraw();e.preventDefault();}
      else if(e.key==="ArrowLeft"){selected=Math.max(0,selected-1);redraw();e.preventDefault();}
      else if(e.key==="ArrowRight"){selected=Math.min(2,selected+1);redraw();e.preventDefault();}
      else if(e.key==="ArrowUp"){turn(selected,1);e.preventDefault();}
      else if(e.key==="ArrowDown"){turn(selected,-1);e.preventDefault();}
      else if(e.key==="Enter"){e.preventDefault();saveScore();}
    };
    document.addEventListener("keydown",initialKeyHandler);
    redraw();
  }

  function saveScore(){
    if($("freeplay-initials-entry").hidden)return;
    const ok=ArcadeProgress.addScore(initials.join(""),points);
    stopInitialKeys();
    $("freeplay-initials-entry").hidden=true;
    $("freeplay-saved-message").textContent=ok?
      "SCORE SAVED! "+initials.join("")+" — "+fmt(points):
      "This score no longer qualifies for the top ten.";
    window.dispatchEvent(new Event("ak-arcade-progress"));
  }

  function finish(){
    stopInitialKeys();
    panel("freeplay-finish");
    $("freeplay-result").textContent=misses>=MAX_MISSES?"GAME OVER":"LEVEL CLEARED";
    $("freeplay-final-score").textContent=fmt(points);
    $("freeplay-saved-message").textContent="";
    $("freeplay-initials-entry").hidden=true;
    if(ArcadeProgress.qualifies(points))showInitials();
    else $("freeplay-saved-message").textContent="No high-score entry this time. Try another run!";
  }

  $("freeplay-start").addEventListener("click",begin);
  $("freeplay-next").addEventListener("click",next);
  $("freeplay-again").addEventListener("click",begin);
  $("freeplay-save-score").addEventListener("click",saveScore);
  setup();
})();
