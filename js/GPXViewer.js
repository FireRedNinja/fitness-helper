$(document).ready(function() {

    $("#input").change(function(e) {

        for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {

            var file = e.originalEvent.srcElement.files[i];

            var img = document.createElement("img");
            var reader = new FileReader();
            reader.onloadend = function() {
                img.src = reader.result;
            }
            reader.readAsDataURL(file);
            $("input").after(img);
        }
    });


    $('#file-input').change(function() {
        var elevation = [];
        var heartrate = [];
        var timeArray = [];

        var reader = new FileReader();
        reader.onload = function(e) {
            // e.target.result should contain the text
            var text = reader.result;

            //console.log("XML TEXT" + text);

            var gpxDoc = $.parseXML(text);
            var $xml = $(gpxDoc);

            // Find Name of Activity
            var $name = $xml.find('name');
            console.log($name.text());

            $('#file-title').text($name.text());



            var totalTracks = 0;
            var totalHR = 0;
            var totalCAD = 0;
            var totalElev = 0;

            var totalLat = 0;
            var totalLon = 0;

            var lastLat = null;
            var lastLon = null;

            var maxLat = null;
            var maxLon = null;
            var minLat = null;
            var minLon = null;


            // Iterate through all track segements and find a route.
            $xml.find('trkpt').each(function() {
                // this is where all the reading and writing will happen
                var lat = $(this).attr("lat");
                var lon = $(this).attr("lon");

                var hr = $(this).find('ns3\\:hr').text();

                var cad = $(this).find('ns3\\:cad').text();

                var elev = $(this).find('ele').text();

                var gpxTime = $(this).find('time').text();

                var time = new Date(gpxTime);

                totalTracks += 1;
                totalHR += parseInt(hr);
                totalCAD += parseInt(cad);
                totalLat += parseFloat(lat);
                totalLon += parseFloat(lon);
                totalElev += parseFloat(elev);

                elevation.push(parseFloat(elev));
                heartrate.push(parseFloat(hr));
                timeArray.push(time.getHours()+":"+time.getMinutes()+":"+time.getSeconds());

                //  Get the figures for the bounding box
                if (maxLat == null || maxLon == null || minLat == null || minLon == null) {
                    maxLat = lat;
                    minLat = lat;

                    maxLon = lon;
                    minLon = lon;
                }

                maxLat = Math.max(lat, maxLat);
                minLat = Math.min(lat, minLat);

                maxLon = Math.max(lon, maxLon);
                minLon = Math.min(lon, minLon);

                if (lastLat == null || lastLon == null) {
                    lastLat = lat;
                    lastLon = lon;
                } else {

                    var line = new google.maps.Polyline({
                        path: [
                            new google.maps.LatLng(lastLat, lastLon),
                            new google.maps.LatLng(lat, lon)
                        ],
                        strokeColor: "#09b57b",
                        strokeOpacity: 0.4,
                        strokeWeight: 10,
                        map: map
                    });

                    lastLon = lon;
                    lastLat = lat;

                }


                //  For testing to see if values coming in are mental
                //console.log("LAT " + lat + " LON " + lon + " HR " + hr + " CAD " + cad);

            });

            //  Add the overview stats to preview run details...
            $('#average-heartrate').text("Average Heartrate: " + Math.round((totalHR / totalTracks)));
            $('#average-cadence').text("Average Cadence: " + Math.round((totalCAD / totalTracks)));
            $('#average-elevation').text("Average Elevation: " + Math.round((totalElev / totalTracks)));

            // Recentre the MAP
            map.setCenter(new google.maps.LatLng(totalLat / totalTracks, totalLon / totalTracks));

            map.fitBounds(new google.maps.LatLngBounds(new google.maps.LatLng(minLat, minLon), new google.maps.LatLng(maxLat, maxLon)));

        };

        console.log("time");
        console.log(timeArray);
        console.log("elevation");
        console.log(elevation);

        // Chartjs
        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeArray,
                datasets: [{
                    label: 'Elevation',
                    data: elevation,
                    borderWidth: 1,
                    borderColor: 'rgba(255,99,132,1)'
                }]
            },
            options: {
                scales: {
                    
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        });


        // var myChart = new Chart(ctx, {
        //     scaleSteps: 10,
        //     type: 'line',
        //     data: {
        //         labels: timeArray,
        //         datasets: [{
        //             label: 'Elevation',
        //             data: elevation,
        //             backgroundColor: [
        //                 'rgba(255, 99, 132, 0.2)',
        //                 'rgba(54, 162, 235, 0.2)',
        //                 'rgba(255, 206, 86, 0.2)',
        //                 'rgba(75, 192, 192, 0.2)',
        //                 'rgba(153, 102, 255, 0.2)',
        //                 'rgba(255, 159, 64, 0.2)'
        //             ],
        //             borderColor: [
        //                 'rgba(255,99,132,1)',
        //                 'rgba(54, 162, 235, 1)',
        //                 'rgba(255, 206, 86, 1)',
        //                 'rgba(75, 192, 192, 1)',
        //                 'rgba(153, 102, 255, 1)',
        //                 'rgba(255, 159, 64, 1)'
        //             ],
        //             borderWidth: 1
        //         }]
        //     },
        //     options: {
        //         scales: {
        //             yAxes: [{
        //                 ticks: {
        //                     beginAtZero: false
        //                 }
        //             }]
        //         }
        //     }
        // });



        // end of chartjs
        reader.readAsText(this.files[0]);
        $('#file-preview').text(this.files[0].name);



    });
});
