/**
 * Created by 熊超超 on 2018/4/27.
 */
import store from '@g/store'
import { Message, MessageBox } from 'element-ui'
import Vue, {CreateElement} from 'vue'
const h: CreateElement = new Vue().$createElement
import Utils from './utils'
import router from '@g/router'

import {Route} from 'vue-router'
import {MessageType} from 'element-ui/types/message'


export class UiUtils extends Utils {
  // 消息框简单封装
  public message(message: string, type: boolean | MessageType = true) {
    if (typeof type === 'string') {
      Message({message, type: (type as MessageType)})
    } else {
      Message({message, type: type ? 'success' : 'error'})
    }
  }
// alert
  public alert(content: string, title = '提示信息', options: any) {
    return new Promise(((resolve) => {
      MessageBox.alert(content, title, {
        type: 'info',
        ...options,
      }).then(() => resolve(true)).catch(() => resolve(false))
    }))
  }

  public confirm(content: string, title = '确认操作', options?: any) {
    return new Promise(((resolve) => {
      MessageBox.confirm(content, title, {
        type: 'warning',
        ...options,
      }).then(() => resolve(true)).catch(() => resolve(false))
    }))
  }
  // 页面离开的时候，可以弹出提示
  public async beforeRouteLeave(to: Route, from: Route, next: any, content: string = '有未保存的数据，确定要离开吗？') {
    // session过期的情况，直接放行，不弹提示，这个时候回调到登录页面
    if (!store.state.common.user) {
      next()
    }
    const re = await this.confirm(content, '确定离开')
    if (re) {
      next()
    }
  }
// 消息框支持jsx
  public msgbox(option: MyElMessageBoxOptions) {
    if (option.render) {
      option.message = option.render(h)
      delete option.render
    }
    MessageBox(option)
  }

  public dialog(title: string, content: any, options: any = {}) {
    const dialog = {
      title,
      content,
      visible: true,
      options,
    }
    store.commit('updateDialog', dialog)
  }
  public hideDialog() {
    store.commit('hideDialog')
  }

  /**
   * 跳转到tab，左侧菜单和顶部标签之外的地方跳转页面
   * @param {string} url
   */

  public toTab(url: string, name?: string) {
    if (url === '/' || url === '') {
      store.commit('updateSelectedTab',  '0')
      return
    }
    const flatMenu: Menu[] = store.getters.flatMenu
    const menuTabs = store.state.common.menuTabs
    // 先根据url找到要跳转的菜单对象
    const menu: Menu = flatMenu.find((m: Menu) => m.url ===  url.split('?')[0]) as Menu
    if (menu) {
      // 判断菜单是否已经在tabs里面打开了
      const item = menuTabs.find((item: any) => item.key === menu.id)
      // 没有打开，要找到菜单的层级，加到menuTabs里面，然后再跳转
      if (!item) {
        const menus: Menu[] = [menu]
        if (menu.parentId) {
          const menuParent: Menu = flatMenu.find((item: any) => item.id === menu.parentId) as Menu
          menus.unshift(menuParent)
        }
        store.commit('updateTabs', {key: menu.id, url,  menus})
      } else {
        store.commit('updateTabUrl', {item, url})
      }
      store.commit('updateSelectedTab',  menu.id)
    } else {
      const noMenuTabsMap = store.state.common.noMenuTabsMap
      const noMenuTabsMapReverse = this.reverse(noMenuTabsMap)
      if (noMenuTabsMapReverse[url]) {
        store.commit('updateSelectedTab',  noMenuTabsMapReverse[url])
      } else {
        const key: string = Math.floor(Math.random() * 20130306) + ''
        store.commit('updateTabs', {key, url, menus: [{name, url}]})
        store.commit('updateSelectedTab',  key)
        noMenuTabsMap[key] = url
      }
    }
    // 跳转一下页面
    router.push(url)
  }
  public closeTab(url?: string) {
    store.commit('removeTab')
    if (url) {
      this.toTab(url)
    }
  }

  public hasAuth(binding: any): boolean {
    const resources = store.state.common.resources
    if (resources === 'all') {
      return true
    } else {
      return resources.includes(binding.value)
    }
  }

}

export default new UiUtils()
