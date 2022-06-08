
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#search-form');
    form.addEventListener('submit', performSearch);
})

function performSearch(event) {
    event.preventDefault();
    let endpoint;
    const searchInput = document.querySelector('#search_bar');
    const dropdown = document.querySelector('#search-categories');
    switch (dropdown.value) {
        case 'city':
            endpoint =`https://api.openbrewerydb.org/breweries?by_city=${searchInput.value}&per_page=all`;
            break;
        case 'state':
            endpoint =`https://api.openbrewerydb.org/breweries?by_state=${searchInput.value}&per_page=all`;
            break;
        case 'zipcode':
            endpoint =`https://api.openbrewerydb.org/breweries?by_postal=${searchInput.value}&per_page=all`;
             break;
        case 'term':
            endpoint = `https://api.openbrewerydb.org/breweries/search?query=${searchInput.value}&per_page=all`;
    }

    //TODO: fetch and display search results
    document.querySelector('#search-form').reset();
};


