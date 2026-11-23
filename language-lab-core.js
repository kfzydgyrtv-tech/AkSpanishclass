"use strict";
/* Self-hosted dictionary and conjugation logic. No external API calls. */
(function (root) {
  const fold = text => String(text || "").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim()
    .replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ");
  const exact = text => String(text || "").normalize("NFC").toLocaleLowerCase("es").trim();

  function buildIndex(payload, content) {
    if (!payload || !Array.isArray(payload.entries)) throw Error("Dictionary data unavailable");
    const byWord = new Map();
    for (const row of payload.entries) {
      if (!Array.isArray(row) || typeof row[0] !== "string" || !Array.isArray(row[1])) continue;
      const es = row[0].trim();
      const en = row[1].filter(x => typeof x === "string" && x.trim()).map(x => x.trim()).slice(0, 14);
      if (!es || !en.length || es.length > 90) continue;
      const key = exact(es);
      if (!byWord.has(key)) byWord.set(key, {es, en, source:"FreeDict", pos:"", gender:"", level:"", example:"", exampleEn:""});
      else {
        const old = byWord.get(key);
        old.en = [...new Set(old.en.concat(en))].slice(0, 14);
      }
    }
    for (const c of (content.curated || [])) {
      if (!c || !c.es || !Array.isArray(c.en)) continue;
      byWord.set(exact(c.es), {...c, source:"Classroom"});
    }
    const entries=[...byWord.values()].map(e=>({
      ...e,
      esKey:fold(e.es),
      enKeys:e.en.map(fold)
    })).sort((a,b)=>a.es.localeCompare(b.es,"es"));
    return entries;
  }

  function search(entries, input, direction="es-en", limit=20, offset=0) {
    const query=fold(input).slice(0,80);
    if (!query) return {results:[], total:0};
    const results=[];
    for (const entry of entries) {
      const keys=direction==="en-es"?entry.enKeys:[entry.esKey];
      let rank=Infinity;
      for (const key of keys) {
        if (key===query) {rank=0;break}
        if (key.startsWith(query)) rank=Math.min(rank,1);
        else if (key.includes(query)) rank=Math.min(rank,2);
      }
      if (rank===Infinity) continue;
      const classRank=entry.source==="Classroom"?0:1;
      results.push({entry,rank,classRank});
    }
    results.sort((a,b)=>a.rank-b.rank||a.classRank-b.classRank||a.entry.es.localeCompare(b.entry.es,"es"));
    return {results:results.slice(offset,offset+limit).map(x=>x.entry),total:results.length};
  }

  function findExact(entries,input,direction) {
    const q=fold(input);
    if (!q) return [];
    return entries.filter(e=>(direction==="en-es"?e.enKeys:[e.esKey]).includes(q)).slice(0,15);
  }

  function translate(input,direction,phrases,entries) {
    const term=fold(input).slice(0,180);
    if (!term) return {status:"empty"};
    for (const p of phrases) {
      const source=direction==="es-en"?p.es:p.en;
      if (fold(source)===term) return {status:"phrase",value:direction==="es-en"?p.en:p.es,from:source};
    }
    const words=findExact(entries,input,direction);
    if (words.length) return {
      status:"word",
      options: direction==="es-en"?
        [...new Set(words.flatMap(e=>e.en))].slice(0,12):
        [...new Set(words.map(e=>e.es))].slice(0,12)
    };
    return {status:"unsupported"};
  }

  const subjects=["yo","tú","él / ella / usted","nosotros/as","vosotros/as","ellos / ellas / ustedes"];
  const regular={
    ar:{present:["o","as","a","amos","áis","an"],past:["é","aste","ó","amos","asteis","aron"],imperfect:["aba","abas","aba","ábamos","abais","aban"],subj:["e","es","e","emos","éis","en"]},
    er:{present:["o","es","e","emos","éis","en"],past:["í","iste","ió","imos","isteis","ieron"],imperfect:["ía","ías","ía","íamos","íais","ían"],subj:["a","as","a","amos","áis","an"]},
    ir:{present:["o","es","e","imos","ís","en"],past:["í","iste","ió","imos","isteis","ieron"],imperfect:["ía","ías","ía","íamos","íais","ían"],subj:["a","as","a","amos","áis","an"]}
  };
  const regularVerbs=new Set((
    "hablar estudiar trabajar caminar cocinar cantar bailar escuchar viajar " +
    "comprar necesitar llevar ayudar dibujar mirar visitar ganar terminar tomar " +
    "comer beber aprender correr vender comprender responder " +
    "vivir escribir abrir recibir compartir subir decidir permitir existir"
  ).split(" "));
  const irregular = {
    leer:{present:["leo","lees","lee","leemos","leéis","leen"],past:["leí","leíste","leyó","leímos","leísteis","leyeron"],imperfect:["leía","leías","leía","leíamos","leíais","leían"],subj:["lea","leas","lea","leamos","leáis","lean"]},
    ser:{present:["soy","eres","es","somos","sois","son"],past:["fui","fuiste","fue","fuimos","fuisteis","fueron"],imperfect:["era","eras","era","éramos","erais","eran"],subj:["sea","seas","sea","seamos","seáis","sean"]},
    estar:{present:["estoy","estás","está","estamos","estáis","están"],past:["estuve","estuviste","estuvo","estuvimos","estuvisteis","estuvieron"],subj:["esté","estés","esté","estemos","estéis","estén"]},
    ir:{present:["voy","vas","va","vamos","vais","van"],past:["fui","fuiste","fue","fuimos","fuisteis","fueron"],imperfect:["iba","ibas","iba","íbamos","ibais","iban"],subj:["vaya","vayas","vaya","vayamos","vayáis","vayan"]},
    tener:{present:["tengo","tienes","tiene","tenemos","tenéis","tienen"],past:["tuve","tuviste","tuvo","tuvimos","tuvisteis","tuvieron"],subj:["tenga","tengas","tenga","tengamos","tengáis","tengan"]},
    hacer:{present:["hago","haces","hace","hacemos","hacéis","hacen"],past:["hice","hiciste","hizo","hicimos","hicisteis","hicieron"],subj:["haga","hagas","haga","hagamos","hagáis","hagan"]},
    poder:{present:["puedo","puedes","puede","podemos","podéis","pueden"],past:["pude","pudiste","pudo","pudimos","pudisteis","pudieron"],subj:["pueda","puedas","pueda","podamos","podáis","puedan"]},
    querer:{present:["quiero","quieres","quiere","queremos","queréis","quieren"],past:["quise","quisiste","quiso","quisimos","quisisteis","quisieron"],subj:["quiera","quieras","quiera","queramos","queráis","quieran"]},
    venir:{present:["vengo","vienes","viene","venimos","venís","vienen"],past:["vine","viniste","vino","vinimos","vinisteis","vinieron"],subj:["venga","vengas","venga","vengamos","vengáis","vengan"]},
    decir:{present:["digo","dices","dice","decimos","decís","dicen"],past:["dije","dijiste","dijo","dijimos","dijisteis","dijeron"],subj:["diga","digas","diga","digamos","digáis","digan"]},
    saber:{present:["sé","sabes","sabe","sabemos","sabéis","saben"],past:["supe","supiste","supo","supimos","supisteis","supieron"],subj:["sepa","sepas","sepa","sepamos","sepáis","sepan"]},
    poner:{present:["pongo","pones","pone","ponemos","ponéis","ponen"],past:["puse","pusiste","puso","pusimos","pusisteis","pusieron"],subj:["ponga","pongas","ponga","pongamos","pongáis","pongan"]},
    ver:{present:["veo","ves","ve","vemos","veis","ven"],past:["vi","viste","vio","vimos","visteis","vieron"],imperfect:["veía","veías","veía","veíamos","veíais","veían"],subj:["vea","veas","vea","veamos","veáis","vean"]},
    salir:{present:["salgo","sales","sale","salimos","salís","salen"],past:["salí","saliste","salió","salimos","salisteis","salieron"],subj:["salga","salgas","salga","salgamos","salgáis","salgan"]},
    haber:{present:["he","has","ha","hemos","habéis","han"],past:["hube","hubiste","hubo","hubimos","hubisteis","hubieron"],imperfect:["había","habías","había","habíamos","habíais","habían"],subj:["haya","hayas","haya","hayamos","hayáis","hayan"]}
  };
  const futureStem={tener:"tendr",hacer:"har",poder:"podr",querer:"querr",venir:"vendr",decir:"dir",saber:"sabr",poner:"pondr",salir:"saldr",haber:"habr"};
  const future=["é","ás","á","emos","éis","án"];
  const irregularImperfect=new Set(["ser","ir","ver","haber"]);
  function conjugate(input,tense) {
    const verb=exact(input);
    const t=String(tense||"present");
    if (!(verb==="ir" || /^[a-záéíóúñü]+(?:ar|er|ir)$/i.test(verb)))
      return {status:"unsupported",message:"Enter a Spanish infinitive ending in -ar, -er or -ir."};
    if (!regularVerbs.has(verb) && !irregular[verb])
      return {status:"unsupported",message:"This verb isn't in the verified classroom conjugation set yet. Search the dictionary for its meaning; no unverified forms will be generated."};
    const group=verb.slice(-2),root=verb.slice(0,-2);
    if (!(t in {present:1,past:1,imperfect:1,future:1,subj:1}))
      return {status:"unsupported",message:"Choose a supported tense."};
    let forms;
    if (t==="future") {const stem=futureStem[verb]||verb;forms=future.map(x=>stem+x)}
    else if (irregular[verb]?.[t]) forms=irregular[verb][t];
    else forms=regular[group][t]?.map(x=>root+x);
    if (!forms || forms.length!==6) return {status:"unsupported",message:"The selected conjugation is not verified for this verb."};
    return {status:"ok",verb,tense:t,subjects,forms,irregular:Boolean(irregular[verb])};
  }
  root.LabCore=Object.freeze({fold,exact,buildIndex,search,findExact,translate,conjugate});
})(typeof window === "undefined" ? globalThis : window);
