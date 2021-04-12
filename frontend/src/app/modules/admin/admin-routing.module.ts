import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/shared/components/login/login.component';
import { RegisterComponent } from 'src/app/shared/components/register/register.component';
import { OverviewComponent } from './components/overview/overview.component';

const routes: Routes = [
  {path: '', component: OverviewComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
