const {Model} = require('objection')

class following extends Model {
    static get tableName() {
        return 'following';
    }
    static get relationMappings() {
        const tweets = require('./tweets');
        return {
            tweets: {
                relation: Model.HasManyRelation,
                modelClass: tweets,
                join: {
                    from: 'tweets.username',
                    to: 'following.follows'
                }
            },
        }
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
    static modifiers = {
        followingtweet(query) {
            query
                .select('tweets')
        }
    }

}

module.exports = following