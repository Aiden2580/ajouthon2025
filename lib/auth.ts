// 인증 관련 유틸리티 함수들

export interface UserDto {
  id: number
  email: string
  name: string
  role: string
  studentNumber: string
  department: string
  createdAt: string
  lastUpdatedAt: string
}

export interface StoreDto {
  id: number
  storeName: string
  storeLocation: string
  // 확장된 매장 정보 (실제 API에 없다면 기본값 사용)
  rating?: number
  reviewCount?: number
  openTime?: string
  phone?: string
  image?: string
}

export interface MenuDto {
  id: number
  storeId: number
  menuName: string
  price: number
  amount: number
  description: string
  createdAt: string
  lastUpdatedAt: string
}

export interface OrderDto {
  id: number
  userId: number
  storeId: number
  price: number
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  createdAt: string
  lastUpdatedAt: string
}

// 실제 백엔드 API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://ajoutonback.hunian.site"

// 공통 fetch 옵션
const getFetchOptions = (method = "GET", body?: Record<string, any>): RequestInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/x-www-form-urlencoded",
  }

  const options: RequestInit = {
    method,
    mode: "cors",
    credentials: "omit",
    headers,
  }

  if (body) {
    const urlEncodedBody = new URLSearchParams()
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlEncodedBody.append(key, String(value))
      }
    })
    options.body = urlEncodedBody.toString()
  }

  return options
}

export const authAPI = {
  // 로그인 API
  login: async (email: string, password: string): Promise<UserDto> => {
    try {
      console.log("로그인 요청 시작:", {
        url: `${API_BASE_URL}/users/login`,
        email,
      })

      const response = await fetch(`${API_BASE_URL}/users/login`, getFetchOptions("POST", { email, password }))

      console.log("응답 상태:", response.status, response.statusText)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.")
        } else if (response.status === 404) {
          throw new Error("사용자를 찾을 수 없습니다.")
        } else {
          let errorMessage = "로그인 중 오류가 발생했습니다."
          try {
            const errorText = await response.text()
            console.log("에러 응답:", errorText)
            errorMessage = errorText || errorMessage
          } catch (e) {
            console.log("에러 응답 파싱 실패:", e)
          }
          throw new Error(errorMessage)
        }
      }

      const userData = await response.json()
      console.log("로그인 성공:", userData)
      return userData
    } catch (error) {
      console.error("로그인 API 에러:", error)

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(`서버에 연결할 수 없습니다. CORS 설정을 확인해주세요. (${API_BASE_URL})`)
      }

      throw error
    }
  },

  // 회원가입 API
  signup: async (userData: {
    email: string
    name: string
    role: string
    password: string
    studentNumber: string
    department: string
  }): Promise<UserDto> => {
    try {
      console.log("회원가입 요청 시작:", {
        url: `${API_BASE_URL}/users/signup`,
        userData: { ...userData, password: "[HIDDEN]" },
      })

      const requestBody = {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: userData.password,
        stdNum: userData.studentNumber,
        depart: userData.department,
      }

      console.log("실제 전송 데이터:", { ...requestBody, password: "[HIDDEN]" })

      const response = await fetch(`${API_BASE_URL}/users/signup`, getFetchOptions("POST", requestBody))

      console.log("응답 상태:", response.status, response.statusText)

      const responseText = await response.text()
      console.log("응답 내용 (원본):", responseText)

      if (!response.ok) {
        console.error("HTTP 에러 발생:", {
          status: response.status,
          statusText: response.statusText,
          responseText: responseText,
        })

        let errorMessage = `회원가입 실패 (${response.status}): `

        if (response.status === 400) {
          errorMessage += "잘못된 요청입니다. 입력 정보를 확인해주세요."
          if (responseText) {
            errorMessage += ` 상세: ${responseText}`
          }
        } else if (response.status === 403) {
          errorMessage += "접근이 거부되었습니다. "
          if (responseText.includes("email")) {
            errorMessage += "이미 사용 중인 이메일입니다."
          } else if (responseText.includes("student")) {
            errorMessage += "이미 사용 중인 학번입니다."
          } else {
            errorMessage += responseText || "서버에서 요청을 거부했습니다."
          }
        } else if (response.status === 409) {
          errorMessage += "이미 존재하는 이메일 또는 학번입니다."
        } else {
          errorMessage += responseText || "알 수 없는 오류가 발생했습니다."
        }

        throw new Error(errorMessage)
      }

      let newUser
      try {
        newUser = JSON.parse(responseText)
      } catch (parseError) {
        console.error("응답 파싱 에러:", parseError)
        throw new Error("서버 응답을 파싱할 수 없습니다: " + responseText)
      }

      console.log("회원가입 성공:", newUser)
      return newUser
    } catch (error) {
      console.error("회원가입 API 에러:", error)

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(`서버에 연결할 수 없습니다. 네트워크를 확인해주세요. (${API_BASE_URL})`)
      }

      throw error
    }
  },

  // 사용자 정보 조회 API
  getUserInfo: async (email: string): Promise<UserDto> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, getFetchOptions("POST", { email }))

      if (!response.ok) {
        throw new Error("사용자 정보를 가져올 수 없습니다.")
      }

      return await response.json()
    } catch (error) {
      console.error("사용자 정보 조회 에러:", error)
      throw error
    }
  },
}

// 매장 관련 API
export const storeAPI = {
  // 모든 매장 조회
  getAllStores: async (): Promise<StoreDto[]> => {
    try {
      console.log("매장 목록 조회 시작:", `${API_BASE_URL}/store/all`)

      const response = await fetch(`${API_BASE_URL}/store/all`, getFetchOptions("GET"))

      console.log("매장 목록 응답 상태:", response.status, response.statusText)

      if (!response.ok) {
        throw new Error("매장 정보를 가져올 수 없습니다.")
      }

      const stores = await response.json()
      console.log("매장 목록 조회 성공:", stores)

      // API 응답에 추가 정보가 없다면 기본값 추가
      return stores.map((store: any) => ({
        ...store,
        rating: store.rating || 4.5,
        reviewCount: store.reviewCount || Math.floor(Math.random() * 200) + 50,
        openTime: store.openTime || "11:00 - 20:00",
        phone: store.phone || "031-219-1234",
        image: store.image || "/placeholder.svg?height=120&width=200",
      }))
    } catch (error) {
      console.error("매장 정보 조회 에러:", error)
      throw error
    }
  },

  // 특정 매장의 메뉴 조회
  getStoreMenus: async (storeId: number): Promise<MenuDto[]> => {
    try {
      console.log("매장 메뉴 조회 시작:", `${API_BASE_URL}/store/${storeId}/menus`)

      const response = await fetch(`${API_BASE_URL}/store/${storeId}/menus`, getFetchOptions("GET"))

      console.log("매장 메뉴 응답 상태:", response.status, response.statusText)

      if (!response.ok) {
        throw new Error("메뉴 정보를 가져올 수 없습니다.")
      }

      const menus = await response.json()
      console.log("매장 메뉴 조회 성공:", menus)
      return menus
    } catch (error) {
      console.error("메뉴 정보 조회 에러:", error)
      throw error
    }
  },

  // 매장 정보 찾기 (로컬 캐시 활용)
  findStoreById: async (storeId: number): Promise<StoreDto | null> => {
    try {
      const stores = await storeAPI.getAllStores()
      return stores.find((store) => store.id === storeId) || null
    } catch (error) {
      console.error("매장 정보 찾기 에러:", error)
      return null
    }
  },
}

// 주문 관련 API
export const orderAPI = {
  // 주문 생성
  createOrder: async (userId: number, storeId: number, menuName: string): Promise<OrderDto> => {
    try {
      console.log("주문 생성 시작:", { userId, storeId, menuName })

      const response = await fetch(
        `${API_BASE_URL}/orders/create`,
        getFetchOptions("POST", { userId, storeId, menuName }),
      )

      console.log("주문 생성 응답 상태:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("주문 생성 실패:", errorText)
        throw new Error("주문 생성에 실패했습니다: " + errorText)
      }

      const order = await response.json()
      console.log("주문 생성 성공:", order)
      return order
    } catch (error) {
      console.error("주문 생성 에러:", error)
      throw error
    }
  },

  // 주문 완료 (관리자용)
  completeOrder: async (userId: number, orderId: number): Promise<void> => {
    try {
      console.log("주문 완료 처리 시작:", { userId, orderId })

      const response = await fetch(`${API_BASE_URL}/orders/complete`, getFetchOptions("POST", { userId, orderId }))

      console.log("주문 완료 응답 상태:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("주문 완료 실패:", errorText)
        throw new Error("주문 완료 처리에 실패했습니다: " + errorText)
      }

      console.log("주문 완료 처리 성공")
    } catch (error) {
      console.error("주문 완료 처리 에러:", error)
      throw error
    }
  },

  // 주문 완료 여부 확인
  isOrderCompleted: async (orderId: number): Promise<boolean> => {
    try {
      console.log("주문 완료 상태 확인 시작:", orderId)

      const response = await fetch(`${API_BASE_URL}/orders/is-completed`, getFetchOptions("POST", { orderId }))

      console.log("주문 완료 상태 응답:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("주문 상태 확인 실패:", errorText)
        throw new Error("주문 상태를 확인할 수 없습니다: " + errorText)
      }

      const result = await response.json()
      console.log("주문 완료 상태 확인 성공:", result)

      // API 응답이 boolean이라고 가정
      return result === true || result.completed === true
    } catch (error) {
      console.error("주문 상태 확인 에러:", error)
      throw error
    }
  },

  // 사용자별 주문 내역 조회 (추후 API 추가 시 사용)
  getUserOrders: async (userId: number): Promise<OrderDto[]> => {
    try {
      const response = await fetch(`http://ajoutonback.hunian.site/orders/all_detail?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`주문 내역 조회 실패: ${errorText}`)
      }

      const orders: OrderDto[] = await response.json()
      return orders
    } catch (error) {
      console.error("사용자 주문 내역 조회 에러:", error)
      throw error
    }
  },
}

// 장바구니 관련 로컬 스토리지 관리
export interface CartItem {
  id: number
  menuName: string
  price: number
  quantity: number
  storeId: number
  storeName: string
}

export const cartStorage = {
  // 장바구니 아이템 추가
  addItem: (item: Omit<CartItem, "quantity">, quantity = 1) => {
    if (typeof window !== "undefined") {
      const cart = cartStorage.getItems()
      const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id)

      if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity
      } else {
        cart.push({ ...item, quantity })
      }

      localStorage.setItem("cart", JSON.stringify(cart))
      // 장바구니 변경 이벤트 발생
      window.dispatchEvent(new Event("cartChanged"))
    }
  },

  // 장바구니 아이템 수량 업데이트
  updateQuantity: (itemId: number, quantity: number) => {
    if (typeof window !== "undefined") {
      const cart = cartStorage.getItems()
      const itemIndex = cart.findIndex((item) => item.id === itemId)

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          cart.splice(itemIndex, 1)
        } else {
          cart[itemIndex].quantity = quantity
        }
        localStorage.setItem("cart", JSON.stringify(cart))
        window.dispatchEvent(new Event("cartChanged"))
      }
    }
  },

  // 장바구니 아이템 제거
  removeItem: (itemId: number) => {
    if (typeof window !== "undefined") {
      const cart = cartStorage.getItems().filter((item) => item.id !== itemId)
      localStorage.setItem("cart", JSON.stringify(cart))
      window.dispatchEvent(new Event("cartChanged"))
    }
  },

  // 장바구니 아이템 목록 조회
  getItems: (): CartItem[] => {
    if (typeof window !== "undefined") {
      const cartStr = localStorage.getItem("cart")
      return cartStr ? JSON.parse(cartStr) : []
    }
    return []
  },

  // 장바구니 비우기
  clearCart: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart")
      window.dispatchEvent(new Event("cartChanged"))
    }
  },

  // 장바구니 총 개수
  getTotalCount: (): number => {
    return cartStorage.getItems().reduce((total, item) => total + item.quantity, 0)
  },

  // 장바구니 총 금액
  getTotalPrice: (): number => {
    return cartStorage.getItems().reduce((total, item) => total + item.price * item.quantity, 0)
  },
}

// 즐겨찾기 관련 로컬 스토리지 관리
export const favoriteStorage = {
  // 즐겨찾기 추가/제거
  toggleFavorite: (menuId: number) => {
    if (typeof window !== "undefined") {
      const favorites = favoriteStorage.getFavorites()
      const index = favorites.indexOf(menuId)

      if (index >= 0) {
        favorites.splice(index, 1)
      } else {
        favorites.push(menuId)
      }

      localStorage.setItem("favorites", JSON.stringify(favorites))
      window.dispatchEvent(new Event("favoritesChanged"))
    }
  },

  // 즐겨찾기 목록 조회
  getFavorites: (): number[] => {
    if (typeof window !== "undefined") {
      const favoritesStr = localStorage.getItem("favorites")
      return favoritesStr ? JSON.parse(favoritesStr) : []
    }
    return []
  },

  // 즐겨찾기 여부 확인
  isFavorite: (menuId: number): boolean => {
    return favoriteStorage.getFavorites().includes(menuId)
  },

  // 즐겨찾기 비우기
  clearFavorites: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("favorites")
      window.dispatchEvent(new Event("favoritesChanged"))
    }
  },
}

// 주문 내역 로컬 스토리지 관리
export interface LocalOrderDto {
  id: string
  orderNumber: string
  storeName: string
  items: { menuName: string; quantity: number; price: number }[]
  price: number
  orderTime: string
  status: "preparing" | "ready" | "completed"
  specialRequest?: string
  estimatedPickupTime?: string
}

export const orderStorage = {
  // 주문 추가
  addOrder: (order: LocalOrderDto) => {
    if (typeof window !== "undefined") {
      const orders = orderStorage.getOrders()
      orders.unshift(order) // 최신 주문을 앞에 추가
      localStorage.setItem("orders", JSON.stringify(orders))
      window.dispatchEvent(new Event("ordersChanged"))
    }
  },

  // 주문 목록 조회
  getOrders: (): LocalOrderDto[] => {
    if (typeof window !== "undefined") {
      const ordersStr = localStorage.getItem("orders")
      return ordersStr ? JSON.parse(ordersStr) : []
    }
    return []
  },

  // 주문 상태 업데이트
  updateOrderStatus: (orderId: string, status: LocalOrderDto["status"]) => {
    if (typeof window !== "undefined") {
      const orders = orderStorage.getOrders()
      const orderIndex = orders.findIndex((order) => order.id === orderId)

      if (orderIndex >= 0) {
        orders[orderIndex].status = status
        localStorage.setItem("orders", JSON.stringify(orders))
        window.dispatchEvent(new Event("ordersChanged"))
      }
    }
  },

  // 주문 찾기
  findOrderById: (orderId: string): LocalOrderDto | null => {
    const orders = orderStorage.getOrders()
    return orders.find((order) => order.id === orderId) || null
  },

  // 주문 내역 비우기
  clearOrders: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("orders")
      window.dispatchEvent(new Event("ordersChanged"))
    }
  },
}

// 사용자 통계 정보 계산
export const userStatsAPI = {
  // 사용자 통계 계산
  getUserStats: (userId: number) => {
    const orders = orderStorage.getOrders()
    const userOrders = orders.filter((order) => order.id.includes(userId.toString()))

    // 총 주문 수
    const totalOrders = userOrders.length

    // 최애 매장 계산
    const storeCount: { [key: string]: number } = {}
    userOrders.forEach((order) => {
      storeCount[order.storeName] = (storeCount[order.storeName] || 0) + 1
    })

    const favoriteStore =
      Object.keys(storeCount).length > 0
        ? Object.keys(storeCount).reduce((a, b) => (storeCount[a] > storeCount[b] ? a : b))
        : "아직 없음"

    // 총 주문 금액
    const price = userOrders.reduce((sum, order) => sum + order.price, 0)

    return {
      totalOrders,
      favoriteStore,
      price,
    }
  },
}

// 로컬 스토리지에서 사용자 정보 관리
export const authStorage = {
  setUser: (user: UserDto) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("isLoggedIn", "true")
    }
  },

  getUser: (): UserDto | null => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  },

  isLoggedIn: (): boolean => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isLoggedIn") === "true"
    }
    return false
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("isLoggedIn")
      // 로그아웃 시 장바구니, 즐겨찾기는 비우지만 주문내역은 유지
      cartStorage.clearCart()
      favoriteStorage.clearFavorites()
    }
  },
}

// 이메일 유효성 검사 (아주대학교 이메일)
export const validateAjouEmail = (email: string): boolean => {
  const ajouEmailRegex = /^[a-zA-Z0-9._%+-]+@ajou\.ac\.kr$/
  return ajouEmailRegex.test(email)
}
