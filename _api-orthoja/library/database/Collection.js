import Mongo from 'mongodb';
import { CommonError, CODE } from '../error';
import { Logger } from '../logger';

const LOG = Logger.get();

/**
 * Class definition of a collection wrapper for Mongo `Collection` objects.
 * Instances should be generated within a [Database]{@link module:Database.Database} class.
 * @memberof module:Database.Database
 */
class Collection {

    /**
     * Constructs the wrapper for a Mongo Collection instance.
     * @param {Mongo.Collection} collection
     * @param {string} name The name of the collection.
     * @throws {CollectionError}
     */
    constructor(collection) {
        if(!(collection instanceof Mongo.Collection)) {
            throw new CollectionError('Instance must be of a MongoDB Collection.');
        }
        this.mongoCollection = collection;
        this.mongoName = collection.s.name;
    }

    /**
     * Creates a new document entry into the collection.
     * @param {Object} document The object to insert as a document.
     */
    createDocument(properties) {
        return new Promise((resolve, reject) => {
            this.mongoCollection.insertOne(properties).then(
                (result) => {
                    console.log('DOCUMENT', result);
                    LOG.debug('Inserted new document into "%s".', this.mongoName);
                    resolve();
                },
                (error) => {
                    LOG.error(
                        'Failed to insert new document into "%s".\n\rReason: %s\n\rDocument...\n\r%o', 
                        this.mongoName, 
                        error.message,
                        properties
                    );
                    reject(CODE.DOCUMENT_INVALID);
                }
            );
        });
    }

    findDocument(query) {
        return new Promise((resolve, reject) => {
            this.mongoCollection.findOne().then(
                (result) => {
                    resolve(result);
                },
                (error) => {
                    LOG.error(
                        'Failed to query document on "%s".\n\rReason: %s\n\rQuery...\n\r%o', 
                        this.mongoName, 
                        error.message,
                        query
                    )
                    reject(error);
                }
            )
        })
    }
}

// ================================================================================
// ERROR TYPES
// ------------------------------------------------------------
/**
 * @typedef {CollectionError}
 */
class CollectionError extends CommonError {
    constructor(...parameters) {
        super(...parameters);
        this.name = CollectionError.name;
    }
}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default Collection