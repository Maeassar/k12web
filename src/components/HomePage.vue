<template>
  <div>
    <h1>欢迎, {{ name }}!</h1>
    <p>你的身份是: {{ permissionLabel }}</p>
    <div className="images">
      <img src="@/assets/1.png" alt="Image 1" @click="goToPage('Part1_1')"/>
      <img src="@/assets/2.png" alt="Image 2" @click="goToPage('Part2_1')"/>
      <img src="@/assets/3.png" alt="Image 3" @click="goToPage('Part2_9')"/>
      <img src="@/assets/4.png" alt="Image 4" @click="goToPage('Part1_1')"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  props: {
    name: {
      type: String,
      required: true
    },
    permission: {
      type: Number,
      required: true
    }
  },
  computed: {
    permissionLabel() {
      switch (this.permission) {
        case 0:
          return '老师';
        case 1:
          return '学生';
        case 2:
          return '管理员';
        default:
          return '未知';
      }
    }
  },
  methods: {
    goToPage(page) {
      this.$router.push({ name: page });
    }
  }
};
</script>


<style scoped>
  .images {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
  .images img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
}
</style>
