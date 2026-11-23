"use strict";
/* Advanced Spanish practice, original prompts informed by CEFR/Instituto Cervantes.
   These are targeted challenges, NOT a certified C1/C2 assessment. */
const ArcadeAdvancedBank = (() => {
  const items = [];
  function choice(level,prompt,answer,distractors,explanation){
    const options=[answer,...distractors];
    if(options.length!==4||new Set(options).size!==4)throw Error("Ambiguous options: "+prompt);
    items.push({level,type:"choice",prompt,answer,options,explanation});
  }
  function type(level,prompt,answer,explanation){
    items.push({level,type:"type",prompt,answer,options:null,explanation});
  }

  // B1 and B2: expand the structures treated in the user's A1–B1 grammar reference.
  const indicativeSubj = [
    ["hacer","haga","Es esencial que ella ___ el ejercicio."],
    ["tener","tenga","Me alegra que él ___ más tiempo libre."],
    ["venir","venga","Quiero que ella ___ mañana."],
    ["poder","pueda","Ojalá él ___ asistir a la reunión."],
    ["saber","sepa","Dudo que ella ___ la respuesta."],
    ["estar","esté","Es posible que tu amigo ___ en casa."],
    ["ser","sea","No creo que el examen ___ tan fácil."],
    ["ir","vaya","Es preferible que ella ___ en tren."],
    ["dar","dé","Es importante que el profesor ___ instrucciones claras."],
    ["querer","quiera","No parece que el jefe ___ cambiar la fecha."],
    ["hablar","hable","Quiero que él ___ más despacio."],
    ["comprender","comprenda","Espero que ella ___ la pregunta."]
  ];
  indicativeSubj.forEach(([verb,ans,prompt])=>
    type(3,prompt+" (forma de "+verb+" en presente de subjuntivo)",ans,
      "After this expression of wish, doubt or evaluation, use the present subjunctive."));

  const hypothetical=[
    ["tuviera","viajaría","Si yo ___ dinero, ___ por América Latina."],
    ["pudiera","estudiaría","Si ella ___ elegir, ___ medicina."],
    ["hiciera","saldríamos","Si ___ buen tiempo, nosotros ___ a pasear."],
    ["hubiera sabido","habría avisado","Si yo lo ___ antes, te ___."]
  ];
  hypothetical.forEach(([first,second,prompt],i)=>{
    choice(4,"Choose the correct completion: "+prompt,
      first+" / "+second,
      i<3?["tendré / viajaría","tenía / viajaré","tengo / viajaré"].map((_,j)=>{
        // Each pair is unique and unambiguously wrong in the specified counterfactual.
        const bases=[["tendré / viajaría","tenga / viajaré","tengo / viajaría"],
                     ["podía / estudiará","puede / estudió","podrá / estudiaría"],
                     ["hace / saldríamos","hiciera / salimos","hará / salimos"]];
        return bases[i][j];
      }):["he sabido / habría avisado","hubiese sabido / avisaba","sé / avisaría"],
      "Hypothetical clauses require appropriate subjunctive and conditional forms.");
  });
  // The fourth item allows 'hubiese sabido' in a different correct alternative,
  // but the distractor also has an incorrect main clause.

  const bookTopics=[
    [3,"Completa el imperativo negativo (tú): No ___ tan rápido. (conducir)","conduzcas","Negative imperatives use the present subjunctive."],
    [3,"Completa la orden formal (usted): ___ aquí, por favor. (sentarse)","siéntese","Formal commands take subjunctive forms and attach the reflexive pronoun."],
    [3,"Completa: Cuando era niño, ___ en un pueblo. (vivir, yo)","vivía","The imperfect expresses habitual past situations."],
    [3,"Completa: Ayer ___ la película entera. (ver, yo)","vi","Completed past actions take the pretérito indefinido."],
    [3,"Completa: No creo que ella ___ llegado aún. (haber)","haya","Present perfect subjunctive uses haya + participle."],
    [3,"Completa: ___ que mañana haga sol. (ojalá)","Ojalá","Ojalá marks a wish and commonly selects the subjunctive."],
    [4,"Completa: No era seguro que ellos ___ la verdad. (saber, imperfecto de subjuntivo)","supieran","The past reporting frame may take imperfect subjunctive."],
    [4,"Completa: Me habría gustado que ___ venido. (haber, tú, pluscuamperfecto de subjuntivo)","hubieras","Past unrealised wishes use pluperfect subjunctive."],
    [4,"Completa: Habla con calma y ___ la verdad. (decir, tú, imperativo afirmativo)","di","The affirmative tú imperative of decir is di."],
    [4,"Completa: No ___ prisa. (tener, tú, imperativo negativo)","tengas","The negative imperative is in present subjunctive."],
    [4,"Completa: Si lo ___ antes, habríamos cambiado la ruta. (saber, nosotros)","hubiéramos sabido","A counterfactual past condition takes pluperfect subjunctive."],
    [4,"Completa: Aunque ___, seguiríamos adelante. (llover, imperfecto de subjuntivo)","lloviera","The hypothetical concession selects imperfect subjunctive."],
    [4,"Completa: ___ al menos una persona que conozca el camino. (haber, presente)","Hay","Impersonal haber in present is hay."],
    [4,"Completa: ___ demasiado rápido para ver el letrero. (ir, nosotros, pretérito indefinido)","fuimos","Fuimos is the simple past of ir in first-person plural."],
    [4,"Completa: Te lo explicaré con tal de que me ___. (escuchar, tú)","escuches","Con tal de que takes subjunctive in this condition."]
  ];
  bookTopics.forEach(([level,prompt,ans,why])=>type(level,prompt,ans,why));

  // C1: specialised structures, discourse functions, idiomatic register.
  const c1Subj=[
    ["hagas","Por mucho que ___ (hacer, tú) cambios, no resolverás la causa."],
    ["digas","Sea lo que sea lo que ___ (decir, tú), te escucharé."],
    ["llegara","Actuó como si ___ (llegar, él) tarde."],
    ["fuera","Aunque ___ (ser, ella) más fácil, no sería la solución adecuada."],
    ["hubieran advertido","Era improbable que ellos nos ___ (advertir) con antelación."],
    ["hubiésemos previsto","Si ___ (prever, nosotros) ese obstáculo, habríamos cambiado el plan."],
    ["existido","De haber ___ un acuerdo, la situación habría sido distinta. (participio de existir)"],
    ["haya comprendido","No estoy seguro de que ella ___ (comprender) las implicaciones."],
    ["hubiera podido","Ojalá yo ___ (poder) intervenir antes."],
    ["resultara","No esperaba que aquello ___ (resultar) tan costoso."],
    ["mantuviera","La dirección exigió que se ___ (mantener, él) la confidencialidad."],
    ["supusiéramos","No era razonable que nosotros ___ (suponer) semejante desenlace."],
    ["hubiese elegido","No creo que, de haber tenido opción, él ___ (elegir) lo mismo. (forma en -se del pluscuamperfecto de subjuntivo)"]
  ];
  c1Subj.forEach(([ans,prompt])=>type(5,"Completa con la forma adecuada: "+prompt,ans,
    "This context calls for the appropriate subordinate or hypothetical verbal form."));

  const c1Choices=[
    ["Pese a que el informe era favorable, el consejo pospuso la decisión. ¿Qué relación expresa 'pese a que'?",
     "concesión",["causa","finalidad","consecuencia"],"Pese a que introduces a concession."],
    ["La directora no negó los hechos; antes bien, los reconoció. ¿Qué significa 'antes bien'?",
     "al contrario",["por casualidad","con anterioridad","al mismo tiempo"],"Antes bien strengthens a correction or contrary assertion."],
    ["¿Cuál es el conector apropiado? El experimento falló; ___, la hipótesis deberá revisarse.",
     "por consiguiente",["en cambio","a pesar de","si bien"],"Por consiguiente introduces a conclusion."],
    ["¿Cuál mantiene un tono formal y prudente en un informe?",
     "Los datos apuntan a una posible mejora.",["Los datos prueban que todo irá perfecto.","Esto va a salir genial, seguro.","Ya está todo clarísimo."],"A cautious report avoids unsupported certainty."],
    ["¿Qué matiz aporta 'presuntamente' en una noticia?",
     "La información no se presenta como un hecho demostrado.",["La información ha sido verificada definitivamente.","El hecho ocurrió en el pasado remoto.","El autor expresa admiración."],"Presuntamente marks unconfirmed attribution."],
    ["Selecciona la oración con relación condicional correcta.",
     "A condición de que aceptes las normas, podrás participar.",["A condición de que aceptas las normas, podrás participar.","A condición de que aceptar las normas, podrás participar.","A condición que aceptas las normas, podrás participar."],"A condición de que selects subjunctive."],
    ["Selecciona la oración con el valor hipotético correcto.",
     "Si hubiera tenido tiempo, habría revisado el documento.",["Si habría tenido tiempo, habría revisado el documento.","Si he tenido tiempo, habría revisado el documento.","Si tendré tiempo, habría revisado el documento."],"Past counterfactuals commonly pair subjunctive pluperfect and conditional perfect."],
    ["¿Qué oración utiliza bien el pronombre relativo posesivo?",
     "La investigadora cuyas conclusiones citamos estará presente.",["La investigadora que sus conclusiones citamos estará presente.","La investigadora cuya conclusiones citamos estará presente.","La investigadora cuyo conclusiones citamos estará presente."],"Cuyas agrees with the possessed noun conclusiones."],
    ["En 'Pudiera ser que no llegaran', 'pudiera' expresa...",
     "una posibilidad atenuada",["una orden directa","un hecho probado","una acción habitual del presente"],"Pudiera conveys a cautious possibility in this construction."],
    ["¿Qué reemplaza mejor 'por lo tanto' sin cambiar la relación lógica?",
     "en consecuencia",["no obstante","aun cuando","en cambio"],"Both introduce a consequence."],
    ["¿Qué significa 'no dar abasto'?",
     "no poder atender todas las tareas",["disponer de tiempo de sobra","abandonar voluntariamente un plan","saber exactamente la respuesta"],"No dar abasto means being unable to cope with the workload."],
    ["¿Qué significa 'dejar entrever' en un comentario?",
     "insinuar sin afirmarlo directamente",["desmentir de manera explícita","prometer por escrito","resumir con cifras"],"Dejar entrever is to hint or suggest."],
    ["¿Cuál es una reformulación diplomática de 'Estás equivocado'?",
     "Quizá convendría revisar ese punto.",["Eso es una tontería.","No sabes de qué hablas.","Estás totalmente perdido."],"C1 register includes tactful reformulation."],
    ["¿Qué aporta 'sin perjuicio de' en un texto formal?",
     "indica que algo se mantiene sin impedir otra posibilidad",["expresa un daño material ya probado","indica una prohibición absoluta","introduce una enumeración cronológica"],"It preserves another provision or possibility."],
    ["Selecciona la frase con puntuación de inciso adecuada.",
     "La propuesta, según el informe, es viable.",["La propuesta según el informe, es viable.","La propuesta, según el informe es viable.","La propuesta según, el informe es viable."],"An inserted parenthetical phrase is enclosed by commas."],
    ["El autor afirma que la solución es «viable, si bien costosa». ¿Qué implica?",
     "Es posible, pero su coste supone una dificultad.",["No es posible bajo ninguna circunstancia.","Su coste es irrelevante.","No existen datos sobre su viabilidad."],"Si bien introduces a reservation."]
  ];
  c1Choices.forEach(([prompt,ans,opts,why])=>choice(5,prompt,ans,opts,why));

  const c1Orth=[
    ["qué","Aún no sabemos ___ decisión tomará el comité."],
    ["cómo","No explicaron ___ se había obtenido el resultado."],
    ["cuándo","Nadie precisó ___ entrarían en vigor los cambios."],
    ["dónde","Desconocemos ___ se celebrará la reunión."],
    ["más","Es posible que necesitemos ___ tiempo."],
    ["aún","Los participantes no han llegado ___."],
    ["sí","A pesar de las dudas, ella dijo que ___."],
    ["sé","Yo no ___ si el documento está completo."],
    ["dé","Conviene que usted ___ una respuesta."],
    ["tú","Solo ___ puedes autorizar el acceso."],
    ["mí","Este documento está dirigido a ___."]
  ];
  c1Orth.forEach(([ans,prompt])=>type(5,"Escribe únicamente la palabra que falta: "+prompt,ans,
    "Orthographic accents change meaning and are mandatory."));

  // C2: reading subtext, pragmatic force, nuanced connector and register selection.
  const c2Choices=[
    ["«La medida no carece de méritos, pero dista de ser suficiente». ¿Cuál es la postura?",
     "Reconoce aspectos positivos, aunque la considera insuficiente.",["La rechaza por completo, sin reconocer nada.","La aprueba sin reservas.","Considera que no se ha evaluado todavía."],"The double negation and reservation qualify the judgment."],
    ["«No me parece desacertado reconsiderarlo». ¿Qué comunica principalmente?",
     "Una aprobación cautelosa de revisarlo.",["Una prohibición terminante de revisarlo.","Una celebración entusiasta y sin reservas.","Una afirmación de que ya se ha revisado."],"Litotes softens an affirmative position."],
    ["«Los resultados, lejos de invalidar la hipótesis, la matizan». ¿Qué sostiene el autor?",
     "Los datos introducen precisiones sin refutarla.",["La hipótesis ha sido refutada definitivamente.","No existe ninguna hipótesis.","Los resultados carecen por completo de interés."],"Matizar means qualify or refine."],
    ["«Al parecer, la rectificación llegó a destiempo». ¿Qué indica 'al parecer'?",
     "Que el hablante no presenta la información como absolutamente comprobada.",["Que el hablante fue testigo directo y afirma certeza total.","Que la rectificación se hizo a tiempo.","Que se trata de una orden."],"Al parecer is an evidential marker of attribution or uncertainty."],
    ["El informe «sugiere» una relación, pero no «demuestra» causalidad. ¿Qué diferencia es clave?",
     "Una inferencia plausible no equivale a una prueba concluyente.",["Ambos verbos afirman exactamente el mismo grado de certeza.","Toda correlación demuestra causalidad.","Ningún resultado puede ser interpretado."],"C2 requires distinguishing epistemic strength."],
    ["«Convendría revisar el presupuesto» en una reunión formal es, sobre todo...",
     "una recomendación formulada con cortesía",["un mandato militar","una constatación del pasado","una definición técnica"],"The conditional softens a recommendation."],
    ["¿Qué conector corrige la orientación del argumento anterior? «No se trata de un error de cálculo; ___, es una discrepancia metodológica».",
     "antes bien",["por ende","de resultas","asimismo"],"Antes bien presents a correcting contrast."],
    ["¿Qué conector mantiene el sentido? «Se revisaron todos los expedientes; ___, no se hallaron irregularidades».",
     "aun así",["por cuanto","a saber","de ahí que"],"Aun así introduces an unexpected result, despite prior information."],
    ["«La explicación es verosímil, pero no fehaciente». ¿Qué diferencia destaca?",
     "Parece creíble, pero no está acreditada de forma fiable.",["Es imposible y está refutada.","Está plenamente documentada y demostrada.","Es irrelevante por definición."],"Verosímil describes plausibility; fehaciente, reliable proof."],
    ["En un dictamen, «se desprende del expediente» equivale a...",
     "se infiere de los documentos",["se elimina del expediente","se adjunta sin analizar","se oculta deliberadamente"],"Desprenderse de can indicate a conclusion derived from evidence."],
    ["«No ya por la forma, sino por el fondo». ¿Cuál es la oposición central?",
     "No se critica solo la presentación, sino el contenido esencial.",["Se aprueba tanto la forma como el fondo.","Solo se cuestiona la estética.","No existe ninguna objeción."],"The construction shifts focus from form to substance."],
    ["«La propuesta peca de voluntarismo». ¿Qué objeción contiene?",
     "Confía demasiado en la voluntad sin atender suficientemente a los límites reales.",["Carece de cualquier intención positiva.","Es una propuesta obligatoria por ley.","Es exclusivamente una cuestión de estilo."],"Voluntarismo here suggests wishful confidence detached from constraints."],
    ["¿Cuál expresa una reserva académica apropiada?",
     "Los hallazgos permiten formular la hipótesis, aunque no confirmarla.",["Los hallazgos resuelven para siempre cualquier discusión.","Todo el mundo sabe que es así.","Resulta imposible cuestionar nuestras conclusiones."],"Academic caution separates evidence from certainty."],
    ["«Dicho sea de paso» introduce...",
     "un comentario lateral o incidental",["una conclusión necesaria","una obligación formal","una causa física"],"This discourse marker flags an aside."],
    ["«A la postre, la negociación fracasó». ¿Qué significa 'a la postre'?",
     "finalmente",["al principio","por casualidad","de forma inmediata"],"A la postre means in the end."],
    ["«El argumento hace agua» significa que...",
     "presenta debilidades importantes",["está muy bien fundamentado","se refiere literalmente a la lluvia","ha sido aprobado por unanimidad"],"Hacer agua figuratively signals a weak or failing argument."],
    ["¿Qué verbo significa examinar una cuestión compleja para esclarecerla?",
     "dilucidar",["soslayar","acatar","prodigar"],"Dilucidar is to clarify a difficult matter."],
    ["¿Qué significa 'soslayar' un problema?",
     "evitar tratarlo directamente",["resolverlo por completo","documentarlo de forma exhaustiva","celebrarlo públicamente"],"Soslayar implies sidestepping."],
    ["¿Qué significa 'desestimar' un recurso?",
     "rechazarlo tras examinarlo",["aceptarlo inmediatamente","dejarlo sin presentar","dividirlo en varias partes"],"Desestimar is to reject a petition or appeal."],
    ["«La justificación resulta endeble». ¿Qué adjetivo es equivalente en este contexto?",
     "débil",["irrefutable","rotunda","exhaustiva"],"Endeble characterises a weak justification."],
    ["La expresión «a todas luces» equivale a...",
     "de manera evidente",["sin que nadie se dé cuenta","solo durante el día","de forma provisional"],"A todas luces conveys evidentness."],
    ["«La norma se aplicará, salvo que concurra una excepción». ¿Qué impone 'salvo que'?",
     "una condición que puede impedir la aplicación",["la causa ya demostrada de la aplicación","un resumen de la norma","una comparación entre personas"],"Salvo que introduces a condition of exception."],
    ["¿Qué oración muestra el sentido de 'con independencia de que'?",
     "El criterio se aplicará con independencia de que las partes estén de acuerdo.",["El criterio se aplicará porque las partes estarán de acuerdo.","El criterio se aplicará para que las partes estuvieron de acuerdo.","El criterio se aplicará de que las partes están de acuerdo."],"This expression presents a circumstance that does not alter the result."],
    ["«A falta de una solución definitiva, se adoptó una medida provisional». ¿Qué implica?",
     "No existía una solución definitiva en ese momento.",["La solución definitiva ya había sido implantada.","La medida provisional fue rechazada.","No se consideraron alternativas."],"A falta de denotes absence."],
    ["¿Qué uso es correcto en ortografía académica?",
     "No sé por qué no vino.",["No sé porque no vino.","No sé porqué no vino.","No sé por que no vino."],"Indirect questions take por qué, written separately with an accent."],
    ["¿Qué oración usa correctamente el contraste 'sino'?",
     "No pidió dinero, sino información.",["No pidió dinero, si no información.","No pidió dinero; sí no información.","No pidió dinero si nó información."],"Sino contrasts a negated element with its replacement."],
    ["¿Qué oración usa correctamente 'si no' como condición?",
     "Si no respondes, asumirán que aceptas.",["Sino respondes, asumirán que aceptas.","Síno respondes, asumirán que aceptas.","Si nó respondes, asumirán que aceptas."],"Si no is a conditional conjunction plus negative adverb."],
    ["¿Qué oración distingue un complemento relativo correctamente?",
     "Se entrevistó a la autora cuya novela fue premiada.",["Se entrevistó a la autora que su novela fue premiada.","Se entrevistó a la autora cuyo novela fue premiada.","Se entrevistó a la autora cual novela fue premiada."],"Cuya agrees with novela."],
    ["«No es que dude de tu palabra; es que necesito pruebas». ¿Qué estrategia discursiva usa?",
     "Atenúa una posible acusación antes de justificar una exigencia.",["Niega tener cualquier exigencia.","Confirma que el interlocutor miente.","Cierra la discusión sin argumentos."],"It anticipates and softens an interpretation."],
    ["«No dejó de sorprenderme que lo aceptaran». ¿Cuál es la lectura más precisa?",
     "Le sorprendió que lo aceptaran.",["No le sorprendió en absoluto.","Le impidieron sorprenderse.","No sabe si se aceptó."],"No dejar de + infinitive can affirm the occurrence of an experience."],
    ["«Si algo quedó patente, fue la falta de consenso». ¿Qué se enfatiza?",
     "Que la falta de consenso resultó evidente.",["Que había acuerdo unánime.","Que el consenso no era relevante.","Que no se discutió ninguna propuesta."],"A focus construction highlights the key finding."],
    ["«La reforma no está exenta de riesgos». ¿Qué se afirma?",
     "La reforma conlleva riesgos.",["La reforma carece por completo de riesgos.","La reforma es ilegal.","La reforma ha sido cancelada."],"Not exempt from risk implies that risk exists."],
    ["«Se concedió la ayuda a regañadientes». ¿Qué actitud se indica?",
     "con resistencia o desgana",["con entusiasmo","por error matemático","sin que nadie lo pidiera"],"A regañadientes indicates reluctance."],
    ["«El informe omite deliberadamente una salvedad». ¿Qué es una 'salvedad'?",
     "una excepción o precisión que limita lo afirmado",["una felicitación pública","un dato inventado sin relación","un sinónimo de introducción"],"A salvedad qualifies the scope of a statement."],
    ["¿Qué expresión denota una conclusión tentativa, no definitiva?",
     "A juzgar por los indicios...",["Queda demostrado sin posibilidad de error...","Es imposible concebir otra explicación...","No cabe ninguna duda en absoluto..."],"A juzgar por los indicios signals inference."],
    ["«Nadie lo habría previsto, y menos aún con tanta antelación». ¿Qué se subraya?",
     "La improbabilidad de una previsión tan temprana.",["La certeza de la previsión.","Que todos lo previeron a tiempo.","Que la antelación era irrelevante."],"Y menos aún intensifies the improbability."]
  ];
  c2Choices.forEach(([prompt,ans,opts,why])=>choice(6,prompt,ans,opts,why));

  const c2Type=[
    ["por qué","Nadie aclaró ___ se había alterado el orden del día."],
    ["porque","No se aprobó el texto ___ faltaba una firma."],
    ["porqué","Desconocemos el ___ de aquella modificación."],
    ["sino","No se solicitó una disculpa, ___ una rectificación."],
    ["si no","___ consta una excepción, se aplicará la norma general."],
    ["aún","Los resultados no se han hecho públicos ___."],
    ["aun","___ con suficientes recursos, el proyecto sería difícil."],
    ["más","La propuesta requiere ___ pruebas para prosperar."],
    ["mas","El planteamiento era razonable, ___ insuficiente."],
    ["sí","No afirmó que ___ hasta conocer los detalles."],
    ["si","Ignoramos ___ el tribunal ha resuelto el asunto."],
    ["sé","Todavía no ___ cuáles son los criterios finales."],
    ["se","El acuerdo ___ alcanzó por unanimidad."],
    ["dé","Es preciso que el portavoz ___ explicaciones."],
    ["de","El informe ___ la comisión se publicará mañana."],
    ["qué","El ponente no aclaró ___ criterios había aplicado."],
    ["que","La razón es ___ no existen datos suficientes."],
    ["cómo","El documento explica ___ se llegó a esa conclusión."],
    ["como","El documento se interpretó ___ una recomendación, no como una orden."],
    ["cuál","No se indicó ___ de las alternativas era preferible."],
    ["cuándo","No consta ___ se comunicarán los resultados."],
    ["quién","Nadie ha aclarado ___ autorizó el cambio."],
    ["dónde","Los responsables no precisaron ___ se archivaron los documentos."],
    ["dé","Solicito que se me ___ una copia del expediente."],
    ["aún","Pese a la reunión, ___ persisten discrepancias."]
  ];
  c2Type.forEach(([ans,prompt])=>type(6,"Completa con la palabra exacta (incluidas las tildes): "+prompt,ans,
    "At advanced level, diacritical accents encode a grammatical distinction."));

  // Interpret originals rather than requiring free-text opinion grading.
  const readings=[
    ["El análisis revela una asociación sólida entre las variables; no obstante, los autores advierten de que la selección de la muestra impide generalizar los resultados.",
     "¿Qué limitación reconocen los autores?",
     "Que no es posible extrapolar los resultados a cualquier población.",
     ["Que no existe ninguna asociación estadística.","Que la muestra es necesariamente representativa.","Que la relación causal ya ha sido demostrada."],
     "A sampling caveat limits generalisation."],
    ["Aunque la propuesta fue recibida con entusiasmo, la comisión se abstuvo de aprobarla hasta contar con una evaluación independiente. La prudencia, más que el rechazo, explica la demora.",
     "¿Cuál es la interpretación más fiel de la demora?",
     "Se aplazó la aprobación por cautela, no por una oposición definitiva.",
     ["La comisión rechazó formalmente la propuesta.","La evaluación independiente ya estaba completa.","La propuesta nunca despertó interés."],
     "The text explicitly distinguishes prudence from rejection."],
    ["La portavoz aseguró que el acuerdo estaba encarrilado, si bien reconoció que aún quedaban flecos por resolver. Evitó, sin embargo, comprometerse con un calendario.",
     "¿Qué se puede inferir de la intervención?",
     "Hay avances, pero no existe aún un compromiso de fecha.",
     ["El acuerdo ya se ha firmado.","No existe ninguna negociación.","La portavoz garantizó una fecha concreta."],
     "Encarrilado suggests progress, while the missing timetable limits certainty."],
    ["En su reseña, el crítico alaba la destreza técnica del autor, pero cuestiona que la proliferación de recursos expresivos contribuya a una mayor claridad. La brillantez formal termina, a su juicio, por eclipsar el argumento.",
     "¿Cuál es la valoración central?",
     "El virtuosismo estilístico perjudica la claridad del razonamiento.",
     ["La argumentación es ejemplar por su sencillez.","El autor carece de recursos expresivos.","El crítico rechaza toda calidad técnica."],
     "The review separates technical skill from discursive effectiveness."],
    ["El tribunal no cuestionó la legalidad del procedimiento; se limitó a señalar que la motivación ofrecida para justificar la medida no era suficiente. De ahí que ordenase una nueva resolución debidamente fundamentada.",
     "¿Qué aspecto se considera insuficiente?",
     "La justificación argumentada de la medida.",
     ["La existencia misma del tribunal.","La validez de todas las normas aplicables.","La identidad de quienes participaron."],
     "Motivación refers to the reasoning offered in support of a decision."],
    ["Se propuso un sistema que, aun siendo técnicamente viable, podía agravar las desigualdades de acceso. Por ello, el informe recomendó someterlo a una prueba piloto antes de extenderlo.",
     "¿Qué pondera el informe?",
     "La viabilidad técnica frente a sus posibles efectos distributivos.",
     ["Únicamente la rapidez de implantación.","Solo el atractivo estético del sistema.","La imposibilidad absoluta de realizar pruebas."],
     "The analysis weighs feasibility against equity."],
    ["El artículo no niega que la tecnología amplíe las posibilidades de comunicación; sostiene, más bien, que dichas posibilidades no garantizan por sí solas un diálogo fructífero.",
     "¿Qué contraste establece?",
     "Tener más medios de comunicación no asegura una mejor conversación.",
     ["La tecnología impide toda comunicación.","La comunicación es idéntica al diálogo.","No existen nuevas posibilidades tecnológicas."],
     "The argument distinguishes opportunity from actual outcome."],
    ["La autora se muestra escéptica ante una solución presentada como universal. A su entender, la heterogeneidad de los contextos exige introducir matices que el modelo original pasa por alto.",
     "¿Por qué cuestiona la solución?",
     "Porque no considera suficientemente las diferencias entre contextos.",
     ["Porque no tiene ninguna aplicación posible.","Porque los contextos son siempre idénticos.","Porque la autora rechaza el uso de modelos en general."],
     "A universal proposal may ignore context-dependent conditions."],
    ["El anuncio fue interpretado inicialmente como una rectificación, aunque la institución insistió después en que se trataba únicamente de una aclaración sin cambio de criterio.",
     "¿Dónde reside la diferencia de interpretación?",
     "En si hubo un cambio de postura o solo una precisión de lo ya dicho.",
     ["En qué día se celebró la reunión.","En el número de documentos publicados.","En si el anuncio se hizo de manera oral."],
     "Rectificar changes a position; aclarar clarifies it."],
    ["El estudio documenta una disminución del consumo, pero sus autores se abstienen de atribuirla exclusivamente a la campaña informativa, habida cuenta de que durante el mismo periodo se adoptaron otras medidas.",
     "¿Por qué evitan atribuir un efecto exclusivo a la campaña?",
     "Porque intervinieron otros factores al mismo tiempo.",
     ["Porque el consumo aumentó.","Porque no se midió ninguna variable.","Porque la campaña se realizó después del estudio."],
     "The simultaneous measures prevent an exclusive causal attribution."]
  ];
  readings.forEach(([text,prompt,ans,options,why])=>choice(6,
    "Lee y deduce: «"+text+"» "+prompt,ans,options,why));

  const all=Object.freeze(items);
  return Object.freeze({all,counts:()=>[3,4,5,6].map(level=>all.filter(q=>q.level===level).length)});
})();
