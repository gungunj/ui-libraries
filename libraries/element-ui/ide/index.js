import genEntityBlocks from './blocks/entity/index';

import genEnumBlocks from './blocks/enum/index';

export const blocks = [...genEntityBlocks, ...genEnumBlocks];
