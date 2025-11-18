import NavigationData from 'data/navigation.json';

import { Logger } from '@cohbrgr/utils';

/**
 * NavigationService
 */
class NavigationService {
    readonly navigation: typeof NavigationData;
    constructor() {
        this.navigation = NavigationData;
    }

    /**
     * Returns values from Navigation Service
     *
     * @param key
     */
    get(): typeof NavigationData {
        Logger.debug(`[Navigation SERVICE] get()`);
        return this.navigation;
    }
}

export default new NavigationService();
