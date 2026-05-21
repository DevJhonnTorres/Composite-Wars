export class ActionPanel {
  constructor(containerEl, gameState, missionSystem, eduOverlay) {
    this.container = containerEl;
    this.state     = gameState;
    this.missions  = missionSystem;
    this.edu       = eduOverlay;
  }

  render() {
    this.container.innerHTML = `
      <h2>⚡ Acciones</h2>
      <div class="action-buttons">
        <button class="btn btn--attack"  data-action="attack">⚔️ Atacar</button>
        <button class="btn btn--move"    data-action="move">🏃 Mover</button>
        <button class="btn btn--defend"  data-action="defend">🛡️ Defender</button>
        <button class="btn btn--group"   id="btn-create-group">📦 Crear Grupo</button>
      </div>
      <div class="log-header">
        <span>TRAZA DE EJECUCIÓN</span>
        <span class="log-header__sub">muestra la recursividad</span>
      </div>
      <div class="action-log" id="action-log">
        <p class="log-empty">Ejecuta una acción para ver la traza...</p>
      </div>
    `;

    this.container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => this._handleAction(btn.dataset.action));
    });
    this.container.querySelector('#btn-create-group')
      .addEventListener('click', () => this._handleCreateGroup());
  }

  _handleAction(action) {
    if (!this.state.army) {
      this._showEmpty();
      return;
    }
    this.state.executeAction(action);
    this._showTrace(this.state.army, action);
    this.edu.onAction(action, this.state.army);
    this._checkActiveMission();
  }

  _handleCreateGroup() {
    const name = prompt('Nombre del grupo:', 'Escuadrón Alpha');
    if (!name || !name.trim()) return;

    const parentId = this.state.army ? this.state.army.id : null;
    const rank = this.state.army && this.state.army.getType() === 'composite'
      ? 'battalion' : 'squadron';
    const group = this.state.createGroup(name.trim(), rank, parentId);
    this.edu.onGroupCreated(group);
    this._checkActiveMission();
  }

  // Muestra la traza recursiva en formato árbol con código
  _showTrace(unit, action, depth = 0, isLast = true) {
    const log = this.container.querySelector('#action-log');
    if (!log) return;

    const rows = [];
    this._buildRows(unit, action, depth, isLast, [], rows);
    log.innerHTML = rows.join('');
  }

  _buildRows(unit, action, depth, isLast, parentLines, rows) {
    // Construir el prefijo visual tipo árbol
    const connector = depth === 0 ? '' : (isLast ? '└─ ' : '├─ ');
    const indent    = parentLines.map(v => v ? '│  ' : '   ').join('') + connector;

    if (unit.getType() === 'composite') {
      const childCount = unit.children.length;
      rows.push(`
        <div class="trace-row trace-row--composite">
          <span class="trace-indent">${indent}</span>
          <span class="trace-emoji">${unit.emoji}</span>
          <span class="trace-name">${unit.name}</span>
          <span class="trace-call">.${action}()</span>
          <span class="trace-badge trace-badge--composite">[Composite]</span>
          <span class="trace-info">delega a ${childCount} hijo${childCount === 1 ? '' : 's'}</span>
        </div>
      `);
      unit.children.forEach((child, i) => {
        const childIsLast = i === unit.children.length - 1;
        const newLines    = depth === 0 ? [] : [...parentLines, !isLast];
        this._buildRows(child, action, depth + 1, childIsLast, newLines, rows);
      });
    } else {
      const r      = unit[action]()[0];
      const result = r.damage != null ? `→ ${r.damage} dmg`
                   : r.heal   != null ? `→ +${r.heal} heal`
                   : r.armor  != null ? `→ ${r.armor} armor`
                   : '→ OK';
      const cls    = r.damage != null ? 'damage'
                   : r.heal   != null ? 'heal'
                   : 'ok';
      rows.push(`
        <div class="trace-row trace-row--leaf">
          <span class="trace-indent">${indent}</span>
          <span class="trace-emoji">${unit.emoji}</span>
          <span class="trace-name">${unit.name}</span>
          <span class="trace-call">.${action}()</span>
          <span class="trace-badge trace-badge--leaf">[Leaf]</span>
          <span class="trace-result trace-result--${cls}">${result} ✓</span>
        </div>
      `);
    }
  }

  _showEmpty() {
    const log = this.container.querySelector('#action-log');
    if (!log) return;
    log.innerHTML = '<p class="log-empty">⚠️ Sin unidades en el campo...</p>';
  }

  _checkActiveMission() {
    const active = this.missions.getActiveMission(this.state);
    if (active && this.missions.checkMission(active.id, this.state)) {
      this.state.completeMission(active.id);
    }
  }
}
