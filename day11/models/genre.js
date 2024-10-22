module.exports = (sequelize, DataTypes) => {
    const Genre = sequelize.define("Genre", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Genre.associate = (models) => {
      Genre.belongsToMany(models.Movie, { through: models.GenreMovie, foreignKey: 'genre_id' });
    };
  
    return Genre;
  };
  