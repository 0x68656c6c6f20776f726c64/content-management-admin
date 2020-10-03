import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutRoutes } from './layout.routing';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from 'src/components/home/home.component';
import { ProjectsComponent } from 'src/components/projects/projects.component';
import { CasesComponent } from 'src/components/cases/cases.component';
import { NewsComponent } from 'src/components/news/news.component';
import { OnlineEvaluationComponent } from 'src/components/online-evaluation/online-evaluation.component';
import { SettingsComponent } from 'src/components/settings/settings.component';
import { ImageUploadComponent } from 'src/components/shared/image-upload/image-upload.component';
import { ArticleDetailComponent } from 'src/components/article-detail/article-detail.component';
import { CKEditorModule } from './../../components/ckeditor/ckeditor.module';
import { ProjectDetailComponent } from 'src/components/project-detail/project-detail.component';
import { ToastsContainer } from 'src/components/toast/toast.component';
import { QuestionControlService } from 'src/services/question/question-control.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LayoutRoutes),
    FormsModule,
    NgbModule,
    CKEditorModule,
    ReactiveFormsModule
  ],
  declarations: [
      HomeComponent,
      ProjectsComponent,
      CasesComponent,
      NewsComponent,
      OnlineEvaluationComponent,
      SettingsComponent,
      ImageUploadComponent,
      ArticleDetailComponent,
      ProjectDetailComponent,
      ToastsContainer
  ],
  providers: [QuestionControlService]
})

export class AdminLayoutModule {}
