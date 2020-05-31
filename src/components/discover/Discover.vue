<template>
  <el-container id="root">
    <el-header height="28px">
      <el-input v-model="localQueryString" :placeholder="$t('discover.queryInputHint')" @keyup.enter.native="onQuery">
        <el-select slot="prepend" v-model="collection" :value="collection" :loading="$store.state.loadingCollections">
          <el-option v-for="c in collections" :key="c" :value="c"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="onQuery" :loading="loadingMore">{{ $t('discover.numHit', [numHit]) }}</el-button>
      </el-input>
    </el-header>
    <el-container>
      <el-aside width="200px" v-loading="loadingFields">
        <header v-if="selectedFields.length > 0">Selected Fields</header>
        <el-collapse v-if="selectedFields.length > 0">
          <el-collapse-item v-for="f in selectedFields" :key="f.name">
            <template slot="title">
              <el-button class="operate-field-button" type="text" icon="el-icon-minus" @click.stop="removeSelectedField(f)">{{ f.name }}</el-button>
            </template>
            <div style="height: 42px;" class="field-stats" v-if="loadingFieldsStats" v-loading="loadingFieldsStats"></div>
            <div class="field-stats" v-for="fStat in (fieldsStats[f.name] || {}).buckets || []" :key="fStat.val">
              <div class="value">{{ fStat.val }}</div>
              <el-tooltip :content="`${fStat.count}/${fieldsStats.count}`" placement="top">
                <el-progress :text-inside="true" :stroke-width="18" :percentage="Math.round(fStat.count / fieldsStats.count * 10000) / 100"></el-progress>
              </el-tooltip>
            </div>
          </el-collapse-item>
        </el-collapse>
        <header v-if="availableFields.length > 0">Available Fields</header>
        <el-collapse v-if="availableFields.length > 0">
          <el-collapse-item v-for="f in availableFields" :key="f.name">
            <template slot="title">
              <el-button class="operate-field-button" type="text" icon="el-icon-plus" @click.stop="addSelectedField(f)">{{ f.name }}</el-button>
            </template>
            <div style="height: 42px;" class="field-stats" v-if="loadingFieldsStats" v-loading="loadingFieldsStats"></div>
            <div class="field-stats" v-for="fStat in (fieldsStats[f.name] || {}).buckets || []" :key="fStat.val">
              <div class="value">{{ fStat.val }}</div>
              <el-tooltip :content="`${fStat.count}/${fieldsStats.count}`" placement="top">
                <el-progress :text-inside="true" :stroke-width="18" :percentage="Math.round(fStat.count / fieldsStats.count * 10000) / 100"></el-progress>
              </el-tooltip>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-aside>
      <el-main>
        <el-table height="calc(100% - 28px)" ref="docs" :data="docs" stripe>
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
          <el-table-column v-for="f in selectedFields" :key="f.name" :prop="f.name" :label="f.name" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-button id="load-more" type="text" :loading="loadingMore" @click="loadMore">{{ $t('common.loadMore') }}</el-button>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, namespace } from 'vuex-class'
import { Field, Doc, Result } from '@/model'

const Store = namespace('discover')

@Component
export default class Discover extends Vue {
  private localQueryString = ''

  @State
  private collections!: string[]

  @Store.State private fields!: Field[]
  @Store.State private selectedFields!: Field[]
  @Store.State private availableFields!: Field[]
  @Store.State private queryString!: string
  @Store.State private loadingMore!: boolean
  @Store.State private loadingFields!: boolean
  @Store.State private fieldsStats!: any[]
  @Store.State private loadingFieldsStats!: boolean
  @Store.State private numHit!: number
  @Store.State private docs!: Doc[]

  @Store.Mutation private setCollection!: (collection: string) => void
  @Store.Mutation private setQueryString!: (queryString: string) => void
  @Store.Mutation private setResult!: (result: Result) => void
  @Store.Mutation private setDocs!: (docs: Doc[]) => void
  @Store.Mutation private setAvailableFields!: (fields: Field[]) => void
  @Store.Mutation private setSelectedFields!: (fields: Field[]) => void
  @Store.Mutation private addSelectedField!: (field: Field) => void
  @Store.Mutation private removeSelectedField!: (field: Field) => void

  @Store.Action private loadMore!: () => void
  @Store.Action private loadFieldsStats!: () => void
  @Store.Action private loadFields!: () => void

  mounted () {
    this.localQueryString = this.queryString === '*:*' ? '' : this.queryString
    if (!this.collection) {
      this.selectCollection()
    }
  }

  get collection (): string {
    return this.$store.state.discover.collection
  }

  set collection (value: string) {
    this.setCollection(value)
  }

  selectCollection () {
    const lastCollection = localStorage.getItem('collection')
    if (lastCollection && this.collections.includes(lastCollection)) {
      this.setCollection(lastCollection)
    } else if (this.collections.length > 0) {
      this.setCollection(this.collections[0])
    }
  }

  onQuery () {
    if (this.loadingMore) return
    this.setQueryString(this.localQueryString || '*:*')
    this.setResult(new Result())
    this.setDocs([])
    this.loadMore()
    this.loadFieldsStats()
  }

  sourceFormatter (row: any) {
    return this.fields.filter(f => row[f.name]).map(f => `${f.name}: ${row[f.name]}`).join(' ')
  }

  @Watch('collections')
  onCollectionsChanged () {
    this.selectCollection()
  }

  @Watch('collection', { immediate: true })
  onCollectionChanged () {
    this.setResult(new Result())
    this.setDocs([])
    this.loadFields()
    this.loadMore()
  }

  @Watch('fields')
  onFieldsChanged () {
    this.setAvailableFields(Array(...this.fields))
    this.setSelectedFields([])
    this.loadFieldsStats()
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
  overflow-x: hidden;
}
.el-main {
  padding: 0;
}
.el-select {
  width: 198px;
}
.el-col {
  height: 100%;
}
.el-button.operate-field-button {
  max-width: calc(100% - 30px);
}
.el-button span {
  max-width: 40px;
  clear: both;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.operate-field-button {
  margin-left: 8px;
}
#load-more {
  width: 100%;
}
header {
  padding: 8px;
}
.field-stats {
  padding: 8px;
  border-top: lightgrey 1px dashed;
}
.field-stats .value {
  max-width: 100%;
  clear: both;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
