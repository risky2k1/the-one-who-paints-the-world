import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { ContactChannel, DestinationId } from '../../types/portfolio';

export interface ContactCardProps {
  onSelectDestination: (id: DestinationId) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  onSelectDestination,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { contact } = PORTFOLIO_DATA;

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

  return (
    <div className="contact-card-section" data-testid="contact-card-section">
      <p className="panel-body-lead">{contact.subtitle}</p>

      <div className="demo-notice-banner" role="note">
        <span className="demo-notice-pill">DEMO CONFIG</span>
        <span>{contact.availabilityNote}</span>
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
                    ? 'Copied Placeholder ✓'
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
