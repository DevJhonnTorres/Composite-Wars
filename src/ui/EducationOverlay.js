export class EducationOverlay {
  constructor(containerEl) {
    this.container = containerEl;
    this._timeout = null;
  }

  show(title, message, concept) {
    clearTimeout(this._timeout);
    this.container.innerHTML = `
      <div class="edu-card edu-card--visible">
        <div class="edu-card__concept">📚 ${concept || 'Composite Pattern'}</div>
        <h3 class="edu-card__title">${title}</h3>
        <p class="edu-card__msg">${message}</p>
        <button class="edu-card__close" aria-label="cerrar">✕</button>
      </div>
    `;
    this.container.querySelector('.edu-card__close')
      .addEventListener('click', () => this._hide());
    this._timeout = setTimeout(() => this._hide(), 6000);
  }

  onGroupCreated(group) {
    this.show(
      '¡Creaste un Composite!',
      `<code>${group.name}</code> puede contener otros objetos y tratarlos como uno solo. Eso es un <strong>Composite</strong>.`,
      'Composite'
    );
  }

  onAction(action, unit) {
    if (unit.getType() !== 'composite') return;
    const count = this._countLeaves(unit);
    this.show(
      `¡El Composite delegó ${action}()!`,
      `<code>${unit.name}</code> llamó <code>${action}()</code> en sus <strong>${count}</strong> elemento${count === 1 ? '' : 's'} automáticamente. Eso es <strong>recursividad</strong>.`,
      'Recursividad'
    );
  }

  onMissionComplete(mission) {
    this.show(
      `✅ ${mission.title}`,
      `Concepto aprendido: <strong>${mission.conceptDesc}</strong>`,
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
}
