import Collection from '../Collection';

/**
 * Methods for managing the "doctors" collection for the OrthojaDatabase class.
 * @class DoctorsCollection
 * @memberof module:Database.OrthojaDatabase
 */
class DoctorsCollection extends Collection {

    /**
     * Constructor for the collection.
     * @param {Mongo.Db} database MongoDB Database instance.
     */
    constructor(collection){
        super(collection);
    }

}