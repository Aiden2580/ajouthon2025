"use client"

import { useState } from "react"
// TODO: API 연동 - axios 또는 fetch를 위한 import 추가
// import axios from 'axios'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Star, Clock, MapPin, X } from "lucide-react"
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

// TODO: API 연동 - 검색 API 함수 (매장명 + 메뉴명 검색)
// const searchStoresAndMenus = async (query: string, category?: string) => {
//   try {
//     const params = new URLSearchParams()
//     if (query) params.append('q', query)
//     if (category) params.append('category', category)
//
//     const response = await fetch(`/api/search?${params}`)
//     const data = await response.json()
//     return data
//   } catch (error) {
//     console.error('검색 실패:', error)
//     return []
//   }
// }

// HARDCODED: 실제 API에서 가져와야 할 매장 데이터
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
    menus: ["김치찌개", "불고기덮밥", "된장찌개", "비빔밥"],
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
    menus: ["아메리카노", "카페라떼", "크로와상", "치즈케이크"],
  },
  {
    id: 3,
    name: "편의점",
    category: "preorder",
    image: "/placeholder.svg?height=120&width=200",
    rating: 4.1,
    reviewCount: 45,
    distance: "도보 1분",
    isOpen: false,
    tags: ["간편식", "24시간", "다양함"],
    menus: ["삼각김밥", "컵라면", "샌드위치", "음료수"],
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
    menus: ["정식", "갈비탕", "냉면", "돈까스"],
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
    menus: ["아메리카노", "프라푸치노", "머핀", "쿠키"],
  },
  {
    id: 6,
    name: "아주굿즈샵",
    category: "preorder",
    image: "/placeholder.svg?height=120&width=200",
    rating: 4.2,
    reviewCount: 34,
    distance: "도보 3분",
    isOpen: true,
    tags: ["굿즈", "기념품", "학용품"],
    menus: ["아주대 후드티", "텀블러", "볼펜", "노트"],
  },
  {
    id: 7,
    name: "투썸플레이스",
    category: "cafe",
    image: "/placeholder.svg?height=120&width=200",
    rating: 4.1,
    reviewCount: 92,
    distance: "도보 6분",
    isOpen: true,
    tags: ["디저트", "케이크", "브랜드"],
    menus: ["아메리카노", "생크림케이크", "마카롱", "샐러드"],
  },
  {
    id: 8,
    name: "기숙사식당",
    category: "restaurant",
    image: "/placeholder.svg?height=120&width=200",
    rating: 4.0,
    reviewCount: 78,
    distance: "도보 8분",
    isOpen: true,
    tags: ["한식", "저렴함", "기숙사"],
    menus: ["백반", "라면", "김치볶음밥", "계란말이"],
  },
]

const categories = [
  { id: "cafe", name: "카페" },
  { id: "restaurant", name: "식당" },
  { id: "preorder", name: "프리오더" },
]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
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

  // TODO: API 연동 - 검색 로직
  // useEffect(() => {
  //   const performSearch = async () => {
  //     if (searchQuery.trim()) {
  //       setIsSearching(true)
  //       const results = await searchStoresAndMenus(searchQuery, selectedCategory)
  //       setSearchResults(results)
  //       setIsSearching(false)
  //     } else {
  //       setSearchResults([])
  //     }
  //   }
  //
  //   const debounceTimer = setTimeout(performSearch, 300)
  //   return () => clearTimeout(debounceTimer)
  // }, [searchQuery, selectedCategory])

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
        // 메뉴명으로 검색
        const menuMatch = store.menus.some((menu) => menu.toLowerCase().includes(query))

        return storeNameMatch || menuMatch
      })
      .map((store) => {
        // 매칭된 메뉴들 찾기
        const matchedMenus = store.menus.filter((menu) => menu.toLowerCase().includes(query))

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

  // HARDCODED: 카테고리별 한글 제목 매핑
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
                  {/* HARDCODED: 장바구니 아이템 수 */}
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
