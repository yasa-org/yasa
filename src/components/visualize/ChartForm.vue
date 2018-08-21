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
          <el-select v-model="formData.xField" :value="formData.xField" filterable>
            <el-option v-for="f in fields" :key="f.name" :value="f.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="yField" label="Y-Axis Field">
          <el-select v-model="formData.yField" :value="formData.yField" filterable>
            <el-option v-for="f in fields" :key="f.name" :value="f.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="yFieldAggregation" label="Aggregation">
          <el-select v-model="formData.yFieldAggregation" :value="formData.yFieldAggregation" filterable>
            <el-option v-for="a in yAggregations" :key="a" :value="a"></el-option>
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
    }
  },
  data: function () {
    return {
      yAggregations: ['Average', 'Count', 'Unique', 'Max', 'Min', 'Sum'],
      xAggregations: ['Date Histogram', 'Date Range', 'Histogram', 'Terms'],
      formData: {
        title: undefined,
        xField: undefined,
        yField: undefined,
        yFieldAggregation: undefined
      },
      validateRules: {
        yFieldAggregation: [{ required: true, message: this.$t('visualize.aggregationIsRequired'), trigger: 'change' }],
        xField: [{ required: true, message: this.$t('visualize.fieldIsRequired'), trigger: 'change' }],
        yField: [{ required: true, message: this.$t('visualize.fieldIsRequired'), trigger: 'change' }]
      }
    }
  },
  computed: {

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
      this.formData = {}
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
