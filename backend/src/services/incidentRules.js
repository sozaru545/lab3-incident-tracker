export const STATUS = {
  OPEN: "OPEN",
  INVESTIGATING: "INVESTIGATING",
  RESOLVED: "RESOLVED",
  ARCHIVED: "ARCHIVED"
};

export function canTransitionStatus(from, to) {
  // original flow
  if (from === STATUS.OPEN && to === STATUS.INVESTIGATING) return true;
  if (from === STATUS.INVESTIGATING && to === STATUS.RESOLVED) return true;

  // NEW: archive only from OPEN or RESOLVED
  if ((from === STATUS.OPEN || from === STATUS.RESOLVED) && to === STATUS.ARCHIVED) return true;

  // NEW: reset only from ARCHIVED to OPEN
  if (from === STATUS.ARCHIVED && to === STATUS.OPEN) return true;

  return false;
}
