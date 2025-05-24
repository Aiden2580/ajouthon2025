"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, MapPin } from "lucide-react"
import Link from "next/link"

// TODO: API 연동 - 주문 상세 정보 가져오기
// const fetchOrderDetails = async (orderId: string) => {
//   try {
//     const response = await fetch(`/api/orders/${orderId}`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//     return await response.json()
//   } catch (error) {
//     console.error('주문 정보 로딩 실패:', error)
//     return null
//   }
// }

export default function OrderCompletePage({ params }: { params: { orderId: string } }) {
  // TODO: API 연동 - 주문 데이터 상태 관리
  // const [orderData, setOrderData] = useState(null)
  // const [loading, setLoading] = useState(true)

  // TODO: API 연동 - 주문 데이터 로딩
  // useEffect(() => {
  //   const loadOrderData = async () => {
  //     setLoading(true)
  //     const data = await fetchOrderDetails(params.orderId)
  //     setOrderData(data)
  //     setLoading(false)
  //   }
  //   loadOrderData()
  // }, [params.orderId])

  // HARDCODED: 실제 API에서 가져와야 할 주문 데이터
  const orderData = {
    id: params.orderId,
    orderNumber: `AO${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}001`,
    storeName: "학생식당",
    storeAddress: "아주대학교 학생회관 1층",
    storePhone: "031-219-1234",
    items: [
      { name: "김치찌개", quantity: 2, price: 4500 },
      { name: "불고기덮밥", quantity: 1, price: 5000 },
    ],
    totalAmount: 14000,
    paymentMethod: "카드결제",
    orderTime: new Date().toLocaleString("ko-KR"),
    estimatedPickupTime: new Date(Date.now() + 15 * 60 * 1000).toLocaleString("ko-KR"), // 15분 후
    specialRequest: "덜 맵게 해주세요",
    status: "preparing",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Success Header */}
        <div className="bg-green-500 text-white text-center py-8">
          <CheckCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">주문이 완료되었습니다!</h1>
          <p className="text-green-100">매장에서 음식을 준비중입니다</p>
        </div>

        {/* Order Info */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold">{orderData.storeName}</h2>
              <p className="text-sm text-gray-600">주문번호: {orderData.orderNumber}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>예상 픽업시간: {orderData.estimatedPickupTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{orderData.storeAddress}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">주문 상품</h3>
            <div className="space-y-2">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toLocaleString()}원</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>총 결제금액</span>
                  <span>{orderData.totalAmount.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">결제 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>결제방법</span>
                <span>{orderData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>주문시간</span>
                <span>{orderData.orderTime}</span>
              </div>
              {orderData.specialRequest && (
                <div className="flex justify-between">
                  <span>요청사항</span>
                  <span>{orderData.specialRequest}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pickup Notice */}
        <Card className="mt-4 mx-4 bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-orange-800 mb-2">📢 픽업 안내</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• 주문 준비 완료 시 알림을 보내드립니다</li>
              <li>• 매장에서 주문번호를 말씀해 주세요</li>
              <li>• 학생증을 지참해 주세요</li>
              <li>• 문의사항: {orderData.storePhone}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <Link href="/orders">
            <Button className="w-full" size="lg">
              주문내역 확인
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full" size="lg">
              홈으로 돌아가기
            </Button>
          </Link>
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
