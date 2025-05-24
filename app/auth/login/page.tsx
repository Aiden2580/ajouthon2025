"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: API 연동 - 로그인 API 호출
    // try {
    //   const response = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email, password }),
    //   })
    //
    //   if (response.ok) {
    //     const data = await response.json()
    //     // 토큰 저장 (localStorage 또는 쿠키)
    //     localStorage.setItem('token', data.token)
    //     // 사용자 정보 저장
    //     localStorage.setItem('user', JSON.stringify(data.user))
    //     // 메인 페이지로 리다이렉트
    //     window.location.href = '/'
    //   } else {
    //     const error = await response.json()
    //     alert(error.message || '로그인에 실패했습니다.')
    //   }
    // } catch (error) {
    //   console.error('로그인 오류:', error)
    //   alert('네트워크 오류가 발생했습니다.')
    // }

    // 임시 로그인 로직
    console.log("Login:", { email, password })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-blue-600 ml-2">아주오더</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>로그인</CardTitle>
            <CardDescription>아주대학교 이메일로 로그인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@ajou.ac.kr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                계정이 없으신가요?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:underline">
                  회원가입
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
