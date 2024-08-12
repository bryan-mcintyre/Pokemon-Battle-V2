const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const PokemonLevel = require('./PokemonLevel');
const PokemonStats = require('./PokemonStats');

class Pokemon extends Model {
    //Search for which item is using, check for type and effect amount, and check for user id
    async useItem(effect_type, effect_amount) {
        const pokemonStats = await PokemonStats.findOne({ where: { pokemon_id: this.id } });
        // Define item effect 
        const effectType = effect_type;
        const effectAmount = effect_amount;
        console.log(`Tipo de efecto: ${effectType} Cantidad: ${effectAmount}`)
        // Call item_effect 
        switch (effectType) {
            case "heal":
                const currentHP = pokemonStats.current_hp;
                const maxHP = pokemonStats.max_hp;
                const restoreHP = currentHP + effectAmount;
                const healing = Math.min(restoreHP,maxHP)

                if (pokemonStats.current_hp >= maxHP) {
                    console.log('Cannot exceed Max HP');
                    return { status: false, message: 'Cannot exceed Max HP'};
                } else {
                    await PokemonStats.update(
                        { current_hp: healing },
                        { where: { pokemon_id: this.id } }
                    );
                    console.log("Heal works");
                }
                break;
            case "revive":
                if (!this.alive) {
                    await PokemonStats.update(
                        { current_hp: pokemonStats.max_hp / 2 },
                        { where: { pokemon_id: this.id } }
                    );
                    await Pokemon.update(
                        { alive: true },
                        { where: { id: this.id } }
                    );
                    console.log("Revive Works")
                } else { 
                    return { status: false, message: 'Cannot apply to alive Pokemon'}; }
                break;
            case "catch":
                await Pokemon.update(
                    { user_id: this.user_id },
                    { where: { id: this.id } }
                );
                console.log("Catch works")
                break;

        }
       
        return { status: true, message: 'Item used' };
    };

    async getBattleData() {

        // get stats pokemon
        const pokemonStats = await PokemonStats.findOne({ where: { pokemon_id: this.id } });

        // get abilities
        const abilities = await this.getAbilities({
            attributes: ['id', 'name', 'description', 'effect_type', 'effect_amount'],
            joinTableAttributes: [],
        });

        // get format ability array object
        const formattedAbilities = abilities.map(ability => {
            return {
                id: ability.id,
                name: ability.name,
                description: ability.description,
                effect_type: ability.effect_type,
                effect_amount: ability.effect_amount,
            };
        });

        return {
            id: this.id,
            name: this.name,
            picture: this.picture,
            alive: this.alive,
            favorite: this.favorite,
            level: this.level,
            experience: this.experience,
            attack: pokemonStats.attack,
            current_hp: pokemonStats.current_hp,
            max_hp: pokemonStats.max_hp,
            defense: pokemonStats.defense,
            speed: pokemonStats.speed,
            abilities: formattedAbilities,
        };
    }
}

Pokemon.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        picture: {
            type: DataTypes.TEXT,
        },
        alive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        favorite: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
            defaultValue: 1,
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
            defaultValue: 0,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        pokemon_level_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'pokemon_level',
                key: 'id',
            }
        },
    },
    {
        hooks: {
            beforeSave: async (pokemon) => {

                // get max lvl from pokemonLevel model
                const maxLevel = await PokemonLevel.max('level');

                // get current level pokemon
                const currentLevel = pokemon.level;

                // check current lvl >= max level
                if (currentLevel >= maxLevel) {

                    // if yes, then pokemon.exp = max value experience
                    const levelData = await PokemonLevel.findOne({ where: { level: currentLevel } });
                    pokemon.experience = levelData.experience;
                    pokemon.pokemon_level_id = maxLevel.id;
                    return;
                }

                // get next level from pokemon lvl
                const nextLevel = await PokemonLevel.findOne({
                    where: {
                        level: currentLevel + 1,
                    },
                });

                // check we have nextLevel and experience pokemon > nextLevel experience
                if (nextLevel && pokemon.experience >= nextLevel.experience) {

                    pokemon.level = nextLevel.level;
                    pokemon.pokemon_level_id = nextLevel.id;
                    if (pokemon.level === maxLevel) {
                        pokemon.pokemon_level_id = nextLevel.id;
                        pokemon.experience = nextLevel.experience;
                    }
                }
            },
            beforeCreate: async (pokemon) => {
                if (pokemon.level > 1) {
                    const levelData = await PokemonLevel.findOne({ where: { level: pokemon.level } });
                    pokemon.experience = levelData.experience;
                    pokemon.pokemon_level_id = levelData.id;
                }
            }
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'pokemon',
    }
);

module.exports = Pokemon;
