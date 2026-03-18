export enum PublicRequestUrl {
  DevCheckIp = '/dev/check-ip',
  AccountAdminInit = '/account/adminInit',
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
  PageSetToOnlineScheduled = '/page/set-to-online-scheduled',
  PageCancelScheduled = '/page/cancel-scheduled',
  PageSetToOfflineScheduled = '/page/set-to-offline-scheduled',
  PageGoToPreviousHtml = '/page/go-to-previous-html',
  PageBeforeBuildAndDeploy = '/page/before-build-and-deploy',
  AccountAdminRegisterUser = '/account/adminRegisterUser',
  AccountDeleteUser = '/account/deleteUser',
  AccountSendVerificationEmail = '/account/sendVerificationEmail',
  AccountChangePasswordWithOTP = '/account/changePasswordWithOTP',
  AccountGetAllUser = '/account/getAllUser'
}
