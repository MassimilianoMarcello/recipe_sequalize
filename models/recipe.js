const createRecipe = (sequelize, DataTypes) => {
    const Recipe = sequelize.define('recipe', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        ingredients: {
            type: DataTypes.TEXT,
            allowNull: false // Puoi anche considerare di utilizzare un array di ingredienti se il tuo database lo supporta
        },

        img: {
            type: DataTypes.STRING,
            allowNull: true // L'immagine può essere facoltativa
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users', // Assicurati che il nome della tabella corrisponda
                key: 'id'
            }
        }
    });

    return Recipe;
};

export default createRecipe;

