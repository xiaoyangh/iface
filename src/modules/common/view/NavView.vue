<!--Created by 熊超超 on 2018/4/25.-->
<template>
  <div flex="cross:center box:justify" class="nav p-h-10">
    <cc-icon name="menu" :rotate="menuExpand? 0 : 90" @click="toggleMenu" class="cp"/>
    <el-breadcrumb separator="/" class="m-l-10">
      <el-breadcrumb-item v-for="menu in nav" :key="menu.id">{{menu.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div flex="cross:center">
      <cc-icon name="user" size="18" class="m-r-5"/>
      <span>{{user.name}}</span>
      <span class="m-h-5">|</span>
      <span>{{user.roleString}}</span>
      <cc-icon name="logout" size="18" class="m-l-16 cp" @click="onLogout"/>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {State, Mutation, Getter, Action} from 'vuex-class'

  @Component
  export default class NavView extends Vue {
    /*vue-props*/
    /*vue-vuex*/
    @State((state: State) => state.common.menuExpand) public menuExpand: string
    @State((state: State) => state.common.menuTabs) public menuTabs: any[]
    @State((state: State) => state.common.selectedTab) public selectedTab: any
    @State((state: State) => state.common.user) public user: User
    @Getter public nav: Menu[]
    @Mutation public toggleMenu: () => void
    @Mutation('clearStore') public clearStore: () => void
    @Action public logout: () => Promise<ActionReturn>
    /*vue-data*/
    /*vue-compute*/
    /*vue-watch*/
    /*vue-lifecycle*/
    /*vue-method*/
    // 退出登录
    public async onLogout() {
      const {error} = await this.logout()
      if (!error) {
        this.$utils.message('退出登录成功')
        // 清除store里面缓存的数据
        this.clearStore()
        // clearStore里面会改动selected,将导致url跳转到一次'/'
        // 在下一个$nextTick跳转，保证会跳转到登录页
        this.$nextTick(() => this.$router.push('/login'))
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import "../../../assets/css/vars";
  .nav{
    background-color: $color-primary;
    height: 50px;
    color: $color-white;

    /deep/ .el-breadcrumb{
      font-size: 12px;
      .el-breadcrumb__inner{
        color: $color-white;
      }
      .el-breadcrumb__item:last-child .el-breadcrumb__inner{
        color: rgba($color-white, 0.6);
      }
    }
  }
</style>