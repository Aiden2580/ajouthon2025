"use client"

import { useState, useEffect } from "react"
import BusinessAuthGuard from "@/lib/BusinessAuthGuard"
import { authStorage, storeAPI, orderAPI, type StoreDto, type BusinessOrderDto } from "@/lib/auth"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, CheckCircle, AlertCircle, User, Mail } from "lucide-react"
import Link from "next/link"

function BusinessOrdersPage() {
  const [storeData, setStoreData] = useState<StoreDto | null>(null)
  const [orders, setOrders] = useState<BusinessOrderDto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("all")

  useEffect(() => {
    const loadOrderData = async () => {
      setLoading(true)
      try {
        const user = authStorage.getUser()
        if (user) {
          // 가게 주인의 매장 정보 조회
          const store = await storeAPI.findStoreByOwnerEmail(user.email)
          if (store) {
            setStoreData(store)

            // 매장의 주문 조회
            const storeOrders = await orderAPI.getStoreOrders(store.id)
            setOrders(storeOrders)
          }
        }
      } catch (error) {
        console.error("주문 데이터 로딩 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOrderData()
  }, [])

  const handleCompleteOrder = async (order: BusinessOrderDto) => {
    if (!confirm(`주문 #${order.id}를 완료 처리하시겠습니까?`)) return

    try {
      await orderAPI.completeOrder(order.userId, order.id)
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "COMPLETED" } : o)))
      alert("주문이 완료 처리되었습니다!")
    } catch (error) {
      console.error("주문 완료 처리 실패:", error)
      alert("주문 완료 처리에 실패했습니다.")
    }
  }

  const handleConfirmOrder = async (order: BusinessOrderDto) => {
    if (!confirm(`주문 #${order.id}를 확인하시겠습니까?`)) return

    try {
      // TODO: 주문 확인 API 구현 필요
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "CONFIRMED" } : o)))
      alert("주문이 확인되었습니다!")
    } catch (error) {
      console.error("주문 확인 실패:", error)
      alert("주문 확인에 실패했습니다.")
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
      case "CANCELLED":
        return (
          <Badge variant="outline" className="text-xs">
            취소됨
          </Badge>
        )
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
      case "CONFIRMED":
        return <Clock className="h-4 w-4 text-blue-500" />
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
    if (selectedTab === "confirmed") return order.status === "CONFIRMED"
    if (selectedTab === "completed") return order.status === "COMPLETED"
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">주문 정보를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link href="/business">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-medium ml-2">주문 관리</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* Store Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold">{storeData?.storeName}</h2>
            <p className="text-gray-600">{storeData?.storeLocation}</p>
            <p className="text-sm text-gray-500 mt-1">총 {orders.length}개의 주문</p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="bg-white rounded-lg mb-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="pending">대기중</TabsTrigger>
              <TabsTrigger value="confirmed">확인됨</TabsTrigger>
              <TabsTrigger value="completed">완료</TabsTrigger>
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
                    : `${selectedTab} 상태의 주문이 없습니다.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-medium">주문 #{order.id}</h3>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString("ko-KR")}</p>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {/* 주문 정보 */}
                    <div>
                      <h4 className="font-medium mb-2">주문 정보</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-600">메뉴:</span> {order.menuName}
                        </p>
                        <p>
                          <span className="text-gray-600">금액:</span> {order.price.toLocaleString()}원
                        </p>
                      </div>
                    </div>

                    {/* 고객 정보 */}
                    <div>
                      <h4 className="font-medium mb-2">고객 정보</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-gray-400" />
                          <span>{order.userName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{order.userEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    {order.status === "PENDING" && (
                      <Button
                        size="sm"
                        onClick={() => handleConfirmOrder(order)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        주문 확인
                      </Button>
                    )}
                    {order.status === "CONFIRMED" && (
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

export default function BusinessOrderManagePage() {
  return (
    <BusinessAuthGuard>
      <BusinessOrdersPage />
    </BusinessAuthGuard>
  )
}
