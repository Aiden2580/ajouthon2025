"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Heart } from "lucide-react"
import Link from "next/link"

// TODO: API 연동 - 즐겨찾기 데이터 가져오기
// const fetchFavorites = async () => {
//   try {
//     const response = await fetch('/api/user/favorites', {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//     return await response.json()
//   } catch (error) {
//     console.error('즐겨찾기 로딩 실패:', error)
//     return []
//   }
// }

// const removeFavorite = async (menuId: number) => {
//   try {
//     await fetch(`/api/menu/${menuId}/favorite`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//   } catch (error) {
//     console.error('즐겨찾기 삭제 실패:', error)
//   }
// }

// HARDCODED: 실제 API에서 가져와야 할 즐겨찾기 데이터
const favoriteItems = [
  {
    id: 1,
    name: "김치찌개",
    price: 4500,
    image: "/placeholder.svg?height=80&width=80",
    storeName: "학생식당",
    storeId: 1,
    rating: 4.5,
    tags: ["매운맛", "든든함", "따뜻함"],
  },
  {
    id: 4,
    name: "계란말이",
    price: 2000,
    image: "/placeholder.svg?height=80&width=80",
    storeName: "학생식당",
    storeId: 1,
    rating: 4.2,
    tags: ["부드러움", "담백함", "간단함"],
  },
  {
    id: 7,
    name: "아메리카노",
    price: 3500,
    image: "/placeholder.svg?height=80&width=80",
    storeName: "카페 드림",
    storeId: 2,
    rating: 4.3,
    tags: ["쓴맛", "카페인", "깔끔함"],
  },
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(favoriteItems)
  // TODO: API 연동 - 즐겨찾기 데이터 상태 관리
  // const [loading, setLoading] = useState(true)

  // TODO: API 연동 - 즐겨찾기 데이터 로딩
  // useEffect(() => {
  //   const loadFavorites = async () => {
  //     setLoading(true)
  //     const favoriteData = await fetchFavorites()
  //     setFavorites(favoriteData)
  //     setLoading(false)
  //   }
  //   loadFavorites()
  // }, [])

  const handleRemoveFavorite = (itemId: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== itemId))
    // TODO: API 연동 - 즐겨찾기 삭제
    // removeFavorite(itemId)
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
            <h1 className="font-medium ml-2">즐겨찾기</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">즐겨찾기가 비어있습니다</h2>
            <p className="text-gray-500 mb-6">좋아하는 메뉴를 즐겨찾기에 추가해보세요!</p>
            <Link href="/">
              <Button>메뉴 둘러보기</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white mt-2">
            <div className="p-4">
              <h2 className="font-medium text-gray-900">즐겨찾는 메뉴 ({favorites.length}개)</h2>
            </div>
            <div className="divide-y">
              {favorites.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
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
                          onClick={() => handleRemoveFavorite(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Heart className="h-5 w-5 fill-red-500" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{item.rating}</span>
                      </div>

                      <div className="flex gap-1 mt-2">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Link href={`/store/${item.storeId}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            매장 보기
                          </Button>
                        </Link>
                        <Button size="sm" className="flex-1">
                          주문하기
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-20"></div>
      </div>
    </div>
  )
}
