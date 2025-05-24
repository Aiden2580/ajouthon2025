"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Smartphone } from "lucide-react"
import Link from "next/link"
import { orderAPI, authStorage, cartStorage, orderStorage, type CartItem, type LocalOrderDto } from "@/lib/auth"

const paymentMethods = [
  { id: "card", name: "신용카드", icon: CreditCard },
  { id: "kakao", name: "카카오페이", icon: Smartphone },
  { id: "toss", name: "토스페이", icon: Smartphone },
]

export default function CheckoutPage() {
  const [orderItems, setOrderItems] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [specialRequest, setSpecialRequest] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 장바구니에서 주문 아이템 가져오기
    const cartItems = cartStorage.getItems()
    setOrderItems(cartItems)
  }, [])

  // 배달비 제거 및 실제 장바구니 데이터 사용
  const totalPrice = cartStorage.getTotalPrice()
  // const deliveryFee = 1000 // 제거
  const finalPrice = totalPrice // deliveryFee 제거

  // 주문 생성 시 로컬 주문 내역에도 저장하도록 수정
  const handlePayment = async () => {
    setIsLoading(true)

    try {
      const user = authStorage.getUser()
      if (!user) {
        alert("로그인이 필요합니다.")
        window.location.href = "/auth/login"
        return
      }

      if (orderItems.length === 0) {
        alert("주문할 상품이 없습니다.")
        return
      }

      // 각 메뉴에 대해 주문 생성
      const orders = []
      for (const item of orderItems) {
        for (let i = 0; i < item.quantity; i++) {
          try {
            const order = await orderAPI.createOrder(user.id, item.storeId, item.menuName)
            orders.push(order)
          } catch (error) {
            console.error(`주문 생성 실패 (${item.menuName}):`, error)
            throw new Error(`${item.menuName} 주문 생성에 실패했습니다.`)
          }
        }
      }

      // 로컬 주문 내역에 저장
      if (orders.length > 0) {
        const localOrder: LocalOrderDto = {
          id: orders[0].id.toString(),
          orderNumber: `AO${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}${String(orders[0].id).padStart(3, "0")}`,
          storeName: orderItems[0].storeName,
          items: orderItems.map((item) => ({
            menuName: item.menuName,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: finalPrice,
          orderTime: new Date().toLocaleString("ko-KR"),
          status: "preparing",
          specialRequest: specialRequest || undefined,
        }

        orderStorage.addOrder(localOrder)
      }

      // 주문 성공 시 장바구니 비우기
      cartStorage.clearCart()

      // 주문 완료 페이지로 이동
      if (orders.length > 0) {
        window.location.href = `/order-complete/${orders[0].id}`
      }
    } catch (error) {
      console.error("결제 오류:", error)
      alert(error instanceof Error ? error.message : "결제 처리 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">주문할 상품이 없습니다</h2>
          <p className="text-gray-500 mb-6">장바구니에 상품을 담아주세요!</p>
          <Link href="/">
            <Button>메뉴 보러가기</Button>
          </Link>
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
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-medium ml-2">주문/결제</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {/* Order Items */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">주문 상품</h3>
            <div className="space-y-2">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.menuName} x {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Special Request */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">요청사항</h3>
            <Textarea
              placeholder="매장에 전달할 요청사항을 입력하세요 (선택)"
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              className="min-h-[80px]"
            />
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">결제 수단</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer flex-1">
                    <method.icon className="h-5 w-5" />
                    {method.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">결제 정보</h3>
            {/* 결제 정보 섹션에서 배달비 제거 */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              {/* 배달비 부분 제거 */}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>총 결제 금액</span>
                <span className="text-blue-600">{finalPrice.toLocaleString()}원</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="h-24"></div>

        {/* Payment Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-md mx-auto p-4">
            <Button onClick={handlePayment} className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "결제 처리 중..." : `${finalPrice.toLocaleString()}원 결제하기`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
