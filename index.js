#!/usr/bin/env node
const npmName = require('npm-name')
const fs = require('fs')
require('colors')

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
const startFrom = process.argv[2] || 'aaa'
const file = 'available.txt'

void async function main() {
  let skip = true
  for (let i of alphabet) {
    for (let j of alphabet) {
      for (let k of alphabet) {
        let name = i + j + k
        if (startFrom === name) {
          skip = false
          continue
        }
        if (skip) continue

        let available
        do {
          try {
            available = await npmName(name)
            break
          } catch (err) {
            console.error(err.toString())
            console.error('Waiting for 60 seconds before retrying...'.red)
            await sleep(60 * 1000)
          }
        } while (true)

        if (available) {
          fs.appendFileSync(file, name + '\n')
          console.log(name.green + ' available')
        } else {
          console.log(name.grey);
        }
      }
    }
  }
}()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
