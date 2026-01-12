<template>
  <div class="challenges">
    <h2>🎯 Eco Challenges</h2>
    <p>Complete challenges to earn rewards and make a difference!</p>
    <div class="challenge-list">
      <div v-for="challenge in challenges" :key="challenge.id" class="challenge">
        <h3>{{ challenge.title }}</h3>
        <p>{{ challenge.description }}</p>
        <p>Reward: {{ challenge.reward }}</p>
        <button v-if="!completedChallenges.includes(challenge.id)" @click="completeChallenge(challenge.id)">Complete</button>
        <span v-else>✅ Completed</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Challenges',
  data() {
    return {
      challenges: [],
      completedChallenges: []
    }
  },
  mounted() {
    this.fetchChallenges();
  },
  methods: {
    async fetchChallenges() {
      try {
        const response = await fetch('http://localhost:3000/api/challenges');
        const data = await response.json();
        this.challenges = data.challenges;
        // In a real app, fetch user's completed challenges
        this.completedChallenges = []; // Placeholder
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    },
    async completeChallenge(id) {
      const token = localStorage.getItem('token');
      try {
        await fetch('http://localhost:3001/api/user-challenges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ challenge_id: id })
        });
        this.completedChallenges.push(id);
        alert('Challenge completed! Reward earned.');
      } catch (error) {
        console.error('Error completing challenge:', error);
      }
    }
  }
}
</script>

<style scoped>
.challenges {
  padding: 20px;
}

.challenge-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.challenge {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.challenge h3 {
  color: var(--button-bg);
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
</style>