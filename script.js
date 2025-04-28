function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
   
    // Show loading indicator
    resultsDiv.innerHTML = '';
    loadingDiv.classList.remove('d-none');
   
    // Fetch data from the JSON endpoint
    fetch('https://raw.githubusercontent.com/VherThing16/json1/refs/heads/main/json1/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loadingDiv.classList.add('d-none');
           
            if (!searchTerm) {
                resultsDiv.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-info-circle"></i>
                        <h5>Please enter a title or author name to search</h5>
                    </div>
                `;
                return;
            }
           
            // Access the books array from the data
            const books = data.books || [];
           
            const filteredBooks = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm)
            );
           
            displayResults(filteredBooks);
        })
        .catch(error => {
            loadingDiv.classList.add('d-none');
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle text-danger"></i>
                    <h5>Error loading books</h5>
                    <p class="text-muted">${error.message}</p>
                </div>
            `;
            console.error('Error fetching data:', error);
        });
}

function displayResults(books) {
    const resultsDiv = document.getElementById('results');
   
    if (books.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <i class="fas fa-book"></i>
                <h5>No books found</h5>
                <p class="text-muted">Try a different search term</p>
            </div>
        `;
        return;
    }
   
    let html = `
        <table class="table book-table table-hover">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;
   
    books.forEach(book => {
        const statusText = book.status ? 'Available' : 'Checked Out';
        const statusClass = book.status ? 'text-success' : 'text-danger';
        const statusIcon = book.status ? 'fa-check-circle' : 'fa-times-circle';
       
        html += `
            <tr>
                <td>
                    <strong>${book.title || 'N/A'}</strong>
                </td>
                <td>
                    ${book.author || 'N/A'}
                </td>
                <td>
                    ${book.genre || 'N/A'}
                </td>
                <td>
                    <span class="${statusClass}">
                        <i class="fas ${statusIcon} me-2"></i>
                        ${statusText}
                    </span>
                </td>
            </tr>
        `;
    });
   
    html += `
            </tbody>
        </table>
    `;
   
    resultsDiv.innerHTML = html;
}