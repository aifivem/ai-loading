name 'ai-loading'
author 'TGIANN'
version '0.1.3' -- x-release-please-version
license 'GPL-3.0-only'
description 'Loading screen in the TGIANN style: the server brand, loading progress and tips from the admin panel'
repository 'https://github.com/aifivem/ai-loading'
fx_version 'cerulean'
game 'gta5'
node_version '22'

server_script 'dist/server.js'
loadscreen 'dist/web/index.html'
loadscreen_manual_shutdown 'yes'

dependencies {
	'/onesync',
	'ai-core',
}

files {
	'locales/*.json',
	'dist/backgrounds/*.jpg',
	'dist/web/assets/*.js',
	'dist/web/assets/*.css',
	'dist/web/assets/*.woff',
	'dist/web/assets/*.woff2',
	'dist/web/*.html',
}
