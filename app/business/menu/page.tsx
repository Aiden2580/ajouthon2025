"use client"

import { useState, useEffect } from "react"
import BusinessAuthGuard from "@/lib/BusinessAuthGuard"
import { authStorage, storeAPI, businessMenuAPI, type StoreDto, type MenuDto } from "@/lib/auth"

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
            }
          } else {
            console.error("매장 정보를 찾을 수 없습니다.")
            alert("매장 정보를 찾을 수 없습니다. 매장을 먼저 등록해주세요.")
          }
        }
      } catch (error) {
        console.error("메뉴 데이터 로딩 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMenuData()
  }, [])

  useEffect(() => {
    // 메뉴 관리 페이지는 삭제되었으므로 메인 페이지로 리다이렉트
    window.location.href = "/business"
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium text-gray-900 mb-2">메인 페이지로 이동 중...</div>
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
