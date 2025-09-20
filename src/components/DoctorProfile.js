import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';

const DoctorProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    reason: '',
    urgency: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [counts, setCounts] = useState({
    experience: 0,
    patients: 0,
    satisfaction: 0,
    emergency: 0
  });
  const [visibleElements, setVisibleElements] = useState(new Set());
  const elementRefs = useRef({});

  const targetCounts = {
    experience: 15,
    patients: 2500,
    satisfaction: 98,
    emergency: 24
  };

  useEffect(() => {
    // Ensure loading state is properly set on mount
    setIsLoading(true);
    
    // Scroll to top on page load/refresh
    window.scrollTo(0, 0);
    
    // Handle different loading scenarios
    const handleLoading = () => {
      setIsLoading(true);
      // Ensure minimum loading time of 1.5 seconds for better UX
      const minLoadingTime = 1500;
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, Math.max(minLoadingTime, 2000));
      return loadingTimer;
    };

    // Initial loading
    let loadingTimer = handleLoading();

    // Handle page visibility change (when user switches tabs and comes back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        clearTimeout(loadingTimer);
        loadingTimer = handleLoading();
      }
    };

    // Handle page focus (when user clicks back to the tab)
    const handleFocus = () => {
      clearTimeout(loadingTimer);
      loadingTimer = handleLoading();
    };

    // Handle page show (when user navigates back/forward or refreshes)
    const handlePageShow = (event) => {
      // Show loading on page show, especially for back/forward navigation
      if (event.persisted) {
        clearTimeout(loadingTimer);
        loadingTimer = handleLoading();
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      clearTimeout(loadingTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // Handle page refresh and navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    const handleLoad = () => {
      window.scrollTo(0, 0);
      // Ensure loading shows on page load/refresh
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Scroll animation observer
  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.id]));
            // Add visible class to trigger animation
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const duration = 4000; // 4 seconds
      const steps = 100;
      const stepDuration = duration / steps;

      const intervals = {};

      Object.keys(targetCounts).forEach(key => {
        const target = targetCounts[key];
        const increment = target / steps;
        let current = 0;

        intervals[key] = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(intervals[key]);
          }
          setCounts(prev => ({
            ...prev,
            [key]: Math.floor(current)
          }));
        }, stepDuration);
      });

      return () => {
        Object.values(intervals).forEach(interval => clearInterval(interval));
      };
    }
  }, [isLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Using a working email service - Web3Forms
      const formData = {
        name: appointmentData.name,
        email: appointmentData.email,
        phone: appointmentData.phone,
        preferred_date: appointmentData.preferredDate,
        preferred_time: appointmentData.preferredTime,
        reason: appointmentData.reason,
        urgency: appointmentData.urgency,
        subject: `New Appointment Request - ${appointmentData.name}`,
        to: 'q9g8moh@gmail.com',
        access_key: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' // Replace with your Web3Forms key
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        
        // Reset form after successful submission
        setTimeout(() => {
          setAppointmentData({
            name: '',
            email: '',
            phone: '',
            preferredDate: '',
            preferredTime: '',
            reason: '',
            urgency: 'normal'
          });
          setShowAppointmentModal(false);
          setSubmitStatus('');
        }, 2000);
      } else {
        throw new Error(result.message || 'Email sending failed');
      }
      
    } catch (error) {
      console.error('Email sending failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowAppointmentModal(false);
    setSubmitStatus('');
  };

  return (
    <div className="doctor-profile">
      <div className={`loading-page ${!isLoading ? 'fade-out' : ''}`}>
        <div className="loading-content">
          <img 
            src="https://res.cloudinary.com/dvybb2xnc/image/upload/v1758180336/%D8%AA%D8%B5%D9%85%D9%8A%D9%85_%D8%A8%D9%88%D8%B3%D8%AA_%D8%A7%D9%86%D8%B3%D8%AA%D8%AC%D8%B1%D8%A7%D9%85_%D8%B9%D9%86_%D8%B9%D8%B1%D9%88%D8%B6_%D8%B9%D9%8A%D8%A7%D8%AF%D8%A7%D8%AA_%D8%A7%D9%84%D8%AA%D8%AC%D9%85%D9%8A%D9%84_%D8%A8%D8%B3%D9%8A%D8%B7_jnj0ss.png" 
            alt="Loading..." 
            className="loading-image"
          />
        </div>
      </div>

          <div className="profile-header animate-fadeIn">
            <div className="profile-info animate-fadeInUp animate-delay-1">
                  <h1 className="animate-fadeInUp animate-delay-2">Dr. Alexis Jon</h1>
              <h2 className="animate-fadeInUp animate-delay-3">Cardiologist</h2>
              <p className="specialty animate-fadeInUp animate-delay-4">MD, FACC - Board Certified Cardiologist</p>
              <div className="contact-info animate-fadeInUp animate-delay-5">
                <p><i className="fas fa-phone"></i> Phone: 13676757</p>
                <p><i className="fas fa-envelope"></i> Email: dr.jon@medicalcenter.com</p>
                <p><i className="fas fa-map-marker-alt"></i> Location: Bahrain, Seef District</p>
              </div>
            </div>
          </div>

      <div className="moving-bar">
        <div className="moving-text animate-shimmer">A healthy heart is the key to a long and active life. • Taking care of your heart today prevents problems tomorrow. • Heart health is the foundation of overall wellness. • Regular check-ups help keep your heart strong and safe. • Small lifestyle changes can make a big difference for your heart. • Protect your heart to protect your future. • Early detection saves lives — don't ignore heart symptoms. • Exercise and a balanced diet keep your heart in rhythm. • Stress management is essential for a healthy heart. • Your heart works for you every second — give it the care it deserves.</div>
      </div>

      <div className="profile-content">
        <div className="content-section about-section animate-on-scroll" id="about-section">
          <div className="about-content">
            <div className="about-text animate-fadeInLeft">
                      <h3><i className="fas fa-user-md animate-pulse"></i> About Dr. Alexis Jon</h3>
                  <p>
                    Dr. Alexis Jon is a highly experienced cardiologist with over 15 years of practice 
                    in cardiovascular medicine. She specializes in interventional cardiology, heart failure 
                    management, and preventive cardiology.
                  </p>
                  <p>
                    Dr. Jon is committed to providing personalized care and staying at the forefront 
                    of cardiovascular treatment innovations. Her approach combines cutting-edge medical 
                    technology with compassionate patient care.
                  </p>
                  <button className="consultation-btn animate-bounceIn animate-delay-3">
                    <i className="fas fa-calendar-check"></i>
                    Book Consultation
                  </button>
                </div>
                <div className="about-image animate-fadeInRight">
                  <img 
                    src="https://res.cloudinary.com/dvybb2xnc/image/upload/v1758014927/Screenshot_2025-09-16_122837_lrgg8o.png" 
                    alt="Medical consultation and testing" 
                    className="medical-image animate-float"
                  />
                </div>
              </div>
            </div>

        <div className="content-section stats-section animate-on-scroll" id="stats-section">
          <div className="stats-dashboard">
            <div className="stat-card animate-scaleIn animate-delay-1">
              <div className="stat-number animate-pulse">{counts.experience}+</div>
              <div className="stat-label">YEARS EXPERIENCE</div>
            </div>
            <div className="stat-card animate-scaleIn animate-delay-2">
              <div className="stat-number animate-pulse">{counts.patients}+</div>
              <div className="stat-label">HAPPY PATIENTS</div>
            </div>
            <div className="stat-card animate-scaleIn animate-delay-3">
              <div className="stat-number animate-pulse">98%</div>
              <div className="stat-label">SATISFACTION RATE</div>
            </div>
            <div className="stat-card animate-scaleIn animate-delay-4">
              <div className="stat-number animate-pulse">24/7</div>
              <div className="stat-label">EMERGENCY CARDIAC CARE</div>
            </div>
          </div>
        </div>

        <div className="content-section blood-test-section animate-on-scroll" id="blood-test-section">
          <div className="blood-test-content">
            <div className="blood-test-text animate-fadeInLeft">
              <h3><i className="fas fa-vial animate-pulse"></i> Importance of Blood Tests</h3>
              <p>
                Blood tests are essential diagnostic tools that provide crucial insights into your overall health. 
                They help detect diseases early, monitor existing conditions, and assess your body's functioning.
              </p>
              <div className="blood-test-benefits">
                <div className="benefit-item animate-fadeInUp animate-delay-1">
                  <i className="fas fa-search animate-pulse"></i>
                  <span>Early Disease Detection</span>
                </div>
                <div className="benefit-item animate-fadeInUp animate-delay-2">
                  <i className="fas fa-heartbeat animate-pulse"></i>
                  <span>Heart Health Monitoring</span>
                </div>
                <div className="benefit-item animate-fadeInUp animate-delay-3">
                  <i className="fas fa-chart-line animate-pulse"></i>
                  <span>Treatment Progress</span>
                </div>
                <div className="benefit-item animate-fadeInUp animate-delay-4">
                  <i className="fas fa-shield-alt animate-pulse"></i>
                  <span>Preventive Care</span>
                </div>
              </div>
              <p className="blood-test-note">
                Regular blood tests can identify potential health issues before symptoms appear, 
                allowing for early intervention and better treatment outcomes.
              </p>
            </div>
            <div className="blood-test-image animate-fadeInRight">
              <img 
                src="https://res.cloudinary.com/dvybb2xnc/image/upload/v1758014233/Screenshot_2025-09-16_121533_rozrbd.png" 
                alt="Blood Test" 
                className="blood-test-img animate-float"
              />
            </div>
          </div>
        </div>

        <div className="content-section animate-on-scroll" id="education-section">
          <h3><i className="fas fa-graduation-cap animate-pulse"></i> Education & Training</h3>
          <ul>
            <li className="animate-fadeInLeft animate-delay-1"><strong>Medical Degree:</strong> Harvard Medical School (2005)</li>
            <li className="animate-fadeInLeft animate-delay-2"><strong>Residency:</strong> Internal Medicine - Johns Hopkins Hospital (2008)</li>
            <li className="animate-fadeInLeft animate-delay-3"><strong>Fellowship:</strong> Cardiology - Cleveland Clinic (2011)</li>
            <li className="animate-fadeInLeft animate-delay-4"><strong>Board Certification:</strong> American Board of Internal Medicine - Cardiovascular Disease</li>
          </ul>
        </div>

        <div className="content-section specialties-section animate-on-scroll" id="specialties-section">
          <h3><i className="fas fa-heart animate-pulse"></i> Specialties & Services</h3>
          <div className="specialties-grid">
            <div className="specialty-item specialty-1 animate-bounceIn animate-delay-1">
              <i className="fas fa-heart animate-pulse"></i>
              <span>Interventional Cardiology</span>
            </div>
            <div className="specialty-item specialty-2 animate-bounceIn animate-delay-2">
              <i className="fas fa-heartbeat animate-pulse"></i>
              <span>Heart Failure Management</span>
            </div>
            <div className="specialty-item specialty-3 animate-bounceIn animate-delay-3">
              <i className="fas fa-shield-alt animate-pulse"></i>
              <span>Preventive Cardiology</span>
            </div>
            <div className="specialty-item specialty-4 animate-bounceIn animate-delay-4">
              <i className="fas fa-chart-line animate-pulse"></i>
              <span>Cardiac Risk Assessment</span>
            </div>
            <div className="specialty-item specialty-5 animate-bounceIn animate-delay-5">
              <i className="fas fa-procedures animate-pulse"></i>
              <span>Angioplasty & Stenting</span>
            </div>
            <div className="specialty-item specialty-6 animate-bounceIn animate-delay-6">
              <i className="fas fa-ambulance animate-pulse"></i>
              <span>Emergency Cardiac Care</span>
            </div>
          </div>
        </div>

        <div className="content-section specialties-image-section animate-on-scroll" id="specialties-image-section">
          <div className="specialties-image-container animate-scaleIn">
            <img 
              src="https://res.cloudinary.com/dvybb2xnc/image/upload/v1758178960/Screenshot_2025-09-18_095851_llf8tv.png" 
              alt="Medical Services" 
              className="specialties-image animate-float"
            />
          </div>
        </div>

        <div className="content-section reviews-section animate-on-scroll" id="reviews-section">
          <h3><i className="fas fa-users animate-pulse"></i> Patient Reviews</h3>
          <div className="reviews-slider">
            <div className="reviews-container">
              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>Sarah M.</strong>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <span className="review-date">1 week ago</span>
                </div>
                <p>"Dr. Jon is absolutely amazing! Her expertise and caring approach made my heart condition much better."</p>
              </div>
              
              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>Michael R.</strong>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <span className="review-date">2 weeks ago</span>
                </div>
                <p>"Professional, knowledgeable, and truly cares about her patients. Highly recommend Dr. Jon!"</p>
              </div>
              
              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>Lisa K.</strong>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <span className="review-date">3 weeks ago</span>
                </div>
                <p>"Dr. Jon saved my life with her quick diagnosis and excellent treatment. Forever grateful!"</p>
              </div>
              
              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>David L.</strong>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <span className="review-date">1 month ago</span>
                </div>
                <p>"The best cardiologist in Bahrain! Dr. Jon's expertise and bedside manner are outstanding."</p>
              </div>
              
              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>Emma W.</strong>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <span className="review-date">1 month ago</span>
                </div>
                <p>"Dr. Jon explained everything clearly and made me feel comfortable throughout my treatment."</p>
              </div>
              
              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>James T.</strong>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <span className="review-date">2 months ago</span>
                </div>
                <p>"Excellent care and follow-up. Dr. Jon's attention to detail is remarkable."</p>
              </div>
              
              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>Maria G.</strong>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <span className="review-date">2 months ago</span>
                </div>
                <p>"Dr. Jon is compassionate and skilled. She made my recovery process smooth and comfortable."</p>
              </div>
              
              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>Robert H.</strong>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <span className="review-date">3 months ago</span>
                </div>
                <p>"Outstanding cardiologist! Dr. Jon's expertise and caring nature are truly exceptional."</p>
              </div>
              
              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>Jennifer P.</strong>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <span className="review-date">3 months ago</span>
                </div>
                <p>"Dr. Jon is the best! Her treatment plan worked perfectly for my heart condition."</p>
              </div>
              
              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>Ahmed S.</strong>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <span className="review-date">4 months ago</span>
                </div>
                <p>"Professional, thorough, and caring. Dr. Jon is a true expert in cardiology."</p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section awards-section animate-on-scroll" id="awards-section">
          <h3><i className="fas fa-award animate-pulse"></i> Awards & Recognition</h3>
          <div className="awards-grid">
            <div className="award-card animate-scaleIn animate-delay-1">
              <div className="award-icon">
                <i className="fas fa-trophy animate-pulse"></i>
              </div>
              <div className="award-content">
                <h4>Top Doctor Award</h4>
                <p>Medical Excellence (2023)</p>
              </div>
            </div>
            
            <div className="award-card animate-scaleIn animate-delay-2">
              <div className="award-icon">
                <i className="fas fa-heart animate-pulse"></i>
              </div>
              <div className="award-content">
                <h4>Patient Choice Award</h4>
                <p>Cardiology (2022, 2023)</p>
              </div>
            </div>
            
            <div className="award-card animate-scaleIn animate-delay-3">
              <div className="award-icon">
                <i className="fas fa-medal animate-pulse"></i>
              </div>
              <div className="award-content">
                <h4>Excellence in Cardiovascular Care</h4>
                <p>American Heart Association (2021)</p>
              </div>
            </div>
            
            <div className="award-card animate-scaleIn animate-delay-4">
              <div className="award-icon">
                <i className="fas fa-microscope animate-pulse"></i>
              </div>
              <div className="award-content">
                <h4>Outstanding Clinical Research</h4>
                <p>Journal of Cardiology (2020)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section animate-on-scroll" id="appointment-section">
          <h3><i className="fas fa-calendar-alt animate-pulse"></i> Book Appointment</h3>
          <div className="appointment-options">
            <button 
              className="appointment-btn primary animate-bounceIn animate-delay-1"
              onClick={() => setShowAppointmentModal(true)}
            >
              <i className="fas fa-calendar-plus animate-pulse"></i>
              Book Online
            </button>
            <button className="appointment-btn secondary animate-bounceIn animate-delay-2">
              <i className="fas fa-phone animate-pulse"></i>
              Call Now
            </button>
          </div>
          <p className="appointment-note animate-fadeInUp animate-delay-3">
            Same-day appointments available for urgent cases. 
            Most insurance plans accepted.
          </p>
        </div>
      </div>

      {/* Appointment Booking Modal */}
      {showAppointmentModal && (
        <div className="modal-overlay animate-fadeIn" onClick={closeModal}>
          <div className="modal-content animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header animate-fadeInDown">
              <h2><i className="fas fa-calendar-plus animate-pulse"></i> Book Your Appointment</h2>
              <button className="modal-close animate-bounceIn" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmitAppointment} className="appointment-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={appointmentData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={appointmentData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={appointmentData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preferredDate">Preferred Date *</label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={appointmentData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="preferredTime">Preferred Time *</label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={appointmentData.preferredTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="urgency">Urgency Level</label>
                <select
                  id="urgency"
                  name="urgency"
                  value={appointmentData.urgency}
                  onChange={handleInputChange}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reason">Reason for Visit *</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={appointmentData.reason}
                  onChange={handleInputChange}
                  required
                  placeholder="Please describe your symptoms or reason for the appointment"
                  rows="4"
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  Appointment request sent successfully! We'll contact you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  There was an error sending your request. Please try again.
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
