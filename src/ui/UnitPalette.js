export class UnitPalette {
  constructor(containerEl, gameState) {
    this.container = containerEl;
    this.state = gameState;
  }

  render() {
    this.container.innerHTML = '';

    if (this.state.palette.length === 0) {
      this.container.innerHTML = '<p class="palette-empty">✅ Todas las unidades desplegadas.</p>';
      return;
    }

    this.state.palette.forEach(unit => {
      const card = document.createElement('div');
      card.className = 'unit-card';
      card.draggable = true;
      card.dataset.unitId = unit.id;
      card.innerHTML = `
        <span class="unit-card__emoji">${unit.emoji}</span>
        <div class="unit-card__info">
          <span class="unit-card__name">${unit.name}</span>
          <span class="unit-card__class">${unit.unitClass}</span>
        </div>
      `;
      this.container.appendChild(card);
    });
  }
}
