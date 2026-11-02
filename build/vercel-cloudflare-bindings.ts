// Vercel does not inject Cloudflare Worker bindings. Keep the existing
// missing-binding responses reachable until storage is configured there.
export const env: { DB?: D1Database; BUCKET?: R2Bucket } = {};
