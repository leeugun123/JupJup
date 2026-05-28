<template>
  <q-page class="my-page">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-gradient" />
      <div class="profile-content q-px-md q-pt-lg q-pb-xl">
        <div class="profile-row">
          <div class="avatar-wrap">
            <q-icon name="person" size="32px" color="white" />
            <div
              v-if="authStore.isLoggedIn"
              class="provider-badge"
              :class="authStore.user!.provider === 'kakao' ? 'badge-kakao' : 'badge-naver'"
            >
              {{ authStore.user!.provider === 'kakao' ? 'K' : 'N' }}
            </div>
          </div>
          <div class="profile-info">
            <div class="profile-name">
              {{ authStore.isLoggedIn ? authStore.user!.name : '게스트 사용자' }}
            </div>
            <div class="profile-sub">
              {{
                authStore.isLoggedIn ? authStore.user!.email : '로그인하고 더 많은 혜택을 받으세요'
              }}
            </div>
          </div>
          <q-btn
            v-if="!authStore.isLoggedIn"
            flat
            dense
            round
            icon="chevron_right"
            color="white"
            size="12px"
            @click="showLoginDialog = true"
          />
        </div>
      </div>

      <!-- Stats Card -->
      <div class="stats-card q-mx-md">
        <div class="stat-item">
          <div class="stat-value text-primary">{{ favStore.ids.length }}</div>
          <div class="stat-label">찜한 상품</div>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <div class="stat-value text-primary">{{ purchasesStore.history.length }}</div>
          <div class="stat-label">이용 내역</div>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <div class="stat-value text-positive">{{ totalSavings.toLocaleString() }}원</div>
          <div class="stat-label">총 절약 금액</div>
        </div>
      </div>
    </div>

    <!-- Menu Sections -->
    <div class="menu-sections q-px-md q-pb-xl">
      <!-- 내 활동 -->
      <div class="menu-section">
        <div class="menu-section-title">내 활동</div>
        <div class="menu-card">
          <div class="menu-item" @click="$router.push('/favorites')">
            <div class="menu-icon-wrap" style="background: #fff0f1">
              <q-icon name="favorite" color="negative" size="18px" />
            </div>
            <span class="menu-label">찜 목록</span>
            <div class="menu-right">
              <q-badge
                v-if="favStore.ids.length > 0"
                color="negative"
                :label="favStore.ids.length"
                rounded
              />
              <q-icon name="chevron_right" color="grey-4" size="18px" />
            </div>
          </div>
          <q-separator inset />
          <div class="menu-item" @click="$router.push('/history')">
            <div class="menu-icon-wrap" style="background: #f0f4ff">
              <q-icon name="receipt_long" color="info" size="18px" />
            </div>
            <span class="menu-label">이용 내역</span>
            <div class="menu-right">
              <q-badge
                v-if="purchasesStore.history.length > 0"
                color="info"
                :label="purchasesStore.history.length"
                rounded
              />
              <q-icon name="chevron_right" color="grey-4" size="18px" />
            </div>
          </div>
          <q-separator inset />
          <div class="menu-item" @click="showCouponWallet = true">
            <div class="menu-icon-wrap" style="background: #fff8e7">
              <q-icon name="confirmation_number" color="warning" size="18px" />
            </div>
            <span class="menu-label">쿠폰 지갑</span>
            <div class="menu-right">
              <q-badge
                v-if="purchasesStore.history.length > 0"
                color="warning"
                :label="purchasesStore.history.length"
                rounded
              />
              <q-icon name="chevron_right" color="grey-4" size="18px" />
            </div>
          </div>
        </div>
      </div>

      <!-- 편의점 -->
      <div class="menu-section">
        <div class="menu-section-title">편의점</div>
        <div class="menu-card">
          <div class="menu-item" @click="showFavStores = true">
            <div class="menu-icon-wrap" style="background: #f0fff4">
              <q-icon name="store" color="positive" size="18px" />
            </div>
            <span class="menu-label">관심 편의점</span>
            <div class="menu-right">
              <span v-if="favoriteStores.length" class="menu-value">
                {{ favoriteStores.map(id => storeConfig[id]?.label).join(', ') }}
              </span>
              <q-icon name="chevron_right" color="grey-4" size="18px" />
            </div>
          </div>
          <q-separator inset />
          <div class="menu-item" @click="openNotifSheet">
            <div class="menu-icon-wrap" style="background: #f3f0ff">
              <q-icon name="notifications" color="accent" size="18px" />
            </div>
            <span class="menu-label">알림 설정</span>
            <div class="menu-right">
              <q-badge
                v-if="alertProducts.length"
                color="accent"
                :label="alertProducts.length"
                rounded
              />
              <q-icon name="chevron_right" color="grey-4" size="18px" />
            </div>
          </div>
          <q-separator inset />
          <div class="menu-item" @click="showLocationSheet = true">
            <div class="menu-icon-wrap" style="background: #fff0f8">
              <q-icon name="location_on" color="pink" size="18px" />
            </div>
            <span class="menu-label">내 위치 설정</span>
            <div class="menu-right">
              <span class="menu-value">{{ currentLocation }}</span>
              <q-icon name="chevron_right" color="grey-4" size="18px" />
            </div>
          </div>
        </div>
      </div>

      <!-- 앱 정보 -->
      <div class="menu-section">
        <div class="menu-section-title">앱 정보</div>
        <div class="menu-card">
          <div class="menu-item" @click="toggleDark">
            <div class="menu-icon-wrap" style="background: #f0f0f0">
              <q-icon :name="isDark ? 'dark_mode' : 'light_mode'" color="grey-7" size="18px" />
            </div>
            <span class="menu-label">다크 모드</span>
            <div class="menu-right">
              <q-toggle :model-value="isDark" color="primary" dense size="sm" @update:model-value="toggleDark" @click.stop />
            </div>
          </div>
          <q-separator inset />
          <div class="menu-item" @click="showNoticeSheet = true">
            <div class="menu-icon-wrap" style="background: #fff8f0">
              <q-icon name="campaign" color="secondary" size="18px" />
            </div>
            <span class="menu-label">공지사항</span>
            <div class="menu-right">
              <q-badge color="secondary" label="NEW" rounded style="font-size:9px" />
              <q-icon name="chevron_right" color="grey-4" size="18px" />
            </div>
          </div>
          <q-separator inset />
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background: #f0faff">
              <q-icon name="headset_mic" color="info" size="18px" />
            </div>
            <span class="menu-label">고객센터</span>
            <q-icon name="chevron_right" color="grey-4" size="18px" />
          </div>
          <q-separator inset />
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background: #f5f5f5">
              <q-icon name="info_outline" color="grey-6" size="18px" />
            </div>
            <span class="menu-label">앱 버전</span>
            <span class="menu-value">v1.0.0</span>
          </div>
        </div>
      </div>

      <!-- 계정 (로그인 시) -->
      <div v-if="authStore.isLoggedIn" class="menu-section">
        <div class="menu-section-title">계정</div>
        <div class="menu-card">
          <div class="menu-item" @click="showLogoutDialog = true">
            <div class="menu-icon-wrap" style="background: #fff5f5">
              <q-icon name="logout" color="negative" size="18px" />
            </div>
            <span class="menu-label" style="color: #ff4757">로그아웃</span>
            <q-icon name="chevron_right" color="grey-4" size="18px" />
          </div>
        </div>
      </div>

      <!-- Login Banner -->
      <div v-if="!authStore.isLoggedIn" class="login-banner" @click="showLoginDialog = true">
        <div class="login-banner-text">
          <div class="login-banner-title">로그인하고 개인화된 할인을 받아보세요</div>
          <div class="login-banner-sub">찜 목록, 알림 설정이 저장돼요</div>
        </div>
        <q-btn label="로그인" color="primary" unelevated class="login-btn" />
      </div>
    </div>

    <!-- 공지사항 목록 Dialog -->
    <q-dialog v-model="showNoticeSheet" position="bottom">
      <q-card class="notice-sheet">
        <div class="dialog-handle" />
        <div class="notice-header">
          <div class="notice-title">공지사항</div>
        </div>
        <q-list class="notice-list">
          <q-item
            v-for="notice in notices"
            :key="notice.id"
            clickable
            v-ripple
            class="notice-item"
            @click="openNotice(notice)"
          >
            <q-item-section>
              <div class="notice-item-top">
                <span class="notice-badge" :class="`notice-badge--${notice.type}`">
                  {{ noticeTypeLabel(notice.type) }}
                </span>
                <span v-if="notice.isNew" class="notice-new-dot" />
              </div>
              <div class="notice-item-title">{{ notice.title }}</div>
              <div class="notice-item-date">{{ notice.date }}</div>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" color="grey-4" size="16px" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>

    <!-- 공지사항 상세 Dialog -->
    <q-dialog v-model="showNoticeDetail">
      <q-card class="notice-detail-card" v-if="selectedNotice">
        <q-card-section class="notice-detail-top">
          <span class="notice-badge" :class="`notice-badge--${selectedNotice.type}`">
            {{ noticeTypeLabel(selectedNotice.type) }}
          </span>
          <div class="notice-detail-title q-mt-sm">{{ selectedNotice.title }}</div>
          <div class="notice-detail-date">{{ selectedNotice.date }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="notice-detail-body">
          {{ selectedNotice.content }}
        </q-card-section>
        <q-card-section class="q-pt-none q-pb-md q-px-md">
          <q-btn
            unelevated
            color="primary"
            rounded
            label="확인"
            class="full-width"
            style="height: 44px; font-weight: 700;"
            @click="showNoticeDetail = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- 내 위치 설정 Dialog -->
    <q-dialog v-model="showLocationSheet" position="bottom">
      <q-card class="location-settings-sheet">
        <div class="dialog-handle" />
        <div class="location-settings-header">
          <div class="location-settings-title">내 위치 설정</div>
          <div class="location-settings-sub">특가 상품을 찾을 지역을 선택하세요</div>
        </div>
        <q-list class="location-list">
          <q-item
            v-for="district in districts"
            :key="district"
            clickable
            v-ripple
            class="location-item"
            :class="{ 'location-item--active': currentLocation === district }"
            @click="selectLocation(district)"
          >
            <q-item-section avatar>
              <q-icon
                name="location_on"
                :color="currentLocation === district ? 'pink' : 'grey-4'"
                size="18px"
              />
            </q-item-section>
            <q-item-section class="location-item-label">{{ district }}</q-item-section>
            <q-item-section side>
              <q-icon v-if="currentLocation === district" name="check" color="pink" size="16px" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>

    <!-- 알림 설정 Dialog -->
    <q-dialog v-model="showNotifSheet" position="bottom">
      <q-card class="notif-settings-sheet">
        <div class="dialog-handle" />
        <div class="notif-settings-header">
          <div class="notif-settings-title">알림 설정</div>
        </div>

        <!-- 전체 알림 토글 -->
        <div class="notif-global-row">
          <div class="notif-global-left">
            <q-icon name="notifications_active" color="accent" size="20px" />
            <div>
              <div class="notif-global-label">전체 알림</div>
              <div class="notif-global-sub">마감 임박 알림을 받아요</div>
            </div>
          </div>
          <q-toggle v-model="notifOn" color="accent" />
        </div>

        <q-separator class="q-mx-md" />

        <!-- 알림 설정된 상품 목록 -->
        <div class="notif-product-header">
          <span class="notif-product-title">개별 상품 알림</span>
          <span class="notif-product-count text-grey-5">{{ alertProducts.length }}개</span>
        </div>

        <div v-if="alertProducts.length" class="notif-product-list">
          <div
            v-for="product in alertProducts"
            :key="product.id"
            class="notif-product-item"
          >
            <div class="notif-product-info">
              <div class="notif-product-name">{{ product.name }}</div>
              <div class="notif-product-meta">
                <span
                  class="notif-store-badge"
                  :style="{ background: storeConfig[product.storeId]?.bgColor, color: storeConfig[product.storeId]?.color }"
                >
                  {{ storeConfig[product.storeId]?.label }}
                </span>
                <span class="notif-expiry">D-{{ daysLeft(product.expiryDate) }}</span>
              </div>
            </div>
            <q-btn
              flat
              round
              dense
              icon="notifications_off"
              color="grey-4"
              size="sm"
              @click="removeAlert(product.id)"
            />
          </div>
        </div>

        <div v-else class="notif-empty">
          <q-icon name="notifications_none" size="40px" color="grey-3" />
          <div class="q-mt-sm text-grey-5" style="font-size: 13px">
            알림 설정된 상품이 없어요
          </div>
          <div class="text-grey-4 q-mt-xs" style="font-size: 12px">
            상품 상세에서 벨 아이콘을 눌러 설정하세요
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- 관심 편의점 Dialog -->
    <q-dialog v-model="showFavStores" position="bottom">
      <q-card class="fav-stores-sheet">
        <div class="dialog-handle" />
        <div class="fav-stores-header">
          <div class="fav-stores-title">관심 편의점</div>
          <div class="fav-stores-sub">특가 알림을 받을 편의점을 선택하세요</div>
        </div>
        <div class="fav-stores-grid">
          <div
            v-for="(info, id) in storeConfig"
            :key="id"
            class="store-card"
            :class="{ 'store-card--active': favoriteStores.includes(id) }"
            :style="favoriteStores.includes(id)
              ? { borderColor: info.color, background: info.bgColor }
              : {}"
            @click="toggleFavStore(id)"
          >
            <div class="store-card-check">
              <q-icon
                :name="favoriteStores.includes(id) ? 'check_circle' : 'radio_button_unchecked'"
                :color="favoriteStores.includes(id) ? 'white' : 'grey-3'"
                size="18px"
              />
            </div>
            <div
              class="store-emblem"
              :style="{ background: info.color }"
            >
              <q-icon name="store" color="white" size="22px" />
            </div>
            <div
              class="store-card-label"
              :style="favoriteStores.includes(id) ? { color: info.color } : {}"
            >
              {{ info.label }}
            </div>
          </div>
        </div>
        <div class="fav-stores-footer">
          <q-btn
            unelevated
            color="primary"
            rounded
            label="완료"
            class="full-width"
            style="height: 48px; font-weight: 700;"
            @click="showFavStores = false"
          />
        </div>
      </q-card>
    </q-dialog>

    <!-- Coupon Wallet Dialog -->
    <q-dialog v-model="showCouponWallet" position="bottom">
      <q-card class="coupon-sheet">
        <div class="dialog-handle" />
        <div class="coupon-header">
          <span class="coupon-title">🎟️ 쿠폰 지갑</span>
          <span class="coupon-sub">{{ purchasesStore.history.length }}개의 코드</span>
        </div>
        <div v-if="purchasesStore.history.length" class="coupon-list">
          <div v-for="p in purchasesStore.history" :key="p.id" class="coupon-item">
            <div class="coupon-left">
              <div class="coupon-code">{{ p.code }}</div>
              <div class="coupon-name">{{ p.product.name }}</div>
              <div class="coupon-store">{{ p.product.storeName }}</div>
            </div>
            <div class="coupon-right">
              <div class="coupon-price">{{ p.product.discountPrice.toLocaleString() }}원</div>
              <div class="coupon-saving">{{ p.savings.toLocaleString() }}원 절약</div>
            </div>
          </div>
        </div>
        <div v-else class="coupon-empty">
          <q-icon name="confirmation_number" size="40px" color="grey-3" />
          <div class="q-mt-sm text-grey-5" style="font-size: 13px">구매 내역이 없어요</div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Logout Confirm Dialog -->
    <q-dialog v-model="showLogoutDialog">
      <q-card class="logout-dialog">
        <q-card-section class="text-center q-pt-xl q-pb-md">
          <q-icon name="logout" size="40px" color="negative" />
          <div class="logout-title q-mt-md">로그아웃</div>
          <div class="logout-sub q-mt-sm">정말 로그아웃 하시겠어요?</div>
        </q-card-section>
        <q-card-section class="logout-actions q-px-lg q-pb-xl">
          <q-btn
            flat
            label="취소"
            color="grey-5"
            class="logout-cancel-btn"
            @click="showLogoutDialog = false"
          />
          <q-btn
            unelevated
            label="로그아웃"
            color="negative"
            rounded
            class="logout-confirm-btn"
            @click="doLogout"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Login Dialog -->
    <q-dialog v-model="showLoginDialog">
      <q-card class="login-dialog">
        <q-card-section class="text-center q-pt-xl q-pb-md">
          <div class="dialog-logo">jupjup</div>
          <div class="dialog-sub q-mt-sm">로그인하고 더 많은 혜택을 누리세요</div>
        </q-card-section>
        <q-card-section class="dialog-actions q-px-lg q-pb-xl">
          <q-btn label="카카오로 시작하기" unelevated class="kakao-btn" @click="doLogin('kakao')" />
          <q-btn label="네이버로 시작하기" unelevated class="naver-btn" @click="doLogin('naver')" />
          <q-btn flat label="닫기" color="grey-5" @click="showLoginDialog = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useFavoritesStore } from '../stores/favorites';
import { usePurchasesStore } from '../stores/purchases';
import { useAuthStore } from '../stores/auth';
import { storeConfig } from '../data/stores';
import { mockProducts } from '../data/mockProducts';

const $q = useQuasar();
const favStore = useFavoritesStore();
const purchasesStore = usePurchasesStore();
const authStore = useAuthStore();
const totalSavings = computed(() => purchasesStore.totalSavings());
const notifOn = ref(true);
const showLoginDialog = ref(false);
const showLogoutDialog = ref(false);
const showCouponWallet = ref(false);
const showFavStores = ref(false);
const showLocationSheet = ref(false);
const showNoticeSheet = ref(false);
const showNoticeDetail = ref(false);

interface Notice {
  id: number;
  type: 'notice' | 'event' | 'update';
  title: string;
  date: string;
  content: string;
  isNew: boolean;
}

const selectedNotice = ref<Notice | null>(null);

const notices: Notice[] = [
  {
    id: 1,
    type: 'update',
    title: 'v1.1.0 업데이트 안내 — 베스트 랭킹·자동완성 추가',
    date: '2026.05.28',
    content: '안녕하세요, jupjup 팀입니다.\n\n이번 업데이트에서 다음 기능이 추가됐습니다.\n\n• 오늘의 베스트 🏆 — 할인율 TOP 5 랭킹 카드\n• 검색 자동완성 — 입력 시 상품명 드롭다운\n• 최근 본 상품 — 방문 이력 홈 화면 표시\n• 페이지 전환 애니메이션 개선\n\n더 나은 서비스로 찾아뵙겠습니다. 감사합니다.',
    isNew: true,
  },
  {
    id: 2,
    type: 'event',
    title: '🎁 첫 구매 할인 이벤트 — 최대 1,000원 추가 절약',
    date: '2026.05.20',
    content: '안녕하세요, jupjup 팀입니다.\n\njupjup을 처음 이용하시는 분들을 위해 특별 이벤트를 준비했습니다.\n\n✅ 대상: 첫 구매 고객 전원\n✅ 혜택: 추가 1,000원 할인\n✅ 기간: 2026.05.20 ~ 2026.06.20\n\n이 기회를 놓치지 마세요!',
    isNew: true,
  },
  {
    id: 3,
    type: 'notice',
    title: '서비스 이용약관 변경 안내',
    date: '2026.05.10',
    content: '안녕하세요, jupjup 팀입니다.\n\n서비스 이용약관이 일부 변경됩니다.\n\n주요 변경 사항:\n• 개인정보 수집 항목 최소화\n• 위치 정보 이용 동의 방식 변경\n\n변경된 약관은 2026년 6월 1일부터 적용됩니다.\n\n문의사항은 고객센터를 이용해주세요.',
    isNew: false,
  },
  {
    id: 4,
    type: 'notice',
    title: 'jupjup 앱 정식 출시 안내',
    date: '2026.05.01',
    content: '안녕하세요!\n\n편의점 마감 임박 특가 중개 플랫폼 jupjup이 정식 출시됐습니다.\n\njupjup은 유통기한 임박 상품을 최대 50% 할인된 가격으로 만나볼 수 있는 서비스입니다.\n\nCU, GS25, 세븐일레븐의 마감 특가 상품을 한 곳에서 확인하세요.\n\n앞으로도 더 좋은 서비스로 보답하겠습니다. 감사합니다.',
    isNew: false,
  },
];

function noticeTypeLabel(type: Notice['type']): string {
  return { notice: '공지', event: '이벤트', update: '업데이트' }[type];
}

function openNotice(notice: Notice) {
  selectedNotice.value = notice;
  showNoticeDetail.value = true;
}

const LOCATION_KEY = 'jupjup_location';
const currentLocation = ref('강남구');

const districts = [
  '강남구', '강북구', '강서구', '관악구', '광진구',
  '구로구', '노원구', '동작구', '마포구', '서초구',
  '송파구', '영등포구', '용산구', '은평구', '종로구', '중구',
];

function selectLocation(district: string) {
  currentLocation.value = district;
  localStorage.setItem(LOCATION_KEY, district);
  showLocationSheet.value = false;
  $q.notify({ message: `📍 ${district}으로 변경됐어요`, color: 'dark', timeout: 1600 });
}
const showNotifSheet = ref(false);

// 알림 설정된 상품 목록 (localStorage 스캔)
const alertProducts = ref<typeof mockProducts>([]);

function loadAlertProducts() {
  alertProducts.value = mockProducts.filter((p) =>
    !!localStorage.getItem(`jupjup_alert_${p.id}`),
  );
}

function openNotifSheet() {
  loadAlertProducts();
  showNotifSheet.value = true;
}

function removeAlert(id: string) {
  localStorage.removeItem(`jupjup_alert_${id}`);
  loadAlertProducts();
  $q.notify({ message: '알림이 해제됐어요', color: 'grey-7', timeout: 1400 });
}

function daysLeft(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

const FAV_STORES_KEY = 'jupjup_fav_stores';
const favoriteStores = ref<string[]>([]);

function toggleFavStore(id: string) {
  const idx = favoriteStores.value.indexOf(id);
  if (idx >= 0) {
    favoriteStores.value.splice(idx, 1);
  } else {
    favoriteStores.value.push(id);
  }
  localStorage.setItem(FAV_STORES_KEY, JSON.stringify(favoriteStores.value));
}

const DARK_KEY = 'jupjup_dark';
const isDark = ref($q.dark.isActive);

function toggleDark() {
  $q.dark.toggle();
  isDark.value = $q.dark.isActive;
  localStorage.setItem(DARK_KEY, isDark.value ? '1' : '');
}

onMounted(() => {
  authStore.init();
  if (localStorage.getItem(DARK_KEY)) {
    $q.dark.set(true);
    isDark.value = true;
  }
  try {
    const saved = localStorage.getItem(FAV_STORES_KEY);
    if (saved) favoriteStores.value = JSON.parse(saved) as string[];
  } catch { /* ignore */ }
  const savedLocation = localStorage.getItem(LOCATION_KEY);
  if (savedLocation) currentLocation.value = savedLocation;
});

function doLogin(provider: 'kakao' | 'naver') {
  authStore.login(provider);
  showLoginDialog.value = false;
}

function doLogout() {
  authStore.logout();
  showLogoutDialog.value = false;
}
</script>

<style scoped lang="scss">
.my-page {
  background: #f7f8fa;
  padding-bottom: 80px;
}

// ── Profile Header ────────────────────────────
.profile-header {
  position: relative;
  margin-bottom: 60px;
}

.profile-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 170px;
  background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
}

.profile-content {
  position: relative;
  z-index: 1;
}

.profile-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar-wrap {
  position: relative;
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2.5px solid rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.provider-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 900;
  border: 2px solid white;

  &.badge-kakao {
    background: #fee500;
    color: #3c1e1e;
  }
  &.badge-naver {
    background: #03c75a;
    color: white;
  }
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 18px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.3px;
}

.profile-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 3px;
}

.stats-card {
  position: absolute;
  bottom: -52px;
  left: 16px;
  right: 16px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 18px 0;
  z-index: 2;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.stat-label {
  font-size: 11px;
  color: #aaaaaa;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: #f0f0f0;
}

// ── Menu ──────────────────────────────────────
.menu-sections {
  padding-top: 16px;
}

.menu-section {
  margin-bottom: 20px;
}

.menu-section-title {
  font-size: 12px;
  font-weight: 700;
  color: #aaaaaa;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
  padding-left: 4px;
}

.menu-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s;

  &:active {
    background: #fafafa;
  }
}

.menu-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a2e;
  letter-spacing: -0.2px;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.menu-value {
  font-size: 12px;
  color: #aaaaaa;
}

// ── Login Banner ──────────────────────────────
.login-banner {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  border: 1.5px solid rgba(255, 71, 87, 0.15);
  transition: border-color 0.2s;

  &:active {
    border-color: rgba(255, 71, 87, 0.4);
  }
}

.login-banner-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
}

.login-banner-sub {
  font-size: 12px;
  color: #aaaaaa;
  margin-top: 2px;
}

.login-btn {
  border-radius: 10px;
  font-weight: 700;
  min-width: 68px;
  font-size: 13px;
}

// ── 공지사항 ───────────────────────────────────
.notice-sheet {
  width: 100%;
  max-width: 480px;
  border-radius: 24px 24px 0 0 !important;
  padding-bottom: 32px;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
}

.notice-header {
  padding: 16px 20px 8px;
  flex-shrink: 0;
}

.notice-title {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.notice-list {
  overflow-y: auto;
  flex: 1;
}

.notice-item {
  padding: 14px 20px;
  border-bottom: 1px solid #f5f5f5;
  &:last-child { border-bottom: none; }
}

.notice-item-top {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.notice-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;

  &--notice  { background: #f0f4ff; color: #5352ed; }
  &--event   { background: #fff8e1; color: #f57f17; }
  &--update  { background: #f0fff4; color: #2e7d32; }
}

.notice-new-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff4757;
}

.notice-item-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notice-item-date {
  font-size: 11px;
  color: #aaa;
}

.notice-detail-card {
  width: 320px;
  border-radius: 20px !important;
  max-height: 70vh;
  overflow-y: auto;
}

.notice-detail-top {
  padding: 24px 20px 16px;
}

.notice-detail-title {
  font-size: 16px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.4;
  letter-spacing: -0.3px;
}

.notice-detail-date {
  font-size: 12px;
  color: #aaa;
  margin-top: 6px;
}

.notice-detail-body {
  font-size: 14px;
  color: #444;
  line-height: 1.8;
  white-space: pre-line;
  padding: 16px 20px;
}

// ── 내 위치 설정 ───────────────────────────────
.location-settings-sheet {
  width: 100%;
  max-width: 480px;
  border-radius: 24px 24px 0 0 !important;
  padding-bottom: 32px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.location-settings-header {
  padding: 16px 20px 12px;
  flex-shrink: 0;
}

.location-settings-title {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.location-settings-sub {
  font-size: 13px;
  color: #aaa;
  margin-top: 4px;
}

.location-list {
  overflow-y: auto;
  flex: 1;
}

.location-item {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #444;

  &--active {
    color: #e91e8c;
    font-weight: 700;
    background: #fff5fb;
  }
}

.location-item-label {
  font-size: 14px;
}

// ── 알림 설정 ──────────────────────────────────
.notif-settings-sheet {
  width: 100%;
  max-width: 480px;
  border-radius: 24px 24px 0 0 !important;
  padding-bottom: 32px;
}

.notif-settings-header {
  padding: 16px 20px 12px;
}

.notif-settings-title {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.notif-global-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #f8f0ff;
  margin: 0 16px 16px;
  border-radius: 14px;
}

.notif-global-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notif-global-label {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
}

.notif-global-sub {
  font-size: 12px;
  color: #aaa;
  margin-top: 2px;
}

.notif-product-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 20px 8px;
}

.notif-product-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
}

.notif-product-count {
  font-size: 12px;
}

.notif-product-list {
  max-height: 45vh;
  overflow-y: auto;
}

.notif-product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.1s;

  &:last-child { border-bottom: none; }
  &:active { background: #fafafa; }
}

.notif-product-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.notif-product-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}

.notif-product-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.notif-store-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 8px;
}

.notif-expiry {
  font-size: 11px;
  color: #ff4757;
  font-weight: 600;
}

.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0 16px;
  text-align: center;
}

// ── 관심 편의점 ────────────────────────────────
.fav-stores-sheet {
  width: 100%;
  max-width: 480px;
  border-radius: 24px 24px 0 0 !important;
  padding-bottom: env(safe-area-inset-bottom, 16px);
}

.fav-stores-header {
  padding: 16px 20px 20px;
}

.fav-stores-title {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.fav-stores-sub {
  font-size: 13px;
  color: #aaa;
  margin-top: 4px;
}

.fav-stores-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 20px 20px;
}

.store-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 8px 14px;
  border-radius: 16px;
  border: 2px solid #eeeeee;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.18s;

  &:active { transform: scale(0.97); }
  &--active { box-shadow: 0 4px 14px rgba(0,0,0,0.1); }
}

.store-card-check {
  position: absolute;
  top: 8px;
  right: 8px;
}

.store-emblem {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.store-card-label {
  font-size: 13px;
  font-weight: 700;
  color: #444;
  letter-spacing: -0.3px;
}

.fav-stores-footer {
  padding: 0 20px 24px;
}

// ── Coupon Wallet ─────────────────────────────
.coupon-sheet {
  width: 100%;
  max-width: 480px;
  border-radius: 24px 24px 0 0 !important;
  padding-bottom: 32px;
}

.dialog-handle {
  width: 36px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 12px auto 0;
}

.coupon-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.coupon-title {
  display: block;
  font-size: 16px;
  font-weight: 800;
  color: #1a1a2e;
}

.coupon-sub {
  display: block;
  font-size: 12px;
  color: #aaa;
  margin-top: 2px;
}

.coupon-list {
  max-height: 55vh;
  overflow-y: auto;
}

.coupon-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #f7f7f7;
}

.coupon-left {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.coupon-code {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 4px;
  color: #1a1a2e;
}

.coupon-name {
  font-size: 13px;
  font-weight: 600;
  color: #444;
}

.coupon-store {
  font-size: 11px;
  color: #aaa;
}

.coupon-right {
  text-align: right;
}

.coupon-price {
  font-size: 14px;
  font-weight: 700;
  color: #ff4757;
}

.coupon-saving {
  font-size: 11px;
  color: #2ed573;
  font-weight: 600;
}

.coupon-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

// ── Login Dialog ──────────────────────────────
.login-dialog {
  width: 320px;
  border-radius: 24px !important;
}

.dialog-logo {
  font-size: 26px;
  font-weight: 900;
  color: #ff4757;
  letter-spacing: -1px;
}

.dialog-sub {
  font-size: 14px;
  color: #aaaaaa;
}

.dialog-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kakao-btn {
  background: #fee500;
  color: #3c1e1e;
  border-radius: 12px;
  height: 48px;
  font-weight: 700;
  font-size: 14px;
}

.naver-btn {
  background: #03c75a;
  color: white;
  border-radius: 12px;
  height: 48px;
  font-weight: 700;
  font-size: 14px;
}

// ── Logout Dialog ─────────────────────────────
.logout-dialog {
  width: 300px;
  border-radius: 24px !important;
}

.logout-title {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.logout-sub {
  font-size: 14px;
  color: #aaaaaa;
}

.logout-actions {
  display: flex;
  gap: 10px;
}

.logout-cancel-btn {
  flex: 1;
  height: 44px;
}
.logout-confirm-btn {
  flex: 2;
  height: 44px;
  font-weight: 700;
}
</style>
