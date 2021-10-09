# Shitty Sync

A (somewhat) shitty way to sync videos with your friends.

### Getting started

- pull this repo
- install the dependencies (both in the root folder & in the `frontend` folder)
- build the frontend with `npm run build`
- run the server with `npm run start`

### Development

- Instead of `npm run build` & `npm run start` you can run `npm run dev` in both folders to get live reload.
- After updating any of the svg icons
  run `node frontend/misc/svgpack/index.js frontend/misc/icons/ frontend/public/icons.svg`(you might have to run `npm i`
  there too)
- After changing emotes run `npm start scan-emotes` in the `frontend/` folder

### Deploying using Docker:

1. Build the image:

  ```bash
  docker build --target=run -t shitty-sync .
  ```

2. Run the container:

  ```bash
  docker run -p 8080:8080 shitty-sync:latest
  ```

### Contributing

do it pls
