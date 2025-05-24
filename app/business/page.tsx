"use client"

import { useState, useEffect } from "react"
import BusinessAuthGuard from "@/lib/BusinessAuthGuard"
import { authStorage, orderAPI, type BusinessOrderDto, storeAPI } from "@/lib/auth"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, AlertCircle, RefreshCw, LogOut } from "lucide-react"

function BusinessDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [orders, setOrders] = useState<BusinessOrderDto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadOrderData = async () => {
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
          // 매장의 주문 조회 (실제 API 사용)
          console.log("주문 정보 조회 시작...")
          try {
            const storeOrders = await orderAPI.getStoreOrders(store.id)
            console.log("조회된 주문:", storeOrders)
            setOrders(storeOrders)
          } catch (orderError) {
            console.error("주문 정보 로딩 실패:", orderError)
            setOrders([])
          }
        } else {
          console.error("매장 정보를 찾을 수 없습니다.")
          alert("매장 정보를 찾을 수 없습니다. 매장을 먼저 등록해주세요.")
          setOrders([])
        }
      }
    } catch (error) {
      console.error("주문 데이터 로딩 실패:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [])

  const refreshOrders = async () => {
    setIsRefreshing(true)
    await loadOrderData()
    setIsRefreshing(false)
  }

  const handleCompleteOrder = async (order: BusinessOrderDto) => {
    if (!confirm(`주문 #${order.orderId}를 완료 처리하시겠습니까?`)) return

    try {
      console.log("주문 완료 처리:", order.orderId)
      await orderAPI.completeOrder(order.userId, order.orderId)

      // 주문 상태 업데이트
      setOrders((prev) => prev.map((o) => (o.orderId === order.orderId ? { ...o, status: "COMPLETED" } : o)))

      alert("주문이 완료 처리되었습니다!")
    } catch (error) {
      console.error("주문 완료 처리 실패:", error)
      alert("주문 완료 처리에 실패했습니다: " + (error instanceof Error ? error.message : "알 수 없는 오류"))
    }
  }

  const checkOrderCompletion = async (order: BusinessOrderDto) => {
    try {
      const isCompleted = await orderAPI.isOrderCompleted(order.orderId)
      if (isCompleted && order.status !== "COMPLETED") {
        setOrders((prev) => prev.map((o) => (o.orderId === order.orderId ? { ...o, status: "COMPLETED" } : o)))
      }
    } catch (error) {
      console.error("주문 완료 상태 확인 실패:", error)
    }
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  // 필터링된 주문 목록
  const filteredOrders = orders.filter((order) => {
    if (selectedTab === "all") return true
    if (selectedTab === "pending") return order.status === "PENDING"
    if (selectedTab === "completed") return order.status === "COMPLETED"
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#0051a2] mb-4">아주오더 사업자</div>
          <div className="text-gray-500">주문 정보를 불러오는 중...</div>
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
              <p className="text-blue-100 text-sm">주문 관리</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshOrders}
                disabled={isRefreshing}
                className="text-white border-white hover:bg-white/10"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                새로고침
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
          <p className="text-gray-600">들어온 주문을 확인하고 완료 처리하세요.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                <p className="text-sm text-gray-600">총 주문</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {orders.filter((o) => o.status === "PENDING").length}
                </p>
                <p className="text-sm text-gray-600">대기 주문</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter((o) => o.status === "COMPLETED").length}
                </p>
                <p className="text-sm text-gray-600">완료 주문</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg mb-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">전체 ({orders.length})</TabsTrigger>
              <TabsTrigger value="pending">대기중 ({orders.filter((o) => o.status === "PENDING").length})</TabsTrigger>
              <TabsTrigger value="completed">
                완료 ({orders.filter((o) => o.status === "COMPLETED").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">주문이 없습니다</h3>
                <p className="text-gray-500">
                  {selectedTab === "all"
                    ? "아직 주문이 들어오지 않았습니다."
                    : `${selectedTab === "pending" ? "대기중" : "완료"} 상태의 주문이 없습니다.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.orderId}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-medium">주문 #{order.orderId}</h3>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString("ko-KR")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => checkOrderCompletion(order)}
                        title="완료 상태 확인"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-600">고객:</span> {order.userName}
                      </p>
                      <p>
                        <span className="text-gray-600">메뉴:</span> {order.menuName}
                      </p>
                      <p>
                        <span className="text-gray-600">금액:</span> {order.price.toLocaleString()}원
                      </p>
                      <p>
                        <span className="text-gray-600">주문 시간:</span>{" "}
                        {new Date(order.createdAt).toLocaleString("ko-KR")}
                      </p>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    {order.status === "PENDING" && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteOrder(order)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        완료 처리
                      </Button>
                    )}
                    {order.status === "COMPLETED" && <Badge className="bg-green-500">처리 완료</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
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
