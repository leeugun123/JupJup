declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

// Vue Router meta 타입 확장
import 'vue-router';
declare module 'vue-router' {
  interface RouteMeta {
    depth?: number;
  }
}
