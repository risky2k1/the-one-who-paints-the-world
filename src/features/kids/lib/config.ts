import { KIDS_API } from '@/shared/api/kids';
import { PATHS } from '@/shared/config/paths';

export { KIDS_API };
export const KIDS_BASE = PATHS.kids.root;
export const kidsPath = (sub = ''): string => `${KIDS_BASE}${sub}`;
