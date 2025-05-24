"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Heart, Plus, Minus, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { storeAPI, cartStorage, favoriteStorage, type StoreDto, type MenuDto } from "@/lib/auth"

export default function StorePage({ params }: { params: { id: string } }) {
  const [storeData, setStoreData] = useState<StoreDto | null>(null)
  const [menuItems, setMenuItems] = useState<MenuDto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({})
  const [cartCount, setCartCount] = useState(0)

  // 장바구니 개수 업데이트
  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(cartStorage.getTotalCount())
    }

    updateCartCount()

    const handleCartChange = () => {
      updateCartCount()
    }

    window.addEventListener("cartChanged", handleCartChange)
    window.addEventListener("storage", handleCartChange)

    return () => {
      window.removeEventListener("cartChanged", handleCartChange)
      window.removeEventListener("storage", handleCartChange)
    }
  }, [])

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const storeId = Number.parseInt(params.id)

        // 매장 정보와 메뉴 정보를 병렬로 로드
        const [storeInfo, menuData] = await Promise.all([
          storeAPI.findStoreById(storeId),
          storeAPI.getStoreMenus(storeId),
        ])

        if (storeInfo) {
          setStoreData(storeInfo)
        } else {
          // 매장 정보를 찾을 수 없는 경우 기본값 설정
          setStoreData({
            id: storeId,
            storeName: "매장을 찾을 수 없습니다",
            storeLocation: "위치 정보 없음",
          })
        }

        setMenuItems(menuData)
      } catch (error) {
        console.error("데이터 로딩 실패:", error)
        setStoreData({
          id: Number.parseInt(params.id),
          storeName: "매장을 찾을 수 없습니다",
          storeLocation: "위치 정보 없음",
        })
        setMenuItems([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [params.id])

  // 즐겨찾기 상태 로딩
  useEffect(() => {
    const loadFavorites = () => {
      const favoriteIds = favoriteStorage.getFavorites()
      const favoriteMap: { [key: number]: boolean } = {}
      favoriteIds.forEach((id) => {
        favoriteMap[id] = true
      })
      setFavorites(favoriteMap)
    }

    loadFavorites()

    const handleFavoritesChange = () => {
      loadFavorites()
    }

    window.addEventListener("favoritesChanged", handleFavoritesChange)
    return () => window.removeEventListener("favoritesChanged", handleFavoritesChange)
  }, [])

  const menuCategories = [
    { id: "all", name: "전체 메뉴", icon: "🍽️" },
    { id: "available", name: "주문 가능", icon: "✅" },
  ]

  const filteredMenus = menuItems.filter((item) => {
    if (selectedCategory === "all") return true
    if (selectedCategory === "available") return item.amount > 0
    return true
  })

  const addToCart = (menu: MenuDto) => {
    if (!storeData) return

    // 로컬 상태 업데이트
    setCart((prev) => ({
      ...prev,
      [menu.id]: (prev[menu.id] || 0) + 1,
    }))

    // 로컬 스토리지에 추가
    cartStorage.addItem({
      id: menu.id,
      menuName: menu.menuName,
      price: menu.price,
      storeId: storeData.id,
      storeName: storeData.storeName,
    })
  }

  const removeFromCart = (menuId: number) => {
    setCart((prev) => ({
      ...prev,
      [menuId]: Math.max((prev[menuId] || 0) - 1, 0),
    }))

    const currentQuantity = cart[menuId] || 0
    if (currentQuantity > 1) {
      cartStorage.updateQuantity(menuId, currentQuantity - 1)
    } else {
      cartStorage.removeItem(menuId)
    }
  }

  const toggleFavorite = (itemId: number) => {
    favoriteStorage.toggleFavorite(itemId)
    setFavorites((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

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
            <h1 className="font-medium">{storeData?.storeName}</h1>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">{cartCount}</Badge>
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
            src={storeData?.image || "/placeholder.svg?height=200&width=400"}
            alt={storeData?.storeName}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{storeData?.storeName}</h2>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{storeData?.rating || 4.5}</span>
                <span className="text-gray-500">({storeData?.reviewCount || 128})</span>
              </div>
            </div>
            <p className="text-gray-600 mt-1">{storeData?.storeLocation}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>⏰ {storeData?.openTime || "11:00 - 20:00"}</span>
              <span>📞 {storeData?.phone || "031-219-1234"}</span>
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
                      src="/placeholder.svg?height=80&width=80"
                      alt={item.menuName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{item.menuName}</h3>
                            {item.amount > 0 && item.amount < 5 && (
                              <Badge variant="destructive" className="text-xs">
                                품절임박
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <p className="font-bold text-lg mt-1">{item.price.toLocaleString()}원</p>
                          <p className="text-sm text-gray-500">재고: {item.amount}개</p>
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
                            onClick={() => addToCart(item)}
                            disabled={item.amount === 0}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button size="sm" onClick={() => addToCart(item)} className="ml-2" disabled={item.amount === 0}>
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
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-md mx-auto p-4">
            <Link href="/cart">
              <Button className="w-full" size="lg">
                장바구니 보기 ({cartCount}개)
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
