export class Unit {
  constructor(name, emoji, unitClass) {
    this.id = `unit-${Unit._counter++}`;
    this.name = name;
    this.emoji = emoji;
    this.unitClass = unitClass;
  }

  attack()    { throw new Error(`${this.constructor.name} debe implementar attack()`); }
  move()      { throw new Error(`${this.constructor.name} debe implementar move()`); }
  defend()    { throw new Error(`${this.constructor.name} debe implementar defend()`); }
  getType()   { throw new Error(`${this.constructor.name} debe implementar getType()`); }
  serialize() { throw new Error(`${this.constructor.name} debe implementar serialize()`); }
}
Unit._counter = 1;
