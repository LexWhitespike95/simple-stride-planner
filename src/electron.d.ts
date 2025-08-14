import { Task } from './index';

declare global {
  interface Window {
    electronAPI: {
      showNotification: (options: { title: string; body:string; }) => Promise<boolean>;
    }
  }
}