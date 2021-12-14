import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PenCanvasRoutingModule } from './pen-canvas-routing.module';
import { CanvasEditComponent } from './components/canvas-edit/canvas-edit.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { HeaderNavComponent } from './components/header-nav/header-nav.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CanvasEditComponent, HeaderNavComponent],
  imports: [
    CommonModule,
    FormsModule,
    PenCanvasRoutingModule,
    ColorPickerModule,
  ],
})
export class PenCanvasModule {}
