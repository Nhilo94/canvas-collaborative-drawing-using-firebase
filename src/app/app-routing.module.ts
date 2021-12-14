import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './p-core/services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth0', pathMatch: 'full' },
  {
    path: 'auth0',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'p-canvas',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pen-canvas/pen-canvas.module').then((m) => m.PenCanvasModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
