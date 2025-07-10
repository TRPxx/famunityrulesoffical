/**
 * Schedule Page JavaScript - Fam Unity Rules
 * จัดการการแสดงผลตารางเวลากิจกรรม
 */

let currentTimeInterval = null;
let countdownInterval = null;

// Time utilities
const TimeUtils = {
    formatThaiTime: (date) => {
        return date.toLocaleString('th-TH', {
            timeZone: 'Asia/Bangkok',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    },

    formatThaiDate: (date) => {
        return date.toLocaleDateString('th-TH', {
            timeZone: 'Asia/Bangkok',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatShortThaiDate: (date) => {
        return date.toLocaleDateString('th-TH', {
            timeZone: 'Asia/Bangkok',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    },

    getCurrentThaiTime: () => {
        return new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
    },

    getTimeRemaining: (targetTime) => {
        const now = new Date(TimeUtils.getCurrentThaiTime());
        const today = now.toDateString();
        let target = new Date(`${today} ${targetTime}`);
        
        if (target < now) {
            target.setDate(target.getDate() + 1);
        }

        const diff = target - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { hours, minutes, seconds, total: diff };
    },

    formatCountdown: (time) => {
        const h = String(time.hours).padStart(2, '0');
        const m = String(time.minutes).padStart(2, '0');
        const s = String(time.seconds).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
};

// Enhanced schedule data with all activities
const scheduleData = {
    airdrop: {
        gang: ['01:00', '15:00', '17:00', '19:00', '21:00', '23:00'],
        family: ['01:00', '15:00', '17:00', '19:00', '21:00', '23:00'],
        government: ['01:30', '15:30', '17:30', '19:30', '21:30', '23:30'],
        citizen: ['01:30', '15:30', '17:30', '19:30', '21:30', '23:30']
    },
    airdrug: ['01:30', '04:00', '08:30', '14:30', '16:00', '19:15', '20:15', '21:15', '22:45', '23:45'],
    airbox: ['02:30', '03:35', '07:30', '10:30', '11:30', '13:15', '14:00', '15:15', '16:30', '19:15', '20:45', '22:25', '23:50'],
    triathlon: ['00:00', '02:00', '10:00', '16:00'],
    flagevent: ['02:00', '10:00', '14:00']
};

// Find current and next activity
function findCurrentAndNextActivity() {
    const now = new Date(TimeUtils.getCurrentThaiTime());
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const allActivities = [];
    
    // Add all activities to array with proper names and colors
    scheduleData.airdrop.gang.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        allActivities.push({
            name: 'Airdrop (แก๊ง)',
            time: time,
            minutes: hours * 60 + minutes,
            type: 'airdrop',
            category: 'แก๊ง',
            color: 'text-purple-600'
        });
    });
    
    scheduleData.airdrop.family.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        allActivities.push({
            name: 'Airdrop (ครอบครัว)',
            time: time,
            minutes: hours * 60 + minutes,
            type: 'airdrop',
            category: 'ครอบครัว',
            color: 'text-blue-600'
        });
    });
    
    scheduleData.airdrop.government.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        allActivities.push({
            name: 'Airdrop (หน่วยงาน)',
            time: time,
            minutes: hours * 60 + minutes,
            type: 'airdrop',
            category: 'หน่วยงาน',
            color: 'text-yellow-600'
        });
    });
    
    scheduleData.airdrop.citizen.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        allActivities.push({
            name: 'Airdrop (ประชาชน)',
            time: time,
            minutes: hours * 60 + minutes,
            type: 'airdrop',
            category: 'ประชาชน',
            color: 'text-green-600'
        });
    });
    
    scheduleData.airdrug.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        allActivities.push({
            name: 'AirDrug',
            time: time,
            minutes: hours * 60 + minutes,
            type: 'airdrug',
            category: 'กล่องแดง',
            color: 'text-red-600'
        });
    });
    
    scheduleData.airbox.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        allActivities.push({
            name: 'AirBox',
            time: time,
            minutes: hours * 60 + minutes,
            type: 'airbox',
            category: 'ต่อสู้',
            color: 'text-orange-600'
        });
    });
    
    scheduleData.triathlon.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        allActivities.push({
            name: 'ไตรกีฬา',
            time: time,
            minutes: hours * 60 + minutes,
            type: 'triathlon',
            category: 'แข่งขัน',
            color: 'text-green-600'
        });
    });
    
    scheduleData.flagevent.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        allActivities.push({
            name: 'Flag Event',
            time: time,
            minutes: hours * 60 + minutes,
            type: 'flagevent',
            category: 'ยึดธง',
            color: 'text-purple-600'
        });
    });
    
    // Sort by time
    allActivities.sort((a, b) => a.minutes - b.minutes);
    
    // Find current activity (within 5 minutes)
    let currentActivity = null;
    for (let activity of allActivities) {
        const timeDiff = Math.abs(activity.minutes - currentTime);
        if (timeDiff <= 5) {
            currentActivity = activity;
            break;
        }
    }
    
    // Find next activity
    let nextActivity = null;
    for (let activity of allActivities) {
        if (activity.minutes > currentTime) {
            nextActivity = activity;
            break;
        }
    }
    
    // If no activity found today, get first activity of tomorrow
    if (!nextActivity) {
        nextActivity = allActivities[0];
    }
    
    return { current: currentActivity, next: nextActivity };
}

// Update time displays and activity status
function updateTimeDisplays() {
    const now = new Date(TimeUtils.getCurrentThaiTime());
    const timeString = TimeUtils.formatThaiTime(now);
    const dateString = TimeUtils.formatShortThaiDate(now);
    const fullDateString = TimeUtils.formatThaiDate(now);
    
    // Update all current time displays
    const timeElements = [
        'current-time',
        'current-time-display',
        'live-time'
    ];
    
    const dateElements = [
        'current-date',
        'current-date-display',
        'live-date'
    ];
    
    timeElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = timeString;
            if (id === 'current-time' || id === 'live-time') {
                element.style.color = '#facc15'; // yellow-400
                element.style.textShadow = '0 0 20px rgba(250, 204, 21, 0.5)';
            }
        }
    });
    
    dateElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'current-date' || id === 'live-date') {
                element.textContent = fullDateString;
            } else {
                element.textContent = `วันที่ ${dateString}`;
            }
        }
    });
    
    // Update activity status
    updateActivityStatus();
}

// Update activity status and countdown
function updateActivityStatus() {
    const { current, next } = findCurrentAndNextActivity();
    
    // Update current activity status
    const currentStatusElement = document.getElementById('current-activity-status');
    const currentDetailsElement = document.getElementById('current-activity-details');
    
    if (current && currentStatusElement && currentDetailsElement) {
        currentStatusElement.innerHTML = `<i class="fas fa-play-circle mr-2"></i>${current.name}`;
        currentDetailsElement.textContent = `${current.category} - เวลา ${current.time}`;
        currentStatusElement.className = 'text-xl font-bold text-green-200';
    } else if (currentStatusElement && currentDetailsElement) {
        currentStatusElement.innerHTML = `<i class="fas fa-pause-circle mr-2"></i>ไม่มีกิจกรรม`;
        currentDetailsElement.textContent = 'รอกิจกรรมถัดไป';
        currentStatusElement.className = 'text-xl font-bold text-blue-200';
    }
    
    // Update next activity and countdown
    if (next) {
        updateCountdownTimer(next);
    }
}

// Update countdown timer for next activity
function updateCountdownTimer(nextActivity) {
    const countdownElement = document.getElementById('next-countdown');
    const nextInfoElement = document.getElementById('next-activity-info');
    
    if (!countdownElement || !nextInfoElement) return;
    
    const timeRemaining = TimeUtils.getTimeRemaining(nextActivity.time);
    
    if (timeRemaining.total > 0) {
        countdownElement.textContent = TimeUtils.formatCountdown(timeRemaining);
        nextInfoElement.innerHTML = `<i class="fas fa-arrow-right mr-1"></i>${nextActivity.name} - ${nextActivity.time}`;
    } else {
        countdownElement.textContent = '00:00:00';
        nextInfoElement.innerHTML = `<i class="fas fa-play mr-1"></i>เริ่มแล้ว!`;
    }
}

// Add smooth scroll to activity sections
function addSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add hover effects to activity cards
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.hover\\:scale-105');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Initialize real-time updates
function initializeRealTimeUpdates() {
    // Update immediately
    updateTimeDisplays();
    
    // Update every second
    if (currentTimeInterval) {
        clearInterval(currentTimeInterval);
    }
    
    currentTimeInterval = setInterval(updateTimeDisplays, 1000);
    
    // Update countdown every second
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    countdownInterval = setInterval(updateActivityStatus, 1000);
}

// Animation effects
function addAnimationEffects() {
    // Add staggered animation to activity cards
    const cards = document.querySelectorAll('.lg\\:col-span-3 > div > div');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Add pulse animation to current time displays
    const timeElements = ['current-time', 'current-time-display'];
    timeElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            setInterval(() => {
                element.style.transform = 'scale(1.1)';
                element.style.fontWeight = 'bold';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.fontWeight = 'bold';
                }, 300);
            }, 3000);
        }
    });
}

// Show current time status
function displayTimeStatus() {
    console.log('🕒 Current Time Status:');
    const now = new Date(TimeUtils.getCurrentThaiTime());
    console.log(`📅 วันที่: ${TimeUtils.formatThaiDate(now)}`);
    console.log(`⏰ เวลา: ${TimeUtils.formatThaiTime(now)}`);
    
    const { current, next } = findCurrentAndNextActivity();
    
    if (current) {
        console.log(`🎯 กิจกรรมปัจจุบัน: ${current.name} (${current.time})`);
    } else {
        console.log('⏸️ ไม่มีกิจกรรมในขณะนี้');
    }
    
    if (next) {
        const timeRemaining = TimeUtils.getTimeRemaining(next.time);
        console.log(`⏭️ กิจกรรมถัดไป: ${next.name} (${next.time})`);
        console.log(`⏳ เหลือเวลา: ${TimeUtils.formatCountdown(timeRemaining)}`);
    }
}

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Schedule page loaded - เริ่มต้นระบบตารางเวลา');
    
    // Initialize all features
    initializeRealTimeUpdates();
    addSmoothScrolling();
    addCardHoverEffects();
    addAnimationEffects();
    
    // Show initial time status
    displayTimeStatus();
    
    // Show time status every minute
    setInterval(displayTimeStatus, 60000);
    
    // Add performance optimization
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeIn');
                }
            });
        });
        
        // Observe activity cards
        document.querySelectorAll('.hover\\:scale-105').forEach(card => {
            observer.observe(card);
        });
    }
    
    // Cleanup intervals on page unload
    window.addEventListener('beforeunload', function() {
        if (currentTimeInterval) {
            clearInterval(currentTimeInterval);
        }
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    });
    
    // Add smooth animation to time displays
    const addTimeAnimation = () => {
        const timeElements = document.querySelectorAll('#current-time, #live-time, #current-time-display');
        timeElements.forEach((element, index) => {
            if (element) {
                element.style.transition = 'all 0.3s ease';
                element.style.animation = `pulse 2s ease-in-out infinite ${index * 0.2}s`;
                
                // Add hover effect
                element.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                    this.style.textShadow = '0 0 30px rgba(250, 204, 21, 0.8)';
                });
                
                element.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                    this.style.textShadow = '0 0 20px rgba(250, 204, 21, 0.5)';
                });
            }
        });
    };
    
    // Add pulse animation CSS
    if (!document.getElementById('time-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'time-animation-styles';
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.8; }
            }
            
            .time-glow {
                text-shadow: 0 0 20px rgba(250, 204, 21, 0.5);
                transition: all 0.3s ease;
            }
            
            .time-glow:hover {
                text-shadow: 0 0 30px rgba(250, 204, 21, 0.8);
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Apply animations after DOM loads
    setTimeout(addTimeAnimation, 500);

    console.log('✅ Schedule system initialized successfully - ระบบพร้อมใช้งาน');
});
