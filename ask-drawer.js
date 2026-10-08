(() => {
  const drawer = document.getElementById('askDrawer');
  const backdrop = document.getElementById('askBackdrop');
  const closeBtn = document.getElementById('askDrawerClose');
  const form = document.getElementById('askDrawerForm');
  const input = document.getElementById('askDrawerInput');
  const messages = document.getElementById('askDrawerMessages');
  const status = document.getElementById('askDrawerStatus');
  if (!drawer || !backdrop || !form || !input || !messages) return;

  const setStatus = (text, ok) => {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle('is-ok', !!ok);
    status.classList.toggle('is-bad', ok === false);
  };

  const open = () => {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.classList.add('ask-drawer-open');
    setTimeout(() => input.focus(), 180);
  };

  const close = () => {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.classList.remove('ask-drawer-open');
  };

  document.querySelectorAll('.ask-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      open();
    });
  });

  closeBtn?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });

  const addMessage = (text, type) => {
    const el = document.createElement('div');
    el.className = 'ask-drawer-msg ' + type;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  };

  const ask = async question => {
    const q = question.trim();
    if (!q) return;
    addMessage(q, 'user');
    input.value = '';
    input.disabled = true;
    const pending = addMessage('Thinking…', 'bot pending');

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question: q})
      });
      const data = await response.json().catch(() => ({}));
      pending.classList.remove('pending');
      pending.textContent = data.answer || 'I could not answer that right now. Please contact Ruhul directly.';
      if (!response.ok) setStatus('AI PROFILE ASSISTANT · CHECK CONFIGURATION', false);
    } catch (error) {
      pending.classList.remove('pending');
      pending.textContent = 'The AI assistant is temporarily unavailable. Please check the Cloudflare Pages Function and API configuration.';
      setStatus('AI PROFILE ASSISTANT · CHECK FAILED', false);
    } finally {
      input.disabled = false;
      input.focus();
    }
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    ask(input.value);
  });

  document.querySelectorAll('[data-ask-question]').forEach(btn => {
    btn.addEventListener('click', () => ask(btn.getAttribute('data-ask-question') || btn.textContent));
  });

  fetch('/api/ask')
    .then(r => r.json())
    .then(data => {
      if (data.configured) setStatus('AI PROFILE ASSISTANT · CONNECTED', true);
      else setStatus('AI PROFILE ASSISTANT · NOT CONFIGURED', false);
    })
    .catch(() => setStatus('AI PROFILE ASSISTANT · CHECK FAILED', false));
})();