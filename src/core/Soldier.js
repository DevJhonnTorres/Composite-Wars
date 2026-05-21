import { Unit } from './Unit.js';

export class Soldier extends Unit {
  constructor(name = 'Soldado') {
    super(name, '🪖', 'Soldier');
    this.hp = 100;
    this.power = 20;
  }

  attack()  { return [{ id: this.id, name: this.name, emoji: this.emoji, action: 'attack', damage: this.power }]; }
  move()    { return [{ id: this.id, name: this.name, emoji: this.emoji, action: 'move' }]; }
  defend()  { return [{ id: this.id, name: this.name, emoji: this.emoji, action: 'defend' }]; }
  getType() { return 'leaf'; }

  serialize() {
    return { id: this.id, name: this.name, emoji: this.emoji, unitClass: this.unitClass, type: 'leaf', hp: this.hp };
  }
}
