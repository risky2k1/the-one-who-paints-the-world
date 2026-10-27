import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { sendContactMessage } from '../../lib/api/portfolioApi';
import { ContactChannel, DestinationId } from '../../types/portfolio';

export interface ContactCardProps {
  onSelectDestination: (id: DestinationId) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  onSelectDestination,
}) => {
  const { portfolioData } = usePortfolioData();
  const { contact } = portfolioData;

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      // Fallback handled silently
    }
    setCopiedId(id);
    window.setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2200);
  };

  const handleChannelAction = (channel: ContactChannel) => {
    if (channel.actionType === 'copy') {
      copyToClipboard(channel.value, channel.id);
    } else if (channel.actionType === 'jump_projects') {
      onSelectDestination('projects');
    } else if (channel.actionType === 'return_intro') {
      onSelectDestination('intro');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) {
      setSubmitResult({
        success: false,
        message: 'Please complete all required fields (Name, Email, and Message).',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    const result = await sendContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || 'Portfolio Consultation',
      content: content.trim(),
    });

    setIsSubmitting(false);
    setSubmitResult(result);

    if (result.success) {
      setName('');
      setEmail('');
      setSubject('');
      setContent('');
    }
  };

  return (
    <div className="contact-card-section" data-testid="contact-card-section">
      <p className="panel-body-lead">{contact.subtitle}</p>

      <div className="demo-notice-banner" role="note">
        <span className="demo-notice-pill">CMS CONNECTED</span>
        <span>{contact.availabilityNote}</span>
      </div>

      {/* Interactive Contact Form */}
      <div className="contact-form-box">
        <h3 className="contact-form-heading">Send a Direct Message</h3>
        <p className="contact-form-subheading">
          Leave a note below and your message will be forwarded directly to the CMS admin panel.
        </p>

        {submitResult && (
          <div
            className={`contact-alert-banner ${
              submitResult.success ? 'is-success' : 'is-error'
            }`}
            role="alert"
          >
            <span className="alert-badge">
              {submitResult.success ? '✓ DELIVERED' : '⚠ NOTICE'}
            </span>
            <span className="alert-text">{submitResult.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-direct-form" noValidate>
          <div className="form-row-duo">
            <div className="form-group">
              <label htmlFor="contact-name" className="form-field-label">
                Name <span className="field-required">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                className="pastel-text-input"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email" className="form-field-label">
                Email <span className="field-required">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                className="pastel-text-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contact-subject" className="form-field-label">
              Subject
            </label>
            <input
              id="contact-subject"
              type="text"
              className="pastel-text-input"
              placeholder="e.g. Architecture review, contract, or inquiry"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message" className="form-field-label">
              Message <span className="field-required">*</span>
            </label>
            <textarea
              id="contact-message"
              className="pastel-textarea-input"
              rows={3}
              placeholder="Write your note or question here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <button
            type="submit"
            className="pastel-action-btn is-primary form-submit-btn"
            disabled={isSubmitting}
            data-testid="contact-form-submit-btn"
          >
            {isSubmitting ? 'Sending to CMS...' : 'Send Message →'}
          </button>
        </form>
      </div>

      <div className="contact-divider">
        <span>OR CONNECT VIA DIRECT CHANNELS</span>
      </div>

      <div className="contact-channel-list">
        {contact.channels.map((channel) => {
          const isCopied = copiedId === channel.id;
          return (
            <div key={channel.id} className="contact-channel-item">
              <div className="contact-channel-info">
                <span className="contact-channel-label">{channel.label}</span>
                <code className="contact-channel-value">{channel.value}</code>
                <span className="contact-channel-note">{channel.note}</span>
              </div>
              <button
                type="button"
                className={`pastel-action-btn ${
                  channel.actionType !== 'copy' ? 'is-primary' : 'is-secondary'
                }`}
                onClick={() => handleChannelAction(channel)}
                data-testid={`contact-action-${channel.id}`}
              >
                {channel.actionType === 'copy'
                  ? isCopied
                    ? 'Copied Address ✓'
                    : 'Copy Value'
                  : channel.actionType === 'jump_projects'
                  ? 'Drive to Projects →'
                  : 'Return to Intro ↺'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
