<template>
  <div class="edit-log-page">
    <Navbar />
    <main class="main-content">
      <div class="content-header">
        <h1 class="page-title">Edit Log</h1>
        <p class="page-subtitle">Admin-only view of transaction edit history</p>
      </div>

      <div class="log-card">
        <div class="card-header">
          <h2 class="card-title">Edit History</h2>
          <div class="header-actions">
            <input 
              type="text"
              v-model="searchQuery"
              placeholder="Search by editor, customer name or transaction ID..."
              class="search-input"
            />
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="table-container desktop-view">
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Edit Date/Time</th>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Edited By</th>
                <th>Field Changed</th>
                <th>Old Value</th>
                <th>New Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="7" style="text-align: center;">Loading...</td>
              </tr>
              <tr v-else-if="filteredEdits.length === 0">
                <td colspan="7" style="text-align: center;">No edit logs found</td>
              </tr>
              <tr v-else v-for="edit in filteredEdits" :key="edit.log_id">
                <td>{{ formatDateTime(edit.date_modified) }}</td>
                <td>{{ formatTransactionId(edit.transaction_id) }}</td>
                <td>{{ edit.transaction_name || 'N/A' }}</td>
                <td>
                  <span class="editor-badge">
                    {{ edit.staff_name || 'System' }}
                  </span>
                </td>
                <td>{{ edit.action || 'N/A' }}</td>
                <td>{{ formatValue(edit.old_value) }}</td>
                <td>
                  <span class="new-value">{{ formatValue(edit.new_value) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tablet/Mobile Card View -->
        <div class="mobile-view">
          <div v-if="loading" class="loading-message">Loading...</div>
          <div v-else-if="filteredEdits.length === 0" class="empty-message">No edit logs found</div>
          <div v-else v-for="edit in filteredEdits" :key="edit.log_id" class="edit-log-card">
            <div class="card-row">
              <span class="card-label">Date/Time:</span>
              <span class="card-value">{{ formatDateTime(edit.date_modified) }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Transaction ID:</span>
              <span class="card-value">{{ formatTransactionId(edit.transaction_id) }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Customer:</span>
              <span class="card-value">{{ edit.transaction_name || 'N/A' }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Edited By:</span>
              <span class="editor-badge">{{ edit.staff_name || 'System' }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Field Changed:</span>
              <span class="card-value">{{ edit.action || 'N/A' }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Old Value:</span>
              <span class="card-value">{{ formatValue(edit.old_value) }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">New Value:</span>
              <span class="new-value">{{ formatValue(edit.new_value) }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'

export default {
  name: 'EditLog',
  components: {
    Navbar
  },
  setup() {
    const searchQuery = ref('')
    const editHistory = ref([])
    const loading = ref(false)
    
    const fetchEditLogs = async () => {
      loading.value = true
      try {
        const response = await api.editLogs.getAll()
        editHistory.value = response.data
      } catch (error) {
        console.error('Error fetching edit logs:', error)
      } finally {
        loading.value = false
      }
    }

    const formatDateTime = (dateStr) => {
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    }

    const formatTransactionId = (id) => {
      if (!id) return 'N/A'
      return `TN${String(id).padStart(4, '0')}`
    }

    const formatValue = (value) => {
      if (!value || value === 'null') return 'N/A'
      
      // Check if it's a date value (YYYY-MM-DD format)
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
          const day = date.getUTCDate().toString().padStart(2, '0')
          const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
          const year = date.getUTCFullYear()
          return `${day}/${month}/${year}`
        }
      }
      
      return value
    }

    const filteredEdits = computed(() => {
      if (!searchQuery.value) return editHistory.value
      
      return editHistory.value.filter(edit => {
        const searchLower = searchQuery.value.toLowerCase()
        const transactionId = formatTransactionId(edit.transaction_id).toLowerCase()
        const customer = (edit.transaction_name || '').toLowerCase()
        const editor = (edit.staff_name || '').toLowerCase()
        const field = (edit.action || '').toLowerCase()
        
        return (
          customer.includes(searchLower) ||
          transactionId.includes(searchLower) ||
          editor.includes(searchLower) ||
          field.includes(searchLower)
        )
      })
    })

    onMounted(() => {
      fetchEditLogs()
    })

    return {
      searchQuery,
      editHistory,
      filteredEdits,
      loading,
      formatDateTime,
      formatTransactionId,
      formatValue
    }
  }
}
</script>

<style src="./editlog.css"></style>