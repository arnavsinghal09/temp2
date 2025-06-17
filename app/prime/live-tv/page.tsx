import ContentRow from "../../components/ContentRow";
import { Play, Calendar, Clock, Tv } from "lucide-react";
import Link from "next/link";

// Live TV specific content
const liveChannels = [
  {
    id: "live-1",
    title: "Prime Video Sports",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Prime+Sports+LIVE",
    badge: "LIVE",
    isPrime: true,
    year: 2024,
    duration: "Live",
    rating: "Sports",
    genre: "Sports",
  },
  {
    id: "live-2",
    title: "Prime Video News",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Prime+News+LIVE",
    badge: "LIVE",
    isPrime: true,
    year: 2024,
    duration: "Live",
    rating: "News",
    genre: "News",
  },
  {
    id: "live-3",
    title: "Thursday Night Football",
    thumbnail: "/placeholder.svg?height=315&width=560&text=NFL+Thursday+Night",
    badge: "LIVE",
    isPrime: true,
    year: 2024,
    duration: "Live",
    rating: "NFL",
    genre: "Sports",
  },
  {
    id: "live-4",
    title: "Prime Video Entertainment",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Prime+Entertainment",
    badge: "LIVE",
    isPrime: true,
    year: 2024,
    duration: "Live",
    rating: "Entertainment",
    genre: "Entertainment",
  },
  {
    id: "live-5",
    title: "Prime Video Movies",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Prime+Movies+LIVE",
    badge: "LIVE",
    isPrime: true,
    year: 2024,
    duration: "Live",
    rating: "Movies",
    genre: "Movies",
  },
];

const upcomingEvents = [
  {
    id: "upcoming-1",
    title: "NFL Thursday Night Football",
    thumbnail: "/placeholder.svg?height=315&width=560&text=NFL+Upcoming",
    badge: "UPCOMING",
    isPrime: true,
    year: 2024,
    duration: "8:00 PM ET",
    rating: "Sports",
    genre: "NFL",
  },
  {
    id: "upcoming-2",
    title: "Premier League Match",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Premier+League",
    badge: "UPCOMING",
    isPrime: true,
    year: 2024,
    duration: "3:00 PM ET",
    rating: "Sports",
    genre: "Soccer",
  },
  {
    id: "upcoming-3",
    title: "Prime Video Presents",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Prime+Presents",
    badge: "UPCOMING",
    isPrime: true,
    year: 2024,
    duration: "9:00 PM ET",
    rating: "Special",
    genre: "Entertainment",
  },
  {
    id: "upcoming-4",
    title: "Live Concert Series",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Live+Concert",
    badge: "UPCOMING",
    isPrime: true,
    year: 2024,
    duration: "7:00 PM ET",
    rating: "Music",
    genre: "Concert",
  },
  {
    id: "upcoming-5",
    title: "Breaking News Special",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Breaking+News",
    badge: "UPCOMING",
    isPrime: true,
    year: 2024,
    duration: "6:00 PM ET",
    rating: "News",
    genre: "News",
  },
];

export default function LiveTVPage() {
  return (
    <main className="min-h-screen bg-[#0F171E] pt-20 page-transition">
      {/* Live TV Hero Section */}
      <div className="relative h-[75vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-[#0F171E] via-[#1a2332] to-[#0F171E]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex items-center h-full px-8 md:px-16">
          <div className="max-w-3xl hero-content">
            <div className="mb-6 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Tv className="text-white w-5 h-5" />
                </div>
                <span className="text-red-500 font-semibold uppercase tracking-wider text-sm flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  Live TV
                </span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 text-white tracking-tight leading-none">
              LIVE TV
            </h1>

            <p className="text-xl text-gray-200 leading-relaxed mb-10 max-w-2xl">
              Watch live sports, news, and entertainment. Stream Thursday Night
              Football, breaking news, and exclusive live events - all included
              with your Prime membership.
            </p>

            <div className="flex items-center space-x-4 mb-8">
              <Link
                href="/watch/live-1"
                className="group flex items-center space-x-4 bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 play-button shadow-lg hover:shadow-xl"
              >
                <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform duration-300" />
                <div className="text-left">
                  <div className="text-sm opacity-90">Watch</div>
                  <div className="text-lg font-black">Live Now</div>
                </div>
              </Link>

              <div className="flex items-center space-x-2 text-gray-300">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">View Schedule</span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-full mr-3 shadow-lg"></div>
              <span className="text-white font-semibold">
                Included with Prime
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 space-y-12">
        <ContentRow
          title="Live Now"
          items={liveChannels}
          seeMoreLink="/live-tv/channels"
        />
        <ContentRow
          title="Upcoming Events"
          items={upcomingEvents}
          seeMoreLink="/live-tv/schedule"
        />

        {/* Live TV Schedule Section */}
        <div className="px-8 md:px-16">
          <h2 className="text-white text-2xl font-bold mb-6">
            Today's Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                time: "6:00 PM",
                title: "Evening News",
                channel: "Prime News",
                live: false,
              },
              {
                time: "8:00 PM",
                title: "Thursday Night Football",
                channel: "Prime Sports",
                live: true,
              },
              {
                time: "11:00 PM",
                title: "Late Night Entertainment",
                channel: "Prime Entertainment",
                live: false,
              },
            ].map((program, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#00A8E1]" />
                    <span className="text-white font-semibold">
                      {program.time}
                    </span>
                  </div>
                  {program.live && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                      LIVE
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {program.title}
                </h3>
                <p className="text-gray-400 text-sm">{program.channel}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
