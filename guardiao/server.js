import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 8787;
const DEFAULT_CORS = 'https://lichtara.com, https://portal.lichtara.com, http://localhost:8787, http://localhost:4173';
const CORS_ORIGIN = process.env.CORS_ORIGIN || DEFAULT_CORS;
const ASSISTANT_ID = process.env.ASSISTANT_ID || 'asst_gf4vd6gvNDXuX3u6qu1KWTJ5';

// CORS flexível: aceita lista separada por vírgulas em CORS_ORIGIN
const origins = (CORS_ORIGIN || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // same-origin or curl
      if (origins.includes('*')) return cb(null, true);
      if (origins.includes(origin)) return cb(null, true);
      // allow subdomains if pattern like https://*.lichtara.com is used
      const wildcard = origins.find((o) => o.includes('*'));
      if (wildcard) {
        const re = new RegExp('^' + wildcard.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('\\*', '.*') + '$');
        if (re.test(origin)) return cb(null, true);
      }
      return cb(new Error('CORS: Origin not allowed'));
    },
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY não definido. Configure seu .env');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Cria um thread novo
app.post('/api/thread', async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();
    res.json({ thread_id: thread.id });
  } catch (err) {
    console.error('create thread error:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Falha ao criar thread' });
  }
});

// Adiciona mensagem do usuário ao thread
app.post('/api/message', async (req, res) => {
  try {
    const { thread_id, content } = req.body || {};
    if (!thread_id || !content) {
      return res.status(400).json({ error: 'thread_id e content são obrigatórios' });
    }
    await openai.beta.threads.messages.create(thread_id, {
      role: 'user',
      content: String(content).slice(0, 8000)
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('add message error:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Falha ao adicionar mensagem' });
  }
});

// Dispara um run com o Guardião
app.post('/api/run', async (req, res) => {
  try {
    const { thread_id } = req.body || {};
    if (!thread_id) {
      return res.status(400).json({ error: 'thread_id é obrigatório' });
    }
    const run = await openai.beta.threads.runs.create(thread_id, {
      assistant_id: ASSISTANT_ID
    });
    res.json({ run_id: run.id, status: run.status });
  } catch (err) {
    console.error('create run error:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Falha ao iniciar run' });
  }
});

// Polling simples até terminar e devolve histórico
app.get('/api/poll', async (req, res) => {
  try {
    const { thread_id, run_id } = req.query || {};
    if (!thread_id || !run_id) {
      return res.status(400).json({ error: 'thread_id e run_id são obrigatórios' });
    }

    const run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
    if (['queued','in_progress','requires_action','cancelling'].includes(run.status)) {
      return res.json({ status: run.status, messages: [] });
    }

    const msgList = await openai.beta.threads.messages.list(thread_id, { order: 'asc' });
    const messages = (msgList.data || []).map((m) => {
      const text = (m.content || [])
        .map((c) => (c.type === 'text' ? c.text?.value : '[conteúdo não-texto]'))
        .join('\n');
      return { id: m.id, role: m.role, content: text };
    });

    res.json({ status: run.status, messages });
  } catch (err) {
    console.error('poll error:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Falha ao consultar status' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Guardião do Portal rodando em http://localhost:${PORT}`);
});
