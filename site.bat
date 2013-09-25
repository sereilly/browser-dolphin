start node site/server.js
start ffmpeg -f dshow -i video="UScreenCapture" -r 25 -fflags nobuffer -threads 0 -f flv "rtmp://localhost:1935/live/test"
start ffmpeg -f dshow -i audio="Stereo Mix (Realtek High Defini" -fflags nobuffer -threads 0 -async 1 -c:a libspeex -ac 1 -ar 16k -f flv "rtmp://localhost:1935/live/audio"