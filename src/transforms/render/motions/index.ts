import transformMountImport from './transformMountImport';
import transformShallowImport from './transformShallowImport';
import transformToRender from './transformToRender';

const motions = [transformMountImport, transformShallowImport, transformToRender];

export default motions;
