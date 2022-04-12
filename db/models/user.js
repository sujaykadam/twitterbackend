const {Model} = require('objection')

class user extends Model {
    static get tableName() {
        return 'user';
    }
    
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username','password'],

            properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                password: { type: 'string' }
            }
        }
    }   
}

module.exports = user