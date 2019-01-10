<template>
  <v-container fill-height>
    <v-layout style="height: 1000px;" column  align-center justify-center>
      <img @dragstart.prevent width="400px" src="@/assets/BWC_logo.svg" alt="Spava" class="mb-5">
      <div class="display-1 pt-4 grey--text">电子科技大学平安校园智慧通行管理系统</div>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'homePage'
}
</script>

<style scoped>

</style>
