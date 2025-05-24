"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import { orderStorage, type LocalOrderDto } from "@/lib/auth"

const statusConfig = {
  preparing: { label: "준비중", color: "bg-orange-500", icon: Clock },
  ready: { label: "픽업대기", color: "bg-blue-500", icon: CheckCircle },
  completed: { label: "완료", color: "bg-green-500", icon: CheckCircle },
}

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [orders, setOrders] = useState<LocalOrderDto[]>([])
  const [loading, setLoading] = useState(true)

  // 실제 주문 데이터 로딩
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      try {
        const orderData = orderStorage.getOrders()
        setOrders(orderData)
      } catch (error) {
        console.error("주문 내역 로딩 실패:", error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    loadOrders()

    // 주문 변경 이벤트 리스너
    const handleOrdersChange = () => {
      loadOrders()
    }

    window.addEventListener("ordersChanged", handleOrdersChange)
    return () => window.removeEventListener("ordersChanged", handleOrdersChange)
  }, [])

  // 필터링된 주문 목록
  const filteredOrders = orders.filter((order) => {
    if (selectedTab === "all") return true
    if (selectedTab === "ongoing") return order.status !== "completed"
    if (selectedTab === "completed") return order.status === "completed"
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">주문 내역을 불러오는 중...</div>
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
            <h1 className="font-medium ml-2">주문내역</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {/* Tabs */}
        <div className="bg-white">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="ongoing">진행중</TabsTrigger>
              <TabsTrigger value="completed">완료</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Orders List */}
        <div className="mt-2 space-y-2">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 bg-white">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">주문내역이 없습니다</h2>
              <p className="text-gray-500 mb-6">첫 주문을 시작해보세요!</p>
              <Link href="/">
                <Button>주문하러 가기</Button>
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon
              return (
                <Card key={order.id} className="mx-4">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{order.storeName}</h3>
                        <p className="text-sm text-gray-500">주문번호: {order.orderNumber}</p>
                      </div>
                      <Badge className={`${statusConfig[order.status as keyof typeof statusConfig].color} text-white`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[order.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>

                    <div className="space-y-1 mb-3">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm text-gray-700">
                          • {item.menuName} x {item.quantity}
                        </p>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                      <span>주문시간: {order.orderTime}</span>
                      <span className="font-bold text-lg text-gray-900">{order.totalAmount.toLocaleString()}원</span>
                    </div>

                    {order.status === "completed" && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Star className="h-4 w-4 mr-1" />
                        후기 작성하기
                      </Button>
                    )}

                    {order.status === "ready" && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">🔔 픽업 준비완료! 매장에서 수령해주세요</p>
                        <p className="text-xs text-blue-600 mt-1">
                          예상 픽업시간: {order.estimatedPickupTime || order.orderTime}
                        </p>
                      </div>
                    )}

                    {order.status === "preparing" && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-orange-800">👨‍🍳 주문을 준비중입니다</p>
                        <p className="text-xs text-orange-600 mt-1">
                          예상 완료시간: {order.estimatedPickupTime || order.orderTime}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
