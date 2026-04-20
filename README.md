# Assessment Vocacional - Inteligencias Multiples

Herramienta de orientacion academica para estudiantes de secundaria basada en la
**Teoria de las Inteligencias Multiples de Howard Gardner (1983)**. A traves de
40 preguntas de seleccion multiple, evalua el perfil cognitivo del estudiante y
genera recomendaciones de carrera alineadas a sus fortalezas.

---

## Estructura del proyecto

```
assessment-vocacional/
|
|-- index.html          - Estructura HTML semantica
|-- css/
|   +-- styles.css      - Estilos, variables y animaciones
|-- js/
|   |-- data.js         - Datos estaticos (inteligencias, preguntas, carreras)
|   |-- assessment.js   - Logica de estado, scoring y visualizaciones
|   +-- pdf-export.js   - Generacion del reporte PDF con jsPDF
+-- README.md
```

---

## Uso

Abre `index.html` en cualquier navegador moderno. No requiere instalacion ni servidor.

---

## Metodologia de Evaluacion

### 1. Las 8 Inteligencias

El instrumento evalua las ocho inteligencias definidas por Howard Gardner,
identificadas en el sistema mediante un codigo de dos letras:

| Codigo | Inteligencia             | Descripcion                                                          |
|--------|--------------------------|----------------------------------------------------------------------|
| LI     | Linguistica              | Habilidad para el lenguaje oral y escrito, narracion y argumentacion |
| LM     | Logico-Matematica        | Razonamiento abstracto, patrones numericos y pensamiento analitico   |
| ES     | Espacial                 | Visualizacion mental, orientacion en el espacio y pensamiento en 3D  |
| MU     | Musical                  | Sensibilidad al ritmo, tono y estructura sonora                      |
| CK     | Corporal-Kinestesica     | Coordinacion motriz, aprendizaje tactil y habilidad fisica           |
| NA     | Naturalista              | Reconocimiento y clasificacion de patrones en el entorno natural     |
| IP     | Interpersonal            | Empatia, liderazgo y comprension de las emociones ajenas            |
| IT     | Intrapersonal            | Autoconocimiento, introspeccion y regulacion emocional propia        |

---

### 2. Agrupacion de preguntas por inteligencia

El assessment contiene **40 preguntas**, distribuidas en **5 preguntas por inteligencia**,
en bloques consecutivos:

| Bloque | Preguntas | Inteligencia evaluada    |
|--------|-----------|--------------------------|
| 1      | 1 - 5     | Linguistica              |
| 2      | 6 - 10    | Logico-Matematica        |
| 3      | 11 - 15   | Espacial                 |
| 4      | 16 - 20   | Musical                  |
| 5      | 21 - 25   | Corporal-Kinestesica     |
| 6      | 26 - 30   | Naturalista              |
| 7      | 31 - 35   | Interpersonal            |
| 8      | 36 - 40   | Intrapersonal            |

Cada pregunta presenta **4 opciones de respuesta mutuamente excluyentes**.
Aunque cada pregunta pertenece a un bloque principal, sus opciones pueden
activar distintas inteligencias, lo que permite capturar perfiles mixtos y matizados.

---

### 3. Ponderacion y puntaje por respuesta

Cada opcion de respuesta otorga puntos a una inteligencia especifica segun
su nivel de afinidad:

| Nivel       | Puntos | Criterio                                                                     |
|-------------|--------|------------------------------------------------------------------------------|
| Principal   | 3 pts  | La opcion refleja directamente la inteligencia del bloque de la pregunta     |
| Secundario  | 2 pts  | La opcion refleja una inteligencia relacionada o complementaria              |
| Terciario   | 1 pt   | La opcion tiene una leve afinidad con una tercera inteligencia               |

> **Nota:** La mayoria de las opciones otorgan 2 o 3 puntos. El puntaje de 1 pt
> aparece solo en casos donde la afinidad es marginal.

**Ejemplo - Pregunta 1** *(bloque Linguistica)*:

> *"Cuando tienes que explicar algo complicado a un amigo, prefieres..."*

| # | Opcion                                      | Inteligencia activada   | Puntos |
|---|---------------------------------------------|-------------------------|--------|
| A | Escribirlo con detalle en un mensaje        | LI - Linguistica        | 3      |
| B | Dibujarlo o hacer un esquema visual         | ES - Espacial           | 2      |
| C | Mostrarlo con un ejemplo fisico o actuado   | CK - Corporal-Kinestica | 1      |
| D | Decirlo de viva voz improvisando            | LI - Linguistica        | 2      |

---

### 4. Calculo del puntaje bruto por inteligencia

Para cada inteligencia `I`, se acumulan los puntos de **todas las preguntas**
en las que el estudiante selecciono una opcion que activa `I`:

```
PuntajeBruto(I) = SUMA de puntos_opcion_elegida_que_activa(I)   para todas las preguntas respondidas
```

El **puntaje maximo posible** por inteligencia es:

```
Maximo(I) = 5 preguntas x 3 pts = 15 pts
```

---

### 5. Normalizacion a porcentaje

El puntaje bruto se convierte a una escala de 0 a 100% para facilitar
la comparacion entre inteligencias:

```
Porcentaje(I) = min( round( PuntajeBruto(I) / 15 x 100 ), 100 )
```

El tope de 100% previene desbordamientos en casos donde una inteligencia
acumula puntos secundarios desde multiples bloques.

---

### 6. Clasificacion de fortalezas y areas de mejora

Una vez calculados los 8 porcentajes, se ordenan de mayor a menor:

```
Fortalezas       = top 3 inteligencias con mayor Porcentaje(I)
Areas de mejora  = bottom 3 inteligencias con menor Porcentaje(I)
Perfil dominante = inteligencia con el Porcentaje(I) mas alto
```

---

### 7. Formula para identificar carreras profesionales

Cada carrera tiene asignadas **2 inteligencias de afinidad** (`intel_1` e `intel_2`).
La puntuacion de afinidad se calcula contando cuantas de sus inteligencias coinciden
con el top 3 del estudiante:

```
Afinidad(carrera) = | { intel_1, intel_2 } interseccion Fortalezas |

donde Fortalezas = { I : I esta en top 3 de Porcentaje(I) }
```

| Afinidad | Nivel  | Criterio de presentacion                                          |
|----------|--------|-------------------------------------------------------------------|
| 2        | Alta   | Ambas inteligencias de la carrera coinciden con las fortalezas    |
| 1        | Media  | Una de las dos inteligencias coincide con las fortalezas          |
| 0        | -      | No se muestra (fuera del perfil del estudiante)                   |

Las carreras se **ordenan por afinidad descendente** y se presentan
las **9 con mayor puntuacion**.

**Ejemplo aplicado:**

> Estudiante con Fortalezas = { LI, IP, IT }

| Carrera                    | intel_1    | intel_2    | Afinidad | Nivel |
|----------------------------|------------|------------|----------|-------|
| Psicologia                 | IP (ok)    | IT (ok)    | 2        | Alta  |
| Periodismo & Comunicacion  | LI (ok)    | IP (ok)    | 2        | Alta  |
| Filosofia                  | IT (ok)    | LI (ok)    | 2        | Alta  |
| Escritura Creativa         | IT (ok)    | LI (ok)    | 2        | Alta  |
| Pedagogia & Educacion      | IP (ok)    | LI (ok)    | 2        | Alta  |
| Ingenieria de Software     | LM         | ES         | 0        | -     |

---

### 8. Catalogo de carreras y sus inteligencias de afinidad

| Carrera                        | Inteligencia 1 | Inteligencia 2 |
|--------------------------------|:--------------:|:--------------:|
| Periodismo & Comunicacion      | LI             | IP             |
| Derecho & Abogacia             | LI             | LM             |
| Linguistica & Traduccion       | LI             | IT             |
| Ingenieria de Software         | LM             | ES             |
| Matematicas & Estadistica      | LM             | IT             |
| Economia & Finanzas            | LM             | IP             |
| Arquitectura & Diseno          | ES             | LM             |
| Diseno Grafico & UX            | ES             | LI             |
| Fotografia & Cine              | ES             | MU             |
| Produccion Musical             | MU             | CK             |
| Musicoterapia                  | MU             | IP             |
| Medicina & Cirugia             | CK             | LM             |
| Educacion Fisica & Deporte     | CK             | IP             |
| Fisioterapia & Kinesiologia    | CK             | NA             |
| Biologia & Ecologia            | NA             | LM             |
| Medicina Veterinaria           | NA             | IP             |
| Ingenieria Ambiental           | NA             | LM             |
| Psicologia                     | IP             | IT             |
| Trabajo Social                 | IP             | NA             |
| Pedagogia & Educacion          | IP             | LI             |
| Filosofia                      | IT             | LI             |
| Escritura Creativa             | IT             | LI             |
| Investigacion Cientifica       | IT             | LM             |

---

## Caracteristicas

- 40 preguntas de seleccion multiple mutuamente excluyente
- Grafico de barras animado con porcentaje por inteligencia
- Mapa radar interactivo (Canvas API)
- Fortalezas (top 3) y areas de mejora (bottom 3)
- Hasta 9 carreras recomendadas ordenadas por afinidad
- Exportacion a PDF de 2 paginas con diseno profesional

---

## Tecnologias

- HTML5, CSS3, JavaScript ES6 (vanilla, sin frameworks)
- jsPDF 2.5.1 (https://github.com/parallax/jsPDF) - generacion de PDF en el navegador
- Canvas API - radar chart

---

## Referencias academicas

Gardner, H. (1983). Frames of Mind: The Theory of Multiple Intelligences. Basic Books, New York.

Gardner, H. (1999). Intelligence Reframed: Multiple Intelligences for the 21st Century. Basic Books, New York.

---

Desarrollado como herramienta de orientacion academica para instituciones de educacion secundaria.
