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
          <form @submit.prevent="handleSubmit" class="transaction-form">
            <div class="form-content">
            <!-- Row 1 -->
            <div class="form-row">
              <div class="form-group">
                <label for="customerName">Customer Name</label>
                <input 
                  type="text" 
                  id="customerName" 
                  v-model="form.customerName" 
                  placeholder="Enter customer name"
                  pattern="[A-Za-z\s\.\-']+"
                  title="Customer name should only contain letters, spaces, dots, hyphens, and apostrophes"
                  @keypress="validateLettersOnly"
                  required
                />
              </div>

              <div class="form-group">
                <label for="status">Status</label>
                <select id="status" v-model="form.status" required>
                  <option value="pending" selected>Unpaid</option>
                  <option value="completed">Paid</option>
                </select>
              </div>

              <div class="form-group">
                <label for="date">Date</label>
                <input type="date" id="date" v-model="form.date" :max="today" required @change="checkWashPromo" />
              </div>

              <div class="form-group">
                <label for="time">Time Received</label>
                <input 
                  type="time" 
                  id="time" 
                  v-model="form.time" 
                  step="60"
                  pattern="[0-9]{2}:[0-9]{2}"
                  title="Please use 24-hour format (HH:MM)"
                  @blur="formatTime24Hour"
                  @change="checkWashPromo"
                  required 
                />
              </div>
            </div>

            <!-- Row 2: Services -->
            <div class="form-row">
              <div class="form-group full-width">
                <label for="services">Service Type</label>
                <div class="services-container">
                  <div class="add-service-section">
                    <select v-model="newService" class="service-select">
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
                      @click="addService" 
                      :disabled="!newService"
                      class="add-btn"
                    >
                      +
                    </button>
                  </div>
                  <!-- Display selected services with individual extra dry checkboxes -->
                  <div v-if="selectedServices.length > 0" class="selected-items">
                    <div v-for="(service, index) in selectedServices" :key="index" class="selected-item">
                      <span class="item-name">{{ getServiceName(service.serviceId) }}</span>
                      <label v-if="isDryService(service.serviceId)" class="extra-dry-checkbox">
                        <input 
                          type="checkbox" 
                          v-model="service.extraDry"
                          @change="computeAmount"
                        />
                        <span class="checkbox-text">Extra Dry (+₱30)</span>
                      </label>
                      <button 
                        type="button" 
                        @click="removeService(service.serviceId)" 
                        class="remove-btn"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 3: Add-ons -->
            <div class="form-row">
              <div class="form-group full-width">
                <label for="addons">Add-ons</label>
                <div class="addons-container">
                  <div class="add-addon-section">
                    <select v-model="newAddon" class="addon-select">
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
                      @click="addAddon" 
                      :disabled="!newAddon"
                      class="add-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Wash Promo Indicator -->
            <div class="form-row" v-if="form.washPromo">
              <div class="form-group full-width">
                <div class="promo-indicator">
                  🎉 Wash Promo Active (7AM-9AM) - Special pricing applied!
                </div>
              </div>
            </div>

            <!-- Summary Section -->
            <div class="form-row">
              <div class="form-group full-width">
                <label>Order Summary</label>
                <div class="order-summary">
                  <div class="summary-section">
                    <strong>Services:</strong>
                    <p class="summary-text">{{ getServicesForDisplay() }}</p>
                  </div>
                  <div class="summary-section">
                    <strong>Add-ons:</strong>
                    <p class="summary-text">{{ getAddonsForDisplay() }}</p>
                  </div>
                  <div class="summary-section">
                    <strong>Total Amount:</strong>
                    <p class="summary-total">₱{{ formatMoney(form.amount) }}</p>
                  </div>
                </div>
              </div>
            </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-submit">SAVE TRANSACTION</button>
              <button type="button" class="btn-cancel" @click="resetForm">CLEAR FORM</button>
            </div>
          </form>
          
          <!-- Import Button -->
          <div class="import-section">
            <button type="button" class="btn-import" @click="triggerFileImport">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              IMPORT CSV/EXCEL
            </button>
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileImport" 
              accept=".csv,.xlsx,.xls"
              style="display: none;"
            />
          </div>
      </div>
    </main>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="closeConfirmModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirm Transaction</h3>
          <button @click="closeConfirmModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <h4 class="summary-title">Transaction Summary</h4>
          <div class="transaction-summary">
            <div class="summary-item">
              <span class="summary-label">Customer Name:</span>
              <span class="summary-value">{{ form.customerName }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Services:</span>
              <span class="summary-value">{{ getServicesForDisplay() }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Add-ons:</span>
              <span class="summary-value">{{ getAddonsForDisplay() }}</span>
            </div>
            <div class="summary-item" v-if="form.extraService">
              <span class="summary-label">Extra Dry Service:</span>
              <span class="summary-value">Yes (+₱30)</span>
            </div>
            <div class="summary-item" v-if="form.washPromo">
              <span class="summary-label">Wash Promo:</span>
              <span class="summary-value">Active (7AM-9AM)</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Status:</span>
              <span class="summary-value">{{ getStatusName(form.status) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Date:</span>
              <span class="summary-value">{{ formatDate(form.date) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Time Received:</span>
              <span class="summary-value">{{ form.time }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Amount:</span>
              <span class="summary-value">₱{{ formatMoney(form.amount) }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeConfirmModal" class="btn-modal-cancel">Cancel</button>
          <button @click="confirmTransaction" class="btn-modal-submit">Confirm & Save</button>
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
            Transaction created successfully!
          </p>
        </div>
        <div class="modal-footer">
          <button @click="closeSuccessModal" class="btn-modal-submit">OK</button>
        </div>
      </div>
    </div>

    <!-- Import Success Modal -->
    <div v-if="showImportModal" class="modal-overlay" @click="closeImportModal">
      <div class="modal-content modal-confirm" @click.stop>
        <div class="modal-header">
          <h3>Import Complete!</h3>
          <button @click="closeImportModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p class="success-message" v-if="importResult">
            {{ importResult.message }}
          </p>
          <div class="import-stats" v-if="importResult">
            <p><strong>📊 Import Summary:</strong></p>
            <p>✅ Transactions Imported: {{ importResult.imported || 0 }}</p>
            <p v-if="importResult.skipped > 0">⏭️ Transactions Skipped: {{ importResult.skipped }}</p>
            <p v-if="importResult.customers">👥 Customers Processed: {{ importResult.customers }}</p>
          </div>
          <div class="import-errors" v-if="importResult && importResult.errors && importResult.errors.length > 0">
            <p><strong>⚠️ Error Details:</strong></p>
            <div class="error-list">
              <p v-for="(error, index) in importResult.errors" :key="index" class="error-item">
                {{ error }}
              </p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeImportModal" class="btn-modal-submit">OK</button>
        </div>
      </div>
    </div>

    <!-- CSV Import Loading Modal -->
    <div v-if="showImportingModal" class="modal-overlay">
      <div class="modal-content modal-confirm loading-modal" @click.stop>
        <div class="modal-body">
          <div class="loading-spinner"></div>
          <p class="loading-message">Please wait, importing CSV...</p>
          <p class="loading-submessage">This may take a few moments</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import { useAuthStore } from '../stores/auth'
import api from '@/services/api'

export default {
  name: 'NewTransaction',
  components: {
    Navbar
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0]
    },
    hasDryService() {
      return this.selectedServices.some(svc => {
        const service = this.availableServices.find(s => s.value === svc.serviceId)
        return service && (
          service.label.toLowerCase().includes('dry') ||
          service.label.toLowerCase().includes('fold')
        )
      })
    }
  },
  data() {
    return {
      showConfirmModal: false,
      showSuccessModal: false,
      showImportModal: false,
      showImportingModal: false,
      importResult: null,
      selectedAddons: [],
      selectedServices: [], // Array of {serviceId, extraDry}
      newAddon: '',
      newService: '',
      availableAddons: [], // Will be fetched from backend
      availableServices: [], // Will be fetched from backend
      form: {
        customerName: '',
        serviceType: '',
        weight: '',
        amount: '0.00',
        status: 'pending',
        date: '',
        time: '',
        extraService: false,
        washPromo: false
      }
    }
  },
  async mounted() {
    const timeInput = document.getElementById('time');
    if (timeInput) {
      timeInput.setAttribute('data-format', '24');
    }
    await this.fetchServices()
    await this.fetchAddons()
  },
  watch: {
    selectedServices: {
      handler() {
        this.computeAmount()
      },
      deep: true
    },
    selectedAddons: {
      handler() {
        this.computeAmount()
      },
      deep: true
    },
    'form.extraService': function() {
      this.computeAmount()
    }
  },
  methods: {
    validateLettersOnly(event) {
      const char = String.fromCharCode(event.keyCode || event.which);
      // Allow letters (A-Z, a-z), spaces, dots, hyphens, and apostrophes
      if (!/^[A-Za-z\s\.\-']$/.test(char)) {
        event.preventDefault();
      }
    },
    async fetchServices() {
      try {
        const response = await api.services.getAll()
        this.availableServices = response.data
          .filter(s => s.is_active) // Only show active services
          .map(s => ({
            value: s.service_id,
            label: s.name,
            price: parseFloat(s.base_price)
          }))
          .sort((a, b) => b.price - a.price) // Sort by price: highest to lowest
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    },
    async fetchAddons() {
      try {
        const response = await api.addons.getAll()
        this.availableAddons = response.data
          .filter(a => a.is_active) // Only show active addons
          .map(a => ({
            value: a.addon_id,
            label: a.name,
            price: parseFloat(a.price)
          }))
          .sort((a, b) => b.price - a.price) // Sort by price: highest to lowest
      } catch (error) {
        console.error('Error fetching addons:', error)
      }
    },
    formatMoney(amount) {
      const num = parseFloat(amount) || 0
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    getServiceName(serviceId) {
      const service = this.availableServices.find(s => s.value === serviceId)
      return service ? service.label : 'Unknown Service'
    },
    isDryService(serviceId) {
      const service = this.availableServices.find(s => s.value === serviceId)
      return service && (
        service.label.toLowerCase().includes('dry') ||
        service.label.toLowerCase().includes('fold')
      )
    },
    computeAmount() {
      let total = 0
      
      // Add service prices with individual extra dry charges
      this.selectedServices.forEach(svc => {
        const service = this.availableServices.find(s => s.value === svc.serviceId)
        if (service) {
          total += service.price
          // Add extra dry cost for this specific service
          if (svc.extraDry && this.isDryService(svc.serviceId)) {
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
      
      this.form.amount = total.toFixed(2)
    },
    checkWashPromo() {
      if (!this.form.time) {
        this.form.washPromo = false
        return
      }
      
      const [hours, minutes] = this.form.time.split(':')
      const hour = parseInt(hours)
      
      // Check if time is between 7:00 AM and 9:00 AM
      this.form.washPromo = hour >= 7 && hour < 9
    },
    addService() {
      if (this.newService && !this.selectedServices.some(s => s.serviceId === this.newService)) {
        this.selectedServices.push({ serviceId: this.newService, extraDry: false })
        this.newService = ''
      }
    },
    removeService(serviceId) {
      const index = this.selectedServices.findIndex(s => s.serviceId === serviceId)
      if (index > -1) {
        this.selectedServices.splice(index, 1)
      }
    },
    getServicesForDisplay() {
      if (this.selectedServices.length === 0) return 'None selected'
      return this.selectedServices.map(svc => {
        const service = this.availableServices.find(s => s.value === svc.serviceId)
        const name = service ? service.label : 'Unknown'
        return svc.extraDry ? `${name} (Extra Dry)` : name
      }).join(', ')
    },
    handleSubmit() {
      this.showConfirmModal = true
    },
    closeConfirmModal() {
      this.showConfirmModal = false
    },
    async confirmTransaction() {
      try {
        const authStore = useAuthStore()
        
        // Validate that at least one service is selected
        if (this.selectedServices.length === 0) {
          alert('Please select at least one service')
          return
        }
        
        // Get all transactions to find next ID
        const allTransactions = await api.transactions.getAll()
        const transactionsData = Array.isArray(allTransactions.data) ? allTransactions.data : allTransactions.data.data
        const maxId = transactionsData.reduce((max, t) => Math.max(max, t.transaction_id || 0), 0)
        const nextTransactionId = maxId + 1
        
        // Get all customers to find or create customer
        const allCustomers = await api.customers.getAll()
        let customer = allCustomers.data.find(c => c.name.toLowerCase() === this.form.customerName.toLowerCase())
        
        let customerId
        if (customer) {
          customerId = customer.customer_id
        } else {
          // Create new customer with next ID
          const maxCustomerId = allCustomers.data.reduce((max, c) => Math.max(max, c.customer_id || 0), 0)
          const nextCustomerId = maxCustomerId + 1
          
          const customerResponse = await api.customers.create({
            customer_id: nextCustomerId,
            name: this.form.customerName
          })
          customerId = customerResponse.data.customer_id
        }
        
        // Prepare service_ids and addon_ids arrays
        const service_ids = this.selectedServices.map(s => s.serviceId)
        const service_extra_dry = this.selectedServices.map(s => s.extraDry)
        const addon_ids = this.selectedAddons.map(addon => addon.type)
        const addon_quantities = this.selectedAddons.map(addon => addon.qty)
        
        // Create transaction with new structure
        await api.transactions.create({
          transaction_id: nextTransactionId,
          customer_id: customerId,
          staff_id: authStore.staffId || 5,
          date: this.form.date,
          time_received: this.form.time,
          price: parseFloat(this.form.amount) || 0,
          total: parseFloat(this.form.amount) || 0,
          customer_name: this.form.customerName,
          service_ids: service_ids,
          service_extra_dry: service_extra_dry,
          addon_ids: addon_ids,
          addon_quantities: addon_quantities,
          extra_service: false,
          wash_promo: this.form.washPromo,
          quantity_addons: this.selectedAddons.reduce((sum, addon) => sum + addon.qty, 0),
          status: this.form.status === 'completed' ? 'paid' : 'unpaid'
        })
        
        console.log('Transaction created successfully')
        this.showConfirmModal = false
        this.showSuccessModal = true
      } catch (error) {
        console.error('Error creating transaction:', error)
        alert('Failed to create transaction: ' + (error.response?.data?.error || error.message))
        this.showConfirmModal = false
      }
    },
    closeSuccessModal() {
      this.showSuccessModal = false
      this.resetForm()
    },
    getStatusName(value) {
      const statuses = {
        'pending': 'Unpaid',
        'completed': 'Paid'
      }
      return statuses[value] || value
    },
    resetForm() {
      this.form = {
        customerName: '',
        serviceType: '',
        weight: '',
        amount: '0.00',
        status: 'pending',
        date: '',
        time: '',
        extraService: false,
        washPromo: false
      }
      this.selectedAddons = []
      this.selectedServices = []
      this.newAddon = ''
      this.newService = ''
    },
    addAddon() {
      if (this.newAddon) {
        const existingIndex = this.selectedAddons.findIndex(addon => addon.type === this.newAddon)
        if (existingIndex !== -1) {
          this.selectedAddons[existingIndex].qty += 1
        } else {
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
    formatTime24Hour() {
      if (this.form.time) {
        const timeValue = this.form.time;
        if (timeValue.includes('AM') || timeValue.includes('PM')) {
          const [time, period] = timeValue.split(' ');
          const [hours, minutes] = time.split(':');
          let hour24 = parseInt(hours);
          
          if (period === 'AM' && hour24 === 12) {
            hour24 = 0;
          } else if (period === 'PM' && hour24 !== 12) {
            hour24 += 12;
          }
          
          this.form.time = `${hour24.toString().padStart(2, '0')}:${minutes}`;
        }
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      // Handle both YYYY-MM-DD and date objects
      const date = new Date(dateString + 'T00:00:00')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${month}/${day}/${year}`
    },
    triggerFileImport() {
      this.$refs.fileInput.click()
    },
    async handleFileImport(event) {
      const file = event.target.files[0]
      if (!file) return
      
      if (!file.name.endsWith('.csv')) {
        alert('Please select a CSV file')
        return
      }
      
      try {
        // Show loading modal
        this.showImportingModal = true
        
        // Upload CSV file to backend
        const formData = new FormData()
        formData.append('csvFile', file)
        
        const response = await api.transactions.importCSV(formData)
        
        // Hide loading modal
        this.showImportingModal = false
        
        // Store import result and show modal
        this.importResult = response.data
        this.showImportModal = true
        this.$refs.fileInput.value = ''
        
        // Optionally refresh the page or reload data
        // window.location.reload()
      } catch (error) {
        // Hide loading modal
        this.showImportingModal = false
        
        console.error('Error importing CSV:', error)
        alert('Failed to import CSV file: ' + (error.response?.data?.error || error.message))
      }
    },
    closeImportModal() {
      this.showImportModal = false
      this.importResult = null
    }
  }
}
</script>

<style src="./newtransaction.css"></style>
