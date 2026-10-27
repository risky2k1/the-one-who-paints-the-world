import { DESTINATIONS, PORTFOLIO_DATA } from '../../data/portfolio';
import { DestinationConfig, PortfolioData } from '../../types/portfolio';

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject?: string;
  content: string;
}

export interface ContactMessageResult {
  success: boolean;
  message: string;
}

export interface PortfolioFetchResult {
  data: PortfolioData;
  isLive: boolean;
}

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // In client browser, use relative path (proxied by Next.js rewrites) or explicit public URL
    return process.env.NEXT_PUBLIC_CMS_API_URL || '';
  }
  // In server-side SSR / container environment
  return (
    process.env.CMS_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_CMS_API_URL ||
    'http://localhost:8081'
  );
}

/**
 * Merge CMS destinations with default 3D spatial presets to guarantee
 * 3D road coordinates and camera presets are always present.
 */
function mergeDestinations(
  cmsDestinations: DestinationConfig[] | undefined
): DestinationConfig[] {
  if (!cmsDestinations || cmsDestinations.length === 0) {
    return DESTINATIONS;
  }

  return DESTINATIONS.map((defaultDest) => {
    const override = cmsDestinations.find((d) => d.id === defaultDest.id);
    if (!override) return defaultDest;

    return {
      ...defaultDest,
      ...override,
      cameraPreset: {
        ...defaultDest.cameraPreset,
        ...(override.cameraPreset || {}),
      },
    };
  });
}

/**
 * Fetch portfolio data from Botble CMS with graceful zero-downtime fallback.
 */
export async function fetchPortfolioData(): Promise<PortfolioFetchResult> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/v1/portfolio`;

  try {
    const controller =
      typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller
      ? setTimeout(() => controller.abort(), 4000)
      : null;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller?.signal,
      next: { revalidate: 60 },
    } as RequestInit);

    if (timeoutId) clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.error || !json.data) {
      throw new Error(json.message || 'Malformed API response envelope');
    }

    const remoteData = json.data;

    const mergedData: PortfolioData = {
      isDemonstrationContent: remoteData.isDemonstrationContent ?? true,
      demonstrationNotice:
        remoteData.demonstrationNotice || PORTFOLIO_DATA.demonstrationNotice,
      persona: {
        ...PORTFOLIO_DATA.persona,
        ...(remoteData.persona || {}),
        introHighlights:
          remoteData.persona?.introHighlights ||
          PORTFOLIO_DATA.persona.introHighlights,
      },
      about: {
        ...PORTFOLIO_DATA.about,
        ...(remoteData.about || {}),
        narrative:
          remoteData.about?.narrative || PORTFOLIO_DATA.about.narrative,
        pillars: remoteData.about?.pillars || PORTFOLIO_DATA.about.pillars,
      },
      destinations: mergeDestinations(remoteData.destinations),
      skillGroups:
        remoteData.skillGroups && remoteData.skillGroups.length > 0
          ? remoteData.skillGroups
          : PORTFOLIO_DATA.skillGroups,
      projects:
        remoteData.projects && remoteData.projects.length > 0
          ? remoteData.projects
          : PORTFOLIO_DATA.projects,
      experiences:
        remoteData.experiences && remoteData.experiences.length > 0
          ? remoteData.experiences
          : PORTFOLIO_DATA.experiences,
      contact: {
        ...PORTFOLIO_DATA.contact,
        ...(remoteData.contact || {}),
        channels:
          remoteData.contact?.channels && remoteData.contact.channels.length > 0
            ? remoteData.contact.channels
            : PORTFOLIO_DATA.contact.channels,
      },
    };

    return {
      data: mergedData,
      isLive: true,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(
      `[Portfolio API] Live CMS fetch unavailable (${errorMsg}); activating graceful fallback to default portfolio data.`
    );
    return {
      data: PORTFOLIO_DATA,
      isLive: false,
    };
  }
}

/**
 * Submit contact inquiry to Botble CMS /api/v1/contacts.
 */
export async function sendContactMessage(
  payload: ContactMessagePayload
): Promise<ContactMessageResult> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/v1/contacts`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        subject: payload.subject || 'Portfolio Inquiry',
        content: payload.content,
        agree_terms_and_policy: true,
      }),
    });

    const json = await response.json();

    if (!response.ok || json.error) {
      const errMsg =
        json.message ||
        (json.errors
          ? Object.values(json.errors).flat().join(' ')
          : 'Failed to send message');
      return {
        success: false,
        message: errMsg,
      };
    }

    return {
      success: true,
      message:
        json.message || 'Your message has been received! We will be in touch.',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Network error: ${errorMsg}. Please try copying our contact email directly.`,
    };
  }
}

