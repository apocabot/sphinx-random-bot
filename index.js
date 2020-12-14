import 'regenerator-runtime/runtime.js';
import * as Sphinx from 'sphinx-bot'
import * as fetch from 'node-fetch'
import axios from 'axios';
require('dotenv').config();
const msg_types = Sphinx.MSG_TYPE

let initted = false
let client

/*
// SPHINX_TOKEN contains id,secret,and url
// message.channel.send sends to the url the data
*/

const sphinxToken = process.env.SPHINX_TOKEN
const url = 'http://numbersapi.com/'


async function init() {
  if (initted) return
  initted = true

  client = new Sphinx.Client()
  client.login(sphinxToken)

  client.on(msg_types.INSTALL, async (message) => {
    console.log('=> Installing')
    const embed = new Sphinx.MessageEmbed()
      .setAuthor('Num Bot')
      .setDescription('Welcome to Num Bot! Enter /num followed by a space and any integer to get a number fact!')
      .setThumbnail(botSVG)
    message.channel.send({ embed })
  })

  client.on(msg_types.MESSAGE, async (message) => {
    const arr = message.content.split(' ')
    if (arr.length < 2) return
    if (arr[0] !== '/num') return
    const urlString = url + arr[1]
    console.log('URL String', urlString)

    const printOut = await fetchData(urlString)
    console.log('printout', printOut)

    const embed = new Sphinx.MessageEmbed()
      .setAuthor('Number Bot')
      .setTitle('Number Fact:')
      .setDescription(printOut)
      .setThumbnail(botSVG)
    message.channel.send({ embed })
  })
}

const botSVG = `<svg viewBox="64 64 896 896" height="12" width="12" fill="white">
  <path d="M300 328a60 60 0 10120 0 60 60 0 10-120 0zM852 64H172c-17.7 0-32 14.3-32 32v660c0 17.7 14.3 32 32 32h680c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-32 660H204V128h616v596zM604 328a60 60 0 10120 0 60 60 0 10-120 0zm250.2 556H169.8c-16.5 0-29.8 14.3-29.8 32v36c0 4.4 3.3 8 7.4 8h729.1c4.1 0 7.4-3.6 7.4-8v-36c.1-17.7-13.2-32-29.7-32zM664 508H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" />
</svg>`

init()

const fetchData = (url) => {
  return axios.get(url)
  .then(res =>{
    //handle success
    console.log('res.data', res.data)
    return res.data;
  })
  .catch(err => {
    console.log(err);
  })
}