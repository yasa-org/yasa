<template>
  <div class="trace">
    <span v-for="(trace, index) in thread.stackTrace" :key="index">{{ trace }}<br /></span>
    <span v-if="!thread.stackTrace.length">No Data</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ThreadDump } from '@service/solr/admin/info';

@Component
export default class ThreadDumpItem extends Vue {
  @Prop()
  private thread!: ThreadDump;
}
</script>

<style scoped lang="scss">
.trace {
  padding-left: 20px;
  padding-bottom: 8px;
  line-height: 2;
}
</style>
