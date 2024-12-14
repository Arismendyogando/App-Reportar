import './globals.css';
import SpreadsheetForm from './components/SpreadsheetForm';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Home() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData);
        console.log('Contact form data:', formValues);
        // Here you would handle the form submission, e.g., sending the data to a server
    };

  return (
    <main>
        <section className="hero" id="hero">
            <div className="container">
                <h2>Data Analysis Platform with AI</h2>
                <p>Empowering professionals with intelligent insights.</p>
                <a href="#" className="button">Get Started</a>
            </div>
        </section>
        <section className="services" id="services">
            <div className="container">
                <h2>Our Services</h2>
                <div className="service-grid">
                    <div className="service">
                        <h3>Accounting Data Analysis</h3>
                        <p>Analyze your accounting data with AI-powered insights.</p>
                    </div>
                    <div className="service">
                        <h3>Sales Data Analysis</h3>
                        <p>Get a clear view of your sales performance.</p>
                    </div>
                    <div className="service">
                        <h3>Marketing Data Analysis</h3>
                        <p>Optimize your marketing campaigns with data-driven decisions.</p>
                    </div>
                </div>
            </div>
        </section>
        <section className="target-audience" id="about">
            <div className="container">
                <h2>Target Audience</h2>
                <div className="market-universe">
                    <div className="market-item">Accounting Firms</div>
                    <div className="market-item">Legal Firms</div>
                    <div className="market-item">Marketing Agencies</div>
                    <div className="market-item">Real Estate Agents</div>
                    <div className="market-item">Financial and Marketing Professionals</div>
                    <div className="market-item">Government Auditors</div>
                    <div className="market-item">Small Businesses</div>
                </div>
            </div>
        </section>
        <section className="contact" id="contact">
            <div className="container">
                <h2>Contact Us</h2>
                <div className="contact-reception">
                    <div className="contact-secretary">
                        <img src="/gemini.svg" alt="Secretary" />
                    </div>
                    <div className="contact-options">
                        <a href="#"><i className="fas fa-comment-dots"></i> Chat with us</a>
                        <a href="#"><i className="fas fa-phone"></i> Call us</a>
                    </div>
                    <div className="agent-banners">
                        <div className="agent-banner">
                            <img src="/gemini.svg" alt="Agent 1" />
                        </div>
                         <div className="agent-banner">
                            <img src="/gemini.svg" alt="Agent 2" />
                        </div>
                    </div>
                    <form id="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input type="tel" id="phone" name="phone" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" required></textarea>
                        </div>
                        <button type="submit" className="button">Send</button>
                    </form>
                </div>
            </div>
        </section>
        <section>
          <SpreadsheetForm />
        </section>
        <section>
            <h2>Authentication</h2>
            {!user ? (
                <div>
                    <form onSubmit={handleSignUp}>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit">Sign Up</button>
                    </form>
                    <form onSubmit={handleSignIn}>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit">Sign In</button>
                    </form>
                </div>
            ) : (
                <div>
                    <p>Welcome, {user.email}!</p>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            )}
        </section>
    </main>
  );
}
