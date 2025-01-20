
rs.initiate();


db = db.getSiblingDB("admin");
db.createUser({
    user: "root",
    pwd: "securepassword",
    roles: [{ role: "root", db: "admin" }]
});


db = db.getSiblingDB("referral_db");
db.createUser({
    user: "app_user",
    pwd: "securepassword",
    roles: [{ role: "readWrite", db: "referral_db" }]
});
