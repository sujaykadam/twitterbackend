const { Model } = require('objection');


class user extends Model {
  static get tableName() {
    return 'user';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'password'],

      properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        password: { type: 'string' }
      }
    }
  }
  static get relationMappings() {
    const following = require('./following');
    const tweets = require('./tweets');
    return {

      following: {
        relation: Model.HasManyRelation,
        modelClass: following,
        join: {
          from: 'user.username',
          to: 'following.username'
        }
      },

      followers: {
        relation: Model.HasManyRelation,
        modelClass: following,
        join: {
          from: 'user.username',
          to: 'following.follows'
        }
    },
    
      tweets: {
        relation: Model.HasManyRelation,
        modelClass: tweets,
        join: {
          from: 'user.username',
          to: 'tweets.username'
        }
      },
    }
  };
}

module.exports = user