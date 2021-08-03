const { Sequelize } = require("sequelize");
const { User } = require("./models/User");

const sequelize = new Sequelize("db", "", undefined, {
  dialect: "sqlite",
  storage: "db.sqlite",
  logging: false,
});

User.init(
  {
    nonce: {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: () => Math.floor(Math.random() * 1000000),
    },
    publicAddress: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
      validate: { isLowercase: true },
    },
  },
  { sequelize, modelName: "user" }
);

sequelize.sync();

module.exports = { sequelize };
