import { Chess } from '/assets/vendor/chess.js';

/* ===== BOOKING CONFIG =====================================================
 * Paste the Google Form link here (the normal ".../viewform" URL).
 * To prefill the level: in Google Forms use "Get pre-filled link", type
 * anything in the level question, copy the link and take the "entry.NNNN"
 * name from it into GOOGLE_FORM_LEVEL_ENTRY (e.g. 'entry.123456789').
 * Leave GOOGLE_FORM_URL empty to show "Reservas abren pronto".
 * ======================================================================== */
const GOOGLE_FORM_URL = '';
const GOOGLE_FORM_LEVEL_ENTRY = '';

const PUZZLES = [
  { fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1', task: 'Mate en 1 · Mate in one', pts: 1, type: 'mate1' },
  { fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', task: 'Mate en 1 · Mate in one', pts: 1, type: 'mate1' },
  { fen: '4k3/6p1/N7/3q4/8/8/5PP1/6K1 w - - 0 1', task: 'Gana la dama negra · Win the queen', pts: 2, type: 'best', best: ['c7'] },
  { fen: '6k1/5ppp/8/8/8/8/3q1PPP/R3R1K1 w - - 0 1', task: 'Mate en 2 · Mate in two', pts: 3, type: 'mate2' },
];
const MAX = PUZZLES.reduce((s, p) => s + p.pts, 0);
const LEVELS = [
  { min: 0, name: 'Principiante', text: 'Conoces las piezas o estás empezando. Te emparejamos con gente que también está aprendiendo, sin prisas.' },
  { min: 3, name: 'Intermedio', text: 'Ves mates sencillos y tácticas básicas. Partidas equilibradas con jugadores de tu nivel.' },
  { min: 6, name: 'Avanzado', text: 'Calculas varias jugadas. Te buscamos rivales que te pongan a prueba.' },
];
const GLYPH = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
const NAME = { k: 'rey', q: 'dama', r: 'torre', b: 'alfil', n: 'caballo', p: 'peón' };

const $ = (id) => document.getElementById(id);
const boardEl = $('nda-board'), fb = $('nda-feedback');
let idx = 0, score = 0, tries = 0, game, sel = null, locked = false, stage = 0, last = [];

/* image placeholders */
document.querySelectorAll('.nda-media img').forEach((img) => {
  const fig = img.parentElement;
  const miss = () => { fig.classList.add('is-missing'); fig.dataset.label = img.dataset.placeholder + ' · ' + img.getAttribute('src').split('/').pop(); };
  if (img.complete && img.naturalWidth === 0) miss(); else img.addEventListener('error', miss);
});

function load() {
  const p = PUZZLES[idx];
  game = new Chess(p.fen); tries = 0; sel = null; locked = false; stage = 0; last = [];
  $('nda-progress').textContent = `Problema ${idx + 1} de ${PUZZLES.length}`;
  $('nda-task').textContent = 'Juegan blancas. ' + p.task;
  fb.textContent = ''; fb.className = 'nda-feedback';
  $('nda-next').hidden = true; $('nda-skip').hidden = false;
  render();
}

function render() {
  boardEl.textContent = '';
  const targets = sel ? game.moves({ square: sel, verbose: true }).map((m) => m.to) : [];
  for (let r = 8; r >= 1; r--) {
    const row = document.createElement('div'); row.setAttribute('role', 'row'); row.style.display = 'contents';
    for (let f = 0; f < 8; f++) {
      const sq = 'abcdefgh'[f] + r, pc = game.get(sq);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'nda-sq ' + ((f + r) % 2 ? 'l' : 'd');
      b.setAttribute('role', 'gridcell'); b.dataset.sq = sq;
      if (sq === sel) b.classList.add('sel');
      if (targets.includes(sq)) b.classList.add('tgt');
      if (last.includes(sq)) b.classList.add('last');
      b.setAttribute('aria-label', sq + (pc ? ', ' + NAME[pc.type] + (pc.color === 'w' ? ' blanco' : ' negro') : ', vacía'));
      if (pc) { const s = document.createElement('span'); s.className = pc.color; s.textContent = GLYPH[pc.type]; s.setAttribute('aria-hidden', 'true'); b.append(s); }
      if (f === 0) { const c = document.createElement('span'); c.className = 'coord'; c.textContent = r; c.setAttribute('aria-hidden', 'true'); b.append(c); }
      b.addEventListener('click', () => tap(sq));
      row.append(b);
    }
    boardEl.append(row);
  }
}

function tap(sq) {
  if (locked) return;
  const pc = game.get(sq);
  if (pc && pc.color === 'w') { sel = sel === sq ? null : sq; render(); focusSq(sq); return; }
  if (!sel) return;
  const mv = game.moves({ square: sel, verbose: true }).find((m) => m.to === sq);
  if (!mv) { sel = null; render(); return; }
  game.move({ from: mv.from, to: mv.to, promotion: 'q' });
  last = [mv.from, mv.to]; sel = null;
  judge(mv);
}

function focusSq(sq) { const el = boardEl.querySelector(`[data-sq="${sq}"]`); if (el) el.focus(); }

function judge(mv) {
  const p = PUZZLES[idx];
  let ok = false, cont = false;
  if (p.type === 'mate1') ok = game.isCheckmate();
  else if (p.type === 'best') ok = p.best.includes(mv.to) && mv.piece === 'n';
  else if (p.type === 'mate2') {
    if (stage === 0) {
      // correct first move = every black reply allows mate in 1
      const replies = game.moves();
      ok = !game.isGameOver() && replies.every((r) => { game.move(r); const m = game.moves().some((x) => { game.move(x); const c = game.isCheckmate(); game.undo(); return c; }); game.undo(); return m; });
      if (ok) {
        cont = true; stage = 1; locked = true; render();
        say('¡Bien! Ahora responden negras…', 'ok');
        setTimeout(() => { const r = game.move(replies[0]); last = [r.from, r.to]; locked = false; render(); say('Negras: ' + r.san + '. Termina el mate.', 'ok'); }, 700);
        return;
      }
    } else ok = game.isCheckmate();
  }
  render();
  if (ok) { score += tries === 0 ? p.pts : Math.ceil(p.pts / 2); done('¡Correcto! ' + mv.san + (game.isCheckmate() ? ' — jaque mate.' : ''), 'ok'); }
  else if (++tries < 2 && !cont) {
    say('No es la mejor jugada. Inténtalo otra vez.', 'bad');
    locked = true;
    setTimeout(() => { if (stage === 1) game.undo(); else game = new Chess(p.fen); last = []; locked = false; render(); }, 900);
  } else done('Casi. Pasamos al siguiente.', 'bad');
}

function say(t, c) { fb.textContent = t; fb.className = 'nda-feedback ' + c; }
function done(t, c) { say(t, c); locked = true; $('nda-skip').hidden = true; const n = $('nda-next'); n.hidden = false; n.textContent = idx < PUZZLES.length - 1 ? 'Siguiente' : 'Ver mi nivel'; n.focus(); }

$('nda-next').addEventListener('click', () => { idx++; idx < PUZZLES.length ? load() : finish(); });
$('nda-skip').addEventListener('click', () => { idx++; idx < PUZZLES.length ? load() : finish(); });
$('nda-restart').addEventListener('click', () => { idx = 0; score = 0; $('nda-result').hidden = true; document.querySelector('.nda-quiz').hidden = false; load(); });

function finish() {
  const lvl = [...LEVELS].reverse().find((l) => score >= l.min);
  document.querySelector('.nda-quiz').hidden = true;
  $('nda-level').textContent = lvl.name;
  $('nda-level-text').textContent = `${lvl.text} (${score}/${MAX} puntos)`;
  const r = $('nda-result'); r.hidden = false; r.focus();
  try { sessionStorage.setItem('nda-level', lvl.name); } catch (e) {}
  setBooking(lvl.name);
}

function setBooking(level) {
  if (level) $('nda-book-level').innerHTML = 'Tu nivel: <strong></strong>. Lo tendremos en cuenta al emparejarte.', $('nda-book-level').querySelector('strong').textContent = level;
  if (GOOGLE_FORM_URL) {
    let url = GOOGLE_FORM_URL;
    if (level && GOOGLE_FORM_LEVEL_ENTRY) { const u = new URL(url); u.searchParams.set('usp', 'pp_url'); u.searchParams.set(GOOGLE_FORM_LEVEL_ENTRY, level); url = u.toString(); }
    $('nda-book-link').href = url; $('nda-book-open').hidden = false; $('nda-book-soon').hidden = true;
  } else {
    const subj = 'Noche de Ajedrez' + (level ? ' – nivel ' + level : '');
    $('nda-mail').href = 'mailto:info@englishstudy.club?subject=' + encodeURIComponent(subj);
  }
}

let saved = null; try { saved = sessionStorage.getItem('nda-level'); } catch (e) {}
setBooking(saved);
load();
