document.querySelector('.heirloom-bags-ad button').addEventListener('click', function() {
    alert('Redirecting to best sellers page!');
});

const searchContainer = document.getElementById('search-container');
const searchIcon = document.getElementById('search-icon');
const searchInput = document.getElementById('search-input');
const closeSearch = document.getElementById('close-search');

searchIcon.addEventListener('click', () => {
  searchContainer.classList.add('active');
  searchInput.focus();
});

closeSearch.addEventListener('click', () => {
  searchContainer.classList.remove('active');
  searchInput.value = '';
});
document.querySelector('button').addEventListener('click', function() {
  alert('Redirecting to our story...');
});


function toggleMobileMenu() {
  const drawer = document.getElementById("mobileDrawer");
  drawer.classList.toggle("open");
}
