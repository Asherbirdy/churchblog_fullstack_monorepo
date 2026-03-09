<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NForm, NFormItem, NCheckboxGroup, NCheckbox, NSpace } from 'naive-ui'

const emit = defineEmits<{
  'is-form-complete': [value: boolean]
}>()

const formRef = ref()
const formValue = ref({
  agreements: ['agree-privacy'] as string[]
})

// * 用於判斷 註冊 是否 打開
const isAgreed = computed(() => {
  return formValue.value.agreements.length > 0
})

watch(() => formValue.value.agreements,
  () => {
    emit('is-form-complete', isAgreed.value)
  },
  { immediate: true }
)

const rules = {
  agreements: [
    { required: true, message: '請同意個人資料蒐集告知事項與同意', trigger: 'change' }
  ]
}
</script>

<template>
  <div class="flex flex-col">
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      class="px-4 border-t border-gray-300 mb-5"
    >
      <n-form-item
        path="agreements"
        :show-feedback="false"
        label="個人資料蒐集告知事項與同意"
      >
        <n-space vertical>
          <n-p>
            台灣武田（Takeda）基於您加入武田官方 LINE OA 後提供產品資訊、教育內容及活動通知之目的，將蒐集、處理及利用與您公司身分識別及聯繫相關之個人資料（例如：姓名、任職單位/部門、公司電子郵件、LINE ID 及其他必要之聯絡資訊等；該等資訊可能由您提供或由武田透過 Entra ID／公司帳號系統取得），以便向您提供相關訊息並與您聯繫。
            <br>
            除了在上述目的範圍內使用您的個人資料外，Takeda不會將您在本平台之使用行為用於其他用途(例如員工績效考核或個人監控)，除非因法令遵循、資訊安全或內部稽核之必要而於最小必要範圍內處理。您得依個人資料保護法，就您的個人資料行使查詢或請求閱覽、製給複製本、補充或更正、停止蒐集/處理/利用及刪除等權利；行使方式與其他詳細內容，請參閱下方隱私權聲明以閱讀完整告知內容。武田官方 LINE OA 所提供之一切資訊，僅限於教育目的使用，不代替專業醫療人員的獨立專業醫療判斷，且不應被視為對任何人提供之醫療建議。本 LINE OA 所提供之內容僅供參考，武田不保證所有內容在任何時間點均完全正確、完整或最新；如需做出任何決策，請尋求專業醫療人員之建議。不得散佈或未經授權而重製武田官方LINE OA所提供之內容或資訊。
          </n-p>
          <n-checkbox-group v-model:value="formValue.agreements">
            <n-checkbox value="agree-privacy">
              勾選同意選項，即表示您確認自己為武田現任員工，並且已閱讀、理解並同意台灣武田依前述目的蒐集、處理及利用您的個人資料。台灣武田將依公司內部之帳號與權限管理流程（包括但不限於人資或相關單位之在職/離職或權限變更通知）定期檢視使用權限，並移除離職或不再具備使用權限者之存取權限。
            </n-checkbox>
          </n-checkbox-group>
        </n-space>
      </n-form-item>
    </n-form>
    <n-space justify="end">
      <n-p>C-ANPROM/TW/CORP/0067 FEB2026</n-p>
    </n-space>
  </div>
</template>
