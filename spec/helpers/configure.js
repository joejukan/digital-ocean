const { copy } = require('@joejukan/web-kit')
const { configurations } = require('../../src');
copy({debug: false}, configurations.logging)
copy({filename: 'logs/application.log', audit_file: 'logs/audit.json', verbose: false}, configurations.logging.rotation)
configurations.dns = [
    {
        interval: 10,
        bearer: 'xxx',
        records: [
            { domain: 'arcanav.com', type: 'A', name: 'api' },
            { domain: 'arcanav.com', type: 'A', name: 'app' },
            { domain: 'arcanav.com', type: 'A', name: 'www' }
        ]
    }
]