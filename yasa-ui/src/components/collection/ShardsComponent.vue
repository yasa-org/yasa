<template>
  <el-table :data="shardsFormatter(shards)">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-collapse>
          <el-collapse-item v-for="(replica, name) in props.row.replicas" :key="name" :name="name">
            <template slot="title">
              <i class="el-icon-yasa-replica"></i>
              <span style="margin-left: 6px;">Replica: {{ name }}</span>
            </template>
            <el-form label-width="120px" label-suffix=":">
              <el-form-item label="Core">
                <span>{{ replica.core }}</span>
              </el-form-item>
              <el-form-item label="Base Url">
                <span>{{ replica.base_url }}</span>
              </el-form-item>
              <el-form-item label="Node Name">
                <span>{{ replica.node_name }}</span>
              </el-form-item>
              <el-form-item label="State">
                <span>{{ replica.state }}</span>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="Shard"></el-table-column>
    <el-table-column prop="state" label="State"></el-table-column>
    <el-table-column prop="range" label="Range"></el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Shards } from '@service/solr/collections';

@Component
export default class ShardsComponent extends Vue {
  @Prop({
    required: true,
  })
  private shards!: { [name: string]: Shards };

  private shardsFormatter(shards: { [name: string]: Shards }) {
    return Object.keys(shards).map((name) => {
      const shard = shards[name];
      shard.name = name;
      return shard;
    });
  }
}
</script>

<style scoped></style>
