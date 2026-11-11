import test from 'node:test'
import assert from 'node:assert/strict'
import { validateId, validateTitle } from './validate.mjs'

test('remove espaços e aceita nome válido', () => {
  assert.equal(validateTitle('  Estudar SQL  '), 'Estudar SQL')
})
test('recusa texto vazio e mais de 120 caracteres', () => {
  assert.equal(validateTitle('  '), null)
  assert.equal(validateTitle('x'.repeat(121)), null)
})
test('recusa IDs inválidos', () => {
  assert.equal(validateId('1'), 1)
  assert.equal(validateId('0'), null)
  assert.equal(validateId('1; DROP TABLE tasks'), null)
})
