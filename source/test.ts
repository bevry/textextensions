// should be consistent between
// https://github.com/bevry/textextensions/blob/master/test.ts
// https://github.com/bevry/binaryextensions/blob/master/test.ts

import list from './index.js'
import aliens from 'binaryextensions'

import { equal, deepEqual } from 'assert-helpers'
import kava from 'kava'
import { writeFile } from 'fs'
import { join } from 'path'

import filedirname from 'filedirname'
const [file, dir] = filedirname()
const listPath = join(dir, '..', 'list.json')

const indentation = '  '

kava.suite('extensions', function (suite, test) {
	test('data had no text extensions', function () {
		const duplicates = list.filter((local) => aliens.includes(local))
		deepEqual(
			duplicates,
			[],
			'there should be no binary extensions that are present inside textextensions'
		)
	})

	test('data had duplicates removed', function () {
		const set = new Set(list)
		equal(
			list.length,
			set.size,
			'length was the same as when duplicates were removed'
		)
	})

	test('data was sorted', function () {
		const expected = list.slice().sort()
		try {
			equal(
				JSON.stringify(list, null, indentation),
				JSON.stringify(expected, null, indentation)
			)
		} catch (err) {
			for (let i = 0; i < list.length; i++) {
				if (list[i] !== expected[i]) {
					console.log(`${i}: ${list[i]} !== ${expected[i]}`)
				}
			}
			throw err
		}
	})

	test('write the json file', function (next) {
		writeFile(listPath, JSON.stringify(list), function (error) {
			if (error) return next(error)
			next()
		})
	})
})
