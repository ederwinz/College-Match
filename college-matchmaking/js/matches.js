/**
 * Matches — show users who mutually liked each other
 */

const matchesList = document.getElementById('matches-list');
const logoutBtn = document.getElementById('logout-btn');

async function requireAuth() {
  const { data: { user } } = await db.auth.getUser();
  if (!user) {
    window.location.href = 'auth.html';
    return null;
  }
  return user;
}

async function fetchMatches(userId) {
  // Get users I liked
  const { data: myLikes } = await db.from('likes').select('to_user_id').eq('from_user_id', userId);
  const likedIds = (myLikes || []).map(l => l.to_user_id);

  if (likedIds.length === 0) return [];

  // Get users who liked me
  const { data: likedMe } = await db.from('likes').select('from_user_id').eq('to_user_id', userId).in('from_user_id', likedIds);
  const matchIds = (likedMe || []).map(l => l.from_user_id);

  if (matchIds.length === 0) return [];

  const { data } = await db.from('profiles').select('id, display_name, bio, year, major, photo_url').in('id', matchIds);
  return data || [];
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderMatch(profile) {
  const yearLabels = { 1: 'Freshman', 2: 'Sophomore', 3: 'Junior', 4: 'Senior', 5: 'Grad' };
  const year = yearLabels[profile.year] || '';
  const photoHtml = profile.photo_url
    ? `<img src="${escapeHtml(profile.photo_url)}" alt="" class="match-photo-img">`
    : '';

  return `
    <div class="match-card">
      <div class="match-photo">${photoHtml}</div>
      <div class="match-info">
        <h3>${escapeHtml(profile.display_name || 'Anonymous')}</h3>
        ${year || profile.major ? `<p class="match-meta">${[year, escapeHtml(profile.major)].filter(Boolean).join(' · ')}</p>` : ''}
        ${profile.bio ? `<p>${escapeHtml(profile.bio)}</p>` : ''}
      </div>
    </div>
  `;
}

logoutBtn.addEventListener('click', async () => {
  await db.auth.signOut();
  window.location.href = 'index.html';
});

(async () => {
  const user = await requireAuth();
  if (!user) return;

  const matches = await fetchMatches(user.id);
  matchesList.innerHTML = matches.length
    ? matches.map(renderMatch).join('')
    : '<p class="no-matches">No matches yet. Keep browsing!</p>';
})();
