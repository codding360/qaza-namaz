"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Settings, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { usePrayerStats } from "@/hooks/usePrayerStats"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
  const isMobile = useIsMobile()
  const { user, loading, signOut, isAuthenticated } = useAuth()
  const { prayerStats, loading: statsLoading, totalSkipped, yearsSkipped, updatePrayerCount } = usePrayerStats(user?.id || null)
  const router = useRouter()

  // Handle navigation to login when not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4 bg-gray-950 p-8 rounded-lg border border-gray-800">
          <h1 className="text-2xl font-bold text-white">Не поддерживается</h1>
          <p className="text-gray-300 max-w-md">
            Это приложение разработано только для мобильных устройств. Пожалуйста, доступ к нему из вашего мобильного телефона.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }

  // Calculate user age
  const currentYear = new Date().getFullYear()
  const userAge = user ? currentYear - user.birth_year : 0

  // Prayer configurations
  const prayerConfigs = [
    { name: "Багымдат", rakats: "2 рекет" },
    { name: "Бешим", rakats: "4 рекет" },
    { name: "Аср", rakats: "4 рекет" },
    { name: "Шам", rakats: "3 рекет" },
    { name: "Куптан", rakats: "4 рекет" },
    { name: "Витр Важиб", rakats: "3 рекет" },
  ]

  // Combine prayer configs with stats
  const prayers = prayerConfigs.map(config => {
    const stat = prayerStats.find(p => p.prayer_name === config.name)
    return {
      ...config,
      skippedCount: stat?.skipped_count || 0,
    }
  })

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6 pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:bg-transparent hover:text-red-600 p-2"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-medium text-white">Профиль</h2>
        <Button disabled variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center space-y-4 mb-8">
        <Avatar className="w-32 h-32 border-2 border-gray-800">
          <AvatarImage src="/muslim-man-profile.png" alt={`${user?.first_name} ${user?.last_name}`} />
          <AvatarFallback className="bg-gray-900 text-white text-2xl">
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="text-center space-y-1">
          <h1 className="text-xl font-medium text-white">
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-gray-400 text-base">{userAge} лет</p>
        </div>
      </div>

      {/* Statistics Card */}
      <Card className="bg-gray-950 border-gray-800 mb-6">
        <CardContent className="p-0">
          <div className="grid grid-cols-2">
            {/* First 50% - Skipped Namaz Count */}
            <div className="p-6 border-r border-gray-800">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">
                  {statsLoading ? "..." : totalSkipped.toLocaleString()}
                </div>
                <div className="text-sm text-gray-300 leading-tight">Намазов <br />было пропущено</div>
              </div>
            </div>

            {/* Second 50% - Years Skipped */}
            <div className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">
                  {statsLoading ? "..." : yearsSkipped.toFixed(0)}
                </div>
                <div className="text-sm text-gray-300 leading-tight">Лет <br />пропущенных намазов</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {prayers.map((prayer, index) => (
          <Card key={index} className="bg-gray-950 border-gray-800">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-white mb-0.5">{prayer.name}</h3>
                  <p className="text-xs text-gray-400">{prayer.rakats}</p>
                </div>
                <div className="text-2xl font-bold text-white">
                  {statsLoading ? "..." : prayer.skippedCount}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium text-sm h-8" 
                  size="sm"
                  onClick={() => updatePrayerCount(prayer.name, 1)}
                  disabled={statsLoading}
                >
                  Карз (+1)
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium text-sm h-8" 
                  size="sm"
                  onClick={() => updatePrayerCount(prayer.name, -1)}
                  disabled={statsLoading}
                >
                  Казы (-1)
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
