"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Shield, 
  Bell, 
  Upload, 
  Search, 
  CheckCircle2, 
  Users, 
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Lock
} from "lucide-react"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState(237)

  useEffect(() => {
    // Fetch current waitlist count on mount
    fetch("/api/waitlist")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setWaitlistCount(data.count)
        }
      })
      .catch(err => console.error("Failed to fetch waitlist count:", err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email,
          source: "landing_page"
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
        setEmail("")
        // Update the count with the new value from the server
        if (data.data?.count) {
          setWaitlistCount(data.data.count)
        }
      } else {
        alert(data.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-teal-500/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Zavvi" 
                className="w-10 h-10"
              />
              <div className="flex flex-col">
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Zavvi
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a 
                href="#how-it-works" 
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                How it Works
              </a>
              <a 
                href="#benefits" 
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Benefits
              </a>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white border-0 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Join Waitlist
                <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/20 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">AI-Powered Money Recovery</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Never Miss Hidden
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Warranties & Refunds
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
                Automatically discover warranties, return policies, and brand perks from your purchases. 
                Get alerts before they expire.
              </p>
            </div>

            {/* Hero CTA Form */}
            <div className="max-w-lg mx-auto pt-4">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 h-14 px-5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                    />
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="h-14 px-8 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white border-0 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all whitespace-nowrap font-medium"
                    >
                      {isSubmitting ? "Joining..." : "Join Waitlist"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-slate-400">
                    <Lock className="w-3.5 h-3.5 inline mr-1.5" />
                    Free forever • No credit card required
                  </p>
                </form>
              ) : (
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8 backdrop-blur-sm">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-white mb-1">You're on the list!</p>
                  <p className="text-sm text-slate-300">Check your email for next steps</p>
                </div>
              )}
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 border-2 border-slate-900 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">JD</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 border-2 border-slate-900 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">SM</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 border-2 border-slate-900 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">AK</span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{waitlistCount}+ people</p>
                  <p className="text-xs text-slate-400">on the waitlist</p>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-700"></div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">4.9/5</span>
                <span className="text-xs text-slate-400">rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Three simple steps to start recovering money from every purchase
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { 
                icon: Upload,
                number: "01",
                title: "Upload Receipts", 
                desc: "Snap photos or forward purchase emails. Our AI instantly extracts all the details."
              },
              { 
                icon: Search,
                number: "02",
                title: "Find Benefits", 
                desc: "We scan 500+ brand policies to find every hidden warranty, return window, and perk."
              },
              { 
                icon: Bell,
                number: "03",
                title: "Get Alerts", 
                desc: "Receive timely reminders before warranties and return deadlines expire."
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                {/* Connecting Line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-20 left-full w-full h-px bg-gradient-to-r from-blue-500/30 to-transparent -translate-y-1/2 z-0"></div>
                )}
                
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                    {item.number}
                  </div>
                  
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-teal-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                    <item.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section id="benefits" className="relative py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Zavvi?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              The smartest way to maximize value from every purchase
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: "Never Miss Warranties", 
                desc: "Automatic tracking of all product warranties with proactive expiration alerts."
              },
              { 
                icon: Zap, 
                title: "Instant Savings", 
                desc: "Average users save $1,200+ annually by claiming benefits they didn't know existed."
              },
              { 
                icon: Lock, 
                title: "Bank-Level Security", 
                desc: "256-bit encryption. Your data is private, secure, and never shared with anyone."
              }
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Trust Bar */}
      <section className="relative py-20 px-6 lg:px-8 overflow-hidden">
        <div className="text-center mb-12">
          <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Trusted by Shoppers At</p>
        </div>
        
        <div className="relative">
          <div className="flex animate-scroll gap-12">
            {[
              { name: 'Costco', domain: 'costco.com' },
              { name: 'Apple', domain: 'apple.com' },
              { name: 'Hoka', domain: 'hoka.com' },
              { name: 'REI', domain: 'rei.com' },
              { name: 'Patagonia', domain: 'patagonia.com' },
              { name: 'Costco', domain: 'costco.com' },
              { name: 'Apple', domain: 'apple.com' },
              { name: 'Hoka', domain: 'hoka.com' },
              { name: 'REI', domain: 'rei.com' },
              { name: 'Patagonia', domain: 'patagonia.com' }
            ].map((brand, i) => (
              <div key={i} className="flex-shrink-0">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-full w-28 h-28 flex items-center justify-center p-6 border border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all hover:scale-105">
                  <img 
                    src={`https://logo.clearbit.com/${brand.domain}`}
                    alt={`${brand.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = `<span class="text-slate-300 font-bold text-sm text-center">${brand.name}</span>`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* What You'll Get */}
      <section className="relative py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300 font-semibold">Limited Time Offer</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Early Members Get
            </h2>
            <p className="text-lg text-slate-300">
              Join now and unlock exclusive founding member benefits
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { text: "Lifetime Premium Access", subtext: "Worth $95/year — yours free forever", highlight: true },
              { text: "Priority Support", subtext: "Skip the line with dedicated assistance" },
              { text: "Early Feature Access", subtext: "Try new features before anyone else" },
              { text: "Exclusive Hack Database", subtext: "Curated brand perks & insider tips" },
              { text: "Founding Member Badge", subtext: "Show your early adopter status" },
              { text: "Product Roadmap Input", subtext: "Help shape future features" }
            ].map((item, i) => (
              <div 
                key={i} 
                className={`flex items-start gap-4 p-6 rounded-2xl border transition-all duration-300 ${
                  item.highlight 
                    ? 'bg-gradient-to-r from-blue-500/10 to-teal-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10' 
                    : 'bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.highlight 
                    ? 'bg-gradient-to-br from-blue-600 to-teal-600 shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-700'
                }`}>
                  <CheckCircle2 className={`w-6 h-6 ${item.highlight ? 'text-white' : 'text-blue-400'}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-bold mb-1 ${item.highlight ? 'text-white text-lg' : 'text-white'}`}>
                    {item.text}
                  </p>
                  <p className="text-sm text-slate-300">{item.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Waitlist CTA */}
      <section id="waitlist" className="relative py-24 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-10 lg:p-14 border border-slate-700 shadow-2xl shadow-blue-500/10">
              <div className="text-center space-y-8">
                {/* Scarcity Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span className="text-sm text-orange-300 font-bold">
                    Only {Math.max(1000 - waitlistCount, 0)} Lifetime Spots Remaining
                  </span>
                </div>

                {/* Heading */}
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Ready to Start Saving?
                  </h2>
                  <p className="text-lg text-slate-300">
                    Join the waitlist today and get <span className="font-bold text-blue-400">lifetime premium access</span> when we launch
                  </p>
                </div>

                {/* Form */}
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 h-14 px-5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                      />
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="h-14 px-8 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white border-0 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all whitespace-nowrap font-medium"
                      >
                        {isSubmitting ? "Joining..." : "Claim Your Spot"}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-slate-400">
                      <Lock className="w-3.5 h-3.5 inline mr-1.5" />
                      Free forever • No credit card • Unsubscribe anytime
                    </p>
                  </form>
                ) : (
                  <div className="pt-4">
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8 backdrop-blur-sm">
                      <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">You're On The List! 🎉</h3>
                      <p className="text-slate-300">
                        Check your email for next steps and exclusive early access details.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/logo.png" alt="Zavvi" className="w-8 h-8" />
            <span className="text-xl font-semibold text-white">Zavvi</span>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            The smart way to unlock hidden money from your purchases
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <p className="text-slate-500 text-xs mt-8">
            © 2025 Zavvi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}