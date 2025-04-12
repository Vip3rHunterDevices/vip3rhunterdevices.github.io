const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0SuNhOLgutSeLFdGnn9RmqJWAxs6wA0dxyheqZeEhm3ieTFwRlN_FMxJQEOWgxb00P0w4jWbXK6J/pub?output=csv';

fetch(sheetUrl)
  .then(res => res.text())
  .then(data => {
    Papa.parse(data, {
        header: false, // Don't treat the first row as headers
        skipEmptyLines: true, // Skip empty rows
        complete: function(results) {
        const rows = results.data.slice(1); // Skip header row
        const reviews = rows.map(row => {

            return `
                <div class="review-gs">
                    <p class="user-name">👤User : ${row[1]}</p>
                    <p class="country">🌍 ${row[3]}</p>
                    <p class="device">📲 Device : ${row[2]}</p>
                    <p class="email">📧 Email :  ${row[8]}</p>
                    <p class="stars">⭐ Rating : ${row[5]}</p>
                    <p class="review-text">📝 Review : ${row[6]}</p>
                </div>
            `;
        });

        const reviewTrack = document.getElementById('review-carousel');
        reviewTrack.innerHTML = reviews.concat(reviews).join('');
    }
    });
  });