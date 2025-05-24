"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// TODO: API 연동 - 알림 설정 업데이트
// const updateNotificationSettings = async (settings: any) => {
//   try {
//     await fetch('/api/user/notifications', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify(settings)
//     })
//   } catch (error) {
//     console.error('알림 설정 업데이트 실패:', error)
//   }
// }

export default function NotificationsPage() {
  // HARDCODED: 실제 API에서 가져와야 할 알림 설정
  const [settings, setSettings] = useState({
    orderStatus: true,
    promotions: false,
    newMenu: true,
    pickup: true,
    review: false,
  })

  const handleToggle = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    // TODO: API 연동 - 알림 설정 업데이트
    // updateNotificationSettings({ ...settings, [key]: value })
  }

  const notificationOptions = [
    {
      key: "orderStatus",
      title: "주문 상태 알림",
      description: "주문 접수, 준비 완료 등 주문 상태 변경 시 알림",
    },
    {
      key: "pickup",
      title: "픽업 알림",
      description: "주문한 음식 픽업 시간이 되면 알림",
    },
    {
      key: "promotions",
      title: "이벤트 및 할인 알림",
      description: "특별 할인, 이벤트 정보 알림",
    },
    {
      key: "newMenu",
      title: "신메뉴 알림",
      description: "즐겨찾는 매장의 신메뉴 출시 알림",
    },
    {
      key: "review",
      title: "후기 작성 알림",
      description: "주문 완료 후 후기 작성 요청 알림",
    },
  ]

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
            <h1 className="font-medium ml-2">알림 설정</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        <Card className="mt-4 mx-4">
          <CardHeader>
            <CardTitle>푸시 알림 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {notificationOptions.map((option) => (
              <div key={option.key} className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <Label htmlFor={option.key} className="text-sm font-medium">
                    {option.title}
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                </div>
                <Switch
                  id={option.key}
                  checked={settings[option.key as keyof typeof settings]}
                  onCheckedChange={(checked) => handleToggle(option.key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
