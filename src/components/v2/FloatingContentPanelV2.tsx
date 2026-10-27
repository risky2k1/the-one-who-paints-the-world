import React, { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { DestinationId, NavigationState } from '../../types/portfolio';
import { ContactCardV2 } from './ContactCardV2';

export interface FloatingContentPanelV2Props {
  navState: NavigationState;
  onSelectDestination: (id: DestinationId) => void;
  onOpenProjectDetail: (
    projectId: string,
    triggerElement: HTMLButtonElement | null
  ) => void;
}

export const FloatingContentPanelV2: React.FC<FloatingContentPanelV2Props> = ({
  navState,
  onSelectDestination,
  onOpenProjectDetail,
}) => {
  const { portfolioData, destinations, getDestinationById } = usePortfolioData();
  const [selectedSkillGroupId, setSelectedSkillGroupId] =
    useState<string>('all');

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
          <div className="flex flex-col gap-3 text-slate-800">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-100 px-3 py-1 text-[11px] font-bold text-teal-800">
                {persona.availabilityBadge}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {persona.location}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                {persona.name}
              </h2>
              <p className="text-xs font-bold text-teal-700">{persona.role}</p>
              <p className="text-[11px] text-slate-500 leading-tight">
                {persona.specialization}
              </p>
            </div>

            <p className="text-sm font-semibold leading-snug text-slate-800 border-l-2 border-teal-400 pl-3 italic">
              &ldquo;{persona.introHeadline}&rdquo;
            </p>

            <p className="text-xs leading-relaxed text-slate-600">
              {persona.introLead}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {persona.introHighlights.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col rounded-lg border border-slate-200/80 bg-slate-50/80 p-2 text-center shadow-xs"
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {item.label}
                  </span>
                  <span className="text-[11px] font-extrabold text-slate-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                className="flex-1 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 active:scale-95 transition-all cursor-pointer"
                onClick={() => onSelectDestination('about')}
              >
                Start Journey → 02 About
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                onClick={() => onSelectDestination('projects')}
              >
                Jump to Projects
              </button>
            </div>
          </div>
        );
      }

      case 'about': {
        const { about } = portfolioData;
        return (
          <div className="flex flex-col gap-3 text-slate-800">
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {about.headline}
            </p>
            {about.narrative.map((para, i) => (
              <p key={i} className="text-xs leading-relaxed text-slate-600">
                {para}
              </p>
            ))}

            <div className="flex flex-col gap-2.5 pt-1">
              {about.pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-xl border border-slate-200/90 bg-white/90 p-3 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900">
                      {pillar.title}
                    </h3>
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                      {pillar.metric}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                    {pillar.description}
                  </p>
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
          <div className="flex flex-col gap-3">
            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedSkillGroupId('all')}
                className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedSkillGroupId === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Domains ({portfolioData.skillGroups.length})
              </button>
              {portfolioData.skillGroups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedSkillGroupId(g.id)}
                  className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedSkillGroupId === g.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {g.badge}
                </button>
              ))}
            </div>

            {/* Groups Stack */}
            <div className="flex flex-col gap-3">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-xl border border-slate-200/90 bg-white/90 p-3.5 shadow-xs flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: group.accentColor }}
                      />
                      <h3 className="text-xs font-bold text-slate-900">
                        {group.title}
                      </h3>
                    </div>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {group.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{group.summary}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {group.skills.map((s) => (
                      <div
                        key={s.name}
                        className={`rounded-lg p-2 border text-[11px] flex flex-col justify-between ${
                          s.highlight
                            ? 'border-teal-200 bg-teal-50/70 text-teal-900'
                            : 'border-slate-100 bg-slate-50/80 text-slate-700'
                        }`}
                      >
                        <span className="font-bold leading-tight">{s.name}</span>
                        <span className="text-[9px] text-slate-400 font-medium">
                          {s.level} • {s.context}
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
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Select any demonstration reference architecture to inspect its topology and stack.
            </p>

            <div className="flex flex-col gap-3">
              {portfolioData.projects.map((project) => (
                <article
                  key={project.id}
                  className="flex flex-col gap-2.5 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm hover:border-teal-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold"
                      style={{
                        borderColor: project.accentColor,
                        color: '#0f766e',
                        backgroundColor: `${project.accentColor}18`,
                      }}
                    >
                      {project.category}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {project.timeline}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {project.shortSummary}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-slate-100/90 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-start">
                    <button
                      type="button"
                      onClick={(e) =>
                        onOpenProjectDetail(project.id, e.currentTarget)
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-teal-500/20 hover:from-teal-600 hover:to-teal-700 active:scale-95 transition-all cursor-pointer"
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
          <div className="flex flex-col gap-3">
            <div className="relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 flex flex-col gap-4">
              {portfolioData.experiences.map((exp) => (
                <div key={exp.id} className="relative flex flex-col gap-1">
                  <div className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full border-2 border-white bg-teal-500 shadow-xs" />
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-teal-700">{exp.period}</span>
                    <span>{exp.location}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{exp.role}</h3>
                  <div className="text-[11px] font-medium text-slate-600">
                    {exp.organization} • <span className="text-slate-400">{exp.organizationNote}</span>
                  </div>
                  <p className="text-xs text-slate-600">{exp.summary}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'contact':
      default:
        return <ContactCardV2 onSelectDestination={onSelectDestination} />;
    }
  };

  const isLeft = destination.panelSide === 'left';

  return (
    <aside
      className={`fixed z-30 rounded-3xl border border-white/80 bg-white/90 p-5 shadow-2xl backdrop-blur-2xl flex flex-col justify-between transition-all duration-300 ${
        isLeft ? 'md:left-6' : 'md:right-6'
      } max-md:inset-x-3 max-md:bottom-3 max-md:top-auto max-md:max-h-[56dvh] md:top-20 md:bottom-6 md:w-[430px]`}
      data-testid="floating-content-panel-v2"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 pb-3 border-b border-slate-200/80 shrink-0">
        <div className="flex items-center justify-between">
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-900 shadow-xs"
            style={{ backgroundColor: destination.accentColor }}
          >
            0{destination.order + 1} • {destination.label}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            Landmark: {destination.sculptureName}
          </span>
        </div>
        <h1 className="text-base font-black text-slate-900 tracking-tight">
          {destination.subtitle}
        </h1>
        <p className="text-xs text-slate-500">{destination.tagline}</p>
      </div>

      {/* Scroll Body */}
      <div className="flex-1 overflow-y-auto py-3 pr-1 text-slate-800">
        {renderSectionContent()}
      </div>

      {/* Footer Nav */}
      <footer className="flex items-center justify-between pt-3 border-t border-slate-200/80 text-xs shrink-0">
        <button
          type="button"
          onClick={() => onSelectDestination(prevDestination.id)}
          className="rounded-xl border border-slate-200 bg-white/90 px-3 py-1.5 font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
        >
          ← {prevDestination.shortLabel}
        </button>

        <span className="text-[10px] font-mono text-slate-400">
          Parked at u={destination.routeU.toFixed(2)}
        </span>

        <button
          type="button"
          onClick={() => onSelectDestination(nextDestination.id)}
          className="rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-3.5 py-1.5 font-bold text-white shadow-xs hover:from-teal-700 hover:to-teal-800 active:scale-95 transition-all cursor-pointer"
        >
          {nextDestination.shortLabel} →
        </button>
      </footer>
    </aside>
  );
};
