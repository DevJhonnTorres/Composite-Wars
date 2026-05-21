import { MissionSystem } from '../../src/game/MissionSystem.js';
import { GameState }     from '../../src/game/GameState.js';

describe('MissionSystem', () => {
  let missions, state;
  beforeEach(() => {
    missions = new MissionSystem();
    state    = new GameState();
  });

  test('getMission(1) retorna el primer objeto misión', () => {
    const m = missions.getMission(1);
    expect(m.id).toBe(1);
    expect(typeof m.title).toBe('string');
    expect(typeof m.concept).toBe('string');
    expect(typeof m.check).toBe('function');
  });

  test('getActiveMission() retorna misión 1 cuando ninguna completada', () => {
    expect(missions.getActiveMission(state).id).toBe(1);
  });

  test('getActiveMission() retorna misión 2 después de completar la 1', () => {
    state.completeMission(1);
    expect(missions.getActiveMission(state).id).toBe(2);
  });

  test('getActiveMission() retorna null cuando todas completadas', () => {
    [1,2,3,4,5].forEach(id => state.completeMission(id));
    expect(missions.getActiveMission(state)).toBeNull();
  });

  test('misión 1: pasa cuando army es leaf y actionLog tiene entradas', () => {
    state.initPhase(1);
    const unit = state.palette.splice(0, 1)[0];
    state.setArmy(unit);
    state.executeAction('attack');
    expect(missions.checkMission(1, state)).toBe(true);
  });

  test('misión 1: falla cuando actionLog está vacío', () => {
    state.initPhase(1);
    const unit = state.palette.splice(0, 1)[0];
    state.setArmy(unit);
    expect(missions.checkMission(1, state)).toBe(false);
  });

  test('misión 2: pasa cuando army es composite con ≥2 hijos', () => {
    state.initPhase(2);
    const u1 = state.palette.splice(0, 1)[0];
    const u2 = state.palette.splice(0, 1)[0];
    state.addToGroup(state.army.id, u1);
    state.addToGroup(state.army.id, u2);
    expect(missions.checkMission(2, state)).toBe(true);
  });

  test('misión 4: pasa cuando army tiene composite anidado', () => {
    state.initPhase(3);
    const squad = state.createGroup('Squad', 'squadron', state.army.id);
    const unit  = state.palette.splice(0, 1)[0];
    state.addToGroup(squad.id, unit);
    expect(missions.checkMission(4, state)).toBe(true);
  });
});
