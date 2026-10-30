/**
 * My Spending - Mobile Expense Tracker
 * Features: 13 Custom Categories, Date & Time Tracking, CSV Export, Analytics, PWA Offline Support
 */

(() => {
  'use strict';

  // --- Constants & Config ---
  const STORAGE_KEY = 'my_spending_transactions_v1';
  const SETTINGS_KEY = 'my_spending_settings_v1';

  // The 13 Specific Categories requested by User
  const CATEGORIES = [
    {
      id: 'rent',
      name: 'Rent',
      icon: 'home',
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.16)',
      glow: 'rgba(99, 102, 241, 0.35)'
    },
    {
      id: 'bills',
      name: 'Bills',
      icon: 'zap',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.16)',
      glow: 'rgba(245, 158, 11, 0.35)'
    },
    {
      id: 'groceries',
      name: 'Groceries',
      icon: 'shopping-cart',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.16)',
      glow: 'rgba(16, 185, 129, 0.35)'
    },
    {
      id: 'school',
      name: 'School',
      icon: 'graduation-cap',
      color: '#0ea5e9',
      bg: 'rgba(14, 165, 233, 0.16)',
      glow: 'rgba(14, 165, 233, 0.35)'
    },
    {
      id: 'petrol',
      name: 'Petrol',
      icon: 'fuel',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.16)',
      glow: 'rgba(239, 68, 68, 0.35)'
    },
    {
      id: 'services',
      name: 'Services',
      icon: 'wrench',
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.16)',
      glow: 'rgba(6, 182, 212, 0.35)'
    },
    {
      id: 'medicine',
      name: 'Medicine',
      icon: 'pill',
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.16)',
      glow: 'rgba(236, 72, 153, 0.35)'
    },
    {
      id: 'pakistan',
      name: 'Pakistan',
      icon: 'globe',
      color: '#059669',
      bg: 'rgba(5, 150, 105, 0.20)',
      glow: 'rgba(5, 150, 105, 0.40)'
    },
    {
      id: 'car-installment',
      name: 'Car Installment',
      icon: 'car',
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.16)',
      glow: 'rgba(139, 92, 246, 0.35)'
    },
    {
      id: 'jeddah-groceries',
      name: 'Jeddah Groceries',
      icon: 'shopping-bag',
      color: '#14b8a6',
      bg: 'rgba(20, 184, 166, 0.16)',
      glow: 'rgba(20, 184, 166, 0.35)'
    },
    {
      id: 'kids',
      name: 'Kids',
      icon: 'smile',
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.16)',
      glow: 'rgba(244, 63, 94, 0.35)'
    },
    {
      id: 'maria',
      name: 'Maria',
      icon: 'heart',
      color: '#fb7185',
      bg: 'rgba(251, 113, 133, 0.16)',
      glow: 'rgba(251, 113, 133, 0.35)'
    },
    {
      id: 'iqama',
      name: 'Iqama',
      icon: 'shield',
      color: '#d97706',
      bg: 'rgba(217, 119, 6, 0.16)',
      glow: 'rgba(217, 119, 6, 0.35)'
    }
  ];

  // SVG Icons collection
  const ICONS = {
    'home': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    'zap': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    'shopping-cart': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
    'graduation-cap': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    'fuel': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>`,
    'wrench': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    'pill': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`,
    'globe': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    'car': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17H3v-4"/></svg>`,
    'shopping-bag': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    'smile': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>`,
    'heart': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    'shield': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    'check': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    'trash': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    'edit': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`
  };

  // State
  let transactions = [];
  let selectedCategory = CATEGORIES[0].id;
  let dateSelectionMode = 'now'; // 'now', 'today', 'yesterday', 'custom'
  let customDateVal = '';
  let customTimeVal = '';
  let activeTab = 'tab-add';
  let historySearchQuery = '';
  let historyCategoryFilter = 'all';
  let lastDeletedTx = null;
  let editingTxId = null;

  let settings = {
    currency: 'SAR',
    currencySymbol: 'SAR',
    theme: 'dark'
  };

  // --- Initializer ---
  function init() {
    loadSettings();
    loadTransactions();
    applyTheme(settings.theme);
    setupEventListeners();
    renderCategoriesGrid();
    renderCategoryFilters();
    updateDateSelectorUI();
    renderTransactionsHistory();
    updateAnalytics();
    updateCSVPreview();
    updateMonthSummaryBadge();
    registerServiceWorker();
  }

  // --- Storage ---
  function loadSettings() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        settings = Object.assign(settings, JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading settings', e);
    }
    updateCurrencyDisplay();
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
    updateCurrencyDisplay();
  }

  function loadTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        transactions = JSON.parse(data);
      } else {
        // Initialize with default or empty
        transactions = [];
      }
    } catch (e) {
      console.error('Error loading transactions', e);
      transactions = [];
    }
  }

  function saveTransactions() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions', e);
    }
    renderTransactionsHistory();
    updateAnalytics();
    updateCSVPreview();
    updateMonthSummaryBadge();
  }

  // --- Category Grid Rendering ---
  function renderCategoriesGrid() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;

    grid.innerHTML = CATEGORIES.map((cat) => {
      const isSelected = cat.id === selectedCategory;
      return `
        <button type="button" 
                class="category-card ${isSelected ? 'selected' : ''}" 
                data-id="${cat.id}"
                style="--cat-color: ${cat.color}; --cat-bg: ${cat.bg}; --cat-glow: ${cat.glow};"
                aria-pressed="${isSelected}">
          <div class="category-icon-wrapper">
            ${ICONS[cat.icon] || ICONS['home']}
          </div>
          <span class="category-name">${escapeHTML(cat.name)}</span>
          <span class="category-badge-check">${ICONS['check']}</span>
        </button>
      `;
    }).join('');
  }

  // --- Render Category Filters in History ---
  function renderCategoryFilters() {
    const container = document.getElementById('filter-pills-container');
    if (!container) return;

    let html = `
      <button type="button" class="filter-chip ${historyCategoryFilter === 'all' ? 'active' : ''}" data-cat="all">
        All
      </button>
    `;

    CATEGORIES.forEach((cat) => {
      const isActive = historyCategoryFilter === cat.id;
      html += `
        <button type="button" class="filter-chip ${isActive ? 'active' : ''}" data-cat="${cat.id}">
          ${escapeHTML(cat.name)}
        </button>
      `;
    });

    container.innerHTML = html;
  }

  // --- Date/Time Selection ---
  function updateDateSelectorUI() {
    const nowPill = document.getElementById('date-pill-now');
    const yesterdayPill = document.getElementById('date-pill-yesterday');
    const customPill = document.getElementById('date-pill-custom');
    const customContainer = document.getElementById('custom-datetime-container');
    const customDateInput = document.getElementById('custom-date-input');
    const customTimeInput = document.getElementById('custom-time-input');

    if (!nowPill) return;

    [nowPill, yesterdayPill, customPill].forEach(p => p.classList.remove('active'));

    if (dateSelectionMode === 'now') {
      nowPill.classList.add('active');
      customContainer.classList.remove('visible');
    } else if (dateSelectionMode === 'yesterday') {
      yesterdayPill.classList.add('active');
      customContainer.classList.remove('visible');
    } else if (dateSelectionMode === 'custom') {
      customPill.classList.add('active');
      customContainer.classList.add('visible');

      const now = new Date();
      if (!customDateInput.value) {
        customDateInput.value = formatDateYMD(now);
      }
      if (!customTimeInput.value) {
        customTimeInput.value = formatTimeHM(now);
      }
    }
  }

  function getActiveTimestamp() {
    const now = new Date();
    if (dateSelectionMode === 'now') {
      return now;
    } else if (dateSelectionMode === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    } else if (dateSelectionMode === 'custom') {
      const dateInput = document.getElementById('custom-date-input').value;
      const timeInput = document.getElementById('custom-time-input').value || '12:00';
      if (dateInput) {
        const dt = new Date(`${dateInput}T${timeInput}:00`);
        if (!isNaN(dt.getTime())) {
          return dt;
        }
      }
      return now;
    }
    return now;
  }

  // --- Quick Amount Chips ---
  function handleQuickAmount(addValue) {
    const input = document.getElementById('amount-input');
    let current = parseFloat(input.value) || 0;
    current += addValue;
    input.value = current.toFixed(current % 1 === 0 ? 0 : 2);
    triggerHaptic();
  }

  function handleClearAmount() {
    const input = document.getElementById('amount-input');
    input.value = '';
    input.focus();
    triggerHaptic();
  }

  // --- Add Transaction ---
  function handleAddExpense(e) {
    if (e) e.preventDefault();

    const amountInput = document.getElementById('amount-input');
    const notesInput = document.getElementById('notes-input');

    const amount = parseFloat(amountInput.value);
    if (!amount || isNaN(amount) || amount <= 0) {
      showToast('⚠️ Please enter a valid amount');
      amountInput.focus();
      return;
    }

    const categoryObj = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];
    const timestampObj = getActiveTimestamp();

    const newTransaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      amount: Math.round(amount * 100) / 100,
      currency: settings.currency,
      categoryId: categoryObj.id,
      categoryName: categoryObj.name,
      notes: notesInput.value.trim(),
      date: formatDateYMD(timestampObj),
      time: formatTimeHMS(timestampObj),
      timestamp: timestampObj.getTime()
    };

    // Prepend to list (newest first)
    transactions.unshift(newTransaction);
    saveTransactions();

    // Reset Form
    amountInput.value = '';
    notesInput.value = '';
    dateSelectionMode = 'now';
    updateDateSelectorUI();

    triggerHaptic();
    showToast(`✅ Added ${settings.currency} ${formatNumber(newTransaction.amount)} in ${categoryObj.name}`, true, newTransaction.id);
  }

  // --- Render Transaction History ---
  function renderTransactionsHistory() {
    const container = document.getElementById('transactions-container');
    if (!container) return;

    let filtered = [...transactions];

    // Filter by Category
    if (historyCategoryFilter !== 'all') {
      filtered = filtered.filter(tx => tx.categoryId === historyCategoryFilter);
    }

    // Filter by Search Query
    if (historySearchQuery) {
      const q = historySearchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        (tx.notes && tx.notes.toLowerCase().includes(q)) ||
        (tx.categoryName && tx.categoryName.toLowerCase().includes(q)) ||
        (tx.amount.toString().includes(q))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${ICONS['shopping-cart']}</div>
          <div class="empty-title">No expenditures found</div>
          <p class="empty-desc">Transactions you log will automatically show here with date, time, and notes.</p>
        </div>
      `;
      return;
    }

    // Sort by timestamp desc
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // Group by Day
    const groups = {};
    filtered.forEach(tx => {
      const groupKey = tx.date;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(tx);
    });

    let html = '';
    const todayYMD = formatDateYMD(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayYMD = formatDateYMD(yesterday);

    Object.keys(groups).forEach(dateStr => {
      const dayTxs = groups[dateStr];
      const dayTotal = dayTxs.reduce((sum, t) => sum + t.amount, 0);

      let dayTitle = dateStr;
      if (dateStr === todayYMD) {
        dayTitle = 'Today';
      } else if (dateStr === yesterdayYMD) {
        dayTitle = 'Yesterday';
      } else {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const d = new Date(parts[0], parts[1] - 1, parts[2]);
          dayTitle = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        }
      }

      html += `
        <div class="history-group">
          <div class="group-title">
            <span>${escapeHTML(dayTitle)}</span>
            <span>${settings.currency} ${formatNumber(dayTotal)}</span>
          </div>
          <div class="transactions-list">
            ${dayTxs.map(tx => {
              const cat = CATEGORIES.find(c => c.id === tx.categoryId) || {
                name: tx.categoryName || 'Expense',
                icon: 'home',
                color: '#3b82f6',
                bg: 'rgba(59, 130, 246, 0.15)'
              };

              const timeDisplay = formatTime12(tx.time);

              return `
                <div class="transaction-card" data-id="${tx.id}">
                  <div class="tx-left">
                    <div class="tx-icon-badge" style="background: ${cat.bg}; color: ${cat.color};">
                      ${ICONS[cat.icon] || ICONS['home']}
                    </div>
                    <div class="tx-details">
                      <div class="tx-category-title">${escapeHTML(cat.name)}</div>
                      ${tx.notes ? `<div class="tx-notes">${escapeHTML(tx.notes)}</div>` : ''}
                      <div class="tx-meta">${timeDisplay}</div>
                    </div>
                  </div>
                  <div class="tx-right">
                    <div class="tx-amount">${settings.currency} ${formatNumber(tx.amount)}</div>
                    <div class="tx-actions">
                      <button type="button" class="tx-action-btn edit" data-id="${tx.id}" title="Edit" aria-label="Edit transaction">
                        ${ICONS['edit']}
                      </button>
                      <button type="button" class="tx-action-btn delete" data-id="${tx.id}" title="Delete" aria-label="Delete transaction">
                        ${ICONS['trash']}
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // --- Analytics & Insights ---
  function updateAnalytics() {
    const totalSpendEl = document.getElementById('analytics-total-spend');
    const txCountEl = document.getElementById('analytics-tx-count');
    const dailyAvgEl = document.getElementById('analytics-daily-avg');
    const breakdownList = document.getElementById('analytics-breakdown-list');

    if (!totalSpendEl) return;

    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Filter to this month
    const thisMonthTxs = transactions.filter(t => t.date && t.date.startsWith(currentMonthPrefix));
    const totalSpend = thisMonthTxs.reduce((sum, t) => sum + t.amount, 0);

    totalSpendEl.textContent = `${settings.currency} ${formatNumber(totalSpend)}`;
    txCountEl.textContent = thisMonthTxs.length.toString();

    // Daily Average (days passed so far this month)
    const dayOfMonth = Math.max(1, now.getDate());
    const dailyAvg = totalSpend / dayOfMonth;
    dailyAvgEl.textContent = `${settings.currency} ${formatNumber(dailyAvg)}`;

    // Category breakdown
    const catTotals = {};
    CATEGORIES.forEach(c => catTotals[c.id] = { cat: c, total: 0, count: 0 });

    thisMonthTxs.forEach(tx => {
      if (catTotals[tx.categoryId]) {
        catTotals[tx.categoryId].total += tx.amount;
        catTotals[tx.categoryId].count += 1;
      }
    });

    const sortedCats = Object.values(catTotals)
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total);

    if (sortedCats.length === 0) {
      breakdownList.innerHTML = `<div class="empty-desc" style="text-align:center; padding: 16px;">No expenditures recorded for this month yet.</div>`;
      return;
    }

    breakdownList.innerHTML = sortedCats.map(item => {
      const pct = totalSpend > 0 ? ((item.total / totalSpend) * 100).toFixed(1) : 0;
      return `
        <div class="breakdown-item">
          <div class="breakdown-info">
            <span class="breakdown-cat-name">
              <span class="cat-dot" style="background: ${item.cat.color};"></span>
              ${escapeHTML(item.cat.name)}
              <span style="font-size:0.75rem; color: var(--text-muted); font-weight: normal;">(${item.count})</span>
            </span>
            <span class="breakdown-cat-amount">
              ${settings.currency} ${formatNumber(item.total)}
              <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 500;">(${pct}%)</span>
            </span>
          </div>
          <div class="breakdown-bar-bg">
            <div class="breakdown-bar-fill" style="width: ${pct}%; background: ${item.cat.color};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- CSV Export Logic ---
  function generateCSV(dateFilter = 'all') {
    let list = [...transactions];

    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthPrefix = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

    if (dateFilter === 'this_month') {
      list = list.filter(t => t.date && t.date.startsWith(currentMonthPrefix));
    } else if (dateFilter === 'prev_month') {
      list = list.filter(t => t.date && t.date.startsWith(prevMonthPrefix));
    }

    // Sort chronologically (oldest to newest for accounting)
    list.sort((a, b) => a.timestamp - b.timestamp);

    // Header columns
    const headers = ['Date', 'Time', 'Category', 'Amount', 'Currency', 'Notes', 'Transaction_ID'];
    const rows = [headers.join(',')];

    list.forEach(tx => {
      const escapeCSV = (val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const row = [
        escapeCSV(tx.date),
        escapeCSV(tx.time),
        escapeCSV(tx.categoryName),
        tx.amount.toFixed(2),
        escapeCSV(tx.currency || settings.currency),
        escapeCSV(tx.notes || ''),
        escapeCSV(tx.id)
      ];
      rows.push(row.join(','));
    });

    return rows.join('\r\n');
  }

  async function handleExportCSV() {
    const rangeSelect = document.getElementById('export-range-select');
    const filter = rangeSelect ? rangeSelect.value : 'all';

    const csvContent = generateCSV(filter);
    if (!csvContent || transactions.length === 0) {
      showToast('⚠️ No transactions to export');
      return;
    }

    const todayStr = formatDateYMD(new Date());
    const filename = `my_spending_${filter}_${todayStr}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Try Web Share API (native mobile sharing to WhatsApp, Files, Mail)
    if (navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: 'text/csv' })] })) {
      try {
        const file = new File([blob], filename, { type: 'text/csv' });
        await navigator.share({
          title: 'My Spending Export',
          text: `Expenditure export (${filename})`,
          files: [file]
        });
        showToast('✅ Export shared successfully!');
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Web Share failed, falling back to download:', err);
        } else {
          return; // user cancelled share
        }
      }
    }

    // Direct Browser Download Fallback
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`✅ CSV Export downloaded: ${filename}`);
  }

  function updateCSVPreview() {
    const container = document.getElementById('csv-preview-container');
    if (!container) return;

    const rangeSelect = document.getElementById('export-range-select');
    const filter = rangeSelect ? rangeSelect.value : 'all';

    let list = [...transactions];
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthPrefix = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

    if (filter === 'this_month') {
      list = list.filter(t => t.date && t.date.startsWith(currentMonthPrefix));
    } else if (filter === 'prev_month') {
      list = list.filter(t => t.date && t.date.startsWith(prevMonthPrefix));
    }

    const countEl = document.getElementById('export-count-badge');
    const totalEl = document.getElementById('export-total-badge');
    if (countEl) countEl.textContent = `${list.length} transactions`;
    if (totalEl) {
      const tot = list.reduce((s, t) => s + t.amount, 0);
      totalEl.textContent = `${settings.currency} ${formatNumber(tot)}`;
    }

    if (list.length === 0) {
      container.innerHTML = `<div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">No records for selected range</div>`;
      return;
    }

    // Show preview of first 5 records
    const previewItems = list.slice(0, 5);
    let tableHtml = `
      <table class="csv-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
    `;

    previewItems.forEach(tx => {
      tableHtml += `
        <tr>
          <td>${escapeHTML(tx.date)}</td>
          <td>${escapeHTML(tx.time)}</td>
          <td>${escapeHTML(tx.categoryName)}</td>
          <td>${formatNumber(tx.amount)}</td>
          <td>${escapeHTML(tx.notes || '-')}</td>
        </tr>
      `;
    });

    tableHtml += `</tbody></table>`;
    if (list.length > 5) {
      tableHtml += `<div style="padding: 6px 10px; font-size: 0.72rem; color: var(--text-muted); text-align: center;">... and ${list.length - 5} more rows</div>`;
    }

    container.innerHTML = tableHtml;
  }

  // --- Delete & Undo ---
  function deleteTransaction(txId) {
    const idx = transactions.findIndex(t => t.id === txId);
    if (idx === -1) return;

    lastDeletedTx = transactions[idx];
    transactions.splice(idx, 1);
    saveTransactions();

    triggerHaptic();
    showToast(`Deleted "${lastDeletedTx.categoryName}"`, true, 'undo_delete');
  }

  function undoLastDelete() {
    if (!lastDeletedTx) return;
    transactions.unshift(lastDeletedTx);
    saveTransactions();
    lastDeletedTx = null;
    showToast('Transaction restored!');
  }

  // --- Edit Transaction ---
  function openEditModal(txId) {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    editingTxId = txId;
    const modal = document.getElementById('edit-modal');
    const amountInput = document.getElementById('edit-amount-input');
    const categorySelect = document.getElementById('edit-category-select');
    const dateInput = document.getElementById('edit-date-input');
    const timeInput = document.getElementById('edit-time-input');
    const notesInput = document.getElementById('edit-notes-input');

    amountInput.value = tx.amount;
    dateInput.value = tx.date;
    timeInput.value = tx.time.substr(0, 5);
    notesInput.value = tx.notes || '';

    // Populate categories in modal
    categorySelect.innerHTML = CATEGORIES.map(c => `
      <option value="${c.id}" ${c.id === tx.categoryId ? 'selected' : ''}>
        ${escapeHTML(c.name)}
      </option>
    `).join('');

    modal.classList.add('active');
  }

  function saveEditedTransaction() {
    if (!editingTxId) return;
    const idx = transactions.findIndex(t => t.id === editingTxId);
    if (idx === -1) return;

    const amountInput = document.getElementById('edit-amount-input');
    const categorySelect = document.getElementById('edit-category-select');
    const dateInput = document.getElementById('edit-date-input');
    const timeInput = document.getElementById('edit-time-input');
    const notesInput = document.getElementById('edit-notes-input');

    const amt = parseFloat(amountInput.value);
    if (!amt || isNaN(amt) || amt <= 0) {
      showToast('⚠️ Please enter a valid amount');
      return;
    }

    const catObj = CATEGORIES.find(c => c.id === categorySelect.value) || CATEGORIES[0];
    const dVal = dateInput.value || transactions[idx].date;
    const tVal = (timeInput.value ? timeInput.value + ':00' : transactions[idx].time);

    const updatedDate = new Date(`${dVal}T${tVal}`);
    const ts = isNaN(updatedDate.getTime()) ? transactions[idx].timestamp : updatedDate.getTime();

    transactions[idx].amount = Math.round(amt * 100) / 100;
    transactions[idx].categoryId = catObj.id;
    transactions[idx].categoryName = catObj.name;
    transactions[idx].date = dVal;
    transactions[idx].time = tVal;
    transactions[idx].timestamp = ts;
    transactions[idx].notes = notesInput.value.trim();

    saveTransactions();
    closeEditModal();
    showToast('Transaction updated');
  }

  function closeEditModal() {
    editingTxId = null;
    const modal = document.getElementById('edit-modal');
    if (modal) modal.classList.remove('active');
  }

  // --- Month Header Summary Badge ---
  function updateMonthSummaryBadge() {
    const badge = document.getElementById('header-month-badge');
    if (!badge) return;

    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthTxs = transactions.filter(t => t.date && t.date.startsWith(currentMonthPrefix));
    const total = thisMonthTxs.reduce((s, t) => s + t.amount, 0);

    const monthName = now.toLocaleDateString(undefined, { month: 'short' });
    badge.textContent = `${monthName}: ${settings.currency} ${formatNumber(total)}`;
  }

  // --- Currency & Theme ---
  function updateCurrencyDisplay() {
    const els = document.querySelectorAll('.currency-symbol');
    els.forEach(el => el.textContent = settings.currencySymbol || settings.currency);

    const select = document.getElementById('setting-currency-select');
    if (select) select.value = settings.currency;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('theme-toggle-btn');
    if (themeIcon) {
      themeIcon.innerHTML = theme === 'dark' 
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }

  function toggleTheme() {
    settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
    applyTheme(settings.theme);
    saveSettings();
  }

  // --- JSON Backup & Restore ---
  function handleBackupJSON() {
    const payload = {
      version: 1,
      exportDate: new Date().toISOString(),
      settings: settings,
      transactions: transactions
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const filename = `my_spending_backup_${formatDateYMD(new Date())}.json`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('✅ Backup downloaded');
  }

  function handleRestoreJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.transactions && Array.isArray(data.transactions)) {
          if (confirm(`Restore ${data.transactions.length} transactions from backup? This will merge with your current entries.`)) {
            // Merge by unique ID
            const existingIds = new Set(transactions.map(t => t.id));
            let addedCount = 0;
            data.transactions.forEach(item => {
              if (!existingIds.has(item.id)) {
                transactions.push(item);
                existingIds.add(item.id);
                addedCount++;
              }
            });
            saveTransactions();
            showToast(`✅ Restored ${addedCount} transactions!`);
          }
        } else {
          showToast('⚠️ Invalid backup file structure');
        }
      } catch (err) {
        showToast('⚠️ Could not parse JSON backup');
      }
    };
    reader.readAsText(file);
  }

  function handleClearAllData() {
    if (confirm('Are you sure you want to delete ALL expenditures? This cannot be undone! Make sure to export CSV first.')) {
      if (confirm('Final confirmation: Delete all data?')) {
        transactions = [];
        saveTransactions();
        showToast('All expenditure data cleared');
      }
    }
  }

  // --- Tab Navigation ---
  function switchTab(tabId) {
    activeTab = tabId;

    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    if (tabId === 'tab-history') {
      renderTransactionsHistory();
    } else if (tabId === 'tab-analytics') {
      updateAnalytics();
    } else if (tabId === 'tab-export') {
      updateCSVPreview();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Utilities & Toast ---
  let toastTimer = null;
  function showToast(message, showUndo = false, actionId = '') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastUndo = document.getElementById('toast-undo-btn');

    if (!toast) return;

    if (toastTimer) clearTimeout(toastTimer);

    toastMsg.textContent = message;

    if (showUndo) {
      toastUndo.style.display = 'inline-block';
      toastUndo.onclick = () => {
        if (actionId === 'undo_delete') {
          undoLastDelete();
        } else {
          deleteTransaction(actionId);
          showToast('Undone!');
        }
        toast.classList.remove('show');
      };
    } else {
      toastUndo.style.display = 'none';
    }

    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  function triggerHaptic() {
    if (window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(12);
      } catch (e) {}
    }
  }

  function formatNumber(num) {
    if (isNaN(num)) return '0.00';
    return Number(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatDateYMD(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function formatTimeHMS(d) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  }

  function formatTimeHM(d) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function formatTime12(timeStr) {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --- Service Worker Registration ---
  function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => {
          console.log('SW registration skipped or failed:', err);
        });
      });
    }
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.getAttribute('data-tab'));
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Category Grid selection
    const grid = document.getElementById('category-grid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const card = e.target.closest('.category-card');
        if (card) {
          selectedCategory = card.getAttribute('data-id');
          renderCategoriesGrid();
          triggerHaptic();
        }
      });
    }

    // Quick Amount buttons
    document.querySelectorAll('.chip-btn[data-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        handleQuickAmount(parseFloat(btn.getAttribute('data-add')));
      });
    });

    const clearBtn = document.getElementById('clear-amount-btn');
    if (clearBtn) clearBtn.addEventListener('click', handleClearAmount);

    // Date selector pills
    document.getElementById('date-pill-now')?.addEventListener('click', () => {
      dateSelectionMode = 'now';
      updateDateSelectorUI();
    });
    document.getElementById('date-pill-yesterday')?.addEventListener('click', () => {
      dateSelectionMode = 'yesterday';
      updateDateSelectorUI();
    });
    document.getElementById('date-pill-custom')?.addEventListener('click', () => {
      dateSelectionMode = 'custom';
      updateDateSelectorUI();
    });

    // Add Expense Form
    const form = document.getElementById('expense-form');
    if (form) {
      form.addEventListener('submit', handleAddExpense);
    }

    // History Search
    const searchInput = document.getElementById('history-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        historySearchQuery = e.target.value;
        renderTransactionsHistory();
      });
    }

    // History Category Filter Pills
    const filterContainer = document.getElementById('filter-pills-container');
    if (filterContainer) {
      filterContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.filter-chip');
        if (chip) {
          historyCategoryFilter = chip.getAttribute('data-cat');
          renderCategoryFilters();
          renderTransactionsHistory();
        }
      });
    }

    // Transaction Action buttons (Edit & Delete delegation)
    const txContainer = document.getElementById('transactions-container');
    if (txContainer) {
      txContainer.addEventListener('click', (e) => {
        const delBtn = e.target.closest('.tx-action-btn.delete');
        if (delBtn) {
          const id = delBtn.getAttribute('data-id');
          if (confirm('Delete this expenditure entry?')) {
            deleteTransaction(id);
          }
          return;
        }

        const editBtn = e.target.closest('.tx-action-btn.edit');
        if (editBtn) {
          const id = editBtn.getAttribute('data-id');
          openEditModal(id);
          return;
        }
      });
    }

    // Edit Modal events
    document.getElementById('edit-cancel-btn')?.addEventListener('click', closeEditModal);
    document.getElementById('edit-save-btn')?.addEventListener('click', saveEditedTransaction);
    document.getElementById('edit-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'edit-modal') closeEditModal();
    });

    // Export & Settings events
    document.getElementById('btn-export-csv')?.addEventListener('click', handleExportCSV);
    document.getElementById('export-range-select')?.addEventListener('change', updateCSVPreview);

    document.getElementById('setting-currency-select')?.addEventListener('change', (e) => {
      settings.currency = e.target.value;
      settings.currencySymbol = e.target.value;
      saveSettings();
      renderTransactionsHistory();
      updateAnalytics();
      updateCSVPreview();
      updateMonthSummaryBadge();
      showToast(`Currency changed to ${settings.currency}`);
    });

    document.getElementById('btn-backup-json')?.addEventListener('click', handleBackupJSON);

    const restoreInput = document.getElementById('restore-file-input');
    document.getElementById('btn-restore-json')?.addEventListener('click', () => {
      restoreInput?.click();
    });
    if (restoreInput) {
      restoreInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleRestoreJSON(e.target.files[0]);
          e.target.value = '';
        }
      });
    }

    document.getElementById('btn-clear-all')?.addEventListener('click', handleClearAllData);

    // Install instructions helper modal toggle
    document.getElementById('btn-how-to-install')?.addEventListener('click', () => {
      document.getElementById('install-modal')?.classList.add('active');
    });
    document.getElementById('install-modal-close')?.addEventListener('click', () => {
      document.getElementById('install-modal')?.classList.remove('active');
    });
    document.getElementById('install-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'install-modal') {
        document.getElementById('install-modal')?.classList.remove('active');
      }
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
