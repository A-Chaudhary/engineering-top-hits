window.addEventListener('load', restoreScrollPosition);

$(document).ready(function() {
    $('#dots').on('click', '.dot-wrap', function() {
        event.preventDefault();

        $('.dot-wrap').removeClass('active');
        $(this).addClass('active');

        var formData = {
            instrumentalness: $('#instrumentalnessValue').text(),
            speechiness: $('#speechinessValue').text(),
            acousticness: $('#acousticnessValue').text(),
            liveness: $('#livenessValue').text(),
            danceability: $('#danceabilityValue').text(),
            energy: $('#energyValue').text(),
            decade: $(this).text()
        };

        $.ajax({
            type: 'POST',
            url: '/create', 
            data: formData,
            success: function(response) {
                console.log(response)
                $('#songList').empty();

                // add timeline here
                var decades = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
                $('#dots').empty();

                var decades = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
                for (var i = 0; i < decades.length; i++) {
                    var dotHTML = '<div class="dot-wrap';
                    if (formData.decade === decades[i]) {
                        dotHTML += ' active'; // Add 'active' class if current decade matches formData.decade
                    }
                    dotHTML += '"><div class="dot"></div>' + decades[i] + '</div>';
                    $('#dots').append(dotHTML);
                }


                // generating and formatting song list
                response.song_names.forEach(function(song, index) {
                var songElement = $('<div class="song"></div>');
                songElement.append('<div class="popularity">' + response.popularities[index] + '<div class="popularity-text">Popularity</div></div>');
                songElement.append('<div class="embed">');
                songElement.find('.embed').append('<img class="img" src="' + response.images[index] + '">');
                songElement.find('.embed').append('<div class="song-artist">');
                songElement.find('.embed .song-artist').append('<div class="song">' + song + '</div>');
                songElement.find('.embed .song-artist').append('<div class="artist">' + response.artists[index] + '</div>');
                songElement.find('.embed .song-artist').append('<div class="preview">');
                songElement.find('.embed .song-artist .preview').append('<audio controls id="audio' + index + '">');
                songElement.find('.embed .song-artist .preview audio').append('<source src="' + response.audios[index] + '" type="audio/mpeg">');
                
                // conditionally add the play button if audio link is not "None"
                if (response.audios[index] !== "None") {
                    songElement.find('.embed').append('<div class="play" onclick="togglePlayPause(' + index + ')">');
                    songElement.find('.embed .play').append('<img class="img" id="playPause' + index + '" src="../static/Play.png" style="height: 30px;width:30px;">');
                }
                
                songElement.append('</div>'); 
                $('#songList').append(songElement);
            });


            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });


    $('#button').click(function(event) {
        event.preventDefault();

        var formData = {
            instrumentalness: $('#instrumentalnessValue').text(),
            speechiness: $('#speechinessValue').text(),
            acousticness: $('#acousticnessValue').text(),
            liveness: $('#livenessValue').text(),
            danceability: $('#danceabilityValue').text(),
            energy: $('#energyValue').text(),
            decade: '1960s'
        };

        $.ajax({
            type: 'POST',
            url: '/create', 
            data: formData,
            success: function(response) {
                console.log(response)
                $('#songList').empty();

                $('#dots').empty();

                var decades = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
                for (var i = 0; i < decades.length; i++) {
                    var dotHTML = '<div class="dot-wrap';
                    if (formData.decade === decades[i]) {
                        dotHTML += ' active'; // Add 'active' class if current decade matches formData.decade
                    }
                    dotHTML += '"><div class="dot"></div>' + decades[i] + '</div>';
                    $('#dots').append(dotHTML);
                }
                    
                // generating and formatting song list
                response.song_names.forEach(function(song, index) {
                var songElement = $('<div class="song"></div>');
                songElement.append('<div class="popularity">' + response.popularities[index] + '<div class="popularity-text">Popularity</div></div>');
                songElement.append('<div class="embed">');
                songElement.find('.embed').append('<img class="img" src="' + response.images[index] + '">');
                songElement.find('.embed').append('<div class="song-artist">');
                songElement.find('.embed .song-artist').append('<div class="song">' + song + '</div>');
                songElement.find('.embed .song-artist').append('<div class="artist">' + response.artists[index] + '</div>');
                songElement.find('.embed .song-artist').append('<div class="preview">');
                songElement.find('.embed .song-artist .preview').append('<audio controls id="audio' + index + '">');
                songElement.find('.embed .song-artist .preview audio').append('<source src="' + response.audios[index] + '" type="audio/mpeg">');
                
                // conditionally add the play button if audio link is not "None"
                if (response.audios[index] !== "None") {
                    songElement.find('.embed').append('<div class="play" onclick="togglePlayPause(' + index + ')">');
                    songElement.find('.embed .play').append('<img class="img" id="playPause' + index + '" src="../static/Play.png" style="height: 30px;width:30px;">');
                }
                
                songElement.append('</div>'); 
                $('#songList').append(songElement);
            });


            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
});

function togglePlayPause(index) {
    var audio = document.getElementById('audio' + index);
    var playPauseImg = document.getElementById('playPause' + index);

    if (audio.paused) {
        audio.play();
        playPauseImg.src = "../static/Pause.png";
    } else {
        audio.pause();
        playPauseImg.src = "../static/Play.png";
    }
}

// code for timeline
const dotWraps = document.querySelectorAll('.dot-wrap');

dotWraps.forEach(dotWrap => {
  dotWrap.addEventListener('click', function() {
    dotWraps.forEach(element => {
      element.classList.remove('active');
    });
    
    this.classList.add('active');
    const decadeId = this.id;
    document.getElementById("instrumentalnessInput").value = document.getElementById("instrumentalnessValue").textContent;
    document.getElementById("speechinessInput").value = document.getElementById("speechinessValue").textContent;
    document.getElementById("acousticnessInput").value = document.getElementById("acousticnessValue").textContent;
    document.getElementById("livenessInput").value = document.getElementById("livenessValue").textContent;
    document.getElementById("danceabilityInput").value = document.getElementById("danceabilityValue").textContent;
    document.getElementById("energyInput").value = document.getElementById("energyValue").textContent;
    document.getElementById('decadeInput').value = decadeId;
    storeScrollPosition();
    document.getElementById('form').submit();
  });
});


// code for circles
const energy = {
    element: document.getElementById('energy'),
    valueElement: document.getElementById('energyValue'),
    dragging: false,
    startAngle: 0,
    currentValue: 0
};

const speechiness = {
    element: document.getElementById('speechiness'),
    valueElement: document.getElementById('speechinessValue'),
    dragging: false,
    startAngle: 0,
    currentValue: 0
};

const acousticness = {
    element: document.getElementById('acousticness'),
    valueElement: document.getElementById('acousticnessValue'),
    dragging: false,
    startAngle: 0,
    currentValue: 0
};

const instrumentalness = {
    element: document.getElementById('instrumentalness'),
    valueElement: document.getElementById('instrumentalnessValue'),
    dragging: false,
    startAngle: 0,
    currentValue: 0
};

energy.element.addEventListener('mousedown', (event) => startDrag(event, energy));
energy.element.addEventListener('touchstart', (event) => startDrag(event, energy));

speechiness.element.addEventListener('mousedown', (event) => startDrag(event, speechiness));
speechiness.element.addEventListener('touchstart', (event) => startDrag(event, speechiness));

acousticness.element.addEventListener('mousedown', (event) => startDrag(event, acousticness));
acousticness.element.addEventListener('touchstart', (event) => startDrag(event, acousticness));

instrumentalness.element.addEventListener('mousedown', (event) => startDrag(event, instrumentalness));
instrumentalness.element.addEventListener('touchstart', (event) => startDrag(event, instrumentalness));

function startDrag(event, circle) {
    event.preventDefault();
    circle.dragging = true;
    circle.startAngle = getAngle(event, circle.element);

    document.addEventListener('mousemove', (event) => drag(event, circle));
    document.addEventListener('touchmove', (event) => drag(event, circle));
    document.addEventListener('mouseup', () => stopDrag(circle));
    document.addEventListener('touchend', () => stopDrag(circle));
}

function drag(event, circle) {
    if (!circle.dragging) return;
    const currentAngle = getAngle(event, circle.element);
    let angleChange = currentAngle - circle.startAngle;
    let totalRotation = (circle.currentValue + angleChange / 3) * 3.6;
    totalRotation = (totalRotation + 360) % 360;

    circle.currentValue = Math.round(totalRotation / 3.6);

    if (circle.currentValue > 100) {
        circle.currentValue = 0;
    } else if (circle.currentValue < 0) {
        circle.currentValue = 100;
    }

    circle.valueElement.innerText = circle.currentValue;
    circle.element.style.transform = `rotate(${totalRotation}deg)`;
    circle.startAngle = currentAngle;
}

function stopDrag(circle) {
    circle.dragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', () => stopDrag(circle));
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', () => stopDrag(circle));
}

function getAngle(event, element) {
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    return angle;
}

// code for sliders
const liveness = document.getElementById("liveness");
const livenessValue = document.getElementById("livenessValue");

    liveness.oninput = function() {
        livenessValue.innerHTML = this.value;
    };

    liveness.addEventListener("input", function() {
        this.style.setProperty("--value", this.value);
    }); 

const danceability = document.getElementById("danceability");
const danceabilityValue = document.getElementById("danceabilityValue");

danceability.oninput = function() {
    danceabilityValue.innerHTML = this.value;
};

danceability.addEventListener("input", function() {
    this.style.setProperty("--value", this.value);
}); 

// updates hidden input values
function updateHiddenInputs() {
    document.getElementById("instrumentalnessInput").value = document.getElementById("instrumentalnessValue").textContent;
    document.getElementById("speechinessInput").value = document.getElementById("speechinessValue").textContent;
    document.getElementById("acousticnessInput").value = document.getElementById("acousticnessValue").textContent;
    document.getElementById("livenessInput").value = document.getElementById("livenessValue").textContent;
    document.getElementById("danceabilityInput").value = document.getElementById("danceabilityValue").textContent;
    document.getElementById("energyInput").value = document.getElementById("energyValue").textContent;
    document.getElementById('decadeInput').value = "df_60s"; // default
}

document.getElementById("button").addEventListener("click", function() {
    updateHiddenInputs();
});

function storeScrollPosition() {
    sessionStorage.setItem('scrollPosition', window.scrollY);
}

// Function to restore the scroll position
function restoreScrollPosition() {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem('scrollPosition');
    }
}