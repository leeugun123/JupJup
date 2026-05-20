export interface StoreInfo {
  label: string;
  color: string;
  bgColor: string;
}

export const storeConfig: Record<string, StoreInfo> = {
  store1: { label: 'CU', color: '#0051A1', bgColor: '#EEF3FA' },
  store2: { label: 'GS25', color: '#F05014', bgColor: '#FEF1EC' },
  store3: { label: '세븐일레븐', color: '#007A33', bgColor: '#EAF5EE' },
};
