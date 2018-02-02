const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const stylelint = require('stylelint');

module.exports = {
    development: {
        files: [ {
            cwd: 'src/styles/',
            dest: 'build/styles/',
            expand: true,
            src: [ 'styles.css' ]
        } ],
        options: {
            processors: [
                autoprefixer({
                    browsers: 'last 2 versions'
                })
            ]
        }
    },
    lint: {
        options: {
            processors: [
                stylelint({ config: { extends: 'stylelint-config-holy-grail' } })
            ],
            writeDest: false
        },
        src: [ 'src/**/*.css' ]
    },
    production: {
        files: [ {
            cwd: 'src/styles/',
            dest: 'build/styles/',
            expand: true,
            src: [ 'styles.css' ]
        } ],
        options: {
            processors: [
                autoprefixer({
                    browsers: 'last 2 versions'
                }),
                cssnano()
            ]
        }
    }
};
