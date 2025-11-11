<template>
  <div class="edit-log-page">
    <Navbar />
    <div class="main-content">
      <div class="container">
        <div class="header-section">
          <h1 class="page-title">Edit Log</h1>
          <p class="page-subtitle">Admin-only view of transaction edit history</p>
        </div>

        <!-- Search and Filter Section -->
        <div class="filters-section">
          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search by editor, customer name or transaction ID..."
              class="search-input"
            />
          </div>
        </div>

        <!-- Edit History Table -->
        <div class="table-container">
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
    </div>
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

<style scoped>
@font-face {
  font-family: 'Genty Sans';
  src: url('/fonts/genty-sans-regular.ttf') format('truetype');
}

@font-face {
  font-family: 'Poppins';
  src: url('/fonts/Poppins-Regular.ttf') format('truetype');
  font-weight: 400;
}

@font-face {
  font-family: 'Poppins';
  src: url('/fonts/Poppins-Bold.ttf') format('truetype');
  font-weight: 700;
}

.edit-log-page {
  display: flex;
  min-height: 100vh;
  background: #bef0fb;
  font-family: 'Poppins', sans-serif;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 40px;
}

.container {
  max-width: 1400px;
}

.header-section {
  margin-bottom: 30px;
}

.page-title {
  font-family: 'Genty Sans', sans-serif;
  font-size: 48px;
  color: #17696d;
  margin: 0 0 10px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.search-box {
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  border: 2px solid #5de0e6;
  border-radius: 25px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #004aad;
  box-shadow: 0 0 10px rgba(93, 224, 230, 0.3);
}

.table-container {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table thead {
  background: linear-gradient(90deg, #5de0e6 0%, #004aad 100%);
}

.transactions-table th {
  padding: 15px;
  text-align: left;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
}

.transactions-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
}

.transactions-table tbody tr:hover {
  background-color: #f8f9fa;
}

.transactions-table td {
  padding: 15px;
  font-size: 14px;
  color: #333;
}

.editor-badge {
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  background: linear-gradient(90deg, #5de0e6 0%, #004aad 100%);
  color: white;
}

.new-value {
  font-weight: 600;
  color: #28a745;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 200px;
    padding: 30px;
  }

  .page-title {
    font-size: 40px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 80px;
    padding: 20px;
  }

  .page-title {
    font-size: 32px;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }

  .table-container {
    overflow-x: scroll;
  }

  .transactions-table {
    min-width: 900px;
  }
}

@media (max-width: 480px) {
  .main-content {
    margin-left: 60px;
    padding: 15px;
  }

  .page-title {
    font-size: 28px;
  }
}
</style>
