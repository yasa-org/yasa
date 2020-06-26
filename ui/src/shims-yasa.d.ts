import { AxiosStatic } from 'axios';
import Service from '@/service';

declare module 'vue/types/vue' {
  interface Vue {
    $service: typeof Service;
    $http: AxiosStatic;
  }
}

declare module 'vue/types/vue' {
  interface VueConstructor {
    $service: typeof Service;
    $http: AxiosStatic;
  }
}
