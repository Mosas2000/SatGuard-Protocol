const {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
} = require("@stacks/transactions");
const { StacksMainnet } = require("@stacks/network");
const fs = require("fs");
const path = require("path");

// Contract list - all 31 new SatGuard contracts
const contracts = [
  "sg-config",
  "sg-reputation",
  "sg-risk-tiers",
  "sg-price-feed",
  "sg-treasury",
  "sg-staking-core",
  "sg-gov-proposals",
  "sg-gov-voting",
  "sg-coverage-types",
  "sg-referral",
  "sg-emergency",
  "sg-kyc-registry",
  "sg-blacklist",
  "sg-badges",
  "sg-loyalty",
  "sg-leaderboard",
  "sg-fee-engine",
  "sg-premium-calc",
  "sg-policy-registry",
  "sg-reserve-fund",
  "sg-rewards-pool",
  "sg-oracle-registry",
  "sg-coverage-limits",
  "sg-risk-calc",
  "sg-timelock",
  "sg-quorum",
  "sg-user-stats",
  "sg-pool-boost",
  "sg-multisig",
  "sg-event-log",
  "sg-staking-rewards",
];

const MNEMONIC =
  "bread shift morning sense elegant aerobic obey anxiety minor taste remember physical antenna label plastic duck ostrich amount bonus decline kidney infant gospel rally";

const network = new StacksMainnet();

async function getContractSize(name) {
  const filePath = path.join(__dirname, "..", "contracts", `${name}.clar`);
  const source = fs.readFileSync(filePath, "utf8");
  return { name, source, bytes: Buffer.byteLength(source, "utf8") };
}

async function estimateCosts() {
  console.log("\\n=== SatGuard Contract Deployment Cost Estimate ===\\n");

  let totalBytes = 0;
  const details = [];

  for (const name of contracts) {
    const info = await getContractSize(name);
    totalBytes += info.bytes;
    details.push(info);
    console.log(`  ${name.padEnd(25)} ${info.bytes.toString().padStart(6)} bytes`);
  }

  // Stacks deployment cost: fee is configurable, ~5000 uSTX (0.005 STX) per contract is typical
  const feePerContract = 0.005; // 5000 uSTX
  const totalCost = contracts.length * feePerContract;

  console.log(`\\n  ${"TOTAL".padEnd(25)} ${totalBytes.toString().padStart(6)} bytes`);
  console.log(`  Contracts: ${contracts.length}`);
  console.log(`  Estimated cost: ~${totalCost.toFixed(4)} STX`);
  console.log(
    `  Budget remaining: ~${(0.5 - totalCost).toFixed(4)} STX\\n`
  );

  if (totalCost > 0.5) {
    console.log("  ⚠️  WARNING: Estimated cost exceeds 0.5 STX budget!");
  } else {
    console.log("  ✅ Within 0.5 STX budget");
  }

  return details;
}

async function deployContract(name, source, nonce) {
  const { generateWallet } = require("@stacks/wallet-sdk");
  const wallet = await generateWallet({
    secretKey: MNEMONIC,
    password: "",
  });
  const account = wallet.accounts[0];

  const txOptions = {
    contractName: name,
    codeBody: source,
    senderKey: account.stxPrivateKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 5000, // 0.005 STX per contract
    nonce,
  };

  const transaction = await makeContractDeploy(txOptions);
  const result = await broadcastTransaction(transaction, network);

  return result;
}

async function deployAll() {
  const details = await estimateCosts();

  const args = process.argv.slice(2);
  if (!args.includes("--deploy")) {
    console.log('\\nRun with --deploy flag to actually deploy contracts.');
    console.log("Example: node deploy-new-contracts.js --deploy\\n");
    return;
  }

  console.log("\\n=== Starting Deployment ===\\n");

  let nonce = parseInt(args.find((a) => a.startsWith("--nonce="))?.split("=")[1] || "0");
  if (nonce === 0) {
    console.log("Please provide starting nonce: --nonce=<number>");
    console.log("Check your nonce at: https://api.mainnet.hiro.so/v2/accounts/<your-address>");
    return;
  }

  let deployed = 0;
  let failed = 0;

  for (const info of details) {
    try {
      console.log(`Deploying ${info.name}... (nonce: ${nonce})`);
      const result = await deployContract(info.name, info.source, nonce);

      if (result.error) {
        console.log(`  ❌ Failed: ${result.reason}`);
        failed++;
      } else {
        console.log(`  ✅ TX: ${result.txid}`);
        deployed++;
        nonce++;
      }

      // Small delay between deployments
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}`);
      failed++;
    }
  }

  console.log(`\\n=== Deployment Complete ===`);
  console.log(`  Deployed: ${deployed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${contracts.length}\\n`);
}

deployAll().catch(console.error);
