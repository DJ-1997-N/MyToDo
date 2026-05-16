import { create } from 'zustand';

interface UIStore {
  // 侧边栏状态
  sidebarOpened: boolean;
  
  // 主题
  colorScheme: 'light' | 'dark';
  
  // 任务过滤器
  taskFilter: {
    status?: string;
    priority?: string;
    categoryId?: string;
    search?: string;
  };
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpened: (opened: boolean) => void;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: 'light' | 'dark') => void;
  setTaskFilter: (filter: Partial<UIStore['taskFilter']>) => void;
  resetTaskFilter: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpened: true,
  colorScheme: 'light',
  taskFilter: {},
  
  toggleSidebar: () => set((state) => ({ sidebarOpened: !state.sidebarOpened })),
  
  setSidebarOpened: (opened) => set({ sidebarOpened: opened }),
  
  toggleColorScheme: () => set((state) => ({ 
    colorScheme: state.colorScheme === 'light' ? 'dark' : 'light' 
  })),
  
  setColorScheme: (scheme) => set({ colorScheme: scheme }),
  
  setTaskFilter: (filter) => set((state) => ({ 
    taskFilter: { ...state.taskFilter, ...filter } 
  })),
  
  resetTaskFilter: () => set({ taskFilter: {} })
}));
