class PokemonData {
    constructor(pokemon) {
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
    }

    capitalizeName(name) {
        if (!name) return '';

        return name
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join('-');
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
            speed: this.speed
        };
    }
}

// find pokemon by name
const fetchPokemonByName = async (name) => {
    const pokeApi = `https://pokeapi.co/api/v2/pokemon/${name}`;

    try {
        const response = await fetch(pokeApi);
        const data = await response.json();
        const pokemon = new PokemonData(data);

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

module.exports = { PokemonData, fetchPokemonByName, fetchRandomPokemon }