// Configurație
export const PIPEDREAM_URL = 'https://eown3ytayljs38v.m.pipedream.net';

export const FRIEND_CODES = {
  'alin123': 'Alin', 'razvan456': 'Răzvan', 'matei789': 'Matei',
  'test': 'Test', 'client': 'Client', 'andrei': 'Andrei',
  'marius': 'Marius', 'cristi': 'Cristi', 'alin': 'Alin',
  'robert': 'Robert', 'dan': 'Dan', 'vlad': 'Vlad'
};

// Obține numele prietenului din URL
export const getFriendFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const friendCode = urlParams.get('ref') || 'unknown';
  return {
    code: friendCode,
    name: FRIEND_CODES[friendCode] || `Vizitator: ${friendCode}`
  };
};

// Obține informații despre baterie
export const getBatteryInfo = async () => {
  if ('getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      return {
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      };
    } catch (error) {
      return { level: 'unknown', charging: 'unknown' };
    }
  }
  return { level: 'not_supported', charging: 'not_supported' };
};

// Obține informații despre device
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  let deviceType = 'desktop';
  let browser = 'unknown';
  let os = 'unknown';

  // Detect device type
  if (/mobile|android|iphone|ipad/.test(userAgent)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad/.test(userAgent)) {
    deviceType = 'tablet';
  }

  // Detect browser
  if (/chrome/.test(userAgent)) {
    browser = 'chrome';
  } else if (/firefox/.test(userAgent)) {
    browser = 'firefox';
  } else if (/safari/.test(userAgent)) {
    browser = 'safari';
  } else if (/edge/.test(userAgent)) {
    browser = 'edge';
  }

  // Detect OS
  if (/windows/.test(userAgent)) {
    os = 'windows';
  } else if (/mac/.test(userAgent)) {
    os = 'macos';
  } else if (/linux/.test(userAgent)) {
    os = 'linux';
  } else if (/android/.test(userAgent)) {
    os = 'android';
  } else if (/iphone|ipad/.test(userAgent)) {
    os = 'ios';
  }

  return {
    type: deviceType,
    browser: browser,
    os: os,
    cores: navigator.hardwareConcurrency || 'unknown',
    memory: navigator.deviceMemory || 'unknown',
    touchPoints: navigator.maxTouchPoints || 'unknown',
    vendor: navigator.vendor || 'unknown'
  };
};

// Obține informații despre conexiune
export const getConnectionInfo = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    return {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 'unknown',
      rtt: connection.rtt || 'unknown',
      saveData: connection.saveData || false
    };
  }
  return {
    effectiveType: 'not_supported',
    downlink: 'not_supported',
    rtt: 'not_supported',
    saveData: false
  };
};

// Salvează datele în database
export const saveVisitorData = async (visitorData) => {
  try {
    // Trimite la Pipedream
    const response = await fetch(PIPEDREAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitorData)
    });
    
    console.log('✅ Date salvate în cloud!');
    return true;
  } catch (error) {
    console.log('⚠️ Salvăm local (backup)');
    saveLocalBackup(visitorData);
    return false;
  }
};

// Backup local
export const saveLocalBackup = (data) => {
  try {
    let localData = JSON.parse(localStorage.getItem('coolvent_backup') || '[]');
    localData.push(data);
    localStorage.setItem('coolvent_backup', JSON.stringify(localData));
  } catch (e) {
    console.log('Eroare la salvarea locală');
  }
};

// Încarcă datele locale pentru admin
export const loadLocalData = () => {
  try {
    return JSON.parse(localStorage.getItem('coolvent_backup') || '[]');
  } catch (e) {
    return [];
  }
};

// Șterge datele locale
export const clearLocalData = () => {
  localStorage.removeItem('coolvent_backup');
};