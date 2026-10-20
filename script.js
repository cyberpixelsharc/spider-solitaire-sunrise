(() => {
  "use strict";

  const SUITS = {
    S: { sym: "♠", color: "black" },
    H: { sym: "♥", color: "red" },
    D: { sym: "♦", color: "red" },
    C: { sym: "♣", color: "black" },
  };
  const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const COLS = 10;
  const RUN_LEN = 13;
  const FOUND_SLOTS = 8;
  const STOCK_LAYERS = 5;
  const DEAL_LEADIN = 400;

  const i18n = window.i18n;
  const t = (key, params) => i18n.t(key, params);
  const APP = window.APP_INFO || { version: "", build: "" };

  const board = document.getElementById("board");
  const cardsLayer = document.getElementById("cards");
  const slotsLayer = document.getElementById("slots");
  const stockSlot = document.getElementById("stock-slot");
  const overlay = document.getElementById("overlay");
  const toastEl = document.getElementById("toast");
  const timeEl = document.getElementById("time");
  const movesEl = document.getElementById("moves");
  const scoreEl = document.getElementById("score");

  const foundSlots = [];
  for (let i = 0; i < FOUND_SLOTS; i++) {
    const el = document.createElement("div");
    el.className = "slot found-slot";
    slotsLayer.appendChild(el);
    foundSlots.push(el);
  }

  let state = null;
  let history = [];
  let uid = 1;
  let difficulty = 1;
  let installPrompt = null;

  const cardEls = new Map();
  let currentPositions = new Map();
  let layoutData = {};

  let drag = null;
  let dealing = false;
  let autoPlaying = false;
  let autoFinishTried = false;
  let autoPlan = null;
  let autoPlanIndex = 0;
  let infoClose = null;
  let leaveConfirmClose = null;

  let timer = null;
  let timerRunning = false;
  let startStamp = 0;
  let elapsed = 0;

  let toastTimer = null;
  let elevateTimer = null;
  let elevationToken = 0;

  let winAnim = null;
  let winAnimRaf = 0;

  /* ---------------------------------------------------------------
     Deck / setup
  --------------------------------------------------------------- */
  function buildDeck(numSuits) {
    const suits = numSuits === 1 ? ["S"] : numSuits === 2 ? ["S", "H"] : ["S", "H", "D", "C"];
    const copies = 8 / suits.length;
    const deck = [];
    for (const suit of suits) {
      for (let rank = 1; rank <= 13; rank++) {
        for (let c = 0; c < copies; c++) {
          deck.push({ suit, rank, faceUp: false });
        }
      }
    }
    return deck;
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function cardFaceHTML(card) {
    const s = SUITS[card.suit];
    const rank = RANKS[card.rank - 1];
    const cls = s.color === "red" ? "red" : "black";
    return (
      '<div class="card-inner">' +
      '<div class="face front ' + cls + '">' +
      '<span class="rank tl">' + rank + "</span>" +
      '<span class="suit tr">' + s.sym + "</span>" +
      '<span class="suit bl">' + s.sym + "</span>" +
      '<span class="rank br">' + rank + "</span>" +
      '<div class="center">' + s.sym + "</div>" +
      "</div>" +
      '<div class="face back"></div>' +
      "</div>"
    );
  }

  function newGame(numSuits) {
    difficulty = numSuits;
    uid = 1;
    history = [];
    autoPlaying = false;
    autoFinishTried = false;
    autoPlan = null;
    autoPlanIndex = 0;
    document.body.classList.remove("auto");
    document.body.classList.remove("overlay-open");
    document.body.classList.remove("menu-open");
    stopWinAnim();
    cardEls.clear();
    cardsLayer.innerHTML = "";
    currentPositions = new Map();
    dealing = true;

    const deck = shuffle(buildDeck(numSuits));

    const columns = Array.from({ length: COLS }, () => []);
    for (let i = 0; i < 54; i++) {
      const card = deck.pop();
      card.id = uid++;
      columns[i % COLS].push(card);
    }
    columns.forEach((col) => {
      col[col.length - 1].faceUp = true;
    });

    const stock = [];
    for (let d = 0; d < STOCK_LAYERS; d++) {
      const group = [];
      for (let i = 0; i < COLS; i++) {
        const card = deck.pop();
        card.id = uid++;
        card.faceUp = false;
        group.push(card);
      }
      stock.push(group);
    }

    state = { columns, stock, foundations: [], moves: 0, score: 500 };

    const all = [];
    columns.forEach((c) => all.push(...c));
    stock.forEach((g) => all.push(...g));
    const stockCards = stock.flat();
    all.forEach((card) => {
      const el = document.createElement("div");
      el.className = "card down";
      el.dataset.id = card.id;
      el.innerHTML = cardFaceHTML(card);
      cardsLayer.appendChild(el);
      cardEls.set(card.id, el);
    });

    resetTimer();
    updateStats();
    measure();

    const sx = layoutData.stockX;
    const sy = layoutData.stockY;
    cardEls.forEach((el) => {
      el.style.transition = "none";
      el.style.transitionDelay = "";
      el.style.transform = "translate3d(" + sx + "px," + sy + "px,0)";
    });

    void cardsLayer.offsetWidth;

    requestAnimationFrame(() => {
      const pilePlaces = computePlacements();
      stockCards.forEach((card) => {
        const el = cardEls.get(card.id);
        const p = pilePlaces.get(card.id);
        el.style.transform = "translate3d(" + p.x + "px," + p.y + "px,0)";
        el.classList.toggle("top", !!p.top);
      });
      cardEls.forEach((el) => {
        el.style.transition = "";
      });
      setTimeout(() => {
        cardEls.forEach((el) => {
          el.style.transition = "none";
          el.style.transitionDelay = "";
        });
        render();
        void cardsLayer.offsetWidth;
        cardEls.forEach((el) => {
          el.style.transition = "";
        });
        dealing = false;
      }, DEAL_LEADIN);
    });
  }

  /* ---------------------------------------------------------------
     Layout
  --------------------------------------------------------------- */
  function measure() {
    if (!state) return;
    const W = board.clientWidth;
    const H = board.clientHeight;

    const pad = Math.max(8, Math.min(18, W * 0.012));
    const gap = Math.max(4, W * 0.007);
    let cardW = (W - pad * 2 - gap * 9) / COLS;
    cardW = Math.min(cardW, 124);
    const cardH = cardW * 1.42;
    const tableW = cardW * COLS + gap * (COLS - 1);
    const offsetX = (W - tableW) / 2;

    board.style.setProperty("--cw", cardW + "px");
    board.style.setProperty("--ch", cardH + "px");
    document.documentElement.style.setProperty("--gutter", offsetX + "px");

    const tableTop = pad + cardH + Math.max(12, cardH * 0.18, H * 0.035);
    const tableH = Math.max(140, H - tableTop - pad);

    const upMax = cardH * 0.2;
    const downMax = cardH * 0.09;

    let need = 0;
    state.columns.forEach((col) => {
      let t = cardH;
      for (let i = 0; i < col.length - 1; i++) {
        t += col[i].faceUp ? upMax : downMax;
      }
      need = Math.max(need, t);
    });
    const offMax = need - cardH;
    const offAvail = tableH - cardH;
    const k = offMax > offAvail && offMax > 0 ? Math.max(0, offAvail / offMax) : 1;
    const upOff = Math.max(2, upMax * k);
    const downOff = Math.max(1.5, downMax * k);

    const foundX0 = offsetX + 2 * (cardW + gap);

    layoutData = {
      W, H, pad, gap, cardW, cardH, tableW, offsetX, tableTop, tableH,
      upOff, downOff,
      stockX: offsetX,
      stockY: pad,
      foundX0,
      foundY: pad,
    };

    layoutSlots();
  }

  function layoutSlots() {
    const { cardW, cardH, stockX, stockY, foundX0, foundY, gap } = layoutData;
    stockSlot.style.transform = "translate3d(" + stockX + "px," + stockY + "px,0)";
    stockSlot.style.width = cardW + "px";
    stockSlot.style.height = cardH + "px";
    foundSlots.forEach((el, i) => {
      el.style.transform =
        "translate3d(" + (foundX0 + i * (cardW + gap)) + "px," + foundY + "px,0)";
      el.style.width = cardW + "px";
      el.style.height = cardH + "px";
    });
  }

  function computePlacements() {
    const d = layoutData;
    const map = new Map();

    state.stock.forEach((group, di) => {
      const off = di * 3;
      group.forEach((card, gi) => {
        map.set(card.id, {
          x: d.stockX + off,
          y: d.stockY + off,
          z: 1 + di,
          down: true,
          delay: 0,
          top: gi !== 0,
        });
      });
    });

    let fz = 6000;
    state.foundations.forEach((run, fi) => {
      const fx = d.foundX0 + (FOUND_SLOTS - 1 - fi) * (d.cardW + d.gap);
      run.forEach((card, ri) => {
        map.set(card.id, { x: fx, y: d.foundY, z: fz++, down: false, delay: 0, top: ri !== 0 });
      });
    });

    state.columns.forEach((col, ci) => {
      const x = d.offsetX + ci * (d.cardW + d.gap);
      let y = d.tableTop;
      let z = 100;
      col.forEach((card, i) => {
        map.set(card.id, {
          x,
          y,
          z: z++,
          down: !card.faceUp,
          delay: ci * 22 + i * 12,
        });
        if (i < col.length - 1) {
          y += card.faceUp ? d.upOff : d.downOff;
        }
      });
    });

    return map;
  }

  function render(opts = {}) {
    measure();
    const placements = computePlacements();
    currentPositions = placements;

    const collectedIds =
      opts.collected && opts.collected.length ? opts.collected.map((c) => c.id) : null;
    if (collectedIds) {
      collectedIds.forEach((id) => {
        const el = cardEls.get(id);
        if (el) el.classList.add("to-foundation");
      });
    }

    const elevate = opts.elevate && opts.elevate.length ? opts.elevate : null;
    const elevateZ = new Map();
    if (elevate) elevate.forEach((c, i) => elevateZ.set(c.id, 8000 + i));

    if (opts.deal) {
      const dcards = elevate || [];
      dcards.forEach((c) => {
        const el = cardEls.get(c.id);
        if (el) el.classList.add("deal");
      });
      setTimeout(() => {
        dcards.forEach((c) => {
          const el = cardEls.get(c.id);
          if (el) el.classList.remove("deal");
        });
      }, 1500);
    }

    placements.forEach((p, id) => {
      const el = cardEls.get(id);
      if (!el) return;
      if (opts.deal) el.style.transitionDelay = p.delay + "ms";
      if (opts.deal && elevateZ.has(id)) {
        const from = parseXY(el.style.transform);
        if (!from || Math.hypot(p.x - from.x, p.y - from.y) > 24) {
          scheduleMoving(el, p.delay);
        }
      }
      el.classList.toggle("down", p.down);
      el.classList.toggle("top", !!p.top);
      el.style.transform = "translate3d(" + p.x + "px," + p.y + "px,0)";
      el.style.zIndex = elevateZ.has(id) ? elevateZ.get(id) : p.z;
    });

    if (collectedIds) {
      setTimeout(() => {
        collectedIds.forEach((id) => {
          const el = cardEls.get(id);
          if (el) el.classList.remove("to-foundation");
        });
      }, 900);
    }

    if (elevate) {
      const token = ++elevationToken;
      clearTimeout(elevateTimer);
      elevateTimer = setTimeout(() => {
        if (token !== elevationToken) return;
        currentPositions.forEach((p, id) => {
          const el = cardEls.get(id);
          if (el) el.style.zIndex = p.z;
        });
      }, opts.elevateDelay || 520);
    }

    if (opts.deal) {
      setTimeout(() => {
        cardEls.forEach((el) => {
          el.style.transitionDelay = "";
        });
      }, 1300);
    }
    layoutSlots();
  }

  /* ---------------------------------------------------------------
     Helpers
  --------------------------------------------------------------- */
  function parseXY(t) {
    const m = /translate3d\((-?[\d.]+)px,\s*(-?[\d.]+)px/.exec(t || "");
    return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : null;
  }

  function scheduleMoving(el, delay) {
    clearTimeout(el._moveStart);
    clearTimeout(el._moveEnd);
    el._moveStart = setTimeout(() => {
      el.classList.add("moving");
      el._moveEnd = setTimeout(() => {
        el.classList.remove("moving");
        el._moveEnd = null;
      }, 320);
    }, delay);
  }

  function isRun(col, i) {
    if (!col[i] || !col[i].faceUp) return false;
    for (let j = i; j < col.length - 1; j++) {
      const a = col[j];
      const b = col[j + 1];
      if (!a.faceUp || !b.faceUp) return false;
      if (a.suit !== b.suit) return false;
      if (a.rank !== b.rank + 1) return false;
    }
    return true;
  }

  function findLocation(id) {
    for (let ci = 0; ci < COLS; ci++) {
      const idx = state.columns[ci].findIndex((c) => c.id === id);
      if (idx >= 0) return { type: "column", col: ci, index: idx };
    }
    for (let di = 0; di < state.stock.length; di++) {
      if (state.stock[di].some((c) => c.id === id)) return { type: "stock" };
    }
    for (const run of state.foundations) {
      if (run.some((c) => c.id === id)) return { type: "foundation" };
    }
    return null;
  }

  function canMoveTo(targetCol, group) {
    const t = state.columns[targetCol];
    if (t.length === 0) return true;
    return t[t.length - 1].rank === group[0].rank + 1;
  }

  function columnAtX(x) {
    const { offsetX, gap, cardW, tableW } = layoutData;
    if (x < offsetX - cardW || x > offsetX + tableW + cardW) return -1;
    const i = Math.round((x - offsetX - cardW / 2) / (cardW + gap));
    return Math.max(0, Math.min(COLS - 1, i));
  }

  /* ---------------------------------------------------------------
     Moves
  --------------------------------------------------------------- */
  function pushHistory() {
    history.push({
      columns: state.columns.map((c) => c.map((card) => ({ ...card }))),
      stock: state.stock.map((g) => g.map((card) => ({ ...card }))),
      foundations: state.foundations.map((r) => r.map((card) => ({ ...card }))),
      moves: state.moves,
      score: state.score,
    });
    if (history.length > 300) history.shift();
  }

  function performMove(fromCol, fromIndex, toCol) {
    ensureTimer();
    pushHistory();
    const moved = state.columns[fromCol].splice(fromIndex);
    state.columns[toCol].push(...moved);
    const src = state.columns[fromCol];
    if (src.length && !src[src.length - 1].faceUp) src[src.length - 1].faceUp = true;
    state.moves++;
    state.score = Math.max(0, state.score - 1);
    afterMove(moved);
  }

  function dealStock() {
    if (dealing) return;
    if (!state.stock.length) {
      toast(t("toast.noStock"));
      return;
    }
    if (state.columns.some((c) => c.length === 0)) {
      toast(t("toast.emptyColumns"));
      return;
    }
    ensureTimer();
    pushHistory();
    const group = state.stock.pop();
    group.forEach((card, i) => {
      card.faceUp = true;
      state.columns[i].push(card);
    });
    state.moves++;
    state.score = Math.max(0, state.score - 1);
    afterMove(group, { deal: true });
  }

  function runEndingAt(col, i) {
    let len = 1;
    for (let k = i; k > 0; k--) {
      const a = col[k - 1];
      const b = col[k];
      if (a.faceUp && b.faceUp && a.suit === b.suit && a.rank === b.rank + 1) len++;
      else break;
    }
    return len;
  }

  function autoMove(fromCol, fromIndex) {
    const group = state.columns[fromCol].slice(fromIndex);
    const srcCol = state.columns[fromCol];

    const onSuit =
      fromIndex > 0 &&
      srcCol[fromIndex - 1].faceUp &&
      srcCol[fromIndex - 1].suit === group[0].suit &&
      srcCol[fromIndex - 1].rank === group[0].rank + 1;
    const currentMerged = onSuit
      ? runEndingAt(srcCol, fromIndex - 1) + group.length
      : group.length;

    let best = -1;
    let bestScore = -Infinity;
    let bestMerged = -1;
    let bestSameSuit = false;

    for (let ci = 0; ci < COLS; ci++) {
      if (ci === fromCol) continue;
      if (!canMoveTo(ci, group)) continue;

      const t = state.columns[ci];
      let sc;
      let merged = 0;
      let sameSuit = false;

      if (t.length === 0) {
        sc = group.length === 1 ? 0 : 1;
      } else {
        const top = t[t.length - 1];
        sameSuit = top.suit === group[0].suit;
        merged = (sameSuit ? runEndingAt(t, t.length - 1) : 1) + group.length;
        sc = 2 + (sameSuit ? 100 : 0) + merged;
      }

      if (sc > bestScore) {
        bestScore = sc;
        best = ci;
        bestMerged = merged;
        bestSameSuit = sameSuit;
      }
    }

    if (best < 0) return;
    if (onSuit && !(bestSameSuit && bestMerged > currentMerged)) return;

    performMove(fromCol, fromIndex, best);
  }

  function isCompleteRun(col) {
    const n = col.length;
    if (n < RUN_LEN) return false;
    const start = n - RUN_LEN;
    const suit = col[start].suit;
    for (let i = 0; i < RUN_LEN; i++) {
      const c = col[start + i];
      if (!c.faceUp || c.suit !== suit || c.rank !== 13 - i) return false;
    }
    return true;
  }

  function tryCollect(col) {
    if (!isCompleteRun(col)) return false;
    const run = col.splice(col.length - RUN_LEN, RUN_LEN);
    state.foundations.push(run);
    state.score += 100;
    if (col.length && !col[col.length - 1].faceUp) col[col.length - 1].faceUp = true;
    return run;
  }

  function afterMove(elevated, opts = {}) {
    const completes = state.columns.some(isCompleteRun);
    const deal = !!opts.deal;

    if (!completes) {
      render({ elevate: elevated, deal });
      updateStats();
      if (state.foundations.length === 8) setTimeout(showWin, 450);
      maybeAutoFinish();
      return;
    }

    render({ elevate: elevated, deal });
    updateStats();

    setTimeout(() => {
      const collected = [];
      for (const col of state.columns) {
        let run;
        while ((run = tryCollect(col))) collected.push(...run);
      }
      if (collected.length) render({ collected });
      updateStats();
      if (state.foundations.length === 8) setTimeout(showWin, 450);
      maybeAutoFinish();
    }, 520);
  }

  /* ---------------------------------------------------------------
     Auto-Finish
  --------------------------------------------------------------- */
  function allFaceUp() {
    return state.columns.every((col) => col.every((c) => c.faceUp));
  }

  function cloneCols(cols) {
    return cols.map((c) => c.map((x) => ({ suit: x.suit, rank: x.rank, id: x.id, faceUp: true })));
  }

  function colsSignature(cols) {
    return cols
      .map((c) => c.map((x) => x.suit + x.rank).join(";"))
      .sort()
      .join("|");
  }

  function collectRunsFrom(cols) {
    let collected = 0;
    let changed = true;
    while (changed) {
      changed = false;
      for (const col of cols) {
        if (isCompleteRun(col)) {
          col.splice(col.length - RUN_LEN, RUN_LEN);
          collected++;
          changed = true;
        }
      }
    }
    return collected;
  }

  function finishHeur(cols, foundations) {
    let s = foundations * 200;
    for (const col of cols) {
      for (let j = 0; j < col.length - 1; j++) {
        if (col[j].suit === col[j + 1].suit && col[j].rank === col[j + 1].rank + 1) s += 2;
        else s -= 1;
      }
    }
    return s;
  }

  function finishMoves(cols) {
    const list = [];
    for (let ci = 0; ci < cols.length; ci++) {
      const col = cols[ci];
      for (let i = 0; i < col.length; i++) {
        if (!isRun(col, i)) continue;
        const head = col[i];
        const gLen = col.length - i;
        for (let ti = 0; ti < cols.length; ti++) {
          if (ti === ci) continue;
          const tc = cols[ti];
          let sc;
          if (tc.length === 0) {
            if (i === 0) continue;
            sc = gLen * 0.1;
          } else if (tc[tc.length - 1].rank === head.rank + 1) {
            const same = tc[tc.length - 1].suit === head.suit;
            const merged = (same ? runEndingAt(tc, tc.length - 1) : 1) + gLen;
            sc = (same ? 100 : 0) + merged + (same && merged >= RUN_LEN ? 1000 : 0);
          } else {
            continue;
          }
          list.push({ from: ci, index: i, to: ti, sc });
        }
      }
    }
    list.sort((a, b) => b.sc - a.sc);
    return list;
  }

  function solveFinish() {
    const start = cloneCols(state.columns);
    const f0 = state.foundations.length + collectRunsFrom(start);
    if (f0 >= 8) return [];

    const visited = new Set();
    const open = [];
    const push = (n) => {
      open.push(n);
      let i = open.length - 1;
      while (i > 0) {
        const par = (i - 1) >> 1;
        if (open[par].gh >= open[i].gh) break;
        const tmp = open[par];
        open[par] = open[i];
        open[i] = tmp;
        i = par;
      }
    };
    const pop = () => {
      const top = open[0];
      const last = open.pop();
      if (open.length) {
        open[0] = last;
        let i = 0;
        for (;;) {
          const l = 2 * i + 1;
          const r = l + 1;
          let m = i;
          if (l < open.length && open[l].gh > open[m].gh) m = l;
          if (r < open.length && open[r].gh > open[m].gh) m = r;
          if (m === i) break;
          const tmp = open[m];
          open[m] = open[i];
          open[i] = tmp;
          i = m;
        }
      }
      return top;
    };

    visited.add(f0 + "#" + colsSignature(start));
    push({ cols: start, f: f0, gh: finishHeur(start, f0), parent: null, move: null });

    let count = 0;
    const deadline = performance.now() + 800;
    while (open.length) {
      const cur = pop();
      if (cur.f >= 8) {
        const plan = [];
        for (let n = cur; n.parent; n = n.parent) plan.push(n.move);
        plan.reverse();
        return plan;
      }
      count++;
      if (count > 50000 || performance.now() > deadline) return null;

      const moves = finishMoves(cur.cols);
      for (const m of moves) {
        const nc = cloneCols(cur.cols);
        const g = nc[m.from].splice(m.index);
        nc[m.to].push(...g);
        const nf = cur.f + collectRunsFrom(nc);
        const key = nf + "#" + colsSignature(nc);
        if (visited.has(key)) continue;
        visited.add(key);
        push({
          cols: nc,
          f: nf,
          gh: finishHeur(nc, nf),
          parent: cur,
          move: { from: m.from, index: m.index, to: m.to },
        });
      }
    }
    return null;
  }

  function maybeAutoFinish() {
    if (autoPlaying || autoFinishTried || dealing || !state) return;
    if (state.foundations.length === 8) return;
    if (state.stock.length || !allFaceUp()) return;
    autoFinishTried = true;

    const plan = solveFinish();
    if (!plan || !plan.length) return;

    autoPlan = plan;
    autoPlanIndex = 0;
    autoPlaying = true;
    document.body.classList.add("auto");
    setTimeout(autoFinishStep, 500);
  }

  function autoFinishStep() {
    if (!autoPlaying || !state) return;
    if (state.foundations.length === 8) {
      autoStop();
      return;
    }
    if (state.columns.some(isCompleteRun)) {
      setTimeout(autoFinishStep, 240);
      return;
    }

    const move = autoPlan && autoPlan[autoPlanIndex];
    if (!move) {
      autoStop();
      return;
    }

    const col = state.columns[move.from];
    if (!col || !isRun(col, move.index) || !canMoveTo(move.to, col.slice(move.index))) {
      autoStop();
      return;
    }

    autoPlanIndex++;
    performMove(move.from, move.index, move.to);
    const completed = state.columns.some(isCompleteRun);
    setTimeout(autoFinishStep, completed ? 1050 : 430);
  }

  function autoStop() {
    autoPlaying = false;
    autoPlan = null;
    autoPlanIndex = 0;
    document.body.classList.remove("auto");
  }

  function undo() {
    if (!history.length) {
      toast(t("toast.nothingUndo"));
      return;
    }
    const prev = currentPositions;
    const h = history.pop();
    state = {
      columns: h.columns,
      stock: h.stock,
      foundations: h.foundations,
      moves: h.moves,
      score: h.score,
    };
    measure();
    const moving = [];
    computePlacements().forEach((p, id) => {
      const q = prev.get(id);
      if (q && Math.hypot(p.x - q.x, p.y - q.y) > 24) moving.push({ id });
    });
    render({ elevate: moving });
    updateStats();
  }

  /* ---------------------------------------------------------------
     Hint
  --------------------------------------------------------------- */
  function findHint() {
    const cands = [];
    for (let ci = 0; ci < COLS; ci++) {
      const col = state.columns[ci];
      for (let i = 0; i < col.length; i++) {
        if (!col[i].faceUp || !isRun(col, i)) continue;
        const group = col.slice(i);
        for (let ti = 0; ti < COLS; ti++) {
          if (ti === ci) continue;
          if (!canMoveTo(ti, group)) continue;
          const t = state.columns[ti];
          if (t.length === 0 && group.length === 1) continue;
          let sc = 0;
          if (t.length > 0) {
            sc += 2;
            if (t[t.length - 1].suit === group[0].suit) sc += 3;
            if (t.length >= 2 && t[t.length - 2].suit === t[t.length - 1].suit) sc += 1;
          }
          sc += group.length * 0.1;
          cands.push({ from: ci, index: i, to: ti, sc });
        }
      }
    }
    if (!cands.length) return null;
    cands.sort((a, b) => b.sc - a.sc);
    return cands[0];
  }

  function showHint() {
    const h = findHint();
    if (!h) {
      if (state.stock.length && !state.columns.some((c) => c.length === 0)) {
        toast(t("toast.dealHint"));
      } else {
        toast(t("toast.noMove"));
      }
      return;
    }
    const src = state.columns[h.from].slice(h.index);
    src.forEach((c) => {
      const el = cardEls.get(c.id);
      el.classList.add("hint");
      setTimeout(() => el.classList.remove("hint"), 1700);
    });
    const t = state.columns[h.to];
    if (t.length) {
      const el = cardEls.get(t[t.length - 1].id);
      el.classList.add("hint-dest");
      setTimeout(() => el.classList.remove("hint-dest"), 1700);
    }
  }

  /* ---------------------------------------------------------------
     Input
  --------------------------------------------------------------- */
  cardsLayer.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  function onPointerDown(e) {
    if (dealing || autoPlaying || !state || overlay.classList.contains("show")) return;
    if (e.button !== undefined && e.button !== 0) return;

    const el = e.target.closest(".card");
    if (!el) return;

    const id = Number(el.dataset.id);
    const loc = findLocation(id);
    if (!loc) return;

    if (loc.type === "stock") {
      dealStock();
      return;
    }
    if (loc.type === "foundation") return;

    const col = state.columns[loc.col];
    const card = col[loc.index];
    if (!card.faceUp || !isRun(col, loc.index)) return;

    drag = {
      group: col.slice(loc.index),
      col: loc.col,
      index: loc.index,
      startX: e.clientX,
      startY: e.clientY,
      active: false,
    };
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (!drag.active) {
      if (Math.hypot(dx, dy) < 6) return;
      drag.active = true;
      document.body.classList.add("dragging");
      drag.group.forEach((c, i) => {
        const el = cardEls.get(c.id);
        el.classList.add("lift");
        el.style.zIndex = 9000 + i;
      });
    }

    drag.group.forEach((c) => {
      const el = cardEls.get(c.id);
      const o = currentPositions.get(c.id);
      if (!o) return;
      el.style.transform = "translate3d(" + (o.x + dx) + "px," + (o.y + dy) + "px,0)";
    });
  }

  function onPointerUp(e) {
    if (!drag) return;
    const d = drag;
    drag = null;
    document.body.classList.remove("dragging");

    d.group.forEach((c) => {
      const el = cardEls.get(c.id);
      el.classList.remove("lift");
    });

    if (!d.active) return;

    const leader = d.group[0];
    const o = currentPositions.get(leader.id);
    const dx = e.clientX - d.startX;
    const cx = o.x + dx + layoutData.cardW / 2;
    const target = columnAtX(cx);

    if (target < 0 || target === d.col || !canMoveTo(target, d.group)) {
      render({ elevate: d.group });
      return;
    }
    performMove(d.col, d.index, target);
  }

  cardsLayer.addEventListener("dblclick", (e) => {
    if (dealing || autoPlaying || !state) return;
    const el = e.target.closest(".card");
    if (!el) return;
    const loc = findLocation(Number(el.dataset.id));
    if (!loc || loc.type !== "column") return;
    const col = state.columns[loc.col];
    if (!col[loc.index].faceUp || !isRun(col, loc.index)) return;
    autoMove(loc.col, loc.index);
  });

  stockSlot.addEventListener("pointerdown", () => {
    if (!state || dealing || autoPlaying || !state.stock.length) return;
    if (state.columns.some((c) => c.length === 0)) return;
    dealStock();
  });

  window.addEventListener("resize", () => {
    if (!state) return;
    measure();
    render();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && (infoClose || leaveConfirmClose)) {
      if (infoClose) infoClose();
      else leaveConfirmClose();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (autoPlaying) return;
      undo();
    }
  });

  document.getElementById("btn-undo").addEventListener("click", () => {
    if (autoPlaying) return;
    undo();
  });
  document.getElementById("btn-hint").addEventListener("click", () => {
    if (state && !dealing && !autoPlaying) showHint();
  });
  document.getElementById("btn-leave").addEventListener("click", confirmLeaveGame);
  const brandEl = document.getElementById("btn-info");
  brandEl.addEventListener("click", showInfo);
  brandEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      showInfo();
    }
  });

  /* ---------------------------------------------------------------
     UI / stats
  --------------------------------------------------------------- */
  function updateStats() {
    movesEl.textContent = state.moves;
    scoreEl.textContent = state.score;
  }

  function formatTime(ms) {
    const total = Math.floor(ms / 1000);
    const m = String(Math.floor(total / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return m + ":" + s;
  }

  function formatBuild(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    try {
      return new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" }).format(d);
    } catch (e) {
      return iso;
    }
  }

  function appVersionLine() {
    if (!APP.version) return "";
    return t("app.footer", { version: APP.version, build: formatBuild(APP.build) });
  }

  function updateTime() {
    timeEl.textContent = formatTime(elapsed);
  }

  function ensureTimer() {
    if (timerRunning) return;
    timerRunning = true;
    startStamp = Date.now() - elapsed;
    timer = setInterval(() => {
      elapsed = Date.now() - startStamp;
      updateTime();
    }, 500);
  }

  function resetTimer() {
    stopTimer();
    elapsed = 0;
    updateTime();
  }

  function stopTimer() {
    timerRunning = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1900);
  }

  /* ---------------------------------------------------------------
     Win-Animation
  --------------------------------------------------------------- */
  function stopWinAnim() {
    if (winAnimRaf) cancelAnimationFrame(winAnimRaf);
    winAnimRaf = 0;
    if (winAnim) {
      winAnim.items.forEach((it) => {
        if (it.boardEl) it.boardEl.style.visibility = "";
      });
    }
    winAnim = null;
  }

  function winFrame(now) {
    if (!winAnim) return;
    const t = now - winAnim.t0;
    const done = t >= winAnim.total;
    for (const it of winAnim.items) {
      const local = done ? it.motion : t - it.launch;
      if (local < 0) {
        it.el.style.opacity = "1";
        it.el.style.transform =
          "translate3d(" + it.stack.x + "px," + it.stack.y + "px,0)";
        continue;
      }
      if (it.boardEl && !it.gone) {
        it.boardEl.style.visibility = "hidden";
        it.el.style.zIndex = 5000 + it.i;
        it.gone = true;
      }
      it.el.style.opacity = "1";
      let acc = 0;
      let seg = -1;
      let u = 0;
      for (let s = 0; s < it.durs.length; s++) {
        if (local < acc + it.durs[s]) {
          seg = s;
          u = (local - acc) / it.durs[s];
          break;
        }
        acc += it.durs[s];
      }
      if (seg < 0) {
        const last = it.pts[it.pts.length - 1];
        it.el.style.transform =
          "translate3d(" + last.x + "px," + last.y + "px,0) rotate(" + it.rot + "deg)";
        continue;
      }
      const a = it.pts[seg];
      const b = it.pts[seg + 1];
      const x = a.x + (b.x - a.x) * u;
      const y = a.y + (b.y - a.y) * u - it.hs[seg] * Math.sin(Math.PI * u);
      const prog = Math.min(1, local / it.motion);
      const rot = it.rot * prog + it.spins * 360 * prog;
      it.el.style.transform =
        "translate3d(" + x + "px," + y + "px,0) rotate(" + rot + "deg)";
    }
    if (done) {
      winAnimRaf = 0;
      return;
    }
    winAnimRaf = requestAnimationFrame(winFrame);
  }

  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function startWinAnim() {
    const container = overlay.querySelector(".win-cards");
    if (!container || !state || !state.foundations.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stopWinAnim();
    container.innerHTML = "";

    const W = window.innerWidth;
    const H = window.innerHeight;
    const cw = layoutData.cardW || 80;
    const ch = layoutData.cardH || 114;
    container.style.setProperty("--cw", cw + "px");
    container.style.setProperty("--ch", ch + "px");

    const margin = 8;
    const landY = H - ch - margin;
    const minX = margin;
    const maxX = W - cw - margin;
    const fall = 720;
    const bounce = 340;
    const hops = 4;
    const decay = 0.55;
    const hopScale = 3;
    const sfx = 1.5;
    const launchStep = 45;
    const pieces = [];

    state.foundations.forEach((run) =>
      run.forEach((card) => {
        const el = cardEls.get(card.id);
        if (el) el.style.visibility = "";
      })
    );

    let i = 0;
    for (let fi = 0; fi < state.foundations.length; fi++) {
      const run = state.foundations[fi];
      const rect = foundSlots[FOUND_SLOTS - 1 - fi].getBoundingClientRect();
      const ox = rect.left;
      const oy = rect.top;
      for (let ci = run.length - 1; ci >= 0; ci--) {
        const rand = rng(i * 2654435761 + 87);
        const first = minX + rand() * (maxX - minX);
        const xs = [ox, first];
        let drift = (rand() - 0.5) * W * 0.16;
        for (let k = 0; k < hops; k++) {
          const nx = xs[xs.length - 1] + drift;
          xs.push(Math.max(minX, Math.min(maxX, nx)));
          drift *= 0.6;
        }
        const pts = xs.map((x, k) => ({ x, y: k === 0 ? oy : landY }));
        const bH = (H * 0.05 + rand() * H * 0.05) * hopScale;
        const hs = [H * 0.16];
        const durs = [fall];
        for (let k = 0; k < hops; k++) {
          hs.push(bH * Math.pow(decay, k));
          durs.push(bounce * Math.sqrt(hopScale) * Math.pow(0.88, k));
        }
        const motion = durs.reduce((a, b) => a + b, 0);
        const p = ci;
        const sx = ox + p * sfx;
        const sy = oy + p * sfx;

        const el = document.createElement("div");
        el.className = "card win-card";
        el.innerHTML = cardFaceHTML(run[ci]);
        el.style.opacity = "1";
        el.style.zIndex = 100 + p;
        el.style.transform = "translate3d(" + sx + "px," + sy + "px,0)";
        container.appendChild(el);

        pieces.push({
          el,
          i,
          p,
          boardEl: cardEls.get(run[ci].id),
          gone: false,
          launch: i * launchStep,
          pts,
          hs,
          durs,
          motion,
          stack: { x: sx, y: sy },
          spins: (rand() < 0.5 ? -1 : 1) * (1 + Math.floor(rand() * 2)),
          rot: (rand() * 70 - 35) | 0,
        });
        i++;
      }
    }

    const last = pieces[pieces.length - 1];
    winAnim = {
      container,
      items: pieces,
      t0: performance.now(),
      total: last.launch + last.motion + 60,
    };
    winAnimRaf = requestAnimationFrame(winFrame);
  }

  /* ---------------------------------------------------------------
     Overlays
  --------------------------------------------------------------- */
  function suitIcons(suits) {
    return suits
      .map((s) => '<span class="suit ' + SUITS[s].color + '">' + SUITS[s].sym + "</span>")
      .join("");
  }

  function showMenu() {
    stopWinAnim();
    stopTimer();
    const ver = appVersionLine();
    overlay.innerHTML =
      '<div class="modal">' +
      '<img src="icons/favicon.svg" class="modal-logo" alt="" width="68" height="68" />' +
      "<h2>Spider Solitaire: Sunrise</h2>" +
      '<p class="sub">' + t("menu.subtitle") + "</p>" +
      '<div class="difficulty">' +
      '<button class="diff' + (difficulty === 1 ? " selected" : "") + '" data-suits="1" title="' + t("menu.oneSuit") + '" aria-label="' + t("menu.oneSuit") + " · " + t("menu.easy") + '"><strong class="suits">' + suitIcons(["S"]) + "</strong><span>" + t("menu.easy") + "</span></button>" +
      '<button class="diff' + (difficulty === 2 ? " selected" : "") + '" data-suits="2" title="' + t("menu.twoSuits") + '" aria-label="' + t("menu.twoSuits") + " · " + t("menu.medium") + '"><strong class="suits">' + suitIcons(["S", "H"]) + "</strong><span>" + t("menu.medium") + "</span></button>" +
      '<button class="diff' + (difficulty === 4 ? " selected" : "") + '" data-suits="4" title="' + t("menu.fourSuits") + '" aria-label="' + t("menu.fourSuits") + " · " + t("menu.hard") + '"><strong class="suits">' + suitIcons(["S", "H", "C", "D"]) + "</strong><span>" + t("menu.hard") + "</span></button>" +
      "</div>" +
      '<button class="btn primary big" id="btn-start">' + t("menu.start") + "</button>" +
      (ver ? '<div class="app-version">' + ver + "</div>" : "") +
      "</div>";
    overlay.classList.add("show");
    document.body.classList.add("overlay-open");
    document.body.classList.add("menu-open");

    overlay.querySelectorAll(".diff").forEach((b) => {
      b.addEventListener("click", () => {
        difficulty = Number(b.dataset.suits);
        overlay.querySelectorAll(".diff").forEach((x) => x.classList.toggle("selected", x === b));
      });
    });

    overlay.querySelector("#btn-start").addEventListener("click", () => {
      overlay.classList.remove("show");
      newGame(difficulty);
    });
  }

  function confirmLeaveGame() {
    if (!state) {
      showMenu();
      return;
    }
    const wasRunning = timerRunning;
    if (wasRunning) stopTimer();
    overlay.innerHTML =
      '<div class="modal">' +
      "<h2>" + t("confirm.leave.title") + "</h2>" +
      '<p class="sub">' + t("confirm.leave.text") + "</p>" +
      '<div class="modal-actions">' +
      '<button class="btn" id="btn-cancel-leave">' + t("confirm.cancel") + "</button>" +
      '<button class="btn primary" id="btn-confirm-leave">' + t("confirm.leave.ok") + "</button>" +
      "</div>" +
      "</div>";
    overlay.classList.add("show");
    document.body.classList.add("overlay-open");
    leaveConfirmClose = () => {
      leaveConfirmClose = null;
      overlay.classList.remove("show");
      document.body.classList.remove("overlay-open");
      if (wasRunning && state) ensureTimer();
    };
    overlay.querySelector("#btn-cancel-leave").addEventListener("click", () => {
      if (leaveConfirmClose) leaveConfirmClose();
    });
    overlay.querySelector("#btn-confirm-leave").addEventListener("click", () => {
      leaveConfirmClose = null;
      overlay.classList.remove("show");
      document.body.classList.remove("overlay-open");
      showMenu();
    });
  }

  function showInfo() {
    const ver = appVersionLine();
    const wasRunning = timerRunning;
    if (wasRunning) stopTimer();
    overlay.innerHTML =
      '<div class="modal">' +
      '<img src="icons/favicon.svg" class="modal-logo" alt="" width="68" height="68" />' +
      "<h2>Spider Solitaire: Sunrise</h2>" +
      '<p class="about">' + t("info.text") + "</p>" +
      '<button class="btn primary big" id="btn-close-info">' + t("info.close") + "</button>" +
      (installPrompt ? '<button class="btn big" id="btn-install">' + t("info.install") + "</button>" : "") +
      (ver ? '<div class="app-version">' + ver + "</div>" : "") +
      '<a class="src" href="https://github.com/cyberpixelsharc/spider-solitaire-sunrise" target="_blank" rel="noopener">' + t("info.source") + "</a>" +
      "</div>";
    overlay.classList.add("show");
    document.body.classList.add("overlay-open");
    infoClose = () => {
      infoClose = null;
      overlay.classList.remove("show");
      document.body.classList.remove("overlay-open");
      if (wasRunning && state) ensureTimer();
    };
    overlay.querySelector("#btn-close-info").addEventListener("click", () => infoClose());
    const installBtn = overlay.querySelector("#btn-install");
    if (installBtn) {
      installBtn.addEventListener("click", async () => {
        const pending = installPrompt;
        installPrompt = null;
        installBtn.remove();
        try {
          await pending.prompt();
          await pending.userChoice;
        } catch (err) {
          console.error("Install prompt failed:", err);
        }
      });
    }
  }

  function showWin() {
    stopTimer();
    const ver = appVersionLine();
    overlay.innerHTML =
      '<div class="win-cards"></div>' +
      '<div class="modal">' +
      "<h2>" + t("win.title") + "</h2>" +
      '<p class="sub">' + t("win.subtitle") + "</p>" +
      '<div class="result">' +
      "<div><span>" + t("stats.time") + "</span><strong>" + formatTime(elapsed) + "</strong></div>" +
      "<div><span>" + t("stats.moves") + "</span><strong>" + state.moves + "</strong></div>" +
      "<div><span>" + t("stats.score") + "</span><strong>" + state.score + "</strong></div>" +
      "</div>" +
      '<button class="btn primary big" id="btn-again">' + t("win.again") + "</button>" +
      (ver ? '<div class="app-version">' + ver + "</div>" : "") +
      "</div>";
    overlay.classList.add("show");
    document.body.classList.add("overlay-open");
    startWinAnim();
    overlay.querySelector("#btn-again").addEventListener("click", () => {
      overlay.classList.remove("show");
      showMenu();
    });
  }

  window.addEventListener("resize", () => {
    if (winAnimRaf) startWinAnim();
  });

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installPrompt = e;
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
  });

  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController || reloaded || state) return;
      reloaded = true;
      location.reload();
    });
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("sw.js", { updateViaCache: "none" })
        .catch((err) => {
          console.error("Service worker registration failed:", err);
        });
    });
  }

  showMenu();
})();
