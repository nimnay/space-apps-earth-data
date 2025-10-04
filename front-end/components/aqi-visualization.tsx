"use client";

import * as d3 from "d3";
import * as React from "react";

// If you use shadcn/ui ensure these imports exist in your project
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// ---------- Types ----------
interface SensorResult {
  value: number;
  parameter: {
    id: number;
    name: string;
    units: string;
  };
  period: {
    datetimeFrom: { utc: string; local: string };
    datetimeTo: { utc: string; local: string };
    interval: string;
    label: string;
  };
}

interface Sensor {
  id: number | string;
  data: {
    meta: {
      name: string;
      page: number;
      limit: number;
      found: string;
    };
    results: SensorResult[];
  };
}

// ---------- Fallback Sample (trimmed) ----------
const sampleSensors: Sensor[] = [
  {
    id: 13332020,
    data: {
      meta: {
        name: "openaq-api",
        page: 1,
        limit: 100,
        found: ">100",
      },
      results: [
        {
          value: 0,
          parameter: { id: 19, name: "pm1", units: "µg/m³" },
          period: {
            label: "raw",
            interval: "01:00:00",
            datetimeFrom: {
              utc: "2025-06-15T04:00:00Z",
              local: "2025-06-15T00:00:00-04:00",
            },
            datetimeTo: {
              utc: "2025-06-15T05:00:00Z",
              local: "2025-06-15T01:00:00-04:00",
            },
          },
        },
        {
          value: 0.03945833258330822,
          parameter: { id: 19, name: "pm1", units: "µg/m³" },
          period: {
            label: "raw",
            interval: "01:00:00",
            datetimeFrom: {
              utc: "2025-06-15T05:00:00Z",
              local: "2025-06-15T01:00:00-04:00",
            },
            datetimeTo: {
              utc: "2025-06-15T06:00:00Z",
              local: "2025-06-15T02:00:00-04:00",
            },
          },
        },
        {
          value: 0.07229166602094968,
          parameter: { id: 19, name: "pm1", units: "µg/m³" },
          period: {
            label: "raw",
            interval: "01:00:00",
            datetimeFrom: {
              utc: "2025-06-15T06:00:00Z",
              local: "2025-06-15T02:00:00-04:00",
            },
            datetimeTo: {
              utc: "2025-06-15T07:00:00Z",
              local: "2025-06-15T03:00:00-04:00",
            },
          },
        },
        {
          value: 1.6585833343366783,
          parameter: { id: 19, name: "pm1", units: "µg/m³" },
          period: {
            label: "raw",
            interval: "01:00:00",
            datetimeFrom: {
              utc: "2025-06-15T07:00:00Z",
              local: "2025-06-15T03:00:00-04:00",
            },
            datetimeTo: {
              utc: "2025-06-15T08:00:00Z",
              local: "2025-06-15T04:00:00-04:00",
            },
          },
        },
      ],
    },
  },
];

// ---------- Hooks ----------
function useResizeObserver<T extends HTMLElement>(
  callback: (entry: DOMRectReadOnly) => void
) {
  const ref = React.useRef<T | null>(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver((entries) => {
      const e = entries[0];
      callback(e.contentRect);
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [callback]);
  return ref;
}

// ---------- Chart Component ----------
interface LineChartProps {
  data: { date: Date; value: number }[];
  height?: number;
  color?: string;
  units?: string;
  id?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 160,
  color = "hsl(var(--chart-1, 210 90% 50%))",
  units,
  id,
}) => {
  const containerRef = useResizeObserver<HTMLDivElement>(() => draw());
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const draw = React.useCallback(() => {
    if (!containerRef.current || !svgRef.current || data.length === 0) return;

    const width = containerRef.current.clientWidth;
    const margin = { top: 8, right: 12, bottom: 22, left: 40 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleUtc()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerW]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)! * 1.1])
      .nice()
      .range([innerH, 0]);

    const line = d3
      .line<{ date: Date; value: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    // Axes
    const xAxis = d3
      .axisBottom<Date>(x)
      .ticks(Math.min(6, data.length))
      .tickFormat((d) =>
        d3.timeFormat(data.length > 24 ? "%H:%M" : "%H:%M")(d)
      );

    const yAxis = d3
      .axisLeft<number>(y)
      .ticks(4)
      .tickFormat((d) => d.toString());

    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .attr("class", "text-xs text-muted-foreground")
      .call(xAxis as any)
      .call((g) =>
        g.selectAll(".domain, .tick line").attr("stroke", "hsl(var(--border))")
      );

    g.append("g")
      .attr("class", "text-xs text-muted-foreground")
      .call(yAxis as any)
      .call((g) =>
        g.selectAll(".domain, .tick line").attr("stroke", "hsl(var(--border))")
      );

    // Grid
    g.append("g")
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-opacity", 0.15)
      .call((grid) =>
        grid
          .selectAll("line.h-grid")
          .data(y.ticks(4))
          .enter()
          .append("line")
          .attr("class", "h-grid")
          .attr("x1", 0)
          .attr("x2", innerW)
          .attr("y1", (d) => y(d))
          .attr("y2", (d) => y(d))
      );

    // Line
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line as any);

    // Area
    const area = d3
      .area<{ date: Date; value: number }>()
      .x((d) => x(d.date))
      .y0(innerH)
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", color)
      .attr("fill-opacity", 0.12)
      .attr("d", area as any);

    // Last point highlight
    const last = data[data.length - 1];
    g.append("circle")
      .attr("cx", x(last.date))
      .attr("cy", y(last.value))
      .attr("r", 4)
      .attr("fill", color)
      .attr("stroke", "white")
      .attr("stroke-width", 1.5);

    // Tooltip (simple hover)
    const focusGroup = g.append("g").style("display", "none");

    focusGroup
      .append("circle")
      .attr("r", 4)
      .attr("fill", "white")
      .attr("stroke", color)
      .attr("stroke-width", 2);

    const focusLabel = focusGroup
      .append("foreignObject")
      .attr("x", 0)
      .attr("y", -28)
      .attr("width", 120)
      .attr("height", 40)
      .append("div")
      .style("font", "10px var(--font-sans)")
      .style("background", "hsl(var(--popover))")
      .style("border", "1px solid hsl(var(--border))")
      .style("borderRadius", "4px")
      .style("padding", "2px 4px")
      .style("color", "hsl(var(--foreground))")
      .style("boxShadow", "0 2px 4px rgba(0,0,0,.1)");

    const bisect = d3.bisector<{ date: Date; value: number }, Date>(
      (d) => d.date
    ).center;

    svg
      .on("pointerenter", () => focusGroup.style("display", null))
      .on("pointerleave", () => focusGroup.style("display", "none"))
      .on("pointermove", function (event) {
        const [px] = d3.pointer(event, this);
        const xm = x.invert(px - margin.left);
        const i = bisect(data, xm);
        const d = data[i];
        if (!d) return;
        focusGroup.attr(
          "transform",
          `translate(${margin.left + x(d.date)},${margin.top + y(d.value)})`
        );
        focusLabel.html(
          `<strong>${d3.timeFormat("%H:%M")(
            d.date
          )}</strong><br/>${d.value.toFixed(3)} ${units || ""}`
        );
      });
  }, [data, color, height, units, containerRef]);

  React.useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} role="img" aria-label={id ? `chart-${id}` : "chart"} />
    </div>
  );
};

// ---------- Utility ----------
function formatResults(results: SensorResult[]) {
  return results
    .map((r) => ({
      date: new Date(r.period.datetimeFrom.utc),
      value: r.value,
      units: r.parameter.units,
      parameter: r.parameter.name,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function stats(values: number[]) {
  if (values.length === 0) return { min: 0, max: 0, mean: 0 };
  const min = d3.min(values)!;
  const max = d3.max(values)!;
  const mean = d3.mean(values)!;
  return { min, max, mean };
}

// ---------- Sensor Card ----------
const SensorCard: React.FC<{ sensor: Sensor }> = ({ sensor }) => {
  const ts = formatResults(sensor.data.results);
  const values = ts.map((d) => d.value);
  const { min, max, mean } = stats(values);
  const last = ts[ts.length - 1];
  const units = last?.units;
  const parameter = last?.parameter;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Sensor {sensor.id}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {parameter?.toUpperCase()}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {sensor.data.meta.name} (last {ts.length} hrs)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-2 text-xs mb-3">
          <div>
            <div className="text-muted-foreground">Current</div>
            <div className="font-medium">
              {last?.value.toFixed(3)} {units}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Mean</div>
            <div className="font-medium">{mean.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Range</div>
            <div className="font-medium">
              {min.toFixed(2)}–{max.toFixed(2)}
            </div>
          </div>
        </div>
        <LineChart
          data={ts}
          units={units}
          id={String(sensor.id)}
          color="hsl(var(--primary))"
        />
      </CardContent>
      <CardFooter className="pt-2">
        <span className="text-xs text-muted-foreground">
          Updated: {last ? d3.timeFormat("%Y-%m-%d %H:%M UTC")(last.date) : "-"}
        </span>
      </CardFooter>
    </Card>
  );
};

// ---------- Main Component ----------
export default function AQIVisualization() {
  const [sensors, setSensors] = React.useState<Sensor[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/openaq");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // Expecting shape { sensors: Sensor[] } or single sensor
        let parsed: Sensor[] = [];
        if (Array.isArray(json?.sensors)) parsed = json.sensors;
        else if (Array.isArray(json)) parsed = json as Sensor[];
        else if (json?.id && json?.data) parsed = [json as Sensor];

        if (!parsed.length) {
          parsed = sampleSensors;
        }

        if (!cancelled) setSensors(parsed);
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message);
          setSensors(sampleSensors);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Air Quality Sensors
        </h2>
        <p className="text-sm text-muted-foreground">
          Interactive hourly particulate measurements (pm1).
        </p>
      </header>
      <Separator />
      {loading && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading sensor data...
        </div>
      )}
      {error && (
        <div className="text-xs text-destructive">
          Error: {error} (showing fallback)
        </div>
      )}
      <ScrollArea className="w-full">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 pb-4">
          {sensors.map((s) => (
            <SensorCard key={s.id} sensor={s} />
          ))}
        </div>
      </ScrollArea>
      {sensors.length === 0 && !loading && (
        <div className="text-sm text-muted-foreground">No sensors.</div>
      )}
    </div>
  );
}
