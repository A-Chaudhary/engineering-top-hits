from flask import Flask, render_template, request, redirect, url_for, jsonify
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
        def euclidean_distance(x1, x2):
            return np.sqrt(np.sum((x1 - x2) ** 2))

        # function to find closest songs
        def find_closest_songs(user_input, dataset, num_songs=6):
            distances = dataset.apply(lambda row: euclidean_distance(user_input, row), axis=1)
            closest_songs = distances.sort_values().head(num_songs)
            return closest_songs.index.tolist()

        # user input
        user_input = pd.Series({
            "Instrumentalness": int(request.form['instrumentalness'])/100,
            "Speechiness": int(request.form['speechiness'])/100,
            "Acousticness": int(request.form['acousticness'])/100,
            "Liveness": int(request.form['liveness'])/100,
            "Danceability": int(request.form['danceability'])/100,
            "Energy": int(request.form['energy'])/100
        })

        if request.form["decade"] == "1960s":
            df = df_60s
        elif request.form["decade"] == "1970s":
            df = df_70s
        elif request.form["decade"] == "1980s":
            df = df_80s
        elif request.form["decade"] == "1990s":
            df = df_90s
        elif request.form["decade"] == "2000s":
            df = df_00s
        elif request.form["decade"] == "2010s":
            df = df_10s
        elif request.form["decade"] == "2020s":
            df = df_20s

        closest_song_indices = find_closest_songs(user_input, df)
        song_names = []
        popularities = []
        artists = []
        audios = []
        images = []
        for idx in closest_song_indices:
            song_names.append(df.loc[idx, "Track Name"])
            popularities.append(int(df.loc[idx, 'Popularity']))
            artists.append(df.loc[idx, "Artist Name(s)"])
            audios.append(df.loc[idx, "Track Preview URL"])
            images.append(df.loc[idx, "Album Image URL"])

        for idx, audio_url in enumerate(audios):
            if pd.isna(audio_url):
                audios[idx] = "None" 

        data = {
            'song_names': song_names,
            'popularities': popularities,
            'artists': artists,
            'audios': audios,
            'images': images
        }

        # sorting in increasing popularity

        combined_data = zip(data['song_names'], data['popularities'], data['artists'], data['audios'], data['images'])
        sorted_data = sorted(combined_data, key=lambda x: x[1])
        sorted_song_names, sorted_popularities, sorted_artists, sorted_audios, sorted_images = zip(*sorted_data)

        sorted_dict = {
            'song_names': list(sorted_song_names),
            'popularities': list(sorted_popularities),
            'artists': list(sorted_artists),
            'audios': list(sorted_audios),
            'images': list(sorted_images)
        }

        top_100 = closest_song_indices = find_closest_songs(user_input, df, 100)
        print(top_100)
        popularities_100 = []
        for idx in top_100:
            popularities_100.append(int(df.loc[idx, 'Popularity']))

        print(popularities_100)

        sorted_dict['popularities_100'] = popularities_100
        print(sorted_dict)

        return jsonify(sorted_dict)
    
    return 0

if __name__ == '__main__':
    app.run(debug=True)
