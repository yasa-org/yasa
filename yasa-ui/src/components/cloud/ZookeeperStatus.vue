<template>
  <div id="root">
    <div id="operations" align="right">
      <el-button icon="el-icon-refresh" type="primary" @click="refresh"></el-button>
    </div>
    <el-table id="status-table" height="100%" :data="response.zkStatus.details" stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="allFields" stripe>
            <el-table-column label="Field">
              <template slot-scope="scope">{{ scope.row }}</template>
            </el-table-column>
            <el-table-column label="Content">
              <template slot-scope="scope">{{ props.row[scope.row] }}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        v-for="field in defaultFields"
        :width="field.width"
        :key="field.key"
        :label="field.key"
        :prop="field.key"
        :formatter="(row) => `${row[field.key]}`"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ZKStatusResponse } from '@service/solr/admin/zookeeper';

@Component
export default class ZookeeperStatus extends Vue {
  private response: ZKStatusResponse = {
    responseHeader: {
      status: 0,
      QTime: 0,
    },
    zkStatus: { details: [], ensembleSize: 0, mode: '', status: '', zkHost: '' },
  };

  private defaultFields = [
    { key: 'host' },
    { key: 'ok', width: 100 },
    { key: 'clientPort', width: 100 },
    { key: 'zk_version' },
    { key: 'zk_znode_count' },
    { key: 'zk_approximate_data_size' },
  ];

  get allFields(): string[] {
    return this.response.zkStatus.details.flatMap((it) => Object.keys(it));
  }

  private refresh() {
    this.$service.solr.admin.zookeeper
      .status()
      .then((res) => (this.response = res.data))
      .catch(this.$notify.error);
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
#status-table {
  margin-top: 12px;
  border-top: 1px dashed #282a36;
}
</style>
