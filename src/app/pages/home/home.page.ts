import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardModule } from 'primeng/card';
import { LiffService } from '../../services/liff/liff.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, CardModule, FormsModule, CommonModule],
})
export class HomePage implements OnInit {

  constructor(private liff: LiffService, private router: Router) {}


  ngOnInit() {
  }

  async logout() {
    // เรียก logout จาก LIFF
    if (this.liff.isLoggedIn()) {
      this.liff.logout();
    }
    // กลับไปหน้า login/register
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }

}
