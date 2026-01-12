<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          <img v-if="customizations.avatar" :src="customizations.avatar" alt="Avatar" />
          <div v-else class="avatar-placeholder">👤</div>
        </div>
        <h2>{{ user.name }}</h2>
        <p>{{ user.email }}</p>
      </div>

      <div class="profile-actions">
        <button @click="showEdit = !showEdit" class="btn-edit">
          ✏️ {{ showEdit ? 'Cancel Edit' : 'Edit Profile' }}
        </button>
        <button @click="logout" class="btn-logout">🚪 Logout</button>
      </div>
    </div>

    <div v-if="showEdit" class="edit-card">
      <h3>Edit Profile</h3>
      <form @submit.prevent="updateProfile" class="edit-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" v-model="editData.name" required />
        </div>
        <div class="form-group">
          <label for="password">New Password (leave blank to keep current)</label>
          <input id="password" v-model="editData.password" type="password" />
        </div>
        <button type="submit" :disabled="loading" class="btn-save">
          💾 {{ loading ? 'Updating...' : 'Update Profile' }}
        </button>
      </form>
      <button @click="deleteAccount" class="btn-delete">🗑️ Delete Account</button>
    </div>

    <div class="customizations-card">
      <h3>Customizations</h3>
      <div class="customizations-form">
        <div class="form-group">
          <label for="avatar">Avatar URL</label>
          <input id="avatar" v-model="customizations.avatar" placeholder="https://example.com/avatar.jpg" />
        </div>
        <div class="form-group">
          <label for="bio">Bio</label>
          <textarea id="bio" v-model="customizations.bio" placeholder="Tell us about yourself..."></textarea>
        </div>
        <button @click="saveCustomizations" class="btn-save">💾 Save Customizations</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      showEdit: false,
      editData: {
        name: '',
        password: ''
      },
      loading: false,
      customizations: {
        avatar: '',
        bio: ''
      }
    }
  },
  computed: {
    user() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return { id: payload.id, email: payload.email, name: payload.name };
        } catch (e) {
          return null;
        }
      }
      return null;
    }
  },
  mounted() {
    if (this.user) {
      this.editData.name = this.user.name;
      const saved = localStorage.getItem('customizations');
      if (saved) {
        this.customizations = JSON.parse(saved);
      }
    }
  },
  methods: {
    async updateProfile() {
      this.loading = true;
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.editData)
        });
        if (response.ok) {
          alert('Profile updated successfully!');
          this.showEdit = false;
          location.reload();
        } else {
          const data = await response.json();
          alert(data.error);
        }
      } catch (error) {
        alert('Error updating profile');
      } finally {
        this.loading = false;
      }
    },
    async deleteAccount() {
      if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/api/user', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          localStorage.removeItem('token');
          this.$router.push('/');
          location.reload();
        } else {
          alert('Error deleting account');
        }
      } catch (error) {
        alert('Error deleting account');
      }
    },
    saveCustomizations() {
      localStorage.setItem('customizations', JSON.stringify(this.customizations));
      alert('Customizations saved!');
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/');
      location.reload();
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card, .edit-card, .customizations-card {
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover, .edit-card:hover, .customizations-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.profile-header {
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #2ecc71;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #27ae60;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
}

.profile-header h2 {
  color: var(--text-color);
  margin: 10px 0;
  font-size: 1.8em;
}

.profile-header p {
  color: var(--text-secondary);
  margin: 0;
}

.profile-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-edit, .btn-logout, .btn-save, .btn-delete {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-edit:hover, .btn-save:hover {
  background: #27ae60;
  transform: scale(1.05);
}

.btn-logout {
  background: #e74c3c;
}

.btn-logout:hover {
  background: #c0392b;
}

.btn-delete {
  background: #e74c3c;
  margin-top: 20px;
}

.btn-delete:hover {
  background: #c0392b;
}

.edit-form, .customizations-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 5px;
}

input, textarea {
  padding: 12px;
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1em;
  transition: border-color 0.3s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #2ecc71;
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

h3 {
  color: #2ecc71;
  margin-bottom: 20px;
  font-size: 1.4em;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }
  .profile-card, .edit-card, .customizations-card {
    padding: 20px;
  }
  .profile-actions {
    flex-direction: column;
    align-items: center;
  }
  .btn-edit, .btn-logout, .btn-save, .btn-delete {
    width: 100%;
    justify-content: center;
  }
}
</style>