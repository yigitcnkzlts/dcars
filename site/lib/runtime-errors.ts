export function isDatabaseUnavailable(error: unknown) {
  return error instanceof Error && (
    error.name === "DatabaseUnavailableError" ||
    error.message.includes("Cloudflare D1 binding `DB`")
  );
}

export function databaseUnavailableResponse(feature: string) {
  return Response.json(
    { error: `${feature} bu ortamda kullanılamıyor; kalıcı veri bağlantısı yapılandırılmamış.` },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
