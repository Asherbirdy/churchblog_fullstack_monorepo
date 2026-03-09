<route lang="yaml">
  name: 'Index'
</route>

<script setup lang='ts'>
/*
  業務邏輯：
*/
import { useWindowSize } from '@vueuse/core'
import axios from 'axios'
import { NButton, NH2, NLayoutContent, NLayoutHeader, NModal, NP, NResult, NSpace, useMessage, NA, NDrawer, NDrawerContent } from 'naive-ui'
import { buildMicrosoftOAuthUrl, urlFunc } from '@/utils'
import Vue3Signature from 'vue3-signature'
import HCPRegisterForm from '@/components/HCPRegisterForm.vue'
import TakedaRegisterForm from '@/components/TakedaRegisterForm.vue'
import PrivacyInfo from '@/components/privacy/PrivacyInfo.vue'
import InternalPrivacyInfo from '@/components/privacy/InternalPrivacyInfo.vue'
import { LocationEnum, Role } from '@/enums'
import { useAuthApi } from '@/hooks'
import { useSheetApi } from '@/hooks/apis/useSheetApi'
import type {
  HCPFormData,
  RegisterState,
  TakedaFormData, Vue3SignatureType
} from '@/types'
import { dataURLtoBlob, rotateAndConvertToBlob } from '@/utils'
// const { ProfileUserId, LIFF } = useLiff()

import { useLiff } from '@lineoa-monorepo/libs'

// 擴展 Window 類型以支援 VConsole
declare global {
  interface Window {
    VConsole: any
    vConsoleInstance: any
  }
}

const route = useRoute()

const productionLiffId = () => {
  const currentUrl = window.location.hostname;

  if (currentUrl === LocationEnum.UAT_RIVERSOFT) {
    return '2006021421-n7OQdOMA'
  }

  if (currentUrl === LocationEnum.TAKEDA_LAB) {
    return '1661466216-JeVzPdyv'
  }

  if (currentUrl === LocationEnum.PORTAL_DEV) {
    return '2006021421-836WD6oZ'
  }

  if (currentUrl === LocationEnum.PORTAL_PROD) {
    return '1661466216-X4VZjnxg'
  }

  if (import.meta.env.VITE_ENVIRONMENT === 'development') {
    return
  }

  console.error('currentUrl: ', currentUrl, 'Liff ID 錯誤 請檢查 code productionLiffId')
  return
}

const { LIFF, LineProfile } = useLiff({
  liffId: {
    dev: '2006021421-W8yany2d', // 本機 使用 ngrok 啟動 的 liffId 放這邊
    production: productionLiffId() // 正式環境的 liffId 放這邊
  },
  login: true, // 是否需要登入
  liffInit: true, // 是否需要初始化 liff
  environment: import.meta.env.VITE_ENVIRONMENT // 環境 用來判斷 和環境使用 哪個 liffId
})

const signature = ref<Vue3SignatureType>()
const message = useMessage()

enum Page {
  Register = 0,
  Result = 1,
  RegisterError = 2,
}

const state = ref<RegisterState>({
  role: Role.HCP, // 是 HCP 還是 Takeda
  form: null, // 資料
  isFormComplete: false, // 表單是否完整驗證等...
  dialog: {
    hcp: {
      status: false //打開簽名檔案
    },
    privacy: {
      status: false //打開隱私聲明
    }
  },
  currentPage: Page.Register as Page, // 目前頁面
  goToRegisterPageBtn: false, // 回註冊頁面是否開啟
  resultMessage: '',
  submitLoading: false,
  // 簽名欄位
  signature: {
    width: '200px',
    height: '400px',
    status: false, // 是否有簽名狀態
    image: null, // 簽名產生的圖片
    clear: () => { // 清除簽名欄位
      signature.value?.clear()
      state.value.signature.status = false
    },
    signEnd: async () => { // 每次說名完的動作
      state.value.signature.status = true
      const signatureDone = signature?.value?.save('image/png')
      if (!signatureDone) return
      if (width.value < 450) {
        state.value.signature.image = await rotateAndConvertToBlob(signatureDone, 270)
      } else {
        state.value.signature.image = dataURLtoBlob(signatureDone)
      }

    }
  }
})

const { width, height } = useWindowSize()
// Line 拿 query string 的方式
const getRoleByQueryString = async () => {
  const queryString = decodeURIComponent(window.location.search).replace('?liff.state=', '')
  const params = new URLSearchParams(queryString)
  const role = params.get('role')
  if (role && (role === Role.HCP || role === Role.Internal)) {
    state.value.role = role
  }
}

// 根據 roles 顯示 什麼組件
const roles = computed(() => {
  switch (state.value.role) {
    case Role.HCP:
      return HCPRegisterForm
    case Role.Internal:
      return TakedaRegisterForm
  }
})

// emit區域
const updateForm = (newVal: HCPFormData | TakedaFormData) => {
  state.value.form = newVal
}

// 更新表單資料
const isFormComplete = (newVal: boolean) => {
  state.value.isFormComplete = newVal
}

/*
  送出表單 邏輯 分為現在的 role 是 HCP 還是 Internal
*/
const submit = async () => {
  // 如果是HCP打開簽名彈窗
  if (state.value.role === Role.HCP) {
    state.value.dialog.hcp.status = true
    return
  }

  // 如果是員工直接送出註冊表單 API
  if (state.value.role === Role.Internal) {
    handleTakedaRegister()
    return
  }
}

/*
  HCP 註冊 API
*/

const handleHcpRegister = async () => {
  state.value.submitLoading = true

  // 記錄到 Google Sheet
  await useSheetApi.post({
    lineId: LineProfile.value?.userId || '',
  })

  // 創建 FormData 物件
  const formData = new FormData()

  // 將 hcpUser 的每個鍵值對加入到 FormData 中
  Object.keys(state.value?.form?.hcpUser).forEach(key => {
    formData.append(`hcpUser.${key}`, state.value?.form?.hcpUser[key])
  })

  // 將 PNG Blob 加入到 FormData 中，作為 hcpUser 的一部分
  if (state.value.signature.image) {
    formData.append('hcpUser.signatureFile', state.value.signature.image, 'signature.png')
  }

  axios.post(`${urlFunc()}/business/webservice/v1/bindHcpUser`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(response => {
      if (!response?.data?.data?.isValid) {
        state.value.dialog.hcp.status = false
        state.value.goToRegisterPageBtn = true
        state.value.resultMessage = '綁定失敗'
        state.value.currentPage = Page.RegisterError as Page
        state.value.submitLoading = false
        return
      }

      state.value.dialog.hcp.status = false
      LIFF.value?.closeWindow()
      state.value.resultMessage = '綁定完成'
      state.value.currentPage = Page.Result as Page
      state.value.submitLoading = false

    }).catch(error => {
      console.log('error', error)
      state.value.submitLoading = false
    })
}

/*
  Internal 註冊 API
*/
const getRedirectConfig = () => {
  const currentUrl = window.location.hostname

  if (currentUrl === LocationEnum.PORTAL_DEV) {
    return {
      clientId: '18a3febf-1a22-4ae7-a0e9-01aa03376f9f',
      redirect_url: 'https://portal.dev-twlineoa.tw/entra/callback'
    }
  }

  if (currentUrl === LocationEnum.UAT_RIVERSOFT) {
    return {
      clientId: '18a3febf-1a22-4ae7-a0e9-01aa03376f9f',
      redirect_url: 'https://uat-takeda-lab.riversoft.com.tw/entra/callback'
    }
  }

  if (currentUrl === LocationEnum.PORTAL_PROD) {
    return {
      clientId: 'cf591965-47ac-4b95-84a9-de789d238673',
      redirect_url: 'https://portal.pro-twlineoa.tw/entra/callback'
    }
  }

  return {
    clientId: '18a3febf-1a22-4ae7-a0e9-01aa03376f9f',
    redirect_url: 'https://uat-takeda-lab.riversoft.com.tw/entra/callback'
  }
}

  const oauthUrl = ({
    tenantId: '57fdf63b-7e22-45a3-83dc-d37003163aae',
    clientId: getRedirectConfig().clientId,
    redirectUri: getRedirectConfig().redirect_url,
    scope: ('openid profile email'),
    state: ({
      lineId: route.query.lineId as string || '',
      profileId: route.query.profileId as string || ''
    })
  })

const handleTakedaRegister = async () => {
  if ((!route.query.lineId || !route.query.profileId)) { // ! 安永提供的query參數，本機要測試時可以先註解掉
    state.value.submitLoading = false
    message.error('請提供lineId和profileId') 
    return
  }
  window.location.href = buildMicrosoftOAuthUrl(oauthUrl)
}

/*
  檢查LineId是否綁定過
*/
watch(() => LineProfile.value?.userId, async () => {
  if (LineProfile.value?.userId) {
    const response = await useAuthApi.checkLineId({ lineId: LineProfile.value?.userId })

    if (response.data.isBinding && LineProfile.value?.userId) {
      state.value.currentPage = Page.Result as Page
      state.value.resultMessage = '帳號已綁定'
      return
    }
    console.log(`lineId未綁定: ${LineProfile.value?.userId}`)
  }
})

const closeLiffWindow = () => LIFF.value?.closeWindow()

const gotoRegisterPage = () => {
  state.value.currentPage = Page.Register as Page
  state.value.goToRegisterPageBtn = false
}

// * vconsole 點擊三次邏輯
const clickCount = ref(0)
let clickTimer: ReturnType<typeof setTimeout> | null = null
const handleTitleClick = () => {
  console.log('state', state.value)
  console.log('oauthUrl', oauthUrl)
  clickCount.value++

  if (clickTimer) clearTimeout(clickTimer)

  // 點擊未達三次，重新計時
  if (clickCount.value !== 3) {
    clickTimer = setTimeout(() => {
      clickCount.value = 0
    }, 1000)
    return
  }

  // 點擊三次
  clickCount.value = 0

  // 沒有 VConsole 環境，直接返回
  if (!window.VConsole || window.vConsoleInstance) return

  window.vConsoleInstance = new window.VConsole()
  message.success('VConsole 已啟動')
}

const openPrivacyModal = () => {
  state.value.dialog.privacy.status = true
}

onMounted(() => getRoleByQueryString()) // 取得現在 Query String

</script>

<template>
  <div>
    <n-layout-header v-if="state.currentPage === Page.Register">
      <n-layout-content
        content-style="
          background-color:#5b78c9;
          padding-top:10px;"
      >
        <n-space
          justify="center"
          @click="handleTitleClick"
        >
          <n-h2 class="text-white">
            註冊
          </n-h2>
        </n-space>
      </n-layout-content>
    </n-layout-header>
    <!-- 註冊頁面 -->
    <n-layout-content
      v-if="state.currentPage === Page.Register"
      class="mx-5% mt-8px"
    >
      <n-space
        class="max-w-600px m-a"
        justify="center"
        vertical
      >
        <component
          :is="roles"
          :line-user-id="LineProfile?.userId"
          @update-form="updateForm"
          @is-form-complete="isFormComplete"
        />
        <n-space
          justify="center"
          class="mx-10 mt-5 underline text-primary cursor-pointer"
        >
          <n-p @click="openPrivacyModal">
            隱私聲明
          </n-p>
          <n-a
            href="https://www.takeda.com/terms-and-conditions/"
            target="_blank"
          >
            使用條款
          </n-a>
        </n-space>
        <n-button
          type="info"
          class="w-full my-5"
          :disabled="!state.isFormComplete"
          :loading="state.submitLoading"
          @click="submit"
        >
          {{ state.role === Role.HCP ? '同意並簽名' : '註冊' }}
        </n-button>
      </n-space>
    </n-layout-content>
    <n-layout-content
      v-if="state.currentPage === Page.Result"
      class="mx-5% mt-8px"
    >
      <n-space
        style="height: calc(100dvh - 80px)"
        align="center"
        justify="center"
      >
        <n-result :title="state.resultMessage">
          <template #footer>
            <n-space justify="center">
              <n-button
                type="primary"
                @click="closeLiffWindow"
              >
                關閉頁面
              </n-button>
              <n-button
                v-show="state.goToRegisterPageBtn"
                type="primary"
                @click="gotoRegisterPage"
              >
                回到註冊頁面
              </n-button>
            </n-space>
          </template>
        </n-result>
      </n-space>
    </n-layout-content>
    <n-layout-content
      v-if="state.currentPage === Page.RegisterError"
      class="mx-5% mt-8px"
    >
      <n-space
        style="height: calc(100dvh - 80px)"
        align="center"
        justify="center"
      >
        <n-result title="">
          <template #footer>
            <n-space
              justify="center"
              vertical
            >
              <n-p class="text-start w-[280px]">
                您好！感謝您申請認證台灣武田LINE官方帳號。很抱歉通知您此次認證未能成功。若有任何疑問或需進一步協助，請與我們聯繫。我們將非常樂意為您提供協助。感謝您！
              </n-p>
              <n-button
                class="mt-5"
                type="primary"
                @click="gotoRegisterPage"
              >
                回到註冊頁面
              </n-button>
            </n-space>
          </template>
        </n-result>
      </n-space>
    </n-layout-content>
    <n-modal
      v-model:show="state.dialog.hcp.status"
      preset="dialog"
      :show-icon="false"
      :on-after-leave="() => state.signature.clear()"
      :closable="false"
      :style="{
        maxWidth: width < height ? '300px' : '1000px',
        width: 'max-content',
      }"
    >
      <n-space
        v-if="width < height"
        class="py-2"
      >
        <n-space class="m-a mb-5">
          <Vue3Signature
            ref="signature"
            :sig-option="{
              penColor: 'rgb(0, 0, 0)',
              backgroundColor: 'rgb(245,245,245,0)'
            }"
            :w="state.signature.width"
            :h="state.signature.height"
            style="border: 1px solid grey;"
            @end="state.signature.signEnd"
          />
          <div class="absolute top-[42%] left-[10%] rotate-90 w-[400px] text-gray-600">
            我同意提供以上個人資料給武田使用，請以下簽名：
          </div>
        </n-space>
        <n-space>
          <n-button
            class="rotate-90"
            type="info"
            :disabled="!state.signature.status"
            :loading="state.submitLoading"
            size="small"
            @click="handleHcpRegister"
          >
            註冊
          </n-button>
          <n-button
            type="default"
            tertiary
            class="inline rotate-90"
            size="small"
            @click="state.signature.clear"
          >
            清除
          </n-button>
        </n-space>
      </n-space>
      <div
        v-else
        class="flex gap-2"
      >
        <div>
          <div>
            我同意提供以上個人資料給武田使用，請以下簽名：
          </div>
          <Vue3Signature
            ref="signature"
            :sig-option="{
              penColor: 'rgb(0, 0, 0)',
              backgroundColor: 'rgb(245,245,245,0)'
            }"
            :w="state.signature.height"
            :h="state.signature.width"
            style="border: 1px solid grey;"
            @end="state.signature.signEnd"
          />
        </div>
        <n-space
          vertical
          justify="end"
        >
          <n-button
            type="info"
            :disabled="!state.signature.status"
            :loading="state.submitLoading"
            size="small"
            @click="handleHcpRegister"
          >
            註冊
          </n-button>
          <n-button
            type="default"
            tertiary
            size="small"
            @click="state.signature.clear"
          >
            清除
          </n-button>
        </n-space>
      </div>
    </n-modal>
    <n-drawer
      v-model:show="state.dialog.privacy.status"
      placement="bottom"
      height="100%"
    >
      <n-drawer-content
        title="隱私聲明"
        closable
      >
        <PrivacyInfo v-if="state.role === Role.HCP" />
        <InternalPrivacyInfo v-if="state.role === Role.Internal" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
