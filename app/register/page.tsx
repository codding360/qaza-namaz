"use client"

import type React from "react"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FormData {
  firstName: string
  lastName: string
  year: string
  gender: 'male' | 'female'
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const isMobile = useIsMobile()
  const { signUp, loading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    year: "",
    gender: "male",
    email: "",
    password: "",
    confirmPassword: "",
  })

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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.firstName && formData.lastName && formData.year) {
      setCurrentStep(2)
    }
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают")
      return
    }
    
    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthYear: parseInt(formData.year),
        gender: formData.gender,
      })
    } catch (error) {
      setError("Ошибка при регистрации. Попробуйте еще раз.")
      console.error("Registration error:", error)
    }
  }

  const goBackToStep1 = () => {
    setCurrentStep(1)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Регистрация</h1>
          <p className="text-gray-400 text-sm">
            {currentStep === 1 ? "Введите ваши персональные данные" : "Введите данные аккаунта"}
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className={`w-3 h-3 rounded-full ${currentStep === 1 ? "bg-white" : "bg-gray-600"}`} />
            <div className={`w-3 h-3 rounded-full ${currentStep === 2 ? "bg-white" : "bg-gray-600"}`} />
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Card className="bg-gray-950 border-gray-800">
            <CardContent className="p-6">
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white text-sm">
                    Имя
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
                    placeholder="Введите ваше имя"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white text-sm">
                    Фамилия
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
                    placeholder="Введите вашу фамилию"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-white text-sm">
                    Год рождения
                  </Label>
                  <select
                    id="year"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 focus:border-gray-600 focus:outline-none"
                    required
                  >
                    <option value="">Выберите год</option>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year} год
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-white text-sm">
                    Пол
                  </Label>
                  <RadioGroup 
                    value={formData.gender} 
                    onValueChange={(value) => handleInputChange("gender", value)}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div>
                      <RadioGroupItem
                        value="male"
                        id="male"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="male"
                        className="text-white flex flex-col items-center justify-center rounded-md border-2 border-gray-700 bg-gray-900 p-4  cursor-pointer peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-black [&:has([data-state=checked])]:border-white [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:text-black"
                      >
                        <span className="text-lg">👨</span>
                        <span className="text-sm font-medium">Мужской</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="female"
                        id="female"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="female"
                        className="text-white flex flex-col items-center justify-center rounded-md border-2 border-gray-700 bg-gray-900 p-4  cursor-pointer peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-black [&:has([data-state=checked])]:border-white [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:text-black"
                      >
                        <span className="text-lg">👩</span>
                        <span className="text-sm font-medium">Женский</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 font-medium">
                  Следующий шаг
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Account Information */}
        {currentStep === 2 && (
          <Card className="bg-gray-950 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={goBackToStep1}
                  className="text-gray-400 hover:text-white p-0 h-auto"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Назад
                </Button>
              </div>

              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-sm">
                    Электронная почта
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white text-sm">
                    Подтверждение пароля
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
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
                  {loading ? "Регистрация..." : "Регистрация"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            У вас есть аккаунт?{" "}
            <Link href="/login" className="text-white hover:text-gray-300 underline">
              Войти
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
