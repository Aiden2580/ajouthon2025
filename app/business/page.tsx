"use client"

import { useState, useEffect } from "react"
import BusinessAuthGuard from "@/lib/BusinessAuthGuard"
import { authStorage, storeAPI, orderAPI, type StoreDto, type BusinessOrderDto } from "@/lib/auth"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Menu, ShoppingBag, TrendingUp, Clock, LogOut, Settings } from "lucide-react"
import Link from "next/link"

function BusinessDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [storeData, setStoreData] = useState<StoreDto | null>(null)
  const [recentOrders, setRecentOrders] = useState<BusinessOrderDto[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    menuCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        const user = authStorage.getUser()
        console.log("현재 사용자:", user)

        if (user) {
          setUserData(user)

          // 가게 주인의 매장 정보 조회
          console.log("매장 정보 조회 시작...")
          const store = await storeAPI.findStoreByOwnerEmail(user.email)
          console.log("조회된 매장:", store)

          if (store) {
            setStoreData(store)

            // 매장의 최근 주문 조회
            console.log("주문 정보 조회 시작...")
            try {
              const orders = await orderAPI.getStoreOrders(store.id)
              console.log("조회된 주문:", orders)
              setRecentOrders(orders.slice(0, 5)) // 최근 5개만

              // 메뉴 개수 조회
              console.log("메뉴 정보 조회 시작...")
              const menus = await storeAPI.getStoreMenus(store.id)
              console.log("조회된 메뉴:", menus)

              // 통계 계산
              const pendingCount = orders.filter((order) => order.status === "PENDING").length
              const todayRevenue = orders
                .filter((order) => {
                  const orderDate = new Date(order.createdAt)
                  const today = new Date()
                  return orderDate.toDateString() === today.toDateString()
                })
                .reduce((sum, order) => sum + order.price, 0)

              setStats({
                totalOrders: orders.length,
                pendingOrders: pendingCount,
                todayRevenue,
                menuCount: menus.length,
              })
            } catch (orderError) {
              console.error("주문/메뉴 정보 로딩 실패:", orderError)
              // 주문/메뉴 로딩 실패해도 매장 정보는 표시
              setStats({
                totalOrders: 0,
                pendingOrders: 0,
                todayRevenue: 0,
                menuCount: 0,
              })
            }
          } else {
            console.error("매장 정보를 찾을 수 없습니다.")
            alert("매장 정보를 찾을 수 없습니다. 매장을 먼저 등록해주세요.")
          }
        }
      } catch (error) {
        console.error("대시보드 데이터 로딩 실패:", error)
        alert("대시보드 데이터를 불러오는데 실패했습니다: " + error.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleLogout = () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      authStorage.logout()
      window.location.href = "/auth/login"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="destructive" className="text-xs">
            대기중
          </Badge>
        )
      case "CONFIRMED":
        return <Badge className="bg-blue-500 text-xs">확인됨</Badge>
      case "COMPLETED":
        return <Badge className="bg-green-500 text-xs">완료</Badge>
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#0051a2] mb-4">아주오더 사업자</div>
          <div className="text-gray-500">대시보드를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0051a2] text-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">아주오더 사업자</h1>
              <p className="text-blue-100 text-sm">{storeData?.storeName || "매장 관리"}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white hover:bg-white/10">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">안녕하세요, {userData?.name}님! 👋</h2>
          <p className="text-gray-600">오늘도 맛있는 음식으로 고객들을 만족시켜보세요.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">총 주문</p>
                  <p className="text-xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">대기 주문</p>
                  <p className="text-xl font-bold text-orange-600">{stats.pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">오늘 매출</p>
                  <p className="text-xl font-bold text-green-600">{stats.todayRevenue.toLocaleString()}원</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Menu className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">메뉴 수</p>
                  <p className="text-xl font-bold">{stats.menuCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Menu className="h-5 w-5" />
                메뉴 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">메뉴를 추가, 수정, 삭제하고 재고를 관리하세요.</p>
              <Link href="/business/menu">
                <Button className="w-full">메뉴 관리하기</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                주문 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">��어온 주문을 확인하고 처리 상태를 변경하세요.</p>
              <Link href="/business/orders">
                <Button className="w-full">주문 관리하기</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>최근 주문</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">아직 주문이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">#{order.id}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.menuName} - {order.userName}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString("ko-KR")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{order.price.toLocaleString()}원</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function BusinessPage() {
  return (
    <BusinessAuthGuard>
      <BusinessDashboard />
    </BusinessAuthGuard>
  )
}
