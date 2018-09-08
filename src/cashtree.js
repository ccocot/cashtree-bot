'use strict'

/**
* @author Ccocot <ccocot@bc0de.net>
* @file for create request to cashtree host.
* @version 1.0
*/

const request = require('request-promise')
const EventEmitter = require('events')

class CashTree extends EventEmitter {
  /**
  * Set up CashTree account data
  *
  * @param {Object} data
  * @param {string} data.mmses
  * @param {string} data.av
  * @param {string} data.gaid
  * @param {string} data.imei
  */
  constructor (data) {
    super()
    this._host = 'https://api.ctree.id'
    this._data = data
    this._reqOpt = { method: 'post', json: true, simple: false }
    this._reqOpt.form = Object.assign({
      ov: '7.1.2',
      lc: 'en_GB',
      pn: 'com.vitiglobal.cashtree' }, this._reqOpt.form, data)
  }

  /**
  * Get all ads campaign list
  *
  * @return {Object} response when get all ads list
  */
  adList () {
    const reqOpt = JSON.parse(JSON.stringify(this._reqOpt))
    reqOpt.uri = 'https://api.ctree.id/api2/ad/list'
    return request(reqOpt)
  }

  /**
  * Start the ads
  *
  * @param  {number}  adid
  * @return {Promise} response when start ads campaign
  */
  adStart (adid) {
    const reqOpt = JSON.parse(JSON.stringify(this._reqOpt))
    reqOpt.uri = 'https://api.ctree.id/api2/ad/start'
    reqOpt.form.adid = adid
    reqOpt.form.from = 'C'
    return request(reqOpt)
  }

  /**
  * Follow redirect uri
  *
  * @param {String} redirect
  * @return {Promise} response when follow redirect uri of ads
  */
  adR (redirect) {
    return request({
      uri: 'https://api.ctree.id' + redirect,
      followRedirect: false,
      simple: false
    })
  }

  /**
  * Add apps to user (install app)
  *
  * @param {number} size
  * @param {string} app
  * @return {Promise} response when add app to installed list
  */
  usersAppsAdd (size, app) {
    const reqOpt = JSON.parse(JSON.stringify(this._reqOpt))
    reqOpt.uri = 'https://api.ctree.id/api2/user/apps/add'
    reqOpt.form.size = size
    reqOpt.form.app = app
    return request(reqOpt)
  }

  /**
  * Claim reward
  *
  * @param {number} adid
  * @return {Promise} response when claim reward of ads campaign
  */
  adCompleteReward (adid) {
    const reqOpt = JSON.parse(JSON.stringify(this._reqOpt))
    reqOpt.uri = 'https://api.ctree.id/api2/ad/complete/reward'
    reqOpt.form.adid = adid
    return request(reqOpt)
  }

  async getAds () {
    let adList = await this.adList()
    adList = adList.result.al
    for (const ad of adList) {
      this.emit('data', ad)
    }
  }
}

module.exports = CashTree
