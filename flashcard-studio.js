/* Student-owned flashcard folders. No server account or network calls. */
(()=>{"use strict";
const KEY="ak-language-lab-flashcards-v1",PENDING="ak-lab-flashcard-draft";
const $=id=>document.getElementById(id),node=(tag,text,cls)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x;};
const first=()=>({version:1,folders:[{id:"starter",name:"My first deck",cards:[]}],active:"starter"});
let state=first(),review=null,storageOK=true;
const sanitize=t=>String(t??"").trim();
const cardClean=c=>({id:sanitize(c.id).slice(0,90)||cryptoId(),es:sanitize(c.es).slice(0,180),en:sanitize(c.en).slice(0,180),pron:sanitize(c.pron).slice(0,120),pos:sanitize(c.pos).slice(0,60),def:sanitize(c.def).slice(0,400),example:sanitize(c.example).slice(0,240)});
function cryptoId(){return (typeof crypto!=="undefined"&&crypto.randomUUID)?crypto.randomUUID():"id-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);}
function validate(input){if(!input||!Array.isArray(input.folders)||input.folders.length>100)throw Error("Invalid folder list");
const seen=new Set(),folders=input.folders.map(f=>{if(!f||!Array.isArray(f.cards)||f.cards.length>2000)throw Error("Invalid cards");const id=sanitize(f.id).slice(0,90),name=sanitize(f.name).slice(0,50);if(!id||seen.has(id)||!name)throw Error("Invalid folder");seen.add(id);
const ids=new Set();const cards=f.cards.map(c=>{const item=cardClean(c||{});if(!item.es||!item.en||ids.has(item.id))throw Error("Invalid flashcard");ids.add(item.id);return item;});return {id,name,cards};});
if(!folders.length)throw Error("No folders");return {version:1,folders,active:folders.some(f=>f.id===input.active)?input.active:folders[0].id};}
try{const raw=localStorage.getItem(KEY);if(raw)state=validate(JSON.parse(raw));}catch(error){if(error instanceof DOMException)storageOK=false;}
const active=()=>state.folders.find(f=>f.id===state.active)||state.folders[0];
function status(message){$("fc-status").textContent=message;}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));storageOK=true;return true;}catch{storageOK=false;status("Browser storage is unavailable or full. Export a backup before leaving this page.");return false;}}
function option(text,click,cls="lab-outline"){const b=node("button",text,cls);b.type="button";b.addEventListener("click",click);return b;}
function clearForm(){const form=$("fc-card-form");form.reset();$("fc-edit-id").value="";$("fc-form-heading").textContent="Add a flashcard";$("fc-save-card").textContent="SAVE FLASHCARD";}
function cardForm(c){$("fc-edit-id").value=c.id||"";for(const key of ["es","en","pron","pos","def","example"])$("fc-"+key).value=c[key]||"";$("fc-form-heading").textContent=c.id?"Edit flashcard":"Add a flashcard";$("fc-save-card").textContent=c.id?"SAVE CHANGES":"SAVE FLASHCARD";$("fc-es").focus();}
function redraw(){const f=active();$("fc-active-title").textContent=f.name;$("fc-active-count").textContent=f.cards.length+" flashcard"+(f.cards.length===1?"":"s");
const list=$("fc-folder-list");list.replaceChildren();for(const folder of state.folders){const b=option(folder.name,()=>{state.active=folder.id;closeReview();render();persist();},"fc-folder");b.setAttribute("aria-current",String(folder.id===f.id));b.append(node("small",folder.cards.length+" cards"));list.append(b);}
const host=$("fc-card-list");host.replaceChildren();$("fc-start-study").disabled=!f.cards.length;
if(!f.cards.length)host.append(node("p","This folder is empty. Make a card above, or bookmark a word in the dictionary.","fc-empty"));
for(const c of f.cards){const row=node("article",undefined,"fc-item"),details=node("div"),actions=node("div",undefined,"fc-inline");details.append(node("strong",c.es),node("p",c.en),node("small",[c.pos,c.def].filter(Boolean).join(" · ")));
actions.append(option("Edit",()=>{closeReview();cardForm(c);}),option("Remove",()=>{if(!confirm("Delete this flashcard?"))return;f.cards=f.cards.filter(x=>x.id!==c.id);persist();render();}));
row.append(details,actions);host.append(row);}}
function render(){redraw();if(!storageOK)status("Your browser cannot save changes. Export your decks before leaving.");}
function closeReview(){review=null;$("fc-review").hidden=true;try{speechSynthesis.cancel()}catch{}}
function flipRender(){if(!review)return;const f=active(),card=f.cards.find(c=>c.id===review.order[review.at]);if(!card){closeReview();return;}
$("fc-review").hidden=false;$("fc-review-progress").textContent=f.name+" · "+(review.at+1)+" / "+review.order.length;
$("fc-side").textContent=review.flipped?"ENGLISH · DEFINITION":"ESPAÑOL · PRONUNCIATION";
$("fc-review-word").textContent=review.flipped?card.en:card.es;
$("fc-review-meta").textContent=review.flipped?card.pos||"Part of speech not provided":card.pron||"Use Listen to hear the Spanish pronunciation";
$("fc-review-def").textContent=review.flipped?[card.def,card.example].filter(Boolean).join(" · "):"";
$("fc-previous").disabled=review.at===0;$("fc-next").disabled=review.at===review.order.length-1;
}
function startReview(){const f=active();if(!f.cards.length)return;review={order:f.cards.map(x=>x.id),at:0,flipped:false};flipRender();$("fc-flip").focus();}
function fillFromWord(detail){const word=sanitize(detail.es);if(!word)return;
clearForm();cardForm({es:word,en:sanitize(detail.en),pos:sanitize(detail.pos),def:"",example:sanitize(detail.example)});
status('Bookmarked "'+word+'". Choose a folder on the left, then save this card. You can edit its translation and definition first.');
$("fc-card-form").scrollIntoView({block:"nearest",behavior:"smooth"});
}
function gotoTab(){const tab=$("tab-flashcards");if(tab)tab.click();}
$("fc-folder-form").addEventListener("submit",e=>{e.preventDefault();const name=sanitize($("fc-folder-name").value);if(!name)return;if(state.folders.length>=100){status("Maximum 100 folders.");return;}const folder={id:cryptoId(),name,cards:[]};state.folders.push(folder);state.active=folder.id;$("fc-folder-name").value="";clearForm();closeReview();persist();render();status('Created folder "'+name+'".');});
$("fc-card-form").addEventListener("submit",e=>{e.preventDefault();const f=active(),id=$("fc-edit-id").value;const card=cardClean({id:id||cryptoId(),...Object.fromEntries(["es","en","pron","pos","def","example"].map(k=>[k,$("fc-"+k).value]))});
if(!card.es||!card.en){status("Spanish and English fields are required.");return;}
const existing=f.cards.findIndex(x=>x.id===id);
if(existing>=0)f.cards[existing]=card;else if(f.cards.length>=2000){status("Maximum 2,000 cards in one folder.");return;}else f.cards.push(card);
const saved=persist();clearForm();closeReview();render();status(saved?"Flashcard saved in "+f.name+".":"Card added for this session, but browser storage failed.");});
$("fc-clear-form").addEventListener("click",clearForm);
$("fc-rename").addEventListener("click",()=>{const f=active(),name=prompt("Rename flashcard folder:",f.name);if(name===null)return;if(!sanitize(name)){status("Folder name cannot be empty.");return;}f.name=sanitize(name).slice(0,50);persist();render();});
$("fc-delete-folder").addEventListener("click",()=>{const f=active();if(!confirm('Delete folder "'+f.name+'" and all '+f.cards.length+' cards inside? This cannot be undone.'))return;state.folders=state.folders.filter(x=>x.id!==f.id);if(!state.folders.length)state=first();else state.active=state.folders[0].id;clearForm();closeReview();persist();render();});
$("fc-start-study").addEventListener("click",startReview);
$("fc-close-review").addEventListener("click",closeReview);
$("fc-flip").addEventListener("click",()=>{if(review){review.flipped=!review.flipped;flipRender();}});
$("fc-previous").addEventListener("click",()=>{if(review&&review.at>0){review.at--;review.flipped=false;flipRender();}});
$("fc-next").addEventListener("click",()=>{if(review&&review.at<review.order.length-1){review.at++;review.flipped=false;flipRender();}});
$("fc-shuffle").addEventListener("click",()=>{if(!review)return;for(let i=review.order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[review.order[i],review.order[j]]=[review.order[j],review.order[i]];}review.at=0;review.flipped=false;flipRender();});
$("fc-review").addEventListener("keydown",e=>{if(e.key==="ArrowRight")$("fc-next").click();else if(e.key==="ArrowLeft")$("fc-previous").click();else if(e.key==="Escape")closeReview();});
$("fc-listen").addEventListener("click",()=>{if(!review)return;const c=active().cards.find(x=>x.id===review.order[review.at]);if(!c)return;const status=$("fc-audio-status");if(!("speechSynthesis" in window)||typeof SpeechSynthesisUtterance==="undefined"){status.textContent="This browser has no speech playback.";return;}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(c.es);u.lang="es-ES";u.rate=.85;u.voice=speechSynthesis.getVoices().find(v=>/^es[-_]/i.test(v.lang))||null;status.textContent=u.voice?"Playing Spanish.":"No Spanish voice found; browser fallback may sound incorrect.";speechSynthesis.speak(u);}catch{status.textContent="Speech playback unavailable.";}}); 
$("fc-export").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=node("a");a.href=url;a.download="ak-spanish-flashcards-backup.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);status("Backup downloaded. Keep it somewhere safe.");});
$("fc-import-file").addEventListener("change",async e=>{const file=e.target.files?.[0];e.target.value="";if(!file)return;if(file.size>5_000_000){status("Backup too large (limit 5 MB).");return;}try{const incoming=validate(JSON.parse(await file.text()));if(!confirm("Replace your current flashcard folders with this backup? Export your current cards first if you want to keep them."))return;state=incoming;closeReview();clearForm();persist();render();status("Backup imported successfully.");}catch(error){status("Import failed: "+error.message);}});
window.addEventListener("ak-lab-word-bookmarked",event=>{const detail=event.detail||{};gotoTab();fillFromWord(detail);});
const params=new URLSearchParams(location.search);if(params.get("word")){gotoTab();fillFromWord({es:params.get("word"),en:params.get("meaning")||""});}
render();
})();