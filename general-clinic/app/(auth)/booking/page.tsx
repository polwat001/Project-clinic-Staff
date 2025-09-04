import BookingForm from '../../../components/BookingForm';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function BookingPage() {
  return (
    <main className="main-bg doctor-bg">
      <img src="/doctor.svg" alt="Doctor" className="doctor-bg-img" />
      <div className="bubbles-bg">
        <span className="bubble bubble1"></span>
        <span className="bubble bubble2"></span>
        <span className="bubble bubble3"></span>
      </div>
      <Header />
      <section className="booking-form-section">
        <BookingForm />
      </section>
      <Footer />
    </main>
  );
} 