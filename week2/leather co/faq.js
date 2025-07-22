// Select all FAQ headers
document.querySelectorAll('.faq-item h2').forEach(header => {
  header.addEventListener('click', function () {
    const currentItem = this.parentElement;
    const currentIcon = this.querySelector('i');
    const currentAnswer = currentItem.querySelector('.answer');

    const isActive = currentItem.classList.contains('active');

    // Close all items first
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
      item.querySelector('.answer').style.maxHeight = null;
      const icon = item.querySelector('i');
      icon.classList.remove('fa-chevron-down');
      icon.classList.add('fa-chevron-right');
    });

    // If the clicked item was not active, open it
    if (!isActive) {
      currentItem.classList.add('active');
      currentAnswer.style.maxHeight = currentAnswer.scrollHeight + "px";
      currentIcon.classList.remove('fa-chevron-right');
      currentIcon.classList.add('fa-chevron-down');
    }
  });
});
