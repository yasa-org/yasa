<template>
  <div :style="`height: ${height}; width: ${width}`"></div>
</template>

<script>
import ace from 'brace'
import 'brace/mode/json'
import 'brace/theme/github'
import './mode/yasa'
export default {
  name: 'code-editor',
  props: {
    value: {
      type: String,
      required: true
    },
    mode: String,
    theme: {
      type: String,
      default () {
        return 'ace/theme/github'
      }
    },
    height: String,
    width: String,
    options: Object,
    showGutter: Boolean,
    readOnly: Boolean
  },
  data: function () {
    return {
      editor: undefined
    }
  },
  watch: {
    showGutter () {
      this.editor.renderer.setShowGutter(this.showGutter)
    },
    readOnly () {
      this.editor.setOptions({
        readOnly: this.readOnly,
        highlightActiveLine: !this.readOnly,
        highlightGutterLine: !this.readOnly
      })
      this.editor.renderer.$cursorLayer.element.style.display = this.readOnly ? 'none' : 'display'
    },
    mode () {
      this.editor.session.setMode(this.mode)
    },
    theme () {
      this.editor.setTheme(this.theme)
    },
    value () {
      if (this.value === this.editor.getValue()) return
      this.editor.setValue(this.value, 1)
    }
  },
  beforeDestroy: function () {
    this.editor.destroy()
    this.editor.container.remove()
  },
  mounted: function () {
    this.editor = ace.edit(this.$el)
    this.editor.$blockScrolling = Infinity
    this.editor.setTheme(this.theme)
    this.editor.setValue(this.value, 1)
    this.editor.renderer.setShowGutter(this.showGutter)
    this.editor.setOptions({
      readOnly: this.readOnly,
      highlightActiveLine: !this.readOnly,
      highlightGutterLine: !this.readOnly
    })
    this.editor.renderer.$cursorLayer.element.style.display = this.readOnly ? 'none' : 'display'
    this.editor.session.setUseWrapMode(true)
    this.editor.session.setMode(this.mode)
    this.editor.on('change', () => {
      this.$emit('input', this.editor.getValue())
    })
  }
}

</script>

<style scoped>
</style>
