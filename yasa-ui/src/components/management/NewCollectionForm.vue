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
      <el-input
        v-model="newCollectionFormData.createNodeSet"
        placeholder="comma-separated list of node_names"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="Config Name" prop="configName">
      <el-select
        v-model="newCollectionFormData['collection.configName']"
        :value="newCollectionFormData['collection.configName']"
        :loading="loadingConfigSets"
        filterable
      >
        <el-option v-for="configSet in configSets" :key="configSet" :value="configSet" :label="configSet"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button>Cancel</el-button>
      <el-button type="primary" @click="submitForm" :loading="creatingCollection">Create</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { ElForm } from 'element-ui/types/form';
import { CollectionForm } from '@service/solr/collections';

const Store = namespace('management/collections');

@Component
export default class NewCollectionForm extends Vue {
  private creatingCollection = false;

  @Store.State private configSets!: string[];
  @Store.State private loadingConfigSets!: boolean;
  @Store.State private newCollectionFormData!: CollectionForm;

  @Store.Action private loadConfigSets!: () => void;

  created() {
    this.loadConfigSets();
  }

  private get numShardsRequired(): boolean {
    return this.newCollectionFormData && this.newCollectionFormData['router.name'] === 'compositeId';
  }

  private get validateRules() {
    return {
      name: [
        {
          required: true,
          message: 'Collection name is required',
          trigger: 'change',
        },
      ],
      numShards: [
        {
          required: this.numShardsRequired,
          type: 'number',
          message: 'numShards is required when router.name is compositeId.',
          trigger: 'change',
        },
      ],
    };
  }

  private submitForm() {
    (this.$refs.newCollectionForm as ElForm).validate((valid) => {
      if (!valid) {
        return;
      }
      if (this.creatingCollection) return;
      this.creatingCollection = true;
      this.$service.solr.collections.create(this.newCollectionFormData).then(
        () => {
          this.creatingCollection = false;
          this.$emit('done');
        },
        () => {
          this.creatingCollection = false;
        },
      );
    });
  }
}
</script>

<style scoped></style>
