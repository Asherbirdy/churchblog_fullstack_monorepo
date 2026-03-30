
export enum PublicApiRoute {
  AuthLogin = '/auth/login',
  AuthLogout = '/auth/logout',
  AuthCheckLogin = '/auth/checkValidToken',

  // ** Account API 路由
  AccountAdminInit = '/account/adminInit',

  // ** Page API 路由
  PageOnline = '/page/online',
  PageRoute = '/page/route',
  PageBeforeBuildAndDeploy = '/page/before-build-and-deploy',
}

export enum PrivateApiRoute {
  // ** Auth API 路由
  AuthSendOTP = '/auth/sendOTP',
  AuthRegister = '/auth/userRegister',

  // ** Account API 路由
  AccountAdminRegister = '/account/adminRegisterUser',
  AccountDeleteUser = '/account/deleteUser',
  AccountGetAllUser = '/account/getAllUser',
  AccountEditAccess = '/account/editAccess',

  // ** User API 路由
  UserShowMe = '/user/showMe',

  // ** ChatTopic API 路由
  ChatTopic = '/chat-topic',

  // ** ChatCard API 路由
  ChatCard = '/chat-card',

  // ** File API 路由
  File = '/file',

  // ** Sheet API 路由
  Sheet = '/sheet',
  SheetGetFromFile = '/sheet/file',

  // ** Website API 路由
  WebsiteCreate = '/website/create',
  WebsiteGetAll = '/website/all',
  WebsiteDelete = '/website/delete',
  WebsiteEditSheet = '/website/edit-sheet',
  WebsiteEditDetail = '/website/edit-detail',

  // ** Page API 路由
  Page = '/page', // create, getAll
  PageInfo = '/page/info', // getOne
  PageUpdate = '/page/update',
  PageEditedHtml = '/page/edited-html',
  PageSetToOnlineScheduled = '/page/set-to-online-scheduled',
  PageCancelScheduled = '/page/cancel-scheduled',
  PageSetToOfflineScheduled = '/page/set-to-offline-scheduled',
  PageGoToPreviousHtml = '/page/go-to-previous-html',
  PageReset = '/page/reset',
}
