"use client"

import { useEffect } from "react"

export default function BusinessOrdersPage() {
  useEffect(() => {
    // 주문 관리는 메인 페이지에 통합되었으므로 메인 페이지로 리다이렉트
    window.location.href = "/business"
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium text-gray-900 mb-2">메인 페이지로 이동 중...</div>
      </div>
    </div>
  )
}
