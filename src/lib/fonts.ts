export type FontOption = {
  id: string;
  name: string;
  family: string;
  url?: string;
};

export const FONTS: FontOption[] = [
  { id: 'system', name: '系统默认', family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { id: 'noto-sans-sc', name: 'Noto Sans SC', family: '"Noto Sans SC", sans-serif', url: 'Noto+Sans+SC:wght@400;500;700' },
  { id: 'noto-serif-sc', name: 'Noto Serif SC', family: '"Noto Serif SC", serif', url: 'Noto+Serif+SC:wght@400;500;700' },
  { id: 'ma-shan-zheng', name: 'Ma Shan Zheng', family: '"Ma Shan Zheng", cursive', url: 'Ma+Shan+Zheng' },
  { id: 'zcool-xiaowei', name: 'ZCOOL XiaoWei', family: '"ZCOOL XiaoWei", serif', url: 'ZCOOL+XiaoWei' },
  { id: 'zcool-kuaile', name: 'ZCOOL KuaiLe', family: '"ZCOOL KuaiLe", cursive', url: 'ZCOOL+KuaiLe' },
  { id: 'zcool-qingke-huangyou', name: 'ZCOOL QingKe HuangYou', family: '"ZCOOL QingKe HuangYou", cursive', url: 'ZCOOL+QingKe+HuangYou' },
  { id: 'zhi-mang-xing', name: 'Zhi Mang Xing', family: '"Zhi Mang Xing", cursive', url: 'Zhi+Mang+Xing' },
  { id: 'long-cang', name: 'Long Cang', family: '"Long Cang", cursive', url: 'Long+Cang' },
  { id: 'liu-jian-mao-cao', name: 'Liu Jian Mao Cao', family: '"Liu Jian Mao Cao", cursive', url: 'Liu+Jian+Mao+Cao' },
  { id: 'wdxl-lubrifont-sc', name: 'WDXL Lubrifont SC', family: '"WDXL Lubrifont SC", sans-serif', url: 'WDXL+Lubrifont+SC' },
];
