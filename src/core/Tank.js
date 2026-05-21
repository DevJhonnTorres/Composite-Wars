import { Unit } from './Unit.js';

export class Tank extends Unit {
  constructor(name = 'Tanque') {
    super(name, '🚓', 'Tank');
    this.hp = 200;
    this.power = 50;
  }

  attack()  { return [{ id: this.id, name: this.name, emoji: this.emoji, action: 'attack', damage: this.power }]; }
  move()    { return [{ id: this.id, name: this.name, emoji: this.emoji, action: 'move' }]; }
  defend()  { return [{ id: this.id, name: this.name, emoji: this.emoji, action: 'defend', armor: 30 }]; }
  getType() { return 'leaf'; }

  serialize() {
    return { id: this.id, name: this.name, emoji: this.emoji, unitClass: this.unitClass, type: 'leaf', hp: this.hp };
  }
}
