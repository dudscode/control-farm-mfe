import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-card',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss',
})
export class DashboardCardComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) cardMetric!: number;
  @Input({ required: true }) efficiencyPercentage!: number;
  @Input({ required: true }) label!: string;
  @Input() isCurrency: boolean = false;
  @Input() isPositive?: boolean = true;
  
  trendIcon(): string {
    return this.isPositive ? 'trending_up' : 'trending_down';
  }  
}
