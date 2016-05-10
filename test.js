var fs = require('fs')
var equal = require('assert-helpers').equal
var sourcePath = require('path').join(__dirname, 'index.js')
var suite = require('joe').suite

suite('textextensions', function (suite, test) {
	var sourceContent, sourceData;

	test('read the file', function (next) {
		fs.readFile(sourcePath, function (error, data) {
			if ( error )  return next(error)
			sourceContent = data.toString()
			next()
		})
	})

	test('uses tabs', function () {
		if ( sourceContent.indexOf('\t') !== -1 && sourceContent.indexOf('  ') === -1 ) {
			// all good
		}
		else {
			return new Error('tabs have not been used')
		}
	})

	test('no semicolon', function () {
		if ( sourceContent.indexOf(';') !== -1 ) {
			return new Error('semicolon was used')
		}
	})

	test('parse the file', function () {
		sourceData = require(sourcePath)
	})

	test('data was sorted', function () {
		var actual = sourceData
		var expected = sourceData.slice().sort()
		equal(
			JSON.stringify(actual, null, '\t'),
			JSON.stringify(expected, null, '\t')
		)
	})

	test('data had duplicates removed', function () {
		var map = {}
		var actual = sourceData
		var expected = sourceData.filter(function (i) {
			if ( typeof map[i] === 'undefined' ) {
				map[i] = true
				return true
			}
			return false
		})
		equal(
			JSON.stringify(actual, null, '\t'),
			JSON.stringify(expected, null, '\t')
		)
	})
})
