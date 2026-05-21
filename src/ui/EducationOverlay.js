export class EducationOverlay {
  constructor(containerEl) {
    this.container = containerEl;
    this._timeout  = null;
  }

  show(title, message, concept) {
    clearTimeout(this._timeout);
    this.container.innerHTML = `
      <div class="edu-card edu-card--visible">
        <div class="edu-card__concept">📚 ${concept || 'Composite Pattern'}</div>
        <h3 class="edu-card__title">${title}</h3>
        <div class="edu-card__msg">${message}</div>
        <button class="edu-card__close" aria-label="cerrar">✕</button>
      </div>
    `;
    this.container.querySelector('.edu-card__close')
      .addEventListener('click', () => this._hide());
    this._timeout = setTimeout(() => this._hide(), 8000);
  }

  onGroupCreated(group) {
    this.show(
      '¡Creaste un Composite!',
      `<p>En Java, esto equivale a:</p>
       <pre class="edu-code">Grupo ${this._v(group)} = new Grupo("${group.name}");
// Ahora puedes agregar Leaf o Composite:
${this._v(group)}.agregar(new Soldado("..."));
${this._v(group)}.agregar(otroGrupo); // ← Composite de Composites</pre>
       <p>Un Composite implementa la misma interfaz que un Leaf — el cliente los usa igual.</p>`,
      'Composite'
    );
  }

  onAction(action, unit) {
    if (unit.getType() !== 'composite') return;
    const count  = this._countLeaves(unit);
    const javaFn = action === 'attack' ? 'atacar' : action === 'move' ? 'mover' : 'defender';
    this.show(
      `¡Delegación recursiva: ${action}()!`,
      `<p>Al llamar <code>${this._v(unit)}.${javaFn}()</code>, Java ejecuta internamente:</p>
       <pre class="edu-code">// Composite.${javaFn}() — ${unit.name}
for (Unidad hijo : hijos) {
    hijo.${javaFn}(); // polimorfismo ↓
    // no importa si hijo es Leaf o Composite
}
// Resultado: ${count} unidad${count === 1 ? '' : 'es'} respondieron</pre>
       <p>Complejidad: <strong>O(n)</strong> — recorre todos los nodos del árbol.</p>`,
      'Recursividad'
    );
  }

  onMissionComplete(mission) {
    const codeMap = {
      1: `// LEAF — actúa solo\nUnidad s = new Soldado();\ns.atacar(); // "Soldado: 20 dmg"`,
      2: `// COMPOSITE — contiene otros\nGrupo g = new Grupo("Alpha");\ng.agregar(new Soldado());\ng.agregar(new Medico());\ng.atacar(); // todos responden`,
      3: `// ÁRBOL — Composite de Composites\nGrupo ejercito = new Grupo("Ejercito");\nGrupo batallon = new Grupo("Batallon");\nbatallon.agregar(new Soldado());\nejercito.agregar(batallon);\nejercito.agregar(new Tanque());`,
      4: `// RECURSIVIDAD — un solo comando\nejercito.atacar();\n// ↓ batallon.atacar()\n//   ↓ soldado.atacar() ✓\n// ↓ tanque.atacar()   ✓`,
      5: `// ¡COMPOSITE DOMINADO!\n// Mismo código para Leaf y Composite:\nunidad.atacar(); // siempre funciona`,
    };
    const code = codeMap[mission.id] || '';
    this.show(
      `✅ ${mission.title}`,
      `<p>Concepto: <strong>${mission.conceptDesc}</strong></p>
       ${code ? `<pre class="edu-code">${code}</pre>` : ''}`,
      mission.concept
    );
  }

  _hide() {
    const card = this.container.querySelector('.edu-card');
    if (card) card.classList.remove('edu-card--visible');
  }

  _countLeaves(unit) {
    if (unit.getType() === 'leaf') return 1;
    return unit.children.reduce((sum, c) => sum + this._countLeaves(c), 0);
  }

  _v(unit) {
    return unit.name
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  }
}
