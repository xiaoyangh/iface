<!--Created by 熊超超 on 2018/5/31.-->
<template>
  <div>
    <el-popover ref="popover" placement="bottom" trigger="click" v-model="show">
      <cc-table :rows="options.rows" :columns="options.columns" v-if="forceUpdate"
                :row-key="valueField"
                v-bind="$attrs"
                :multiSelect="multiSelect"
                :selected-rows.sync="selectedRows"
                :height="height"
                :current-row.sync="currentRow">
      </cc-table>
    </el-popover>
    <cc-input-tags v-popover:popover :placeholder="placeholder" v-model="getSelectTag" :label="labelField" @del="delTag" icon="table"/>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
  import CcInputTags from './CcInputTags.vue'

  @Component({components: {CcInputTags}})
  export default class CcInputTable extends Vue {
    /*vue-props*/
    @Prop({type: [String, Number, Array]}) public value: string | number | Array<string | number>
    @Prop() public options: any
    @Prop({default: 'id'}) public valueField: string
    @Prop({default: 'name'}) public labelField: string
    @Prop(Boolean) public multiSelect: boolean // 是否多选
    /*vue-vuex*/
    /*vue-data*/
    public show: boolean = false
    public selectedRows: any[] = []
    public currentRow: any = null
    public forceUpdate: boolean = true
    @Prop() public placeholder: string
    /*vue-compute*/
    get multi() {
      return this.multiSelect
    }
    get getSelectTag() {
      return (this.multi ? this.selectedRows : [this.currentRow]).filter((item: any) => item)
    }
    get height() {
      return this.options && this.options.rows && this.options.rows.length > 10 ? 400 : 'auto'
    }
    /*vue-watch*/
    @Watch('multi')
    public multiChange(val: boolean) {
      this.forceUpdate = false
      this.$nextTick(() => this.forceUpdate = true)
      setTimeout(() => {
        if (val && this.value && !Array.isArray(this.value)) {
          this.$emit('input', [this.value])
        }
        if (!val && this.value && Array.isArray(this.value)) {
          this.$emit('input', this.value[0])
        }
      }, 0)
    }
    @Watch('currentRow')
    public currentRowChange(val: any) {
      if (!this.multi && val) {
        this.show = false
        this.$emit('input', val[this.valueField])
      }
    }
    @Watch('options')
    public optionsChange() {
      this.init()
    }
    @Watch('selectedRows')
    public selectedRowsChange(val: any) {
      if (this.multi) {
        this.$emit('input', val.map((row: any) => row[this.valueField]))
      }
    }
    // 监听value是为了实现重置表单的时候，能更新表格
    @Watch('value')
    public valueChange(val: any, old: any) {
      if (this.multi) {
        if (typeof val !== typeof old || val.join(',') !== old.join(',')) {
          this.init()
        }
      } else {
        if (val !== old) {
          this.init()
        }
      }
    }
    /*vue-lifecycle*/
    public mounted() {
      this.init()
    }
    /*vue-method*/
    public init() {
      if (this.value && this.options && this.options.rows) {
        if (this.multi) {
          this.selectedRows = this.options.rows.filter((row: any) => (this.value as Array<string | number>).includes(row[this.valueField]))
        } else {
          this.currentRow = this.options.rows.find((row: any) => row[this.valueField] === this.value)
        }
      }
    }
    public delTag(tag: any) {
      if (this.multi) {
        const index = this.selectedRows.findIndex((row: any) => row[this.valueField] === tag[this.valueField])
        this.selectedRows.splice(index, 1)
      } else {
        this.currentRow = null
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>