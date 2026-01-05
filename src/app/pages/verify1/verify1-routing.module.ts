import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Verify1Page } from './verify1.page';

const routes: Routes = [
  {
    path: '',
    component: Verify1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Verify1PageRoutingModule {}
