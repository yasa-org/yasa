<template>
  <div id="root">
    <el-row>
      <el-col :span="10">
        <code-editor
          class="code-editor"
          v-model="content"
          :value="content"
          :commands="commands"
          language="yasa"
        ></code-editor>
      </el-col>
      <el-col :span="14">
        <code-editor
          class="code-editor"
          v-model="displayResult"
          :value="displayResult"
          :read-only="true"
          language="json"
        ></code-editor>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CodeEditor from './code-editor/CodeEditor.vue';
import { GenericResult } from '@service/solr/model';
import { namespace } from 'vuex-class';
import { CommandProps } from '@components/dev-tools/code-editor/CodeEditor';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';
import ITextModel = editor.ITextModel;

const Store = namespace('devtools');

@Component({
  components: {
    CodeEditor: CodeEditor,
  },
})
export default class DevTools extends Vue {
  private commands: CommandProps = [
    {
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      handler: (editor) => {
        const position = editor.getPosition();
        if (!position) {
          return this.$notify.error('Please place the caret in the editor');
        }
        const line = position.lineNumber;
        const lines = (editor.getModel() as ITextModel)?.getLinesContent() || '';

        let startRow = line;
        let endRow = line;
        while (startRow > 0 && !lines[startRow]?.match(/^(GET|PUT|POST|HEAD|DELETE)/i)) {
          startRow--;
        }
        while (endRow < lines.length && !lines[endRow]?.match(/^$/i)) {
          endRow++;
        }
        const commandLine = lines[startRow];
        const dataLines = lines.slice(startRow + 1, endRow).join('\n');

        const methodAndUrl = commandLine.split(/\s+/);
        let method = 'GET';
        let url = methodAndUrl[0];
        if (methodAndUrl.length === 2) {
          method = methodAndUrl[0];
          url = methodAndUrl[1];
        }
        const data = dataLines ? JSON.parse(dataLines) : {};
        data.wt = 'json';
        switch (method) {
          case 'GET':
            this.doGet({ url, data });
            break;
          default:
            break;
        }
      },
    },
  ];

  @Store.Mutation private setContent!: (content: string) => void;

  @Store.Action private doGet!: ({ url, data }: { url: string; data: object }) => void;

  @Store.State private result!: GenericResult;
  @Store.State private loading!: boolean;
  @Store.State private error?: Error;

  get content() {
    return this.$store.state.devtools.content;
  }

  set content(val) {
    this.setContent(val);
  }

  get displayResult() {
    return JSON.stringify(this.result, null, '\t');
  }
}
</script>

<style scoped>
#root {
  height: 100vh;
  overflow: hidden;
}
.el-row,
.el-col {
  height: 100%;
}
.code-editor {
  height: 100%;
  border-left: lightgray 1px solid;
}
</style>
