const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// 选举
const ElectionMapper = sequelize.define('elections', {
  election_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  stat: DataTypes.TINYINT.UNSIGNED,
  created_at: DataTypes.TIME,
  updated_at: DataTypes.TIME,
}, {
  timestamps: false,
});

// 候选人
const CondidateMapper = sequelize.define('condidates', {
  condidate_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  election_id: DataTypes.INTEGER.UNSIGNED,
  name: DataTypes.STRING(16),
  created_at: DataTypes.TIME,
}, {
  timestamps: false,
});

// 选票
const VotesMapper = sequelize.define('votes', {
  vote_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  elector_id: DataTypes.CHAR(10),
  elector_email: DataTypes.STRING(64),
  condidate_id: DataTypes.INTEGER,
  created_at: DataTypes.TIME,
}, {
  timestamps: false,
});

module.exports = {
  ElectionMapper,
  CondidateMapper,
  VotesMapper,
};
