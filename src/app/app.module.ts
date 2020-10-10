import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from 'src/components/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from 'src/components/home/home.component';
import { JwtInterceptor, ErrorInterceptor } from './jwt.interceptor';
import { LayoutComponent } from './layout/layout.component';
import { SidebarModule } from 'src/components/shared/sidebar/sidebar.component';
import { NavbarComponent, NavbarModule } from 'src/components/shared/navbar/navbar.component';
import { FooterModule } from 'src/components/shared/footer/footer.module';
import { RouterModule } from '@angular/router';
import { routes } from './app-routing.module';
import { ImageUploadComponent } from 'src/components/shared/image-upload/image-upload.component';
import { ProjectsService } from 'src/services/projects.service';
import { projectResolver, project_categoryResolver } from 'src/components/projects/projects.resolve.service';
import { ConfirmService, ConfirmState, RemoveConfirmModalComponent, ConfirmTemplateDirective } from 'src/components/modals/remove-confirm-modal/remove-confirm-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormQuestionComponent } from 'src/components/dynamic-form/dynamic-form-question.component';
import { CreateService, CreateState, CreateTemplateDirective, FormCreateModalComponent } from 'src/components/modals/form-modal/form-modal.component';
import { QuestionService } from 'src/services/question/question.service';
import { UniqueValidatorDirective } from 'src/components/shared/helpers/unique-cat-key-check.directive';
import { projectDetailResolver } from 'src/components/project-detail/project-detail.resolve.service';
import { caseResolver } from 'src/components/cases/cases.resolve.service';
import { newsResolver } from 'src/components/news/news.resolve.service';
import { onlineEvaluationPageResolver } from 'src/components/online-evaluation/online-evaluation.resolve.service';
import { ContentModalComponent, ContentService, ContentState, ContentTemplateDirective } from 'src/components/modals/content-modal/content-modal.component';
import { settingsResolver } from 'src/components/settings/settings.resolver.service';
import { ImageViewComponent, ImageViewService, ImageViewState, ImageViewTemplateDirective } from 'src/components/modals/image-view/image-view.component';
import { articleDetailResolver } from 'src/components/article-detail/article-detail.resolve.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    RemoveConfirmModalComponent,ConfirmTemplateDirective,
    FormCreateModalComponent,CreateTemplateDirective,
    ContentModalComponent,ContentTemplateDirective,
    ImageViewComponent,ImageViewTemplateDirective,
    DynamicFormQuestionComponent,
    UniqueValidatorDirective,
  ],
  imports: [
    RouterModule.forRoot(routes,{
      useHash: true
    }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SidebarModule,
    NavbarModule,
    FooterModule
  ],
  providers: [   
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    projectResolver,
    project_categoryResolver,
    ConfirmService,ConfirmState,
    CreateService,CreateState,
    ContentService,ContentState,
    ImageViewService,ImageViewState,
    QuestionService,
    projectDetailResolver,
    caseResolver,
    newsResolver,
    onlineEvaluationPageResolver,
    articleDetailResolver,
    settingsResolver
],
  bootstrap: [AppComponent]
})
export class AppModule { }
