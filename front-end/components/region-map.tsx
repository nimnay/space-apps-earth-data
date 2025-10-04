"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

type MapView = 'citizen' | 'ems';

export default function RegionMap({ view = 'citizen' }: { view?: MapView }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (mapRef.current) return;

    // All Leaflet operations must be performed client-side; dynamically import leaflet to avoid SSR issues
    (async () => {
      try {
        const leaflet = await import('leaflet');
        const L = (leaflet as any).default || leaflet;
        // initialize map centered on the southeast
        const map = L.map(ref.current, { zoomControl: true }).setView([33.0, -83.0], 6);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const res = await fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json');
        const geo = await res.json();
        const target = new Set(['Georgia', 'North Carolina', 'South Carolina', 'Tennessee']);

        const stateLayers: L.Layer[] = [];
        const holesAll: L.LatLngExpression[][] = [];
        const bounds = L.latLngBounds([] as any);

        for (const feature of geo.features) {
          const name = feature.properties && (feature.properties.name || feature.properties.NAME || feature.properties.STATE_NAME);
          if (!name || !target.has(name)) continue;

          // GeoJSON coordinates are [lon, lat]
          const coords = feature.geometry.coordinates;
          const geomType = feature.geometry.type;

          const processPolygon = (polyCoords: any[]) => {
            const latlngs = polyCoords.map((pt: any[]) => [pt[1], pt[0]] as L.LatLngExpression);
            // add as visible polygon
            const poly = L.polygon(latlngs, { color: '#2b6cb0', weight: 2, fillOpacity: 0.1 });
            poly.addTo(map);
            stateLayers.push(poly);
            bounds.extend(poly.getBounds());
            // collect hole (inner ring) as polygon for masking (note: holes must be in same latlng format)
            holesAll.push(latlngs);
          };

          if (geomType === 'Polygon') {
            // coords: [ [ [lon,lat], ... ] ] -> first is outer ring, rest are holes
            const outer = coords[0];
            processPolygon(outer);
            // if there are additional rings (holes) include them as holes to be masked out (not necessary here)
            for (let i = 1; i < coords.length; i++) {
              const hole = coords[i].map((pt: any[]) => [pt[1], pt[0]]);
              holesAll.push(hole);
            }
          } else if (geomType === 'MultiPolygon') {
            // coords: [ [ [ [lon,lat], ... ] ], ... ]
            for (const part of coords) {
              const outer = part[0];
              processPolygon(outer);
              for (let i = 1; i < part.length; i++) {
                const hole = part[i].map((pt: any[]) => [pt[1], pt[0]]);
                holesAll.push(hole);
              }
            }
          }
        }

        // If we have state layers, fit map to their combined bounds
        if (stateLayers.length) {
          map.fitBounds(bounds.pad(0.15));

          // Create an outer polygon that covers the whole world and use the state polygons as holes
          const outer = [
            [90, -180],
            [90, 180],
            [-90, 180],
            [-90, -180],
          ];
          // holesAll is an array of latlng arrays; Leaflet accepts polygon with holes as [outer, hole1, hole2,...]
          const maskRings = [outer, ...holesAll];
          const mask = L.polygon(maskRings as any, {
            color: '#000',
            weight: 0,
            fillOpacity: 0.85,
            fillRule: 'evenodd',
            interactive: false,
          });
          mask.addTo(map);

          // After drawing states, fetch EONET events and add markers that fall within the selected states
          try {
            const eRes = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events');
            const eJson = await eRes.json();
            const events = eJson.events || [];

            // helper: point-in-polygon (ray casting) expects [lon, lat]
            const pointInPoly = (point: [number, number], vs: [number, number][]) => {
              const x = point[0], y = point[1];
              let inside = false;
              for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                const xi = vs[i][0], yi = vs[i][1];
                const xj = vs[j][0], yj = vs[j][1];

                const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi + 0.0) + xi);
                if (intersect) inside = !inside;
              }
              return inside;
            };

            const wildfirePoints: [number, number][] = [];

            for (const ev of events) {
              for (const geom of ev.geometry || []) {
                const [lon, lat] = geom.coordinates;
                for (const layer of stateLayers) {
                  if (!(layer instanceof L.Polygon)) continue;
                  const polyLayer = layer as L.Polygon;
                  const latlngsAny = polyLayer.getLatLngs() as any;
                  const outerRing = Array.isArray(latlngsAny[0]) ? latlngsAny[0] : latlngsAny;
                  const polyXY = outerRing.map((p: any) => [p.lng, p.lat] as [number, number]);
                  if (pointInPoly([lon, lat], polyXY)) {
                    // derive category label (events can have multiple categories)
                    const categories = (ev.categories || []).map((c: any) => c.title || c).join(', ') || 'Uncategorized';

                    // choose marker color based on category
                    const cat = (ev.categories && ev.categories[0] && (ev.categories[0].title || ev.categories[0])) || '';
                    const colorMap: Record<string, string> = {
                      'Wildfires': '#e53e3e',
                      'Wildfire': '#e53e3e',
                      'Volcanoes': '#ed8936',
                      'Volcano': '#ed8936',
                      'Storms': '#805ad5',
                      'Severe Storms': '#805ad5',
                      'Floods': '#3182ce',
                      'Flood': '#3182ce',
                      'Earthquakes': '#8b4513',
                      'Earthquake': '#8b4513',
                    };
                    const color = colorMap[cat] || '#718096';

                    // If this is a wildfire event, use a fire SVG icon
                    const isWildfire = /wildfire/i.test(categories) || /wildfire/i.test(cat);
                    let marker: any;
                    if (isWildfire) {
                      const svg = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white">
                          <path d="M12.5 2.1c.1.9.1 1.7-.1 2.6-.3 1.3-1 2.4-1.9 3.4-.3.3-.5.7-.6 1.1-.1.5.3.9.8.9h.1c.2 0 .3 0 .5-.1 2.1-.8 3.8-2.6 4.4-4.8.5-1.8.1-3.6-.8-5.1-.1-.2-.4-.3-.7-.1zM12 22c-3.3 0-6-2.7-6-6 0-1.3.4-2.4 1-3.4.3-.6.8-1.1 1.4-1.6.7-.5 1.5-.9 2.3-1.2.5-.2 1-.3 1.5-.3.7 0 1.4.1 2 .4 1 .4 1.8 1.1 2.3 2.1.8 1.6.8 3.6.1 5.2-1 2.3-3.5 4-5.6 4z"/>
                        </svg>`;
                      const html = `<div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:16px;background:${color};box-shadow:0 1px 4px rgba(0,0,0,0.3)">${svg}</div>`;
                      const icon = L.divIcon({ html, className: '', iconSize: [30, 30], iconAnchor: [15, 15] });
                      marker = L.marker([lat, lon], { icon }).addTo(map);
                      // record wildfire point (lat, lon) for simulated user placement
                      wildfirePoints.push([lat, lon]);
                    } else {
                      marker = L.circleMarker([lat, lon], { radius: 7, color, fillColor: color, fillOpacity: 0.9 }).addTo(map);
                    }

                    const popupHtml = `
                      <div style="max-width:260px">
                        <strong>${ev.title}</strong>
                        <div style="font-size:12px;color:#666">${geom.date}</div>
                        <div style="font-size:12px;margin-top:6px"><strong>Category:</strong> ${categories}</div>
                        ${ev.sources && ev.sources[0] ? `<div style="margin-top:6px"><a href="${ev.sources[0].url}" target="_blank">Source</a></div>` : ''}
                      </div>
                    `;
                    marker.bindPopup(popupHtml);
                    break;
                  }
                }
              }
            }

            // If view is citizen, add a simulated user location near a random wildfire
            try {
                if (view === 'citizen' && wildfirePoints.length) {
                const idx = Math.floor(Math.random() * wildfirePoints.length);
                const [wLat, wLon] = wildfirePoints[idx];
                // small random offset (~0.005-0.02 degrees)
                const offset = () => (Math.random() * 0.015 + 0.005) * (Math.random() < 0.5 ? -1 : 1);
                const userLat = wLat + offset();
                const userLon = wLon + offset();
                const userMarker = L.circleMarker([userLat, userLon], { radius: 9, color: '#2b6cb0', fillColor: '#2b6cb0', fillOpacity: 1 }).addTo(map);
                userMarker.bindPopup('<strong>You (simulated)</strong><div style="font-size:12px;color:#666">Randomly placed near a wildfire for demo</div>');
                // add an approximate radius (5 km) around the user to show proximity
                try {
                  const userCircle = L.circle([userLat, userLon], { radius: 5000, color: '#2b6cb0', weight: 1, fillColor: '#2b6cb0', fillOpacity: 0.12, interactive: false }).addTo(map);
                  // ensure the marker is visible above the circle
                  if ((userCircle as any).bringToBack) (userCircle as any).bringToBack();
                  if ((userMarker as any).bringToFront) (userMarker as any).bringToFront();
                } catch (e) {
                  console.error('Failed to draw user radius', e);
                }
                // center the map on the user's location for citizen view
                try {
                  const userZoom = 12;
                  if (map && typeof (map as any).flyTo === 'function') {
                    (map as any).flyTo([userLat, userLon], userZoom, { duration: 0.6 });
                  } else {
                    map.setView([userLat, userLon], userZoom);
                  }
                } catch (e) {
                  console.error('Failed to center map on user marker', e);
                }
              }
            } catch (e) {
              console.error('Failed to place simulated user marker', e);
            }
          } catch (err) {
            console.error('Failed to fetch EONET events', err);
          }
        }
      } catch (err) {
        console.error('Failed to load state GeoJSON or leaflet', err);
      }
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [ref]);

  return <div ref={ref} className="w-full h-[75vh] rounded-md overflow-hidden" />;
}
