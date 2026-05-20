import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface AuthUser {
  name: string;
  email: string;
  provider: 'kakao' | 'naver';
}

const AUTH_KEY = 'jupjup_auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);

  function init() {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      user.value = stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      user.value = null;
    }
  }

  const isLoggedIn = computed(() => !!user.value);

  function login(provider: 'kakao' | 'naver') {
    const mockUser: AuthUser = {
      name: provider === 'kakao' ? '카카오 사용자' : '네이버 사용자',
      email: provider === 'kakao' ? 'user@kakao.com' : 'user@naver.com',
      provider,
    };
    user.value = mockUser;
    localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
  }

  function logout() {
    user.value = null;
    localStorage.removeItem(AUTH_KEY);
  }

  return { user, isLoggedIn, login, logout, init };
});
