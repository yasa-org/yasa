<template>
  <el-form :model="newCollectionFormData" ref="newCollectionForm" :rules="validateRules" label-width="30%">
    <el-form-item label="Name" prop="name">
      <el-input v-model.trim="newCollectionFormData.name" placeholder="Collection Name" clearable></el-input>
    </el-form-item>
    <el-form-item label="Num Shards" prop="numShards">
      <el-input-number v-model="newCollectionFormData.numShards" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="Router Name">
      <el-radio-group v-model="newCollectionFormData['router.name']">
        <el-radio-button label="compositeId"></el-radio-button>
        <el-radio-button label="implicit"></el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Replication Factor" prop="replicationFactor">
      <el-input-number v-model="newCollectionFormData.replicationFactor" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="Max Shards Per Node" prop="maxShardsPerNode">
      <el-input-number v-model="newCollectionFormData.maxShardsPerNode" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="Create Node Set" prop="createNodeSet">
      <el-input v-model="newCollectionFormData.createNodeSet" placeholder="comma-separated list of node_names" clearable></el-input>
    </el-form-item>
    <el-form-item label="Config Name" prop="configName">
      <el-select v-model="newCollectionFormData['collection.configName']" :value="newCollectionFormData['collection.configName']" :loading="loadingConfigSets" filterable>
        <el-option v-for="configSet in configSets" :key="configSet" :value="configSet" :label="configSet"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button>Cancel</el-button>
      <el-button type="primary" @click="submitForm" :loading="creatingCollection">Create</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: 'new-collection-form',
  computed: {
    ...mapState('management/collections/newCollection', ['configSets', 'loadingConfigSets', 'newCollectionFormData']),
    numShardsRequired () {
      return this.newCollectionFormData['router.name'] === 'compositeId'
    }
  },
  methods: {
    ...mapActions('management/collections/newCollection', ['loadConfigSets', 'doCreateCollection']),
    submitForm () {
      this.$refs['newCollectionForm'].validate((valid) => {
        if (!valid) {
          return
        }
        if (this.creatingCollection) return
        this.creatingCollection = true
        this.$http.get('/solr/admin/collections?action=CREATE', {
          params: this.newCollectionFormData
        }).then(() => {
          this.creatingCollection = false
          this.$emit('done')
        }, () => {
          this.creatingCollection = false
        })
      })
    }
  },
  created () {
    this.loadConfigSets()
  },
  data () {
    return {
      validateRules: {
        name: [{ required: true, message: 'Collection name is required', trigger: 'change' }],
        numShards: [{ required: this.numShardsRequired, type: 'number', message: 'numShards is required when router.name is compositeId.', trigger: 'change' }]
      },
      creatingCollection: false
    }
  }
}
</script>

<style scoped>

</style>
