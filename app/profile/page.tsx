"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Bell, CreditCard, HelpCircle, LogOut, ChevronRight } from "lucide-react"
import Link from "next/link"
import { authStorage, authAPI, type UserDto } from "@/lib/auth"

const menuItems = [
  {
    icon: User,
    title: "개인정보 수정",
    href: "/profile/edit",
    description: "이름, 전화번호 등 개인정보 변경",
  },
  {
    icon: Bell,
    title: "알림 설정",
    href: "/profile/notifications",
    description: "주문 알림, 이벤트 알림 설정",
  },
  {
    icon: CreditCard,
    title: "결제 수단 관리",
    href: "/profile/payment",
    description: "카드 등록 및 관리",
  },
  {
    icon: HelpCircle,
    title: "고객센터",
    href: "/profile/support",
    description: "문의하기, FAQ",
  },
]

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserDto | null>(null)
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    favoriteStore: "학생식당",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true)
      try {
        const user = authStorage.getUser()
        if (user) {
          // 최신 사용자 정보를 API에서 가져오기
          const updatedUser = await authAPI.getUserInfo(user.email)
          setUserData(updatedUser)
          authStorage.setUser(updatedUser) // 로컬 스토리지 업데이트
        } else {
          // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
          window.location.href = "/auth/login"
        }
      } catch (error) {
        console.error("사용자 정보 로딩 실패:", error)
        // 에러 시 로컬 스토리지의 정보 사용
        const user = authStorage.getUser()
        setUserData(user)
      } finally {
        setLoading(false)
      }
    }
    loadUserData()
  }, [])

  const handleLogout = () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      authStorage.logout()
      window.location.href = "/auth/login"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">사용자 정보를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">사용자 정보를 찾을 수 없습니다</div>
          <Button onClick={() => (window.location.href = "/auth/login")}>로그인하기</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-medium ml-2">마이페이지</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {/* User Info */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-gray-600">{userData.email}</p>
                <p className="text-sm text-gray-500">학번: {userData.studentNumber}</p>
                <p className="text-sm text-gray-500">학과: {userData.department}</p>
                <p className="text-sm text-gray-500">역할: {userData.role}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{userStats.totalOrders}</p>
                <p className="text-sm text-gray-600">총 주문수</p>
              </div>
              <div>
                <p className="text-lg font-medium">{userStats.favoriteStore}</p>
                <p className="text-sm text-gray-600">최애 매장</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="mt-4 space-y-2">
          {menuItems.map((item, index) => (
            <Card key={index} className="mx-4">
              <CardContent className="p-0">
                <Link href={item.href}>
                  <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <item.icon className="h-5 w-5 text-gray-600 mr-3" />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logout */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-red-600"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">로그아웃</span>
            </button>
          </CardContent>
        </Card>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
