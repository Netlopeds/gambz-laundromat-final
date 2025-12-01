<template>
  <div class="new-transaction-page">
    <!-- Sidebar Navigation -->
    <Navbar />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <h1 class="page-title">Edit/Add Service</h1>
        <p class="page-subtitle">Create or Edit a Service Type</p>
      </div>
      
      <div class="transaction-card">

        <!-- Buttons -->
        <div class="action-buttons" style="display:flex; gap:10px; margin-bottom:15px;">
          <button type="button" class="btn-submit" :class="{ active: activeTab === 'service' }" @click="activeTab = 'service'">SERVICE</button>
          <button type="button" class="btn-submit" :class="{ active: activeTab === 'addons' }" @click="activeTab = 'addons'">ADD-ONS</button>

          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileImport" 
            accept=".csv,.xlsx,.xls"
            style="display:none;"
          />
        </div>

        <!-- Service Table -->
        <div v-if="activeTab === 'service'" class="table-container">
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Price</th>
                <th>Last Updated</th>
                <th>Status</th>
                <th>Edit</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in services" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.updated }}</td>
                <td>
                  <span :class="['status-badge', item.status.toLowerCase()]">
                    {{ item.status }}
                  </span>
                </td>
                <td>
                  <button class="service-edit-btn" @click="editService(item.id)" title="Edit Service">
                    Edit
                  </button>
                </td>
              </tr>
              <tr class="empty-row">
                <td colspan="5" style="padding: 20px; text-align: center;">
                  <button class="add-service-btn" @click="addNewService" title="Add Service">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Add-ons Table -->
        <div v-if="activeTab === 'addons'" class="table-container">
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Add-on Name</th>
                <th>Description</th>
                <th>Last Updated</th>
                <th>Status</th>
                <th>Edit</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in addons" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.updated }}</td>
                <td>
                  <span :class="['status-badge', item.status.toLowerCase()]">
                    {{ item.status }}
                  </span>
                </td>
                <td>
                  <button class="service-edit-btn" @click="editAddon(item.id)" title="Edit Add-on">
                    Edit
                  </button>
                </td>
              </tr>
              <tr class="empty-row">
                <td colspan="5" style="padding: 20px; text-align: center;">
                  <button class="add-service-btn" @click="addNewAddon" title="Add Add-on">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </main>

    <!-- Edit/Add Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button @click="closeEditModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="modal-label">{{ isEditingService ? 'Service' : 'Add-on' }} Name</label>
            <input 
              v-model="editForm.name" 
              type="text" 
              class="modal-input"
              :placeholder="isEditingService ? 'Enter service name' : 'Enter add-on name'"
            />
          </div>

          <div v-if="isEditingService" class="form-group">
            <label class="modal-label">Price (₱)</label>
            <input 
              v-model="editForm.price" 
              type="number" 
              class="modal-input"
              placeholder="Enter price"
            />
          </div>

          <div v-else class="form-group">
            <label class="modal-label">Description</label>
            <input 
              v-model="editForm.description" 
              type="text" 
              class="modal-input"
              placeholder="Enter description"
            />
          </div>

          <div class="form-group">
            <label class="modal-label">Status</label>
            <select v-model="editForm.status" class="modal-input">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div class="form-group">
            <label class="modal-label">Last Updated</label>
            <input 
              v-model="editForm.updated" 
              type="date" 
              class="modal-input"
              :disabled="!isAddingNew"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeEditModal" class="btn-modal-cancel">CANCEL</button>
          <button @click="saveEdit" class="btn-modal-submit">{{ isAddingNew ? 'ADD' : 'SAVE' }}</button>
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
            {{ isEditingService ? 'Service' : 'Add-on' }} {{ isAddingNew ? 'added' : 'updated' }} successfully!
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
      showEditModal: false,
      isEditingService: true,
      isAddingNew: false,
      editingId: null,
      selectedAddons: [],
      newAddon: '',
      activeTab: 'service',
      services: [],
      addons: [],
      editForm: {
        name: '',
        price: '',
        description: '',
        status: 'Active',
        updated: ''
      }
    }
  },
  computed: {
    modalTitle() {
      if (this.isAddingNew) {
        return this.isEditingService ? 'Add New Service' : 'Add New Add-on'
      }
      return this.isEditingService ? 'Edit Service' : 'Edit Add-on'
    }
  },
  async mounted() {
    await this.fetchServices()
    await this.fetchAddons()
  },
  methods: {
    async fetchServices() {
      try {
        const response = await api.services.getAll()
        this.services = response.data.map(s => ({
          id: s.service_id,
          name: s.name,
          price: parseFloat(s.base_price),
          updated: new Date(s.created_at || Date.now()).toISOString().split('T')[0],
          status: 'Active'
        }))
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    },
    async fetchAddons() {
      try {
        const response = await api.addons.getAll()
        this.addons = response.data.map(a => ({
          id: a.addon_id,
          name: a.name,
          description: `Price: ₱${parseFloat(a.price).toFixed(2)}`,
          updated: new Date(a.created_at || Date.now()).toISOString().split('T')[0],
          status: 'Active'
        }))
      } catch (error) {
        console.error('Error fetching addons:', error)
      }
    },
    editService(serviceId) {
      const service = this.services.find(s => s.id === serviceId)
      if (service) {
        this.isEditingService = true
        this.isAddingNew = false
        this.editingId = serviceId
        this.editForm = {
          name: service.name,
          price: service.price,
          description: '',
          status: service.status,
          updated: service.updated
        }
        this.showEditModal = true
      }
    },
    editAddon(addonId) {
      const addon = this.addons.find(a => a.id === addonId)
      if (addon) {
        this.isEditingService = false
        this.isAddingNew = false
        this.editingId = addonId
        this.editForm = {
          name: addon.name,
          price: '',
          description: addon.description,
          status: addon.status,
          updated: addon.updated
        }
        this.showEditModal = true
      }
    },
    addNewService() {
      this.isEditingService = true
      this.isAddingNew = true
      this.editingId = null
      this.editForm = {
        name: '',
        price: '',
        description: '',
        status: 'Active',
        updated: new Date().toISOString().split('T')[0]
      }
      this.showEditModal = true
    },
    addNewAddon() {
      this.isEditingService = false
      this.isAddingNew = true
      this.editingId = null
      this.editForm = {
        name: '',
        price: '',
        description: '',
        status: 'Active',
        updated: new Date().toISOString().split('T')[0]
      }
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
      this.editForm = {
        name: '',
        price: '',
        description: '',
        status: 'Active',
        updated: ''
      }
      this.editingId = null
      this.isAddingNew = false
    },
    async saveEdit() {
      if (!this.editForm.name) {
        alert('Please enter a name')
        return
      }

      try {
        if (this.isEditingService) {
          if (!this.editForm.price) {
            alert('Please enter a price')
            return
          }
          
          if (this.isAddingNew) {
            // Add new service to backend
            const response = await api.services.create({
              name: this.editForm.name,
              base_price: parseFloat(this.editForm.price)
            })
            
            // Add to local array
            this.services.push({
              id: response.data.service_id,
              name: this.editForm.name,
              price: parseFloat(this.editForm.price),
              status: this.editForm.status,
              updated: new Date().toISOString().split('T')[0]
            })
          } else {
            // Update existing service in backend
            await api.services.update(this.editingId, {
              name: this.editForm.name,
              base_price: parseFloat(this.editForm.price)
            })
            
            // Update local array
            const service = this.services.find(s => s.id === this.editingId)
            if (service) {
              service.name = this.editForm.name
              service.price = parseFloat(this.editForm.price)
              service.status = this.editForm.status
              service.updated = new Date().toISOString().split('T')[0]
            }
          }
        } else {
          // Extract price from description if it exists
          const priceMatch = this.editForm.description.match(/₱([0-9.]+)/)
          const price = priceMatch ? parseFloat(priceMatch[1]) : 0
          
          if (this.isAddingNew) {
            // Add new addon to backend
            const response = await api.addons.create({
              name: this.editForm.name,
              price: price
            })
            
            // Add to local array
            this.addons.push({
              id: response.data.addon_id,
              name: this.editForm.name,
              description: this.editForm.description,
              status: this.editForm.status,
              updated: new Date().toISOString().split('T')[0]
            })
          } else {
            // Update existing addon in backend
            await api.addons.update(this.editingId, {
              name: this.editForm.name,
              price: price
            })
            
            // Update local array
            const addon = this.addons.find(a => a.id === this.editingId)
            if (addon) {
              addon.name = this.editForm.name
              addon.description = this.editForm.description
              addon.status = this.editForm.status
              addon.updated = new Date().toISOString().split('T')[0]
            }
          }
        }

        this.closeEditModal()
        this.showSuccessModal = true
      } catch (error) {
        console.error('Error saving:', error)
        alert('Failed to save changes: ' + (error.response?.data?.error || error.message))
      }
    },
    closeSuccessModal() {
      this.showSuccessModal = false
    }
  }
}
</script>

<style src="./editservice.css"></style>
