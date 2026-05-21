import { GameState }        from './game/GameState.js';
import { MissionSystem }    from './game/MissionSystem.js';
import { TreePanel }        from './ui/TreePanel.js';
import { UnitPalette }      from './ui/UnitPalette.js';
import { ActionPanel }      from './ui/ActionPanel.js';
import { EducationOverlay } from './ui/EducationOverlay.js';
import { DragDrop }         from './ui/DragDrop.js';

document.addEventListener('DOMContentLoaded', () => {
  const state    = new GameState();
  const missions = new MissionSystem();

  const treePanel   = new TreePanel(document.getElementById('tree-panel'), state);
  const palette     = new UnitPalette(document.getElementById('unit-palette'), state);
  const eduOverlay  = new EducationOverlay(document.getElementById('edu-overlay'));
  const actionPanel = new ActionPanel(
    document.getElementById('action-panel'), state, missions, eduOverlay
  );
  const dragDrop = new DragDrop(state, () => { treePanel.render(); palette.render(); });

  dragDrop.bind(document.body);

  state.subscribe((event, data) => {
    if (event === 'army-changed')      treePanel.render();
    if (event === 'phase-changed')     { treePanel.render(); palette.render(); actionPanel.render(); }
    if (event === 'mission-completed') {
      const m = missions.getMission(data.missionId);
      if (m) eduOverlay.onMissionComplete(m);
      _renderMission();
    }
  });

  function _renderMission() {
    const el = document.getElementById('mission-display');
    if (!el) return;
    const active = missions.getActiveMission(state);

    if (!active) {
      el.innerHTML = `
        <div class="mission-complete">
          <div class="mission-complete__trophy">🏆</div>
          <h2>¡Misiones completadas!</h2>
          <p>Has dominado el patrón <strong>Composite</strong>.</p>
          <p class="mission-complete__summary">
            Objetos individuales y grupos responden a la misma interfaz.<br>
            Eso es el patrón Composite.
          </p>
        </div>`;
      return;
    }

    const completed = state.completedMissions.size;
    el.innerHTML = `
      <div class="mission-panel__header">
        <div class="mission-panel__progress" title="${completed} de 5 completadas">${completed}/5</div>
        <h3>${active.title}</h3>
      </div>
      <p class="mission-panel__desc">${active.description}</p>
      <div class="mission-panel__concept">📚 <strong>${active.concept}</strong></div>
    `;
  }

  // Selector de fases
  document.querySelectorAll('.phase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.phase-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.initPhase(Number(btn.dataset.phase));
      _renderMission();
    });
  });

  // Iniciar en Fase 1
  document.querySelector('[data-phase="1"]').classList.add('active');
  state.initPhase(1);
  actionPanel.render();
  _renderMission();
});
