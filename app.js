const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');
const stadiumSelect = document.getElementById('stadium');
const actionBtn = document.querySelector('.action-btn');
const dashboard = document.getElementById('dashboard');
const errorBanner = document.getElementById('error-message');
const apiKeyInput = 'AIzaSyBjuMWqt30i0CDj5qGk4gVZNEGWDp9mNZA';

// Comprehensive Indian Stadium Data
const venuesData = {
    "Maharashtra": {
        "Mumbai": ["Wankhede Stadium", "Brabourne Stadium", "DY Patil Stadium", "Mumbai Football Arena"],
        "Pune": ["MCA International Stadium", "Shree Shiv Chhatrapati Sports Complex"],
        "Nagpur": ["Vidarbha Cricket Association Stadium"]
    },
    "Delhi": {
        "New Delhi": ["Arun Jaitley Stadium", "Jawaharlal Nehru Stadium", "Dhyan Chand National Stadium", "Ambedkar Stadium"]
    },
    "Karnataka": {
        "Bengaluru": ["M. Chinnaswamy Stadium", "Sree Kanteerava Stadium"]
    },
    "Tamil Nadu": {
        "Chennai": ["M. A. Chidambaram Stadium", "Jawaharlal Nehru Stadium (Chennai)", "Mayor Radhakrishnan Stadium"]
    },
    "West Bengal": {
        "Kolkata": ["Eden Gardens", "Salt Lake Stadium (Vivekananda Yuba Bharati Krirangan)", "Kishore Bharati Krirangan"]
    },
    "Gujarat": {
        "Ahmedabad": ["Narendra Modi Stadium", "EKA Arena"],
        "Rajkot": ["Saurashtra Cricket Association Stadium"],
        "Surat": ["Lalabhai Contractor Stadium"]
    },
    "Uttar Pradesh": {
        "Lucknow": ["Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium", "K.D. Singh Babu Stadium"],
        "Kanpur": ["Green Park Stadium"]
    },
    "Punjab": {
        "Mohali": ["Punjab Cricket Association IS Bindra Stadium"],
        "Mullanpur": ["Maharaja Yadavindra Singh International Cricket Stadium"],
        "Ludhiana": ["Guru Nanak Stadium"]
    },
    "Rajasthan": {
        "Jaipur": ["Sawai Mansingh Stadium"],
        "Jodhpur": ["Barkatullah Khan Stadium"]
    },
    "Telangana": {
        "Hyderabad": ["Rajiv Gandhi International Cricket Stadium", "G. M. C. Balayogi Athletic Stadium"]
    },
    "Kerala": {
        "Kochi": ["Jawaharlal Nehru Stadium (Kochi)"],
        "Thiruvananthapuram": ["Greenfield International Stadium"]
    },
    "Assam": {
        "Guwahati": ["ACA Stadium, Barsapara", "Indira Gandhi Athletic Stadium"]
    },
    "Madhya Pradesh": {
        "Indore": ["Holkar Stadium"],
        "Gwalior": ["Captain Roop Singh Stadium"]
    },
    "Odisha": {
        "Cuttack": ["Barabati Stadium"],
        "Bhubaneswar": ["Kalinga Stadium"]
    },
    "Andhra Pradesh": {
        "Visakhapatnam": ["Dr. Y. S. Rajasekhara Reddy ACA–VDCA Cricket Stadium"]
    },
    "Jharkhand": {
        "Ranchi": ["JSCA International Stadium Complex"]
    },
    "Chhattisgarh": {
        "Raipur": ["Shaheed Veer Narayan Singh International Cricket Stadium"]
    },
    "Himachal Pradesh": {
        "Dharamshala": ["Himachal Pradesh Cricket Association Stadium"]
    },
    "Uttarakhand": {
        "Dehradun": ["Rajiv Gandhi International Cricket Stadium, Dehradun"]
    },
    "Goa": {
        "Margao": ["Fatorda Stadium"]
    }
};

// Initialize States
function initStates() {
    stateSelect.innerHTML = '<option value="">Select State</option>';
    const states = Object.keys(venuesData).sort();
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

stateSelect.addEventListener('change', (e) => {
    const state = e.target.value;
    citySelect.innerHTML = '<option value="">Select City</option>';
    stadiumSelect.innerHTML = '<option value="">Select Stadium</option>';
    if (state && venuesData[state]) {
        const cities = Object.keys(venuesData[state]).sort();
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
});

citySelect.addEventListener('change', (e) => {
    const state = stateSelect.value;
    const city = e.target.value;
    stadiumSelect.innerHTML = '<option value="">Select Stadium</option>';
    if (state && city && venuesData[state][city]) {
        const stadiums = venuesData[state][city].sort();
        stadiums.forEach(stadium => {
            const option = document.createElement('option');
            option.value = stadium;
            option.textContent = stadium;
            stadiumSelect.appendChild(option);
        });
    }
});

async function loadDashboard() {
    const state = stateSelect.value;
    const city = citySelect.value;
    const stadium = stadiumSelect.value;

    if (!state || !city || !stadium) {
        alert("Please select State, City, and Stadium.");
        return;
    }

    // UI Updates for loading state
    actionBtn.classList.add('loading');
    actionBtn.disabled = true;
    actionBtn.innerHTML = '<span class="spinner"></span> Fetching Data...';
    
    dashboard.style.display = 'none';
    errorBanner.style.display = 'none';

    try {
        const prompt = `Act as an expert Stadium Logistics & Security Orchestrator API.
Provide a real-time situation report for the following venue:
Stadium: ${stadium}
Location: ${city}, ${state}, India

You MUST respond with ONLY a valid JSON object. Do not include markdown formatting or backticks. Use this exact schema:
{
  "environment": {
    "weather": "e.g., 32°C Clear",
    "estimated_capacity": "e.g., 45,000",
    "infrastructure_note": "A short 1-2 sentence note about the stadium's immediate surroundings."
  },
  "logistics": [
    { "type": "Nearest Hospital", "name": "e.g. Apollo Hospital", "maps_url": "e.g. https://www.google.com/maps/search/?api=1&query=Apollo+Hospital", "time": "e.g., 14 min", "traffic": "Clear|Moderate|Heavy" },
    { "type": "Police Station", "name": "e.g. City Police Station", "maps_url": "e.g. https://www.google.com/maps/search/?api=1&query=City+Police+Station", "time": "e.g., 5 min", "traffic": "Clear|Moderate|Heavy" },
    { "type": "Major Transit Hub", "name": "e.g. Central Railway Station", "maps_url": "e.g. https://www.google.com/maps/search/?api=1&query=Central+Railway+Station", "time": "e.g., 25 min", "traffic": "Clear|Moderate|Heavy" }
  ],
  "directives": [
    "Directive 1 (e.g. Open Gate 4 for faster egress)",
    "Directive 2",
    "Directive 3"
  ]
}`;

        // Dynamically fetch supported model to avoid 404
        let finalModelName = 'gemini-1.5-flash';
        try {
            const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKeyInput}`);
            if (modelsRes.ok) {
                const modelsData = await modelsRes.json();
                const validModels = modelsData.models.filter(m => 
                    m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')
                );
                if (validModels.length > 0) {
                    const preferred = validModels.find(m => m.name.includes('1.5-flash')) || validModels[0];
                    finalModelName = preferred.name.replace('models/', ''); // e.g. "gemini-1.5-flash-latest"
                }
            }
        } catch(e) {
            console.warn("Could not fetch models dynamically", e);
        }

        // Call Gemini API to get JSON
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${finalModelName}:generateContent?key=${apiKeyInput}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.2, // Low temperature for factual JSON
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            let rawText = data.candidates[0].content.parts[0].text;
            
            // Clean up if the model includes markdown code blocks
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            
            const jsonData = JSON.parse(rawText);
            
            // Populate UI
            document.getElementById('report-time').textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            
            document.getElementById('val-weather').textContent = jsonData.environment.weather;
            document.getElementById('val-capacity').textContent = jsonData.environment.estimated_capacity;
            document.getElementById('val-infra').textContent = jsonData.environment.infrastructure_note;
            
            // Populate Logistics
            const logList = document.getElementById('logistics-list');
            logList.innerHTML = '';
            jsonData.logistics.forEach(log => {
                let tagClass = 'tag-moderate';
                if (log.traffic === 'Clear') tagClass = 'tag-clear';
                if (log.traffic === 'Heavy') tagClass = 'tag-heavy';
                
                logList.innerHTML += `
                    <div class="logistics-item">
                        <div class="log-info">
                            <span class="log-name">${log.type}: <a href="${log.maps_url}" target="_blank" class="maps-link" title="Open in Google Maps">${log.name} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-bottom: 2px;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg></a></span>
                            <span class="log-time">${log.time} driving</span>
                        </div>
                        <span class="traffic-tag ${tagClass}">${log.traffic}</span>
                    </div>
                `;
            });
            
            // Populate Directives
            const dirList = document.getElementById('directives-list');
            dirList.innerHTML = '';
            jsonData.directives.forEach(dir => {
                dirList.innerHTML += `<div class="directive-item">${dir}</div>`;
            });
            
            dashboard.style.display = 'block';

        } else {
            throw new Error("Invalid response structure from AI API");
        }

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        errorBanner.textContent = `Failed to load data: ${error.message}`;
        errorBanner.style.display = 'block';
        dashboard.style.display = 'block'; // Show error banner inside dashboard area
    } finally {
        actionBtn.classList.remove('loading');
        actionBtn.disabled = false;
        actionBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Load Live Dashboard';
    }
}

// Event Listeners
actionBtn.addEventListener('click', loadDashboard);

// Initialize
initStates();
