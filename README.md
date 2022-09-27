## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

## TODO's
- [x] Create the layout for the game
- [x] Implement the function to select the box
- [x] Implement the function to display the valid moves
- [x] Implement the function to check if is a win
- [x] Implement the function to check if it's game over
- [x] Implement the function to replay a winner game
- [ ] Revert the move by right click in the selected box
- [ ] List the scores made user by datetime
- [ ] Save the scores in a external source
- [ ] Add on menu the tips/tutorial
- [ ] Add on menu the replay velocity control
