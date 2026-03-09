export const dataURLtoBlob = (dataurl: string): Blob => {
  const arr = dataurl.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)

  // 確保 mimeMatch 不是 null 解決ts怪怪問題
  if (!mimeMatch) {
    throw new Error('Invalid data URL format')
  }

  const mime = mimeMatch[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

export const rotateBase64Image = (
  base64Image: string,
  degrees: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      // 計算旋轉後所需的畫布大小
      const rotatedWidth = Math.abs(img.width * Math.cos(degrees * Math.PI / 180)) + Math.abs(img.height * Math.sin(degrees * Math.PI / 180))
      const rotatedHeight = Math.abs(img.width * Math.sin(degrees * Math.PI / 180)) + Math.abs(img.height * Math.cos(degrees * Math.PI / 180))

      // 設置畫布大小為旋轉後的尺寸
      canvas.width = rotatedWidth
      canvas.height = rotatedHeight

      console.log(canvas.width, canvas.height)

      // 移動畫布中心點到畫布中央
      ctx.translate(canvas.width / 2, canvas.height / 2)

      // 旋轉畫布
      ctx.rotate((degrees * Math.PI) / 180)

      // 繪製圖片，從中心點開始繪製
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      // 將旋轉後的圖片轉換為 base64
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = base64Image
  })
}

export const rotateAndConvertToBlob = async (
  base64Image: string,
  degrees: number
): Promise<Blob> => {
  const rotatedBase64 = await rotateBase64Image(base64Image, degrees)
  return dataURLtoBlob(rotatedBase64)
}