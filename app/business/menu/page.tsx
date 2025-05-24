"use client"

import { useState, useEffect } from "react"
import BusinessAuthGuard from "@/lib/BusinessAuthGuard"
import { authStorage, storeAPI, businessMenuAPI, type StoreDto, type MenuDto } from "@/lib/auth"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Edit, Trash2, Package, PackageX, Save, X } from "lucide-react"
import Link from "next/link"

interface MenuFormData {
  menuName: string
  price: number
  amount: number
  description: string
}

function BusinessMenuPage() {
  const [storeData, setStoreData] = useState<StoreDto | null>(null)
  const [menuItems, setMenuItems] = useState<MenuDto[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuDto | null>(null)
  const [formData, setFormData] = useState<MenuFormData>({
    menuName: "",
    price: 0,
    amount: 0,
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadMenuData = async () => {
      setLoading(true)
      try {
        const user = authStorage.getUser()
        console.log("메뉴 관리 - 현재 사용자:", user)

        if (user) {
          // 가게 주인의 매장 정보 조회
          console.log("매장 정보 조회 시작...")
          const store = await storeAPI.findStoreByOwnerEmail(user.email)
          console.log("조회된 매장:", store)

          if (store) {
            setStoreData(store)

            // 매장의 메뉴 조회
            console.log("메뉴 정보 조회 시작...")
            try {
              const menus = await storeAPI.getStoreMenus(store.id)
              console.log("조회된 메뉴:", menus)
              setMenuItems(menus)
            } catch (menuError) {
              console.error("메뉴 정보 로딩 실패:", menuError)
              setMenuItems([])
              alert("메뉴 정보를 불러오는데 실패했습니다: " + menuError.message)
            }
          } else {
            console.error("매장 정보를 찾을 수 없습니다.")
            alert("매장 정보를 찾을 수 없습니다. 매장을 먼저 등록해주세요.")
          }
        }
      } catch (error) {
        console.error("메뉴 데이터 로딩 실패:", error)
        alert("메뉴 데이터를 불러오는데 실패했습니다: " + error.message)
      } finally {
        setLoading(false)
      }
    }

    loadMenuData()
  }, [])

  const resetForm = () => {
    setFormData({
      menuName: "",
      price: 0,
      amount: 0,
      description: "",
    })
    setShowAddForm(false)
    setEditingMenu(null)
  }

  const refreshMenuList = async () => {
    if (storeData) {
      try {
        const menus = await storeAPI.getStoreMenus(storeData.id)
        setMenuItems(menus)
      } catch (error) {
        console.error("메뉴 목록 새로고침 실패:", error)
      }
    }
  }

  const handleAddMenu = async () => {
    if (!storeData) return

    if (!formData.menuName.trim()) {
      alert("메뉴명을 입력해주세요.")
      return
    }

    if (formData.price <= 0) {
      alert("올바른 가격을 입력해주세요.")
      return
    }

    setIsSubmitting(true)

    try {
      await businessMenuAPI.addMenu(storeData.id, formData)
      await refreshMenuList()
      resetForm()
      alert("메뉴가 추가되었습니다!")
    } catch (error) {
      console.error("메뉴 추가 실패:", error)
      alert("메뉴 추가에 실패했습니다: " + (error instanceof Error ? error.message : "알 수 없는 오류"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditMenu = async () => {
    if (!editingMenu || !storeData) return

    if (!formData.menuName.trim()) {
      alert("메뉴명을 입력해주세요.")
      return
    }

    if (formData.price <= 0) {
      alert("올바른 가격을 입력해주세요.")
      return
    }

    setIsSubmitting(true)

    try {
      await businessMenuAPI.updateMenu(storeData.id, editingMenu.menuName, formData)
      await refreshMenuList()
      resetForm()
      alert("메뉴가 수정되었습니다!")
    } catch (error) {
      console.error("메뉴 수정 실패:", error)
      alert("메뉴 수정에 실패했습니다: " + (error instanceof Error ? error.message : "알 수 없는 오류"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMenu = async (menu: MenuDto) => {
    if (!storeData) return

    if (!confirm(`정말 "${menu.menuName}" 메뉴를 삭제하시겠습니까?`)) return

    try {
      await businessMenuAPI.deleteMenu(storeData.id, menu.menuName)
      await refreshMenuList()
      alert("메뉴가 삭제되었습니다!")
    } catch (error) {
      console.error("메뉴 삭제 실패:", error)
      alert("메뉴 삭제에 실패했습니다: " + (error instanceof Error ? error.message : "알 수 없는 오류"))
    }
  }

  const handleToggleAvailability = async (menu: MenuDto) => {
    if (!storeData) return

    const newAmount = menu.amount > 0 ? 0 : 10 // 품절 <-> 재개
    const action = newAmount > 0 ? "재개" : "품절 처리"

    if (!confirm(`"${menu.menuName}" 메뉴를 ${action}하시겠습니까?`)) return

    try {
      await businessMenuAPI.toggleMenuAvailability(storeData.id, menu.menuName, menu, newAmount)
      await refreshMenuList()
      alert(`메뉴 ${action}가 완료되었습니다!`)
    } catch (error) {
      console.error("메뉴 상태 변경 실패:", error)
      alert("메뉴 상태 변경에 실패했습니다: " + (error instanceof Error ? error.message : "알 수 없는 오류"))
    }
  }

  const startEdit = (menu: MenuDto) => {
    setEditingMenu(menu)
    setFormData({
      menuName: menu.menuName,
      price: menu.price,
      amount: menu.amount,
      description: menu.description,
    })
    setShowAddForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">메뉴 정보를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/business">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="font-medium ml-2">메뉴 관리</h1>
            </div>
            <Button onClick={() => setShowAddForm(true)} disabled={showAddForm || isSubmitting}>
              <Plus className="h-4 w-4 mr-2" />
              메뉴 추가
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* Store Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold">{storeData?.storeName}</h2>
            <p className="text-gray-600">{storeData?.storeLocation}</p>
            <p className="text-sm text-gray-500 mt-1">총 {menuItems.length}개의 메뉴</p>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingMenu ? "메뉴 수정" : "새 메뉴 추가"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="menuName">메뉴명 *</Label>
                  <Input
                    id="menuName"
                    value={formData.menuName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, menuName: e.target.value }))}
                    placeholder="메뉴명을 입력하세요"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">가격 *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="가격을 입력하세요"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">재고 수량</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                    placeholder="재고 수량을 입력하세요"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="메뉴 설명을 입력하세요"
                    className="min-h-[80px]"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={editingMenu ? handleEditMenu : handleAddMenu}
                  disabled={!formData.menuName.trim() || formData.price <= 0 || isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "처리 중..." : editingMenu ? "수정" : "추가"}
                </Button>
                <Button variant="outline" onClick={resetForm} disabled={isSubmitting}>
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu List */}
        <div className="space-y-4">
          {menuItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">메뉴가 없습니다</h3>
                <p className="text-gray-500 mb-4">첫 번째 메뉴를 추가해보세요!</p>
                <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  메뉴 추가하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            menuItems.map((menu) => (
              <Card key={menu.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt={menu.menuName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium">{menu.menuName}</h3>
                          {menu.amount === 0 ? (
                            <Badge variant="destructive">품절</Badge>
                          ) : menu.amount < 5 ? (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              품절임박
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500">판매중</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{menu.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>가격: {menu.price.toLocaleString()}원</span>
                          <span>재고: {menu.amount}개</span>
                          <span>등록일: {new Date(menu.createdAt).toLocaleDateString("ko-KR")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAvailability(menu)}
                        disabled={isSubmitting}
                      >
                        {menu.amount > 0 ? (
                          <>
                            <PackageX className="h-4 w-4 mr-1" />
                            품절
                          </>
                        ) : (
                          <>
                            <Package className="h-4 w-4 mr-1" />
                            재개
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => startEdit(menu)} disabled={isSubmitting}>
                        <Edit className="h-4 w-4 mr-1" />
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMenu(menu)}
                        className="text-red-600 hover:text-red-700"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function BusinessMenuManagePage() {
  return (
    <BusinessAuthGuard>
      <BusinessMenuPage />
    </BusinessAuthGuard>
  )
}
