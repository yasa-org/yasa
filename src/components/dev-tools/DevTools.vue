<template>
  <div id="root">
    <el-row>
      <el-col :span="10">
        <code-editor ref="codeEditor" id="code-editor" v-model="content" :value="content" lang="yasa" show-gutter></code-editor>
      </el-col>
      <el-col :span="14">
        <tree-view id="result" :data="result" :options="resultOptions"></tree-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CodeEditor from './code-editor/AceEditor'

export default {
  name: 'dev-tools',
  components: {
    CodeEditor
  },
  data () {
    return {
      content: '',
      result: {},
      resultOptions: {
        rootObjectKey: 'result',
        maxDepth: Infinity
      }
    }
  },
  mounted () {
    const editor = this.$refs.codeEditor.editor
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
        console.log(commandLine, dataLines)

        const methodAndUrl = commandLine.split(/\s+/)
        let method = 'GET'
        let url = methodAndUrl[0]
        if (methodAndUrl.length === 2) {
          method = methodAndUrl[0]
          url = methodAndUrl[1]
        }
        const data = JSON.parse(dataLines)
        data.wt = 'json'
        console.log(method, url)
        console.log(data)

        switch (method) {
          case 'GET':
            this.$http.jsonp(url, {params: data, jsonp: 'json.wrf'}).then(res => {
              this.result = res.data
            })
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
  },
  methods: {
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
