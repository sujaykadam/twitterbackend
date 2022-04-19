const {Model} = require('objection')
const user = require('./user')
class tweets extends Model {
    static get tableName() {
        return 'tweets';
    }
    
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username','tweet'],

            properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                tweet: { type: 'string' }
            }
        }
    }   
    static relationMappings = { 
        user: {
          relation: Model.BelongsToOneRelation,
          modelClass: user,
          join: {
            from: 'user.username',
            to: 'tweet.username'
          }
        }
    }
}

module.exports = tweets