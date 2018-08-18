<template>
  <el-container>
    <el-aside width="30%">
      <el-tree :data="configSets" v-loading="loadingConfigSets" :props="treeProps" @node-click="nodeClicked"></el-tree>
    </el-aside>
    <el-container>
      <code-editor id="file-content-editor" :value="fileContent" :mode="mode" theme="ace/theme/dawn" v-loading="loadingFileContent" read-only show-gutter></code-editor>
    </el-container>
  </el-container>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import CodeEditor from '../dev-tools/code-editor/AceEditor'
import 'brace/mode/xml'
import 'brace/mode/json'
import 'brace/mode/text'

export default {
  name: 'Tree',
  components: {CodeEditor},
  computed: {
    ...mapState('management/tree', ['configSets', 'loadingConfigSets', 'fileContent'])
  },
  methods: {
    ...mapMutations('management/tree', ['setFileContent']),
    ...mapActions('management/tree', ['loadConfigSets']),
    nodeClicked (data, node) {
      if (node.isLeaf) {
        this.loadingFileContent = true
        const url = data.data.attr.href
        this.$http.get(`/solr/${url}`).then(res => {
          this.loadingFileContent = false
          this.setFileContent(res.data.znode.data || '')
          if (url.match(/.*\.json$/)) {
            this.mode = 'ace/mode/json'
          } else if (url.match(/.*\.xml$/) || url.match(/managed-schema$/)) {
            this.mode = 'ace/mode/xml'
          } else {
            this.mode = 'ace/mode/text'
          }
        }, () => (this.loadingFileContent = false))
      }
    }
  },
  created () {
    this.loadConfigSets()
  },
  data () {
    return {
      treeProps: {
        label: (data) => {
          const title = data.data.title
          return title === '/' ? title : title.replace(/^\//, '')
        }
      },
      loadingFileContent: false,
      mode: 'ace/mode/text'
    }
  }
}
</script>

<style scoped>
.el-aside, .el-tree {
  height: 100vh;
}
#file-content-editor {
  width: 100%;
  height: 100vh;
}
</style>
