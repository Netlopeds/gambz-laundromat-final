<template>
  <div class="reports-page">
    <!-- Sidebar Navigation -->
    <Navbar />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <h1 class="page-title">Reports</h1>
        <p class="page-subtitle">View detailed analytics and reports</p>
      </div>

      <div class="reports-grid">
        <!-- Revenue Report Card -->
        <div class="report-card">
          <div class="report-header">
            <h3 class="report-title">Revenue Report</h3>
            <select v-model="revenuePeriod" class="period-select">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div class="report-content">
            <div class="report-value">₱{{ revenueData[revenuePeriod] }}</div>
            <p class="report-label">Total Revenue</p>
          </div>
        </div>

        <!-- Customer Report Card -->
        <div class="report-card">
          <div class="report-header">
            <h3 class="report-title">Customer Report</h3>
            <select v-model="customerPeriod" class="period-select">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div class="report-content">
            <div class="report-value">{{ customerData[customerPeriod] }}</div>
            <p class="report-label">Total Customers</p>
          </div>
        </div>

        <!-- Service Report Card -->
        <div class="report-card">
          <div class="report-header">
            <h3 class="report-title">Service Report</h3>
            <select v-model="servicePeriod" class="period-select">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div class="report-content">
            <div class="report-value">{{ serviceData[servicePeriod] }}</div>
            <p class="report-label">Services Completed</p>
          </div>
        </div>

        <!-- Popular Services Card -->
        <div class="report-card full-width">
          <div class="report-header">
            <h3 class="report-title">Popular Services</h3>
          </div>
          <div class="services-list">
            <div v-for="service in popularServices" :key="service.name" class="service-item">
              <span class="service-name">{{ service.name }}</span>
              <div class="service-bar-container">
                <div class="service-bar" :style="{ width: service.percentage + '%' }"></div>
              </div>
              <span class="service-count">{{ service.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="export-section">
        <button class="export-btn">
          <span>📊</span> Export Report
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'

export default {
  name: 'Reports',
  components: {
    Navbar
  },
  data() {
    return {
      revenuePeriod: 'daily',
      customerPeriod: 'daily',
      servicePeriod: 'daily',
      revenueData: {
        daily: '1,250',
        weekly: '8,750',
        monthly: '35,000'
      },
      customerData: {
        daily: 25,
        weekly: 175,
        monthly: 700
      },
      serviceData: {
        daily: 30,
        weekly: 210,
        monthly: 840
      },
      popularServices: [
        { name: 'Wash & Dry', count: 150, percentage: 100 },
        { name: 'Full Service', count: 120, percentage: 80 },
        { name: 'Wash Only', count: 90, percentage: 60 },
        { name: 'Iron Only', count: 60, percentage: 40 },
        { name: 'Dry Only', count: 30, percentage: 20 }
      ]
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'Genty Sans';
  src: url('/fonts/genty-sans-regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Poppins';
  src: url('/fonts/Poppins-Bold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

.reports-page {
  display: flex;
  min-height: 100vh;
  background-color: #bef0fb;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 40px;
}

.content-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-family: 'Genty Sans', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #17696d;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #9aa6a6;
  font-weight: 500;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.report-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.report-card.full-width {
  grid-column: 1 / -1;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.report-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.period-select {
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;
}

.period-select:focus {
  outline: none;
  border-color: #17a2b8;
}

.report-content {
  text-align: center;
  padding: 20px 0;
}

.report-value {
  font-size: 3rem;
  font-weight: 700;
  color: #17a2b8;
  margin-bottom: 10px;
}

.report-label {
  font-size: 1rem;
  color: #666;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.service-item {
  display: grid;
  grid-template-columns: 150px 1fr 50px;
  align-items: center;
  gap: 15px;
}

.service-name {
  font-weight: 600;
  color: #333;
}

.service-bar-container {
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.service-bar {
  height: 100%;
  background: linear-gradient(90deg, #5de0e6 0%, #004aad 100%);
  transition: width 0.3s ease;
}

.service-count {
  text-align: right;
  font-weight: 600;
  color: #17a2b8;
}

.export-section {
  text-align: center;
  margin-top: 30px;
}

.export-btn {
  background: linear-gradient(90deg, #5de0e6 0%, #004aad 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 40px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(23, 162, 184, 0.3);
  opacity: 0.9;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    margin-left: 80px;
    padding: 20px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }

  .service-item {
    grid-template-columns: 120px 1fr 40px;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .main-content {
    margin-left: 60px;
    padding: 15px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .report-card {
    padding: 20px 15px;
  }

  .report-value {
    font-size: 2rem;
  }
}
</style>
