"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Bell, CreditCard, HelpCircle, LogOut, ChevronRight } from "lucide-react"
import Link from "next/link"

// TODO: API 연동 - 사용자 정보 가져오기
// const fetchUserProfile = async () => {
//   try {
//     const response = await fetch('/api/user/profile', {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//     return await response.json()
//   } catch (error) {
//     console.error('프로필 로딩 실패:', error)
//     return null
//   }
// }

// const fetchUserStats = async () => {
//   try {
//     const response = await fetch('/api/user/stats', {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//     return await response.json()
//   } catch (error) {
//     console.error('통계 로딩 실패:', error)
//     return { totalOrders: 0, favoriteStore: '없음' }
//   }
// }

// const logout = async () => {
//   try {
//     await fetch('/api/auth/logout', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     window.location.href = '/auth/login'
//   } catch (error) {
//     console.error('로그아웃 실패:', error)
//   }
// }

const userData = {
  name: "홍길동",
  email: "student@ajou.ac.kr",
  studentId: "202012345",
  totalOrders: 24,
  favoriteStore: "학생식당",
}

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
  // TODO: API 연동 - 사용자 데이터 상태 관리
  // const [userData, setUserData] = useState(null)
  // const [loading, setLoading] = useState(true)

  // TODO: API 연동 - 사용자 데이터 로딩
  // useEffect(() => {
  //   const loadUserData = async () => {
  //     setLoading(true)
  //     const [profile, stats] = await Promise.all([
  //       fetchUserProfile(),
  //       fetchUserStats()
  //     ])
  //     setUserData({ ...profile, ...stats })
  //     setLoading(false)
  //   }
  //   loadUserData()
  // }, [])

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
                <p className="text-sm text-gray-500">학번: {userData.studentId}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{userData.totalOrders}</p>
                <p className="text-sm text-gray-600">총 주문수</p>
              </div>
              <div>
                <p className="text-lg font-medium">{userData.favoriteStore}</p>
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
              // onClick={logout}
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
