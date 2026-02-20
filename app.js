// ===== ダーツの旅 — App Logic =====

(function () {
  'use strict';

  // --- DOM Elements ---
  const throwBtn = document.getElementById('throwBtn');
  const btnText = throwBtn.querySelector('.btn-text');
  const dartBoard = document.getElementById('dartBoard');
  const roulettePref = document.getElementById('roulettePref');
  const rouletteCity = document.getElementById('rouletteCity');
  const resultPanel = document.getElementById('resultPanel');
  const resultPref = document.getElementById('resultPref');
  const resultCity = document.getElementById('resultCity');
  const resultPop = document.getElementById('resultPop');
  const resultMapLink = document.getElementById('resultMapLink');
  const totalCountEl = document.getElementById('totalCount');

  // --- Precompute ---
  const totalPopulation = MUNICIPALITIES.reduce((sum, m) => sum + m[2], 0);
  totalCountEl.textContent = MUNICIPALITIES.length.toLocaleString();

  // --- Weighted Random Selection ---
  function weightedRandom() {
    let r = Math.random() * totalPopulation;
    for (const m of MUNICIPALITIES) {
      r -= m[2];
      if (r <= 0) {
        return { pref: m[0], name: m[1], pop: m[2] };
      }
    }
    const last = MUNICIPALITIES[MUNICIPALITIES.length - 1];
    return { pref: last[0], name: last[1], pop: last[2] };
  }

  // --- Random (unweighted) for display during roulette ---
  function randomDisplay() {
    const idx = Math.floor(Math.random() * MUNICIPALITIES.length);
    return { pref: MUNICIPALITIES[idx][0], name: MUNICIPALITIES[idx][1] };
  }

  // --- Background Particles ---
  function createParticles() {
    const container = document.getElementById('bgParticles');
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      container.appendChild(p);
    }
  }

  // --- Roulette Animation ---
  let isRunning = false;

  function throwDart() {
    if (isRunning) return;
    isRunning = true;

    // Reset UI
    throwBtn.disabled = true;
    resultPanel.classList.remove('show');
    dartBoard.classList.remove('revealed');
    dartBoard.classList.add('spinning');

    // Select final result NOW (before animation)
    const finalResult = weightedRandom();

    // Roulette parameters
    const totalSteps = 35 + Math.floor(Math.random() * 15); // 35–50 steps
    let step = 0;

    function tick() {
      step++;

      if (step >= totalSteps) {
        // === Final result ===
        roulettePref.textContent = finalResult.pref;
        rouletteCity.textContent = finalResult.name;
        dartBoard.classList.remove('spinning');
        showResult(finalResult);
        return;
      }

      // Show random municipality
      const display = randomDisplay();
      roulettePref.textContent = display.pref;
      rouletteCity.textContent = display.name;

      // Easing: start fast, slow down near end
      // progress: 0 → 1
      const progress = step / totalSteps;
      // Interval: starts ~50ms, ends ~350ms, with exponential easing
      const interval = 50 + 300 * Math.pow(progress, 3);

      setTimeout(tick, interval);
    }

    // Start after a tiny delay for button click feedback
    setTimeout(tick, 100);
  }

  // --- Show Result ---
  function showResult(result) {
    // Flash effect
    document.body.classList.add('flash');
    setTimeout(() => document.body.classList.remove('flash'), 600);

    // Board reveal glow
    dartBoard.classList.add('revealed');

    // Populate result panel
    resultPref.textContent = result.pref;
    resultCity.textContent = result.name;
    resultPop.textContent = '人口: 約 ' + result.pop.toLocaleString() + ' 人';
    resultMapLink.href = 'https://www.google.com/maps/place/'
      + encodeURIComponent(result.pref + result.name);

    // Show panel after a beat
    setTimeout(() => {
      resultPanel.classList.add('show');
    }, 400);

    // Re-enable button
    setTimeout(() => {
      throwBtn.disabled = false;
      btnText.textContent = 'もう一回！';
      isRunning = false;
    }, 800);
  }

  // --- Init ---
  throwBtn.addEventListener('click', throwDart);
  createParticles();
})();
