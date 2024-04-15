import { trigger, transition, style, animate, query, sequence, stagger } from '@angular/animations';
import { Component, Injectable, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/_models';
import * as _ from 'lodash';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [

    trigger('slideInOut', [
      transition(":enter", [
        style({ height: 0, overflow: "hidden" }),
        query(".menu-node-button", [
          style({ opacity: 0, transform: "translateY(-50px)" })
        ]),
        sequence([
          animate("200ms", style({ height: "*" })),
          query(".menu-node-button", [
            stagger(-50, [
              animate("400ms ease", style({ opacity: 1, transform: "none" }))
            ])
          ])
        ])
      ]),

      transition(":leave", [
        style({ height: "*", overflow: "hidden" }),
        query(".menu-node-button", [style({ opacity: 1, transform: "none" })]),
        sequence([
          query(".menu-node-button", [
            stagger(50, [
              animate(
                "400ms ease",
                style({ opacity: 0, transform: "translateY(-50px)" })
              )
            ])
          ]),
          animate("200ms", style({ height: 0 }))
        ]),
      ])
    ])
  ]
})

@Injectable({
  providedIn: 'root'
})
export class SidenavComponent implements OnInit {
  menuData: any = [
    {
      name: 'Dashboard',
      route: 'dashboard'
    },
    {
      name: 'สมุดรายวัน',
      route: 'daybook'
    },
    {
      name: 'Setting',
      children: [
        {
          name: 'Account',
          route: 'account'
        },
        {
          name: 'Supplier',
          route: 'supplier'
        },
        {
          name: 'Customer',
          route: 'customer'
        },
        {
          name: 'Product',
          route: 'product'
        },
        {
          name: 'Material',
          route: 'material'
        }
      ]
    },
    {
      name: 'Report',
      children: [
        {
          name: 'แยกประเภท',
          route: 'ledger'
        },
        {
          name: 'กระดาษทำการ',
          route: 'workingPapers'
        },
        {
          name: 'TB12',
          route: 'tb12'
        },
        {
          name: 'งบประมาณ',
          route: 'budget'
        },
        {
          name: 'งบแสดงส่วนผู้ถือหุ้น',
          route: 'shareholdersEquityBudget'
        },
        {
          name: 'wps&wpl',
          route: 'wpswpl'
        },
        {
          name: 'C1',
          route: 'c1'
        },
        {
          name: 'C2',
          route: 'c2'
        },
        {
          name: 'C3',
          route: 'c3'
        },
        {
          name: 'C4',
          route: 'c4'
        },
        {
          name: 'C5',
          route: 'c5'
        },
        {
          name: 'C6',
          route: 'c6'
        },
        {
          name: 'C7',
          route: 'c7'
        },
      ]
    },
    {
      name: 'User',
      route: 'user',
      role: "admin"
    },
    {
      name: 'Log Out',
      route: 'auth/logout'
    }
  ];
  color = ["#8dc63f", "#32ceb0", "#5bafef", "#ff97c9", "#cde07a", "#ff9f50", "#a9a9f7", "#ff807d"];
  index = 0;
  menu: any;
  controller = {};
  selectedNode = undefined;
  highlightedParent: any;
  user?: User | null;
  profileText: string;
  companyText: string;

  constructor(
    private router: Router,
    private titleService: Title,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.authService.user.subscribe(x => this.user = x);
    if (this.user) {
      this.profileText = this.user.firstName?.[0]?.toUpperCase() + this.user.lastName?.[0]?.toUpperCase();
      if (this.user.company && this.user.company.name) {
        if (this.user.company.name.length > 30) {
          this.companyText = this.user.company.name.slice(0, 30) + '...'
        } else {
          this.companyText = this.user.company.name
        }
      }
    }
    this.mapMenu();
    this.setTitle();
  }

  ngOnChanges(): void {
    this.mapMenu();
  }

  mapMenu() {
    this.menu = this.menuData?.map(x => this.toNode(x));
  }

  ngDoCheck() {
    if (!this.selectedNode) {
      let data = this.findMenuItemByRoute(this.menu, this.router.url);
      this.selectedNode = data;
    }
    if (this.selectedNode && !this.highlightedParent) {
      Object.keys(this.controller).forEach(key => { this.controller[key].isActive = false })
      const parents = this.getAllParentIndex(this.selectedNode.parentIndex, this.controller);
      parents.forEach(key => {
        if (this.controller[key]) {
          this.controller[key].isActive = true;
        }
      });
      this.setTitleByCondition(this.selectedNode.name);
    }
  }

  setTitle() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const node = this.findMenuItemByRoute(this.menu, this.router.url);
          return node?.name;
        })
      )
      .subscribe((title) => {
        this.setTitleByCondition(title);
      });
  }

  setTitleByCondition(title) {
    let msg;
    if (title) {
      if (this.router.url.indexOf('add') != -1) {
        msg = `Add ${title}`;
      } else if (this.router.url.indexOf('edit') != -1) {
        msg = `Edit ${title}`;
      } else {
        msg = `${title}`;
      }
      msg = `${msg} - Nub`
    } else {
      msg = 'Nub'
    }
    this.titleService.setTitle(msg);
  }


  private toNode(x: any, parentColor?: string, parentIndex?: number): any {
    const y: any = { ...x };
    y.index = ++this.index;
    y.color = parentColor || this.color[this.index % 7];
    if (parentIndex) {
      y.parentIndex = parentIndex;
    }
    for (let n = 0; n < y?.children?.length; n++) {
      this.controller[y.index] = { parentIndex: parentIndex, isExpand: false, isActive: false };
      y.children[n] = this.toNode(y.children[n], y.color, y.index);
    }
    return y;
  }

  toggleVisible(node: any) {
    if (node?.children?.length) {
      if (this.controller[node.index].isExpand) {
        this.controller[node.index].isExpand = false;
      } else {
        this.controller[node.index].isExpand = true;
      }
    }
  }

  selectNode(node: any) {
    this.selectedNode = node;
    for (let i = 0; Object.keys(this.controller).length > i; i++) {
      let key = Object.keys(this.controller)[i];
      let parents = this.menu.find(x => x.index == key);
      let isChildren = this.findIndexInChildren(parents, node.index);
      if (!isChildren) {
        this.controller[key].isExpand = false;
        this.controller[key].isActive = false;
      } else {
        break;
      }
    }

    Object.keys(this.controller).forEach(key => { this.controller[key].isActive = false })
    const parents = this.getAllParentIndex(node.parentIndex, this.controller);
    parents.forEach(key => {
      if (this.controller[key]) {
        this.controller[key].isActive = true;
      }
    });
  }

  getAllParentIndex(index: any, data: any): number[] {
    const parents: any[] = [];
    parents.push(index);

    function findParent(currIndex: string | number, data: any) {
      const element = data[currIndex];
      if (element && element.parentIndex !== undefined) {
        parents.push(element.parentIndex);
        findParent(element.parentIndex, data);
      }
    }

    findParent(index, data);
    return parents;
  }
  isSelected(node: any) {
    this.selectedNode = null;
    let isSelected: boolean = node === this.selectedNode || this.router.url.indexOf(node?.route) !== -1;
    if (isSelected) {
      this.selectedNode = node;
    }

    return isSelected
  }

  findIndexInChildren(node: any, targetIndex: any): boolean {
    if (node?.index == targetIndex) {
      return true;
    }
    if (node?.children) {
      for (const childNode of node.children) {
        let isChildren = this.findIndexInChildren(childNode, targetIndex)
        if (isChildren) {
          return true;
        }
      }
    }
    return false;
  }

  highlightParent(node: any) {
    this.highlightedParent = node;
    const parents = this.getAllParentIndex(node.parentIndex, this.controller);
    parents.forEach(key => {
      if (this.controller[key]) {
        this.controller[key].isActive = true;
      }
    });
  }

  resetParentHighlight() {
    Object.keys(this.controller).forEach(key => { this.controller[key].isActive = false })
    this.highlightedParent = undefined;
  }

  findMenuItemByRoute(menu: any, targetRoute: string) {
    for (const item of menu) {
      if (targetRoute.indexOf(item.route) !== -1) {
        return item;
      }
      if (item.children) {
        const foundInChildren = this.findMenuItemByRoute(item.children, targetRoute);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }
    return undefined;
  }

  logout() {
    this.authService.logout();
  }
}
