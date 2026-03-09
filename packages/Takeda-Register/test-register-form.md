使用chrome-devtools做E2E測試

訪問：https://uat-takeda-lab.riversoft.com.tw/bot-register ，如果已經在訪問頁就不需要重新訪問。

測試前條件：
1. 確定 不是在 Line 登入 頁面，若在line 登入頁面 暫停測試
2. 確定 頁面是否有vconsole，若沒有直接暫停測試，請使用者手動點擊標題文字「註冊」三下(mcp的點擊叫不出vconsole)，並且在終端機出現選項「繼續測試」和「取消測試」，讓使用者使否點擊後繼續測試
3. 將視窗拉到最大

-- FORM 值測試 --
測試一：醫療機構選擇「醫療院所」時的代碼判斷
1. 醫療機構 的 radio 點擊 「醫療院所」，並在 input輸入 國泰醫療財團法人汐止國泰綜合醫院
2. 點擊標題文字「註冊」一下並顯示 state.form 的值 在vconsole中
驗證：去 vconsole 查看 state.form.hcpUser.verifiedHospitalName 的值是否是 TW-EXT-HCO-12210001 代碼類型(要點擊展開看) 驗證完成 點擊 vconsole clear 然後點擊 vconsole 的 hide

測試二：醫療機構選擇「其他」時的輸入值
1. 醫療機構 的 radio 點擊 「其他」，並在 input輸入 隨意醫院
2. 點擊標題文字「註冊」一下並顯示 state.form 的值 在vconsole中
驗證：去 vconsole 查看 state.form.hcpUser.verifiedHospitalName 的值是否是 隨意醫院(要點擊展開看) 驗證完成 點擊 vconsole clear 然後點擊 vconsole 的 hide

測試三：科別選擇「科別」時的代碼判斷
1. 醫療科別 的 radio 點擊 「科別」，並在 input輸入 心臟內科
2. 點擊標題文字「註冊」一下並顯示 state.form 的值 在vconsole中
驗證：去 vconsole 查看 state.form.hcpUser.verifiedSpecialty 的值是否是 "CARM" 代碼類型(要點擊展開看) 驗證完成 點擊 vconsole clear 然後點擊 vconsole 的 hide

測試四：科別選擇「其他」時的輸入值
1. 醫療科別 的 radio 點擊 「其他」，並在 input輸入 隨意科別
2. 點擊標題文字「註冊」一下並顯示 state.form 的值 在vconsole中
驗證：去 vconsole 查看 state.form.hcpUser.verifiedSpecialty 的值是否是 "隨意科別"(要點擊展開看) 驗證完成 點擊 vconsole clear 然後點擊 vconsole 的 hide

測試五： 醫療院所類別 醫院
1. 醫療院所類別 點擊「醫院」
驗證： 去 vconsole 查看 state.form.hcpUser.sector 的值是否是 "HP" (要點擊展開看) 驗證完成 點擊 vconsole clear 然後點擊 vconsole 的 hide

測試六： 醫療院所類別 診所
1. 醫療院所類別 點擊「診所」
驗證： 去 vconsole 查看 state.form.hcpUser.sector 的值是否是 "GP" (要點擊展開看) 驗證完成 點擊 vconsole clear 然後點擊 vconsole 的 hide

測試七： 醫療院所類別 藥局
1. 醫療院所類別 點擊「藥局」
驗證： 去 vconsole 查看 state.form.hcpUser.sector 的值是否是 "DS" (要點擊展開看) 驗證完成 點擊 vconsole clear 然後點擊 vconsole 的 hide

-- Input 提示測試 --
測試一：醫療機構輸入無效名稱時的提示
1. 醫療機構 的 radio 點擊 「醫療院所」，並在 input輸入 泰醫療財團法人汐止國泰綜合醫院
驗證：點擊空白處觸發input validate，畫面看使否 顯示 Input Error 提示 （請輸入一個醫療機構） 因為input沒有這個選項

測試二：科別輸入無效名稱時的提示
1. 醫療科別 的 radio 點擊 「科別」，並在 input輸入 隨意科別，然後點擊空白處
驗證：點擊空白處觸發input validate，畫面看使否

-- 重新訪問  --
測試一：
1. 重新訪問頁面
驗證：原有資料要存在
