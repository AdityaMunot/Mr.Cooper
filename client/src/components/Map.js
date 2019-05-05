import React from 'react';
import '../style/map.css';
import Navbar from './NavBar';
import $ from 'jquery';
import L from 'leaflet';
import 'leaflet-routing-machine';

class Map extends React.Component {

    constructor(props) {
        super(props);

        this.init_map = this.init_map.bind(this);
    }
    
    componentDidMount() {
        this.init_map();
    }

    render() {
        return (
            <div className="container">
                <div className="container">
                <Navbar />
                </div>
                <div className="container bg-white" style= {{ margin: "72px 0px 5px 0px", borderRadius: 10, padding: "20px 20px 20px 20px"}}>
                    <input className="border border-primary" id="search-box" placeholder="Search ..." style={{ borderRadius: 10}} />
                    <ul id="search-result"></ul>
                    <hr />
                    <input className="border border-primary" id="route-from" placeholder="From ..." style={{ borderRadius: 10}} />
                    <ul id="from-result"></ul>
                    <input className="border border-primary" id="route-to" placeholder="To ..." style={{ borderRadius: 10}} />
                    <ul id="to-result"></ul>
                    <button className="button" type="submit" id="show-route" style ={{ marginTop: '0px'}}>Show Route</button>
                    <hr />
                    <div className= "border border-primary " id="map-view" style={{ height: 400, overflow: "hidden", borderRadius: 10 }}></div>
                </div>
            </div>
        );
    };

    init_map() {
        // set up the map
        var map = new L.Map('map-view');
    
        // create the tile layer with correct attribution
        var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 20, attribution: osmAttrib });
    
        map.setView(new L.LatLng(40.74518, -74.02625), 16);
        map.addLayer(osm);
    
        $(document).ready(function () {
            // ============= search and add marker
            var searchTimeout = null;
            $("#search-box").on("change paste keyup", function () {
                var searchKey = $(this).val();
                clearTimeout(searchTimeout);
    
                searchTimeout = setTimeout(function () {
                    search_for(searchKey, function (list) {
                        $('#search-result').html(listPlaces(list));
                    });
                }, 1000);
            });

            // ============= render places as html
            var listPlaces = function(list) {
                console.log(list);

                var html = '';
    
                for (var i = 0; i < list.length; i++) {
                    html += 
                        '<li>' + 
                            '<button latlng="' + list[i]['lat'] + ',' + list[i]['lng'] + '">' +
                                list[i]['name'] + 
                            '</button>' + 
                        '</li>';
                } 

                return html;
            }

            // ========== search from
            $(document).on('click', '#from-result li > button', function() {
                window.routeFrom = $(this).attr("latlng");
                $('#from-result').html("<li>" +$(this).text()+ "</li>");
            })
    
            $("#route-from").on("change paste keyup", function () {
                var searchKey = $(this).val();
                clearTimeout(searchTimeout);
    
                searchTimeout = setTimeout(function () {
                    search_for(searchKey, function (list) {
                        $('#from-result').html(listPlaces(list));
                    });
                }, 1000);
            });


            // ========== search to
            $(document).on('click', '#to-result li > button', function() {
                window.routeTo = $(this).attr("latlng");
                $('#to-result').html("<li>" +$(this).text()+ "</li>");
            })
    
            $("#route-to").on("change paste keyup", function () {
                var searchKey = $(this).val();
                clearTimeout(searchTimeout);
    
                searchTimeout = setTimeout(function () {
                    search_for(searchKey, function (list) {
                        $('#to-result').html(listPlaces(list));
                    });
                }, 1000);
            });
    
            // ========== show route
            $('#show-route').on('click', function () {
                clear_routes();
    
                var from = window.routeFrom.split(',');
                var to = window.routeTo.split(',');

                routes.push(
                    L.Routing.control({
                        waypoints: [
                            L.latLng(from[0], from[1]),
                            L.latLng(to[0], to[1])
                        ]
                    }).addTo(map)
                )
            })
        });

        var routes = [];

        function clear_routes() {
            for (var i = 0; i < routes.length; i++) {
                routes[i].spliceWaypoints(0, 2);
            }
    
            routes = [];
        }
    
        var markers = [];
    
        function clear_points() {
            for (var i = 0; i < markers.length; i++) {
                map.removeLayer(markers[i]);
            }
    
            markers = [];
        }
    
        window.add_map_point = function(lat, lng) {
            clear_points();
            markers.push(L.marker([lat, lng]).addTo(map));
        }
    
        function search_for(location, callback) {
            var searchURL =
                "https://nominatim.openstreetmap.org/search/" +
                location +
                "?format=json&addressdetails=1&limit=10" +
                "&viewbox=-74.04806,40.75227,-74.00257,40.73602&bounded=1";
    
            $.getJSON(searchURL, function (json) {
                var list = [];
    
                for (var i = 0; i < json.length; i++) {
                    list.push({
                        name: json[i]['display_name'],
                        lat: json[i]['lat'],
                        lng: json[i]['lon']
                    })
                }
    
                callback(list);
            });
        }
    }
};

export default Map;