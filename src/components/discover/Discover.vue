<template>
  <el-container id="root">
    <el-header height="28px">
      <el-input v-model="inputQueryString" :placeholder="$t('discover.queryInputHint')" @keyup.enter.native="onQuery">
        <el-select slot="prepend" v-model="selectedCollection" :value="selectedCollection">
          <el-option v-for="c in collections" :key="c" :value="c"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="onQuery" :loading="state.loadingMore">{{ $t('discover.numHit', [numHit]) }}</el-button>
      </el-input>
    </el-header>
    <el-container>
      <el-aside width="183px">
        <el-table ref="selectedFields" :data="selectedFields" v-loading="state.loadingFields">
          <el-table-column prop="name" label="Selected Fields">
            <div slot-scope="scope" class="field-row">
              {{ scope.row.name }} <el-button class="operate-field-button" type="text" icon="el-icon-minus" @click="removeField(scope.row)"></el-button>
            </div>
          </el-table-column>
        </el-table>
        <el-table ref="availableFields" :data="availableFields" v-loading="state.loadingFields">
          <el-table-column prop="name" label="Available Fields">
            <div slot-scope="scope" class="field-row">
              {{ scope.row.name }} <el-button class="operate-field-button" type="text" icon="el-icon-plus" @click="addField(scope.row)"></el-button>
            </div>
          </el-table-column>
        </el-table>
      </el-aside>
      <el-main>
        <el-table height="calc(100% - 28px)" ref="filteredDocs" :data="filteredDocs" v-loading="state.loadingMore" stripe>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="fields" stripe>
                <el-table-column label="Field" prop="name"></el-table-column>
                <el-table-column label="Content">
                  <template slot-scope="scope">{{ props.row[scope.row.name] }}</template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column v-if="selectedFields.length===0" label="_source" :formatter="sourceFormatter"></el-table-column>
          <el-table-column v-for="f in selectedFields" :key="f.name" :prop="f.name" :label="f.name"></el-table-column>
        </el-table>
        <el-button id="load-more" type="text" :loading="state.loadingMore" @click="loadMore">{{ $t('common.loadMore') }}</el-button>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'discover',
  data () {
    return {
      numHit: 0,
      collections: [],
      selectedCollection: undefined,
      fields: [],
      availableFields: [],
      selectedFields: [],
      filteredDocs: [],
      inputQueryString: undefined,
      q: '*:*',
      result: {},
      state: {
        loadingCollections: true,
        loadingCollectionsSuccess: true,
        loadingFields: true,
        loadingFieldsSuccess: true,
        loadingMore: true,
        loadingMoreSuccess: true
      }
    }
  },
  created () {
    this.loadCollections()
  },
  methods: {
    loadCollections () {
      this.state.loadingCollections = true
      this.$http.jsonp('/solr/admin/info/system?wt=json', {jsonp: 'json.wrf'}).then(res => {
        if (res.data.mode === 'solrcloud') {
          this.$http.jsonp('/solr/admin/collections', {
            params: {
              action: 'LIST',
              wt: 'json'
            },
            jsonp: 'json.wrf'
          }).then((res) => {
            this.collections = res.data.collections
            this.state.loadingCollections = false
            this.state.loadingCollectionsSuccess = true
          }, () => {
            this.state.loadingCollections = false
            this.state.loadingCollectionsSuccess = false
          })
        } else {
          this.$http.jsonp('/solr/admin/cores', {
            params: {
              wt: 'json'
            },
            jsonp: 'json.wrf'
          }).then((res) => {
            this.collections = Object.keys(res.data.status)
            this.state.loadingCollections = false
            this.state.loadingCollectionsSuccess = true
          }, () => {
            this.state.loadingCollections = false
            this.state.loadingCollectionsSuccess = false
          })
        }
      })
    },
    loadFields () {
      if (!this.selectedCollection) return

      this.state.loadingFields = true

      this.$http.get(`/solr/${this.selectedCollection}/schema/fields?wt=csv`).then(res => {
        this.fields = res.data.split(',').map(f => ({name: f}))
        this.state.loadingFields = false
        this.state.loadingFieldsSuccess = true
      }, () => {
        this.state.loadingFields = false
        this.state.loadingFieldsSuccess = false
      })
    },
    loadDocs () {
      this.state.loadingMore = true
      this.$http.get(`/solr/${this.selectedCollection}/select?wt=json`, {
        params: {
          q: this.q,
          sort: 'id desc',
          rows: 50,
          cursorMark: '*'
        }
      }).then(res => {
        this.result = res.data
        this.state.loadingMore = false
        this.state.loadingMoreSuccess = true
      }, () => {
        this.state.loadingMore = false
        this.state.loadingMoreSuccess = false
      })
    },
    loadMore () {
      this.state.loadingMore = true
      this.$http.get(`/solr/${this.selectedCollection}/select?wt=json`, {
        params: {
          q: this.q,
          sort: 'id desc',
          rows: 50,
          cursorMark: this.result.nextCursorMark
        }
      }).then(res => {
        this.filteredDocs.push(...res.data.response.docs)
        this.state.loadingMore = false
        this.state.loadingMoreSuccess = true
      }, () => {
        this.state.loadingMore = false
        this.state.loadingMoreSuccess = false
      })
    },

    onQuery () {
      if (this.state.loadingMore) return
      this.q = this.inputQueryString || '*:*'
      this.loadDocs()
    },

    addField (row) {
      this.selectedFields.push(row)
      this.availableFields.splice(this.availableFields.indexOf(row), 1)
    },
    removeField (row) {
      this.availableFields.push(row)
      this.selectedFields.splice(this.selectedFields.indexOf(row), 1)
    },

    sourceFormatter (row) {
      return this.fields.filter(f => row[f.name]).map(f => `${f.name}: ${row[f.name]}`).join(' ')
    }
  },
  watch: {
    collections () {
      if (this.collections.length > 0) {
        this.selectedCollection = this.collections[0]
      }
    },
    selectedCollection () {
      this.result = {}
      this.filteredDocs = []
      this.loadFields()
      this.loadDocs()
    },
    fields () {
      this.availableFields = Array(...this.fields)
      this.selectedFields = []
    },
    result () {
      this.filteredDocs = ((this.result || {}).response || {}).docs || []
      this.numHit = ((this.result || {}).response || {}).numFound || 0
    }
  }
}
</script>

<style scoped>
#root {
  height: 100vh;
}
.el-header {
  padding: 0 0 0 0;
}
.el-aside {
  border-right: 1px solid lightgray;
}
.el-main {
  padding: 0;
}
.el-select {
  width: 181px;
}
.el-col {
  height: 100%;
}
.operate-field-button {
  float: right;
}
.field-row {
  line-height: 28px;
  cursor: pointer
}
#load-more {
  width: 100%;
}
</style>
