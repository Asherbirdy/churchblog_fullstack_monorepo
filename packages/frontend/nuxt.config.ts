// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],

  components: {
    dirs: []
  },
  devtools: {
    enabled: true
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
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
    '/': { prerender: true },
    '/admin/*': { ssr: false },
    '/C/*': { prerender: true }
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
        await fetch(`${apiUrl}/page/before-build-and-deploy`)
      } catch (error) {
        console.log('[請確認SERVER是否啟動]')
        console.error('[prerender] before-build-and-deploy failed', error)
        throw error
      }

      const res = await fetch(`${apiUrl}/page/online`)
      if (!res.ok) throw new Error(`[prerender] API responded with ${res.status}`)
      const { onlinePages } = await res.json()
      for (const p of onlinePages) {
        ctx.routes.add(`/C/${p.routeName}`)
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
