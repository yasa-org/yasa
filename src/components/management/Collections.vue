<template>
  <div style="height: 100%;">
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
          <el-dropdown type="primary" split-button @click="reloadCollection(scope.row)">
            <el-tooltip content="Reload" placement="top"><i class="el-icon-refresh"></i></el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" icon="el-icon-delete" @click="deleteCollection(scope.row)">Delete</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" icon="el-icon-yasa-alias" @click="createAliasForCollection(scope.row)">Create Alias</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" icon="el-icon-close" @click="deleteAliasOfCollection(scope.row)">Delete Alias</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Delete Alias" :visible.sync="deleteAliasDialogVisible">
      <el-form>
        <el-form-item>
          <el-select v-model="selectedAlias" :value="selectedAlias" placeholder="Select Alias" no-data-text="No Aliases">
            <el-option v-for="a in filteredAliases" :key="a" :label="a" :value="a"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="deleteAliasDialogVisible=false">Cancel</el-button>
        <el-button type="danger" @click="doDeleteAliasOfCollection" :loading="deletingAlias">Delete</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
  name: 'Collections',
  computed: {
    ...mapState(['solrMode']),
    ...mapState('management/collections', ['detailedCollections', 'loadingDetailedCollections']),
    filteredAliases () {
      return Object.keys(this.aliases).filter(k => this.aliases[k] === this.selectedCollection)
    }
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
    },
    loadAliases () {
      this.$http.get('/solr/admin/collections?action=LISTALIASES&wt=json').then(res => {
        this.aliases = res.data.aliases || {}
        console.log(this.aliases)
      }, () => {})
    },
    reloadCollection (row) {
      this.$confirm(`Do you want to reload collection "${row.name}"`, 'Reload Collection').then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Reloading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.$http.get(`/solr/admin/collections?action=RELOAD&name=${row.name}`).then(() => {
          loading.close()
          this.$notify.success(`Collection "${row.name}" has been reloaded`)
        })
      }).catch(() => {})
    },
    deleteCollection (row) {
      this.$confirm(`Do you want to delete collection "${row.name}"`, 'Delete Collection').then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Deleting',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.$http.get(`/solr/admin/collections?action=DELETE&name=${row.name}`).then(() => {
          loading.close()
          this.$notify.success(`Collection "${row.name}" has been deleted`)
          this.loadDetailedCollections()
        })
      }).catch(() => this.loadDetailedCollections())
    },
    createAliasForCollection (row) {
      this.$prompt('Alias Name', 'Create Alias').then(({ value }) => {
        const loading = this.$loading({
          lock: true,
          text: 'Deleting',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.$http.get(`/solr/admin/collections?action=CREATEALIAS&name=${value}&collections=${row.name}`).then(() => {
          loading.close()
          this.$notify.success(`Alias "${value}" for collection "${row.name}" has been created`)
          this.loadDetailedCollections()
          this.loadAliases()
        }, () => loading.close())
      }).catch(() => {})
    },
    deleteAliasOfCollection (row) {
      this.deleteAliasDialogVisible = true
      this.selectedCollection = row.name
    },
    doDeleteAliasOfCollection () {
      this.$http.get(`/solr/admin/collections?action=DELETEALIAS&name=${this.selectedAlias}`).then(res => {
        this.deletingAlias = false
        this.deleteAliasDialogVisible = false
        this.$notify.success(`Alias "${this.selectedAlias}" of collection ${this.selectedCollection} is deleted`)
        this.loadAliases()
      }, () => {
        this.deletingAlias = false
        this.deleteAliasDialogVisible = false
        this.loadAliases()
      })
    }
  },
  watch: {
    solrMode () {
      this.loadDetailedCollections()
    },
    aliases () {
      this.selectedAlias = undefined
    }
  },
  created () {
    this.loadDetailedCollections()
    this.loadAliases()
  },
  data () {
    return {
      deleteAliasDialogVisible: false,
      aliases: [],
      selectedCollection: undefined,
      selectedAlias: undefined,
      deletingAlias: false
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
