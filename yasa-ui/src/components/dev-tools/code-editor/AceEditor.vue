<template>
  <div :style="`height: ${height}; width: ${width}`"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

@Component
export default class CodeEditor extends Vue {
  @Prop()
  private mode!: string;

  @Prop({
    required: true,
  })
  private value!: string;

  @Prop({
    default: 'ace/theme/github',
  })
  private theme!: string;

  @Prop()
  private height!: string;

  @Prop()
  private width!: string;

  @Prop()
  private showGutter!: boolean;

  @Prop()
  private readOnly!: boolean;

  editor!: ace.Editor;

  @Watch('showGutter')
  private onShowGutterChanged() {
    this.editor.renderer.setShowGutter(this.showGutter);
  }

  @Watch('readOnly')
  private onReadOnlyChanged() {
    this.editor.setOptions({
      readOnly: this.readOnly,
      highlightActiveLine: !this.readOnly,
      highlightGutterLine: !this.readOnly,
    });
  }

  @Watch('mode')
  private onModeChanged() {
    this.editor.session.setMode(this.mode);
  }

  @Watch('theme')
  private onThemeChanged() {
    this.editor.setTheme(this.theme);
  }

  @Watch('value')
  private onValueChanged() {
    if (this.value === this.editor.getValue()) return;
    this.editor.setValue(this.value, 1);
  }

  beforeDestroy() {
    this.editor.destroy();
    this.editor.container.remove();
  }

  mounted() {
    this.editor = ace.edit(this.$el as HTMLElement);
    this.editor.$blockScrolling = Infinity;
    this.editor.setTheme(this.theme);
    this.editor.setValue(this.value, 1);
    this.editor.renderer.setShowGutter(this.showGutter);
    this.editor.setOptions({
      readOnly: this.readOnly,
      highlightActiveLine: !this.readOnly,
      highlightGutterLine: !this.readOnly,
    });
    this.editor.session.setUseWrapMode(true);
    this.editor.session.setMode(this.mode);
    this.editor.on('change', () => {
      this.$emit('input', this.editor.getValue());
    });
  }
}
</script>

<style scoped></style>
