import navigationJson from 'data/navigation.json';

import { Logger } from '@cohbrgr/utils';

interface NavigationNode {
    id: string; // Unique identifier for the node
    labelKey: string; // Key for translation lookup
    path: string; // URL path for the link
    external?: boolean; // Indicates if the link is external
}

interface NavigationData {
    [key: string]: {
        nodes: NavigationNode[];
    };
}

/**
 * NavigationService
 */
class NavigationService {
    private readonly navigation: NavigationData;

    constructor() {
        this.navigation = navigationJson as NavigationData;
    }

    /**
     * Returns values from Navigation Service
     *
     * @param key
     */
    get(): NavigationData {
        Logger.debug(`[Navigation SERVICE] get()`);
        return this.navigation;
    }

    /**
     * Returns the sub-navigation for a given node ID.
     * @param nodeId The ID of the node to find children for.
     * @returns An array of navigation nodes, or undefined if the node is not found or has no children.
     */
    getSubNavigation(nodeId: string): NavigationNode[] | undefined {
        Logger.debug(
            `[Navigation SERVICE] getSubNavigation(nodeId: ${nodeId})`,
        );
        const subNavigationNodes = this.navigation[nodeId];
        if (subNavigationNodes) {
            return subNavigationNodes.nodes;
        }

        return undefined;
    }
}

export default new NavigationService();
