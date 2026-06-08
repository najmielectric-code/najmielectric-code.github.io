'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeZoneClock {
  name: string
  timezone: string
  offset: number
}

const TIME_ZONES: TimeZoneClock[] = [
  { name: 'India (IST)', timezone: 'Asia/Kolkata', offset: 5.5 },
  { name: 'London (GMT)', timezone: 'Europe/London', offset: 0 },
  { name: 'New York (EST)', timezone: 'America/New_York', offset: -5 },
  { name: 'Tokyo (JST)', timezone: 'Asia/Tokyo', offset: 9 },
  { name: 'Sydney (AEDT)', timezone: 'Australia/Sydney', offset: 11 },
  { name: 'Dubai (GST)', timezone: 'Asia/Dubai', offset: 4 },
]

interface DisplayedTime {
  [key: string]: string
}

export default function TimeZoneClock() {
  const [time, setTime] = useState<DisplayedTime>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const updateTime = () => {
      const now = new Date()
      const newTime: DisplayedTime = {}

      TIME_ZONES.forEach((tz) => {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        newTime[tz.timezone] = formatter.format(now)
      })

      setTime(newTime)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-dark" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-primary to-dark p-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-electric/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric via-accent to-secondary mb-4">
            World Time Zones
          </h1>
          <p className="text-lg text-gray-300">
            Current time across different regions
          </p>
        </motion.div>

        {/* Clocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TIME_ZONES.map((tz, index) => (
            <motion.div
              key={tz.timezone}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-64 bg-gradient-to-br from-slate-800/80 via-primary/60 to-slate-900/80 rounded-2xl p-6 backdrop-blur-md border border-electric/20 hover:border-electric/50 transition-all duration-300 shadow-glass hover:shadow-glow overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-electric to-accent rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-300 -z-10" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between">
                  {/* Location Name */}
                  <div>
                    <h3 className="text-xl font-bold text-accent mb-1">
                      {tz.name}
                    </h3>
                    <p className="text-sm text-gray-400">{tz.timezone}</p>
                  </div>

                  {/* Digital Clock Display */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric to-accent tracking-wider">
                        {time[tz.timezone] || '00:00:00'}
                      </div>
                      {/* Blinking colon effect */}
                      <style jsx>{`
                        @keyframes blink {
                          0%, 49% { opacity: 1; }
                          50%, 100% { opacity: 0.3; }
                        }
                        .blink {
                          animation: blink 1s infinite;
                        }
                      `}</style>
                    </div>
                  </div>

                  {/* UTC Offset */}
                  <div className="text-right">
                    <span className="text-sm text-gray-400">
                      UTC {tz.offset >= 0 ? '+' : ''}{tz.offset}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Current Local Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-r from-accent/20 to-electric/20 rounded-2xl p-8 backdrop-blur-md border border-accent/30">
            <h2 className="text-2xl font-bold text-accent mb-4">Your Local Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Current Date & Time</p>
                <p className="text-2xl font-mono text-electric">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Local Time</p>
                <p className="text-2xl font-mono text-electric">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Time Zone</p>
                <p className="text-2xl font-mono text-accent">
                  {new Date().toLocaleString('en-US', { timeZoneName: 'short' }).split(' ').pop()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: '🌍', title: '6 Time Zones', desc: 'Track major regions' },
              { icon: '⏱️', title: 'Real-time Updates', desc: 'Second by second' },
              { icon: '📍', title: 'UTC Offset', desc: 'Calculate differences' },
              { icon: '🎯', title: 'Always Accurate', desc: 'Browser timezone' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800/50 to-primary/50 rounded-lg p-4 border border-electric/10 hover:border-electric/30 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-bold text-accent mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
