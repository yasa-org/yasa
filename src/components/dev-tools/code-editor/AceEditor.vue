<template>
  <div :style="`height: ${height}; width: ${width}`"></div>
</template>

<script>
import ace from 'brace'
import 'brace/mode/json'
import './mode/yasa'
export default {
  name: 'code-editor',
  props: {
    value: {
      type: String,
      required: true
    },
    lang: String,
    theme: String,
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
    lang () {
      this.editor.session.setMode(`ace/mode/${this.lang}`)
    }
  },
  beforeDestroy: function () {
    this.editor.destroy()
    this.editor.container.remove()
  },
  mounted: function () {
    this.editor = ace.edit(this.$el)
    this.editor.$blockScrolling = Infinity
    this.editor.setValue(this.value)
    this.editor.renderer.setShowGutter(this.showGutter)
    this.editor.setOptions({
      readOnly: this.readOnly,
      highlightActiveLine: !this.readOnly,
      highlightGutterLine: !this.readOnly
    })
    this.editor.renderer.$cursorLayer.element.style.display = this.readOnly ? 'none' : 'display'
    this.editor.session.setUseWrapMode(true)
    this.editor.session.setMode(`ace/mode/${this.lang}`)
    this.editor.on('change', () => {
      this.$emit('input', this.editor.getValue())
    })
  }
}

</script>

<style scoped>
</style>
