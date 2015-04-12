arDrone  = require 'ar-drone'

client = arDrone.createClient ip: process.env.DRONE_IP or config.drone_ip or '192.168.1.1'

module.exports = client
