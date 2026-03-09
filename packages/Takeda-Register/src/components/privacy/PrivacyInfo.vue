<script setup lang='ts'>
  import { NP, NLi, NA, NSpace, NUl, NText } from 'naive-ui'
  import Logo from '@/components/commons/Logo.vue'
</script>
  
<template>
  <div>
    <n-space
      align="start"
      justify="space-between"
      class="mb-3"
    >
      <span>
        Better Health, Brighter Future
      </span>
      <Logo />
    </n-space>
    <div>
      <n-p class="font-bold">
        台灣武田 LINE官方帳號隱私權聲明
      </n-p>
      <n-text
        underline
        italic
      >
        1.0版本
      </n-text>
      <n-p
        class="underline italic"
        style="margin-bottom: 6px;"
      >
        本隱私權聲明的生效日期： {{ '<2026.02.06>' }}
      </n-p>
      <n-p>
        您的隱私和個人資料的保護對我們很重要。本隱私權聲明（以下簡稱「聲明」）解釋了武田可能從您那裡收集的個人資料類型以及我們如何使用這些資料。如果您對武田的隱私權聲明有任何疑問，或希望行使與武田收集有關您的個人資料之權利，請按照下文「如何聯絡我們」的說明與我們聯絡。
      </n-p>
      <n-p style="margin-bottom: 10px;">
        武田是一家全球營運的公司集團。武田企業包括母公司武田藥品工業株式會社及其關係企業（統稱為   <span class="font-bold">
          「武田」
        </span>或  <span class="font-bold">
          「我們」
        </span>。本聲明適用於台灣武田藥品工業股份有限公司。 台灣武田LINE官方帳號，以及顯示或引用本聲明的其他武田服務和活動（統稱為      <span class="font-bold">
          「武田應用程式」
        </span>）。有關武田如何處理您的個人資料或更多資訊，請參閱我們的全球隱私權聲明，網址為 <n-a
          href="https://www.takeda.com/privacy-notice/"
          target="_blank"
          :theme-overrides="{
            aTextColor: '#0A0AFFFF',
          }"
        >
          網站隱私權聲明 | Takeda.com
        </n-a>。
      </n-p>
      <n-p class="font-bold">
        我們收集和使用的個人資料
      </n-p>
      <n-p>
        當您使用此應用程序時，我們將收集有關您的以下信息：
      </n-p>
      <n-ul>
        <n-li>
          <span class="font-bold">
            姓名和聯絡資訊：
          </span> 如果您自願向我們提供，我們可能會收集您的姓名、工作地址、通訊地址、聯絡資訊，包括您使用的電子郵件地址、電話號碼、LINE ID 和其他類似的聯絡資訊。
        </n-li>
        <n-li>
          <span class="font-bold">
            使用資訊：
          </span> 我們可能會收集有關您和您的裝置如何與我們服務互動之資訊，例如用於將您的電腦連接到網際網路的網際網路協定 （IP） 位址、登入資訊、瀏覽器類型和版本、時區設定、瀏覽器外掛程式類型和型號、作業系統和平台、有關您的線上流量和活動的資訊（例如：系統頁面回應時間;下載錯誤、部分頁面訪問時間、頁面互動資訊（例如：瀏覽、點擊），以及瀏覽或退出頁面的方法）。
        </n-li>
        <n-li>
          <span class="font-bold">
            關係和互動資訊：
          </span> 我們可能會收集有關與我們的互動和會議資訊，例如當您聯絡我們尋求資訊和支援時。
        </n-li>
        <n-li>
          <span class="font-bold">
            法律要求的資訊：
          </span> 我們可能會收集有關您的其他資訊，這些資訊與病患安全和不良事件有關，或法律要求且武田要求遵守的資訊。
        </n-li>
      </n-ul>
      <n-p class="font-bold">
        我們如何使用個人資料
      </n-p>
      <n-p style="margin-bottom: 10px;">
        本武田應用程式作為單一接觸點提供給您，以存取武田提供的疾病和產品相關資訊和服務。武田將使用您的註冊資訊在我們的客戶關係管理系統中建立Takeda ID。Takeda ID帳戶將使您能夠以單一帳號登入並體驗無縫登入不同的武田數位管道，而無需重複註冊不同平臺即可存取武田提供的服務資訊。
      </n-p>
      <n-p>
        為此，我們將出於以下目的處理您的個人資料：
      </n-p>
      <n-ul>
        <n-li>驗證您的身份;</n-li>
        <n-li>就您可能提交的任何請求或查詢與您溝通，並為您提供相關的支援或服務;</n-li>
        <n-li>需要時與您聯繫，為您提供重要資訊、所需通知和宣傳材料;</n-li>
        <n-li>向您發送管理資訊，例如，有關我們提供服務（變更及服務更新）的資訊;</n-li>
        <n-li>我們可能會在相關和適當時提供為您量身定制的產品和相關資訊，進而個人化您在使用武田應用程式時的體驗;</n-li>
        <n-li>出於我們的業務目的，例如數據分析、審計、欺詐監控和預防、開發新產品、加強、改進或修改我們的服務、識別使用偏好、確定我們促銷活動的有效性、進行調查以及運營和擴展我們的業務活動;</n-li>
        <n-li>更好地了解我們的產品和服務對您所帶來的幫助，追蹤和回應安全問題，並進一步開發和改進我們的 產品和服務;</n-li>
        <n-li>我們可能會與您聯繫以收集有關應用程式和我們活動的反饋;</n-li>
        <n-li>
          在我們認為必要或適當的情況下：（a） 根據適用法律，包括您居住國家/地區以外的法律;（b） 遵守法律程序;（c） 回應公共或政府機構（包括您居住國家/地區以外的機構）的要求;（d） 執行我們的條款和條件;（e） 保護我們或我們任何相關的公司營運;（f） 保護我們和/或我們的相關公司、您或其他人的權利、隱私、安全或財產;（g） 允許我們尋求可用的補救措施或限制我們可能遭受的損害。
        </n-li>
      </n-ul>
      <n-p>當武田處理您的個人資料時，我們將徵求您的同意（稱為「同意」），作為處理您個人資料的法律依據。請注意，如果您同意，您也可以隨時按照「如何聯絡我們」部分所述來聯絡我們行使您撤回同意的權力。</n-p>
      <n-p style="margin-bottom: 10px;">
        武田也可能在必須遵守法律義務時處理您的個人資料，例如，當處理您的資料是法律要求時，例如在某些國家/地區對與醫療保健專業人員的互動有透明度要求的情況下，或在發生與使用我們產品相關的不良事件時向衛生主管機關提供資訊。
      </n-p>
      <n-p class="font-bold">
        我們與誰共享個人資料
      </n-p>
      <n-p style="margin-bottom: 10px;">
        我們可能會與世界各地的服務提供者和業務合作夥伴分享您的資訊，並與我們合作以完成以下目的（例如履行服務、技術支援、外部顧問和外部顧問）。我們還可能與其他武田關係企業和子公司分享您的資訊。共享您的個人數據可能涉及傳輸到其他國家/地區。這些國家/地區的資料保護和隱私權法律可能無法提供與您的國家相同等級的保護。武田將採取保護措施，以充分保護與此類傳輸相關的個人資料。
      </n-p>
      <n-p class="font-bold">
        Takeda ID的使用和建立
      </n-p>
      <n-p>將您的 Line ID 與武田應用程式連結後，我們將建立一個Takeda ID，該 ID 是與您的個人資料連結的唯一識別碼。</n-p>
      <n-p>
        Takeda ID可用於對多個Takeda應用程式（即網站、行動應用程式等）進行身份驗證，以獲得單一登入體驗，並允許您對多個武田應用程式使用相同的憑證。 武田將收集您的姓名、電子郵件、LINE ID、國家/地區以及一些互動資訊來管理您的 LINE/ Takeda ID 帳戶。 武田應用程式將使用您的LINE ID來驗證您的身分、分析您與我們平台的互動情況，並實現上述目的。 武田應用程式將無法存取其他武田應用程式收集的任何其他資料。
      </n-p>
      <n-p>
        有關Takeda ID的更多詳細資訊，請點擊以下連結：
      </n-p>
      <n-p>
        條款與條件
      </n-p>
      <n-a
        href="https://accounts.takeda.com/privacy-notice/"
        target="_blank"
        :theme-overrides="{
          aTextColor: 'black',
        }"
      >
        https://accounts.takeda.com/privacy-notice/
      </n-a>
      <div style="margin-bottom: 10px;" />
      <n-p class="font-bold">
        我們會將您的個人資料保留多久？
      </n-p>
      <n-p style="margin-bottom: 10px;">
        只要您在我們的一個或多個武田應用程式中積極使用您的台灣武田LINE官方帳號/Takeda ID，我們就會保留您的個人資料。 儘管有上述規定，我們也可能在履行我們的服務或終止您與我們的關係或停止使用我們的應用程式後，將您的資料保留一段合理的期限，除非法律要求或允許更長的保留期限。
      </n-p>
      <n-p class="font-bold italic">
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
        </n-a>網絡表單與我們聯繫。如果您想對個人資料的處理方式進行客訴，您也有權聯絡您所在國家/地區的資料保
        護機構。
      </n-p>
      <n-p class="font-bold">
        如何聯絡我們：
      </n-p>
      <n-p>如果您對本隱私權聲明有任何疑問，請透過以下地址透過電子郵件與我們聯絡。</n-p>
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
        有關武田如何處理您的個人資料以及您與此處理相關的權利的更多詳細資訊，請參閱武田的隱私權聲明，網址為 <n-a
          href="https://www.takeda.com/"
          target="_blank"
          :theme-overrides="{
            aTextColor: '#0A0AFFFF',
          }"
        >
          www.takeda.com
        </n-a>
      </n-p>
    </div>
    <n-space
      justify="end"
      class="my-5"
    >
      <n-p>C-ANPROM/TW/CORP/0065 FEB2026</n-p>
    </n-space>
  </div>
</template>
  
<style scoped>
li {
  margin-left: 1rem;
}

.logo-header {
  padding: 1rem;
  margin: -1.5rem -1.5rem 1rem -1.5rem;
  color: white;
}

p {
  margin: 3px 0 3px 0;
}
</style>