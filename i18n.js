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
    "btn.leave": "Leave",
    "confirm.leave.title": "End the current game?",
    "confirm.leave.text": "The current game will be ended – afterwards a new game can be started",
    "confirm.leave.ok": "End game",
    "confirm.cancel": "Cancel",
    "btn.leave.title": "End the game",
    "toast.noStock": "No cards left to deal",
    "toast.emptyColumns": "Empty columns must be filled first",
    "toast.nothingUndo": "Nothing to undo",
    "toast.dealHint": "Hint: deal new cards",
    "toast.noMove": "No move found",
    "menu.subtitle": "Build eight complete sequences – each from king to ace in a single suit",
    "menu.oneSuit": "1 Suit",
    "menu.twoSuits": "2 Suits",
    "menu.fourSuits": "4 Suits",
    "menu.easy": "Easy",
    "menu.medium": "Medium",
    "menu.hard": "Hard",
    "menu.continue": "Continue",
    "menu.start": "Start Game",
    "win.title": "🎉 You won!",
    "win.subtitle": "All eight sequences have been collected",
    "win.again": "Play Again",
    "app.footer": "Version {version} · Build {build}",
    "app.name": "Spider Solitaire: Sunrise",
    "score.title": "Best results",
    "score.record": "New record!",
    "score.place": "Place {place}",
    "score.date": "Date",
    "info.text": "The cards must be sorted in the ten tableau columns. The goal is to build eight complete sequences, each running from King down to Ace. A complete King-to-Ace sequence in a single suit is moved automatically to one of the eight foundation frames at the top. The remaining cards can be dealt in batches from the top-left corner.",
    "info.assist": "Dim cards that cannot be moved",
    "info.close": "Close",
    "info.install": "Install app",
    "info.source": "Source on GitHub",
  };

  const DE = {
    "stats.time": "Zeit",
    "stats.moves": "Züge",
    "stats.score": "Punkte",
    "btn.undo": "Rückgängig",
    "btn.undo.title": "Letzten Zug rückgängig machen",
    "btn.hint": "Tipp",
    "btn.hint.title": "Tipp anzeigen",
    "btn.leave": "Verlassen",
    "confirm.leave.title": "Spiel beenden?",
    "confirm.leave.text": "Das laufende Spiel wird beendet – anschließend kann ein neues Spiel gestartet werden",
    "confirm.leave.ok": "Beenden",
    "confirm.cancel": "Abbrechen",
    "btn.leave.title": "Spiel beenden",
    "toast.noStock": "Es sind keine Karten mehr zum Austeilen da",
    "toast.emptyColumns": "Leere Spalten müssen zuerst gefüllt werden",
    "toast.nothingUndo": "Nichts zum Rückgängigmachen",
    "toast.dealHint": "Tipp: Teile neue Karten aus",
    "toast.noMove": "Kein Zug gefunden",
    "menu.subtitle": "Acht vollständige Sequenzen bilden – jeweils vom König bis zum Ass in einer einzigen Farbe",
    "menu.oneSuit": "1 Farbe",
    "menu.twoSuits": "2 Farben",
    "menu.fourSuits": "4 Farben",
    "menu.easy": "Leicht",
    "menu.medium": "Mittel",
    "menu.hard": "Schwer",
    "menu.continue": "Fortsetzen",
    "menu.start": "Spiel starten",
    "win.title": "🎉 Gewonnen!",
    "win.subtitle": "Alle acht Sequenzen wurden gesammelt",
    "win.again": "Nochmal spielen",
    "app.footer": "Version {version} · Build {build}",
    "app.name": "Spider Solitaire: Sunrise",
    "score.title": "Beste Ergebnisse",
    "score.record": "Neuer Rekord!",
    "score.place": "Platz {place}",
    "score.date": "Datum",
    "info.text": "Die Karten müssen in den zehn Tableau-Spalten geordnet werden. Ziel ist es, acht vollständige Sequenzen zu bilden, jeweils vom König bis zum Ass. Eine vollständige K-A-Sequenz in einer einzigen Farbe wird automatisch in einen der acht Ablagerahmen oben verschoben. Die restlichen Karten können stapelweise aus der oberen linken Ecke entnommen werden.",
    "info.assist": "Nicht verschiebbare Karten abdunkeln",
    "info.close": "Schließen",
    "info.install": "App installieren",
    "info.source": "Quellcode auf GitHub",
  };

  const FR = {
    "stats.time": "Temps",
    "stats.moves": "Coups",
    "stats.score": "Points",
    "btn.undo": "Annuler",
    "btn.undo.title": "Annuler le dernier coup",
    "btn.hint": "Indice",
    "btn.hint.title": "Afficher un indice",
    "btn.leave": "Quitter",
    "confirm.leave.title": "Terminer la partie ?",
    "confirm.leave.text": "La partie en cours sera terminée – une nouvelle partie pourra ensuite être commencée",
    "confirm.leave.ok": "Terminer",
    "confirm.cancel": "Annuler",
    "btn.leave.title": "Terminer la partie",
    "toast.noStock": "Plus de cartes à distribuer",
    "toast.emptyColumns": "Les colonnes vides doivent d'abord être remplies",
    "toast.nothingUndo": "Rien à annuler",
    "toast.dealHint": "Indice : distribuez de nouvelles cartes",
    "toast.noMove": "Aucun coup trouvé",
    "menu.subtitle": "Former huit séquences complètes – chacune du roi à l'as dans une seule couleur",
    "menu.oneSuit": "1 couleur",
    "menu.twoSuits": "2 couleurs",
    "menu.fourSuits": "4 couleurs",
    "menu.easy": "Facile",
    "menu.medium": "Moyen",
    "menu.hard": "Difficile",
    "menu.continue": "Continuer",
    "menu.start": "Démarrer la partie",
    "win.title": "🎉 Gagné !",
    "win.subtitle": "Les huit séquences ont été rassemblées",
    "win.again": "Rejouer",
    "app.footer": "Version {version} · Compilation {build}",
    "app.name": "Spider Solitaire: Sunrise",
    "score.title": "Meilleurs résultats",
    "score.record": "Nouveau record !",
    "score.place": "Place {place}",
    "score.date": "Date",
    "info.text": "Les cartes doivent être rangées dans les dix colonnes du tableau. Le but est de former huit séquences complètes, chacune allant du Roi à l'As. Une séquence complète du Roi à l'As dans une seule couleur est déplacée automatiquement vers l'un des huit emplacements de fondation en haut. Les cartes restantes peuvent être distribuées par paquets depuis le coin supérieur gauche.",
    "info.assist": "Assombrir les cartes non déplaçables",
    "info.close": "Fermer",
    "info.install": "Installer l'application",
    "info.source": "Code source sur GitHub",
  };

  const ES = {
    "stats.time": "Tiempo",
    "stats.moves": "Movimientos",
    "stats.score": "Puntos",
    "btn.undo": "Deshacer",
    "btn.undo.title": "Deshacer el último movimiento",
    "btn.hint": "Pista",
    "btn.hint.title": "Mostrar una pista",
    "btn.leave": "Salir",
    "confirm.leave.title": "¿Terminar la partida?",
    "confirm.leave.text": "La partida actual se dará por terminada – después se podrá empezar una nueva partida",
    "confirm.leave.ok": "Terminar",
    "confirm.cancel": "Cancelar",
    "btn.leave.title": "Terminar la partida",
    "toast.noStock": "No quedan cartas para repartir",
    "toast.emptyColumns": "Primero hay que llenar las columnas vacías",
    "toast.nothingUndo": "Nada que deshacer",
    "toast.dealHint": "Pista: reparte nuevas cartas",
    "toast.noMove": "No se encontró ningún movimiento",
    "menu.subtitle": "Forma ocho secuencias completas – cada una del rey al as en un solo palo",
    "menu.oneSuit": "1 palo",
    "menu.twoSuits": "2 palos",
    "menu.fourSuits": "4 palos",
    "menu.easy": "Fácil",
    "menu.medium": "Media",
    "menu.hard": "Difícil",
    "menu.continue": "Continuar",
    "menu.start": "Empezar partida",
    "win.title": "🎉 ¡Ganaste!",
    "win.subtitle": "Las ocho secuencias han sido reunidas",
    "win.again": "Jugar de nuevo",
    "app.footer": "Versión {version} · Compilación {build}",
    "app.name": "Spider Solitaire: Sunrise",
    "score.title": "Mejores resultados",
    "score.record": "¡Nuevo récord!",
    "score.place": "Puesto {place}",
    "score.date": "Fecha",
    "info.text": "Las cartas deben ordenarse en las diez columnas del tablero. El objetivo es formar ocho secuencias completas, cada una desde el Rey hasta el As. Una secuencia completa de Rey a As en un solo palo se mueve automáticamente a uno de los ocho marcos de fundación de arriba. Las cartas restantes se pueden repartir por grupos desde la esquina superior izquierda.",
    "info.assist": "Atenuar las cartas que no se pueden mover",
    "info.close": "Cerrar",
    "info.install": "Instalar la aplicación",
    "info.source": "Código en GitHub",
  };

  const IT = {
    "stats.time": "Tempo",
    "stats.moves": "Mosse",
    "stats.score": "Punti",
    "btn.undo": "Annulla",
    "btn.undo.title": "Annulla l'ultima mossa",
    "btn.hint": "Suggerimento",
    "btn.hint.title": "Mostra un suggerimento",
    "btn.leave": "Esci",
    "confirm.leave.title": "Terminare la partita?",
    "confirm.leave.text": "La partita attuale verrà terminata – successivamente potrà essere iniziata una nuova partita",
    "confirm.leave.ok": "Termina",
    "confirm.cancel": "Annulla",
    "btn.leave.title": "Terminare la partita",
    "toast.noStock": "Non ci sono più carte da distribuire",
    "toast.emptyColumns": "Le colonne vuote devono essere riempite prima",
    "toast.nothingUndo": "Niente da annullare",
    "toast.dealHint": "Suggerimento: distribuisci nuove carte",
    "toast.noMove": "Nessuna mossa trovata",
    "menu.subtitle": "Forma otto sequenze complete – ciascuna dal re all'asso in un unico seme",
    "menu.oneSuit": "1 seme",
    "menu.twoSuits": "2 semi",
    "menu.fourSuits": "4 semi",
    "menu.easy": "Facile",
    "menu.medium": "Media",
    "menu.hard": "Difficile",
    "menu.continue": "Continua",
    "menu.start": "Inizia partita",
    "win.title": "🎉 Hai vinto!",
    "win.subtitle": "Tutte le otto sequenze sono state raccolte",
    "win.again": "Gioca ancora",
    "app.footer": "Versione {version} · Build {build}",
    "app.name": "Spider Solitaire: Sunrise",
    "score.title": "Migliori risultati",
    "score.record": "Nuovo record!",
    "score.place": "Posizione {place}",
    "score.date": "Data",
    "info.text": "Le carte devono essere ordinate nelle dieci colonne del tableau. L'obiettivo è formare otto sequenze complete, ciascuna dal Re all'Asso. Una sequenza completa dal Re all'Asso in un solo seme viene spostata automaticamente in uno degli otto riquadri di fondazione in alto. Le carte rimanenti possono essere distribuite a gruppi dall'angolo in alto a sinistra.",
    "info.assist": "Attenua le carte che non si possono spostare",
    "info.close": "Chiudi",
    "info.install": "Installa l'app",
    "info.source": "Codice su GitHub",
  };

  const PT = {
    "stats.time": "Tempo",
    "stats.moves": "Jogadas",
    "stats.score": "Pontos",
    "btn.undo": "Desfazer",
    "btn.undo.title": "Desfazer a última jogada",
    "btn.hint": "Dica",
    "btn.hint.title": "Mostrar uma dica",
    "btn.leave": "Sair",
    "confirm.leave.title": "Terminar o jogo?",
    "confirm.leave.text": "O jogo atual será encerrado – depois será possível começar um novo jogo",
    "confirm.leave.ok": "Terminar",
    "confirm.cancel": "Cancelar",
    "btn.leave.title": "Terminar o jogo",
    "toast.noStock": "Não há mais cartas para distribuir",
    "toast.emptyColumns": "As colunas vazias devem ser preenchidas primeiro",
    "toast.nothingUndo": "Nada para desfazer",
    "toast.dealHint": "Dica: distribua novas cartas",
    "toast.noMove": "Nenhuma jogada encontrada",
    "menu.subtitle": "Forme oito sequências completas – cada uma do rei ao ás num único naipe",
    "menu.oneSuit": "1 naipe",
    "menu.twoSuits": "2 naipes",
    "menu.fourSuits": "4 naipes",
    "menu.easy": "Fácil",
    "menu.medium": "Médio",
    "menu.hard": "Difícil",
    "menu.continue": "Continuar",
    "menu.start": "Iniciar jogo",
    "win.title": "🎉 Você venceu!",
    "win.subtitle": "Todas as oito sequências foram recolhidas",
    "win.again": "Jogar de novo",
    "app.footer": "Versão {version} · Compilação {build}",
    "app.name": "Spider Solitaire: Sunrise",
    "score.title": "Melhores resultados",
    "score.record": "Novo recorde!",
    "score.place": "Posição {place}",
    "score.date": "Data",
    "info.text": "As cartas devem ser organizadas nas dez colunas do tableau. O objetivo é formar oito sequências completas, cada uma do Rei ao Ás. Uma sequência completa de Rei a Ás em um único naipe é movida automaticamente para um dos oito quadros de fundação no topo. As cartas restantes podem ser distribuídas em grupos a partir do canto superior esquerdo.",
    "info.assist": "Escurecer as cartas que não podem ser movidas",
    "info.close": "Fechar",
    "info.install": "Instalar a aplicação",
    "info.source": "Código no GitHub",
  };

  const NL = {
    "stats.time": "Tijd",
    "stats.moves": "Zetten",
    "stats.score": "Punten",
    "btn.undo": "Ongedaan maken",
    "btn.undo.title": "Laatste zet ongedaan maken",
    "btn.hint": "Tip",
    "btn.hint.title": "Toon een tip",
    "btn.leave": "Verlaten",
    "confirm.leave.title": "Spel beëindigen?",
    "confirm.leave.text": "Het huidige spel wordt beëindigd – daarna kan een nieuw spel worden gestart",
    "confirm.leave.ok": "Beëindigen",
    "confirm.cancel": "Annuleren",
    "btn.leave.title": "Spel beëindigen",
    "toast.noStock": "Geen kaarten meer om te delen",
    "toast.emptyColumns": "Lege kolommen moeten eerst gevuld worden",
    "toast.nothingUndo": "Niets om ongedaan te maken",
    "toast.dealHint": "Tip: deel nieuwe kaarten",
    "toast.noMove": "Geen zet gevonden",
    "menu.subtitle": "Vorm acht volledige reeksen – elk van koning tot aas in één kleur",
    "menu.oneSuit": "1 kleur",
    "menu.twoSuits": "2 kleuren",
    "menu.fourSuits": "4 kleuren",
    "menu.easy": "Makkelijk",
    "menu.medium": "Gemiddeld",
    "menu.hard": "Moeilijk",
    "menu.continue": "Doorgaan",
    "menu.start": "Spel starten",
    "win.title": "🎉 Gewonnen!",
    "win.subtitle": "Alle acht reeksen zijn verzameld",
    "win.again": "Opnieuw spelen",
    "app.footer": "Versie {version} · Build {build}",
    "app.name": "Spider Solitaire: Sunrise",
    "score.title": "Beste resultaten",
    "score.record": "Nieuw record!",
    "score.place": "Plaats {place}",
    "score.date": "Datum",
    "info.text": "De kaarten moeten in de tien tableau-kolommen worden gerangschikt. Het doel is om acht volledige reeksen te vormen, telkens van Heer tot Aas. Een volledige reeks van Heer tot Aas in één kleur wordt automatisch naar een van de acht funderingsvakken boven verplaatst. De overige kaarten kunnen in groepjes uit de linkerbovenhoek worden gedeeld.",
    "info.assist": "Niet-verplaatsbare kaarten donkerder maken",
    "info.close": "Sluiten",
    "info.install": "App installeren",
    "info.source": "Broncode op GitHub",
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
