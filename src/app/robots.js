import { SITE_URL } from '@/lib/site'

const COMMON_RULES = { allow: '/' }

export default function robots() {
  return {
    rules: [
      { userAgent: '*', ...COMMON_RULES },
      { userAgent: 'GPTBot', ...COMMON_RULES },
      { userAgent: 'ChatGPT-User', ...COMMON_RULES },
      { userAgent: 'ClaudeBot', ...COMMON_RULES },
      { userAgent: 'Claude-Web', ...COMMON_RULES },
      { userAgent: 'PerplexityBot', ...COMMON_RULES },
      { userAgent: 'Google-Extended', ...COMMON_RULES },
      { userAgent: 'Applebot', ...COMMON_RULES },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
