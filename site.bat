start node site/server.js
start ffmpeg -f dshow -i video="Dxtory Video 1":audio="Stereo Mix (Realtek High Defini" -pix_fmt yuv420p -c:v libx264 -an -preset ultrafast -tune zerolatency -fflags nobuffer -f flv "rtmp://localhost:1935/live/test"
