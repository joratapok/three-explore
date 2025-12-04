export interface ISourceTypes {
  name: string;
  type: 'texture' | 'gltfModel' | 'cubeTexture';
  path: string | string[];
}

export const sources: ISourceTypes[] = [
  {
    name: 'dayTexture',
    type: 'texture',
    path: 'earth/day.jpg',
  },
  {
    name: 'nightTexture',
    type: 'texture',
    path: 'earth/night.jpg',
  },
  {
    name: 'specularTexture',
    type: 'texture',
    path: 'earth/specularClouds.jpg',
  },
];
