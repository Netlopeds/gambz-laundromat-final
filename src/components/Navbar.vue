<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="/images/logo%20wit%20name.png" alt="GAMBZ logo" class="sidebar-logo" />
    </div>

    <nav class="sidebar-nav">
      <router-link to="/overview" class="nav-item" active-class="active">
        <img src="/images/overview.png" alt="Overview" class="nav-icon" />
        <span>Overview</span>
      </router-link>
      
      <router-link to="/new-transaction" class="nav-item" active-class="active">
        <img src="/images/new transaction.png" alt="New Transaction" class="nav-icon" />
        <span>New Transaction</span>
      </router-link>
      
      <router-link to="/transaction-log" class="nav-item" active-class="active">
        <img src="/images/transaction-log.png" alt="Transaction Log" class="nav-icon" />
        <span>Transaction Log</span>
      </router-link>
      
      <router-link to="/reports" class="nav-item" active-class="active">
        <img src="/images/reports.png" alt="Reports" class="nav-icon" />
        <span>Reports</span>
      </router-link>
      
      <router-link v-if="authStore.isAdmin" to="/edit-log" class="nav-item" active-class="active">
        <img src="/images/edit log.png" alt="Edit Log" class="nav-icon" />
        <span>Edit Log</span>
      </router-link>
    </nav>

    <button @click="handleLogout" class="logout-btn">
      <img src="/images/logout.png" alt="Logout" class="nav-icon" />
      <span>Logout</span>
    </button>
  </aside>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Navbar',
  setup() {
    const authStore = useAuthStore()
    
    return {
      authStore
    }
  },
  methods: {
    handleLogout() {
      const authStore = useAuthStore()
      authStore.logout()
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'Poppins';
  src: url('/fonts/Poppins-Bold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Poppins';
  src: url('/fonts/Poppins-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* Sidebar Navigation */
.sidebar {
  width: 280px;
  background-color: #f0f8fa;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.sidebar-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.sidebar-logo {
  width: 100%;
  max-width: 350px;
  height: auto;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  background-color: rgba(94, 224, 230, 0.15);
  color: #004aad;
}

.nav-item.active {
  background: linear-gradient(90deg, #5de0e6 0%, #004aad 100%);
  color: white;
  border-radius: 25px;
}

.nav-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(64%) sepia(6%) saturate(556%) hue-rotate(93deg) brightness(91%) contrast(87%);
  transition: filter 0.2s ease;
}

.nav-item.active .nav-icon {
  filter: brightness(0) saturate(100%) invert(100%);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: none;
  border: none;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: auto;
}

.logout-btn:hover {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.logout-btn:hover .nav-icon {
  filter: brightness(0) saturate(100%) invert(32%) sepia(95%) saturate(2324%) hue-rotate(342deg) brightness(88%) contrast(94%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    width: 80px;
    padding: 15px 5px;
  }

  .sidebar-logo {
    max-width: 60px;
  }

  .nav-item span,
  .logout-btn span {
    display: none;
  }

  .nav-item,
  .logout-btn {
    justify-content: center;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 60px;
  }
}
</style>
