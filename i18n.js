(() => {
  "use strict";

  const EN = {
    "stats.time": "Time",
    "stats.moves": "Moves",
    "stats.score": "Score",
    "btn.undo": "Undo",
    "btn.undo.title": "Undo last move",
    "btn.hint": "Hint",
    "btn.hint.title": "Show a hint",
    "btn.new": "New Game",
    "btn.new.title": "Start a new game",
    "toast.noStock": "No cards left to deal.",
    "toast.emptyColumns": "Empty columns must be filled first.",
    "toast.nothingUndo": "Nothing to undo.",
    "toast.dealHint": "Hint: deal new cards.",
    "toast.noMove": "No move found.",
    "menu.subtitle": "Order King to Ace in a single suit. Choose the difficulty.",
    "menu.oneSuit": "1 Suit",
    "menu.twoSuits": "2 Suits",
    "menu.fourSuits": "4 Suits",
    "menu.easy": "Easy",
    "menu.medium": "Medium",
    "menu.hard": "Hard",
    "menu.start": "Start Game",
    "win.title": "🎉 You won!",
    "win.subtitle": "You collected all 8 sequences.",
    "win.again": "Play Again",
    "app.footer": "Version {version} · Build {build}",
  };

  const DE = {
    "stats.time": "Zeit",
    "stats.moves": "Züge",
    "stats.score": "Punkte",
    "btn.undo": "Rückgängig",
    "btn.undo.title": "Letzten Zug rückgängig machen",
    "btn.hint": "Tipp",
    "btn.hint.title": "Tipp anzeigen",
    "btn.new": "Neues Spiel",
    "btn.new.title": "Neues Spiel starten",
    "toast.noStock": "Es sind keine Karten mehr zum Austeilen da.",
    "toast.emptyColumns": "Leere Spalten müssen zuerst gefüllt werden.",
    "toast.nothingUndo": "Nichts zum Rückgängigmachen.",
    "toast.dealHint": "Tipp: Teile neue Karten aus.",
    "toast.noMove": "Kein Zug gefunden.",
    "menu.subtitle": "Ordne K bis A in einer Farbe. Wähle die Schwierigkeit.",
    "menu.oneSuit": "1 Farbe",
    "menu.twoSuits": "2 Farben",
    "menu.fourSuits": "4 Farben",
    "menu.easy": "Leicht",
    "menu.medium": "Mittel",
    "menu.hard": "Schwer",
    "menu.start": "Spiel starten",
    "win.title": "🎉 Gewonnen!",
    "win.subtitle": "Du hast alle 8 Reihen gesammelt.",
    "win.again": "Nochmal spielen",
    "app.footer": "Version {version} · Build {build}",
  };

  const FR = {
    "stats.time": "Temps",
    "stats.moves": "Coups",
    "stats.score": "Points",
    "btn.undo": "Annuler",
    "btn.undo.title": "Annuler le dernier coup",
    "btn.hint": "Indice",
    "btn.hint.title": "Afficher un indice",
    "btn.new": "Nouvelle partie",
    "btn.new.title": "Démarrer une nouvelle partie",
    "toast.noStock": "Plus de cartes à distribuer.",
    "toast.emptyColumns": "Les colonnes vides doivent d'abord être remplies.",
    "toast.nothingUndo": "Rien à annuler.",
    "toast.dealHint": "Indice : distribuez de nouvelles cartes.",
    "toast.noMove": "Aucun coup trouvé.",
    "menu.subtitle": "Classez du Roi à l'As dans une même couleur. Choisissez la difficulté.",
    "menu.oneSuit": "1 couleur",
    "menu.twoSuits": "2 couleurs",
    "menu.fourSuits": "4 couleurs",
    "menu.easy": "Facile",
    "menu.medium": "Moyen",
    "menu.hard": "Difficile",
    "menu.start": "Démarrer la partie",
    "win.title": "🎉 Gagné !",
    "win.subtitle": "Vous avez rassemblé les 8 séquences.",
    "win.again": "Rejouer",
    "app.footer": "Version {version} · Compilation {build}",
  };

  const ES = {
    "stats.time": "Tiempo",
    "stats.moves": "Movimientos",
    "stats.score": "Puntos",
    "btn.undo": "Deshacer",
    "btn.undo.title": "Deshacer el último movimiento",
    "btn.hint": "Pista",
    "btn.hint.title": "Mostrar una pista",
    "btn.new": "Nueva partida",
    "btn.new.title": "Iniciar una nueva partida",
    "toast.noStock": "No quedan cartas para repartir.",
    "toast.emptyColumns": "Primero hay que llenar las columnas vacías.",
    "toast.nothingUndo": "Nada que deshacer.",
    "toast.dealHint": "Pista: reparte nuevas cartas.",
    "toast.noMove": "No se encontró ningún movimiento.",
    "menu.subtitle": "Ordena de Rey a As en un mismo palo. Elige la dificultad.",
    "menu.oneSuit": "1 palo",
    "menu.twoSuits": "2 palos",
    "menu.fourSuits": "4 palos",
    "menu.easy": "Fácil",
    "menu.medium": "Media",
    "menu.hard": "Difícil",
    "menu.start": "Empezar partida",
    "win.title": "🎉 ¡Ganaste!",
    "win.subtitle": "Has reunido las 8 secuencias.",
    "win.again": "Jugar de nuevo",
    "app.footer": "Versión {version} · Compilación {build}",
  };

  const IT = {
    "stats.time": "Tempo",
    "stats.moves": "Mosse",
    "stats.score": "Punti",
    "btn.undo": "Annulla",
    "btn.undo.title": "Annulla l'ultima mossa",
    "btn.hint": "Suggerimento",
    "btn.hint.title": "Mostra un suggerimento",
    "btn.new": "Nuova partita",
    "btn.new.title": "Inizia una nuova partita",
    "toast.noStock": "Non ci sono più carte da distribuire.",
    "toast.emptyColumns": "Le colonne vuote devono essere riempite prima.",
    "toast.nothingUndo": "Niente da annullare.",
    "toast.dealHint": "Suggerimento: distribuisci nuove carte.",
    "toast.noMove": "Nessuna mossa trovata.",
    "menu.subtitle": "Ordina dal Re all'As dello stesso seme. Scegli la difficoltà.",
    "menu.oneSuit": "1 seme",
    "menu.twoSuits": "2 semi",
    "menu.fourSuits": "4 semi",
    "menu.easy": "Facile",
    "menu.medium": "Media",
    "menu.hard": "Difficile",
    "menu.start": "Inizia partita",
    "win.title": "🎉 Hai vinto!",
    "win.subtitle": "Hai raccolto tutte le 8 sequenze.",
    "win.again": "Gioca ancora",
    "app.footer": "Versione {version} · Build {build}",
  };

  const PT = {
    "stats.time": "Tempo",
    "stats.moves": "Jogadas",
    "stats.score": "Pontos",
    "btn.undo": "Desfazer",
    "btn.undo.title": "Desfazer a última jogada",
    "btn.hint": "Dica",
    "btn.hint.title": "Mostrar uma dica",
    "btn.new": "Novo jogo",
    "btn.new.title": "Iniciar um novo jogo",
    "toast.noStock": "Não há mais cartas para distribuir.",
    "toast.emptyColumns": "As colunas vazias devem ser preenchidas primeiro.",
    "toast.nothingUndo": "Nada para desfazer.",
    "toast.dealHint": "Dica: distribua novas cartas.",
    "toast.noMove": "Nenhuma jogada encontrada.",
    "menu.subtitle": "Ordene de Rei a Ás no mesmo naipe. Escolha a dificuldade.",
    "menu.oneSuit": "1 naipe",
    "menu.twoSuits": "2 naipes",
    "menu.fourSuits": "4 naipes",
    "menu.easy": "Fácil",
    "menu.medium": "Médio",
    "menu.hard": "Difícil",
    "menu.start": "Iniciar jogo",
    "win.title": "🎉 Você venceu!",
    "win.subtitle": "Você reuniu todas as 8 sequências.",
    "win.again": "Jogar de novo",
    "app.footer": "Versão {version} · Compilação {build}",
  };

  const NL = {
    "stats.time": "Tijd",
    "stats.moves": "Zetten",
    "stats.score": "Punten",
    "btn.undo": "Ongedaan maken",
    "btn.undo.title": "Laatste zet ongedaan maken",
    "btn.hint": "Tip",
    "btn.hint.title": "Toon een tip",
    "btn.new": "Nieuw spel",
    "btn.new.title": "Start een nieuw spel",
    "toast.noStock": "Geen kaarten meer om te delen.",
    "toast.emptyColumns": "Lege kolommen moeten eerst gevuld worden.",
    "toast.nothingUndo": "Niets om ongedaan te maken.",
    "toast.dealHint": "Tip: deel nieuwe kaarten.",
    "toast.noMove": "Geen zet gevonden.",
    "menu.subtitle": "Orden van Heer tot Aas in één kleur. Kies de moeilijkheid.",
    "menu.oneSuit": "1 kleur",
    "menu.twoSuits": "2 kleuren",
    "menu.fourSuits": "4 kleuren",
    "menu.easy": "Makkelijk",
    "menu.medium": "Gemiddeld",
    "menu.hard": "Moeilijk",
    "menu.start": "Spel starten",
    "win.title": "🎉 Gewonnen!",
    "win.subtitle": "Je hebt alle 8 reeksen verzameld.",
    "win.again": "Opnieuw spelen",
    "app.footer": "Versie {version} · Build {build}",
  };

  const DICTS = {
    en: EN,
    de: DE,
    fr: FR,
    es: ES,
    it: IT,
    pt: PT,
    nl: NL,
  };

  const FALLBACK = "en";
  let lang = FALLBACK;

  function baseCode(code) {
    return String(code || "").toLowerCase().split("-")[0];
  }

  function detect() {
    const list =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || FALLBACK];
    for (const code of list) {
      const base = baseCode(code);
      if (DICTS[base]) return base;
    }
    return FALLBACK;
  }

  function t(key, params) {
    const dict = DICTS[lang] || DICTS[FALLBACK];
    let s = dict[key];
    if (s === undefined) s = DICTS[FALLBACK][key];
    if (s === undefined) return key;
    if (params) {
      s = s.replace(/\{(\w+)\}/g, (m, k) =>
        params[k] !== undefined ? params[k] : m
      );
    }
    return s;
  }

  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    scope.querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.title = t(el.dataset.i18nTitle);
    });
  }

  function setLanguage(next) {
    const base = baseCode(next);
    lang = DICTS[base] ? base : FALLBACK;
    document.documentElement.lang = lang;
    apply();
    window.dispatchEvent(new CustomEvent("languagechange", { detail: lang }));
  }

  window.i18n = {
    t,
    apply,
    setLanguage,
    detect,
    available: Object.keys(DICTS),
    get language() {
      return lang;
    },
  };

  setLanguage(detect());
})();
