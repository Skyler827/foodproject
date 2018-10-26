import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DiningRoomOneComponent } from './components/dining-room-one/dining-room-one.component';
import { DiningRoomTwoComponent } from './components/dining-room-two/dining-room-two.component';
import { TakeoutComponent } from './components/takeout/takeout.component';
import { OrderComponent } from './components/order/order.component';
import { FunctionsComponent } from './components/functions/functions.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RoadmapComponent } from './components/roadmap/roadmap.component';
import { RegisterComponent } from './components/register/register.component';
const appRoutes: Routes = [
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login',    component: LoginComponent         },
  { path: 'register', component: RegisterComponent      },
  { path: 'dining-1', component: DiningRoomOneComponent },
  { path: 'dining-2', component: DiningRoomTwoComponent },
  { path: 'order',    component: OrderComponent         },
  { path: 'functions',component: FunctionsComponent     },
  { path: 'roadmap',  component: RoadmapComponent       },  
  { path: '**',       component: PageNotFoundComponent  }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DiningRoomOneComponent,
    DiningRoomTwoComponent,
    TakeoutComponent,
    OrderComponent,
    FunctionsComponent,
    PageNotFoundComponent,
    RoadmapComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    FormsModule,
    HttpClientModule
    // other imports here
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
