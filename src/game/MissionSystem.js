function countLeaves(unit) {
  if (unit.getType() === 'leaf') return 1;
  return unit.children.reduce((sum, c) => sum + countLeaves(c), 0);
}

export class MissionSystem {
  constructor() {
    this.missions = [
      {
        id: 1,
        title: 'Misión 1: El Primer Soldado',
        description: 'Arrastra un Soldado al campo y ordénale atacar.',
        concept: 'Leaf',
        conceptDesc: 'Un objeto que actúa solo, sin contener otros objetos.',
        check: (s) => s.army && s.army.getType() === 'leaf' && s.actionLog.length > 0,
      },
      {
        id: 2,
        title: 'Misión 2: Crea tu Escuadrón',
        description: 'Arrastra al menos 2 unidades dentro del grupo existente.',
        concept: 'Composite',
        conceptDesc: 'Un objeto que contiene otros objetos y los trata de igual forma.',
        check: (s) => s.army && s.army.getType() === 'composite' && s.army.children.length >= 2,
      },
      {
        id: 3,
        title: 'Misión 3: Ataque Grupal',
        description: 'Ejecuta ATACAR con tu escuadrón y observa cómo actúan todos juntos.',
        concept: 'Interfaz común',
        conceptDesc: 'Leaf y Composite responden exactamente a los mismos métodos.',
        check: (s) => s.army && s.army.getType() === 'composite'
          && s.army.children.length >= 2 && s.actionLog.length >= 2,
      },
      {
        id: 4,
        title: 'Misión 4: Ejército Jerárquico',
        description: 'Crea un ejército con al menos 2 grupos anidados.',
        concept: 'Árbol y Recursividad',
        conceptDesc: 'Los Composite pueden contener otros Composite, formando un árbol.',
        check: (s) => s.army && s.army.getType() === 'composite'
          && s.army.children.some(c => c.getType() === 'composite'),
      },
      {
        id: 5,
        title: 'Misión Final: Un Solo Comando',
        description: 'Construye un ejército con ≥4 unidades y atácalo con un solo comando.',
        concept: 'El poder del Composite',
        conceptDesc: 'Con una sola llamada, toda la jerarquía responde automáticamente.',
        check: (s) => s.army && s.army.getType() === 'composite'
          && countLeaves(s.army) >= 4 && s.actionLog.length >= 4,
      },
    ];
  }

  getMission(id)           { return this.missions.find(m => m.id === id) || null; }
  getActiveMission(state)  { return this.missions.find(m => !state.completedMissions.has(m.id)) || null; }
  checkMission(id, state)  { const m = this.getMission(id); return m ? m.check(state) : false; }
}
