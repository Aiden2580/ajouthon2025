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

// 실제 백엔드 API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://ajoutonback.hunian.site/"

export const authAPI = {
  // 로그인 API
  login: async (email: string, password: string): Promise<UserDto> => {
    try {
      console.log("로그인 요청 시작:", {
        url: `${API_BASE_URL}/users/login`,
        email,
      })

      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

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
        throw new Error(`서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요. (${API_BASE_URL})`)
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
    stdNum: string
    depart: string
  }): Promise<UserDto> => {
    try {
      console.log("회원가입 요청 시작:", {
        url: `${API_BASE_URL}/users/signup`,
        userData: { ...userData, password: "[HIDDEN]" },
      })

      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          role: userData.role,
          password: userData.password,
          stdNum: userData.stdNum,
          depart: userData.depart,
        }),
      })

      console.log("응답 상태:", response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = "회원가입 중 오류가 발생했습니다."
        try {
          const errorText = await response.text()
          console.log("에러 응답:", errorText)
          errorMessage = errorText || errorMessage
        } catch (e) {
          console.log("에러 응답 파싱 실패:", e)
        }
        throw new Error(errorMessage)
      }

      const newUser = await response.json()
      console.log("회원가입 성공:", newUser)
      return newUser
    } catch (error) {
      console.error("회원가입 API 에러:", error)

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(`서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요. (${API_BASE_URL})`)
      }

      throw error
    }
  },

  // 사용자 정보 조회 API
  getUserInfo: async (email: string): Promise<UserDto> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error("사용자 정보를 가져올 수 없습니다.")
    }

    return await response.json()
  },
}

// 매장 관련 API
export const storeAPI = {
  // 모든 매장 조회
  getAllStores: async () => {
    const response = await fetch(`${API_BASE_URL}/store/all`)
    if (!response.ok) {
      throw new Error("매장 정보를 가져올 수 없습니다.")
    }
    return await response.json()
  },

  // 특정 매장의 메뉴 조회
  getStoreMenus: async (storeId: number) => {
    const response = await fetch(`${API_BASE_URL}/store/${storeId}/menus`)
    if (!response.ok) {
      throw new Error("메뉴 정보를 가져올 수 없습니다.")
    }
    return await response.json()
  },
}

// 주문 관련 API
export const orderAPI = {
  // 주문 생성
  createOrder: async (userId: number, storeId: number, menuName: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, storeId, menuName }),
    })

    if (!response.ok) {
      throw new Error("주문 생성에 실패했습니다.")
    }

    return await response.json()
  },

  // 주문 완료 여부 확인
  isOrderCompleted: async (orderId: number) => {
    const response = await fetch(`${API_BASE_URL}/orders/is-completed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    })

    if (!response.ok) {
      throw new Error("주문 상태를 확인할 수 없습니다.")
    }

    return await response.json()
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
    }
  },
}

// 이메일 유효성 검사 (아주대학교 이메일)
export const validateAjouEmail = (email: string): boolean => {
  const ajouEmailRegex = /^[a-zA-Z0-9._%+-]+@ajou\.ac\.kr$/
  return ajouEmailRegex.test(email)
}
