const express = require('express')
const router = express.Router()

const User = require('../models/User')
const {registerAuthentication, loginAuthentication} = require('../authentications/authentication')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

