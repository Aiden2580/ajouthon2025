"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Heart } from "lucide-react"
import Link from "next/link"
import { favoriteStorage, storeAPI } from "@/lib/auth"

interface FavoriteItem {
  id: number
  name: string
  price: number
  image: string
  storeName: string
  storeId: number
  rating: number
  tags: string[]
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)

  // 실제 즐겨찾기 데이터 로딩
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true)
      try {
        const favoriteIds = favoriteStorage.getFavorites()

        if (favoriteIds.length === 0) {
          setFavorites([])
          return
        }

        // 모든 매장의 메뉴를 가져와서 즐겨찾기 메뉴 찾기
        const stores = await storeAPI.getAllStores()
        const favoriteMenus: FavoriteItem[] = []

        for (const store of stores) {
          try {
            const menus = await storeAPI.getStoreMenus(store.id)
            const storeFavorites = menus
              .filter((menu) => favoriteIds.includes(menu.id))
              .map((menu) => ({
                id: menu.id,
                name: menu.menuName,
                price: menu.price,
                image: "/placeholder.svg?height=80&width=80",
                storeName: store.storeName,
                storeId: store.id,
                rating: store.rating || 4.5,
                tags: ["맛있음", "추천"],
              }))

            favoriteMenus.push(...storeFavorites)
          } catch (error) {
            console.error(`매장 ${store.id} 메뉴 로딩 실패:`, error)
          }
        }

        setFavorites(favoriteMenus)
      } catch (error) {
        console.error("즐겨찾기 로딩 실패:", error)
        setFavorites([])
      } finally {
        setLoading(false)
      }
    }
    loadFavorites()

    // 즐겨찾기 변경 이벤트 리스너
    const handleFavoritesChange = () => {
      loadFavorites()
    }

    window.addEventListener("favoritesChanged", handleFavoritesChange)
    return () => window.removeEventListener("favoritesChanged", handleFavoritesChange)
  }, [])

  // 즐겨찾기 제거 함수
  const handleRemoveFavorite = (itemId: number) => {
    favoriteStorage.toggleFavorite(itemId)
    setFavorites((prev) => prev.filter((item) => item.id !== itemId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">즐겨찾기를 불러오는 중...</div>
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
                        <Link href={`/store/${item.storeId}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            주문하기
                          </Button>
                        </Link>
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
