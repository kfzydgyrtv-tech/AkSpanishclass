"use strict";
/* Arcade cabinet high-score table; no network requests. */
(function () {
  const ranks=["1ST","2ND","3RD","4TH","5TH","6TH","7TH","8TH","9TH","10TH"];
  const $=id=>document.getElementById(id);

  function renderScores(){
    const root=$("arcade-highscores");
    if(!root || typeof ArcadeProgress==="undefined")return;
    const scores=ArcadeProgress.scores();
    const table=document.createElement("table");
    table.className="arcade-score-table";
    table.setAttribute("aria-label","Top ten scores saved on this browser");
    const head=document.createElement("thead"),hrow=document.createElement("tr");
    ["RANK","SCORE","NAME"].forEach(value=>{
      const th=document.createElement("th");th.scope="col";th.textContent=value;hrow.append(th);
    });
    head.append(hrow);table.append(head);
    const body=document.createElement("tbody");
    for(let i=0;i<10;i++){
      const tr=document.createElement("tr");
      const s=scores[i];
      const cells=[ranks[i],s?String(s.score).padStart(6,"0"):"------",s?s.initials:"---"];
      cells.forEach(value=>{const td=document.createElement("td");td.textContent=value;tr.append(td)});
      body.append(tr);
    }
    table.append(body);root.replaceChildren(table);
  }

  function renderUnlock(){
    const label=$("arcade-progress-copy"),fill=$("arcade-progress-fill"),badge=$("arcade-freeplay-state");
    if(!label||typeof ArcadeProgress==="undefined")return;
    const state=ArcadeProgress.status();
    label.textContent=state.unlocked?
      "Free Play is unlocked! Mix all topics in a 12-round Spanish challenge.":
      state.correct+" of 30 unique correct answers · "+state.modes+" of 3 different game types";
    if(fill)fill.style.width=Math.min(100,state.correct/30*100)+"%";
    if(badge)badge.textContent=state.unlocked?"★ UNLOCKED ★":"🔒 BONUS MODE LOCKED";
  }
  function render(){renderScores();renderUnlock()}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render);
  else render();
  window.addEventListener("storage",render);
  window.addEventListener("ak-arcade-progress",render);
})();
