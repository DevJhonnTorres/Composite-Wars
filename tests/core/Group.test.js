import { Group }   from '../../src/core/Group.js';
import { Soldier } from '../../src/core/Soldier.js';
import { Medic }   from '../../src/core/Medic.js';
import { Tank }    from '../../src/core/Tank.js';

describe('Group (Composite)', () => {
  test('getType() devuelve "composite"', () => {
    expect(new Group('Alpha').getType()).toBe('composite');
  });

  test('add() almacena hijos', () => {
    const g = new Group('Alpha');
    const s = new Soldier();
    g.add(s);
    expect(g.children).toHaveLength(1);
    expect(g.children[0]).toBe(s);
  });

  test('attack() delega a todos los hijos (flatMap)', () => {
    const g = new Group('Alpha');
    g.add(new Soldier('S1'));
    g.add(new Soldier('S2'));
    g.add(new Medic('M1'));
    const results = g.attack();
    expect(results).toHaveLength(3);
    expect(results.map(r => r.action)).toEqual(['attack', 'attack', 'heal']);
  });

  test('move() delega a todos los hijos', () => {
    const g = new Group('Alpha');
    g.add(new Soldier());
    g.add(new Tank());
    const results = g.move();
    expect(results).toHaveLength(2);
    results.forEach(r => expect(r.action).toBe('move'));
  });

  test('attack() recursa en Groups anidados (composite de composites)', () => {
    const army   = new Group('Army', 'army');
    const squad1 = new Group('Squad1', 'squadron');
    const squad2 = new Group('Squad2', 'squadron');
    squad1.add(new Soldier('A'));
    squad1.add(new Soldier('B'));
    squad2.add(new Tank('T1'));
    army.add(squad1);
    army.add(squad2);
    expect(army.attack()).toHaveLength(3);
  });

  test('remove() elimina hijo directo por id', () => {
    const g = new Group('Alpha');
    const s = new Soldier();
    g.add(s);
    g.remove(s.id);
    expect(g.children).toHaveLength(0);
  });

  test('remove() elimina hijo anidado recursivamente', () => {
    const army  = new Group('Army', 'army');
    const squad = new Group('Squad', 'squadron');
    const s     = new Soldier();
    squad.add(s);
    army.add(squad);
    army.remove(s.id);
    expect(squad.children).toHaveLength(0);
  });

  test('find() retorna una unidad por id desde árbol anidado', () => {
    const army  = new Group('Army', 'army');
    const squad = new Group('Squad', 'squadron');
    const s     = new Soldier();
    squad.add(s);
    army.add(squad);
    expect(army.find(s.id)).toBe(s);
    expect(army.find(squad.id)).toBe(squad);
    expect(army.find('nonexistent')).toBeNull();
  });

  test('serialize() incluye children recursivamente', () => {
    const g = new Group('Alpha', 'squadron');
    g.add(new Soldier());
    const data = g.serialize();
    expect(data.type).toBe('composite');
    expect(data.rank).toBe('squadron');
    expect(data.children).toHaveLength(1);
    expect(data.children[0].type).toBe('leaf');
  });
});
