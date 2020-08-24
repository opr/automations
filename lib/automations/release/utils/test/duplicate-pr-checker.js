const duplicateChecker = require( '../duplicate-pr-checker' );
const payload = require( '@testFixtures/payloads/create.json' );

describe( 'check-for-duplicate-pull', () => {
	let context, octokit;

	beforeEach( () => {
		context = {
			payload,
		};
		octokit = {
			search: {
				issuesAndPullRequests: jest.fn( () => {
					return Promise.resolve( {
						data: { total_count: 0, items: [] },
					} );
				} ),
			},
		};
	} );

	it( 'returns undefined if no duplicate pull request is found', async () => {
		const actual = await duplicateChecker( context, octokit, 'hello' );
		expect( actual ).toBe( undefined );
	} );
	it( 'returns the pull request if a duplicate is found in existing pulls', async () => {
		// add the pull
		const mock = {
			data: { total_count: 1, items: [ { title: 'hello' } ] },
		};
		octokit.search.issuesAndPullRequests.mockReturnValueOnce( mock );
		const actual = await duplicateChecker( context, octokit, 'hello' );
		expect( actual ).toBe( mock.data.items[ 0 ] );
	} );
} );