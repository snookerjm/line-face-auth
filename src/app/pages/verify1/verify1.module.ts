import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Verify1PageRoutingModule } from './verify1-routing.module';

import { Verify1Page } from './verify1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Verify1PageRoutingModule,
    Verify1Page
  ],
})
export class Verify1PageModule {}
