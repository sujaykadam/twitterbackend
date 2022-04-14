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
    static relationMappings = {
        followers: {
          relation: Model.HasManyRelation,
          modelClass: user,
          join: {
            from: 'user.username',
            to: 'followers.username'
          }
        },
        following: {
          relation: Model.HasManyRelation,
          modelClass: user,
          join: {
            from: 'user.username',
            to: 'following.username'
          }
        },
      };
}

module.exports = user