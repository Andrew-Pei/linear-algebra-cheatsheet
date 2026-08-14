// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// Active nav link on scroll
const sections = document.querySelectorAll('.concept-section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Search functionality
const searchInput = document.getElementById('search');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();

  if (query === '') {
    document.querySelectorAll('.concept-section').forEach(s => s.classList.remove('hidden'));
    document.querySelectorAll('.concept-card').forEach(c => {
      c.classList.remove('hidden');
      removeHighlights(c);
    });
    return;
  }

  document.querySelectorAll('.concept-section').forEach(section => {
    let hasVisibleCard = false;

    section.querySelectorAll('.concept-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.classList.remove('hidden');
        hasVisibleCard = true;
        highlightText(card, query);
      } else {
        card.classList.add('hidden');
        removeHighlights(card);
      }
    });

    // Also check section title
    const title = section.querySelector('h2').textContent.toLowerCase();
    if (title.includes(query)) {
      hasVisibleCard = true;
    }

    section.classList.toggle('hidden', !hasVisibleCard);
  });
});

function highlightText(element, query) {
  removeHighlights(element);
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    if (node.parentElement.tagName !== 'SCRIPT' && node.parentElement.tagName !== 'STYLE') {
      textNodes.push(node);
    }
  }

  textNodes.forEach(textNode => {
    const text = textNode.textContent;
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(query);
    if (index !== -1) {
      const before = text.substring(0, index);
      const match = text.substring(index, index + query.length);
      const after = text.substring(index + query.length);
      const mark = document.createElement('mark');
      mark.textContent = match;
      const parent = textNode.parentElement;
      parent.replaceChild(document.createTextNode(before), textNode);
      parent.insertBefore(mark, textNode);
      parent.insertBefore(document.createTextNode(after), mark);
    }
  });
}

function removeHighlights(element) {
  element.querySelectorAll('mark').forEach(mark => {
    const text = mark.textContent;
    mark.replaceWith(document.createTextNode(text));
  });
  element.normalize();
}