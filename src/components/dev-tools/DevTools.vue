<template>
  <div id="root">
    <el-row>
      <el-col :span="12">
        <code-editor ref="codeEditor" id="code-editor" v-model="content" :value="content" mode="ace/mode/yasa" theme="ace/theme/dawn" show-gutter></code-editor>
      </el-col>
      <el-col :span="12">
        <tree-view id="result" :data="result" :options="treeOptions" v-loading="loading"></tree-view>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CodeEditor from './code-editor/AceEditor.vue'
import 'brace/theme/dawn'
import { Mutation, namespace } from 'vuex-class'

const Store = namespace('devtools')

@Component({
  components: {
    CodeEditor
  }
})
export default class DevTools extends Vue {
    private treeOptions = {
      rootObjectKey: 'result',
      maxDepth: Infinity
    }

    mounted () {
      const editor = (this.$refs.codeEditor as CodeEditor).editor
      editor.commands.addCommand({
        name: 'Run',
        exec: () => {
          const row = editor.getCursorPosition().row
          let startRow = row
          let endRow = row
          while (startRow > 0 && !editor.session.getLine(startRow).match(/^(GET|PUT|POST|HEAD|DELETE)/i)) {
            startRow--
          }
          while (endRow < editor.session.doc.getLength() && !editor.session.getLine(endRow).match(/^$/i)) {
            endRow++
          }
          const commandLine = editor.session.doc.getLine(startRow)
          const dataLines = editor.session.doc.getLines(startRow + 1, endRow).join('\n')

          const methodAndUrl = commandLine.split(/\s+/)
          let method = 'GET'
          let url = methodAndUrl[0]
          if (methodAndUrl.length === 2) {
            method = methodAndUrl[0]
            url = methodAndUrl[1]
          }
          const data = dataLines ? JSON.parse(dataLines) : {}
          data.wt = 'json'
          switch (method) {
            case 'GET':
              this.doGet({ url, data })
              break
            default:
              break
          }
        },
        bindKey: {
          mac: 'cmd-enter',
          win: 'ctrl-enter'
        }
      })
      editor.focus()
    }

  @Mutation private setContent!: (content: string) => void
  @Mutation private setResult!: (result: any) => void
  @Mutation private setLoading!: (loading: boolean) => void

  @Store.Action private doGet!: ({ url, data }: { url: string; data: object }) => void

  @Store.State private result!: any
  @Store.State private loading!: boolean

  get content () {
    return this.$store.state.devtools.content
  }

  set content (val) {
    this.setContent(val)
  }
}
</script>

<style scoped>
#root {
  height: 100vh;
}
.el-row, .el-col {
  height: 100%;
}
#code-editor {
  height: 100%;
  border-right: 1px solid lightgray;
}
#result {
  height: 100%;
}
</style>
