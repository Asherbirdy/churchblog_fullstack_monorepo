1. Admin 幫 user 註冊帳號 (AdminRegisterUserController)
2. Admin 寄送 email 給 user去改密碼 和 驗證信箱 (SendVerificationEmailController, RegisterUserWithTempPasswordController)
3. User 改密碼後可以登入


測試方法:
資料庫user清空
先註冊admin帳號
登入admin帳號
幫user註冊user帳號
user登入
admin刪掉user帳號
