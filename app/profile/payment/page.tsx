"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

// TODO: API 연동 - 결제 수단 관리
// const fetchPaymentMethods = async () => {
//   try {
//     const response = await fetch('/api/user/payment-methods', {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//     return await response.json()
//   } catch (error) {
//     console.error('결제 수단 로딩 실패:', error)
//     return []
//   }
// }

// const deletePaymentMethod = async (methodId: string) => {
//   try {
//     await fetch(`/api/user/payment-methods/${methodId}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//   } catch (error) {
//     console.error('결제 수단 삭제 실패:', error)
//   }
// }

export default function PaymentPage() {
  // HARDCODED: 실제 API에서 가져와야 할 결제 수단 데이터
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "card",
      name: "신한카드",
      number: "**** **** **** 1234",
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      name: "국민카드",
      number: "**** **** **** 5678",
      isDefault: false,
    },
  ])

  const handleDelete = (methodId: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setPaymentMethods((prev) => prev.filter((method) => method.id !== methodId))
      // TODO: API 연동 - 결제 수단 삭제
      // deletePaymentMethod(methodId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-medium ml-2">결제 수단 관리</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {/* Add Payment Method */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-4">
            <Button className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />새 결제 수단 추가
            </Button>
          </CardContent>
        </Card>

        {/* Payment Methods List */}
        <Card className="mt-4 mx-4">
          <CardHeader>
            <CardTitle>등록된 결제 수단</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">등록된 결제 수단이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-gray-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{method.name}</span>
                          {method.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              기본
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{method.number}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(method.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
