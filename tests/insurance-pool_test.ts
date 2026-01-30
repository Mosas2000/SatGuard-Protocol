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
