export enum PublicRequestUrl {
  DevCheckIp = '/dev/check-ip',
  AccountAdminInit = '/account/adminInit',
  AuthLogin = '/auth/login',
  AuthLoginSendOtp = '/auth/loginSendOtp',
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
  AuthSendVerificationEmail = '/auth/sendVerificationEmail',
  AuthChangePasswordWithOTP = '/auth/changePasswordWithOTP',
  AccountAdminRegisterUser = '/account/adminRegisterUser',
  AccountDeleteUser = '/account/deleteUser',
  AccountGetAllUser = '/account/getAllUser'
}
