import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SafeHtmlPipe } from '../../pipe/safe-html.pipe';
import { combineLatest, Subscription } from 'rxjs';

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  new?: boolean;
  subItems?: { name: string; path: string; new?: boolean }[];
};

@Component({
  selector: 'app-boutique-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, SafeHtmlPipe],
  templateUrl: './boutique-sidebar.component.html'
})
export class BoutiqueSidebarComponent {
  navItems: NavItem[] = [
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 3.25C4.25736 3.25 3.25 4.25736 3.25 5.5V8.99998C3.25 10.2426 4.25736 11.25 5.5 11.25H9C10.2426 11.25 11.25 10.2426 11.25 8.99998V5.5C11.25 4.25736 10.2426 3.25 9 3.25H5.5ZM4.75 5.5C4.75 5.08579 5.08579 4.75 5.5 4.75H9C9.41421 4.75 9.75 5.08579 9.75 5.5V8.99998C9.75 9.41419 9.41421 9.74998 9 9.74998H5.5C5.08579 9.74998 4.75 9.41419 4.75 8.99998V5.5ZM5.5 12.75C4.25736 12.75 3.25 13.7574 3.25 15V18.5C3.25 19.7426 4.25736 20.75 5.5 20.75H9C10.2426 20.75 11.25 19.7427 11.25 18.5V15C11.25 13.7574 10.2426 12.75 9 12.75H5.5ZM4.75 15C4.75 14.5858 5.08579 14.25 5.5 14.25H9C9.41421 14.25 9.75 14.5858 9.75 15V18.5C9.75 18.9142 9.41421 19.25 9 19.25H5.5C5.08579 19.25 4.75 18.9142 4.75 18.5V15ZM12.75 5.5C12.75 4.25736 13.7574 3.25 15 3.25H18.5C19.7426 3.25 20.75 4.25736 20.75 5.5V8.99998C20.75 10.2426 19.7426 11.25 18.5 11.25H15C13.7574 11.25 12.75 10.2426 12.75 8.99998V5.5ZM15 4.75C14.5858 4.75 14.25 5.08579 14.25 5.5V8.99998C14.25 9.41419 14.5858 9.74998 15 9.74998H18.5C18.9142 9.74998 19.25 9.41419 19.25 8.99998V5.5C19.25 5.08579 18.9142 4.75 18.5 4.75H15ZM15 12.75C13.7574 12.75 12.75 13.7574 12.75 15V18.5C12.75 19.7426 13.7574 20.75 15 20.75H18.5C19.7426 20.75 20.75 19.7427 20.75 18.5V15C20.75 13.7574 19.7426 12.75 18.5 12.75H15ZM14.25 15C14.25 14.5858 14.5858 14.25 15 14.25H18.5C18.9142 14.25 19.25 14.5858 19.25 15V18.5C19.25 18.9142 18.9142 19.25 18.5 19.25H15C14.5858 19.25 14.25 18.9142 14.25 18.5V15Z" fill="currentColor"></path></svg>`,
      name: 'Tableau de bord',
      path: '/boutique/dashboard'
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.25 5.5C3.25 4.25736 4.25736 3.25 5.5 3.25H18.5C19.7426 3.25 20.75 4.25736 20.75 5.5V18.5C20.75 19.7426 19.7426 20.75 18.5 20.75H5.5C4.25736 20.75 3.25 19.7426 3.25 18.5V5.5ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5V18.5C4.75 18.9142 5.08579 19.25 5.5 19.25H18.5C18.9142 19.25 19.25 18.9142 19.25 18.5V5.5C19.25 5.08579 18.9142 4.75 18.5 4.75H5.5ZM7 8C7 7.44772 7.44772 7 8 7H8.01C8.56228 7 9.01 7.44772 9.01 8C9.01 8.55228 8.56228 9 8.01 9H8C7.44772 9 7 8.55228 7 8ZM11 7.25C10.5858 7.25 10.25 7.58579 10.25 8C10.25 8.41421 10.5858 8.75 11 8.75H16C16.4142 8.75 16.75 8.41421 16.75 8C16.75 7.58579 16.4142 7.25 16 7.25H11ZM7 12C7 11.4477 7.44772 11 8 11H8.01C8.56228 11 9.01 11.4477 9.01 12C9.01 12.5523 8.56228 13 8.01 13H8C7.44772 13 7 12.5523 7 12ZM11 11.25C10.5858 11.25 10.25 11.5858 10.25 12C10.25 12.4142 10.5858 12.75 11 12.75H16C16.4142 12.75 16.75 12.4142 16.75 12C16.75 11.5858 16.4142 11.25 16 11.25H11ZM7 16C7 15.4477 7.44772 15 8 15H8.01C8.56228 15 9.01 15.4477 9.01 16C9.01 16.5523 8.56228 17 8.01 17H8C7.44772 17 7 16.5523 7 16ZM11 15.25C10.5858 15.25 10.25 15.5858 10.25 16C10.25 16.4142 10.5858 16.75 11 16.75H16C16.4142 16.75 16.75 16.4142 16.75 16C16.75 15.5858 16.4142 15.25 16 15.25H11Z" fill="currentColor"></path></svg>`,
      name: 'Ma Boutique',
      path: '/boutique/profile'
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 7.5C4.25 5.70507 5.70507 4.25 7.5 4.25H16.5C18.2949 4.25 19.75 5.70507 19.75 7.5V16.5C19.75 18.2949 18.2949 19.75 16.5 19.75H7.5C5.70507 19.75 4.25 18.2949 4.25 16.5V7.5ZM7.5 5.75C6.5335 5.75 5.75 6.5335 5.75 7.5V16.5C5.75 17.4665 6.5335 18.25 7.5 18.25H16.5C17.4665 18.25 18.25 17.4665 18.25 16.5V7.5C18.25 6.5335 17.4665 5.75 16.5 5.75H7.5ZM12 8.25C11.5858 8.25 11.25 8.58579 11.25 9V11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15V12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9C12.75 8.58579 12.4142 8.25 12 8.25Z" fill="currentColor"></path></svg>`,
      name: 'Produits',
      subItems: [
        { name: 'Tous les produits', path: '/boutique/products' },
        { name: 'Ajouter un produit', path: '/boutique/products/new' }
      ]
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.25 5C5.25 4.58579 5.58579 4.25 6 4.25H18C18.4142 4.25 18.75 4.58579 18.75 5V6.75H19C19.9665 6.75 20.75 7.5335 20.75 8.5V18.5C20.75 19.4665 19.9665 20.25 19 20.25H5C4.0335 20.25 3.25 19.4665 3.25 18.5V8.5C3.25 7.5335 4.0335 6.75 5 6.75H5.25V5ZM6.75 6.75H17.25V5.75H6.75V6.75ZM5 8.25C4.86193 8.25 4.75 8.36193 4.75 8.5V18.5C4.75 18.6381 4.86193 18.75 5 18.75H19C19.1381 18.75 19.25 18.6381 19.25 18.5V8.5C19.25 8.36193 19.1381 8.25 19 8.25H5ZM8 11.25C8.41421 11.25 8.75 11.5858 8.75 12V15C8.75 15.4142 8.41421 15.75 8 15.75C7.58579 15.75 7.25 15.4142 7.25 15V12C7.25 11.5858 7.58579 11.25 8 11.25ZM12.75 10C12.75 9.58579 12.4142 9.25 12 9.25C11.5858 9.25 11.25 9.58579 11.25 10V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15V10ZM16 12.25C16.4142 12.25 16.75 12.5858 16.75 13V15C16.75 15.4142 16.4142 15.75 16 15.75C15.5858 15.75 15.25 15.4142 15.25 15V13C15.25 12.5858 15.5858 12.25 16 12.25Z" fill="currentColor"></path></svg>`,
      name: 'Commandes',
      subItems: [
        { name: 'En cours', path: '/boutique/orders' },
        { name: 'Historique', path: '/boutique/orders/history' }
      ]
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C11.5858 2 11.25 2.33579 11.25 2.75V12C11.25 12.4142 11.5858 12.75 12 12.75H21.25C21.6642 12.75 22 12.4142 22 12C22 6.47715 17.5228 2 12 2ZM12.75 11.25V3.53263C16.4281 3.93973 19.3103 6.82192 19.7174 10.5H12.75V11.25ZM2 12C2 7.25083 5.31065 3.27489 9.75 2.25415V3.80099C6.14748 4.78734 3.5 8.0845 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C15.9155 20.5 19.2127 17.8525 20.199 14.25H21.7459C20.7251 18.6894 16.7492 22 12 22C6.47715 22 2 17.5229 2 12Z" fill="currentColor"></path></svg>`,
      name: 'Statistiques',
      path: '/boutique/statistics'
    }
  ];

  othersItems: NavItem[] = [
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM12 20.5C10.1198 20.5 8.38223 19.8895 6.97461 18.856V18.8455C6.97461 16.7744 8.65354 15.0955 10.7246 15.0955H13.2746C15.3457 15.0955 17.0246 16.7744 17.0246 18.8455V18.8566C15.6171 19.8898 13.8798 20.5 12 20.5ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z" fill="currentColor"></path></svg>`,
      name: 'Mon Compte',
      path: '/boutique/account'
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.75C12.4142 2.75 12.75 3.08579 12.75 3.5V4.25697C14.3442 4.42221 15.8073 5.0568 16.9848 6.02889L17.5152 5.49853C17.8081 5.20564 18.2829 5.20564 18.5758 5.49853C18.8687 5.79142 18.8687 6.2663 18.5758 6.55919L18.0455 7.08954C19.0176 8.26702 19.6522 9.73016 19.8174 11.3243H20.5C20.9142 11.3243 21.25 11.6601 21.25 12.0743C21.25 12.4885 20.9142 12.8243 20.5 12.8243H19.8174C19.6522 14.4185 19.0176 15.8817 18.0455 17.0591L18.5758 17.5895C18.8687 17.8824 18.8687 18.3573 18.5758 18.6502C18.2829 18.943 17.8081 18.943 17.5152 18.6502L16.9848 18.1198C15.8073 19.0919 14.3442 19.7265 12.75 19.8917V20.5C12.75 20.9142 12.4142 21.25 12 21.25C11.5858 21.25 11.25 20.9142 11.25 20.5V19.8917C9.65584 19.7265 8.19269 19.0919 7.01521 18.1198L6.48486 18.6502C6.19197 18.943 5.71709 18.943 5.4242 18.6502C5.13131 18.3573 5.13131 17.8824 5.4242 17.5895L5.95455 17.0591C4.98246 15.8817 4.34786 14.4185 4.18262 12.8243H3.5C3.08579 12.8243 2.75 12.4885 2.75 12.0743C2.75 11.6601 3.08579 11.3243 3.5 11.3243H4.18262C4.34786 9.73016 4.98246 8.26702 5.95455 7.08954L5.4242 6.55919C5.13131 6.2663 5.13131 5.79142 5.4242 5.49853C5.71709 5.20564 6.19197 5.20564 6.48486 5.49853L7.01521 6.02889C8.19269 5.0568 9.65584 4.42221 11.25 4.25697V3.5C11.25 3.08579 11.5858 2.75 12 2.75ZM12 5.75C8.54822 5.75 5.75 8.54822 5.75 12C5.75 15.4518 8.54822 18.25 12 18.25C15.4518 18.25 18.25 15.4518 18.25 12C18.25 8.54822 15.4518 5.75 12 5.75Z" fill="currentColor"></path></svg>`,
      name: 'Aide',
      path: '/boutique/help'
    }
  ];

  openSubmenu: string | null | number = null;
  subMenuHeights: { [key: string]: number } = {};
  @ViewChildren('subMenu') subMenuRefs!: QueryList<ElementRef>;

  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  private subscription: Subscription = new Subscription();

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.isHovered$ = this.sidebarService.isHovered$;
  }

  ngOnInit() {
    this.subscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.setActiveMenuFromRoute(this.router.url);
        }
      })
    );

    this.subscription.add(
      combineLatest([this.isExpanded$, this.isMobileOpen$, this.isHovered$]).subscribe(
        ([isExpanded, isMobileOpen, isHovered]) => {
          if (!isExpanded && !isMobileOpen && !isHovered) {
            this.cdr.detectChanges();
          }
        }
      )
    );

    this.setActiveMenuFromRoute(this.router.url);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleSubmenu(section: string, index: number) {
    const key = `${section}-${index}`;

    if (this.openSubmenu === key) {
      this.openSubmenu = null;
      this.subMenuHeights[key] = 0;
    } else {
      this.openSubmenu = key;

      setTimeout(() => {
        const el = document.getElementById(key);
        if (el) {
          this.subMenuHeights[key] = el.scrollHeight;
          this.cdr.detectChanges();
        }
      });
    }
  }

  onSidebarMouseEnter() {
    this.isExpanded$.subscribe(expanded => {
      if (!expanded) {
        this.sidebarService.setHovered(true);
      }
    }).unsubscribe();
  }

  private setActiveMenuFromRoute(currentUrl: string) {
    const menuGroups = [
      { items: this.navItems, prefix: 'main' },
      { items: this.othersItems, prefix: 'others' }
    ];

    menuGroups.forEach(group => {
      group.items.forEach((nav, i) => {
        if (nav.subItems) {
          nav.subItems.forEach(subItem => {
            if (currentUrl === subItem.path) {
              const key = `${group.prefix}-${i}`;
              this.openSubmenu = key;

              setTimeout(() => {
                const el = document.getElementById(key);
                if (el) {
                  this.subMenuHeights[key] = el.scrollHeight;
                  this.cdr.detectChanges();
                }
              });
            }
          });
        }
      });
    });
  }

  onSubmenuClick() {
    this.isMobileOpen$.subscribe(isMobile => {
      if (isMobile) {
        this.sidebarService.setMobileOpen(false);
      }
    }).unsubscribe();
  }
}
