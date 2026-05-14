function monthKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function monthLabel(key) {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit" }).format(
    new Date(year, month - 1, 1)
  );
}

function getRecordDate(item) {
  if (item?.createdAt) {
    const fromCreatedAt = new Date(item.createdAt);
    if (!Number.isNaN(fromCreatedAt.getTime())) {
      return fromCreatedAt;
    }
  }
  if (item?.date) {
    const fromDate = new Date(item.date);
    if (!Number.isNaN(fromDate.getTime())) {
      return fromDate;
    }
  }
  return null;
}

function toSafeNumber(value) {
  return Number.isFinite(value) ? value : 0;
}

function buildMonthlyBuckets() {
  const now = new Date();
  const buckets = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const point = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    buckets.push({
      key: monthKey(point),
      label: monthLabel(monthKey(point)),
      news: 0,
      contacts: 0,
      subscribers: 0
    });
  }

  return buckets;
}

function tallyByCategory(items) {
  const counts = new Map();

  items.forEach((item) => {
    const category = (item?.category || "General").trim() || "General";
    counts.set(category, (counts.get(category) || 0) + 1);
  });

  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function isCurrentMonth(date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

export function buildDashboardMetrics({ newsItems, contactMessages, subscribers }) {
  const monthly = buildMonthlyBuckets();
  const monthlyMap = new Map(monthly.map((item) => [item.key, item]));

  let thisMonthNews = 0;
  let thisMonthContacts = 0;
  let thisMonthSubscribers = 0;

  newsItems.forEach((item) => {
    const date = getRecordDate(item);
    if (!date) {
      return;
    }
    const key = monthKey(date);
    const bucket = monthlyMap.get(key);
    if (bucket) {
      bucket.news += 1;
    }
    if (isCurrentMonth(date)) {
      thisMonthNews += 1;
    }
  });

  contactMessages.forEach((item) => {
    const date = getRecordDate(item);
    if (!date) {
      return;
    }
    const key = monthKey(date);
    const bucket = monthlyMap.get(key);
    if (bucket) {
      bucket.contacts += 1;
    }
    if (isCurrentMonth(date)) {
      thisMonthContacts += 1;
    }
  });

  subscribers.forEach((item) => {
    const date = getRecordDate(item);
    if (!date) {
      return;
    }
    const key = monthKey(date);
    const bucket = monthlyMap.get(key);
    if (bucket) {
      bucket.subscribers += 1;
    }
    if (isCurrentMonth(date)) {
      thisMonthSubscribers += 1;
    }
  });

  const totalNews = newsItems.length;
  const totalContacts = contactMessages.length;
  const totalSubscribers = subscribers.length;
  const totalEngagement = totalContacts + totalSubscribers;
  const thisMonthTotal = thisMonthNews + thisMonthContacts + thisMonthSubscribers;

  const kpis = [
    {
      key: "news",
      label: "News Published",
      value: totalNews,
      helper: `${thisMonthNews} published this month`
    },
    {
      key: "contacts",
      label: "Contact Leads",
      value: totalContacts,
      helper: `${thisMonthContacts} new this month`
    },
    {
      key: "subscribers",
      label: "Newsletter Subscribers",
      value: totalSubscribers,
      helper: `${thisMonthSubscribers} joined this month`
    },
    {
      key: "engagement",
      label: "Total Engagement",
      value: totalEngagement,
      helper: `${thisMonthTotal} new interactions this month`
    }
  ];

  const trend = monthly.map((item) => ({
    month: item.label,
    news: toSafeNumber(item.news),
    contacts: toSafeNumber(item.contacts),
    subscribers: toSafeNumber(item.subscribers),
    total: toSafeNumber(item.news + item.contacts + item.subscribers)
  }));

  return {
    kpis,
    trend,
    newsByCategory: tallyByCategory(newsItems),
    latestNews: newsItems.slice(0, 5),
    latestContacts: contactMessages.slice(0, 5),
    latestSubscribers: subscribers.slice(0, 5),
    generatedAt: new Date().toISOString()
  };
}
