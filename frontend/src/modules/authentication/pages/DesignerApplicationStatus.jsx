import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle, ArrowRight, BadgeCheck, Building2, CalendarDays, Check, Clock,
  FileCheck2, Image as ImageIcon, Mail, MapPin, PackageCheck, Phone, ShieldCheck, UserRound,
} from 'lucide-react';
import { findDesignerApplication } from '../../../services/designerApplicationsStorage';
import './DesignerApplicationStatus.css';

const STATUS_OPTIONS = [
  { id: 'pending', label: 'Pending (Under Review)' },
  { id: 'approved', label: 'Approved (Studio Live)' },
  { id: 'changes_requested', label: 'Changes Requested' },
];

function getStatusKey(status) {
  const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : '';
  if (normalizedStatus.includes('approved') || normalizedStatus.includes('studio live')) return 'approved';
  if (normalizedStatus.includes('change')) return 'changes_requested';
  return 'pending';
}

function formatSubmittedDate(application) {
  const date = application?.submittedAt ? new Date(application.submittedAt) : null;
  if (date && !Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }
  return [application?.submissionDate, application?.submissionTime].filter(Boolean).join(' ') || 'Date unavailable';
}

function getFileNames(files) {
  return Array.isArray(files) ? files.map((file) => file?.name).filter(Boolean) : [];
}

export default function DesignerApplicationStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const applicationIdFromUrl = searchParams.get('applicationId') || '';
  const [applicationId, setApplicationId] = useState(applicationIdFromUrl);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [simulatedStatus, setSimulatedStatus] = useState('pending');
  const [showSubmittedApplication, setShowSubmittedApplication] = useState(false);

  useEffect(() => {
    setApplicationId(applicationIdFromUrl);
    setShowSubmittedApplication(false);
    if (!applicationIdFromUrl) {
      setApplication(null);
      setLoading(false);
      setError('');
      return undefined;
    }

    setLoading(true);
    setError('');
    try {
      const savedApplication = findDesignerApplication(applicationIdFromUrl);
      if (!savedApplication) {
        throw new Error('This application ID was not found in this browser’s saved applications. Check the ID and try again.');
      }
      setApplication(savedApplication);
      setSimulatedStatus(getStatusKey(savedApplication.status));
    } catch (requestError) {
      setApplication(null);
      setError(requestError.message || 'Could not retrieve this saved application.');
    } finally {
      setLoading(false);
    }

    return undefined;
  }, [applicationIdFromUrl]);

  const handleLookup = (event) => {
    event.preventDefault();
    const trimmedId = applicationId.trim();
    if (trimmedId) setSearchParams({ applicationId: trimmedId });
  };

  const fullName = application?.fullName?.trim() || 'Designer';
  const initials = fullName === 'Designer'
    ? ''
    : fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const location = application?.location || [application?.address, application?.city].filter(Boolean).join(', ');
  const submittedDate = formatSubmittedDate(application);
  const portfolioFiles = Array.isArray(application?.portfolio)
    ? application.portfolio
    : Array.isArray(application?.portfolioFiles) ? application.portfolioFiles : [];
  const certificateFiles = Array.isArray(application?.certificates) ? application.certificates : [];
  const portfolioNames = getFileNames(portfolioFiles);
  const certificateNames = getFileNames(certificateFiles);
  const skills = Array.isArray(application?.skills) ? application.skills : [];
  const startingPrice = Number(application?.startingPricePerHour ?? application?.startingPrice);
  const currentStatus = STATUS_OPTIONS.find((option) => option.id === simulatedStatus) || STATUS_OPTIONS[0];
  const statusLabel = simulatedStatus === 'approved'
    ? 'Studio Live'
    : simulatedStatus === 'changes_requested' ? 'Changes Requested' : 'Under Review';
  const statusBadgeClass = simulatedStatus === 'approved'
    ? 'approved'
    : simulatedStatus === 'changes_requested' ? 'changes_requested' : 'pending';
  const completedThrough = simulatedStatus === 'approved' ? 4 : 1;
  const progressWidth = simulatedStatus === 'approved' ? '76%' : '25%';
  const statusCopy = simulatedStatus === 'approved'
    ? {
      heading: 'Your Studio Is Live!',
      description: 'Your designer application has been approved. Your studio is ready to welcome customers.',
      note: 'Your application is approved and your studio is live.',
    }
    : simulatedStatus === 'changes_requested'
      ? {
        heading: 'Changes Requested',
        description: 'The onboarding team needs an update before verification can continue. Please review your submitted information and follow up on any requested changes.',
        note: 'Verification is paused until the requested changes are addressed.',
      }
      : {
        heading: 'Application is Under Verification',
        description: 'Our onboarding team is reviewing your credentials, portfolio, and identity documents to complete your designer verification.',
        note: 'Estimated turnaround: within 24 hours. We’ll update your application status once the review is complete.',
      };

  const isApproved = simulatedStatus === 'approved';
  const changesRequested = simulatedStatus === 'changes_requested';
  const governmentIdReceived = Boolean(application?.governmentIdUploaded || application?.governmentIdFile);
  const portfolioCount = portfolioFiles.length;
  const reviewState = isApproved ? 'verified' : changesRequested ? 'requested' : 'reviewing';
  const governmentIdState = changesRequested
    ? { label: 'Action needed', detail: 'Review your identity document and any requested updates.' }
    : isApproved
      ? { label: 'Verified · Demo', detail: 'Government ID verification is complete in this demo state.' }
      : governmentIdReceived
        ? { label: 'In review', detail: 'Your submitted identity document is being checked.' }
        : { label: 'Not provided', detail: 'No government ID was attached to this application.' };
  const portfolioState = changesRequested
    ? { label: 'Changes requested', detail: 'Review portfolio feedback before verification resumes.' }
    : isApproved
      ? { label: 'Approved · Demo', detail: 'Your portfolio is approved in this demo state.' }
      : { label: 'In review', detail: `${portfolioCount} portfolio image${portfolioCount === 1 ? '' : 's'} submitted for review.` };
  const verificationTiles = [
    {
      title: 'Government ID Proof',
      Icon: ShieldCheck,
      ...governmentIdState,
      state: changesRequested ? 'requested' : isApproved ? 'verified' : governmentIdReceived ? 'reviewing' : 'pending',
    },
    {
      title: 'Studio / Business Proof',
      Icon: Building2,
      label: changesRequested ? 'Paused' : isApproved ? 'Verified · Demo' : 'Pending',
      detail: 'Studio proof is reviewed during onboarding; it is not collected in this application form.',
      state: changesRequested ? 'pending' : isApproved ? 'verified' : 'pending',
    },
    {
      title: `Portfolio Review${portfolioCount ? ` (${portfolioCount} Look${portfolioCount === 1 ? '' : 's'})` : ''}`,
      Icon: ImageIcon,
      ...portfolioState,
      state: reviewState,
    },
    {
      title: 'Standard Package Onboarding',
      Icon: PackageCheck,
      label: changesRequested ? 'Paused' : isApproved ? 'Complete · Demo' : 'Next step',
      detail: changesRequested
        ? 'Onboarding continues after requested changes are received.'
        : isApproved ? 'Standard onboarding is complete in this demo state.' : 'Profile setup follows verification.',
      state: changesRequested ? 'pending' : isApproved ? 'verified' : 'pending',
    },
  ];

  const renderStep = (stepLabel, index) => {
    const isComplete = index < completedThrough || simulatedStatus === 'approved';
    const isActive = !isComplete && index === 1;
    const isChangeStep = changesRequested && index === 1;
    const stepStatus = simulatedStatus === 'approved'
      ? 'Completed'
      : index === 0
        ? 'Completed'
        : index === 1
          ? changesRequested ? 'Changes Requested' : 'In Review'
          : index === 2
            ? changesRequested ? 'Paused' : 'Pending'
            : changesRequested ? 'Pending' : 'Final Step · Pending';

    return (
      <div className={`zorevi-step ${isComplete ? 'completed' : ''} ${isActive ? 'active' : ''} ${isChangeStep ? 'changes-requested' : ''}`} key={stepLabel}>
        <span className="zorevi-step__circle">
          {isComplete ? <Check size={18} /> : isChangeStep ? <AlertCircle size={17} /> : index + 1}
        </span>
        <span className="zorevi-step__label">{stepLabel}</span>
        <span className="zorevi-step__date">{stepStatus}</span>
      </div>
    );
  };

  const renderSubmittedDetails = () => (
    <dl className="zorevi-submitted-details">
      <div><dt>Full Name</dt><dd>{application.fullName || 'Not provided'}</dd></div>
      <div><dt>Application ID</dt><dd>{application.applicationId}</dd></div>
      <div><dt>WhatsApp Number</dt><dd>{application.whatsappNumber || application.phone || 'Not provided'}</dd></div>
      <div><dt>Email</dt><dd>{application.email || 'Not provided'}</dd></div>
      <div><dt>Location</dt><dd>{location || 'Not provided'}</dd></div>
      <div><dt>Styling Skills</dt><dd>{skills.length ? skills.join(', ') : 'Not provided'}</dd></div>
      <div><dt>Experience</dt><dd>{application.experience || 'Not provided'}</dd></div>
      <div><dt>Starting Price / Hour</dt><dd>{Number.isFinite(startingPrice) ? `₹${startingPrice.toLocaleString('en-IN')} / hour` : 'Not provided'}</dd></div>
      <div><dt>Submitted</dt><dd>{submittedDate}</dd></div>
      <div><dt>Portfolio</dt><dd>{portfolioNames.length ? portfolioNames.join(', ') : 'No images added'}{application.portfolioLink ? ` · ${application.portfolioLink}` : ''}</dd></div>
      <div><dt>Certificates</dt><dd>{certificateNames.length ? certificateNames.join(', ') : 'No certificates added'}</dd></div>
      <div><dt>Government ID</dt><dd>{governmentIdReceived ? 'Document received' : 'Not provided'}</dd></div>
    </dl>
  );

  return (
    <div className="zorevi-status-page">
      <header className="zorevi-status-header">
        <Link to="/" className="zorevi-status-logo" aria-label="Zorevi Homepage">
          <img src="/images/zorevi-logo.png" alt="Zorevi" className="zorevi-status-logo-img" />
        </Link>
        <nav className="zorevi-status-header__actions" aria-label="Support and account">
          <a className="zorevi-status-header__help" href="#designer-status-support">Help &amp; Support</a>
          <Link to="/designer/login" className="zorevi-status-login">Designer Login</Link>
        </nav>
      </header>

      <main className="zorevi-status-container">
        {loading && <section className="zorevi-status-empty" role="status">Loading your saved application…</section>}

        {!loading && application && (
          <>
            <section className="zorevi-status-card designer-status-dashboard">
              <header className="zorevi-status-card__header">
                <div className="zorevi-status-card__header-left">
                  {typeof application.profileImage === 'string' && application.profileImage
                    ? <img src={application.profileImage} alt={`${fullName} profile`} className="zorevi-status-avatar" />
                    : <div className="zorevi-status-avatar zorevi-status-avatar--initials" aria-label={`${fullName} profile`}>{initials || <UserRound size={28} />}</div>}
                  <div className="zorevi-status-meta">
                    <p className="designer-status-eyebrow">DESIGNER APPLICATION</p>
                    <h1>{fullName}</h1>
                    <div className="zorevi-status-meta-pills">
                      <span className="zorevi-meta-pill id-pill"><FileCheck2 size={14} />{application.applicationId}</span>
                      {location && <span className="zorevi-meta-pill"><MapPin size={14} />{location}</span>}
                      <span className="zorevi-meta-pill"><CalendarDays size={14} />Submitted {submittedDate}</span>
                    </div>
                  </div>
                </div>
                <span className={`zorevi-status-badge ${statusBadgeClass}`}>
                  {isApproved ? <BadgeCheck size={17} /> : changesRequested ? <AlertCircle size={17} /> : <Clock size={17} />}
                  {statusLabel}
                </span>
              </header>

              <div className="zorevi-status-card__body">
                <div className="zorevi-stepper" aria-label="Application progress">
                  <span className="zorevi-stepper__progress" style={{ width: progressWidth }} aria-hidden="true" />
                  {['Submitted', 'Portfolio & ID', 'Verification', 'Studio Live'].map(renderStep)}
                </div>

                <section className={`zorevi-status-section ${statusBadgeClass}`}>
                  <div className="zorevi-status-section__header">
                    <span className="zorevi-status-section__icon-wrap">
                      {isApproved ? <BadgeCheck size={25} /> : changesRequested ? <AlertCircle size={25} /> : <ShieldCheck size={25} />}
                    </span>
                    <div>
                      <h2 className="zorevi-status-section__title">{statusCopy.heading}</h2>
                      <p className="zorevi-status-section__sub">{statusCopy.description}</p>
                    </div>
                  </div>

                  {!isApproved && !changesRequested && (
                    <p className="zorevi-status-turnaround"><Clock size={16} /> Estimated turnaround: within 24 hours</p>
                  )}

                  <div className="zorevi-checklist-grid">
                    {verificationTiles.map(({ title, Icon, label, detail, state }) => (
                      <article className="zorevi-checklist-item" key={title}>
                        <span className={`zorevi-checklist-item__icon ${state}`}>
                          {state === 'verified' ? <Check size={16} /> : <Icon size={16} />}
                        </span>
                        <span className="zorevi-checklist-item__info">
                          <strong className="zorevi-checklist-item__title">{title}</strong>
                          <span className="zorevi-checklist-item__desc">{detail}</span>
                        </span>
                        <span className={`zorevi-checklist-item__status ${state}`}>{label}</span>
                      </article>
                    ))}
                  </div>

                  {changesRequested && (
                    <div className="zorevi-status-change-note" role="status">
                      <AlertCircle size={18} />
                      <span>Verification is paused. Review the submitted details and make any updates requested by the onboarding team.</span>
                    </div>
                  )}
                  {isApproved && (
                    <div className="zorevi-status-approved-note" role="status">
                      <BadgeCheck size={18} />
                      <span>Your designer application is approved and your studio is live.</span>
                    </div>
                  )}

                  <div className="zorevi-status-action-box">
                    <button
                      type="button"
                      className="zorevi-status-view-button"
                      aria-expanded={showSubmittedApplication}
                      aria-controls="submitted-application-details"
                      onClick={() => setShowSubmittedApplication((visible) => !visible)}
                    >
                      {showSubmittedApplication ? 'Hide Submitted Application' : 'View Submitted Application'}
                      <ArrowRight size={17} />
                    </button>
                    <span>Your submitted information is only visible in this browser demo.</span>
                  </div>
                </section>

                {showSubmittedApplication && (
                  <section className="zorevi-submitted-panel" id="submitted-application-details">
                    <div className="zorevi-submitted-panel__heading">
                      <h2>Submitted Application</h2>
                      <span className={`zorevi-status-badge ${statusBadgeClass}`}>{statusLabel}</span>
                    </div>
                    {renderSubmittedDetails()}
                  </section>
                )}
              </div>
            </section>

            <section className="zorevi-support-card" id="designer-status-support">
              <div className="zorevi-support-card__left">
                <span className="zorevi-support-card__icon"><Mail size={21} /></span>
                <div>
                  <h2>Need assistance with your verification?</h2>
                  <p>Our onboarding support team can help with application questions. Demo contact details:</p>
                </div>
              </div>
              <div className="zorevi-support-card__contacts">
                <a className="zorevi-support-pill" href="mailto:support@zorevi.example"><Mail size={15} />support@zorevi.example <small>Demo</small></a>
                <a className="zorevi-support-pill" href="tel:+910000000000"><Phone size={15} />+91 00000 00000 <small>Demo</small></a>
              </div>
            </section>

            <section className="zorevi-status-simulator" aria-label="Approval state demo simulator">
              <div className="zorevi-status-simulator__label"><AlertCircle size={16} /> Interactive Simulator: Test Different Approval States</div>
              <div className="zorevi-status-simulator__btns">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    className={`zorevi-sim-btn ${simulatedStatus === option.id ? 'active' : ''}`}
                    type="button"
                    key={option.id}
                    aria-pressed={simulatedStatus === option.id}
                    onClick={() => setSimulatedStatus(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="zorevi-status-simulator__hint">Demo/testing only. Changing the simulator does not update the saved application.</p>
            </section>
          </>
        )}

        {!loading && !application && (
          <section className="zorevi-status-empty">
            <span className="zorevi-status-empty__icon">{error ? <AlertCircle size={25} /> : <FileCheck2 size={25} />}</span>
            <h1>{error ? 'Application not found' : 'Check your application status'}</h1>
            <p>{error || 'Enter your application ID to retrieve its saved status from this browser.'}</p>
            <form className="designer-status-search" onSubmit={handleLookup}>
              <label htmlFor="application-id-lookup">Application ID</label>
              <div>
                <input id="application-id-lookup" value={applicationId} onChange={(event) => setApplicationId(event.target.value)} placeholder="e.g. DSN-2026-482731" autoComplete="off" />
                <button type="submit" className="zorevi-btn zorevi-btn--primary" disabled={!applicationId.trim()}>
                  Search <ArrowRight size={16} />
                </button>
              </div>
            </form>
            <Link to="/designer/apply" className="zorevi-status-empty__back">Return to designer application</Link>
          </section>
        )}
      </main>
    </div>
  );
}
