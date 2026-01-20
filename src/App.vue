<template>
  <div id="app" :class="theme">
    <Navbar @theme-changed="updateTheme" />
    <main class="main-content">
      <router-view />
    </main>
    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2026 Eco Pakalpojumi - Building a Sustainable Future 🌱</p>
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      theme: localStorage.getItem('theme') || 'light'
    }
  },
  watch: {
    '$route'(to, from) {
      // Route changed, component will re-render
    }
  },
  mounted() {
    // Set initial theme
    const currentTheme = localStorage.getItem('theme') || 'light'
    this.theme = currentTheme
    document.documentElement.setAttribute('data-theme', currentTheme)
  },
  methods: {
    updateTheme(newTheme) {
      this.theme = newTheme
    }
  }
}
</script>

<style>
:root {
  --bg-color: #f0f8f0;
  --text-color: #2c3e50;
  --text-secondary: #7f8c8d;
  --nav-bg: #e8f5e8;
  --card-bg: #ffffff;
  --border-color: #c8e6c9;
  --button-bg: #4caf50;
  --button-hover: #45a049;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.dark {
  --bg-color: #1a1a1a;
  --text-color: #e0e0e0;
  --text-secondary: #b0b0b0;
  --nav-bg: #2a2a2a;
  --card-bg: #333333;
  --border-color: #555555;
  --button-bg: #66bb6a;
  --button-hover: #5cb85c;
}

* {
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background: linear-gradient(135deg, var(--bg-color) 0%, #c8e6c9 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

.app-footer {
  background: var(--nav-bg);
  border-top: 2px solid var(--border-color);
  padding: 20px 0;
  margin-top: auto;
}

.app-footer .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px 0;
  }

  .app-footer .container {
    padding: 0 15px;
  }
}
</style>