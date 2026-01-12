<template>
  <div class="calculator">
    <h2>🧮 Sustainability Calculator</h2>
    <p>Calculate your daily carbon footprint and see how to reduce it.</p>
    <form @submit.prevent="calculate">
      <div class="input-group">
        <label>Kilometers driven per day:</label>
        <input v-model.number="inputs.driving" type="number" min="0">
      </div>
      <div class="input-group">
        <label>Kilometers flown per year:</label>
        <input v-model.number="inputs.flying" type="number" min="0">
      </div>
      <div class="input-group">
        <label>Meat meals per week:</label>
        <input v-model.number="inputs.meat" type="number" min="0">
      </div>
      <div class="input-group">
        <label>Electricity usage (kWh per month):</label>
        <input v-model.number="inputs.electricity" type="number" min="0">
      </div>
      <button type="submit">Calculate Footprint</button>
    </form>
    <div v-if="footprint > 0" class="result">
      <h3>Your Estimated Daily CO2 Footprint: {{ footprint.toFixed(2) }} kg</h3>
      <p>Tips to reduce: Drive less, fly less, eat less meat, use renewable energy.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calculator',
  data() {
    return {
      inputs: {
        driving: 0,
        flying: 0,
        meat: 0,
        electricity: 0
      },
      footprint: 0
    }
  },
  methods: {
    calculate() {
      // Simple calculations (approximate)
      const drivingCO2 = this.inputs.driving * 0.2; // kg per km
      const flyingCO2 = (this.inputs.flying / 365) * 0.25; // kg per km per day
      const meatCO2 = (this.inputs.meat / 7) * 7; // kg per meal per day
      const electricityCO2 = (this.inputs.electricity / 30) * 0.5; // kg per kWh per day
      this.footprint = drivingCO2 + flyingCO2 + meatCO2 + electricityCO2;
    }
  }
}
</script>

<style scoped>
.calculator {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: var(--text-color);
}

input {
  width: 100%;
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
  width: 100%;
  transition: background 0.3s;
}

button:hover {
  background: var(--button-hover);
}

.result {
  margin-top: 20px;
  padding: 20px;
  background: var(--card-bg);
  border-radius: 10px;
  text-align: center;
}
</style>