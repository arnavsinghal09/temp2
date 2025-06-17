import { Check, Star, Zap, Crown, Gift } from "lucide-react"

const subscriptionPlans = [
  {
    id: "prime",
    name: "Prime Video",
    price: "Included",
    period: "with Prime membership",
    description: "Access to thousands of movies and TV shows",
    features: [
      "Unlimited streaming of Prime Video content",
      "Ad-free viewing experience",
      "Download for offline viewing",
      "4K Ultra HD and HDR content",
      "Multiple device streaming",
    ],
    color: "from-[#00A8E1] to-[#1FB6FF]",
    icon: Crown,
    popular: true,
  },
  {
    id: "channels",
    name: "Prime Video Channels",
    price: "$2.99+",
    period: "per month per channel",
    description: "Add premium channels to your Prime Video",
    features: [
      "HBO Max, Showtime, Starz and more",
      "No cable subscription required",
      "Cancel anytime",
      "Stream on all your devices",
      "Free trials available",
    ],
    color: "from-purple-500 to-purple-600",
    icon: Zap,
    popular: false,
  },
  {
    id: "rent-buy",
    name: "Rent or Buy",
    price: "$3.99+",
    period: "per title",
    description: "Latest movies and TV shows",
    features: [
      "New releases and blockbusters",
      "Rent for 48 hours or buy to own",
      "4K Ultra HD available",
      "Watch across all devices",
      "No subscription required",
    ],
    color: "from-green-500 to-green-600",
    icon: Gift,
    popular: false,
  },
]

const availableChannels = [
  {
    id: "hbo",
    name: "HBO Max",
    price: "$14.99/month",
    thumbnail: "/placeholder.svg?height=100&width=200&text=HBO+MAX",
    trial: "7-day free trial",
  },
  {
    id: "showtime",
    name: "Showtime",
    price: "$10.99/month",
    thumbnail: "/placeholder.svg?height=100&width=200&text=SHOWTIME",
    trial: "30-day free trial",
  },
  {
    id: "starz",
    name: "Starz",
    price: "$8.99/month",
    thumbnail: "/placeholder.svg?height=100&width=200&text=STARZ",
    trial: "7-day free trial",
  },
  {
    id: "paramount",
    name: "Paramount+",
    price: "$5.99/month",
    thumbnail: "/placeholder.svg?height=100&width=200&text=PARAMOUNT+",
    trial: "7-day free trial",
  },
  {
    id: "discovery",
    name: "Discovery+",
    price: "$4.99/month",
    thumbnail: "/placeholder.svg?height=100&width=200&text=DISCOVERY+",
    trial: "7-day free trial",
  },
  {
    id: "amc",
    name: "AMC+",
    price: "$8.99/month",
    thumbnail: "/placeholder.svg?height=100&width=200&text=AMC+",
    trial: "7-day free trial",
  },
]

export default function SubscriptionsPage() {
  return (
    <main className="min-h-screen bg-[#0F171E] pt-20 page-transition">
      {/* Hero Section */}
      <div className="relative py-20 px-8 md:px-16">
        <div className="max-w-4xl mx-auto text-center hero-content">
          <h1 className="text-6xl md:text-7xl font-black mb-6 text-white tracking-tight leading-none">SUBSCRIPTIONS</h1>
          <p className="text-xl text-gray-200 leading-relaxed mb-10 max-w-3xl mx-auto">
            Choose your perfect entertainment package. From Prime Video originals to premium channels, find the content
            that matches your taste and budget.
          </p>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="px-8 md:px-16 py-12">
        <h2 className="text-white text-3xl font-bold mb-8 text-center">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {subscriptionPlans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <div
                key={plan.id}
                className={`relative bg-white/5 rounded-2xl p-8 backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:bg-white/10 ${
                  plan.popular ? "border-[#00A8E1] shadow-lg shadow-[#00A8E1]/20" : "border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-black text-white mb-1">{plan.price}</div>
                  <div className="text-gray-400 text-sm">{plan.period}</div>
                </div>

                <p className="text-gray-300 text-center mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-200">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full bg-gradient-to-r ${plan.color} text-white py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                >
                  {plan.id === "prime" ? "Included with Prime" : "Get Started"}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Available Channels */}
      <div className="px-8 md:px-16 py-12">
        <h2 className="text-white text-3xl font-bold mb-8">Available Channels</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {availableChannels.map((channel) => (
            <div
              key={channel.id}
              className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="aspect-video bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                <img
                  src={channel.thumbnail || "/placeholder.svg"}
                  alt={channel.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{channel.name}</h3>
              <p className="text-gray-400 text-xs mb-2">{channel.price}</p>
              <span className="text-green-400 text-xs font-medium">{channel.trial}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="px-8 md:px-16 py-12 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-white text-3xl font-bold mb-12 text-center">Why Choose Prime Video?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Crown,
                title: "Award-Winning Originals",
                description: "Exclusive Prime Video originals and award-winning content you can't find anywhere else.",
              },
              {
                icon: Zap,
                title: "Stream Anywhere",
                description: "Watch on your TV, phone, tablet, or computer. Download for offline viewing.",
              },
              {
                icon: Gift,
                title: "No Commitments",
                description: "Cancel anytime. No contracts, no hidden fees. Just great entertainment.",
              },
            ].map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
