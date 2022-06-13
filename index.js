document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#search-form');
    const locationSearch = document.querySelector('#search-location-button');
    form.addEventListener('submit', performSearch);
    locationSearch.addEventListener('click', searchCurrentLocation);
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
        case 'name':
            endpoint = `https://api.openbrewerydb.org/breweries/?by_name=${searchInput.value}&per_page=all`;
    }

    fetch(encodeURI(endpoint))
        .then(res => res.json())
        .then(data => {
            document.querySelector('#results').innerHTML = '';
            data.forEach(result => createCard(result))
        })
    document.querySelector('#search-form').reset();
};

function createCard(result) {
    if (result.brewery_type !== "closed") {
        const resultsDiv = document.querySelector('#results');
        const childDiv = document.createElement('div');
        childDiv.style.textAlign = 'center'
        childDiv.setAttribute('class', 'brewcard')
        //Format 10 digit phone numbers to include dashes
        const phoneFormat = function (input) {
            if (input < 10) return null
            return input.slice(0, 3) + '-' + input.slice(3, 6) + '-' + input.slice(-4);
        };
        //Name
        const name = document.createElement('p');
        name.setAttribute('class', 'brewname');
        name.textContent = `${result.name}`;
        //Address
        const address = document.createElement('p');
        address.textContent = `Address: ${result.street || 'N/A'} - ${result.city}, ${result.state} ${result.postal_code}`
        //Phone
        const phone = document.createElement('p');
        phone.textContent = `Phone: ${phoneFormat(result.phone) || 'N/A'}`
        //Website
        const website = document.createElement('a')
        website.setAttribute('href', `${result.website_url}`)
        website.setAttribute('target', '_blank');
        website.textContent = 'Website'
        website.append(document.createElement('br'))
        //Google Maps
        const map = document.createElement('a');
        if (result.latitude && result.longitude) {
            map.setAttribute('href', `https://www.google.com/maps/place/${result.latitude},${result.longitude}`)
            map.setAttribute('target', '_blank');
            map.textContent = 'See location on Google Maps'
        };
        
        childDiv.append(name, address, phone, website, map)
        resultsDiv.appendChild(childDiv);
    }
};

function searchCurrentLocation() {
    //Check if users browser has access to Geolocation API
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
    } else {
      const text = 'loading...'
      document.querySelector('#results').appendChild(document.createTextNode(text));
      navigator.geolocation.getCurrentPosition(success, error);
    };
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch(`https://api.openbrewerydb.org/breweries?by_dist=${latitude},${longitude}&per_page=all`)
            .then(res => res.json())
            .then(data => {
                document.querySelector('#results').innerHTML = '';
                data.forEach(result => createCard(result))
            })
      };
    
      function error() {
        alert('Unable to retrieve your location');
      };
};