class BattlePokemon {
    constructor(pokemonData) {
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
                this.levelUp()
            }
        }
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

    toModelFormat() {
        const formattedAbilitiesId = this.abilities.map(ability => {
            return {
                id: ability.id
            }
        })
        return {
            name: this.name,
            picture: this.picture,
            alive: this.alivepicture,
            favorite: this.favoritepicture,
            level: this.levelpicture,
            experience: this.experiencepicture,
            attack: this.attackpicture,
            current_hp: this.current_hppicture,
            max_hp: this.max_hppicture,
            defense: this.defensepicture,
            speed: this.speedpicture,
            abilityId: formattedAbilitiesId
        };
    }
}

module.exports = BattlePokemon;