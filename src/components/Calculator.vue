<template>
  <div class="calculator-page">
    <div class="calculator-container">
      <div class="calculator-header">
        <h1>🌍 {{ t('calculator.title') }}</h1>
        <p>{{ t('calculator.subtitle') }}</p>
      </div>

      <div class="calculator-content">
        <!-- Category Tabs -->
        <div class="category-tabs">
          <button 
            v-for="(cat, key) in categories" 
            :key="key"
            :class="['tab-btn', { active: activeCategory === key }]"
            @click="activeCategory = key"
          >
            <span class="tab-icon">{{ cat.icon }}</span>
            <span class="tab-label">{{ cat.label }}</span>
          </button>
        </div>

        <!-- Transportation Section -->
        <div v-show="activeCategory === 'transport'" class="category-section">
          <h2>🚗 {{ t('calculator.transportation') }}</h2>
          
          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">🚘</span>
              <div>
                <h3>{{ t('calculator.carTravel') }}</h3>
                <p>{{ t('calculator.carTravelDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.carKm" min="0" max="1000" step="10">
              <div class="input-value">
                <input type="number" v-model.number="inputs.carKm" min="0"> {{ t('calculator.kmWeek') }}
              </div>
            </div>
            <div class="sub-options">
              <label>{{ t('calculator.vehicleType') }}</label>
              <select v-model="inputs.carType">
                <option value="petrol">{{ t('calculator.petrolCar') }}</option>
                <option value="diesel">{{ t('calculator.dieselCar') }}</option>
                <option value="hybrid">{{ t('calculator.hybrid') }}</option>
                <option value="electric">{{ t('calculator.electricCar') }}</option>
              </select>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">✈️</span>
              <div>
                <h3>{{ t('calculator.airTravel') }}</h3>
                <p>{{ t('calculator.airTravelDesc') }}</p>
              </div>
            </div>
            <div class="flight-inputs">
              <div class="flight-type">
                <label>{{ t('calculator.shortHaul') }}</label>
                <input type="number" v-model.number="inputs.shortFlights" min="0" placeholder="0">
              </div>
              <div class="flight-type">
                <label>{{ t('calculator.mediumHaul') }}</label>
                <input type="number" v-model.number="inputs.mediumFlights" min="0" placeholder="0">
              </div>
              <div class="flight-type">
                <label>{{ t('calculator.longHaul') }}</label>
                <input type="number" v-model.number="inputs.longFlights" min="0" placeholder="0">
              </div>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">🚌</span>
              <div>
                <h3>{{ t('calculator.publicTransport') }}</h3>
                <p>{{ t('calculator.publicTransportDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.publicTransport" min="0" max="40" step="1">
              <div class="input-value">
                <input type="number" v-model.number="inputs.publicTransport" min="0"> {{ t('calculator.hrsWeek') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Home Energy Section -->
        <div v-show="activeCategory === 'home'" class="category-section">
          <h2>🏠 {{ t('calculator.homeEnergy') }}</h2>
          
          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">⚡</span>
              <div>
                <h3>{{ t('calculator.electricity') }}</h3>
                <p>{{ t('calculator.electricityDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.electricity" min="0" max="1000" step="10">
              <div class="input-value">
                <input type="number" v-model.number="inputs.electricity" min="0"> {{ t('calculator.kwhMonth') }}
              </div>
            </div>
            <div class="sub-options">
              <label>{{ t('calculator.energySource') }}</label>
              <select v-model="inputs.energySource">
                <option value="mixed">{{ t('calculator.mixedGrid') }}</option>
                <option value="renewable">{{ t('calculator.renewableEnergy') }}</option>
                <option value="coal">{{ t('calculator.coalHeavy') }}</option>
              </select>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">🔥</span>
              <div>
                <h3>{{ t('calculator.heating') }}</h3>
                <p>{{ t('calculator.heatingDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.heating" min="0" max="500" step="10">
              <div class="input-value">
                <input type="number" v-model.number="inputs.heating" min="0"> {{ t('calculator.m3Month') }}
              </div>
            </div>
            <div class="sub-options">
              <label>{{ t('calculator.heatingType') }}</label>
              <select v-model="inputs.heatingType">
                <option value="gas">{{ t('calculator.naturalGas') }}</option>
                <option value="oil">{{ t('calculator.heatingOil') }}</option>
                <option value="electric">{{ t('calculator.electric') }}</option>
                <option value="heatpump">{{ t('calculator.heatPump') }}</option>
                <option value="wood">{{ t('calculator.woodBiomass') }}</option>
              </select>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">💧</span>
              <div>
                <h3>{{ t('calculator.waterUsage') }}</h3>
                <p>{{ t('calculator.waterUsageDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.water" min="0" max="500" step="10">
              <div class="input-value">
                <input type="number" v-model.number="inputs.water" min="0"> {{ t('calculator.lDay') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Food Section -->
        <div v-show="activeCategory === 'food'" class="category-section">
          <h2>🍽️ {{ t('calculator.foodDiet') }}</h2>
          
          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">🥩</span>
              <div>
                <h3>{{ t('calculator.meatConsumption') }}</h3>
                <p>{{ t('calculator.meatConsumptionDesc') }}</p>
              </div>
            </div>
            <div class="meat-types">
              <div class="meat-type">
                <label>🐄 {{ t('calculator.beef') }}</label>
                <input type="number" v-model.number="inputs.beef" min="0" max="21" placeholder="0">
              </div>
              <div class="meat-type">
                <label>🐖 {{ t('calculator.pork') }}</label>
                <input type="number" v-model.number="inputs.pork" min="0" max="21" placeholder="0">
              </div>
              <div class="meat-type">
                <label>🐔 {{ t('calculator.poultry') }}</label>
                <input type="number" v-model.number="inputs.poultry" min="0" max="21" placeholder="0">
              </div>
              <div class="meat-type">
                <label>🐟 {{ t('calculator.fish') }}</label>
                <input type="number" v-model.number="inputs.fish" min="0" max="21" placeholder="0">
              </div>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">🥛</span>
              <div>
                <h3>{{ t('calculator.dairyProducts') }}</h3>
                <p>{{ t('calculator.dairyProductsDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.dairy" min="0" max="10" step="1">
              <div class="input-value">
                <input type="number" v-model.number="inputs.dairy" min="0"> {{ t('calculator.servingsDay') }}
              </div>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">🗑️</span>
              <div>
                <h3>{{ t('calculator.foodWaste') }}</h3>
                <p>{{ t('calculator.foodWasteDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.foodWaste" min="0" max="50" step="5">
              <div class="input-value">
                <input type="number" v-model.number="inputs.foodWaste" min="0" max="100">%
              </div>
            </div>
          </div>
        </div>

        <!-- Lifestyle Section -->
        <div v-show="activeCategory === 'lifestyle'" class="category-section">
          <h2>🛍️ {{ t('calculator.lifestyleShopping') }}</h2>
          
          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">👕</span>
              <div>
                <h3>{{ t('calculator.clothing') }}</h3>
                <p>{{ t('calculator.clothingDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.clothing" min="0" max="20" step="1">
              <div class="input-value">
                <input type="number" v-model.number="inputs.clothing" min="0"> {{ t('calculator.itemsMonth') }}
              </div>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">📦</span>
              <div>
                <h3>{{ t('calculator.onlineShopping') }}</h3>
                <p>{{ t('calculator.onlineShoppingDesc') }}</p>
              </div>
            </div>
            <div class="input-row">
              <input type="range" v-model.number="inputs.packages" min="0" max="30" step="1">
              <div class="input-value">
                <input type="number" v-model.number="inputs.packages" min="0"> {{ t('calculator.packagesMonth') }}
              </div>
            </div>
          </div>

          <div class="input-card">
            <div class="input-header">
              <span class="input-icon">♻️</span>
              <div>
                <h3>{{ t('calculator.recyclingHabits') }}</h3>
                <p>{{ t('calculator.recyclingHabitsDesc') }}</p>
              </div>
            </div>
            <div class="radio-options">
              <label class="radio-option">
                <input type="radio" v-model="inputs.recycling" value="none">
                <span>{{ t('calculator.none') }}</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="inputs.recycling" value="some">
                <span>{{ t('calculator.someItems') }}</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="inputs.recycling" value="most">
                <span>{{ t('calculator.mostItems') }}</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="inputs.recycling" value="all">
                <span>{{ t('calculator.everythingPossible') }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Calculate Button -->
        <button class="calculate-btn" @click="calculateFootprint">
          🌱 {{ t('calculator.calculateBtn') }}
        </button>
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="results-section">
        <div class="results-header">
          <h2>{{ t('calculator.resultsTitle') }}</h2>
        </div>

        <div class="total-footprint">
          <div class="footprint-circle" :class="footprintLevel">
            <span class="footprint-value">{{ totalFootprint.toFixed(1) }}</span>
            <span class="footprint-unit">{{ t('calculator.tonnesCo2Year') }}</span>
          </div>
          <div class="footprint-comparison">
            <p>{{ footprintMessage }}</p>
            <div class="comparison-bar">
              <div class="bar-fill" :style="{ width: Math.min(totalFootprint / 16 * 100, 100) + '%' }"></div>
              <div class="bar-markers">
                <span class="marker" style="left: 12.5%">2t</span>
                <span class="marker" style="left: 37.5%">6t</span>
                <span class="marker" style="left: 62.5%">10t</span>
                <span class="marker" style="left: 87.5%">14t</span>
              </div>
            </div>
            <div class="bar-labels">
              <span>🌿 {{ t('calculator.low') }}</span>
              <span>⚠️ {{ t('calculator.average2') }}</span>
              <span>🔴 {{ t('calculator.high') }}</span>
            </div>
          </div>
        </div>

        <div class="breakdown-section">
          <h3>{{ t('calculator.breakdownByCategory') }}</h3>
          <div class="breakdown-grid">
            <div class="breakdown-card">
              <div class="breakdown-icon">🚗</div>
              <div class="breakdown-details">
                <span class="breakdown-label">{{ t('calculator.transport') }}</span>
                <span class="breakdown-value">{{ breakdown.transport.toFixed(1) }}t</span>
              </div>
              <div class="breakdown-bar">
                <div class="bar" :style="{ width: (breakdown.transport / totalFootprint * 100) + '%' }"></div>
              </div>
            </div>
            <div class="breakdown-card">
              <div class="breakdown-icon">🏠</div>
              <div class="breakdown-details">
                <span class="breakdown-label">{{ t('calculator.homeEnergy') }}</span>
                <span class="breakdown-value">{{ breakdown.home.toFixed(1) }}t</span>
              </div>
              <div class="breakdown-bar">
                <div class="bar" :style="{ width: (breakdown.home / totalFootprint * 100) + '%' }"></div>
              </div>
            </div>
            <div class="breakdown-card">
              <div class="breakdown-icon">🍽️</div>
              <div class="breakdown-details">
                <span class="breakdown-label">{{ t('calculator.food') }}</span>
                <span class="breakdown-value">{{ breakdown.food.toFixed(1) }}t</span>
              </div>
              <div class="breakdown-bar">
                <div class="bar" :style="{ width: (breakdown.food / totalFootprint * 100) + '%' }"></div>
              </div>
            </div>
            <div class="breakdown-card">
              <div class="breakdown-icon">🛍️</div>
              <div class="breakdown-details">
                <span class="breakdown-label">{{ t('calculator.lifestyle') }}</span>
                <span class="breakdown-value">{{ breakdown.lifestyle.toFixed(1) }}t</span>
              </div>
              <div class="breakdown-bar">
                <div class="bar" :style="{ width: (breakdown.lifestyle / totalFootprint * 100) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="tips-section">
          <h3>🌱 {{ t('calculator.personalizedTips') }}</h3>
          <div class="tips-grid">
            <div v-for="(tip, index) in personalizedTips" :key="index" class="tip-card">
              <span class="tip-icon">{{ tip.icon }}</span>
              <div class="tip-content">
                <h4>{{ tip.title }}</h4>
                <p>{{ tip.description }}</p>
                <span class="tip-savings">{{ t('calculator.saveUpTo') }} {{ tip.savings }}</span>
              </div>
            </div>
          </div>
        </div>

        <button class="recalculate-btn" @click="showResults = false">
          {{ t('calculator.recalculate') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'CarbonCalculator',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      activeCategory: 'transport',
      showResults: false,
      inputs: {
        // Transport
        carKm: 100,
        carType: 'petrol',
        shortFlights: 2,
        mediumFlights: 1,
        longFlights: 0,
        publicTransport: 5,
        // Home
        electricity: 300,
        energySource: 'mixed',
        heating: 100,
        heatingType: 'gas',
        water: 150,
        // Food
        beef: 2,
        pork: 2,
        poultry: 3,
        fish: 1,
        dairy: 3,
        foodWaste: 15,
        // Lifestyle
        clothing: 3,
        packages: 5,
        recycling: 'some'
      },
      totalFootprint: 0,
      breakdown: {
        transport: 0,
        home: 0,
        food: 0,
        lifestyle: 0
      },
      personalizedTips: []
    }
  },
  computed: {
    categories() {
      return {
        transport: { icon: '🚗', label: this.t('calculator.transport') },
        home: { icon: '🏠', label: this.t('calculator.home') },
        food: { icon: '🍽️', label: this.t('calculator.food') },
        lifestyle: { icon: '🛍️', label: this.t('calculator.lifestyle') }
      }
    },
    footprintLevel() {
      if (this.totalFootprint < 4) return 'low';
      if (this.totalFootprint < 8) return 'medium';
      if (this.totalFootprint < 12) return 'high';
      return 'very-high';
    },
    footprintMessage() {
      const avg = 8; // Average EU footprint
      const diff = this.totalFootprint - avg;
      if (diff < -4) return this.t('calculator.msgExcellent');
      if (diff < -2) return this.t('calculator.msgGreat');
      if (diff < 2) return this.t('calculator.msgAverage');
      if (diff < 4) return this.t('calculator.msgAbove');
      return this.t('calculator.msgHigh');
    }
  },
  methods: {
    calculateFootprint() {
      // Transport calculations (tonnes CO2/year)
      const carEmissions = {
        petrol: 0.21, diesel: 0.18, hybrid: 0.12, electric: 0.05
      };
      const carCO2 = (this.inputs.carKm * 52 * carEmissions[this.inputs.carType]) / 1000;
      const flightCO2 = (
        this.inputs.shortFlights * 0.255 +
        this.inputs.mediumFlights * 0.5 +
        this.inputs.longFlights * 1.5
      );
      const publicCO2 = (this.inputs.publicTransport * 52 * 0.089) / 1000;
      this.breakdown.transport = carCO2 + flightCO2 + publicCO2;

      // Home energy calculations
      const electricityMultiplier = {
        mixed: 0.42, renewable: 0.05, coal: 0.82
      };
      const electricityCO2 = (this.inputs.electricity * 12 * electricityMultiplier[this.inputs.energySource]) / 1000;
      
      const heatingMultiplier = {
        gas: 2.0, oil: 2.5, electric: 0.5, heatpump: 0.3, wood: 0.4
      };
      const heatingCO2 = (this.inputs.heating * 12 * heatingMultiplier[this.inputs.heatingType]) / 1000;
      const waterCO2 = (this.inputs.water * 365 * 0.001) / 1000;
      this.breakdown.home = electricityCO2 + heatingCO2 + waterCO2;

      // Food calculations
      const beefCO2 = this.inputs.beef * 52 * 0.027; // 27kg CO2 per kg beef
      const porkCO2 = this.inputs.pork * 52 * 0.012;
      const poultryCO2 = this.inputs.poultry * 52 * 0.007;
      const fishCO2 = this.inputs.fish * 52 * 0.006;
      const dairyCO2 = this.inputs.dairy * 365 * 0.003;
      const wasteFactor = 1 + (this.inputs.foodWaste / 100);
      this.breakdown.food = (beefCO2 + porkCO2 + poultryCO2 + fishCO2 + dairyCO2) * wasteFactor;

      // Lifestyle calculations
      const clothingCO2 = this.inputs.clothing * 12 * 0.025;
      const packagesCO2 = this.inputs.packages * 12 * 0.005;
      const recyclingFactor = {
        none: 1.3, some: 1.1, most: 0.95, all: 0.8
      };
      this.breakdown.lifestyle = (clothingCO2 + packagesCO2) * recyclingFactor[this.inputs.recycling];

      // Total
      this.totalFootprint = this.breakdown.transport + this.breakdown.home + 
                            this.breakdown.food + this.breakdown.lifestyle;

      // Generate personalized tips
      this.generateTips();
      this.showResults = true;
    },
    generateTips() {
      this.personalizedTips = [];
      
      // Transport tips
      if (this.inputs.carType === 'petrol' || this.inputs.carType === 'diesel') {
        if (this.inputs.carKm > 200) {
          this.personalizedTips.push({
            icon: '🚗',
            title: this.t('calculator.tipCarpool'),
            description: this.t('calculator.tipCarpoolDesc'),
            savings: '2+ ' + this.t('calculator.tonnesYear')
          });
        }
      }
      
      if (this.inputs.longFlights > 1) {
        this.personalizedTips.push({
          icon: '✈️',
          title: this.t('calculator.tipFlights'),
          description: this.t('calculator.tipFlightsDesc'),
          savings: '1.5 ' + this.t('calculator.tonnesPerFlight')
        });
      }

      // Home tips
      if (this.inputs.energySource === 'mixed' || this.inputs.energySource === 'coal') {
        this.personalizedTips.push({
          icon: '⚡',
          title: this.t('calculator.switchToRenewable'),
          description: this.t('calculator.switchToRenewableDesc'),
          savings: '1-2 ' + this.t('calculator.tonnesYear')
        });
      }

      // Food tips
      if (this.inputs.beef > 3) {
        this.personalizedTips.push({
          icon: '🥗',
          title: this.t('calculator.tipBeef'),
          description: this.t('calculator.tipBeefDesc'),
          savings: '0.5 ' + this.t('calculator.tonnesYear')
        });
      }

      if (this.inputs.foodWaste > 20) {
        this.personalizedTips.push({
          icon: '🗑️',
          title: this.t('calculator.tipFoodWaste'),
          description: this.t('calculator.tipFoodWasteDesc'),
          savings: '0.3 ' + this.t('calculator.tonnesYear')
        });
      }

      // Lifestyle tips
      if (this.inputs.clothing > 5) {
        this.personalizedTips.push({
          icon: '👕',
          title: this.t('calculator.tipClothing'),
          description: this.t('calculator.tipClothingDesc'),
          savings: '0.2 ' + this.t('calculator.tonnesYear')
        });
      }

      if (this.inputs.recycling === 'none' || this.inputs.recycling === 'some') {
        this.personalizedTips.push({
          icon: '♻️',
          title: this.t('calculator.improveRecycling'),
          description: this.t('calculator.improveRecyclingDesc'),
          savings: '0.3 ' + this.t('calculator.tonnesYear')
        });
      }

      // Always add some general tips if we have few
      if (this.personalizedTips.length < 3) {
        this.personalizedTips.push({
          icon: '💡',
          title: this.t('calculator.useLed'),
          description: this.t('calculator.useLedDesc'),
          savings: '0.1 ' + this.t('calculator.tonnesYear')
        });
      }
    }
  }
}
</script>

<style scoped>
.calculator-page {
  min-height: 100vh;
  padding: 100px 20px 60px;
  background: linear-gradient(135deg, var(--bg-color) 0%, rgba(46, 204, 113, 0.05) 100%);
}

.calculator-container {
  max-width: 900px;
  margin: 0 auto;
}

.calculator-header {
  text-align: center;
  margin-bottom: 40px;
}

.calculator-header h1 {
  font-size: 2.5em;
  color: var(--text-color);
  margin: 0 0 10px;
}

.calculator-header p {
  color: var(--text-secondary);
  font-size: 1.1em;
}

.calculator-content {
  background: var(--card-bg);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
}

.dark .category-tabs {
  background: rgba(255, 255, 255, 0.05);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  font-size: 0.95em;
  font-weight: 500;
}

.tab-btn:hover {
  background: rgba(46, 204, 113, 0.1);
}

.tab-btn.active {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
}

.tab-icon {
  font-size: 1.3em;
}

/* Category Sections */
.category-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.category-section h2 {
  color: var(--text-color);
  margin: 0 0 20px;
  font-size: 1.4em;
}

/* Input Cards */
.input-card {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 15px;
}

.dark .input-card {
  background: rgba(255, 255, 255, 0.05);
}

.input-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.input-icon {
  font-size: 2em;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.15) 0%, rgba(39, 174, 96, 0.1) 100%);
  border-radius: 12px;
}

.input-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.1em;
}

.input-header p {
  margin: 4px 0 0;
  color: var(--text-secondary);
  font-size: 0.9em;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.input-row input[type="range"] {
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  background: rgba(46, 204, 113, 0.2);
  border-radius: 4px;
  outline: none;
}

.input-row input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(46, 204, 113, 0.4);
}

.input-value {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 120px;
  color: var(--text-color);
  font-weight: 600;
}

.input-value input {
  width: 60px;
  padding: 8px 10px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 1em;
  font-weight: 600;
  text-align: center;
}

.sub-options {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.sub-options label {
  color: var(--text-secondary);
  font-size: 0.9em;
}

.sub-options select {
  padding: 8px 15px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.95em;
  cursor: pointer;
}

/* Flight & Meat Inputs */
.flight-inputs, .meat-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.flight-type, .meat-type {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.flight-type label, .meat-type label {
  color: var(--text-secondary);
  font-size: 0.9em;
}

.flight-type input, .meat-type input {
  padding: 10px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 1em;
  text-align: center;
}

/* Radio Options */
.radio-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-color);
}

.radio-option:hover {
  border-color: #2ecc71;
}

.radio-option input {
  accent-color: #2ecc71;
}

.radio-option input:checked + span {
  color: #2ecc71;
  font-weight: 600;
}

/* Calculate Button */
.calculate-btn {
  width: 100%;
  padding: 18px;
  margin-top: 30px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.2em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.calculate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
}

/* Results Section */
.results-section {
  margin-top: 40px;
  animation: fadeIn 0.5s ease;
}

.results-header {
  text-align: center;
  margin-bottom: 30px;
}

.results-header h2 {
  color: var(--text-color);
  font-size: 1.8em;
}

.total-footprint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 40px;
  background: var(--card-bg);
  border-radius: 24px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.footprint-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  box-shadow: 0 10px 40px rgba(46, 204, 113, 0.3);
}

.footprint-circle.low {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.footprint-circle.medium {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
}

.footprint-circle.high {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.footprint-circle.very-high {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
}

.footprint-value {
  font-size: 3.5em;
  font-weight: 700;
  line-height: 1;
}

.footprint-unit {
  font-size: 0.9em;
  opacity: 0.9;
  margin-top: 5px;
}

.footprint-comparison {
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.footprint-comparison p {
  color: var(--text-color);
  margin-bottom: 20px;
}

.comparison-bar {
  height: 12px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  position: relative;
  overflow: visible;
}

.dark .comparison-bar {
  background: rgba(255, 255, 255, 0.1);
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #f39c12, #e74c3c);
  border-radius: 6px;
  transition: width 1s ease;
}

.bar-markers {
  position: absolute;
  top: -25px;
  left: 0;
  right: 0;
}

.marker {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.75em;
  color: var(--text-secondary);
}

.bar-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.85em;
  color: var(--text-secondary);
}

/* Breakdown Section */
.breakdown-section {
  background: var(--card-bg);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.breakdown-section h3 {
  color: var(--text-color);
  margin: 0 0 20px;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.breakdown-card {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  padding: 15px;
}

.dark .breakdown-card {
  background: rgba(255, 255, 255, 0.05);
}

.breakdown-icon {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.breakdown-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.breakdown-label {
  color: var(--text-secondary);
}

.breakdown-value {
  color: var(--text-color);
  font-weight: 700;
}

.breakdown-bar {
  height: 8px;
  background: rgba(46, 204, 113, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.breakdown-bar .bar {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #27ae60);
  border-radius: 4px;
  transition: width 1s ease;
}

/* Tips Section */
.tips-section {
  background: var(--card-bg);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.tips-section h3 {
  color: var(--text-color);
  margin: 0 0 20px;
}

.tips-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tip-card {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.08) 0%, rgba(39, 174, 96, 0.03) 100%);
  border-radius: 14px;
  border: 1px solid rgba(46, 204, 113, 0.2);
}

.tip-icon {
  font-size: 2em;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  flex-shrink: 0;
}

.dark .tip-icon {
  background: var(--card-bg);
}

.tip-content h4 {
  margin: 0 0 5px;
  color: var(--text-color);
}

.tip-content p {
  margin: 0 0 8px;
  color: var(--text-secondary);
  font-size: 0.95em;
}

.tip-savings {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
}

.recalculate-btn {
  display: block;
  width: 200px;
  margin: 0 auto;
  padding: 14px;
  background: transparent;
  color: var(--text-color);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
}

.recalculate-btn:hover {
  border-color: #2ecc71;
  color: #2ecc71;
}

/* Responsive */
@media (max-width: 768px) {
  .calculator-header h1 {
    font-size: 1.8em;
  }
  
  .category-tabs {
    flex-wrap: wrap;
  }
  
  .tab-btn {
    flex: 1 1 45%;
  }
  
  .tab-label {
    display: none;
  }
  
  .input-row {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .radio-options {
    grid-template-columns: 1fr;
  }
  
  .footprint-circle {
    width: 160px;
    height: 160px;
  }
  
  .footprint-value {
    font-size: 2.5em;
  }
}
</style>
