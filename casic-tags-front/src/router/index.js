import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'workspace',
        component: () => import('@/views/dashboard'),
        meta: { title: '工作台', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/label',
    component: Layout,
    // redirect: '/datasource',
    name: 'label',
    meta: { title: '标签管理', icon: 'el-icon-folder' },
    children: [
      {
        path: 'sort',
        name: 'sort',
        component: () => import('@/views/label/sort/index'),
        meta: { title: '标签分类' }
      },
      {
        path: 'pellet',
        name: 'pellet',
        component: () => import('@/views/label/pellet/index'),
        meta: { title: '标签颗粒' }
      },
      {
        path: 'particleMap',
        name: 'particleMap',
        component: () => import('@/views/label/particle/index'),
        meta: { title: '颗粒图谱' }
      }
    ]
  },
  {
    path: '/block',
    component: Layout,
    // redirect: '/datasource',
    name: 'block',
    meta: { title: '块数据管理', icon: 'el-icon-data-line' },
    children: [
      {
        path: 'root',
        name: 'root',
        component: () => import('@/views/blockData/rzm/index'),
        meta: { title: '块数据根管理' }
      },
      {
        path: 'attribute',
        name: 'attribute',
        component: () => import('@/views/blockData/attribute/index'),
        meta: { title: '块数据属性管理' }
      },
      {
        path: 'first',
        name: 'first',
        component: () => import('@/views/blockData/oneLevel/index'),
        meta: { title: '一级块数据管理' }
      },
      {
        path: 'second',
        name: 'second',
        component: () => import('@/views/blockData/twoLevel/index'),
        meta: { title: '二级块数据管理' }
      },
      {
        path: 'third',
        name: 'third',
        component: () => import('@/views/blockData/threeLevel/index'),
        meta: { title: '三级块数据管理' }
      }
    ]
  },
  {
    path: '/graded',
    component: Layout,
    // redirect: '/datasource',
    name: 'graded',
    meta: { title: '分级管理', icon: 'el-icon-s-unfold' },
    children: [
      {
        path: 'definition',
        name: 'definition',
        component: () => import('@/views/graded/name/index'),
        meta: { title: '分级名称' }
      },
      {
        path: 'genre',
        name: 'genre',
        component: () => import('@/views/graded/genre/index'),
        meta: { title: '类别管理' }
      },
      {
        path: 'subclass',
        name: 'subclass',
        component: () => import('@/views/graded/subclass/index'),
        meta: { title: '子类管理' }
      }
    ]
  },
  {
    path: '/system-config',
    redirect: '/system-config/users',
    component: Layout,
    meta: { title: '系统设置', icon: 'el-icon-s-platform' },
    children: [
      {
        path: 'units',
        name: 'units',
        component: () => import('@/views/unitManage'),
        meta: { title: '单位管理' }
      },
      {
        path: 'depts',
        name: 'depts',
        component: () => import('@/views/deptManage'),
        meta: { title: '部门管理' }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/userManage'),
        meta: { title: '用户管理' }
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/views/roleManage'),
        meta: { title: '角色管理' }
      },
      {
        path: 'authorizations',
        name: 'authorizations',
        component: () => import('@/views/authManage'),
        meta: { title: '权限管理' }
      },
      {
        path: 'logs',
        name: 'logs',
        component: () => import('@/views/logManage'),
        meta: { title: '日志管理' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
