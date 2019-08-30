
module.exports = (sequelize, DataTypes) => {
  const CompanySize = sequelize.define('CompanySize', {
    label: { type: DataTypes.STRING, allowNull: false }
  }, {});
  CompanySize.associate = (models) => {
    CompanySize.hasMany(models.Company, {
      foriegnKey: 'companySizeId',
      as: 'companies',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return CompanySize;
};
