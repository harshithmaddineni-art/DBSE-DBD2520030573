export const calculateSLA = (createdAt, priority = 'Medium', status = 'Submitted') => {
  if (!createdAt) {
    return {
      deadline: 'N/A',
      isOverdue: false,
      statusText: 'N/A',
      badgeClass: '',
      slaLabel: '5 Days',
    };
  }

  const created = new Date(createdAt);
  const p = priority?.toLowerCase() || 'medium';

  // SLA Hours mapping
  let slaHours = 120; // Default Medium: 5 Days (120 hrs)
  let slaLabel = '5 Days SLA';

  if (p === 'urgent') {
    slaHours = 24; // 24 Hours
    slaLabel = '24 Hrs SLA';
  } else if (p === 'high') {
    slaHours = 72; // 3 Days
    slaLabel = '3 Days SLA';
  } else if (p === 'medium') {
    slaHours = 120; // 5 Days
    slaLabel = '5 Days SLA';
  } else if (p === 'low') {
    slaHours = 168; // 7 Days
    slaLabel = '7 Days SLA';
  }

  const deadline = new Date(created.getTime() + slaHours * 60 * 60 * 1000);
  const now = new Date();
  const isResolved = status === 'Resolved' || status === 'Closed';

  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffHours / 24);

  const formattedDeadline = deadline.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isResolved) {
    return {
      deadline: formattedDeadline,
      isOverdue: false,
      statusText: '✅ Resolved within Target SLA',
      badgeClass: 'badge-sla-resolved',
      slaLabel,
      slaHours,
    };
  }

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays) || 1;
    return {
      deadline: formattedDeadline,
      isOverdue: true,
      statusText: `⚠️ OVERDUE by ${overdueDays} day(s) (Target: ${formattedDeadline})`,
      remainingText: `Overdue by ${overdueDays} d`,
      badgeClass: 'badge-sla-overdue',
      slaLabel,
      slaHours,
    };
  }

  let remainingText = `${diffHours} hrs remaining`;
  if (diffHours >= 24) {
    remainingText = `${diffDays} day(s) remaining`;
  }

  return {
    deadline: formattedDeadline,
    isOverdue: false,
    statusText: `⏱️ Target Deadline: ${formattedDeadline} (${remainingText})`,
    remainingText,
    badgeClass: 'badge-sla-ontrack',
    slaLabel,
    slaHours,
  };
};
