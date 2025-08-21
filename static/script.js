// Global variables
let userData = null;
let currentTab = 'cookies';

// Utility functions
function formatDistanceToNow(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
}

function formatCookieValue(value) {
    return value.length > 50 ? value.substring(0, 50) + "..." : value;
}

function formatUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname + urlObj.pathname;
    } catch {
        return url;
    }
}

function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const element = document.getElementById('last-updated');
    if (element) {
        element.textContent = timeString;
    }
}

// Dashboard functions
function initDashboard() {
    updateLastUpdated();
    
    // Set up refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            location.reload();
        });
    }
    
    // Set up cleanup button
    const cleanupBtn = document.getElementById('cleanup-btn');
    if (cleanupBtn) {
        cleanupBtn.addEventListener('click', handleCleanup);
    }
    
    // Update stats
    updateStats();
}

function updateStats() {
    // Count screenshots
    const screenshotCells = document.querySelectorAll('td').forEach(cell => {
        if (cell.textContent.includes('Available')) {
            const counter = document.getElementById('screenshots-count');
            if (counter) {
                const current = parseInt(counter.textContent) || 0;
                counter.textContent = current + 1;
            }
        }
    });
}

async function handleCleanup() {
    if (!confirm('Are you sure you want to delete old data? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch('/api/cleanup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(`Successfully deleted ${result.deleted} old records.`);
            location.reload();
        } else {
            throw new Error('Cleanup failed');
        }
    } catch (error) {
        console.error('Cleanup error:', error);
        alert('Failed to cleanup old data. Please try again.');
    }
}

// User detail functions
function initUserDetail() {
    if (typeof userId !== 'undefined') {
        loadUserData(userId);
        setupTabs();
        setupFullscreen();
    }
}

async function loadUserData(id) {
    try {
        const response = await fetch(`/api/data/${id}`);
        if (!response.ok) {
            throw new Error('Failed to load user data');
        }
        
        userData = await response.json();
        updateDataOverview();
        renderTabContent();
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showError('Failed to load user data');
    }
}

function updateDataOverview() {
    if (!userData) return;
    
    // Update counts
    const cookiesCount = document.getElementById('cookies-count');
    const historyCount = document.getElementById('history-count');
    const platform = document.getElementById('platform');
    
    if (cookiesCount) cookiesCount.textContent = userData.cookies?.length || 0;
    if (historyCount) historyCount.textContent = userData.history?.length || 0;
    if (platform) platform.textContent = userData.system_info?.platform || 'Unknown';
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Update active states
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active', 'block'));
            tabContents.forEach(c => c.classList.add('hidden'));
            
            button.classList.add('active');
            const targetTab = document.getElementById(`${tabName}-tab`);
            if (targetTab) {
                targetTab.classList.add('active', 'block');
                targetTab.classList.remove('hidden');
            }
            
            currentTab = tabName;
            renderTabContent();
        });
    });
}

function renderTabContent() {
    if (!userData) return;
    
    switch (currentTab) {
        case 'cookies':
            renderCookies();
            break;
        case 'history':
            renderHistory();
            break;
        case 'system':
            renderSystemInfo();
            break;
    }
}

function renderCookies() {
    const container = document.getElementById('cookies-list');
    if (!container) return;
    
    const cookies = userData.cookies || [];
    
    if (cookies.length === 0) {
        container.innerHTML = '<div class="text-center text-cyber-muted py-8">No cookies found</div>';
        return;
    }
    
    container.innerHTML = cookies.map(cookie => `
        <div class="data-item">
            <div class="flex items-center justify-between mb-2">
                <span class="font-mono text-neon-cyan">${escapeHtml(cookie.name)}</span>
                <span class="px-2 py-1 rounded text-xs bg-cyber-border text-cyber-text">
                    ${escapeHtml(cookie.domain || 'Unknown')}
                </span>
            </div>
            <div class="text-sm text-cyber-muted font-mono break-all">
                ${escapeHtml(formatCookieValue(cookie.value))}
            </div>
            ${cookie.expires ? `
                <div class="text-xs text-cyber-muted mt-1">
                    Expires: ${escapeHtml(cookie.expires)}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function renderHistory() {
    const container = document.getElementById('history-list');
    if (!container) return;
    
    const history = userData.history || [];
    
    if (history.length === 0) {
        container.innerHTML = '<div class="text-center text-cyber-muted py-8">No history found</div>';
        return;
    }
    
    container.innerHTML = history.map(item => `
        <div class="data-item">
            <div class="flex items-start gap-3">
                <svg class="w-4 h-4 text-neon-cyan mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                </svg>
                <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm truncate">
                        ${escapeHtml(item.title || 'Untitled Page')}
                    </div>
                    <div class="text-xs text-neon-cyan font-mono break-all">
                        ${escapeHtml(formatUrl(item.url))}
                    </div>
                    <div class="flex items-center gap-4 mt-2 text-xs text-cyber-muted">
                        ${item.visitTime ? `
                            <div class="flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                ${escapeHtml(item.visitTime)}
                            </div>
                        ` : ''}
                        ${item.visitCount ? `
                            <div>Visits: ${item.visitCount}</div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderSystemInfo() {
    const container = document.getElementById('system-list');
    if (!container) return;
    
    const systemInfo = userData.system_info || {};
    const entries = Object.entries(systemInfo);
    
    if (entries.length === 0) {
        container.innerHTML = '<div class="text-center text-cyber-muted py-8">No system information available</div>';
        return;
    }
    
    container.innerHTML = entries.map(([key, value]) => `
        <div class="flex justify-between items-center p-3 rounded-lg bg-cyber-muted/30 border border-cyber-border">
            <span class="font-medium capitalize text-neon-cyan">
                ${escapeHtml(key.replace(/([A-Z])/g, ' $1').trim())}
            </span>
            <span class="text-sm text-cyber-muted font-mono text-right max-w-md truncate">
                ${escapeHtml(String(value))}
            </span>
        </div>
    `).join('');
}

function setupFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const modal = document.getElementById('fullscreen-modal');
    const closeBtn = document.getElementById('close-fullscreen');
    const fullscreenImg = document.getElementById('fullscreen-image');
    const screenshotImg = document.getElementById('screenshot-img');
    
    if (fullscreenBtn && modal && closeBtn && fullscreenImg && screenshotImg) {
        fullscreenBtn.addEventListener('click', () => {
            fullscreenImg.src = screenshotImg.src;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        });
        
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }
}

function toggleFullscreen() {
    const modal = document.getElementById('fullscreen-modal');
    const fullscreenImg = document.getElementById('fullscreen-image');
    const screenshotImg = document.getElementById('screenshot-img');
    
    if (modal && fullscreenImg && screenshotImg) {
        fullscreenImg.src = screenshotImg.src;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function showError(message) {
    // Simple error display - you could enhance this with a proper toast/modal
    alert(message);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on
    if (document.getElementById('users-table-body')) {
        // Dashboard page
        initDashboard();
    } else if (typeof userId !== 'undefined') {
        // User detail page
        initUserDetail();
    }
    
    // Update time every minute
    setInterval(updateLastUpdated, 60000);
});