import { useState, useEffect } from 'react';
import './LandingPage.css';
import LandingPageController from "../../controller/LandingPageController";

interface Review {
  id: number;
  user: string;
  position: string;
  text: string;
  rating: number;
}

type VideoItem = {
    videoUrl: string;
    title: string;
    createdOn: string;
  };

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const mockReviews: Review[] = [
      { id: 1, user: "John D.", position: "Restaurant Manager", 
        text: "EmpRoster transformed how we schedule staff!", rating: 5 },
      { id: 2, user: "Sarah M.", position: "Retail Owner", 
        text: "Reduced scheduling time by 70%", rating: 5 },
      { id: 3, user: "Mike R.", position: "Team Lead", 
        text: "Best employee management tool we've used", rating: 4 },
    ];
    setReviews(mockReviews);
  }, []);

  const faqs = [
    { question: "How does the AI scheduling work?", 
      answer: "Our algorithm considers employee availability, skills, and business needs..." },
    { question: "Is there mobile app support?", 
      answer: "Yes, available for both iOS and Android devices..." },
    { question: "Can I manage multiple locations?", 
      answer: "Absolutely! Our enterprise plan supports multi-location management..." },
  ];

  const [video, setVideo] = useState<VideoItem | null>(null);
  
  useEffect(() => {
    (async () => {
      try {
        const vids = await LandingPageController.getVideo();
        if (vids.length > 0) setVideo(vids[0]);
      } catch {
      }
    })();
  }, []);
  
  if (!video) return <p>Loading video…</p>;

  return (
    <div className="landing-container">
      <section className="video-hero" id="hero">
        <div className="video-container">
          <video
            className="video-container video"
            src={video.videoUrl}
            controls
            autoPlay
            muted
            playsInline
            loop
            width="100%"
          >
            Your browser doesn't support HTML5 video.
        </video>
          <div className="video-overlay">
            <h1>Smart Employee Scheduling Made Simple</h1>
            <p>Experience next-generation workforce management</p>
          </div>
        </div>
      </section>

      <section className="reviews" id="reviews">
        <h2>What Our Users Say</h2>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-header">
                <div className="review-rating">
                  {'★'.repeat(review.rating)}
                </div>
                <h3>{review.user}</h3>
                <p className="position">{review.position}</p>
              </div>
              <p className="review-text">"{review.text}"</p>
            </div>
          ))}
        </div>
      </section>

      <section className="faq" id="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              className={`faq-item ${activeFaq === index ? 'active' : ''}`} 
              key={index}
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span>{activeFaq === index ? '−' : '+'}</span>
              </div>
              {activeFaq === index && <p className="faq-answer">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 EmpRoster. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default LandingPage;