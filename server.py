from flask import Flask, render_template, request, redirect, url_for
import pandas as pd
import numpy as np

app = Flask(__name__)


# reading in data
try:
    df = pd.read_csv("top_10000_1960-now.csv")
except Exception as e:
    print("Error:", e)

df['Release Date'] = pd.to_datetime(df['Album Release Date'], errors='coerce')
df_60s = df[(df['Album Release Date'] >= '1960-01-01') & (df['Album Release Date'] <= '1969-12-31')]
df_70s = df[(df['Album Release Date'] >= '1970-01-01') & (df['Album Release Date'] <= '1979-12-31')]
df_80s = df[(df['Album Release Date'] >= '1980-01-01') & (df['Album Release Date'] <= '1989-12-31')]
df_90s = df[(df['Album Release Date'] >= '1990-01-01') & (df['Album Release Date'] <= '1999-12-31')]
df_00s = df[(df['Album Release Date'] >= '2000-01-01') & (df['Album Release Date'] <= '2009-12-31')]
df_10s = df[(df['Album Release Date'] >= '2010-01-01') & (df['Album Release Date'] <= '2019-12-31')]
df_20s = df[(df['Album Release Date'] >= '2020-01-01') & (df['Album Release Date'] <= '2029-12-31')]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create', methods=['GET', 'POST'])
def create():
    if request.method == 'POST':
        # function to calculate Euclidean distance
        def euclidean_distance(x1, x2):
            return np.sqrt(np.sum((x1 - x2) ** 2))

        # function to find closest songs
        def find_closest_songs(user_input, dataset, num_songs=5):
            distances = dataset.apply(lambda row: euclidean_distance(user_input, row), axis=1)
            closest_songs = distances.sort_values().head(num_songs)
            return closest_songs.index.tolist()

        # user input
        user_input = pd.Series({
            "Instrumentalness": int(request.form['instrumentalness'])*100,
            "Speechiness": int(request.form['speechiness'])*100,
            "Acousticness": int(request.form['acousticness'])*100,
            "Liveness": int(request.form['liveness'])*100,
            "Danceability": int(request.form['danceability'])*100,
            "Energy": int(request.form['energy'])*100
        })

        # find closest songs
        if request.form["decade"] == "df_60s":
            df = df_60s
        elif request.form["decade"] == "df_70s":
            df = df_70s
        elif request.form["decade"] == "df_80s":
            df = df_80s
        elif request.form["decade"] == "df_90s":
            df = df_90s
        elif request.form["decade"] == "df_00s":
            df = df_00s
        elif request.form["decade"] == "df_10s":
            df = df_10s
        elif request.form["decade"] == "df_20s":
            df = df_20s

        closest_song_indices = find_closest_songs(user_input, df)
        song_names = []
        popularities = []
        artists = []
        audios = []
        images = []
        for idx in closest_song_indices:
            song_names.append(df.loc[idx, "Track Name"])
            popularities.append(df.loc[idx, 'Popularity'])
            artists.append(df.loc[idx, "Artist Name(s)"])
            audios.append(df.loc[idx, 'Track Preview URL'])
            images.append(df.loc[idx, 'Album Image URL'])

        data = zip(popularities, song_names, artists, audios, images)

        return render_template('create.html', data = data, df = request.form["decade"])
    return render_template('create.html')

if __name__ == '__main__':
    app.run(debug=True)
