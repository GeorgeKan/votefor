var {selectResults} = require('./../../models/selectResults');

var saveSelectResutls = (forelementid, selectvalue) => {
    var newsaveselectrslt = new selectResults({
        forelementid,
        selectvalue,
        selectsum: 0
    });
    newsaveselectrslt.save();
};
module.exports = {saveSelectResutls};