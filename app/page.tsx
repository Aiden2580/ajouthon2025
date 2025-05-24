"use client"

import { useState } from "react"
// TODO: API 연동 - axios 또는 fetch를 위한 import 추가
// import axios from 'axios'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, User, Star, Clock, MapPin } from "lucide-react"
import Link from "next/link"

// TODO: API 연동 - 실제 API에서 매장 데이터를 가져오는 함수
// const fetchStores = async () => {
//   try {
//     const response = await fetch('/api/stores')
//     const data = await response.json()
//     return data
//   } catch (error) {
//     console.error('매장 데이터 로딩 실패:', error)
//     return []
//   }
// }

const stores = [
  {
    id: 1,
    name: "학생식당",
    category: "restaurant",
    image: "/placeholder.svg?height=120&width=200",
    rating: 4.5,
    reviewCount: 128,
    distance: "도보 2분",
    isOpen: true,
    tags: ["한식", "저렴함", "빠름"],
  },
  {
    id: 2,
    name: "카페 드림",
    category: "cafe",
    image: "/placeholder.svg?height=120&width=200",
    rating: 4.3,
    reviewCount: 89,
    distance: "도보 3분",
    isOpen: true,
    tags: ["커피", "디저트", "조용함"],
  },
  {
    id: 3,
    name: "편의점",
    category: "other",
    image: "/placeholder.svg?height=120&width=200",
    rating: 4.1,
    reviewCount: 45,
    distance: "도보 1분",
    isOpen: false,
    tags: ["간편식", "24시간", "다양함"],
  },
  {
    id: 4,
    name: "교직원식당",
    category: "restaurant",
    image: "/placeholder.svg?height=120&width=200",
    rating: 4.7,
    reviewCount: 67,
    distance: "도보 5분",
    isOpen: true,
    tags: ["한식", "정갈함", "넓음"],
  },
  {
    id: 5,
    name: "스타벅스",
    category: "cafe",
    image: "/placeholder.svg?height=120&width=200",
    rating: 4.4,
    reviewCount: 156,
    distance: "도보 4분",
    isOpen: true,
    tags: ["브랜드", "스터디", "와이파이"],
  },
]

const categories = [
  { id: "all", name: "전체", icon: "🏪" },
  { id: "restaurant", name: "식당", icon: "🍽️" },
  { id: "cafe", name: "카페", icon: "☕" },
  { id: "other", name: "기타", icon: "🛒" },
]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  // TODO: API 연동 - 매장 데이터 상태 관리
  // const [stores, setStores] = useState([])
  // const [loading, setLoading] = useState(true)

  // TODO: API 연동 - 컴포넌트 마운트 시 매장 데이터 로딩
  // useEffect(() => {
  //   const loadStores = async () => {
  //     setLoading(true)
  //     const storeData = await fetchStores()
  //     setStores(storeData)
  //     setLoading(false)
  //   }
  //   loadStores()
  // }, [])

  const filteredStores = stores.filter((store) => {
    const matchesCategory = selectedCategory === "all" || store.category === selectedCategory
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-600">아주오더</h1>
            <div className="flex items-center gap-3">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">2</Badge>
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="가게나 메뉴를 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Store List */}
        <div className="px-4 pb-20">
          <div className="space-y-4">
            {filteredStores.map((store) => (
              <Link key={store.id} href={`/store/${store.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <img
                          src={store.image || "/placeholder.svg"}
                          alt={store.name}
                          className="w-full h-full object-cover"
                        />
                        {!store.isOpen && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">영업종료</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{store.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">
                                {store.rating} ({store.reviewCount})
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{store.distance}</span>
                              {store.isOpen && (
                                <>
                                  <Clock className="h-3 w-3 text-green-500 ml-2" />
                                  <span className="text-xs text-green-600">영업중</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {store.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around">
            <Link href="/" className="flex flex-col items-center py-2 text-blue-600">
              <span className="text-lg">🏠</span>
              <span className="text-xs font-medium">홈</span>
            </Link>
            <Link href="/orders" className="flex flex-col items-center py-2 text-gray-500">
              <span className="text-lg">📋</span>
              <span className="text-xs">주문내역</span>
            </Link>
            <Link href="/favorites" className="flex flex-col items-center py-2 text-gray-500">
              <span className="text-lg">⭐</span>
              <span className="text-xs">즐겨찾기</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center py-2 text-gray-500">
              <span className="text-lg">👤</span>
              <span className="text-xs">마이페이지</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
