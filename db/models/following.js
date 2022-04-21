const {Model} = require('objection')

class following extends Model {
    static get tableName() {
        return 'following';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username','follows'],

            properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                follows: { type: 'string' }
            }
        }
    }

}

module.exports = following