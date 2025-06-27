const db = require('../database');

const runTransaction = (operations) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          return reject(err);
        }

        const executeOperations = async () => {
          try {
            const results = [];
            for (const operation of operations) {
              const result = await new Promise((opResolve, opReject) => {
                if (operation.type === 'run') {
                  db.run(operation.sql, operation.params || [], function(err) {
                    if (err) return opReject(err);
                    opResolve({ lastID: this.lastID, changes: this.changes });
                  });
                } else if (operation.type === 'get') {
                  db.get(operation.sql, operation.params || [], (err, row) => {
                    if (err) return opReject(err);
                    opResolve(row);
                  });
                } else if (operation.type === 'all') {
                  db.all(operation.sql, operation.params || [], (err, rows) => {
                    if (err) return opReject(err);
                    opResolve(rows);
                  });
                }
              });
              results.push(result);
            }
            return results;
          } catch (error) {
            throw error;
          }
        };

        executeOperations()
          .then((results) => {
            db.run('COMMIT', (err) => {
              if (err) {
                return reject(err);
              }
              resolve(results);
            });
          })
          .catch((error) => {
            db.run('ROLLBACK', (rollbackErr) => {
              if (rollbackErr) {
                console.error('Rollback error:', rollbackErr);
              }
              reject(error);
            });
          });
      });
    });
  });
};

module.exports = { runTransaction };