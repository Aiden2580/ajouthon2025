"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import { orderStorage, type LocalOrderDto, OrderResponseDto } from "@/lib/auth"

const statusConfig = {
  PENDING: { label: "주문접수", color: "bg-yellow-500", icon: Clock },
  CONFIRMED: { label: "확정됨", color: "bg-blue-500", icon: CheckCircle },
  COMPLETED: { label: "완료", color: "bg-green-500", icon: CheckCircle },
}

const fetchOrders = async (userId: number) => {
  const response = await fetch(`http://ajoutonback.hunian.site/orders/all_detail?userId=${userId}`)
  if (!response.ok) {
    throw new Error("주문 내역을 불러오는 데 실패했습니다.")
  }
  return await response.json()
}

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  // const [orders, setOrders] = useState<LocalOrderDto[]>([])
  const [orders, setOrders] = useState<OrderResponseDto[]>([])
  const [loading, setLoading] = useState(true)

  const [userId, setUserId] = useState<number | null>(null)


  useEffect(() => {
    const rawUser = localStorage.getItem("user")
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser)
        setUserId(parsed.id)
      } catch (e) {
        console.error("유저 정보 파싱 에러:", e)
      }
    }
  }, [])

  useEffect(() => {
  const loadOrders = async () => {
    if (userId == null) return
    setLoading(true)
    try {
      const data = await fetchOrders(userId)
      setOrders(data)
    } catch (error) {
      console.error("주문 불러오기 실패:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

    loadOrders()
  }, [userId])

  // 필터링된 주문 목록
  const filteredOrders = orders.filter((order) => {
    if (selectedTab === "all") return true
    if (selectedTab === "ongoing") return order.status !== "COMPLETED"
    if (selectedTab === "completed") return order.status === "COMPLETED"
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
              const statusInfo = statusConfig[order.status as keyof typeof statusConfig]

              if (!statusInfo) {
                console.error("알 수 없는 주문 상태:", order.status)
                return null // 또는 fallback UI 반환
              }

              const StatusIcon = statusInfo.icon
              return (
                <Card key={order.id} className="mx-4">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{order.storeName}</h3>
                        <p className="text-sm text-gray-500">
                          접수번호: {order.id} / 메뉴: {order.menuName}
                        </p>
                      </div>
                      <Badge className={`${statusInfo.color} text-white`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                      <span>주문시간: {new Date(order.createdAt).toLocaleString()}</span>
                      <span className="font-bold text-lg text-gray-900">
                        {order.price.toLocaleString()}원
                      </span>
                    </div>
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
