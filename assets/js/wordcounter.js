document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector('textarea[name="entry.933649356"]');
    const counter = document.getElementById('charCounter');

    textarea.addEventListener('input', () => {
      const length = textarea.value.length;
      if (length > 250) {
        textarea.value = textarea.value.slice(0, 250);
      }
      counter.textContent = `${textarea.value.length} / 250`;
    });
  });