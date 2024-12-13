import './globals.css';

export default function Home() {
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
                        <div className="contact-icons">
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
                    </div>
                    <form id="contact-form">
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
    </main>
  );
}
