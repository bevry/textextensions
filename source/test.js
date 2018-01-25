'use strict'

// should be consistent between
// https://github.com/bevry/textextensions/blob/master/test.js
// https://github.com/bevry/binaryextensions/blob/master/test.js

var fs = require('fs')
var assert = require('assert-helpers')
var sourcePath = require('path').join(__dirname, 'index.json')
var suite = require('joe').suite
var indentation = '  '

suite('extensions', function (suite, test) {
	var sourceContent, sourceData

	test('read the file', function (next) {
		fs.readFile(sourcePath, function (error, data) {
			if (error) return next(error)
			sourceContent = data.toString().trim()
			next()
		})
	})

	test('require the file', function () {
		sourceData = require(sourcePath)
	})

	test('parse the file', function () {
		sourceData = JSON.parse(sourceContent)
	})

	test('data had correct format', function (next) {
		var expected = JSON.stringify(sourceData, null, indentation)
		try {
			assert.equal(
				sourceContent,
				expected
			)
		}
		catch (err) {
			console.log('format was not correct, fixing...')
			return fs.writeFile(sourcePath, expected, function (error) {
				if (error) return next(error)
				sourceContent = expected
				console.log('fixed indentation for next commit')
				return next(err)
			})
		}
		return next()
	})

	test('data had duplicates removed', function () {
		var map = {}
		sourceData.filter(function (i) {
			if (typeof map[i] === 'undefined') {
				map[i] = true
				return true
			}
			throw new Error(i + ' is duplicated')
		})
	})

	test('data was sorted', function () {
		var expected = sourceData.slice().sort()
		assert.equal(
			sourceContent,
			JSON.stringify(expected, null, indentation)
		)
	})
})
