// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-utils'],

  // Registra componentes pelo nome do arquivo, sem prefixar o nome da pasta
  // (ex.: study-materials/MaterialsCatalog.vue → <MaterialsCatalog>).
  components: [{ path: '~/components', pathPrefix: false }],

  nitro: {
    devStorage: {
      'study-materials': {
        driver: 'fs',
        base: './content',
      },
    },
    bundledStorage: ['study-materials'],
  },

  css: [
    'aos/dist/aos.css',
    '~/assets/css/icons.css',
    '~/assets/css/motion.css',
  ],

  app: {
    head: {
      link: [
        // Ícones do guia de marca (docs/brand: "iconografia via Google Fonts Material Symbols").
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,300..500,0..1,-25..0&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    // Banco: SQLite local (file:) em dev, Turso (libsql://) em produção — mesmo driver.
    tursoDatabaseUrl: process.env.TURSO_DATABASE_URL || 'file:./.data/dev.db',
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN || '',
    llmApiKey: process.env.LLM_API_KEY || '',
    llmModel: process.env.LLM_MODEL || 'gemini-3.1-flash-lite',
    gameTimezone: process.env.GAME_TIMEZONE || 'America/Sao_Paulo',
    // nuxt-auth-utils usa runtimeConfig.session.password para assinar o cookie de sessão.
    session: {
      password: process.env.SESSION_SECRET || '',
    },
  },

  typescript: {
    strict: true,
  },
})
