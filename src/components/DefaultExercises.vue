<template>
  <h1>Ovdje ćemo imati zakodirane prijedloge vježbi</h1>
</template>

<script>
export default {
  data() {},
  methods: {
    goBack() {
      this.$router.push({ path: '/about' });
    },
  }
};
</script>

<style scoped>

</style>
