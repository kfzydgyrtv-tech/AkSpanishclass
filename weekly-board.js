/* Content is edited in weekly-board.json; no account or backend required. */
(()=>{"use strict";
const $=id=>document.getElementById(id);
const allowedInternal=href=>{
  if(typeof href!=="string"||!href.trim())return null;
  try{const url=new URL(href,location.href);return url.origin===location.origin&&url.pathname.startsWith(new URL(".",location.href).pathname)?url.href:null;}catch{return null;}
};
const element=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function render(data){
  if(data.weekLabel&&typeof data.weekLabel==="string")$("weekly-board-period").textContent=data.weekLabel.slice(0,80);
  const host=$("weekly-board-notices");host.replaceChildren();
  const list=Array.isArray(data.announcements)?data.announcements.slice(0,15):[];
  for(const item of list){
    if(!item||typeof item.title!=="string"||!item.title.trim())continue;
    const article=element("article",undefined,"weekly-notice");
    const meta=element("div",undefined,"weekly-notice-meta");
    if(item.category)meta.append(element("span",String(item.category).slice(0,40),"weekly-tag"));
    if(item.date){
      const raw=String(item.date).slice(0,50);
      const time=element("time",raw);
      if(/^\d{4}-\d{2}-\d{2}$/.test(raw)){
        const date=new Date(raw+"T00:00:00Z");
        if(Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===raw){
          time.dateTime=raw;
          const today=new Date();
          const age=(Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())-date.getTime())/86400000;
          if(age>=0&&age<=6)meta.append(element("span","NEW","weekly-new"));
        }
      }
      meta.append(time);
    }
    if(meta.childNodes.length)article.append(meta);
    article.append(element("h4",item.title.slice(0,160)));
    if(item.message)article.append(element("p",String(item.message).slice(0,1200)));
    const href=allowedInternal(item.href);
    if(href){const a=element("a",item.linkText||"Open resource");a.href=href;article.append(a);}
    host.append(article);
  }
  if(!host.childNodes.length)host.append(element("p","No announcements posted yet. Check back for class updates.","weekly-board-empty"));
  const links=$("weekly-board-links");
  const pins=Array.isArray(data.pinnedLinks)?data.pinnedLinks:[];
  if(pins.length){
    const validated=[];
    for(const item of pins.slice(0,8)){
      if(!item||typeof item.label!=="string")continue;
      const href=allowedInternal(item.href);if(!href)continue;
      const a=element("a");a.href=href;a.append(element("span",item.label.slice(0,90)),element("span","↗"));a.lastChild.setAttribute("aria-hidden","true");validated.push(a);
    }
    if(validated.length)links.replaceChildren(...validated);
  }
}
fetch("weekly-board.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Not available");return r.json()}).then(render).catch(()=>{$("weekly-board-status").textContent="Showing pinned class links. Weekly announcements are temporarily unavailable.";});
})();
