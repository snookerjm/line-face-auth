import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AccessGuard } from './guards/access-guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AccessGuard],
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./pages/verify/verify.module').then(m => m.VerifyPageModule)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
