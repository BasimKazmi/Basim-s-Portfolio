/**
 * ==========================================================================
 * CS-554 Assignment 1: Projects Renderer & Dynamic Filters (js/projects.js)
 * Developer: Basim Kazmi (https://github.com/BasimKazmi)
 *
 * Safe DOM manipulation (strictly document.createElement / textContent),
 * combined search & category filtering, and accessible <dialog> modal.
 * ==========================================================================
 */

(function () {
  'use strict';

  /**
   * Real project dataset populated from Basim Kazmi's GitHub repositories:
   * https://api.github.com/users/BasimKazmi/repos?per_page=100
   */
  const projects = [
    {
      id: 'solar-power-efficiency',
      title: 'Forecasting Solar Power Efficiency',
      description: 'An end-to-end machine learning pipeline predicting solar power generation efficiency from atmospheric telemetry and OpenWeather API data.',
      extendedDetails: 'Engineered with Python and a Random Forest Regressor. Features robust data preprocessing, real-time weather integration via the OpenWeather API, feature correlation analysis, and custom Seaborn visualizations.',
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
      extendedDetails: 'Implements classical AI search strategies including Depth-First Search (DFS), Breadth-First Search (BFS), and A* heuristic search to navigate constraint-satisfaction state spaces and solve complex deduction puzzles.',
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
      extendedDetails: 'Trained on high-dimensional network flow datasets to distinguish legitimate traffic from SYN flood, UDP flood, and HTTP volumetric attacks, minimizing false positives with balanced precision-recall curves.',
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
      extendedDetails: 'Constructed from scratch in modern C++. Builds and traverses hierarchical symbol tables, conducts static type inference and checking, flags out-of-scope variable usage, and detects semantic discrepancies prior to code generation.',
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
      extendedDetails: 'Implements recursive-descent parsing and shift-reduce validation for context-free grammars. Emits concrete parse trees and delivers precise line-number error reporting for syntactic violations.',
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
      extendedDetails: 'Designed with full third normal form (3NF) normalization. Includes structured SQL scripts, foreign key constraint cascades, indexed leaderboards, and complex joins for calculating player kill-death ratios and match summaries.',
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
      extendedDetails: 'Comprehensive data cleaning pipeline handling missing values, encoding categorical vehicle features, removing outliers, and training regression models to forecast resale prices based on mileage and condition.',
      tech: ['Python', 'Data Science', 'Data Analysis'],
      year: 2025,
      link: 'https://github.com/BasimKazmi/Used-Cars-Prices-EDA-Data-Science-and-Technologies-project-',
      image: 'assets/images/project-7.svg',
      imageAlt: 'Used car price regression and feature distribution visualization'
    }
  ];

  // DOM Elements
  const gridContainer = document.getElementById('projects-grid');
  const searchInput = document.getElementById('search-input');
  const techFilter = document.getElementById('tech-filter');
  const statusContainer = document.getElementById('projects-status');
  const noProjectsMsg = document.getElementById('no-projects-msg');

  // Bonus <dialog> Elements
  const modalDialog = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalYear = document.getElementById('modal-year');
  const modalTechList = document.getElementById('modal-tech');
  const modalDetails = document.getElementById('modal-details');
  const modalLink = document.getElementById('modal-link');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  let lastFocusedTrigger = null;

  /**
   * Safely create a project card DOM element.
   * SECURITY RULE: Never use unsafe markup strings; strictly use document.createElement,
   * textContent, setAttribute, and appendChild.
   *
   * @param {Object} project
   * @returns {HTMLElement} <article class="project-card">
   */
  function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('data-id', project.id);

    // Thumbnail image with explicit dimensions for CLS prevention
    const img = document.createElement('img');
    img.className = 'project-card-image';
    img.src = project.image;
    img.alt = project.imageAlt;
    img.width = 600;
    img.height = 360;
    img.loading = 'lazy';
    card.appendChild(img);

    // Card Body
    const body = document.createElement('div');
    body.className = 'project-card-body';

    // Title (h2 inside article for strict hierarchy under page h1)
    const title = document.createElement('h2');
    title.className = 'project-card-title';
    title.textContent = project.title;
    body.appendChild(title);

    // Description (p)
    const desc = document.createElement('p');
    desc.className = 'project-card-desc';
    desc.textContent = project.description;
    body.appendChild(desc);

    // Tech Badge List (ul / li)
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

    // Card Actions
    const actions = document.createElement('div');
    actions.className = 'project-card-actions';

    // View Details button (opens native dialog)
    const detailsBtn = document.createElement('button');
    detailsBtn.type = 'button';
    detailsBtn.className = 'btn btn-secondary btn-sm project-details-btn';
    detailsBtn.textContent = 'View Details';
    detailsBtn.setAttribute('data-project-id', project.id);
    detailsBtn.setAttribute('aria-label', `View details for ${project.title}`);
    detailsBtn.addEventListener('click', () => openProjectModal(project.id, detailsBtn));
    actions.appendChild(detailsBtn);

    // Source repository link
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

  /**
   * Filter and render projects to the DOM.
   * Combined filter: (matchesSearchTitle || matchesSearchTech) && matchesSelectedTech
   */
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

    // Clear existing cards safely
    while (gridContainer.firstChild) {
      gridContainer.removeChild(gridContainer.firstChild);
    }

    // Render cards safely
    filtered.forEach((project) => {
      gridContainer.appendChild(createProjectCard(project));
    });

    // Update Live Status Region for screen readers
    if (statusContainer) {
      statusContainer.textContent = `Showing ${filtered.length} of ${projects.length} projects`;
    }

    // Toggle Empty State
    if (noProjectsMsg) {
      if (filtered.length === 0) {
        noProjectsMsg.removeAttribute('hidden');
      } else {
        noProjectsMsg.setAttribute('hidden', '');
      }
    }
  }

  /**
   * Open the bonus <dialog> modal for a given project.
   * Restores focus to the triggering button upon close.
   *
   * @param {string} projectId
   * @param {HTMLElement} triggerElement
   */
  function openProjectModal(projectId, triggerElement) {
    if (!modalDialog) return;

    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    lastFocusedTrigger = triggerElement;

    // Populate modal fields safely using .textContent and safe DOM APIs
    if (modalTitle) modalTitle.textContent = project.title;
    if (modalDesc) modalDesc.textContent = project.description;
    if (modalYear) modalYear.textContent = String(project.year);
    if (modalDetails) modalDetails.textContent = project.extendedDetails;
    if (modalLink) {
      modalLink.href = project.link;
      modalLink.setAttribute('aria-label', `View ${project.title} on GitHub`);
    }

    // Populate tech badges safely
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

    // Open modal using native dialog API
    modalDialog.showModal();
    if (modalCloseBtn) {
      modalCloseBtn.focus();
    }
  }

  /**
   * Close the project modal dialog and restore focus.
   */
  function closeProjectModal() {
    if (!modalDialog || !modalDialog.open) return;
    modalDialog.close();
  }

  /**
   * Initialize modal event listeners (close button, backdrop click, Escape key, focus restoration).
   */
  function initModal() {
    if (!modalDialog) return;

    // Close button click
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeProjectModal);
    }

    // Close when clicking the backdrop (outside modal dialog content)
    modalDialog.addEventListener('click', (event) => {
      const rect = modalDialog.getBoundingClientRect();
      const isClickInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isClickInside) {
        closeProjectModal();
      }
    });

    // Native dialog close event (triggered by .close() and native Escape key)
    modalDialog.addEventListener('close', () => {
      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
        lastFocusedTrigger.focus();
      }
    });
  }

  /**
   * Initialize event listeners and render initial projects grid.
   */
  function initProjects() {
    if (!gridContainer) return;

    // Filter event listeners
    if (searchInput) {
      searchInput.addEventListener('input', renderFilteredProjects);
    }

    if (techFilter) {
      techFilter.addEventListener('change', renderFilteredProjects);
    }

    // Initialize bonus dialog modal
    initModal();

    // Initial render
    renderFilteredProjects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
  } else {
    initProjects();
  }
})();
