"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Phone, Mail, MessageCircle, ChevronRight } from "lucide-react"
import Link from "next/link"

const supportOptions = [
  {
    icon: Phone,
    title: "전화 문의",
    description: "평일 09:00 - 18:00",
    action: "031-219-1234", // HARDCODED: 실제 고객센터 번호로 변경 필요
    type: "phone",
  },
  {
    icon: Mail,
    title: "이메일 문의",
    description: "24시간 접수 가능",
    action: "support@ajouorder.com", // HARDCODED: 실제 이메일로 변경 필요
    type: "email",
  },
  {
    icon: MessageCircle,
    title: "1:1 채팅 상담",
    description: "실시간 상담 가능",
    action: "/chat", // TODO: 채팅 페이지 구현 필요
    type: "chat",
  },
]

const faqItems = [
  {
    question: "주문 취소는 어떻게 하나요?",
    answer: "주문 접수 전까지만 취소가 가능합니다. 주문내역에서 취소 버튼을 눌러주세요.",
  },
  {
    question: "픽업 시간을 놓쳤어요",
    answer: "매장에 직접 연락하시거나 고객센터로 문의해 주세요.",
  },
  {
    question: "결제가 안 돼요",
    answer: "카드 한도나 잔액을 확인하시고, 문제가 지속되면 고객센터로 연락해 주세요.",
  },
  {
    question: "학생 인증은 어떻게 하나요?",
    answer: "아주대학교 이메일(@ajou.ac.kr)로 가입하시면 자동으로 인증됩니다.",
  },
]

export default function SupportPage() {
  const handleContact = (type: string, action: string) => {
    switch (type) {
      case "phone":
        window.location.href = `tel:${action}`
        break
      case "email":
        window.location.href = `mailto:${action}`
        break
      case "chat":
        // TODO: 채팅 페이지로 이동
        alert("채팅 상담 기능은 준비 중입니다.")
        break
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
            <h1 className="font-medium ml-2">고객센터</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {/* Contact Options */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-4">
            <h2 className="font-medium mb-4">문의하기</h2>
            <div className="space-y-2">
              {supportOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleContact(option.type, option.action)}
                  className="w-full flex items-center p-3 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <option.icon className="h-5 w-5 text-gray-600 mr-3" />
                  <div className="flex-1 text-left">
                    <h3 className="font-medium">{option.title}</h3>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-4">
            <h2 className="font-medium mb-4">자주 묻는 질문</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium text-sm mb-2">Q. {item.question}</h3>
                  <p className="text-sm text-gray-600">A. {item.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="mt-4 mx-4">
          <CardContent className="p-4">
            <h2 className="font-medium mb-4">앱 정보</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>버전</span>
                <span>1.0.0</span> {/* HARDCODED: 실제 앱 버전으로 변경 필요 */}
              </div>
              <div className="flex justify-between">
                <span>개발사</span>
                <span>아주대학교</span> {/* HARDCODED: 실제 개발사명으로 변경 필요 */}
              </div>
              <div className="flex justify-between">
                <span>문의 시간</span>
                <span>평일 09:00 - 18:00</span> {/* HARDCODED: 실제 운영시간으로 변경 필요 */}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
