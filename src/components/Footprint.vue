<template>
  <div class="footprint">
    <h2>🌍 Your Eco-Footprint Tracker</h2>
    <div class="add-activity">
      <h3>Log an Eco Activity</h3>
      <form @submit.prevent="addActivity">
        <select v-model="newActivity.activity" required>
          <option value="">Select Activity</option>
          <option value="Recycled">Recycled Waste</option>
          <option value="Biked">Biked Instead of Driving</option>
          <option value="Planted">Planted a Tree</option>
          <option value="Saved Water">Conserved Water</option>
          <option value="Used Public Transport">Used Public Transport</option>
        </select>
        <input v-model.number="newActivity.impact" type="number" placeholder="CO2 Saved (kg)" required>
        <button type="submit">Log Activity</button>
      </form>
    </div>
    <div class="activities">
      <h3>Your Activities</h3>
      <div v-for="activity in activities" :key="activity.id" class="activity">
        <p>{{ activity.activity }} - {{ activity.date }} - CO2 Saved: {{ activity.impact }} kg</p>
      </div>
      <p v-if="activities.length === 0">No activities logged yet.</p>
    </div>
    <div class="total">
      <h3>Total CO2 Saved: {{ totalImpact.toFixed(2) }} kg</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footprint',
  data() {
    return {
      activities: [],
      newActivity: {
        activity: '',
        impact: 0
      }
    }
  },
  computed: {
    totalImpact() {
      return this.activities.reduce((sum, act) => sum + act.impact, 0);
    }
  },
  mounted() {
    this.fetchActivities();
  },
  methods: {
    async fetchActivities() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/api/footprint', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.activities = data.activities;
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    },
    async addActivity() {
      const token = localStorage.getItem('token');
      try {
        await fetch('http://localhost:3000/api/footprint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.newActivity)
        });
        this.newActivity = { activity: '', impact: 0 };
        this.fetchActivities();
      } catch (error) {
        console.error('Error adding activity:', error);
      }
    }
  }
}
</script>

<style scoped>
.footprint {
  padding: 20px;
}

.add-activity, .activities, .total {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

select, input {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  background: var(--bg-color);
  color: var(--text-color);
}

button {
  background: var(--button-bg);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: var(--button-hover);
}

.activity {
  border-bottom: 1px solid var(--border-color);
  padding: 10px 0;
}

.total {
  text-align: center;
  font-size: 1.2em;
  color: var(--button-bg);
}
</style>