"use strict";
const fs=require("node:fs"), assert=require("node:assert/strict");
const progressSrc=fs.readFileSync("arcade-progress.js","utf8");
const bankSrc=fs.readFileSync("freeplay-bank.js","utf8");
const advancedSrc=fs.readFileSync("freeplay-advanced.js","utf8");
const freeSrc=fs.readFileSync("freeplay.js","utf8");

const bank=new Function(bankSrc+";return ArcadeQuestionBank;")();
const advanced=new Function(advancedSrc+";return ArcadeAdvancedBank;")();
const combined=[...bank.all,...advanced.all];
for (const level of [1,2,3,4,5,6])
  assert.ok(combined.filter(x=>x.level===level).length>=20,"Too few level "+level+" questions");
for(const item of combined){
  assert.ok(item.prompt&&item.answer&&item.explanation,"Incomplete question");
  if(item.type==="choice"){
    assert.equal(item.options.length,4,"Exactly four choices required");
    assert.equal(new Set(item.options).size,4,"Choices must be distinct");
    assert.equal(item.options.filter(x=>x===item.answer).length,1,"Answer must be offered exactly once");
  }
}
assert.equal(new Set(combined.map(x=>x.prompt)).size,combined.length,"Duplicate prompts");

// Unlock and browser-only high-score storage.
const records=new Map();
const localStorage={getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,v)};
const win={dispatchEvent(){}},Event=function(type){this.type=type};
const Progress=new Function("localStorage","window","Event",progressSrc+
  ";return ArcadeProgress;")(localStorage,win,Event);
assert.equal(Progress.status().unlocked,false);
for(let i=0;i<30;i++)Progress.record("memory",i%10,"word"+i);
assert.equal(Progress.status().unlocked,false,"One mode cannot unlock");
Progress.record("match",0,"different");
Progress.record("verbs",0,"another");
assert.equal(Progress.status().unlocked,true,"30 unique across three modes unlocks");
assert.equal(Progress.record("verbs",0,"another"),false,"Do not reward duplicate");
assert.equal(Progress.addScore("ABCD",9000),false,"Only exactly three initials");

class Element{
  constructor(tag="div"){this.tagName=tag.toUpperCase();this.children=[];this.textContent="";this.value="";
    this.disabled=false;this.hidden=false;this.style={};this.attrs={};this.handlers={};
    this.className="";this.classList={add(){},remove(){},toggle(){}};this.selectionStart=0;this.selectionEnd=0;}
  append(...x){this.children.push(...x)}
  replaceChildren(...x){this.children=[...x]}
  setAttribute(k,v){this.attrs[k]=v}
  addEventListener(k,fn){this.handlers[k]=fn}
  querySelector(sel){if(sel==="input")return this.children.find(x=>x.tagName==="INPUT")||null;return null}
  querySelectorAll(sel){if(sel==="button")return this.children.filter(x=>x.tagName==="BUTTON");return []}
  setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b}
  focus(){} select(){} click(){this.handlers.click?.()}
}
const ids={},get=id=>ids[id]??(ids[id]=new Element());
const doc={getElementById:get,createElement:t=>new Element(t),
  addEventListener(){},removeEventListener(){}};
// Peek into the game's closure only inside this smoke test; production does not expose answers.
const injected=freeSrc.replace("  function settle(ok,timedOut){",
  "  window.__peek=()=>({active,level:stage(),index,multiplier:multiplier()});"+
  "  window.__norm=norm; function settle(ok,timedOut){");
assert.ok(injected.includes("window.__peek="),"Smoke instrumentation missing");
new Function("ArcadeProgress","ArcadeQuestionBank","ArcadeAdvancedBank",
  "document","window","Event","setInterval","clearInterval","Date","navigator",injected)(
  Progress,bank,advanced,doc,win,Event,()=>1,()=>{},Date,{});
assert.notEqual(win.__norm("está"),win.__norm("esta"),"Missing accent must be wrong");
assert.equal(win.__norm("á".normalize("NFD")),"á","Unicode composed accents should work");
assert.equal(get("freeplay-locked").hidden,true);
get("freeplay-start").click();

function submit(ok){
  const current=win.__peek().active;
  const area=get("freeplay-answer-area");
  if(current.type==="choice"){
    const choice=area.children[0].children.find(x=>(x.textContent.slice(3)===current.answer)===ok);
    assert.ok(choice,"Missing "+(ok?"right":"wrong")+" option");
    choice.click();
  }else{
    const form=area.children.find(x=>x.tagName==="FORM");
    assert.ok(form,"Missing typed-answer form");
    form.children[0].value=ok?current.answer:"incorrecto";
    form.handlers.submit({preventDefault(){}});
  }
  assert.equal(get("freeplay-next").hidden,false,"Must advance after answering");
}
for(let round=1;round<=180;round++){
  const p=win.__peek();
  assert.equal(p.index,round-1);
  assert.equal(p.level,Math.min(6,Math.ceil(round/10)),
    "Level mismatch at round "+round);
  const expected=Math.pow(1.003,Math.min(5,Math.floor((round-1)/10)));
  assert.ok(Math.abs(p.multiplier-expected)<1e-9,
    "0.3% cap mismatch at round "+round);
  submit(true);
  get("freeplay-next").click();
  assert.equal(get("freeplay-finish").hidden,true,"Run must not end on round "+round);
}
assert.equal(win.__peek().level,6,"Past C2 threshold must stay at C2");
const last=get("freeplay-round").textContent;
assert.match(last,/181.*∞/,"Endless HUD should show current round and infinity");

let foundAccent=false;
for(let i=0;i<75;i++){
  const q=win.__peek().active;
  if(q.type==="type" && /[áéíóú]/i.test(q.answer)){
    foundAccent=true;
    const form=get("freeplay-answer-area").children.find(x=>x.tagName==="FORM");
    form.children[0].value=q.answer.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    form.handlers.submit({preventDefault(){}});
    assert.match(get("freeplay-feedback").textContent,/MISS!/,"Unaccented answer must count as miss");
    get("freeplay-next").click();
    break;
  }
  submit(true);get("freeplay-next").click();
}
assert.equal(foundAccent,true,"C2 pool must eventually test accent precision");
for(let miss=0;miss<2;miss++){
  submit(false);get("freeplay-next").click();
}
assert.equal(get("freeplay-finish").hidden,false,"Game must end after three misses");
assert.equal(get("freeplay-initials-entry").hidden,false,"Scoring run should show initials");
assert.equal(get("initials-slots").children.length,3,"Three initials slots");
get("initials-slots").children[0].children[0].click(); // A -> B
get("freeplay-save-score").click();
assert.match(get("freeplay-saved-message").textContent,/SCORE SAVED ON THIS DEVICE! BAA/);
assert.equal(Progress.scores()[0].initials,"BAA");
assert.equal(get("score-slip-panel").hidden,false,"Score slip visible");
assert.match(get("freeplay-score-slip").value,/SURVIVED/);
console.log("PASS: 180+ endless rounds, all six CEFR stages, C2 cap, strict accents, score slip and leaderboard.");
