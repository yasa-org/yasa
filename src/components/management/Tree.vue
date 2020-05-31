<template>
  <el-container>
    <el-aside width="30%">
      <el-tree :data="configSets" v-loading="loadingConfigSets" :props="treeProps" @node-click="nodeClicked"></el-tree>
    </el-aside>
    <el-container>
      <code-editor id="file-content-editor" :value="fileContent" :mode="mode" theme="ace/theme/dawn" v-loading="loadingFileContent" read-only="true" show-gutter="true"></code-editor>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import CodeEditor from '../dev-tools/code-editor/AceEditor.vue'
import 'brace/mode/xml'
import 'brace/mode/json'
import 'brace/mode/text'

const Store = namespace('management/tree')

@Component({
  components: {
    CodeEditor
  }
})
export default class Tree extends Vue {
  private treeProps = {
    label: (data: any) => {
      const title = data.data.title
      return title === '/' ? title : title.replace(/^\//, '')
    }
  }

  private loadingFileContent = false
  private mode = 'ace/mode/text'

  @Store.State private configSets!: object[]
  @Store.State private loadingConfigSets!: boolean
  @Store.State private fileContent!: string

  @Store.Mutation private setFileContent!: (content: string) => void

  @Store.Action private loadConfigSets!: () => void

  public nodeClicked (data, node) {
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

  created () {
    this.loadConfigSets()
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
