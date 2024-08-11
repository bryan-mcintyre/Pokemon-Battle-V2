class PokemonData {
    constructor(pokemon, balanceLevel = 0) {
        this.name = this.capitalizeName(pokemon.name);
        this.picture = pokemon.sprites.other[`official-artwork`].front_default;
        this.alive = true;
        this.favorite = false;
        this.experience = 0;
        this.attack = pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat;
        this.current_hp = pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat;
        this.max_hp = pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat;
        this.defense = pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat;
        this.speed = pokemon.stats.find(stat => stat.stat.name === 'speed').base_stat;
        this.level = 1;
        if (balanceLevel > 0) {
            this.balanceStats(balanceLevel);
        }
    }

    capitalizeName(name) {
        if (!name) return '';

        return name
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join('-');
    }

    balanceStats(pokemonLevel) {
        if (pokemonLevel > 1) {
            const randomChange = Math.floor(Math.random() * 3) - 1; // random -1 0 1
            const newLevel = pokemonLevel + randomChange
            for (let i = 1; i < newLevel; i++) {
                this.levelUp();
            }
            return newLevel;
        }
        return pokemonLevel;
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
        return {
            name: this.name,
            picture: this.picture,
            alive: this.alive,
            favorite: this.favorite,
            experience: this.experience,
            attack: this.attack,
            current_hp: this.current_hp,
            max_hp: this.max_hp,
            defense: this.defense,
            speed: this.speed,
            level: this.level
        };
    }
}

// find pokemon by name
const fetchPokemonByName = async (name) => {
    const nameLowerCase = name.toLowerCase();
    const pokeApi = `https://pokeapi.co/api/v2/pokemon/${nameLowerCase}`;

    try {
        const response = await fetch(pokeApi);
        const data = await response.json();
        const pokemon = new PokemonData(data);

        return pokemon.toModelFormat();
    } catch (e) {
        console.error('Error fetching Pokémon by name:', e);
    }
};

const fetchBalancedPokemonByName = async (name, level) => {
    const nameLowerCase = name.toLowerCase();
    const pokeApi = `https://pokeapi.co/api/v2/pokemon/${nameLowerCase}`;

    try {
        const response = await fetch(pokeApi);
        const data = await response.json();
        const pokemon = new PokemonData(data, level);

        return pokemon.toModelFormat();
    } catch (e) {
        console.error('Error fetching Pokémon by name:', e);
    }
};

// fetch random pokemon
const fetchRandomPokemon = async () => {
    // Generate random indexes
    const randomId = Math.floor(Math.random() * 1302);
    const pokeApi = `https://pokeapi.co/api/v2/pokemon?limit=1500`;

    try {
        const response = await fetch(pokeApi);
        const data = await response.json();

        const pokemonName = data.results[randomId].name;

        const pokemonData = await fetchPokemonByName(pokemonName);
        return pokemonData;
    } catch (error) {
        console.error('Error fetching random Pokémon data:', error);
    }
};

module.exports = { PokemonData, fetchPokemonByName, fetchRandomPokemon, fetchBalancedPokemonByName }