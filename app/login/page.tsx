"use client"

import type React from "react"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const isMobile = useIsMobile()
  const { signIn, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-950 border-gray-800">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Не поддерживается</h1>
            <p className="text-gray-400">
              Это приложение разработано только для мобильных устройств. Пожалуйста, доступ к нему из вашего мобильного телефона.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      await signIn(email, password)
    } catch (error) {
      setError("Неверный email или пароль")
      console.error("Login error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Войти</h1>
          <p className="text-gray-400 text-sm">Войдите в ваш аккаунт</p>
        </div>

        {/* Login Form */}
        <Card className="bg-gray-950 border-gray-800">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm">
                  Электронная почта
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm">
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-gray-200 font-medium"
                disabled={loading}
              >
                {loading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            У вас нет аккаунта?{" "}
            <Link href="/register" className="text-white hover:text-gray-300 underline">
              Регистрация
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm underline">
            Вернуться на главную страницу
          </Link>
        </div>
      </div>
    </div>
  )
}
