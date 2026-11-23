"use strict";
/* No npm packages. Test offline dictionary, grammar, credits and classroom coverage. */
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const read=name=>fs.readFileSync(name,"utf8");
const dictionary=JSON.parse(read("language-lab-dictionary.json"));
const context={window:{}};
vm.runInNewContext(read("language-lab-content.js"),context,{filename:"language-lab-content.js"});
vm.runInNewContext(read("language-lab-core.js"),context,{filename:"language-lab-core.js"});
const Core=context.window.LabCore,Content=context.window.LanguageLabContent;
assert.ok(dictionary.source.includes("FreeDict"),"Missing FreeDict provenance");
assert.equal(dictionary.license,"GPL-2.0-or-later");
assert.equal(dictionary.headwords,4502);
assert.equal(dictionary.entries.length,4502);
assert.ok(read("freedict-gpl-2.0.txt").includes("GNU GENERAL PUBLIC LICENSE"));
assert.ok(read("language-lab-license.md").includes("FreeDict"));

const entries=Core.buildIndex(dictionary,Content);
assert.ok(entries.length>4400,"Dictionary unexpectedly small");
const es=q=>Core.search(entries,q,"es-en",20,0).results;
const en=q=>Core.search(entries,q,"en-es",20,0).results;
assert.equal(es("hola")[0].es,"hola","Classroom greeting missing");
assert.equal(es("hola")[0].source,"Classroom");
assert.equal(es("comer")[0].en[0],"to eat","Outdated FreeDict gloss must be overridden");
assert.equal(es("casa")[0].es,"casa");
assert.equal(es("arbol")[0].es,"árbol","Accent-tolerant search should retrieve correct accented spelling");
assert.ok(en("family").some(x=>x.es==="familia"),"English reverse lookup broken");
assert.ok(en("Wednesday").some(x=>x.es==="miércoles"));
assert.ok(es("habla").length>0,"Should find partial word and forms");
assert.equal(Core.search(entries,"nonexistent-synthetic-word-xyz").total,0);
assert.equal(Core.search(entries,"").total,0);

const direction="es-en";
const phrase=Core.translate("¿Cómo te llamas?",direction,Content.phrases,entries);
assert.equal(phrase.status,"phrase");
assert.equal(phrase.value,"what is your name?");
const backwards=Core.translate("what is your name?","en-es",Content.phrases,entries);
assert.equal(backwards.status,"phrase");
assert.equal(backwards.value,"¿cómo te llamas?");
const basic=Core.translate("casa",direction,Content.phrases,entries);
assert.equal(basic.status,"word");
assert.ok(basic.options.includes("house"));
const arbitrary=Core.translate("No puedo expresar esta idea de manera sencilla",direction,Content.phrases,entries);
assert.equal(arbitrary.status,"unsupported","Must never invent arbitrary sentence translations");

const get=(v,t)=>Core.conjugate(v,t);
assert.deepEqual([...get("hablar","present").forms],["hablo","hablas","habla","hablamos","habláis","hablan"]);
assert.equal(get("ser","present").forms[0],"soy");
assert.equal(get("ir","present").forms[0],"voy");
assert.equal(get("estar","subj").forms[2],"esté");
assert.equal(get("comer","past").forms[2],"comió");
assert.equal(get("vivir","imperfect").forms[3],"vivíamos");
assert.equal(get("tener","future").forms[0],"tendré");
assert.equal(get("leer","past").forms[2],"leyó");
assert.equal(get("pagar","past").status,"unsupported","Do not invent orthographic changes");
assert.equal(get("dormir","present").status,"unsupported","Unknown irregular not allowed");
assert.equal(get("comer","invalid").status,"unsupported");
const allowed=["hablar","estudiar","trabajar","caminar","cocinar","cantar","bailar",
  "escuchar","viajar","comprar","necesitar","llevar","ayudar","dibujar","mirar","visitar",
  "ganar","terminar","tomar","comer","beber","aprender","correr","vender",
  "comprender","responder","vivir","escribir","abrir","recibir","compartir","subir",
  "decidir","permitir","existir","ser","estar","ir","tener","hacer","poder","querer",
  "venir","decir","saber","poner","ver","salir","haber","leer"];
for(const verb of allowed){
  for(const tense of ["present","past","imperfect","future","subj"]){
    const result=get(verb,tense);
    assert.equal(result.status,"ok",verb+" "+tense+" has no verified forms");
    assert.equal(result.forms.length,6);
    assert.ok(result.forms.every(x=>typeof x==="string"&&x.length>1));
  }
}
const html=read("language-lab.html");
for(const name of ["dictionary","translate","pronounce","grammar"]){
  assert.ok(html.includes('data-lab-tab="'+name+'"'),"Missing tab "+name);
  assert.ok(html.includes('id="panel-'+name+'"'),"Missing panel "+name);
}
for(const asset of ["language-lab.js","language-lab-core.js","language-lab-content.js",
 "language-lab.css","language-lab-license.md"]){
  assert.ok(html.includes(asset),"Lab HTML must link to "+asset);
}
assert.ok(read("language-lab.js").includes('fetch("language-lab-dictionary.json")'),
  "Dictionary must be loaded by the client script");
assert.ok(html.includes('id="lab-translation-speech-status"'));
assert.ok(Content.curated.length>=100 && Content.phrases.length>=30 && Content.phones.length>=10);
console.log("PASS: 4,502 source entries, reverse lookup, accent search, "+
  "curated meanings, limited phrase translation, five verified tenses, licensing.");
