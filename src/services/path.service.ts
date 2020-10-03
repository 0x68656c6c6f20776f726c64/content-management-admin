import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class PathService{

}
export const MENU_ITEMS = [
    {
      title: 'Home',
      path: '/admin/home',
      home: true,
    },
    {
      title: 'Projects',
      path: '/admin/projects',
    },
    {
       title:'Cases',
       path: '/admin/cases'
    },
    {
        title: 'News',
        path: '/admin/news',
      },
      {
        title: 'Online_evaluation',
        path: '/admin/online_evaluation',
      },
      {
        title: 'Settings',
        path: '/admin/settings',
      }
]

