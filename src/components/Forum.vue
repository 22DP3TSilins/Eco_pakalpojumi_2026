<template>
  <div class="forum">
    <h2>🌱 Community Forum</h2>
    <div v-if="user" class="add-post">
      <h3>Share Your Thoughts</h3>
      <form @submit.prevent="addPost">
        <input v-model="newPost.title" placeholder="Post Title" required>
        <textarea v-model="newPost.content" placeholder="Post Content" required></textarea>
        <button type="submit">Post</button>
      </form>
    </div>
    <div class="posts">
      <div v-for="post in posts" :key="post.id" class="post">
        <h3>{{ post.title }}</h3>
        <p>By {{ post.name }} on {{ post.date }}</p>
        <p>{{ post.content }}</p>
        <button @click="viewPost(post.id)">View Comments</button>
      </div>
    </div>
    <div v-if="selectedPost" class="post-detail">
      <h3>{{ selectedPost.title }}</h3>
      <p>By {{ selectedPost.name }}</p>
      <div class="comments">
        <div v-for="comment in comments" :key="comment.id" class="comment">
          <p><strong>{{ comment.name }}:</strong> {{ comment.content }}</p>
          <small>{{ comment.date }}</small>
        </div>
      </div>
      <form v-if="user" @submit.prevent="addComment">
        <textarea v-model="newComment" placeholder="Add a comment" required></textarea>
        <button type="submit">Comment</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forum',
  data() {
    return {
      posts: [],
      selectedPost: null,
      comments: [],
      newPost: {
        title: '',
        content: ''
      },
      newComment: '',
      user: null
    }
  },
  mounted() {
    this.fetchPosts();
    const token = localStorage.getItem('token');
    if (token) {
      this.user = JSON.parse(atob(token.split('.')[1]));
    }
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await fetch('http://localhost:3000/api/posts');
        const data = await response.json();
        this.posts = data.posts;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    async addPost() {
      const token = localStorage.getItem('token');
      try {
        await fetch('http://localhost:3000/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.newPost)
        });
        this.newPost = { title: '', content: '' };
        this.fetchPosts();
      } catch (error) {
        console.error('Error adding post:', error);
      }
    },
    async viewPost(id) {
      this.selectedPost = this.posts.find(p => p.id === id);
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${id}/comments`);
        const data = await response.json();
        this.comments = data.comments;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async addComment() {
      const token = localStorage.getItem('token');
      try {
        await fetch(`http://localhost:3000/api/posts/${this.selectedPost.id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ content: this.newComment })
        });
        this.newComment = '';
        this.viewPost(this.selectedPost.id);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  }
}
</script>

<style scoped>
.forum {
  padding: 20px;
}

.add-post, .post, .post-detail {
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

input, textarea {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  background: var(--bg-color);
  color: var(--text-color);
}

textarea {
  height: 100px;
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

.post h3 {
  color: var(--button-bg);
}

.comment {
  border-bottom: 1px solid var(--border-color);
  padding: 10px 0;
}
</style>