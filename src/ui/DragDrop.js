export class DragDrop {
  constructor(gameState, onDropped) {
    this.state = gameState;
    this.onDropped = onDropped;
    this._draggedId = null;
  }

  bind(rootEl) {
    rootEl.addEventListener('dragstart', e => this._onDragStart(e));
    rootEl.addEventListener('dragover',  e => this._onDragOver(e));
    rootEl.addEventListener('drop',      e => this._onDrop(e));
    rootEl.addEventListener('dragend',   () => this._onDragEnd());
  }

  _onDragStart(e) {
    const card = e.target.closest('.unit-card[data-unit-id]');
    if (!card) return;
    this._draggedId = card.dataset.unitId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this._draggedId);
    card.classList.add('dragging');
  }

  _onDragOver(e) {
    const target = e.target.closest('.drop-target');
    if (!target) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    document.querySelectorAll('.drop-target--hover')
      .forEach(el => el.classList.remove('drop-target--hover'));
    target.classList.add('drop-target--hover');
  }

  _onDrop(e) {
    e.preventDefault();
    document.querySelectorAll('.drop-target--hover')
      .forEach(el => el.classList.remove('drop-target--hover'));

    if (!this._draggedId) return;
    const target = e.target.closest('.drop-target');
    if (!target) { this._draggedId = null; return; }

    const unitIndex = this.state.palette.findIndex(u => u.id === this._draggedId);
    if (unitIndex === -1) { this._draggedId = null; return; }

    const [unit] = this.state.palette.splice(unitIndex, 1);
    const groupId = target.dataset.unitId;

    if (groupId === 'root' && !this.state.army) {
      // Fase 1: soltar unidad directamente como raíz del ejército
      this.state.setArmy(unit);
    } else if (groupId === 'root' && this.state.army && this.state.army.getType() === 'composite') {
      this.state.army.add(unit);
      this.state._notify('army-changed', { army: this.state.army });
    } else {
      this.state.addToGroup(groupId, unit);
    }

    this._draggedId = null;
    if (this.onDropped) this.onDropped();
  }

  _onDragEnd() {
    this._draggedId = null;
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drop-target--hover').forEach(el => el.classList.remove('drop-target--hover'));
  }
}
