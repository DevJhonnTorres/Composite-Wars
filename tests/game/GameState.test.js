import { GameState } from '../../src/game/GameState.js';

describe('GameState', () => {
  let state;
  beforeEach(() => { state = new GameState(); });

  test('initPhase(1) llena la paleta con Leaf units y deja army null', () => {
    state.initPhase(1);
    expect(state.army).toBeNull();
    expect(state.palette.length).toBeGreaterThan(0);
    state.palette.forEach(u => expect(u.getType()).toBe('leaf'));
  });

  test('initPhase(2) crea un Group como raíz del ejército', () => {
    state.initPhase(2);
    expect(state.army).not.toBeNull();
    expect(state.army.getType()).toBe('composite');
  });

  test('setArmy() asigna army y notifica subscribers', () => {
    state.initPhase(1);
    const events = [];
    state.subscribe((ev) => events.push(ev));
    const unit = state.palette[0];
    state.setArmy(unit);
    expect(state.army).toBe(unit);
    expect(events).toContain('army-changed');
  });

  test('addToGroup() agrega unidad al composite del ejército', () => {
    state.initPhase(2);
    const unit = state.palette.splice(0, 1)[0];
    const armyId = state.army.id;
    state.addToGroup(armyId, unit);
    expect(state.army.children).toContain(unit);
  });

  test('executeAction("attack") retorna resultados y llena actionLog', () => {
    state.initPhase(2);
    const unit = state.palette.splice(0, 1)[0];
    state.addToGroup(state.army.id, unit);
    const results = state.executeAction('attack');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(state.actionLog).toEqual(results);
  });

  test('executeAction retorna [] cuando army es null', () => {
    expect(state.executeAction('attack')).toEqual([]);
  });

  test('completeMission() agrega id a completedMissions y notifica', () => {
    const events = [];
    state.subscribe((ev) => events.push(ev));
    state.completeMission(1);
    expect(state.completedMissions.has(1)).toBe(true);
    expect(events).toContain('mission-completed');
  });

  test('createGroup() sin army asigna el group como army', () => {
    state.initPhase(1);
    const g = state.createGroup('Alpha', 'squadron', null);
    expect(state.army).toBe(g);
    expect(state.army.getType()).toBe('composite');
  });
});
