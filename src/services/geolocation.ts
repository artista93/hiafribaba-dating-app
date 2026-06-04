export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('المتصفح لا يدعم خاصية تحديد الموقع'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let message = 'حدث خطأ في تحديد الموقع';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'الرجاء السماح للتطبيق بالوصول إلى موقعك';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'لا يمكن تحديد موقعك حالياً';
            break;
          case error.TIMEOUT:
            message = 'انتهى وقت محاولة تحديد الموقع';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const watchLocation = (
  onUpdate: (location: { lat: number; lng: number }) => void,
  onError: (error: string) => void
): number | null => {
  if (!navigator.geolocation) {
    onError('المتصفح لا يدعم خاصية تحديد الموقع');
    return null;
  }
  
  return navigator.geolocation.watchPosition(
    (position) => {
      onUpdate({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    (error) => {
      onError(error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
};

export const clearWatch = (watchId: number | null) => {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};
