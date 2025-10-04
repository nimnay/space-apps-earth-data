import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AeroGuard AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Your intelligent companion for air quality and wildfire monitoring in Upstate South Carolina.
          Get real-time advice for outdoor activities and emergency alerts.
        </p>
        <Link href="/chat">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg transition-all hover:scale-105">
            Start Chatting with AeroGuard
          </Button>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card className="p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <Image
                src="/globe.svg"
                alt="Air Quality"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Air Quality Monitoring</h3>
              <p className="text-muted-foreground">
                Get personalized advice about air quality conditions for your outdoor activities
                in the Clemson area. Perfect for runners, cyclists, and outdoor enthusiasts.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
              <Image
                src="/window.svg"
                alt="Wildfire"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Wildfire Alerts</h3>
              <p className="text-muted-foreground">
                Stay informed about wildfire conditions and receive real-time guidance
                for emergency preparedness and safety measures.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* How It Works Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Select Mode</h3>
            <p className="text-muted-foreground">
              Choose between air quality monitoring or wildfire alert modes
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Ask Questions</h3>
            <p className="text-muted-foreground">
              Inquire about current conditions or get activity recommendations
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Get Smart Advice</h3>
            <p className="text-muted-foreground">
              Receive personalized guidance based on real-time data
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <h2 className="text-2xl font-bold mb-4">
            Ready to monitor air quality in Upstate SC?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start a conversation with AeroGuard AI and get instant insights about your environment.
          </p>
          <Link href="/chat">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Get Started
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
