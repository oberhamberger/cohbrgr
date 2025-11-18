import navigationJson from 'data/navigation.json';

import navigationService from './navigation.service';

jest.mock('data/navigation.json', () => ({
    hero: {
        nodes: [
            {
                id: 'hero-github',
                labelKey: 'hero.nav.github',
                path: 'https://github.com/oberhamberger',
                external: true,
            },
            {
                id: 'hero-bluesky',
                labelKey: 'hero.nav.bluesky',
                path: 'https://bsky.app/profile/cohbrgr.bsky.social',
                external: true,
            },
            {
                id: 'hero-linkedin',
                labelKey: 'hero.nav.linkedin',
                path: 'https://www.linkedin.com/in/oberhamberger/',
                external: true,
            },
        ],
    },
    offline: {
        nodes: [
            {
                id: 'offline-refresh',
                labelKey: 'offline.nav.refresh',
                path: '',
            },
        ],
    },
    'not-found': {
        nodes: [
            {
                id: 'notfound-back',
                labelKey: 'notfound.nav.back',
                path: '/',
            },
        ],
    },
}));

describe('NavigationService', () => {
    it('should be defined', () => {
        expect(navigationService).toBeDefined();
    });

    describe('get', () => {
        it('should return the navigation data', () => {
            expect(navigationService.get()).toEqual(navigationJson);
        });
    });

    describe('getSubNavigation', () => {
        it('should return the sub-navigation for a given node ID', () => {
            const subNavigation = navigationService.getSubNavigation('hero');
            expect(subNavigation).toEqual(navigationJson.hero.nodes);
        });

        it('should return undefined if the node is not found', () => {
            const subNavigation =
                navigationService.getSubNavigation('non-existent-node');
            expect(subNavigation).toBeUndefined();
        });
    });
});
