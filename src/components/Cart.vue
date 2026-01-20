<template>
  <div class="cart-page">
    <!-- Hero Section -->
    <div class="cart-hero">
      <div class="hero-content">
        <h1>🛒 {{ t('cart.title') }}</h1>
        <p v-if="cart.length > 0">{{ cart.length }} {{ t('cart.itemsReady') }}</p>
        <p v-else>{{ t('cart.shoppingAwaits') }}</p>
      </div>
      <div class="hero-stats" v-if="cart.length > 0">
        <div class="hero-stat">
          <span class="stat-value">€{{ subtotal.toFixed(2) }}</span>
          <span class="stat-label">{{ t('cart.total') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-value">{{ Math.ceil(subtotal / 10) }}</span>
          <span class="stat-label">{{ t('cart.treesToPlant') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-value">0</span>
          <span class="stat-label">{{ t('cart.carbonCost') }}</span>
        </div>
      </div>
    </div>

    <div class="cart-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ t('cart.loading') }}</p>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="cart.length === 0" class="empty-cart">
        <div class="empty-content">
          <div class="empty-icon">🛒</div>
          <h3>{{ t('cart.empty') }}</h3>
          <p>{{ t('cart.discoverProducts') }}</p>
          <router-link to="/products" class="shop-btn">
            🌿 {{ t('cart.browseProducts') }}
          </router-link>
        </div>
        <div class="empty-suggestions">
          <h4>{{ t('cart.whyShopEco') }}</h4>
          <div class="suggestion-cards">
            <div class="suggestion-card">
              <span class="suggestion-icon">🌍</span>
              <span>{{ t('cart.planetFriendly') }}</span>
            </div>
            <div class="suggestion-card">
              <span class="suggestion-icon">♻️</span>
              <span>{{ t('cart.sustainableMaterials') }}</span>
            </div>
            <div class="suggestion-card">
              <span class="suggestion-icon">🌱</span>
              <span>{{ t('cart.carbonOffset') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Content -->
      <div v-else class="cart-content">
        <!-- Cart Items Section -->
        <div class="cart-items-section">
          <div class="section-header">
            <h2>{{ t('cart.cartItems') }}</h2>
            <button class="clear-all-btn" @click="clearCart">
              🗑️ {{ t('cart.clearAll') }}
            </button>
          </div>

          <div class="cart-items">
            <div v-for="item in cart" :key="item.id" class="cart-item">
              <div class="item-checkbox">
                <input type="checkbox" :id="'item-' + item.id" checked disabled />
              </div>
              
              <div class="item-image">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.name" @error="handleImageError" />
                <div v-else class="no-image">🌱</div>
                <span v-if="item.stock < 5" class="stock-badge">Only {{ item.stock }} left</span>
              </div>
              
              <div class="item-details">
                <div class="item-category">{{ t('cart.ecoProduct') }}</div>
                <h3>{{ item.name }}</h3>
                <div class="item-meta">
                  <span class="eco-tag">🌱 Eco-Friendly</span>
                  <span class="carbon-tag">♻️ Carbon Neutral</span>
                </div>
                <p v-if="item.stock < item.quantity" class="stock-warning">
                  ⚠️ Only {{ item.stock }} available in stock
                </p>
              </div>
              
              <div class="item-actions">
                <div class="quantity-control">
                  <button 
                    class="qty-btn minus" 
                    @click="updateQuantity(item.id, item.quantity - 1)" 
                    :disabled="item.quantity <= 1"
                  >−</button>
                  <input 
                    type="number" 
                    :value="item.quantity" 
                    @change="updateQuantity(item.id, parseInt($event.target.value) || 1)"
                    min="1"
                    :max="item.stock"
                    class="qty-input"
                  />
                  <button 
                    class="qty-btn plus" 
                    @click="updateQuantity(item.id, item.quantity + 1)" 
                    :disabled="item.quantity >= item.stock"
                  >+</button>
                </div>
                <div class="price-section">
                  <span class="unit-price">€{{ item.price.toFixed(2) }} each</span>
                  <span class="total-price">€{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
              
              <button class="remove-btn" @click="removeItem(item.id)" title="Remove item">
                <span class="remove-icon">✕</span>
              </button>
            </div>
          </div>

          <!-- Continue Shopping -->
          <router-link to="/products" class="continue-shopping">
            ← {{ t('cart.continueShopping') }}
          </router-link>
        </div>

        <!-- Order Summary Section -->
        <div class="order-summary-section">
          <div class="summary-card">
            <h3>{{ t('cart.orderSummary') }}</h3>
            
            <div class="promo-code">
              <input type="text" placeholder="Enter promo code" v-model="promoCode" />
              <button @click="applyPromo" :disabled="!promoCode">Apply</button>
            </div>

            <div class="summary-details">
              <div class="summary-row">
                <span>Subtotal ({{ cart.length }} items)</span>
                <span>€{{ subtotal.toFixed(2) }}</span>
              </div>
              
              <div class="summary-row discount" v-if="discount > 0">
                <span>Discount</span>
                <span class="discount-value">-€{{ discount.toFixed(2) }}</span>
              </div>
              
              <div class="summary-row">
                <span>{{ t('cart.ecoShipping') }}</span>
                <span class="free-badge">{{ t('cart.free').toUpperCase() }}</span>
              </div>
              
              <div class="summary-row">
                <span>{{ t('cart.carbonOffset') }}</span>
                <span class="included-badge">{{ t('common.included') }}</span>
              </div>
              
              <div class="summary-divider"></div>
              
              <div class="summary-row total">
                <span>Total</span>
                <span>€{{ (subtotal - discount).toFixed(2) }}</span>
              </div>
            </div>

            <div class="eco-impact-card">
              <div class="impact-header">
                <span class="impact-icon">🌍</span>
                <span>Your Eco Impact</span>
              </div>
              <div class="impact-stats">
                <div class="impact-item">
                  <span class="impact-value">{{ Math.ceil(subtotal / 10) }}</span>
                  <span class="impact-label">Trees Planted</span>
                </div>
                <div class="impact-item">
                  <span class="impact-value">{{ (subtotal * 0.5).toFixed(1) }}kg</span>
                  <span class="impact-label">CO₂ Offset</span>
                </div>
              </div>
            </div>
            
            <button class="checkout-btn" @click="showCheckoutModal = true" :disabled="processing">
              <span class="btn-icon">🌿</span>
              <span>Proceed to Checkout</span>
              <span class="btn-arrow">→</span>
            </button>

            <div class="trust-badges">
              <div class="trust-badge">🔒 Secure Checkout</div>
              <div class="trust-badge">🚚 Fast Delivery</div>
              <div class="trust-badge">↩️ Easy Returns</div>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="payment-methods">
            <span>{{ t('cart.weAccept') }}</span>
            <div class="payment-icons">
              <span>💳</span>
              <span>🏦</span>
              <span>📱</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkout Modal -->
    <div v-if="showCheckoutModal" class="modal-overlay" @click.self="showCheckoutModal = false">
      <div class="checkout-modal">
        <button class="close-modal" @click="showCheckoutModal = false">✕</button>
        
        <div class="modal-header">
          <div class="modal-icon">🌿</div>
          <h3>Complete Your Purchase</h3>
          <p>Review your eco-friendly order</p>
        </div>
        
        <div class="modal-body">
          <div class="order-items">
            <div v-for="item in cart" :key="item.id" class="order-item">
              <div class="order-item-image">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.name" />
                <span v-else>🌱</span>
              </div>
              <div class="order-item-details">
                <span class="order-item-name">{{ item.name }}</span>
                <span class="order-item-qty">Qty: {{ item.quantity }}</span>
              </div>
              <span class="order-item-price">€{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-totals">
            <div class="order-total-row">
              <span>Subtotal</span>
              <span>€{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="order-total-row" v-if="discount > 0">
              <span>Discount</span>
              <span>-€{{ discount.toFixed(2) }}</span>
            </div>
            <div class="order-total-row">
              <span>Shipping</span>
              <span class="free-text">FREE</span>
            </div>
            <div class="order-total-row final">
              <span>Total</span>
              <span>€{{ (subtotal - discount).toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="eco-commitment">
            <div class="commitment-icon">🌱</div>
            <p>By completing this purchase, you're supporting sustainable practices and helping plant <strong>{{ Math.ceil(subtotal / 10) }} trees</strong>!</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="confirm-btn" @click="checkout" :disabled="processing">
            <span v-if="processing">Processing...</span>
            <span v-else>✓ Confirm Order • €{{ (subtotal - discount).toFixed(2) }}</span>
          </button>
          <button class="back-btn" @click="showCheckoutModal = false" :disabled="processing">
            ← Back to Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="success-modal">
        <div class="success-animation">
          <div class="success-circle">
            <span class="success-check">✓</span>
          </div>
        </div>
        <h3>Order Placed Successfully!</h3>
        <p class="success-subtitle">Thank you for your eco-friendly purchase!</p>
        
        <div class="order-confirmation">
          <div class="confirmation-row">
            <span>Order Number</span>
            <span class="order-number">#{{ lastOrderId }}</span>
          </div>
          <div class="confirmation-row">
            <span>Estimated Delivery</span>
            <span>3-5 Business Days</span>
          </div>
        </div>
        
        <div class="impact-summary">
          <h4>🌍 Your Impact</h4>
          <div class="impact-grid">
            <div class="impact-box">
              <span class="impact-num">{{ treesPlanted }}</span>
              <span class="impact-text">Trees Planted</span>
            </div>
            <div class="impact-box">
              <span class="impact-num">{{ (treesPlanted * 21).toFixed(0) }}kg</span>
              <span class="impact-text">CO₂ Offset/Year</span>
            </div>
          </div>
        </div>
        
        <div class="success-actions">
          <router-link to="/products" class="primary-action" @click="showSuccessModal = false">
            🛍️ Continue Shopping
          </router-link>
          <router-link to="/profile" class="secondary-action" @click="showSuccessModal = false">
            📦 View Orders
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'CartPage',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      cart: [],
      loading: true,
      processing: false,
      showCheckoutModal: false,
      showSuccessModal: false,
      lastOrderId: null,
      treesPlanted: 0,
      promoCode: '',
      discount: 0
    }
  },
  computed: {
    subtotal() {
      return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
  },
  mounted() {
    this.fetchCart();
  },
  methods: {
    async fetchCart() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      
      this.loading = true;
      try {
        const response = await fetch('http://localhost:3000/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.cart = data.cart || [];
        } else if (response.status === 401 || response.status === 403) {
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async updateQuantity(id, newQuantity) {
      if (newQuantity < 1) return;
      
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3000/api/cart/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ quantity: newQuantity })
        });
        
        if (response.ok) {
          const item = this.cart.find(i => i.id === id);
          if (item) {
            if (newQuantity <= 0) {
              this.cart = this.cart.filter(i => i.id !== id);
            } else {
              item.quantity = newQuantity;
            }
          }
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    },
    
    async removeItem(id) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3000/api/cart/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          this.cart = this.cart.filter(item => item.id !== id);
        }
      } catch (error) {
        console.error('Error removing item:', error);
      }
    },
    
    async clearCart() {
      if (!confirm('Are you sure you want to clear your cart?')) return;
      
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/api/cart', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          this.cart = [];
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    },
    
    applyPromo() {
      // Demo promo codes
      const codes = {
        'ECO10': 0.1,
        'GREEN20': 0.2,
        'PLANET15': 0.15
      };
      
      const discountRate = codes[this.promoCode.toUpperCase()];
      if (discountRate) {
        this.discount = this.subtotal * discountRate;
      } else {
        alert('Invalid promo code');
      }
    },
    
    async checkout() {
      const token = localStorage.getItem('token');
      this.processing = true;
      
      try {
        const response = await fetch('http://localhost:3000/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          this.lastOrderId = data.orderId;
          this.treesPlanted = Math.ceil(data.total / 10);
          this.showCheckoutModal = false;
          this.showSuccessModal = true;
          this.cart = [];
          this.discount = 0;
          this.promoCode = '';
        } else {
          alert(data.error || 'Checkout failed');
        }
      } catch (error) {
        console.error('Error during checkout:', error);
        alert('Checkout failed. Please try again.');
      } finally {
        this.processing = false;
      }
    },
    
    handleImageError(e) {
      e.target.style.display = 'none';
    }
  }
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-bottom: 60px;
}

/* Hero Section */
.cart-hero {
  padding: 120px 20px 60px;
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  text-align: center;
}

.hero-content h1 {
  margin: 0 0 10px;
  font-size: 2.5em;
}

.hero-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1em;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.hero-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2em;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}

/* Container */
.cart-container {
  max-width: 1200px;
  margin: -30px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  background: var(--card-bg);
  border-radius: 20px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
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

.loading-state p {
  color: var(--text-secondary);
  margin: 0;
}

/* Empty Cart */
.empty-cart {
  background: var(--card-bg);
  border-radius: 20px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.empty-content {
  text-align: center;
  padding: 60px 30px;
}

.empty-icon {
  font-size: 5em;
  margin-bottom: 20px;
  opacity: 0.3;
}

.empty-content h3 {
  margin: 0 0 10px;
  color: var(--text-color);
  font-size: 1.5em;
}

.empty-content p {
  margin: 0 0 25px;
  color: var(--text-secondary);
}

.shop-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 35px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.05em;
  transition: all 0.3s;
}

.shop-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(46, 204, 113, 0.3);
}

.empty-suggestions {
  background: rgba(46, 204, 113, 0.05);
  padding: 30px;
  border-top: 1px solid var(--border-color);
}

.empty-suggestions h4 {
  margin: 0 0 20px;
  color: var(--text-color);
  text-align: center;
}

.suggestion-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.suggestion-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: var(--card-bg);
  border-radius: 25px;
  font-size: 0.95em;
  color: var(--text-color);
}

.suggestion-icon {
  font-size: 1.3em;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 30px;
  align-items: start;
}

/* Cart Items Section */
.cart-items-section {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.section-header h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.3em;
}

.clear-all-btn {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--text-secondary);
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  border-color: #e74c3c;
  color: #e74c3c;
}

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: grid;
  grid-template-columns: 30px 100px 1fr auto 40px;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 16px;
  transition: all 0.2s;
}

.dark .cart-item {
  background: rgba(255, 255, 255, 0.03);
}

.cart-item:hover {
  background: rgba(46, 204, 113, 0.05);
}

.item-checkbox input {
  width: 20px;
  height: 20px;
  accent-color: #2ecc71;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.item-image img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.no-image {
  font-size: 2.5em;
  opacity: 0.3;
}

.stock-badge {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 8px;
  background: #e74c3c;
  color: white;
  font-size: 0.7em;
  border-radius: 10px;
  white-space: nowrap;
}

.item-details {
  min-width: 0;
}

.item-category {
  font-size: 0.8em;
  color: #2ecc71;
  font-weight: 600;
  margin-bottom: 5px;
}

.item-details h3 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.eco-tag, .carbon-tag {
  font-size: 0.75em;
  padding: 4px 10px;
  border-radius: 15px;
  background: rgba(46, 204, 113, 0.1);
  color: #27ae60;
}

.stock-warning {
  color: #e74c3c;
  font-size: 0.85em;
  margin: 8px 0 0;
}

/* Item Actions */
.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.2em;
  color: var(--text-color);
  transition: all 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-input {
  width: 50px;
  height: 36px;
  border: none;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  background: transparent;
  text-align: center;
  font-size: 1em;
  font-weight: 600;
  color: var(--text-color);
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.price-section {
  text-align: right;
}

.unit-price {
  display: block;
  font-size: 0.85em;
  color: var(--text-secondary);
}

.total-price {
  display: block;
  font-size: 1.3em;
  font-weight: 700;
  color: #2ecc71;
}

/* Remove Button */
.remove-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-icon {
  color: #e74c3c;
  font-size: 0.9em;
}

.remove-btn:hover {
  background: #e74c3c;
}

.remove-btn:hover .remove-icon {
  color: white;
}

/* Continue Shopping */
.continue-shopping {
  display: inline-block;
  margin-top: 20px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95em;
  transition: color 0.2s;
}

.continue-shopping:hover {
  color: #2ecc71;
}

/* Order Summary Section */
.order-summary-section {
  position: sticky;
  top: 100px;
}

.summary-card {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
}

.summary-card h3 {
  margin: 0 0 20px;
  color: var(--text-color);
  font-size: 1.3em;
}

/* Promo Code */
.promo-code {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.promo-code input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: transparent;
  color: var(--text-color);
  font-size: 0.95em;
}

.promo-code button {
  padding: 12px 20px;
  background: transparent;
  border: 2px solid #2ecc71;
  color: #2ecc71;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.promo-code button:hover:not(:disabled) {
  background: #2ecc71;
  color: white;
}

.promo-code button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Summary Details */
.summary-details {
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: var(--text-secondary);
}

.summary-row.discount .discount-value {
  color: #2ecc71;
  font-weight: 600;
}

.free-badge {
  color: #2ecc71;
  font-weight: 600;
}

.included-badge {
  color: #27ae60;
}

.summary-divider {
  height: 1px;
  background: var(--border-color);
  margin: 15px 0;
}

.summary-row.total {
  font-size: 1.3em;
  font-weight: 700;
  color: var(--text-color);
  margin-top: 15px;
}

/* Eco Impact Card */
.eco-impact-card {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 20px;
}

.impact-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-weight: 600;
  color: var(--text-color);
}

.impact-icon {
  font-size: 1.3em;
}

.impact-stats {
  display: flex;
  gap: 15px;
}

.impact-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  background: var(--card-bg);
  border-radius: 10px;
}

.impact-value {
  display: block;
  font-size: 1.3em;
  font-weight: 700;
  color: #2ecc71;
}

.impact-label {
  font-size: 0.75em;
  color: var(--text-secondary);
}

/* Checkout Button */
.checkout-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
}

.checkout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-arrow {
  transition: transform 0.2s;
}

.checkout-btn:hover .btn-arrow {
  transform: translateX(4px);
}

/* Trust Badges */
.trust-badges {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.trust-badge {
  font-size: 0.8em;
  color: var(--text-secondary);
}

/* Payment Methods */
.payment-methods {
  margin-top: 20px;
  text-align: center;
  padding: 15px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.payment-methods span {
  font-size: 0.85em;
  color: var(--text-secondary);
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 8px;
  font-size: 1.5em;
}

/* Modal Styles */
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

.checkout-modal {
  background: var(--card-bg);
  border-radius: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1em;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.close-modal:hover {
  background: rgba(0, 0, 0, 0.1);
}

.modal-header {
  text-align: center;
  padding: 30px 30px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-icon {
  font-size: 3em;
  margin-bottom: 10px;
}

.modal-header h3 {
  margin: 0 0 5px;
  color: var(--text-color);
  font-size: 1.4em;
}

.modal-header p {
  margin: 0;
  color: var(--text-secondary);
}

.modal-body {
  padding: 20px 30px;
}

.order-items {
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.order-item:last-child {
  border-bottom: none;
}

.order-item-image {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.order-item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.order-item-details {
  flex: 1;
}

.order-item-name {
  display: block;
  color: var(--text-color);
  font-weight: 500;
}

.order-item-qty {
  font-size: 0.85em;
  color: var(--text-secondary);
}

.order-item-price {
  font-weight: 600;
  color: var(--text-color);
}

.order-totals {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
}

.dark .order-totals {
  background: rgba(255, 255, 255, 0.03);
}

.order-total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: var(--text-secondary);
}

.order-total-row.final {
  border-top: 1px solid var(--border-color);
  margin-top: 10px;
  padding-top: 15px;
  font-size: 1.2em;
  font-weight: 700;
  color: var(--text-color);
}

.free-text {
  color: #2ecc71;
  font-weight: 600;
}

.eco-commitment {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);
  border-radius: 12px;
}

.commitment-icon {
  font-size: 2em;
  flex-shrink: 0;
}

.eco-commitment p {
  margin: 0;
  color: var(--text-color);
  font-size: 0.95em;
  line-height: 1.5;
}

.modal-footer {
  padding: 20px 30px 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.confirm-btn {
  padding: 16px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-btn {
  padding: 14px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: var(--text-secondary);
}

/* Success Modal */
.success-modal {
  background: var(--card-bg);
  border-radius: 24px;
  padding: 40px 30px;
  max-width: 450px;
  width: 100%;
  text-align: center;
  animation: modalIn 0.3s ease;
}

.success-animation {
  margin-bottom: 20px;
}

.success-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  animation: successPop 0.5s ease;
}

@keyframes successPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.success-check {
  color: white;
  font-size: 2.5em;
  font-weight: 700;
}

.success-modal h3 {
  margin: 0 0 10px;
  color: #2ecc71;
  font-size: 1.6em;
}

.success-subtitle {
  margin: 0 0 25px;
  color: var(--text-secondary);
}

.order-confirmation {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
}

.dark .order-confirmation {
  background: rgba(255, 255, 255, 0.03);
}

.confirmation-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: var(--text-secondary);
}

.order-number {
  font-weight: 700;
  color: var(--text-color);
}

.impact-summary {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
}

.impact-summary h4 {
  margin: 0 0 15px;
  color: var(--text-color);
}

.impact-grid {
  display: flex;
  gap: 15px;
}

.impact-box {
  flex: 1;
  padding: 15px;
  background: var(--card-bg);
  border-radius: 10px;
}

.impact-num {
  display: block;
  font-size: 1.8em;
  font-weight: 700;
  color: #2ecc71;
}

.impact-text {
  font-size: 0.8em;
  color: var(--text-secondary);
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.primary-action {
  padding: 16px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s;
}

.primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
}

.secondary-action {
  padding: 14px;
  background: transparent;
  color: var(--text-color);
  text-decoration: none;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s;
}

.secondary-action:hover {
  border-color: #2ecc71;
  color: #2ecc71;
}

/* Responsive */
@media (max-width: 900px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .order-summary-section {
    position: static;
  }
}

@media (max-width: 700px) {
  .cart-hero {
    padding: 100px 15px 50px;
  }

  .hero-content h1 {
    font-size: 2em;
  }

  .hero-stats {
    gap: 30px;
  }

  .cart-item {
    grid-template-columns: 80px 1fr 40px;
    gap: 15px;
  }

  .item-checkbox {
    display: none;
  }

  .item-actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .impact-grid {
    flex-direction: column;
  }
}
</style>
