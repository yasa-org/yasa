<template>
  <el-container>
    <el-aside width="30%">
      <el-tree :data="configSets" v-loading="loadingConfigSets" :props="treeProps" @node-click="nodeClicked"></el-tree>
    </el-aside>
    <el-container>
      <code-editor
        id="file-content-editor"
        v-model="fileContent"
        :value="fileContent"
        :language="mode"
        v-loading="loadingFileContent"
        read-only="true"
      ></code-editor>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import CodeEditor from '../dev-tools/code-editor/CodeEditor.vue';
import { ZkTreeNode } from '@service/solr/admin/zookeeper';
import { Component, Vue } from 'vue-property-decorator';
import { TreeNode } from 'element-ui/types/tree';
import { namespace } from 'vuex-class';

const Store = namespace('management/tree');

@Component({
  components: {
    CodeEditor,
  },
})
export default class Tree extends Vue {
  private treeProps = {
    label: (data: ZkTreeNode) => {
      const title = data.data?.title || data?.text || '-';
      return title === '/' ? title : title.replace(/^\//, '');
    },
  };

  private loadingFileContent = false;
  private mode = 'ace/mode/text';

  @Store.State private configSets!: ZkTreeNode[];
  @Store.State private loadingConfigSets!: boolean;
  @Store.State private fileContent!: string;

  @Store.Mutation private setFileContent!: (content: string) => void;

  @Store.Action private loadConfigSets!: () => void;

  public nodeClicked(data: ZkTreeNode, node: TreeNode<string, ZkTreeNode>) {
    if (node.isLeaf) {
      this.loadingFileContent = true;
      const url = data.data?.attr?.href || data?.a_attr?.href || '';
      this.$http.get(`/solr/${url}`).then(
        (res) => {
          this.loadingFileContent = false;
          this.setFileContent(res.data.znode.data || '');
          if (url.match(/.*\.json$/)) {
            this.mode = 'json';
          } else if (url.match(/.*\.xml$/) || url.match(/managed-schema$/)) {
            this.mode = 'xml';
          } else if (url.match(/.*\.js$/)) {
            this.mode = 'javascript';
          } else {
            this.mode = 'text';
          }
        },
        () => (this.loadingFileContent = false),
      );
    }
  }

  created() {
    this.loadConfigSets();
  }
}
</script>

<style scoped>
.el-aside,
.el-tree {
  height: 100vh;
}
#file-content-editor {
  width: 100%;
  height: 100vh;
  border-left: lightgray 1px solid;
}
</style>
