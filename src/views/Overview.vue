<template>
  <div class="overview-page">
    <!-- Sidebar Navigation -->
    <Navbar />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <h1 class="welcome-title">Welcome Back, {{ userName }}!</h1>
        <p class="welcome-subtitle">Ready to clean up today's tasks?</p>
      </div>

      <div class="dashboard-card">
        <div class="card-header">
          <div>
            <h2 class="card-title">{{ cardTitle }}</h2>
            <p class="card-subtitle">Track all Total Customers, Total Transactions, and Total Sales</p>
          </div>
          <div class="time-filter" v-if="isUserAdmin">
            <button 
              :class="['filter-btn', { active: timeFilter === 'daily' }]"
              @click="timeFilter = 'daily'"
            >
              Day
            </button>
            <button 
              :class="['filter-btn', { active: timeFilter === 'monthly' }]"
              @click="timeFilter = 'monthly'"
            >
              Month
            </button>
            <button 
              :class="['filter-btn', { active: timeFilter === 'yearly' }]"
              @click="timeFilter = 'yearly'"
            >
              Year
            </button>
          </div>
        </div>

        <div class="stats-grid">
          <!-- Total Customers -->
          <div class="stat-card">
            <div class="stat-icon customers">
              <img src="/images/total-customers-served.png" alt="Customers" class="stat-icon-img" />
            </div>
            <h3 class="stat-number">{{ currentStats.customers }}</h3>
            <p class="stat-label">Total Customers Served</p>
            <p class="stat-description">Shows number of unique customers served {{ timeFilterText }}</p>
            <button class="details-btn" @click="goToReports">See Details</button>
          </div>

          <!-- Total Transactions -->
          <div class="stat-card">
            <div class="stat-icon transactions">
              <img src="/images/total-transactions.png" alt="Transactions" class="stat-icon-img" />
            </div>
            <h3 class="stat-number">{{ currentStats.transactions }}</h3>
            <p class="stat-label">Total Transactions</p>
            <p class="stat-description">Shows total number of transactions {{ timeFilterText }}</p>
            <button class="details-btn" @click="goToReports">See Details</button>
          </div>

          <!-- Total Sales -->
          <div class="stat-card">
            <div class="stat-icon sales">
              <img src="/images/total-sales.png" alt="Sales" class="stat-icon-img" />
            </div>
            <h3 class="stat-number">₱{{ formatMoney(currentStats.sales) }}</h3>
            <p class="stat-label">Total Sales</p>
            <p class="stat-description">Shows total revenue {{ timeFilterText }}</p>
            <button class="details-btn" @click="goToReports">See Details</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { computed, ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'Overview',
  components: {
    Navbar
  },
  setup() {
    const authStore = useAuthStore()
    
    // Get username and capitalize first letter
    const userName = computed(() => {
      const username = authStore.user || 'Staff'
      // Extract name before @ if it's an email, or use the whole username
      const name = username.includes('@') ? username.split('@')[0] : username
      // Capitalize first letter
      return name.charAt(0).toUpperCase() + name.slice(1)
    })
    
    // Check if user is admin
    const isUserAdmin = computed(() => authStore.isAdmin)
    
    // Time filter state - staff always on 'daily', admin can change
    const timeFilter = ref('daily')
    
    // Dynamic data from backend
    const statsData = ref({
      daily: { customers: 0, transactions: 0, sales: 0 },
      monthly: { customers: 0, transactions: 0, sales: 0 },
      yearly: { customers: 0, transactions: 0, sales: 0 }
    })
    
    // Fetch stats from backend
    const fetchStats = async () => {
      try {
        const now = new Date()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0]
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString().split('T')[0]
        
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        
        const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
        const endOfYear = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]
        
        // Fetch daily stats
        const dailyResponse = await api.analytics.getSummary(startOfDay, endOfDay)
        statsData.value.daily = {
          customers: dailyResponse.data.total_customers || 0,
          transactions: dailyResponse.data.total_orders || 0,
          sales: parseFloat(dailyResponse.data.total_sales || 0).toFixed(2)
        }
        
        // Fetch monthly stats
        const monthlyResponse = await api.analytics.getSummary(startOfMonth, endOfMonth)
        statsData.value.monthly = {
          customers: monthlyResponse.data.total_customers || 0,
          transactions: monthlyResponse.data.total_orders || 0,
          sales: parseFloat(monthlyResponse.data.total_sales || 0).toFixed(2)
        }
        
        // Fetch yearly stats
        const yearlyResponse = await api.analytics.getSummary(startOfYear, endOfYear)
        statsData.value.yearly = {
          customers: yearlyResponse.data.total_customers || 0,
          transactions: yearlyResponse.data.total_orders || 0,
          sales: parseFloat(yearlyResponse.data.total_sales || 0).toFixed(2)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    
    onMounted(() => {
      fetchStats()
    })
    
    // Computed properties for dynamic content
    const currentStats = computed(() => statsData.value[timeFilter.value])
    
    const cardTitle = computed(() => {
      const titles = {
        daily: "Today's Transactions",
        monthly: "This Month's Transactions",
        yearly: "This Year's Transactions"
      }
      return titles[timeFilter.value]
    })
    
    const timeFilterText = computed(() => {
      const texts = {
        daily: 'today',
        monthly: 'this month',
        yearly: 'this year'
      }
      return texts[timeFilter.value]
    })
    
    return {
      userName,
      isUserAdmin,
      timeFilter,
      currentStats,
      cardTitle,
      timeFilterText
    }
  },
  methods: {
    formatMoney(amount) {
      const num = parseFloat(amount) || 0
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    goToReports() {
      this.$router.push({ name: 'Reports' })
    }
  }
}
</script>

<style src="./overview.css"></style>

