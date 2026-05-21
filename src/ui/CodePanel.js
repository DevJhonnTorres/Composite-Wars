// Genera código Java en tiempo real desde la estructura del árbol
export class CodePanel {
  constructor(containerEl, gameState) {
    this.container = containerEl;
    this.state     = gameState;
    this._activeTab = 'live';
  }

  render() {
    this._renderShell();
    this._bindTabs();
    this.showLive();
  }

  showLive() {
    this._activeTab = 'live';
    this._setActiveTab('live');
    const pre = this.container.querySelector('#code-pre');
    if (!pre) return;

    if (!this.state.army) {
      pre.innerHTML = this._hl(
`// Arrastra unidades al árbol para generar
// el código Java en tiempo real...

interface Unidad {
    void atacar();
    void mover();
    void defender();
}`);
      return;
    }

    const lines = [];
    lines.push('// ─── Estructura actual generada ─────────────');
    lines.push(this._genStructure(this.state.army, 0));

    if (this.state.army.getType() === 'composite' && this.state.army.children.length > 0) {
      lines.push('');
      lines.push('// Ejecutar sobre toda la jerarquía:');
      lines.push(`${this._varName(this.state.army)}.atacar();  // ← un solo comando`);
    }

    pre.innerHTML = this._hl(lines.join('\n'));
  }

  showTrace(action) {
    this._activeTab = 'trace';
    this._setActiveTab('trace');
    const pre = this.container.querySelector('#code-pre');
    if (!pre || !this.state.army) return;

    const lines = [];
    lines.push(`// ─── Traza de ejecución: ${action}() ─────────`);
    lines.push(`// Cada nivel muestra la delegación recursiva`);
    lines.push('');
    this._buildTrace(this.state.army, action, 0, lines, true);

    pre.innerHTML = this._hlTrace(lines.join('\n'));
  }

  showPattern() {
    this._activeTab = 'pattern';
    this._setActiveTab('pattern');
    const pre = this.container.querySelector('#code-pre');
    if (!pre) return;
    pre.innerHTML = this._hl(FULL_PATTERN_CODE);
  }

  // ── Generación de código estructura ─────────────────────────
  _genStructure(unit, depth) {
    const pad = '    '.repeat(depth);
    const v   = this._varName(unit);

    if (unit.getType() === 'leaf') {
      return `${pad}Unidad ${v} = new ${unit.unitClass}("${unit.name}");`;
    }

    const lines = [];
    if (depth === 0) lines.push('// COMPOSITE — Objeto compuesto');
    lines.push(`${pad}Grupo ${v} = new Grupo("${unit.name}");  // rank: ${unit.rank}`);

    unit.children.forEach(child => {
      if (child.getType() === 'leaf') {
        lines.push(`${pad}${v}.agregar(new ${child.unitClass}("${child.name}"));`);
      } else {
        lines.push('');
        lines.push(this._genStructure(child, depth + 1));
        lines.push(`${pad}${v}.agregar(${this._varName(child)});`);
      }
    });

    return lines.join('\n');
  }

  // ── Traza recursiva ──────────────────────────────────────────
  _buildTrace(unit, action, depth, lines, isLast) {
    const pad    = '    '.repeat(depth);
    const prefix = depth === 0 ? '' : pad.slice(4) + (isLast ? '└── ' : '├── ');

    if (unit.getType() === 'composite') {
      lines.push(`${prefix}${unit.emoji} ${unit.name}.${action}()   // [Composite] delega a ${unit.children.length} hijo(s)`);
      unit.children.forEach((child, i) => {
        this._buildTrace(child, action, depth + 1, lines, i === unit.children.length - 1);
      });
    } else {
      const r      = unit[action]()[0];
      const result = r.damage != null ? `→ ${r.damage} dmg  ✓`
                   : r.heal   != null ? `→ +${r.heal} heal ✓`
                   : r.armor  != null ? `→ ${r.armor} armor ✓`
                   : '→ OK ✓';
      lines.push(`${prefix}${unit.emoji} ${unit.name}.${action}()   // [Leaf]  ${result}`);
    }
  }

  // ── DOM shell ────────────────────────────────────────────────
  _renderShell() {
    this.container.innerHTML = `
      <div class="ct-tabs">
        <button class="ct-tab ct-tab--active" data-tab="live">estructura.java</button>
        <button class="ct-tab" data-tab="trace">traza.log</button>
        <button class="ct-tab" data-tab="pattern">patron_completo.java</button>
        <span class="ct-hint">← actualiza en tiempo real</span>
      </div>
      <pre id="code-pre" class="ct-pre">// Cargando...</pre>
    `;
  }

  _bindTabs() {
    this.container.querySelectorAll('.ct-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab === 'live')    this.showLive();
        if (tab === 'trace')   this.showTrace(this._lastAction || 'atacar');
        if (tab === 'pattern') this.showPattern();
      });
    });
  }

  _setActiveTab(name) {
    this.container.querySelectorAll('.ct-tab').forEach(b => {
      b.classList.toggle('ct-tab--active', b.dataset.tab === name);
    });
  }

  // ── Helpers ──────────────────────────────────────────────────
  _varName(unit) {
    return unit.name
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  }

  _hl(code) {
    return code
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/(\/\/.*)/g,                '<span class="cm-cmt">$1</span>')
      .replace(/\b(interface|class|public|void|new|for|return|private|List|ArrayList|Override|static|String)\b/g,
               '<span class="cm-kw">$1</span>')
      .replace(/\b(Unidad|Grupo|Escuadron|Soldado|Medico|Tank|Tanque|CompositeDemo)\b/g,
               '<span class="cm-cls">$1</span>')
      .replace(/"([^"]*)"/g,               '<span class="cm-str">"$1"</span>');
  }

  _hlTrace(code) {
    return code
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/(\/\/.*)/g,            '<span class="cm-cmt">$1</span>')
      .replace(/(\[Composite\].*)/g,   '<span class="cm-composite">$1</span>')
      .replace(/(\[Leaf\].*✓)/g,       '<span class="cm-leaf-ok">$1</span>')
      .replace(/(→ \d+ dmg\s+✓)/g,    '<span class="cm-damage">$1</span>')
      .replace(/(→ \+\d+ heal\s+✓)/g, '<span class="cm-heal">$1</span>');
  }
}

// ── Código completo del patrón Composite en Java ─────────────
const FULL_PATTERN_CODE = `// ══════════════════════════════════════════════════════════
// PATRÓN COMPOSITE — Implementación Completa en Java
// Proyecto Final / Análisis de Algoritmos
// ══════════════════════════════════════════════════════════

import java.util.ArrayList;
import java.util.List;

// ── PASO 1: COMPONENT ────────────────────────────────────────
// Interfaz común para Leaf y Composite.
// El cliente solo conoce esta interfaz.

interface Unidad {
    void atacar();
    void mover();
    void defender();
}

// ── PASO 2: LEAF ─────────────────────────────────────────────
// Objeto básico. No tiene hijos. Implementa la interfaz directamente.

class Soldado implements Unidad {
    private String nombre;
    private int poder = 20;

    public Soldado(String nombre) { this.nombre = nombre; }

    @Override
    public void atacar() {
        System.out.println("[Leaf] " + nombre + " ataca → " + poder + " dmg");
    }
    @Override
    public void mover()    { System.out.println("[Leaf] " + nombre + " se mueve"); }
    @Override
    public void defender() { System.out.println("[Leaf] " + nombre + " defiende"); }
}

class Medico implements Unidad {
    private String nombre;
    private int curacion = 30;

    public Medico(String nombre) { this.nombre = nombre; }

    @Override
    public void atacar() {
        System.out.println("[Leaf] " + nombre + " cura → +" + curacion + " HP");
    }
    @Override
    public void mover()    { System.out.println("[Leaf] " + nombre + " se mueve"); }
    @Override
    public void defender() { System.out.println("[Leaf] " + nombre + " defiende"); }
}

// ── PASO 3: COMPOSITE ────────────────────────────────────────
// Contiene otros Unidades (Leaf O Composite).
// La DELEGACIÓN RECURSIVA es el corazón del patrón.

class Grupo implements Unidad {
    private String nombre;
    private List<Unidad> hijos = new ArrayList<>();  // ← Leaf o Composite

    public Grupo(String nombre) { this.nombre = nombre; }

    // Gestión del árbol
    public void agregar(Unidad u)  { hijos.add(u); }
    public void eliminar(Unidad u) { hijos.remove(u); }
    public List<Unidad> getHijos() { return hijos; }

    @Override
    public void atacar() {
        System.out.println("[Composite] " + nombre + ".atacar() → delega a " + hijos.size() + " hijos");
        for (Unidad hijo : hijos) {
            hijo.atacar();  // polimorfismo: no distingue Leaf de Composite
        }
    }

    @Override
    public void mover() {
        System.out.println("[Composite] " + nombre + ".mover()");
        hijos.forEach(Unidad::mover);
    }

    @Override
    public void defender() {
        System.out.println("[Composite] " + nombre + ".defender()");
        hijos.forEach(Unidad::defender);
    }
}

// ── PASO 4: CLIENTE ──────────────────────────────────────────
// No distingue entre Leaf y Composite.
// Usa solo la interfaz Unidad.

public class CompositeDemo {
    public static void main(String[] args) {

        // Crear Leaf
        Unidad s1  = new Soldado("Soldado-1");
        Unidad s2  = new Soldado("Soldado-2");
        Unidad med = new Medico("Médico-1");

        // Crear Composite y agregar Leaf
        Grupo alpha = new Grupo("Escuadrón Alpha");
        alpha.agregar(s1);
        alpha.agregar(s2);
        alpha.agregar(med);

        // Composite de Composites → árbol jerárquico
        Grupo ejercito = new Grupo("Ejército");
        ejercito.agregar(alpha);            // ← Composite como hijo
        ejercito.agregar(new Soldado("S3")); // ← Leaf como hijo

        System.out.println("=== Leaf individual ===");
        s1.atacar();
        // [Leaf] Soldado-1 ataca → 20 dmg

        System.out.println("=== Composite (escuadrón) ===");
        alpha.atacar();
        // [Composite] Escuadrón Alpha.atacar() → delega a 3 hijos
        //   [Leaf] Soldado-1 ataca → 20 dmg
        //   [Leaf] Soldado-2 ataca → 20 dmg
        //   [Leaf] Médico-1 cura  → +30 HP

        System.out.println("=== Composite de Composites (ejército) ===");
        ejercito.atacar();
        // [Composite] Ejército.atacar() → delega a 2 hijos
        //   [Composite] Escuadrón Alpha.atacar() → delega a 3 hijos
        //     [Leaf] Soldado-1 ataca → 20 dmg
        //     [Leaf] Soldado-2 ataca → 20 dmg
        //     [Leaf] Médico-1 cura  → +30 HP
        //   [Leaf] S3 ataca → 20 dmg
    }
}`;
