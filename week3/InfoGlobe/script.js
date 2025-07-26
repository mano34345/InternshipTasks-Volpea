document.addEventListener('DOMContentLoaded', function () {
  // Clear saved data
  localStorage.removeItem('userAge');
  localStorage.removeItem('userDOB');
  localStorage.removeItem('selectedCountryDisplay');

  // Show the modal on load
  document.getElementById('mainContainer').style.display = 'none';
  document.getElementById('ageModal').style.display = 'flex';

  // Populate DOB dropdowns
  populateDOBDropdowns();
});

function verifyAge() {
  const age = parseInt(document.getElementById('ageInput').value);
  if (!age || age < 1) return alert("Please enter a valid age.");
  if (age < 18) {
    alert("Access Denied: You must be at least 18.");
    try { window.open('', '_self').close(); } catch { }
    window.location.href = "https://www.google.com";
  } else {
    saveToStorage('userAge', age);
    unlockContent();
  }
}

function unlockContent() {
  document.getElementById('ageModal').style.display = 'none';
  document.getElementById('mainContainer').style.display = 'block';
  loadSavedData();
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  document.getElementById('themeIcon').textContent = isDark ? '🌙' : '☀';
  saveToStorage('theme', isDark ? 'dark' : 'light');
}

function populateDOBDropdowns() {
  const daySelect = document.getElementById('dobDay');
  const monthSelect = document.getElementById('dobMonth');
  const yearSelect = document.getElementById('dobYear');
  const currentYear = new Date().getFullYear();

  // Clear existing options
  daySelect.innerHTML = '';
  monthSelect.innerHTML = '';
  yearSelect.innerHTML = '';

  // Add default options
  const defaultDayOption = document.createElement('option');
  defaultDayOption.value = '';
  defaultDayOption.textContent = 'Select Day';
  daySelect.appendChild(defaultDayOption);

  const defaultMonthOption = document.createElement('option');
  defaultMonthOption.value = '';
  defaultMonthOption.textContent = 'Select Month';
  monthSelect.appendChild(defaultMonthOption);

  const defaultYearOption = document.createElement('option');
  defaultYearOption.value = '';
  defaultYearOption.textContent = 'Select Year';
  yearSelect.appendChild(defaultYearOption);

  // Populate days
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    daySelect.appendChild(option);
  }

  // Populate months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  for (let i = 0; i < months.length; i++) {
    const option = document.createElement('option');
    option.value = i + 1;
    option.textContent = months[i];
    monthSelect.appendChild(option);
  }

  // Populate years
  for (let i = currentYear; i >= currentYear - 100; i--) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
  }
}

function verifyDOB() {
  const day = document.getElementById('dobDay').value;
  const month = document.getElementById('dobMonth').value;
  const year = document.getElementById('dobYear').value;
  if (!day || !month || !year) return alert("Please select a complete date.");
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 18) {
    alert("Access Denied: You must be at least 18.");
    window.location.href = "https://www.google.com";
  } else {
    saveToStorage('userDOB', { day, month, year });
    displayAgeInfo(birthDate);
  }
}

function displayAgeInfo(birthDate) {
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();
  if (days < 0) {
    months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--; months += 12;
  }
  document.getElementById('ageInfo').innerText =
    `Your Age: ${years} years, ${months} months, ${days} days`;
}

const countries = {
  france: { name: "France", flag: "https://flagcdn.com/w320/fr.png", fact: "Capital: Paris<br>Population: ~67 million" },
  germany: { name: "Germany", flag: "https://flagcdn.com/w320/de.png", fact: "Capital: Berlin<br>Population: ~83 million" },
  japan: { name: "Japan", flag: "https://flagcdn.com/w320/jp.png", fact: "Capital: Tokyo<br>Population: ~125 million" },
  canada: { name: "Canada", flag: "https://flagcdn.com/w320/ca.png", fact: "Capital: Ottawa<br>Population: ~38 million" },
  pakistan: { name: "Pakistan", flag: "https://flagcdn.com/w320/pk.png", fact: "Capital: Islamabad<br>Population: ~241 million" },
  australia: { name: "Australia", flag: "https://flagcdn.com/w320/au.png", fact: "Capital: Canberra<br>Population: ~25 million" }
};

function updateCountryInfo() {
  const select = document.getElementById('countrySelect');
  const value = select.value;
  const infoDiv = document.getElementById('countryDisplay');
  if (countries[value]) {
    const country = countries[value];
    infoDiv.innerHTML = `
      <img src="${country.flag}" class="country-flag" alt="${country.name} flag" />
      <h3>${country.name}</h3>
      <p>${country.fact}</p>
    `;
    saveToStorage('selectedCountryDisplay', value);
  } else {
    infoDiv.innerHTML = "";
  }
}

function resetData() {
  localStorage.clear();
  location.reload();
}

// Main function to capture and store ONLY IP and country
async function captureGeoInfo(storageType = 'sessionStorage') {
  try {
    // Try multiple geolocation APIs as fallback
    const apiUrls = [
      'https://ipinfo.io/json?token=e532106082a144'
    ];
    
    let geoData = null;
    
    for (const url of apiUrls) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;
        
        const data = await response.json();
        
        // Capture ONLY IP and country
        geoData = {
          ip: data.ip || data.query,
          country: data.country_name || data.country,
          timestamp: new Date().toISOString()
        };
       
        if (geoData.ip && geoData.country) break;
      } catch (error) {
        console.warn(`API ${url} failed:`, error);
        continue;
      }
    }
    
    if (!geoData) {
      throw new Error('All geolocation APIs failed');
    }
    
    // Store in specified storage
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    storage.setItem('userGeoData', JSON.stringify(geoData));
    
    return geoData;
  } catch (error) {
    console.error('Error capturing geo info:', error);
    throw error;
  }
}

// Display ONLY IP and country information
function displayGeoInfo(info, storageType) {
  const geoInfoDiv = document.getElementById('geoInfo');
  
  if (!info) {
    geoInfoDiv.innerHTML = '<div class="error">No geo information available</div>';
    return;
  }
  
  geoInfoDiv.innerHTML = `
    <div class="info-item">
      <span class="label">IP Address:</span> ${info.ip}
    </div>
    <div class="info-item">
      <span class="label">Country:</span> ${info.country}
    </div>
    <div class="info-item">
      <span class="label">Detected at:</span> ${new Date(info.timestamp).toLocaleString()}
    </div>
    <div class="info-item">
      <span class="label">Storage:</span> ${storageType}
    </div>
  `;
}

// Get stored geo info
function getStoredGeoInfo(storageType) {
  try {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    const data = storage.getItem('userGeoData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading storage:', error);
    return null;
  }
}

// Clear storage
function clearStorage() {
  localStorage.removeItem('userGeoData');
  sessionStorage.removeItem('userGeoData');
  document.getElementById('geoInfo').innerHTML = 
    '<div class="info-item">Storage cleared. Refresh to detect again.</div>';
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  let currentStorage = 'sessionStorage';
  document.getElementById('sessionBtn').classList.add('active');
  
  try {
    // Check if we already have data in storage
    let geoInfo = getStoredGeoInfo(currentStorage);
    
    if (!geoInfo) {
      geoInfo = await captureGeoInfo(currentStorage);
    }
    
    displayGeoInfo(geoInfo, currentStorage);
  } catch (error) {
    document.getElementById('geoInfo').innerHTML = 
      '<div class="error">Failed to detect your location. Please try again later.</div>';
  }
});

// Event listeners
document.getElementById('sessionBtn').addEventListener('click', async () => {
  currentStorage = 'sessionStorage';
  document.getElementById('sessionBtn').classList.add('active');
  document.getElementById('localBtn').classList.remove('active');
  
  try {
    const geoInfo = await captureGeoInfo(currentStorage);
    displayGeoInfo(geoInfo, currentStorage);
  } catch (error) {
    document.getElementById('geoInfo').innerHTML = 
      '<div class="error">Failed to detect your location. Please try again later.</div>';
  }
});

document.getElementById('localBtn').addEventListener('click', async () => {
  currentStorage = 'localStorage';
  document.getElementById('localBtn').classList.add('active');
  document.getElementById('sessionBtn').classList.remove('active');
  
  try {
    const geoInfo = await captureGeoInfo(currentStorage);
    displayGeoInfo(geoInfo, currentStorage);
  } catch (error) {
    document.getElementById('geoInfo').innerHTML = 
      '<div class="error">Failed to detect your location. Please try again later.</div>';
  }
});

document.getElementById('clearBtn').addEventListener('click', clearStorage);