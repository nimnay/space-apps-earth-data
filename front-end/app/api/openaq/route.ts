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

export async function POST(req: Request) {
  const url =
    "https://api.openaq.org/v3/sensors/1601/days?date_to=2025-10-05T00:00:00.000Z&date_from=2025-09-25T00:00:00.000Z";
  const apiKey = process.env.NEXT_PUBLIC_OPENAQ_API_KEY || "";
  const res = await fetch(url, {
    headers: {
      "X-API-Key": apiKey,
      Accept: "application/json",
    },
  });

  const data = await res.json();
  const results = Array.isArray(data?.results) ? data.results : [];
  const dailyAverages = results.map(
    (r: any) => (r?.summary?.avg ?? r?.value ?? null) * 10000
  );

  const res2 = await fetch("http://localhost:8000/predict-no2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: dailyAverages }),
  });

  const body2 = await res2.json();

  return new Response(
    JSON.stringify({ dailyAverages, prediction: body2?.prediction ?? "" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
