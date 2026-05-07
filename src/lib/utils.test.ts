import assert from 'node:assert/strict'
import { test, describe } from 'node:test'
import { truncate, slugify, formatDate } from './utils.ts'

describe('truncate', () => {
  test('returns the original text if it is shorter than maxLength', () => {
    assert.strictEqual(truncate('Hello', 10), 'Hello')
  })

  test('returns the original text if it is exactly maxLength', () => {
    assert.strictEqual(truncate('Hello', 5), 'Hello')
  })

  test('truncates and adds ellipsis if text is longer than maxLength', () => {
    assert.strictEqual(truncate('Hello World', 5), 'Hello…')
  })

  test('trims trailing whitespace after truncation', () => {
    assert.strictEqual(truncate('Hello   World', 6), 'Hello…')
  })

  test('handles empty string', () => {
    assert.strictEqual(truncate('', 5), '')
  })

  test('handles maxLength of 0', () => {
    assert.strictEqual(truncate('Hello', 0), '…')
  })
})

describe('slugify', () => {
  test('converts text to lowercase', () => {
    assert.strictEqual(slugify('Hello World'), 'hello-world')
  })

  test('replaces spaces with hyphens', () => {
    assert.strictEqual(slugify('hello world'), 'hello-world')
  })

  test('removes special characters', () => {
    assert.strictEqual(slugify('Hello World! @2024'), 'hello-world-2024')
  })

  test('collapses multiple hyphens/spaces', () => {
    assert.strictEqual(slugify('hello   world__test'), 'hello-world-test')
  })

  test('trims leading and trailing hyphens', () => {
    assert.strictEqual(slugify('---hello world---'), 'hello-world')
  })

  test('handles empty string', () => {
    assert.strictEqual(slugify(''), '')
  })
})

describe('formatDate', () => {
  test('formats a date string correctly', () => {
    // Note: localDateString can be environment dependent, but 'en-US' is specified
    const formatted = formatDate('2024-05-04')
    assert.strictEqual(formatted, 'May 4, 2024')
  })

  test('handles ISO strings', () => {
    const formatted = formatDate('2024-05-04T12:00:00Z')
    assert.strictEqual(formatted, 'May 4, 2024')
  })
})
