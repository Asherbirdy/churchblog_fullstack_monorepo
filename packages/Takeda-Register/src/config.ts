interface Config {
  mode: 'development' | 'production'
  baseUrl: string
  apiUrl: string
  liffId: string
}

const config: Config = {
  mode: import.meta.env.MODE as 'development' | 'production',
  baseUrl: import.meta.env.VITE_BASE,
  apiUrl: import.meta.env.VITE_API,
  liffId: import.meta.env.VITE_LIFF_ID
}

export { config }