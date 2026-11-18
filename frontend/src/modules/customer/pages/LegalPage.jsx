import { Link } from 'react-router-dom';
import { discoveryDemoNotice } from '../../../services/publicDiscoveryData';
import './PublicDiscovery.css';

const content = {
  terms: {
    title: 'Terms & Conditions',
    intro: 'These prototype terms explain how to use the Zorevi demonstration interface. They are not a final contract for a live service.',
    sections: [
      ['Using this prototype', 'You may explore public previews and try the sample customer and designer flows. Names, profiles, images, ratings, prices, availability and interactions are illustrative and are not offers for real services.'],
      ['Accounts and access', 'The sign-in and registration screens simulate user journeys in the browser. They do not create real accounts or provide secure authentication. Do not enter sensitive personal or payment information.'],
      ['Bookings and payments', 'Booking, pricing, availability and payment screens are demonstrations only. No appointment is made, no designer is engaged and no payment is collected through this prototype.'],
      ['Changes to these terms', 'These sample terms must be reviewed and replaced with legally reviewed terms before a public production launch.'],
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'This prototype is built to demonstrate Zorevi’s customer and designer journeys. It is not a live marketplace or a production privacy notice.',
    sections: [
      ['Information entered in forms', 'Some demo flows may keep information in browser memory or session storage to complete the experience. Form submissions are not sent to a Zorevi production account, email, SMS or support system.'],
      ['Authentication and security', 'The sign-in, verification and account screens do not authenticate a real person. Do not enter passwords you use elsewhere, government identifiers, financial details or other sensitive information.'],
      ['Images and demo profiles', 'Public designer names, profile details, ratings, prices, reviews and availability are illustrative. Stock photographs do not depict or endorse the named demo profiles.'],
      ['Before launch', 'A production service needs a complete privacy notice describing real data collection, retention, sharing, security and user rights, reviewed for applicable law.'],
    ],
  },
};

export default function LegalPage({ document: documentType }) {
  const page = content[documentType] || content.terms;

  return (
    <main className="discovery-page public-legal-page">
      <header className="public-info-hero">
        <p className="discovery-eyebrow">Zorevi prototype information</p>
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
      </header>
      <p className="discovery-demo-notice" role="note">{discoveryDemoNotice}</p>
      <div className="public-legal-sections">
        {page.sections.map(([title, text]) => (
          <section className="public-detail-panel" key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </div>
      <p className="public-legal-help">Questions about this prototype? Visit <Link to="/help">Help &amp; Support</Link>.</p>
    </main>
  );
}
