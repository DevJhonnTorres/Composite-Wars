import { Soldier } from '../core/Soldier.js';
import { Medic }   from '../core/Medic.js';
import { Tank }    from '../core/Tank.js';
import { Group }   from '../core/Group.js';

export class GameState {
  constructor() {
    this.phase = 1;
    this.army = null;
    this.palette = [];
    this.actionLog = [];
    this.completedMissions = new Set();
    this._listeners = [];
  }

  subscribe(fn) { this._listeners.push(fn); }

  _notify(event, data) { this._listeners.forEach(fn => fn(event, data)); }

  initPhase(phase) {
    this.phase = phase;
    this.actionLog = [];
    this.army = null;

    const makeUnits = (defs) => defs.map(([Cls, name]) => new Cls(name));

    if (phase === 1) {
      this.palette = makeUnits([[Soldier,'Soldado'],[Soldier,'Soldado'],[Medic,'Médico']]);
    } else if (phase === 2) {
      this.palette = makeUnits([[Soldier,'Soldado'],[Soldier,'Soldado'],[Medic,'Médico'],[Tank,'Tanque']]);
      this.army = new Group('Ejército', 'army');
    } else if (phase === 3) {
      this.palette = makeUnits([[Soldier,'Soldado'],[Soldier,'Soldado'],[Medic,'Médico'],[Tank,'Tanque'],[Soldier,'Soldado']]);
      this.army = new Group('Ejército', 'army');
    } else if (phase === 4) {
      this.palette = makeUnits([[Soldier,'S1'],[Medic,'M1'],[Tank,'T1'],[Soldier,'S2'],[Soldier,'S3'],[Medic,'M2']]);
      this.army = new Group('Ejército Principal', 'army');
    }

    this._notify('phase-changed', { phase });
  }

  setArmy(unit) {
    this.army = unit;
    this._notify('army-changed', { army: this.army });
  }

  addToGroup(groupId, unit) {
    if (!this.army) return;
    const target = this.army.id === groupId
      ? this.army
      : (this.army.getType() === 'composite' ? this.army.find(groupId) : null);
    if (target && target.getType() === 'composite') {
      target.add(unit);
      this._notify('army-changed', { army: this.army });
    }
  }

  executeAction(action) {
    if (!this.army) return [];
    const results = this.army[action]();
    this.actionLog = results;
    this._notify('action-executed', { action, results });
    return results;
  }

  completeMission(missionId) {
    this.completedMissions.add(missionId);
    this._notify('mission-completed', { missionId });
  }

  createGroup(name, rank, parentId) {
    const group = new Group(name, rank);
    if (!this.army) {
      this.army = group;
      this._notify('army-changed', { army: this.army });
    } else {
      this.addToGroup(parentId, group);
    }
    return group;
  }
}
