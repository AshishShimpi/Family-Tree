import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HomepageComponent } from './homepage/homepage.component';
import { TreeComponent } from './tree/tree.component';

const routes: Routes = [
    {
        path: '',
        component: HomepageComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
