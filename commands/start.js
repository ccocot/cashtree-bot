'use strict'

const { Command } = require('@adonisjs/ace')
const CashTree = require('../src/cashtree')

class Start extends Command {
  static get signature () {
    return `
      start
      { --mmses=@value : msess option }
      { --av=@value : av option }
      { --gaid=@value : gaid option }
      { --imei=@value : imei option }
    `
  }

  static get description () {
    return 'Run the cashtree bot'
  }

  async handle (args, flags) {
    for (const key in flags) {
      if (!flags[key]) {
        flags[key] = await this.ask('Enter ' + key)
      }
    }

    const newCash = new CashTree(flags)
    let userInfo = await newCash.userInfo()

    if (userInfo.code) throw new Error('Login failed')

    newCash.on('data', async (data) => {
      const logOutputHead = `${data.tt} (${data.tp} - Reward: ${data.lr})\n`

      try {
        const start = await newCash.adStart(data.a)
        await newCash.adR(start.result.redirect)
        if (data.tp === 'install') await newCash.usersAppsAdd(data.ut, data.pk)
        
        let reward = await newCash.adCompleteReward(data.a)
        if (reward.code !== 0) throw new Error(reward.msg)
        reward = reward.result.ad_status[0]

        let log = `${this.icon('success')} ${logOutputHead}`
        log += `Status: ${reward.s}\n`
        log += `Completed time: ${reward.c}\n`
        log += `Installed time: ${reward.i}\n`

        this.info(log)
      } catch (err) {
        let log = `${this.icon('error')} ${logOutputHead}`
        log += `Error: ${err.message}\n`

        this.error(log)
      }
    })
    
    newCash.getAds()
  }
}

module.exports = Start
