export function GET(req: Request) {
  const sensorIds = [13332020, 13332021, 13332022, 13332023, 13332024];
  const apiKey = process.env.NEXT_PUBLIC_OPENAQ_API_KEY || "";

  return (async () => {
    const sensors = await Promise.all(
      sensorIds.map(async (id) => {
        const url = `https://api.openaq.org/v3/sensors/${id}/measurements`;
        try {
          const res = await fetch(url, {
            headers: {
              "X-API-Key": apiKey,
              Accept: "application/json",
            },
          });
          if (!res.ok) {
            return { id, error: `HTTP ${res.status}` };
          }
          const data = await res.json();
          return { id, data };
        } catch (e: any) {
          return { id, error: e.message || "fetch_failed" };
        }
      })
    );

    return new Response(JSON.stringify({ sensors }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  })();
}
