export enum PublicRequestUrl {
  DevCheckIp = '/dev/check-ip',
  AuthRegister = '/auth/userRegister',
  AuthLogin = '/auth/login',
  PageRoute = '/page/route'
}

export enum UserRequestUrl {
  AuthLogout = '/auth/logout',
  AuthRefreshToken = '/auth/refreshToken',
  AuthCheckValidToken = '/auth/checkValidToken',
  UserShowMe = '/user/showMe',
  Page = '/page',
  PageInfo = '/page/info',
  PageUpdate = '/page/update',
  PageOnline = '/page/online',
  PageEditedHtml = '/page/edited-html',
  PageScheduled = '/page/scheduled',
  PageCancelScheduled = '/page/cancel-scheduled',
  PageSetToOffline = '/page/set-to-offline',
  PageGoToPreviousHtml = '/page/go-to-previous-html',
  PageBeforeBuildAndDeploy = '/page/before-build-and-deploy'
}
