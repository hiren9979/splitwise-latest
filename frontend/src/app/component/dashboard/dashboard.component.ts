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
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10
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
    // Destroy and recreate balance chart
    if (this.balanceChart) {
      this.balanceChart.destroy();
    }
    this.createBalanceChart();

    // Create date object for API request
    const date = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    
    // Format date as timestamp
    const requestData = {
      date: date.getTime()  // This will give timestamp in milliseconds
    };

    // Call API to get updated data
    this.expenseService.getBalanceOverview(requestData).subscribe(
      (response: any) => {
        if (this.balanceChart) {
          this.balanceChart.data.datasets[0].data = [response.owed, response.owe];
          this.balanceChart.options.plugins.title.text = `Balance Overview - ${this.months[this.selectedMonth - 1].name} ${this.selectedYear}`;
          this.balanceChart.update();
        }
      },
      (error: any) => {
        console.error('Error fetching balance overview:', error);
      }
    );
  }

  private createMonthlySpendingChart(): void {
    const ctx = document.getElementById('monthlySpendingChart') as HTMLCanvasElement;

    this.monthlySpendingChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Monthly Spending',
          data: [],
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
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 10
            }
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              padding: 15,
              font: {
                size: 13
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 13
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              label: function(context: any) {
                return `Amount: ₹${context.raw.toLocaleString('en-IN')}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount (₹)',
              font: {
                size: 14
              },
              padding: 10
            },
            ticks: {
              font: {
                size: 12
              },
              callback: (value) => {
                return '₹' + value.toLocaleString('en-IN');
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              }
            }
          }
        }
      }
    });

    this.expenseService.getExpenseByMonth().subscribe(
      (response: any) => {
        this.monthlySpendingChart.data.labels = response.map((item: any) => item.monthYear);
        this.monthlySpendingChart.data.datasets[0].data = response.map((item: any) => item.spending);
        this.monthlySpendingChart.update();
      },
      (error: any) => {
        console.error('Error fetching monthly expenses:', error);
      }
    );
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
        labels: ['No Expenses'],  // Default label when no data
        datasets: [{
          data: [0],  // Default value when no data
          backgroundColor: ['rgba(200, 200, 200, 0.6)'],  // Gray color for no data
          borderColor: ['rgb(200, 200, 200)']
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
        if (!response || response.length === 0) {
          return;
        }

        // Generate random colors based on the number of categories
        const randomColors = this.generateRandomColors(response.length);

        
        
        // Update chart with the response data and random colors
        this.expenseByTypeChart.data.labels = response.map((item: any) => item.name);
        this.expenseByTypeChart.data.datasets[0].data = response.map((item: any) => item.spend || 0); // Use 0 if spend is null/undefined
        this.expenseByTypeChart.data.datasets[0].backgroundColor = randomColors;
        this.expenseByTypeChart.data.datasets[0].borderColor = randomColors.map(color => 
          color.replace('0.6)', '1)')  // Make border colors solid
        );
        
        // Update the chart
        this.expenseByTypeChart.update();
      },
      (error: any) => {
        console.error('Error fetching expenses by category:', error);
        // Keep the default "No Expenses" display on error
      }
    );
  }

  private createBalanceChart(): void {
    const ctx = document.getElementById('balanceChart') as HTMLCanvasElement;
    
    this.balanceChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['You are owed', 'You owe'],
        datasets: [{
          label: 'Balance Overview',
          data: [0, 0],  // Initialize with zeros
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
              text: 'Amount (₹)'
            },
            ticks: {
              callback: (value) => {
                return '₹' + Math.abs(Number(value)).toLocaleString('en-IN');
              }
            }
          }
        }
      }
    });

    // Create date object for API request
    const requestData = {
      year: this.selectedYear,
      month: this.selectedMonth.toString().padStart(2, '0')  // Ensure month is 2 digits (01-12)
    };

    console.log(requestData);
    

    this.expenseService.getBalanceOverview(requestData).subscribe(
      (response: any) => {
        this.balanceChart.data.datasets[0].data = [response.owed, response.owe];
        this.balanceChart.update();
      },
      (error: any) => {
        console.error('Error fetching balance overview:', error);
      }
    );
  }

  private createOwedChart(): void {
    const ctx = document.getElementById('owedChart') as HTMLCanvasElement;

    this.owedChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Net Balance',
          data: [],
          backgroundColor: [],  // This will be set dynamically
          borderColor: [],     // This will be set dynamically
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
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return value >= 0 
                  ? `They owe you: ₹${Math.abs(value)}`
                  : `You owe: ₹${Math.abs(value)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount (₹)'
            }
          }
        }
      }
    });

    this.expenseService.getIndividualBalance().subscribe(
      (response: any) => {
        console.log(response);
        this.owedChart.data.labels = response.map((item: any) => item.userName);
        this.owedChart.data.datasets[0].data = response.map((item: any) => item.netBalance);
        
        // Dynamically set colors based on netBalance values
        this.owedChart.data.datasets[0].backgroundColor = response.map((item: any) => 
          item.netBalance >= 0 
            ? 'rgba(75, 192, 192, 0.6)'   // Blue for positive
            : 'rgba(255, 99, 132, 0.6)'   // Red for negative
        );
        
        this.owedChart.data.datasets[0].borderColor = response.map((item: any) => 
          item.netBalance >= 0 
            ? 'rgb(75, 192, 192)'   // Blue border for positive
            : 'rgb(255, 99, 132)'   // Red border for negative
        );
        
        this.owedChart.update();
      },
      (error: any) => {
        console.error('Error fetching individual balances:', error);
      }
    );
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
