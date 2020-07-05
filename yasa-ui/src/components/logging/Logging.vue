<template>
  <div id="root">
    <div id="operations" align="right">
      <el-button icon="el-icon-refresh" type="primary" @click="refresh"></el-button>
    </div>
    <el-table id="logs-table" :data="loggingResponse.history.docs" :row-class-name="rowClassName" height="100%">
      <el-table-column width="200" prop="time" label="Time" show-overflow-tooltip></el-table-column>
      <el-table-column width="80" prop="level" label="Level" show-overflow-tooltip></el-table-column>
      <el-table-column width="100" prop="core" label="Core" show-overflow-tooltip></el-table-column>
      <el-table-column width="300" prop="logger" label="Logger" show-overflow-tooltip></el-table-column>
      <el-table-column label="Message">
        <template slot-scope="props">
          <span v-for="(line, index) in props.row.message.split('\n')" :key="index"> {{ line }} <br /> </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { LoggingResponse, LogItem } from '@service/solr/logging';

@Component
export default class Discover extends Vue {
  private loggingResponse: LoggingResponse = {
    history: {
      numFound: 0,
      start: 0,
      docs: [],
    },
    info: {
      buffer: 0,
      last: 0,
      levels: [],
      threshold: '',
    },
    responseHeader: {
      status: 0,
      QTime: 0,
    },
    watcher: '',
  };

  private loggingClassMap: { [key: string]: string } = {
    warn: 'yellow',
    error: 'red',
    fatal: 'red',
  };

  private rowClassName({ row }: { row: LogItem; rowIndex: number }) {
    return this.loggingClassMap[row.level.toLowerCase()] || '';
  }

  private refresh() {
    this.$service.solr.logging
      .logs()
      .then((response) => {
        this.loggingResponse = response.data;
      })
      .catch((err) => this.$notify.error(err.message));
  }

  created() {
    this.refresh();
  }
}
</script>

<style scoped lang="scss">
#root {
  height: calc(100% - 52px);
  padding-top: 12px;
}
#operations {
  margin-right: 12px;
}
::v-deep .el-table {
  .yellow {
    background: #ffd930;
    color: black;
  }
  .red,
  .fatal {
    background: red;
    color: black;
  }
}
#logs-table {
  margin-top: 12px;
  border-top: 1px dashed #282a36;
}
</style>
