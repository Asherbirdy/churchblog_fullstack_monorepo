// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],
  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light'
  },

  runtimeConfig: {
    public: {
      ENVIRONMENT: process.env.NUXT_PUBLIC_ENVIRONMENT,
      API_URL: process.env.NUXT_PUBLIC_API_URL,
      USERNAME: process.env.NUXT_PUBLIC_USERNAME || '',
      PASSWORD: process.env.NUXT_PUBLIC_PASSWORD || ''
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',
  hooks: {
    async 'prerender:routes'(ctx) {
      const apiUrl = process.env.NUXT_PUBLIC_API_URL
      if (!apiUrl) {
        console.warn('[prerender] NUXT_PUBLIC_API_URL is not set, skipping dynamic routes')
        return
      }
      try {
        const res = await fetch(`${apiUrl}/page/online`)
        if (!res.ok) throw new Error(`API responded with ${res.status}`)
        const { onlinePages } = await res.json() as { onlinePages: { routeName: string }[] }
        for (const p of onlinePages) {
          ctx.routes.add(`/C/${p.routeName}`)
        }
      } catch (e) {
        console.warn('[prerender] Failed to fetch online pages:', e)
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
