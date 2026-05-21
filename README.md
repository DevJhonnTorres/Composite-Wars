# COMPOSITE WARS

> **Proyecto Final — Análisis de Algoritmos**  
> Juego educativo interactivo que enseña el **Patrón de Diseño Composite** a través de estrategia militar con jerarquías de unidades.

---

## Autores

| # | Nombre |
|---|--------|
| 01 | Torres Castro, Jhonn Alexander |
| 02 | Lozada Lerma, Daniel Esteban |

---

## Demo en Vivo

🚀 **[composite-wars.vercel.app](https://composite-wars.vercel.app)**

---

## Tabla de Contenidos

- [¿Qué es el Patrón Composite?](#qué-es-el-patrón-composite)
- [Fases del Juego](#fases-del-juego)
- [Características](#características)
- [Implementación Completa en Java](#implementación-completa-en-java)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)
- [Instalación y Uso](#instalación-y-uso)
- [Tests](#tests)
- [Despliegue en Vercel](#despliegue-en-vercel)

---

## ¿Qué es el Patrón Composite?

El **Patrón Composite** es un patrón estructural de diseño que permite tratar **objetos individuales** y **grupos de objetos** de manera **uniforme**, construyendo estructuras jerárquicas tipo árbol.

```
«interface»
  Unidad
  ──────
  atacar()
  mover()
  defender()
      │
      ├──────────────────┐
      ▼                  ▼
  Soldado (Leaf)    Escuadrón (Composite)
  ──────────────    ────────────────────
  atacar()          children: Unidad[]
  mover()           atacar() → delega a hijos
  defender()        agregar(Unidad)
```

### Participantes del patrón

| Rol | Clase | Descripción |
|-----|-------|-------------|
| **Component** | `Unit` | Interfaz común para Leaf y Composite |
| **Leaf** | `Soldier`, `Medic`, `Tank` | Objeto básico, actúa solo, sin hijos |
| **Composite** | `Group` | Contiene otros `Unit`, delega recursivamente |
| **Client** | `GameState` | Usa la interfaz `Unit` sin distinguir Leaf/Composite |

---

## Fases del Juego

### FASE 01 — LEAF: Objetos Individuales

El **Leaf** es la unidad más básica del patrón. No contiene otros objetos y actúa de forma completamente independiente.

```java
// Leaf.java — implementa la interfaz directamente
class Soldado implements Unidad {
    private int poder = 20;

    @Override
    public void atacar() {
        // Actúa solo — no delega a nadie
        System.out.println("Soldado atacó: " + poder + " dmg");
    }

    @Override
    public void mover() {
        System.out.println("Soldado se movió");
    }

    @Override
    public void defender() {
        System.out.println("Soldado: 15 armor");
    }
}
```

**Unidades disponibles:**
- 🪖 Soldado — 20 dmg de ataque
- 🚑 Médico — 30 heal de curación
- 🚓 Tanque — 50 dmg de ataque

---

### FASE 02 — COMPOSITE: Grupos

El **Composite** contiene múltiples objetos. Cuando ejecutas una acción, la **delega automáticamente** a todos sus hijos. El cliente lo usa exactamente igual que un Leaf.

```java
// Composite.java — contiene y delega a otros Unidad
class Escuadron implements Unidad {
    private List<Unidad> hijos = new ArrayList<>();

    public void agregar(Unidad u)  { hijos.add(u); }
    public void eliminar(Unidad u) { hijos.remove(u); }

    @Override
    public void atacar() {
        // DELEGACIÓN — itera sobre todos los hijos
        for (Unidad hijo : hijos) {
            hijo.atacar(); // polimorfismo: Leaf o Composite, no importa
        }
    }
    // mover() y defender() usan el mismo patrón
}
```

---

### FASE 03 — ÁRBOL: Jerarquías Anidadas

Los Composite pueden contener **otros Composite**, formando un árbol con profundidad arbitraria.

```
Ejército              ← Composite (root)
 ├── Batallón Norte   ← Composite
 │    ├── Escuadrón A ← Composite
 │    │    ├── 🪖      ← Leaf
 │    │    └── 🪖      ← Leaf
 │    └── 🚓           ← Leaf
 └── Batallón Sur     ← Composite
      └── 🚑           ← Leaf
```

```java
// Construcción del árbol
Grupo ejercito    = new Grupo("Ejercito");
Grupo batallon    = new Grupo("Batallon Norte");
Grupo escuadronA  = new Grupo("Escuadron A");

escuadronA.agregar(new Soldado("S1"));
escuadronA.agregar(new Soldado("S2"));
batallon.agregar(escuadronA);
batallon.agregar(new Tanque("T1"));
ejercito.agregar(batallon);
ejercito.agregar(new Medico("M1"));
// Composite de Composites — árbol de profundidad 3
```

---

### FASE 04 — RECURSIVIDAD: Un Solo Comando

Con **una sola llamada** en la raíz, la acción se propaga recursivamente por toda la jerarquía. Complejidad: **O(n)** donde n es el número total de nodos.

```java
// Una sola línea — activa TODA la jerarquía
ejercito.atacar();

// Lo que ocurre internamente:
// ejercito.atacar()
//  └─ batallon.atacar()          ← Composite
//      ├─ escuadronA.atacar()    ← Composite
//      │   ├─ soldado1.atacar()  ← Leaf ✓ 20 dmg
//      │   └─ soldado2.atacar()  ← Leaf ✓ 20 dmg
//      └─ tanque.atacar()        ← Leaf ✓ 50 dmg
//  └─ medico.atacar()            ← Leaf ✓ 30 heal

// El cliente usa LA MISMA LÍNEA para un Leaf o un Composite:
soldado.atacar();   // Leaf: 1 respuesta
escuadron.atacar(); // Composite: 3 respuestas (recursivo)
ejercito.atacar();  // Composite: N respuestas (toda la jerarquía)
```

---

## Características

### Terminal de Código en Vivo

El juego genera código Java en tiempo real según la estructura que construyes:

```java
// ESTRUCTURA GENERADA EN VIVO
// Generado automáticamente al construir el árbol

Grupo escuadronAlpha = new Grupo("Escuadron Alpha");
Soldado soldado_1    = new Soldado("Soldado 1");
Medico medico_1      = new Medico("Medico 1");

escuadronAlpha.agregar(soldado_1);
escuadronAlpha.agregar(medico_1);

// Una sola línea activa todo:
escuadronAlpha.atacar();
```

### Traza de Ejecución Recursiva

Visualización de la pila de llamadas con notación árbol:

```
Ejército.atacar()                [Composite] delega a 2 hijos
  ├─ Batallón.atacar()           [Composite] delega a 2 hijos
  │   ├─ Soldado 1.atacar()      [Leaf] → 20 dmg ✓
  │   └─ Tanque.atacar()         [Leaf] → 50 dmg ✓
  └─ Médico.atacar()             [Leaf] → 30 heal ✓
```

### Overlay Educativo

Cada acción muestra explicaciones con el código Java equivalente:

```java
// Al ejecutar atacar() en un Composite:
// Composite.atacar() — Escuadron Alpha
for (Unidad hijo : hijos) {
    hijo.atacar(); // polimorfismo ↓
    // no importa si hijo es Leaf o Composite
}
// Resultado: 3 unidades respondieron
// Complejidad: O(n) — recorre todos los nodos
```

---

## Implementación Completa en Java

```java
// ─── 1. COMPONENT — Interfaz común ───────────────────────────────
interface Unidad {
    void atacar();
    void mover();
    void defender();
}

// ─── 2. LEAF — Objeto básico sin hijos ───────────────────────────
class Soldado implements Unidad {
    private String nombre;
    private int poder = 20;

    public Soldado(String nombre) { this.nombre = nombre; }

    @Override public void atacar()   { System.out.println(nombre + ": " + poder + " dmg"); }
    @Override public void mover()    { System.out.println(nombre + " avanzó"); }
    @Override public void defender() { System.out.println(nombre + ": 15 armor"); }
}

class Medico implements Unidad {
    private String nombre;
    private int cura = 30;

    public Medico(String nombre) { this.nombre = nombre; }

    @Override public void atacar()   { System.out.println(nombre + ": +" + cura + " heal"); }
    @Override public void mover()    { System.out.println(nombre + " avanzó"); }
    @Override public void defender() { System.out.println(nombre + ": 10 armor"); }
}

// ─── 3. COMPOSITE — Contiene otros Unidad ────────────────────────
class Grupo implements Unidad {
    private String           nombre;
    private List<Unidad>     hijos = new ArrayList<>();

    public Grupo(String nombre) { this.nombre = nombre; }

    public void agregar(Unidad u)  { hijos.add(u); }
    public void eliminar(Unidad u) { hijos.remove(u); }
    public List<Unidad> getHijos() { return hijos; }

    @Override
    public void atacar() {
        System.out.println(nombre + ".atacar() → delegando a " + hijos.size() + " hijos");
        for (Unidad hijo : hijos) {
            hijo.atacar(); // RECURSIVIDAD — Leaf o Composite, misma llamada
        }
    }

    @Override
    public void mover() {
        for (Unidad hijo : hijos) hijo.mover();
    }

    @Override
    public void defender() {
        for (Unidad hijo : hijos) hijo.defender();
    }
}

// ─── 4. CLIENTE — Usa la interfaz Unidad ─────────────────────────
public class Main {
    public static void main(String[] args) {
        // Crear Leafs
        Unidad s1  = new Soldado("Soldado-1");
        Unidad s2  = new Soldado("Soldado-2");
        Unidad med = new Medico("Medico-1");

        // Crear Composites
        Grupo alpha    = new Grupo("Escuadron Alpha");
        Grupo ejercito = new Grupo("Ejercito Principal");

        // Construir el árbol
        alpha.agregar(s1);
        alpha.agregar(s2);
        ejercito.agregar(alpha);  // Composite dentro de Composite
        ejercito.agregar(med);    // Leaf directo en root

        // ¡LA MISMA LÍNEA para Leaf y Composite!
        s1.atacar();        // Leaf:      "Soldado-1: 20 dmg"
        alpha.atacar();     // Composite: 2 respuestas
        ejercito.atacar();  // Composite: 3 respuestas (recursivo)
    }
}
```

---

## Estructura del Proyecto

```
composite-wars/
├── index.html                 # Entrada — 3 pantallas: splash, tutorial, juego
├── style.css                  # Diseño cyberpunk completo
├── vercel.json                # Config Vercel (sitio estático, sin build)
├── package.json               # Scripts + dependencias de test (Jest + Babel)
├── babel.config.cjs           # Transpilación ES Modules para Jest
├── .gitignore
├── src/
│   ├── main.js                # Bootstrap: matrix rain, glitch, pantallas, init
│   ├── core/
│   │   ├── Unit.js            # Component — interfaz base abstracta
│   │   ├── Soldier.js         # Leaf — 20 dmg
│   │   ├── Medic.js           # Leaf — 30 heal
│   │   ├── Tank.js            # Leaf — 50 dmg
│   │   └── Group.js           # Composite — delegación recursiva con flatMap
│   ├── game/
│   │   ├── GameState.js       # Estado central + pub/sub (subscribe/notify)
│   │   └── MissionSystem.js   # 5 misiones con condiciones de logro
│   └── ui/
│       ├── TreePanel.js       # Renderiza el árbol jerárquico en el DOM
│       ├── UnitPalette.js     # Paleta de unidades arrastrables
│       ├── ActionPanel.js     # Botones de acción + traza recursiva
│       ├── EducationOverlay.js# Overlay con código Java en cada acción
│       ├── DragDrop.js        # Drag & Drop HTML5 API
│       └── CodePanel.js       # Terminal: estructura.java / traza.log / patrón
└── tests/
    ├── core/
    │   ├── Unit.test.js       # 3 tests — interfaz abstracta
    │   ├── Soldier.test.js    # 9 tests — Soldier, Medic, Tank
    │   └── Group.test.js      # 9 tests — add, remove, recursividad
    └── game/
        ├── GameState.test.js  # 8 tests — fases, acciones, pub/sub
        └── MissionSystem.test.js # 8 tests — condiciones de misión
```

---

## Tecnologías

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura semántica, Canvas API, Drag & Drop API |
| **CSS3** | Variables CSS, animaciones clip-path (glitch), keyframes, Grid, Flexbox |
| **JavaScript ES Modules** | `import/export`, clases, `flatMap` recursivo |
| **Google Fonts** | Orbitron (display) + Share Tech Mono (monospace) |
| **Jest 29** | Framework de tests unitarios |
| **Babel** | Transpilación ES Modules → CommonJS para Jest |
| **Vercel** | Hosting estático sin step de build |

---

## Instalación y Uso

### Requisitos

- Node.js 18+
- npm 9+

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/DevJhonnTorres/Composite-Wars.git
cd composite-wars

# 2. Instalar dependencias (solo para tests)
npm install

# 3. Correr localmente
npm start
# → Abre http://localhost:3000

# 4. O simplemente abre index.html en el navegador
# (no requiere servidor — sitio 100% estático)
```

---

## Tests

El proyecto tiene **37 tests** en 5 suites que validan toda la lógica del patrón Composite.

```bash
# Correr todos los tests
npm test

# Modo watch (re-ejecuta al guardar)
npm run test:watch
```

### Resultados esperados

```
 PASS  tests/core/Unit.test.js
 PASS  tests/core/Soldier.test.js
 PASS  tests/core/Group.test.js
 PASS  tests/game/GameState.test.js
 PASS  tests/game/MissionSystem.test.js

Test Suites: 5 passed, 5 total
Tests:       37 passed, 37 total
```

### Ejemplos de tests clave

```javascript
// Group.test.js — verifica delegación recursiva
test('attack delegates recursively to all descendants', () => {
  const group = new Group('Root');
  const inner = new Group('Inner');
  inner.add(new Soldier('S1'));
  inner.add(new Medic('M1'));
  group.add(inner);
  group.add(new Tank('T1'));

  const results = group.attack();

  // Un solo .attack() en root produce 3 resultados (1 Soldier + 1 Medic + 1 Tank)
  expect(results).toHaveLength(3);
  expect(results[0].damage).toBe(20);  // Soldier
  expect(results[1].heal).toBe(30);    // Medic
  expect(results[2].damage).toBe(50);  // Tank
});

// GameState.test.js — verifica pub/sub
test('executeAction notifies subscribers with results', () => {
  const state = new GameState();
  state.initPhase(1);
  state.army = new Soldier('S1');

  const events = [];
  state.subscribe((event, data) => events.push({ event, data }));

  state.executeAction('attack');

  expect(events[0].event).toBe('action-executed');
  expect(events[0].data.results[0].damage).toBe(20);
});
```

---

## Despliegue en Vercel

El proyecto es un **sitio estático puro** — sin proceso de build.

```json
// vercel.json
{
  "framework": null,
  "buildCommand": null,
  "outputDirectory": "."
}
```

```bash
# Desplegar con Vercel CLI
npm i -g vercel
vercel --prod
```

O conecta el repositorio de GitHub en [vercel.com](https://vercel.com) — Vercel detecta automáticamente el `vercel.json` y despliega sin build.

---

## Licencia

MIT — Proyecto académico, Análisis de Algoritmos 2026.
