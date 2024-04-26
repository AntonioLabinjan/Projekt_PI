<template>
  <div>
  <hr>
    <h1>You are not allowed to see this page without login</h1>
  <hr>
    <button @click="goBack">Go Back</button>
  </div>
</template>

<script>
export default{

methods:{
goBack() {
      this.$router.push({ path: '/' });
    }
}
}
</script>
