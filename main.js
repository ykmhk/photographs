let allPhotos = [];
let currentFilteredPhotos = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  fetch('data/photos.json')
    .then(res => res.json())
    .then(data => {
      allPhotos = data;
      applyFilter('all');
      setupFilterEvents();
      setupModalEvents();
      setupKeyboardEvents();
    })
    .catch(err => console.error('Error loading photos:', err));
});

function applyFilter(filter) {
  closeModal();

  currentFilteredPhotos = filter === 'all' 
    ? allPhotos 
    : allPhotos.filter(p => p.category === filter);

  renderStream(currentFilteredPhotos);
}

function renderStream(photos) {
  const colLeft = document.getElementById('col-left');
  const colRight = document.getElementById('col-right');
  const countLabel = document.getElementById('photo-count');
  
  colLeft.innerHTML = '';
  colRight.innerHTML = '';
  countLabel.innerText = `${String(photos.length).padStart(3, '0')} ARCHIVES`;

  photos.forEach((photo, index) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML = `
      <div class="photo-wrapper">
        <img src="${photo.url}" alt="Archive photo" loading="lazy">
      </div>
      <div class="photo-meta">
        <span>#${photo.id}</span>
        <span>${photo.categoryName.toLowerCase()}</span>
      </div>
    `;

    card.addEventListener('click', () => openModal(index));

    if (index % 2 === 0) {
      colLeft.appendChild(card);
    } else {
      colRight.appendChild(card);
    }
  });
}


function openModal(index) {
  currentIndex = index;
  updateModalContent();

  const modal = document.getElementById('photo-modal');
  modal.classList.add('active');
  
  document.body.classList.add('modal-open');
}

function updateModalContent() {
  const photo = currentFilteredPhotos[currentIndex];
  if (!photo) return;

  const imgEl = document.getElementById('modal-img');
  imgEl.src = photo.url;
  
  const formattedIndex = String(currentIndex + 1).padStart(3, '0');
  const formattedTotal = String(currentFilteredPhotos.length).padStart(3, '0');
  
  document.getElementById('modal-index').innerText = `${formattedIndex} / ${formattedTotal}`;
  document.getElementById('modal-tag').innerText = photo.categoryName.toLowerCase();
}

function closeModal() {
  const modal = document.getElementById('photo-modal');
  if (modal.classList.contains('active')) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }
}

function showNextPhoto() {
  if (currentFilteredPhotos.length === 0) return;
  currentIndex = (currentIndex + 1) % currentFilteredPhotos.length;
  updateModalContent();
}

function showPrevPhoto() {
  if (currentFilteredPhotos.length === 0) return;
  currentIndex = (currentIndex - 1 + currentFilteredPhotos.length) % currentFilteredPhotos.length;
  updateModalContent();
}


function setupFilterEvents() {
  const filterBtns = document.querySelectorAll('.nav-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      applyFilter(e.target.getAttribute('data-filter'));
    });
  });
}

function setupModalEvents() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  
  document.getElementById('modal-backdrop').addEventListener('click', closeModal);
  
  document.getElementById('modal-next').addEventListener('click', showNextPhoto);
  document.getElementById('modal-prev').addEventListener('click', showPrevPhoto);
}

function setupKeyboardEvents() {
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('photo-modal');
    if (!modal.classList.contains('active')) return;

    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
    if (e.key === 'Escape') closeModal();
  });
}