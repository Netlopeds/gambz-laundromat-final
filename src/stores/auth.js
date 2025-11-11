import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)
  const isAdmin = ref(false)

  // Initialize from localStorage
  const initAuth = () => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('username')
    const savedIsAdmin = localStorage.getItem('isAdmin') === 'true'
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
      isAuthenticated.value = true
      isAdmin.value = savedIsAdmin
    }
  }

  // Login with DummyJSON API
  const login = async (username, password) => {
    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password,
        expiresInMins: 60
      })

      // Store token and user info
      token.value = response.data.token
      user.value = response.data.username
      isAuthenticated.value = true

      // Save to localStorage
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('username', response.data.username)
      localStorage.setItem('isLoggedIn', 'true')

      return { success: true, user: response.data }
    } catch (error) {
      console.error('Login failed:', error)
      
      // Fallback to local users if API fails
      const localUsers = [
        { username: 'steve@gmail.com', password: '1234', isAdmin: false },
        { username: 'creeper@gmail.com', password: '0000', isAdmin: false },
        { username: 'admin', password: '123', isAdmin: true }
      ]

      const foundUser = localUsers.find(
        u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      )

      if (foundUser) {
        token.value = 'local-token-' + Date.now()
        user.value = foundUser.username
        isAuthenticated.value = true
        isAdmin.value = foundUser.isAdmin

        localStorage.setItem('authToken', token.value)
        localStorage.setItem('username', foundUser.username)
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('isAdmin', foundUser.isAdmin.toString())

        return { success: true, user: foundUser }
      }

      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid credentials'
      }
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    isAdmin.value = false

    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('cartItems')
  }

  // Getters
  const getUsername = computed(() => user.value)
  const getToken = computed(() => token.value)

  return {
    user,
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