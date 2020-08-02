import test from 'ava'
import * as cxz from '../src/index'

test('exports', (t) => {
  t.true(typeof cxz.css === 'function')
  t.true(typeof cxz.keyframes === 'function')
  t.true(typeof cxz.extract === 'function')
  t.true(typeof cxz.reset === 'function')
})
