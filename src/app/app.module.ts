import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { SidenavComponent } from './_components';
import { MatIconModule } from '@angular/material/icon';
import { TopnavComponent } from './_components/topnav/topnav.component';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NativeDateAdapter } from '@angular/material/core';
import { FileService } from './_services/file.service';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        MatIconModule,
    ],
    declarations: [
        AppComponent,
        SidenavComponent,
        TopnavComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        BsDatepickerConfig,
        NativeDateAdapter,
        FileService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };