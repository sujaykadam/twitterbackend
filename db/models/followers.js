const {Model} = require('objection')

class followers extends Model {
    static get tableName() {
        return 'followers';
    }
    
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username','follower'],

            properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                follower: { type: 'string' }
            }
        }
    }

    static relationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: 'user',
            join: {
                from: 'user.username',
                to: 'followers.username'
            }
        }
    };
}

module.exports = followers