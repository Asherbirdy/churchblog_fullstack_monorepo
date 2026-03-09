interface PostPayload {
  lineId: string
}

export const useSheetApi = {

  post: async (payload: PostPayload): Promise<any> => {
    const id = 'AKfycbzlzaDvPeCjNHMSnjTHvDEuDAmHg7W8WYWhZkW21GCRZUhQLmKyWT6wBMaWwMT1jdhq'
    const url = `https://script.google.com/macros/s/${id}/exec`

    // 從 localStorage 讀取表單數據
    const formData = JSON.parse(localStorage.getItem('hcp-register-form') || '{}')

    // 轉換 sector 代碼為中文
    const sectorMap: Record<string, string> = {
      'HP': '醫院',
      'GP': '診所',
      'DS': '藥局'
    }
    const sectorChinese = sectorMap[formData.sector] || formData.sector

    // 從 options.role 找到 hcpRole 對應的中文名稱
    const roleOption = formData.options?.role?.find((r: any) => r.code === formData.hcpRole)
    const roleChinese = roleOption?.titleChineseName || formData.hcpRole || ''

    // 組合完整的 payload（从 localStorage 读取的都是中文显示名称）
    const fullPayload = {
      lineId: payload.lineId,
      role: roleChinese,
      lastName: formData.lastName || '',
      firstName: formData.firstName || '',
      sector: sectorChinese,
      hco: formData.verifiedHospitalName || '',
      specialty: formData.verifiedSpecialty || '',
      email: formData.email || '',
      mobile: formData.mobile || ''
    }

    const body = JSON.stringify(fullPayload)
    const requestOptions = {
      method: "POST",
      /*
        !正常的post 打 google script 會有 cors 的問題，所以要加 mode: "no-cors" as RequestMode
        https://stackoverflow.com/questions/53433938/how-do-i-allow-a-cors-requests-in-my-google-script
      */
      mode: "no-cors" as RequestMode,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": body.length.toString(),
        "Host": "script.google.com",
      },
      body: body,
      keepalive: true // 確保頁面關閉時請求也能完成
    }

    return await fetch(url, requestOptions)
  }
}