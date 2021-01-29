const QueryFile = require('pg-promise')().QueryFile;

const sql = file => new QueryFile(`${__dirname}/${file}`, {
  minify: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development'
});

module.exports = {
  /*
      Sorted by alphabet, please maintain it that way
   */
  admin: {
    findByEmail: sql('admin/findByEmail.sql')
  },
  composition: {
    findByEnsembleID: sql('composition/findByEnsembleID.sql'),
    findByIDs: sql('composition/findByIDs.sql'),
    findByName: sql('composition/findByName.sql'),
    findByPlateID: sql('composition/findByPlateID.sql'),
  },
  ensemble: {
    create: sql('ensemble/create.sql'),
    findByIDs: sql('ensemble/findByIDs.sql'),
    findByName: sql('ensemble/findByName.sql'),
    update: sql('ensemble/update.sql'),
  },
  image: {
    insert: sql('image/insert.sql')
  },
  musician: {
    findByEnsembleID: sql('musician/findByEnsembleID.sql'),
    findByID: sql('musician/findByID.sql'),
    findByName: sql('musician/findByName.sql'),
    insert: sql('musician/insert.sql'),
    updateImage: sql('musician/updateImage.sql'),
  },
  plate: {
    addCompositionByName: sql('plate/addCompositionByName.sql'),
    buy: sql('plate/buy.sql'),
    create: sql('plate/create.sql'),
    deleteCompositionFromPlateByID: sql('plate/deleteCompositionFromPlateByID.sql'),
    findByEnsembleID: sql('plate/findByEnsembleID.sql'),
    findByIDs: sql('plate/findByIDs.sql'),
    findByName: sql('plate/findByName.sql'),
    update: sql('plate/update.sql'),
  }
};

