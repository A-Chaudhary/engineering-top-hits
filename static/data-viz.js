
const RANKCUTOFF = 50;
const BEGIN_DATE = new Date("1960-01-01");
const END_DATE = new Date("2015-12-31");


function run_viz() {
    d3.csv('../static/charts.csv').then(function(master_data) {
        var data = master_data;
        for (var d_idx in data) {
            data[d_idx].date = new Date(data[d_idx].date);
        }

        var STARTING_DATE = new Date('1960-01-01');
        var ENDING_DATE = new Date(STARTING_DATE);
        ENDING_DATE.setFullYear(STARTING_DATE.getFullYear() + 10);
    
        data = data.filter(d => d.rank <= RANKCUTOFF);
        data.sort((a, b) => {
            // Convert both artists to lowercase to ensure case-insensitive sorting
            var artistA = a.artist.toLowerCase();
            var artistB = b.artist.toLowerCase();
          
            // Compare the artist names
            if (artistA < artistB) {
              return -1;
            }
            if (artistA > artistB) {
              return 1;
            }
            return 0; // If names are equal
          });
        // console.log(data, typeof data)



        $(document).ready(function() {
            draw_viz(data, STARTING_DATE, ENDING_DATE);
            var $parent = $('.data-parent');
            var $imageContainer = $('#data-viz');
            var $image = $imageContainer.find('svg');
            // Set width of image container to match parent width
            $imageContainer.width($parent.width());

            var parentTop = $parent.offset().top;
            var parentBottom = parentTop + $parent.outerHeight();
            var imageHeight = $imageContainer.height();
            var windowHeight = $(window).height();

            const scrollXDate = d3.scaleLinear()
                // .domain([0, $parent.outerHeight()])
                .domain([parentTop, parentBottom - imageHeight])
                .range([BEGIN_DATE, END_DATE]);
          
            $(window).on('scroll', function() {
                var scrollTop = $(this).scrollTop();
              // Check if parent div is in the view
              if (scrollTop >= parentTop && scrollTop <= parentBottom - imageHeight) {
                // Pin the image container
                $imageContainer.css({
                  position: 'fixed',
                  top: 0,
                  bottom: 'auto'
                });


                STARTING_DATE = scrollXDate(Math.min(scrollTop, parentBottom - imageHeight))
                ENDING_DATE = new Date(STARTING_DATE);
                ENDING_DATE.setFullYear(STARTING_DATE.getFullYear() + 10);
                
                console.log(parentTop, Math.min(scrollTop, parentBottom - imageHeight), parentBottom);
                console.log(STARTING_DATE, ENDING_DATE);
                draw_viz(data, STARTING_DATE, ENDING_DATE);
            } else if (scrollTop > parentBottom - imageHeight) {
                // Pin the image container at the bottom
                $imageContainer.css({
                  position: 'absolute',
                  bottom: 0,
                  top: 'auto'
                });
              } else {
                // Unpin the image container
                $imageContainer.css({
                  position: 'absolute',
                  top: 0, // Reset initial position if needed
                  bottom: 'auto'
                });
              }
            });
          });
    });
}

function draw_viz(data, STARTING_DATE, ENDING_DATE) {
    $("#data-viz").empty();

    data = data.filter(d => d.date >= STARTING_DATE && d.date <= ENDING_DATE);
    // console.log(data);
    
    var artist_song_df = d3.group(data, d => d.artist, d => d.song);
    artist_song_df.forEach((value, key, map) => {
        value.forEach(song => {
            song.sort((a, b) => a.date - b.date);
        });
    });
    // console.log(artist_song_df);

    // Initialize an array to store the maps
    var mapsList = [];

    // Iterate over the entries of the internmap
    for (const [artist, songsMap] of artist_song_df.entries()) {
        for (const [song, data] of songsMap.entries()) {
            // Create a map for each entry with keys for artists, songs, and data
            var map = new Map();
            map.set('artist', artist);
            map.set('song', song);
            map.set('data', data);
            // Push the map to the array
            mapsList.push(map);
        }
    }

    // Output the list of maps
    // console.log(mapsList);
    mapsList.sort((a, b) => {
        const dataA = a.get('data');
        const dataB = b.get('data');
        return dataB.length - dataA.length; // Sort in descending order
    });

    // console.log(mapsList);

    // const width = 840;
    const width = $(window).width();
    const height = 400;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc()
        .domain([STARTING_DATE, ENDING_DATE])
        .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([RANKCUTOFF, 1])
        .range([height - marginBottom, marginTop]);

    // Define a color scale
    const colorScale = d3.scaleSequential()
  .domain([STARTING_DATE, ENDING_DATE])
  .interpolator(d3.interpolateRainbow);

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    // Add a line for each song

    for (let i = 0; i < mapsList.length; i++) {
        const map = mapsList[i];
        const artist = map.get('artist');
        const song = map.get('song');
        const data = map.get('data');

        // console.log(data[data.length - 1]);
    
        var time_1959_to_1977 = (data[data.length - 1]['weeks-on-board'] > 12 && data.filter(d => d.rank <= 10).length > 9) 
            && (data[0]['date'] > new Date('1959-01-01') && data[0]['date'] <= new Date('1977-01-01'));
        var time_1977_to_1984 = (data[data.length - 1]['weeks-on-board'] > 12 && data.filter(d => d.rank <= 10).length > 13) 
            && (data[0]['date'] > new Date('1977-01-01') && data[0]['date'] <= new Date('1984-01-01'));
        var time_1984_to_1991 = (data[data.length - 1]['weeks-on-board'] > 8 && data.filter(d => d.rank <= 10).length > 8) 
            && (data[0]['date'] > new Date('1984-01-01') && data[0]['date'] <= new Date('1991-01-01'));
        var time_1991_to_2010 = (data[data.length - 1]['weeks-on-board'] > 12 && data.filter(d => d.rank <= 10).length > 20) 
            && (data[0]['date'] < new Date('2010-01-01') && data[0]['date'] > new Date('1991-01-01'));
        var time_2010_to_2022 = (data[data.length - 1]['weeks-on-board'] > 12 && data.filter(d => d.rank <= 10).length > 25 && data[data.length - 1]['peak-rank'] == 1) 
            && (data[0]['date'] >= new Date('2010-01-01') && data[0]['date'] < new Date('2022-01-01'));
        if (time_1959_to_1977 | time_1977_to_1984 || time_1984_to_1991 || time_1991_to_2010 || time_2010_to_2022
            ) {
        const line = d3.line()
            .x(d=>x(d.date))
            .y(d=>y(d.rank))
            .curve(d3.curveMonotoneX);

        svg.append('path')
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", colorScale(data[0].date))
            .attr("stroke-width", 2)
            .attr("d", line);
        
        }
    }
    
    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    // Add the y-axis.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));


    // Append the SVG element.
    $("#data-viz").append(svg.node());
}


run_viz();