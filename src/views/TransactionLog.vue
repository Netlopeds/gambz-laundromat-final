<template>
  <div class="transaction-log-page">
    <!-- Sidebar Navigation -->
    <Navbar />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <h1 class="page-title">Transaction Log</h1>
        <p class="page-subtitle">View and manage all transactions</p>
      </div>

      <div class="log-card">
        <div class="card-header">
          <h2 class="card-title">Recent Transactions</h2>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search transactions..."
            class="search-input"
          />
        </div>

        <div class="table-container">
          <table class="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Weight (kg)</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th v-if="isAdmin">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in filteredTransactions" :key="transaction.id">
                <td>{{ transaction.id }}</td>
                <td>
                  <input
                    v-if="editingId === transaction.id"
                    v-model="editForm.customer"
                    class="edit-input"
                    type="text"
                  />
                  <span v-else>{{ transaction.customer }}</span>
                </td>
                <td>
                  <select
                    v-if="editingId === transaction.id"
                    v-model="editForm.service"
                    class="edit-select"
                  >
                    <option value="Wash & Dry">Wash & Dry</option>
                    <option value="Full Service">Full Service</option>
                    <option value="Wash Only">Wash Only</option>
                    <option value="Iron Only">Iron Only</option>
                    <option value="Dry Clean">Dry Clean</option>
                  </select>
                  <span v-else>{{ transaction.service }}</span>
                </td>
                <td>
                  <input
                    v-if="editingId === transaction.id"
                    v-model="editForm.weight"
                    class="edit-input small"
                    type="number"
                    step="0.1"
                  />
                  <span v-else>{{ transaction.weight }}</span>
                </td>
                <td>
                  <input
                    v-if="editingId === transaction.id"
                    v-model="editForm.amount"
                    class="edit-input small"
                    type="number"
                    step="0.01"
                  />
                  <span v-else>₱{{ transaction.amount }}</span>
                </td>
                <td>{{ transaction.date }}</td>
                <td>
                  <select
                    v-if="editingId === transaction.id"
                    v-model="editForm.status"
                    class="edit-select"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                  </select>
                  <span v-else :class="['status-badge', transaction.status]">
                    {{ transaction.status }}
                  </span>
                </td>
                <td v-if="isAdmin">
                  <div class="action-buttons">
                    <button
                      v-if="editingId === transaction.id"
                      @click="saveEdit(transaction.id)"
                      class="btn-save"
                    >
                      Save
                    </button>
                    <button
                      v-if="editingId === transaction.id"
                      @click="cancelEdit"
                      class="btn-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      v-else
                      @click="startEdit(transaction)"
                      class="edit-btn"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import { useAuthStore } from '../stores/auth'
import { computed } from 'vue'

export default {
  name: 'TransactionLog',
  components: {
    Navbar
  },
  setup() {
    const authStore = useAuthStore()
    const isAdmin = computed(() => authStore.isAdmin)
    
    return {
      isAdmin
    }
  },
  data() {
    return {
      searchQuery: '',
      editingId: null,
      editForm: {
        customer: '',
        service: '',
        weight: 0,
        amount: 0,
        status: ''
      },
      transactions: [
        { id: 1, customer: 'John Doe', service: 'Wash & Dry', weight: 5, amount: 250, date: '2025-11-11', status: 'completed' },
        { id: 2, customer: 'Jane Smith', service: 'Full Service', weight: 8, amount: 400, date: '2025-11-11', status: 'pending' },
        { id: 3, customer: 'Mike Johnson', service: 'Wash Only', weight: 3, amount: 120, date: '2025-11-10', status: 'completed' },
        { id: 4, customer: 'Sarah Williams', service: 'Iron Only', weight: 2, amount: 80, date: '2025-11-10', status: 'processing' },
        { id: 5, customer: 'David Brown', service: 'Wash & Dry', weight: 6, amount: 300, date: '2025-11-09', status: 'completed' }
      ]
    }
  },
  computed: {
    filteredTransactions() {
      if (!this.searchQuery) {
        return this.transactions
      }
      return this.transactions.filter(t => 
        t.customer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.service.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    startEdit(transaction) {
      this.editingId = transaction.id
      this.editForm = {
        customer: transaction.customer,
        service: transaction.service,
        weight: transaction.weight,
        amount: transaction.amount,
        status: transaction.status
      }
    },
    saveEdit(id) {
      const index = this.transactions.findIndex(t => t.id === id)
      if (index !== -1) {
        this.transactions[index] = {
          ...this.transactions[index],
          ...this.editForm
        }
        
        // Log the edit to Edit Log (in a real app, this would be an API call)
        const authStore = useAuthStore()
        console.log(`Transaction ${id} edited by ${authStore.user} at ${new Date().toLocaleString()}`)
      }
      this.editingId = null
    },
    cancelEdit() {
      this.editingId = null
      this.editForm = {
        customer: '',
        service: '',
        weight: 0,
        amount: 0,
        status: ''
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

.transaction-log-page {
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

.log-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.search-input {
  padding: 10px 16px;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  font-size: 0.95rem;
  font-family: 'Poppins', sans-serif;
  width: 250px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #17a2b8;
}

.table-container {
  overflow-x: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table thead {
  background: #f0f8fa;
}

.transactions-table th {
  padding: 15px;
  text-align: left;
  font-weight: 700;
  color: #333;
  border-bottom: 2px solid #e9ecef;
}

.transactions-table td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  color: #666;
}

.transactions-table tbody tr:hover {
  background: #f8f9fa;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.processing {
  background: #d1ecf1;
  color: #0c5460;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-input {
  padding: 8px 12px;
  border: 2px solid #17a2b8;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  width: 100%;
  outline: none;
}

.edit-input.small {
  width: 80px;
}

.edit-input:focus {
  border-color: #004aad;
}

.edit-select {
  padding: 8px 12px;
  border: 2px solid #17a2b8;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  outline: none;
  background: white;
  cursor: pointer;
}

.edit-select:focus {
  border-color: #004aad;
}

.edit-btn,
.btn-save,
.btn-cancel {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background: linear-gradient(90deg, #5de0e6 0%, #004aad 100%);
  color: white;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(93, 224, 230, 0.4);
}

.btn-save {
  background: #28a745;
  color: white;
}

.btn-save:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(108, 117, 125, 0.4);
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

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-input {
    width: 100%;
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

  .log-card {
    padding: 20px 15px;
  }
}
</style>
