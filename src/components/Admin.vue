<template>
  <div class="admin-dashboard">
    <Section title="Admin Dashboard" subtitle="Manage your eco-commerce platform">
      <div class="admin-layout">
        <aside class="admin-sidebar">
          <nav class="admin-nav">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['nav-item', { active: activeTab === tab.id }]"
            >
              {{ tab.icon }} {{ tab.label }}
            </button>
          </nav>
        </aside>

        <main class="admin-content">
          <!-- Products Tab -->
          <div v-if="activeTab === 'products'" class="admin-section">
            <div class="section-header">
              <h3>Product Management</h3>
              <Button @click="showProductModal = true" icon="➕">Add Product</Button>
            </div>
            <Card>
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in products" :key="product.id">
                    <td>{{ product.id }}</td>
                    <td>{{ product.name }}</td>
                    <td>€{{ product.price }}</td>
                    <td>{{ product.category }}</td>
                    <td>{{ product.stock }}</td>
                    <td>
                      <Button @click="editProduct(product)" size="small" icon="✏️">Edit</Button>
                      <Button @click="deleteProduct(product.id)" variant="danger" size="small" icon="🗑️">Delete</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          <!-- Users Tab -->
          <div v-if="activeTab === 'users'" class="admin-section">
            <div class="section-header">
              <h3>User Management</h3>
            </div>
            <Card>
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.role }}</td>
                    <td>{{ user.blocked ? 'Blocked' : 'Active' }}</td>
                    <td>
                      <Button @click="toggleUserBlock(user)" :variant="user.blocked ? 'success' : 'danger'" size="small">
                        {{ user.blocked ? 'Unblock' : 'Block' }}
                      </Button>
                      <Button @click="changeUserRole(user)" size="small" icon="👑">Change Role</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          <!-- Orders Tab -->
          <div v-if="activeTab === 'orders'" class="admin-section">
            <div class="section-header">
              <h3>Order Management</h3>
            </div>
            <Card>
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in orders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td>{{ order.user_name }}</td>
                    <td>€{{ order.total }}</td>
                    <td>{{ order.status }}</td>
                    <td>{{ new Date(order.created_at).toLocaleDateString() }}</td>
                    <td>
                      <select @change="updateOrderStatus(order.id, $event.target.value)" :value="order.status">
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <Button @click="deleteOrder(order.id)" variant="danger" size="small" icon="🗑️">Delete</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
        </main>
      </div>
    </Section>

    <!-- Product Modal -->
    <Modal :show="showProductModal" title="Product Details" @close="closeProductModal">
      <form @submit.prevent="saveProduct" class="admin-form">
        <Input v-model="productForm.name" label="Product Name" required />
        <Input v-model="productForm.description" label="Description" type="textarea" />
        <Input v-model="productForm.price" label="Price (€)" type="number" step="0.01" required />
        <Input v-model="productForm.category" label="Category" required />
        <Input v-model="productForm.stock" label="Stock" type="number" required />
        <Input v-model="productForm.image_url" label="Image URL" />
        <Input v-model="productForm.lifecycle_info" label="Lifecycle Info" type="textarea" />
      </form>
      <template #footer>
        <Button @click="closeProductModal" variant="secondary">Cancel</Button>
        <Button @click="saveProduct" :disabled="loading">{{ loading ? 'Saving...' : 'Save Product' }}</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Section from './common/Section.vue'
import Card from './common/Card.vue'
import Button from './common/Button.vue'
import Modal from './common/Modal.vue'
import Input from './common/Input.vue'

export default {
  name: 'Admin',
  components: {
    Section,
    Card,
    Button,
    Modal,
    Input
  },
  data() {
    return {
      activeTab: 'products',
      tabs: [
        { id: 'products', label: 'Products', icon: '🛍️' },
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'orders', label: 'Orders', icon: '📦' }
      ],
      products: [],
      users: [],
      orders: [],
      showProductModal: false,
      loading: false,
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
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      await Promise.all([
        this.loadProducts(),
        this.loadUsers(),
        this.loadOrders()
      ])
    },
    async loadProducts() {
      try {
        const response = await fetch('http://localhost:3000/api/products')
        this.products = await response.json()
      } catch (error) {
        console.error('Error loading products:', error)
      }
    },
    async loadUsers() {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch('http://localhost:3000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        this.users = await response.json()
      } catch (error) {
        console.error('Error loading users:', error)
      }
    },
    async loadOrders() {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch('http://localhost:3000/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        this.orders = await response.json()
      } catch (error) {
        console.error('Error loading orders:', error)
      }
    },
    editProduct(product) {
      this.productForm = { ...product }
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
    },
    async saveProduct() {
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
          this.closeProductModal()
          this.loadProducts()
        } else {
          alert('Error saving product')
        }
      } catch (error) {
        alert('Error saving product')
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
          this.loadProducts()
        } else {
          alert('Error deleting product')
        }
      } catch (error) {
        alert('Error deleting product')
      }
    },
    async toggleUserBlock(user) {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch(`http://localhost:3000/api/admin/users/${user.id}/block`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ blocked: !user.blocked })
        })

        if (response.ok) {
          this.loadUsers()
        } else {
          alert('Error updating user')
        }
      } catch (error) {
        alert('Error updating user')
      }
    },
    async changeUserRole(user) {
      const newRole = prompt('Enter new role (user/admin):', user.role)
      if (!newRole || !['user', 'admin'].includes(newRole)) return

      const token = localStorage.getItem('token')
      try {
        const response = await fetch(`http://localhost:3000/api/admin/users/${user.id}/role`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ role: newRole })
        })

        if (response.ok) {
          this.loadUsers()
        } else {
          alert('Error updating user role')
        }
      } catch (error) {
        alert('Error updating user role')
      }
    },
    async updateOrderStatus(orderId, status) {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        })

        if (response.ok) {
          this.loadOrders()
        } else {
          alert('Error updating order status')
        }
      } catch (error) {
        alert('Error updating order status')
      }
    },
    async deleteOrder(id) {
      if (!confirm('Are you sure you want to delete this order?')) return

      const token = localStorage.getItem('token')
      try {
        const response = await fetch(`http://localhost:3000/api/admin/orders/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (response.ok) {
          this.loadOrders()
        } else {
          alert('Error deleting order')
        }
      } catch (error) {
        alert('Error deleting order')
      }
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 80vh;
}

.admin-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}

.admin-sidebar {
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: var(--shadow);
  padding: 20px;
  height: fit-content;
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  background: none;
  border: 2px solid var(--border-color);
  color: var(--text-color);
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-item:hover,
.nav-item.active {
  background: #2ecc71;
  border-color: #2ecc71;
  color: white;
}

.admin-content {
  min-height: 500px;
}

.admin-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: var(--text-color);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.admin-table th {
  background: rgba(46, 204, 113, 0.1);
  font-weight: 600;
  color: var(--text-color);
}

.admin-table tr:hover {
  background: rgba(46, 204, 113, 0.05);
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 768px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}
</style>