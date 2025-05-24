"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Smartphone } from "lucide-react"
import Link from "next/link"
import { orderAPI, authStorage } from "@/lib/auth"

const orderItems = [
  { name: "김치찌개", quantity: 2, price: 4500 },
  { name: "불고기덮밥", quantity: 1, price: 5000 },
]

const paymentMethods = [
  { id: "card", name: "신용카드", icon: CreditCard },
  { id: "kakao", name: "카카오페이", icon: Smartphone },
  { id: "toss", name: "토스페이", icon: Smartphone },
]

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [specialRequest, setSpecialRequest] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 1000
  const finalPrice = totalPrice + deliveryFee

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      const user = authStorage.getUser()
      if (!user) {
        alert("로그인이 필요합니다.")
        window.location.href = "/auth/login"
        return
      }

      // 각 메뉴에 대해 주문 생성 (현재 API는 한 번에 하나의 메뉴만 주문 가능)
      const orders = []
      for (const item of orderItems) {
        for (let i = 0; i < item.quantity; i++) {
          const order = await orderAPI.createOrder(
            user.id,
            1, // 임시 storeId, 실제로는 장바구니에서 가져와야 함
            item.name,
          )
          orders.push(order)
        }
      }

      // 결제 성공 시 주문 완료 페이지로 이동
      if (orders.length > 0) {
        window.location.href = `/order-complete/${orders[0].id}`
      }
    } catch (error) {
      console.error("결제 오류:", error)
      alert("결제 처리 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
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
                    {item.name} x {item.quantity}
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
