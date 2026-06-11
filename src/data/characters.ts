import helloKittyImg from '../assets/characters/hello-kitty.png';
import myMelodyImg from '../assets/characters/my-melody.png';
import cinnamorollImg from '../assets/characters/cinnamoroll.png';
import kuromiImg from '../assets/characters/kuromi.png';
import keroppiImg from '../assets/characters/keroppi.png';
import pochaccoImg from '../assets/characters/pochacco.png';
import tuxedoSamImg from '../assets/characters/tuxedo-sam.png';
import chococatImg from '../assets/characters/chococat.png';

export type Character = {
  id: string;
  name: string;
  image: string;
  accent: string;
};

export const characters: Character[] = [
  { id: 'hello-kitty',  name: 'Hello Kitty',  image: helloKittyImg,  accent: '#FF6B8A' },
  { id: 'my-melody',    name: 'My Melody',    image: myMelodyImg,    accent: '#D4507A' },
  { id: 'cinnamoroll',  name: 'Cinnamoroll',  image: cinnamorollImg, accent: '#4A9FD8' },
  { id: 'kuromi',       name: 'Kuromi',       image: kuromiImg,      accent: '#7A5CAF' },
  { id: 'keroppi',      name: 'Keroppi',      image: keroppiImg,     accent: '#4EAA52' },
  { id: 'pochacco',     name: 'Pochacco',     image: pochaccoImg,    accent: '#888888' },
  { id: 'tuxedo-sam',   name: 'Tuxedo Sam',   image: tuxedoSamImg,   accent: '#3A6FD8' },
  { id: 'chococat',     name: 'Chococat',     image: chococatImg,    accent: '#7A5A3A' },
];
