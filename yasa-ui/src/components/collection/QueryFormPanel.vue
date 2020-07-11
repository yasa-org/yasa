<template>
  <div class="query-form-panel">
    <el-form label-position="left">
      <el-form-item label="qt" prop="qt">
        <el-input v-model.trim="queryForm.qt" placeholder="Request-Handler" clearable></el-input>
      </el-form-item>
      <el-form-item label="q" prop="q">
        <el-input v-model="queryForm.q" placeholder="Query" type="textarea" clearable></el-input>
      </el-form-item>
      <el-form-item label="fq" prop="fq">
        <el-input v-model.trim="queryForm.fq" clearable></el-input>
      </el-form-item>
      <el-form-item label="sort" prop="sort">
        <el-input v-model="queryForm.sort" clearable></el-input>
      </el-form-item>
      <el-form-item label="start" prop="start">
        <el-input-number v-model="queryForm.start" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="rows" prop="rows">
        <el-input-number v-model="queryForm.rows" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="fl" prop="fl">
        <el-input v-model.trim="queryForm.fl" clearable></el-input>
      </el-form-item>
      <el-form-item label="df" prop="df">
        <el-input v-model.trim="queryForm.df" clearable></el-input>
      </el-form-item>
      <el-form-item label="Raw Query Parameters" prop="df">
        <el-input v-model.trim="queryForm.rqp" placeholder="key1=val1&key2=val2" clearable></el-input>
      </el-form-item>
      <el-form-item label="wt" prop="wt">
        <el-select v-model="queryForm.wt" :value="queryForm.wt" filterable>
          <el-option v-for="wt in wts" :key="wt" :value="wt" :label="wt"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="facet">
        <el-checkbox v-model="facet">facet</el-checkbox>
      </el-form-item>
      <el-form-item v-if="facet" label="facet.query" prop="facet.query">
        <el-input v-model.trim="queryForm.facet.query" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="facet" label="facet.field" prop="facet.field">
        <el-input v-model.trim="queryForm.facet.field" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="facet" label="facet.prefix" prop="facet.prefix">
        <el-input v-model.trim="queryForm.facet.prefix" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="querying">Execute Query</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { WTs } from '@service/solr/model';
import QueryForm from '@components/collection/QueryForm';

@Component
export default class QueryFormPanel extends Vue {
  private wts = WTs;
  private queryForm: QueryForm = {
    qt: '/select',
    q: '*:*',
    start: 0,
    rows: 10,
    wt: this.wts[0],
    facet: {
      query: '',
      field: '',
      prefix: '',
    },
  };
  private querying = false;

  private facet = false;

  private submit() {
    const queryForm = Object.assign({}, this.queryForm);

    if (!this.facet) {
      delete queryForm.facet;
    }

    this.$emit('query', queryForm);
  }
}
</script>

<style scoped lang="scss">
.query-form-panel {
  padding: 12px;
  overflow-y: auto;
}
.el-input-number,
.el-select {
  width: 100%;
}
</style>
