import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

// Test data constants
const testPool = {
    coverageType: 'Exchange Hack Protection',
    minContribution: 100000, // 0.1 sBTC in micro-units
    maxCoverage: 1000000 // 1 sBTC in micro-units
};

Clarinet.test({
    name: "Test suite initialization - verify test environment",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        // Verify test environment is ready
        assertEquals(chain.blockHeight, 0);
        assertEquals(accounts.size > 0, true);
    }
});

Clarinet.test({
    name: "Successfully create insurance pool with valid parameters",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall(
                'insurance-pool',
                'create-pool',
                [
                    types.ascii(testPool.coverageType),
                    types.uint(testPool.minContribution),
                    types.uint(testPool.maxCoverage)
                ],
                deployer.address
            )
        ]);

        block.receipts[0].result.expectOk().expectUint(1);
        assertEquals(block.receipts[0].events.length > 0, true);
    }
});

Clarinet.test({
    name: "Reject pool creation with zero min contribution",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall(
                'insurance-pool',
                'create-pool',
                [
                    types.ascii('Invalid Pool'),
                    types.uint(0), // Invalid: zero min contribution
                    types.uint(1000000)
                ],
                deployer.address
            )
        ]);

        block.receipts[0].result.expectErr().expectUint(103); // err-invalid-amount
    }
});

Clarinet.test({
    name: "Reject pool creation with zero max coverage",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall(
                'insurance-pool',
                'create-pool',
                [
                    types.ascii('Invalid Pool'),
                    types.uint(100000),
                    types.uint(0) // Invalid: zero max coverage
                ],
                deployer.address
            )
        ]);

        block.receipts[0].result.expectErr().expectUint(103); // err-invalid-amount
    }
});

Clarinet.test({
    name: "Get pool details after creation",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall(
                'insurance-pool',
                'create-pool',
                [
                    types.ascii(testPool.coverageType),
                    types.uint(testPool.minContribution),
                    types.uint(testPool.maxCoverage)
                ],
                deployer.address
            )
        ]);

        let poolId = block.receipts[0].result.expectOk();

        let pool = chain.callReadOnlyFn(
            'insurance-pool',
            'get-pool',
            [types.uint(1)],
            deployer.address
        );

        let poolData = pool.result.expectSome().expectTuple();
        assertEquals(poolData['total-funds'], types.uint(0));
        assertEquals(poolData['status'], types.uint(1)); // POOL-STATUS-ACTIVE
        assertEquals(poolData['contributor-count'], types.uint(0));
    }
});

Clarinet.test({
    name: "Get pool count increases with each pool created",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall(
                'insurance-pool',
                'create-pool',
                [types.ascii('Pool 1'), types.uint(100000), types.uint(1000000)],
                deployer.address
            ),
            Tx.contractCall(
                'insurance-pool',
                'create-pool',
                [types.ascii('Pool 2'), types.uint(200000), types.uint(2000000)],
                deployer.address
            )
        ]);

        let poolCount = chain.callReadOnlyFn(
            'insurance-pool',
            'get-pool-count',
            [],
            deployer.address
        );

        poolCount.result.expectUint(2);
    }
});

// Contribution flow tests
Clarinet.test({
    name: "Successfully contribute to pool",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;

        // Create pool
        let setupBlock = chain.mineBlock([
            Tx.contractCall(
                'insurance-pool',
                'create-pool',
                [
                    types.ascii(testPool.coverageType),
                    types.uint(testPool.minContribution),
                    types.uint(testPool.maxCoverage)
                ],
                deployer.address
            )
        ]);

        // Contribute to pool
        let contributionBlock = chain.mineBlock([
            Tx.contractCall(
                'insurance-pool',
                'contribute-to-pool',
                [
                    types.uint(1),
                    types.uint(200000) // 0.2 sBTC
                ],
                alice.address
            )
        ]);

        contributionBlock.receipts[0].result.expectOk().expectBool(true);
    }
});

Clarinet.test({
    name: "Reject contribution below minimum",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;

        // Create pool
        let setupBlock = chain.mineBlock([
            Tx.contractCall(
                'insurance-pool',
                'create-pool',
                [
                    types.ascii(testPool.coverageType),
                    types.uint(testPool.minContribution),
                    types.uint(testPool.maxCoverage)
                ],
                deployer.address
            )
        ]);

        // Try to contribute less than minimum
        let contributionBlock = chain.mineBlock([
            Tx.contractCall(
                'insurance-pool',
                'contribute-to-pool',
                [
                    types.uint(1),
                    types.uint(50000) // Less than min contribution
                ],
                alice.address
            )
        ]);

        contributionBlock.receipts[0].result.expectErr().expectUint(103); // err-invalid-amount
    }
});

Clarinet.test({
    name: "Track multiple contributors correctly",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;
        const bob = accounts.get('wallet_2')!;

        // Create pool
        let setupBlock = chain.mineBlock([
            Tx.contractCall(
                'insurance-pool',
                'create-pool',
                [
                    types.ascii(testPool.coverageType),
                    types.uint(testPool.minContribution),
                    types.uint(testPool.maxCoverage)
                ],
                deployer.address
            )
        ]);

        // Multiple contributions
        let contributionBlock = chain.mineBlock([
            Tx.contractCall('insurance-pool', 'contribute-to-pool',
                [types.uint(1), types.uint(200000)], alice.address),
            Tx.contractCall('insurance-pool', 'contribute-to-pool',
                [types.uint(1), types.uint(300000)], bob.address)
        ]);

        // Verify pool total funds
        let pool = chain.callReadOnlyFn(
            'insurance-pool',
            'get-pool',
            [types.uint(1)],
            deployer.address
        );

        let poolData = pool.result.expectSome().expectTuple();
        assertEquals(poolData['total-funds'], types.uint(500000));
        assertEquals(poolData['contributor-count'], types.uint(2));
    }
});

Clarinet.test({
    name: "Reject contribution to non-existent pool",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;

        let contributionBlock = chain.mineBlock([
            Tx.contractCall(
                'insurance-pool',
                'contribute-to-pool',
                [types.uint(999), types.uint(200000)],
                alice.address
            )
        ]);

        contributionBlock.receipts[0].result.expectErr().expectUint(101); // err-not-found
    }
});

Clarinet.test({
    name: "Update contributor amount on multiple contributions",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;

        // Create pool
        let setupBlock = chain.mineBlock([
            Tx.contractCall(
                'insurance-pool',
                'create-pool',
                [types.ascii(testPool.coverageType), types.uint(testPool.minContribution),
                types.uint(testPool.maxCoverage)],
                deployer.address
            )
        ]);

        // First contribution
        let firstContribution = chain.mineBlock([
            Tx.contractCall('insurance-pool', 'contribute-to-pool',
                [types.uint(1), types.uint(200000)], alice.address)
        ]);

        // Second contribution from same user
        let secondContribution = chain.mineBlock([
            Tx.contractCall('insurance-pool', 'contribute-to-pool',
                [types.uint(1), types.uint(150000)], alice.address)
        ]);

        // Check contribution total
        let contribution = chain.callReadOnlyFn(
            'insurance-pool',
            'get-contribution',
            [types.uint(1), types.principal(alice.address)],
            deployer.address
        );

        let contributionData = contribution.result.expectSome().expectTuple();
        assertEquals(contributionData['amount'], types.uint(350000)); // 200000 + 150000
    }
});
