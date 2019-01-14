import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from '../login/login.component';
import { DiningRoomOneComponent } from '../dining-room-one/dining-room-one.component';
import { DiningRoomTwoComponent } from '../dining-room-two/dining-room-two.component';
import { TakeoutComponent } from '../takeout/takeout.component';
import { OrderComponent } from '../order/order.component';
import { FunctionsComponent } from '../functions/functions.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { RoadmapComponent } from '../roadmap/roadmap.component';
import { RegisterComponent } from '../register/register.component';
import { LoggedOutComponent } from '../logged-out/logged-out.component';
import { MenuComponent } from '../menu/menu.component';
const appRoutes: Routes = [
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login',    component: LoginComponent         },
  { path: 'logout',   component: LoggedOutComponent     },
  { path: 'register', component: RegisterComponent      },
  { path: 'dining-1', component: DiningRoomOneComponent },
  { path: 'dining-2', component: DiningRoomTwoComponent },
  { path: 'tables/:n',component: OrderComponent         },
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
    RegisterComponent,
    LoggedOutComponent,
    MenuComponent
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
