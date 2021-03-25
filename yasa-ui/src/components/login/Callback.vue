<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Callback extends Vue {
  created() {
    sessionStorage.setItem('Authorization', `${this.$route.query['token_type']} ${this.$route.query['access_token']}`);
    this.$router.push('/');
  }
}
</script>

<style scoped></style>
