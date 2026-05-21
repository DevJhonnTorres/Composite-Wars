import { Unit } from '../../src/core/Unit.js';

class ConcreteUnit extends Unit {
  attack()    { return [{ id: this.id, action: 'attack' }]; }
  move()      { return [{ id: this.id, action: 'move' }]; }
  defend()    { return [{ id: this.id, action: 'defend' }]; }
  getType()   { return 'leaf'; }
  serialize() { return { id: this.id, name: this.name }; }
}

test('Unit asigna un id único como string', () => {
  const a = new ConcreteUnit('A', '🪖', 'Test');
  const b = new ConcreteUnit('B', '🪖', 'Test');
  expect(typeof a.id).toBe('string');
  expect(a.id).not.toBe(b.id);
});

test('Unit almacena name, emoji y unitClass', () => {
  const u = new ConcreteUnit('Soldado', '🪖', 'Soldier');
  expect(u.name).toBe('Soldado');
  expect(u.emoji).toBe('🪖');
  expect(u.unitClass).toBe('Soldier');
});

test('Unit lanza error en attack() sin implementar', () => {
  class BadUnit extends Unit {}
  const u = new BadUnit('x', '?', 'Bad');
  expect(() => u.attack()).toThrow();
});
