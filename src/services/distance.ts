// حساب المسافة بين نقطتين باستخدام Haversine Formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // نصف قطر الأرض بالكيلومترات
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ترتيب المستخدمين حسب القرب
export const sortByDistance = <T extends { lat: number; lng: number }>(
  users: T[],
  userLat: number,
  userLng: number
): (T & { distance: number })[] => {
  return users
    .map((user) => ({
      ...user,
      distance: calculateDistance(userLat, userLng, user.lat, user.lng),
    }))
    .sort((a, b) => a.distance - b.distance);
};

// تنسيق المسافة للعرض
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};
