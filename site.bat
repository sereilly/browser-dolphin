start build/release/server.exe
start node site/server.js
start ffmpeg -f dshow -i video="Dxtory Video 1" -f mpeg1video -r 25 http://localhost:8082/s3cret/640/480