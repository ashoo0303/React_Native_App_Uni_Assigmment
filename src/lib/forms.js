const FORMSPREE_URL = 'https://formspree.io/f/xyezrlrq';

export async function postFormspree(fields) {
  const body = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    body.append(key, String(value));
  });

  let response;
  try {
    response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new Error('Network error. Please check your connection and try again.');
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const detail = Array.isArray(data.errors) ? data.errors.map((entry) => entry.message).join(' ') : '';
    throw new Error(detail || 'Sorry, we could not send your message. Please try again or call us.');
  }
}
