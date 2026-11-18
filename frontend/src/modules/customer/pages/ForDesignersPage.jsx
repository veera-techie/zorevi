import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, BriefcaseBusiness,
  ChevronDown, Image, MessageCircle, Palette, ShieldCheck, Sparkles, Users,
} from 'lucide-react';
import './ForDesignersPage.css';

const showcaseOptions = [
  {
    id: 'portfolio',
    label: 'Showcase your work',
    title: 'Let your work speak first.',
    description: 'Bring your specialties, experience and portfolio together in a profile customers can explore before they reach out.',
    image: '/assets/images/category-bridal.jpg',
    alt: 'Illustrative bridal fashion portfolio image',
    icon: Image,
    details: ['A profile shaped around your specialties', 'A visual portfolio for your point of view', 'Clear service previews for customers'],
  },
  {
    id: 'inclusive',
    label: 'Reach your people',
    title: 'Style has room for everyone.',
    description: 'Make your approach discoverable to people seeking looks for themselves, their families, or a special moment.',
    image: '/assets/images/category-family.jpg',
    alt: 'Illustrative family fashion styling image',
    icon: Users,
    details: ['Men’s, women’s and kids’ styling', 'Couple and family occasions', 'Traditional, western and bridal looks'],
  },
  {
    id: 'studio',
    label: 'Shape your studio',
    title: 'Keep your creative work in view.',
    description: 'The Zorevi studio is designed to bring portfolio, services, availability and booking requests into one workspace.',
    image: '/assets/images/category-traditional.jpg',
    alt: 'Illustrative traditional fashion styling image',
    icon: BriefcaseBusiness,
    details: ['Organize service offerings', 'Share your availability', 'Review and respond to booking requests'],
  },
];

const applicationSteps = [
  { title: 'Tell us about you', text: 'Add your profile and contact details.', icon: Users },
  { title: 'Share your craft', text: 'Choose skills, specializations and experience.', icon: Palette },
  { title: 'Add your work', text: 'Include qualifications and portfolio examples.', icon: Image },
  { title: 'Review and submit', text: 'Check your application before sending it.', icon: BadgeCheck },
];

const faqs = [
  {
    question: 'Who can apply to join Zorevi?',
    answer: 'Designers and stylists of all genders are welcome to apply. You can describe the people and occasions you serve, including men, women, children, couples and families.',
  },
  {
    question: 'What should I prepare for an application?',
    answer: 'The application flow asks for basic profile and contact details, skills and experience, qualifications or certifications, and examples of your work.',
  },
  {
    question: 'When can I receive booking access?',
    answer: 'Applications are intended to be reviewed before booking access is enabled. This frontend demo does not perform a real review, approve profiles, or activate production access.',
  },
];

export default function ForDesignersPage() {
  const [activeShowcase, setActiveShowcase] = useState(showcaseOptions[0].id);
  const [openFaq, setOpenFaq] = useState(0);
  const selectedShowcase = showcaseOptions.find((option) => option.id === activeShowcase) || showcaseOptions[0];

  const handleTabKeyDown = (event) => {
    const currentIndex = showcaseOptions.findIndex((option) => option.id === activeShowcase);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % showcaseOptions.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + showcaseOptions.length) % showcaseOptions.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = showcaseOptions.length - 1;
    else return;

    event.preventDefault();
    const nextOption = showcaseOptions[nextIndex];
    setActiveShowcase(nextOption.id);
    document.getElementById(`designer-showcase-tab-${nextOption.id}`)?.focus();
  };

  return (
    <main className="discovery-page public-info-page designer-page">
      <section className="designer-hero" aria-labelledby="designer-hero-title">
        <div className="designer-hero__copy">
          <div className="designer-hero__kickers">
            <span className="designer-kicker"><Sparkles size={14} /> ZOREVI FOR CREATORS</span>
            <span className="designer-review-pill"><ShieldCheck size={14} /> Reviewed before booking access</span>
          </div>
          <h1 id="designer-hero-title">Your eye for style deserves to be <span>seen.</span></h1>
          <p>Bring your perspective to a fashion community made for every person, identity and occasion.</p>
          <div className="designer-hero__actions">
            <Link to="/designer/apply" className="zorevi-btn zorevi-btn--primary">
              Apply to join Zorevi <ArrowRight size={17} />
            </Link>
            <Link to="/designer/login" className="designer-text-link">
              Designer sign in <ArrowUpRight size={15} />
            </Link>
          </div>
          <a className="designer-hero__scroll" href="#designer-benefits">
            See how it works <ArrowDown size={15} />
          </a>
        </div>

        <div className="designer-hero__art" aria-label="Illustrative fashion photography">
          <img className="designer-hero__main-image" src="/assets/images/designer-aarohi.jpg" alt="Illustrative South Asian fashion portrait; not a Zorevi designer profile" />
          <div className="designer-hero__image-tint" />
          <div className="designer-hero__floating-card designer-hero__floating-card--top">
            <span className="designer-hero__floating-icon"><Palette size={17} /></span>
            <span><strong>Your point of view</strong><small>Make it your signature</small></span>
          </div>
          <div className="designer-hero__floating-card designer-hero__floating-card--bottom">
            <div className="designer-hero__mini-avatars" aria-hidden="true">
              <img src="/assets/images/designer-rohan.jpg" alt="" />
              <img src="/assets/images/designer-sneha.jpg" alt="" />
              <img src="/assets/images/category-family.jpg" alt="" />
            </div>
            <span><strong>Every style. Every story.</strong><small>Illustrative imagery</small></span>
            <Sparkles size={17} aria-hidden="true" />
          </div>
          <span className="designer-hero__photo-note">Stock photography · illustrative only</span>
        </div>
      </section>

      <p className="designer-demo-note" role="note">
        Prototype only. Application submission, review and studio access are simulated; no real designer account or approval is issued.
      </p>

      <section className="designer-benefits" id="designer-benefits" aria-labelledby="designer-benefits-title">
        <div className="designer-section-heading">
          <div>
            <p className="discovery-eyebrow">A platform shaped around your craft</p>
            <h2 id="designer-benefits-title">Make your work easier to discover.</h2>
          </div>
          <p>Choose a focus to see how the designer experience is envisioned.</p>
        </div>

        <div className="designer-showcase">
          <div className="designer-showcase__tabs" role="tablist" aria-label="Explore designer benefits" onKeyDown={handleTabKeyDown}>
            {showcaseOptions.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                role="tab"
                id={`designer-showcase-tab-${id}`}
                aria-selected={activeShowcase === id}
                aria-controls="designer-showcase-panel"
                tabIndex={activeShowcase === id ? 0 : -1}
                className={`designer-showcase__tab ${activeShowcase === id ? 'is-active' : ''}`}
                key={id}
                onClick={() => setActiveShowcase(id)}
              >
                <Icon size={18} />
                <span>{label}</span>
                <ArrowUpRight size={15} className="designer-showcase__tab-arrow" />
              </button>
            ))}
          </div>

          <div
            className="designer-showcase__panel"
            role="tabpanel"
            id="designer-showcase-panel"
            aria-labelledby={`designer-showcase-tab-${selectedShowcase.id}`}
            tabIndex="0"
          >
            <div className="designer-showcase__content">
              <p className="discovery-eyebrow">The designer experience</p>
              <h3>{selectedShowcase.title}</h3>
              <p>{selectedShowcase.description}</p>
              <ul>
                {selectedShowcase.details.map((detail) => (
                  <li key={detail}><BadgeCheck size={16} aria-hidden="true" /> {detail}</li>
                ))}
              </ul>
              <Link to="/designer/apply" className="designer-text-link">
                Start your application <ArrowRight size={15} />
              </Link>
            </div>
            <div className="designer-showcase__visual">
              <img src={selectedShowcase.image} alt={selectedShowcase.alt} />
              <span><Image size={14} /> Illustrative style inspiration</span>
            </div>
          </div>
        </div>
      </section>

      <section className="designer-application" aria-labelledby="designer-application-title">
        <div className="designer-section-heading">
          <div>
            <p className="discovery-eyebrow">A clear, separate application</p>
            <h2 id="designer-application-title">Four steps to submit your profile.</h2>
          </div>
          <Link to="/designer/apply" className="zorevi-btn zorevi-btn--outline">
            Preview application <ArrowRight size={15} />
          </Link>
        </div>
        <ol className="designer-application__steps">
          {applicationSteps.map(({ title, text, icon: Icon }, index) => (
            <li key={title}>
              <span className="designer-application__step-number">0{index + 1}</span>
              <span className="designer-application__step-icon"><Icon size={19} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className="designer-review-callout">
          <ShieldCheck size={21} aria-hidden="true" />
          <p><strong>Review before access.</strong> In the intended service, applications are reviewed before booking access is enabled. This prototype does not conduct reviews or grant real access.</p>
        </div>
      </section>

      <section className="designer-faq" aria-labelledby="designer-faq-title">
        <div className="designer-faq__intro">
          <p className="discovery-eyebrow">Good to know</p>
          <h2 id="designer-faq-title">A few quick answers.</h2>
          <p>Keep customer registration and the designer application separate—each journey has its own entry point.</p>
          <Link to="/how-it-works" className="designer-text-link">See how Zorevi works <ArrowRight size={15} /></Link>
        </div>
        <div className="designer-faq__items">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <article className={`designer-faq__item ${isOpen ? 'is-open' : ''}`} key={faq.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`designer-faq-panel-${index}`}
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  >
                    {faq.question}<ChevronDown size={18} aria-hidden="true" />
                  </button>
                </h3>
                <p id={`designer-faq-panel-${index}`} hidden={!isOpen}>{faq.answer}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="designer-final-cta" aria-labelledby="designer-final-cta-title">
        <span className="designer-final-cta__icon"><MessageCircle size={21} /></span>
        <div>
          <p className="discovery-eyebrow">Your next chapter starts here</p>
          <h2 id="designer-final-cta-title">Ready to share what you create?</h2>
          <p>Apply as a designer, or sign in to continue to your studio.</p>
        </div>
        <div className="designer-final-cta__actions">
          <Link to="/designer/apply" className="zorevi-btn zorevi-btn--primary">Apply to join Zorevi <ArrowRight size={16} /></Link>
          <Link to="/designer/login" className="designer-text-link">Designer sign in</Link>
        </div>
      </section>
    </main>
  );
}
