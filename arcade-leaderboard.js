"use strict";
/* Arcade cabinet high-score table; no network requests. */
(function () {
  const ranks=["1ST","2ND","3RD","4TH","5TH","6TH","7TH","8TH","9TH","10TH"];
  const $=id=>document.getElementById(id);

  function tableFor(root, scores, label){
    if(!root)return;
    const table=document.createElement("table");
    table.className="arcade-score-table";
    table.setAttribute("aria-label",label);
    const head=document.createElement("thead"),hrow=document.createElement("tr");
    ["RANK","SCORE","NAME"].forEach(value=>{
      const th=document.createElement("th");th.scope="col";th.textContent=value;hrow.append(th);
    });
    head.append(hrow);table.append(head);
    const body=document.createElement("tbody");
    for(let i=0;i<10;i++){
      const tr=document.createElement("tr"),entry=scores[i];
      const cells=[ranks[i],entry?String(entry.score).padStart(6,"0"):"------",entry?entry.initials:"---"];
      cells.forEach(value=>{const td=document.createElement("td");td.textContent=value;tr.append(td)});
      body.append(tr);
    }
    table.append(body);root.replaceChildren(table);
  }

  function renderScores(){
    if(typeof ArcadeProgress==="undefined")return;
    tableFor($("arcade-highscores"),ArcadeProgress.scores(),"Top ten local device records");
  }

  async function renderPublished(){
    const host=$("class-highscores");if(!host)return;
    try{
      const response=await fetch("arcade-class-highscores.json",{cache:"no-store"});
      if(!response.ok)throw new Error("HTTP "+response.status);
      const payload=await response.json();
      const records=Array.isArray(payload.scores)?payload.scores:[];
      const clean=records.filter(x=>x && /^[A-Z]{3}$/.test(x.initials) &&
        Number.isSafeInteger(x.score) && x.score>0)
        .sort((a,b)=>b.score-a.score).slice(0,10);
      tableFor(host,clean,"Shared class scores published by teacher");
      const status=$("class-score-status");
      if(status)status.textContent=clean.length?
        "Published class records · teacher reviewed":
        "No class records published yet. This board is shared across devices.";
    }catch(error){
      host.textContent="The published class scores could not be loaded.";
    }
  }
  function renderUnlock(){
    const label=$("arcade-progress-copy"),fill=$("arcade-progress-fill"),badge=$("arcade-freeplay-state");
    if(!label||typeof ArcadeProgress==="undefined")return;
    const state=ArcadeProgress.status();
    label.textContent=state.unlocked?
      "Free Play is unlocked! Play endless mixed-topic survival with strict accents.":
      state.correct+" of 30 unique correct answers · "+state.modes+" of 3 different game types";
    if(fill)fill.style.width=Math.min(100,state.correct/30*100)+"%";
    if(badge)badge.textContent=state.unlocked?"★ UNLOCKED ★":"🔒 BONUS MODE LOCKED";
  }
  function render(){renderScores();renderUnlock();renderPublished()}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render);
  else render();
  window.addEventListener("storage",render);
  window.addEventListener("ak-arcade-progress",render);
})();
