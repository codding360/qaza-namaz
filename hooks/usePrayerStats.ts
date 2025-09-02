"use client"

import { useEffect, useState } from 'react'
import { supabase, PrayerStats } from '@/lib/supabase'

export function usePrayerStats(userId: string | null) {
  const [prayerStats, setPrayerStats] = useState<PrayerStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    fetchPrayerStats()
  }, [userId])

  const fetchPrayerStats = async () => {
    try {
      const { data, error } = await supabase
        .from('prayer_stats')
        .select('*')
        .eq('user_id', userId)
        .order('prayer_name')

      if (error) {
        console.error('Error fetching prayer stats:', error)
        return
      }

      setPrayerStats(data || [])
    } catch (error) {
      console.error('Error fetching prayer stats:', error)
    }
  }



  const updatePrayerCount = async (prayerName: string, increment: number = 1) => {
    if (!userId) return

    try {
      // Update prayer stats using the custom RPC function
      const { error: prayerError } = await supabase.rpc('update_prayer_count', {
        user_id_param: userId,
        prayer_name_param: prayerName,
        delta: increment
      })

      if (prayerError) throw prayerError

      // Refresh data
      await fetchPrayerStats()
    } catch (error) {
      console.error('Error updating prayer count:', error)
      throw error
    }
  }

  // Calculate totals from prayer stats
  const totalSkipped = prayerStats.reduce((sum, stat) => sum + stat.skipped_count, 0)
  
  // Calculate years skipped: total_skipped / (total_rakats_per_day) / 365
  // Daily rakats: Fajr(2) + Dhuhr(4) + Asr(4) + Maghrib(3) + Isha(4) + Witr(3) = 20
  const yearsSkipped = totalSkipped / 6 / 365

  return {
    prayerStats,
    loading,
    totalSkipped,
    yearsSkipped,
    updatePrayerCount,
    refreshStats: () => {
      fetchPrayerStats()
    }
  }
}
