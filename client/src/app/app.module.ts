import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from '../components/login/login.component';
import { TakeoutComponent } from '../components/takeout/takeout.component';
import { OrderComponent } from '../components/order/order.component';
import { FunctionsComponent } from '../components/functions/functions.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { RoadmapComponent } from '../components/roadmap/roadmap.component';
import { RegisterComponent } from '../components/register/register.component';
import { LoggedOutComponent } from '../components/logged-out/logged-out.component';
import { MenuComponent } from '../components/menu/menu.component';
import { DiningRoomComponent } from '../components/dining-room/dining-room.component';
import { DrListComponent } from '../components/dr-list/dr-list.component';
const appRoutes: Routes = [
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  { path: 'login',        component: LoginComponent        },
  { path: 'logout',       component: LoggedOutComponent    },
  { path: 'register',     component: RegisterComponent     },
  { path: 'dining',       component: DrListComponent       },
  { path: 'dining/:name', component: DiningRoomComponent   },
  { path: 'tables/:n',    component: OrderComponent        },
  { path: 'functions',    component: FunctionsComponent    },
  { path: 'roadmap',      component: RoadmapComponent      },  
  { path: '**',           component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TakeoutComponent,
    OrderComponent,
    FunctionsComponent,
    PageNotFoundComponent,
    RoadmapComponent,
    RegisterComponent,
    LoggedOutComponent,
    MenuComponent,
    DiningRoomComponent,
    DrListComponent
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
