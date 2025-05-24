"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react"
import Link from "next/link"
import { cartStorage, type CartItem } from "@/lib/auth"

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // 장바구니 데이터 로딩
  useEffect(() => {
    const loadCartItems = () => {
      setLoading(true)
      const cartItems = cartStorage.getItems()
      setItems(cartItems)
      setLoading(false)
    }

    loadCartItems()

    // 장바구니 변경 감지
    const handleStorageChange = () => {
      loadCartItems()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const updateQuantity = (id: number, change: number) => {
    const item = items.find((item) => item.id === id)
    if (!item) return

    const newQuantity = item.quantity + change

    if (newQuantity <= 0) {
      cartStorage.removeItem(id)
    } else {
      cartStorage.updateQuantity(id, newQuantity)
    }

    // 로컬 상태 업데이트
    setItems(cartStorage.getItems())
  }

  const removeItem = (id: number) => {
    cartStorage.removeItem(id)
    setItems(cartStorage.getItems())
  }

  const totalPrice = cartStorage.getTotalPrice()
  // const deliveryFee = 1000
  const finalPrice = totalPrice // deliveryFee 제거

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">장바구니를 불러오는 중...</div>
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
            <h1 className="font-medium ml-2">장바구니</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h2>
            <p className="text-gray-500 mb-6">맛있는 음식을 담아보세요!</p>
            <Link href="/">
              <Button>메뉴 보러가기</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="bg-white mt-2">
              <div className="p-4">
                <h2 className="font-medium text-gray-900">주문 상품</h2>
              </div>
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex gap-3">
                      <img
                        src="/placeholder.svg?height=60&width=60"
                        alt={item.menuName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{item.menuName}</h3>
                            <p className="text-sm text-gray-500">{item.storeName}</p>
                            <p className="font-bold text-lg mt-1">{item.price.toLocaleString()}원</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="font-bold">{(item.price * item.quantity).toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <Card className="mt-4 mx-4">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">주문 요약</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>상품 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>총 결제 금액</span>
                    <span className="text-blue-600">{finalPrice.toLocaleString()}원</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="h-24"></div>

            {/* Order Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
              <div className="max-w-md mx-auto p-4">
                <Link href="/checkout">
                  <Button className="w-full" size="lg">
                    {finalPrice.toLocaleString()}원 결제하기
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
