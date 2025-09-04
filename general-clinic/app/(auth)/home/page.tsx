import Header from '../../../components/Header';
import ServiceCards from '../../../components/ServiceCards';
import ActionButtons from '../../../components/ActionButtons';
import VaccineReminder from '../../../components/VaccineReminder';
import Footer from '../../../components/Footer';

export default function HomePage() {
  return (
    <main className="main-bg doctor-bg">
      <img src="/doctor.svg" alt="Doctor" className="doctor-bg-img" />
      <div className="bubbles-bg">
        <span className="bubble bubble1"></span>
        <span className="bubble bubble2"></span>
        <span className="bubble bubble3"></span>
      </div>
      <div className="main-flex">
        <div className="right-content">
          <Header />
          <section className="clinic-info-section">
            <div className="clinic-info-title">เปิดให้บริการทุกวัน เวลา 08.00 – 20.00 น.</div>
            <ServiceCards />
          </section>
          <ActionButtons />
        </div>
      </div>
      <VaccineReminder />
      <section className="contact-map-section">
        <div className="contact-info-box">
          <div className="contact-title">สอบถามข้อมูลเพิ่มเติม</div>
          <div className="contact-row">
            <span className="contact-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#E6F6FF"/><path d="M6 8C6 13 11 18 16 18V15.5C16 15.2239 16.2239 15 16.5 15H19C19.2761 15 19.5 15.2239 19.5 15.5V19C19.5 19.2761 19.2761 19.5 19 19.5C9.16344 19.5 2.5 12.8366 2.5 3C2.5 2.72386 2.72386 2.5 3 2.5H6.5C6.77614 2.5 7 2.72386 7 3V6.5C7 6.77614 6.77614 7 6.5 7H6Z" fill="#3B82F6"/></svg>
            </span>
            <span className="contact-text">+123-456-7890</span>
          </div>
        </div>
        <div className="map-box">
          <img src="/globe.svg" alt="map" className="map-img" />
        </div>
      </section>
      <Footer />
    </main>
  );
}
