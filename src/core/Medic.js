import { Unit } from './Unit.js';

export class Medic extends Unit {
  constructor(name = 'Médico') {
    super(name, '🚑', 'Medic');
    this.hp = 80;
    this.healPower = 30;
  }

  attack()  { return [{ id: this.id, name: this.name, emoji: this.emoji, action: 'heal', heal: this.healPower }]; }
  move()    { return [{ id: this.id, name: this.name, emoji: this.emoji, action: 'move' }]; }
  defend()  { return [{ id: this.id, name: this.name, emoji: this.emoji, action: 'defend' }]; }
  getType() { return 'leaf'; }

  serialize() {
    return { id: this.id, name: this.name, emoji: this.emoji, unitClass: this.unitClass, type: 'leaf', hp: this.hp };
  }
}
