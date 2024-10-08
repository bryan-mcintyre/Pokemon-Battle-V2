const ATTACK = 'attack';
const DEFENSE = 'defense';
const HP = 'hp';

class BattlePokemon {
    constructor(pokemonData) {
        this.id = pokemonData.id || null;
        this.name = pokemonData.name;
        this.picture = pokemonData.picture;
        this.alive = pokemonData.alive;
        this.favorite = pokemonData.favorite;
        this.level = pokemonData.level || 1;
        this.experience = pokemonData.experience || 0;
        this.attack = pokemonData.attack;
        this.current_hp = pokemonData.current_hp;
        this.max_hp = pokemonData.max_hp;
        this.defense = pokemonData.defense;
        this.speed = pokemonData.speed;
        this.abilities = pokemonData.abilities || [];
    }

    balanceStats(pokemonLevel) {
        if (pokemonLevel > 1) {
            const randomChange = Math.floor(Math.random() * 3) - 1; // random -1 0 1
            const newLevel = pokemonLevel + randomChange
            for (let i = 1; i < newLevel; i++) {
                this.levelUp();
            }
        }
    }

    attackOpponent(opponent) {
        const damage = Math.round(Math.max(this.attack - (opponent.defense / 2), 1));
        opponent.current_hp = Math.round(Math.max(opponent.current_hp - damage, 0));

        if (opponent.current_hp <= 0) {
            opponent.current_hp = 0;
            opponent.alive = false;
        }

        console.log(`${this.name} attacked ${opponent.name} for ${damage} damage!`);
    }

    levelUp() {
        if (this.level < 10) {
            this.level += 1;
            this.attack += 7;
            this.current_hp += 10;
            this.max_hp += 10;
            this.defense += 5;
            this.speed += 3;
        }
    }

    triggerAbility() {
        // loop array and increase stat based on ability effect
        for (let i = 0; i < this.abilities.length; i++) {
            switch (this.abilities[i].effect_type) {
                case ATTACK:
                    this.attack += this.abilities[i].effect_amount;
                    break;
                case DEFENSE:
                    this.defense += this.abilities[i].effect_amount;
                    break;
                case HP:
                    this.current_hp += this.abilities[i].effect_amount;
                    break;
                default:
                    break;
            }
        }
    }

    resetAbility() {
        for (let i = 0; i < this.abilities.length; i++) {
            switch (this.abilities[i].effect_type) {
                case ATTACK:
                    this.attack -= this.abilities[i].effect_amount;
                    break;
                case DEFENSE:
                    this.defense -= this.abilities[i].effect_amount;
                    break;
                case HP:
                    if (this.current_hp > this.max_hp) {
                        this.current_hp = this.max_hp;
                    }
                    break;
                default:
                    break;
            }
        }
    }

    toModelFormat() {
        const formattedAbilitiesId = this.abilities.map(ability => {
            return {
                id: ability.id
            }
        })
        return {
            id: this.id,
            name: this.name,
            picture: this.picture,
            alive: this.alive,
            favorite: this.favorite,
            level: this.level,
            experience: this.experience,
            attack: this.attack,
            current_hp: this.current_hp,
            max_hp: this.max_hp,
            defense: this.defense,
            speed: this.speed,
            abilityId: formattedAbilitiesId
        };
    }

    isAlive() {
        return this.alive
    }
}

module.exports = BattlePokemon;