<template>
  <div class="login-page">
    <!-- Top cloud banner -->
    <img class="cloud-top" src="/images/Cloudbub.png" alt="clouds" />

    <div class="content-wrapper">
      <div class="left-section">
        <form @submit.prevent="handleLogin" class="login-card">
          <h1 class="login-text">Login</h1>

          <div class="form-group mb-3">
            <label for="username" class="form-label">Email:</label>
            <input 
              id="username" 
              type="text" 
              v-model="username"
              class="form-control form-input" 
              required 
              placeholder=""/>
          </div>

          <div class="form-group mb-3">
            <label for="password" class="form-label">Password:</label>
            <input
              id="password"
              type="password"
              v-model="password"
              class="form-control form-input" 
              required 
              placeholder=""/>        
          </div>

          <div id="message-box" class="mb-3"></div>

          <button type="submit" class="btn login-btn" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span v-if="!isLoading">Login</span>
          </button>
        </form>
      </div>

      <div class="right-section">
        <img class="brand-logo" src="/images/logo%20wit%20name.png" alt="GAMBZ logo" />
        <p class="welcome-text">Welcome to our Dashboard! Please enter your staff credentials.</p>
      </div>
    </div>

    <!-- Bottom-left decorative images -->
    <img class="decor decor-1" src="/images/login-design1.webp" alt="decor1" />
    <img class="decor decor-2" src="/images/login-design2.webp" alt="decor2" />
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      isLoading: false
    }
  },
  methods: {
    async handleLogin() {
      // Validate inputs
      if (!this.username || !this.password) {
        this.showMessage('Please fill in all fields', 'error')
        return
      }

      try {
        // Show loading state
        this.isLoading = true

        // Use the auth store to login
        const authStore = useAuthStore()
        const result = await authStore.login(this.username, this.password)

        if (result.success) {
          // Show success message
          this.showMessage('Login successful! Redirecting...', 'success')

          // Redirect to Overview page
          setTimeout(() => {
            this.$router.push({ name: 'Overview' })
          }, 1000)
        } else {
          // Show error message
          this.showMessage(result.error || 'Login failed. Please check your credentials.', 'error')
        }

      } catch (error) {
        console.error('Login error:', error)
        this.showMessage('Login failed. Please check your credentials.', 'error')
      } finally {
        this.isLoading = false
      }
    },

    showMessage(message, type) {
      const messageBox = document.getElementById('message-box')
      if (messageBox) {
        messageBox.innerHTML = `<div class="alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          const alert = messageBox.querySelector('.alert')
          if (alert) {
            alert.classList.remove('show')
            setTimeout(() => {
              messageBox.innerHTML = ''
            }, 150)
          }
        }, 5000)
      }
    }
  }
}
</script>

<style scoped src="./login.css"></style>