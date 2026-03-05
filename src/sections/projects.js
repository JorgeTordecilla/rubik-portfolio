const PROJECTS = [
  {
    name: 'Flow Builder — Juju',
    desc: 'Herramienta interna para automatizar la creación de flujos conversacionales en la plataforma de chatbots de Juju (programas de incentivos para 250+ empresas, 185k usuarios). Redujo el tiempo de implementación en un 30%. Co-diseñé la arquitectura multicanal completa de la solución.',
    tags: ['Python', 'Chatbots', 'LLM', 'Architecture', 'Automation'],
    github: null,
    demo: null,
  },
  {
    name: 'BudgetBuddy',
    desc: 'Monorepo contract-first: API REST (FastAPI + SQLAlchemy), frontend (React + TypeScript) y generación automática de SDKs en TypeScript y Python desde specs OpenAPI. TDD end-to-end.',
    tags: ['FastAPI', 'React', 'TypeScript', 'OpenAPI', 'Python', 'TDD'],
    github: 'https://github.com/JorgeTordecilla/BudgetBuddy',
    demo: null,
  },
  {
    name: 'SEVAE',
    desc: 'Plataforma fullstack de gestión de eventos con notificaciones multicanal en tiempo real — SMS (Twilio), email (Nodemailer) y WebSockets (Socket.io). Backend Express + MongoDB con Change Streams; frontend React.',
    tags: ['Node.js', 'Express', 'MongoDB', 'Socket.io', 'Twilio', 'React'],
    github: 'https://github.com/JorgeTordecilla/sevae-Backend',
    github2: 'https://github.com/JorgeTordecilla/sevaeFrontend',
    demo: null,
  },
  {
    name: 'Seguimiento en tiempo real — Ceiba',
    desc: 'Sistema con brokers de mensajería para seguimiento de clientes, reservas, vuelos y datos contables en un dashboard unificado. Desarrollado en Ceiba Software para cliente enterprise.',
    tags: ['Kafka', 'NestJS', 'React', 'Docker', 'PostgreSQL'],
    github: null,
    demo: null,
  },
  {
    name: 'Rubik Portfolio',
    desc: 'Portafolio interactivo con Cubo de Rubik 3D resuelto mediante scroll. La metáfora: cada sección ordenada es un paso hacia la solución.',
    tags: ['Three.js', 'Vite', 'JavaScript', 'CSS'],
    github: 'https://github.com/JorgeTordecilla/JorgeTordecillaPortfolio',
    demo: 'https://JorgeTordecilla.github.io/JorgeTordecillaPortfolio',
  },
];

export function renderProjects() {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;
  PROJECTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';

    const links = [];
    if (p.github && p.github2) {
      links.push(`<a href="${p.github}"  target="_blank" rel="noopener">Backend &rarr;</a>`);
      links.push(`<a href="${p.github2}" target="_blank" rel="noopener">Frontend &rarr;</a>`);
    } else if (p.github) {
      links.push(`<a href="${p.github}" target="_blank" rel="noopener">GitHub &rarr;</a>`);
    }
    if (p.demo) {
      links.push(`<a href="${p.demo}" target="_blank" rel="noopener">Live &rarr;</a>`);
    }

    card.innerHTML = `
      <p class="project-title">${p.name}</p>
      <p class="project-desc">${p.desc}</p>
      <div class="project-tags">
        ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
      <div class="card-links">${links.join('')}</div>`;

    grid.appendChild(card);
  });
}
