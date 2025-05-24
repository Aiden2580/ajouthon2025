"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Heart, Plus, Minus, ShoppingCart } from "lucide-react"
import Link from "next/link"

// TODO: API 연동 - 매장 상세 정보 및 메뉴 데이터 가져오기
// const fetchStoreDetails = async (storeId: string) => {
//   try {
//     const response = await fetch(`/api/stores/${storeId}`)
//     return await response.json()
//   } catch (error) {
//     console.error('매장 정보 로딩 실패:', error)
//     return null
//   }
// }

// const fetchMenuItems = async (storeId: string) => {
//   try {
//     const response = await fetch(`/api/stores/${storeId}/menu`)
//     return await response.json()
//   } catch (error) {
//     console.error('메뉴 데이터 로딩 실패:', error)
//     return []
//   }
// }

// const updateFavorite = async (menuId: number, isFavorite: boolean) => {
//   try {
//     await fetch(`/api/menu/${menuId}/favorite`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ isFavorite })
//     })
//   } catch (error) {
//     console.error('즐겨찾기 업데이트 실패:', error)
//   }
// }

// const addToCartAPI = async (menuId: number, quantity: number) => {
//   try {
//     await fetch('/api/cart', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ menuId, quantity })
//     })
//   } catch (error) {
//     console.error('장바구니 추가 실패:', error)
//   }
// }

const storeData = {
  id: 1,
  name: "학생식당",
  image: "/placeholder.svg?height=200&width=400",
  rating: 4.5,
  reviewCount: 128,
  description: "신선한 재료로 만든 건강한 한식",
  openTime: "11:00 - 20:00",
  phone: "031-219-1234",
}

const menuCategories = [
  { id: "best", name: "베스트 메뉴", icon: "🏆" },
  { id: "rice", name: "밥류", icon: "🍚" },
  { id: "noodle", name: "면류", icon: "🍜" },
  { id: "side", name: "사이드", icon: "🥗" },
]

const menuItems = [
  {
    id: 1,
    name: "김치찌개",
    price: 4500,
    image: "/placeholder.svg?height=80&width=80",
    description: "매콤한 김치찌개",
    category: "best",
    isFavorite: true,
    tags: ["매운맛", "든든함", "따뜻함"],
    likes: 89,
    isPopular: true,
  },
  {
    id: 2,
    name: "불고기덮밥",
    price: 5000,
    image: "/placeholder.svg?height=80&width=80",
    description: "달콤한 불고기덮밥",
    category: "rice",
    isFavorite: false,
    tags: ["달콤함", "든든함", "고기"],
    likes: 67,
    isPopular: true,
  },
  {
    id: 3,
    name: "라면",
    price: 3000,
    image: "/placeholder.svg?height=80&width=80",
    description: "얼큰한 라면",
    category: "noodle",
    isFavorite: false,
    tags: ["매운맛", "간단함", "빠름"],
    likes: 45,
    isPopular: false,
  },
  {
    id: 4,
    name: "계란말이",
    price: 2000,
    image: "/placeholder.svg?height=80&width=80",
    description: "부드러운 계란말이",
    category: "side",
    isFavorite: true,
    tags: ["부드러움", "담백함", "간단함"],
    likes: 34,
    isPopular: false,
  },
]

export default function StorePage({ params }: { params: { id: string } }) {
  // TODO: API 연동 - 실제 데이터 상태 관리
  // const [storeData, setStoreData] = useState(null)
  // const [menuItems, setMenuItems] = useState([])
  // const [loading, setLoading] = useState(true)

  // TODO: API 연동 - 데이터 로딩
  // useEffect(() => {
  //   const loadData = async () => {
  //     setLoading(true)
  //     const [store, menu] = await Promise.all([
  //       fetchStoreDetails(params.id),
  //       fetchMenuItems(params.id)
  //     ])
  //     setStoreData(store)
  //     setMenuItems(menu)
  //     setLoading(false)
  //   }
  //   loadData()
  // }, [params.id])

  const [selectedCategory, setSelectedCategory] = useState("best")
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({
    1: true,
    4: true,
  })

  const filteredMenus = menuItems.filter((item) =>
    selectedCategory === "best" ? item.isPopular : item.category === selectedCategory,
  )

  const addToCart = (itemId: number) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }))
    // TODO: API 연동 - 장바구니에 추가
    // addToCartAPI(itemId, 1)
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
    // TODO: API 연동 - 즐겨찾기 상태 업데이트
    // updateFavorite(itemId, !favorites[itemId])
  }

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0)

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
            <h1 className="font-medium">{storeData.name}</h1>
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
          <img src={storeData.image || "/placeholder.svg"} alt={storeData.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{storeData.name}</h2>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{storeData.rating}</span>
                <span className="text-gray-500">({storeData.reviewCount})</span>
              </div>
            </div>
            <p className="text-gray-600 mt-1">{storeData.description}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>⏰ {storeData.openTime}</span>
              <span>📞 {storeData.phone}</span>
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
            {filteredMenus.map((item) => (
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
                      {item.tags.map((tag, index) => (
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
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => addToCart(item.id)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button size="sm" onClick={() => addToCart(item.id)} className="ml-2">
                        담기
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
