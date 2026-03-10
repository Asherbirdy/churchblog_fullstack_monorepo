import type { UseFetchOptions } from '#app'

/*
  * @DataType Response型別
  * @ErrorType Error型別
  * @Options UseFetchOptions<DataType, ErrorType>
  * @Url API路徑，例如 PublicRequestUrl.Login
  * useFetch文件： https://nuxt.com/docs/api/composables/use-fetch
*/
export function useRequestApi<DataT, ErrorT>(
  // url: PublicRequestUrl | UserRequestUrl | string,
  url: string,
  options?: UseFetchOptions<DataT, ErrorT>
) {
  const config = useRuntimeConfig()
  const baseUrl = config.public.API_URL
  return useFetch<DataT, ErrorT>(`${baseUrl}${url}`, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...options as any, // option.method 會報錯 所以用 any
    $fetch: useNuxtApp().$Fetch as typeof $fetch
  })
}
