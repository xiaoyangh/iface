<!--Created by 熊超超 on 2018/6/8.-->
<template>
  <div v-loading="loading" class="crud-view">
    <div v-for="(item, index) in items" :key="index" flex="cross:center" class="item">
      <div class="label">{{item.label}}</div>
      <div class="value">{{item.value}}</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
  import {Action} from 'vuex-class'
  import CrudUtils from '@utils/crudUtils.tsx'

  @Component
  export default class CcCrudView extends Vue {
    /*vue-props*/
    @Prop() public data: any
    @Prop() public fields: any[]
    @Prop() public url: string
    /*vue-vuex*/
    @Action('requestUrl') public requestUrl: (url: string) => Promise<ActionReturn>
    /*vue-data*/
    public mData: any = this.data
    public loading: boolean = false
    /*vue-compute*/
    get items() {
      return this.fields.filter((field: any) => this.mData[field.prop]).map((field: any) => {
        const item = {label: field.label, value: this.data[field.prop]}
        if (field.formatFun) {
          const key = field.formatFun.replace('Render', 'Format')
          if (CrudUtils[key]) {
            console.log(CrudUtils[key])
            item.value = CrudUtils[key].format(null, null, item.value)
          }
        }
        return item
      })
    }
    /*vue-watch*/
    @Watch('url', {immediate: true})
    public urlChange(val: string) {
      if (val) {
        this.initModel()
      }
    }
    @Watch('data')
    public dataChange(val: any) {
      this.mData = val
    }
    /*vue-lifecycle*/
    /*vue-method*/
    // 初始化model。用于更新表单从服务端获取完整数据
    public async initModel() {
      this.loading = true
      const {data} = await this.requestUrl(this.url)
      this.loading = false
      if (data) {
        this.mData = data
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/vars";
  .crud-view{
    border: 1px solid $border-color;
    border-bottom: 0;
    .item{
      border-bottom: 1px solid $border-color;
    }
    .label{
      padding: 6px 10px 6px 0;
      background-color: #f7f7f7;
      font-weight: bold;
      width: 100px;
      text-align: right;
      border-right: 1px solid $border-color;
    }
    .value{
      padding-left: 10px;
    }
  }
</style>