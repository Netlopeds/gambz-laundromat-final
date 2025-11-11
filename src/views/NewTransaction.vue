<template>
  <div class="new-transaction-page">
    <!-- Sidebar Navigation -->
    <Navbar />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <h1 class="page-title">New Transaction</h1>
        <p class="page-subtitle">Create a new laundry transaction</p>
      </div>

      <div class="transaction-card">
        <h2 class="card-title">Transaction Form</h2>
        
        <form @submit.prevent="handleSubmit" class="transaction-form">
          <div class="form-group">
            <label for="customerName">Customer Name</label>
            <input 
              type="text" 
              id="customerName" 
              v-model="form.customerName" 
              placeholder="Enter customer name"
              required
            />
          </div>

          <div class="form-group">
            <label for="serviceType">Service Type</label>
            <select id="serviceType" v-model="form.serviceType" required>
              <option value="">Select service</option>
              <option value="wash">Wash Only</option>
              <option value="dry">Dry Only</option>
              <option value="wash-dry">Wash & Dry</option>
              <option value="iron">Iron Only</option>
              <option value="full">Full Service</option>
            </select>
          </div>

          <div class="form-group">
            <label for="weight">Weight (kg)</label>
            <input 
              type="number" 
              id="weight" 
              v-model="form.weight" 
              placeholder="Enter weight"
              min="0"
              step="0.5"
              required
            />
          </div>

          <div class="form-group">
            <label for="amount">Amount (₱)</label>
            <input 
              type="number" 
              id="amount" 
              v-model="form.amount" 
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="resetForm">Cancel</button>
            <button type="submit" class="btn-submit">Create Transaction</button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'

export default {
  name: 'NewTransaction',
  components: {
    Navbar
  },
  data() {
    return {
      form: {
        customerName: '',
        serviceType: '',
        weight: '',
        amount: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      console.log('Transaction submitted:', this.form)
      alert('Transaction created successfully!')
      this.resetForm()
    },
    resetForm() {
      this.form = {
        customerName: '',
        serviceType: '',
        weight: '',
        amount: ''
      }
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

.new-transaction-page {
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

.transaction-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  margin: 0 auto;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
}

.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.95rem;
  color: #333;
  font-weight: 600;
}

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #17a2b8;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 12px 30px;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #e9ecef;
  color: #666;
}

.btn-cancel:hover {
  background: #dee2e6;
}

.btn-submit {
  background: linear-gradient(90deg, #5de0e6 0%, #004aad 100%);
  color: white;
}

.btn-submit:hover {
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

  .transaction-card {
    padding: 25px;
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

  .transaction-card {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
