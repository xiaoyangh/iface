<!--Created by 熊超超 on 2018/6/7.-->
<template>
  <el-checkbox-group v-model="model" v-bind="$attrs" v-if="Array.isArray(options)">
    <template v-if="type === 'checkbox'">
      <el-checkbox v-bind="option" :label="option.value" name="name" :key="option.value" v-for="option in options">{{option.label}}</el-checkbox>
    </template>
    <template v-else>
      <el-checkbox-button v-bind="option" :label="option.value" name="name" :key="option.value" v-for="option in options">{{option.label}}</el-checkbox-button>
    </template>
  </el-checkbox-group>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

  @Component
  export default class CcCheckBoxGroup extends Vue {
    /*vue-props*/
    @Prop(Array) public value: any | any[]
    @Prop([Array, String]) public options: any[] | string
    @Prop() public type: string
    /*vue-vuex*/
    /*vue-data*/
    public model: any[] = this.value || []
    /*vue-compute*/
    /*vue-watch*/
    @Watch('value')
    public valueChange(val: any) {
      this.model = val || []
    }
    @Watch('model')
    public modelChange(val: any[]) {
      this.$emit('input', val)
    }
    /*vue-lifecycle*/
    /*vue-method*/
  }
</script>

<style lang="scss" scoped>
</style>