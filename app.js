var places = [
    {
        id: 01,
        type: 'cafe',
        title: 'Chica Doçaria',
        location:{
            lat: -23.18877025471684,
            lng: -46.887286931367036
        },
        foursquare: '520aca1e11d297f8db13b8a6'
    },
    {
        id: 02,
        type: 'cafe',
        title: 'Starbucks',
        location:{
            lat: -23.199202493427762,
            lng: -46.890054662332766
        },
        foursquare: '50c9d6d4e4b066a042496bb8'
    },
    {
        id: 03,
        type: 'parque',
        title: 'Parque da Cidade',
        location:{
            lat: -23.154418376727644,
            lng: -46.88842682237055
        },
        foursquare: '4bbf8bd8b492d13ad1d6a260'
    },
    {
        id: 04,
        type: 'restaurante',
        title: 'Outback Steakhouse',
        location:{
            lat: -23.199203467642967,
            lng: -46.8906486682723
        },
        foursquare: '507edceaf31c44e07e258602'
    },

];

var markers = [];
var largeInfoWindow;
var bounds;

var Place = function(data) {
    this.id = ko.observable(data.id);
    this.type = ko.observable(data.type);
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.foursquare = ko.observable(data.foursquare);
};

var ViewModel = function() {
    var self = this;

    this.lista_cafe = ko.observableArray([]);
    this.lista_restaurante = ko.observableArray([]);
    this.lista_parque = ko.observableArray([]);
    this.lista_geral = ko.computed(function() {
        return this.lista_cafe().concat(this.lista_restaurante(), this.lista_parque());
    }, this);

    places.forEach(function(place){
        switch (place.type) {
            case 'cafe':
                self.lista_cafe.push(new Place(place));
                break;
            case 'restaurante':
                self.lista_restaurante.push(new Place(place));
                break;
            default:
                self.lista_parque.push(new Place(place));
        }
    });

    this.createMarkers = function(locations, bounds, largeInfoWindow) {
        for(var i = 0 ; i < locations.length ; i++) {
            var position = locations[i].location();
            var title = locations[i].title();
            var id = locations[i].id();
            var type = locations[i].type();
            var foursquare = locations[i].foursquare();
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: id,
                type: type,
                foursquare: foursquare
            });
            markers.push(marker);
            bounds.extend(marker.position);
            marker.addListener('click', function(){
                self.populateInfoWindow(this, largeInfoWindow);
            });
            self.showListings(markers);
        }
    }

    this.foursquareInfos = function(id) {
        var foursquareInfos = [];
        var apiURL = "https://api.foursquare.com/v2/venues/" + id +
            "?client_id=CLIENT_ID&"+           // substituir CLIENT_ID por seu id de cliente no foursquare
            "client_secret=CLIENT_SECRET&"+    // substituir CLIENT_SECRET pelo seu secret do foursquare
            "v=20180323&intent=browse";

        $.getJSON(apiURL, function(data) {
            $.each( data, function( key, val ) {
                if(key == 'response'){ //se não existe info, nada é exibido
                    var pagina = '<p><strong>';

                    pagina += (val['venue']['categories'][0]['name']) ?
                    'Tipo: ' + val['venue']['categories'][0]['name'] +' | ' : '';

                    pagina += (val['venue']['price'] && val['venue']['price']['message']) ?
                    'Preço: ' + val['venue']['price']['message'] + ' | ' : '';

                    pagina += (val['venue']['rating']) ?
                    'Nota: ' + val['venue']['rating'] : '';

                    pagina += (val['venue']['name']) ?
                    '<br>' + val['venue']['name'] : '';

                    pagina += '</strong><br>(<a href="' + val['venue']['canonicalUrl']
                    + '" target="_blank">Ver no FourSquare</a>)</p>'

                    $('#square').html(pagina);
                }
            });
        }).fail(function( jqxhr, textStatus, error ) {
            var falha = textStatus + ", " + error;
            console.log( "Falha: " + falha );

            $('#square').html(
                '<p>Erro carregando<br>informações do FourSquare</p>'
            );
        });
    }

    this.populateInfoWindow = function(marker, infowindow) {
        if(infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('');
            infowindow.marker = marker;
            infowindow.addListener('closeclick', function(){
                infowindow.marker = null;
            });

            infowindow.setContent(
                '<div id="titu"><h4>' + marker.title + '</h4></div>'+
                '<div id="square"></div><div id="imagem"></div>'
            );

            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;

            function getStreetView(data, status) {
                if(status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(document.getElementById('imagem'), panoramaOptions);
                } else {
                    $('#imagem').html('<p>Erro carregando Google Street View</p></div>');
                }
            }

            self.foursquareInfos(marker.foursquare);
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            infowindow.open(map, marker);
        }
    }

    this.showListings = function(list) {
        var bounds = new google.maps.LatLngBounds();
        for(var i = 0 ; i < list.length ; i++) {
            list[i].setMap(map);
            bounds.extend(list[i].position);
        }
        map.fitBounds(bounds);
    }

    this.showInfos = function(place) {
        var index = markers.map(function(o) { return o.id; }).indexOf(place.id());
        viewModel.populateInfoWindow(markers[index],largeInfoWindow);
    }

    $('.button-collapse').sideNav({
        menuWidth: 300,
        edge: 'left',
        closeOnClick: true,
        draggable: true,
    });

    $('.collapsible').collapsible();
}

function initMap() {
    var styles = (typeof meu_mapa !== 'undefined') ? meu_mapa : '';

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        styles: styles,
        center: {lat: -23.588420, lng: -46.610592},
    });

    largeInfoWindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();

    viewModel.createMarkers(viewModel.lista_geral(), bounds, largeInfoWindow);

}

function mapError() {
    $('#map').html('<p class="erro">Impossível carregar Google Maps.<br></p>');
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);
