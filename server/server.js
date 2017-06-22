const express = require('express')
const gzipStatic = require('connect-gzip-static')
const path = require('path')

const app = express()
const port = 8081

// When serving app build
const buildDir = path.resolve(__dirname, '../build')

// When serving storybook build
// const buildDir = path.resolve(__dirname, '../.out')

console.log(`serving ${buildDir} on localhost:${port}`)
app.use(gzipStatic(buildDir))
app.use((req, res) => res.sendFile(`${buildDir}/index.html`))
app.listen(port)
