const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Backpack extends Model {
    checkValue(price) {
        return price < this.value;
    };

    async deleteUsedItem(item_id) {
        const item = await Backpack.findOne({ where: { item_id: this.item_id } });
        if (item.count > 1) {
            item.count -= 1;
            await item.save();
        } else {
            await Backpack.destroy(
                { where: { user_id: this.user_id, id: item_id } });
                console.log(`You used all your items`)
        }
    };
}


Backpack.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        item_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'item',
                key: 'id',
            },
            onDelete: 'CASCADE',
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'backpack',
    }
);

module.exports = Backpack;
