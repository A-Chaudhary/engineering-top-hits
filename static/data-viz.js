const BEGIN_DATE = new Date("1957-01-01");
const END_DATE = new Date("2015-12-31");

let STARTING_DATE = null;
let ENDING_DATE = null;

function run_viz() {
  d3.csv("../static/average+stv_month.csv").then(function (master_data) {
    var data = master_data;
    for (var d_idx in data) {
      data[d_idx].date = new Date(`${data[d_idx].Year}-${data[d_idx].Month}-1`);
    }

    STARTING_DATE = new Date(BEGIN_DATE);
    ENDING_DATE = new Date(STARTING_DATE);
    ENDING_DATE.setFullYear(STARTING_DATE.getFullYear() + 10);

    // Extract the features you want to visualize
    const features = [
      "Danceability_mean",
      "Energy_mean",
      "Speechiness_mean",
      "Acousticness_mean",
      "Instrumentalness_mean",
      "Liveness_mean",
    ];

    const features_std = [
      "Danceability_std",
      "Energy_std",
      "Speechiness_std",
      "Acousticness_std",
      "Instrumentalness_std",
      "Liveness_std",
    ];

    $(document).ready(function () {
      draw_viz(data, STARTING_DATE, ENDING_DATE);
      var $parent = $(".data-visualization");
      var $imageContainer = $("#data-viz");
      var $image = $imageContainer.find("svg");
      // Set width of image container to match parent width
      $imageContainer.width($parent.width());

      var parentTop = $parent.offset().top;
      var parentBottom = parentTop + $parent.outerHeight();
      var imageHeight = $imageContainer.height();
      var windowHeight = $(window).height();

      const scrollXDate = d3
        .scaleLinear()
        // .domain([0, $parent.outerHeight()])
        .domain([parentTop, parentBottom - imageHeight])
        .range([BEGIN_DATE, END_DATE]);

      function DateEnterScroll(date_string) {
        var date = new Date(date_string);
        date.setFullYear(date.getFullYear() - 10);
        const DateXscroll = d3
          .scaleTime()
          .domain([BEGIN_DATE, END_DATE])
          .range([parentTop, parentBottom - imageHeight]);
        return DateXscroll(date);
      }

      $(window).on("scroll", function () {
        var scrollTop = $(this).scrollTop();
        var parentTop = $parent.offset().top;
        var parentBottom = parentTop + $parent.outerHeight();
        var imageHeight = $imageContainer.height();
        var windowHeight = $(window).height();

        // Timeline Logic
        let progressScale = d3
            .scaleTime()
            .domain([DateEnterScroll("1962-08-04"), DateEnterScroll("2025-04-06")])
          .range([0, 100]);
        
        let decadeScale = d3.scaleLinear()
          .domain([DateEnterScroll("1962-08-04"), DateEnterScroll("2025-04-06")])
          .range([1958, 2022]);
        
        const p = d3.precisionFixed(1);
        
        $(".timeline").width(`${progressScale(scrollTop)}%`);
        $(".year-text").html(`${d3.format("." + p + "f")(decadeScale(scrollTop))}`);
        if ($(".year-text").html() >= "2022") {
          $(".year-label").css("left", `98.5%`);
          $(".year-text").html("2022")
        } else {
          $(".year-label").css("left", `${progressScale(scrollTop) - 2}%`);
        }

        function fetchPopupCSV(callback) {
          const csvFilePath = '../static/popups.csv'; // Change this to your desired filepath
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                  if (xhr.status === 200) {
                      const csvData = parseCSV(xhr.responseText);
                      callback(csvData);
                  } else {
                      console.error('Failed to fetch popup CSV file');
                  }
              }
          };
          xhr.open('GET', csvFilePath, true);
          xhr.send();
      }
      
      fetchPopupCSV(function(csvData) {
          window.addEventListener('scroll', function() {
              const scrollTop = window.scrollY;
              let isInRange = false;
              
              csvData.forEach((row, i) => {
                  const enterDate = new Date(row.Enter);
                  const exitDate = new Date(row.Exit);

                  const svg = d3.select('#svg');

                  // Remove existing rectangles with class 'testing-rect'
                  svg.selectAll(`.testing_rect_${i}`).remove();
                  svg.insert("rect", ":first-child")// Insert as the first child
                  .attr('class', `testing_rect_${i}`)
                  .attr("x", x(enterDate)) // Use x scale to position the rectangle
                  .attr("y", y(1))
                  .attr("width", x(exitDate) - x(enterDate)) // Calculate width based on exit and enter dates
                  .attr("height", y(0) - marginTop) // Cover the entire height of the SVG
                  .attr("fill", "rgb(25, 25, 25)")
                  .attr("pointer-events", "none"); // Disable pointer events on the rectangle

                  
                  if (scrollTop >=  DateEnterScroll(enterDate.getTime()) && scrollTop <= DateEnterScroll(exitDate.getTime()) && !isInRange) {
                      isInRange = true;
                      var popup = document.getElementById("popup");
                      popup.style.display = 'flex';
                      document.getElementById('popup-text').innerText = row['Blurb'];
                      document.getElementById('song-name-popup').innerText = row['Track'];
                      document.getElementById('artist-name-popup').innerText = row['Artist'];
                      document.getElementById('popup-image').src = row['Album Image (URI)'];
                      radarChart.data.datasets[0].data = [row["Danceability (Track)"], row['Energy (Track)'], row['Speechiness (Track)'], row['Acousticness (Track)'], row['Instrumentalness (Track)'], row['Liveness (Track)']];
                      radarChart.data.datasets[1].data = [row["Danceability (Track)"], row['Energy (Month Average)'], row['Speechiness (Month Average)'], row['Acousticness (Month Average)'], row['Instrumentalness (Month Average)'], row['Liveness (Month Average)']];

                      svg.selectAll(`.testing_rect_${i}`).attr("fill", "rgba(200, 200, 200, 0.2)")
                  }
              });
              if (!isInRange) {
                var popup = document.getElementById("popup");
                popup.style.display = 'none';
            }
          });
      });
      
      
        function parseCSV(csvString) {
          const rows = csvString.trim().split('\n');
          const data = [];
          const headers = rows[0].split(',').map(header => header.trim());
          for (let i = 1; i < rows.length; i++) {
              const values = [];
              let currentFieldValue = '';
              let insideQuotes = false;
              for (let j = 0; j < rows[i].length; j++) {
                  const char = rows[i][j];
                  if (char === ',' && !insideQuotes) {
                      values.push(currentFieldValue.trim());
                      currentFieldValue = '';
                  } else if (char === '"') {
                      insideQuotes = !insideQuotes;
                  } else {
                      currentFieldValue += char;
                  }
              }
              values.push(currentFieldValue.trim());
              const entry = {};
              headers.forEach((header, index) => {
                  entry[header] = values[index];
              });
              data.push(entry);
          }
          return data;
      }
      
      
      function fetchCSV(callback) {
          const csvFilePath = '../static/decade-blurbs.csv';
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                  if (xhr.status === 200) {
                      const csvData = parseCSV(xhr.responseText);
                      callback(csvData);
                  } else {
                      console.error('Failed to fetch CSV file');
                  }
              }
          };
          xhr.open('GET', csvFilePath, true);
          xhr.send();
      }

      fetchCSV(function(csvData) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            
            csvData.forEach(row => {
                const enterDate = new Date(row.Enter);
                const exitDate = new Date(row.Exit);
                
                if (scrollTop >=  DateEnterScroll(enterDate.getTime()) && scrollTop <= DateEnterScroll(exitDate.getTime())) {
                  if (document.getElementById('main-question').innerText != row['main-question']) {
                    document.getElementById('main-question').innerText = row['main-question'];
                    document.getElementById('decade-description').innerText = row['decade-description'];
                    document.getElementById('top-song').innerText = row['decade'];
                    document.getElementById('audio-embed').src = row['audio-embed'].toString();
                  }
                }
            });
        });
      });


        if (scrollTop <= parentTop) {
          // console.log('above',parentTop, scrollTop, parentBottom);
          // Unpin the image container
          $imageContainer.css({
            position: "absolute",
            top: 0, // Reset initial position if needed
            bottom: "auto",
          });

          $("#music-lines").removeClass("exploration-section");

          // Start Drawing when image is in view before locking position
          if (scrollTop + windowHeight >= parentTop) {
            const currentYear = scrollXDate(
              Math.min(scrollTop, parentBottom - imageHeight)
            ).getFullYear();
            STARTING_DATE = scrollXDate(
              Math.min(scrollTop, parentBottom - imageHeight)
            );
            ENDING_DATE = new Date(STARTING_DATE);
            ENDING_DATE.setFullYear(STARTING_DATE.getFullYear() + 10);

            draw_viz(data, STARTING_DATE, ENDING_DATE);
          }
        }
        // Check if parent div is in the view
        else if (
          scrollTop >= parentTop &&
          scrollTop <= parentBottom - imageHeight
        ) {
          // Pin the image container
          $("#music-lines").addClass("exploration-section");
          $imageContainer.css({
            position: "fixed",
            top: "250px",
            bottom: "auto",
          });

          STARTING_DATE = scrollXDate(
            Math.min(scrollTop, parentBottom - imageHeight)
          );
          ENDING_DATE = new Date(STARTING_DATE);
          ENDING_DATE.setFullYear(STARTING_DATE.getFullYear() + 10);
          // console.log(STARTING_DATE, ENDING_DATE);
          draw_viz(data, STARTING_DATE, ENDING_DATE);
        } else if (scrollTop > parentBottom - imageHeight) {
          // console.log('bottom', parentTop, scrollTop, parentBottom);
          // Pin the image container at the bottom
          $imageContainer.css({
            position: "absolute",
            bottom: 0,
            top: "auto",
          });
        }
      });
    });
  });
}

// const width = 840;
const width = parseInt($(window).width() * 0.48);
const height = 450;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

var x = d3
.scaleUtc()
.domain([STARTING_DATE, ENDING_DATE])
.range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
var y = d3
.scaleLinear()
.domain([0, 1])
.range([height - marginBottom, marginTop]);

function draw_viz(data, STARTING_DATE, ENDING_DATE) {
  $("#data-viz").empty();

  data = data.filter((d) => d.date >= STARTING_DATE && d.date <= ENDING_DATE);

  const features = [
    "Acousticness_mean",
    "Danceability_mean",
    "Energy_mean",
    "Instrumentalness_mean",
    "Liveness_mean",
    "Speechiness_mean",
  ];

  const feature_colors = {
    Acousticness_mean: "#509BF5",
    Danceability_mean: "#F573A0",
    Energy_mean: "#FF4632",
    Instrumentalness_mean: "#FFC564",
    Liveness_mean: "#6E4E73",
    Speechiness_mean: "#1ED760",
  };

  const feature_std_colors = {
    Danceability_std: "#F573A0",
    Energy_std: "#FF4632",
    Speechiness_std: "#1ED760",
    Acousticness_std: "#509BF5",
    Instrumentalness_std: "#FFC564",
    Liveness_std: "#6E4E73",
  };

  // Declare the x (horizontal position) scale.
  x = d3
  .scaleUtc()
  .domain([STARTING_DATE, ENDING_DATE])
  .range([marginLeft, width - marginRight]);
  

  // Create the SVG container.
  const svg = d3.create("svg").attr("width", width).attr("height", height).attr("id", "svg");

  // Loop through each feature and draw a line for it
  features.forEach((feature, index) => {
    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d[feature]));

    const path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", feature_colors[feature])
      .attr("stroke-width", 4)
      .attr("d", line)
      .on("mouseover", (event, data) => {

        svg.selectAll(".std-line").remove();

        // Fade out other lines
        svg.selectAll("path")
          .transition() // Apply transition for fade-in effect
          .duration(250)
          .style("opacity", 0.3);

        // Highlight the current line
        path
          .transition() // Apply transition for fade-in effect
          .duration(250)
          .style("opacity", 1);

        svg
          .append("path")
          .datum(data)
          .attr("class", "std-line")
          .attr("fill", `${feature_colors[feature]}33`)
          .attr("stroke", "none")
          .attr("pointer-events", 'none')
          .attr(
            "d",
            d3
              .area()
              .x((d) => x(d.date))
              .y0((d, i) => {
                return y(
                  -parseFloat(d[`${feature.split("_")[0]}_std`]) +
                    parseFloat(data[i][feature])
                );
              })
              .y1((d, i) => {
                return y(
                  parseFloat(d[`${feature.split("_")[0]}_std`]) +
                    parseFloat(data[i][feature])
                );
              })
          )
          .style("opacity", 0) // Initially set opacity to 0
          .transition() // Apply transition for fade-in effect
          .duration(250) // Duration of the transition
          .style("opacity", 1); // Transition to full opacity
          
      })
      .on("mouseout", (e, d) => {
        // Restore opacity of all lines
        svg.selectAll("path")
          .transition() // Apply transition for fade-out effect
          .duration(250) // Duration of the transition
          .style("opacity", 1);
        svg.selectAll(".std-line")
          .transition() // Apply transition for fade-out effect
          .duration(250) // Duration of the transition
          .style("opacity", 0) // Transition to opacity 0
        .remove();
      });

    const legendWidth = 120;
    const legendHeight = features.length * 20;

    // Add legend entry
    svg
      .append("rect")
      .attr("x", width - marginRight - legendWidth)
      .attr("y", index * 20 + 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", feature_colors[feature]);

    svg
      .append("text")
      .attr("x", width - marginRight - legendWidth + 20)
      .attr("y", index * 20 + 9 + 20)
      .text(feature.split("_")[0])
      .style("font-size", "12px")
      .style("fill", feature_colors[feature])
      .attr("alignment-baseline", "middle");
  });

  // Add the x-axis.
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

  // Add the y-axis.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

  // Append the SVG element.
  $("#data-viz").append(svg.node());
}

Chart.defaults.font.size = 12;

const data = {
  labels: [
    "Danceability",
    "Energy",
    "Speechiness",
    "Acousticness",
    "Instrumentalness",
    "Liveness",
  ],
  datasets: [
    {
      label: "Track",
      data: [0.708, 0.955, 0.0489, 0.111, 0.532, 0.952],
      borderWidth: 2,
      borderColor: "#1ED760",
      backgroundColor: "rgba(30,215,96,0.25)",
    },
    {
      label: "Monthly Average",
      data: [0.55776, 0.41608, 0.092808, 0.63792, 0.001467, 0.345436],
      borderWidth: 2,
      borderColor: "#FFC564",
      backgroundColor: "rgba(255,197,100,0.25)",
    },
  ],
};

const options = {
  plugins: {
    legend: {
      labels: {
        boxWidth: 12,
        generateLabels: (chart) => {
          return chart.data.datasets.map(
            (dataset, index) => ({
              text: dataset.label,
              fillStyle: dataset.backgroundColor,
              strokeStyle: dataset.borderColor,
              fontColor: 'white'
            })
          )
        }
      }
    }
  },
  scales: {
    r: {
      angleLines: {
        color: 'rgba(255,255,255,0.75)',
      },
      grid: {
        color: 'rgba(255,255,255,0.75)'
      },
      pointLabels: {
        color: 'rgba(255,255,255,0.75)'
      },
      ticks: {
        color: 'rgba(255,255,255,0.75)',
        backdropColor: 'rgba(0,0,0,0)'
      }
    }
  },
  maintainAspectRatio: false,
};

const ctx = document.getElementById("radarChart").getContext("2d");
const radarChart = new Chart(ctx, {
  type: "radar",
  data: data,
  options: options
});

run_viz();
