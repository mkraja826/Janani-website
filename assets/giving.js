(() => {
  const config = window.JANANI_PUBLIC_CONFIG || {};
  const state = document.querySelector('[data-giving-state]');
  const rows = document.querySelector('[data-giving-rows]');
  const total = document.querySelector('[data-giving-total]');
  const organisations = document.querySelector('[data-giving-organisations]');
  const transfers = document.querySelector('[data-giving-transfers]');
  const latest = document.querySelector('[data-giving-latest]');

  const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(Number(value || 0));

  const safeText = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[character]));

  function showMessage(message) {
    if (state) state.textContent = message;
  }

  if (!config.givingLiveEnabled) {
    showMessage('No verified donations have been published yet. The live ledger will activate only after Janani completes, verifies and reconciles its first donation.');
    return;
  }

  if (!config.supabaseUrl || !config.supabasePublishableKey) {
    showMessage('The transparency ledger is temporarily unavailable. No donation figures will be estimated or fabricated.');
    return;
  }

  const endpoint = `${config.supabaseUrl.replace(/\/$/, '')}/rest/v1/public_giving_ledger?select=organisation_name,cause,amount_inr,transferred_at,verification_status,public_reference&order=transferred_at.desc`;

  fetch(endpoint, {
    headers: {
      apikey: config.supabasePublishableKey,
      Authorization: `Bearer ${config.supabasePublishableKey}`,
      Accept: 'application/json'
    }
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Giving API returned ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const published = Array.isArray(data) ? data.filter((entry) => entry.verification_status === 'verified') : [];
      const donated = published.reduce((sum, entry) => sum + Number(entry.amount_inr || 0), 0);
      const ngos = new Set(published.map((entry) => entry.organisation_name).filter(Boolean));

      if (total) total.textContent = formatCurrency(donated);
      if (organisations) organisations.textContent = String(ngos.size);
      if (transfers) transfers.textContent = String(published.length);
      if (latest) latest.textContent = published[0]?.transferred_at ? new Date(published[0].transferred_at).toLocaleDateString('en-IN') : '—';

      if (!published.length) {
        showMessage('No verified donations have been published yet.');
        return;
      }

      if (state) state.remove();
      if (rows) rows.innerHTML = published.map((entry) => `
        <tr>
          <td>${safeText(entry.organisation_name)}</td>
          <td>${safeText(entry.cause)}</td>
          <td>${formatCurrency(entry.amount_inr)}</td>
          <td>${safeText(new Date(entry.transferred_at).toLocaleDateString('en-IN'))}</td>
          <td><span class="badge">Verified</span></td>
          <td>${safeText(entry.public_reference || '—')}</td>
        </tr>`).join('');
    })
    .catch(() => showMessage('The transparency ledger is temporarily unavailable. Janani will not display unverified or estimated donation figures.'));
})();
