export class ActionPanel {
  constructor(containerEl, gameState, missionSystem, eduOverlay) {
    this.container = containerEl;
    this.state = gameState;
    this.missions = missionSystem;
    this.edu = eduOverlay;
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
      <div class="log-header">📋 Log de acciones</div>
      <div class="action-log" id="action-log">
        <p class="log-empty">Las acciones aparecerán aquí...</p>
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
      this._showLog([{ name: '—', emoji: '⚠️', action: 'Sin unidades en el campo' }]);
      return;
    }
    const results = this.state.executeAction(action);
    this._showLog(results);
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

  _showLog(results) {
    const log = this.container.querySelector('#action-log');
    if (!log || !results.length) return;
    log.innerHTML = results.map(r => {
      const extra = r.damage ? ` <em class="log-damage">-${r.damage} dmg</em>`
                  : r.heal   ? ` <em class="log-heal">+${r.heal} heal</em>`
                  : r.armor  ? ` <em class="log-armor">${r.armor} armor</em>`
                  : '';
      return `<div class="log-entry">${r.emoji || '•'} <strong>${r.name}</strong>: ${r.action}${extra}</div>`;
    }).join('');
  }

  _checkActiveMission() {
    const active = this.missions.getActiveMission(this.state);
    if (active && this.missions.checkMission(active.id, this.state)) {
      this.state.completeMission(active.id);
    }
  }
}
