<script setup lang='ts'>
    import { NP, NLi, NSpace, NUl, NA} from 'naive-ui'
    import Logo from '@/components/commons/Logo.vue'
</script>
  
<template>
  <div>
    <n-space
      align="center"
      justify="space-between"
    >
      <span>
        Better Health, Brighter Future
      </span>
      <div>
        <Logo />
      </div>
    </n-space>
    <div>
      <n-p class="font-bold">
        台灣武田 LINE官方帳號隱私權聲明
      </n-p>
      <n-p class="underline italic">
        1.0版本
      </n-p>
      <n-p
        class="underline italic"
        style="margin-bottom: 10px;"
      >
        本隱私聲明生效日期： {{ '<2026.02.06>' }}
      </n-p>
      <n-p>您的隱私與個人資料保護對我們來說非常重要。本隱私聲明說明武田可能從您處收集的個人資料類型及使用方式。</n-p>
      <n-p style="margin-bottom: 10px;">
        武田是一個全球營運的公司集團。武田企業包括母公司武田製藥株式會社及其關聯實體（統稱「武田」或「我們」）。若您聯絡我們報告問題、提出申訴或以其他方式與我們溝通，我們會收集資訊以解決您的疑問。如需與您當地合作夥伴相關的聯絡資訊，請參閱武田官方網站 <n-a
          href="https://www.takeda.com/who-we-are/company-information/worldwide-offices/"
          target="_blank"
          :theme-overrides="{
            aTextColor: 'black',
          }"
        >
          https://www.takeda.com/who-we-are/company-information/worldwide-offices/
        </n-a>。
      </n-p>
      <n-p class="font-bold">
        我們收集和使用的個人資料：
      </n-p>
      <n-p>
        當您使用此應用程式時，我們將收集有關您的以下資訊：
      </n-p>
      <n-ul>
        <n-li>
          <span class="font-bold">
            姓名和聯絡資訊：
          </span> 此 LINE官方帳號提供給您武田疾病和產品相關資訊和服務。 為此，我們可能會收集、使用、儲存及揭露您的資訊，包括您使用的電子郵件地址、電話號碼、LINE ID 和其他類似的聯絡資訊。 
        </n-li>
        <n-li>
          <span class="font-bold">
            使用資訊：
          </span>當您造訪本應用程式時，我們可能會收集有關您和您的裝置如何與我們服務互動之資訊，例如用於將您的電腦連接到網際網路的網際網路協定 （IP） 位址。登入資訊、瀏覽器類型和版本、時區設定、瀏覽器外掛程式類型和型號、作業系統和平台：有關您的線上流量和活動的資訊（例如：系統頁面回應時間;下載錯誤、部分頁面訪問時間、頁面互動資訊（例如：滾動、點擊），以及瀏覽或退出頁面的方法）。
        </n-li>
        <n-li>
          <span class="font-bold">
            關係和互動資訊：
          </span>我們可能會收集有關與我們的互動和會議資訊，例如當您聯絡我們尋求資訊和支援時。我們可能會在提供服務所必要的範圍內，將與您互動或活動報名相關之必要資訊提供予受我們委託之服務供應商或活動承辦單位，以完成報名、通知、技術支援或活動執行；該等第三方均應依契約負保密義務並僅得於委託目的範圍內處理資料。
        </n-li>
        <n-li>
          <span class="font-bold">
            法律要求的資訊：
          </span>我們可能會收集有關您的其他資訊，這些資訊與病患安全和不良事件有關，或法律要求且武田要求遵守的資訊。
        </n-li>
      </n-ul>
      <n-p class="font-bold">
        我們如何使用個人資料：
      </n-p>
      <n-p>本應用程式作為單一接觸點提供給您，以存取武田提供的疾病和產品相關資訊和服務。武田將使用您的註冊資訊在我們的客戶關係管理系統中透過Entra ID進行身分驗證。Entra ID帳戶將使您能夠以單一帳號登入並體驗無縫登入不同的武田數位管道，而無需重複註冊不同平臺即可存取武田提供的服務資訊。 </n-p>
      <n-p>
        為此，我們將出於以下目的處理您的個人資料：
      </n-p>
      <n-ul>
        <n-li>驗證您的身份; </n-li>
        <n-li>就您可能提交的任何請求或查詢與您溝通，並為您提供相關的支援或服務;</n-li>
        <n-li>不時與您聯繫，為您提供重要資訊、所需通知和宣傳材料;</n-li>
        <n-li>向您發送管理資訊，例如，有關我們提供服務（變更）的資訊;</n-li>
        <n-li>我們可能會在相關和適當時提供為您量身定制的產品和相關資訊，進而個人化您在使用武田應用程式時的體驗; </n-li>
        <n-li>出於我們的業務目的，例如數據分析、審計、欺詐監控和預防、開發新產品、加強、改進或修改我們的服務、識別使用偏好、確定我們促銷活動的有效性、進行調查以及運營和擴展我們的業務活動; </n-li>
        <n-li>更好地了解我們的產品和服務對您所帶來的幫助，追蹤和回應安全問題，並進一步開發和改進我們的產品和服務; </n-li>
        <n-li>我們可能會與您聯繫以收集有關應用程式和我們活動的反饋;</n-li>
        <n-li>在我們認為必要或適當的情況下：（a） 根據適用法律，包括您居住國家/地區以外的法律;（b） 遵守法律程序;（c） 回應公共或政府機構（包括您居住國家/地區以外的機構）的要求;（d） 執行我們的條款和條件;（e） 保護我們或我們任何相關的公司營運;（f） 保護我們和/或我們的相關公司、您或其他人的權利、隱私、安全或財產;（g） 允許我們尋求可用的補救措施或限制我們可能遭受的損害。</n-li>
      </n-ul>
      <n-p>當武田處理您的個人資料時，我們將徵求您的同意（稱為「同意」），作為處理您個人資料的法律依據。請注意，如果您同意，您也可以隨時按照「如何聯絡我們」部分所述來聯絡我們行使您撤回同意的權力。</n-p>
      <n-p style="margin-bottom: 10px;">
        武田也可能在必須遵守法律義務時處理您的個人資料，例如，當處理您的資料是法律要求時，例如在某些國家/地區對與醫療保健專業人員的互動有透明度要求的情況下，或在發生與使用我們產品相關的不良事件時向衛生主管機關提供資訊。
      </n-p>
      <n-p class="font-bold">
        我們與誰共享個人資料：
      </n-p>
      <n-p>我們可能會與世界各地的服務提供者和業務合作夥伴分享您的資訊，並與我們合作以完成以下目的（例如履行服務、技術支援、外部顧問和外部顧問）。我們還可能與其他武田附屬公司和子公司分享您的資訊。共享您的個人數據可能涉及傳輸到其他國家/地區。這些國家/地區的資料保護和隱私權法律可能無法提供與您的國家相同等級的保護。武田將採取保護措施，以充分保護與此類傳輸相關的個人資料。</n-p>
      <n-p>
        武田使用第三方服務 Authenticator 來管理你在本應用程式LINE帳戶 。欲了解更多關於 Authenticator及其個人資料處理的資訊，請參見  <n-a
          href="https://www.microsoft.com/en-us/privacy/privacystatement"
          target="_blank"
          :theme-overrides="{
            aTextColor: '#0A0AFFFF',
          }"
        >
          https://www.microsoft.com/en-us/privacy/privacystatement
        </n-a>。只要您仍在使用  Authenticator使用我們的 LINE 應用程式，我們都會保留您的個人資料。
      </n-p>
      <n-p style="margin-bottom: 10px;"> 
        台灣武田將依內部管理及人資相關通知定期檢視使用權限，並移除離職或不再具備使用權限者之存取權限。
      </n-p>
      <n-p class="font-bold">
        條款與條件：
      </n-p>
      <n-a
        href="https://accounts.takeda.com/privacy-notice/"
        target="_blank"
        :theme-overrides="{
          aTextColor: '#0A0AFFFF',
        }"
      >
        https://accounts.takeda.com/privacy-notice/
      </n-a>
      <div style="margin-bottom: 10px;" />
      <n-p class="font-bold">
        我們會將您的個人資料保留多久？ 
      </n-p>
      <n-p style="margin-bottom: 10px;">
        只要您在我們的一個或多個武田應用程式中積極使用您的台灣武田LINE官方帳號，我們就會保留您的個人資料。儘管有上述規定，我們也可能在履行我們的服務或終止您與我們的關係或停止使用我們的應用程式後，將您的資料保留一段合理的期限，除非法律要求或允許更長的保留期限。
      </n-p>
      <n-p class="font-bold">
        我的資料主體權利是什麼？
      </n-p>
      <n-p style="margin-bottom: 10px;">
        您有權要求存取、更正和刪除您的個人資料 或限制其使用。如果您想行使您的個人權利，請訪問我們的 <n-a
          href="https://privacyportal.onetrust.com/webform/ccbe7f52-9dc0-4f13-9038-2289ae6e6a3d/f4f875cc-f477-43fc-bc1c-ba2f115e339e"
          target="_blank"
          :theme-overrides="{
            aTextColor: '#0A0AFFFF',
          }"
        >
          個人權利
        </n-a>網絡表單與我們聯繫。如果您想對個人資料的處理方式進行客訴，您也有權聯絡您所在國家/地區的資料保護機構。
      </n-p>
      <n-p class="font-bold">
        聯絡我們：
      </n-p>
      <n-p>如果您對本隱私聲明有任何疑問，請透過以下電子郵件與我們聯繫。 </n-p>
      <n-p>
        電子郵件地址： <n-a
          href="mailto:privacyoffice@takeda.com"
          :theme-overrides="{
            aTextColor: '#0A0AFFFF',
          }"
        >
          privacyoffice@takeda.com
        </n-a>
      </n-p>
      <n-p>
        欲了解武田如何處理您的個人資料及相關權利，請參閱武田的隱私權聲明 
        <n-a
          href="https://www.takeda.com/privacy-notice/"
          target="_blank"
          :theme-overrides="{
            aTextColor: '#0A0AFFFF',
          }"
        >
          https://www.takeda.com/privacy-notice/
        </n-a>
      </n-p>

      <n-space justify="end">
        <n-p>C-ANPROM/TW/CORP/0066 FEB2026</n-p>
      </n-space>
    </div>
  </div>
</template>
<style scoped>
p {
  margin: 3px 0 3px 0;
}
</style>