<template>
  <div id="root">
    <el-row>
      <el-col :md="6" :sm="10" :xs="12" style="overflow-y: scroll;">
        <query-form-panel @query="query"></query-form-panel>
      </el-col>
      <el-col :md="18" :sm="14" :xs="12">
        <code-editor
          class="code-editor"
          v-model="result"
          :value="result"
          :read-only="true"
          :language="queryForm.wt || 'json'"
        ></code-editor>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CodeEditor from '@components/common/code-editor/CodeEditor.vue';
import QueryFormPanel from '@components/collection/QueryFormPanel.vue';
import QueryForm from '@components/collection/QueryForm';
import http from '@/http';
import { AxiosResponse } from 'axios';
import flat from 'flat';

@Component({
  components: {
    CodeEditor,
    QueryFormPanel,
  },
})
export default class DevTools extends Vue {
  private result = '';

  private collection!: string;
  private queryForm: QueryForm = {} as QueryForm;

  created() {
    this.collection = this.$route.params.name;
  }

  private query(queryForm: QueryForm) {
    this.queryForm = Object.assign({}, queryForm);
    const url = `/solr/${this.collection}/${queryForm.qt.replace(/^\//, '')}`;
    const params = Object.assign(
      flat(
        Object.assign({}, queryForm, {
          qt: undefined,
        }),
      ),
      {
        facet: this.queryForm.facet ? 'on' : 'off',
      },
    );

    http
      .get(url, {
        params,
        transformResponse: (res) => res,
      })
      .then((res: AxiosResponse<string>) => {
        this.result = res.data;
      })
      .catch((err) => {
        this.result = JSON.stringify(err, null, 2);
      });
  }
}
</script>

<style scoped lang="scss">
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
}
</style>
