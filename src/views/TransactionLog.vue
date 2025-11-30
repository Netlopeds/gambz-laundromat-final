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
          <div class="header-actions">
            <button @click="openStatusModal" class="btn-edit-status">
              Edit Status
            </button>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search by ID or Name"
              class="search-input"
            />
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="table-container desktop-view">
          <table class="transactions-table">
            <thead>
              <tr>
                <th @click="sortBy('id')" class="sortable">
                  ID
                  <span class="sort-icon">{{ getSortIcon('id') }}</span>
                </th>
                <th @click="sortBy('customer')" class="sortable">
                  Customer Name
                  <span class="sort-icon">{{ getSortIcon('customer') }}</span>
                </th>
                <th @click="sortBy('service')" class="sortable">
                  Service Type
                  <span class="sort-icon">{{ getSortIcon('service') }}</span>
                </th>
                <th @click="sortBy('addons')" class="sortable">
                  Add-ons
                  <span class="sort-icon">{{ getSortIcon('addons') }}</span>
                </th>
                <th @click="sortBy('status')" class="sortable">
                  Status
                  <span class="sort-icon">{{ getSortIcon('status') }}</span>
                </th>
                <th @click="sortBy('date')" class="sortable">
                  Date
                  <span class="sort-icon">{{ getSortIcon('date') }}</span>
                </th>
                <th @click="sortBy('time')" class="sortable">
                  Time Received
                  <span class="sort-icon">{{ getSortIcon('time') }}</span>
                </th>
                <th @click="sortBy('amount')" class="sortable">
                  Amount
                  <span class="sort-icon">{{ getSortIcon('amount') }}</span>
                </th>
                <th v-if="isAdmin">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
                <td>{{ transaction.id }}</td>
                <td>{{ transaction.customer }}</td>
                <td>{{ transaction.service }}</td>
                <td>{{ transaction.addons }}</td>
                <td>
                  <span :class="['status-badge', transaction.status]">
                    {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
                  </span>
                </td>
                <td>{{ transaction.date }}</td>
                <td>{{ transaction.time }}</td>
                <td>₱{{ transaction.amount }}</td>
                <td v-if="isAdmin">
                  <button
                    @click="openEditModal(transaction)"
                    class="edit-btn"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tablet Card View -->
        <div class="tablet-view">
          <div v-for="transaction in paginatedTransactions" :key="transaction.id" class="transaction-mobile-card">
            <div class="mobile-card-header">
              <span class="mobile-id">{{ transaction.id }}</span>
              <span :class="['status-badge', transaction.status]">
                {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
              </span>
            </div>
            <div class="mobile-card-body">
              <div class="mobile-field">
                <span class="mobile-label">Customer:</span>
                <span class="mobile-value">{{ transaction.customer }}</span>
              </div>
              <div class="mobile-field">
                <span class="mobile-label">Service:</span>
                <span class="mobile-value">{{ transaction.service }}</span>
              </div>
              <div class="mobile-field">
                <span class="mobile-label">Add-ons:</span>
                <span class="mobile-value">{{ transaction.addons }}</span>
              </div>
              <div class="mobile-field">
                <span class="mobile-label">Date:</span>
                <span class="mobile-value">{{ transaction.date }}</span>
              </div>
              <div class="mobile-field">
                <span class="mobile-label">Time:</span>
                <span class="mobile-value">{{ transaction.time }}</span>
              </div>
              <div class="mobile-field">
                <span class="mobile-label">Amount:</span>
                <span class="mobile-value amount">₱{{ transaction.amount }}</span>
              </div>
            </div>
            <div v-if="isAdmin" class="mobile-card-footer">
              <button @click="openEditModal(transaction)" class="edit-btn-mobile">Edit Transaction</button>
            </div>
          </div>
        </div>

        <!-- Mobile Card View -->
        <div class="mobile-view">
          <div v-for="transaction in paginatedTransactions" :key="transaction.id" class="transaction-mobile-card">
            <div class="mobile-card-header">
              <span class="mobile-id">{{ transaction.id }}</span>
              <span :class="['status-badge', transaction.status]">
                {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
              </span>
            </div>
            <div class="mobile-card-body">
              <div class="mobile-field">
                <span class="mobile-label">Customer:</span>
                <span class="mobile-value">{{ transaction.customer }}</span>
              </div>
              <div class="mobile-field">
                <span class="mobile-label">Service:</span>
                <span class="mobile-value">{{ transaction.service }}</span>
              </div>
              <div class="mobile-field">
                <span class="mobile-label">Add-ons:</span>
                <span class="mobile-value">{{ transaction.addons }}</span>
              </div>
              <div class="mobile-field">
                <span class="mobile-label">Date:</span>
                <span class="mobile-value">{{ transaction.date }}</span>
              </div>
              <div class="mobile-field">
                <span class="mobile-label">Time:</span>
                <span class="mobile-value">{{ transaction.time }}</span>
              </div>
              <div class="mobile-field">
                <span class="mobile-label">Amount:</span>
                <span class="mobile-value amount">₱{{ transaction.amount }}</span>
              </div>
            </div>
            <div v-if="isAdmin" class="mobile-card-footer">
              <button @click="openEditModal(transaction)" class="edit-btn-mobile">Edit Transaction</button>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="pagination">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-btn">Previous</button>
          <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
        </div>
      </div>
    </main>

    <!-- Edit Transaction Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Edit Transaction - {{ editForm.id }}</h3>
          <button @click="closeEditModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="modal-label">Customer Name:</label>
            <input 
              v-model="editForm.customer" 
              type="text" 
              class="modal-input"
            />
          </div>
          
          <div class="form-group">
            <label class="modal-label">Service Type:</label>
            <select v-model="editForm.service" class="modal-select">
              <option value="Wash">Wash</option>
              <option value="Wash & Dry">Wash & Dry</option>
              <option value="Full Service">Full Service</option>
            </select>
          </div>

          <div class="form-group">
            <label class="modal-label">Add-ons:</label>
            <div class="addons-container">
              <!-- Selected Add-ons List -->
              <div v-if="selectedAddons.length > 0" class="selected-addons">
                <div v-for="(addon, index) in selectedAddons" :key="index" class="addon-item">
                  <span class="addon-name">{{ getAddonDisplayName(addon.type) }}</span>
                  <div class="addon-controls">
                    <div class="qty-controls">
                      <button type="button" @click="decrementQty(index)" class="qty-btn minus-btn" :disabled="addon.qty <= 1">-</button>
                      <span class="qty-display">{{ addon.qty }}</span>
                      <button type="button" @click="incrementQty(index)" class="qty-btn plus-btn" :disabled="addon.qty >= 99">+</button>
                    </div>
                    <button type="button" @click="removeAddon(index)" class="remove-btn">&times;</button>
                  </div>
                </div>
              </div>
              
              <!-- Add New Add-on -->
              <div class="add-addon-section">
                <select v-model="newAddon" class="addon-select modal-select">
                  <option value="">Select add-on to add</option>
                  <option 
                    v-for="addon in availableAddons" 
                    :key="addon.value" 
                    :value="addon.value"
                  >
                    {{ addon.label }}
                  </option>
                </select>
                <button 
                  type="button" 
                  @click="addAddon" 
                  :disabled="!newAddon"
                  class="add-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="modal-label">Status:</label>
            <select v-model="editForm.status" class="modal-select">
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          <div class="form-group">
            <label class="modal-label">Date:</label>
            <input 
              v-model="editForm.date" 
              type="date" 
              class="modal-input"
            />
          </div>

          <div class="form-group">
            <label class="modal-label">Time:</label>
            <input 
              v-model="editForm.time" 
              type="time" 
              class="modal-input"
            />
          </div>

          <div class="form-group">
            <label class="modal-label">Amount:</label>
            <input 
              v-model="editForm.amount" 
              type="number" 
              step="0.01"
              class="modal-input"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeEditModal" class="btn-modal-cancel">Cancel</button>
          <button @click="confirmDelete(editForm)" class="btn-modal-delete">Delete Transaction</button>
          <button @click="confirmEdit" class="btn-modal-submit">Update Transaction</button>
        </div>
      </div>
    </div>

    <!-- Confirm Edit Modal -->
    <div v-if="showConfirmEditModal" class="modal-overlay" @click="closeConfirmEditModal">
      <div class="modal-content modal-confirm" @click.stop>
        <div class="modal-header">
          <h3>Confirm Update</h3>
          <button @click="closeConfirmEditModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p class="confirm-message">
            Are you sure you want to update transaction <strong>{{ editForm.id }}</strong>?
          </p>
        </div>
        <div class="modal-footer">
          <button @click="closeConfirmEditModal" class="btn-modal-cancel">No, Cancel</button>
          <button @click="saveEditTransaction" class="btn-modal-submit">Yes, Update</button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content modal-confirm" @click.stop>
        <div class="modal-header">
          <h3>Success!</h3>
          <button @click="closeSuccessModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p class="success-message">
            Transaction log updated!
          </p>
        </div>
        <div class="modal-footer">
          <button @click="closeSuccessModal" class="btn-modal-submit">OK</button>
        </div>
      </div>
    </div>

    <!-- Edit Status Modal - Step 1: Enter Transaction ID -->
    <div v-if="showStatusModal" class="modal-overlay" @click="closeStatusModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Edit Transaction Status</h3>
          <button @click="closeStatusModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <label class="modal-label">Enter Transaction ID:</label>
          <input 
            v-model="statusModalTransactionId" 
            type="text" 
            class="modal-input"
            placeholder="e.g., TN1"
            @keyup.enter="findTransaction"
          />
          <p v-if="transactionNotFound" class="error-message">Transaction not found!</p>
        </div>
        <div class="modal-footer">
          <button @click="closeStatusModal" class="btn-modal-cancel">Cancel</button>
          <button @click="findTransaction" class="btn-modal-submit">Find</button>
        </div>
      </div>
    </div>

    <!-- Edit Status Modal - Step 2: Show Transaction & Change Status -->
    <div v-if="showEditStatusForm" class="modal-overlay" @click="closeEditStatusForm">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Edit Status - {{ selectedTransaction.id }}</h3>
          <button @click="closeEditStatusForm" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="transaction-details">
            <p><strong>Customer:</strong> {{ selectedTransaction.customer }}</p>
            <p><strong>Service:</strong> {{ selectedTransaction.service }}</p>
            <p><strong>Add-ons:</strong> {{ selectedTransaction.addons }}</p>
            <p><strong>Date:</strong> {{ selectedTransaction.date }}</p>
            <p><strong>Time:</strong> {{ selectedTransaction.time }}</p>
            <p><strong>Amount:</strong> ₱{{ selectedTransaction.amount }}</p>
            <p><strong>Current Status:</strong> 
              <span :class="['status-badge', selectedTransaction.status]">
                {{ selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1) }}
              </span>
            </p>
          </div>
          <div class="status-change-section">
            <label class="modal-label">Change Status To:</label>
            <select v-model="newStatus" class="modal-select">
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeEditStatusForm" class="btn-modal-cancel">Cancel</button>
          <button @click="confirmStatusChange" class="btn-modal-submit">Update Status</button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal - Step 3: Confirm Status Change -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="closeConfirmModal">
      <div class="modal-content modal-confirm" @click.stop>
        <div class="modal-header">
          <h3>Confirm Status Change</h3>
          <button @click="closeConfirmModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p class="confirm-message">
            Are you sure you want to change the status of transaction? <strong>{{ selectedTransaction.id }}</strong> to 
            <strong>{{ newStatus.charAt(0).toUpperCase() + newStatus.slice(1) }}</strong>?
          </p>
        </div>
        <div class="modal-footer">
          <button @click="closeConfirmModal" class="btn-modal-cancel">No, Cancel</button>
          <button @click="saveStatusChange" class="btn-modal-submit">Yes, Confirm</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content modal-confirm" @click.stop>
        <div class="modal-header">
          <h3>Confirm Delete</h3>
          <button @click="closeDeleteModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p class="confirm-message">
            Are you sure you want to <strong>permanently delete</strong> transaction <strong>{{ transactionToDelete?.id }}</strong>?
          </p>
          <p class="warning-message">This action cannot be undone!</p>
        </div>
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn-modal-cancel">No, Cancel</button>
          <button @click="deleteTransaction" class="btn-modal-delete">Yes, Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import { useAuthStore } from '../stores/auth'
import { computed } from 'vue'
import api from '@/services/api'

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
        id: '',
        customer: '',
        service: '',
        addons: '',
        amount: 0,
        status: '',
        date: '',
        time: ''
      },
      selectedAddons: [],
      newAddon: '',
      availableAddons: [
        { value: 'ariel', label: 'Ariel' },
        { value: 'Tide', label: 'Tide' },
        { value: 'breeze', label: 'Breeze' },
        { value: 'Downy', label: 'Downy' },
        { value: 'Zonrox', label: 'Zonrox'},
        { value: 'Surf', label: 'Surf' },
        { value: 'Del', label: 'Del' }
      ],
      showStatusModal: false,
      showEditStatusForm: false,
      showConfirmModal: false,
      showEditModal: false,
      showConfirmEditModal: false,
      showSuccessModal: false,
      showDeleteModal: false,
      transactionToDelete: null,
      statusModalTransactionId: '',
      transactionNotFound: false,
      selectedTransaction: null,
      newStatus: '',
      sortColumn: '',
      sortDirection: 'asc',
      transactions: [],
      loading: false,
      error: null,
      currentPage: 1,
      rowsPerPage: 8
    }
  },
  async mounted() {
    await this.fetchTransactions()
  },
  computed: {
    filteredTransactions() {
      let filtered = this.transactions
      
      // Apply search filter
      if (this.searchQuery) {
        filtered = filtered.filter(t => 
          t.id.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          t.customer.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      
      // Apply sorting
      if (this.sortColumn) {
        filtered = [...filtered].sort((a, b) => {
          let aVal = a[this.sortColumn]
          let bVal = b[this.sortColumn]
          
          // Custom sorting logic based on column
          if (this.sortColumn === 'id') {
            // Extract number from ID (e.g., "TN01" -> 1)
            const aNum = parseInt(aVal.replace(/\D/g, ''))
            const bNum = parseInt(bVal.replace(/\D/g, ''))
            return this.sortDirection === 'asc' ? aNum - bNum : bNum - aNum
          }
          
          if (this.sortColumn === 'customer') {
            // Alphabetical sorting
            return this.sortDirection === 'asc' 
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal)
          }
          
          if (this.sortColumn === 'service') {
            // Custom order: Full Service, Wash & Dry, Wash
            const order = {
              'Full Service': 1,
              'Wash & Dry': 2,
              'Wash': 3
            }
            const aOrder = order[aVal] || 999
            const bOrder = order[bVal] || 999
            return this.sortDirection === 'asc' ? aOrder - bOrder : bOrder - aOrder
          }
          
          if (this.sortColumn === 'addons') {
            // Order: Detergent, Softener, Softener & Detergent, None
            const order = { 'Detergent': 1, 'Softener': 2, 'Softener & Detergent': 3, 'None': 4 }
            const aOrder = order[aVal] || 999
            const bOrder = order[bVal] || 999
            return this.sortDirection === 'asc' ? aOrder - bOrder : bOrder - aOrder
          }
          
          if (this.sortColumn === 'status') {
            // Order: Paid, Unpaid
            const order = { 'paid': 1, 'unpaid': 2 }
            const aOrder = order[aVal] || 999
            const bOrder = order[bVal] || 999
            return this.sortDirection === 'asc' ? aOrder - bOrder : bOrder - aOrder
          }
          
          if (this.sortColumn === 'date') {
            // Date sorting using raw date values
            const aDate = new Date(a.rawDate)
            const bDate = new Date(b.rawDate)
            return this.sortDirection === 'asc' ? aDate - bDate : bDate - aDate
          }
          
          if (this.sortColumn === 'time') {
            // Time sorting
            const aTime = aVal.split(':').map(Number)
            const bTime = bVal.split(':').map(Number)
            const aMinutes = aTime[0] * 60 + aTime[1]
            const bMinutes = bTime[0] * 60 + bTime[1]
            return this.sortDirection === 'asc' ? aMinutes - bMinutes : bMinutes - aMinutes
          }
          
          if (this.sortColumn === 'amount') {
            // Numeric sorting
            return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal
          }
          
          return 0
        })
      }
      
      return filtered
    },
    paginatedTransactions() {
      const start = (this.currentPage - 1) * this.rowsPerPage
      return this.filteredTransactions.slice(start, start + this.rowsPerPage)
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredTransactions.length / this.rowsPerPage))
    }
  },
  methods: {
    async fetchTransactions() {
      this.loading = true
      this.error = null
      try {
        const response = await api.transactions.getAll()
        this.transactions = response.data.map(t => ({
          id: `TN${String(t.transaction_id).padStart(4, '0')}`,
          customer: t.customer_name || 'N/A',
          service: t.service_type || 'N/A',
          addons: t.addon || 'None',
          status: t.status || 'unpaid',
          date: this.formatDate(t.date),
          rawDate: t.date,
          time: t.time_received,
          amount: parseFloat(t.price) || 0
        }))
      } catch (error) {
        console.error('Error fetching transactions:', error)
        this.error = 'Failed to load transactions'
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      // Parse ISO date properly
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      const day = date.getUTCDate().toString().padStart(2, '0')
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
      const year = date.getUTCFullYear()
      return `${day}/${month}/${year}`
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    sortBy(column) {
      if (this.sortColumn === column) {
        // Toggle direction if clicking same column
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        // New column, set default direction
        this.sortColumn = column
        if (column === 'date') {
          this.sortDirection = 'desc' // Most recent first by default
        } else {
          this.sortDirection = 'asc'
        }
      }
      // Reset to first page when sorting changes
      this.currentPage = 1
    },
    getSortIcon(column) {
      if (this.sortColumn !== column) {
        return '⇅' // Both arrows when not sorted
      }
      return this.sortDirection === 'asc' ? '↑' : '↓'
    },
    openStatusModal() {
      this.showStatusModal = true
      this.statusModalTransactionId = ''
      this.transactionNotFound = false
    },
    closeStatusModal() {
      this.showStatusModal = false
      this.statusModalTransactionId = ''
      this.transactionNotFound = false
    },
    findTransaction() {
      const transaction = this.transactions.find(t => t.id === this.statusModalTransactionId.trim())
      if (transaction) {
        this.selectedTransaction = transaction
        this.newStatus = transaction.status
        this.showStatusModal = false
        this.showEditStatusForm = true
        this.transactionNotFound = false
      } else {
        this.transactionNotFound = true
      }
    },
    closeEditStatusForm() {
      this.showEditStatusForm = false
      this.selectedTransaction = null
      this.newStatus = ''
    },
    confirmStatusChange() {
      this.showEditStatusForm = false
      this.showConfirmModal = true
    },
    closeConfirmModal() {
      this.showConfirmModal = false
    },
    async saveStatusChange() {
      try {
        const transactionId = parseInt(this.selectedTransaction.id.replace('TN', ''))
        const authStore = useAuthStore()
        
        await api.transactions.update(transactionId, {
          status: this.newStatus,
          staff_id: authStore.staffId || 1 // Use logged in staff ID
        })
        
        // Update local data
        const index = this.transactions.findIndex(t => t.id === this.selectedTransaction.id)
        if (index !== -1) {
          this.transactions[index].status = this.newStatus
        }
        
        console.log(`Transaction ${this.selectedTransaction.id} status changed to ${this.newStatus}`)
      } catch (error) {
        console.error('Error updating status:', error)
        alert('Failed to update transaction status')
      }
      
      // Close all modals
      this.showConfirmModal = false
      this.selectedTransaction = null
      this.newStatus = ''
      this.statusModalTransactionId = ''
    },
    confirmDelete(transaction) {
      // Close edit modal if open
      this.showEditModal = false
      this.transactionToDelete = transaction
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.transactionToDelete = null
    },
    async deleteTransaction() {
      try {
        const transactionId = parseInt(this.transactionToDelete.id.replace('TN', ''))
        
        await api.transactions.delete(transactionId)
        
        // Refresh the transaction list
        await this.fetchTransactions()
        
        // Close modal
        this.closeDeleteModal()
        
        // Show success message
        alert('Transaction deleted successfully')
      } catch (error) {
        console.error('Error deleting transaction:', error)
        alert('Failed to delete transaction. Please try again.')
      }
    },
    openEditModal(transaction) {
      this.editForm = {
        id: transaction.id,
        customer: transaction.customer,
        service: transaction.service,
        addons: transaction.addons,
        amount: transaction.amount,
        status: transaction.status,
        date: transaction.date,
        time: transaction.time
      }
      
      // Parse existing addons and populate selectedAddons array
      this.selectedAddons = []
      if (transaction.addons && transaction.addons !== 'None') {
        // Handle simple addon format (e.g., "Ariel", "Surf")
        if (!transaction.addons.includes('(')) {
          // Single addon without quantity
          const addonValue = this.availableAddons.find(a => a.label === transaction.addons)?.value
          if (addonValue) {
            this.selectedAddons.push({
              type: addonValue,
              qty: 1
            })
          }
        } else {
          // Handle complex addon format with quantities (e.g., "Ariel (2), Surf (1)")
          const addonParts = transaction.addons.split(', ')
          addonParts.forEach(part => {
            const match = part.match(/^(.+)\s*\((\d+)\)$/)
            if (match) {
              const addonName = match[1].trim()
              const qty = parseInt(match[2])
              const addonValue = this.availableAddons.find(a => a.label === addonName)?.value
              if (addonValue) {
                this.selectedAddons.push({
                  type: addonValue,
                  qty: qty
                })
              }
            }
          })
        }
      }
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
      this.editForm = {
        id: '',
        customer: '',
        service: '',
        addons: '',
        amount: 0,
        status: '',
        date: '',
        time: ''
      }
      this.selectedAddons = []
      this.newAddon = ''
    },
    // Add-ons methods
    addAddon() {
      if (this.newAddon) {
        // Check if addon already exists
        const existingIndex = this.selectedAddons.findIndex(addon => addon.type === this.newAddon)
        if (existingIndex !== -1) {
          // If exists, increment quantity
          this.selectedAddons[existingIndex].qty += 1
        } else {
          // If doesn't exist, add new addon with qty 1
          this.selectedAddons.push({
            type: this.newAddon,
            qty: 1
          })
        }
        this.newAddon = ''
      }
    },
    removeAddon(index) {
      this.selectedAddons.splice(index, 1)
    },
    validateQty(index) {
      const addon = this.selectedAddons[index]
      if (addon.qty < 1) addon.qty = 1
      if (addon.qty > 99) addon.qty = 99
    },
    incrementQty(index) {
      if (this.selectedAddons[index].qty < 99) {
        this.selectedAddons[index].qty++
      }
    },
    decrementQty(index) {
      if (this.selectedAddons[index].qty > 1) {
        this.selectedAddons[index].qty--
      }
    },
    getAddonDisplayName(type) {
      const addon = this.availableAddons.find(a => a.value === type)
      return addon ? addon.label : type
    },
    getAddonsForDisplay() {
      if (this.selectedAddons.length === 0) return 'None'
      return this.selectedAddons.map(addon => 
        `${this.getAddonDisplayName(addon.type)} (${addon.qty})`
      ).join(', ')
    },
    confirmEdit() {
      // Convert selectedAddons array to addons string format
      this.editForm.addons = this.getAddonsForDisplay()
      
      this.showEditModal = false
      this.showConfirmEditModal = true
    },
    closeConfirmEditModal() {
      this.showConfirmEditModal = false
    },
    async saveEditTransaction() {
      try {
        const transactionId = parseInt(this.editForm.id.replace('TN', ''))
        const authStore = useAuthStore()
        
        await api.transactions.update(transactionId, {
          customer_id: 1, // You may need to handle customer lookup
          staff_id: authStore.staffId || 1,
          date: this.editForm.date,
          time_received: this.editForm.time,
          price: this.editForm.amount,
          name: this.editForm.customer,
          service_type: this.editForm.service,
          addon: this.editForm.addons,
          status: this.editForm.status
        })
        
        // Update local data
        const index = this.transactions.findIndex(t => t.id === this.editForm.id)
        if (index !== -1) {
          this.transactions[index] = { ...this.editForm }
        }
        
        console.log(`Transaction ${this.editForm.id} updated`)
      } catch (error) {
        console.error('Error updating transaction:', error)
        alert('Failed to update transaction')
      }
      
      // Close confirm modal and show success
      this.showConfirmEditModal = false
      this.showSuccessModal = true
    },
    closeSuccessModal() {
      this.showSuccessModal = false
      this.editForm = {
        id: '',
        customer: '',
        service: '',
        addons: '',
        amount: 0,
        status: '',
        date: '',
        time: ''
      }
    },
    startEdit(transaction) {
      this.editingId = transaction.id
      this.editForm = {
        customer: transaction.customer,
        service: transaction.service,
        addons: transaction.addons,
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
        addons: '',
        amount: 0,
        status: ''
      }
    }
  }
}
</script>

<style src="./transactionlog.css"></style>

