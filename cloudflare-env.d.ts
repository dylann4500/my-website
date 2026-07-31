declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    MEDIA: R2Bucket;
    EDITOR_PASSWORD: string;
    EDITOR_SESSION_TOKEN: string;
  }
}
