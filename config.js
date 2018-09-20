const fs = require('fs')
const ini = require('ini')


class Config {
    constructor() {
        this.port = 6001;

        this.readconfig();
    }

    readconfig() {
        var cfg = ini.parse(fs.readFileSync('config/config.ini', 'utf-8'));
        cfg.base.port && (this.port = cfg.base.port);

        console.log("Read Config.ini Success!");
    }
    
}

var config = new Config()

module.exports = config;
