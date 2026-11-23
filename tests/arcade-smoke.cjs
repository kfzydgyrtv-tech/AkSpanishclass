"use strict";
/* No browser dependencies. Tests storage, unlock gating, local leaderboard and 12-round game. */
const fs=require("node:fs"),assert=require("node:assert/strict");
const progressSource=fs.readFileSync("arcade-progress.js","utf8");
const freeSource=fs.readFileSync("freeplay.js","utf8");
class Element {
  constructor(tag="div"){this.tagName=tag.toUpperCase();this.children=[];this.value="";this.textContent="";
    this.style={};this.className="";this.hidden=false;this.disabled=false;this.handlers={};this.attrs={};
    this.classList={add(){},remove(){},toggle(){}};}
  append(...items){this.children.push(...items)}
  replaceChildren(...items){this.children=[...items]}
  setAttribute(k,v){this.attrs[k]=v}
  addEventListener(k,fn){this.handlers[k]=fn}
  focus(){}
  click(){this.handlers.click?.()}
}
const data=new Map(), localStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
const window={dispatchEvent(){}},Event=function(type){this.type=type};
const Progress=new Function("localStorage","window","Event",
  progressSource+";return ArcadeProgress;")(localStorage,window,Event);
assert.equal(Progress.status().unlocked,false);
for(let i=0;i<30;i++)assert.equal(Progress.record("memory",i%10,"q"+i),true);
assert.equal(Progress.status().unlocked,false,"one game type must not unlock");
for(let i=0;i<10;i++)Progress.record("match",1,"q"+i);
assert.equal(Progress.status().unlocked,false,"two game types must not unlock");
assert.equal(Progress.record("verbs",2,"q0"),true);
assert.equal(Progress.status().unlocked,true,"three modes and 30+ unique questions unlock");
assert.equal(Progress.record("verbs",2,"q0"),false,"duplicate answer must not count");
assert.equal(Progress.qualifies(0),false,"zero cannot enter scores");
assert.equal(Progress.addScore("ABCD",5000),false,"initials must be exactly 3 letters");
for(let i=0;i<12;i++)Progress.addScore("ABC",(i+1)*100);
assert.equal(Progress.scores().length,10);
assert.equal(Progress.scores()[0].score,1200);
assert.equal(Progress.qualifies(100),false);
assert.equal(Progress.qualifies(5000),true);

// Isolate a fresh high-score board while retaining browser progression.
data.set("ak-spanish-arcade-v1",JSON.stringify({earned:JSON.parse(data.get("ak-spanish-arcade-v1")).earned,scores:[]}));
const ids={},get=id=>ids[id]??(ids[id]=new Element());
const document={getElementById:get,createElement:t=>new Element(t),
  addEventListener(){},removeEventListener(){}};
const testSource=freeSource.replace("  const TOTAL=12,MAX_MISSES=3;",
  "  window.__testQuestions=items;\n  const TOTAL=12,MAX_MISSES=3;");
new Function("ArcadeProgress","document","window","Event",testSource)(Progress,document,window,Event);
assert.equal(get("freeplay-locked").hidden,true,"unlocked browser should see Free Play");
get("freeplay-start").click();
assert.equal(get("freeplay-board").hidden,false);
let rounds=0;
for(;rounds<12;rounds++){
  const q=window.__testQuestions.find(x=>x.prompt===get("freeplay-prompt").textContent);
  assert.ok(q,"missing question");
  const a=get("freeplay-answer-area");
  if(q.type==="choice"){
    const option=a.children[0].children.find(x=>x.textContent.slice(3)===q.answer);
    assert.ok(option,"correct choice not offered");
    option.click();
  }else{
    const form=a.children[0];
    form.children[0].value=q.answer;
    form.handlers.submit({preventDefault(){}});
  }
  assert.equal(get("freeplay-next").hidden,false,"must allow advancing");
  get("freeplay-next").click();
}
assert.equal(rounds,12);
assert.equal(get("freeplay-finish").hidden,false,"must end after 12 rounds");
assert.equal(get("freeplay-initials-entry").hidden,false,"qualifying score should open initials");
assert.equal(get("initials-slots").children.length,3);
const firstUp=get("initials-slots").children[0].children[0];
firstUp.click(); // A -> B
get("freeplay-save-score").click();
assert.match(get("freeplay-saved-message").textContent,/SCORE SAVED! BAA/);
assert.equal(Progress.scores()[0].initials,"BAA");
console.log("PASS: progression, duplicate protection, 3-letter initials, top ten, full 12-round Free Play.");
