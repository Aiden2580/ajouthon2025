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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://ajoutonback.hunian.site"

// 공통 fetch 옵션
const getFetchOptions = (method = "GET", body?: any) => {
  const options: RequestInit = {
    method,
    mode: "cors", // CORS 모드 명시적 설정
    credentials: "omit", // 쿠키 등 인증 정보 제외
    headers: {
      "Content-Type": "application/json",
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
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

  // 회원가입 API - 더 자세한 에러 로깅 추가
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
        student_number: userData.studentNumber,
        department: userData.department,
      }

      console.log("실제 전송 데이터:", { ...requestBody, password: "[HIDDEN]" })

      const response = await fetch(`${API_BASE_URL}/users/signup`, getFetchOptions("POST", requestBody))

      console.log("응답 상태:", response.status, response.statusText)
      console.log("응답 헤더:", Object.fromEntries(response.headers.entries()))

      // 응답 내용을 먼저 텍스트로 읽어서 로깅
      const responseText = await response.text()
      console.log("응답 내용 (원본):", responseText)
      console.log("응답 내용 길이:", responseText.length)

      if (!response.ok) {
        console.error("HTTP 에러 발생:", {
          status: response.status,
          statusText: response.statusText,
          responseText: responseText,
          responseLength: responseText.length,
        })

        // 상태 코드별 에러 메시지
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
          } else if (responseText.includes("permission") || responseText.includes("권한")) {
            errorMessage += "회원가입 권한이 없습니다."
          } else if (responseText.includes("domain") || responseText.includes("ajou")) {
            errorMessage += "아주대학교 이메일만 사용 가능합니다."
          } else {
            errorMessage += responseText || "서버에서 요청을 거부했습니다."
          }
        } else if (response.status === 409) {
          errorMessage += "이미 존재하는 이메일 또는 학번입니다."
        } else if (response.status === 422) {
          errorMessage += "입력 데이터 형식이 올바르지 않습니다."
          if (responseText) {
            errorMessage += ` 상세: ${responseText}`
          }
        } else if (response.status === 500) {
          errorMessage += "서버 내부 오류가 발생했습니다."
        } else {
          errorMessage += responseText || "알 수 없는 오류가 발생했습니다."
        }

        throw new Error(errorMessage)
      }

      // 성공 응답 파싱
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

      // 이미 처리된 에러는 그대로 전달
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
  getAllStores: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/store/all`, getFetchOptions("GET"))
      if (!response.ok) {
        throw new Error("매장 정보를 가져올 수 없습니다.")
      }
      return await response.json()
    } catch (error) {
      console.error("매장 정보 조회 에러:", error)
      throw error
    }
  },

  // 특정 매장의 메뉴 조회
  getStoreMenus: async (storeId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/store/${storeId}/menus`, getFetchOptions("GET"))
      if (!response.ok) {
        throw new Error("메뉴 정보를 가져올 수 없습니다.")
      }
      return await response.json()
    } catch (error) {
      console.error("메뉴 정보 조회 에러:", error)
      throw error
    }
  },
}

// 주문 관련 API
export const orderAPI = {
  // 주문 생성
  createOrder: async (userId: number, storeId: number, menuName: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/create`,
        getFetchOptions("POST", { userId, storeId, menuName }),
      )

      if (!response.ok) {
        throw new Error("주문 생성에 실패했습니다.")
      }

      return await response.json()
    } catch (error) {
      console.error("주문 생성 에러:", error)
      throw error
    }
  },

  // 주문 완료 여부 확인
  isOrderCompleted: async (orderId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/is-completed`, getFetchOptions("POST", { orderId }))

      if (!response.ok) {
        throw new Error("주문 상태를 확인할 수 없습니다.")
      }

      return await response.json()
    } catch (error) {
      console.error("주문 상태 확인 에러:", error)
      throw error
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
    }
  },
}

// 이메일 유효성 검사 (아주대학교 이메일)
export const validateAjouEmail = (email: string): boolean => {
  const ajouEmailRegex = /^[a-zA-Z0-9._%+-]+@ajou\.ac\.kr$/
  return ajouEmailRegex.test(email)
}
