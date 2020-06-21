# `optimize-image-dir`

This command-line tool recursively runs a series of specific image transformation rules on a directory tree containing one or more static images. (At this time, supported formats are JPG, PNG and non-animated GIF.) Any image detected within this directory tree will be converted to PNG if it is a greyscale image, or JPG if it is color, then optimized to reduce file size.

## Installation

This command assumes a Unix-like environment, and depends on several other command-line utilities. Install these first:

- [ImageMagick](https://imagemagick.org/) (specifcally the `convert` command).
- [Jpegoptim](https://github.com/tjko/jpegoptim).
- [pngquant](https://pngquant.org/).

Once all dependencies are installed, you may install this CLI globally with the command

```
npm install -g optimize-image-dir
```

## Usage

Once installed, run `optimize-image-dir {folder name}` to process images within a parent folder. For example, if you have a console window open in a directory containing a folder named `parent-folder-with-images-in-it`, you would run

```
$ optimize-image-dir parent-folder-with-images-in-it
```

## API

This module can also be used as a dependency of other Node projects. To trigger directory optimization from another JavaScript file in your own node project, `npm install optimize-image-dir` locally, then import the `recursivelyProcessDirectory` method:

```js
const { recursivelyProcessDirectory } = require( './index' );

( async () => {
	await recursivelyProcessDirectory( '/abs/path/to/directory' );
} )();
```

See [cli.js](./cli.js) for more advanced usage, such as how to display a double progress bar to indicate progress through the first two levels of a directory tree.

## License

MIT Licensed.
