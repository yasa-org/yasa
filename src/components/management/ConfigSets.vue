<template>
  <el-container>
    <el-aside width="30%">
      <el-tree :data="configSets" v-loading="loadingConfigSets" :props="treeProps" @node-click="nodeClicked">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <el-button type="text" icon="el-icon-plus" @click.stop="createConfigSetDialogVisible=true" v-if="node.level===1"></el-button>
          <el-button type="text" icon="el-icon-delete" @click.stop="deleteConfigSet(data)" v-if="node.level===2"></el-button>
        </span>
      </el-tree>
    </el-aside>
    <el-container>
      <code-editor id="file-content-editor" :value="fileContent" :mode="mode" theme="ace/theme/dawn" v-loading="loadingFileContent" read-only show-gutter></code-editor>
    </el-container>
    <el-dialog title="Create Config Set" :visible.sync="createConfigSetDialogVisible">
      <el-form label-width="140px" v-model="newConfigSet">
        <el-form-item label="Name" prop="name">
          <el-input placeholder="ConfigSet to be created" v-model="newConfigSet.name"></el-input>
        </el-form-item>
        <el-form-item v-if="false">
          <el-radio-group value="method" v-model="method">
            <el-radio-button label="base">Choose base config set</el-radio-button>
            <el-radio-button label="upload">Upload new config set</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Base Config Set" v-if="method==='base'">
          <el-input placeholder="ConfigSet to copy as a base" v-model="newConfigSet.baseConfigSet"></el-input>
        </el-form-item>
        <el-form-item label="Upload Config Set" v-if="method==='upload'">
          <el-upload ref="uploader" drag :auto-upload="false" accept=".zip" :http-request="upload" :limit="1" action="">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drag ZIP file here，or <em>CLICK TO UPLOAD</em></div>
            <div class="el-upload__tip" slot="tip">Only ZIP file is allowed</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="createConfigSetDialogVisible=false">Cancel</el-button>
          <el-button type="primary" @click="createConfigSet" :loading="creatingConfigSet">Create</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import CodeEditor from '../dev-tools/code-editor/AceEditor'
import 'brace/mode/xml'
import 'brace/mode/json'
import 'brace/mode/text'

export default {
  name: 'ConfigSets',
  components: {CodeEditor},
  computed: {
    ...mapState('management/configSets', ['configSets', 'loadingConfigSets', 'fileContent'])
  },
  methods: {
    ...mapMutations('management/configSets', ['setFileContent']),
    ...mapActions('management/configSets', ['loadConfigSets']),
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
    },
    deleteConfigSet (data) {
      const name = data.data.title
      this.$confirm(`Do you want to delete config set: "${name}"`, 'Delete Config Set').then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Deleting',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.$http.get('/solr/admin/configs', {
          params: {
            action: 'DELETE',
            name: name
          }
        }).then(() => {
          loading.close()
          this.loadConfigSets()
        }, () => {
          loading.close()
        })
      }, () => {})
    },
    upload (param) {
      console.log(param)
      const formData = new FormData()
      formData.append('name', this.newConfigSet.name)
      formData.append('file', param.file)
      this.$http.post('/solr/admin/configs?action=CREATE', formData).then(() => {}, () => {})
    },
    createConfigSet () {
      if (this.method === 'upload') {
        this.$refs.uploader.submit()
        return
      }
      if (this.creatingConfigSet) return
      this.creatingConfigSet = true
      this.$http.get('/solr/admin/configs', {
        params: {
          action: 'CREATE',
          name: this.newConfigSet.name,
          baseConfigSet: this.newConfigSet.baseConfigSet
        }
      }).then(() => {
        this.createConfigSetDialogVisible = false
        this.creatingConfigSet = false
        this.loadConfigSets()
      }, () => {
        this.creatingConfigSet = false
      })
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
      createConfigSetDialogVisible: false,
      mode: 'ace/mode/text',
      newConfigSet: {
        name: undefined,
        baseConfigSet: undefined
      },
      creatingConfigSet: false,
      method: 'base'
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
