<template>
  <div class="login">
    <h2>登录</h2>
    <form @submit.prevent="login">
      <div>
        <label for="name">用户名:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div>
        <label for="permission">身份:</label>
        <select id="permission" v-model="permission">
          <option value="0">老师</option>
          <option value="1">学生</option>
          <option value="2">管理员</option>
        </select>
      </div>
      <button type="submit">登录</button>
    </form>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'UserLogin',
  data() {
    return {
      name: '',
      password: '',
      permission: '0',
      errorMessage: ''
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          name: this.name,
          password: this.password,
          permission: this.permission
        });

        if (response.data.success) {
          this.router.push({
            path: '/home',
            query: {
              name: this.name,
              permission: this.permission
            }
          });
        } else {
          this.errorMessage = '用户名或密码错误，或身份不符';
        }
      } catch (error) {
        this.errorMessage = '服务器错误，请稍后再试';
      }
    }
  }
};
</script>

<style scoped>
.login {
  width: 300px;
  margin: 0 auto;
}
.error {
  color: red;
}
</style>
