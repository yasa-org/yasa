<template>
  <el-container id="root">
    <el-table></el-table>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Discover extends Vue {
}
</script>

<style scoped>
#root {
  height: 100vh;
}
</style>
