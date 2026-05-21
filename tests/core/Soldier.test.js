import { Soldier } from '../../src/core/Soldier.js';
import { Medic }   from '../../src/core/Medic.js';
import { Tank }    from '../../src/core/Tank.js';

describe('Soldier (Leaf)', () => {
  test('getType() devuelve "leaf"', () => {
    expect(new Soldier().getType()).toBe('leaf');
  });

  test('attack() devuelve array con una entrada con action "attack"', () => {
    const s = new Soldier('Rambo');
    const result = s.attack();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].action).toBe('attack');
    expect(result[0].name).toBe('Rambo');
    expect(typeof result[0].damage).toBe('number');
  });

  test('move() devuelve array con action "move"', () => {
    expect(new Soldier().move()[0].action).toBe('move');
  });

  test('defend() devuelve array con action "defend"', () => {
    expect(new Soldier().defend()[0].action).toBe('defend');
  });

  test('serialize() incluye id, name, emoji, unitClass, type, hp', () => {
    const s = new Soldier('Rex');
    const data = s.serialize();
    expect(data.id).toBe(s.id);
    expect(data.name).toBe('Rex');
    expect(data.emoji).toBe('🪖');
    expect(data.unitClass).toBe('Soldier');
    expect(data.type).toBe('leaf');
    expect(typeof data.hp).toBe('number');
  });
});

describe('Medic (Leaf)', () => {
  test('attack() devuelve acción heal', () => {
    const result = new Medic().attack();
    expect(result[0].action).toBe('heal');
    expect(typeof result[0].heal).toBe('number');
  });

  test('getType() devuelve "leaf"', () => {
    expect(new Medic().getType()).toBe('leaf');
  });
});

describe('Tank (Leaf)', () => {
  test('attack() devuelve daño alto', () => {
    expect(new Tank().attack()[0].damage).toBeGreaterThan(30);
  });

  test('getType() devuelve "leaf"', () => {
    expect(new Tank().getType()).toBe('leaf');
  });
});
