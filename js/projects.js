/**
 * ==========================================================================
 * CS-554 Assignment 1: Projects Renderer & Dynamic Filters (js/projects.js)
 * Safe DOM manipulation (zero .innerHTML), combined filtering, and live updates.
 * Bonus Feature: Accessible native <dialog> modal with backdrop close & focus restoration.
 * ==========================================================================
 */

(function () {
  'use strict';

  /**
   * Project dataset (minimum 6 projects with rich technical metadata).
   */
  const projects = [
    {
      id: 'project-1',
      title: 'Web Audio Synthesizer & Visualizer',
      description: 'An in-browser digital audio synthesizer featuring real-time fast Fourier transform (FFT) spectrum visualization and custom frequency modulation oscillators.',
      extendedDetails: 'Implemented using the Web Audio API with zero external frameworks. Features polyphonic oscillators, envelope generators (ADSR), low-pass biquad filters, and hardware-accelerated 60 FPS oscilloscope rendering on an HTML5 Canvas.',
      tech: ['JavaScript', 'Web Audio API', 'HTML/CSS'],
      year: 2026,
      link: 'https://github.com/example/web-audio-synth',
      image: 'assets/images/project-1.svg',
      imageAlt: 'Screenshot of Web Audio Synthesizer frequency spectrum and controls'
    },
    {
      id: 'project-2',
      title: 'Distributed Raft Consensus Engine',
      description: 'A lightweight distributed key-value store implementing the Raft consensus algorithm for fault-tolerant state machine replication.',
      extendedDetails: 'Features leader election, log replication, heartbeats, and cluster membership reconfiguration. Built from scratch with Python asyncio and tested under simulated packet loss and node partition scenarios.',
      tech: ['Python', 'Algorithms', 'AsyncIO'],
      year: 2025,
      link: 'https://github.com/example/raft-consensus-engine',
      image: 'assets/images/project-2.svg',
      imageAlt: 'Diagram showing Raft cluster node topology and replication streams'
    },
    {
      id: 'project-3',
      title: 'AST Static Code Linter',
      description: 'A command-line and browser linter parsing JavaScript/TypeScript Abstract Syntax Trees (AST) to detect anti-patterns and DOM vulnerabilities.',
      extendedDetails: 'Parses code into token streams and AST nodes, applying visitor pattern rules to flag unsanitized innerHTML injections, memory leaks, and accessibility omissions.',
      tech: ['TypeScript', 'JavaScript', 'Compiler Design'],
      year: 2026,
      link: 'https://github.com/example/ast-code-linter',
      image: 'assets/images/project-3.svg',
      imageAlt: 'Visual representation of an Abstract Syntax Tree node hierarchy'
    },
    {
      id: 'project-4',
      title: 'Interactive Neural Network Playground',
      description: 'Educational tool for configuring, training, and visualizing feedforward neural networks and backpropagation decision boundaries in real time.',
      extendedDetails: 'Calculates matrix multiplications and activation gradients directly in vanilla JavaScript and Python backend. Visualizes weight updates and loss convergence graphs dynamically.',
      tech: ['Python', 'JavaScript', 'Machine Learning'],
      year: 2025,
      link: 'https://github.com/example/neural-net-playground',
      image: 'assets/images/project-4.svg',
      imageAlt: 'Neural network layer visualization with weights and node activations'
    },
    {
      id: 'project-5',
      title: 'Agile Kanban Task Flow',
      description: 'A responsive, keyboard-accessible task management application with column reordering, offline persistence, and tag filtering.',
      extendedDetails: 'Engineered with native Drag and Drop API and full keyboard equivalent controls (arrow keys and space). Persists board state across browser sessions via localStorage and IndexedDB.',
      tech: ['JavaScript', 'HTML/CSS', 'LocalStorage'],
      year: 2026,
      link: 'https://github.com/example/kanban-task-flow',
      image: 'assets/images/project-5.svg',
      imageAlt: 'Agile Kanban task board with To Do, In Progress, and Done columns'
    },
    {
      id: 'project-6',
      title: 'Atmospheric Telemetry Dashboard',
      description: 'Real-time meteorological analytics dashboard aggregating multi-station weather sensor feeds and visualizing climate trends.',
      extendedDetails: 'Streams live telemetry over WebSockets, calculates microclimate anomalies, and renders SVG charts with fluid typography and WCAG AA contrast standards.',
      tech: ['TypeScript', 'JavaScript', 'HTML/CSS'],
      year: 2026,
      link: 'https://github.com/example/weather-telemetry',
      image: 'assets/images/project-6.svg',
      imageAlt: 'Atmospheric telemetry station dashboard with temperature and humidity trends'
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

  // Track element that opened modal for focus restoration
  let lastFocusedTrigger = null;

  /**
   * Safely create a project card DOM element.
   * SECURITY RULE: Never use .innerHTML; strictly use document.createElement,
   * textContent, setAttribute, and appendChild.
   *
   * @param {Object} project
   * @returns {HTMLElement} <article class="project-card">
   */
  function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('data-id', project.id);

    // Thumbnail image
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

    // Title (h2 inside article for semantic hierarchy under h1)
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
    techList.setAttribute('aria-label', `Technologies for ${project.title}`);

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

    // View Details button (triggers modal dialog)
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
    repoLink.textContent = 'GitHub';
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

    // Render cards
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

    // Populate tech list badges safely
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
