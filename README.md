# fileserver_example

A web server application example running with NodeJS

# Setup

Install NodeJS and npm. On Ubuntu:

```
sudo apt install -y nodejs npm
```

Install the _formidable_ module:

```
npm i formidable
```

# Run

Start the web server with:

```
node fileserver.js
```

And open the following URL in your web browser: http://localhost:8080

# Benchmark zlib

This script benchmarks the JS code performing the zlib compression using different levels: 

```
bash ./bench.sh
```

This will output CSV-like data:

```
File name, level 1 read (MB/s), level 1 write (MB/s), level 1 compression (%), ...
dickens, 26.27, 11.82, 44.99, 23.71, 10.21, 43.07, 19.06, 7.84, 41.13, 18.69, 7.51, 40.18, 12.79, 4.96, 38.75, 8.31, 3.16, 37.99, 7.25, 2.75, 37.86, 6.39, 2.42, 37.82, 6.44, 2.43, 37.82,
mozilla, 34.64, 13.92, 40.17, 32.78, 12.96, 39.53, 26.99, 10.53, 39.02, 24.92, 9.49, 38.10, 19.01, 7.13, 37.51, 13.46, 5.02, 37.27, 10.90, 4.06, 37.21, 6.29, 2.34, 37.17, 4.02, 1.50, 37.18,
```

# Using Docker

To build and run the file server:

```
docker build -t myfileserver . 
docker run --rm --network host -d myfileserver
```

Here is how to run the benchmark with the same image:

```
docker run -it --rm --network host myfileserver bash bench.sh
```

