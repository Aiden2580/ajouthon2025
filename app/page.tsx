"use client"

import { useState, useEffect } from "react"
import AuthGuard from "@/lib/AuthGuard"
import { storeAPI } from "@/lib/auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Star, Clock, MapPin, X } from "lucide-react"
import Link from "next/link"

const categories = [
  { id: "cafe", name: "카페" },
  { id: "restaurant", name: "식당" },
  { id: "preorder", name: "프리오더" },
]

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 컴포넌트 마운트 시 매장 데이터 로딩
  useEffect(() => {
    const loadStores = async () => {
      setLoading(true)
      try {
        const storeData = await storeAPI.getAllStores()
        // API 응답을 기존 형태에 맞게 변환
        const transformedStores = storeData.map((store: any) => ({
          id: store.id,
          name: store.storeName,
          category: "restaurant", // 기본값, 실제로는 API에서 카테고리 정보가 필요
          image: "/placeholder.svg?height=120&width=200",
          rating: 4.5, // 기본값, 실제로는 API에서 평점 정보가 필요
          reviewCount: 0, // 기본값
          distance: "도보 2분", // 기본값
          isOpen: true, // 기본값
          tags: ["한식", "저렴함"], // 기본값
          menus: [], // 나중에 개별적으로 로드
        }))
        setStores(transformedStores)
      } catch (error) {
        console.error("매장 데이터 로딩 실패:", error)
        // 에러 시 빈 배열로 설정
        setStores([])
      } finally {
        setLoading(false)
      }
    }
    loadStores()
  }, [])

  // 매장명과 메뉴명으로 검색하는 로직
  const performLocalSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = stores
      .filter((store) => {
        // 매장명으로 검색
        const storeNameMatch = store.name.toLowerCase().includes(query)
        // 메뉴명으로 검색 (현재는 빈 배열이므로 나중에 구현)
        const menuMatch = store.menus.some((menu: string) => menu.toLowerCase().includes(query))

        return storeNameMatch || menuMatch
      })
      .map((store) => {
        // 매칭된 메뉴들 찾기
        const matchedMenus = store.menus.filter((menu: string) => menu.toLowerCase().includes(query))

        return {
          ...store,
          matchedMenus,
          matchType: store.name.toLowerCase().includes(query) ? "store" : "menu",
        }
      })

    setSearchResults(results)
  }

  // 검색어 변경 시 실시간 검색
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (value.trim()) {
      performLocalSearch()
    } else {
      setSearchResults([])
    }
  }

  const filteredStores = searchQuery
    ? searchResults
    : stores.filter((store) => {
        const matchesCategory = selectedCategory === null || store.category === selectedCategory
        return matchesCategory
      })

  // 카테고리별 한글 제목 매핑
  const getCategoryTitle = () => {
    if (searchQuery) {
      return `"${searchQuery}" 검색 결과`
    }
    if (selectedCategory === null) {
      return "전체 매장"
    }
    switch (selectedCategory) {
      case "cafe":
        return "카페"
      case "restaurant":
        return "식당"
      case "preorder":
        return "프리오더"
      default:
        return "매장"
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(categoryId)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowSearchBar(false)
  }

  const toggleSearch = () => {
    setShowSearchBar(!showSearchBar)
    if (showSearchBar) {
      clearSearch()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#0051a2] mb-4">아주오더</div>
          <div className="text-gray-500">매장 정보를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#0051a2] text-white sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">AjouOrder</h1>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleSearch} className="text-white hover:bg-white/10">
                <Search className="h-6 w-6" />
              </Button>
              <Link href="/cart">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">2</Badge>
                </div>
              </Link>
            </div>
          </div>

          {/* Search Bar - 조건부 렌더링 */}
          {showSearchBar && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="가게나 메뉴를 검색하세요"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-10 bg-white text-gray-900"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Category Buttons - 검색 중이 아닐 때만 표시 */}
          {!showSearchBar && (
            <div className="flex justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCategoryClick(category.id)}
                  className={`${
                    selectedCategory === category.id
                      ? "bg-white text-[#0051a2] border-white"
                      : "bg-white text-gray-700 border-white hover:bg-gray-100"
                  } rounded-full px-4 flex-1 max-w-[100px]`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {/* Category/Search Title */}
        <div className="px-4 py-4 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{getCategoryTitle()}</h2>
            <span className="text-sm text-gray-500">{filteredStores.length}개 매장</span>
          </div>
        </div>

        {/* Store List */}
        <div className="px-4 pb-20 bg-white">
          <div className="space-y-4">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-500">검색 중...</p>
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-4xl mb-4">🏪</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? "검색 결과가 없습니다" : "매장이 없습니다"}
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? "다른 검색어를 시도해보세요" : "해당 카테고리에 매장이 없습니다"}
                </p>
                {searchQuery && (
                  <Button onClick={clearSearch} variant="outline" className="mt-4">
                    검색 초기화
                  </Button>
                )}
              </div>
            ) : (
              filteredStores.map((store) => (
                <Link key={store.id} href={`/store/${store.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <img
                            src={store.image || "/placeholder.svg"}
                            alt={store.name}
                            className="w-full h-full object-cover rounded-l-lg"
                          />
                          {!store.isOpen && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-l-lg">
                              <span className="text-white text-xs font-medium">영업종료</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-900">{store.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {categories.find((cat) => cat.id === store.category)?.name}
                                </Badge>
                              </div>

                              {/* 검색 결과에서 매칭된 메뉴 표시 */}
                              {searchQuery && store.matchedMenus && store.matchedMenus.length > 0 && (
                                <div className="mt-1">
                                  <p className="text-xs text-blue-600">
                                    메뉴: {store.matchedMenus.slice(0, 2).join(", ")}
                                    {store.matchedMenus.length > 2 && ` 외 ${store.matchedMenus.length - 2}개`}
                                  </p>
                                </div>
                              )}

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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#66aadf] text-white">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around">
            <Link href="/" className="flex flex-col items-center py-2 text-white">
              <div className="w-6 h-6 mb-1">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <span className="text-xs font-medium">홈</span>
            </Link>
            <Link href="/orders" className="flex flex-col items-center py-2 text-white/70">
              <div className="w-6 h-6 mb-1">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <span className="text-xs">주문내역</span>
            </Link>
            <Link href="/favorites" className="flex flex-col items-center py-2 text-white/70">
              <div className="w-6 h-6 mb-1">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="text-xs">즐겨찾기</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center py-2 text-white/70">
              <div className="w-6 h-6 mb-1">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <span className="text-xs">마이페이지</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default function Page() {
  return (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  )
}
