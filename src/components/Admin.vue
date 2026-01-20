<template>
  <div class="admin-dashboard">
    <!-- Top Navigation Bar -->
    <header class="admin-topbar">
      <div class="topbar-left">
        <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
          <span>☰</span>
        </button>
        <div class="admin-branding">
          <span class="admin-logo">🌱</span>
          <span class="admin-title">Eco Admin</span>
        </div>
      </div>
      <div class="topbar-center">
        <div class="global-search">
          <span class="search-icon">🔍</span>
          <input type="text" v-model="globalSearch" placeholder="Search anything..." />
          <kbd>⌘K</kbd>
        </div>
      </div>
      <div class="topbar-right">
        <button class="topbar-btn" title="Back to Site" @click="goToSite">
          <span>🏠</span>
        </button>
        <button class="topbar-btn" title="Refresh Data" @click="loadAllData">
          <span :class="{ spinning: refreshing }">🔄</span>
        </button>
        <div class="topbar-divider"></div>
        <div class="admin-profile" @click="showProfileMenu = !showProfileMenu">
          <div class="profile-avatar">{{ currentUser?.name?.charAt(0)?.toUpperCase() || 'A' }}</div>
          <span class="profile-name">{{ currentUser?.name || 'Admin' }}</span>
          <span class="profile-dropdown-arrow">▼</span>
          
          <!-- Profile Dropdown Menu -->
          <div v-if="showProfileMenu" class="profile-dropdown">
            <div class="dropdown-header">
              <span class="dropdown-email">{{ currentUser?.email || 'admin@eco.lv' }}</span>
              <span class="dropdown-role">{{ currentUser?.role || 'Admin' }}</span>
            </div>
            <div class="dropdown-divider"></div>
            <button @click="goToProfile" class="dropdown-item">
              <span>👤</span> My Profile
            </button>
            <button @click="goToSite" class="dropdown-item">
              <span>🏠</span> Back to Site
            </button>
            <div class="dropdown-divider"></div>
            <button @click="logout" class="dropdown-item dropdown-logout">
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="admin-layout">
      <!-- Sidebar Navigation -->
      <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <nav class="admin-nav">
          <div class="nav-section">
            <span class="nav-section-title">Main</span>
            <button
              v-for="tab in mainTabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['nav-item', { active: activeTab === tab.id }]"
            >
              <span class="nav-icon">{{ tab.icon }}</span>
              <span class="nav-label">{{ tab.label }}</span>
              <span v-if="tab.count !== undefined && tab.count > 0" class="nav-badge">{{ tab.count }}</span>
            </button>
          </div>
          <div class="nav-section">
            <span class="nav-section-title">Content</span>
            <button
              v-for="tab in contentTabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['nav-item', { active: activeTab === tab.id }]"
            >
              <span class="nav-icon">{{ tab.icon }}</span>
              <span class="nav-label">{{ tab.label }}</span>
              <span v-if="tab.count !== undefined && tab.count > 0" class="nav-badge">{{ tab.count }}</span>
            </button>
          </div>
          <div class="nav-section">
            <span class="nav-section-title">Settings</span>
            <button
              v-for="tab in settingsTabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['nav-item', { active: activeTab === tab.id }]"
            >
              <span class="nav-icon">{{ tab.icon }}</span>
              <span class="nav-label">{{ tab.label }}</span>
            </button>
          </div>
        </nav>
        <div class="sidebar-footer">
          <div class="eco-score">
            <div class="score-circle">
              <span class="score-value">92</span>
            </div>
            <div class="score-info">
              <span class="score-label">Eco Score</span>
              <span class="score-status">Excellent</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="admin-content" :class="{ expanded: sidebarCollapsed }">
        <!-- Dashboard Overview Tab -->
        <div v-if="activeTab === 'dashboard'" class="admin-section">
          <div class="section-title-bar">
            <div>
              <h2>📊 Dashboard Overview</h2>
              <p class="section-subtitle">Welcome back! Here's what's happening with your eco-store.</p>
            </div>
            <div class="title-actions">
              <select v-model="dateRange" class="date-select">
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card stat-users">
              <div class="stat-header">
                <span class="stat-icon-bg">👥</span>
                <span class="stat-trend up">+12%</span>
              </div>
              <div class="stat-body">
                <span class="stat-value">{{ stats.totalUsers }}</span>
                <span class="stat-label">Total Users</span>
              </div>
              <div class="stat-footer">
                <span class="stat-compare">vs last month</span>
              </div>
            </div>
            <div class="stat-card stat-products">
              <div class="stat-header">
                <span class="stat-icon-bg">🛍️</span>
                <span class="stat-trend up">+5%</span>
              </div>
              <div class="stat-body">
                <span class="stat-value">{{ stats.totalProducts }}</span>
                <span class="stat-label">Products</span>
              </div>
              <div class="stat-footer">
                <span class="stat-compare">Active listings</span>
              </div>
            </div>
            <div class="stat-card stat-orders">
              <div class="stat-header">
                <span class="stat-icon-bg">📦</span>
                <span class="stat-trend up">+23%</span>
              </div>
              <div class="stat-body">
                <span class="stat-value">{{ stats.totalOrders }}</span>
                <span class="stat-label">Orders</span>
              </div>
              <div class="stat-footer">
                <span class="stat-compare">This period</span>
              </div>
            </div>
            <div class="stat-card stat-revenue">
              <div class="stat-header">
                <span class="stat-icon-bg">💰</span>
                <span class="stat-trend up">+18%</span>
              </div>
              <div class="stat-body">
                <span class="stat-value">€{{ calculateRevenue() }}</span>
                <span class="stat-label">Revenue</span>
              </div>
              <div class="stat-footer">
                <span class="stat-compare">Total earnings</span>
              </div>
            </div>
          </div>

          <div class="dashboard-grid">
            <div class="dashboard-card recent-orders-card">
              <div class="card-header">
                <h3>📦 Recent Orders</h3>
                <button class="card-action" @click="activeTab = 'orders'">View All →</button>
              </div>
              <div class="card-body">
                <div v-if="orders.length > 0" class="mini-table">
                  <div v-for="order in orders.slice(0, 5)" :key="order.id" class="mini-row">
                    <span class="order-id">#{{ order.id }}</span>
                    <span class="order-customer">{{ order.user_name }}</span>
                    <span class="order-total">€{{ order.total?.toFixed(2) }}</span>
                    <span :class="['order-status', order.status]">{{ order.status }}</span>
                  </div>
                </div>
                <div v-else class="empty-card">
                  <span>📭</span>
                  <p>No orders yet</p>
                </div>
              </div>
            </div>

            <div class="dashboard-card activity-card">
              <div class="card-header">
                <h3>🕐 Recent Activity</h3>
              </div>
              <div class="card-body">
                <div class="activity-timeline">
                  <div v-for="activity in recentActivity" :key="activity.id" class="timeline-item">
                    <span class="timeline-icon">{{ activity.icon }}</span>
                    <div class="timeline-content">
                      <p>{{ activity.text }}</p>
                      <span class="timeline-time">{{ activity.time }}</span>
                    </div>
                  </div>
                  <div v-if="recentActivity.length === 0" class="empty-card">
                    <span>📝</span>
                    <p>No recent activity</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="dashboard-card quick-actions-card">
              <div class="card-header">
                <h3>⚡ Quick Actions</h3>
              </div>
              <div class="card-body">
                <div class="quick-actions">
                  <button class="quick-action" @click="openProductModal()">
                    <span class="qa-icon">➕</span>
                    <span class="qa-label">Add Product</span>
                  </button>
                  <button class="quick-action" @click="activeTab = 'orders'">
                    <span class="qa-icon">📋</span>
                    <span class="qa-label">View Orders</span>
                  </button>
                  <button class="quick-action" @click="activeTab = 'users'">
                    <span class="qa-icon">👥</span>
                    <span class="qa-label">Manage Users</span>
                  </button>
                  <button class="quick-action" @click="loadAllData">
                    <span class="qa-icon">🔄</span>
                    <span class="qa-label">Refresh Data</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="dashboard-card top-products-card">
              <div class="card-header">
                <h3>🏆 Top Products</h3>
                <button class="card-action" @click="activeTab = 'products'">View All →</button>
              </div>
              <div class="card-body">
                <div v-if="products.length > 0" class="top-products-list">
                  <div v-for="(product, index) in products.slice(0, 4)" :key="product.id" class="top-product-item">
                    <span class="product-rank">{{ index + 1 }}</span>
                    <div class="product-thumb">
                      <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
                      <span v-else>🌱</span>
                    </div>
                    <div class="product-details">
                      <span class="product-name">{{ product.name }}</span>
                      <span class="product-cat">{{ product.category }}</span>
                    </div>
                    <span class="product-price">€{{ product.price?.toFixed(2) }}</span>
                  </div>
                </div>
                <div v-else class="empty-card">
                  <span>📦</span>
                  <p>No products yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'" class="admin-section">
          <div class="section-title-bar">
            <div>
              <h2>👥 User Management</h2>
              <p class="section-subtitle">Manage user accounts and permissions</p>
            </div>
            <div class="title-actions">
              <div class="search-box">
                <span class="search-icon">🔍</span>
                <input v-model="userSearch" placeholder="Search users..." class="search-input" />
              </div>
            </div>
          </div>

          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id" :class="{ 'row-blocked': user.blocked }">
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar-sm" :class="user.role">
                        {{ user.name?.charAt(0).toUpperCase() }}
                      </div>
                      <div class="user-info-cell">
                        <span class="user-name">{{ user.name }}</span>
                        <span class="user-id">ID: {{ user.id }}</span>
                      </div>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="['badge', 'badge-' + user.role]">
                      {{ user.role === 'admin' ? '👑 Admin' : '👤 User' }}
                    </span>
                  </td>
                  <td>
                    <span :class="['badge', user.blocked ? 'badge-danger' : 'badge-success']">
                      {{ user.blocked ? '🔒 Blocked' : '✅ Active' }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.created_at) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button @click="editUser(user)" class="btn-icon btn-edit" title="Edit">✏️</button>
                      <button @click="toggleUserBlock(user)" :class="['btn-icon', user.blocked ? 'btn-success' : 'btn-warning']" :title="user.blocked ? 'Unblock' : 'Block'">
                        {{ user.blocked ? '🔓' : '🔒' }}
                      </button>
                      <button @click="deleteUser(user)" class="btn-icon btn-danger" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="6" class="empty-table">
                    <div class="empty-state">
                      <span>👥</span>
                      <p>No users found</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Products Tab -->
        <div v-if="activeTab === 'products'" class="admin-section">
          <div class="section-title-bar">
            <div>
              <h2>🛍️ Product Management</h2>
              <p class="section-subtitle">Manage your eco-friendly product catalog</p>
            </div>
            <div class="title-actions">
              <div class="search-box">
                <span class="search-icon">🔍</span>
                <input v-model="productSearch" placeholder="Search products..." class="search-input" />
              </div>
              <button @click="openProductModal()" class="btn-primary">
                <span>➕</span> Add Product
              </button>
            </div>
          </div>

          <div class="products-grid-admin">
            <div v-for="product in filteredProducts" :key="product.id" class="product-card-admin">
              <div class="product-image-admin">
                <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
                <div v-else class="no-image-admin">🌱</div>
                <div class="product-overlay-admin">
                  <button @click="openProductModal(product)" class="overlay-btn">✏️ Edit</button>
                  <button @click="deleteProduct(product.id)" class="overlay-btn danger">🗑️ Delete</button>
                </div>
              </div>
              <div class="product-info-admin">
                <span class="product-category-admin">{{ product.category }}</span>
                <h4>{{ product.name }}</h4>
                <p class="product-desc-admin">{{ truncateText(product.description, 60) }}</p>
                <div class="product-meta-admin">
                  <span class="product-price-admin">€{{ product.price?.toFixed(2) }}</span>
                  <span :class="['product-stock-admin', product.stock < 10 ? 'low' : '']">
                    {{ product.stock }} in stock
                  </span>
                </div>
              </div>
            </div>
            <div v-if="filteredProducts.length === 0" class="empty-products">
              <span>📦</span>
              <p>No products found</p>
              <button @click="openProductModal()" class="btn-primary">Add First Product</button>
            </div>
          </div>
        </div>

        <!-- Orders Tab -->
        <div v-if="activeTab === 'orders'" class="admin-section">
          <div class="section-title-bar">
            <div>
              <h2>📦 Order Management</h2>
              <p class="section-subtitle">Track and manage customer orders</p>
            </div>
            <div class="title-actions">
              <div class="filter-tabs">
                <button :class="['filter-tab', { active: orderFilter === '' }]" @click="orderFilter = ''">All</button>
                <button :class="['filter-tab', { active: orderFilter === 'pending' }]" @click="orderFilter = 'pending'">⏳ Pending</button>
                <button :class="['filter-tab', { active: orderFilter === 'processing' }]" @click="orderFilter = 'processing'">🔄 Processing</button>
                <button :class="['filter-tab', { active: orderFilter === 'shipped' }]" @click="orderFilter = 'shipped'">🚚 Shipped</button>
                <button :class="['filter-tab', { active: orderFilter === 'delivered' }]" @click="orderFilter = 'delivered'">✅ Delivered</button>
              </div>
            </div>
          </div>

          <div class="orders-list">
            <div v-for="order in filteredOrders" :key="order.id" class="order-card">
              <div class="order-header">
                <div class="order-id-badge">#{{ order.id }}</div>
                <select 
                  :value="order.status" 
                  @change="updateOrderStatus(order.id, $event.target.value)"
                  :class="['status-dropdown', order.status]"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="processing">🔄 Processing</option>
                  <option value="shipped">🚚 Shipped</option>
                  <option value="delivered">✅ Delivered</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>
              <div class="order-body">
                <div class="order-detail">
                  <span class="detail-label">Customer</span>
                  <span class="detail-value">{{ order.user_name }}</span>
                </div>
                <div class="order-detail">
                  <span class="detail-label">Items</span>
                  <span class="detail-value">{{ order.item_count || 1 }} products</span>
                </div>
                <div class="order-detail">
                  <span class="detail-label">Date</span>
                  <span class="detail-value">{{ formatDate(order.created_at) }}</span>
                </div>
              </div>
              <div class="order-footer">
                <span class="order-total">€{{ order.total?.toFixed(2) }}</span>
                <div class="order-actions">
                  <button @click="viewOrderDetails(order)" class="btn-icon btn-view">👁️</button>
                  <button @click="deleteOrder(order.id)" class="btn-icon btn-danger">🗑️</button>
                </div>
              </div>
            </div>
            <div v-if="filteredOrders.length === 0" class="empty-orders">
              <span>📭</span>
              <p>No orders found</p>
            </div>
          </div>
        </div>

        <!-- Forum Management Tab -->
        <div v-if="activeTab === 'forum'" class="admin-section">
          <div class="section-title-bar">
            <div>
              <h2>💬 Forum Management</h2>
              <p class="section-subtitle">Moderate community discussions</p>
            </div>
            <div class="title-actions">
              <div class="search-box">
                <span class="search-icon">🔍</span>
                <input v-model="forumSearch" placeholder="Search posts..." class="search-input" />
              </div>
            </div>
          </div>

          <div class="posts-list">
            <div v-for="post in filteredPosts" :key="post.id" class="post-card">
              <div class="post-main">
                <h4>{{ post.title }}</h4>
                <p class="post-excerpt">{{ truncateText(post.content, 120) }}</p>
                <div class="post-meta">
                  <span class="post-author">👤 {{ post.author_name }}</span>
                  <span class="post-date">📅 {{ formatDate(post.created_at) }}</span>
                  <span class="post-comments">💬 {{ post.comment_count || 0 }} comments</span>
                </div>
              </div>
              <div class="post-actions">
                <button @click="viewPost(post)" class="btn-icon btn-view">👁️</button>
                <button @click="deletePost(post.id)" class="btn-icon btn-danger">🗑️</button>
              </div>
            </div>
            <div v-if="filteredPosts.length === 0" class="empty-posts">
              <span>💬</span>
              <p>No forum posts found</p>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="admin-section">
          <div class="section-title-bar">
            <div>
              <h2>⚙️ Settings</h2>
              <p class="section-subtitle">Configure your admin dashboard</p>
            </div>
          </div>

          <div class="settings-grid">
            <div class="settings-card">
              <h3>🏪 Store Settings</h3>
              <div class="setting-item">
                <label>Store Name</label>
                <input type="text" value="Eco Pakalpojumi" class="setting-input" />
              </div>
              <div class="setting-item">
                <label>Currency</label>
                <select class="setting-input">
                  <option value="EUR">€ EUR</option>
                  <option value="USD">$ USD</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>
              <button class="btn-primary">💾 Save Changes</button>
            </div>
            <div class="settings-card">
              <h3>📧 Notifications</h3>
              <div class="setting-toggle">
                <span>Email on new orders</span>
                <label class="toggle">
                  <input type="checkbox" checked />
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="setting-toggle">
                <span>Email on new users</span>
                <label class="toggle">
                  <input type="checkbox" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="setting-toggle">
                <span>Low stock alerts</span>
                <label class="toggle">
                  <input type="checkbox" checked />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- User Edit Modal -->
    <div v-if="showUserModal" class="modal-overlay" @click.self="closeUserModal">
      <div class="modal">
        <div class="modal-header">
          <h3>✏️ Edit User</h3>
          <button @click="closeUserModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Name</label>
            <input v-model="userForm.name" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="userForm.email" type="email" class="form-input" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select v-model="userForm.role" class="form-input">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="userForm.blocked" class="form-input">
              <option :value="false">Active</option>
              <option :value="true">Blocked</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeUserModal" class="btn-secondary">Cancel</button>
          <button @click="saveUser" class="btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="showProductModal" class="modal-overlay" @click.self="closeProductModal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>{{ productForm.id ? '✏️ Edit Product' : '➕ Add Product' }}</h3>
          <button @click="closeProductModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Product Name *</label>
              <input v-model="productForm.name" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Category *</label>
              <select v-model="productForm.category" class="form-input" required>
                <option value="">Select category</option>
                <option value="Solar">☀️ Solar</option>
                <option value="Water">💧 Water</option>
                <option value="Energy">⚡ Energy</option>
                <option value="Garden">🌱 Garden</option>
                <option value="Home">🏠 Home</option>
                <option value="Transport">🚲 Transport</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="productForm.description" class="form-input" rows="3"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Price (€) *</label>
              <input v-model.number="productForm.price" type="number" step="0.01" min="0" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Stock *</label>
              <input v-model.number="productForm.stock" type="number" min="0" class="form-input" required />
            </div>
          </div>
          <div class="form-group">
            <label>Product Image</label>
            <div class="image-upload-section">
              <div v-if="productForm.image_url" class="image-preview">
                <img :src="productForm.image_url" alt="Product preview" />
                <button type="button" @click="removeImage" class="remove-image-btn">×</button>
              </div>
              <div v-else class="upload-area">
                <input 
                  type="file" 
                  ref="imageInput" 
                  @change="handleImageUpload" 
                  accept="image/*" 
                  class="file-input"
                  id="product-image"
                />
                <label for="product-image" class="upload-label">
                  <span class="upload-icon">📁</span>
                  <span>Click to upload image</span>
                  <span class="upload-hint">JPG, PNG, GIF, WebP (max 5MB)</span>
                </label>
              </div>
              <div v-if="uploadingImage" class="upload-progress">
                <span>Uploading...</span>
              </div>
            </div>
            <div class="image-url-fallback">
              <span class="or-divider">OR</span>
              <input v-model="productForm.image_url" type="url" class="form-input" placeholder="Paste image URL here..." />
            </div>
          </div>
          <div class="form-group">
            <label>Lifecycle Info (Eco Impact)</label>
            <textarea v-model="productForm.lifecycle_info" class="form-input" rows="2" placeholder="Environmental impact information..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeProductModal" class="btn-secondary">Cancel</button>
          <button @click="saveProduct" class="btn-primary" :disabled="loading || uploadingImage">
            {{ loading ? 'Saving...' : (productForm.id ? 'Update Product' : 'Add Product') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
      activeTab: 'dashboard',
      sidebarCollapsed: false,
      globalSearch: '',
      dateRange: 'month',
      refreshing: false,
      mainTabs: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'orders', label: 'Orders', icon: '📦', count: 0 },
      ],
      contentTabs: [
        { id: 'users', label: 'Users', icon: '👥', count: 0 },
        { id: 'products', label: 'Products', icon: '🛍️', count: 0 },
        { id: 'forum', label: 'Forum', icon: '💬', count: 0 },
      ],
      settingsTabs: [
        { id: 'settings', label: 'Settings', icon: '⚙️' },
      ],
      stats: {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalPosts: 0
      },
      recentActivity: [],
      users: [],
      products: [],
      orders: [],
      posts: [],
      userSearch: '',
      productSearch: '',
      forumSearch: '',
      orderFilter: '',
      showUserModal: false,
      showProductModal: false,
      loading: false,
      uploadingImage: false,
      showProfileMenu: false,
      currentUser: null,
      userForm: {
        id: null,
        name: '',
        email: '',
        role: 'user',
        blocked: false
      },
      productForm: {
        id: null,
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image_url: '',
        lifecycle_info: ''
      }
    }
  },
  computed: {
    filteredUsers() {
      if (!this.userSearch) return this.users
      const search = this.userSearch.toLowerCase()
      return this.users.filter(u => 
        u.name?.toLowerCase().includes(search) || 
        u.email?.toLowerCase().includes(search)
      )
    },
    filteredProducts() {
      if (!this.productSearch) return this.products
      const search = this.productSearch.toLowerCase()
      return this.products.filter(p => 
        p.name?.toLowerCase().includes(search) || 
        p.category?.toLowerCase().includes(search)
      )
    },
    filteredOrders() {
      if (!this.orderFilter) return this.orders
      return this.orders.filter(o => o.status === this.orderFilter)
    },
    filteredPosts() {
      if (!this.forumSearch) return this.posts
      const search = this.forumSearch.toLowerCase()
      return this.posts.filter(p => 
        p.title?.toLowerCase().includes(search) ||
        p.author_name?.toLowerCase().includes(search)
      )
    }
  },
  mounted() {
    this.loadCurrentUser()
    this.loadAllData()
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    handleClickOutside(event) {
      const profileEl = document.querySelector('.admin-profile')
      if (profileEl && !profileEl.contains(event.target)) {
        this.showProfileMenu = false
      }
    },
    loadCurrentUser() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          this.currentUser = JSON.parse(userStr)
        } catch (e) {
          console.error('Error parsing user data:', e)
        }
      }
    },
    goToSite() {
      this.$router.push('/')
    },
    goToProfile() {
      this.$router.push('/profile')
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    async loadAllData() {
      this.refreshing = true
      await Promise.all([
        this.loadUsers(),
        this.loadProducts(),
        this.loadOrders(),
        this.loadPosts()
      ])
      this.loadStats()
      this.updateTabCounts()
      setTimeout(() => { this.refreshing = false }, 500)
    },
    updateTabCounts() {
      this.mainTabs.find(t => t.id === 'orders').count = this.orders.length
      this.contentTabs.find(t => t.id === 'users').count = this.users.length
      this.contentTabs.find(t => t.id === 'products').count = this.products.length
      this.contentTabs.find(t => t.id === 'forum').count = this.posts.length
    },
    calculateRevenue() {
      const total = this.orders.reduce((sum, order) => sum + (order.total || 0), 0)
      return total.toFixed(2)
    },
    truncateText(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    },
    loadStats() {
      this.stats = {
        totalUsers: this.users.length,
        totalProducts: this.products.length,
        totalOrders: this.orders.length,
        totalPosts: this.posts.length
      }
      
      // Build recent activity from latest data
      this.recentActivity = []
      
      if (this.users.length > 0) {
        const latestUser = this.users[this.users.length - 1]
        this.recentActivity.push({
          id: 'user-' + latestUser.id,
          icon: '👤',
          text: `New user registered: ${latestUser.name}`,
          time: 'Recently'
        })
      }
      
      if (this.orders.length > 0) {
        const latestOrder = this.orders[0]
        this.recentActivity.push({
          id: 'order-' + latestOrder?.id,
          icon: '📦',
          text: `New order #${latestOrder?.id} - €${latestOrder?.total?.toFixed(2)}`,
          time: 'Recently'
        })
      }
    },
    async loadUsers() {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch('http://localhost:3000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        this.users = Array.isArray(data) ? data : []
      } catch (error) {
        console.error('Error loading users:', error)
        this.users = []
      }
    },
    async loadProducts() {
      try {
        const response = await fetch('http://localhost:3000/api/products')
        const data = await response.json()
        this.products = data.products || data || []
      } catch (error) {
        console.error('Error loading products:', error)
        this.products = []
      }
    },
    async loadOrders() {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch('http://localhost:3000/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        this.orders = Array.isArray(data) ? data : []
      } catch (error) {
        console.error('Error loading orders:', error)
        this.orders = []
      }
    },
    async loadPosts() {
      try {
        const response = await fetch('http://localhost:3000/api/posts')
        const data = await response.json()
        this.posts = data.posts || data || []
      } catch (error) {
        console.error('Error loading posts:', error)
        this.posts = []
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A'
      try {
        return new Date(dateStr).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch {
        return dateStr
      }
    },
    // User Management
    editUser(user) {
      this.userForm = { ...user }
      this.showUserModal = true
    },
    closeUserModal() {
      this.showUserModal = false
      this.userForm = { id: null, name: '', email: '', role: 'user', blocked: false }
    },
    async saveUser() {
      this.loading = true
      const token = localStorage.getItem('token')
      try {
        // Update role
        await fetch(`http://localhost:3000/api/admin/users/${this.userForm.id}/role`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ role: this.userForm.role })
        })
        
        // Update blocked status
        await fetch(`http://localhost:3000/api/admin/users/${this.userForm.id}/block`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ blocked: this.userForm.blocked })
        })
        
        // If editing the current logged-in user, update localStorage
        if (this.currentUser && this.currentUser.id === this.userForm.id) {
          const updatedUser = { ...this.currentUser, role: this.userForm.role, blocked: this.userForm.blocked }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          this.currentUser = updatedUser
          
          // If current user is no longer admin, redirect to home
          if (this.userForm.role !== 'admin') {
            alert('Your admin privileges have been removed. You will be redirected.')
            this.$router.push('/')
            return
          }
        }
        
        await this.loadUsers()
        this.closeUserModal()
      } catch (error) {
        alert('Error saving user: ' + error.message)
      } finally {
        this.loading = false
      }
    },
    async toggleUserBlock(user) {
      const token = localStorage.getItem('token')
      try {
        await fetch(`http://localhost:3000/api/admin/users/${user.id}/block`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ blocked: !user.blocked })
        })
        await this.loadUsers()
      } catch (error) {
        alert('Error updating user: ' + error.message)
      }
    },
    async deleteUser(user) {
      if (!confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) return
      
      const token = localStorage.getItem('token')
      try {
        await fetch(`http://localhost:3000/api/admin/users/${user.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        await this.loadUsers()
        this.updateTabCounts()
      } catch (error) {
        alert('Error deleting user: ' + error.message)
      }
    },
    // Product Management
    openProductModal(product = null) {
      if (product) {
        this.productForm = { ...product }
      } else {
        this.productForm = {
          id: null,
          name: '',
          description: '',
          price: '',
          category: '',
          stock: 0,
          image_url: '',
          lifecycle_info: ''
        }
      }
      this.showProductModal = true
    },
    closeProductModal() {
      this.showProductModal = false
      this.productForm = {
        id: null,
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image_url: '',
        lifecycle_info: ''
      }
      // Clear file input
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = ''
      }
    },
    async handleImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('Only image files are allowed (JPG, PNG, GIF, WebP)')
        return
      }

      this.uploadingImage = true
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          this.productForm.image_url = data.url
        } else {
          const error = await response.json()
          alert('Upload failed: ' + (error.error || 'Unknown error'))
        }
      } catch (error) {
        alert('Upload error: ' + error.message)
      } finally {
        this.uploadingImage = false
      }
    },
    removeImage() {
      this.productForm.image_url = ''
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = ''
      }
    },
    async saveProduct() {
      if (!this.productForm.name || !this.productForm.price || !this.productForm.category) {
        alert('Please fill in all required fields')
        return
      }
      
      this.loading = true
      const token = localStorage.getItem('token')
      const method = this.productForm.id ? 'PUT' : 'POST'
      const url = this.productForm.id
        ? `http://localhost:3000/api/products/${this.productForm.id}`
        : 'http://localhost:3000/api/products'

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.productForm)
        })

        if (response.ok) {
          await this.loadProducts()
          this.updateTabCounts()
          this.closeProductModal()
        } else {
          const data = await response.json()
          alert('Error: ' + (data.error || 'Failed to save product'))
        }
      } catch (error) {
        alert('Error saving product: ' + error.message)
      } finally {
        this.loading = false
      }
    },
    async deleteProduct(id) {
      if (!confirm('Are you sure you want to delete this product?')) return

      const token = localStorage.getItem('token')
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (response.ok) {
          await this.loadProducts()
          this.updateTabCounts()
        } else {
          alert('Error deleting product')
        }
      } catch (error) {
        alert('Error deleting product: ' + error.message)
      }
    },
    // Order Management
    async updateOrderStatus(orderId, status) {
      const token = localStorage.getItem('token')
      try {
        await fetch(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        })
        await this.loadOrders()
      } catch (error) {
        alert('Error updating order: ' + error.message)
      }
    },
    viewOrderDetails(order) {
      alert(`Order #${order.id}\nCustomer: ${order.user_name}\nTotal: €${order.total?.toFixed(2)}\nStatus: ${order.status}\nDate: ${this.formatDate(order.created_at)}`)
    },
    async deleteOrder(id) {
      if (!confirm('Are you sure you want to delete this order?')) return

      const token = localStorage.getItem('token')
      try {
        await fetch(`http://localhost:3000/api/admin/orders/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        await this.loadOrders()
        this.updateTabCounts()
      } catch (error) {
        alert('Error deleting order: ' + error.message)
      }
    },
    // Forum Management
    viewPost(post) {
      alert(`Post: ${post.title}\nAuthor: ${post.author_name}\nContent: ${post.content?.substring(0, 200)}...`)
    },
    async deletePost(id) {
      if (!confirm('Are you sure you want to delete this post?')) return

      const token = localStorage.getItem('token')
      try {
        await fetch(`http://localhost:3000/api/admin/posts/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        await this.loadPosts()
        this.updateTabCounts()
      } catch (error) {
        alert('Error deleting post: ' + error.message)
      }
    },
    // Placeholder methods
    openEducationModal() {
      alert('Education management coming soon!')
    },
    openServiceModal() {
      alert('Services management coming soon!')
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0d1f3c 100%);
  display: flex;
  flex-direction: column;
  position: relative;
}

.admin-dashboard::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 20% 0%, rgba(46, 204, 113, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(52, 152, 219, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(155, 89, 182, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.admin-dashboard > * {
  position: relative;
  z-index: 1;
}

/* Top Navigation Bar */
.admin-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(15, 15, 30, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(46, 204, 113, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  z-index: 100;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.sidebar-toggle {
  width: 46px;
  height: 46px;
  border: 2px solid rgba(46, 204, 113, 0.35);
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.15), rgba(39, 174, 96, 0.08));
  border-radius: 14px;
  cursor: pointer;
  font-size: 1.4em;
  color: #2ecc71;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.sidebar-toggle::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(46, 204, 113, 0.4), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-toggle:hover::before {
  opacity: 1;
}

.sidebar-toggle:hover {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.35), rgba(39, 174, 96, 0.2));
  border-color: #2ecc71;
  transform: scale(1.08);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
}

.sidebar-toggle:active {
  transform: scale(0.95);
}

.admin-branding {
  display: flex;
  align-items: center;
  gap: 14px;
}

.admin-logo {
  font-size: 2em;
  filter: drop-shadow(0 0 15px rgba(46, 204, 113, 0.6));
  animation: float-logo 3s ease-in-out infinite, pulse-logo 4s ease-in-out infinite;
}

@keyframes float-logo {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(3deg); }
}

@keyframes pulse-logo {
  0%, 100% { filter: drop-shadow(0 0 15px rgba(46, 204, 113, 0.6)); }
  50% { filter: drop-shadow(0 0 25px rgba(46, 204, 113, 0.9)); }
}

.admin-title {
  font-size: 1.4em;
  font-weight: 800;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 50%, #58d68d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.topbar-center {
  flex: 1;
  max-width: 500px;
  margin: 0 40px;
}

.global-search {
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
  border: 2px solid rgba(46, 204, 113, 0.2);
  border-radius: 16px;
  padding: 0 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.global-search::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 18px;
  padding: 2px;
  background: linear-gradient(135deg, transparent, rgba(46, 204, 113, 0.4), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.global-search:focus-within::before {
  opacity: 1;
}

.global-search:focus-within {
  border-color: rgba(46, 204, 113, 0.6);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  box-shadow: 0 0 35px rgba(46, 204, 113, 0.3), inset 0 0 20px rgba(46, 204, 113, 0.05);
  transform: scale(1.02);
}

.global-search .search-icon {
  font-size: 1.1em;
  margin-right: 10px;
  opacity: 0.6;
}

.global-search input {
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  font-size: 0.95em;
  color: #fff;
  outline: none;
}

.global-search input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.global-search kbd {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  font-size: 0.7em;
  color: rgba(255, 255, 255, 0.5);
  font-family: monospace;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.topbar-btn {
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border-radius: 14px;
  cursor: pointer;
  font-size: 1.25em;
  color: #fff;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.topbar-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(46, 204, 113, 0.3), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.topbar-btn:hover::after {
  opacity: 1;
}

.topbar-btn:hover {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.25), rgba(39, 174, 96, 0.15));
  border-color: rgba(46, 204, 113, 0.4);
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.25);
}

.topbar-btn .spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.topbar-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px 10px 10px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.1));
  border: 2px solid rgba(46, 204, 113, 0.35);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.admin-profile::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 52px;
  padding: 2px;
  background: linear-gradient(135deg, #2ecc71, transparent, #27ae60);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.admin-profile:hover::before {
  opacity: 0.7;
}

.admin-profile:hover {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.35), rgba(39, 174, 96, 0.2));
  transform: scale(1.03);
  box-shadow: 0 8px 30px rgba(46, 204, 113, 0.3);
}

.profile-dropdown-arrow {
  font-size: 0.6em;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 4px;
  transition: transform 0.3s ease;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  min-width: 240px;
  background: linear-gradient(165deg, rgba(25, 25, 45, 0.98), rgba(15, 20, 35, 0.98));
  backdrop-filter: blur(25px);
  border: 1px solid rgba(46, 204, 113, 0.25);
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(46, 204, 113, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
  z-index: 200;
  animation: dropdownSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-15px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-header {
  padding: 20px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.15), rgba(39, 174, 96, 0.1));
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.dropdown-email {
  display: block;
  font-size: 0.9em;
  color: #fff;
  font-weight: 600;
  margin-bottom: 6px;
}

.dropdown-role {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7em;
  color: #2ecc71;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 4px 10px;
  background: rgba(46, 204, 113, 0.2);
  border-radius: 20px;
  font-weight: 700;
}

.dropdown-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  margin: 4px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 20px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.dropdown-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #2ecc71;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.dropdown-item:hover::before {
  transform: scaleY(1);
}

.dropdown-item:hover {
  background: linear-gradient(90deg, rgba(46, 204, 113, 0.15), transparent);
  color: #fff;
  padding-left: 24px;
}

.dropdown-item span {
  font-size: 1.2em;
  transition: transform 0.3s ease;
}

.dropdown-item:hover span {
  transform: scale(1.15);
}

.dropdown-logout {
  color: #e74c3c;
}

.dropdown-logout::before {
  background: #e74c3c;
}

.dropdown-logout:hover {
  background: linear-gradient(90deg, rgba(231, 76, 60, 0.15), transparent);
  color: #e74c3c;
}

.profile-avatar {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05em;
  font-weight: 700;
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
  color: white;
  transition: all 0.3s ease;
}

.admin-profile:hover .profile-avatar {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.5);
}

.profile-name {
  font-size: 0.95em;
  font-weight: 600;
  color: #fff;
}

/* Admin Layout */
.admin-layout {
  display: flex;
  padding-top: 70px;
  min-height: 100vh;
}

/* Sidebar */
.admin-sidebar {
  width: 280px;
  min-width: 280px;
  background: linear-gradient(180deg, rgba(12, 12, 28, 0.98), rgba(8, 15, 30, 0.98));
  backdrop-filter: blur(25px);
  border-right: 1px solid rgba(46, 204, 113, 0.15);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 70px;
  left: 0;
  bottom: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 90;
  box-shadow: 5px 0 40px rgba(0, 0, 0, 0.4), inset -1px 0 0 rgba(46, 204, 113, 0.1);
}

.admin-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, rgba(46, 204, 113, 0.3), transparent, rgba(46, 204, 113, 0.3));
  pointer-events: none;
}

.admin-sidebar.collapsed {
  width: 85px;
  min-width: 85px;
}

.admin-sidebar.collapsed .nav-label,
.admin-sidebar.collapsed .nav-badge,
.admin-sidebar.collapsed .nav-section-title,
.admin-sidebar.collapsed .sidebar-footer {
  display: none;
}

.admin-sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 14px;
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-section {
  padding: 0 16px;
  margin-bottom: 16px;
}

.nav-section-title {
  font-size: 0.7em;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.4);
  padding: 16px 16px 10px;
  font-weight: 700;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: transparent;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
  font-size: 0.95em;
  width: 100%;
  text-align: left;
  margin-bottom: 4px;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 0;
  background: linear-gradient(180deg, #2ecc71, #27ae60);
  border-radius: 0 4px 4px 0;
  transition: height 0.3s ease;
  box-shadow: 0 0 15px rgba(46, 204, 113, 0.5);
}

.nav-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at left center, rgba(46, 204, 113, 0.15), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-item:hover::after {
  opacity: 1;
}

.nav-item:hover {
  background: linear-gradient(90deg, rgba(46, 204, 113, 0.12), transparent);
  color: #fff;
}

.nav-item:hover::before {
  height: 65%;
}

.nav-item.active {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  box-shadow: 0 8px 30px rgba(46, 204, 113, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.nav-item.active::before {
  display: none;
}

.nav-item.active::after {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), transparent);
  opacity: 1;
}

.nav-icon {
  font-size: 1.35em;
  width: 30px;
  text-align: center;
  transition: all 0.3s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.15) rotate(5deg);
}

.nav-item.active .nav-icon {
  animation: bounce-icon 0.5s ease;
}

@keyframes bounce-icon {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.25) rotate(-5deg); }
}

.nav-label {
  flex: 1;
  font-weight: 500;
}

.nav-badge {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75em;
  font-weight: 700;
}

.nav-item.active .nav-badge {
  background: rgba(255, 255, 255, 0.25);
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(46, 204, 113, 0.15);
  margin-top: auto;
  background: linear-gradient(180deg, transparent, rgba(46, 204, 113, 0.03));
}

.eco-score {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.18), rgba(39, 174, 96, 0.08));
  border: 2px solid rgba(46, 204, 113, 0.35);
  border-radius: 18px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.eco-score:hover {
  transform: scale(1.02);
  border-color: rgba(46, 204, 113, 0.5);
  box-shadow: 0 10px 30px rgba(46, 204, 113, 0.2);
}

.eco-score::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(46, 204, 113, 0.3), transparent 70%);
  animation: eco-glow 3s ease-in-out infinite;
}

@keyframes eco-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.score-circle {
  width: 58px;
  height: 58px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2);
  position: relative;
  animation: pulse-glow 2s ease-in-out infinite;
}

.score-circle::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2ecc71, transparent, #27ae60);
  z-index: -1;
  animation: rotate-ring 3s linear infinite;
}

@keyframes rotate-ring {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 8px 25px rgba(46, 204, 113, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2); }
  50% { box-shadow: 0 8px 40px rgba(46, 204, 113, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.2); }
}

.score-value {
  font-size: 1.4em;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.score-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.score-label {
  font-size: 0.7em;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.score-status {
  font-size: 1em;
  font-weight: 700;
  color: #2ecc71;
  text-shadow: 0 0 15px rgba(46, 204, 113, 0.4);
}

/* Section Title Bar */
.section-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.section-title-bar h2 {
  font-size: 1.8em;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95em;
  margin-top: 8px;
}

.title-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.date-select {
  padding: 10px 40px 10px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(46, 204, 113, 0.3);
  border-radius: 10px;
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232ecc71' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}

.date-select:hover, .date-select:focus {
  border-color: #2ecc71;
  outline: none;
  box-shadow: 0 0 15px rgba(46, 204, 113, 0.2);
}

.date-select option {
  background: #1a1a2e;
  color: #fff;
  padding: 10px;
}

.global-search input:focus {
  outline: none;
  border-color: #2ecc71;
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.15);
}

.search-hint {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  font-size: 0.7em;
  color: rgba(255, 255, 255, 0.5);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.2em;
  color: #fff;
  transition: all 0.2s ease;
}

.topbar-btn:hover {
  background: rgba(46, 204, 113, 0.1);
}

.topbar-btn.refreshing {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  background: rgba(46, 204, 113, 0.1);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.admin-profile:hover {
  background: rgba(46, 204, 113, 0.2);
}

.profile-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.85em;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: 0.85em;
  font-weight: 600;
  color: #fff;
}

.profile-role {
  font-size: 0.7em;
  color: #2ecc71;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Main Content */
.admin-content {
  flex: 1;
  margin-left: 280px;
  padding: 30px;
  transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: calc(100vh - 70px);
}

.admin-sidebar.collapsed + .admin-content,
.admin-sidebar.collapsed ~ .admin-content {
  margin-left: 85px;
}

.admin-section {
  max-width: 1500px;
  margin: 0 auto;
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Section Title Bar */
.section-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title-bar h2 {
  font-size: 1.8em;
  color: #fff;
  margin: 0;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95em;
  margin-top: 8px;
  max-width: 500px;
}

.title-actions {
  display: flex;
  gap: 14px;
  align-items: center;
}

/* Stats Grid - Modern Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 24px 24px 0 0;
}

.stat-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  opacity: 0.05;
  transition: all 0.5s ease;
}

.stat-card.stat-users::before { background: linear-gradient(90deg, #3498db, #2980b9); }
.stat-card.stat-users::after { background: radial-gradient(circle, #3498db, transparent 70%); }
.stat-card.stat-products::before { background: linear-gradient(90deg, #9b59b6, #8e44ad); }
.stat-card.stat-products::after { background: radial-gradient(circle, #9b59b6, transparent 70%); }
.stat-card.stat-orders::before { background: linear-gradient(90deg, #e67e22, #d35400); }
.stat-card.stat-orders::after { background: radial-gradient(circle, #e67e22, transparent 70%); }
.stat-card.stat-revenue::before { background: linear-gradient(90deg, #2ecc71, #27ae60); }
.stat-card.stat-revenue::after { background: radial-gradient(circle, #2ecc71, transparent 70%); }

.stat-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(46, 204, 113, 0.1);
  border-color: rgba(46, 204, 113, 0.4);
}

.stat-card:hover::after {
  opacity: 0.15;
  transform: scale(1.5);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.stat-icon-bg {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8em;
  position: relative;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon-bg {
  transform: scale(1.1) rotate(5deg);
}

.stat-users .stat-icon-bg { 
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.25), rgba(41, 128, 185, 0.15));
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.2);
}
.stat-products .stat-icon-bg { 
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.25), rgba(142, 68, 173, 0.15));
  box-shadow: 0 8px 20px rgba(155, 89, 182, 0.2);
}
.stat-orders .stat-icon-bg { 
  background: linear-gradient(135deg, rgba(230, 126, 34, 0.25), rgba(211, 84, 0, 0.15));
  box-shadow: 0 8px 20px rgba(230, 126, 34, 0.2);
}
.stat-revenue .stat-icon-bg { 
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.25), rgba(39, 174, 96, 0.15));
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.2);
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8em;
  padding: 8px 14px;
  border-radius: 20px;
  font-weight: 700;
  animation: pulse-soft 2s infinite;
}

@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.stat-trend.up {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.25), rgba(39, 174, 96, 0.15));
  color: #2ecc71;
}

.stat-trend.down {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.25), rgba(192, 57, 43, 0.15));
  color: #e74c3c;
}

.stat-body {
  margin-bottom: 20px;
}

.stat-value {
  display: block;
  font-size: 3em;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  display: block;
  font-size: 1em;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  letter-spacing: 0.3px;
}

.stat-footer {
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-compare {
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-compare::before {
  content: '📊';
  font-size: 0.9em;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
}

.dashboard-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.dashboard-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), transparent, rgba(46, 204, 113, 0.1));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.dashboard-card:hover::before {
  opacity: 1;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(46, 204, 113, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent);
}

.card-header h3 {
  font-size: 1.1em;
  color: #fff;
  margin: 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-action {
  padding: 10px 20px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.15), rgba(39, 174, 96, 0.1));
  border: 1px solid rgba(46, 204, 113, 0.3);
  border-radius: 12px;
  font-size: 0.85em;
  color: #2ecc71;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.card-action:hover {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.25), rgba(39, 174, 96, 0.2));
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.2);
}

.card-body {
  padding: 0;
}

/* Mini Table for Recent Orders */
.mini-table {
  padding: 8px 0;
}

.mini-row {
  display: grid;
  grid-template-columns: 70px 1fr 110px 120px;
  gap: 16px;
  padding: 16px 28px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.mini-row:hover {
  background: linear-gradient(90deg, rgba(46, 204, 113, 0.08), transparent);
  padding-left: 32px;
}

.mini-row:last-child {
  border-bottom: none;
}

.order-id {
  font-weight: 800;
  color: #fff;
  font-size: 0.95em;
  font-family: 'Monaco', 'Consolas', monospace;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 6px;
}

.order-customer {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95em;
  font-weight: 500;
}

.order-total {
  font-weight: 800;
  color: #2ecc71;
  font-size: 1.05em;
  text-shadow: 0 0 20px rgba(46, 204, 113, 0.3);
}

.order-status {
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 0.75em;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.5px;
}

.order-status.pending {
  background: linear-gradient(135deg, rgba(241, 196, 15, 0.25), rgba(243, 156, 18, 0.15));
  color: #f1c40f;
  box-shadow: 0 4px 15px rgba(241, 196, 15, 0.2);
}

.order-status.processing {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.25), rgba(41, 128, 185, 0.15));
  color: #3498db;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2);
}

.order-status.shipped {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.25), rgba(142, 68, 173, 0.15));
  color: #9b59b6;
  box-shadow: 0 4px 15px rgba(155, 89, 182, 0.2);
}

.order-status.delivered {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.25), rgba(39, 174, 96, 0.15));
  color: #2ecc71;
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.2);
}

.order-status.cancelled {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.25), rgba(192, 57, 43, 0.15));
  color: #e74c3c;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.2);
}

/* Activity Timeline */
.activity-timeline {
  padding: 16px 24px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
  flex-shrink: 0;
  background: rgba(46, 204, 113, 0.15);
}

.timeline-content {
  flex: 1;
}

.timeline-content p {
  margin: 0 0 6px;
  color: #fff;
  font-size: 0.9em;
  font-weight: 500;
}

.timeline-time {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.4);
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  padding: 24px 28px;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.quick-action::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(46, 204, 113, 0.1), transparent);
  transition: left 0.5s ease;
}

.quick-action:hover::before {
  left: 100%;
}

.quick-action:hover {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.1));
  border-color: rgba(46, 204, 113, 0.4);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 25px rgba(46, 204, 113, 0.15);
}

.qa-icon {
  font-size: 1.6em;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(46, 204, 113, 0.15);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.quick-action:hover .qa-icon {
  transform: scale(1.1) rotate(5deg);
  background: rgba(46, 204, 113, 0.25);
}

.qa-label {
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

/* Top Products */
.top-products-list {
  padding: 12px 0;
}

.top-product-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.2s ease;
}

.top-product-item:hover {
  background: rgba(46, 204, 113, 0.05);
}

.top-product-item:last-child {
  border-bottom: none;
}

.product-rank {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.3), rgba(39, 174, 96, 0.2));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  font-weight: 800;
  color: #2ecc71;
}

.product-thumb {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
}

.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-name {
  display: block;
  font-size: 0.9em;
  color: #fff;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-cat {
  display: block;
  font-size: 0.75em;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
}

.product-price {
  font-weight: 700;
  color: #2ecc71;
  font-size: 0.95em;
}

/* Empty Card State */
.empty-card {
  padding: 40px 20px;
  text-align: center;
}

.empty-card span {
  font-size: 2.5em;
  display: block;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-card p {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9em;
  margin: 0;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.section-header h2 {
  font-size: 1.5em;
  color: #fff;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 14px;
  align-items: center;
}

/* Search & Filter */
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.search-box .search-icon {
  position: absolute;
  left: 16px;
  font-size: 1em;
  opacity: 0.5;
  pointer-events: none;
}

.search-input {
  padding: 14px 20px 14px 44px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  font-size: 0.95em;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  min-width: 280px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-input:focus {
  outline: none;
  border-color: #2ecc71;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 25px rgba(46, 204, 113, 0.2);
  transform: translateY(-2px);
}

.filter-select {
  padding: 14px 44px 14px 22px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  font-size: 0.95em;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232ecc71' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.filter-select:focus {
  outline: none;
  border-color: #2ecc71;
  box-shadow: 0 0 15px rgba(46, 204, 113, 0.2);
}

.filter-select option {
  background: #1a1a2e;
  color: #fff;
}

.add-btn {
  padding: 14px 28px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 0.95em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.3);
}

.add-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(46, 204, 113, 0.4);
}

/* Users Table - Modern Style */
.users-table-container,
.data-table-container {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.admin-table,
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td,
.data-table th,
.data-table td {
  padding: 18px 24px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.admin-table th,
.data-table th {
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 700;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent);
  position: sticky;
  top: 0;
  z-index: 10;
}

.admin-table tbody tr,
.data-table tbody tr {
  transition: all 0.3s ease;
}

.admin-table tbody tr:hover,
.data-table tbody tr:hover {
  background: linear-gradient(90deg, rgba(46, 204, 113, 0.08), transparent);
  transform: scale(1.005);
}

.admin-table tbody tr:last-child td,
.data-table tbody tr:last-child td {
  border-bottom: none;
}

.admin-table tr.blocked-row,
.admin-table tr.row-blocked,
.data-table tr.blocked-row,
.data-table tr.row-blocked {
  background: rgba(231, 76, 60, 0.08);
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1em;
  box-shadow: 0 6px 15px rgba(46, 204, 113, 0.35);
  transition: all 0.3s ease;
}

.admin-table tbody tr:hover .user-avatar,
.data-table tbody tr:hover .user-avatar-sm {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.45);
}

.user-avatar-sm {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95em;
  box-shadow: 0 6px 15px rgba(46, 204, 113, 0.35);
  transition: all 0.3s ease;
}

.user-avatar-sm.admin {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  box-shadow: 0 6px 15px rgba(155, 89, 182, 0.35);
}

.user-info-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-info-cell .user-name {
  font-weight: 600;
  color: #fff;
  font-size: 0.95em;
}

.user-info-cell .user-id {
  font-size: 0.75em;
  color: rgba(255, 255, 255, 0.4);
}

.user-details h4 {
  font-size: 1em;
  color: #fff;
  margin: 0 0 4px;
  font-weight: 600;
}

.user-details span {
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.5);
}

/* Badges */
.badge {
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 0.7em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.badge-admin {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.3), rgba(142, 68, 173, 0.2));
  color: #bb6bd9;
  box-shadow: 0 4px 12px rgba(155, 89, 182, 0.2);
}

.badge-user {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.25), rgba(39, 174, 96, 0.15));
  color: #2ecc71;
}

.badge-active {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.25), rgba(39, 174, 96, 0.15));
  color: #2ecc71;
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.2);
}

.badge-blocked {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.25), rgba(192, 57, 43, 0.15));
  color: #e74c3c;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
}

.badge-success {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.25), rgba(39, 174, 96, 0.15));
  color: #2ecc71;
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.2);
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.badge-danger {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.25), rgba(192, 57, 43, 0.15));
  color: #e74c3c;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.badge-pending {
  background: linear-gradient(135deg, rgba(241, 196, 15, 0.25), rgba(243, 156, 18, 0.15));
  color: #f1c40f;
}

.badge-processing {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.25), rgba(41, 128, 185, 0.15));
  color: #3498db;
}

.badge-shipped {
  background: rgba(155, 89, 182, 0.2);
  color: #9b59b6;
}

.badge-delivered {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.badge-cancelled {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.category-badge {
  padding: 6px 14px;
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
  border-radius: 20px;
  font-size: 0.75em;
  font-weight: 600;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.action-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.2), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-btn:hover::after {
  opacity: 1;
}

.action-btn.edit {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.25), rgba(41, 128, 185, 0.15));
  color: #3498db;
}

.action-btn.edit:hover {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
}

.action-btn.view {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.25), rgba(142, 68, 173, 0.15));
  color: #9b59b6;
}

.action-btn.view:hover {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 8px 20px rgba(155, 89, 182, 0.4);
}

.action-btn.delete {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.25), rgba(192, 57, 43, 0.15));
  color: #e74c3c;
}

.action-btn.delete:hover {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  transform: scale(1.15) rotate(-5deg);
  box-shadow: 0 8px 20px rgba(231, 76, 60, 0.4);
}

.action-btn.block {
  background: linear-gradient(135deg, rgba(230, 126, 34, 0.25), rgba(211, 84, 0, 0.15));
  color: #e67e22;
}

.action-btn.block:hover {
  background: linear-gradient(135deg, #e67e22, #d35400);
  color: white;
  transform: scale(1.15);
  box-shadow: 0 8px 20px rgba(230, 126, 34, 0.4);
}

.action-btn.unblock {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.25), rgba(39, 174, 96, 0.15));
  color: #2ecc71;
}

.action-btn.unblock:hover {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  transform: scale(1.1);
}

/* Products Grid */
.products-grid-admin {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}

.product-card-admin {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.product-card-admin::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.3), transparent, rgba(46, 204, 113, 0.2));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.product-card-admin:hover::before {
  opacity: 1;
}

.product-card-admin:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(46, 204, 113, 0.1);
  border-color: rgba(46, 204, 113, 0.4);
}

.product-image-admin {
  position: relative;
  height: 220px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.1));
  overflow: hidden;
}

.product-image-admin img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card-admin:hover .product-image-admin img {
  transform: scale(1.1);
}

.no-image-admin {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4em;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(39, 174, 96, 0.05));
  color: rgba(46, 204, 113, 0.5);
}

.product-overlay-admin {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.85) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.product-card-admin:hover .product-overlay-admin {
  opacity: 1;
}

.overlay-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

.overlay-btn span {
  font-size: 1.1em;
}

.overlay-btn.edit, .product-overlay-admin button:first-child {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.overlay-btn.delete, .overlay-btn.danger, .product-overlay-admin button:last-child {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.overlay-btn:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
}

.overlay-btn.edit:hover, .product-overlay-admin button:first-child:hover {
  background: linear-gradient(135deg, #5dade2, #3498db);
  box-shadow: 0 15px 35px rgba(52, 152, 219, 0.5);
}

.overlay-btn.delete:hover, .overlay-btn.danger:hover, .product-overlay-admin button:last-child:hover {
  background: linear-gradient(135deg, #ec7063, #e74c3c);
  box-shadow: 0 15px 35px rgba(231, 76, 60, 0.5);
}

/* Product Info Section */
.product-info-admin {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.2));
}

.product-info-admin h4 {
  font-size: 1.15em;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.product-card-admin:hover .product-info-admin h4 {
  color: #2ecc71;
}

.product-category-admin {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.15));
  border: 1px solid rgba(46, 204, 113, 0.3);
  border-radius: 20px;
  font-size: 0.75em;
  font-weight: 600;
  color: #2ecc71;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  width: fit-content;
}

.product-category-admin::before {
  content: '📦';
  font-size: 0.9em;
}

.product-desc-admin {
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 4px 0;
}

.product-details-admin {
  padding: 20px;
}

.product-details-admin h3 {
  font-size: 1.05em;
  color: #fff;
  margin: 0 0 12px;
  font-weight: 600;
}

.product-meta-admin {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  margin-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.product-price-admin {
  font-size: 1.4em;
  font-weight: 800;
  color: #2ecc71;
  text-shadow: 0 0 20px rgba(46, 204, 113, 0.3);
}

.product-price-admin::before {
  content: '€';
  font-size: 0.8em;
  opacity: 0.8;
  margin-right: 2px;
}

.product-stock-admin {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
  transition: all 0.3s ease;
}

.product-stock-admin.in-stock,
.product-stock-admin:not(.low):not(.out) {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.1));
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.product-stock-admin.in-stock::before,
.product-stock-admin:not(.low):not(.out)::before {
  content: '✓';
  font-weight: bold;
}

.product-stock-admin.low {
  background: linear-gradient(135deg, rgba(241, 196, 15, 0.2), rgba(243, 156, 18, 0.1));
  color: #f1c40f;
  border: 1px solid rgba(241, 196, 15, 0.3);
  animation: lowStockPulse 2s ease-in-out infinite;
}

.product-stock-admin.low::before {
  content: '⚠';
}

@keyframes lowStockPulse {
  0%, 100% { box-shadow: 0 0 0 rgba(241, 196, 15, 0); }
  50% { box-shadow: 0 0 15px rgba(241, 196, 15, 0.3); }
}

.product-stock-admin.out {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.2), rgba(192, 57, 43, 0.1));
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.product-stock {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.7em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-stock.in-stock {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.product-stock.low-stock {
  background: rgba(241, 196, 15, 0.2);
  color: #f1c40f;
}

.product-stock.out-of-stock {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4em;
  opacity: 0.3;
  color: rgba(255, 255, 255, 0.3);
}

/* Empty Products State */
.empty-products {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.empty-products:hover {
  border-color: rgba(46, 204, 113, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.empty-products span {
  font-size: 5em;
  margin-bottom: 20px;
  filter: grayscale(30%);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-products p {
  font-size: 1.3em;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px;
}

.empty-products .btn-primary {
  padding: 14px 28px;
}

/* Empty Table State */
.empty-table {
  text-align: center;
  padding: 60px 30px !important;
  border-bottom: none !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.empty-state span {
  font-size: 3.5em;
  opacity: 0.6;
  animation: float 3s ease-in-out infinite;
}

.empty-state p {
  font-size: 1.1em;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* Orders Tab */
.filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 30px;
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.filter-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: left 0.4s ease;
}

.filter-tab:hover::before {
  left: 100%;
}

.filter-tab:hover {
  border-color: rgba(46, 204, 113, 0.5);
  color: #fff;
  transform: translateY(-2px);
}

.filter-tab.active {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  border-color: transparent;
  color: white;
  box-shadow: 0 10px 25px rgba(46, 204, 113, 0.4);
  transform: translateY(-2px);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 28px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.order-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #2ecc71, #27ae60);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.order-card:hover::before {
  opacity: 1;
}

.order-card:hover {
  transform: translateY(-6px) translateX(4px);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3);
  border-color: rgba(46, 204, 113, 0.3);
}

.order-id-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.1));
  border: 1px solid rgba(46, 204, 113, 0.3);
  border-radius: 10px;
  font-weight: 800;
  font-size: 1em;
  color: #2ecc71;
  font-family: 'Monaco', 'Consolas', monospace;
}

.status-dropdown {
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: #fff;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
}

.status-dropdown:focus {
  outline: none;
  border-color: #2ecc71;
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.15);
}

.status-dropdown option {
  background: #1a1a2e;
  color: #fff;
  padding: 10px;
}

.status-dropdown.pending {
  border-color: rgba(241, 196, 15, 0.5);
  background: rgba(241, 196, 15, 0.1);
}

.status-dropdown.processing {
  border-color: rgba(52, 152, 219, 0.5);
  background: rgba(52, 152, 219, 0.1);
}

.status-dropdown.shipped {
  border-color: rgba(155, 89, 182, 0.5);
  background: rgba(155, 89, 182, 0.1);
}

.status-dropdown.delivered {
  border-color: rgba(46, 204, 113, 0.5);
  background: rgba(46, 204, 113, 0.1);
}

.status-dropdown.cancelled {
  border-color: rgba(231, 76, 60, 0.5);
  background: rgba(231, 76, 60, 0.1);
}

.order-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
}

.detail-value {
  font-size: 1em;
  color: #fff;
  font-weight: 500;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.order-info h4 {
  font-weight: 700;
  color: #fff;
  font-size: 1.1em;
  margin: 0 0 6px;
}

.order-date {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.4);
}

.order-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.order-customer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer-avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9em;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.customer-info h5 {
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px;
  font-size: 0.95em;
}

.customer-info span {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.4);
}

.order-total {
  font-size: 1.6em;
  font-weight: 800;
  color: #2ecc71;
  text-shadow: 0 0 30px rgba(46, 204, 113, 0.4);
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Icon Buttons - Used throughout admin */
.btn-icon {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.btn-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.3), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-icon:hover::before {
  opacity: 1;
}

.btn-icon.btn-edit {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(41, 128, 185, 0.1));
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.btn-icon.btn-edit:hover {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  transform: scale(1.12) rotate(5deg);
  box-shadow: 0 10px 25px rgba(52, 152, 219, 0.45);
  border-color: transparent;
}

.btn-icon.btn-view {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.2), rgba(142, 68, 173, 0.1));
  color: #9b59b6;
  border: 1px solid rgba(155, 89, 182, 0.3);
}

.btn-icon.btn-view:hover {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
  transform: scale(1.12);
  box-shadow: 0 10px 25px rgba(155, 89, 182, 0.45);
  border-color: transparent;
}

.btn-icon.btn-danger {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.2), rgba(192, 57, 43, 0.1));
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.btn-icon.btn-danger:hover {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  transform: scale(1.12) rotate(-5deg);
  box-shadow: 0 10px 25px rgba(231, 76, 60, 0.45);
  border-color: transparent;
}

.btn-icon.btn-warning {
  background: linear-gradient(135deg, rgba(230, 126, 34, 0.2), rgba(211, 84, 0, 0.1));
  color: #e67e22;
  border: 1px solid rgba(230, 126, 34, 0.3);
}

.btn-icon.btn-warning:hover {
  background: linear-gradient(135deg, #e67e22, #d35400);
  color: white;
  transform: scale(1.12);
  box-shadow: 0 10px 25px rgba(230, 126, 34, 0.45);
  border-color: transparent;
}

.btn-icon.btn-success {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.1));
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.btn-icon.btn-success:hover {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  transform: scale(1.12);
  box-shadow: 0 10px 25px rgba(46, 204, 113, 0.45);
  border-color: transparent;
}

.status-select {
  padding: 10px 40px 10px 18px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.85em;
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232ecc71' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}

.status-select:focus {
  outline: none;
  border-color: #2ecc71;
  box-shadow: 0 0 15px rgba(46, 204, 113, 0.2);
}

.status-select option {
  background: #1a1a2e;
  color: #fff;
  padding: 10px;
}

/* Forum Posts */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 24px;
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border-color: rgba(46, 204, 113, 0.2);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.post-title {
  font-size: 1.15em;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.post-excerpt {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9em;
  line-height: 1.7;
  margin-bottom: 18px;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75em;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(155, 89, 182, 0.3);
}

.author-name {
  font-size: 0.9em;
  color: #fff;
  font-weight: 500;
}

.post-meta {
  display: flex;
  gap: 18px;
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.4);
}

.post-date {
  color: rgba(255, 255, 255, 0.4);
}

/* Settings Tab */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 28px;
}

.settings-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(46, 204, 113, 0.3);
}

.settings-card h3 {
  padding: 24px 28px;
  margin: 0;
  font-size: 1.15em;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.settings-card .btn-primary {
  margin: 20px 28px 28px;
  width: calc(100% - 56px);
}

.settings-body {
  padding: 0;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.3s ease;
}

.setting-item:hover {
  background: rgba(46, 204, 113, 0.05);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item label {
  font-size: 0.95em;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.setting-input {
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 0.95em;
  min-width: 200px;
  transition: all 0.3s ease;
}

.setting-input:focus {
  outline: none;
  border-color: #2ecc71;
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.15);
}

.setting-input option {
  background: #1a1a2e;
  color: #fff;
}

.setting-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.3s ease;
}

.setting-toggle:hover {
  background: rgba(46, 204, 113, 0.05);
}

.setting-toggle:last-child {
  border-bottom: none;
}

.setting-toggle span {
  font-size: 0.95em;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 30px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 30px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-slider::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.toggle input:checked + .toggle-slider {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.5);
}

.toggle input:checked + .toggle-slider::after {
  transform: translateX(26px);
}

.toggle:hover .toggle-slider {
  box-shadow: 0 0 10px rgba(46, 204, 113, 0.3);
}

.no-data {
  text-align: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.4);
}

.no-data span {
  display: block;
  font-size: 4em;
  margin-bottom: 20px;
  opacity: 0.5;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: overlayFade 0.3s ease;
}

@keyframes overlayFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: linear-gradient(165deg, rgba(30, 30, 55, 0.98), rgba(22, 33, 62, 0.98));
  border: 1px solid rgba(46, 204, 113, 0.25);
  border-radius: 28px;
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(46, 204, 113, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  animation: modalSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalSlide {
  from {
    opacity: 0;
    transform: translateY(-40px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal.modal-lg {
  max-width: 780px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent);
}

.modal-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.35em;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-close {
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(231, 76, 60, 0.15);
  border-radius: 14px;
  font-size: 1.4em;
  cursor: pointer;
  color: #e74c3c;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-close:hover {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 8px 20px rgba(231, 76, 60, 0.3);
}

.modal-body {
  padding: 32px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 24px 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.1);
}

/* Form Styles */
.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  font-size: 0.9em;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.95em;
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  transition: all 0.3s ease;
}

/* Select specific styling for dark mode */
select.form-input {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232ecc71' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select.form-input option {
  background: #1a1a2e;
  color: #fff;
  padding: 12px;
}

select.form-input option:hover,
select.form-input option:focus,
select.form-input option:checked {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-input:focus {
  outline: none;
  border-color: #2ecc71;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 20px rgba(46, 204, 113, 0.15);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.btn-primary {
  padding: 16px 32px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.35);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 15px 35px rgba(46, 204, 113, 0.45);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(-2px) scale(1.01);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  transform: translateY(-2px);
}

/* Image Upload Styles */
.image-upload-section {
  margin-bottom: 20px;
}

.image-preview {
  position: relative;
  width: 220px;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

.remove-image-btn:hover {
  transform: scale(1.15);
}

.upload-area {
  position: relative;
  border: 2px dashed rgba(46, 204, 113, 0.4);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(46, 204, 113, 0.03);
}

.upload-area:hover {
  border-color: #2ecc71;
  background: rgba(46, 204, 113, 0.08);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-label {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
}

.upload-icon {
  font-size: 2.5em;
}

.upload-hint {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.4);
}

.upload-progress {
  margin-top: 14px;
  padding: 14px;
  background: rgba(46, 204, 113, 0.15);
  border-radius: 10px;
  text-align: center;
  color: #2ecc71;
  font-size: 0.9em;
  font-weight: 600;
}

.image-url-fallback {
  margin-top: 18px;
}

.or-divider {
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 14px;
  font-size: 0.85em;
}

/* Responsive Styles */
@media (max-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .mini-row {
    grid-template-columns: 50px 1fr 90px 90px;
  }
}

@media (max-width: 1024px) {
  .admin-sidebar {
    position: fixed;
    left: -280px;
    width: 280px;
    transition: left 0.3s ease;
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.3);
  }
  
  .admin-sidebar:not(.collapsed) {
    left: 0;
  }
  
  .admin-content {
    margin-left: 0 !important;
  }
  
  .topbar-center {
    display: none;
  }
  
  .profile-name {
    display: none;
  }
}

@media (max-width: 768px) {
  .admin-topbar {
    padding: 0 16px;
    height: 60px;
  }
  
  .admin-title {
    display: none;
  }
  
  .admin-content {
    padding: 20px 16px;
  }
  
  .section-title-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .section-title-bar h2 {
    font-size: 1.4em;
  }
  
  .title-actions {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-value {
    font-size: 2em;
  }
  
  .products-grid-admin {
    grid-template-columns: 1fr;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-input {
    min-width: 100%;
  }
  
  .filter-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 10px;
    gap: 8px;
  }
  
  .filter-tab {
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .order-body {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
  
  .order-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .mini-row {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  
  .order-customer {
    grid-column: span 2;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .admin-table {
    font-size: 0.8em;
  }
  
  .admin-table th,
  .admin-table td {
    padding: 12px 10px;
  }
  
  .user-cell .user-details span {
    display: none;
  }
  
  .user-avatar {
    width: 36px;
    height: 36px;
    font-size: 0.8em;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
  }
  
  .stat-icon-bg {
    width: 44px;
    height: 44px;
  }
  
  .modal {
    margin: 10px;
    max-height: 95vh;
  }
  
  .modal-body {
    padding: 20px;
  }
}
</style>
