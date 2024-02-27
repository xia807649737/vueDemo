const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  dict: state => state.dict.dict,
  appVersion:state => state.app.packageVersion, // 应用版本
  buildAuthor: state => state.app.buildAuthor, // 构建作者
  buildRevision: state => state.app.buildRevision, // 构建版本(commit id)
  buildTimestamp: state => state.app.buildTimestamp, // 构建时间
  env: state => state.app.env, // 构建环境
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  topbarRouters:state => state.permission.topbarRouters,
  defaultRoutes:state => state.permission.defaultRoutes,
  sidebarRouters:state => state.permission.sidebarRouters,
}
export default getters
