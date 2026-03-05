# Jorge Iván Tordecilla — Portfolio

Portfolio personal de **Jorge Iván Tordecilla**, Software Engineer especializado en automatización, agentes IA y chatbots multicanal. Construido desde cero con Vite + Three.js, sin frameworks UI.

🔗 **Live:** [jorgetordecilla.github.io/JorgeTordecillaPortfolio](https://jorgetordecilla.github.io/JorgeTordecillaPortfolio/)

---

## ✨ Features

- **Rubik's Cube 3D** interactivo (Three.js) que se resuelve al hacer scroll
- **Custom cursor** con efecto seguidor animado
- **Magnetic buttons** — los botones se atraen hacia el cursor
- **Noise grain overlay** cinematográfico sobre el fondo
- **Skill chips con tooltips** — hover revela años de experiencia por tecnología
- **Scroll reveal** animado con `IntersectionObserver`
- **Stats counter** animado (4+ años, 3 empresas, 30% más rápido)
- **Section nav lateral** que resalta la sección activa
- **Loader** con barra de progreso
- Diseño 100% responsivo · Dark mode nativo

---

## 🛠️ Stack

| Capa | Tecnología |
|---|---|
| Build | Vite 6 |
| 3D | Three.js |
| Estilos | CSS puro (custom properties, grid, clamp) |
| Fonts | DM Serif Display + DM Sans (Google Fonts) |
| Deploy | GitHub Pages (gh-pages) |

---

## 🚀 Desarrollo local

```bash
npm install
npm run dev
```

## 📦 Build & Deploy

```bash
npm run build     # genera /dist
npm run deploy    # publica en GitHub Pages
```

---

## 📁 Estructura

```
src/
├── animations/
│   ├── magneticButton.js   # efecto magnético en botones
│   └── ScrollController.js # sincroniza scroll con animación del cubo
├── cube/
│   └── RubikCube.js        # geometría y animación del cubo
├── scene/
│   └── SceneSetup.js       # cámara, renderer, luces
├── sections/
│   ├── skills.js           # chips de habilidades con tooltips
│   ├── projects.js         # tarjetas de proyectos
│   └── stats.js            # contadores animados
├── styles/
│   ├── main.css            # tokens, hero, layout global
│   └── sections.css        # estilos por sección
└── main.js               # punto de entrada, orquesta todo
```

---

© 2026 Jorge Iván Tordecilla · Colombia
