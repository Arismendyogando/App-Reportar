import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCwGM7bcB0OrrmKuHTHhhdxAqzW439BtHE",
    authDomain: "appreportar-444402.firebaseapp.com",
    projectId: "appreportar-444402",
    storageBucket: "appreportar-444402.firebasestorage.app",
    messagingSenderId: "464111844347",
    appId: "1:464111844347:web:3a579d491f8207e573e95e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const googleSignInButton = document.getElementById('google-sign-in-button');
const signOutButton = document.getElementById('sign-out');
const userNameSpan = document.getElementById('user-name');
const contributorListDiv = document.getElementById('contributor-list');
const addContributorButton = document.getElementById('add-contributor-button');
const addContributorModal = document.getElementById('add-contributor-modal');
const closeButton = document.querySelector('.close-button');
const addContributorForm = document.getElementById('add-contributor-form');
const contributorNameBanner = document.getElementById('contributor-name-banner');
const contributorDataDisplay = document.getElementById('contributor-data-display');
const tabButtons = document.querySelectorAll('.tab-button');
const purchasesTable = document.getElementById('purchases-table');
const salesTable = document.getElementById('sales-table');
const openSettingsModalButton = document.getElementById('open-settings-modal');
const settingsModal = document.getElementById('settings-modal');
const settingsCloseButton = settingsModal?.querySelector('.close-button');
const settingsForm = document.getElementById('settings-form');
const dashboardSection = document.getElementById('dashboard-section');
const dashboardPlaceholder = document.getElementById('dashboard-placeholder');
const dashboardMetrics = document.getElementById('dashboard-metrics');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat-button');
const dashboardHistoryButton = document.getElementById('dashboard-history-button');
const dashboardIaButton = document.getElementById('dashboard-ia-button');
const dashboardHistory = document.getElementById('dashboard-history');
const dashboardIa = document.getElementById('dashboard-ia');
const shareDownloadButton = document.getElementById('share-download-button');
const themeToggle = document.getElementById('theme-toggle');

let unsubscribe;
let currentContributorId;
let hasData = false;

function setupAuthStateListener() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log('User is signed in:', user);
            userNameSpan.textContent = user.displayName;
            if (window.location.pathname.includes('profile.html')) {
                setupContributorListener(user.uid);
            } else if (window.location.pathname.includes('contributor-profile.html') || window.location.pathname.includes('data-entry.html') || window.location.pathname.includes('manual-editing.html') || window.location.pathname.includes('dashboard.html')) {
                 const urlParams = new URLSearchParams(window.location.search);
                 currentContributorId = urlParams.get('contributorId');
                 if (currentContributorId) {
                    await fetchAndDisplayContributorData(user.uid, currentContributorId);
                    if (window.location.pathname.includes('dashboard.html')) {
                        checkDataAndToggleDashboard(user.uid, currentContributorId);
                    }
                 } else {
                    window.location.href = 'profile.html';
                 }
            }
            if (window.location.pathname.includes('get-started.html')) {
                window.location.href = 'profile.html';
            }
        } else {
            console.log('User is signed out');
            userNameSpan.textContent = '';
            if (unsubscribe) {
                unsubscribe();
            }
            contributorListDiv.innerHTML = '';
            if (!window.location.pathname.includes('get-started.html')) {
                window.location.href = 'index.html';
            }
        }
    });
}

async function fetchAndDisplayContributorData(uid, contributorId) {
    const contributorRef = doc(db, 'users', uid, 'contributors', contributorId);
    const contributorSnap = await getDoc(contributorRef);
    if (contributorSnap.exists()) {
        const contributorData = contributorSnap.data();
        contributorNameBanner.textContent = contributorData.name;
        contributorDataDisplay.innerHTML = `
            <p><strong>Name:</strong> ${contributorData.name}</p>
            <p><strong>RCN:</strong> ${contributorData.rcn}</p>
            <p><strong>Activity:</strong> ${contributorData.activity}</p>
        `;
    } else {
        console.log('Contributor not found');
        window.location.href = 'profile.html';
    }
}

async function checkDataAndToggleDashboard(uid, contributorId) {
    const dataEntryRef = collection(db, 'users', uid, 'contributors', contributorId, 'dataEntries');
    const dataEntrySnap = await getDocs(dataEntryRef);
    if (dataEntrySnap.size > 0) {
        hasData = true;
        dashboardPlaceholder.style.display = 'none';
        dashboardMetrics.style.display = 'block';
        // Fetch and display dashboard data here
        fetchAndDisplayDashboardData(uid, contributorId);
    } else {
        hasData = false;
        dashboardPlaceholder.style.display = 'block';
        dashboardMetrics.style.display = 'none';
    }
}

async function fetchAndDisplayDashboardData(uid, contributorId) {
    // Placeholder for fetching and displaying dashboard data
    const revenueMetric = document.getElementById('revenue-metric');
    const expensesMetric = document.getElementById('expenses-metric');
    const profitMetric = document.getElementById('profit-metric');
    revenueMetric.textContent = '$1000';
    expensesMetric.textContent = '$500';
    profitMetric.textContent = '$500';
}

function setupContributorListener(uid) {
    const contributorsRef = collection(db, 'users', uid, 'contributors');
    unsubscribe = onSnapshot(contributorsRef, (snapshot) => {
        contributorListDiv.innerHTML = '';
        snapshot.forEach((doc) => {
            const contributor = doc.data();
            const contributorCard = document.createElement('div');
            contributorCard.classList.add('contributor-card');
             contributorCard.innerHTML = `
                <h3>${contributor.name}</h3>
                <p>RCN: ${contributor.rcn}</p>
                <p>Activity: ${contributor.activity}</p>
                <button class="view-contributor-button" data-id="${doc.id}">View</button>
                <button class="delete-contributor-button" data-id="${doc.id}">Delete</button>
            `;
            contributorListDiv.appendChild(contributorCard);
        });
        setupViewButtons();
        setupDeleteButtons();
    });
}

function setupViewButtons() {
    const viewButtons = document.querySelectorAll('.view-contributor-button');
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const contributorId = e.target.getAttribute('data-id');
            window.location.href = `contributor-profile.html?contributorId=${contributorId}`;
        });
    });
}

function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-contributor-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const contributorId = e.target.getAttribute('data-id');
            const user = auth.currentUser;
            if (user) {
                const contributorRef = doc(db, 'users', user.uid, 'contributors', contributorId);
                await deleteDoc(contributorRef);
            }
        });
    });
}

async function signInWithGoogle() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error('Error signing in with Google:', error);
    }
}

async function signOutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

function openModal() {
    addContributorModal.style.display = 'block';
}

function closeModal() {
    addContributorModal.style.display = 'none';
}

async function addContributor(e) {
    e.preventDefault();
    const name = document.getElementById('contributor-name').value;
    const rcn = document.getElementById('contributor-rcn').value;
    const activity = document.getElementById('contributor-activity').value;
    const user = auth.currentUser;
    if (user) {
        const contributorsRef = collection(db, 'users', user.uid, 'contributors');
        const newContributorRef = doc(contributorsRef);
        await setDoc(newContributorRef, {
            name: name,
            rcn: rcn,
            activity: activity
        });
        closeModal();
        addContributorForm.reset();
    }
}

function handleTabClick(e) {
    const tab = e.target.getAttribute('data-tab');
    tabButtons.forEach(button => button.classList.remove('active'));
    e.target.classList.add('active');
    if (tab === 'purchases') {
        purchasesTable.classList.add('active');
        salesTable.classList.remove('active');
    } else if (tab === 'sales') {
         salesTable.classList.add('active');
        purchasesTable.classList.remove('active');
    }
}

function openSettingsModal() {
    settingsModal.style.display = 'block';
}

function closeSettingsModal() {
    settingsModal.style.display = 'none';
}

function handleSettingsSubmit(e) {
    e.preventDefault();
    const columnOrder = document.getElementById('column-order').value;
    const fieldNames = document.getElementById('field-names').value;
    console.log('Column Order:', columnOrder);
    console.log('Field Names:', fieldNames);
    closeSettingsModal();
}

function handleChatSubmit() {
    const message = chatInput.value;
    if (message.trim() !== '') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message');
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function handleDashboardSubsectionClick(e) {
    const subsection = e.target.id;
    if (subsection === 'dashboard-history-button') {
        dashboardHistory.style.display = 'block';
        dashboardIa.style.display = 'none';
    } else if (subsection === 'dashboard-ia-button') {
        dashboardIa.style.display = 'block';
        dashboardHistory.style.display = 'none';
    }
}

function handleShareDownloadClick() {
    // Placeholder for share/download functionality
    console.log('Share/Download Reports');
}

if (googleSignInButton) {
    googleSignInButton.addEventListener('click', signInWithGoogle);
}

if (signOutButton) {
    signOutButton.addEventListener('click', signOutUser);
}

if (addContributorButton) {
    addContributorButton.addEventListener('click', openModal);
}

if (closeButton) {
    closeButton.addEventListener('click', closeModal);
}

if (addContributorForm) {
    addContributorForm.addEventListener('submit', addContributor);
}

tabButtons.forEach(button => {
    button.addEventListener('click', handleTabClick);
});

if (openSettingsModalButton) {
    openSettingsModalButton.addEventListener('click', openSettingsModal);
}

if (settingsCloseButton) {
    settingsCloseButton.addEventListener('click', closeSettingsModal);
}

if (settingsForm) {
    settingsForm.addEventListener('submit', handleSettingsSubmit);
}

if (sendChatButton) {
    sendChatButton.addEventListener('click', handleChatSubmit);
}

if (dashboardHistoryButton) {
    dashboardHistoryButton.addEventListener('click', handleDashboardSubsectionClick);
}

if (dashboardIaButton) {
    dashboardIaButton.addEventListener('click', handleDashboardSubsectionClick);
}

if (shareDownloadButton) {
    shareDownloadButton.addEventListener('click', handleShareDownloadClick);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });
}

setupAuthStateListener();
