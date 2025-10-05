"use client";

import * as d3 from "d3";
import * as React from "react";

// If you use shadcn/ui ensure these imports exist in your project
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";

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
  color,
  units,
  id,
}) => {
  const containerRef = useResizeObserver<HTMLDivElement>(() => draw());
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const { resolvedTheme } = useTheme();

  console.log(resolvedTheme);

  color = resolvedTheme === "dark" ? "#60a5fa" : "#2563eb";

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
      .ticks(Math.min(5, data.length))
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
  }, [data, color, height, containerRef]);

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
          {(() => {
            const readable = (p: string) => {
              const u = p.toUpperCase();
              if (u === "RELATIVEHUMIDITY") return "Relative Humidity";
              if (u === "TEMPERATURE") return "Temperature";
              return u;
            };
            return (
              <CardTitle className="text-base">
                Anderson {parameter ? readable(parameter) : ""}
              </CardTitle>
            );
          })()}
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

// ---------- Forecast Component ----------
const ForecastCard: React.FC<{
  prediction: number;
  loading: boolean;
  dailyAverages: number[];
}> = ({ prediction, loading, dailyAverages }) => {
  const formatPrediction = (value: number) => {
    if (isNaN(value) || value === null || value === undefined) {
      return "No data available";
    }
    return `${value.toFixed(3)} μg/m³`;
  };

  const getAQILevel = (value: number) => {
    if (isNaN(value) || value === null || value === undefined) return "Unknown";
    // EPA AQI breakpoints for NO2 (μg/m³)
    if (value <= 53) return "Good";
    if (value <= 100) return "Moderate";
    if (value <= 360) return "Unhealthy for Sensitive Groups";
    if (value <= 649) return "Unhealthy";
    if (value <= 1249) return "Very Unhealthy";
    return "Hazardous";
  };

  const getAQIColor = (value: number) => {
    if (isNaN(value) || value === null || value === undefined)
      return "text-gray-500";
    if (value <= 53) return "text-green-600";
    if (value <= 100) return "text-yellow-600";
    if (value <= 360) return "text-orange-600";
    if (value <= 649) return "text-red-600";
    if (value <= 1249) return "text-purple-600";
    return "text-red-800";
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">NO₂ Forecast</CardTitle>
        <CardDescription>Predicted concentration for tomorrow</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground animate-pulse">
              Generating forecast...
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {formatPrediction(prediction)}
              </div>
              <div
                className={`text-lg font-semibold ${getAQIColor(prediction)}`}
              >
                {getAQILevel(prediction)}
              </div>
            </div>
            {dailyAverages && dailyAverages.length > 0 && (
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">
                  Based on {dailyAverages.length} days of historical data
                </div>
                <div className="text-xs text-muted-foreground">
                  Recent average:{" "}
                  {dailyAverages.length > 0
                    ? (
                        dailyAverages.reduce((a, b) => a + b, 0) /
                        dailyAverages.length
                      ).toFixed(3)
                    : "N/A"}{" "}
                  μg/m³
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ---------- Main Component ----------
export default function AQIVisualization() {
  const [sensors, setSensors] = React.useState<Sensor[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [forecast, setForecast] = React.useState<{
    prediction: number;
    dailyAverages: number[];
  } | null>(null);
  const [forecastLoading, setForecastLoading] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);

      const res = await fetch("/api/openaq");
      const json = await res.json();

      setSensors(json.sensors);
      setLoading(false);
    };
    load();
  }, []);

  React.useEffect(() => {
    const loadForecast = async () => {
      setForecastLoading(true);
      try {
        const res = await fetch("/api/openaq", {
          method: "POST",
        });
        const json = await res.json();
        setForecast({
          prediction: json.prediction,
          dailyAverages: json.dailyAverages,
        });
      } catch (error) {
        console.error("Error loading forecast:", error);
        setForecast(null);
      } finally {
        setForecastLoading(false);
      }
    };
    loadForecast();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <Separator />

      {/* Forecast Section */}
      <div className="flex justify-center">
        <ForecastCard
          prediction={forecast?.prediction || 0}
          loading={forecastLoading}
          dailyAverages={forecast?.dailyAverages || []}
        />
      </div>

      <Separator />

      {loading && (
        <div className=" flex align-middle justify-center text-sm text-muted-foreground animate-pulse">
          Loading sensor data...
        </div>
      )}
      <div className="w-full">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch mx-auto max-w-6xl justify-center justify-items-center">
          {sensors.map((s) => (
            <div key={s.id} className="flex h-full w-full">
              <SensorCard sensor={s} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
