const { Model } = require('objection')
class tweets extends Model {
    static get tableName() {
        return 'tweets';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'tweet'],

            properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                tweet: { type: 'string' }
            }
        }
    }
    static get relationMappings() {
        const user = require('./user');
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: user,
                join: {
                    from: 'tweets.username',
                    to: 'user.username'
                }
            },
        }
    }
    static modifiers = {
        ordertweet(query) {
            query
                .select('id', "tweet")
                .orderBy("created_at", 'desc')
        }
    }

}

module.exports = tweets