<template>
  <div class="products-page">
    <Section title="🌿 Our Eco Products" subtitle="Discover sustainable products that make a positive impact on our planet">
      <div class="filters">
        <div class="filter-group">
          <label for="category-filter">Category:</label>
          <select id="category-filter" v-model="selectedCategory" @change="filterProducts">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="availability-filter">Availability:</label>
          <select id="availability-filter" v-model="showAvailableOnly" @change="filterProducts">
            <option :value="false">All Products</option>
            <option :value="true">Available Only</option>
          </select>
        </div>
      </div>

      <div v-if="filteredProducts.length === 0" class="empty-state">
        <Card variant="empty">
          <div class="empty-content">
            <div class="empty-icon">🛍️</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or check back later for new eco-friendly products.</p>
          </div>
        </Card>
      </div>

      <div v-else class="products-grid">
        <Card v-for="product in filteredProducts" :key="product.id" class="product-card">
          <div v-if="product.image_url" class="product-image">
            <img :src="product.image_url" :alt="product.name" />
          </div>
          <h3>{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-meta">
            <span class="price">€{{ product.price }}</span>
            <span class="category">{{ product.category }}</span>
            <span class="stock" :class="{ 'out-of-stock': product.stock === 0 }">
              {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
            </span>
          </div>
          <div v-if="product.lifecycle_info" class="lifecycle-info">
            <strong>🌱 Lifecycle:</strong> {{ product.lifecycle_info }}
          </div>
          <template #footer>
            <Button
              @click="addToCart(product.id)"
              :disabled="product.stock === 0 || loading"
              icon="🛒"
            >
              {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </Button>
          </template>
        </Card>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from './common/Section.vue'
import Card from './common/Card.vue'
import Button from './common/Button.vue'

export default {
  name: 'Products',
  components: {
    Section,
    Card,
    Button
  },
  data() {
    return {
      products: [],
      filteredProducts: [],
      categories: [],
      selectedCategory: '',
      showAvailableOnly: false,
      loading: false
    }
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        this.products = data.products || data;
        this.categories = [...new Set(this.products.map(p => p.category))];
        this.filterProducts();
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    filterProducts() {
      let filtered = this.products;

      if (this.selectedCategory) {
        filtered = filtered.filter(p => p.category === this.selectedCategory);
      }

      if (this.showAvailableOnly) {
        filtered = filtered.filter(p => p.stock > 0);
      }

      this.filteredProducts = filtered;
    },
    async addToCart(productId) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      this.loading = true;
      try {
        const response = await fetch('http://localhost:3000/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: productId, quantity: 1 })
        });

        if (response.ok) {
          alert('Added to cart 🌱');
        } else {
          alert('Error adding to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding to cart');
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.products-page {
  min-height: 80vh;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 600;
  color: var(--text-color);
}

.filter-group select {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1em;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.product-card {
  height: fit-content;
}

.product-image {
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-description {
  color: var(--text-secondary);
  margin-bottom: 15px;
  line-height: 1.5;
}

.product-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
}

.price {
  font-size: 1.4em;
  font-weight: 700;
  color: #2ecc71;
}

.category {
  color: var(--text-secondary);
  font-style: italic;
}

.stock {
  font-size: 0.9em;
  color: #27ae60;
}

.stock.out-of-stock {
  color: #e74c3c;
}

.lifecycle-info {
  background: rgba(46, 204, 113, 0.1);
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9em;
  color: var(--text-color);
  margin-bottom: 15px;
}

.empty-content {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 4em;
  margin-bottom: 20px;
}

.empty-content h3 {
  color: var(--text-color);
  margin-bottom: 10px;
}

.empty-content p {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>