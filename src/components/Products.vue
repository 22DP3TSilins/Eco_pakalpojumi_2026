<template>
  <div class="products-page">
    <!-- Hero Section -->
    <div class="products-hero">
      <div class="hero-content">
        <h1>🌿 {{ t('products.title') }}</h1>
        <p>{{ t('products.subtitle') }}</p>
        <div class="hero-search">
          <input 
            type="text" 
            v-model="searchQuery" 
            :placeholder="t('products.searchPlaceholder')"
          />
          <button class="search-btn">🔍</button>
        </div>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="stat-number">{{ products.length }}</span>
          <span class="stat-label">{{ t('products.productsCount') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-number">{{ categories.length }}</span>
          <span class="stat-label">{{ t('products.categoriesCount') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-number">100%</span>
          <span class="stat-label">{{ t('products.ecoFriendly') }}</span>
        </div>
      </div>
    </div>

    <div class="products-container">
      <!-- Sidebar Filters -->
      <aside class="filters-sidebar">
        <div class="filter-card">
          <h3>🏷️ {{ t('products.categories') }}</h3>
          <div class="category-list">
            <button 
              :class="['category-btn', { active: selectedCategory === '' }]"
              @click="selectedCategory = ''"
            >
              <span class="cat-icon">📦</span>
              <span>{{ t('products.allProducts') }}</span>
              <span class="cat-count">{{ products.length }}</span>
            </button>
            <button 
              v-for="cat in categories" 
              :key="cat"
              :class="['category-btn', { active: selectedCategory === cat }]"
              @click="selectedCategory = cat"
            >
              <span class="cat-icon">{{ getCategoryIcon(cat) }}</span>
              <span>{{ cat }}</span>
              <span class="cat-count">{{ getCategoryCount(cat) }}</span>
            </button>
          </div>
        </div>

        <div class="filter-card">
          <h3>💰 {{ t('products.priceRange') }}</h3>
          <div class="price-range">
            <input type="range" v-model="maxPrice" min="0" :max="priceLimit" :step="priceLimit > 1000 ? 100 : 5" />
            <div class="price-labels">
              <span>€0</span>
              <span class="price-value">{{ t('products.upTo') }} €{{ formatPrice(maxPrice) }}</span>
            </div>
          </div>
        </div>

        <div class="filter-card">
          <h3>📊 {{ t('products.availability') }}</h3>
          <label class="checkbox-option">
            <input type="checkbox" v-model="showAvailableOnly" />
            <span class="checkbox-mark"></span>
            <span>{{ t('products.inStockOnly') }}</span>
          </label>
        </div>

        <div class="filter-card">
          <h3>🔄 {{ t('products.sortBy') }}</h3>
          <select v-model="sortBy" class="sort-select">
            <option value="default">{{ t('products.sortDefault') }}</option>
            <option value="price-low">{{ t('products.sortPriceLow') }}</option>
            <option value="price-high">{{ t('products.sortPriceHigh') }}</option>
            <option value="name">{{ t('products.sortName') }}</option>
          </select>
        </div>

        <button class="reset-filters" @click="resetFilters">
          🔄 {{ t('products.resetFilters') }}
        </button>
      </aside>

      <!-- Products Grid -->
      <div class="products-main">
        <div class="products-header-bar">
          <p class="results-count">
            {{ t('products.showing') }} <strong>{{ displayProducts.length }}</strong> {{ t('products.productsCount') }}
          </p>
          <div class="view-toggle">
            <button :class="['view-btn', { active: viewMode === 'grid' }]" @click="viewMode = 'grid'">
              ▦
            </button>
            <button :class="['view-btn', { active: viewMode === 'list' }]" @click="viewMode = 'list'">
              ☰
            </button>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading eco products...</p>
        </div>

        <div v-else-if="displayProducts.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search query</p>
          <button class="reset-btn" @click="resetFilters">{{ t('products.resetFilters') }}</button>
        </div>

        <div v-else :class="['products-grid', viewMode]">
          <div 
            v-for="product in displayProducts" 
            :key="product.id" 
            :class="['product-card', viewMode]"
          >
            <div class="product-badges">
              <span v-if="product.stock < 5 && product.stock > 0" class="badge low-stock">
                Only {{ product.stock }} left!
              </span>
              <span v-if="product.isNew" class="badge new">NEW</span>
              <span v-if="product.isFeatured" class="badge featured">⭐ Featured</span>
            </div>
            
            <div class="product-image">
              <img 
                v-if="product.image_url" 
                :src="product.image_url" 
                :alt="product.name"
                @error="handleImageError"
              />
              <div v-else class="no-image">
                <span>🌱</span>
              </div>
              <div class="product-overlay">
                <button class="quick-view-btn" @click="quickView(product)">
                  👁️ Quick View
                </button>
              </div>
            </div>
            
            <div class="product-content">
              <div class="product-category">{{ product.category }}</div>
              <h3>{{ product.name }}</h3>
              <p class="product-description">{{ truncateText(product.description, 80) }}</p>
              
              <div class="product-footer">
                <div class="price-section">
                  <span class="current-price">€{{ product.price.toFixed(2) }}</span>
                </div>
                <div class="stock-status" :class="{ 'out-of-stock': product.stock === 0 }">
                  {{ product.stock > 0 ? `${product.stock} ${t('products.inStock')}` : t('products.outOfStock') }}
                </div>
              </div>

              <div v-if="product.lifecycle_info" class="eco-badge">
                <span class="eco-icon">🌱</span>
                {{ truncateText(product.lifecycle_info, 50) }}
              </div>
              
              <button 
                class="add-to-cart-btn"
                @click="addToCart(product)"
                :disabled="product.stock === 0"
              >
                <span v-if="product.stock === 0">Out of Stock</span>
                <span v-else-if="addingToCart === product.id">Adding...</span>
                <span v-else>🛒 Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick View Modal -->
    <div v-if="showQuickView" class="modal-overlay" @click.self="showQuickView = false">
      <div class="quick-view-modal">
        <button class="close-modal" @click="showQuickView = false">✕</button>
        <div class="modal-content">
          <div class="modal-image">
            <img 
              v-if="selectedProduct.image_url" 
              :src="selectedProduct.image_url" 
              :alt="selectedProduct.name"
            />
            <div v-else class="no-image large">🌱</div>
          </div>
          <div class="modal-info">
            <span class="modal-category">{{ selectedProduct.category }}</span>
            <h2>{{ selectedProduct.name }}</h2>
            <p class="modal-description">{{ selectedProduct.description }}</p>
            
            <div v-if="selectedProduct.lifecycle_info" class="modal-lifecycle">
              <h4>🌱 {{ t('products.lifecycle') }}</h4>
              <p>{{ selectedProduct.lifecycle_info }}</p>
            </div>
            
            <div class="modal-price">€{{ selectedProduct.price?.toFixed(2) }}</div>
            
            <div class="modal-stock" :class="{ 'out': selectedProduct.stock === 0 }">
              {{ selectedProduct.stock > 0 ? `${selectedProduct.stock} ${t('products.inStock')}` : t('products.outOfStock') }}
            </div>
            
            <div class="modal-actions">
              <div class="quantity-selector">
                <button @click="modalQuantity > 1 && modalQuantity--">−</button>
                <span>{{ modalQuantity }}</span>
                <button @click="modalQuantity < selectedProduct.stock && modalQuantity++">+</button>
              </div>
              <button 
                class="modal-add-btn"
                @click="addToCartFromModal"
                :disabled="selectedProduct.stock === 0"
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'ProductsPage',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      products: [],
      categories: [],
      selectedCategory: '',
      showAvailableOnly: false,
      searchQuery: '',
      maxPrice: 100000,
      priceLimit: 100000,
      sortBy: 'default',
      viewMode: 'grid',
      loading: true,
      addingToCart: null,
      showQuickView: false,
      selectedProduct: {},
      modalQuantity: 1
    }
  },
  computed: {
    displayProducts() {
      let result = [...this.products];
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
        );
      }
      
      // Category filter
      if (this.selectedCategory) {
        result = result.filter(p => p.category === this.selectedCategory);
      }
      
      // Availability filter
      if (this.showAvailableOnly) {
        result = result.filter(p => p.stock > 0);
      }
      
      // Price filter
      result = result.filter(p => p.price <= this.maxPrice);
      
      // Sorting
      if (this.sortBy === 'price-low') {
        result.sort((a, b) => a.price - b.price);
      } else if (this.sortBy === 'price-high') {
        result.sort((a, b) => b.price - a.price);
      } else if (this.sortBy === 'name') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      return result;
    }
  },
  mounted() {
    this.loadProducts();
  },
  methods: {
    async loadProducts() {
      this.loading = true;
      try {
        const response = await fetch('http://localhost:3000/api/products');
        if (response.ok) {
          const data = await response.json();
          this.products = Array.isArray(data) ? data : (data.products || []);
          this.categories = [...new Set(this.products.map(p => p.category).filter(Boolean))];
          // Set price limit based on actual product prices
          if (this.products.length > 0) {
            const highestPrice = Math.max(...this.products.map(p => p.price || 0));
            this.priceLimit = Math.ceil(highestPrice / 100) * 100; // Round up to nearest 100
            this.maxPrice = this.priceLimit;
          }
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        this.loading = false;
      }
    },
    handleImageError(e) {
      e.target.style.display = 'none';
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    },
    getCategoryIcon(category) {
      const icons = {
        'Home': '🏠',
        'Kitchen': '🍳',
        'Garden': '🌱',
        'Beauty': '✨',
        'Fashion': '👕',
        'Electronics': '📱',
        'Office': '📎',
        'Food': '🥗'
      };
      return icons[category] || '📦';
    },
    getCategoryCount(category) {
      return this.products.filter(p => p.category === category).length;
    },
    resetFilters() {
      this.selectedCategory = '';
      this.showAvailableOnly = false;
      this.searchQuery = '';
      this.maxPrice = this.priceLimit;
      this.sortBy = 'default';
    },
    formatPrice(price) {
      if (price >= 1000) {
        return (price / 1000).toFixed(1) + 'K';
      }
      return price;
    },
    quickView(product) {
      this.selectedProduct = product;
      this.modalQuantity = 1;
      this.showQuickView = true;
    },
    async addToCart(product) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      this.addingToCart = product.id;
      try {
        const response = await fetch('http://localhost:3000/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: product.id, quantity: 1 })
        });

        if (response.ok) {
          // Success feedback could be added here
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setTimeout(() => {
          this.addingToCart = null;
        }, 500);
      }
    },
    async addToCartFromModal() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      try {
        await fetch('http://localhost:3000/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            product_id: this.selectedProduct.id, 
            quantity: this.modalQuantity 
          })
        });
        this.showQuickView = false;
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  }
}
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-bottom: 60px;
}

/* Hero Section */
.products-hero {
  padding: 120px 20px 60px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  text-align: center;
}

.hero-content h1 {
  margin: 0 0 10px;
  font-size: 2.5em;
}

.hero-content p {
  margin: 0 0 30px;
  opacity: 0.9;
  font-size: 1.1em;
}

.hero-search {
  display: flex;
  max-width: 500px;
  margin: 0 auto 30px;
  background: white;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.hero-search input {
  flex: 1;
  padding: 15px 25px;
  border: none;
  font-size: 1em;
  color: #333;
}

.hero-search input::placeholder {
  color: #aaa;
}

.search-btn {
  padding: 15px 25px;
  background: transparent;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.hero-stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2em;
  font-weight: 700;
}

.stat-label {
  opacity: 0.9;
  font-size: 0.9em;
}

/* Container */
.products-container {
  max-width: 1300px;
  margin: -30px auto 0;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  position: relative;
  z-index: 10;
}

/* Filters Sidebar */
.filters-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.filter-card h3 {
  margin: 0 0 15px;
  color: var(--text-color);
  font-size: 1em;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.9em;
  transition: all 0.2s;
  text-align: left;
}

.dark .category-btn {
  background: rgba(255, 255, 255, 0.05);
}

.category-btn:hover {
  background: rgba(46, 204, 113, 0.1);
}

.category-btn.active {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
}

.cat-icon {
  font-size: 1.1em;
}

.cat-count {
  margin-left: auto;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 0.8em;
}

.category-btn.active .cat-count {
  background: rgba(255, 255, 255, 0.2);
}

/* Price Range */
.price-range input[type="range"] {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(46, 204, 113, 0.2);
  border-radius: 3px;
  outline: none;
}

.price-range input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #2ecc71;
  border-radius: 50%;
  cursor: pointer;
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.85em;
  color: var(--text-secondary);
}

.price-value {
  color: #2ecc71;
  font-weight: 600;
}

/* Checkbox */
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: var(--text-color);
}

.checkbox-option input {
  display: none;
}

.checkbox-mark {
  width: 22px;
  height: 22px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-option input:checked + .checkbox-mark {
  background: #2ecc71;
  border-color: #2ecc71;
}

.checkbox-option input:checked + .checkbox-mark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8em;
}

/* Sort Select */
.sort-select {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.9em;
  cursor: pointer;
}

.reset-filters {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--border-color);
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.9em;
  transition: all 0.2s;
}

.reset-filters:hover {
  border-color: #2ecc71;
  color: #2ecc71;
}

/* Products Main */
.products-main {
  min-height: 400px;
}

.products-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 20px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.results-count {
  margin: 0;
  color: var(--text-secondary);
}

.view-toggle {
  display: flex;
  gap: 5px;
}

.view-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2em;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.dark .view-btn {
  background: rgba(255, 255, 255, 0.05);
}

.view-btn.active {
  background: #2ecc71;
  color: white;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--card-bg);
  border-radius: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: #2ecc71;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4em;
  margin-bottom: 15px;
}

.empty-state h3 {
  margin: 0 0 10px;
  color: var(--text-color);
}

.empty-state p {
  margin: 0 0 20px;
  color: var(--text-secondary);
}

.reset-btn {
  padding: 12px 25px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 25px;
}

.products-grid.list {
  grid-template-columns: 1fr;
}

/* Product Card */
.product-card {
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.product-card.list {
  display: grid;
  grid-template-columns: 200px 1fr;
}

.product-badges {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 5;
}

.badge {
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.75em;
  font-weight: 600;
}

.badge.low-stock {
  background: #e74c3c;
  color: white;
}

.badge.new {
  background: #3498db;
  color: white;
}

.badge.featured {
  background: #f39c12;
  color: white;
}

.product-image {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-card.list .product-image {
  height: auto;
  min-height: 180px;
}

.product-image img {
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.08);
}

.no-image {
  font-size: 4em;
  opacity: 0.3;
}

.no-image.large {
  font-size: 6em;
}

.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.quick-view-btn {
  padding: 12px 20px;
  background: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transform: translateY(10px);
  transition: all 0.3s;
}

.product-card:hover .quick-view-btn {
  transform: translateY(0);
}

.product-content {
  padding: 20px;
}

.product-category {
  font-size: 0.8em;
  color: #2ecc71;
  font-weight: 600;
  margin-bottom: 8px;
}

.product-content h3 {
  margin: 0 0 10px;
  color: var(--text-color);
  font-size: 1.1em;
}

.product-description {
  margin: 0 0 15px;
  color: var(--text-secondary);
  font-size: 0.9em;
  line-height: 1.5;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.current-price {
  font-size: 1.4em;
  font-weight: 700;
  color: #2ecc71;
}

.stock-status {
  font-size: 0.85em;
  color: #27ae60;
  padding: 4px 10px;
  background: rgba(46, 204, 113, 0.1);
  border-radius: 15px;
}

.stock-status.out-of-stock {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

.eco-badge {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(46, 204, 113, 0.08);
  border-radius: 10px;
  font-size: 0.85em;
  color: var(--text-color);
  margin-bottom: 15px;
}

.eco-icon {
  flex-shrink: 0;
}

.add-to-cart-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.3);
}

.add-to-cart-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

/* Quick View Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.quick-view-modal {
  background: var(--card-bg);
  border-radius: 24px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2em;
  z-index: 10;
  transition: all 0.2s;
}

.close-modal:hover {
  background: rgba(0, 0, 0, 0.2);
}

.modal-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.modal-image {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 400px;
}

.modal-image img {
  max-width: 100%;
  max-height: 350px;
  object-fit: contain;
}

.modal-info {
  padding: 30px;
}

.modal-category {
  display: inline-block;
  padding: 5px 12px;
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
  margin-bottom: 15px;
}

.modal-info h2 {
  margin: 0 0 15px;
  color: var(--text-color);
}

.modal-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.modal-lifecycle {
  background: rgba(46, 204, 113, 0.08);
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.modal-lifecycle h4 {
  margin: 0 0 8px;
  color: #27ae60;
}

.modal-lifecycle p {
  margin: 0;
  color: var(--text-color);
  font-size: 0.95em;
}

.modal-price {
  font-size: 2em;
  font-weight: 700;
  color: #2ecc71;
  margin-bottom: 10px;
}

.modal-stock {
  color: #27ae60;
  margin-bottom: 20px;
}

.modal-stock.out {
  color: #e74c3c;
}

.modal-actions {
  display: flex;
  gap: 15px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 5px 10px;
}

.quantity-selector button {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.2em;
  color: var(--text-color);
}

.quantity-selector span {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: var(--text-color);
}

.modal-add-btn {
  flex: 1;
  padding: 14px 25px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.3);
}

.modal-add-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 900px) {
  .products-container {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    display: none;
  }

  .modal-content {
    grid-template-columns: 1fr;
  }

  .modal-image {
    min-height: 250px;
  }
}

@media (max-width: 600px) {
  .products-hero {
    padding: 100px 15px 50px;
  }

  .hero-content h1 {
    font-size: 1.8em;
  }

  .hero-stats {
    gap: 20px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
