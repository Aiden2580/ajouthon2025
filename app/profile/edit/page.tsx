"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Phone, Mail } from "lucide-react"
import Link from "next/link"

// TODO: API 연동 - 프로필 업데이트
// const updateProfile = async (profileData: any) => {
//   try {
//     const response = await fetch('/api/user/profile', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify(profileData)
//     })
//     return await response.json()
//   } catch (error) {
//     console.error('프로필 업데이트 실패:', error)
//     throw error
//   }
// }

export default function ProfileEditPage() {
  // HARDCODED: 실제 API에서 가져와야 할 사용자 데이터
  const [formData, setFormData] = useState({
    name: "홍길동",
    email: "student@ajou.ac.kr",
    phone: "010-1234-5678",
    studentId: "202012345",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: API 연동 - 프로필 업데이트 API 호출
    // try {
    //   await updateProfile(formData)
    //   alert('프로필이 성공적으로 업데이트되었습니다.')
    //   window.history.back()
    // } catch (error) {
    //   alert('프로필 업데이트에 실패했습니다.')
    // } finally {
    //   setIsLoading(false)
    // }

    // 임시 처리
    setTimeout(() => {
      setIsLoading(false)
      alert("프로필이 업데이트되었습니다.")
    }, 1000)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-medium ml-2">개인정보 수정</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        <Card className="mt-4 mx-4">
          <CardHeader>
            <CardTitle>개인정보 수정</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="pl-10"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">학번</Label>
                <Input
                  id="studentId"
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => updateFormData("studentId", e.target.value)}
                  disabled
                />
                <p className="text-xs text-gray-500">학번은 변경할 수 없습니다.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "저장 중..." : "저장하기"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
