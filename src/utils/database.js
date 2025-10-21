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