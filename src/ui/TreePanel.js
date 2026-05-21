export class TreePanel {
  constructor(containerEl, gameState) {
    this.container = containerEl;
    this.state = gameState;
  }

  render() {
    this.container.innerHTML = '';

    if (!this.state.army) {
      this.container.innerHTML = '<p class="tree-empty">👆 Arrastra una unidad aquí para empezar.</p>';
      return;
    }

    this.container.appendChild(this._buildNode(this.state.army));
  }

  _buildNode(unit) {
    const node = document.createElement('div');
    node.className = `tree-node tree-node--${unit.getType()}`;
    node.dataset.unitId = unit.id;

    const label = document.createElement('div');
    label.className = 'tree-node__label';
    label.textContent = `${unit.emoji} ${unit.name}`;
    label.title = unit.getType() === 'composite'
      ? 'Composite — puede recibir unidades (suelta aquí)'
      : 'Leaf — unidad individual';
    node.appendChild(label);

    if (unit.getType() === 'composite') {
      node.classList.add('drop-target');
      node.dataset.accepts = 'unit';

      const badge = document.createElement('span');
      badge.className = 'tree-node__badge';
      badge.textContent = `[${unit.rank}]`;
      label.appendChild(badge);

      const children = document.createElement('div');
      children.className = 'tree-node__children';
      if (unit.children.length === 0) {
        children.innerHTML = '<span class="tree-node__hint">Suelta unidades aquí</span>';
      } else {
        unit.children.forEach(child => children.appendChild(this._buildNode(child)));
      }
      node.appendChild(children);
    }

    return node;
  }
}
