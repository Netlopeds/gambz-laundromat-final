<template>
  <div class="reports-page">
    <Navbar />

    <main class="main-content">

      <div v-if="isUserAdmin" class="admin-reports">
        <div class="content-header">
          <h1 class="page-title">Reports</h1>
          <p class="page-subtitle">View detailed analytics and reports</p>
        </div>

        <div class="reports-grid-kpi admin-kpi-grid-4">
          <div class="report-card-kpi">
            <div class="report-header-kpi">
              <h3 class="report-title-kpi">Sales Report</h3>
              <select v-model="adminSalesPeriod" class="period-select-kpi">
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div class="report-content-kpi">
              <div class="report-value-kpi">₱{{ adminKpiData[adminSalesPeriod].sales }}</div>
              <p class="report-label-kpi">Total Revenue</p>
            </div>
          </div>

          <div class="report-card-kpi">
            <div class="report-header-kpi">
              <h3 class="report-title-kpi">Customer Report</h3>
              <select v-model="adminCustomerPeriod" class="period-select-kpi">
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div class="report-content-kpi">
              <div class="report-value-kpi">{{ adminKpiData[adminCustomerPeriod].customers }}</div>
              <p class="report-label-kpi">Total Customers</p>
            </div>
          </div>

          <div class="report-card-kpi">
            <div class="report-header-kpi">
              <h3 class="report-title-kpi">Service Report</h3>
              <select v-model="adminServicePeriod" class="period-select-kpi">
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div class="report-content-kpi">
              <div class="report-value-kpi">{{ adminKpiData[adminServicePeriod].orders }}</div>
              <p class="report-label-kpi">Services Completed</p>
            </div>
          </div>

          <div class="report-card-kpi">
            <div class="report-header-kpi">
              <h3 class="report-title-kpi">Unpaid Customers Total</h3>
            </div>
            <div class="report-content-kpi">
              <div class="report-value-kpi">{{ adminKpiData.unpaidTotal }}</div>
              <p class="report-label-kpi">Total Unpaid</p>
            </div>
          </div>
        </div>

        <div class="staff-charts-grid">
          
          <div class="report-card-staff full-width">
            <div class="report-header-staff">
              <h3 class="report-title-staff">Popular Services</h3>
            </div>
            <div class="services-list-staff">
              <div v-for="service in popularServices" :key="service.name" class="service-item-staff">
                <span class="service-name-staff">{{ service.name }}</span>
                <div class="service-bar-container-staff">
                  <div class="service-bar-staff" :style="{ width: service.percentage + '%' }"></div>
                </div>
                <span class="service-count-staff">{{ service.count }}</span>
              </div>
            </div>
          </div>

          <div class="report-card-staff">
            <div class="report-header-staff">
              <h3 class="report-title-staff">Payment Status</h3>
            </div>
            <div class="staff-pie-chart-container">
              <Pie :data="paymentStatusData" :options="staffChartOptions" />
            </div>
          </div>

          <div class="report-card-staff">
            <div class="report-header-staff">
              <h3 class="report-title-staff">Unpaid Customers</h3>
            </div>
            <div class="table-container-staff">
              <table class="unpaid-table-staff">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Transaction #</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="customer in unpaidCustomers" :key="customer.id">
                    <td>{{ customer.customer }}</td>
                    <td>{{ customer.id }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="export-section-staff">
          <button class="export-btn-staff">
            <span>📊</span> Export Report
          </button>
        </div>

      </div>

      <div v-else class="staff-reports">
        
        <div class="content-header-staff">
          <h1 class="page-title-staff">Reports</h1>
          <p class="page-subtitle-staff">View detailed analytics and reports</p>
        </div>

        <div class="reports-grid-kpi">
          <div class="report-card-kpi">
            <div class="report-header-kpi">
              <h3 class="report-title-kpi">Today's Sales Report</h3>
            </div>
            <div class="report-content-kpi">
              <div class="report-value-kpi">₱{{ staffKpiData.sales }}</div>
              <p class="report-label-kpi">Total Revenue</p>
            </div>
          </div>

          <div class="report-card-kpi">
            <div class="report-header-kpi">
              <h3 class="report-title-kpi">Today's Total Customers</h3>
            </div>
            <div class="report-content-kpi">
              <div class="report-value-kpi">{{ staffKpiData.customers }}</div>
              <p class="report-label-kpi">Total Customers</p>
            </div>
          </div>

          <div class="report-card-kpi">
            <div class="report-header-kpi">
              <h3 class="report-title-kpi">Today's Service Report</h3>
            </div>
            <div class="report-content-kpi">
              <div class="report-value-kpi">{{ staffKpiData.transactions }}</div>
              <p class="report-label-kpi">Services Completed</p>
            </div>
          </div>
        </div>


        <div class="staff-charts-grid">
          
          <div class="report-card-staff">
            <div class="report-header-staff">
              <h3 class="report-title-staff">Unpaid Customers</h3>
            </div>
            <div class="table-container-staff">
              <table class="unpaid-table-staff">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Transaction #</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="customer in unpaidCustomers" :key="customer.id">
                    <td>{{ customer.customer }}</td>
                    <td>{{ customer.id }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="report-card-staff">
            <div class="report-header-staff">
              <h3 class="report-title-staff">Payment Status</h3>
            </div>
            <div class="staff-pie-chart-container">
              <Pie :data="paymentStatusData" :options="staffChartOptions" />
            </div>
          </div>

        </div>

        <div class="export-section-staff">
          <button class="export-btn-staff">
            <span>📊</span> Export Report
          </button>
        </div>

      </div>

    </main>
  </div>
</template>

<script>
// Import stores
import { useAuthStore } from '../stores/auth.js'

// Import charts
import { Bar, Doughnut, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement
} from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

// Import components
import Navbar from '../components/Navbar.vue'

export default {
  name: 'Reports',
  components: {
    Navbar,
    Bar,
    Doughnut,
    Pie
  },
  data() {
    return {
      // --- DATA FOR ADMIN VIEW (*** UPDATED ***) ---
      adminSalesPeriod: 'monthly',
      adminCustomerPeriod: 'monthly',
      adminServicePeriod: 'monthly',
      adminKpiData: {
        daily: { sales: '550.00', orders: 8, customers: 5 },
        monthly: { sales: '12,500.00', orders: 100, customers: 100 },
        yearly: { sales: '150,000.00', orders: 1200, customers: 1200 },
        unpaidTotal: 4 // Static total for the new card
      },
      
      // --- DATA FOR STAFF VIEW ---
      staffKpiData: {
        sales: '1,250', 
        customers: 25, 
        transactions: 30 
      },
      
      // --- SHARED DATA (Used by Admin and Staff) ---
      popularServices: [
        { name: 'Wash & Dry', count: 150, percentage: 100 },
        { name: 'Full Service', count: 120, percentage: 80 },
        { name: 'Wash Only', count: 90, percentage: 60 },
        { name: 'Iron Only', count: 60, percentage: 40 },
        { name: 'Dry Only', count: 30, percentage: 20 }
      ],
      unpaidCustomers: [
        { id: 'TN2', customer: 'Jane Smith' },
        { id: 'TN6', customer: 'Rodel' },
        { id: 'TN7', customer: 'Karen' },
        { id: 'TN9', customer: 'Koykoy' },
      ],
      paymentStatusData: {
        labels: ['Paid', 'Unpaid'],
        datasets: [
          {
            backgroundColor: ['#40E0D0', '#FF6384'],
            data: [6, 4] 
          }
        ]
      },
      staffChartOptions: { // Used by both Admin and Staff pie charts
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw;
                const data = context.dataset.data;
                const total = data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(0) + '%';
                return `${label}: ${value} (${percentage})`;
              }
            }
          }
        }
      }
    }
  },
  computed: {
    isUserAdmin() {
      const authStore = useAuthStore();
      return authStore.isAdmin; 
    }
  }
}
</script>

<style src="./reports.css"></style>