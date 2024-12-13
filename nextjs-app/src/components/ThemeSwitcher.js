'use client';

import { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
    const [language, setLanguage] = useState('en');
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.documentElement.lang = language;
        document.body.classList.toggle('dark-theme', theme === 'dark');
    }, [language, theme]);

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
        // You would typically use a translation library or fetch translated content here
        console.log('Language selected:', event.target.value);
        // For this example, we'll just log the selected language
        if (event.target.value === 'es') {
            document.documentElement.lang = 'es';
            // Example of changing text content (replace with your actual translations)
            document.querySelector('h1').textContent = 'App Reportar Ai';
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
            document.querySelector('.service:nth-child(2) p').textContent = 'Obtenga una visión clara del rendimiento de sus ventas.';
            document.querySelector('.service:nth-child(3) h3').textContent = 'Análisis de Datos de Marketing';
            document.querySelector('.service:nth-child(3) p').textContent = 'Optimice sus campañas de marketing con decisiones basadas en datos.';
            document.querySelector('.target-audience h2').textContent = 'Público Objetivo';
            document.querySelector('.contact h2').textContent = 'Contáctenos';
            document.querySelector('.contact-icons a:nth-child(1)').innerHTML = '<i class="fas fa-comment-dots"></i> Chatea con nosotros';
            document.querySelector('.contact-icons a:nth-child(2)').innerHTML = '<i class="fas fa-phone"></i> Llámanos';
            document.querySelector('footer p').textContent = '© 2024 App Reportar Ai. Todos los derechos reservados.';
        } else {
            document.documentElement.lang = 'en';
            document.querySelector('h1').textContent = 'App Reportar Ai';
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
            document.querySelector('.contact-icons a:nth-child(1)').innerHTML = '<i class="fas fa-comment-dots"></i> Chat with us';
            document.querySelector('.contact-icons a:nth-child(2)').innerHTML = '<i class="fas fa-phone"></i> Call us';
            document.querySelector('footer p').textContent = '&copy; 2024 App Reportar Ai. All rights reserved.';
        }
    };

    const handleThemeToggle = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="controls">
            <select id="language-selector" value={language} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="es">Español</option>
            </select>
            <button id="theme-toggle" onClick={handleThemeToggle}>
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
        </div>
    );
};

export default ThemeSwitcher;
