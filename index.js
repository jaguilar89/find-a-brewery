const form = document.querySelector('#search-form');
const locationSearch = document.querySelector('#search-location-button');
form.addEventListener('submit', performSearch);
locationSearch.addEventListener('click', searchCurrentLocation);

function performSearch(event) {
    event.preventDefault();
    let endpoint;
    const searchInput = document.querySelector('#search_bar');
    const dropdown = document.querySelector('#search-categories');
    switch (dropdown.value) {
        case 'city':
            endpoint = `https://api.openbrewerydb.org/breweries?by_city=${searchInput.value}&per_page=50`;
            break;
        case 'state':
            endpoint = `https://api.openbrewerydb.org/breweries?by_state=${searchInput.value}&per_page=50`;
            break;
        case 'zipcode':
            endpoint = `https://api.openbrewerydb.org/breweries?by_postal=${searchInput.value}&per_page=50`;
            break;
        case 'name':
            endpoint = `https://api.openbrewerydb.org/breweries/?by_name=${searchInput.value}&per_page=50`;
    }

    fetch(encodeURI(endpoint)) //Encode endpoint URL in case of spaces in params
        .then(res => {
            if (!res.ok) throw new Error(res.statusText)
            return res.json();
        })
        .then(data => {
            document.querySelector('#results').innerHTML = ''; //Wipe previous search results on page when performing a new search
            data.forEach(item => createCard(item))
        })
        .catch(error => console.log(error))
    document.querySelector('#search-form').reset();
};

function createCard(result) {
    if (result.brewery_type !== "closed") { //Only create cards for brewery locations that are currently still in business
        const resultsDiv = document.querySelector('#results');
        const childDiv = document.createElement('div');
        childDiv.style.textAlign = 'center'
        childDiv.setAttribute('class', 'brewcard')
        //Format 10 digit phone numbers to include dashes
        const phoneFormat = function (input) {
           if (result.phone && result.country === 'United States') {
            return input.slice(0, 3) + '-' + input.slice(3, 6) + '-' + input.slice(-4);
           }
        };
        //Name
        const name = document.createElement('p');
        name.setAttribute('class', 'brewname');
        name.textContent = `${result.name}`;
        //Brewery type
        const type = document.createElement('p');
        type.textContent = `Brewery type: ${result.brewery_type || 'N/A'}`
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
        
        const dist = document.createElement('div') //Create space on card for showing distance info when searching by current location
        dist.setAttribute('class', 'dist')

        childDiv.addEventListener('mouseenter', event => event.target.style.boxShadow = '0px 2px 7px 7px rgba(0,0,0,0.5)');
        childDiv.addEventListener('mouseleave', event => event.target.style.boxShadow = '');
        childDiv.append(name, type, address, phone, website, map, dist)
        resultsDiv.appendChild(childDiv);
    }
};

function searchCurrentLocation() {
    //Check if users browser has access to Geolocation API
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
    } else {
      document.querySelector('#results').innerHTML = ''
      const text = document.createElement('h1')
      text.textContent = 'Searching...'
      document.querySelector('#results').appendChild(text);
      navigator.geolocation.getCurrentPosition(success, error);
    };
    function success(position) {
        const myLatitude  = position.coords.latitude;
        const myLongitude = position.coords.longitude;

        fetch(`https://api.openbrewerydb.org/breweries?by_dist=${myLatitude},${myLongitude}&per_page=50`)
            .then(res => res.json())
            .then(data => {
                document.querySelector('#results').innerHTML = '';
                data.forEach((result, index) => {
                    createCard(result)
                    const div = document.querySelectorAll('.dist')[index]
                    const distance = getDistanceFromCoordsInMiles(myLatitude, myLongitude, result.latitude, result.longitude)
                    div.textContent = `Distance: ${distance.toFixed(2)} mi`
                })
            })
    };
    
    function error() {
        alert('Unable to retrieve your location');
    };
    //Haversine Formula for calculating distance between 2 geographic coordinates.
    function getDistanceFromCoordsInMiles(lat1,lon1,lat2,lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);  // deg2rad below
        const dLon = deg2rad(lon2 - lon1); 
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        const d = R * c; // Distance in km
        
        return d * 0.62137; //km to mi = dist in km * 0.62137

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
    }
};

