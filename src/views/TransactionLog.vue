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
            <button v-if="isAdmin" @click="openExportModal" class="btn-export-csv">
              Export to CSV
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
                <td :title="transaction.customer">{{ transaction.customer }}</td>
                <td :title="transaction.service">{{ transaction.service }}</td>
                <td :title="transaction.addons">{{ transaction.addons }}</td>
                <td>
                  <span :class="['status-badge', transaction.status]">
                    {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
                  </span>
                </td>
                <td>{{ transaction.date }}</td>
                <td>{{ transaction.time }}</td>
                <td>₱{{ formatMoney(transaction.amount) }}</td>
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
                <span class="mobile-value amount">₱{{ formatMoney(transaction.amount) }}</span>
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
                <span class="mobile-value amount">₱{{ formatMoney(transaction.amount) }}</span>
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
            <div class="services-edit-container">
              <!-- Selected Services List -->
              <div v-if="selectedServices.length > 0" class="selected-services">
                <div v-for="(service, index) in selectedServices" :key="index" class="service-item-edit">
                  <span class="service-name">{{ getServiceDisplayName(service.serviceId) }}</span>
                  <label v-if="isDryService(service.serviceId)" class="extra-dry-checkbox-modal">
                    <input 
                      type="checkbox" 
                      v-model="service.extraDry"
                      @change="computeModalAmount"
                    />
                    <span class="checkbox-text">Extra Dry (+₱30)</span>
                  </label>
                  <button type="button" @click="removeServiceModal(index)" class="remove-btn">&times;</button>
                </div>
              </div>
              
              <!-- Add New Service -->
              <div class="add-service-section">
                <select v-model="newService" class="service-select modal-select">
                  <option value="">Select service to add</option>
                  <option 
                    v-for="service in availableServices" 
                    :key="service.value" 
                    :value="service.value"
                  >
                    {{ service.label }} - ₱{{ service.price }}
                  </option>
                </select>
                <button 
                  type="button" 
                  @click="addServiceModal" 
                  :disabled="!newService"
                  class="add-btn"
                >
                  +
                </button>
              </div>
            </div>
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
                    {{ addon.label }} - ₱{{ addon.price }}
                  </option>
                </select>
                <button 
                  type="button" 
                  @click="addAddonModal" 
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
            <label class="modal-label">Total Amount:</label>
            <input 
              v-model="editForm.amount" 
              type="text" 
              class="modal-input"
              readonly
              style="background-color: #f8f9fa; font-weight: 600;"
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

    <!-- Export to CSV Modal -->
    <div v-if="showExportModal" class="modal-overlay" @click="closeExportModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Export Transactions to CSV</h3>
          <button @click="closeExportModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="export-options">
            <label class="modal-label">Select Export Period:</label>
            
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" v-model="exportType" value="monthly" />
                <span>Monthly</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="exportType" value="quarterly" />
                <span>Quarterly</span>
              </label>
            </div>

            <!-- Monthly Selection -->
            <div v-if="exportType === 'monthly'" class="date-selection">
              <div class="form-group">
                <label class="modal-label">Select Month:</label>
                <select v-model="exportMonth" class="modal-select">
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div class="form-group">
                <label class="modal-label">Select Year:</label>
                <select v-model="exportYear" class="modal-select">
                  <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>

            <!-- Quarterly Selection -->
            <div v-if="exportType === 'quarterly'" class="date-selection">
              <div class="form-group">
                <label class="modal-label">Select Quarter:</label>
                <select v-model="exportQuarter" class="modal-select">
                  <option value="Q1">Q1 (Jan - Mar)</option>
                  <option value="Q2">Q2 (Apr - Jun)</option>
                  <option value="Q3">Q3 (Jul - Sep)</option>
                  <option value="Q4">Q4 (Oct - Dec)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="modal-label">Select Year:</label>
                <select v-model="exportYear" class="modal-select">
                  <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeExportModal" class="btn-modal-cancel">Cancel</button>
          <button @click="exportToCSV" class="btn-modal-submit">Export</button>
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
        time: '',
        extraService: false,
        washPromo: false
      },
      selectedAddons: [],
      selectedServices: [],
      newAddon: '',
      newService: '',
      availableAddons: [], // Will be fetched from backend
      availableServices: [], // Will be fetched from backend
      showStatusModal: false,
      showEditStatusForm: false,
      showConfirmModal: false,
      showEditModal: false,
      showConfirmEditModal: false,
      showSuccessModal: false,
      showDeleteModal: false,
      showExportModal: false,
      exportType: 'monthly',
      exportMonth: new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : String(new Date().getMonth() + 1),
      exportYear: new Date().getFullYear(),
      exportQuarter: 'Q1',
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
    await this.fetchServices()
    await this.fetchAddons()
    await this.fetchTransactions()
  },
  computed: {
    availableYears() {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let i = currentYear; i >= currentYear - 10; i--) {
        years.push(i)
      }
      return years
    },
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
    async fetchServices() {
      try {
        const response = await api.services.getAll();
        this.availableServices = response.data.map(s => ({
          value: s.service_id,
          label: s.name,
          price: parseFloat(s.base_price)
        }));
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    },
    async fetchAddons() {
      try {
        const response = await api.addons.getAll();
        this.availableAddons = response.data.map(a => ({
          value: a.addon_id,
          label: a.name,
          price: parseFloat(a.price)
        }));
      } catch (error) {
        console.error('Error fetching addons:', error);
      }
    },
    async fetchTransactions() {
      this.loading = true
      this.error = null
      try {
        const response = await api.transactions.getAll()
        // Handle both old format (array) and new format (object with data property)
        const transactionsData = Array.isArray(response.data) ? response.data : response.data.data
        
        console.log('Sample transaction from API:', transactionsData[0])
        
        this.transactions = transactionsData.map(t => ({
          id: `TN${String(t.transaction_id).padStart(4, '0')}`,
          transaction_id: t.transaction_id,
          customer: t.customer_name || 'N/A',
          service: t.services && t.services.length > 0 
            ? t.services.map(s => s.name).join(', ') 
            : 'None',
          addons: t.addons && t.addons.length > 0 
            ? t.addons.map(a => `${a.name} (${a.quantity})`).join(', ') 
            : 'None',
          status: t.status || 'unpaid',
          date: this.formatDate(t.date),
          rawDate: t.date,
          time: t.time_received,
          amount: parseFloat(t.total) || parseFloat(t.price) || 0,
          service_ids: t.services ? t.services.map(s => s.service_id) : [],
          addon_ids: t.addons ? t.addons.map(a => a.addon_id) : [],
          addon_quantities: t.addons ? t.addons.map(a => a.quantity) : [],
          extra_service: t.extra_service || false,
          wash_promo: t.wash_promo || false,
          customer_id: t.customer_id,
          staff_id: t.staff_id
        }))
        
        console.log('Sample formatted transaction:', this.transactions[0])
      } catch (error) {
        console.error('Error fetching transactions:', error)
        this.error = 'Failed to load transactions'
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      
      // Handle date string in YYYY-MM-DD format without timezone conversion
      if (typeof dateString === 'string' && dateString.includes('-')) {
        const [year, month, day] = dateString.split('T')[0].split('-')
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
      }
      
      // Fallback to Date parsing
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
    formatMoney(amount) {
      const num = parseFloat(amount) || 0
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
        
        // Get full transaction data
        const transaction = this.transactions.find(t => t.id === this.selectedTransaction.id)
        
        // Get or create customer_id
        const allCustomers = await api.customers.getAll()
        let customer = allCustomers.data.find(c => c.name.toLowerCase() === transaction.customer.toLowerCase())
        let customerId
        
        if (customer) {
          customerId = customer.customer_id
        } else {
          // Create new customer if doesn't exist
          const newCustomerResponse = await api.customers.create({ name: transaction.customer })
          customerId = newCustomerResponse.data.customer_id
        }
        
        await api.transactions.update(transactionId, {
          customer_id: customerId,
          staff_id: authStore.staffId || 1,
          service_id: transaction.service_id,
          addon_ids: transaction.addon_ids,
          date: transaction.rawDate,
          time_received: transaction.time,
          price: transaction.amount,
          name: transaction.customer,
          status: this.newStatus
        })
        
        // Refresh transactions
        await this.fetchTransactions()
        
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
        service: '', // Will be handled by selectedServices
        addons: transaction.addons,
        amount: transaction.amount,
        status: transaction.status,
        date: transaction.rawDate || transaction.date,
        time: transaction.time,
        extraService: transaction.extra_service || false,
        washPromo: transaction.wash_promo || false
      }
      
      // Populate selectedServices with {serviceId, extraDry} objects
      this.selectedServices = []
      if (transaction.service_ids && transaction.service_ids.length > 0) {
        // For now, set extraDry to false since we don't have that data yet
        // In the future, this would come from the transaction data
        transaction.service_ids.forEach(serviceId => {
          this.selectedServices.push({
            serviceId: serviceId,
            extraDry: false
          })
        })
      }
      
      // Parse existing addons and populate selectedAddons array with quantities
      this.selectedAddons = []
      if (transaction.addon_ids && transaction.addon_ids.length > 0) {
        transaction.addon_ids.forEach((addonId, index) => {
          const quantity = transaction.addon_quantities && transaction.addon_quantities[index] 
            ? transaction.addon_quantities[index] 
            : 1
          this.selectedAddons.push({
            type: addonId,
            qty: quantity
          })
        })
      }
      
      this.showEditModal = true
      // Compute initial amount
      this.computeModalAmount()
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
    addAddonModal() {
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
        this.computeModalAmount()
      }
    },
    removeAddon(index) {
      this.selectedAddons.splice(index, 1)
      this.computeModalAmount()
    },
    validateQty(index) {
      const addon = this.selectedAddons[index]
      if (addon.qty < 1) addon.qty = 1
      if (addon.qty > 99) addon.qty = 99
      this.computeModalAmount()
    },
    incrementQty(index) {
      if (this.selectedAddons[index].qty < 99) {
        this.selectedAddons[index].qty++
        this.computeModalAmount()
      }
    },
    decrementQty(index) {
      if (this.selectedAddons[index].qty > 1) {
        this.selectedAddons[index].qty--
        this.computeModalAmount()
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
    // Service methods
    addServiceModal() {
      if (this.newService) {
        const existingService = this.selectedServices.find(s => s.serviceId === this.newService)
        if (!existingService) {
          this.selectedServices.push({
            serviceId: this.newService,
            extraDry: false
          })
          this.newService = ''
          this.computeModalAmount()
        }
      }
    },
    removeServiceModal(index) {
      this.selectedServices.splice(index, 1)
      this.computeModalAmount()
    },
    getServiceDisplayName(serviceId) {
      const service = this.availableServices.find(s => s.value === serviceId)
      return service ? service.label : 'Unknown Service'
    },
    isDryService(serviceId) {
      const service = this.availableServices.find(s => s.value === serviceId)
      return service && service.label && service.label.toLowerCase().includes('dry')
    },
    computeModalAmount() {
      let total = 0
      
      // Add service prices
      this.selectedServices.forEach(service => {
        const serviceData = this.availableServices.find(s => s.value === service.serviceId)
        if (serviceData) {
          total += serviceData.price
          // Add extra dry charge if applicable
          if (service.extraDry && this.isDryService(service.serviceId)) {
            total += 30
          }
        }
      })
      
      // Add addon prices
      this.selectedAddons.forEach(addon => {
        const addonData = this.availableAddons.find(a => a.value === addon.type)
        if (addonData) {
          total += addonData.price * addon.qty
        }
      })
      
      this.editForm.amount = total
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
        
        // Get or create customer_id from customer name
        const allCustomers = await api.customers.getAll()
        let customer = allCustomers.data.find(c => c.name.toLowerCase() === this.editForm.customer.toLowerCase())
        let customerId
        
        if (customer) {
          // Customer exists, use their ID
          customerId = customer.customer_id
        } else {
          // Customer doesn't exist, create new customer
          const newCustomerResponse = await api.customers.create({ name: this.editForm.customer })
          customerId = newCustomerResponse.data.customer_id
        }
        
        // Prepare service_ids and service_extra_dry arrays
        const service_ids = this.selectedServices.map(s => s.serviceId)
        const service_extra_dry = this.selectedServices.map(s => s.extraDry ? 1 : 0)
        
        // Prepare addon arrays
        const addon_ids = this.selectedAddons.map(addon => addon.type)
        const addon_quantities = this.selectedAddons.map(addon => addon.qty)
        const quantity_addons = this.selectedAddons.reduce((sum, addon) => sum + addon.qty, 0)
        
        await api.transactions.update(transactionId, {
          customer_id: customerId,
          staff_id: authStore.staffId || 1,
          service_ids: service_ids,
          service_extra_dry: service_extra_dry,
          addon_ids: addon_ids,
          addon_quantities: addon_quantities,
          date: this.editForm.date,
          time_received: this.editForm.time,
          price: this.editForm.amount,
          total: this.editForm.amount,
          customer_name: this.editForm.customer,
          status: this.editForm.status,
          extra_service: this.editForm.extraService || false,
          wash_promo: this.editForm.washPromo || false,
          quantity_addons: quantity_addons
        })
        
        // Refresh transactions to get updated data
        await this.fetchTransactions()
        
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
    },
    openExportModal() {
      this.showExportModal = true
    },
    closeExportModal() {
      this.showExportModal = false
    },
    async exportToCSV() {
      try {
        let filteredTransactions = []
        
        console.log('Export type:', this.exportType)
        console.log('Export quarter:', this.exportQuarter)
        console.log('Export year:', this.exportYear, typeof this.exportYear)
        console.log('Total transactions:', this.transactions.length)
        
        if (this.exportType === 'monthly') {
          // Filter by month and year - parse directly from string to avoid timezone issues
          filteredTransactions = this.transactions.filter(t => {
            if (typeof t.rawDate === 'string' && t.rawDate.includes('-')) {
              const [year, month] = t.rawDate.split('T')[0].split('-')
              return month === this.exportMonth && year === String(this.exportYear)
            }
            const transDate = new Date(t.rawDate)
            const transMonth = (transDate.getMonth() + 1).toString().padStart(2, '0')
            const transYear = transDate.getFullYear().toString()
            return transMonth === this.exportMonth && transYear === String(this.exportYear)
          })
        } else if (this.exportType === 'quarterly') {
          // Filter by quarter and year - parse directly from string to avoid timezone issues
          const quarterMonths = {
            'Q1': ['01', '02', '03'],
            'Q2': ['04', '05', '06'],
            'Q3': ['07', '08', '09'],
            'Q4': ['10', '11', '12']
          }
          const months = quarterMonths[this.exportQuarter]
          
          console.log('Filtering for months:', months)
          
          filteredTransactions = this.transactions.filter(t => {
            if (typeof t.rawDate === 'string' && t.rawDate.includes('-')) {
              const [year, month] = t.rawDate.split('T')[0].split('-')
              const matches = months.includes(month) && year === String(this.exportYear)
              if (matches) {
                console.log('Match found:', t.rawDate, 'year:', year, 'month:', month)
              }
              return matches
            }
            const transDate = new Date(t.rawDate)
            const transMonth = (transDate.getMonth() + 1).toString().padStart(2, '0')
            const transYear = transDate.getFullYear().toString()
            return months.includes(transMonth) && transYear === String(this.exportYear)
          })
        }
        
        console.log('Filtered transactions:', filteredTransactions.length)

        if (filteredTransactions.length === 0) {
          alert('No transactions found for the selected period.')
          return
        }

        // Create CSV content
        const headers = ['ID', 'Customer Name', 'Service Type', 'Add-ons', 'Status', 'Date', 'Time Received', 'Amount']
        const csvRows = [headers.join(',')]
        
        filteredTransactions.forEach(t => {
          // Format date as MM/DD/YYYY for CSV export - parse directly from string to avoid timezone issues
          let csvDate = ''
          if (typeof t.rawDate === 'string' && t.rawDate.includes('-')) {
            const [year, month, day] = t.rawDate.split('T')[0].split('-')
            csvDate = `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`
          } else {
            const dateObj = new Date(t.rawDate)
            csvDate = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear()}`
          }
          
          const row = [
            t.id,
            `"${t.customer}"`,
            `"${t.service}"`,
            `"${t.addons}"`,
            t.status,
            csvDate,
            t.time,
            t.amount
          ]
          csvRows.push(row.join(','))
        })

        const csvContent = csvRows.join('\n')
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        
        const periodLabel = this.exportType === 'monthly' 
          ? `${this.exportYear}-${this.exportMonth}` 
          : `${this.exportYear}-${this.exportQuarter}`
        
        link.setAttribute('href', url)
        link.setAttribute('download', `transactions_${periodLabel}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        this.closeExportModal()
      } catch (error) {
        console.error('Error exporting CSV:', error)
        alert('Failed to export CSV')
      }
    }
  }
}
</script>

<style src="./transactionlog.css"></style>

