import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  tech: string[];
  description: string;
  features: string[];
  images: string[];
  category: 'web' | 'desktop' | 'graphics' | 'game';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  isBrowser: boolean;
  activeSection = 'hero';
  modalProject: Project | null = null;
  modalImageIndex = 0;
  imagePreviewSrc: string | null = null;
  imagePreviewTitle: string = '';
  currentYear = new Date().getFullYear();
  heroVisible = false;
  headerScrolled = false;
  mobileMenuOpen = false;

  navLinks = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ];

  projects: Project[] = [
    {
      id: 'event-day',
      title: 'Event Day',
      subtitle: 'Progressive Web App for Conference with AI Assistant',
      tech: ['React 18', 'Express.js', 'SQLite', 'Claude API', 'PWA'],
      description: 'Progressive Web Application (PWA) for Event Day conference featuring an AI assistant, personalized schedule management, and real-time moderation. Enables attendees to browse the agenda, take notes during sessions, interact with an AI assistant, and allows administrators to manage sessions and announcements.',
      features: ['AI Assistant (Claude API) — Chatbot answering questions about schedule, speakers, and venue', 'Personalized Schedule — Session bookmarking, conflict detection, status tracking (LIVE/Upcoming/Past)', 'Live Q&A — Submit questions with priority voting', 'Networking — Digital business cards with vCard export', 'Admin Panel — Full CRUD for sessions, speakers, and announcements', 'PWA + Mobile-first — Offline support, installable, glassmorphism UI'],
      images: ['assets/projects/event-day/1.png','assets/projects/event-day/2.png','assets/projects/event-day/3.png','assets/projects/event-day/4.png','assets/projects/event-day/5.png'],
      category: 'web',
    },
    {
      id: 'travel-vista',
      title: 'Travel Vista',
      subtitle: 'Tourist Tour Platform with AI & Gamification',
      tech: ['ASP.NET Core 8', 'Angular 16', 'PostgreSQL', 'SignalR', 'OpenAI'],
      description: 'Full-stack web application for planning and tracking tourist tours with gamification and AI integration. Authors create tours with checkpoints, tourists execute them with real-time location tracking, and administrators manage the system.',
      features: ['Real-time tracking (SignalR, Leaflet maps)', 'AI assistant (OpenAI + ElevenLabs TTS)', 'Gamification (ranks, achievements, rewards)', 'Modular monolith (Clean Architecture)'],
      images: ['assets/projects/travel-vista/1.png','assets/projects/travel-vista/2.png','assets/projects/travel-vista/3.png','assets/projects/travel-vista/4.png','assets/projects/travel-vista/5.png'],
      category: 'web',
    },
    {
      id: 'tourflo',
      title: 'TourFlo',
      subtitle: 'Tourism Platform — 7-Service Microservices Architecture',
      tech: ['Angular 18', 'ASP.NET Core', 'Spring Boot', 'Go', 'Node.js', 'Docker', 'gRPC'],
      description: 'Tourism platform built with a full microservices architecture for the Service-Oriented Architecture course. Seven independently deployable services communicate via REST and gRPC, all orchestrated with Docker Compose.',
      features: [
        'API Gateway (Golang + gRPC) — unified entry point with JWT validation and service routing',
        'Auth & Stakeholders (ASP.NET Core + PostgreSQL) — registration, JWT issuance, user profiles',
        'Tour & Purchase (Spring Boot + PostgreSQL) — tour management, position simulator, cart & checkout',
        'Blog (Node.js + MongoDB) — travel blog with full CRUD',
        'Followers (Golang + Neo4j) — social graph for tourist connections',
        'Full Docker Compose deployment — all 7 services containerized and networked',
      ],
      images: ['assets/projects/tourflo/1.png', 'assets/projects/tourflo/2.png', 'assets/projects/tourflo/3.png', 'assets/projects/tourflo/4.png', 'assets/projects/tourflo/5.png'],
      category: 'web',
    },
    {
      id: 'jutjubic',
      title: 'Jutjubic',
      subtitle: 'Video Sharing Platform with Geo-Mapping',
      tech: ['Java Spring Boot', 'Angular 16', 'PostgreSQL', 'Prometheus', 'Grafana'],
      description: 'Full-stack application for video content sharing with geographic mapping and advanced analytics. Users upload location-based videos, view them on an interactive map, and track popular content through an ETL pipeline with weighted scoring.',
      features: ['Real-time video tracking + Leaflet maps (tile caching)', 'ETL pipeline for analytics (scheduled jobs, popularity scoring)', 'JWT authentication + email activation', 'Monitoring stack (Prometheus + Grafana + custom metrics)'],
      images: ['assets/projects/jutjubic/1.png','assets/projects/jutjubic/2.png','assets/projects/jutjubic/3.png','assets/projects/jutjubic/4.png'],
      category: 'web',
    },
    {
      id: 'teodity-market',
      title: 'Teodity Market',
      subtitle: 'E-Commerce Marketplace with Auctions',
      tech: ['React 19', 'Node.js', 'Express', 'Leaflet', 'Nodemailer'],
      description: 'Full-stack e-commerce marketplace application with support for fixed prices and auctions. Buyers search and purchase products, sellers manage inventory, and administrators moderate the system.',
      features: ['Dual-mode sales (fixed price + auctions)', 'Location tracking (Leaflet maps)', 'Email notifications (Nodemailer)', 'Role-based permissions (buyer, seller, admin)'],
      images: ['assets/projects/teodity-market/1.png','assets/projects/teodity-market/2.png','assets/projects/teodity-market/3.png','assets/projects/teodity-market/4.png'],
      category: 'web',
    },
    {
      id: 'brb',
      title: 'Be Real Bro',
      subtitle: 'Social Party Card Game Web App',
      tech: ['Angular 18', 'TypeScript', 'RxJS', 'SCSS'],
      description: 'Social party card game web application for friends, combining honest questions and fun challenges. Built as a single-page Angular app with reactive card-deck management and category-based card pools.',
      features: [
        'Shuffled question deck with multiple themed categories loaded from JSON',
        'Separate challenge card pool drawn on "Punishment" button',
        'Skip once-per-game mechanic',
        'Special one-time-use cards per turn',
        'Reactive state management via RxJS BehaviorSubjects',
        'Mobile-first responsive design — ideal for phones at parties',
      ],
      images: ['assets/projects/brb/1.png', 'assets/projects/brb/2.png', 'assets/projects/brb/3.png'],
      category: 'web',
    },
    {
      id: 'booking-app',
      title: 'Booking App',
      subtitle: 'Accommodation & Tour Reservation System',
      tech: ['C# .NET 8', 'WPF', 'MVVM', 'PDF Generation'],
      description: 'Desktop application for accommodation and tour reservation management with complex tracking system and multi-role architecture. Owners and guests book accommodations, guides organize tours with live tracking, and tourists reserve and rate experiences.',
      features: ['Live tour tracking + progress monitoring', 'Multi-role system (Guests, Owners, Guides, Tourists)', 'Custom DI container + MVVM architecture', 'PDF report generation + monthly/yearly statistics'],
      images: ['assets/projects/booking-app/1.png','assets/projects/booking-app/2.png','assets/projects/booking-app/3.png','assets/projects/booking-app/4.png'],
      category: 'desktop',
    },
    {
      id: 'unity-3d',
      title: 'Unity 3D Runner',
      subtitle: '3D Third-Person Game in Unity 6',
      tech: ['Unity 6', 'C#', 'Unity Physics', 'Rigidbody'],
      description: '3D third-person game set in an Old Sea Port environment, developed in Unity 6 for the Visual Programming and Animation (VPA) course. Features a full physics-based character controller with speed power-ups and collision reactions.',
      features: [
        'Character controller — walk, run (Shift), jump (Space), crouch (Ctrl)',
        'Speed pickups — boost and slow-debuff collectibles with active-timer HUD',
        'Physics collision — character stumbles and auto-recovers on high-force impact',
        'Push physics — rigidbody objects respond to character momentum with impulse force',
        'Animator-driven blended movement states (idle/walk/run/crouch/jump/fall)',
        'Pause system, camera controller, and UI manager',
      ],
      images: ['assets/projects/unity-3d/1.png', 'assets/projects/unity-3d/2.png', 'assets/projects/unity-3d/3.png'],
      category: 'game',
    },
    {
      id: 'unity-2d',
      title: 'Unity 2D Platformer',
      subtitle: '2D Action Platformer Game in Unity 6',
      tech: ['Unity 6', 'C#', 'Unity Input System', 'Pixel Art'],
      description: '2D action platformer game developed in Unity 6 for the Visual Programming and Animation (VPA) course. A knight battles through pixel art levels filled with patrolling enemies, traps, and collectible power-ups.',
      features: [
        'Knight character — WASD movement, jump, and sprint with cooldown indicator',
        'Flying potion power-up — temporary flight mode with timer bar',
        'Enemy AI — ground patrol enemies and flying enemies',
        'Trap systems — moving platform traps and projectile-shooting trap towers',
        'Health bar, damage feedback animations, and game over screen',
        'SoundManager with background music and SFX audio mixer channels',
      ],
      images: ['assets/projects/unity-2d/1.png', 'assets/projects/unity-2d/2.png', 'assets/projects/unity-2d/3.png'],
      category: 'game',
    },
    {
      id: 'elevator-3d',
      title: '3D Elevator Simulator',
      subtitle: 'First-Person OpenGL Interactive Simulation',
      tech: ['C++', 'OpenGL 3.3', 'GLFW/GLEW', 'GLM', 'Assimp'],
      description: 'Interactive 3D first-person elevator simulator with realistic mechanics, Phong shading lighting, and 3D models. Free movement through an 8-floor building with raycasting interaction on the control panel.',
      features: ['First-person camera (mouse look + WASD)', 'Phong shading with 9+ point lights', 'Raycasting interaction with 3D buttons', '3 different plant 3D models (.obj Assimp)'],
      images: ['assets/projects/elevator-3d/1.png','assets/projects/elevator-3d/2.png'],
      category: 'graphics',
    },
    {
      id: 'elevator-2d',
      title: '2D Elevator Simulator',
      subtitle: 'Interactive 2D OpenGL Simulation',
      tech: ['C++', 'OpenGL 3.3', 'GLFW/GLEW'],
      description: 'Interactive 2D elevator simulator with realistic mechanics and animations. Elevator control, person movement through an 8-floor building, entering and exiting the elevator with button and keyboard management.',
      features: ['Elevator movement with request queue', 'Door animation (opening/closing)', 'Person walking animation (6 frames)', 'Custom font rendering system'],
      images: ['assets/projects/elevator-2d/1.png','assets/projects/elevator-2d/2.png'],
      category: 'graphics',
    },
  ];

  skillCategories = [
    { title: 'Languages', icon: '{ }', items: ['Java', 'C#', 'C++', 'TypeScript', 'Go', 'Python', 'SQL', 'C'] },
    { title: 'Backend', icon: '⚙', items: ['Spring Boot', 'ASP.NET Core', 'Node.js / Express', 'gRPC', '.NET / WPF'] },
    { title: 'Frontend', icon: '◧', items: ['Angular', 'React', 'HTML / CSS / SCSS', 'Leaflet Maps'] },
    { title: 'Databases & DevOps', icon: '◉', items: ['PostgreSQL', 'MongoDB', 'Neo4j', 'Docker', 'Prometheus', 'Grafana', 'Git'] },
    { title: 'Graphics & Game Dev', icon: '△', items: ['Unity 6', 'OpenGL 3.3', 'GLFW / GLEW', 'Assimp', 'OpenCV', 'MATLAB'] },
  ];

  activeFilter = 'all';
  filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Apps' },
    { id: 'desktop', label: 'Desktop' },
    { id: 'game', label: 'Games' },
    { id: 'graphics', label: 'Graphics' },
  ];

  private observer?: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      setTimeout(() => this.heroVisible = true, 150);
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) return;
    this.headerScrolled = window.scrollY > 60;
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            const sid = entry.target.getAttribute('data-section');
            if (sid) this.activeSection = sid;
          }
        });
      },
      { threshold: 0.12, rootMargin: '-60px 0px -60px 0px' }
    );
    setTimeout(() => {
      document.querySelectorAll('[data-reveal]').forEach(el => this.observer!.observe(el));
      document.querySelectorAll('[data-section]').forEach(el => this.observer!.observe(el));
    }, 250);
  }

  get filteredProjects(): Project[] {
    if (this.activeFilter === 'all') return this.projects;
    return this.projects.filter(p => p.category === this.activeFilter);
  }

  setFilter(id: string): void {
    this.activeFilter = id;
    // Show new project cards immediately after filter change
    if (this.isBrowser) {
      setTimeout(() => {
        const cards = document.querySelectorAll('.project-card[data-reveal]');
        cards.forEach((card, index) => {
          // Remove and re-add revealed class with staggered delay
          card.classList.remove('revealed');
          setTimeout(() => {
            card.classList.add('revealed');
          }, index * 80);
        });
      }, 10);
    }
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  scrollTo(sectionId: string): void {
    this.mobileMenuOpen = false;
    if (this.isBrowser) document.body.style.overflow = '';
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  openModal(project: Project): void {
    this.modalProject = project;
    this.modalImageIndex = 0;
    if (this.isBrowser) document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.modalProject = null;
    if (this.isBrowser) document.body.style.overflow = '';
  }

  openImagePreview(imageSrc: string, projectTitle: string, e: Event): void {
    e.stopPropagation();
    this.imagePreviewSrc = imageSrc;
    this.imagePreviewTitle = projectTitle;
    if (this.isBrowser) document.body.style.overflow = 'hidden';
  }

  closeImagePreview(): void {
    this.imagePreviewSrc = null;
    this.imagePreviewTitle = '';
    if (this.isBrowser) document.body.style.overflow = '';
  }

  nextImage(): void {
    if (this.modalProject) this.modalImageIndex = (this.modalImageIndex + 1) % this.modalProject.images.length;
  }

  prevImage(): void {
    if (this.modalProject) this.modalImageIndex = (this.modalImageIndex - 1 + this.modalProject.images.length) % this.modalProject.images.length;
  }

  setModalImage(i: number): void { this.modalImageIndex = i; }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      if (this.imagePreviewSrc) {
        this.closeImagePreview();
      } else if (this.modalProject) {
        this.closeModal();
      }
      return;
    }
    if (!this.modalProject) return;
    if (e.key === 'ArrowRight') this.nextImage();
    if (e.key === 'ArrowLeft') this.prevImage();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.isBrowser) {
      document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    }
  }

  getCategoryLabel(cat: string): string {
    return ({ web: 'Web App', desktop: 'Desktop', graphics: 'Computer Graphics', game: 'Game Dev' } as any)[cat] || cat;
  }

  getProjectIndex(project: Project): string {
    const idx = this.filteredProjects.indexOf(project) + 1;
    return idx < 10 ? '0' + idx : '' + idx;
  }
}
