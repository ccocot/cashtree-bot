#!/usr/bin/env node

'use strict'

const ace = require('@adonisjs/ace')

ace.addCommand(require('./commands/start'))

ace.onError(function (error, commandName) {

  if (error.message === 'Login failed') {
    console.log('\nLogin failed\n')
  }

  process.exit(1)
})

// Boot ace to execute commands
ace.wireUpWithCommander()
ace.invoke()
