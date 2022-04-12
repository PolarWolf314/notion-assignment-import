const { src, dest, series, parallel } = require('gulp');
const del = require('del');
const zip = require('gulp-zip');

const fs = require('fs');

const browserify = require('browserify');
const tsify = require('tsify');
const sourceStream = require('vinyl-source-stream');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const debug = yargs(hideBin(process.argv)).argv.debug === 'true';

const sources = {
	map(key, func) {
		return this[key].map(func);
	},
	markup: [
		{
			glob: 'src/**/*.html',
			base: 'src/',
		},
	],
	style: [
		{
			glob: 'src/style/*.css',
			base: 'src/style',
		},
	],
	assets: [
		{
			glob: 'assets/favicon/*',
			base: 'assets',
		},
	],
	scripts: [
		{
			glob: 'src/popup/popup.ts',
			outFile: 'popup/popup.js',
		},
		{
			glob: 'src/popup/parse.ts',
			outFile: 'popup/parse.js',
		},
		{
			glob: 'src/options/options.ts',
			outFile: 'options/options.js',
		},
	],
};

function clean() {
	return del('dist/**', { force: true });
}

function copy(source) {
	return function copyGlob() {
		return src(source.glob, { base: source?.base ?? '.' })
			.pipe(dest('dist'));
	};
}

function bundle(source) {
	return function bundleGlob() {
		const tsified = browserify({
			debug,
			entries: source.glob,
		})
			.plugin(tsify);

		return (
			(debug)
				? tsified
				: tsified
					// .plugin('tinyify')
		)
			.bundle()
			.pipe(sourceStream(`${source?.outFile ?? 'bundle.js'}`))
			.pipe(dest('dist'));
	};
}

function release() {
	const { version } = JSON.parse(fs.readFileSync('manifest.json', { encoding: 'utf-8' }));

	return src(['dist/**/*', 'manifest.json'], {
		base: '.',
	})
		.pipe(zip(`notion-assignment-import_v${version}.zip`))
		.pipe(zip('notion-assignment-import_latest.zip'))
		.pipe(dest('releases'));
}

exports.default = series(clean,
	parallel(
		...sources.map('markup', copy),
		...sources.map('style', copy),
		...sources.map('assets', copy),
		...sources.map('scripts', bundle),
	),
);

exports.release = release;