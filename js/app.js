/**
 * My Spending - Mobile Expense Tracker
 * Features: 13 Custom Categories, Date & Time Tracking, CSV Export, Analytics, PWA Offline Support
 */

(() => {
  'use strict';

  // --- Constants & Config ---
  const STORAGE_KEY = 'my_spending_transactions_v1';
  const SETTINGS_KEY = 'my_spending_settings_v1';
  const ALERTS_KEY = 'my_spending_alerted_thresholds_v1';
  const PROFILE_STORAGE_KEY = 'my_spending_device_profile_v1';
  const DEFAULT_HOUSEHOLD_ID = 'amjad_family';

  // Google Firebase Configuration (Project: spending-tracker-6db2d)
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCZV_am4fczF_wwHI8XtZKepX7uS8kBLl8",
    authDomain: "spending-tracker-6db2d.firebaseapp.com",
    projectId: "spending-tracker-6db2d",
    storageBucket: "spending-tracker-6db2d.firebasestorage.app",
    messagingSenderId: "322899616916",
    appId: "1:322899616916:web:c91fc0eb6e19e9533ec081",
    measurementId: "G-0VXK48K8Z8"
  };

  // Family Members
  const FAMILY_MEMBERS = [
    { id: 'dad', name: 'Dad', avatar: '👨', color: '#3b82f6' },
    { id: 'mom', name: 'Mom', avatar: '👩', color: '#ec4899' },
    { id: 'son', name: 'Son', avatar: '👦', color: '#10b981' }
  ];

  // Default Monthly Budgets for the 13 Categories (can be edited by user anytime)
  const DEFAULT_BUDGETS = {
    'rent': 3500,
    'bills': 600,
    'groceries': 2000,
    'school': 3000,
    'petrol': 500,
    'services': 300,
    'medicine': 250,
    'pakistan': 1500,
    'car-installment': 1200,
    'jeddah-groceries': 800,
    'kids': 500,
    'maria': 1000,
    'iqama': 800,
    'others': 500
  };

  // The 14 Categories requested by User
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
    },
    {
      id: 'others',
      name: 'Others',
      icon: 'more-horizontal',
      color: '#64748b',
      bg: 'rgba(100, 116, 139, 0.16)',
      glow: 'rgba(100, 116, 139, 0.35)'
    }
  ];

  // SVG Icons collection
  const ICONS = {
    'more-horizontal': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/><circle cx="5" cy="12" r="2" fill="currentColor"/></svg>`,
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
  let historyMemberFilter = 'all'; // 'all', 'dad', 'mom', 'son'
  let deviceProfile = 'dad'; // active member using this device
  let selectedSpentBy = 'dad'; // member selected on add form
  let editSelectedSpentBy = 'dad'; // member selected in edit modal
  let lastDeletedTx = null;
  let editingTxId = null;
  let editingBudgetId = null;
  let alertedThresholds = {};
  let stagedImportTransactions = [];
  let db = null;
  let firestoreUnsubscribe = null;
  let firestoreBudgetsUnsubscribe = null;
  let isSyncingFromCloud = false;
  let cloudSyncStatus = 'offline';

  let settings = {
    currency: 'SAR',
    currencySymbol: 'SAR',
    theme: 'dark',
    budgets: Object.assign({}, DEFAULT_BUDGETS),
    pushNotifications: false,
    householdId: DEFAULT_HOUSEHOLD_ID
  };

  // --- Initializer ---
  function init() {
    loadSettings();
    loadDeviceProfile();
    loadTransactions();
    loadAlertedThresholds();
    applyTheme(settings.theme);
    setupEventListeners();
    renderCategoriesGrid();
    renderCategoryFilters();
    updateDateSelectorUI();
    renderTransactionsHistory();
    updateAnalytics();
    updateCSVPreview();
    updateMonthSummaryBadge();
    updateNotificationStatusUI();
    initFirebase();
    registerServiceWorker();
  }

  // --- Member Profiles & UI Helpers ---
  function getMemberInfo(memberId) {
    return FAMILY_MEMBERS.find(m => m.id === memberId) || FAMILY_MEMBERS[0];
  }

  function loadDeviceProfile() {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved && FAMILY_MEMBERS.some(m => m.id === saved)) {
        deviceProfile = saved;
      }
    } catch (e) {}
    selectedSpentBy = deviceProfile;
    updateMemberSelectorsUI();
  }

  function setDeviceProfile(memberId) {
    if (!FAMILY_MEMBERS.some(m => m.id === memberId)) return;
    deviceProfile = memberId;
    selectedSpentBy = memberId;
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, memberId);
    } catch (e) {}
    updateMemberSelectorsUI();
    const mem = getMemberInfo(memberId);
    showToast(`✅ Profile set to ${mem.avatar} ${mem.name} for this phone`);
  }

  function updateMemberSelectorsUI() {
    // Form member pills
    document.querySelectorAll('#form-member-selector .member-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-member') === selectedSpentBy);
    });

    // Settings profile pills
    document.querySelectorAll('#settings-profile-selector .member-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-profile') === deviceProfile);
    });

    // History filter chips
    document.querySelectorAll('#member-filter-row .member-filter-chip').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-member') === historyMemberFilter);
    });

    // Edit modal member pills
    document.querySelectorAll('#edit-member-selector .member-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-edit-member') === editSelectedSpentBy);
    });
  }

  // --- Storage ---
  function loadSettings() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        settings = Object.assign(settings, parsed);
        // Ensure all 13 categories have at least default budgets
        settings.budgets = Object.assign({}, DEFAULT_BUDGETS, settings.budgets || {});
      }
    } catch (e) {
      console.error('Error loading settings', e);
    }
    updateCurrencyDisplay();
  }

  function saveSettings(skipCloudSync = false) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
    updateCurrencyDisplay();
    if (!skipCloudSync && db) {
      uploadBudgetsToCloud(settings.budgets);
    }
  }

  function loadAlertedThresholds() {
    try {
      const saved = localStorage.getItem(ALERTS_KEY);
      if (saved) {
        alertedThresholds = JSON.parse(saved);
      }
    } catch (e) {
      alertedThresholds = {};
    }
  }

  function saveAlertedThresholds() {
    try {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(alertedThresholds));
    } catch (e) {}
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

  // ==========================================================================
  // FIREBASE CLOUD FIRESTORE REAL-TIME SYNC
  // ==========================================================================

  function initFirebase() {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK not loaded, using offline local storage');
      updateCloudStatusUI('offline', 'Offline');
      return;
    }

    try {
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      db = firebase.firestore();

      // Enable offline persistence in browser
      db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore multi-tab persistence active');
        } else {
          console.warn('Firestore persistence status:', err.code);
        }
      });

      updateCloudStatusUI('syncing', 'Connecting...');
      setupFirestoreListeners();
    } catch (err) {
      console.error('Firebase initialization error:', err);
      updateCloudStatusUI('offline', 'Sync Error');
    }
  }

  function updateCloudStatusUI(status, label) {
    cloudSyncStatus = status;
    const headerPill = document.getElementById('cloud-status-pill');
    const headerText = document.getElementById('cloud-status-text');
    const settingsBadge = document.getElementById('settings-cloud-badge');
    const settingsText = document.getElementById('settings-cloud-text');

    const statusClass = status === 'connected' ? 'connected' : status === 'syncing' ? 'syncing' : 'offline';
    const headerLabel = (status === 'connected' ? 'Live' : status === 'syncing' ? 'Syncing' : 'Offline');
    const fullText = label || (status === 'connected' ? 'Live Cloud Sync' : status === 'syncing' ? 'Syncing...' : 'Offline');

    if (headerPill) {
      headerPill.className = `cloud-status-pill ${statusClass}`;
    }
    if (headerText) headerText.textContent = headerLabel;
    if (settingsBadge) {
      settingsBadge.className = `cloud-status-pill ${statusClass}`;
    }
    if (settingsText) settingsText.textContent = fullText;
  }

  function setupFirestoreListeners() {
    if (!db) return;
    const householdId = settings.householdId || DEFAULT_HOUSEHOLD_ID;

    // 1. Listen for real-time transactions across all family devices
    const txCollection = db.collection('households').doc(householdId).collection('transactions');

    firestoreUnsubscribe = txCollection.onSnapshot((snapshot) => {
      isSyncingFromCloud = true;
      const cloudTxs = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.id) {
          cloudTxs.push(data);
        }
      });

      if (cloudTxs.length > 0) {
        // If we had local transactions not in cloud, upload them to cloud
        const cloudIds = new Set(cloudTxs.map(t => t.id));
        let missingUploadCount = 0;
        transactions.forEach((localTx) => {
          if (!cloudIds.has(localTx.id)) {
            uploadTransactionToCloud(localTx);
            cloudTxs.push(localTx);
            missingUploadCount++;
          }
        });

        // Sort descending by timestamp
        cloudTxs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        transactions = cloudTxs;

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        } catch (e) {}

        renderTransactionsHistory();
        updateAnalytics();
        updateCSVPreview();
        updateMonthSummaryBadge();
        updateCloudStatusUI('connected', 'Live Sync');

        if (missingUploadCount > 0) {
          showToast(`☁️ Synced ${missingUploadCount} offline expenditures to family cloud!`);
        }
      } else if (transactions.length > 0) {
        // Cloud is empty but we have local records: upload all existing transactions to cloud!
        uploadAllLocalTransactionsToCloud();
      } else {
        updateCloudStatusUI('connected', 'Live Sync');
      }

      isSyncingFromCloud = false;
    }, (err) => {
      console.warn('Firestore snapshot error:', err);
      updateCloudStatusUI('offline', 'Offline');
      isSyncingFromCloud = false;
    });

    // 2. Listen for shared category budgets
    const budgetDoc = db.collection('households').doc(householdId).collection('settings').doc('budgets');
    firestoreBudgetsUnsubscribe = budgetDoc.onSnapshot((doc) => {
      if (doc.exists) {
        const cloudBudgets = doc.data();
        if (cloudBudgets) {
          settings.budgets = Object.assign({}, DEFAULT_BUDGETS, cloudBudgets);
          saveSettings(true); // skip re-uploading
          updateAnalytics();
        }
      }
    }, (err) => {
      console.warn('Firestore budget snapshot error:', err);
    });
  }

  function uploadTransactionToCloud(tx) {
    if (!db) return;
    const householdId = settings.householdId || DEFAULT_HOUSEHOLD_ID;
    updateCloudStatusUI('syncing', 'Syncing...');

    // Ensure member metadata exists
    if (!tx.spentBy) {
      const mem = getMemberInfo(deviceProfile || 'dad');
      tx.spentBy = mem.id;
      tx.spentByName = mem.name;
      tx.spentByAvatar = mem.avatar;
    }

    db.collection('households').doc(householdId).collection('transactions').doc(tx.id).set(tx)
      .then(() => {
        updateCloudStatusUI('connected', 'Live Sync');
      })
      .catch((err) => {
        console.warn('Firestore upload tx error:', err);
        updateCloudStatusUI('offline', 'Offline (Queued)');
      });
  }

  function deleteTransactionFromCloud(txId) {
    if (!db) return;
    const householdId = settings.householdId || DEFAULT_HOUSEHOLD_ID;
    updateCloudStatusUI('syncing', 'Syncing...');
    db.collection('households').doc(householdId).collection('transactions').doc(txId).delete()
      .then(() => {
        updateCloudStatusUI('connected', 'Live Sync');
      })
      .catch((err) => {
        console.warn('Firestore delete tx error:', err);
        updateCloudStatusUI('offline', 'Offline (Queued)');
      });
  }

  function uploadBudgetsToCloud(budgets) {
    if (!db) return;
    const householdId = settings.householdId || DEFAULT_HOUSEHOLD_ID;
    db.collection('households').doc(householdId).collection('settings').doc('budgets').set(budgets)
      .catch((err) => console.warn('Firestore budget upload error:', err));
  }

  function uploadAllLocalTransactionsToCloud() {
    if (!db || transactions.length === 0) return;
    const householdId = settings.householdId || DEFAULT_HOUSEHOLD_ID;
    updateCloudStatusUI('syncing', 'Uploading...');
    const batch = db.batch();
    const col = db.collection('households').doc(householdId).collection('transactions');

    transactions.forEach((tx) => {
      if (!tx.spentBy) {
        const mem = getMemberInfo(deviceProfile || 'dad');
        tx.spentBy = mem.id;
        tx.spentByName = mem.name;
        tx.spentByAvatar = mem.avatar;
      }
      const ref = col.doc(tx.id);
      batch.set(ref, tx);
    });

    batch.commit()
      .then(() => {
        updateCloudStatusUI('connected', 'Live Sync');
        showToast('☁️ All expenditures synced to family cloud!');
      })
      .catch((err) => {
        console.warn('Batch upload error:', err);
        updateCloudStatusUI('offline', 'Offline (Queued)');
      });
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
    const memInfo = getMemberInfo(selectedSpentBy || deviceProfile || 'dad');

    // Calculate current category spend before adding this transaction
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const oldSpent = transactions
      .filter(t => t.categoryId === categoryObj.id && t.date && t.date.startsWith(currentMonthPrefix))
      .reduce((sum, t) => sum + t.amount, 0);

    const newTransaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      amount: Math.round(amount * 100) / 100,
      currency: settings.currency,
      categoryId: categoryObj.id,
      categoryName: categoryObj.name,
      spentBy: memInfo.id,
      spentByName: memInfo.name,
      spentByAvatar: memInfo.avatar,
      notes: notesInput.value.trim(),
      date: formatDateYMD(timestampObj),
      time: formatTimeHMS(timestampObj),
      timestamp: timestampObj.getTime()
    };

    // Prepend to list (newest first)
    transactions.unshift(newTransaction);
    saveTransactions();

    // Upload to Firebase Cloud
    if (db) {
      uploadTransactionToCloud(newTransaction);
    }

    // Check if new transaction falls in this month to check threshold
    if (newTransaction.date && newTransaction.date.startsWith(currentMonthPrefix)) {
      const newSpent = oldSpent + newTransaction.amount;
      checkBudgetThresholds(categoryObj.id, oldSpent, newSpent);
    }

    // Reset Form
    amountInput.value = '';
    notesInput.value = '';
    dateSelectionMode = 'now';
    updateDateSelectorUI();

    triggerHaptic();
    showToast(`✅ ${memInfo.avatar} Added ${settings.currency} ${formatNumber(newTransaction.amount)} in ${categoryObj.name}`, true, newTransaction.id);
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

    // Filter by Family Member
    if (historyMemberFilter !== 'all') {
      filtered = filtered.filter(tx => (tx.spentBy || 'dad') === historyMemberFilter);
    }

    // Filter by Search Query
    if (historySearchQuery) {
      const q = historySearchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        (tx.notes && tx.notes.toLowerCase().includes(q)) ||
        (tx.categoryName && tx.categoryName.toLowerCase().includes(q)) ||
        (tx.spentByName && tx.spentByName.toLowerCase().includes(q)) ||
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
              const mem = getMemberInfo(tx.spentBy || 'dad');

              return `
                <div class="transaction-card" data-id="${tx.id}">
                  <div class="tx-left">
                    <div class="tx-icon-badge" style="background: ${cat.bg}; color: ${cat.color};">
                      ${ICONS[cat.icon] || ICONS['home']}
                    </div>
                    <div class="tx-details">
                      <div class="tx-category-title">${escapeHTML(cat.name)}</div>
                      ${tx.notes ? `<div class="tx-notes">${escapeHTML(tx.notes)}</div>` : ''}
                      <div class="tx-meta">
                        ${timeDisplay} • <span class="tx-member-pill member-${mem.id}">${mem.avatar} ${escapeHTML(mem.name)}</span>
                      </div>
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

  // --- Analytics & Insights with Budget Dual-Bars (Spent & Remaining) ---
  function updateAnalytics() {
    const txCountEl = document.getElementById('analytics-tx-count');
    const dailyAvgEl = document.getElementById('analytics-daily-avg');
    const breakdownList = document.getElementById('analytics-breakdown-list');
    const alertsContainer = document.getElementById('budget-alerts-section');

    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthName = now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    // Update month title on overall budget card
    const overallTitle = document.getElementById('overall-budget-title');
    if (overallTitle) overallTitle.textContent = `${monthName} Budget`;

    // Filter transactions to this month
    const thisMonthTxs = transactions.filter(t => t.date && t.date.startsWith(currentMonthPrefix));
    const totalSpend = thisMonthTxs.reduce((sum, t) => sum + t.amount, 0);

    // Key metrics
    if (txCountEl) txCountEl.textContent = thisMonthTxs.length.toString();
    const dayOfMonth = Math.max(1, now.getDate());
    const dailyAvg = totalSpend / dayOfMonth;
    if (dailyAvgEl) dailyAvgEl.textContent = `${settings.currency} ${formatNumber(dailyAvg)}`;

    // Calculate totals for all 13 categories
    const catData = {};
    let totalMonthlyBudget = 0;

    CATEGORIES.forEach(c => {
      const budget = Number(settings.budgets[c.id]) || 0;
      totalMonthlyBudget += budget;
      catData[c.id] = {
        cat: c,
        spent: 0,
        budget: budget,
        count: 0
      };
    });

    thisMonthTxs.forEach(tx => {
      if (catData[tx.categoryId]) {
        catData[tx.categoryId].spent += tx.amount;
        catData[tx.categoryId].count += 1;
      }
    });

    // --- 1. Overall Monthly Budget Card ---
    const totalRemaining = totalMonthlyBudget - totalSpend;
    const overallTotalBudgetEl = document.getElementById('overall-total-budget');
    const overallTotalSpentEl = document.getElementById('overall-total-spent');
    const overallTotalRemainingEl = document.getElementById('overall-total-remaining');
    const overallSpentSeg = document.getElementById('overall-spent-segment');
    const overallRemSeg = document.getElementById('overall-remaining-segment');
    const overallSpentLabel = document.getElementById('overall-spent-label');
    const overallRemLabel = document.getElementById('overall-remaining-label');
    const overallPctText = document.getElementById('overall-pct-spent-text');
    const overallRemText = document.getElementById('overall-remaining-text');
    const overallUnifiedBar = document.getElementById('overall-unified-bar');

    if (overallTotalBudgetEl) overallTotalBudgetEl.textContent = `${settings.currency} ${formatNumber(totalMonthlyBudget)}`;
    if (overallTotalSpentEl) overallTotalSpentEl.textContent = `${settings.currency} ${formatNumber(totalSpend)}`;
    
    if (overallTotalRemainingEl) {
      if (totalRemaining >= 0) {
        overallTotalRemainingEl.textContent = `${settings.currency} ${formatNumber(totalRemaining)}`;
        overallTotalRemainingEl.className = 'stat-val positive';
      } else {
        overallTotalRemainingEl.textContent = `-${settings.currency} ${formatNumber(Math.abs(totalRemaining))}`;
        overallTotalRemainingEl.className = 'stat-val negative';
      }
    }

    if (overallUnifiedBar) {
      const overallPct = totalMonthlyBudget > 0 ? (totalSpend / totalMonthlyBudget) * 100 : 0;
      const isOverallOver = totalSpend > totalMonthlyBudget && totalMonthlyBudget > 0;

      if (isOverallOver) {
        overallUnifiedBar.classList.add('over-budget');
        overallSpentSeg.style.width = '100%';
        overallSpentLabel.textContent = `${overallPct.toFixed(1)}% (Over)`;
        if (overallRemSeg) overallRemSeg.style.display = 'none';
        if (overallPctText) overallPctText.textContent = `${overallPct.toFixed(1)}% of total budget spent`;
        if (overallRemText) {
          overallRemText.textContent = `Over by ${settings.currency} ${formatNumber(Math.abs(totalRemaining))}`;
          overallRemText.className = 'label-over-highlight';
        }
      } else {
        overallUnifiedBar.classList.remove('over-budget');
        const spentWidth = Math.min(100, Math.max(0, overallPct));
        const remWidth = Math.max(0, 100 - spentWidth);

        overallSpentSeg.style.width = `${spentWidth}%`;
        overallSpentLabel.textContent = `${spentWidth.toFixed(0)}%`;

        if (overallRemSeg) {
          overallRemSeg.style.display = 'flex';
          overallRemSeg.style.width = `${remWidth}%`;
          overallRemLabel.textContent = `${settings.currency} ${formatNumber(totalRemaining)} left`;
        }

        if (overallPctText) overallPctText.textContent = `${overallPct.toFixed(1)}% of total budget spent`;
        if (overallRemText) {
          overallRemText.textContent = `${settings.currency} ${formatNumber(totalRemaining)} remaining`;
          overallRemText.className = 'label-remaining-highlight';
        }

        // Color coding for overall spent
        overallSpentSeg.className = 'bar-segment-spent ' + getThresholdColorClass(overallPct);
      }
    }

    // --- 2. Active Alerts Banner (50%, 75%, 90%, 100% reached) ---
    const activeAlerts = [];
    Object.values(catData).forEach(item => {
      if (item.budget > 0) {
        const pct = (item.spent / item.budget) * 100;
        if (pct >= 100) {
          activeAlerts.push({ ...item, pct, level: 100, severity: 4, msg: `Exceeded budget limit! (${pct.toFixed(0)}%)` });
        } else if (pct >= 90) {
          activeAlerts.push({ ...item, pct, level: 90, severity: 3, msg: `Critical: 90% reached! Only ${settings.currency} ${formatNumber(item.budget - item.spent)} left.` });
        } else if (pct >= 75) {
          activeAlerts.push({ ...item, pct, level: 75, severity: 2, msg: `Warning: 75% of budget used (${pct.toFixed(0)}%).` });
        } else if (pct >= 50) {
          activeAlerts.push({ ...item, pct, level: 50, severity: 1, msg: `Notice: 50% milestone reached.` });
        }
      }
    });

    if (alertsContainer) {
      if (activeAlerts.length > 0) {
        // Sort highest severity first
        activeAlerts.sort((a, b) => b.severity - a.severity);
        alertsContainer.style.display = 'flex';
        alertsContainer.innerHTML = `
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; display: flex; align-items: center; gap: 6px;">
            <span>⚠️ Active Budget Alerts (${activeAlerts.length})</span>
          </div>
          ${activeAlerts.map(a => `
            <div class="budget-alert-card warning-${a.level}" data-cat="${a.cat.id}">
              <div class="alert-left">
                <span class="alert-icon">${a.level >= 100 ? '🛑' : a.level >= 90 ? '🚨' : a.level >= 75 ? '⚠️' : 'ℹ️'}</span>
                <div class="alert-texts">
                  <span class="alert-title">${escapeHTML(a.cat.name)}: ${a.pct.toFixed(0)}% reached</span>
                  <span class="alert-desc">${a.msg}</span>
                </div>
              </div>
              <button type="button" class="btn-quick-edit-budget" data-cat="${a.cat.id}">Adjust</button>
            </div>
          `).join('')}
        `;
      } else {
        alertsContainer.style.display = 'none';
        alertsContainer.innerHTML = '';
      }
    }

    // --- 3. Category Budgets & Spending List (Dual Bars) ---
    if (!breakdownList) return;

    // Sort categories: highest percentage first, or highest spent
    const allCategoryItems = Object.values(catData).sort((a, b) => {
      const pctA = a.budget > 0 ? a.spent / a.budget : (a.spent > 0 ? 0.01 : 0);
      const pctB = b.budget > 0 ? b.spent / b.budget : (b.spent > 0 ? 0.01 : 0);
      if (pctB !== pctA) return pctB - pctA;
      return b.spent - a.spent;
    });

    breakdownList.innerHTML = allCategoryItems.map(item => {
      const budget = item.budget;
      const spent = item.spent;
      const remaining = budget - spent;
      const hasBudget = budget > 0;
      const pct = hasBudget ? (spent / budget) * 100 : 0;
      const isOver = hasBudget && spent > budget;

      // Threshold Badge & Color
      let badgeHtml = '';
      let colorClass = 'color-normal';

      if (!hasBudget) {
        badgeHtml = `<span style="font-size:0.68rem; color: var(--text-muted); font-weight: 600;">NO BUDGET</span>`;
      } else if (isOver) {
        badgeHtml = `<span class="threshold-badge level-100">100% EXCEEDED</span>`;
        colorClass = 'color-100';
      } else if (pct >= 90) {
        badgeHtml = `<span class="threshold-badge level-90">90% CRITICAL</span>`;
        colorClass = 'color-90';
      } else if (pct >= 75) {
        badgeHtml = `<span class="threshold-badge level-75">75% WARNING</span>`;
        colorClass = 'color-75';
      } else if (pct >= 50) {
        badgeHtml = `<span class="threshold-badge level-50">50% REACHED</span>`;
        colorClass = 'color-50';
      } else {
        badgeHtml = `<span class="threshold-badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">${pct.toFixed(0)}% USED</span>`;
        colorClass = 'color-normal';
      }

      // Bar Widths
      const spentWidth = hasBudget ? Math.min(100, Math.max(0, pct)) : (spent > 0 ? 100 : 0);
      const remWidth = hasBudget && !isOver ? Math.max(0, 100 - spentWidth) : 0;

      return `
        <div class="category-budget-item" data-cat="${item.cat.id}">
          <div class="cat-budget-header">
            <div class="cat-budget-left">
              <div class="cat-dot" style="background: ${item.cat.color};"></div>
              <span class="cat-budget-name">
                ${escapeHTML(item.cat.name)}
                ${badgeHtml}
              </span>
            </div>
            <div class="cat-budget-amounts">
              <span class="cat-budget-spent">${settings.currency} ${formatNumber(spent)}</span>
              <span class="cat-budget-total"> / ${hasBudget ? `${settings.currency} ${formatNumber(budget)}` : 'No budget'}</span>
            </div>
          </div>

          <!-- The Same Bar showing Spending & Remaining -->
          <div class="unified-bar-wrapper">
            <div class="unified-bar-track ${isOver ? 'over-budget' : ''}">
              <div class="bar-segment-spent ${colorClass}" style="width: ${spentWidth}%;">
                <span>${spent > 0 ? `${formatNumber(spent)} (${pct.toFixed(0)}%)` : ''}</span>
              </div>
              ${(hasBudget && !isOver && remaining > 0) ? `
                <div class="bar-segment-remaining" style="width: ${remWidth}%;">
                  <span>Rem: ${formatNumber(remaining)}</span>
                </div>
              ` : ''}
            </div>

            <div class="unified-bar-labels">
              <div>
                ${isOver ? `
                  <span class="label-over-highlight">⚠️ Over budget by ${settings.currency} ${formatNumber(Math.abs(remaining))}</span>
                ` : hasBudget ? `
                  <span class="label-remaining-highlight">${settings.currency} ${formatNumber(remaining)} remaining</span>
                  <span style="color: var(--text-muted); font-size: 0.7rem;">(${((remaining / budget) * 100).toFixed(0)}% left)</span>
                ` : `
                  <span style="color: var(--text-muted);">Set a monthly target to track remaining balance</span>
                `}
              </div>
              <button type="button" class="btn-quick-edit-budget" data-cat="${item.cat.id}" title="Edit budget for ${escapeHTML(item.cat.name)}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                </svg>
                ${hasBudget ? 'Edit' : '+ Set'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function getThresholdColorClass(pct) {
    if (pct >= 100) return 'color-100';
    if (pct >= 90) return 'color-90';
    if (pct >= 75) return 'color-75';
    if (pct >= 50) return 'color-50';
    return 'color-normal';
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
    const headers = ['Date', 'Time', 'Category', 'Spent_By', 'Amount', 'Currency', 'Notes', 'Transaction_ID'];
    const rows = [headers.join(',')];

    list.forEach(tx => {
      const escapeCSV = (val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const mem = getMemberInfo(tx.spentBy || 'dad');

      const row = [
        escapeCSV(tx.date),
        escapeCSV(tx.time),
        escapeCSV(tx.categoryName),
        escapeCSV(mem.name),
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

  // ==========================================================================
  // CSV IMPORT ENGINE (RFC 4180 Compliant Parser & Importer)
  // ==========================================================================

  function parseCSVText(text) {
    if (!text) return [];
    // Strip BOM if present
    if (text.charCodeAt(0) === 0xFEFF) {
      text = text.slice(1);
    }

    const rows = [];
    let currentRow = [];
    let currentVal = '';
    let inQuotes = false;
    let i = 0;
    const len = text.length;

    while (i < len) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            // Escaped quote: "" -> "
            currentVal += '"';
            i += 2;
            continue;
          } else {
            // Closing quote
            inQuotes = false;
            i++;
            continue;
          }
        } else {
          currentVal += char;
          i++;
          continue;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
          i++;
          continue;
        } else if (char === ',') {
          currentRow.push(currentVal.trim());
          currentVal = '';
          i++;
          continue;
        } else if (char === '\r') {
          if (nextChar === '\n') {
            i++; // skip \r\n
          }
          currentRow.push(currentVal.trim());
          rows.push(currentRow);
          currentRow = [];
          currentVal = '';
          i++;
          continue;
        } else if (char === '\n') {
          currentRow.push(currentVal.trim());
          rows.push(currentRow);
          currentRow = [];
          currentVal = '';
          i++;
          continue;
        } else {
          currentVal += char;
          i++;
          continue;
        }
      }
    }

    // Push final field / row
    if (currentVal.length > 0 || currentRow.length > 0) {
      currentRow.push(currentVal.trim());
      rows.push(currentRow);
    }

    // Filter out any purely empty rows
    return rows.filter(row => row.some(cell => cell.length > 0));
  }

  function processImportCSV(file) {
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsedRows = parseCSVText(text);

        if (!parsedRows || parsedRows.length === 0) {
          showToast('⚠️ CSV file is empty');
          return;
        }

        // Identify header row
        let headerIdx = -1;
        let colMap = {
          date: 0,
          time: 1,
          category: 2,
          amount: 3,
          currency: 4,
          notes: 5,
          id: 6
        };

        // Check first 3 rows for potential header keywords
        for (let r = 0; r < Math.min(3, parsedRows.length); r++) {
          const lowerRow = parsedRows[r].map(c => c.toLowerCase());
          const hasDate = lowerRow.some(c => c.includes('date'));
          const hasAmount = lowerRow.some(c => c.includes('amount') || c.includes('spend') || c.includes('total') || c.includes('cost'));
          const hasCat = lowerRow.some(c => c.includes('cat'));

          if (hasDate || hasAmount || hasCat) {
            headerIdx = r;
            // Map columns
            lowerRow.forEach((cell, idx) => {
              if (cell.includes('date')) colMap.date = idx;
              else if (cell.includes('time')) colMap.time = idx;
              else if (cell.includes('cat')) colMap.category = idx;
              else if (cell.includes('spent') || cell.includes('member') || cell.includes('user') || cell.includes('who') || cell.includes('person')) colMap.spentBy = idx;
              else if (cell.includes('amount') || cell.includes('spend') || cell.includes('cost') || cell.includes('total')) colMap.amount = idx;
              else if (cell.includes('curr')) colMap.currency = idx;
              else if (cell.includes('note') || cell.includes('desc') || cell.includes('memo')) colMap.notes = idx;
              else if (cell.includes('id')) colMap.id = idx;
            });
            break;
          }
        }

        const dataRows = headerIdx >= 0 ? parsedRows.slice(headerIdx + 1) : parsedRows;
        const validEntries = [];
        let totalImportAmount = 0;

        dataRows.forEach((row, idx) => {
          if (!row || row.length === 0) return;

          // Parse Amount
          let rawAmount = row[colMap.amount];
          if (!rawAmount) return;
          // Clean currency signs, spaces, and commas
          rawAmount = String(rawAmount).replace(/[^0-9.-]/g, '');
          const amount = Math.abs(parseFloat(rawAmount));
          if (isNaN(amount) || amount <= 0) return;

          // Parse Date
          let rawDate = row[colMap.date] || '';
          let dateYMD = formatDateYMD(new Date());

          if (rawDate) {
            // Normalize separators
            const cleanDate = rawDate.trim().replace(/\//g, '-').replace(/\./g, '-');
            const parts = cleanDate.split('-');
            if (parts.length === 3) {
              if (parts[0].length === 4) {
                // YYYY-MM-DD
                dateYMD = `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
              } else if (parts[2].length === 4) {
                // DD-MM-YYYY or MM-DD-YYYY
                dateYMD = `${parts[2]}-${String(parts[1]).padStart(2, '0')}-${String(parts[0]).padStart(2, '0')}`;
              }
            }
          }

          // Parse Time
          let rawTime = row[colMap.time] || '';
          let timeHMS = formatTimeHMS(new Date());
          if (rawTime && rawTime.includes(':')) {
            const tParts = rawTime.trim().split(':');
            const hh = String(parseInt(tParts[0], 10) || 0).padStart(2, '0');
            const mm = String(parseInt(tParts[1], 10) || 0).padStart(2, '0');
            const ss = tParts[2] ? String(parseInt(tParts[2], 10) || 0).padStart(2, '0') : '00';
            timeHMS = `${hh}:${mm}:${ss}`;
          }

          // Parse Category
          const rawCat = (row[colMap.category] || '').trim();
          let matchedCat = CATEGORIES.find(c => c.name.toLowerCase() === rawCat.toLowerCase());

          if (!matchedCat && rawCat) {
            // Fuzzy check keywords
            const low = rawCat.toLowerCase();
            if (low.includes('grocer') || low.includes('food') || low.includes('supermarket')) matchedCat = CATEGORIES.find(c => c.id === 'groceries');
            else if (low.includes('fuel') || low.includes('petrol') || low.includes('gas')) matchedCat = CATEGORIES.find(c => c.id === 'petrol');
            else if (low.includes('rent') || low.includes('house')) matchedCat = CATEGORIES.find(c => c.id === 'rent');
            else if (low.includes('bill') || low.includes('electric') || low.includes('water')) matchedCat = CATEGORIES.find(c => c.id === 'bills');
            else if (low.includes('med') || low.includes('pharm') || low.includes('doctor')) matchedCat = CATEGORIES.find(c => c.id === 'medicine');
            else if (low.includes('school') || low.includes('educat') || low.includes('tuition')) matchedCat = CATEGORIES.find(c => c.id === 'school');
            else if (low.includes('car') || low.includes('auto')) matchedCat = CATEGORIES.find(c => c.id === 'car-installment');
            else if (low.includes('pakistan')) matchedCat = CATEGORIES.find(c => c.id === 'pakistan');
            else if (low.includes('jeddah')) matchedCat = CATEGORIES.find(c => c.id === 'jeddah-groceries');
            else if (low.includes('kid') || low.includes('child') || low.includes('toy')) matchedCat = CATEGORIES.find(c => c.id === 'kids');
            else if (low.includes('maria')) matchedCat = CATEGORIES.find(c => c.id === 'maria');
            else if (low.includes('iqama') || low.includes('visa')) matchedCat = CATEGORIES.find(c => c.id === 'iqama');
            else if (low.includes('service') || low.includes('repair') || low.includes('maint')) matchedCat = CATEGORIES.find(c => c.id === 'services');
            else if (low.includes('other') || low.includes('misc') || low.includes('extra') || low.includes('general')) matchedCat = CATEGORIES.find(c => c.id === 'others');
          }

          if (!matchedCat) {
            matchedCat = CATEGORIES.find(c => c.id === 'others') || CATEGORIES[0]; // fallback
          }

          // Parse Notes & ID
          const notes = (row[colMap.notes] || '').trim();
          const existingId = (row[colMap.id] || '').trim();
          const txId = existingId && existingId.length > 3 
            ? existingId 
            : 'tx_imp_' + Date.now() + '_' + idx + '_' + Math.random().toString(36).substr(2, 4);

          // Parse Spent By
          let mem = getMemberInfo(deviceProfile || 'dad');
          if (colMap.spentBy !== undefined && row[colMap.spentBy]) {
            const rawM = String(row[colMap.spentBy]).trim().toLowerCase();
            if (rawM.includes('mom') || rawM.includes('wife')) mem = getMemberInfo('mom');
            else if (rawM.includes('son') || rawM.includes('kid') || rawM.includes('child')) mem = getMemberInfo('son');
            else if (rawM.includes('dad') || rawM.includes('father') || rawM.includes('husband')) mem = getMemberInfo('dad');
          }

          const dtObj = new Date(`${dateYMD}T${timeHMS}`);
          const timestamp = isNaN(dtObj.getTime()) ? Date.now() : dtObj.getTime();

          validEntries.push({
            id: txId,
            amount: Math.round(amount * 100) / 100,
            currency: (row[colMap.currency] || settings.currency).trim(),
            categoryId: matchedCat.id,
            categoryName: matchedCat.name,
            spentBy: mem.id,
            spentByName: mem.name,
            spentByAvatar: mem.avatar,
            notes: notes,
            date: dateYMD,
            time: timeHMS,
            timestamp: timestamp
          });

          totalImportAmount += amount;
        });

        if (validEntries.length === 0) {
          showToast('⚠️ No valid expenditure rows could be parsed from CSV');
          return;
        }

        // Stage for confirmation
        stagedImportTransactions = validEntries;
        openImportPreviewModal(validEntries, totalImportAmount);

      } catch (err) {
        console.error('CSV Import Error', err);
        showToast('⚠️ Could not parse CSV file');
      }
    };

    reader.readAsText(file);
  }

  function openImportPreviewModal(entries, totalAmount) {
    const modal = document.getElementById('import-csv-modal');
    const totalBadge = document.getElementById('import-modal-total-badge');
    const countBadge = document.getElementById('import-modal-count-badge');
    const previewContainer = document.getElementById('import-csv-preview-container');
    const desc = document.getElementById('import-modal-desc');

    if (!modal) return;

    if (totalBadge) totalBadge.textContent = `${settings.currency} ${formatNumber(totalAmount)}`;
    if (countBadge) countBadge.textContent = `${entries.length} expenditures ready`;
    if (desc) desc.textContent = `Found ${entries.length} expenditures totaling ${settings.currency} ${formatNumber(totalAmount)} in the uploaded CSV.`;

    // Render preview table of up to first 5 rows
    const previewRows = entries.slice(0, 5);
    let html = `
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

    previewRows.forEach(tx => {
      html += `
        <tr>
          <td>${escapeHTML(tx.date)}</td>
          <td>${escapeHTML(tx.time)}</td>
          <td>${escapeHTML(tx.categoryName)}</td>
          <td>${formatNumber(tx.amount)}</td>
          <td>${escapeHTML(tx.notes || '-')}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    if (entries.length > 5) {
      html += `<div style="padding: 6px 10px; font-size: 0.72rem; color: var(--text-muted); text-align: center;">... and ${entries.length - 5} more rows</div>`;
    }

    if (previewContainer) previewContainer.innerHTML = html;
    modal.classList.add('active');
  }

  function confirmCSVImport() {
    if (!stagedImportTransactions || stagedImportTransactions.length === 0) return;

    const replaceMode = document.getElementById('import-mode-replace')?.checked;
    const count = stagedImportTransactions.length;

    if (replaceMode) {
      if (confirm(`Are you sure you want to REPLACE all current expenditures with the ${count} items from this CSV?`)) {
        transactions = [...stagedImportTransactions];
      } else {
        return;
      }
    } else {
      // Merge mode: skip duplicate IDs
      const existingIds = new Set(transactions.map(t => t.id));
      stagedImportTransactions.forEach(tx => {
        if (!existingIds.has(tx.id)) {
          transactions.push(tx);
          existingIds.add(tx.id);
        }
      });
    }

    // Sort chronologically desc
    transactions.sort((a, b) => b.timestamp - a.timestamp);
    saveTransactions();

    // Check budget thresholds for any categories impacted in the current month
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    CATEGORIES.forEach(cat => {
      const budget = Number(settings.budgets[cat.id]) || 0;
      if (budget > 0) {
        const catSpent = transactions
          .filter(t => t.categoryId === cat.id && t.date && t.date.startsWith(currentMonthPrefix))
          .reduce((sum, t) => sum + t.amount, 0);
        checkBudgetThresholds(cat.id, 0, catSpent);
      }
    });

    closeImportCSVModal();
    triggerHaptic();
    showToast(`✅ Successfully imported ${count} expenditures from CSV!`);

    // Upload to Firebase Cloud
    if (db) {
      uploadAllLocalTransactionsToCloud();
    }

    // Switch to History tab so user immediately sees their imported data
    switchTab('tab-history');
  }

  function closeImportCSVModal() {
    stagedImportTransactions = [];
    const modal = document.getElementById('import-csv-modal');
    if (modal) modal.classList.remove('active');
    const fileInput = document.getElementById('import-csv-file-input');
    if (fileInput) fileInput.value = '';
  }

  // --- Delete & Undo ---
  function deleteTransaction(txId) {
    const idx = transactions.findIndex(t => t.id === txId);
    if (idx === -1) return;

    lastDeletedTx = transactions[idx];
    transactions.splice(idx, 1);
    saveTransactions();

    if (db) {
      deleteTransactionFromCloud(txId);
    }

    triggerHaptic();
    showToast(`Deleted "${lastDeletedTx.categoryName}"`, true, 'undo_delete');
  }

  function undoLastDelete() {
    if (!lastDeletedTx) return;
    transactions.unshift(lastDeletedTx);
    saveTransactions();

    if (db) {
      uploadTransactionToCloud(lastDeletedTx);
    }

    lastDeletedTx = null;
    showToast('Transaction restored!');
  }

  // --- Edit Transaction ---
  function openEditModal(txId) {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    editingTxId = txId;
    editSelectedSpentBy = tx.spentBy || 'dad';

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

    // Update edit member selector
    document.querySelectorAll('#edit-member-selector .member-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-edit-member') === editSelectedSpentBy);
    });

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
    const memInfo = getMemberInfo(editSelectedSpentBy);
    const dVal = dateInput.value || transactions[idx].date;
    const tVal = (timeInput.value ? timeInput.value + ':00' : transactions[idx].time);

    const updatedDate = new Date(`${dVal}T${tVal}`);
    const ts = isNaN(updatedDate.getTime()) ? transactions[idx].timestamp : updatedDate.getTime();

    transactions[idx].amount = Math.round(amt * 100) / 100;
    transactions[idx].categoryId = catObj.id;
    transactions[idx].categoryName = catObj.name;
    transactions[idx].spentBy = memInfo.id;
    transactions[idx].spentByName = memInfo.name;
    transactions[idx].spentByAvatar = memInfo.avatar;
    transactions[idx].date = dVal;
    transactions[idx].time = tVal;
    transactions[idx].timestamp = ts;
    transactions[idx].notes = notesInput.value.trim();

    saveTransactions();

    if (db) {
      uploadTransactionToCloud(transactions[idx]);
    }

    closeEditModal();
    showToast('Transaction updated');

    // Recalculate spend to verify thresholds
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    if (dVal && dVal.startsWith(currentMonthPrefix)) {
      const catSpent = transactions
        .filter(t => t.categoryId === catObj.id && t.date && t.date.startsWith(currentMonthPrefix))
        .reduce((sum, t) => sum + t.amount, 0);
      checkBudgetThresholds(catObj.id, 0, catSpent);
    }
  }

  function closeEditModal() {
    editingTxId = null;
    const modal = document.getElementById('edit-modal');
    if (modal) modal.classList.remove('active');
  }

  // ==========================================================================
  // BUDGET ALERTS & NOTIFICATIONS (50%, 75%, 90%, 100%)
  // ==========================================================================

  // Synthesize clean audio chimes using Web Audio API (Zero external assets needed)
  function playBudgetAlertChime(level) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const freqs = level >= 100 
        ? [880, 698, 880] // Urgent 100% warning chord
        : level >= 90 
        ? [784, 880]     // Critical 90% double pulse
        : level >= 75 
        ? [659, 784]     // Warning 75% prompt
        : [523, 659];    // 50% Milestone chime

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = level >= 90 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (idx + 1) * 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + (idx + 1) * 0.18);
      });
    } catch (e) {
      console.log('Audio chime not available or user interaction needed:', e);
    }
  }

  function checkBudgetThresholds(categoryId, oldSpent, newSpent) {
    const budget = Number(settings.budgets[categoryId]) || 0;
    if (budget <= 0) return; // No budget set for this category

    const categoryObj = CATEGORIES.find(c => c.id === categoryId);
    if (!categoryObj) return;

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const oldPct = (oldSpent / budget) * 100;
    const newPct = (newSpent / budget) * 100;

    const thresholds = [50, 75, 90, 100];
    let triggeredThreshold = null;

    thresholds.forEach(t => {
      const alertKey = `${currentMonthKey}_${categoryId}_${t}`;
      if (oldPct < t && newPct >= t && !alertedThresholds[alertKey]) {
        triggeredThreshold = t;
        alertedThresholds[alertKey] = true;
      }
    });

    if (triggeredThreshold !== null) {
      saveAlertedThresholds();
      fireBudgetAlert(categoryObj, triggeredThreshold, newSpent, budget);
    }
  }

  function fireBudgetAlert(categoryObj, threshold, spent, budget) {
    const remaining = Math.max(0, budget - spent);
    const isOver = spent > budget;

    // 1. Play Audio Chime & Trigger Haptics
    playBudgetAlertChime(threshold);
    if (window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(threshold >= 90 ? [120, 60, 120, 60, 150] : [100, 50, 100]);
      } catch (e) {}
    }

    // 2. Trigger Real Native Browser Push Notification (if permitted)
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const title = threshold >= 100 
          ? `🛑 100% Budget Reached: ${categoryObj.name}`
          : threshold >= 90
          ? `🚨 90% Critical Alert: ${categoryObj.name}`
          : threshold >= 75
          ? `⚠️ 75% Budget Warning: ${categoryObj.name}`
          : `ℹ️ 50% Milestone: ${categoryObj.name}`;

        const body = isOver 
          ? `Exceeded monthly budget! Spent: ${settings.currency} ${formatNumber(spent)} of ${settings.currency} ${formatNumber(budget)}.`
          : `Spent: ${settings.currency} ${formatNumber(spent)} of ${settings.currency} ${formatNumber(budget)}. Only ${settings.currency} ${formatNumber(remaining)} remaining.`;

        new Notification(title, {
          body: body,
          icon: './icons/icon-192.png',
          badge: './icons/icon-192.png',
          tag: `budget_${categoryObj.id}_${threshold}`
        });
      } catch (err) {
        console.warn('System push notification error:', err);
      }
    }

    // 3. Open High-Impact In-App Alert Modal
    openBudgetAlertModal(categoryObj, threshold, spent, budget, remaining);
  }

  function openBudgetAlertModal(categoryObj, threshold, spent, budget, remaining) {
    const modal = document.getElementById('budget-alert-modal');
    const badge = document.getElementById('alert-popup-badge');
    const title = document.getElementById('modal-alert-title');
    const msg = document.getElementById('alert-popup-message');
    const spentTxt = document.getElementById('alert-popup-spent-txt');
    const remTxt = document.getElementById('alert-popup-rem-txt');
    const barSpent = document.getElementById('alert-popup-bar-spent');
    const barRem = document.getElementById('alert-popup-bar-rem');
    const barSpentTxt = document.getElementById('alert-popup-bar-spent-txt');
    const barRemTxt = document.getElementById('alert-popup-bar-rem-txt');
    const barTrack = document.getElementById('alert-popup-bar');

    if (!modal) return;

    badge.className = `alert-popup-icon-badge badge-${threshold}`;

    if (threshold >= 100) {
      badge.textContent = '🛑';
      title.textContent = `100% Limit Reached: ${categoryObj.name}`;
      msg.innerHTML = `You have reached <b>100%</b> of your monthly budget for <b>${escapeHTML(categoryObj.name)}</b>. Total spent: <b>${settings.currency} ${formatNumber(spent)}</b> of ${settings.currency} ${formatNumber(budget)}.`;
    } else if (threshold >= 90) {
      badge.textContent = '🚨';
      title.textContent = `90% Critical Alert: ${categoryObj.name}`;
      msg.innerHTML = `You have reached <b>90%</b> of your <b>${escapeHTML(categoryObj.name)}</b> budget! Only <b>${settings.currency} ${formatNumber(remaining)}</b> remains for this month.`;
    } else if (threshold >= 75) {
      badge.textContent = '⚠️';
      title.textContent = `75% Budget Warning: ${categoryObj.name}`;
      msg.innerHTML = `You have reached <b>75%</b> of your <b>${escapeHTML(categoryObj.name)}</b> monthly budget. Remaining balance: <b>${settings.currency} ${formatNumber(remaining)}</b>.`;
    } else {
      badge.textContent = 'ℹ️';
      title.textContent = `50% Milestone: ${categoryObj.name}`;
      msg.innerHTML = `You have used half (<b>50%</b>) of your <b>${escapeHTML(categoryObj.name)}</b> budget (<b>${settings.currency} ${formatNumber(spent)}</b> / ${settings.currency} ${formatNumber(budget)}).`;
    }

    const pct = Math.min(100, (spent / budget) * 100);
    const remPct = Math.max(0, 100 - pct);

    if (spentTxt) spentTxt.textContent = `Spent: ${settings.currency} ${formatNumber(spent)}`;
    if (remTxt) {
      if (spent > budget) {
        remTxt.textContent = `Over by ${settings.currency} ${formatNumber(spent - budget)}`;
        remTxt.className = 'label-over-highlight';
      } else {
        remTxt.textContent = `Remaining: ${settings.currency} ${formatNumber(remaining)}`;
        remTxt.className = 'label-remaining-highlight';
      }
    }

    if (barSpent) {
      barSpent.style.width = `${pct}%`;
      barSpent.className = 'bar-segment-spent ' + getThresholdColorClass(pct);
    }
    if (barSpentTxt) barSpentTxt.textContent = `${pct.toFixed(0)}%`;

    if (barRem) {
      barRem.style.width = `${remPct}%`;
      barRem.style.display = (spent > budget) ? 'none' : 'flex';
    }
    if (barRemTxt) barRemTxt.textContent = `${settings.currency} ${formatNumber(remaining)}`;

    modal.classList.add('active');
  }

  // --- Budget Manager Modal (All 13 Categories) ---
  function openBudgetManagerModal() {
    const modal = document.getElementById('budget-manager-modal');
    const list = document.getElementById('budget-manager-list');
    const totalSumEl = document.getElementById('budget-modal-total-sum');

    if (!modal || !list) return;

    let currentTotal = 0;
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    list.innerHTML = CATEGORIES.map(cat => {
      const bVal = Number(settings.budgets[cat.id]) || 0;
      currentTotal += bVal;

      const catSpent = transactions
        .filter(t => t.categoryId === cat.id && t.date && t.date.startsWith(currentMonthPrefix))
        .reduce((sum, t) => sum + t.amount, 0);

      return `
        <div class="budget-input-row" data-cat="${cat.id}">
          <div class="budget-input-label">
            <span class="cat-dot" style="background: ${cat.color};"></span>
            <div>
              <div style="font-size: 0.9rem; font-weight: 700;">${escapeHTML(cat.name)}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Spent: ${settings.currency} ${formatNumber(catSpent)}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary);">${settings.currency}</span>
            <input type="number" 
                   class="budget-number-input" 
                   data-cat="${cat.id}" 
                   value="${bVal}" 
                   min="0" 
                   step="any"
                   placeholder="0">
          </div>
        </div>
      `;
    }).join('');

    if (totalSumEl) totalSumEl.textContent = `Total: ${settings.currency} ${formatNumber(currentTotal)}`;

    // Live update total sum when user modifies any input
    list.querySelectorAll('.budget-number-input').forEach(input => {
      input.addEventListener('input', () => {
        let sum = 0;
        list.querySelectorAll('.budget-number-input').forEach(i => {
          sum += parseFloat(i.value) || 0;
        });
        if (totalSumEl) totalSumEl.textContent = `Total: ${settings.currency} ${formatNumber(sum)}`;
      });
    });

    modal.classList.add('active');
  }

  function saveAllBudgets() {
    const list = document.getElementById('budget-manager-list');
    if (!list) return;

    list.querySelectorAll('.budget-number-input').forEach(input => {
      const catId = input.getAttribute('data-cat');
      const val = parseFloat(input.value) || 0;
      settings.budgets[catId] = Math.max(0, val);
    });

    saveSettings();
    updateAnalytics();
    closeBudgetManagerModal();
    showToast('✅ All category budgets updated');
  }

  function closeBudgetManagerModal() {
    document.getElementById('budget-manager-modal')?.classList.remove('active');
  }

  // --- Quick Single-Category Budget Modal ---
  function openQuickBudgetModal(categoryId) {
    const modal = document.getElementById('quick-budget-modal');
    const title = document.getElementById('modal-quick-budget-title');
    const desc = document.getElementById('quick-budget-desc');
    const input = document.getElementById('quick-budget-amount-input');
    const spendEl = document.getElementById('quick-budget-current-spend');

    const catObj = CATEGORIES.find(c => c.id === categoryId);
    if (!modal || !catObj) return;

    editingBudgetId = categoryId;
    title.textContent = `Budget: ${catObj.name}`;
    desc.textContent = `Set monthly budget limit for ${catObj.name}. Alerts trigger at 50%, 75%, 90%, and 100%.`;

    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const catSpent = transactions
      .filter(t => t.categoryId === categoryId && t.date && t.date.startsWith(currentMonthPrefix))
      .reduce((sum, t) => sum + t.amount, 0);

    input.value = settings.budgets[categoryId] || 0;
    if (spendEl) spendEl.textContent = `Spent this month: ${settings.currency} ${formatNumber(catSpent)}`;

    modal.classList.add('active');
    setTimeout(() => input.focus(), 150);
  }

  function saveQuickBudget() {
    if (!editingBudgetId) return;
    const input = document.getElementById('quick-budget-amount-input');
    const val = parseFloat(input.value) || 0;

    settings.budgets[editingBudgetId] = Math.max(0, val);
    saveSettings();
    updateAnalytics();
    closeQuickBudgetModal();

    const catObj = CATEGORIES.find(c => c.id === editingBudgetId);
    showToast(`✅ Budget for ${catObj ? catObj.name : ''} set to ${settings.currency} ${formatNumber(val)}`);
    editingBudgetId = null;
  }

  function closeQuickBudgetModal() {
    editingBudgetId = null;
    document.getElementById('quick-budget-modal')?.classList.remove('active');
  }

  // --- Push Notifications Settings Helper ---
  function updateNotificationStatusUI() {
    const statusText = document.getElementById('push-notification-status-text');
    const btn = document.getElementById('btn-enable-push-notifications');
    if (!statusText || !btn) return;

    if (!('Notification' in window)) {
      statusText.textContent = 'In-app audio & modal alerts active';
      btn.style.display = 'none';
      return;
    }

    if (Notification.permission === 'granted') {
      statusText.textContent = 'Push, Audio & Modal alerts active';
      btn.textContent = 'Active ✅';
      btn.style.opacity = '0.7';
    } else if (Notification.permission === 'denied') {
      statusText.textContent = 'Push blocked in browser (In-app audio active)';
      btn.textContent = 'Blocked';
    } else {
      statusText.textContent = 'In-app audio active (Enable for phone push)';
      btn.textContent = 'Enable Push';
    }
  }

  async function handleEnablePushNotifications() {
    if (!('Notification' in window)) {
      showToast('⚠️ Notifications not supported on this browser (in-app alerts will be used)');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      updateNotificationStatusUI();
      if (permission === 'granted') {
        showToast('✅ Push notifications enabled for budget alerts (50%, 75%, 90%, 100%)!');
        new Notification('My Spending Budget Alerts', {
          body: 'Budget alerts enabled! You will be notified when spending reaches 50%, 75%, 90%, and 100%.',
          icon: './icons/icon-192.png'
        });
      } else {
        showToast('Push permission was not granted (in-app alerts will still trigger)');
      }
    } catch (e) {
      console.warn('Notification permission error', e);
    }
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

    // History Member Filter Row
    const memberFilterContainer = document.getElementById('member-filter-row');
    if (memberFilterContainer) {
      memberFilterContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.member-filter-chip');
        if (chip) {
          historyMemberFilter = chip.getAttribute('data-member') || 'all';
          updateMemberSelectorsUI();
          renderTransactionsHistory();
        }
      });
    }

    // Form Spent By Member Selector
    const formMemberSelector = document.getElementById('form-member-selector');
    if (formMemberSelector) {
      formMemberSelector.addEventListener('click', (e) => {
        const pill = e.target.closest('.member-pill');
        if (pill) {
          selectedSpentBy = pill.getAttribute('data-member') || 'dad';
          updateMemberSelectorsUI();
          triggerHaptic();
        }
      });
    }

    // Settings Profile Selector ("Who is using this phone?")
    const settingsProfileSelector = document.getElementById('settings-profile-selector');
    if (settingsProfileSelector) {
      settingsProfileSelector.addEventListener('click', (e) => {
        const pill = e.target.closest('.member-pill');
        if (pill) {
          const profileId = pill.getAttribute('data-profile');
          if (profileId) {
            setDeviceProfile(profileId);
            triggerHaptic();
          }
        }
      });
    }

    // Edit Modal Member Selector
    const editMemberSelector = document.getElementById('edit-member-selector');
    if (editMemberSelector) {
      editMemberSelector.addEventListener('click', (e) => {
        const pill = e.target.closest('.member-pill');
        if (pill) {
          editSelectedSpentBy = pill.getAttribute('data-edit-member') || 'dad';
          document.querySelectorAll('#edit-member-selector .member-pill').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-edit-member') === editSelectedSpentBy);
          });
          triggerHaptic();
        }
      });
    }

    // Force Cloud Sync Button
    document.getElementById('btn-force-sync')?.addEventListener('click', () => {
      triggerHaptic();
      if (!db) {
        showToast('⚠️ Connecting to Firebase...');
        initFirebase();
        return;
      }
      uploadAllLocalTransactionsToCloud();
      uploadBudgetsToCloud(settings.budgets);
      showToast('☁️ Synced all expenditures and budgets with Family Cloud!');
    });

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

    // CSV Import Events
    const importFileInput = document.getElementById('import-csv-file-input');
    document.getElementById('btn-trigger-import-csv')?.addEventListener('click', () => {
      importFileInput?.click();
    });
    if (importFileInput) {
      importFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          processImportCSV(e.target.files[0]);
        }
      });
    }
    document.getElementById('import-csv-confirm-btn')?.addEventListener('click', confirmCSVImport);
    document.getElementById('import-csv-cancel-btn')?.addEventListener('click', closeImportCSVModal);
    document.getElementById('import-csv-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'import-csv-modal') closeImportCSVModal();
    });

    // Budget Manager Events
    document.getElementById('btn-open-budget-manager')?.addEventListener('click', openBudgetManagerModal);
    document.getElementById('btn-quick-set-budgets')?.addEventListener('click', openBudgetManagerModal);
    document.getElementById('btn-settings-open-budgets')?.addEventListener('click', openBudgetManagerModal);
    document.getElementById('budget-modal-cancel-btn')?.addEventListener('click', closeBudgetManagerModal);
    document.getElementById('budget-modal-save-btn')?.addEventListener('click', saveAllBudgets);
    document.getElementById('budget-manager-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'budget-manager-modal') closeBudgetManagerModal();
    });

    // Single Category Quick Budget Modal Events
    document.getElementById('quick-budget-cancel-btn')?.addEventListener('click', closeQuickBudgetModal);
    document.getElementById('quick-budget-save-btn')?.addEventListener('click', saveQuickBudget);
    document.getElementById('quick-budget-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'quick-budget-modal') closeQuickBudgetModal();
    });

    // Delegated click for "Edit Budget" buttons across analytics cards and alerts
    document.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-quick-edit-budget');
      if (editBtn) {
        const catId = editBtn.getAttribute('data-cat');
        if (catId) openQuickBudgetModal(catId);
      }
    });

    // Budget Alert Modal Close
    document.getElementById('budget-alert-modal-close')?.addEventListener('click', () => {
      document.getElementById('budget-alert-modal')?.classList.remove('active');
    });
    document.getElementById('budget-alert-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'budget-alert-modal') {
        document.getElementById('budget-alert-modal')?.classList.remove('active');
      }
    });

    // Push Notifications Toggle
    document.getElementById('btn-enable-push-notifications')?.addEventListener('click', handleEnablePushNotifications);

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
