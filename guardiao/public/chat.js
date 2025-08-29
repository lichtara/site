const $messages = document.getElementById('messages');
const $form = document.getElementById('composer');
const $input = document.getElementById('input');
const $send = document.getElementById('send');

let threadId = localStorage.getItem('lichtara_thread_id');

async function ensureThread() {
  if (threadId) return threadId;
  const res = await fetch('/api/thread', { method: 'POST' });
  if (!res.ok) throw new Error('Falha ao criar thread');
  const data = await res.json();
  threadId = data.thread_id;
  localStorage.setItem('lichtara_thread_id', threadId);
  return threadId;
}

function addMsg(role, text) {
  const div = document.createElement('div');
  div.className = `msg ${role === 'user' ? 'user' : 'assistant'}`;
  div.textContent = text;
  $messages.appendChild(div);
  $messages.scrollTop = $messages.scrollHeight;
}

async function pollUntilDone(tid, rid) {
  // Poll status; when done, refresh history
  while (true) {
    await new Promise(r => setTimeout(r, 900));
    const url = `/api/poll?thread_id=${encodeURIComponent(tid)}&run_id=${encodeURIComponent(rid)}`;
    const res = await fetch(url);
    if (!res.ok) break;
    const data = await res.json();
    if (['completed', 'failed', 'cancelled', 'expired'].includes(data.status)) {
      $messages.innerHTML = '';
      (data.messages || []).forEach(m => addMsg(m.role, m.content));
      break;
    }
  }
}

$form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = $input.value.trim();
  if (!text) return;
  $input.value = '';
  $send.disabled = true;

  try {
    const tid = await ensureThread();
    addMsg('user', text);

    const resMsg = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: tid, content: text })
    });
    if (!resMsg.ok) throw new Error('Falha ao enviar mensagem');

    const resRun = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: tid })
    });
    if (!resRun.ok) throw new Error('Falha ao iniciar run');
    const { run_id } = await resRun.json();
    await pollUntilDone(tid, run_id);
  } catch (err) {
    console.error(err);
    addMsg('assistant', '⚠️ Ocorreu um erro. Tente novamente.');
  } finally {
    $send.disabled = false;
  }
});

// Mensagem inicial opcional
addMsg('assistant', 'Eu sou o Guardião do Portal Lichtara. Como posso orientar você hoje?');

