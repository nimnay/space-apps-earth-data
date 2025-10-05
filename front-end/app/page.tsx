import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 relative">
      {/* Wildfire Forest Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none -z-10"
        style={{
          backgroundImage:
            'url("https://t4.ftcdn.net/jpg/01/75/40/31/360_F_175403123_P85g9O1kpaTEDuw1I10DnK3dss0tGC3V.jpg")',
        }}
      ></div>
      {/* Fire Particles Background */}
      <div className="fire-particles absolute inset-0 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="text-center mb-20 relative z-10">
        <div className="relative inline-block">
          <h1 className="text-7xl font-black mb-8 text-slate-900 relative z-10 bg-white/40 px-8 py-4 rounded-2xl shadow-lg border border-slate-200">
            AEROGUARD
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700/10 to-slate-600/10 blur-3xl animate-pulse"></div>
        </div>
        <p className="text-2xl text-white max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
          <span className="text-blue-950 font-bold text-3xl">
            PROFESSIONAL AIR QUALITY MONITORING
          </span>
          <br />
          <span className="text-xl text-slate-900 font-bold">
            Real-time environmental monitoring and air quality alerts for
            Upstate South Carolina
          </span>
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/chat">
            <Button className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800 text-white px-12 py-6 text-2xl font-black rounded-2xl shadow-2xl transition-all hover:scale-105 fire-glow">
              EMERGENCY CHAT
            </Button>
          </Link>
          <Link href="/map">
            <Button className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-800 hover:to-slate-700 text-white px-12 py-6 text-2xl font-black rounded-2xl shadow-2xl transition-all hover:scale-105 fire-glow">
              MONITORING MAP
            </Button>
          </Link>
        </div>
      </div>

      {/* Live Data Visualization */}
      <div className="grid md:grid-cols-2 gap-12 mb-20">
        {/* Air Quality Monitor */}
        <Card className="data-viz-card hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black text-white">🌪️ AIR QUALITY</h3>
              <div className="metric-circle">
                <span className="text-2xl font-bold text-white relative z-10">
                  78
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">78</div>
                <div className="text-sm text-white font-bold">AQI</div>
                <div className="text-xs text-white bg-slate-500/20 px-3 py-1 rounded-full mt-2 font-bold">
                  MODERATE
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">23</div>
                <div className="text-sm text-white font-bold">PM2.5</div>
                <div className="text-xs text-white bg-slate-400/20 px-3 py-1 rounded-full mt-2 font-bold">
                  GOOD
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">45</div>
                <div className="text-sm text-white font-bold">PM10</div>
                <div className="text-xs text-white bg-slate-600/20 px-3 py-1 rounded-full mt-2 font-bold">
                  MODERATE
                </div>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-6 border border-slate-200/50">
              <div className="flex items-center justify-between text-lg">
                <span className="text-white font-bold">CURRENT STATUS</span>
                <span className="text-white font-black">
                  ✅ SAFE FOR OUTDOOR ACTIVITIES
                </span>
              </div>
              <div className="status-bar mt-4"></div>
            </div>
          </div>
        </Card>

        {/* Wildfire Status */}
        <Card className="hot-zone hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black text-white">
                🌡️ ENVIRONMENTAL STATUS
              </h3>
              <div className="metric-circle">
                <span className="text-2xl font-bold text-white relative z-10">
                  0
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">0</div>
                <div className="text-sm text-white font-bold">ALERTS</div>
                <div className="text-xs text-white bg-slate-500/60 px-3 py-1 rounded-full mt-2 font-bold">
                  SAFE
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">2</div>
                <div className="text-sm text-white font-bold">MONITORING</div>
                <div className="text-xs text-white bg-slate-400/60 px-3 py-1 rounded-full mt-2 font-bold">
                  WATCH
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">15</div>
                <div className="text-sm text-white font-bold">STABLE</div>
                <div className="text-xs text-white bg-slate-600/60 px-3 py-1 rounded-full mt-2 font-bold">
                  NORMAL
                </div>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-6 border border-slate-200/50">
              <div className="flex items-center justify-between text-lg">
                <span className="text-slate-800 font-bold">RISK LEVEL</span>
                <span className="text-slate-700 font-black">
                  🟢 LOW - NO IMMEDIATE THREAT
                </span>
              </div>
              <div className="status-bar mt-4"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <Card className="emergency-card hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-800 to-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 fire-glow">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-2xl font-black mb-4 text-white">
              DATA ANALYTICS
            </h3>
            <p className="text-white text-base leading-relaxed mb-6">
              View detailed air quality trends and environmental statistics for
              better decision making
            </p>
            <Link href="/aqi-anderson">
              <Button className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-800 hover:to-slate-700 text-white font-bold py-3 rounded-xl">
                VIEW ANALYTICS
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="emergency-card hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-700 to-green-800 rounded-full flex items-center justify-center mx-auto mb-6 fire-glow">
              <span className="text-3xl">📈</span>
            </div>
            <h3 className="text-2xl font-black mb-4 text-white">
              TRENDS & REPORTS
            </h3>
            <p className="text-white text-base leading-relaxed mb-6">
              Access historical data, generate reports, and track environmental
              changes over time
            </p>
            <Link href="/report">
              <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600 text-white font-bold py-3 rounded-xl">
                VIEW REPORTS
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="emergency-card hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-800 to-green-900 rounded-full flex items-center justify-center mx-auto mb-6 fire-glow">
              <span className="text-3xl">🌍</span>
            </div>
            <h3 className="text-2xl font-black mb-4 text-white">GLOBAL VIEW</h3>
            <p className="text-white text-base leading-relaxed mb-6">
              Monitor environmental conditions worldwide and compare with local
              data
            </p>
            <Link href="/global">
              <Button className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800 text-white font-bold py-3 rounded-xl">
                GLOBAL DATA
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Emergency Actions */}
      <Card className="emergency-card hover:shadow-2xl transition-all duration-500">
        <div className="relative z-10 text-center">
          <div className="relative inline-block mb-8">
            <h2 className="text-5xl font-black mb-4 text-white relative z-10">
              EMERGENCY RESPONSE CENTER
            </h2>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/15 to-green-500/15 blur-2xl animate-pulse"></div>
          </div>
          <p className="text-xl text-white mb-12 max-w-3xl mx-auto font-medium">
            Immediate access to emergency services and critical information for
            environmental and air quality emergencies
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <Link href="/chat">
              <div className="p-8 bg-gradient-to-br from-green-100/40 to-green-50/40 border border-green-200/60 rounded-2xl hover:border-green-300/80 transition-all duration-500 hover:shadow-2xl cursor-pointer hover:scale-105">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-900 to-green-950 rounded-full flex items-center justify-center fire-glow">
                    <span className="text-3xl">💬</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-black text-white">
                      EMERGENCY CHAT
                    </h3>
                    <p className="text-white text-lg">
                      Get immediate assistance and guidance
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/map">
              <div className="p-8 bg-gradient-to-br from-green-100/40 to-green-50/40 border border-green-200/60 rounded-2xl hover:border-green-300/80 transition-all duration-500 hover:shadow-2xl cursor-pointer hover:scale-105">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-900 to-green-950 rounded-full flex items-center justify-center fire-glow">
                    <span className="text-3xl">🗺️</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-black text-white">
                      MONITORING MAP
                    </h3>
                    <p className="text-white text-lg">
                      Real-time environmental tracking and alerts
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex justify-center items-center text-white font-bold text-xl">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
            SYSTEM STATUS: ACTIVE MONITORING
          </div>
        </div>
      </Card>
    </div>
  );
}
