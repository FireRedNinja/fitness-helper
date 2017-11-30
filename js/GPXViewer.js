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
        $('#graphButtons').css("display", "block");
        var elevation = [];
        var heartrate = [];
        var cadence = [];
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

                cadence.push(cad);
                elevation.push(parseFloat(elev).toFixed(2));
                heartrate.push(parseFloat(hr));
                timeArray.push(time.toLocaleTimeString());

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
        console.log("Cadence");
        console.log(cadence);
        

        // Chartjs

        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeArray,
                datasets: [{
                    label: "Elevation (m)",
                    data: elevation,
                    borderWidth: 1,
                    borderColor: 'rgba(255,99,132,1)'
                }]
            },
            options: {
                title: {
                    text: "Elevation",
                    fontSize: 18,
                    display: true
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            labelString: "Time",
                            fontSize: 14,
                            display: true
                        },
                        ticks: {
                            beginAtZero: false,
                            maxTicksLimit: 2,
                            maxRotation: 0,
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            labelString: "Elevation (m)",
                            fontSize: 14,
                            display: true
                        },
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        });

        var ctx = document.getElementById("heartRate").getContext('2d');
        var heartRate = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeArray,
                datasets: [{
                    label: "Heart Rate (BPM)",
                    data: heartrate,
                    borderWidth: 1,
                    borderColor: 'rgba(255,99,132,1)'
                }]
            },
            options: {
                title: {
                    text: "Heart Rate",
                    fontSize: 18,
                    display: true
                },
                legend: {
                    display: false,
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            labelString: "Time",
                            fontSize: 14,
                            display: true
                        },
                        ticks: {
                            beginAtZero: false,
                            maxTicksLimit: 2,
                            maxRotation: 0,
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            labelString: "Heart Rate (BPM)",
                            fontSize: 14,
                            display: true
                        },
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        });


        var ctx = document.getElementById("Cadence").getContext('2d');
        var Cadence = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeArray,
                datasets: [{
                    data: cadence,
                    label: "Cadence (RPM)",
                    borderWidth: 1,
                    borderColor: 'rgba(255,99,132,1)'
                }]
            },
            options: {
                title: {
                    text: "Cadence",
                    fontSize: 18,
                    display: true
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            labelString: "Time",
                            fontSize: 14,
                            display: true
                        },
                        ticks: {
                            beginAtZero: false,
                            maxTicksLimit: 2,
                            maxRotation: 0,
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            labelString: "Cadence (RPM)",
                            fontSize: 14,
                            display: true
                        },
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        });
        setTimeout(function() { myChart.update(); },500);
        setTimeout(function() { heartRate.update(); },500);
        setTimeout(function() { Cadence.update(); },500);
        
        // end of chartjs
        reader.readAsText(this.files[0]);
        $('#file-preview').text(this.files[0].name);
    });

    $("#elevationButton").click(function () {
        $("#elevationButton").css("background-color", "#1F7F70");
        $("#heartRateButton").css("background-color", "#23A39B");
        $("#cadenceButton").css("background-color", "#23A39B");
        $('#myChart').css("display", "block");
        $('#heartRate').css("display", "none");
        $('#Cadence').css("display", "none");
    });
    
    //Just remove any old theme
    $("#heartRateButton").click(function () {
        $("#elevationButton").css("background-color", "#23A39B");
        $("#heartRateButton").css("background-color", "#1F7F70");
        $("#cadenceButton").css("background-color", "#23A39B");
        $('#myChart').css("display", "none");
        $('#heartRate').css("display", "block");
        $('#Cadence').css("display", "none");
    });

    $("#cadenceButton").click(function () {
        $("#elevationButton").css("background-color", "#23A39B");
        $("#heartRateButton").css("background-color", "#23A39B");
        $("#cadenceButton").css("background-color", "#1F7F70");
        $('#myChart').css("display", "none");
        $('#heartRate').css("display", "none");
        $('#Cadence').css("display", "block");
    });
});
