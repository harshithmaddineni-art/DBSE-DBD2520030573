import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="hero-section">
          <div className="hero-text">
            <h1 className="hero-title">
              Empower Your Campus <br />
              <span className="title-highlight">Resolve Issues Faster</span>
            </h1>
            <p className="hero-subtitle">
              Experience the next generation Grievance Redressal Portal. 
              Seamlessly connect students, staff, and administration in one unified, transparent platform.
            </p>
            
            <div className="hero-buttons">
              <Link to="/login" className="btn-mega btn-primary-mega">
                Login to Portal
              </Link>
              <Link to="/signup" className="btn-mega btn-secondary-mega">
                Create Account
              </Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="premium-card">
              <div className="card-top-bar">
                <div className="mac-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="card-title-sm">Grievance #4829</div>
              </div>
              <div className="card-content-area">
                <div className="line-mock title-mock"></div>
                <div className="line-mock desc-mock"></div>
                <div className="line-mock desc-mock short"></div>
                <div className="status-pill status-processing">
                  <span className="pulse-dot warning"></span> Processing
                </div>
              </div>
            </div>
            
            <div className="premium-card offset-premium-card">
               <div className="card-top-bar">
                  <div className="mac-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="card-title-sm">Grievance #4811</div>
               </div>
               <div className="card-content-area">
                 <div className="line-mock title-mock"></div>
                 <div className="line-mock desc-mock"></div>
                 <div className="status-pill status-resolved">
                   <span className="pulse-dot success"></span> Resolved
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="landing-features-container">
          <h2 className="features-headline">Why Choose Our Portal?</h2>
          <div className="features-grid">
            <div className="feature-box">
                <div className="feature-icon">🔒</div>
                <h3>Bank-Grade Security</h3>
                <p>Your concerns are handled with absolute confidentiality. Advanced encryption ensures your data remains completely private and secure.</p>
            </div>
            <div className="feature-box">
                <div className="feature-icon">⚡</div>
                <h3>Real-Time Tracking</h3>
                <p>Never wonder about your grievance status again. Get instant updates and monitor progress directly from your interactive dashboard.</p>
            </div>
            <div className="feature-box">
                <div className="feature-icon">🏢</div>
                <h3>Multi-Tier Access</h3>
                <p>Dedicated, tailored interfaces for students, staff, and administrators, ensuring everyone has the exact tools they need to succeed.</p>
            </div>
            <div className="feature-box">
                <div className="feature-icon">📊</div>
                <h3>Insightful Analytics</h3>
                <p>Administrators get powerful reporting tools to identify trends and improve overall institutional environment efficiently.</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Grievance Redressal Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
