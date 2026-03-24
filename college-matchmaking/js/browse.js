/**
 * Browse — swipe through profiles, like/pass
 */

const cardContainer = document.getElementById('card-container');
const emptyState = document.getElementById('empty-state');
const passBtn = document.getElementById('pass-btn');
const likeBtn = document.getElementById('like-btn');
const logoutBtn = document.getElementById('logout-btn');

let currentProfiles = [];
let currentIndex = 0;

async function requireAuth() {
  const { data: { user } } = await db.auth.getUser();
  if (!user) {
    window.location.href = 'auth.html';
    return null;
  }
  return user;
}

async function fetchProfiles(userId) {
  // Get IDs we've already liked or passed (for now we only track likes)
  const { data: myLikes } = await db.from('likes').select('to_user_id').eq('from_user_id', userId);
  const likedIds = (myLikes || []).map(l => l.to_user_id);

  const { data } = await db
    .from('profiles')
    .select('id, display_name, bio, year, major, interests, photo_url')
    .neq('id', userId)
    .limit(20);

  return (data || []).filter(p => !likedIds.includes(p.id));
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderCard(profile) {
  const yearLabels = { 1: 'Freshman', 2: 'Sophomore', 3: 'Junior', 4: 'Senior', 5: 'Grad' };
  const year = yearLabels[profile.year] || '';
  const interests = Array.isArray(profile.interests) ? profile.interests.map(escapeHtml).join(' · ') : '';
  const photoHtml = profile.photo_url
    ? `<img src="${escapeHtml(profile.photo_url)}" alt="" class="card-photo-img">`
    : '';

  return `
    <div class="swipe-card" data-id="${escapeHtml(profile.id)}">
      <div class="card-photo">${photoHtml}</div>
      <div class="card-info">
        <h3>${escapeHtml(profile.display_name || 'Anonymous')}</h3>
        ${year ? `<p class="card-meta">${year}${profile.major ? ` · ${escapeHtml(profile.major)}` : ''}</p>` : ''}
        ${profile.bio ? `<p class="card-bio">${escapeHtml(profile.bio)}</p>` : ''}
        ${interests ? `<p class="card-interests">${interests}</p>` : ''}
      </div>
    </div>
  `;
}

async function showNext() {
  if (currentIndex >= currentProfiles.length) {
    const user = await requireAuth();
    if (!user) return;
    currentProfiles = await fetchProfiles(user.id);
    currentIndex = 0;
  }

  if (currentProfiles.length === 0) {
    cardContainer.innerHTML = '';
    emptyState.style.display = 'block';
    passBtn.disabled = true;
    likeBtn.disabled = true;
    return;
  }

  const profile = currentProfiles[currentIndex];
  cardContainer.innerHTML = renderCard(profile);
}

async function like() {
  const user = await requireAuth();
  if (!user || currentProfiles.length === 0) return;

  const profile = currentProfiles[currentIndex];
  await db.from('likes').insert({ from_user_id: user.id, to_user_id: profile.id });
  currentIndex++;
  showNext();
}

async function pass() {
  if (currentProfiles.length === 0) return;
  currentIndex++;
  showNext();
}

passBtn.addEventListener('click', pass);
likeBtn.addEventListener('click', like);

logoutBtn.addEventListener('click', async () => {
  await db.auth.signOut();
  window.location.href = 'index.html';
});

(async () => {
  const user = await requireAuth();
  if (user) showNext();
})();
