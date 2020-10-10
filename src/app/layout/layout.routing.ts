import { Routes } from '@angular/router';
import { HomeComponent } from 'src/components/home/home.component';
import { ProjectsComponent } from 'src/components/projects/projects.component';
import { CasesComponent } from 'src/components/cases/cases.component';
import { NewsComponent } from 'src/components/news/news.component';
import { SettingsComponent } from 'src/components/settings/settings.component';
import { OnlineEvaluationComponent } from 'src/components/online-evaluation/online-evaluation.component';
import { LayoutComponent } from './layout.component';
import { NotFoundComponent } from 'src/components/not-found/not-found.component';
import { ArticleDetailComponent } from 'src/components/article-detail/article-detail.component';
import { ProjectDetailComponent } from 'src/components/project-detail/project-detail.component';
import { projectResolver, project_categoryResolver } from 'src/components/projects/projects.resolve.service';
import { projectDetailResolver } from 'src/components/project-detail/project-detail.resolve.service';
import { caseResolver } from 'src/components/cases/cases.resolve.service';
import { newsResolver } from 'src/components/news/news.resolve.service';
import { onlineEvaluationPageResolver } from 'src/components/online-evaluation/online-evaluation.resolve.service';
import { settingsResolver } from 'src/components/settings/settings.resolver.service';
import { articleDetailResolver } from 'src/components/article-detail/article-detail.resolve.service';

export const LayoutRoutes:Routes=[
    {
    path:'',
    component:LayoutComponent,
    children:[
        {path:'home',component:HomeComponent},
        {
          path:'projects',component:ProjectsComponent,         
          resolve:{         
             projects:projectResolver,
             projects_categories:project_categoryResolver
          }   
        },
        {
          path:'cases',component:CasesComponent,
          resolve:{cases:caseResolver}
        },
        {
          path:'news',component:NewsComponent,
          resolve:{news:newsResolver}
        },
        {
          path:'online_evaluation',component:OnlineEvaluationComponent,
          resolve:{
            oeModel:onlineEvaluationPageResolver
          }
        },
        {
          path:'settings',component:SettingsComponent,
          resolve:{
            setting:settingsResolver
          }
        },
        {
          path:'article-detail/:articleId',component:ArticleDetailComponent,
          resolve:{
            article:articleDetailResolver
          }
        },
        {
          path:'project-detail/:projectId',component:ProjectDetailComponent,
          resolve:{
            project:projectDetailResolver
          }
        }
    ]
},
{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
]