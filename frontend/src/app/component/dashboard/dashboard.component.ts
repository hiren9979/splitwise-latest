import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private spendingChart: any;
  private historyChart: any;

  constructor() {}

  ngOnInit(): void {
    this.createSpendingChart();
    this.createHistoryChart();
  }

  private createSpendingChart(): void {
    this.spendingChart = new Chart('spendingChart', {
      type: 'bar',
      data: {
        labels: ['Last Month', 'Last Week', 'Last Year'],
        datasets: [
          {
            label: 'Total Spending ($)',
            data: [500, 300, 2000], // Dummy data
            backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0'],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  private createHistoryChart(): void {
    this.historyChart = new Chart('historyChart', {
      type: 'line',
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
        ],
        datasets: [
          {
            label: 'Monthly Expenses ($)',
            data: [1200, 1500, 1800, 1000, 2000, 2500, 3000], // Dummy data
            borderColor: '#ffcc00',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
