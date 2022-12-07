# Capi frontend

## Running the project

### WASM dependency

The core logic is in a WASM binary. Download a release from https://github.com/ivanschuetz/capi/releases and unzip the contents in `<project root>/wasm` (create wasm directory if needed). When doing this while the server is already running, just refresh the browser (it might be needed to clear the browser's cache).

### Install dependencies

```
npm install
```

### Start project

#### Dev

Start:

```
npm run dev
```

#### Prod

Build:

```
npm build --release
```

Start:

```
npm start
```

## Contributing

### Format

In general it's helpful to enable format on save on the IDE.

#### ts, tsx

For VSCode, install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

With CLI, if needed, call this from the project's root to format all files:

```
npx prettier --write .
```

There should be no differences between CLI and VSCode formatting.

Note that running Prettier is also neecessary to sort correctly Tailwind attributes (this happens via the installed [Tailwind Prettier plugin](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)).

#### sass

For VSCode, Install the [Sass extension](https://marketplace.visualstudio.com/items?itemName=Syler.sass-indented).
⚠️ Sass is deprecated. New styling will be developed with Tailwind.

### Make a pull request

Create a branch, open a pull request and request a review. Use descriptive commit messages. Split work in commits that can be easily understood and reverted.

## Recommended extensions (VS Code)

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

- [Tailwind IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

  - It's recommended to add the following attributes to `tailwindCSS.classAttributes`, in order for autocomplete etc. to work in custom component properties:
    - `bgColor`
