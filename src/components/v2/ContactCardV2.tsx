import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { sendContactMessage } from '../../lib/api/portfolioApi';
import { ContactChannel, DestinationId } from '../../types/portfolio';

export interface ContactCardV2Props {
  onSelectDestination: (id: DestinationId) => void;
}

export const ContactCardV2: React.FC<ContactCardV2Props> = ({
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
        message: 'Please complete Name, Email, and Message.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    const result = await sendContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || 'Portfolio Consultation (v2)',
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
    <div className="flex flex-col gap-4 text-slate-800" data-testid="contact-card-v2">
      <p className="text-xs leading-relaxed text-slate-600 font-normal">
        {contact.subtitle}
      </p>

      {/* Tailwind Status Pill Banner */}
      <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50/80 px-3 py-2 text-[11px] text-teal-800 shadow-sm backdrop-blur-sm">
        <span className="rounded bg-teal-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
          CMS TAILWIND v2
        </span>
        <span className="truncate">{contact.availabilityNote}</span>
      </div>

      {/* Interactive Contact Direct Message Form */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/90 bg-white/95 p-4 shadow-sm backdrop-blur-md">
        <div>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Send a Direct Message
          </h3>
          <p className="text-[11px] text-slate-500">
            Messages are delivered directly to the Botble CMS admin panel.
          </p>
        </div>

        {submitResult && (
          <div
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
              submitResult.success
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
            role="alert"
          >
            <span className="font-bold">
              {submitResult.success ? '✓ DELIVERED:' : '⚠ NOTICE:'}
            </span>
            <span className="text-[11px]">{submitResult.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <label htmlFor="v2-contact-name" className="text-[11px] font-semibold text-slate-600">
                Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="v2-contact-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="v2-contact-email" className="text-[11px] font-semibold text-slate-600">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="v2-contact-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="v2-contact-subject" className="text-[11px] font-semibold text-slate-600">
              Subject
            </label>
            <input
              id="v2-contact-subject"
              type="text"
              placeholder="e.g. Architecture consulting or project collaboration"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="v2-contact-message" className="text-[11px] font-semibold text-slate-600">
              Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="v2-contact-message"
              rows={3}
              placeholder="Write your note or question here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center self-start rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            data-testid="v2-contact-submit-btn"
          >
            {isSubmitting ? 'Sending to CMS...' : 'Send Message →'}
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="relative my-1 flex items-center justify-center">
        <div className="w-full border-t border-slate-200/80"></div>
        <span className="absolute bg-white/90 px-2 text-[9px] font-bold text-slate-400 tracking-wider uppercase">
          Or Direct Channels
        </span>
      </div>

      {/* Channels List */}
      <div className="flex flex-col gap-2">
        {contact.channels.map((channel) => {
          const isCopied = copiedId === channel.id;
          return (
            <div
              key={channel.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-3 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate">
                  {channel.label}
                </span>
                <code className="text-[11px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded self-start truncate max-w-full">
                  {channel.value}
                </code>
                <span className="text-[10px] text-slate-400">
                  {channel.note}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleChannelAction(channel)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  channel.actionType !== 'copy'
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {channel.actionType === 'copy'
                  ? isCopied
                    ? 'Copied ✓'
                    : 'Copy Value'
                  : channel.actionType === 'jump_projects'
                  ? 'Drive to 04 →'
                  : 'Return to 01 ↺'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
