import Header from "./LandingComponents/Header";
import AppDescriptionDemoVideo from "./LandingComponents/AppDescriptionDemoVideo";
import Feedback from "./LandingComponents/Feedback"
import SubscriptionPlans from "./LandingComponents/SubscriptionPlans"
import FAQFooter from "./LandingComponents/FAQFooter"
import "./LandingPage.css"

export default function LandingPage() {
    return (
      <div className="landingPage">
        <Header />
        <AppDescriptionDemoVideo />
        <SubscriptionPlans/>
        <Feedback/>
        <FAQFooter/>
      </div>
    );
  }