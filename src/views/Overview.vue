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
          <div class="time-filter">
            <button 
              :class="['filter-btn', { active: timeFilter === 'daily' }]"
              @click="timeFilter = 'daily'"
            >
              Daily
            </button>
            <button 
              :class="['filter-btn', { active: timeFilter === 'weekly' }]"
              @click="timeFilter = 'weekly'"
            >
              Weekly
            </button>
            <button 
              :class="['filter-btn', { active: timeFilter === 'monthly' }]"
              @click="timeFilter = 'monthly'"
            >
              Monthly
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
            <h3 class="stat-number">{{ currentStats.sales }}</h3>
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
import { computed, ref } from 'vue'
import Navbar from '../components/Navbar.vue'

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
    
    // Time filter state
    const timeFilter = ref('daily')
    
    // Mock data for different time periods
    const statsData = {
      daily: {
        customers: 20,
        transactions: 10,
        sales: 30
      },
      weekly: {
        customers: 140,
        transactions: 70,
        sales: 210
      },
      monthly: {
        customers: 600,
        transactions: 300,
        sales: 900
      }
    }
    
    // Computed properties for dynamic content
    const currentStats = computed(() => statsData[timeFilter.value])
    
    const cardTitle = computed(() => {
      const titles = {
        daily: "Today's Transactions",
        weekly: "This Week's Transactions",
        monthly: "This Month's Transactions"
      }
      return titles[timeFilter.value]
    })
    
    const timeFilterText = computed(() => {
      const texts = {
        daily: 'today',
        weekly: 'this week',
        monthly: 'this month'
      }
      return texts[timeFilter.value]
    })
    
    return {
      userName,
      timeFilter,
      currentStats,
      cardTitle,
      timeFilterText
    }
  },
  methods: {
    goToReports() {
      this.$router.push({ name: 'Reports' })
    }
  }
}
</script>

<style src="./overview.css"></style>

