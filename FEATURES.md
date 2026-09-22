# 🌟 Feature Documentation - Krishi Drishti

Complete guide to all features and capabilities of the Krishi Drishti AI-Powered Precision Agriculture System.

## 📑 Table of Contents

1. [Live Monitor](#live-monitor)
2. [Sensor Dashboard](#sensor-dashboard)
3. [Threat Detection](#threat-detection)
4. [Smart Irrigation](#smart-irrigation)
5. [Crop Intelligence](#crop-intelligence)
6. [Harvest Prediction](#harvest-prediction)
7. [Alert System](#alert-system)
8. [Analytics & Insights](#analytics--insights)

---

## 🎥 Live Monitor

### 3D Farm Visualization

**What it does:**
- Provides an interactive 3D view of your entire farm
- Shows real-time placement of all hardware components
- Visualizes active threats and irrigation status

**Components Visible:**

1. **Camera Units (4 units)**
   - 360° rotating ESP32-CAM modules
   - Solar panel on top
   - Green indicator when threat detected
   - Mounted on 4-meter poles

2. **Sensor Stations (5 units)**
   - Central control box (orange)
   - Display panel showing live data
   - Underground soil sensors
   - Distributed across field

3. **Irrigation Units (4 units)**
   - Sprinkler heads at 2m height
   - Water visualization when active
   - Strategic placement for coverage

4. **Crop Field**
   - 2.5-acre visualization
   - Crop rows (200+ plants shown)
   - Realistic terrain

**Interaction:**
- **Rotate**: Left-click and drag
- **Zoom**: Mouse wheel or pinch
- **Pan**: Right-click and drag (or two-finger drag on mobile)
- **Reset View**: Refresh page

**Real-time Updates:**
- Threat indicators appear at detected locations
- Irrigation visualization shows active watering
- Camera indicators highlight active detection

---

## 📊 Sensor Dashboard

### Live Environmental Monitoring

**6 Real-time Metrics:**

### 1. Temperature 🌡️
- **Range**: 20-35°C
- **Update**: Every 5 seconds
- **Status Indicators**:
  - Normal: 20-30°C (Green)
  - High: >30°C (Yellow)
- **Use**: Crop stress monitoring, irrigation timing

### 2. Humidity 💧
- **Range**: 40-80%
- **Update**: Every 5 seconds
- **Status Indicators**:
  - Normal: 40-70% (Green)
  - High: >70% (Yellow - disease risk)
- **Use**: Disease prevention, harvest timing

### 3. Soil Moisture 🌱
- **Range**: 30-80%
- **Update**: Every 5 seconds
- **Status Indicators**:
  - Low: <40% (Yellow - irrigation needed)
  - Optimal: 40-70% (Green)
  - High: >70% (Blue)
- **Use**: Irrigation scheduling, water conservation

### 4. Soil pH ⚗️
- **Range**: 5.5-8.0
- **Update**: Every 5 seconds
- **Status Indicators**:
  - Optimal: 6.0-7.5 (Green)
  - Check: <6.0 or >7.5 (Yellow - amendment needed)
- **Use**: Crop suitability, fertilizer planning

### 5. Light Intensity ☀️
- **Range**: 500-1000 lux
- **Update**: Every 5 seconds
- **Status Indicators**:
  - Low: <700 lux (Yellow)
  - Bright: >700 lux (Green)
- **Use**: Growth monitoring, shade management

### 6. NPK Levels ⚡
- **Nitrogen (N)**: 20-80 mg/kg
- **Phosphorus (P)**: 15-60 mg/kg
- **Potassium (K)**: 25-80 mg/kg
- **Update**: Every 5 seconds
- **Status**: Balanced (Green)
- **Use**: Fertilizer recommendations, crop selection

**Data Visualization:**
- Color-coded cards for quick status
- Large, readable values
- Status badges (Normal/High/Low/Optimal)
- Smooth animations on updates

---

## 🚨 Threat Detection

### AI-Powered Security System

**Detection Capabilities:**

### 1. Wild Animals 🐘
- **Types Detected**:
  - Elephants
  - Wild Boars
  - Deer
  - Other large mammals
- **Confidence**: 75-99%
- **Response Time**: <1 second
- **Action**: 
  - Strobing lights activated
  - Telegram alert sent
  - Location marked on 3D map

### 2. Bird Activity 🦅
- **Detection**: Flocks and individual birds
- **Confidence**: 75-99%
- **Response Time**: <1 second
- **Action**:
  - Ultrasonic deterrent activated
  - Movement tracking
  - Alert notification

### 3. Fire Detection 🔥
- **Detection**: Smoke and flames
- **Confidence**: 85-99%
- **Response Time**: <0.5 seconds
- **Action**:
  - Emergency notification
  - Fire location marked
  - Evacuation protocol suggested

**Threat Alert Display:**
- Large animated card when threat active
- Threat type icon and name
- Confidence percentage
- GPS coordinates
- Detection timestamp
- Automated response status
- Live camera feed indicator

**When No Threats:**
- "All Clear" status display
- System health indicators
- Coverage confirmation (4 cameras, 360°)

---

## 💧 Smart Irrigation

### AI-Optimized Water Management

**Control Interface:**

### Manual Controls
- **Start/Stop Button**: Toggle irrigation on/off
- **Real-time Status**: Active/Idle indicator
- **Visual Feedback**: Animated status indicator

### Live Metrics

1. **Water Flow**
   - Current: 0-50 liters/min
   - Real-time measurement
   - Graph visualization

2. **Pressure**
   - Current: 2-4 bar
   - Safety monitoring
   - Optimal range indicator

3. **Daily Usage**
   - Total: 500-2000 liters
   - Running total
   - Comparison with optimal

4. **Valve Status**
   - Open/Closed
   - Visual indicator
   - Safety status

### AI Recommendations

**When Active:**
- Optimal irrigation cycle confirmation
- Water savings estimate (30%)
- Efficiency metrics

**When Idle:**
- Next irrigation time (based on soil moisture)
- Weather forecast consideration
- Evapotranspiration calculation

**Benefits:**
- 35% water savings vs traditional methods
- Prevents over-watering
- Reduces water stress
- Automated scheduling

---

## 🌾 Crop Intelligence

### AI Crop Recommendations

**Analysis Based On:**
- Current soil NPK levels
- Soil pH
- Temperature trends
- Humidity patterns
- Rainfall data (simulated)
- Historical yield data

**Recommendation Display:**

Each crop shows:
1. **Crop Name** (★ for top recommendation)
2. **Suitability Score**: 0-100%
   - 80-100%: Highly Suitable (Green)
   - 70-79%: Suitable (Yellow)
   - <70%: Consider alternatives (Orange)
3. **Expected Yield**: tonnes/acre
4. **Season**: Kharif/Rabi/Year-round
5. **Progress Bar**: Visual suitability indicator

**Sample Crops:**
- Rice (Suitability: 85%, Yield: 4.5 t/acre, Season: Kharif)
- Wheat (Suitability: 78%, Yield: 3.2 t/acre, Season: Rabi)
- Cotton (Suitability: 72%, Yield: 2.8 t/acre, Season: Kharif)
- Sugarcane (Suitability: 88%, Yield: 45 t/acre, Year-round)

**Additional Info:**
- **Planting Schedule**: Optimal window based on weather
- **Weather Advisory**: Monsoon predictions
- **Market Insights**: Price trends (future enhancement)

---

## 📅 Harvest Prediction

### ML-Powered Growth Tracking

**Current Crop Display:**
- Crop name (e.g., Rice)
- Confidence level (85-92%)
- Days until optimal harvest
- Exact harvest date
- Growth progress percentage

**Growth Stages:**

1. **Planted** ✓ Complete
2. **Vegetative** ✓ Complete
3. **Flowering** ◐ Current (50% complete)
4. **Harvest** ○ Pending

**Visual Elements:**
- Large countdown display (days remaining)
- Progress bar showing growth completion
- Stage indicators with status icons
- Growth curve graph

**Predictions Include:**

1. **Expected Yield**
   - Amount: 4.5 tonnes/acre
   - Quality score: A+ (Premium grade)
   - Confidence: 89%

2. **Optimal Harvest Date**
   - Exact date calculation
   - Weather consideration
   - Market timing (future)

3. **Weather Advisory**
   - Rainfall alerts
   - Temperature warnings
   - Harvest timing adjustments

**Benefits:**
- Maximize yield potential
- Optimal market timing
- Prevent weather damage
- Labor planning assistance

---

## 📱 Alert System

### Telegram Integration

**Bot Features:**

1. **Real-time Notifications**
   - Instant threat alerts
   - System status updates
   - Daily summaries

2. **Alert Types**
   - 🚨 Threat: Animal/bird/fire detected
   - 💧 System: Irrigation status changes
   - ℹ️ Info: Daily reports, recommendations

3. **Alert Content**
   - Threat type and confidence
   - Location coordinates
   - Timestamp
   - Recommended action
   - Live map link (future)

**Bot Status Dashboard:**
- Connection status (Online/Offline)
- Total alerts sent (session)
- Active users count
- Delivery rate (100%)

**Recent Alerts List:**
- Last 5 alerts displayed
- Alert type icon
- Full message text
- Timestamp
- Delivery confirmation (✓)

**Integration Details:**
- WiFi connected
- Real-time delivery
- Multi-user support
- Works on any smartphone

**Setup for Real Hardware:**
1. Create Telegram bot via @BotFather
2. Get bot token and chat ID
3. Configure ESP32 with credentials
4. Test notification delivery

---

## 📈 Analytics & Insights

### Performance Metrics Dashboard

**Key Metrics Cards:**

### 1. Cost Savings 💰
- **Total**: ₹18,500+/acre/year
- **Comparison**: +35% vs traditional
- **Breakdown**:
  - Reduced labor: ₹8,000
  - Water savings: ₹3,000
  - Reduced crop loss: ₹5,500
  - Optimized inputs: ₹2,000

### 2. Water Conservation 💧
- **Savings**: 35% reduction
- **Amount**: 3,000+ liters/day saved
- **Impact**: Sustainable farming
- **Method**: AI-optimized scheduling

### 3. Yield Increase 🌱
- **Improvement**: 22% higher yield
- **Reason**: 
  - Better irrigation timing
  - Reduced crop loss from threats
  - Optimal harvest timing
  - Data-driven decisions

**Charts & Graphs:**

### 1. Weekly Water Usage
- **Type**: Bar chart
- **Data**: Actual vs Optimal usage
- **Insight**: Track water efficiency
- **Trend**: Decreasing to optimal levels

### 2. Crop Health Score
- **Type**: Line chart
- **Data**: Daily health percentage
- **Range**: 80-100%
- **Trend**: Improving (85→93%)

### 3. Threat Distribution
- **Type**: Pie chart
- **Categories**:
  - Birds: 45%
  - Wild Animals: 30%
  - Fire Alerts: 15%
  - Other: 10%
- **Insight**: Focus deterrent efforts

### 4. Cost Comparison
- **Type**: Line chart
- **Data**: Traditional vs AI system (6 months)
- **Visual**: Clear separation showing savings
- **Trend**: Consistent 30-40% savings

**Report Features:**
- Export data (future)
- Custom date ranges (future)
- Share reports (future)
- Print-friendly format

---

## 🎯 System Integration

### How Everything Works Together

```
┌─────────────────────────────────────────────────┐
│  Field Sensors (Temperature, Humidity, etc.)    │
│            ↓                                    │
│  ESP32 Microcontroller                          │
│            ↓                                    │
│  WiFi Connection                                │
│            ↓                                    │
│  Cloud Dashboard (This Web App)                 │
│            ↓                                    │
│  AI Analysis & Decision Making                  │
│            ↓                                    │
│  ┌──────────────┬──────────────┬─────────────┐ │
│  │ Irrigation   │ Deterrents   │ Alerts      │ │
│  │ Control      │ (Sound/Light)│ (Telegram)  │ │
│  └──────────────┴──────────────┴─────────────┘ │
└─────────────────────────────────────────────────┘
```

**Data Flow:**
1. Sensors collect data every 5 seconds
2. ESP32 processes and uploads to cloud
3. AI models analyze data
4. Dashboard displays real-time information
5. Automated actions triggered when needed
6. Alerts sent to farmers
7. System learns and improves

---

## 💡 Best Practices

### For Optimal Performance

1. **Regular Monitoring**
   - Check dashboard daily
   - Review alerts immediately
   - Analyze weekly trends

2. **Sensor Maintenance**
   - Clean sensors monthly
   - Calibrate quarterly
   - Replace batteries as needed

3. **System Updates**
   - Update firmware regularly
   - Train AI models with new data
   - Adjust thresholds seasonally

4. **Data-Driven Decisions**
   - Use crop recommendations
   - Follow harvest predictions
   - Trust AI irrigation schedules

---

## 🔮 Future Enhancements

- [ ] Weather API integration (real forecast)
- [ ] Market price predictions
- [ ] Pest and disease detection
- [ ] Drone monitoring integration
- [ ] Voice commands (Hindi, regional languages)
- [ ] Mobile app (iOS/Android)
- [ ] Multi-farm management
- [ ] Blockchain supply chain tracking

---

## 📞 Support & Troubleshooting

**Common Issues:**

1. **3D Scene Not Loading**
   - Check WebGL browser support
   - Try Chrome/Firefox
   - Refresh page

2. **Data Not Updating**
   - Check internet connection
   - Verify system is online
   - Wait 5 seconds for next update

3. **Alerts Not Showing**
   - Check bot configuration
   - Verify WiFi connection
   - Test Telegram connectivity

**For Help:**
- See README.md
- Check DEPLOYMENT.md
- Contact team

---

**Feature documentation for Smart India Hackathon 2026 | Problem Statement 26210**
