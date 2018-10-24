import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DiningRoomOneComponent } from './components/dining-room-one/dining-room-one.component';
import { DiningRoomTwoComponent } from './components/dining-room-two/dining-room-two.component';
import { TakeoutComponent } from './components/takeout/takeout.component';
import { OrderComponent } from './components/order/order.component';
import { FunctionsComponent } from './components/functions/functions.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RoadmapComponent } from './components/roadmap/roadmap.component';

const appRoutes: Routes = [
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login',    component: LoginComponent         },
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
    RoadmapComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
    // other imports here
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
