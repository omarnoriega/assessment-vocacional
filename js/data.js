/**
 * data.js
 * Datos estáticos del assessment vocacional.
 * Contiene: inteligencias, preguntas, mapa de puntaje,
 * carreras recomendadas y perfiles de personalidad.
 *
 * Basado en la Teoría de las Inteligencias Múltiples
 * de Howard Gardner (1983).
 */

'use strict';

// ── Las 8 Inteligencias ──────────────────────────────────────────────────────
const INTELLIGENCES = [
  { id:'LI', name:'Lingüística',           emoji:'📚', color:'#6c63ff', desc:'Manejo del lenguaje oral y escrito' },
  { id:'LM', name:'Lógico-Matemática',     emoji:'🔢', color:'#43e8c2', desc:'Razonamiento lógico y numérico' },
  { id:'ES', name:'Espacial',              emoji:'🎨', color:'#ff6b9d', desc:'Visualización y pensamiento en 3D' },
  { id:'MU', name:'Musical',               emoji:'🎵', color:'#f7b731', desc:'Sensibilidad al ritmo y melodía' },
  { id:'CK', name:'Corporal-Kinestésica',  emoji:'🏃', color:'#ff9f43', desc:'Coordinación y habilidad física' },
  { id:'NA', name:'Naturalista',           emoji:'🌿', color:'#1dd1a1', desc:'Comprensión del mundo natural' },
  { id:'IP', name:'Interpersonal',         emoji:'🤝', color:'#fd9644', desc:'Empatía y relaciones sociales' },
  { id:'IT', name:'Intrapersonal',         emoji:'🧘', color:'#a29bfe', desc:'Autoconocimiento y reflexión' },
];

// ── 40 Preguntas (5 por inteligencia) ───────────────────────────────────────
const QUESTIONS = [
  // LINGÜÍSTICA
  { id:1,  intel:'LI', text:'Cuando tienes que explicar algo complicado a un amigo, prefieres...', opts:['Escribirlo con detalle en un mensaje','Dibujarlo o hacer un esquema visual','Mostrarlo con un ejemplo físico o actuado','Decirlo de viva voz improvisando'] },
  { id:2,  intel:'LI', text:'¿Cuál de estas actividades disfrutas más en tu tiempo libre?', opts:['Leer libros, blogs o artículos','Resolver rompecabezas o juegos de lógica','Escuchar música o tocar un instrumento','Hacer deporte o manualidades'] },
  { id:3,  intel:'LI', text:'Al presentar un trabajo escolar, lo que más te importa es...', opts:['Que el texto sea claro y bien redactado','Que los datos y cifras sean precisos','Que el diseño visual sea atractivo','Que la presentación oral sea fluida'] },
  { id:4,  intel:'LI', text:'Si pudieras elegir un club escolar, elegirías...', opts:['Club de debate o periodismo escolar','Club de matemáticas o programación','Club de teatro o danza','Club de ecología o naturaleza'] },
  { id:5,  intel:'LI', text:'Aprendes mejor cuando el profesor...', opts:['Explica con historias y metáforas','Usa fórmulas, gráficas y ejercicios','Hace maquetas o mapas mentales visuales','Propone experimentos o salidas de campo'] },

  // LÓGICO-MATEMÁTICA
  { id:6,  intel:'LM', text:'Ante un problema nuevo, tu primer instinto es...', opts:['Buscar un patrón o regla general','Pedir opinión a varias personas','Confiar en tu intuición y sentir','Observar la naturaleza para inspirarte'] },
  { id:7,  intel:'LM', text:'¿Cuál de estos juegos o aplicaciones te divierte más?', opts:['Sudoku, ajedrez o juegos de estrategia','Karaoke o juegos de ritmo','Videojuegos de acción y habilidad física','Trivia o crucigramas de palabras'] },
  { id:8,  intel:'LM', text:'Si tuvieras que organizar un evento, priorizarías...', opts:['Crear un presupuesto y cronograma detallado','Diseñar la decoración y la estética','Coordinar a las personas y animar el ambiente','Elegir la música y la ambientación sonora'] },
  { id:9,  intel:'LM', text:'Tu reacción al ver noticias de ciencia es...', opts:['Analizar las cifras y estadísticas','Ver si hay un impacto ambiental','Preguntarte qué sientes al respecto','Compartirlo y discutirlo con amigos'] },
  { id:10, intel:'LM', text:'¿Qué asignatura disfrutas más?', opts:['Matemáticas o Física','Lengua y Literatura','Educación Física o Arte','Biología o Geografía'] },

  // ESPACIAL
  { id:11, intel:'ES', text:'Cuando lees instrucciones, prefieres...', opts:['Ver un diagrama o ilustración paso a paso','Leer el texto detalladamente','Que alguien te lo explique en persona','Escuchar un audio o podcast'] },
  { id:12, intel:'ES', text:'En un viaje nuevo, tú normalmente...', opts:['Memorizas el mapa mentalmente sin perderte','Preguntas a la gente del lugar','Sigues las indicaciones del GPS sin más','Prefieres ir descubriendo sin planear'] },
  { id:13, intel:'ES', text:'Si tienes que decorar tu cuarto, lo que más disfrutas es...', opts:['Diseñar la distribución y combinación de colores','Calcular el espacio y las medidas exactas','Poner música de fondo mientras lo haces','Hacerlo con amigos o familia'] },
  { id:14, intel:'ES', text:'¿Cuál de estos proyectos te entusiasma más?', opts:['Diseñar un videojuego o aplicación visualmente','Escribir un guion o historia','Coreografiar un baile o rutina de ejercicio','Criar plantas o animales'] },
  { id:15, intel:'ES', text:'Al ver una película, lo que más te llama la atención es...', opts:['La fotografía, los colores y el diseño visual','La historia y los diálogos','La banda sonora y los efectos de sonido','Los escenarios naturales y paisajes'] },

  // MUSICAL
  { id:16, intel:'MU', text:'Cuando estudias, habitualmente...', opts:['Pones música de fondo que te ayuda a concentrarte','Necesitas silencio absoluto','Te mueves o cambias de postura con frecuencia','Organizas el espacio visualmente antes de empezar'] },
  { id:17, intel:'MU', text:'Si escuchas una canción nueva, lo primero que notas es...', opts:['El ritmo y los instrumentos','La letra y las palabras','Las emociones que te genera','El género y estilo musical'] },
  { id:18, intel:'MU', text:'¿Cuál de estos talentos te gustaría desarrollar?', opts:['Componer o producir música','Escribir poesía o narrativa','Bailar o hacer artes marciales','Fotografiar o editar vídeo'] },
  { id:19, intel:'MU', text:'En un trabajo grupal, sueles ser quien...', opts:['Propone un jingle o dinámica sonora para presentar','Redacta el informe final','Presenta de forma oral y anima al grupo','Organiza el cronograma y distribuye tareas'] },
  { id:20, intel:'MU', text:'¿Cómo procesas mejor una emoción fuerte?', opts:['Escuchando o tocando música','Escribiendo en un diario','Haciendo actividad física intensa','Hablándolo con alguien de confianza'] },

  // CORPORAL-KINESTÉSICA
  { id:21, intel:'CK', text:'Para aprender algo nuevo, prefieres...', opts:['Hacerlo con tus propias manos o practicarlo directamente','Leer un manual o tutorial escrito','Ver un vídeo explicativo','Que alguien te guíe mientras lo haces'] },
  { id:22, intel:'CK', text:'¿Qué actividad te da más satisfacción?', opts:['Terminar un entrenamiento deportivo o de baile','Resolver un problema matemático complejo','Crear una obra artística o musical','Comprender un concepto filosófico difícil'] },
  { id:23, intel:'CK', text:'En tus tiempos libres, tienes tendencia a...', opts:['Moverte, no puedes estar quieto mucho tiempo','Quedarte leyendo o escribiendo','Buscar grupos para conversar y socializar','Observar la naturaleza o tus alrededores'] },
  { id:24, intel:'CK', text:'¿Cuál de estos trabajos te imaginas haciendo felizmente?', opts:['Cirujano, fisioterapeuta o entrenador deportivo','Ingeniero, programador o analista','Maestro, psicólogo o trabajador social','Biólogo, geólogo o veterinario'] },
  { id:25, intel:'CK', text:'Cuando alguien te explica algo, comprendes mejor si...', opts:['Te permiten tocar, hacer o simular el proceso','Te dan un esquema escrito o gráfico','Te narran una historia o ejemplo real','Puedes escuchar grabaciones o ritmos'] },

  // NATURALISTA
  { id:26, intel:'NA', text:'En una excursión a la naturaleza, tú eres quien...', opts:['Identifica plantas, animales y observa el ecosistema','Fotografía los paisajes con composición artística','Lleva el mapa y organiza la ruta lógicamente','Mantiene el grupo unido y animado'] },
  { id:27, intel:'NA', text:'¿Cuál de estos temas te genera más curiosidad?', opts:['Cambio climático y conservación del medioambiente','Inteligencia artificial y tecnología','Historia del arte y culturas del mundo','Psicología y comportamiento humano'] },
  { id:28, intel:'NA', text:'Si tuvieras un proyecto de investigación libre, elegirías...', opts:['Estudiar la biodiversidad de un ecosistema local','Desarrollar un algoritmo o app útil','Investigar la historia de un movimiento artístico','Analizar patrones de comportamiento social'] },
  { id:29, intel:'NA', text:'¿Cómo describes tu relación con los animales y plantas?', opts:['Me fascinan, tiendo a cuidarlos y observarlos','Son interesantes pero no es mi mayor pasión','Me gustan los que tienen algo peculiar o bello','Prefiero relacionarme con personas'] },
  { id:30, intel:'NA', text:'Si vieras un problema ambiental en tu comunidad, tu primera reacción sería...', opts:['Investigar la causa raíz y buscar soluciones ecológicas','Diseñar una campaña visual para concientizar','Organizar un grupo de acción comunitaria','Calcular el impacto y proponer datos al municipio'] },

  // INTERPERSONAL
  { id:31, intel:'IP', text:'En un grupo de amigos, generalmente eres quien...', opts:['Media en los conflictos y escucha a todos','Propone ideas creativas o juegos','Analiza la situación antes de opinar','Se fija en los detalles del entorno'] },
  { id:32, intel:'IP', text:'¿Qué tipo de actividad te energiza más?', opts:['Trabajar con otras personas hacia un objetivo común','Crear algo de forma individual (escribir, programar, dibujar)','Estar en contacto con la naturaleza','Explorar ideas abstractas en solitario'] },
  { id:33, intel:'IP', text:'Cuando un amigo está triste, tú...', opts:['Te acercas, escuchas y ofreces apoyo emocional','Le das espacio y recursos útiles para resolver su problema','Le propones actividad física o salir a caminar','Lo entiendes desde la distancia sin intervenir mucho'] },
  { id:34, intel:'IP', text:'¿Cuál de estas profesiones te atrae más instintivamente?', opts:['Terapeuta, educador o trabajador social','Escritor, periodista o lingüista','Arquitecto, diseñador o fotógrafo','Científico, analista o ingeniero'] },
  { id:35, intel:'IP', text:'Para ti, el trabajo ideal es...', opts:['Colaborativo, con mucho contacto humano diario','Independiente, donde puedas crear a tu ritmo','Variado, en contacto con el mundo natural','Estructurado, con metas claras y datos medibles'] },

  // INTRAPERSONAL
  { id:36, intel:'IT', text:'¿Con qué frecuencia reflexionas sobre tus propias emociones y decisiones?', opts:['Con mucha frecuencia, es algo que hago naturalmente','Cuando lo necesito, pero no siempre','Prefiero actuar y ver qué pasa','Prefiero analizar hechos externos más que internos'] },
  { id:37, intel:'IT', text:'Cuando tomas decisiones importantes, confías principalmente en...', opts:['Tu intuición y valores personales','Un análisis lógico de pros y contras','La opinión y consejo de personas cercanas','Tus instintos y lo que sientes en el cuerpo'] },
  { id:38, intel:'IT', text:'¿Cuál de estos hábitos tienes o te gustaría tener?', opts:['Escribir un diario personal o meditar','Llevar un registro de metas y avances numéricos','Tener conversaciones profundas con otras personas','Pasar tiempo en la naturaleza para despejarte'] },
  { id:39, intel:'IT', text:'¿Cómo describirías tu relación contigo mismo?', opts:['Soy muy consciente de quién soy, mis límites y propósito','Soy práctico y me defino más por lo que hago','Soy social y me defino en relación a los demás','Soy curioso sobre el mundo exterior más que el interior'] },
  { id:40, intel:'IT', text:'Ante un error o fracaso, tu reacción típica es...', opts:['Reflexionar profundamente sobre qué aprender de ello','Analizar qué salió mal con datos concretos','Buscar apoyo y hablar con alguien','Retomarlo físicamente con más energía'] },
];

/**
 * Mapa de puntaje por pregunta.
 * Cada entrada es un array de 4 pares [inteligencia, puntos]
 * correspondientes a las 4 opciones de respuesta (índice 0–3).
 * Puntos posibles: 3 (respuesta principal), 2 (secundaria), 1 (terciaria).
 * Máximo por inteligencia: 5 preguntas × 3 pts = 15 pts.
 */
const SCORE_MAP = {
  1:  [['LI',3],['ES',2],['CK',1],['LI',2]],
  2:  [['LI',3],['LM',2],['MU',2],['CK',2]],
  3:  [['LI',3],['LM',2],['ES',2],['IP',1]],
  4:  [['LI',3],['LM',2],['CK',2],['NA',2]],
  5:  [['LI',3],['LM',2],['ES',2],['NA',2]],
  6:  [['LM',3],['IP',2],['IT',2],['NA',2]],
  7:  [['LM',3],['MU',2],['CK',2],['LI',2]],
  8:  [['LM',3],['ES',2],['IP',2],['MU',2]],
  9:  [['LM',3],['NA',2],['IT',2],['IP',2]],
  10: [['LM',3],['LI',2],['CK',2],['NA',2]],
  11: [['ES',3],['LI',2],['IP',2],['MU',1]],
  12: [['ES',3],['IP',2],['LM',2],['IT',2]],
  13: [['ES',3],['LM',2],['MU',2],['IP',2]],
  14: [['ES',3],['LI',2],['CK',2],['NA',2]],
  15: [['ES',3],['LI',2],['MU',2],['NA',2]],
  16: [['MU',3],['LM',2],['CK',2],['ES',2]],
  17: [['MU',3],['LI',2],['IT',2],['MU',2]],
  18: [['MU',3],['LI',2],['CK',2],['ES',2]],
  19: [['MU',2],['LI',2],['IP',3],['LM',2]],
  20: [['MU',3],['LI',2],['CK',2],['IP',2]],
  21: [['CK',3],['LI',2],['ES',2],['IP',2]],
  22: [['CK',3],['LM',2],['ES',2],['LI',2]],
  23: [['CK',3],['LI',2],['IP',2],['NA',2]],
  24: [['CK',3],['LM',2],['IP',2],['NA',2]],
  25: [['CK',3],['ES',2],['LI',2],['MU',2]],
  26: [['NA',3],['ES',2],['LM',2],['IP',2]],
  27: [['NA',3],['LM',2],['ES',2],['IP',2]],
  28: [['NA',3],['LM',2],['ES',2],['IP',2]],
  29: [['NA',3],['LM',2],['ES',2],['IP',2]],
  30: [['NA',3],['ES',2],['IP',2],['LM',2]],
  31: [['IP',3],['ES',2],['LM',2],['NA',2]],
  32: [['IP',3],['LM',2],['NA',2],['IT',2]],
  33: [['IP',3],['LM',2],['CK',2],['IT',2]],
  34: [['IP',3],['LI',2],['ES',2],['LM',2]],
  35: [['IP',3],['LI',2],['NA',2],['LM',2]],
  36: [['IT',3],['IP',2],['LM',2],['LI',2]],
  37: [['IT',3],['LM',2],['IP',2],['CK',2]],
  38: [['IT',3],['LM',2],['IP',2],['NA',2]],
  39: [['IT',3],['LM',2],['IP',2],['NA',2]],
  40: [['IT',3],['LM',2],['IP',2],['CK',2]],
};

// ── Carreras recomendadas ────────────────────────────────────────────────────
const CAREERS = [
  { name:'Periodismo & Comunicación', icon:'✍️', intel:['LI','IP'], color:'#6c63ff' },
  { name:'Derecho & Abogacía',         icon:'⚖️', intel:['LI','LM'], color:'#6c63ff' },
  { name:'Lingüística & Traducción',   icon:'🌐', intel:['LI','IT'], color:'#6c63ff' },
  { name:'Ingeniería de Software',     icon:'💻', intel:['LM','ES'], color:'#43e8c2' },
  { name:'Matemáticas & Estadística',  icon:'📐', intel:['LM','IT'], color:'#43e8c2' },
  { name:'Economía & Finanzas',        icon:'📈', intel:['LM','IP'], color:'#43e8c2' },
  { name:'Arquitectura & Diseño',      icon:'🏛️', intel:['ES','LM'], color:'#ff6b9d' },
  { name:'Diseño Gráfico & UX',        icon:'🖌️', intel:['ES','LI'], color:'#ff6b9d' },
  { name:'Fotografía & Cine',          icon:'🎬', intel:['ES','MU'], color:'#ff6b9d' },
  { name:'Producción Musical',         icon:'🎹', intel:['MU','CK'], color:'#f7b731' },
  { name:'Musicoterapia',              icon:'🎶', intel:['MU','IP'], color:'#f7b731' },
  { name:'Medicina & Cirugía',         icon:'🏥', intel:['CK','LM'], color:'#ff9f43' },
  { name:'Educación Física & Deporte', icon:'🏅', intel:['CK','IP'], color:'#ff9f43' },
  { name:'Fisioterapia & Kinesiología',icon:'🦾', intel:['CK','NA'], color:'#ff9f43' },
  { name:'Biología & Ecología',        icon:'🔬', intel:['NA','LM'], color:'#1dd1a1' },
  { name:'Medicina Veterinaria',       icon:'🐾', intel:['NA','IP'], color:'#1dd1a1' },
  { name:'Ingeniería Ambiental',       icon:'🌱', intel:['NA','LM'], color:'#1dd1a1' },
  { name:'Psicología',                 icon:'🧠', intel:['IP','IT'], color:'#fd9644' },
  { name:'Trabajo Social',             icon:'🤲', intel:['IP','NA'], color:'#fd9644' },
  { name:'Pedagogía & Educación',      icon:'📖', intel:['IP','LI'], color:'#fd9644' },
  { name:'Filosofía',                  icon:'💭', intel:['IT','LI'], color:'#a29bfe' },
  { name:'Escritura Creativa',         icon:'🖊️', intel:['IT','LI'], color:'#a29bfe' },
  { name:'Investigación Científica',   icon:'🔭', intel:['IT','LM'], color:'#a29bfe' },
];

// ── Perfiles dominantes ──────────────────────────────────────────────────────
const PROFILES = [
  { id:'LI', label:'El Comunicador',      icon:'✍️', desc:'Tienes una habilidad natural para el lenguaje. Las palabras son tu herramienta más poderosa; persuades, narras y conectas a través de ellas.' },
  { id:'LM', label:'El Analítico',        icon:'🔢', desc:'Tu mente busca patrones y lógica en todo. Eres un resolvedor de problemas nato que disfruta de la precisión y el razonamiento estructurado.' },
  { id:'ES', label:'El Creativo Visual',  icon:'🎨', desc:'Piensas en imágenes y espacios. Tu imaginación espacial te permite ver el mundo de forma que otros no pueden; eres diseñador por naturaleza.' },
  { id:'MU', label:'El Artista Sensorial',icon:'🎵', desc:'El sonido y el ritmo son tu lenguaje. Percibes el mundo a través de los sentidos con una profundidad emocional que pocos alcanzan.' },
  { id:'CK', label:'El Hacedor',          icon:'🏃', desc:'Aprendes haciendo. Tu cuerpo es tu mejor herramienta de conocimiento y tu capacidad física e impulsividad práctica te llevan lejos.' },
  { id:'NA', label:'El Explorador Natural',icon:'🌿',desc:'La naturaleza es tu classroom. Tienes un don especial para observar, clasificar y comprender los sistemas vivos del planeta.' },
  { id:'IP', label:'El Conector',         icon:'🤝', desc:'Las personas son tu mundo. Empatizas, lides y construyes relaciones con una facilidad que inspira a quienes te rodean.' },
  { id:'IT', label:'El Reflexivo',        icon:'🧘', desc:'Tu mayor fortaleza es tu mundo interior. Tienes una conciencia de ti mismo poco común y una capacidad de introspección que guía tus decisiones.' },
];
