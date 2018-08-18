<template>
  <el-row id="dashboard-root">
    <el-col :lg="12" :sm="24" :xs="24">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="instance">
          <template slot="title"><i class="el-icon-yasa-instance"></i> Instance</template>
          <el-form label-width="120px" label-position="left">
            <el-form-item label="Mode">{{ system.mode }}</el-form-item>
            <el-form-item label="Start">{{ startTime }}</el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="versions">
          <template slot="title"><i class="el-icon-yasa-version"></i> Versions</template>
          <el-form label-width="120px" label-position="left">
            <el-form-item label="Solr Spec">{{ (system.lucene || {})['solr-spec-version'] }}</el-form-item>
            <el-form-item label="Solr Impl">{{ (system.lucene || {})['solr-impl-version'] }}</el-form-item>
            <el-form-item label="Lucene Spec">{{ (system.lucene || {})['lucene-spec-version'] }}</el-form-item>
            <el-form-item label="Lucene Impl">{{ (system.lucene || {})['lucene-impl-version'] }}</el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="jvm">
          <template slot="title"><i class="el-icon-yasa-java"></i> JVM</template>
          <el-form label-width="120px" label-position="left">
            <el-form-item label="Runtime">{{ (system.jvm || {}).name }} {{ (system.jvm || {}).version }}</el-form-item>
            <el-form-item label="Processors">{{ (system.jvm || {}).processors }}</el-form-item>
            <el-form-item label="Arguments">
              <div class="arg" v-for="(arg, index) in ((system.jvm || {}).jmx || {}).commandLineArgs" :key="index">{{ arg }}</div>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-col>
    <el-col :lg="12" :sm="24">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="system">
          <template slot="title"><i class="el-icon-yasa-system"></i> System</template>
          <el-row align="center">
            <el-col :lg="12" :sm="24" align="center">
              <el-progress type="circle" :percentage="physicalMemoryPercentage" :color="progressStatus(physicalMemoryPercentage)"></el-progress>
              <div>Physical Memory</div>
            </el-col>
            <el-col :lg="12" :sm="24" align="center">
              <el-progress type="circle" :percentage="fileDescriptorPercentage" :color="progressStatus(fileDescriptorPercentage)"></el-progress>
              <div>File Descriptor Count</div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="jvm-memory">
          <template slot="title"><i class="el-icon-yasa-java"></i> JVM Memory</template>
          <el-row align="center">
            <el-col align="center">
              <el-progress type="circle" :percentage="jvmMemoryPercentage" :color="progressStatus(jvmMemoryPercentage)"></el-progress>
              <div>{{ ((this.system.jvm || {}).memory || {}).used }} / {{ ((this.system.jvm || {}).memory || {}).total }}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      activeNames: ['instance', 'versions', 'jvm', 'system', 'jvm-memory'],
      system: {}
    }
  },
  created () {
    this.$http.get('/solr/admin/info/system?wt=json').then(res => {
      this.system = res.data
    })
  },
  computed: {
    startTime () {
      const upTimeInSeconds = (((this.system.jvm || {}).jmx || {}).upTimeMS || 0) / 1000
      if (upTimeInSeconds < 60) {
        return this.$i18n.t('common.justNow')
      }
      if (upTimeInSeconds < 60 * 60) {
        return this.$i18n.t('common.nMinutesAgo', [Math.ceil(upTimeInSeconds / 60)])
      }
      if (upTimeInSeconds < 60 * 60 * 24) {
        return this.$i18n.t('common.nHoursAgo', [Math.ceil(upTimeInSeconds / 60 / 60)])
      }
      return this.$i18n.t('common.nDaysAgo', [Math.ceil(upTimeInSeconds / 60 / 60 / 24)])
    },
    physicalMemoryPercentage () {
      const free = (this.system.system || {}).freePhysicalMemorySize || 0
      const total = (this.system.system || {}).totalPhysicalMemorySize || 1
      return Math.round((total - free) / total * 10000) / 100
    },
    fileDescriptorPercentage () {
      const used = (this.system.system || {}).openFileDescriptorCount || 0
      const total = (this.system.system || {}).maxFileDescriptorCount || 1
      return Math.round(used / total * 10000) / 100
    },
    jvmMemoryPercentage () {
      const total = (((this.system.jvm || {}).memory || {}).raw || {}).total || 1
      const used = (((this.system.jvm || {}).memory || {}).raw || {}).used || 0
      return Math.round(used / total * 10000) / 100
    }
  },
  methods: {
    progressStatus (percentage) {
      if (percentage > 80) {
        return 'red'
      }
      return undefined
    }
  }
}
</script>

<style scoped>
#dashboard-root {
  padding: 24px;
}
.arg {
  font-family: Menlo, Monaco, Consolas monospace;
  font-size: 9pt;
  word-break: break-all;
}
.el-col {
  margin-top: 8px;
}
</style>
