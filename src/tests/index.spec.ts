import { expect, test } from 'vitest'
import { add } from './index'

test('init', () => {
  expect(add(2, 3)).toBe(5)
})
