<template>
  <el-container id="root">
    <el-header height="28px">
      <el-input v-model="inputQueryString" :placeholder="$t('discover.queryInputHint')" @keyup.enter.native="onQuery">
        <el-select slot="prepend" v-model="collection" :value="collection" :loading="$store.state.loadingCollections">
          <el-option v-for="c in collections" :key="c" :value="c"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="onQuery" :loading="loadingMore">{{ $t('discover.numHit', [numHit]) }}</el-button>
      </el-input>
    </el-header>
    <el-container>
      <el-aside width="183px">
        <el-table ref="selectedFields" :data="selectedFields" v-loading="$store.state.loadingFields">
          <el-table-column prop="name" :label="$t('discover.selectedFields')">
            <div slot-scope="scope" class="field-row">
              {{ scope.row.name }} <el-button class="operate-field-button" type="text" icon="el-icon-minus" @click="removeSelectedField(scope.row)"></el-button>
            </div>
          </el-table-column>
        </el-table>
        <el-table ref="availableFields" :data="availableFields" v-loading="$store.state.loadingFields">
          <el-table-column prop="name" :label="$t('discover.availableFields')">
            <div slot-scope="scope" class="field-row">
              {{ scope.row.name }} <el-button class="operate-field-button" type="text" icon="el-icon-plus" @click="addSelectedField(scope.row)"></el-button>
            </div>
          </el-table-column>
        </el-table>
      </el-aside>
      <el-main>
        <el-table height="calc(100% - 28px)" ref="docs" :data="docs" v-loading="loadingMore" stripe>
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
        <el-button id="load-more" type="text" :loading="loadingMore" @click="loadMore">{{ $t('common.loadMore') }}</el-button>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
  name: 'discover',
  data: function () {
    return {
      inputQueryString: undefined
    }
  },
  created: function () {
    this.selectCollection()
  },
  mounted: function () {
    this.inputQueryString = this.queryString === '*:*' ? undefined : this.queryString
  },
  computed: {
    ...mapState(['collections', 'fields']),
    ...mapState('discover', ['queryString', 'docs', 'result', 'numHit', 'loadingMore', 'availableFields', 'selectedFields']),
    collection: {
      get () {
        return this.$store.state.collection
      },
      set (val) {
        this.setCollection(val)
      }
    }
  },
  methods: {
    ...mapMutations(['setCollections', 'setCollection', 'setFields']),
    ...mapMutations('discover', [
      'setAvailableFields', 'setSelectedFields', 'setQueryString', 'setDocs', 'addDocs', 'setResult',
      'addSelectedField', 'removeSelectedField'
    ]),
    ...mapActions(['loadFields']),
    ...mapActions('discover', ['loadMore']),

    selectCollection () {
      if (localStorage.getItem('collection')) {
        this.setCollection(localStorage.getItem('collection'))
      } else if (this.collections.length > 0) {
        this.setCollection(this.collections[0])
      }
    },

    onQuery () {
      if (this.loadingMore) return
      this.setQueryString(this.inputQueryString || '*:*')
      this.setResult({})
      this.setDocs([])
      this.loadMore()
    },

    sourceFormatter (row) {
      return this.fields.filter(f => row[f.name]).map(f => `${f.name}: ${row[f.name]}`).join(' ')
    }
  },
  watch: {
    collections () {
      this.selectCollection()
    },
    collection () {
      this.setResult({})
      this.setDocs([])
      this.loadFields()
      this.loadMore()
    },
    fields () {
      this.setAvailableFields(Array(...this.fields))
      this.setSelectedFields([])
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
