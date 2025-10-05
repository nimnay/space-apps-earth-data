import MapViewer from "@/components/map-viewer";

export const metadata = {
  title: "Regional Map",
  description: "Map showing Georgia, North Carolina, South Carolina, and Tennessee",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Regional Map</h1>
      <p className="mb-6 text-muted-foreground">Showing Georgia, North Carolina, South Carolina, and Tennessee.</p>
  <MapViewer />
    </main>
  );
}
