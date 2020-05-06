import { User, Questions } from '../models';
import * as _ from 'lodash';
import { logger } from '../../lib';

class DBUtility {


    static doStatisticOperationOnFilteredUsers(filters, logicalOperand, statisticOperations) {
        const matchExpression = {};
        const queries = [];
        const projection = {};

        _.forEach(filters, (value, key) => {

            if(this.isValidFilterKey(key) && this.isValidFilterValue(value)) {

                const exp = {
                    'profile': {
                        '$elemMatch': {
                            key: _.trim(key), 
                            value: _.isArray(value) ? { '$in': value } : _.trim(value, " ")
                        }
                    }
                };
                queries.push(exp);
            }

        });

        matchExpression['$' + logicalOperand] = queries;

        const aggregateArgument = [];
        if(!_.isEmpty(queries)) {
            aggregateArgument.push({'$match': matchExpression});
        }

        aggregateArgument.push({
            '$lookup': {
                'from': 'Questions',
                'localField': '_id',
                'foreignField': 'userId',
                'as': 'Questions'
            }
        });

        if(statisticOperations.median) {
            projection['median'] = true;
            // Unwinding nested questions array of document 
            aggregateArgument.push({'$unwind': "$Questions"});
            // Sorting unwinded document based on rating
            aggregateArgument.push({'$sort': {"Questions.rating": 1}});
            // Group by unique user ids thus creating array of ratings with extra field as length of array of ratings 
            aggregateArgument.push({'$group':{_id:"$_id",ratings:{'$push':"$Questions.rating"},length:{'$sum':1}}});
            /*
                Calculating median
                if ratings.length is not even (means if length is odd)
                    medain = ratings [(ratings.length - 1) / 2]
                else 
                    median = (ratings[ratings.length/2] + ratings[(ratings.length/2) - 1])/2;
            */
            aggregateArgument.push({'$addFields':{median:{'$cond':{'if':{'$ne':[{'$mod':["$length",2]},0]},'then':{'$arrayElemAt':["$ratings",{'$divide':[{'$subtract':["$length",1]},2]}]},'else':{'$divide':[{'$sum':[{'$arrayElemAt':["$ratings",{'$divide':["$length",2]}]},{'$arrayElemAt':["$ratings",{'$subtract':[{'$divide':["$length",2]},1]}]}]},2]}}}}});
        } else { 
            // In other operations like mean or variance we do not need sorting thus optimizing using direct projection without sorting and grouping
            aggregateArgument.push({'$project':{_id:"$_id",ratings:"$Questions.rating",length:{'$size':"$Questions"}}});
        }

        if(statisticOperations.mean || statisticOperations.variance) {
            statisticOperations.mean && (projection['mean'] = true);
            // We need mean in case of variance as well
            aggregateArgument.push({'$addFields':{mean:{'$avg':"$ratings"}}});
        }

        if(statisticOperations.variance) {
            projection['variance'] = true;
            /*
                Calculating variance
                if ratings.length > 1
                    variance = Square root of {Σ(rating - meanRating)(Square)}/(rating.length - 1)
                else 
                    variance = 0
            */
            aggregateArgument.push({'$addFields':{variance:{'$cond':{'if':{'$gt':["$length",1]},'then':{'$sqrt':{'$divide':[{'$reduce':{input:{'$map':{input:"$ratings",as:"rating",in:{'$pow':[{'$subtract':["$$rating","$mean"]},2]}}},initialValue:0,in:{'$add':["$$value","$$this"]}}},{'$subtract':["$length",1]}]}},'else':0}}}});
        }

        logger.debug(JSON.stringify(aggregateArgument));

        return User.aggregate(aggregateArgument).project(projection).exec();
    }
    
    static isValidFilterKey(key) {

        if(!_.isString(key) || _.isEmpty(key)) {
            return false;
        }
        return true;

    }

    static isValidFilterValue(value) {

        if(_.isUndefined(value) || _.isNull(value) || _.isNaN(value) || (_.isObject(value) && !_.isArray(value))) {
            return false;
        }

        return true;

    }
}

export default DBUtility;
