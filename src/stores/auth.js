import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const staffId = ref(null)
  const roleId = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)
  const isAdmin = ref(false)

  // Initialize from localStorage
  const initAuth = () => {
    const savedAuth = localStorage.getItem('auth')
    
    if (savedAuth) {
      const auth = JSON.parse(savedAuth)
      token.value = auth.token
      user.value = auth.username
      staffId.value = auth.staffId
      roleId.value = auth.roleId
      isAuthenticated.value = true
      isAdmin.value = auth.roleId === 1
    }
  }

  // Login with backend API
  const login = async (email, password) => {
    try {
      const response = await api.staff.login({ email, password })
      const staffData = response.data

      // Store token and user info
      token.value = 'staff-token-' + Date.now()
      user.value = staffData.name
      staffId.value = staffData.staff_id
      roleId.value = staffData.role_id
      isAuthenticated.value = true
      isAdmin.value = staffData.role_id === 1

      // Save to localStorage as single auth object
      const authData = {
        token: token.value,
        username: staffData.name,
        staffId: staffData.staff_id,
        roleId: staffData.role_id
      }
      localStorage.setItem('auth', JSON.stringify(authData))

      return { success: true, user: staffData }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Invalid credentials'
      }
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    staffId.value = null
    roleId.value = null
    token.value = null
    isAuthenticated.value = false
    isAdmin.value = false

    localStorage.removeItem('auth')
    localStorage.removeItem('cartItems')
  }

  // Getters
  const getUsername = computed(() => user.value)
  const getToken = computed(() => token.value)

  return {
    user,
    staffId,
    roleId,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    initAuth,
    getUsername,
    getToken
  }
})