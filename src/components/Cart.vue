<template>
  <div class="cart">
    <h2>🛒 Your Eco Cart</h2>
    <div v-if="cart.length === 0" class="empty-cart">
      <p>Your cart is empty. Start shopping for eco-friendly products!</p>
      <router-link to="/products">Browse Products</router-link>
    </div>
    <div v-else>
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <h3>{{ item.name }}</h3>
        <p>Quantity: {{ item.quantity }}</p>
        <p>Price: ${{ (item.price * item.quantity).toFixed(2) }}</p>
        <button @click="removeFromCart(item.id)">Remove</button>
      </div>
      <div class="total">
        <h3>Total: ${{ total.toFixed(2) }}</h3>
        <button @click="showPurchasePopup = true">Purchase 🌍</button>
      </div>
    </div>

    <div v-if="showPurchasePopup" class="popup">
      <div class="popup-content">
        <h3>Confirm Your Eco Purchase</h3>
        <p>By purchasing, you're supporting sustainable practices!</p>
        <p>Total: ${{ total.toFixed(2) }}</p>
        <button @click="purchase">Confirm Purchase</button>
        <button @click="showPurchasePopup = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data() {
    return {
      cart: [],
      showPurchasePopup: false
    }
  },
  computed: {
    total() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
      try {
        const response = await fetch('http://localhost:3000/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.cart = data.cart;
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    },
    async removeFromCart(id) {
      const token = localStorage.getItem('token');
      try {
        await fetch(`http://localhost:3000/api/cart/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        this.fetchCart();
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    },
    async purchase() {
      // Here you would process payment, but for now just clear cart
      alert('Thank you for your eco-friendly purchase! 🌱');
      this.cart = [];
      this.showPurchasePopup = false;
    }
  }
}
</script>

<style scoped>
.cart {
  padding: 20px;
}

h2 {
  text-align: center;
  color: var(--button-bg);
  margin-bottom: 30px;
}

.empty-cart {
  text-align: center;
  padding: 50px;
}

.empty-cart a {
  color: var(--button-bg);
  text-decoration: none;
  font-weight: bold;
}

.cart-item {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.cart-item h3 {
  margin: 0;
}

.cart-item p {
  margin: 5px 0;
}

button {
  background: var(--button-bg);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: var(--button-hover);
}

.total {
  text-align: center;
  margin-top: 30px;
  padding: 20px;
  background: var(--card-bg);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: var(--card-bg);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  text-align: center;
  max-width: 400px;
}

.popup-content h3 {
  color: var(--button-bg);
  margin-bottom: 15px;
}

.popup-content p {
  margin-bottom: 10px;
}

.popup-content button {
  margin: 10px;
  padding: 10px 20px;
}
</style>