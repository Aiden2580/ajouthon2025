"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Heart, Plus, Minus, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { storeAPI } from "@/lib/auth"

export default function StorePage({ params }: { params: { id: string } }) {
  const [storeData, setStoreData] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({})

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const storeId = Number.parseInt(params.id)
        const menuData = await storeAPI.getStoreMenus(storeId)

        // 임시 매장 데이터 (실제로는 매장 상세 정보 API가 필요)
        setStoreData({
          id: storeId,
          name: "매장명",
          image: "/placeholder.svg?height=200&width=400",
          rating: 4.5,
          reviewCount: 128,
          description: "맛있는 음식을 제공하는 매장입니다",
          openTime: "11:00 - 20:00",
          phone: "031-219-1234",
        })

        // API 응답을 기존 형태에 맞게 변환
        const transformedMenus = menuData.map((menu: any) => ({
          id: menu.id,
          name: menu.menuName,
          price: menu.price,
          image: "/placeholder.svg?height=80&width=80",
          description: menu.description || "맛있는 메뉴입니다",
          category: "all",
          isFavorite: false,
          tags: ["맛있음", "추천"],
          likes: Math.floor(Math.random() * 100),
          isPopular: Math.random() > 0.5,
          amount: menu.amount,
        }))

        setMenuItems(transformedMenus)
      } catch (error) {
        console.error("데이터 로딩 실패:", error)
        setStoreData({
          id: Number.parseInt(params.id),
          name: "매장을 찾을 수 없습니다",
          image: "/placeholder.svg?height=200&width=400",
          rating: 0,
          reviewCount: 0,
          description: "",
          openTime: "",
          phone: "",
        })
        setMenuItems([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [params.id])

  const menuCategories = [
    { id: "all", name: "전체 메뉴", icon: "🍽️" },
    { id: "popular", name: "인기 메뉴", icon: "🏆" },
  ]

  const filteredMenus = menuItems.filter((item) =>
    selectedCategory === "all" ? true : selectedCategory === "popular" ? item.isPopular : true,
  )

  const addToCart = (itemId: number) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }))
  }

  const removeFromCart = (itemId: number) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }))
  }

  const toggleFavorite = (itemId: number) => {
    setFavorites((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">메뉴를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-medium">{storeData?.name}</h1>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">{totalItems}</Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {/* Store Info */}
        <div className="bg-white">
          <img
            src={storeData?.image || "/placeholder.svg"}
            alt={storeData?.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{storeData?.name}</h2>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{storeData?.rating}</span>
                <span className="text-gray-500">({storeData?.reviewCount})</span>
              </div>
            </div>
            <p className="text-gray-600 mt-1">{storeData?.description}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>⏰ {storeData?.openTime}</span>
              <span>📞 {storeData?.phone}</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white mt-2 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {menuCategories.map((category) => (
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

        {/* Menu List */}
        <div className="bg-white mt-2">
          <div className="divide-y">
            {filteredMenus.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-4xl mb-4">🍽️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">메뉴가 없습니다</h3>
                <p className="text-gray-500">아직 등록된 메뉴가 없습니다</p>
              </div>
            ) : (
              filteredMenus.map((item) => (
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
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{item.name}</h3>
                            {item.isPopular && (
                              <Badge variant="destructive" className="text-xs">
                                인기
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <p className="font-bold text-lg mt-1">{item.price.toLocaleString()}원</p>
                          {item.amount > 0 && <p className="text-sm text-gray-500">재고: {item.amount}개</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Heart className={`h-5 w-5 ${favorites[item.id] ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                      </div>

                      {/* Tags */}
                      <div className="flex gap-1 mt-2">
                        {item.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        <div className="flex items-center gap-1 ml-auto">
                          <span className="text-xs text-gray-500">👍 {item.likes}</span>
                        </div>
                      </div>

                      {/* Add to Cart */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeFromCart(item.id)}
                            disabled={!cart[item.id]}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{cart[item.id] || 0}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => addToCart(item.id)}
                            disabled={item.amount === 0}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(item.id)}
                          className="ml-2"
                          disabled={item.amount === 0}
                        >
                          {item.amount === 0 ? "품절" : "담기"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="h-20"></div>
      </div>

      {/* Cart Bottom Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-md mx-auto p-4">
            <Link href="/cart">
              <Button className="w-full" size="lg">
                장바구니 보기 ({totalItems}개)
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
