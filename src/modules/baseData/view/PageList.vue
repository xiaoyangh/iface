<!--Created by 熊超超 on 2018/6/21.-->
<template>
  <div>
    <el-card shadow="never" class="p">
      <div slot="header" flex="cross:center">
        <span flex-box="1">{{pageTitle}}</span>
        <cc-button v-auth="'addPage'" icon="add" text="添加" @click="onAdd"/>
        <cc-button v-auth="'editPage'" icon="edit" text="修改" @click="onEdit"/>
        <cc-button v-auth="'delPage'" icon="delete" text="删除" @click="onDel"/>
      </div>
      <cc-table ref="table" :rows="rows" :columns="columns" v-loading="loading"
                @single-click="$emit('rowClick')"
                :selected-rows.sync="selectedRows"
                :current-row.sync="currentRow">
      </cc-table>
      <el-pagination class="m-t-16 a-c" background :layout="layout"
                     @current-change="pageNumChange" @size-change="pageSizeChange"
                     :page-size="pageSize" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import {Action} from 'vuex-class'
  import {BaseMixin, PageMixin} from '../../../assets/utils/mixins'
  import {MessageTypeEnum} from '../../../assets/utils/enuns'

  @Component({mixins: [BaseMixin, PageMixin]})
  export default class PageList extends Vue {
    /*vue-props*/
    /*vue-vuex*/
    @Action public searchPage: (params: {pageNum: number, pageSize: number}) => Promise<ActionReturn>
    @Action public requestUrl: (url: string) => Promise<ActionReturn>
    /*vue-data*/
    public columns: TableColumn[] = [
      {prop: 'pageName', label: '名称', width: '120px'},
      {prop: 'name', label: '实体对象', width: '100px'},
      {prop: 'type', label: '类型', width: '80px',
        formatter: (row: any, column: any, cellValue: number) => {
          return this.$c.PageTypeK[cellValue]
        },
      },
      {prop: 'pageDesc', label: '描述'},
    ]
    /*vue-compute*/
    /*vue-watch*/
    /*vue-lifecycle*/
    /*vue-method*/
    public async getData() {
      this.loading = true
      const {data} = await this.searchPage({pageNum: this.pageNum, pageSize: this.pageSize})
      this.loading = false
      if (data) {
        this.total = data.total
        this.rows = data.rows
      }
    }
    public onAdd() {
      this.$utils.toTab('/baseData/createCrud', '添加页面或表单')

    }
    public onEdit() {
      if (!this.currentRow) {
        this.$utils.message('请选择一行', MessageTypeEnum.warning)
        return
      }
      this.$utils.toTab('/baseData/createCrud?code=' + this.currentRow.pageCode, `修改${this.currentRow.pageName}`)
      // this.$router.push({name: 'createCrud', query: {id: this.currentRow.pageCode}})
    }
    public async onDel() {
      if (!this.currentRow) {
        this.$utils.message('请选择一行', MessageTypeEnum.warning)
        return
      }
      const re = await this.$utils.confirm('确定要删除这条数据吗？')
      if (re) {
        this.loading = true
        const{error} = await this.requestUrl('delPage/' + this.currentRow.pageCode)
        this.loading = false
        if (!error) {
          this.$utils.message('删除成功')
          this.getData()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>