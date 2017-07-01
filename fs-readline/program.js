"use strict";

import * as fs from 'fs'
import * as readline from 'readline'

/** @global process */

console.log('Print `help` for command list.')

const rl = readline.createInterface(process.stdin, process.stdout)
rl.setPrompt('> ')
rl.prompt()

rl.on('line', /** @param {string} line */(line) => {
  const words = line.split(' ')
  const command = words[0]
  switch(command) {
    case 'help':
      console.log('pwd')
      console.log('ls')
      console.log('cd DIR')
      console.log('mkdir DIR')
      console.log('rmdir DIR')
      console.log('cat FILE')
      console.log('touch FILE')
      console.log('cp FILE_SRC FILE_DST')
      console.log('rm FILE')
      break
    case 'pwd': {
      const path = process.cwd()
      console.log(path)
      break
    }
    case 'ls': {
      const path = process.cwd()
      const stats = fs.statSync(path)
      if(stats.isDirectory()) {
        const fileNames = fs.readdirSync(path)
        fileNames.forEach(function(fileName) {
          console.log(fileName)
        }, this);
      }
      else {
        console.log('Unknown directory: ' + path)
      }
      break
    }
    case 'cd': {
      const path = words.slice(1).join(' ')
      const stats = fs.statSync(path)
      if(stats.isDirectory()) {
        process.chdir(path)
      }
      else {
        console.log('Unknown directory: ' + path)
      }
      break
    }
    case 'mkdir': {
      const path = words.slice(1).join(' ')
      try {
        fs.mkdirSync(path)
      }
      catch (err) {
        console.log(err)
      }
      break
    }
    case 'rmdir': {
      const path = words.slice(1).join(' ')
      try {
        fs.rmdirSync(path)
      }
      catch (err) {
        console.log(err)
      }
      break
    }
    case 'cat': {
      const path = words.slice(1).join(' ')
      try {
        const content = fs.readFileSync(path, 'utf8')
        console.log(content)
      }
      catch (err) {
        console.log(err)
      }
      break
    }
    case 'touch': {
      const path = words.slice(1).join(' ')
      try {
        const fd = fs.openSync(path, 'w')
      }
      catch (err) {
        console.log(err)
      }
      break
    }
    case 'cp': {
      const input = fs.createReadStream(words[1])
      const output = fs.createWriteStream(words[2])
      input.on('data', (data) => {
        output.write(data)
      })
      break
    }
    case 'rm': {
      const path = words.slice(1).join(' ')
      try {
        fs.unlinkSync(path)
      }
      catch (err) {
        console.log(err)
      }
      break
    }
    default: {
      console.log('Print `help` for command list.')
      break
    }
  }
  rl.prompt()
})

rl.on('close', () => {
  console.log('Bye!')
  process.exit(0)
})
