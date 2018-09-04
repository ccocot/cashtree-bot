#!/usr/bin/env node

'use strict'

const ace = require('@adonisjs/ace')

ace.addCommand(require('./commands/start'))

ace.onError(function (error, commandName) {
  console.log(`${commandName} reported ${error.message}`)
  process.exit(1)
})

// Boot ace to execute commands
ace.wireUpWithCommander()
ace.invoke()
