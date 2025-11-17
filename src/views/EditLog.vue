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
              <tr v-for="edit in filteredEdits" :key="edit.id">
                <td>{{ edit.editDateTime }}</td>
                <td>{{ edit.transactionId }}</td>
                <td>{{ edit.customer }}</td>
                <td>
                  <span class="editor-badge">
                    {{ edit.editedBy }}
                  </span>
                </td>
                <td>{{ edit.fieldChanged }}</td>
                <td>{{ edit.oldValue }}</td>
                <td>
                  <span class="new-value">{{ edit.newValue }}</span>
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
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'EditLog',
  components: {
    Navbar
  },
  setup() {
    const searchQuery = ref('')
    
    // Mock data - in a real app, this would come from an API
    const editHistory = ref([
      { 
        id: 1, 
        editDateTime: '2025-11-11 14:30:25', 
        transactionId: 'TXN001', 
        customer: 'John Doe', 
        editedBy: 'admin', 
        fieldChanged: 'Status', 
        oldValue: 'pending', 
        newValue: 'completed' 
      },
      { 
        id: 2, 
        editDateTime: '2025-11-11 13:15:42', 
        transactionId: 'TXN002', 
        customer: 'Jane Smith', 
        editedBy: 'admin', 
        fieldChanged: 'Amount', 
        oldValue: '₱350', 
        newValue: '₱400' 
      },
      { 
        id: 3, 
        editDateTime: '2025-11-10 16:45:10', 
        transactionId: 'TXN003', 
        customer: 'Mike Johnson', 
        editedBy: 'admin', 
        fieldChanged: 'Weight', 
        oldValue: '2.5 kg', 
        newValue: '3 kg' 
      },
      { 
        id: 4, 
        editDateTime: '2025-11-10 10:20:33', 
        transactionId: 'TXN004', 
        customer: 'Sarah Williams', 
        editedBy: 'admin', 
        fieldChanged: 'Service', 
        oldValue: 'Wash Only', 
        newValue: 'Iron Only' 
      },
      { 
        id: 5, 
        editDateTime: '2025-11-09 15:55:18', 
        transactionId: 'TXN005', 
        customer: 'Tom Brown', 
        editedBy: 'admin', 
        fieldChanged: 'Status', 
        oldValue: 'processing', 
        newValue: 'pending' 
      },
      { 
        id: 6, 
        editDateTime: '2025-11-09 11:30:45', 
        transactionId: 'TXN001', 
        customer: 'John Doe', 
        editedBy: 'admin', 
        fieldChanged: 'Customer', 
        oldValue: 'J. Doe', 
        newValue: 'John Doe' 
      },
    ])

    const filteredEdits = computed(() => {
      return editHistory.value.filter(edit => {
        const searchLower = searchQuery.value.toLowerCase()
        return (
          edit.customer.toLowerCase().includes(searchLower) ||
          edit.transactionId.toLowerCase().includes(searchLower) ||
          edit.editedBy.toLowerCase().includes(searchLower) ||
          edit.fieldChanged.toLowerCase().includes(searchLower)
        )
      })
    })

    return {
      searchQuery,
      editHistory,
      filteredEdits
    }
  }
}
</script>

<style src="./editlog.css"></style>