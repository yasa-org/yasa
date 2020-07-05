<template>
  <div id="collections-root">
    <div id="operations" align="right">
      <el-button icon="el-icon-plus" type="primary" @click="createCollectionDialogVisible = true">New</el-button>
    </div>
    <el-table id="collections" :data="detailedCollections" v-loading="loadingDetailedCollections" height="100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="shardsFormatter(props.row.shards)">
            <el-table-column type="expand">
              <template slot-scope="shards">
                <el-collapse>
                  <el-collapse-item v-for="(replica, name) in shards.row.replicas" :key="name" :name="name">
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
      </el-table-column>
      <el-table-column prop="name" label="Collection" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="shards"
        label="Shards"
        :formatter="shardCountFormatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="maxShardsPerNode"
        label="MaxShards/Node"
        :formatter="shardCountFormatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="replicationFactor" label="Replication Factor" show-overflow-tooltip></el-table-column>
      <el-table-column prop="configName" label="Config" show-overflow-tooltip></el-table-column>
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
                <el-button type="text" icon="el-icon-yasa-alias" @click="createAliasForCollection(scope.row)"
                  >Create Alias</el-button
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" icon="el-icon-close" @click="deleteAliasOfCollection(scope.row)"
                  >Delete Alias</el-button
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Delete Alias" :visible.sync="deleteAliasDialogVisible">
      <el-form>
        <el-form-item>
          <el-select
            v-model="selectedAlias"
            :value="selectedAlias"
            placeholder="Select Alias"
            no-data-text="No Aliases"
          >
            <el-option v-for="a in filteredAliases" :key="a" :label="a" :value="a"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="deleteAliasDialogVisible = false">Cancel</el-button>
        <el-button type="danger" @click="doDeleteAliasOfCollection" :loading="deletingAlias">Delete</el-button>
      </template>
    </el-dialog>
    <el-dialog title="New Collection" :visible.sync="createCollectionDialogVisible">
      <new-collection-form @done="done"></new-collection-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { NamedCollectionDetail } from '@store/modules/management/collections';
import { MessageBoxInputData } from 'element-ui/types/message-box';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Shards } from '@service/solr/collections';
import { State, namespace } from 'vuex-class';
import NewCollectionForm from './NewCollectionForm.vue';

const Store = namespace('management/collections');

@Component({
  components: {
    NewCollectionForm,
  },
})
export default class Collections extends Vue {
  private deleteAliasDialogVisible = false;
  private createCollectionDialogVisible = false;
  private aliases: { [alias: string]: string } = {};
  private selectedCollection = '';
  private selectedAlias = '';
  private deletingAlias = false;

  @State private solrMode!: string;

  @Store.State private detailedCollections!: NamedCollectionDetail[];
  @Store.State private loadingDetailedCollections!: boolean;

  @Store.Mutation private setDetailedCollections!: (detailedCollections: NamedCollectionDetail[]) => void;
  @Store.Mutation private setLoadingDetailedCollections!: (loadingDetailedCollections: boolean) => void;

  @Store.Action private loadDetailedCollections!: () => void;

  private get filteredAliases() {
    return Object.keys(this.aliases).filter((k) => this.aliases[k] === this.selectedCollection);
  }

  private shardCountFormatter(row: NamedCollectionDetail) {
    return Object.keys(row.shards).length;
  }

  private shardsFormatter(shards: { [name: string]: Shards }) {
    return Object.keys(shards).map((name) => {
      const shard = shards[name];
      shard.name = name;
      return shard;
    });
  }

  private loadAliases() {
    this.$service.solr.admin.zookeeper
      .zookeeper({
        wt: 'json',
        detail: true,
        path: '/aliases.json',
      })
      .then(
        (res) => {
          this.aliases = JSON.parse(res.data.znode.data || '{}').collection || {};
        },
        () => ({}),
      );
  }

  private reloadCollection(row: NamedCollectionDetail) {
    this.$confirm(`Do you want to reload collection "${row.name}"`, 'Reload Collection')
      .then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Reloading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        this.$service.solr.collections
          .reload(row.name)
          .then(() => {
            this.$notify.success(`Collection "${row.name}" has been reloaded`);
          })
          .finally(() => loading.close());
      })
      .catch(() => ({}));
  }

  private deleteCollection(row: NamedCollectionDetail) {
    this.$confirm(`Do you want to delete collection "${row.name}"`, 'Delete Collection')
      .then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Deleting',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        this.$http.get(`/solr/admin/collections?action=DELETE&name=${row.name}`).then(() => {
          loading.close();
          this.$notify.success(`Collection "${row.name}" has been deleted`);
          this.loadDetailedCollections();
        });
      })
      .catch(() => this.loadDetailedCollections());
  }

  private createAliasForCollection(row: NamedCollectionDetail) {
    this.$prompt('Alias Name', 'Create Alias')
      .then((msgBoxData) => {
        const value = (msgBoxData as MessageBoxInputData).value;
        const loading = this.$loading({
          lock: true,
          text: 'Creating',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        this.$http.get(`/solr/admin/collections?action=CREATEALIAS&name=${value}&collections=${row.name}`).then(
          () => {
            loading.close();
            this.$notify.success(`Alias "${value}" for collection "${row.name}" has been created`);
            this.loadDetailedCollections();
            this.loadAliases();
          },
          () => loading.close(),
        );
      })
      .catch(() => ({}));
  }

  private deleteAliasOfCollection(row: NamedCollectionDetail) {
    this.deleteAliasDialogVisible = true;
    this.selectedCollection = row.name;
  }

  private doDeleteAliasOfCollection() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.$http.get(`/solr/admin/collections?action=DELETEALIAS&name=${this.selectedAlias}`).then(
      () => {
        this.deletingAlias = false;
        this.deleteAliasDialogVisible = false;
        this.$notify.success(`Alias "${this.selectedAlias}" of collection ${this.selectedCollection} is deleted`);
        this.loadAliases();
      },
      () => {
        this.deletingAlias = false;
        this.deleteAliasDialogVisible = false;
        this.loadAliases();
      },
    );
  }

  private done() {
    this.createCollectionDialogVisible = false;
    this.loadDetailedCollections();
  }

  @Watch('solrMode')
  private onSolrModeChanged() {
    this.loadDetailedCollections();
  }

  @Watch('aliases')
  private onAliasesChanged() {
    this.selectedAlias = '';
  }

  created() {
    this.loadDetailedCollections();
    this.loadAliases();
  }
}
</script>

<style scoped>
#collections-root {
  height: calc(100% - 52px);
  padding-top: 12px;
}
#operations {
  margin-right: 12px;
}
.el-select {
  width: 100%;
}
#collections {
  margin-top: 12px;
  border-top: 1px dashed #282a36;
}
</style>
