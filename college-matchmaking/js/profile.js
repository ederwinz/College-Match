/**
 * Profile — load and save user profile, photo upload to Supabase Storage
 */

const form = document.getElementById('profile-form');
const messageEl = document.getElementById('profile-message');
const logoutBtn = document.getElementById('logout-btn');
const photoInput = document.getElementById('photo-input');
const photoBtn = document.getElementById('photo-btn');
const photoPreview = document.getElementById('photo-preview');

let pendingPhotoFile = null;

function showMessage(text, type = '') {
  messageEl.textContent = text;
  messageEl.className = 'auth-message ' + type;
}

function updatePhotoPreview(url, file) {
  photoPreview.innerHTML = '';
  if (url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Profile photo';
    img.className = 'photo-preview-img';
    photoPreview.appendChild(img);
  } else if (file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = 'Preview';
    img.className = 'photo-preview-img';
    photoPreview.appendChild(img);
  }
}

photoBtn.addEventListener('click', () => photoInput.click());

photoInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showMessage('Please choose an image (JPEG, PNG, or WebP).', 'error');
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    showMessage('Image must be under 2MB.', 'error');
    return;
  }
  pendingPhotoFile = file;
  updatePhotoPreview(null, file);
  showMessage('');
});

async function loadProfile() {
  const { data: { user } } = await db.auth.getUser();
  if (!user) {
    window.location.href = 'auth.html';
    return;
  }

  const { data } = await db.from('profiles').select('*').eq('id', user.id).single();

  if (data) {
    document.getElementById('display_name').value = data.display_name || '';
    document.getElementById('bio').value = data.bio || '';
    document.getElementById('year').value = data.year || '';
    document.getElementById('major').value = data.major || '';
    document.getElementById('interests').value = Array.isArray(data.interests) ? data.interests.join(', ') : (data.interests || '');
    if (data.photo_url) updatePhotoPreview(data.photo_url);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return;

  showMessage('Saving...');
  let photoUrl = null;

  if (pendingPhotoFile) {
    const ext = pendingPhotoFile.name.split('.').pop() || 'jpg';
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await db.storage
      .from('avatars')
      .upload(path, pendingPhotoFile, { upsert: true });
    if (uploadError) {
      showMessage(uploadError.message || 'Photo upload failed.', 'error');
      return;
    }
    const { data: { publicUrl } } = db.storage.from('avatars').getPublicUrl(path);
    photoUrl = publicUrl;
    pendingPhotoFile = null;
  }

  const interests = document.getElementById('interests').value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const updates = {
    display_name: document.getElementById('display_name').value.trim(),
    bio: document.getElementById('bio').value.trim(),
    year: document.getElementById('year').value || null,
    major: document.getElementById('major').value.trim() || null,
    interests,
    updated_at: new Date().toISOString()
  };
  if (photoUrl !== null) updates.photo_url = photoUrl;

  const { error } = await db.from('profiles').update(updates).eq('id', user.id);

  if (error) {
    showMessage(error.message, 'error');
    return;
  }
  showMessage('Profile saved!', 'success');
});

logoutBtn.addEventListener('click', async () => {
  await db.auth.signOut();
  window.location.href = 'index.html';
});

loadProfile();
