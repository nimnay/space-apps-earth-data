import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Map, 
  BarChart2,
  Globe
} from "lucide-react";

const routes = [
  {
    name: "Dashboard",
    path: "/",
    icon: <LayoutDashboard className="w-4 h-4 mr-2" />
  },
  {
    name: "AQI Map",
    path: "/aqi-map",
    icon: <Map className="w-4 h-4 mr-2" />
  },
  {
    name: "AQI Anderson",
    path: "/aqi-anderson",
    icon: <BarChart2 className="w-4 h-4 mr-2" />
  },
  {
    name: "Report Agent",
    path: "/report",
    icon: <FileText className="w-4 h-4 mr-2" />
  },
  {
    name: "Chat",
    path: "/chat",
    icon: <MessageSquare className="w-4 h-4 mr-2" />
  },
  {
    name: "Global View",
    path: "/global",
    icon: <Globe className="w-4 h-4 mr-2" />
  }
];

export function Sidebar() {
  return (
    <div className="pb-12 border-r min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">
            Air Quality Monitor
          </h2>
          <Separator className="mb-4" />
          <ScrollArea className="px-1">
            <div className="space-y-1">
              {routes.map((route) => (
                <Link key={route.path} href={route.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal"
                  >
                    {route.icon}
                    {route.name}
                  </Button>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}