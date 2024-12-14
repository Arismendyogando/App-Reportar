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
const languageSelector = document.getElementById('language-selector');

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

function updateContent(lang) {
    if (lang === 'es') {
        document.querySelector('header h1').textContent = 'App Reportar Ai';
        document.querySelector('nav ul li:nth-child(1) a').textContent = 'Inicio';
        document.querySelector('nav ul li:nth-child(2) a').textContent = 'Servicios';
        document.querySelector('nav ul li:nth-child(3) a').textContent = 'Acerca de';
        document.querySelector('nav ul li:nth-child(4) a').textContent = 'Contacto';
        document.querySelector('.hero h2').textContent = 'Plataforma de Análisis de Datos con IA';
        document.querySelector('.hero p').textContent = 'Empoderando a los profesionales con información inteligente.';
        document.querySelector('.hero a').textContent = 'Comenzar';
        document.querySelector('.services h2').textContent = 'Nuestros Servicios';
        document.querySelector('.service:nth-child(1) h3').textContent = 'Análisis de Datos Contables';
        document.querySelector('.service:nth-child(1) p').textContent = 'Analice sus datos contables con información impulsada por IA.';
        document.querySelector('.service:nth-child(2) h3').textContent = 'Análisis de Datos de Ventas';
        document.querySelector('.service:nth-child(2) p').textContent = 'Obtenga una visión clara de su rendimiento de ventas.';
        document.querySelector('.service:nth-child(3) h3').textContent = 'Análisis de Datos de Marketing';
        document.querySelector('.service:nth-child(3) p').textContent = 'Optimice sus campañas de marketing con decisiones basadas en datos.';
         document.querySelector('.target-audience h2').textContent = 'Público Objetivo';
        document.querySelector('.contact h2').textContent = 'Contáctenos';
        document.querySelector('.contact-options a:nth-child(1)').innerHTML = '<i class="fas fa-comment-dots"></i> Chatea con nosotros';
        document.querySelector('.contact-options a:nth-child(2)').innerHTML = '<i class="fas fa-phone"></i> Llámanos';
        document.querySelector('#contact-form .form-group:nth-child(1) label').textContent = 'Nombre';
        document.querySelector('#contact-form .form-group:nth-child(2) label').textContent = 'Correo Electrónico';
        document.querySelector('#contact-form .form-group:nth-child(3) label').textContent = 'Teléfono';
        document.querySelector('#contact-form .form-group:nth-child(4) label').textContent = 'Mensaje';
        document.querySelector('#contact-form button').textContent = 'Enviar';
        document.querySelector('footer p').textContent = '© 2024 App Reportar Ai. Todos los derechos reservados.';
    } else {
        document.querySelector('header h1').textContent = 'App Reportar Ai';
        document.querySelector('nav ul li:nth-child(1) a').textContent = 'Home';
        document.querySelector('nav ul li:nth-child(2) a').textContent = 'Services';
        document.querySelector('nav ul li:nth-child(3) a').textContent = 'About';
        document.querySelector('nav ul li:nth-child(4) a').textContent = 'Contact';
        document.querySelector('.hero h2').textContent = 'Data Analysis Platform with AI';
        document.querySelector('.hero p').textContent = 'Empowering professionals with intelligent insights.';
        document.querySelector('.hero a').textContent = 'Get Started';
         document.querySelector('.services h2').textContent = 'Our Services';
        document.querySelector('.service:nth-child(1) h3').textContent = 'Accounting Data Analysis';
        document.querySelector('.service:nth-child(1) p').textContent = 'Analyze your accounting data with AI-powered insights.';
        document.querySelector('.service:nth-child(2) h3').textContent = 'Sales Data Analysis';
        document.querySelector('.service:nth-child(2) p').textContent = 'Get a clear view of your sales performance.';
        document.querySelector('.service:nth-child(3) h3').textContent = 'Marketing Data Analysis';
        document.querySelector('.service:nth-child(3) p').textContent = 'Optimize your marketing campaigns with data-driven decisions.';
        document.querySelector('.target-audience h2').textContent = 'Target Audience';
        document.querySelector('.contact h2').textContent = 'Contact Us';
        document.querySelector('.contact-options a:nth-child(1)').innerHTML = '<i class="fas fa-comment-dots"></i> Chat with us';
        document.querySelector('.contact-options a:nth-child(2)').innerHTML = '<i class="fas fa-phone"></i> Call us';
        document.querySelector('#contact-form .form-group:nth-child(1) label').textContent = 'Name';
        document.querySelector('#contact-form .form-group:nth-child(2) label').textContent = 'Email';
        document.querySelector('#contact-form .form-group:nth-child(3) label').textContent = 'Phone';
        document.querySelector('#contact-form .form-group:nth-child(4) label').textContent = 'Message';
        document.querySelector('#contact-form button').textContent = 'Send';
        document.querySelector('footer p').textContent = '&copy; 2024 App Reportar Ai. All rights reserved.';
    }
}

if (languageSelector) {
    languageSelector.addEventListener('change', (e) => {
        const selectedLanguage = e.target.value;
        updateContent(selectedLanguage);
    });
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });
}

setupAuthStateListener();
