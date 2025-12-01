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
                  required
                />
              </div>

              <div class="form-group">
                <label for="serviceType">Service Type</label>
                <select id="serviceType" v-model="form.serviceType" required>
                  <option value="">Select service</option>
                  <option 
                    v-for="service in availableServices" 
                    :key="service.value" 
                    :value="service.value"
                  >
                    {{ service.label }} - ₱{{ service.price }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="addons">Add-ons</label>
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
                    <select v-model="newAddon" class="addon-select">
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
                <label for="status">Status</label>
                <select id="status" v-model="form.status" required>
                  <option value="pending" selected>Unpaid</option>
                  <option value="completed">Paid</option>
                </select>
              </div>
            </div>

            <!-- Row 2 -->
            <div class="form-row">
              <div class="form-group">
                <label for="date">Date</label>
                <input type="date" id="date" v-model="form.date" :max="today" required />
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
                  required
                />
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
              <span class="summary-label">Service Type:</span>
              <span class="summary-value">{{ getServiceTypeName(form.serviceType) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Add-ons:</span>
              <span class="summary-value">{{ getAddonsName() }}</span>
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
              <span class="summary-label">Amount:</span>
              <span class="summary-value">₱{{ form.amount }}</span>
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
    }
  },
  data() {
    return {
      showConfirmModal: false,
      showSuccessModal: false,
      selectedAddons: [],
      newAddon: '',
      availableAddons: [], // Will be fetched from backend
      availableServices: [], // Will be fetched from backend
      form: {
        customerName: '',
        serviceType: '',
        weight: '',
        amount: '',
        status: 'pending',
        date: '',
        time: ''
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
    'form.serviceType': function(newVal) {
      this.computeAmount()
    },
    selectedAddons: {
      handler() {
        this.computeAmount()
      },
      deep: true
    }
  },
  methods: {
    async fetchServices() {
      try {
        const response = await api.services.getAll()
        this.availableServices = response.data.map(s => ({
          value: s.service_id,
          label: s.name,
          price: parseFloat(s.base_price)
        }))
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    },
    async fetchAddons() {
      try {
        const response = await api.addons.getAll()
        this.availableAddons = response.data.map(a => ({
          value: a.addon_id,
          label: a.name,
          price: parseFloat(a.price)
        }))
      } catch (error) {
        console.error('Error fetching addons:', error)
      }
    },
    computeAmount() {
      let total = 0
      
      // Add service price
      if (this.form.serviceType) {
        const service = this.availableServices.find(s => s.value === this.form.serviceType)
        if (service) {
          total += service.price
        }
      }
      
      // Add addon prices
      this.selectedAddons.forEach(addon => {
        const addonData = this.availableAddons.find(a => a.value === addon.type)
        if (addonData) {
          total += addonData.price * addon.qty
        }
      })
      
      this.form.amount = total.toFixed(2)
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
        
        // Get all transactions to find next ID
        const allTransactions = await api.transactions.getAll()
        const maxId = allTransactions.data.reduce((max, t) => Math.max(max, t.transaction_id || 0), 0)
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
        
        // Prepare addon_ids array
        const addon_ids = this.selectedAddons.map(addon => addon.type)
        
        // Create transaction with explicit ID
        await api.transactions.create({
          transaction_id: nextTransactionId,
          customer_id: customerId,
          staff_id: authStore.staffId || 5,
          date: this.form.date,
          time_received: this.form.time,
          price: parseFloat(this.form.amount) || 0,
          name: this.form.customerName,
          service_id: this.form.serviceType,
          addon_ids: addon_ids,
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
    getServiceTypeName(value) {
      const service = this.availableServices.find(s => s.value === value)
      return service ? service.label : value
    },
    getAddonsName() {
      return this.getAddonsForDisplay()
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
        amount: '',
        status: 'pending',
        date: '',
        time: ''
      }
      this.selectedAddons = []
      this.newAddon = ''
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
        const text = await file.text()
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length < 2) {
          alert('CSV file is empty or invalid')
          return
        }
        
        const authStore = useAuthStore()
        const allTransactions = await api.transactions.getAll()
        const allCustomers = await api.customers.getAll()
        
        let maxTransactionId = allTransactions.data.reduce((max, t) => Math.max(max, t.transaction_id || 0), 0)
        let maxCustomerId = allCustomers.data.reduce((max, c) => Math.max(max, c.customer_id || 0), 0)
        
        const customerMap = new Map()
        allCustomers.data.forEach(c => customerMap.set(c.name.toLowerCase(), c.customer_id))
        
        let imported = 0
        let failed = 0
        
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
          try {
            const line = lines[i].trim()
            if (!line) continue
            
            const values = this.parseCSVLine(line)
            if (values.length < 8) continue
            
            const customerName = values[6]?.trim()
            if (!customerName) continue
            
            // Find or create customer
            let customerId = customerMap.get(customerName.toLowerCase())
            if (!customerId) {
              maxCustomerId++
              await api.customers.create({
                customer_id: maxCustomerId,
                name: customerName
              })
              customerId = maxCustomerId
              customerMap.set(customerName.toLowerCase(), customerId)
            }
            
            // Create transaction
            maxTransactionId++
            await api.transactions.create({
              transaction_id: maxTransactionId,
              customer_id: customerId,
              staff_id: authStore.staffId || 5,
              date: this.parseDate(values[3]),
              time_received: values[4]?.trim(),
              price: parseFloat(values[5]) || 0,
              name: customerName,
              service_type: values[7]?.trim(),
              addon: values[9]?.trim() || 'none',
              status: values[8]?.toLowerCase().includes('paid') ? 'paid' : 'unpaid'
            })
            
            imported++
          } catch (error) {
            console.error('Error importing line:', error)
            failed++
          }
        }
        
        alert(`Import complete!\nImported: ${imported}\nFailed: ${failed}`)
        this.$refs.fileInput.value = ''
      } catch (error) {
        console.error('Error importing CSV:', error)
        alert('Failed to import CSV file')
      }
    },
    parseCSVLine(line) {
      const values = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())
      return values
    },
    parseDate(dateStr) {
      if (!dateStr) return new Date().toISOString().split('T')[0]
      
      // Handle DD/MM/YYYY format
      const parts = dateStr.split('/')
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
      }
      
      return dateStr
    }
  }
}
</script>

<style src="./newtransaction.css"></style>
