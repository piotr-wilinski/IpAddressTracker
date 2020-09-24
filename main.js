'use strict'

const form = document.querySelector('form')
const input = document.querySelector('.ip-search')

class IP {
  constructor(ipAddress = '') {
    this.ipAddress = ipAddress
    this.API = `https://geo.ipify.org/api/v1?apiKey=at_UZsip4JpTH2wVznbUvDZkL3KpDJRb&ipAddress=&domain=${this.ipAddress}`

    this.mymap

    //DOM elements
    this.ipText = document.querySelector('.ip')
    this.locationText = document.querySelector('.location')
    this.timezoneText = document.querySelector('.timezone')
    this.ispText = document.querySelector('.isp')
  }

  initializeData() {
    this.getData()
  }

  async getData() {
    const data = await this.fetchData(this.API)

    this.addValues(data)
    this.refreshMapLocation(data.location)
  }

  async fetchData(url) {
    const res = await fetch(url)
    const parsedRes = await res.json()

    return parsedRes
  }

  addValues(data) {
    this.ipText.textContent = data.ip
    this.locationText.textContent = `${data.location.region}, ${data.location.city} ${data.location.postalCode}`
    this.timezoneText.textContent = `UTC ${data.location.timezone}`
    this.ispText.textContent = data.isp
  }

  refreshMapLocation(data) {
    var container = L.DomUtil.get('mapid');
    if (container !== null) {
      container._leaflet_id = '';
    }

    var newMarker = L.icon({
      iconUrl: '../ip-address-tracker/images/icon-location.svg',
      iconSize: [46, 56],
      iconAnchor: [23, 56],
    })

    this.mymap = L.map('mapid').setView([data.lat + 0.03, data.lng], 12);
    let tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mymap);
    let marker = L.marker([data.lat, data.lng], { icon: newMarker }).addTo(this.mymap)
  }
}

const ipDefault = new IP()
ipDefault.initializeData()

form.addEventListener('submit', e => {
  e.preventDefault()

  let ipAddress = input.value
  input.value = ''

  const ip = new IP(ipAddress)
  ip.initializeData()
})