import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { DestinationId, NavigationState } from '../../types/portfolio';
import { ContactCard } from './ContactCard';

export interface FloatingContentPanelProps {
  navState: NavigationState;
  onSelectDestination: (id: DestinationId) => void;
  onOpenProjectDetail: (
    projectId: string,
    triggerElement: HTMLButtonElement | null
  ) => void;
}

/**
 * Adaptive Floating Content Panel.
 * Opens only when the vehicle has physically arrived at a destination; remains closed during transit.
 * Positioned on the left or right according to the destination's camera composition preset.
 */
export const FloatingContentPanel: React.FC<FloatingContentPanelProps> = ({
  navState,
  onSelectDestination,
  onOpenProjectDetail,
}) => {
  const { portfolioData, destinations, getDestinationById } = usePortfolioData();
  const [selectedSkillGroupId, setSelectedSkillGroupId] =
    useState<string>('all');

  // Panel must remain closed while the vehicle is travelling or during initial loading/reveal
  if (
    navState.isTravelling ||
    !navState.visiblePanel ||
    navState.phase === 'loading' ||
    navState.phase === 'reveal'
  ) {
    return null;
  }

  const destination = getDestinationById(navState.visiblePanel);
  const nextIndex = (destination.order + 1) % destinations.length;
  const prevIndex =
    (destination.order - 1 + destinations.length) % destinations.length;
  const nextDestination = destinations[nextIndex];
  const prevDestination = destinations[prevIndex];

  const renderSectionContent = () => {
    switch (destination.id) {
      case 'intro': {
        const { persona } = portfolioData;
        return (
          <div className="panel-section-intro" data-testid="panel-content-intro">
            <div className="intro-hero-graphic" aria-hidden="true">
              <svg viewBox="0 0 360 76" className="intro-pastel-svg">
                <defs>
                  <linearGradient id="introGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5ec2b7" stopOpacity="0.35" />
                    <stop offset="50%" stopColor="#9b8ce8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f29b8e" stopOpacity="0.35" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="356" height="72" rx="14" fill="url(#introGrad)" />
                <path
                  d="M 24 54 C 85 18, 140 62, 200 32 C 250 10, 295 48, 338 22"
                  fill="none"
                  stroke="#5ec2b7"
                  strokeWidth="3"
                  strokeDasharray="5 4"
                />
                <circle cx="24" cy="54" r="5" fill="#ff8575" />
                <circle cx="96" cy="36" r="4" fill="#9b8ce8" />
                <circle cx="165" cy="44" r="4" fill="#6ab7e8" />
                <circle cx="228" cy="24" r="4" fill="#f29b8e" />
                <circle cx="285" cy="35" r="4" fill="#b392f0" />
                <circle cx="338" cy="22" r="5" fill="#67ccb8" />
              </svg>
            </div>

            <div className="persona-identity-block">
              <span className="persona-badge">{persona.availabilityBadge}</span>
              <h2 className="persona-name">{persona.name}</h2>
              <p className="persona-role">{persona.role}</p>
              <p className="persona-spec">{persona.specialization}</p>
            </div>

            <p className="panel-headline">{persona.introHeadline}</p>
            <p className="panel-body-text">{persona.introLead}</p>

            <div className="intro-highlights-grid">
              {persona.introHighlights.map((item) => (
                <div key={item.label} className="intro-highlight-chip">
                  <span className="highlight-label">{item.label}</span>
                  <span className="highlight-value">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="demo-notice-banner" role="note">
              <span className="demo-notice-pill">DEMO NOTICE</span>
              <span>{portfolioData.demonstrationNotice}</span>
            </div>

            <div className="panel-cta-row">
              <button
                type="button"
                className="pastel-action-btn is-primary"
                onClick={() => onSelectDestination('about')}
                data-testid="intro-start-journey-btn"
              >
                Start Journey → 02 About
              </button>
              <button
                type="button"
                className="pastel-action-btn is-secondary"
                onClick={() => onSelectDestination('projects')}
                data-testid="intro-jump-projects-btn"
              >
                Jump to 04 Projects
              </button>
            </div>
          </div>
        );
      }

      case 'about': {
        const { about } = portfolioData;
        return (
          <div className="panel-section-about" data-testid="panel-content-about">
            <p className="panel-headline">{about.headline}</p>
            {about.narrative.map((para, i) => (
              <p key={i} className="panel-body-text">
                {para}
              </p>
            ))}

            <div className="about-pillars-list">
              {about.pillars.map((pillar) => (
                <div key={pillar.title} className="about-pillar-card">
                  <div className="about-pillar-header">
                    <h3 className="about-pillar-title">{pillar.title}</h3>
                    <span className="about-pillar-metric">{pillar.metric}</span>
                  </div>
                  <p className="about-pillar-desc">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'skills': {
        const groups =
          selectedSkillGroupId === 'all'
            ? portfolioData.skillGroups
            : portfolioData.skillGroups.filter(
                (g) => g.id === selectedSkillGroupId
              );

        return (
          <div
            className="panel-section-skills"
            data-testid="panel-content-skills"
          >
            <div
              className="skills-filter-bar"
              role="tablist"
              aria-label="Filter skill categories"
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedSkillGroupId === 'all'}
                className={`skill-filter-chip ${
                  selectedSkillGroupId === 'all' ? 'is-active' : ''
                }`}
                onClick={() => setSelectedSkillGroupId('all')}
                data-testid="skill-filter-all"
              >
                All Domains ({portfolioData.skillGroups.length})
              </button>
              {portfolioData.skillGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedSkillGroupId === group.id}
                  className={`skill-filter-chip ${
                    selectedSkillGroupId === group.id ? 'is-active' : ''
                  }`}
                  onClick={() => setSelectedSkillGroupId(group.id)}
                  data-testid={`skill-filter-${group.id}`}
                >
                  {group.badge}
                </button>
              ))}
            </div>

            <div className="skill-groups-stack">
              {groups.map((group) => (
                <div key={group.id} className="skill-group-card">
                  <div className="skill-group-header">
                    <span
                      className="skill-group-dot"
                      style={{ backgroundColor: group.accentColor }}
                    />
                    <h3 className="skill-group-title">{group.title}</h3>
                    <span className="skill-group-badge">{group.badge}</span>
                  </div>
                  <p className="skill-group-summary">{group.summary}</p>
                  <div className="skill-items-grid">
                    {group.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className={`skill-item-chip ${
                          skill.highlight ? 'is-highlight' : ''
                        }`}
                      >
                        <div className="skill-item-top">
                          <span className="skill-item-name">{skill.name}</span>
                          <span className="skill-item-level">{skill.level}</span>
                        </div>
                        <span className="skill-item-context">
                          {skill.context}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'projects': {
        return (
          <div
            className="panel-section-projects"
            data-testid="panel-content-projects"
          >
            <p className="panel-body-lead">
              Select any demonstration reference architecture below to inspect
              its system topology, technical challenges, and stack in the
              overlay modal.
            </p>

            <div className="projects-gallery-stack">
              {portfolioData.projects.map((project) => (
                <article
                  key={project.id}
                  className="project-gallery-card"
                  data-testid={`project-card-${project.id}`}
                >
                  <div className="project-card-top">
                    <span
                      className="project-category-pill"
                      style={{
                        borderColor: project.accentColor,
                      }}
                    >
                      {project.category}
                    </span>
                    <span className="project-timeline-label">
                      {project.timeline}
                    </span>
                  </div>

                  <h3 className="project-card-title">{project.title}</h3>
                  <p className="project-card-summary">{project.shortSummary}</p>

                  <div className="project-tech-pills">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span key={tech} className="tech-mini-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="project-card-footer">
                    <button
                      type="button"
                      className="pastel-action-btn is-primary"
                      onClick={(e) =>
                        onOpenProjectDetail(project.id, e.currentTarget)
                      }
                      data-testid={`open-project-btn-${project.id}`}
                    >
                      Inspect Architecture &amp; Specs →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      }

      case 'experience': {
        return (
          <div
            className="panel-section-experience"
            data-testid="panel-content-experience"
          >
            <div className="experience-timeline">
              {portfolioData.experiences.map((exp) => (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-marker" />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-period">{exp.period}</span>
                      <span className="timeline-location">{exp.location}</span>
                    </div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <div className="timeline-org">
                      {exp.organization} •{' '}
                      <span className="timeline-org-note">
                        {exp.organizationNote}
                      </span>
                    </div>
                    <p className="timeline-summary">{exp.summary}</p>
                    <ul className="timeline-highlights">
                      {exp.highlights.map((hl, idx) => (
                        <li key={idx}>{hl}</li>
                      ))}
                    </ul>
                    <div className="timeline-tech-row">
                      {exp.technologies.map((t) => (
                        <span key={t} className="tech-mini-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'contact':
      default:
        return <ContactCard onSelectDestination={onSelectDestination} />;
    }
  };

  return (
    <aside
      className={`floating-content-panel glass-panel side-${destination.panelSide}`}
      data-testid="floating-content-panel"
      data-destination={destination.id}
      data-panel-side={destination.panelSide}
      aria-label={`${destination.label} destination panel`}
    >
      <div className="panel-header">
        <div className="panel-header-meta">
          <span
            className="panel-step-badge"
            style={{ backgroundColor: destination.accentColor }}
          >
            0{destination.order + 1} • {destination.label.toUpperCase()}
          </span>
          <span className="panel-sculpture-caption">
            Landmark: {destination.sculptureName}
          </span>
        </div>
        <h1 className="panel-title">{destination.subtitle}</h1>
        <p className="panel-tagline">{destination.tagline}</p>
      </div>

      <div className="panel-scroll-body">{renderSectionContent()}</div>

      <footer className="panel-footer-nav">
        <button
          type="button"
          className="panel-route-step-btn"
          onClick={() => onSelectDestination(prevDestination.id)}
          data-testid="panel-prev-destination-btn"
        >
          ← {prevDestination.shortLabel}
        </button>

        <span className="panel-footer-status">
          Parked at u={destination.routeU.toFixed(2)}
        </span>

        <button
          type="button"
          className="panel-route-step-btn is-forward"
          onClick={() => onSelectDestination(nextDestination.id)}
          data-testid="panel-next-destination-btn"
        >
          {nextDestination.shortLabel} →
        </button>
      </footer>
    </aside>
  );
};
