// Danh sách category dùng chung cho menu và form admin.
// Việc gom vào một file giúp frontend không bị lệch key giữa nơi lọc và nơi tạo sản phẩm.
export const PRODUCT_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'vegetarian', label: 'Chay' },
  { key: 'pizza', label: 'Pizza' },
  { key: 'gachien', label: 'Gà Chiên' },
  { key: 'khaivi', label: 'Khai Vị' },
  { key: 'thucuong', label: 'Thức Uống' },
  { key: 'menu49', label: 'Menu 49K' },
  { key: 'compo', label: 'Combo' },
];

// Form admin không cần lựa chọn "all", nên mình tách sẵn ra để render dropdown gọn hơn.
export const ADMIN_PRODUCT_CATEGORIES = PRODUCT_CATEGORIES.filter((category) => category.key !== 'all');

// Map này giúp dữ liệu cũ vẫn hiển thị đúng trong UI mới.
// Ví dụ trước đây hệ thống lưu "meat" hoặc "special", còn UI mới muốn gom về tab "pizza".
const LEGACY_CATEGORY_MAP = {
  meat: 'pizza',
  special: 'pizza',
  vegan: 'vegetarian',
};

export const normalizeCategoryKey = (categoryKey = '') => LEGACY_CATEGORY_MAP[categoryKey] || categoryKey;

export const getCategoryLabel = (categoryKey = '') => {
  const normalizedKey = normalizeCategoryKey(categoryKey);
  const category = ADMIN_PRODUCT_CATEGORIES.find((item) => item.key === normalizedKey);

  return category?.label || categoryKey || 'Khác';
};
