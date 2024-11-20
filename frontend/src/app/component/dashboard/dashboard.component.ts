import { Component, OnInit, HostListener } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ExpenseService } from 'src/app/services/expense/expense.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private monthlySpendingChart: any;
  private expenseByTypeChart: any;
  private balanceChart: any;
  private owedChart: any;

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;
  
  years: number[] = [];
  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  // Add common chart options
  private commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          font: {
            size: 12
          }
        }
      }
    }
  };

  constructor(private expenseService: ExpenseService) {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  ngOnInit(): void {
    this.createMonthlySpendingChart();
    this.createExpenseByTypeChart();
    this.createBalanceChart();
    this.createOwedChart();
  }

  onDateSelectionChange(): void {
    if (this.balanceChart) {
      this.balanceChart.destroy();
    }
    this.createBalanceChart();
  }

  private createMonthlySpendingChart(): void {
    const ctx = document.getElementById('monthlySpendingChart') as HTMLCanvasElement;

    this.expenseService.getExpenseByMonth().subscribe(
      (response: any) => {
        
        console.log(response);

      },
      (error: any) => {
        console.error('Error fetching expenses by category:', error);
      }
    );

    // Initialize the chart with empty data first
    this.monthlySpendingChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Monthly Spending',
          data: [300, 450, 380, 520, 400, 600],
          borderColor: '#36A2EB',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.1)'
        }]
      },
      options: {
        ...this.commonOptions,
        plugins: {
          ...this.commonOptions.plugins,
          title: {
            display: true,
            text: 'Monthly Spending Trend',
            font: {
              size: 16
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount ($)'
            },
            ticks: {
              callback: (value) => '$' + value
            }
          }
        }
      }
    });
  }

  private generateRandomColors(count: number): string[] {
    const colors: string[] = [];
    const goldenRatio = 0.618033988749895; // Use golden ratio for better color distribution
    let hue = Math.random(); // Start at random color

    for (let i = 0; i < count; i++) {
      hue = (hue + goldenRatio) % 1; // Use golden ratio to spread colors evenly
      
      // Convert HSL to RGB with fixed saturation and lightness for pleasant colors
      const saturation = 0.5 + Math.random() * 0.2; // 50-70% saturation
      const lightness = 0.4 + Math.random() * 0.2;  // 40-60% lightness

      colors.push(this.hslToRgba(hue, saturation, lightness, 0.6));
    }

    return colors;
  }

  private hslToRgba(h: number, s: number, l: number, alpha: number): string {
    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
  }

  private createExpenseByTypeChart(): void {
    const ctx = document.getElementById('expenseByTypeChart') as HTMLCanvasElement;
    
    // Initialize the chart with empty data first
    this.expenseByTypeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: []
        }]
      },
      options: {
        ...this.commonOptions,
        plugins: {
          ...this.commonOptions.plugins,
          title: {
            display: true,
            text: 'Expenses by Category',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 11
              }
            }
          }
        }
      }
    });

    this.expenseService.getExpensesByCategory().subscribe(
      (response: any) => {
        // Generate random colors based on the number of categories
        const randomColors = this.generateRandomColors(response.length);
        
        // Update chart with the response data and random colors
        this.expenseByTypeChart.data.labels = response.map((item: any) => item.name);
        this.expenseByTypeChart.data.datasets[0].data = response.map((item: any) => item.spend);
        this.expenseByTypeChart.data.datasets[0].backgroundColor = randomColors;
        
        // Update the chart
        this.expenseByTypeChart.update();
      },
      (error: any) => {
        console.error('Error fetching expenses by category:', error);
      }
    );
  }

  private createBalanceChart(): void {
    const ctx = document.getElementById('balanceChart') as HTMLCanvasElement;
    
    const data = this.getBalanceData(this.selectedYear, this.selectedMonth);

    this.balanceChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['You are owed', 'You owe'],
        datasets: [{
          label: 'Balance Overview',
          data: [data.owed, data.owe],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgb(75, 192, 192)',
            'rgb(255, 99, 132)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        ...this.commonOptions,
        plugins: {
          ...this.commonOptions.plugins,
          title: {
            display: true,
            text: `Balance Overview - ${this.months[this.selectedMonth - 1].name} ${this.selectedYear}`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount ($)'
            }
          }
        }
      }
    });
  }

  private getBalanceData(year: number, month: number) {
    return {
      owed: Math.floor(Math.random() * 1000),
      owe: Math.floor(Math.random() * 500)
    };
  }

  private createOwedChart(): void {
    const ctx = document.getElementById('owedChart') as HTMLCanvasElement;
    this.owedChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['John', 'Alice', 'Bob', 'Carol'],
        datasets: [{
          label: 'Owes you',
          data: [250, 150, 300, 150],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }, {
          label: 'You owe',
          data: [100, 0, 120, 100],
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      },
      options: {
        ...this.commonOptions,
        plugins: {
          ...this.commonOptions.plugins,
          title: {
            display: true,
            text: 'Individual Balances'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount ($)'
            }
          }
        }
      }
    });
  }

  // Add window resize handler
  @HostListener('window:resize')
  onResize() {
    this.resizeCharts();
  }

  private resizeCharts() {
    if (this.monthlySpendingChart) {
      this.monthlySpendingChart.resize();
    }
    if (this.expenseByTypeChart) {
      this.expenseByTypeChart.resize();
    }
    if (this.balanceChart) {
      this.balanceChart.resize();
    }
    if (this.owedChart) {
      this.owedChart.resize();
    }
  }
}
