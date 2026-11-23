"use strict";
/* Original, deterministic Spanish practice bank with combinatorial variants.
   Each answer is validated against an explicit conjugation or word mapping.
   Cycling a pool enables infinite play, even after every unique question is used. */
const ArcadeQuestionBank = (() => {
  const result = [];
  const add = (level, type, prompt, answer, options, explanation) => {
    if (!answer || !prompt) return;
    result.push({level,type,prompt,answer,options:options||null,explanation});
  };
  const subjects = [
    ["yo",0],["tú",1],["él / ella",2],["nosotros",3],["vosotros",4],["ellos / ellas",5]
  ];
  const regular = {
    ar:["hablar","estudiar","trabajar","caminar","comprar","cocinar","cantar","bailar","escuchar","viajar"],
    er:["comer","beber","aprender","vender","correr"],
    ir:["vivir","escribir","abrir","recibir","subir","compartir"]
  };
  const endings = {
    ar:["o","as","a","amos","áis","an"],
    er:["o","es","e","emos","éis","en"],
    ir:["o","es","e","imos","ís","en"]
  };
  const imperfect = {
    ar:["aba","abas","aba","ábamos","abais","aban"],
    er:["ía","ías","ía","íamos","íais","ían"],
    ir:["ía","ías","ía","íamos","íais","ían"]
  };
  const past = {
    ar:["é","aste","ó","amos","asteis","aron"],
    er:["í","iste","ió","imos","isteis","ieron"],
    ir:["í","iste","ió","imos","isteis","ieron"]
  };
  const labels={ar:"-ar",er:"-er",ir:"-ir"};
  for (const [group,verbs] of Object.entries(regular)) {
    verbs.forEach(verb=>subjects.forEach(([subject,i])=>{
      const root=verb.slice(0,-2);
      add(i<3?1:2,"type","Present tense: "+subject+" + "+verb,
          root+endings[group][i],null,
          "Regular "+labels[group]+" present-tense agreement.");
      add(3,"type","Past tense (pretérito indefinido): "+subject+" + "+verb,
          root+past[group][i],null,
          "Use the completed-action past form. Accents matter.");
      add(4,"type","Imperfect past: "+subject+" + "+verb,
          root+imperfect[group][i],null,
          "The imperfect describes a habitual or ongoing past action.");
    }));
  }

  const irregular={
    ser:["soy","eres","es","somos","sois","son"],
    estar:["estoy","estás","está","estamos","estáis","están"],
    ir:["voy","vas","va","vamos","vais","van"],
    tener:["tengo","tienes","tiene","tenemos","tenéis","tienen"],
    hacer:["hago","haces","hace","hacemos","hacéis","hacen"],
    querer:["quiero","quieres","quiere","queremos","queréis","quieren"],
    poder:["puedo","puedes","puede","podemos","podéis","pueden"],
    venir:["vengo","vienes","viene","venimos","venís","vienen"],
    decir:["digo","dices","dice","decimos","decís","dicen"]
  };
  for(const [verb,forms] of Object.entries(irregular))
    subjects.forEach(([subject,i])=>add(i<3?2:3,"type",
      "Irregular present tense: "+subject+" + "+verb,
      forms[i],null,"Learn the irregular "+verb+" form for "+subject+"."));

  const perfect={
    hablar:"hablado",comer:"comido",vivir:"vivido",escribir:"escrito",
    hacer:"hecho",ver:"visto",poner:"puesto",abrir:"abierto",
    estudiar:"estudiado",viajar:"viajado",leer:"leído",ir:"ido"
  };
  const haber=["he","has","ha","hemos","habéis","han"];
  for(const [verb,participle] of Object.entries(perfect))
    subjects.forEach(([subject,i])=>add(3,"type",
      "Present perfect: "+subject+" + "+verb,
      haber[i]+" "+participle,null,
      "Combine the correct form of haber and the past participle."));

  // Unambiguous, spelled Spanish vocabulary with mandatory written accent marks.
  const accents=[
    ["Wednesday","miércoles"],["Saturday","sábado"],["tree","árbol"],
    ["pencil","lápiz"],["telephone","teléfono"],["number","número"],
    ["bird","pájaro"],["camera","cámara"],["song","canción"],
    ["information","información"],["difficult","difícil"],["easy","fácil"],
    ["English (language)","inglés"],["French (language)","francés"],
    ["German (language)","alemán"],["country","país"],["heart","corazón"],
    ["also","también"],["coffee","café"],["music","música"],
    ["doctor (masculine noun)","médico"],["doctor (feminine noun)","médica"],
    ["Mexico","México"],["Panama","Panamá"],["Peru","Perú"],
    ["capital city","capital"],["family","familia"],["school","escuela"]
  ];
  for(const [english,spanish] of accents)
    add(2,"type","Write in Spanish: "+english,spanish,null,
      "Write the Spanish word with all its required accent marks.");

  const adjectives=[
    ["alt","tall"],["bonit","pretty"],["pequeñ","small"],
    ["larg","long"],["nuev","new"],["car","expensive"],["barat","cheap"]
  ];
  const nouns=[
    ["El chico",0,"es"],["La chica",1,"es"],
    ["Los chicos",2,"son"],["Las chicas",3,"son"]
  ];
  for(const [stem,english] of adjectives)
    nouns.forEach(([noun,i,verb])=>{
      const ending=["o","a","os","as"][i];
      add(2,"type","Complete with the adjective ("+english+"): "+noun+" "+verb+" ___",
        stem+ending,null,
        "Match the adjective with the noun's gender and number.");
    });

  // Short, contextual reading comprehension; do not include answer in question.
  const passages=[
    ["A2","Ayer Carmen fue al mercado y compró tres manzanas. Después visitó a su abuela.",
      "¿A quién visitó Carmen después del mercado?","a su abuela",3],
    ["A2","Luis estudia español cada martes y jueves. El lunes hace deporte.",
      "¿Qué hace Luis el lunes?","hace deporte",3],
    ["A2","María suele ir a pie a la escuela, pero hoy ha ido en autobús porque llueve.",
      "¿Cómo ha ido María hoy a la escuela?","en autobús",3],
    ["B1","Aunque estaba cansado, Pedro terminó su trabajo antes de salir con sus amigos.",
      "¿Terminó Pedro el trabajo antes de salir?","sí",4],
    ["B1","Cuando llegamos al cine, la película ya había empezado y no quedaban entradas.",
      "¿Había entradas cuando llegaron?","no",4],
    ["B1","Si tuviera más tiempo libre, Elena estudiaría otro idioma durante las vacaciones.",
      "¿Qué haría Elena con más tiempo libre?","estudiaría otro idioma",4],
    ["B1","Ana perdió el tren porque salió de casa tarde. Por eso llegó una hora después.",
      "¿Por qué perdió Ana el tren?","porque salió de casa tarde",4]
  ];
  for(const [tag,text,prompt,answer,level] of passages)
    add(level,"type","Lee el texto ("+tag+"): «"+text+"» "+prompt,
      answer,null,"Use the context to answer the question in Spanish.");

  const all=Object.freeze(result);
  return Object.freeze({
    all,
    counts:()=>Object.freeze([1,2,3,4].map(level=>all.filter(q=>q.level===level).length))
  });
})();
