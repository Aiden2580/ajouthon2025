"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { authStorage } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authStorage.isLoggedIn()
      setIsAuthenticated(loggedIn)
      setIsLoading(false)

      if (!loggedIn) {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        window.location.href = "/auth/login"
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#0051a2] mb-4">아주오더</div>
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  return <>{children}</>
}
