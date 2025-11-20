import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const staffId = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)
  const isAdmin = ref(false)

  // Initialize from localStorage
  const initAuth = () => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('username')
    const savedStaffId = localStorage.getItem('staffId')
    const savedIsAdmin = localStorage.getItem('isAdmin') === 'true'
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
      staffId.value = savedStaffId ? parseInt(savedStaffId) : null
      isAuthenticated.value = true
      isAdmin.value = savedIsAdmin
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
      isAuthenticated.value = true
      isAdmin.value = staffData.role_name === 'Admin'

      // Save to localStorage
      localStorage.setItem('authToken', token.value)
      localStorage.setItem('username', staffData.name)
      localStorage.setItem('staffId', staffData.staff_id.toString())
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('isAdmin', isAdmin.value.toString())

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
    token.value = null
    isAuthenticated.value = false
    isAdmin.value = false

    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    localStorage.removeItem('staffId')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('cartItems')
  }

  // Getters
  const getUsername = computed(() => user.value)
  const getToken = computed(() => token.value)

  return {
    user,
    staffId,
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