// Creates a least-privilege application user for the fitvibe database.
// Runs once, on first initialization of the mongo data volume.
const appUser = process.env.MONGO_APP_USER;
const appPassword = process.env.MONGO_APP_PASSWORD;

if (appUser && appPassword) {
  const fitvibe = db.getSiblingDB('fitvibe');
  fitvibe.createUser({
    user: appUser,
    pwd: appPassword,
    roles: [{ role: 'readWrite', db: 'fitvibe' }],
  });
}
