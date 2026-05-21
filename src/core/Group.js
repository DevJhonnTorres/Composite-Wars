import { Unit } from './Unit.js';

const RANK_EMOJI = { squadron: '⚔️', battalion: '🏴', army: '🏰' };

export class Group extends Unit {
  constructor(name = 'Grupo', rank = 'squadron') {
    super(name, RANK_EMOJI[rank] || '📦', 'Group');
    this.rank = rank;
    this.children = [];
  }

  add(unit) {
    this.children.push(unit);
    return this;
  }

  remove(unitId) {
    const idx = this.children.findIndex(u => u.id === unitId);
    if (idx !== -1) { this.children.splice(idx, 1); return true; }
    for (const child of this.children) {
      if (child.getType() === 'composite' && child.remove(unitId)) return true;
    }
    return false;
  }

  find(unitId) {
    if (this.id === unitId) return this;
    for (const child of this.children) {
      if (child.id === unitId) return child;
      if (child.getType() === 'composite') {
        const found = child.find(unitId);
        if (found) return found;
      }
    }
    return null;
  }

  attack()  { return this.children.flatMap(u => u.attack()); }
  move()    { return this.children.flatMap(u => u.move()); }
  defend()  { return this.children.flatMap(u => u.defend()); }
  getType() { return 'composite'; }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      emoji: this.emoji,
      unitClass: this.unitClass,
      rank: this.rank,
      type: 'composite',
      children: this.children.map(u => u.serialize()),
    };
  }
}
