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

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 1000
  const finalPrice = totalPrice + deliveryFee

  const handlePayment = async () => {
    // TODO: API 연동 - 결제 처리
    // try {
    //   const orderData = {
    //     items: orderItems,
    //     paymentMethod,
    //     specialRequest,
    //     totalAmount: finalPrice
    //   }
    //
    //   const response = await fetch('/api/orders', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${localStorage.getItem('token')}`
    //     },
    //     body: JSON.stringify(orderData)
    //   })
    //
    //   if (response.ok) {
    //     const result = await response.json()
    //     // 결제 성공 시 주문 완료 페이지로 이동
    //     window.location.href = `/order-complete/${result.orderId}`
    //   } else {
    //     const error = await response.json()
    //     alert(error.message || '결제에 실패했습니다.')
    //   }
    // } catch (error) {
    //   console.error('결제 오류:', error)
    //   alert('결제 처리 중 오류가 발생했습니다.')
    // }

    // 임시 결제 로직
    console.log("Payment:", { paymentMethod, specialRequest, finalPrice })
    alert("결제가 완료되었습니다!")
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
            <Button onClick={handlePayment} className="w-full" size="lg">
              {finalPrice.toLocaleString()}원 결제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
