"use strict";
/* Reusable, dependency-free game engine. Change unit data below to add teacher-approved content. */
const DATA = {
0:{name:"En el aula",words:[["hola","hello"],["adiós","goodbye"],["gracias","thank you"],["por favor","please"],["libro","book"],["mesa","table"],["silla","chair"],["profesor","teacher"]],sentences:["Me llamo Ana.","Buenos días, profesora.","¿Cómo estás hoy?","Estoy muy bien."],errors:[["Yo llamo Ana.","Me llamo Ana."],["Buenas día.","Buenos días."]],fills:[["Me ___ Ana.","llamo"],["Buenos ___, señor.","días"]]},
1:{name:"Nosotros y nosotras",words:[["España","Spain"],["México","Mexico"],["Panamá","Panama"],["China","China"],["estudiante","student"],["médico","doctor"],["amigo","friend"],["español","Spanish"]],sentences:["Soy estudiante de español.","Mi amiga es de Panamá.","¿De dónde eres tú?","Ella habla dos lenguas."],errors:[["Yo es estudiante.","Yo soy estudiante."],["Ella habla español y ingles.","Ella habla español e inglés."]],fills:[["Yo ___ estudiante.","soy"],["Ella ___ de China.","es"]]},
2:{name:"Quiero aprender español",words:[["hablar","to speak"],["comer","to eat"],["vivir","to live"],["estudiar","to study"],["aprender","to learn"],["leer","to read"],["escribir","to write"],["trabajar","to work"]],sentences:["Nosotros estudiamos español.","Tú comes una manzana.","Ella vive en China.","Yo hablo con mi amigo."],errors:[["Yo hablar español.","Yo hablo español."],["Ellos come pan.","Ellos comen pan."]],fills:[["Nosotros ___ español.","estudiamos"],["Yo ___ en China.","vivo"]]},
3:{name:"¿Dónde está Santiago?",words:[["norte","north"],["sur","south"],["ciudad","city"],["país","country"],["calor","heat"],["frío","cold"],["lluvia","rain"],["montaña","mountain"]],sentences:["Hoy hace mucho calor.","La ciudad está al norte.","¿Dónde está mi libro?","Hay montañas en el país."],errors:[["La libro está aquí.","El libro está aquí."],["Hoy es frío.","Hoy hace frío."]],fills:[["Hoy hace ___.","frío"],["El libro ___ aquí.","está"]]},
4:{name:"¿Cuál prefieres?",words:[["camisa","shirt"],["pantalones","trousers"],["zapatos","shoes"],["rojo","red"],["azul","blue"],["verde","green"],["caro","expensive"],["barato","cheap"]],sentences:["Prefiero la camisa azul.","Los zapatos son muy caros.","Quiero comprar una camisa.","¿Cuál prefieres tú?"],errors:[["La pantalones son azules.","Los pantalones son azules."],["La camisa es rojo.","La camisa es roja."]],fills:[["Los zapatos son ___.","caros"],["Prefiero la camisa ___.","azul"]]},
5:{name:"Tus amigos son mis amigos",words:[["madre","mother"],["padre","father"],["hermana","sister"],["hermano","brother"],["abuela","grandmother"],["abuelo","grandfather"],["hija","daughter"],["hijo","son"]],sentences:["Mi hermana tiene un perro.","Me gustan los libros.","Mi abuelo es muy amable.","A ella le gusta cantar."],errors:[["Me gusta los perros.","Me gustan los perros."],["Mi hermana es alto.","Mi hermana es alta."]],fills:[["Me ___ los libros.","gustan"],["Mi hermano ___ alto.","es"]]},
6:{name:"Día a día",words:[["mañana","morning"],["tarde","afternoon"],["noche","night"],["lunes","Monday"],["martes","Tuesday"],["miércoles","Wednesday"],["desayuno","breakfast"],["escuela","school"]],sentences:["Me levanto a las siete.","Voy a la escuela el lunes.","Desayuno por la mañana.","Por la noche leo un libro."],errors:[["Yo desayuna temprano.","Yo desayuno temprano."],["Ella van a clase.","Ella va a clase."]],fills:[["Yo ___ a las siete.","desayuno"],["Hoy es ___.","lunes"]]},
7:{name:"¡A comer!",words:[["agua","water"],["pan","bread"],["arroz","rice"],["pollo","chicken"],["manzana","apple"],["naranja","orange"],["leche","milk"],["queso","cheese"]],sentences:["Quiero una botella de agua.","Me gustan las manzanas.","Comemos arroz con pollo.","La cuenta, por favor."],errors:[["Quiero un agua frío.","Quiero agua fría."],["Me gustan el pan.","Me gusta el pan."]],fills:[["Quiero una ___ de agua.","botella"],["Me ___ las naranjas.","gustan"]]},
8:{name:"El barrio ideal",words:[["parque","park"],["banco","bank"],["hospital","hospital"],["escuela","school"],["calle","street"],["plaza","square"],["tienda","shop"],["estación","station"]],sentences:["El banco está a la derecha.","Hay un parque cerca de casa.","La escuela está junto al hospital.","Camina por esta calle."],errors:[["La banco está cerca.","El banco está cerca."],["Hay una parque aquí.","Hay un parque aquí."]],fills:[["El banco está a la ___.","derecha"],["___ un parque aquí.","Hay"]]},
9:{name:"¿Sabes conducir?",words:[["conducir","to drive"],["nadar","to swim"],["cocinar","to cook"],["bailar","to dance"],["cantar","to sing"],["viajar","to travel"],["dibujar","to draw"],["correr","to run"]],sentences:["Sé nadar muy bien.","Mi amigo sabe conducir.","¿Puedes cocinar arroz?","Quiero aprender a bailar."],errors:[["Yo sabe nadar.","Yo sé nadar."],["Ella sé conducir.","Ella sabe conducir."]],fills:[["Yo ___ nadar.","sé"],["Ella ___ cocinar.","sabe"]]}
};
const VERBS=[["hablar","yo","hablo"],["hablar","tú","hablas"],["hablar","él / ella","habla"],["hablar","nosotros","hablamos"],["hablar","ellos / ellas","hablan"],["comer","yo","como"],["comer","tú","comes"],["comer","él / ella","come"],["comer","nosotros","comemos"],["comer","ellos / ellas","comen"],["vivir","yo","vivo"],["vivir","tú","vives"],["vivir","él / ella","vive"],["vivir","nosotros","vivimos"],["vivir","ellos / ellas","viven"],["ser","yo","soy"],["ser","tú","eres"],["ser","él / ella","es"],["ser","nosotros","somos"],["ser","ellos / ellas","son"]];
const MODES=[["memory","Memory"],["scramble","Word scramble"],["search","Word search"],["crossword","Crossword"],["match","Matching"],["sentence","Sentence builder"],["fill","Fill the blanks"],["error","Error detective"],["verbs","Conjugation"]];
const $=id=>document.getElementById(id), E=(tag,txt,cls)=>{const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n};
const shuffled=a=>{const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}, normalize=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("es").trim(), clean=s=>normalize(s).replace(/[¿?¡!.,]/g,"").replace(/\s+/g," "), strictClean=s=>s.toLocaleLowerCase("es").trim().replace(/[¿?¡!.,]/g,"").replace(/\s+/g," ");
let mode="memory",round=0,correct=0,attempts=0,locked=false;const area=$("game-area");
const data=()=>DATA[$("unit").value], hard=()=>$("level").value==="hard";
function button(text,fn,cls){const b=E("button",text,cls);b.type="button";b.addEventListener("click",fn);return b}
function feedback(msg,ok){const f=$("game-feedback");f.textContent=msg;f.style.color=ok===undefined?"var(--ink)":ok?"#18804d":"#c34638"}
function score(){ $("game-score").textContent=attempts?"Correct: "+correct+" / "+attempts:"" }
function refreshUnlock(){
  if(typeof ArcadeProgress==="undefined")return;
  const label=$("unlock-status"),bar=$("unlock-bar"),link=$("unlock-link");
  if(!label||!bar||!link)return;
  const p=ArcadeProgress.status();
  label.textContent=p.unlocked?"FREE PLAY UNLOCKED — Enter the arcade":
    p.correct+" / "+p.target+" unique correct answers · "+p.modes+" / "+p.requiredModes+" game types";
  bar.style.width=Math.min(100,p.correct/p.target*100)+"%";
  link.hidden=!p.unlocked;
}
function recordMastery(kind,answer){
  if(typeof ArcadeProgress==="undefined")return;
  ArcadeProgress.record(kind,Number($("unit").value),answer);
  refreshUnlock();
}
function check(ok,answer){attempts++;if(ok)correct++;score();feedback(ok?"¡Muy bien! Correct.":"Try again. "+(answer?"Answer: "+answer:""),ok)}
function mount(title,instructions){area.replaceChildren();feedback("");$("game-title").textContent=title;$("game-instructions").textContent=instructions;correct=attempts=0;locked=false;score();round++}
function nextPrompt(fn){area.append(button("Next question →",fn,"primary"))}
function singleInput(prompt,answer,rerun){const p=E("p",prompt,"game-prompt"),form=E("form"),input=E("input");input.autocomplete="off";input.setAttribute("aria-label","Your answer");form.className="game-row";const submit=button("Check",()=>{},"primary");submit.type="submit";form.append(input,submit);area.append(p,form);form.addEventListener("submit",e=>{e.preventDefault();if(submit.disabled)return;const ok=(hard()?strictClean(input.value)===strictClean(answer):clean(input.value)===clean(answer));check(ok,ok?"":answer);if(ok){recordMastery(mode,answer);submit.disabled=true;nextPrompt(rerun)}else input.select()});input.focus()}
function memory(){mount("Memory matching","Find the Spanish word that matches its English meaning.");const pairs=shuffled(data().words).slice(0,hard()?8:6);let opened=[],matched=0;const cards=shuffled(pairs.flatMap((p,i)=>[{i,text:p[0]},{i,text:p[1]}]));const grid=E("div",undefined,"game-grid");area.append(grid);cards.forEach(c=>{const b=button("?",()=>{if(locked||b.disabled||opened.includes(b))return;b.textContent=c.text;opened.push(b);if(opened.length===2){attempts++;if(cards[Number(opened[0].dataset.idx)].i===c.i){correct++;matched++;recordMastery("memory",pairs[c.i][0]);opened.forEach(x=>{x.disabled=true;x.classList.add("matched")});opened=[];score();if(matched===pairs.length)feedback("¡Excelente! All pairs found.",true)}else{score();locked=true;const old=round;setTimeout(()=>{if(old!==round)return;opened.forEach(x=>x.textContent="?");opened=[];locked=false},750)}}});b.dataset.idx=String(grid.children.length);grid.append(b)})}
function scramble(){mount("Word scramble","Unscramble the Spanish vocabulary word.");let used=0;const words=shuffled(data().words);const ask=()=>{area.replaceChildren();const w=words[used++%words.length];let mixed=shuffled([...w[0]]).join("");if(mixed===w[0]&&w[0].length>1)mixed=[...w[0]].reverse().join("");const letters=[...mixed].join(" ").toUpperCase();singleInput(letters+"  —  "+(hard()?w[0].length+" letters":w[1]),w[0],ask)};ask()}
function matching(){mount("Match the words","Select a Spanish word, then its English translation.");const pairs=shuffled(data().words).slice(0,hard()?8:6),columns=E("div",undefined,"game-two-columns");const left=E("div"),right=E("div");columns.append(left,right);area.append(columns);let active=null,done=0;const english=new Map();shuffled(pairs).forEach(p=>{const b=button(p[1],()=>{if(!active||b.disabled)return;attempts++;const ok=active.word===p[0];if(ok){correct++;done++;recordMastery("match",p[0]);active.el.disabled=b.disabled=true;active.el.classList.add("matched");b.classList.add("matched");active=null;if(done===pairs.length)feedback("All matches complete!",true)}else{active.el.classList.remove("active");active=null;feedback("Not a match. Try another pair.",false)}score()});right.append(b);english.set(p[0],b)});shuffled(pairs).forEach(p=>{const b=button(p[0],()=>{if(b.disabled)return;left.querySelectorAll("button").forEach(x=>x.classList.remove("active"));b.classList.add("active");active={el:b,word:p[0]}});left.append(b)})}
function sentence(){mount("Sentence builder","Select the words in the correct order. Punctuation is ignored.");const list=shuffled(data().sentences);let n=0;const ask=()=>{area.replaceChildren();const target=list[n++%list.length],words=target.split(/\s+/),selected=[];area.append(E("p","Build: "+(hard()?"a correct Spanish sentence":target.replace(/\S+/g,"___")),"game-prompt"));const tray=E("div",undefined,"game-row"),picked=E("div",undefined,"game-drop");area.append(picked,tray);shuffled(words.map((w,i)=>({w,i}))).forEach(obj=>{const b=button(obj.w,()=>{if(b.disabled)return;selected.push(obj);b.disabled=true;picked.append(button(obj.w,()=>{selected.splice(selected.indexOf(obj),1);b.disabled=false;renderPicked()},"game-tile"))},"game-tile");obj.source=b;tray.append(b)});function renderPicked(){picked.replaceChildren();selected.forEach(o=>picked.append(button(o.w,()=>{selected.splice(selected.indexOf(o),1);o.source.disabled=false;renderPicked()},"game-tile")))}area.append(button("Check sentence",()=>{const ok=selected.map(o=>o.i).join(",")===words.map((_,i)=>i).join(",");check(ok,target);if(ok){recordMastery("sentence",target);tray.querySelectorAll("button").forEach(b=>b.disabled=true);nextPrompt(ask)}},"primary"))};ask()}
function fill(){mount("Fill in the blanks","Type the word missing from the sentence.");const list=shuffled(data().fills);let n=0;const ask=()=>{area.replaceChildren();const x=list[n++%list.length];singleInput(x[0]+(hard()?"":"  (starts with "+x[1][0]+")"),x[1],ask)};ask()}
function error(){mount("Error detective","Rewrite the sentence with its grammar mistake corrected.");const list=shuffled(data().errors);let n=0;const ask=()=>{area.replaceChildren();const x=list[n++%list.length];singleInput("Correct: "+x[0],x[1],ask)};ask()}
function verbs(){mount("Conjugation challenge","Conjugate the verb in the present tense.");const list=shuffled(hard()?VERBS:VERBS.filter(v=>["yo","tú","él / ella"].includes(v[1])));let n=0;const ask=()=>{area.replaceChildren();const x=list[n++%list.length];singleInput(x[1]+" + "+x[0],x[2],ask)};ask()}
function wordsearch(){mount("Sopa de letras","Find each Spanish word. Click the first letter and then the last letter in a straight line.");const words=shuffled(data().words.map(x=>normalize(x[0]).replace(/[^a-zñ]/g,""))).filter(x=>x.length>=3&&x.length<=11).slice(0,hard()?7:5);const size=hard()?13:11,grid=Array.from({length:size},()=>Array(size).fill("")),placements=[];const dirs=[[0,1],[1,0],[1,1],[1,-1]];for(const w of words){let placed=false;for(let a=0;a<200&&!placed;a++){const d=dirs[Math.floor(Math.random()*dirs.length)],r=Math.floor(Math.random()*size),c=Math.floor(Math.random()*size),endR=r+d[0]*(w.length-1),endC=c+d[1]*(w.length-1);if(endR<0||endR>=size||endC<0||endC>=size)continue;if([...w].every((ch,i)=>!grid[r+d[0]*i][c+d[1]*i]||grid[r+d[0]*i][c+d[1]*i]===ch)){[...w].forEach((ch,i)=>grid[r+d[0]*i][c+d[1]*i]=ch);placements.push({w,r,c,endR,endC});placed=true}}}const alphabet="abcdefghijklmnñopqrstuvwxyz";grid.forEach(row=>row.forEach((v,i)=>{if(!v)row[i]=alphabet[Math.floor(Math.random()*alphabet.length)]}));const ui=E("div",undefined,"game-word-grid");ui.style.gridTemplateColumns="repeat("+size+", 1fr)";area.append(E("p","Find: "+placements.map(p=>p.w).join(" · "),"game-prompt"),ui);let start=null;const found=new Set();grid.forEach((row,r)=>row.forEach((ch,c)=>{const b=button(ch.toUpperCase(),()=>{if(start===null){start={r,c};feedback("Now select the last letter.")}else{const p=placements.find(p=>!found.has(p.w)&&((p.r===start.r&&p.c===start.c&&p.endR===r&&p.endC===c)||(p.endR===start.r&&p.endC===start.c&&p.r===r&&p.c===c)));attempts++;if(p){correct++;found.add(p.w);recordMastery("search",p.w);const steps=p.w.length,dr=Math.sign(p.endR-p.r),dc=Math.sign(p.endC-p.c);for(let i=0;i<steps;i++)ui.children[(p.r+dr*i)*size+p.c+dc*i].classList.add("selected");feedback("Found: "+p.w,true)}else feedback("That is not one of the hidden words.",false);score();start=null;if(found.size===placements.length)feedback("All words found!",true)}});b.setAttribute("aria-label","Row "+(r+1)+", column "+(c+1)+": "+ch);ui.append(b)}))}
function crossword() {
  mount("Crossword", "Use the small numbers in the top-left of each starting square to match the English clues. Accents are optional.");
  const words = shuffled(data().words.map(p => ({
    word: normalize(p[0]).replace(/[^a-zñ]/g, "").toUpperCase(),
    clue: p[1]
  }))).filter(x => x.word.length > 2 && x.word.length <= 12).slice(0, hard() ? 8 : 6);

  const n = 19;
  const grid = Array.from({length: n}, () => Array(n).fill(null));
  const placed = [];
  const fits = (w, r, c, dr, dc) => {
    if (r < 1 || c < 1 || r + dr * (w.length - 1) >= n - 1 ||
        c + dc * (w.length - 1) >= n - 1) return false;
    let crosses = 0;
    for (let i = 0; i < w.length; i++) {
      const rr = r + dr * i, cc = c + dc * i, existing = grid[rr][cc];
      if (existing && existing !== w[i]) return false;
      if (existing) crosses++;
      else if ((dr && (grid[rr][cc - 1] || grid[rr][cc + 1])) ||
               (dc && (grid[rr - 1][cc] || grid[rr + 1][cc]))) return false;
    }
    if (grid[r - dr]?.[c - dc] || grid[r + dr * w.length]?.[c + dc * w.length]) return false;
    return placed.length === 0 || crosses > 0;
  };

  for (const item of words) {
    let candidate = null;
    if (!placed.length) {
      candidate = {r: 9, c: Math.floor((n - item.word.length) / 2), dr: 0, dc: 1};
    } else {
      outer: for (let i = 0; i < item.word.length; i++)
        for (let r = 1; r < n - 1; r++)
          for (let c = 1; c < n - 1; c++)
            if (grid[r][c] === item.word[i])
              for (const [dr, dc] of [[1, 0], [0, 1]]) {
                const rr = r - dr * i, cc = c - dc * i;
                if (fits(item.word, rr, cc, dr, dc)) {
                  candidate = {r: rr, c: cc, dr, dc};
                  break outer;
                }
              }
    }
    if (candidate && fits(item.word, candidate.r, candidate.c, candidate.dr, candidate.dc)) {
      [...item.word].forEach((ch, i) =>
        grid[candidate.r + candidate.dr * i][candidate.c + candidate.dc * i] = ch);
      placed.push({...item, ...candidate});
    }
  }

  if (!placed.length) {
    area.append(E("p", "No crossword generated. Try a new round."));
    return;
  }

  // Number each clue by its list position, and mark its word's starting square.
  // Crosswords can have across and down clues starting in the same cell; show
  // both numbers there (for example, "2/5") rather than hiding either clue.
  const starts = new Map();
  placed.forEach((entry, index) => {
    const key = entry.r + "," + entry.c;
    if (!starts.has(key)) starts.set(key, []);
    starts.get(key).push(index + 1);
  });

  let minR = n, maxR = 0, minC = n, maxC = 0;
  placed.forEach(p => {
    minR = Math.min(minR, p.r);
    minC = Math.min(minC, p.c);
    maxR = Math.max(maxR, p.r + p.dr * (p.word.length - 1));
    maxC = Math.max(maxC, p.c + p.dc * (p.word.length - 1));
  });

  const ui = E("div", undefined, "crossword"), cells = new Map();
  ui.style.gridTemplateColumns = "repeat(" + (maxC - minC + 1) + ", var(--cross-cell))";

  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      if (!grid[r][c]) {
        ui.append(E("span", undefined, "black"));
        continue;
      }
      const square = E("span", undefined, "crossword-cell");
      const input = E("input");
      const numbers = starts.get(r + "," + c);
      input.maxLength = 1;
      input.autocomplete = "off";
      input.setAttribute("aria-label", "Crossword row " + (r - minR + 1) +
        ", column " + (c - minC + 1) +
        (numbers ? "; clue " + numbers.join(" and ") + " starts here" : ""));
      square.append(input);
      if (numbers) {
        const number = E("span", numbers.join("/"), "crossword-number");
        number.setAttribute("aria-hidden", "true");
        square.append(number);
      }
      cells.set(r + "," + c, input);
      ui.append(square);
    }
  }
  area.append(ui);
  const clues = E("ol", undefined, "game-clues");
  placed.forEach(p => clues.append(E("li", p.clue + " (" + p.word.length +
    " letters; " + (p.dr ? "down" : "across") + ")")));
  area.append(clues);
  area.append(button("Check crossword", () => {
    attempts++;
    const ok = placed.every(p => [...p.word].every((ch, i) =>
      normalize(cells.get((p.r + p.dr * i) + "," + (p.c + p.dc * i)).value).toUpperCase() === ch));
    if (ok) {correct++;placed.forEach(p=>recordMastery("crossword",p.word));}
    score();
    feedback(ok ? "Crossword complete!" : "Some letters need correcting.", ok);
  }, "primary"));
}

const RUN={memory,scramble,search:wordsearch,crossword,match:matching,sentence,fill,error,verbs};
function start(){RUN[mode]();const u=new URL(location.href);u.searchParams.set("unit",$("unit").value);u.searchParams.set("game",mode);history.replaceState(null,"",u);document.querySelectorAll("#game-tabs button").forEach(b=>b.setAttribute("aria-current",String(b.dataset.mode===mode)))}
Object.entries(DATA).forEach(([k,v])=>{const opt=E("option","Unit "+k+" · "+v.name);opt.value=k;$("unit").append(opt)});
MODES.forEach(([key,title])=>{const b=button(title,()=>{mode=key;start()});b.dataset.mode=key;$("game-tabs").append(b)});
const params=new URLSearchParams(location.search);$("unit").value=DATA[params.get("unit")]?params.get("unit"):"1";mode=RUN[params.get("game")]?params.get("game"):"memory";
$("unit").addEventListener("change",start);$("level").addEventListener("change",start);$("reset").addEventListener("click",start);start();refreshUnlock();