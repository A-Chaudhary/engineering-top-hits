from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create')
def create():
    return render_template('create.html')

@app.route('/results', methods=['POST'])
def results():
        energy_value = request.form['energyValue']
        speechiness_value = request.form['speechinessValue']
        acousticness_value = request.form['acousticnessValue']
        instrumentalness_value = request.form['instrumentalnessValue']
        liveness_value = request.form['livenessValue']
        danceability_value = request.form['danceabilityValue']
        
        return render_template('results.html', energy=energy_value, speechiness=speechiness_value, acousticness=acousticness_value, instrumentalness=instrumentalness_value,liveness=liveness_value,danceability=danceability_value)

if __name__ == '__main__':
    app.run(debug=True)
