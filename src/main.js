import { GameState }        from './game/GameState.js';
import { MissionSystem }    from './game/MissionSystem.js';
import { TreePanel }        from './ui/TreePanel.js';
import { UnitPalette }      from './ui/UnitPalette.js';
import { ActionPanel }      from './ui/ActionPanel.js';
import { EducationOverlay } from './ui/EducationOverlay.js';
import { DragDrop }         from './ui/DragDrop.js';
import { CodePanel }        from './ui/CodePanel.js';

// ─── Conceptos por fase ──────────────────────────────────────────
const PHASE_CONCEPTS = {
  1: 'LEAF — Los objetos más básicos. Actúan solos, sin contener otros objetos.',
  2: 'COMPOSITE — Un grupo que delega sus acciones a todos sus hijos automáticamente.',
  3: 'ÁRBOL — Los Composite pueden contener otros Composite, formando jerarquías anidadas.',
  4: 'RECURSIVIDAD — Un solo comando en la raíz se propaga por toda la jerarquía.',
};

// ─── Matrix Rain ─────────────────────────────────────────────────
function startMatrixRain(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const fontSize = 13;
  const chars = '01アイウエオ<>{}()[]∑∆∫◆◇▶▷ABCDEF';

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const cols  = () => Math.floor(canvas.width / fontSize);
  let drops   = new Array(cols()).fill(0);

  let raf;
  let lastFrame = 0;

  function draw(ts) {
    raf = requestAnimationFrame(draw);
    if (ts - lastFrame < 55) return; // ~18fps para no quemar la GPU
    lastFrame = ts;

    if (drops.length !== cols()) drops = new Array(cols()).fill(0);

    ctx.fillStyle = 'rgba(2, 5, 7, 0.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

    drops.forEach((y, i) => {
      const r = Math.random();
      ctx.fillStyle = r > 0.95 ? '#ffffff'
                    : r > 0.6  ? '#00ffc8'
                    : '#005540';
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      else drops[i]++;
    });
  }

  raf = requestAnimationFrame(draw);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
}

// ─── Glitch text animation ───────────────────────────────────────
function animateGlitch(el) {
  const original = el.getAttribute('data-glitch') || el.textContent;
  const charset  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  let step = 0;

  const iv = setInterval(() => {
    el.textContent = original.split('').map((ch, i) => {
      if (ch === ' ') return ' ';
      if (i < step)  return original[i];
      return charset[Math.floor(Math.random() * charset.length)];
    }).join('');
    step += 0.4;
    if (step >= original.length) {
      el.textContent = original;
      clearInterval(iv);
    }
  }, 50);
}

// ─── Loading bar ─────────────────────────────────────────────────
function runLoader(onComplete) {
  const fill    = document.getElementById('loader-fill');
  const label   = document.getElementById('loader-text');
  const messages = [
    'SYS_INIT: CARGANDO MÓDULOS...',
    'LOADING: UNIDADES MILITARES...',
    'COMPILING: COMPOSITE_PATTERN...',
    'DEPLOYING: ÁRBOL_JERÁRQUICO...',
    'SISTEMA: OPERATIVO ✓',
  ];
  let progress = 0;
  let msgIdx   = 0;

  const iv = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress > 100) progress = 100;
    fill.style.width = progress + '%';

    const newIdx = Math.min(Math.floor(progress / 22), messages.length - 1);
    if (newIdx !== msgIdx) { msgIdx = newIdx; label.textContent = messages[msgIdx]; }

    if (progress >= 100) {
      clearInterval(iv);
      label.textContent = messages[4];
      onComplete();
    }
  }, 180);
}

// ─── Splash → Tutorial → Game ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // ---------- Splash ----------
  const splashEl    = document.getElementById('splash');
  const tutorialEl  = document.getElementById('tutorial');
  const gameEl      = document.getElementById('game');
  const splashTitle = document.getElementById('splash-title');
  const splashCta   = document.getElementById('splash-cta');

  const stopRain = startMatrixRain('matrix-canvas');
  setTimeout(() => animateGlitch(splashTitle), 600);

  runLoader(() => {
    splashCta.disabled = false;
    splashCta.style.animation = 'border-glow-pulse 1.2s ease-in-out infinite';
    animateGlitch(splashTitle);
  });

  splashCta.addEventListener('click', () => {
    splashEl.style.opacity = '0';
    splashEl.style.transition = 'opacity 0.6s';
    setTimeout(() => {
      splashEl.classList.add('hidden');
      tutorialEl.classList.remove('hidden');
      if (stopRain) stopRain();
    }, 600);
  });

  // ---------- Tutorial → Game ----------
  document.getElementById('tutorial-cta').addEventListener('click', () => {
    tutorialEl.style.opacity = '0';
    tutorialEl.style.transition = 'opacity 0.4s';
    setTimeout(() => {
      tutorialEl.classList.add('hidden');
      gameEl.classList.remove('hidden');
    }, 400);
  });

  // Botón "BRIEFING" en el juego → vuelve al tutorial
  document.getElementById('btn-briefing').addEventListener('click', () => {
    tutorialEl.style.opacity = '0';
    tutorialEl.classList.remove('hidden');
    requestAnimationFrame(() => {
      tutorialEl.style.transition = 'opacity 0.3s';
      tutorialEl.style.opacity    = '1';
    });
  });


  // ─── Game logic ──────────────────────────────────────────────────
  const state    = new GameState();
  const missions = new MissionSystem();

  const treePanel   = new TreePanel(document.getElementById('tree-panel'), state);
  const palette     = new UnitPalette(document.getElementById('unit-palette'), state);
  const eduOverlay  = new EducationOverlay(document.getElementById('edu-overlay'));
  const actionPanel = new ActionPanel(
    document.getElementById('action-panel'), state, missions, eduOverlay
  );
  const codePanel = new CodePanel(document.getElementById('code-panel'), state);
  const dragDrop  = new DragDrop(state, () => { treePanel.render(); palette.render(); codePanel.showLive(); });

  dragDrop.bind(gameEl);

  state.subscribe((event, data) => {
    if (event === 'army-changed')  { treePanel.render(); codePanel.showLive(); }
    if (event === 'phase-changed') {
      treePanel.render(); palette.render(); actionPanel.render(); codePanel.showLive();
      _updateConceptBar(data.phase);
    }
    if (event === 'action-executed') {
      codePanel._lastAction = data.action;
      codePanel.showTrace(data.action);
    }
    if (event === 'mission-completed') {
      const m = missions.getMission(data.missionId);
      if (m) eduOverlay.onMissionComplete(m);
      _renderMission();
    }
  });

  function _updateConceptBar(phase) {
    const el = document.getElementById('concept-value');
    if (el) el.textContent = PHASE_CONCEPTS[phase] || '';
  }

  function _renderMission() {
    const el = document.getElementById('mission-display');
    if (!el) return;
    const active = missions.getActiveMission(state);

    if (!active) {
      el.innerHTML = `
        <div class="mission-complete">
          <div class="mission-complete__trophy">🏆</div>
          <h2>¡MISIONES COMPLETADAS!</h2>
          <p>Has dominado el patrón <strong>Composite</strong>.</p>
          <p class="mission-complete__summary">
            Objetos individuales y grupos responden<br>
            a la misma interfaz — eso es Composite.
          </p>
        </div>`;
      return;
    }

    el.innerHTML = `
      <div class="mission-panel__header">
        <div class="mission-panel__progress">${state.completedMissions.size}/5</div>
        <h3>${active.title}</h3>
      </div>
      <p class="mission-panel__desc">${active.description}</p>
      <div class="mission-panel__concept">CONCEPTO: <strong>${active.concept}</strong></div>
    `;
  }

  // Selector de fases
  document.querySelectorAll('.phase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.phase-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const phase = Number(btn.dataset.phase);
      state.initPhase(phase);
      _renderMission();
    });
  });

  // Init
  document.querySelector('[data-phase="1"]').classList.add('active');
  state.initPhase(1);
  actionPanel.render();
  codePanel.render();
  _renderMission();
  _updateConceptBar(1);
});
