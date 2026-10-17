/**
 * Subscription Expiration & Status Helper Utilities
 */

export interface PlanExpiryInfo {
  isExpired: boolean;
  isUrgent: boolean; // less than or equal to 3 days remaining
  daysRemaining: number;
  formattedDate: string;
  badgeText: string;
  badgeColor: 'urgent' | 'warning' | 'normal' | 'expired';
}

/**
 * Calculates plan expiry details:
 * - If expired: "Expired on MMM DD, YYYY"
 * - If <= 3 days: "Expires in 3 days", "Expires in 2 days", "Expires in 1 day", "Expires today"
 * - Otherwise: "Expires on MMM DD, YYYY"
 */
export function getPlanExpiryInfo(
  premiumExpiresAt: string | Date | null | undefined,
  now: Date = new Date()
): PlanExpiryInfo | null {
  if (!premiumExpiresAt) return null;

  const expiryDate = new Date(premiumExpiresAt);
  if (isNaN(expiryDate.getTime())) return null;

  const nowMs = now.getTime();
  const expiryMs = expiryDate.getTime();
  const diffMs = expiryMs - nowMs;

  const formattedDate = expiryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (diffMs <= 0) {
    return {
      isExpired: true,
      isUrgent: false,
      daysRemaining: 0,
      formattedDate,
      badgeText: `Expired on ${formattedDate}`,
      badgeColor: 'expired',
    };
  }

  // Calculate days remaining (ceil so that 2 days and 5 hours = 3 days)
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 1) {
    return {
      isExpired: false,
      isUrgent: true,
      daysRemaining,
      formattedDate,
      badgeText: 'Expires in 1 day',
      badgeColor: 'urgent',
    };
  }

  if (daysRemaining <= 3) {
    return {
      isExpired: false,
      isUrgent: true,
      daysRemaining,
      formattedDate,
      badgeText: `Expires in ${daysRemaining} days`,
      badgeColor: 'urgent',
    };
  }

  return {
    isExpired: false,
    isUrgent: false,
    daysRemaining,
    formattedDate,
    badgeText: `Expires on ${formattedDate}`,
    badgeColor: 'normal',
  };
}
