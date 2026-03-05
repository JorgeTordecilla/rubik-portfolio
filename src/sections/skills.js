const SKILLS = [
  {
    category: 'IA & Agentes',
    items: [
      { name: 'OpenAI',        tip: '1 año · GPT-4 + embeddings' },
      { name: 'Gemini',        tip: '1 año · multimodal' },
      { name: 'Agentes IA',    tip: 'Multi-agente · tools · RAG' },
      { name: 'Computer Vision', tip: 'Detección y clasificación' },
    ],
  },
  {
    category: 'Automatización',
    items: [
      { name: 'N8N',           tip: '2 años · workflows complejos' },
      { name: 'Make',          tip: 'Integración de APIs' },
      { name: 'MessageBird',   tip: 'WhatsApp Business API' },
      { name: 'Retool',        tip: 'Dashboards internos' },
      { name: 'Low Code',      tip: 'Prototipado rápido' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Python',        tip: '2 años · producción' },
      { name: 'FastAPI',       tip: '2 años · APIs REST + async' },
      { name: 'NestJS',        tip: '1 año · arquitectura modular' },
      { name: 'Node.js',       tip: '2 años · microservicios' },
      { name: 'Docker',        tip: 'Contenedores · CI/CD' },
    ],
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React',         tip: '2 años · componentes reutilizables' },
      { name: 'TypeScript',    tip: '2 años · tipado estricto' },
      { name: 'JavaScript',    tip: '4+ años · ES2024' },
    ],
  },
  {
    category: 'Bases de datos',
    items: [
      { name: 'PostgreSQL',    tip: '3 años · queries complejos' },
      { name: 'MongoDB',       tip: '2 años · documentos + agregaciones' },
    ],
  },
  {
    category: 'Bots & Canales',
    items: [
      { name: 'Telegram',      tip: 'Bots · inline · webhooks' },
      { name: 'WhatsApp',      tip: 'Business API · flows' },
      { name: 'Twilio',        tip: 'SMS · voz · verificación' },
      { name: 'Socket.io',     tip: 'Tiempo real · chat' },
    ],
  },
  {
    category: 'Metodologías',
    items: [
      { name: 'TDD',              tip: 'Test-driven · pytest · jest' },
      { name: 'DDD',              tip: 'Domain-driven design' },
      { name: 'Clean Architecture', tip: 'Hexagonal · capas' },
      { name: 'OpenAPI',          tip: 'Swagger · contratos API' },
      { name: 'Git',              tip: '4+ años · GitFlow · PRs' },
    ],
  },
];

export function renderSkills() {
  const grid = document.querySelector('.skills-grid');
  if (!grid) return;

  SKILLS.forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'skill-group';

    const label = document.createElement('span');
    label.className = 'skill-group-label';
    label.textContent = group.category;
    groupEl.appendChild(label);

    const chipsRow = document.createElement('div');
    chipsRow.className = 'skill-chips';

    group.items.forEach(({ name, tip }) => {
      const chip = document.createElement('div');
      chip.className = 'skill-chip';
      chip.innerHTML = `${name}<span class="chip-tip">${tip}</span>`;
      chipsRow.appendChild(chip);
    });

    groupEl.appendChild(chipsRow);
    grid.appendChild(groupEl);
  });
}
