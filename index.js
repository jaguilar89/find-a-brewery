
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
            endpoint = `https://api.openbrewerydb.org/breweries?by_city=${searchInput.value}&per_page=all`;
            break;
        case 'state':
            endpoint = `https://api.openbrewerydb.org/breweries?by_state=${searchInput.value}&per_page=all`;
            break;
        case 'zipcode':
            endpoint = `https://api.openbrewerydb.org/breweries?by_postal=${searchInput.value}&per_page=all`;
             break;
        case 'term':
            endpoint = `https://api.openbrewerydb.org/breweries/?by_name=${searchInput.value}&per_page=all`;
    }

    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            document.querySelector('#results').innerHTML = '';
            data.forEach(result => createBreweryCard(result))
        })
    document.querySelector('#search-form').reset();
};

function createBreweryCard(result) {
    const resultsDiv = document.querySelector('#results');
    const childDiv = document.createElement('div');
    childDiv.setAttribute('class', 'brewcard')
    //Name
    const name = document.createElement('p');
    name.setAttribute('class', 'brewname');
    name.textContent = `${result.name}`;
    //Address
    const address = document.createElement('p');
    address.textContent = `Address: ${result.street || 'N/A'} ${result.city}, ${result.state} ${result.postal_code}`
    //Phone
    const phone = document.createElement('p');
    phone.textContent = `Phone: ${result.phone || 'N/A'}`
    //Website
    const website = document.createElement('p')
    website.textContent = `Website: ${result.website_url || 'N/A'}`

    childDiv.append(name, address, phone, website)
    resultsDiv.appendChild(childDiv);
};
