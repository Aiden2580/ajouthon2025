"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react"
import Link from "next/link"

// TODO: API 연동 - 장바구니 관련 API 함수들
// const fetchCartItems = async () => {
//   try {
//     const response = await fetch('/api/cart', {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//     return await response.json()
//   } catch (error) {
//     console.error('장바구니 로딩 실패:', error)
//     return []
//   }
// }

// const updateCartItemQuantity = async (itemId: number, quantity: number) => {
//   try {
//     await fetch(`/api/cart/${itemId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify({ quantity })
//     })
//   } catch (error) {
//     console.error('수량 업데이트 실패:', error)
//   }
// }

// const removeCartItem = async (itemId: number) => {
//   try {
//     await fetch(`/api/cart/${itemId}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//   } catch (error) {
//     console.error('아이템 삭제 실패:', error)
//   }
// }

const cartItems = [
  {
    id: 1,
    name: "김치찌개",
    price: 4500,
    quantity: 2,
    image: "/placeholder.svg?height=60&width=60",
    storeName: "학생식당",
  },
  {
    id: 2,
    name: "불고기덮밥",
    price: 5000,
    quantity: 1,
    image: "/placeholder.svg?height=60&width=60",
    storeName: "학생식당",
  },
]

export default function CartPage() {
  const [items, setItems] = useState(cartItems)
  // TODO: API 연동 - 장바구니 데이터 로딩
  // const [loading, setLoading] = useState(true)

  // TODO: API 연동 - 장바구니 데이터 로딩
  // useEffect(() => {
  //   const loadCartItems = async () => {
  //     setLoading(true)
  //     const cartData = await fetchCartItems()
  //     setItems(cartData)
  //     setLoading(false)
  //   }
  //   loadCartItems()
  // }, [])

  const updateQuantity = (id: number, change: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item))
        .filter((item) => item.quantity > 0),
    )
    // TODO: API 연동 - 수량 업데이트
    // const newQuantity = items.find(item => item.id === id)?.quantity + change
    // if (newQuantity > 0) {
    //   updateCartItemQuantity(id, newQuantity)
    // } else {
    //   removeCartItem(id)
    // }
  }

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    // TODO: API 연동 - 아이템 삭제
    // removeCartItem(id)
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 1000
  const finalPrice = totalPrice + deliveryFee

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
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
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
                  <div className="flex justify-between">
                    <span>배달비</span>
                    <span>{deliveryFee.toLocaleString()}원</span>
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
