import { useApiRequest } from "./http"


export const useMessageApi = {
  sendMessage: (payload: string): Promise<string> => {
    return useApiRequest.post({
      url: `/message/send`,
      data: payload
    })
  }
}
