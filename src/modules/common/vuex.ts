import { MutationTree, ActionTree, ActionContext, GetterTree } from 'vuex'
import * as utils from '@utils/utils'
import api from '@g/api'

const state: CommonState = {
  menus: [], // 左侧菜单
  resources: [], // 资源权限
  menuExpand: true, // 左侧菜单是否展开
  menuTabs: [{key: '0', menus: [{id: '0', name: '首页', url: '/', noClose: true}]}], // tabs
  selectedTab: '0', // 当前激活的tab
  outsideDialog: {}, // 外部dialog弹窗
  insideDialog: {}, // 内部dialog弹窗
  user: {},
  optionsCache: {},
}
const getters: GetterTree<any, any> = {
  // 面包屑导航对象
  nav(state: CommonState): Menu[] {
    const item = state.menuTabs.find((item: any) => item.key === state.selectedTab)
    return item ? item.menus : []
  },
  // dialog弹窗
  dialog: (state: CommonState) => (inside: boolean) => {
    return inside ? state.insideDialog : state.outsideDialog
  },
  // 打平的菜单，只有一个层级
  flatMenu(state: CommonState): Menu[] {
    return utils.flatObject(state.menus as Menu[])
  },
}
const mutations: MutationTree<any> = {
  // 切换左边菜单的大小
  toggleMenu(state: CommonState): void {
    state.menuExpand = !state.menuExpand
  },
  // 更新tab页
  updateTabs(state: CommonState, params: {key: string, menus: Menu[]}): void {
    if (params.key) {
      state.menuTabs.push(params)
    }
  },
  // 更新当前选择的tab
  updateSelectedTab(state: CommonState, key: string): void {
     if (key) {
       state.selectedTab = key
     }
  },
  // 关闭tab
  removeTab(state: CommonState, key: string): void {
    // 从menuTabs里面删除tab
    const index = state.menuTabs.findIndex((o: any) => o.key === key)
    if (index >= 0) {
      state.menuTabs.splice(index, 1)
    }
    // 如果删除的是当前激活的，要重新激活一个标签
    // 暂定激活前一个
    if (key === state.selectedTab) {
      state.selectedTab = state.menuTabs[index - 1].key
    }
  },
  // 更新Dialog弹窗
  updateDialog(state: CommonState, dialog: any): void {
    if (state.outsideDialog.visible) {
      state.insideDialog = dialog
    } else {
      state.outsideDialog = dialog
    }
  },
  // 关闭Dialog弹窗
  hideDialog(state: CommonState): void {
    if (state.insideDialog.visible) {
      state.insideDialog = {}
    } else {
      state.outsideDialog = {}
    }
  },
  // 登录后，设置一些用户信息到store
  updateUser(state: CommonState, data: any): void {
    state.user = data.user
    state.menus = data.auth.menus
    state.resources = data.auth.resources
  },
  // 清除Store里面的用户信息
  clearStore(state: CommonState): void {
    state.menus = []
    state.menuTabs = [{key: '0', menus: [{id: '0', name: '首页', url: '/', noClose: true}]}]
    state.selectedTab = ''
    state.user = {}
  },
}


const actions: ActionTree<any, any> = {
  // 获取crud的json数据
  getCrud(context: ActionContext<CommonState, State>, id: number): Promise<ActionReturn> {
    return api.getCrud(id)
  },
  // 表单的按钮事件，主要是搜索和保存
  formAction(context: ActionContext<CommonState, State>, params: {url: string, params: any}): Promise<ActionReturn> {
    return api.formAction(params.url, params.params)
  },
  // 获取表单控件的选择项，下拉、单选、多选等
  async getOptions(context: ActionContext<CommonState, State>, url: string): Promise<any> {
    if (context.state.optionsCache[url]) {
      return context.state.optionsCache[url]
    } else {
      const {data} = await api.getOptions(url)
      if (data) {
        // 缓存
        context.state.optionsCache[url] = data
        return data
      }
      return null
    }
  },
  requestUrl(context: ActionContext<SystemState, State>, url: string): Promise<ActionReturn> {
    return api.requestUrl(url)
  },
}

export default {state, getters, mutations, actions}
