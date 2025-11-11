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
                  <option value="wash">Wash</option>
                  <option value="wash-dry">Wash & Dry</option>
                  <option value="full">Full Service</option>
                </select>
              </div>

              <div class="form-group">
                <label for="addons">Add-ons</label>
                <select id="addons" v-model="form.addons">
                  <option value="">None</option>
                  <option value="detergent">Detergent</option>
                  <option value="softener">Softener</option>
                  <option value="softener-detergent">Softener & Detergent</option>
                </select>
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
                <input type="time" id="time" v-model="form.time" required />
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
              <span class="summary-value">{{ getAddonsName(form.addons) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Status:</span>
              <span class="summary-value">{{ getStatusName(form.status) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Date:</span>
              <span class="summary-value">{{ form.date }}</span>
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

export default {
  name: 'NewTransaction',
  components: {
    Navbar
  },
  data() {
    return {
      showConfirmModal: false,
      showSuccessModal: false,
      form: {
        customerName: '',
        serviceType: '',
        weight: '',
        amount: '',
        addons: '',
        status: 'pending',
        date: '',
        time: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      this.showConfirmModal = true
    },
    closeConfirmModal() {
      this.showConfirmModal = false
    },
    confirmTransaction() {
      console.log('Transaction submitted:', this.form)
      this.showConfirmModal = false
      this.showSuccessModal = true
    },
    closeSuccessModal() {
      this.showSuccessModal = false
      this.resetForm()
    },
    getServiceTypeName(value) {
      const services = {
        'wash': 'Wash',
        'wash-dry': 'Wash & Dry',
        'full': 'Full Service'
      }
      return services[value] || value
    },
    getAddonsName(value) {
      const addons = {
        'detergent': 'Detergent',
        'softener': 'Softener',
        'softener-detergent': 'Softener & Detergent',
        '': 'None'
      }
      return addons[value] || 'None'
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
        addons: '',
        status: 'pending',
        date: '',
        time: ''
      }
    },
    triggerFileImport() {
      this.$refs.fileInput.click()
    },
    handleFileImport(event) {
      const file = event.target.files[0]
      if (file) {
        console.log('File selected:', file.name)
        alert(`File "${file.name}" selected. Import functionality will be implemented here.`)
        // TODO: Implement CSV/Excel parsing and import logic
      }
    }
  }
}
</script>

<style src="./newtransaction.css"></style>
