const BEGIN_DATE = new Date("1960-01-01");
const END_DATE = new Date("2015-12-31");


function run_viz() {
    d3.csv('../static/average+stv_month.csv').then(function(master_data) {
        var data = master_data;
        for (var d_idx in data) {
            data[d_idx].date = new Date(`${data[d_idx].Year}-${data[d_idx].Month}-1`);
        }

        var STARTING_DATE = new Date(BEGIN_DATE);
        var ENDING_DATE = new Date(STARTING_DATE);
        ENDING_DATE.setFullYear(STARTING_DATE.getFullYear() + 10);
    
        // Extract the features you want to visualize
    const features = ["Danceability_mean", "Energy_mean", "Speechiness_mean", "Acousticness_mean", "Instrumentalness_mean", "Liveness_mean"];

    const features_std = ["Danceability_std", "Energy_std", "Speechiness_std", "Acousticness_std", "Instrumentalness_std", "Liveness_std"];


        $(document).ready(function() {
            draw_viz(data, STARTING_DATE, ENDING_DATE);
            var $parent = $('.data-visualization');
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
              var parentTop = $parent.offset().top;
              var parentBottom = parentTop + $parent.outerHeight();
              var imageHeight = $imageContainer.height();
              var windowHeight = $(window).height();
              if (scrollTop <= parentTop) {
                // console.log('above',parentTop, scrollTop, parentBottom);
                // Unpin the image container
                $imageContainer.css({
                  position: 'absolute',
                  top: 0, // Reset initial position if needed
                  bottom: 'auto'
                });
                  
                $("#music-lines").removeClass("exploration-section")

                if (scrollTop + windowHeight>= parentTop) {
                    console.log('hit');
                    STARTING_DATE = scrollXDate(Math.min(scrollTop, parentBottom - imageHeight))
                    ENDING_DATE = new Date(STARTING_DATE);
                    ENDING_DATE.setFullYear(STARTING_DATE.getFullYear() + 10);
                    // console.log(STARTING_DATE, ENDING_DATE);
                    draw_viz(data, STARTING_DATE, ENDING_DATE);
                }
              }
              // Check if parent div is in the view
              else if (scrollTop >= parentTop && scrollTop <= (parentBottom - imageHeight)) {
                // console.log('inside', parentTop, scrollTop,parentBottom,  parentBottom - imageHeight, imageHeight);
                  // Pin the image container
                $("#music-lines").addClass("exploration-section")

                $imageContainer.css({
                  position: 'fixed',
                  top: "200px",
                  bottom: 'auto'
                });


                STARTING_DATE = scrollXDate(Math.min(scrollTop, parentBottom - imageHeight))
                ENDING_DATE = new Date(STARTING_DATE);
                ENDING_DATE.setFullYear(STARTING_DATE.getFullYear() + 10);
                // console.log(STARTING_DATE, ENDING_DATE);
                draw_viz(data, STARTING_DATE, ENDING_DATE);

            } else if (scrollTop > parentBottom - imageHeight) {
                // console.log('bottom', parentTop, scrollTop, parentBottom);
                // Pin the image container at the bottom
                $imageContainer.css({
                  position: 'absolute',
                  bottom: 0,
                  top: 'auto'
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

    const features = ["Danceability_mean", "Energy_mean", "Speechiness_mean", "Acousticness_mean", "Instrumentalness_mean", "Liveness_mean"];

    const feature_colors = {
        "Danceability_mean": "#F573A0", 
        "Energy_mean": "#FF4632", 
        "Speechiness_mean": "#1ED760", 
        "Acousticness_mean": "#509BF5", 
        "Instrumentalness_mean": "#FFC564", 
        "Liveness_mean": "#6E4E73"
    };

    const feature_std_colors = {
        "Danceability_std": "#F573A0", 
        "Energy_std": "#FF4632", 
        "Speechiness_std": "#1ED760", 
        "Acousticness_std": "#509BF5", 
        "Instrumentalness_std": "#FFC564", 
        "Liveness_std": "#6E4E73"
    };


    // const width = 840;
    const width = parseInt($(window).width() * (0.6));
    const height = 500;
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
        .domain([0, 1])
        .range([height - marginBottom, marginTop]);


    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)

    // Loop through each feature and draw a line for it
    features.forEach((feature, index) => {
        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d[feature]));

        const path = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", feature_colors[feature])
            .attr("stroke-width", 4)
            .attr("d", line)
            .on('mouseover', (event, data) =>{
                // console.log('mouseenter', feature);
                // console.log(feature, data);

                // Fade out other lines
                svg.selectAll("path")
                    .style("opacity", 0.3);

                // Highlight the current line
                path.style("opacity", 1);

                svg.append("path")
                    .datum(data)
                    .attr("class", "std-line")
                    .attr("fill", `${feature_colors[feature]}33`)
                    .attr("stroke", "none")
                    .attr("d", d3.area()
                        .x(d=> x(d.date))
                        .y0((d, i) => { 
                            return y(- parseFloat(d[`${feature.split('_')[0]}_std`]) + parseFloat(data[i][feature]))
                        })
                        .y1((d, i) => { 
                            return y(parseFloat(d[`${feature.split('_')[0]}_std`]) + parseFloat(data[i][feature]))
                        })
                    )
            })
            .on('mouseout', (e, d)=>{
                // Restore opacity of all lines
                // console.log('mouseout', feature);
                svg.selectAll("path")
                    .style("opacity", 1);
                svg.selectAll(".std-line").remove();
            });

        const legendWidth = 120;
        const legendHeight = features.length * 20;

        // Add legend entry
        svg.append("rect")
            .attr("x", width - marginRight - legendWidth)
            .attr("y", index * 20 + 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", feature_colors[feature]);

        svg.append("text")
            .attr("x", width - marginRight - legendWidth + 20)
            .attr("y", index * 20 + 9 + 20)
            .text(feature.split('_')[0])
            .style("font-size", "12px")
            .style('fill', feature_colors[feature])
            .attr("alignment-baseline", "middle");
    });

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    // Add the y-axis.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));


    // Append the SVG element.
    $("#data-viz").append(svg.node());
}


run_viz();