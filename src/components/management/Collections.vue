<template>
  <el-table :data="detailedCollections" v-loading="loadingDetailedCollections" height="100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-table :data="shardsFormatter(props.row.shards)">
          <el-table-column type="expand">
            <template slot-scope="shards">
              <el-collapse>
                <el-collapse-item v-for="(replica, name) in shards.row.replicas" :key="name" :name="name">
                  <template slot="title">
                    <i class="el-icon-yasa-replica"> Replica: {{ name }}</i>
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
    </el-table-column>
    <el-table-column prop="name" label="Collection" show-overflow-tooltip></el-table-column>
    <el-table-column prop="shards" label="Shard Count" :formatter="shardCountFormatter" show-overflow-tooltip></el-table-column>
    <el-table-column prop="maxShardsPerNode" label="Max Shards Per Node" :formatter="shardCountFormatter" show-overflow-tooltip></el-table-column>
    <el-table-column prop="replicationFactor" label="Replication Factor" show-overflow-tooltip></el-table-column>
    <el-table-column prop="configName" label="Config Name" show-overflow-tooltip></el-table-column>
    <el-table-column prop="autoAddReplicas" label="Auto Add Replicas" show-overflow-tooltip></el-table-column>
    <el-table-column label="Operations">
      <template slot-scope="scope">
        <el-dropdown type="primary" split-button>
          <el-tooltip content="Reload" placement="top"><i class="el-icon-refresh"></i></el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="text" icon="el-icon-delete">Delete</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" icon="el-icon-yasa-alias">Create Alias</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" icon="el-icon-close">Delete Alias</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
  name: 'Collections',
  computed: {
    ...mapState('management/collections', ['detailedCollections', 'loadingDetailedCollections'])
  },
  methods: {
    ...mapMutations('management/collections', ['setDetailedCollections', 'setLoadingDetailedCollections']),
    ...mapActions('management/collections', ['loadDetailedCollections']),
    shardCountFormatter (row) {
      return Object.keys(row.shards).length
    },
    shardsFormatter (shards) {
      return Object.keys(shards).map(name => {
        const shard = shards[name]
        shard.name = name
        return shard
      })
    }
  },
  created () {
    this.loadDetailedCollections()
  }
}
</script>

<style scoped>
</style>
