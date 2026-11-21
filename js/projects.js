(function () {
  'use strict';

  // Project data from Basim Kazmi GitHub repositories
  const projects = [
    {
      id: 'solar-power-efficiency',
      title: 'Forecasting Solar Power Efficiency',
      description: 'An end-to-end machine learning pipeline predicting solar power generation efficiency from atmospheric telemetry and OpenWeather API data.',
      extendedDetails: 'Engineered with Python and a Random Forest Regressor. Features data preprocessing, real-time weather integration via OpenWeather API, feature correlation analysis, and Seaborn visualizations.',
      tech: ['Python', 'Machine Learning', 'API Integration'],
      year: 2026,
      link: 'https://github.com/BasimKazmi/Forecasting-Solar-Power-Efficiency',
      image: 'assets/images/project-1.svg',
      imageAlt: 'Solar Power Efficiency forecasting diagram with regression curve'
    },
    {
      id: 'crime-ai-solver',
      title: 'Crime AI Solver via Classical AI',
      description: 'An automated crime resolution solver utilizing classical Artificial Intelligence state-space search algorithms and heuristic evaluations.',
      extendedDetails: 'Implements classical AI search strategies including Depth-First Search (DFS), Breadth-First Search (BFS), and A* heuristic search to navigate constraint-satisfaction state spaces.',
      tech: ['Python', 'Classical AI', 'Algorithms'],
      year: 2025,
      link: 'https://github.com/BasimKazmi/Crime-AI-solver-using-Classical-AI',
      image: 'assets/images/project-2.svg',
      imageAlt: 'Classical AI state-space graph search tree diagram'
    },
    {
      id: 'ddos-detection-ml',
      title: 'DDoS Attack Detection with ML',
      description: 'Machine learning classification system designed to detect and mitigate Distributed Denial of Service (DDoS) network anomalies in real time.',
      extendedDetails: 'Trained on high-dimensional network flow datasets to distinguish legitimate traffic from SYN flood, UDP flood, and HTTP volumetric attacks with balanced precision-recall curves.',
      tech: ['Python', 'Machine Learning', 'Cyber Security'],
      year: 2025,
      link: 'https://github.com/BasimKazmi/DDoS-Detection-ML',
      image: 'assets/images/project-3.svg',
      imageAlt: 'DDoS network traffic classification and anomaly detection diagram'
    },
    {
      id: 'semantic-analyzer-cpp',
      title: 'Semantic Analyzer in C++',
      description: 'The semantic analysis phase of a programming language compiler, validating type systems, scope rules, and identifier declarations.',
      extendedDetails: 'Constructed from scratch in modern C++. Builds hierarchical symbol tables, conducts static type inference and checking, flags out-of-scope variable usage, and detects semantic errors.',
      tech: ['C++', 'Compiler Design', 'Data Structures'],
      year: 2025,
      link: 'https://github.com/BasimKazmi/Semantic-Analyzer',
      image: 'assets/images/project-4.svg',
      imageAlt: 'Compiler symbol table hierarchy and type-checking diagram'
    },
    {
      id: 'syntax-analyzer-cpp',
      title: 'Syntax Analyzer in C++',
      description: 'A compiler frontend parser implementing context-free grammar validation, syntax tree generation, and error recovery.',
      extendedDetails: 'Implements recursive-descent parsing and shift-reduce validation for context-free grammars. Emits concrete parse trees and delivers precise line-number error reporting.',
      tech: ['C++', 'Parsing', 'Compilers'],
      year: 2025,
      link: 'https://github.com/BasimKazmi/Syntax-Analyzer-in-C-',
      image: 'assets/images/project-5.svg',
      imageAlt: 'Context-free grammar syntax tree diagram'
    },
    {
      id: 'game-stats-tracker',
      title: 'Multiplayer Game Stats Tracker',
      description: 'A relational database architecture and query engine written in MySQL for tracking multiplayer game telemetry, ranks, and player statistics.',
      extendedDetails: 'Designed in third normal form (3NF). Includes structured SQL scripts, foreign key cascades, indexed leaderboards, and complex joins for player statistics.',
      tech: ['SQL', 'Database Design', 'MySQL'],
      year: 2025,
      link: 'https://github.com/BasimKazmi/Multiplayer-Game-Stats-Tracker',
      image: 'assets/images/project-6.svg',
      imageAlt: 'Relational database schema and entity relationship mockup'
    },
    {
      id: 'used-cars-eda',
      title: 'Used Cars Price Valuation EDA',
      description: 'Exploratory data analysis and predictive regression modeling determining secondary automobile market valuations based on vehicle attributes.',
      extendedDetails: 'Data cleaning pipeline handling missing values, encoding categorical features, removing outliers, and training regression models to forecast resale prices.',
      tech: ['Python', 'Data Science', 'Data Analysis'],
      year: 2025,
      link: 'https://github.com/BasimKazmi/Used-Cars-Prices-EDA-Data-Science-and-Technologies-project-',
      image: 'assets/images/project-7.svg',
      imageAlt: 'Used car price regression and feature distribution visualization'
    }
  ];

  const gridContainer = document.getElementById('projects-grid');
  const searchInput = document.getElementById('search-input');
  const techFilter = document.getElementById('tech-filter');
  const statusContainer = document.getElementById('projects-status');
  const noProjectsMsg = document.getElementById('no-projects-msg');

  const modalDialog = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalYear = document.getElementById('modal-year');
  const modalTechList = document.getElementById('modal-tech');
  const modalDetails = document.getElementById('modal-details');
  const modalLink = document.getElementById('modal-link');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  let lastFocusedTrigger = null;

  // Build card using safe DOM methods
  function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('data-id', project.id);

    const img = document.createElement('img');
    img.className = 'project-card-image';
    img.src = project.image;
    img.alt = project.imageAlt;
    img.width = 600;
    img.height = 360;
    img.loading = 'lazy';
    card.appendChild(img);

    const body = document.createElement('div');
    body.className = 'project-card-body';

    const title = document.createElement('h2');
    title.className = 'project-card-title';
    title.textContent = project.title;
    body.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'project-card-desc';
    desc.textContent = project.description;
    body.appendChild(desc);

    const techWrapper = document.createElement('div');
    techWrapper.className = 'project-card-tech';

    const techList = document.createElement('ul');
    techList.className = 'tech-badge-list';
    techList.setAttribute('aria-label', `Technologies used in ${project.title}`);

    project.tech.forEach((techItem) => {
      const li = document.createElement('li');
      li.className = 'tech-badge';
      li.textContent = techItem;
      techList.appendChild(li);
    });

    techWrapper.appendChild(techList);
    body.appendChild(techWrapper);

    const actions = document.createElement('div');
    actions.className = 'project-card-actions';

    const detailsBtn = document.createElement('button');
    detailsBtn.type = 'button';
    detailsBtn.className = 'btn btn-secondary btn-sm project-details-btn';
    detailsBtn.textContent = 'View Details';
    detailsBtn.setAttribute('data-project-id', project.id);
    detailsBtn.setAttribute('aria-label', `View details for ${project.title}`);
    detailsBtn.addEventListener('click', () => openProjectModal(project.id, detailsBtn));
    actions.appendChild(detailsBtn);

    const repoLink = document.createElement('a');
    repoLink.href = project.link;
    repoLink.target = '_blank';
    repoLink.rel = 'noopener noreferrer';
    repoLink.className = 'btn btn-primary btn-sm';
    repoLink.textContent = 'GitHub Repo';
    repoLink.setAttribute('aria-label', `View source code for ${project.title} on GitHub`);
    actions.appendChild(repoLink);

    body.appendChild(actions);
    card.appendChild(body);

    return card;
  }

  // Filter projects by title, tech keyword, and dropdown selection
  function renderFilteredProjects() {
    if (!gridContainer) return;

    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const selectedTech = techFilter ? techFilter.value : 'all';

    const filtered = projects.filter((project) => {
      const matchesSearchTitle = project.title.toLowerCase().includes(query);
      const matchesSearchTech = project.tech.some((t) => t.toLowerCase().includes(query));
      const matchesSearch = query === '' || matchesSearchTitle || matchesSearchTech;

      const matchesSelectedTech =
        selectedTech === 'all' ||
        project.tech.some((t) => t.toLowerCase() === selectedTech.toLowerCase());

      return matchesSearch && matchesSelectedTech;
    });

    while (gridContainer.firstChild) {
      gridContainer.removeChild(gridContainer.firstChild);
    }

    filtered.forEach((project) => {
      gridContainer.appendChild(createProjectCard(project));
    });

    if (statusContainer) {
      statusContainer.textContent = `Showing ${filtered.length} of ${projects.length} projects`;
    }

    if (noProjectsMsg) {
      if (filtered.length === 0) {
        noProjectsMsg.removeAttribute('hidden');
      } else {
        noProjectsMsg.setAttribute('hidden', '');
      }
    }
  }

  // Open native dialog modal
  function openProjectModal(projectId, triggerElement) {
    if (!modalDialog) return;

    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    lastFocusedTrigger = triggerElement;

    if (modalTitle) modalTitle.textContent = project.title;
    if (modalDesc) modalDesc.textContent = project.description;
    if (modalYear) modalYear.textContent = String(project.year);
    if (modalDetails) modalDetails.textContent = project.extendedDetails;
    if (modalLink) {
      modalLink.href = project.link;
      modalLink.setAttribute('aria-label', `View ${project.title} on GitHub`);
    }

    if (modalTechList) {
      while (modalTechList.firstChild) {
        modalTechList.removeChild(modalTechList.firstChild);
      }
      project.tech.forEach((tech) => {
        const li = document.createElement('li');
        li.className = 'tech-badge';
        li.textContent = tech;
        modalTechList.appendChild(li);
      });
    }

    modalDialog.showModal();
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  // Close modal dialog
  function closeProjectModal() {
    if (!modalDialog || !modalDialog.open) return;
    modalDialog.close();
  }

  // Set up modal listeners
  function initModal() {
    if (!modalDialog) return;

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeProjectModal);
    }

    modalDialog.addEventListener('click', (event) => {
      const rect = modalDialog.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInside) closeProjectModal();
    });

    modalDialog.addEventListener('close', () => {
      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
        lastFocusedTrigger.focus();
      }
    });
  }

  function initProjects() {
    if (!gridContainer) return;

    if (searchInput) searchInput.addEventListener('input', renderFilteredProjects);
    if (techFilter) techFilter.addEventListener('change', renderFilteredProjects);

    initModal();
    renderFilteredProjects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
  } else {
    initProjects();
  }
})();
