import { KIDS_API } from '@/shared/api/kids';

export { KIDS_API };
export const KIDS_BASE = '/kids';
export const kidsPath = (sub = ''): string => `${KIDS_BASE}${sub}`;
