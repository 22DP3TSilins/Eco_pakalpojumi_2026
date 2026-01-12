<template>
  <div class="education">
    <h2>📚 Eco-Education Hub</h2>
    <p>Learn about sustainability and environmental care.</p>
    <div class="posts">
      <div v-for="post in posts" :key="post.id" class="post">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <small>{{ post.date }} - {{ post.type }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Education',
  data() {
    return {
      posts: []
    }
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await fetch('http://localhost:3000/api/education');
        const data = await response.json();
        this.posts = data.posts;
      } catch (error) {
        console.error('Error fetching education posts:', error);
      }
    }
  }
}
</script>

<style scoped>
.education {
  padding: 20px;
}

.posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.post {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
}

.post h3 {
  color: var(--button-bg);
}
</style>