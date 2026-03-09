
export const urlFunc = () => {
  const mode = import.meta.env.VITE_ENVIRONMENT
  const url = import.meta.env.VITE_API
  if (mode === 'development') {
    return '/api'
  }

  if (mode === 'production') {
    return ''
  }

  return url
}

export interface MicrosoftOAuthParams {
  tenantId: string
  clientId: string
  redirectUri: string
  scope: string
  state: {
    lineId: string
    profileId: string
  }
}

export const buildMicrosoftOAuthUrl = (params: MicrosoftOAuthParams): string => {
  const { tenantId, clientId, redirectUri, scope, state } = params

  return (
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${btoa(JSON.stringify(state))}`
  )
}