<template>
  <div id="editor" ref="editor"></div>
</template>

<script lang="ts">
import * as monaco from 'monaco-editor';
import { editor, IPosition, languages } from 'monaco-editor';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { CommandProps } from '@components/common/code-editor/CodeEditor';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import IMonarchLanguage = languages.IMonarchLanguage;

@Component
export default class CodeEditor extends Vue {
  @Prop()
  private value!: string;
  @Prop()
  private commands!: CommandProps | (() => CommandProps);
  @Prop({
    required: false,
    default: false,
  })
  private readOnly!: boolean;
  @Prop({
    required: false,
  })
  private language?: string;

  constructor() {
    super();

    monaco.languages.register({ id: 'yasa' });

    monaco.languages.setMonarchTokensProvider('yasa', {
      ignoreCase: true,
      tokenizer: {
        root: [[/^(GET|PUT|POST|HEAD|DELETE)\s+/, 'keyword']],
      },
    } as IMonarchLanguage);
  }

  @Watch('value')
  onValueChanged(value: string, originalValue: string) {
    if (value === originalValue) {
      return;
    }

    const position = this.editor?.getPosition();
    this.editor?.setValue(value);
    this.editor?.setPosition(position || ({ lineNumber: value.split('\n').length, column: 1 } as IPosition));
  }

  @Watch('language')
  onLanguageChanged(language: string) {
    const model = this.editor?.getModel();
    if (!model) {
      return;
    }
    monaco.editor.setModelLanguage(model, language);
  }

  private editor?: IStandaloneCodeEditor;

  mounted() {
    const editor = monaco.editor.create(this.$refs['editor'] as HTMLElement, {
      value: this.value,
      language: this.language,
      minimap: {
        enabled: false,
      },
      automaticLayout: true,
      readOnly: this.readOnly,
    });

    editor.onDidChangeModelContent(() => {
      if (this.readOnly) {
        return;
      }
      this.$emit('input', editor.getModel()?.getLinesContent()?.join('\n') || '');
    });

    (typeof this.commands === 'function' ? this.commands() : this.commands || []).forEach((command) =>
      editor?.addCommand(command.keybinding, () => command.handler(editor)),
    );

    this.editor = editor;
  }
}
</script>

<style scoped lang="scss">
#editor {
  width: 100%;
  height: 100%;
}
</style>
