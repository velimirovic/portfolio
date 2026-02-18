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
  category: 'web' | 'desktop' | 'graphics';
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
    { title: 'Languages', icon: '{ }', items: ['Java', 'C#', 'C++', 'TypeScript', 'Python', 'SQL', 'C'] },
    { title: 'Backend', icon: '⚙', items: ['Spring Boot', 'ASP.NET Core', 'Node.js / Express', '.NET / WPF'] },
    { title: 'Frontend', icon: '◧', items: ['Angular', 'React', 'HTML / CSS / SCSS', 'Leaflet Maps'] },
    { title: 'Databases & DevOps', icon: '◉', items: ['PostgreSQL', 'Docker', 'Prometheus', 'Grafana', 'Git'] },
    { title: 'Graphics & Other', icon: '△', items: ['OpenGL 3.3', 'GLFW / GLEW', 'Assimp', 'OpenCV', 'MATLAB'] },
  ];

  activeFilter = 'all';
  filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Apps' },
    { id: 'desktop', label: 'Desktop' },
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

  nextImage(): void {
    if (this.modalProject) this.modalImageIndex = (this.modalImageIndex + 1) % this.modalProject.images.length;
  }

  prevImage(): void {
    if (this.modalProject) this.modalImageIndex = (this.modalImageIndex - 1 + this.modalProject.images.length) % this.modalProject.images.length;
  }

  setModalImage(i: number): void { this.modalImageIndex = i; }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (!this.modalProject) return;
    if (e.key === 'Escape') this.closeModal();
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
    return ({ web: 'Web App', desktop: 'Desktop', graphics: 'Computer Graphics' } as any)[cat] || cat;
  }

  getProjectIndex(project: Project): string {
    const idx = this.filteredProjects.indexOf(project) + 1;
    return idx < 10 ? '0' + idx : '' + idx;
  }
}
