import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasEditComponent } from './components/canvas-edit/canvas-edit.component';

const routes: Routes = [{ path: '', component: CanvasEditComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenCanvasRoutingModule {}
