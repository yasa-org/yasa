<template>
  <div>
    <el-card shadow="never" id="buckets">
      <div slot="header" style="line-height: 28px">
        {{ $t('visualize.title') }}
        <el-button style="float: right" icon="el-icon-fa-play" type="primary" @click="submit"></el-button>
      </div>
      <el-form ref="form" :rules="validateRules" :model="formData">
        <el-form-item prop="title" label="Title">
          <el-input v-model="formData.title" :placeholder="$t('visualize.titleHint')"></el-input>
        </el-form-item>
        <el-form-item prop="xField" label="X-Axis Field">
          <el-select v-model="formData.xField" :value="formData.xField" :loading="loadingFields" filterable>
            <el-option v-for="f in fields" :key="f.name" :value="f.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="yField" label="Y-Axis Field">
          <el-select v-model="formData.yField" :value="formData.yField" :loading="loadingFields" filterable>
            <el-option v-for="f in fields" :key="f.name" :value="f.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="yFieldAggregation" label="Aggregation">
          <el-select v-model="formData.yFieldAggregation" :value="formData.yFieldAggregation" filterable>
            <el-option v-for="a in yAggregations" :key="a" :value="a"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="Type">
          <el-select v-model="formData.type" placeholder="Select a chart type">
            <el-option v-for="type in chartTypes" :key="type.value" :value="type.value" :label="type.label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'chart-form',
  props: {
    fields: {
      type: Array,
      default () {
        return []
      }
    },
    loadingFields: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      chartTypes: [
        {label: 'Line', value: 'line'},
        {label: 'Bar', value: 'bar'},
        {label: 'Area', value: 'area'}
      ],
      yAggregations: ['Average', 'Count', 'Unique', 'Max', 'Min', 'Sum'],
      xAggregations: ['Date Histogram', 'Date Range', 'Histogram', 'Terms'],
      formData: {
        type: 'line',
        title: undefined,
        xField: undefined,
        yField: undefined,
        yFieldAggregation: undefined
      },
      validateRules: {
        type: [{ required: true, message: this.$t('visualize.typeIsRequired'), trigger: 'change' }],
        yFieldAggregation: [{ required: true, message: this.$t('visualize.aggregationIsRequired'), trigger: 'change' }],
        xField: [{ required: true, message: this.$t('visualize.fieldIsRequired'), trigger: 'change' }],
        yField: [{ required: true, message: this.$t('visualize.fieldIsRequired'), trigger: 'change' }]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.formData)
        } else return false
      })
    }
  },
  watch: {
    fields () {
      this.formData = {
        type: 'line'
      }
    }
  }
}
</script>

<style scoped>
#buckets {
  margin-top: 12px;
}
.el-select, .el-input {
  width: 100%;
}
</style>
