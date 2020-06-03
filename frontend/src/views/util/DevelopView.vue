<template>
  <v-container fluid class="animate__animated animate__backInDown">
    <v-row :align-content="'center'" :justify="'center'">
      <v-row :align-content="'center'" :justify="'center'">
        <p class="display-2 font-weight-bold" style="position: absolute">개발중에 있습니다. 잠시만 기다려 주세요</p>
        <img src="../../assets/images/develop.jpg" style="height: 95vh;">
      </v-row>
        <v-btn large dark @click="$router.replace('/main')" style="position: absolute; margin-top: 10vh;">Back</v-btn>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: "DevelopView",
    methods: {}
  }
</script>

<style scoped>

</style>
