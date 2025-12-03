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
              <div class="filter-group-kpi">
                <select v-model="adminSalesPeriod" class="period-select-kpi" @change="fetchReportsData">
                  <option value="daily">Day</option>
                  <option value="monthly">Month</option>
                  <option value="yearly">Year</option>
                </select>
                <input 
                  v-if="adminSalesPeriod === 'daily'" 
                  type="date" 
                  v-model="salesDateFilter" 
                  @change="fetchReportsData"
                  class="date-picker-kpi"
                />
                <input 
                  v-else-if="adminSalesPeriod === 'monthly'" 
                  type="month" 
                  v-model="salesMonthFilter" 
                  @change="fetchReportsData"
                  class="date-picker-kpi"
                />
                <input 
                  v-else-if="adminSalesPeriod === 'yearly'" 
                  type="number" 
                  v-model="salesYearFilter" 
                  @change="fetchReportsData"
                  min="2000" 
                  max="2100"
                  class="year-picker-kpi"
                  placeholder="Year"
                />
              </div>
            </div>
            <div class="report-content-kpi">
              <div class="report-value-kpi">₱{{ formatMoney(adminKpiData[adminSalesPeriod].sales) }}</div>
              <p class="report-label-kpi">Total Revenue</p>
            </div>
          </div>

          <div class="report-card-kpi">
            <div class="report-header-kpi">
              <h3 class="report-title-kpi">Customer Report</h3>
              <div class="filter-group-kpi">
                <select v-model="adminCustomerPeriod" class="period-select-kpi" @change="fetchReportsData">
                  <option value="daily">Day</option>
                  <option value="monthly">Month</option>
                  <option value="yearly">Year</option>
                </select>
                <input 
                  v-if="adminCustomerPeriod === 'daily'" 
                  type="date" 
                  v-model="customerDateFilter" 
                  @change="fetchReportsData"
                  class="date-picker-kpi"
                />
                <input 
                  v-else-if="adminCustomerPeriod === 'monthly'" 
                  type="month" 
                  v-model="customerMonthFilter" 
                  @change="fetchReportsData"
                  class="date-picker-kpi"
                />
                <input 
                  v-else-if="adminCustomerPeriod === 'yearly'" 
                  type="number" 
                  v-model="customerYearFilter" 
                  @change="fetchReportsData"
                  min="2000" 
                  max="2100"
                  class="year-picker-kpi"
                  placeholder="Year"
                />
              </div>
            </div>
            <div class="report-content-kpi">
              <div class="report-value-kpi">{{ adminKpiData[adminCustomerPeriod].customers }}</div>
              <p class="report-label-kpi">Total Customers</p>
            </div>
          </div>

          <div class="report-card-kpi">
            <div class="report-header-kpi">
              <h3 class="report-title-kpi">Service Report</h3>
              <div class="filter-group-kpi">
                <select v-model="adminServicePeriod" class="period-select-kpi" @change="fetchReportsData">
                  <option value="daily">Day</option>
                  <option value="monthly">Month</option>
                  <option value="yearly">Year</option>
                </select>
                <input 
                  v-if="adminServicePeriod === 'daily'" 
                  type="date" 
                  v-model="serviceDateFilter" 
                  @change="fetchReportsData"
                  class="date-picker-kpi"
                />
                <input 
                  v-else-if="adminServicePeriod === 'monthly'" 
                  type="month" 
                  v-model="serviceMonthFilter" 
                  @change="fetchReportsData"
                  class="date-picker-kpi"
                />
                <input 
                  v-else-if="adminServicePeriod === 'yearly'" 
                  type="number" 
                  v-model="serviceYearFilter" 
                  @change="fetchReportsData"
                  min="2000" 
                  max="2100"
                  class="year-picker-kpi"
                  placeholder="Year"
                />
              </div>
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
              <div class="filter-group-kpi">
                <select v-model="adminPaymentPeriod" class="period-select-kpi" @change="fetchReportsData">
                  <option value="daily">Day</option>
                  <option value="monthly">Month</option>
                  <option value="yearly">Year</option>
                </select>
                <input 
                  v-if="adminPaymentPeriod === 'daily'" 
                  type="date" 
                  v-model="paymentDateFilter" 
                  @change="fetchReportsData"
                  class="date-picker-kpi"
                />
                <input 
                  v-else-if="adminPaymentPeriod === 'monthly'" 
                  type="month" 
                  v-model="paymentMonthFilter" 
                  @change="fetchReportsData"
                  class="date-picker-kpi"
                />
                <input 
                  v-else-if="adminPaymentPeriod === 'yearly'" 
                  type="number" 
                  v-model="paymentYearFilter" 
                  @change="fetchReportsData"
                  min="2000" 
                  max="2100"
                  class="year-picker-kpi"
                  placeholder="Year"
                />
              </div>
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
      
      // Date filter states
      salesDateFilter: new Date().toISOString().split('T')[0],
      salesMonthFilter: new Date().toISOString().slice(0, 7),
      salesYearFilter: new Date().getFullYear(),
      customerDateFilter: new Date().toISOString().split('T')[0],
      customerMonthFilter: new Date().toISOString().slice(0, 7),
      customerYearFilter: new Date().getFullYear(),
      serviceDateFilter: new Date().toISOString().split('T')[0],
      serviceMonthFilter: new Date().toISOString().slice(0, 7),
      serviceYearFilter: new Date().getFullYear(),
      paymentDateFilter: new Date().toISOString().split('T')[0],
      paymentMonthFilter: new Date().toISOString().slice(0, 7),
      paymentYearFilter: new Date().getFullYear(),
      
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
        const transactions = Array.isArray(transactionsResponse.data) ? transactionsResponse.data : transactionsResponse.data.data
        
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
        const transactionsResponse = await api.transactions.getAll()
        const allTransactions = Array.isArray(transactionsResponse.data) ? transactionsResponse.data : transactionsResponse.data.data
        
        // Daily - use salesDateFilter
        const dailyDate = this.salesDateFilter || new Date().toISOString().split('T')[0]
        const dailyResponse = await api.analytics.getSummary(dailyDate, dailyDate)
        this.adminKpiData.daily = {
          sales: parseFloat(dailyResponse.data.total_sales || 0).toFixed(2),
          orders: dailyResponse.data.total_orders || 0,
          customers: dailyResponse.data.total_customers || 0
        }
        
        // Daily payment status - use paymentDateFilter
        const paymentDailyDate = this.paymentDateFilter || new Date().toISOString().split('T')[0]
        const dailyTrans = allTransactions.filter(t => {
          const transDate = new Date(t.date).toISOString().split('T')[0]
          return transDate === paymentDailyDate
        })
        this.paymentStatusByPeriod.daily = {
          paid: dailyTrans.filter(t => t.status === 'paid').length,
          unpaid: dailyTrans.filter(t => t.status === 'unpaid' || t.status === 'pending').length
        }
        
        // Monthly - use salesMonthFilter (format: YYYY-MM)
        const monthFilter = this.salesMonthFilter || new Date().toISOString().slice(0, 7)
        const [year, month] = monthFilter.split('-')
        const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1).toISOString().split('T')[0]
        const endOfMonth = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0]
        const monthlyResponse = await api.analytics.getSummary(startOfMonth, endOfMonth)
        this.adminKpiData.monthly = {
          sales: parseFloat(monthlyResponse.data.total_sales || 0).toFixed(2),
          orders: monthlyResponse.data.total_orders || 0,
          customers: monthlyResponse.data.total_customers || 0
        }
        
        // Monthly payment status - use paymentMonthFilter
        const paymentMonthFilter = this.paymentMonthFilter || new Date().toISOString().slice(0, 7)
        const [payYear, payMonth] = paymentMonthFilter.split('-')
        const payStartOfMonth = new Date(parseInt(payYear), parseInt(payMonth) - 1, 1)
        const payEndOfMonth = new Date(parseInt(payYear), parseInt(payMonth), 0)
        const monthlyTrans = allTransactions.filter(t => {
          const transDate = new Date(t.date)
          return transDate >= payStartOfMonth && transDate <= payEndOfMonth
        })
        this.paymentStatusByPeriod.monthly = {
          paid: monthlyTrans.filter(t => t.status === 'paid').length,
          unpaid: monthlyTrans.filter(t => t.status === 'unpaid' || t.status === 'pending').length
        }
        
        // Yearly - use salesYearFilter
        const yearFilter = this.salesYearFilter || new Date().getFullYear()
        const startOfYear = new Date(yearFilter, 0, 1).toISOString().split('T')[0]
        const endOfYear = new Date(yearFilter, 11, 31).toISOString().split('T')[0]
        const yearlyResponse = await api.analytics.getSummary(startOfYear, endOfYear)
        this.adminKpiData.yearly = {
          sales: parseFloat(yearlyResponse.data.total_sales || 0).toFixed(2),
          orders: yearlyResponse.data.total_orders || 0,
          customers: yearlyResponse.data.total_customers || 0
        }
        
        // Yearly payment status - use paymentYearFilter
        const paymentYearFilter = this.paymentYearFilter || new Date().getFullYear()
        const payStartOfYear = new Date(paymentYearFilter, 0, 1)
        const payEndOfYear = new Date(paymentYearFilter, 11, 31, 23, 59, 59)
        const yearlyTrans = allTransactions.filter(t => {
          const transDate = new Date(t.date)
          return transDate >= payStartOfYear && transDate <= payEndOfYear
        })
        this.paymentStatusByPeriod.yearly = {
          paid: yearlyTrans.filter(t => t.status === 'paid').length,
          unpaid: yearlyTrans.filter(t => t.status === 'unpaid' || t.status === 'pending').length
        }
        
        // Staff KPI (using today's data)
        const today = new Date().toISOString().split('T')[0]
        const todayResponse = await api.analytics.getSummary(today, today)
        this.staffKpiData = {
          sales: parseFloat(todayResponse.data.total_sales || 0).toFixed(2),
          customers: todayResponse.data.total_customers || 0,
          transactions: todayResponse.data.total_orders || 0
        }
      } catch (error) {
        console.error('Error fetching period stats:', error)
      }
    }
  }
}
</script>

<style src="./reports.css"></style>