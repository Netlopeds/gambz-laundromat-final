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
              <div class="report-value-kpi">₱{{ formatMoney(adminKpiData[adminSalesPeriod].sales) }}</div>
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
              <select v-model="adminPaymentPeriod" class="period-select-kpi">
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div class="staff-pie-chart-container">
              <Pie :data="currentPaymentStatusData" :options="staffChartOptions" />
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
              <div class="report-value-kpi">₱{{ formatMoney(staffKpiData.sales) }}</div>
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
import api from '@/services/api'

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
      // --- DATA FOR ADMIN VIEW ---
      adminSalesPeriod: 'monthly',
      adminCustomerPeriod: 'monthly',
      adminServicePeriod: 'monthly',
      adminPaymentPeriod: 'monthly',
      adminKpiData: {
        daily: { sales: '0.00', orders: 0, customers: 0 },
        monthly: { sales: '0.00', orders: 0, customers: 0 },
        yearly: { sales: '0.00', orders: 0, customers: 0 },
        unpaidTotal: 0
      },
      
      // --- DATA FOR STAFF VIEW ---
      staffKpiData: {
        sales: '0', 
        customers: 0, 
        transactions: 0
      },
      
      // --- SHARED DATA ---
      popularServices: [],
      unpaidCustomers: [],
      paymentStatusByPeriod: {
        daily: { paid: 0, unpaid: 0 },
        monthly: { paid: 0, unpaid: 0 },
        yearly: { paid: 0, unpaid: 0 }
      },
      paymentStatusData: {
        labels: ['Paid', 'Unpaid'],
        datasets: [
          {
            backgroundColor: ['#40E0D0', '#FF6384'],
            data: [0, 0] 
          }
        ]
      },
      staffChartOptions: {
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
  async mounted() {
    await this.fetchReportsData()
  },
  computed: {
    isUserAdmin() {
      const authStore = useAuthStore();
      return authStore.isAdmin; 
    },
    currentPaymentStatusData() {
      if (this.isUserAdmin) {
        const periodData = this.paymentStatusByPeriod[this.adminPaymentPeriod];
        return {
          labels: ['Paid', 'Unpaid'],
          datasets: [
            {
              backgroundColor: ['#40E0D0', '#FF6384'],
              data: [periodData.paid, periodData.unpaid]
            }
          ]
        };
      } else {
        return this.paymentStatusData;
      }
    }
  },
  methods: {
    formatMoney(amount) {
      const num = parseFloat(amount) || 0
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    async fetchReportsData() {
      try {
        const transactionsResponse = await api.transactions.getAll()
        const transactions = transactionsResponse.data
        
        console.log('Total transactions:', transactions.length)
        
        // Filter unpaid customers (handle both 'unpaid' and 'pending' statuses)
        this.unpaidCustomers = transactions
          .filter(t => t.status === 'unpaid' || t.status === 'pending')
          .map(t => ({
            id: `TN${String(t.transaction_id).padStart(4, '0')}`,
            customer: t.customer_name || t.name
          }))
        
        console.log('Unpaid customers:', this.unpaidCustomers.length)
        
        this.adminKpiData.unpaidTotal = this.unpaidCustomers.length
        
        // Count paid vs unpaid (handle both 'unpaid' and 'pending' as unpaid)
        const paidCount = transactions.filter(t => t.status === 'paid').length
        const unpaidCount = transactions.filter(t => t.status === 'unpaid' || t.status === 'pending').length
        
        console.log('Paid:', paidCount, 'Unpaid:', unpaidCount)
        
        // Update pie chart data by creating a new object to trigger reactivity
        this.paymentStatusData = {
          labels: ['Paid', 'Unpaid'],
          datasets: [
            {
              backgroundColor: ['#40E0D0', '#FF6384'],
              data: [paidCount, unpaidCount]
            }
          ]
        }
        
        const serviceCounts = {}
        transactions.forEach(t => {
          // Handle new schema with services array
          if (t.services && t.services.length > 0) {
            t.services.forEach(service => {
              const serviceName = service.name || 'Unknown'
              serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1
            })
          } else {
            // Fallback for old data structure
            const service = t.service_name || t.service_type || 'Unknown'
            serviceCounts[service] = (serviceCounts[service] || 0) + 1
          }
        })
        
        const maxCount = Math.max(...Object.values(serviceCounts), 1)
        this.popularServices = Object.entries(serviceCounts)
          .map(([name, count]) => ({
            name,
            count,
            percentage: (count / maxCount) * 100
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
        
        await this.fetchPeriodStats()
      } catch (error) {
        console.error('Error fetching reports data:', error)
      }
    },
    async fetchPeriodStats() {
      try {
        const now = new Date()
        const transactionsResponse = await api.transactions.getAll()
        const allTransactions = transactionsResponse.data
        
        // Daily
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0]
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString().split('T')[0]
        const dailyResponse = await api.analytics.getSummary(startOfDay, endOfDay)
        this.adminKpiData.daily = {
          sales: parseFloat(dailyResponse.data.total_sales || 0).toFixed(2),
          orders: dailyResponse.data.total_orders || 0,
          customers: dailyResponse.data.total_customers || 0
        }
        
        // Daily payment status
        const dailyTrans = allTransactions.filter(t => {
          const transDate = new Date(t.date).toISOString().split('T')[0]
          return transDate === startOfDay
        })
        this.paymentStatusByPeriod.daily = {
          paid: dailyTrans.filter(t => t.status === 'paid').length,
          unpaid: dailyTrans.filter(t => t.status === 'unpaid' || t.status === 'pending').length
        }
        
        // Monthly
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        const monthlyResponse = await api.analytics.getSummary(startOfMonth, endOfMonth)
        this.adminKpiData.monthly = {
          sales: parseFloat(monthlyResponse.data.total_sales || 0).toFixed(2),
          orders: monthlyResponse.data.total_orders || 0,
          customers: monthlyResponse.data.total_customers || 0
        }
        
        // Monthly payment status
        const monthlyTrans = allTransactions.filter(t => {
          const transDate = new Date(t.date)
          const start = new Date(startOfMonth)
          const end = new Date(endOfMonth)
          return transDate >= start && transDate <= end
        })
        this.paymentStatusByPeriod.monthly = {
          paid: monthlyTrans.filter(t => t.status === 'paid').length,
          unpaid: monthlyTrans.filter(t => t.status === 'unpaid' || t.status === 'pending').length
        }
        
        // Yearly
        const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
        const endOfYear = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]
        const yearlyResponse = await api.analytics.getSummary(startOfYear, endOfYear)
        this.adminKpiData.yearly = {
          sales: parseFloat(yearlyResponse.data.total_sales || 0).toFixed(2),
          orders: yearlyResponse.data.total_orders || 0,
          customers: yearlyResponse.data.total_customers || 0
        }
        
        // Yearly payment status
        const yearlyTrans = allTransactions.filter(t => {
          const transDate = new Date(t.date)
          const start = new Date(startOfYear)
          const end = new Date(endOfYear)
          return transDate >= start && transDate <= end
        })
        this.paymentStatusByPeriod.yearly = {
          paid: yearlyTrans.filter(t => t.status === 'paid').length,
          unpaid: yearlyTrans.filter(t => t.status === 'unpaid' || t.status === 'pending').length
        }
        
        // Staff KPI (using today's data)
        this.staffKpiData = {
          sales: this.adminKpiData.daily.sales,
          customers: this.adminKpiData.daily.customers,
          transactions: this.adminKpiData.daily.orders
        }
      } catch (error) {
        console.error('Error fetching period stats:', error)
      }
    }
  }
}
</script>

<style src="./reports.css"></style>