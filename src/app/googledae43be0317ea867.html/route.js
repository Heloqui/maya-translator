export const dynamic = 'force-static'

export function GET() {
  return new Response('google-site-verification: googledae43be0317ea867.html', {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
