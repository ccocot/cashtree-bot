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
    if (!flags.mmses) {
      flags.mmses = await this.ask('Enter mmses')
    }

    if (!flags.av) {
      flags.av = await this.ask('Enter av')
    }

    if (!flags.gaid) {
      flags.gaid = await this.ask('Enter gaid')
    }

    if (!flags.imei) {
      flags.imei = await this.ask('Enter imei')
    }

    const newCash = new CashTree(flags)
    newCash.on('data', async (data) => {
      const header = `[${data.a}] ${data.tt} (${data.tp} - Reward: ${data.lr})`
      try {
        const start = await newCash.adStart(data.a)
        await newCash.adR(start.result.redirect)
        if (data.tp === 'install') await newCash.usersAppsAdd(data.ut, data.pk)
        const reward = await newCash.adCompleteReward(data.a)
        if (reward.code !== 0) throw new Error(reward.msg)
        console.log(`${header} | Total: ${reward.result.cash_status.total} - Earned: ${reward.result.cash_status.earn_today}`)
      } catch (err) {
        console.log(`${header} | Error: ${err.message}`)
      }
    })
    newCash.getAds()
  }
}

module.exports = Start
