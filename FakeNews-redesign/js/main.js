// Fake News Detector - main.js

// ── Highlight active nav link ──────────────────────────────────────────────
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();

// ── Simple keyword-based checker (beginner level) ─────────────────────────
const FAKE_KEYWORDS = [
  'secret', 'shocking', 'bombshell', 'you won\'t believe', 'mainstream media lies',
  'government hides', 'they don\'t want you to know', 'miracle cure', 'doctors hate',
  '100% proven', 'share before deleted', 'breaking!!!', 'urgent!!!',
  'fake news', 'hoax exposed', 'hidden truth', 'wake up', 'sheeple',
  'illuminati', 'deep state', 'satanic', 'bill gates', 'microchip', '5g causes',
  'vaccine kills', 'cure cancer', 'big pharma', 'chemtrails', 'flat earth',
  'click here now', 'limited time', 'share this viral', 'repost immediately'
];

const REAL_KEYWORDS = [
  'according to', 'study shows', 'research indicates', 'scientists say',
  'published in', 'reported by', 'official statement', 'data shows',
  'survey conducted', 'peer-reviewed', 'university', 'professor',
  'government announced', 'statistics show', 'analysis reveals'
];

function analyzeText(text) {
  const lower = text.toLowerCase();
  let fakeScore = 0;
  let realScore = 0;
  let fakeFound = [];
  let realFound = [];

  FAKE_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) {
      fakeScore++;
      fakeFound.push(kw);
    }
  });

  REAL_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) {
      realScore++;
      realFound.push(kw);
    }
  });

  // Exclamation marks and CAPS as signals
  const exclamations = (text.match(/!/g) || []).length;
  const capsWords = (text.match(/\b[A-Z]{3,}\b/g) || []).length;
  if (exclamations >= 3) fakeScore += 2;
  if (capsWords >= 4) fakeScore += 2;

  return { fakeScore, realScore, fakeFound, realFound };
}

// ── Run checker on index page ──────────────────────────────────────────────
const checkBtn = document.getElementById('checkBtn');
if (checkBtn) {
  checkBtn.addEventListener('click', function () {
    const input = document.getElementById('newsInput');
    const resultBox = document.getElementById('resultBox');
    const text = input.value.trim();

    if (!text || text.length < 20) {
      input.style.borderColor = '#E03131';
      input.placeholder = 'Te rog introdu cel puțin 20 de caractere...';
      return;
    }

    input.style.borderColor = '';

    const { fakeScore, realScore, fakeFound } = analyzeText(text);
    resultBox.className = 'result-box show';

    if (fakeScore >= 3) {
      resultBox.classList.add('result-fake');
      resultBox.innerHTML = `
        <div class="result-label">⚠️ Probabil FAKE NEWS</div>
        <div class="result-desc">Textul conține ${fakeScore} semnale de dezinformare.
        ${fakeFound.length ? `Cuvinte cheie detectate: <em>${fakeFound.slice(0, 3).join(', ')}</em>.` : ''}
        Verifică sursa înainte de a distribui!</div>
      `;
    } else if (realScore >= 2 && fakeScore === 0) {
      resultBox.classList.add('result-real');
      resultBox.innerHTML = `
        <div class="result-label">✅ Pare CREDIBIL</div>
        <div class="result-desc">Textul folosește un limbaj jurnalistic. Totuși, verifică întotdeauna sursa originală.</div>
      `;
    } else {
      resultBox.classList.add('result-unknown');
      resultBox.innerHTML = `
        <div class="result-label">🔍 NECLAR — Verifică manual</div>
        <div class="result-desc">Nu am putut stabili cu certitudine. Caută titlul pe Google News sau Snopes.com.</div>
      `;
    }
  });
}

// ── Contact form ───────────────────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Trimis! ✓';
    btn.disabled = true;
    btn.style.background = '#2F9E44';
    setTimeout(() => {
      btn.textContent = 'Trimite mesajul';
      btn.disabled = false;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}