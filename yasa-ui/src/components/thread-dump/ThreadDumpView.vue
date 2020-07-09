<template>
  <div class="full-width" id="root">
    <div class="operations" align="right">
      <el-tooltip content="Collapse All">
        <el-button icon="el-icon-caret-top" type="primary" @click="activeNames = []"></el-button>
      </el-tooltip>
      <el-tooltip content="Expand All">
        <el-button icon="el-icon-caret-bottom" type="primary" @click="activeNames = allNames"></el-button>
      </el-tooltip>
      <el-button icon="el-icon-refresh" type="primary" @click="refresh" :loading="loading"></el-button>
    </div>
    <el-collapse class="main" v-loading="loading" v-model="activeNames">
      <el-collapse-item v-for="thread in threads" :key="thread.id" :name="`${thread.id}`">
        <template slot="title">
          <b>
            <el-tooltip :content="thread.state" placement="top">
              <i
                v-if="thread.state.toLowerCase() === 'runnable'"
                class="el-icon-yasa-finished"
                style="color: #58b742;"
              ></i>
              <i
                v-else-if="thread.state.toLowerCase().includes('waiting')"
                class="el-icon-yasa-waiting"
                style="color: orange;"
              ></i>
            </el-tooltip>
            {{ thread.name }} ({{ thread.id }})
          </b>
        </template>
        <thread-dump-item :thread="thread"></thread-dump-item>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ThreadDump, ThreadsResponse } from '@service/solr/admin/info';
import ThreadDumpItem from '@components/thread-dump/ThreadDumpItem.vue';

@Component({
  components: {
    ThreadDumpItem,
  },
})
export default class ThreadDumpView extends Vue {
  private result: ThreadsResponse = {} as ThreadsResponse;
  private loading = false;
  private activeNames: string[] = [];

  created() {
    this.refresh();
  }

  private refresh() {
    this.loading = true;
    this.$service.solr.admin.info
      .threads()
      .then(({ data }) => (this.result = data))
      .catch((err) => this.$notify.error(err.message))
      .finally(() => (this.loading = false));
  }

  private get allNames(): string[] {
    return (
      this.result?.system?.threadDump
        ?.filter((it) => typeof it !== 'string')
        ?.map((it) => it as ThreadDump)
        ?.map((it) => `${it.id}`) || []
    );
  }

  private get threads(): ThreadDump[] {
    return this.result?.system?.threadDump?.filter((it) => typeof it !== 'string').map((it) => it as ThreadDump) || [];
  }
}
</script>

<style scoped lang="scss">
#root {
  height: calc(100% - 52px);
  padding-top: 12px;
}
.operations {
  margin-right: 12px;
}
.main {
  border-top: 1px dashed #282a36;
  margin-top: 12px;
  padding: 0 12px;
  width: calc(100% - 24px);
  height: calc(100vh - 54px);
  overflow-x: hidden;
}
</style>
