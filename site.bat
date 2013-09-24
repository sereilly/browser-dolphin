start node site/server.js
ffmpeg -f dshow -i video="Dxtory
Video 1" -r 25 -fflags nobuffer -threads 0 -f flv "rtmp://localhost:1935/live/test"